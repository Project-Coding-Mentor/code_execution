import mongoose from 'mongoose';

const MONGODB_URI = process.env.userdata;

if(!MONGODB_URI) {
  throw new Error('mongo db not defined');
}

async function connectToDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  }
  const opts={
    bufferCommands: false,
  }
  await mongoose.connect(MONGODB_URI as string, opts);
  return mongoose;
}

export default connectToDB;