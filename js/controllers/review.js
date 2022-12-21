const Review = require('./../models/review');
const operator = require('../utils/operator');

exports.getQuery = operator.getQuery(Review);
exports.getOne = operator.getOne(Review);
exports.createOne = operator.createOne(Review);
exports.updateOne = operator.updateOne(Review);
exports.deleteOne = operator.deleteOne(Review);
