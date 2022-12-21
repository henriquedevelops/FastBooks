const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/book');
const Review = require('../models/review');
const User = require('../models/user');

dotenv.config({ path: './config.env' });

const DATABASE = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DATABASE, {}).then(() => console.log('Connected to database'));
const books = JSON.parse(fs.readFileSync(`./data-sample/books.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`./data-sample/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`./data-sample/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Book.create(books);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Book.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
