const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  const { username, email, password, birthday } = req.body;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    email,
    // image,
    // fix this with file upload
    // image: req.file.path
    birthday,
    // library: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signup failed, please try again.', 500);
    return next(error);
  }
  let token;
  try {
    /// try just sending whoe existing user
    token = jwt.sign(
      // { userId: createdUser.id, email: createdUser.email},
      { user: createdUser.id },
      'process.env.SECRET_KEY',
      { expiresIn: '7d' }
    );
  } catch (err) {
    const error = new HttpError('Signup failed, please try again.', 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      user: createdUser.id,
      token: token,
    });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

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

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      // { userId: existingUser.id, email: existingUser.email, user: existingUser },
      { user: existingUser.id },
      'process.env.SECRET_KEY',
      { expiresIn: '7d' }
    );
  } catch (err) {
    const error = new HttpError('Login failed, please try again.', 500);
    return next(error);
  }

  res.json({
    message: 'Logged in.',
    // userId: existingUser.id,
    // email: existingUser.email,
    user: existingUser.id,
    token: token,
  });
};

exports.signupUser = signupUser;
exports.loginUser = loginUser;
