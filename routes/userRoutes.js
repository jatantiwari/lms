const express = require('express');
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { userSchema, updateUserSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/', [auth, checkRole(['admin'])], getAllUsers);
router.post('/', [auth, checkRole(['admin']), validate(userSchema)], createUser);
router.put('/:id', [auth, checkRole(['admin']), validate(updateUserSchema)], updateUser);
router.delete('/:id', [auth, checkRole(['admin'])], deleteUser);

module.exports = router; 