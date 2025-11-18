import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      console.error('Please create a .env file in the backend directory with MONGODB_URI');
      console.error('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
      process.exit(1);
    }

    // Check if password contains placeholder or is same as username
    const uri = process.env.MONGODB_URI;
    const uriMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
    if (uriMatch) {
      const username = uriMatch[1];
      const password = uriMatch[2];
      if (username === password || password === '<db_password>' || password.includes('PASSWORD') || password.includes('YOUR_PASSWORD')) {
        console.error('');
        console.error('ERROR: Password is incorrect or contains placeholder!');
        console.error('');
        console.error('Current username:', username);
        console.error('The password in your .env file appears to be incorrect or a placeholder.');
        console.error('Please verify your MongoDB Atlas credentials in the .env file.');
        console.error('');
        process.exit(1);
      }
    }

    // Connect to MongoDB
    // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
    // They are no longer needed and will cause warnings
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to application termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    
    // Check if the error is authentication related
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('');
      console.error('AUTHENTICATION ERROR: The password in your .env file is incorrect.');
      console.error('');
      console.error('Please verify:');
      console.error('1. Username and password in MongoDB Atlas match your .env file');
      console.error('2. Network Access is configured to allow your IP address');
      console.error('3. Database user has proper permissions');
      console.error('');
    } else {
      console.error('Please check your MongoDB Atlas connection string and network access settings');
    }
    process.exit(1);
  }
};

// Get database connection status
export const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    status: states[state] || 'unknown',
    readyState: state,
    isConnected: state === 1,
  };
};

export default connectDB;