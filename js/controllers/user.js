const catcher = require('../error/catcher');
const Err = require('../error/class');
const User = require('../models/user');
const successResponse = require('../utils/successResponse');
const bcrypt = require('bcryptjs');
const operator = require('../utils/operator');

/* 

None of the functions in this file will work for password related data.

Password related data changes and signup available only on authentication 
controller file.

*/

exports.getOne = operator.getOne(User);
exports.getQuery = operator.getQuery(User);

// Filter out fields that are not allowed to be updated
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/* Set the user ID to request params ID so that he can get information
about his account through the getMyAccount route */
exports.setUserId = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

// Update data related to the account logged in (for clients)
exports.updateMyAccount = catcher(async (req, res, next) => {
  if (!req.body.password) {
    return next(new Err('Insert your password.', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new Err('Wrong password.', 401));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  successResponse(updatedUser, 200, res);
});

// Delete logged in account (for users)
exports.deleteMyAccount = catcher(async (req, res, next) => {
  if (!req.body.password) {
    return next(new Err('Insert your password.', 400));
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new Err('Wrong password.', 401));
  }

  await User.findByIdAndRemove(req.user.id);

  successResponse({ message: 'Account succesfully deleted.' }, 200, res);
});

exports.updateById = catcher(async (req, res, next) => {});
