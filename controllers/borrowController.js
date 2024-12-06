const Book = require('../models/Book');
const BorrowedBook = require('../models/BorrowedBook');
const { sequelize } = require('../config/database');

const borrowBook = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await Book.findByPk(bookId, { transaction: t });
    if (!book || book.availableQuantity < 1) {
      await t.rollback();
      return res.status(400).json({ message: 'Book not available' });
    }

    await book.update(
      { availableQuantity: book.availableQuantity - 1 },
      { transaction: t }
    );

    await BorrowedBook.create(
      {
        userId,
        bookId,
        status: 'borrowed',
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to borrow book' });
  }
};

const returnBook = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

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
    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Failed to return book' });
  }
};

const getBorrowingHistory = async (req, res) => {
  try {
    const where = req.user.role === 'member' ? { userId: req.user.id } : {};
    const borrowings = await BorrowedBook.findAll({
      where,
      include: [Book],
    });
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch borrowing history' });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getBorrowingHistory,
}; 