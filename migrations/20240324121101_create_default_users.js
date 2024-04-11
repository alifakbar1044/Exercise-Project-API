const logger = require('../src/core/logger')('api');
const { User } = require('../src/models');
const { hashPassword, comparePasswords } = require('../src/utils/password'); // Import juga fungsi comparePasswords

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';

const confirmPassword = '123456'; // Ganti dengan proses pengambilan input dari pengguna

logger.info('Creating default users');

(async () => {
  try {
    const numUsers = await User.countDocuments({
      name,
      email,
    });

    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }

    // Proses konfirmasi password
    if (password !== confirmPassword) {
      throw new Error('Konfirmasi password tidak cocok');
    }

    const hashedPassword = await hashPassword(password);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
