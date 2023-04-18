const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Book = require('../models/book');

////////// GET //////////
const getAllBooks = async (req, res, next) => {
  let books;
  try {
    books = await Book.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find books.',
      500
    );
    return next(error);
  }
  res.status(200).json(books);
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;
  let book;

  try {
    book = await Book.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find book.',
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      'Could not find a book for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ book: book.toObject({ getters: true }) });
};

////////// POST //////////
const createBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {
    title,
    author,
    image,
    description,
    genre,
    series,
    seriesNumber,
  } = req.body;

  const createdBook = new Book({
    title,
    author,
    image,
    description,
    genre,
    series,
    seriesNumber,
  });

  try {
    await createdBook.save();
  } catch (err) {
    const error = new HttpError(
      'Creating book failed, please try again.',
      500
    );
    return next(error);
  }
  // find out why no toObject here from Max or change back if necessary
  res.status(201).json({ book: createdBook.toObject({ getters: true }) });
  // res.status(201).json({ book: createdBook });
};

////////// PATCH //////////
const updateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const bookId = req.params.bid;
  const {
    title,
    author,
    image,
    description,
    genre,
    series,
    seriesNumber,
  } = req.body;
  let updatedBook;

  try {
    updatedBook = await Book.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find book.',
      500
    );
    return next(error);
  }

  updatedBook.title = title;
  updatedBook.author = author;
  updatedBook.image = image;
  updatedBook.description = description;
  updatedBook.genre = genre;
  updatedBook.series = series;
  updatedBook.seriesNumber = seriesNumber;

  try {
    await updatedBook.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update book.',
      500
    );
    return next(error);
  }

  res
    .status(200)
    // Do I need toObject or getters: true here or just for new instance
    .json({ updatedBook: updatedBook.toObject({ getters: true }) });
};

////////// DELETE //////////
const deleteBook = async (req, res, next) => {
  let book;
  try {
    book = await Book.findOneAndRemove({ id: req.params.bid });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete books.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: `${book.title} deleted.` });
};

exports.getAllBooks = getAllBooks;
exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
