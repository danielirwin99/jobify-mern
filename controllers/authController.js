// CONTROLLER --> Organises all the functionality of registering and logging in + editing user

import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const register = async (req, res) => {
  const user = await User.create(req.body);
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
