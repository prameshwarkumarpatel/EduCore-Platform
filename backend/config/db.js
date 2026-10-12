const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sms_db', {
      // options not needed in Mongoose 6+
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Continuing without database connection for UI demonstration purposes...');
    // process.exit(1); // Do not exit to keep the server alive during UI demonstration
  }
};

module.exports = connectDB;
