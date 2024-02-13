const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: String,
  productId: {
    type: String,
    required: [true, "Product Id is required."],
  },
  displayName: {
    type: String,
    default: "Anonymous",
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  review: {
    type: String,
    required: [true, "Review is required."],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required."],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedOn: Date,
});

module.exports = mongoose.model("Review", reviewSchema);
