const Book = require('../models/book');
const operator = require('../utils/operator');

exports.createOne = operator.createOne(Book);
exports.updateOne = operator.updateOne(Book);
exports.getOne = operator.getOne(Book, { path: 'reviews' });
exports.getQuery = operator.getQuery(Book);
exports.deleteOne = operator.deleteOne(Book);
