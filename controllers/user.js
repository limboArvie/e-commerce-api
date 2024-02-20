const bcrypt = require("bcrypt");
const auth = require("../auth");

const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ error: "Email is not valid." });
    }

    if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters." });
    }

    if (req.body.mobileNumber.length !== 11) {
      return res.status(400).send({ error: "Mobile number is not valid." });
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req.body.isSeller ? "Seller" : "Customer"
    });

    const user = await newUser.save();
    return res.status(201).send({ message: "User created successfully." });
  } catch (error) {
    console.error("Error encountered while creating user", error);
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while creating user.",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).send({ users });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while getting all users.",
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({ error: "User Id is required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({
      error:
        "Internal Server Error: Error occurred while getting user information.",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    user.password = undefined;

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({
      error:
        "Internal Server Error: Error occurred while getting user profile.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res
        .status(400)
        .send({ error: "Bad Request: Email and Password are required." });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).send({ error: "User not found." });
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      return res
        .status(403)
        .send({ error: "Authentication Error: Incorrect email and password." });
    }

    const userToken = auth.createAccessToken(foundUser);

    return res.status(200).send({ accessToken: userToken });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while logging in user.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber } = req.body;
    const { id } = req.user;
    const { userId } = req.params;

    if (id !== userId) {
      return res.status(403).send({
        error: "User not allowed to update other user's information.",
      });
    }

    if (mobileNumber && mobileNumber.length !== 11) {
      return res.status(400).send({ error: "Mobile number is not valid." });
    }

    const userToUpdate = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, mobileNumber },
      { new: true }
    );

    if (!userToUpdate) {
      res.status(404).send({ error: "User to update not found." });
    }

    res.status(200).send({ message: "User updated successfully." });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while updating user.",
    });
  }
};

const updateUserAsAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToUpdate = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true, role: "Internal Admin" },
      { new: true }
    );

    if (!userToUpdate) {
      res.status(404).send({ error: "User to update not found." });
    }

    res.status(200).send({ message: "User updated successfully." });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while updating user.",
    });
  }
};

const updateUserAsSeller = async (req, res) => {
  try {
    const { userId } = req.params;

    const userToUpdate = await User.findByIdAndUpdate(
      userId,
      { isApprovedSeller: true, role: "Seller" },
      { new: true }
    );

    if (!userToUpdate) {
      res.status(404).send({ error: "User to update to seller role not found." });
    }

    res.status(200).send({ message: "User updated to seller role successfully." });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while updating user to seller role.",
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { userId } = req.params;
    const { password } = req.body;

    if (id !== userId) {
      return res.status(403).send({
        error: "User not allowed to update other user's password.",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters." });
    }

    const userToUpdate = await User.findByIdAndUpdate(
      id,
      { password: bcrypt.hashSync(password, 10) },
      { new: true }
    );

    if (!userToUpdate) {
      res.status(404).send({ error: "User to update not found." });
    }

    res.status(200).send({ message: "User's password updated successfully." });
  } catch (error) {
    return res.status(500).send({
      error:
        "Internal Server Error: Error occurred while updating user's password.",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!role) {
      return res.status(400).send({ error: "Role is required." });
    }

    const userToUpdate = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!userToUpdate) {
      res.status(404).send({ error: "User to update not found." });
    }

    res.status(200).send({ message: "User role updated successfully." });
  } catch (error) {
    return res.status(500).send({
      error: "Internal Server Error: Error occurred while updating user role.",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserInfo,
  getUserProfile,
  loginUser,
  updateUser,
  updateUserAsAdmin,
  updateUserAsSeller,
  updateUserPassword,
  updateUserRole,
};
