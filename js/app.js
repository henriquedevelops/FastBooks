const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/user');
const reviewsRouter = require('./routes/review');
const errorHandler = require('./error/handler');
const Err = require('./error/class');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Set up views with pug template
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP (max 100 per hour)
app.use(
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Please try again later!',
  })
);

// Adding timestamp on request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'genre',
      'price',
    ],
  })
);

// Routes
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);

// Handling invalid URL requests
app.all('*', (req, res, next) => {
  next(new Err(`Can't find URL ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
