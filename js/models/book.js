const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The book must have a name'],
    unique: true,
    trim: true,
    maxlength: [25, 'Name must have less than 25 characters'],
    minlength: [4, 'Name must have at least 4 characters'],
  },
  author: {
    type: String,
    // required: [true, 'Inform author name'],
    trim: true,
    maxlength: [25, 'Name must have less than 25 characters'],
    minlength: [3, 'Name must have at least 3 characters'],
  },
  genre: {
    type: String,
    enum: ['Drama', 'Fiction', 'History', 'Philosophy', 'Romance'],
  },
  writenInYear: {
    type: Number,
    max: [new Date().getFullYear(), 'Year not valid'],
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    //required: [true, 'The book must have a price'],
  },
  image: {
    type: String,
  },
  slug: String,
});

// Index to organize data improve performance when querying
bookSchema.index({ price: 1, ratingsAverage: -1, slug: 1 });

// Virtual populate
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
