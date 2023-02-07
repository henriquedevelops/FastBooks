const express = require('express');
const router = express.Router();
const book = require('../controllers/book');
const auth = require('../controllers/auth');
const reviewRouter = require('./review');

router.route('/').get(book.getQuery);

/* Nested route to redirect request to review's router 
(Get all reviews from a specified book) */
router.use('/:bookId/reviews', reviewRouter);

router.use(auth.requireLogin); // Protect all routes below this line

// Main route (All books)
router.route('/').post(auth.restrictToAdmin, book.createOne);

// Specific book route
router
  .route('/:id')
  .get(book.getOne)
  .patch(auth.restrictToAdmin, book.updateOne)
  .delete(auth.restrictToAdmin, book.deleteOne);

module.exports = router;
