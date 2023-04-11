const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

////////// GET //////////
const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

////////// PATCH //////////
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const userId = req.params.uid;
  const { username, email, image, birthday } = req.body;
  let updatedUser;

  try {
    updatedUser = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user.',
      500
    );
    return next(error);
  }

  updatedUser.username = username;
  updatedUser.email = email;
  updatedUser.image = image;
  updatedUser.birthday = birthday;

  try {
    await updatedUser.save();
  } catch(err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  
  res
    .status(200)
    // Do I need toObject or getters: true here or just for new instance
    .json({ updatedUser: updatedUser.toObject({ getters: true }) });
};

////////// DELETE //////////
const deleteUser = async (req, res, next) => {
 let user;
  try {
    user = await User.findOneAndRemove({ _id: req.params.uid });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `{user.username} deleted.` });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

