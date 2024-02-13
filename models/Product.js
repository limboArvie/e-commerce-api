const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product Name is required."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  skuNumber: {
    type: String,
    required: [true, "SKU Number is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  category: {
    type: String,
    required: [true, "Category is required."],
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Pending Approval",
  },
  approvedOn: Date,
  isActive: {
    type: Boolean,
    default: false,
  },
  sellerId: {
    type: String,
    required: [true, "Seller ID is required."],
  },
  discount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);
