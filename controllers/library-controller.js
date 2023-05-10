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
};

const getLibraryByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let books;

  try {
    books = await Library.find({ user: userId });
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

    // To only return the ids
    //res.json({ library: library.toObject({ getters: true }) });
  });
};

////////// POST //////////
const addToLibrary = async (req, res, next) => {
  const { uid, bid } = req.params;
  console.log(uid, bid)
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
    book: bid
  });

  console.log(addedBook)

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

  res.status(201).json({ library: addedBook.toObject({ getters: true }) });
};

////////// PATCH //////////
// const updateLibraryBook = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const { uid, bid } = req.params;
//   const { que, owned, read, type, availability } = req.body;
//   let updatedBook;

//   try {
//     updatedBook = await Library.findOne({ user: uid, book: bid });
//   } catch (err) {
//     const error = new HttpError(
//       'Adding book failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   if (!updatedBook) {
//     const error = new HttpError('Could not find a book by that id.', 404);
//     return next(error);
//   }

//   updatedBook.que = que;
//   updatedBook.owned = owned;
//   updatedBook.read = read;
//   updatedBook.type = type;
//   updatedBook.availability = availability;

//   try {
//     await updatedBook.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not update book.',
//       500
//     );
//     return next(error);
//   }

//   res
//     .status(200)
//     // Do I need toObject or getters: true here or just for new instance
//     .json({ updatedBook: updatedBook.toObject({ getters: true }) });
// };

////////// DELETE //////////
const deleteLibraryBook = async (req, res, next) => {
  const { uid, bid } = req.params;
  let book;

  try {
    book = await Library.findOne({ user: uid, book: bid });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not remove book from library.',
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError('Could not find a book by that id.', 404);
    return next(error);
  }

  try {
    await book.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not remove book from library.',
      500
    );
    return next(error);
  }

  try {
    await User.findOneAndUpdate(
      { id: req.params.uid },
      {
        $pull: { library: book._id },
      }
    );
  } catch (err) {
    const error = new HttpError(
      'Removing book from users library failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Book removed from library.' });
};

exports.getLibrary = getLibrary;
exports.getLibraryByUser = getLibraryByUser;
exports.addToLibrary = addToLibrary;
// exports.updateLibraryBook = updateLibraryBook;
exports.deleteLibraryBook = deleteLibraryBook;
