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
// const updateUser = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const userId = req.params.id;
//   const { username, email } = req.body;

//   const updatedUser = { ...DUMMY_DATA.find((u) => u.id === userId) };
//   const userIndex = DUMMY_DATA.findIndex((u) => u.id === userId);
//   updatedUser.username = username;
//   updatedUser.email = email;

//   DUMMY_DATA[userIndex] = updatedUser;

//   res.status(200).json({ user: updatedUser });
// };

////////// DELETE //////////
const deleteUser = (req, res, next) => {
  const userId = req.params.id;
  if (!DUMMY_DATA.find((u) => u.id === userId)) {
    return next(new HttpError('Could not find a user for that id.', 404));
  }
  DUMMY_DATA = DUMMY_DATA.filter((u) => u.id !== userId);

  res.status(200).json({ message: 'User deleted.' });
};

exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
// exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

