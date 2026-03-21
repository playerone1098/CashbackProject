const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cashback.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
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
    console.log('Email: admin@cashback.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
