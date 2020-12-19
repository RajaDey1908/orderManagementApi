import mongoose from "mongoose";
const { Schema } = mongoose;
// require('mongoose-double')(mongoose);
// Creating Order schema

const schema = new Schema({
  orderDate: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  // price: {
  //   type: String,
  // },
  salePrice: {
    type: Number,
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

const Order = mongoose.model("order", schema);
export default Order;
