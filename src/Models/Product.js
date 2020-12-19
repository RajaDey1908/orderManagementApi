import mongoose from "mongoose";
const { Schema } = mongoose;
// Creating Product schema

const schema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  price: {
    type: String,
  },
  expiry: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("product", schema);
export default Product;
