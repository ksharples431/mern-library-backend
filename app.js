const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const bookRoutes = require('./routes/book-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
  .connect(
    'mongodb+srv://ksharples431:ivCd61JwvrYbQkCC@cluster0.ndsk45p.mongodb.net/mern-library?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
