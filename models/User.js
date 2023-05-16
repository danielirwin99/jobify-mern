import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

// .pre --> Before
// Our Hashed password functionality
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Our JWT functionality
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Compares this two passwords through the bcrypt .compare function
// .comparePassword --> Can be any name you want
// candidatePassword --> The original one, this.password --> the one you just entered (confirmation)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatching = await bcrypt.compare(candidatePassword, this.password);
  return isMatching;
};

export default mongoose.model("User", UserSchema);
