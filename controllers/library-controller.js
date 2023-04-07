const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Book = require('../models/book');
const Library = require('../models/library');

////////// GET //////////
const getLibrary = async (req, res, next) => {
  let library;
  try {
    library = await Library.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update book.',
      500
    );
    return next(error);
  }
  res.status(200).json(library);
}

const getLibraryByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let library;
  let user;

  try {
    user = await User.findById(userId);
    library = user.library
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find library.',
      500
    );
    return next(error);
  }

  if (!library) {
    const error = new HttpError(
      'Could not find a library for the provided user.',
      404
    );
    return next(error);
  }

  res.json({ library: library.toObject({ getters: true }) });
};

////////// POST //////////
const addToLibrary = async (req, res, next) => {
  const { uid, bid } = req.params;
  let addedBook;

  try {
    addedBook = await Library.findOne({ user: uid, book: bid });
  } catch (err) {
    const error = new HttpError(
      'Adding book failed, please try again later.',
      500
    );
    return next(error);
  }

  if (addedBook) {
    const error = new HttpError('Book already in library.', 422);
    return next(error);
  }

  addedBook = new Library({
    user: uid,
    book: bid,
  });

  try {
    await addedBook.save();
  } catch (err) {
    const error = new HttpError(
      'Adding book to library failed, please try again.',
      500
    );
    return next(error);
  }

  try {
    await User.findOneAndUpdate(
      { _id: req.params.uid },
      {
        $push: { library: addedBook._id },
      },
      { new: true }
    );
  } catch (err) {
    const error = new HttpError(
      'Adding book to users library list failed, please try again.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ library: addedBook.toObject({ getters: true }) });
};

// const deleteLibraryBook = (req, res, next) => {
//   Users.findOneAndUpdate(
//     { uid: req.params.uid },
//     { $pull: { myBooks: req.params.bid } },
//     { new: true }
//   )
//     .then((updatedUser) => {
//       res.status(200).json(updatedUser);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// };

// const getUserLibrary = async (req, res, next) => {
//   const userId = req.params.pid;
//   let books;

//   try {
//     books = await UsersBooks.find({ user: userId });
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching books failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   if (!books || books.length === 0) {
//     return next(
//       new HttpError('Could not find books for the provided user id.', 404)
//     );
//   }

//   res.json({
//     books: books.map((book) => book.toObject({ getters: true })),
//   });
// };

exports.getLibrary = getLibrary;
exports.getLibraryByUser = getLibraryByUser;
exports.addToLibrary = addToLibrary;
// exports.updateLibraryBook = updateLibraryBook;
// exports.deleteLibraryBook = deleteLibraryBook;