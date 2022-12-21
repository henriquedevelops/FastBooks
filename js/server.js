const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config({ path: './config.env' });

// Insert password into database URL
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// Connect to database
mongoose
  .connect(DB, {})
  .then(() => console.log('Connected to database.'))
  .catch((e) => console.log(e));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
