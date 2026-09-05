import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import Booking from './models/Booking.js';

dotenv.config();

const migrateBookingIndexes = async () => {
  try {
    console.log('\n----------------------------------------');
    console.log('BARWAL BOOKING DATABASE MIGRATION');
    console.log('----------------------------------------\n');

    await connectDB();

    console.log('✓ MongoDB connected');

    // -----------------------------------------
    // 1. Add venue to old bookings
    // -----------------------------------------

    const oldBookings = await Booking.countDocuments({
      venue: { $exists: false },
    });

    console.log(`Old bookings without venue: ${oldBookings}`);

    if (oldBookings > 0) {
      const result = await Booking.updateMany(
        {
          venue: { $exists: false },
        },
        {
          $set: {
            venue: 'box-cricket',
          },
        }
      );

      console.log(
        `✓ Updated ${result.modifiedCount} old booking(s) to BOX CRICKET`
      );
    } else {
      console.log('✓ No old bookings need venue update');
    }

    // -----------------------------------------
    // 2. Show current indexes
    // -----------------------------------------

    const indexesBefore = await Booking.collection.indexes();

    console.log('\nCurrent indexes:');

    indexesBefore.forEach((index) => {
      console.log(`- ${index.name}`);
    });

    // -----------------------------------------
    // 3. Remove old date + slot unique index
    // -----------------------------------------

    const oldIndex = indexesBefore.find(
      (index) =>
        index.key &&
        index.key.date === 1 &&
        index.key.slot === 1 &&
        Object.keys(index.key).length === 2
    );

    if (oldIndex) {
      await Booking.collection.dropIndex(oldIndex.name);

      console.log(
        `✓ Removed old index: ${oldIndex.name}`
      );
    } else {
      console.log('✓ Old date + slot index not found');
    }

    // -----------------------------------------
    // 4. Remove old venue index if migration
    //    was previously partially completed
    // -----------------------------------------

    const indexesAfterDrop = await Booking.collection.indexes();

    const correctIndexExists = indexesAfterDrop.some(
      (index) =>
        index.key &&
        index.key.venue === 1 &&
        index.key.date === 1 &&
        index.key.slot === 1
    );

    if (!correctIndexExists) {
      await Booking.collection.createIndex(
        {
          venue: 1,
          date: 1,
          slot: 1,
        },
        {
          unique: true,
          partialFilterExpression: {
            status: 'confirmed',
          },
        }
      );

      console.log(
        '✓ Created new venue + date + slot unique index'
      );
    } else {
      console.log(
        '✓ Correct venue + date + slot index already exists'
      );
    }

    // -----------------------------------------
    // 5. Verify indexes
    // -----------------------------------------

    const finalIndexes = await Booking.collection.indexes();

    console.log('\nFinal indexes:');

    finalIndexes.forEach((index) => {
      console.log(
        `- ${index.name}`,
        JSON.stringify(index.key)
      );
    });

    console.log('\n----------------------------------------');
    console.log('✓ MIGRATION COMPLETED SUCCESSFULLY');
    console.log('----------------------------------------\n');

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error('\n✕ MIGRATION FAILED');
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

migrateBookingIndexes();