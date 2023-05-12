const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const bookController = require('../controllers/book-controller');

////////// GET //////////
router.get('/', bookController.getAllBooks);
router.get('/:uid/:bid', bookController.getBookById);

////////// POST //////////
router.post(
  '/',
  [check('title').not().isEmpty(), check('author').not().isEmpty()],
  bookController.createBook
);

////////// PATCH //////////
router.patch(
  '/:bid',
  [check('title').not().isEmpty(), check('author').not().isEmpty()],
  bookController.updateBook
);

////////// DELETE //////////
router.delete('/:bid', bookController.deleteBook);

module.exports = router;
