/* 

Generic functions to avoid repetitive code on controller files

*/

const catcher = require('../error/catcher');
const Err = require('../error/class');
const Querier = require('./querier');
const successResponse = require('./successResponse');

exports.deleteOne = (Model) =>
  catcher(async (req, res, next) => {
    const requestedDocument = await Model.findByIdAndDelete(req.params.id);

    if (!requestedDocument) {
      return next(new Err('Invalid document ID', 404));
    }

    successResponse('Document deleted.', 204, res);
  });

exports.updateOne = (Model) =>
  catcher(async (req, res, next) => {
    const requestedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!requestedDocument) {
      return next(new Err('Invalid document ID', 404));
    }

    successResponse(requestedDocument, 200, res);
  });

exports.createOne = (Model) =>
  catcher(async (req, res, next) => {
    if (!req.body.book) req.body.book = req.params.bookId;
    if (!req.body.user) req.body.user = req.user.id;

    const requestedDocument = await Model.create(req.body);

    successResponse(requestedDocument, 201, res);
  });

exports.getOne = (Model, popOptions) =>
  catcher(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const requestedDocument = await query;

    if (!requestedDocument) {
      return next(new Err('Invalid document ID', 404));
    }

    successResponse(requestedDocument, 200, res);
  });

exports.getQuery = (Model) =>
  catcher(async (req, res, next) => {
    let filter = {};
    if (req.params.bookId) filter = { book: req.params.bookId };

    const query = new Querier(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const requestedQuery = await query.responseQuery;

    res.status(200).json({
      status: 'success',
      results: requestedQuery.length,
      data: {
        data: requestedQuery,
      },
    });
  });
