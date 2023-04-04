const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  myBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UsersBooks' }],
});

module.exports = mongoose.model('User', userSchema);