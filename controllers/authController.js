// CONTROLLER --> Organises all the functionality of registering and logging in + editing user

import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";

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

  // Imported from our http-status-codes library package
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
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

  // Removes the password from the response so the Frontend does not get it
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

export { register, login, updateUser };
