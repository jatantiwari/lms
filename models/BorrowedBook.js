const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Book = require('./Book');

const BorrowedBook = sequelize.define('BorrowedBook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: Book,
      key: 'id',
    },
    allowNull: false,
  },
  librarianId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  borrowDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned'),
    defaultValue: 'borrowed',
  }
});

// Define relationships
BorrowedBook.belongsTo(User, { as: 'user', foreignKey: 'userId' });
BorrowedBook.belongsTo(User, { as: 'librarian', foreignKey: 'librarianId' });
BorrowedBook.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = BorrowedBook; 