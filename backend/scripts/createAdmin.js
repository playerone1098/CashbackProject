const bcrypt = require('bcryptjs');
const postgresDb = require('../db/postgres');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await postgresDb.connectPostgres();

    let admin = await User.findOne({ email: 'admin@cashback.com' });

    if (admin) {
      admin.password = 'admin123';
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user already existed - password updated to admin123');
    } else {
      admin = new User({
        username: 'admin',
        email: 'admin@cashback.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        }
      });
      await admin.save();
      console.log('Admin user created successfully!');
    }

    console.log('=== ADMIN CREDENTIALS ===');
    console.log('Email: admin@cashback.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    if (postgresDb.getPool()) {
      await postgresDb.getPool().end();
    }
    process.exit(0);
  }
};

createAdmin();
