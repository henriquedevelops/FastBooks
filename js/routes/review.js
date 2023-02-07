const express = require('express');
const auth = require('../controllers/auth');
const review = require('../controllers/review');
const router = express.Router({ mergeParams: true });

router.use(auth.requireLogin); // Protect all routes below this line

router.route('/').get(review.getQuery).post(review.createOne);

/* Get all reviews from a specific book available through
the nested route in the book route file */

router
  .route('/:id')
  .get(review.getOne)
  .patch(review.updateOne)
  .delete(review.deleteOne);

router
  .route('/:id')
  .get(review.getOne)
  .patch(review.updateOne)
  .delete(review.deleteOne);

module.exports = router;
