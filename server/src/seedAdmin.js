import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@barwal.com';
    const password = 'Barwal@2026';

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const admin = await Admin.findOneAndUpdate(
      { email },
      {
        name: 'Barwal Admin',
        email,
        password: hashedPassword,
        role: 'admin',
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log('Admin account ready.');
    console.log(`Email: ${admin.email}`);
    console.log('Password: Barwal@2026');

    process.exit(0);
  } catch (error) {
    console.error(
      'Admin reset failed:',
      error.message
    );

    process.exit(1);
  }
};

resetAdmin();