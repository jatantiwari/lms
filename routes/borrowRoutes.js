const express = require('express');
const {
  borrowBook,
  returnBook,
  getBorrowingHistory,
} = require('../controllers/borrowController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.post('/:bookId', [auth, checkRole(['member'])], borrowBook);
router.post('/return/:bookId', [auth, checkRole(['member'])], returnBook);
router.get('/history', auth, getBorrowingHistory);

module.exports = router; 