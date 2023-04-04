const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const bookController = require('../controllers/book-controller');

// Get
router.get('/', bookController.getAllBooks);
router.get('/:bid', bookController.getBookById);

// Post
router.post(
  '/',
  [check('title').not().isEmpty(), check('author').not().isEmpty()],
  bookController.createBook
);

// Patch
router.patch(
  '/:bid',
  [check('title').not().isEmpty(), check('author').not().isEmpty()],
  bookController.updateBook
);

// Delete
router.delete('/:bid', bookController.deleteBook);

module.exports = router;
