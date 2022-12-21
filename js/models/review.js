const mongoose = require('mongoose');
const Book = require('./book');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate review from the same user on the same book
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate linked user document as a property of the review
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

/* Create additional properties on each book containing quantity and
average of reviews  */
reviewSchema.statics.calcAverageRatings = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: stats[0].ratingsQuantity,
      ratingsAverage: stats[0].ratingsAverage,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsQuantity: 0,
      ratingsAverage: null,
    });
  }
};

/* Update average and quantity of reviews when new review is created */
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.book);
});

/* Update average and quantity of reviews when a review is updated or deleted */
reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.book);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
