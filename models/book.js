const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  image: String,
  description: String,
  genre: String,
  series: String,
  seriesNumber: String,
});

module.exports = mongoose.model('Book', bookSchema);