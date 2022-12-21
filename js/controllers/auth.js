const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const sendEmail = require('../utils/email');
const Err = require('../error/class');
const catcher = require('../error/catcher');
const successResponse = require('../utils/successResponse');

/* 

Authentication using JSON Web Token

*/

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // (expires in 90 days from now)
    httpOnly: true, // in order to prevent cross-site scripting attacks
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  successResponse(user, statusCode, res, token);
};

// Create new user and log him in
exports.signUp = catcher(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

// Check credentials and log user in
exports.login = catcher(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Err('Invalid email or password', 401));
  }

  createSendToken(user, 200, res);
});

// Check if user is logged in before granting access to protected routes
exports.requireLogin = catcher(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new Err('Login required', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new Err('Login Required', 401));
  }

  req.user = currentUser;

  next();
});

// Send a reset forgotten password token to user's email
exports.forgotPassword = catcher(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Invalid user.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  const message = `Link to reset your FastBooks password: ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    return next(
      new Err('There was an error sending the email. Try again later.'),
      500
    );
  }
});

// Reset user's forgotten password using the token he received on his email
exports.resetPassword = catcher(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Err('Token is invalid or has expired', 400));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateModifiedOnly: true });

  createSendToken(user, 200, res);
});

// Change password (without having forgotten)
exports.updateMyPassword = catcher(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new Err('Wrong password.', 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save({ validateModifiedOnly: true });

  createSendToken(user, 200, res);
});

// Restrict certain routes to admin only
exports.restrictToAdmin = (req, res, next) => {
  if (req.user.role != 'admin') return next(new Err('Permission denied.'));

  next();
};
