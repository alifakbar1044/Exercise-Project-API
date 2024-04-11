// Import model User dari file models
const { User } = require('../../../models');
const { hashPassword } = require('../../../utils/password');

// Import repository yang berisi function untuk mengakses basis data
const usersRepository = require('./users-repository');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return await usersRepository.updateUser(id, name, email);
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return await usersRepository.deleteUser(id);
}

// Function untuk mengecek apakah email sudah digunakan
async function isEmailTaken(email) {
  try {
    // Panggil function dari repository untuk melakukan pengecekan di basis data
    const user = await usersRepository.getUserByEmail(email);
    // Jika user ditemukan, kembalikan true
    return user !== null;
  } catch (error) {
    // Tangani kesalahan jika terjadi
    console.error('Error checking email:', error);
    throw error;
  }
}

// Contoh penggunaan function untuk mengecek email
const emailToCheck = 'bian@example.com';
isEmailTaken(emailToCheck)
  .then((emailTaken) => {
    if (emailTaken) {
      console.log('Email is already taken');
    } else {
      console.log('Email is available');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  /**
 * Change user's password
 * @param {string} id - User ID
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @returns {boolean}
 */
async function changeUserPassword(id, oldPassword, newPassword) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  // Check if old password matches
  const isMatch = await comparePasswords(oldPassword, user.password);
  const hashedNewPassword = await hashPassword(newPassword);

  if (!isMatch) {
    return false; 
  }

  try {
    await usersRepository.updatePassword(id, hashedNewPassword);
  } catch (err) {
    return null;
  }

  return  true;
}

const bcrypt = require('bcrypt');

/**
 * Compare passwords
 * @param {string} password - Password to compare
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {boolean} - Returns true if passwords match, false otherwise
 */
async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailTaken,
  changeUserPassword,
};
