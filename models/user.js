const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 7 },
  email: { type: String, required: true, unique: true },
  image: String,
  birthday: Date,
  library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Library' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);