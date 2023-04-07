const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LibrarySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  que: Boolean,
  owned: Boolean,
  read: Boolean,
  type: Array,
  availability: Array,
});

module.exports = mongoose.model('Library', LibrarySchema);
