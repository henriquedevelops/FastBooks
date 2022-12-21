module.exports = (data, statusCode, res, token) => {
  if (token) {
    res.status(statusCode).json({
      status: 'success',
      token,
      data,
    });
  } else {
    res.status(statusCode).json({
      status: 'success',
      data,
    });
  }
};
