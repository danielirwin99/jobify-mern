// CONTROLLER --> Organises all the functionality of registering and logging in + editing user

import User from "../models/User.js";

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "There was an error" });
  }
};

const login = async (req, res) => {
  res.send("Login User");
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

export { register, login, updateUser };
