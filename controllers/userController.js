const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generatePassword } = require('../utils/passwordGenerator');
const { sendCredentials } = require('../utils/emailService');

const createUser = async (req, res) => {
  try {
    const { name, email, role, phoneNumber } = req.body;
    
    const password = generatePassword(name, email, phoneNumber);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      isActive: true,
    });

    await sendCredentials(email, email, password);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(req.body);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
}; 