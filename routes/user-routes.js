const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user-controller');

// Get
router.get('/', userController.getAllUsers);
router.get('/:uid', userController.getUserById);

// Post
router.post(
  '/signup',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    check(
      'username',
      'Username may not contain non alphanumeric characters'
    ).isAlphanumeric(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
      .isLength({ min: 7 }),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid')
      .normalizeEmail()
      .isEmail(),
  ],
  userController.signupUser
);
router.post('/login', userController.loginUser);
router.post('/:uid/books/:bid', userController.addToLibrary)

// Patch
router.patch(
  '/:id',
  [
    check('username', 'Username must be at least 5 characters').isLength({
      min: 5,
    }),
    check(
      'username',
      'Username may not contain non alphanumeric characters'
    ).isAlphanumeric(),
    check('email', 'Email does not appear to be valid')
      .normalizeEmail()
      .isEmail(),
  ],
  userController.updateUser
);

// Delete
router.delete('/:id', userController.deleteUser);
router.delete('/:uid/books/:bid', userController.deleteFromLibrary);

module.exports = router;
