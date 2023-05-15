import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    // Validation function built-in from mongoose
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    // User can only set up an email that is not already in use
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6,
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "My City",
  },
});

export default mongoose.model("User", UserSchema);
