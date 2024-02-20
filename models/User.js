const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required."],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile Number is required."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isApprovedSeller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: "Customer",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
