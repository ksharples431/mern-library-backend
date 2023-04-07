const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const libraryController = require('../controllers/library-controller');

////////// GET //////////
router.get('/', libraryController.getLibrary);
// router.get('/:uid', libraryController.getLibraryByUser)

////////// POST //////////
router.post('/:uid/:bid', libraryController.addToLibrary);

////////// PATCH //////////
// router.post('/:uid/:bid', libraryController.updateLibraryBook);

////////// DELETE //////////
// router.delete('/:uid/:bid', libraryController.deleteLibraryBook);

module.exports = router;
