const express = require('express');
const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
} = require('../controllers/bookController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { bookSchema, updateBookSchema } = require('../validations/bookValidation');

const router = express.Router();

router.get('/', auth, getAllBooks);
router.post('/', [auth, checkRole(['admin']), validate(bookSchema)], addBook);
router.put('/:id', [auth, checkRole(['admin']), validate(updateBookSchema)], updateBook);
router.delete('/:id', [auth, checkRole(['admin'])], deleteBook);

module.exports = router; 