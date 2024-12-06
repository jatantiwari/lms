const express = require('express');
const {
  borrowBook,
  returnBook,
  getBorrowingHistory,
  getAllAvailableBooks,
} = require('../controllers/borrowController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.post('/:userId/borrow/:bookId', [auth, checkRole(['librarian', 'admin'])], borrowBook);
router.post('/:userId/return/:bookId', [auth, checkRole(['librarian', 'admin'])], returnBook);
router.get('/history', auth, getBorrowingHistory);
router.get('/available', auth, getAllAvailableBooks);

module.exports = router; 