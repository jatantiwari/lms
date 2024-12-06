module.exports = (sequelize, DataTypes) => {
  const BorrowedBook = sequelize.define('BorrowedBook', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    borrowDate: {
      type: DataTypes.DATE
    },
    returnDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('borrowed', 'returned'),
      defaultValue: 'borrowed'
    }
  });

  BorrowedBook.associate = (models) => {
    BorrowedBook.belongsTo(models.User, {
      foreignKey: 'userId'  // This will create only one userId column
    });
    BorrowedBook.belongsTo(models.Book, {
      foreignKey: 'bookId'  // This will create only one bookId column
    });
  };

  return BorrowedBook;
}; 