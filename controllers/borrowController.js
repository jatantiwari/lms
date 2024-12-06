const Book = require('../models/Book');
const BorrowedBook = require('../models/BorrowedBook');
const User = require('../models/User');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const borrowBook = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { bookId, userId } = req.params;
    const librarianId = req.user.id;

    // Verify librarian role
    if (req.user.role !== 'librarian' && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ message: 'Only librarians can issue books' });
    }

    // Verify user exists and is active
    const user = await User.findOne({ 
      where: { id: userId, isActive: true }
    });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'User not found or inactive' });
    }

    // Check if user is a member
    if (user.role !== 'member') {      
      await t.rollback();
      return res.status(400).json({ message: 'Only members can borrow books' });
    }

    const book = await Book.findByPk(bookId, { transaction: t });
    if (!book || book.availableQuantity < 1) {
      await t.rollback();
      return res.status(400).json({ message: 'Book not available' });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await BorrowedBook.findOne({
      where: {
        userId,
        bookId,
        status: 'borrowed'
      }
    });

    if (existingBorrow) {
      await t.rollback();
      return res.status(400).json({ message: 'User already has this book borrowed' });
    }

    await book.update(
      { availableQuantity: book.availableQuantity - 1 },
      { transaction: t }
    );

    const borrowedBook = await BorrowedBook.create(
      {
        userId,
        bookId,
        librarianId,
        status: 'borrowed',
        borrowDate: new Date()
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ 
      message: 'Book borrowed successfully',
      data: borrowedBook
    });
  } catch (error) {
    await t.rollback();
    console.error('Borrow error:', error);
    res.status(500).json({ message: 'Failed to borrow book' });
  }
};

const getBorrowingHistory = async (req, res) => {
  try {
    let where = {};
    
    // If user is a member, show only their books
    if (req.user.role === 'member') {
      where.userId = req.user.id;
    }

    const borrowings = await BorrowedBook.findAll({
      where,
      include: [
        {
          model: Book,
          attributes: ['title', 'author', 'isbn']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'librarian',
          attributes: ['name', 'email']
        }
      ],
      order: [['borrowDate', 'DESC']]
    });

    res.json(borrowings);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch borrowing history' });
  }
};

const returnBook = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { bookId, userId } = req.params;
    const librarianId = req.user.id;

    // Verify librarian role
    if (req.user.role !== 'librarian' && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ message: 'Only librarians can process returns' });
    }

    const borrowedBook = await BorrowedBook.findOne({
      where: {
        bookId,
        userId,
        status: 'borrowed',
      },
      transaction: t,
    });

    if (!borrowedBook) {
      await t.rollback();
      return res.status(404).json({ message: 'Borrowed book record not found' });
    }

    const book = await Book.findByPk(bookId, { transaction: t });
    await book.update(
      { availableQuantity: book.availableQuantity + 1 },
      { transaction: t }
    );

    await borrowedBook.update(
      {
        status: 'returned',
        returnDate: new Date(),
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ 
      message: 'Book returned successfully',
      data: borrowedBook
    });
  } catch (error) {
    await t.rollback();
    console.error('Return error:', error);
    res.status(500).json({ message: 'Failed to return book' });
  }
};

const getAllAvailableBooks = async (req, res) => {
  try {
    // Find all books with availableQuantity > 0
    const books = await Book.findAll({
      where: {
        availableQuantity: {
          [Op.gt]: 0  // greater than 0
        }
      },
      attributes: [
        'id',
        'title',
        'author',
        'isbn',
        'quantity',
        'availableQuantity',
        [
          sequelize.literal('(quantity - availableQuantity)'),
          'borrowedCount'
        ]
      ],
      order: [
        ['title', 'ASC']  // Order alphabetically by title
      ]
    });

    // If no books found
    if (!books || books.length === 0) {
      return res.status(404).json({
        status: 'success',
        message: 'No available books found',
        data: []
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Available books retrieved successfully',
      count: books.length,
      data: books
    });

  } catch (error) {
    console.error('Error fetching available books:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch available books',
      error: error.message
    });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getBorrowingHistory,
  getAllAvailableBooks
}; 