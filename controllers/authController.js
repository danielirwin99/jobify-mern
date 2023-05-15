// CONTROLLER --> Organises all the functionality of registering and logging in + editing user

import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const register = async (req, res) => {
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
  // Imported from our http-status-codes library package
  res.status(StatusCodes.OK).json({ user });
};

const login = async (req, res) => {
  res.send("Login User");
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

export { register, login, updateUser };
