const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user-controller');

////////// GET //////////
router.get('/', userController.getAllUsers);
router.get('/:uid', userController.getUserById);

////////// PATCH //////////
// router.patch(
//   '/:id',
//   [
//     check('username', 'Username must be at least 5 characters').isLength({
//       min: 5,
//     }),
//     check(
//       'username',
//       'Username may not contain non alphanumeric characters'
//     ).isAlphanumeric(),
//     check('email', 'Email does not appear to be valid')
//       .normalizeEmail()
//       .isEmail(),
//   ],
//   userController.updateUser
// );

////////// DELETE //////////
router.delete('/:id', userController.deleteUser);

module.exports = router;
