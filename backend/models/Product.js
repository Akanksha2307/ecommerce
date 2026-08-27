import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;