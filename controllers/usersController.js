const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    roles,
  });
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(400).json({ message: "User could not be created" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, active, roles } = req.body;
  if (
    (!id, !username, !password, !active, !Array.isArray(roles) || !roles.length)
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists" });
  }
  user.username = username;
  user.active = active;
  user.roles = roles;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `User updated :${updatedUser.username}` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    res.status(400).json({ message: "User has notes, cannot delete" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const deletedUser = await user.deleteOne();
  const result = deletedUser.username;
  res.json({ message: `User deleted: ${result}` });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
