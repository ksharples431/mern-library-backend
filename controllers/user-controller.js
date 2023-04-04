const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const UsersBooks = require('../models/users-books');

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_DATA });
};

const getUserById = (req, res, next) => {
  const userId = req.params.id;

  const user = DUMMY_DATA.find((u) => {
    return u.id === userId;
  });

  if (!user) {
    return next(
      new HttpError('Could not find a user for the provided id.', 404)
    );
  }

  res.json({ user });
};

const signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // come back and add variables based on model
  const { username, email, password } = req.body;

  const hasUser = DUMMY_DATA.find((u) => u.email === email);
  if (hasUser) {
    return next(
      new HttpError('Could not create user, email already exists.', 422)
    );
  }

  const createdUser = {
    username,
    email,
    password,
  };

  DUMMY_DATA.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_DATA.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError('Could not identify user for provided email.', 401)
    );
  }

  res.json({ message: 'Logged in.' });
};

const updateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const userId = req.params.id;
  const { username, email } = req.body;

  const updatedUser = { ...DUMMY_DATA.find((u) => u.id === userId) };
  const userIndex = DUMMY_DATA.findIndex((u) => u.id === userId);
  updatedUser.username = username;
  updatedUser.email = email;

  DUMMY_DATA[userIndex] = updatedUser;

  res.status(200).json({ user: updatedUser });
};

const deleteUser = (req, res, next) => {
  const userId = req.params.id;
  if (!DUMMY_DATA.find((u) => u.id === userId)) {
    return next(new HttpError('Could not find a user for that id.', 404));
  }
  DUMMY_DATA = DUMMY_DATA.filter((u) => u.id !== userId);

  res.status(200).json({ message: 'User deleted.' });
};

const addToLibrary = (req, res, next) => {
  Users.findOneAndUpdate(
    { uid: req.params.uid },
    {
      $push: { myBooks: req.params.bid },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

const deleteFromLibrary = (req, res, next) => {
  Users.findOneAndUpdate(
    { uid: req.params.uid },
    { $pull: { myBooks: req.params.bid } },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

const getUserLibrary = async (req, res, next) => {
  const userId = req.params.pid;
  let books;

  try {
    books = await UsersBooks.find({ user: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching books failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!books || books.length === 0) {
    return next(
      new HttpError('Could not find books for the provided user id.', 404)
    );
  }

  res.json({
    books: books.map((book) => book.toObject({ getters: true })),
  });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.addToLibrary = addToLibrary;
exports.deleteFromLibrary = deleteFromLibrary;
exports.getUserLibrary = getUserLibrary;
