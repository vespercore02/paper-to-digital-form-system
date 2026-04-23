require('dotenv').config();

const { connectDB } = require('./config/db');
const db = require('./models');
const { hashPassword } = require('./utils/password');
const ROLES = require('./constants/roles');

const seedAdmin = async () => {
  try {
    await connectDB();
    await db.sequelize.sync();

    const existingAdmin = await db.User.findOne({
      where: { email: 'admin@formbridge.local' },
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const password_hash = await hashPassword('Admin123!');

    await db.User.create({
      first_name: 'Form',
      last_name: 'Admin',
      email: 'admin@formbridge.local',
      password_hash,
      role: ROLES.SUPER_ADMIN,
      is_active: true,
    });

    console.log('Admin user created');
    console.log('Email: admin@formbridge.local');
    console.log('Password: Admin123!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedAdmin();