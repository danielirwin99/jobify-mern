// CONTROLLER --> Organises all the functionality of registering and logging in + editing user

import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import attachCookies from "../utils/attachCookies.js";

const register = async (req, res) => {
  // Pull through these three credentials
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // This checks all the emails to see if there is already one existing
  const userAlreadyExists = await User.findOne({ email });
  // If there is one existing --> Throw this error
  if (userAlreadyExists) {
    throw new BadRequestError("Email is already in use");
  }

  const user = await User.create({ name, email, password });
  // Invokes our token from JWT
  const token = user.createJWT();

  // Cookie token --> Our function is in the Utils folder
  attachCookies({ res, token });

  // Imported from our http-status-codes library package
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    // Don't need the token after using cookies
    // token,
    location: user.location,
  });
};

const login = async (req, res) => {
  // If i want to login i will need the email and password
  const { password, email } = req.body;

  // If there the email or password is not inputted --> Throw this error
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // Checks the DB to find the email inputted
  // Adding the .select(+password) overrides the UserSchema -> select: false (doesn't show the password)
  // and pulls the password through to verify the login
  const user = await User.findOne({ email }).select("+password");

  // If there is no email / user with those credentials --> Throw this error
  if (!user) {
    throw new UnAuthenticatedError("No user found");
  }
  console.log(user);

  // Compares the password entered to the one in the DB to see if they are the same
  const isPasswordCorrect = await user.comparePassword(password);
  // If they are not show this in the logs
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid password");
  }

  // Creates a unique token
  const token = user.createJWT();

  // Cookie token --> Our function is in the Utils folder
  attachCookies({ res, token });

  // Removes the password from the response so the Frontend does not get it
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    user,
    /* token --> don't need the token anymore */
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  // Pull through these credentials from our UserSchema
  const { email, name, lastName, location } = req.body;

  // If they are not inputted
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }

  // Finds the finds the _id that matches req.user.userId
  const user = await User.findOne({ _id: req.user.userId });

  // Updating the values
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  // Saves the user
  await user.save();

  // Create a new token
  const token = user.createJWT();
  // Cookie token --> Our function is in the Utils folder
  attachCookies({ res, token });

  // Our Response
  res.status(StatusCodes.OK).json({
    user,
    // token, --> Don't need the token anymore
    location: user.location,
  });
};

// Our cookie way of getting the User
const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// When the User logs out it removes the cookie token too
const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    // Expires immediately after logging out
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User Logged Out" });
};

export { register, login, updateUser, getCurrentUser, logoutUser };
