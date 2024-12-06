const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'librarian', 'member'),
    defaultValue: 'member',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User; 