const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

////////// POST //////////
const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // come back and add variables based on model
  const { username, email, password, image, birthday } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signup failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User already exists, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password,
    email,
    image,
    birthday,
    library: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError('Signup failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const {  email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Login failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  res.json({ message: 'Logged in.', user: existingUser });
};

exports.signupUser = signupUser;
exports.loginUser = loginUser;