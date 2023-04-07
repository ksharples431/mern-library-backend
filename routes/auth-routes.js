const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth-controller');

////////// POST //////////
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
  authController.signupUser
);
router.post('/login', authController.loginUser);

module.exports = router;
