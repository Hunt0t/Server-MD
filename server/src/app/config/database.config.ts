import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';


/**
 * Function to establish a connection to the MongoDB database
 * - It supports both production and development environments
 * - Seeds the database with initial data after a successful connection
 */
export async function databaseConnecting() {
  try {
  
    // Check if the production database URI is available
    if (config.mongo_prod as object | undefined) {
      // Connect to the production MongoDB database
      await mongoose.connect(`${config.mongo_uri_prod}`, {
        useNewUrlParser: true, // Ensures compatibility with the MongoDB driver
        useUnifiedTopology: true, // Enables the new connection management engine
        serverSelectionTimeoutMS: 1000, // Timeout for selecting a MongoDB server
      } as ConnectOptions);

      console.log('Database      :🚀 Connected to database (Production)');
    } else {
      // If production URI is not provided, connect to the development database
      await mongoose.connect(config.mongo_uri_dev as string);

      console.log('Database      :🚀 Connected to database (Development)');
    }
  } catch (error) {
    // Log any errors that occur during the database connection attempt
    console.error('Database      :🙄 Error connecting to the database');
  }
}
