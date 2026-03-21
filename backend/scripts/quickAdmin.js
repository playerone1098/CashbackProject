const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple admin creation without database connection
const createAdminUser = async () => {
  console.log('Creating admin user credentials...');
  console.log('');
  console.log('=== ADMIN CREDENTIALS ===');
  console.log('Email: admin@cashback.com');
  console.log('Password: admin123');
  console.log('Username: admin');
  console.log('');
  console.log('To create this admin user in your database:');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Register a new user at: http://localhost:3000/register');
  console.log('3. Use the credentials above');
  console.log('4. Then update their role to admin in MongoDB:');
  console.log('');
  console.log('   // In MongoDB shell');
  console.log('   use cashback');
  console.log('   db.users.updateOne(');
  console.log('     { email: "admin@cashback.com" },');
  console.log('     { $set: { role: "admin" } }');
  console.log('   );');
  console.log('');
  console.log('Or run: node scripts/createAdmin.js (after MongoDB is running)');
};

createAdminUser();
