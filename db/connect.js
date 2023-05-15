import mongoose from "mongoose";

// Connects us to the url
const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;
