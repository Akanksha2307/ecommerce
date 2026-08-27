import mongoose from "mongoose";


// ========================================
// ORDER ITEM SCHEMA
// ========================================

const orderItemSchema =
  new mongoose.Schema(
    {

      productId: {
        type: Number,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      thumbnail: {
        type: String,
        default: "",
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

    },

    {
      _id: false,
    }

  );


// ========================================
// ORDER SCHEMA
// ========================================

const orderSchema =
  new mongoose.Schema(
    {

      // ====================================
      // ORDER NUMBER
      // ====================================

      orderNumber: {
        type: String,
        required: true,
        unique: true,
      },


      // ====================================
      // USER WHO PLACED ORDER
      // ====================================

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },


      // ====================================
      // CUSTOMER INFORMATION
      // ====================================

      customer: {

        name: {
          type: String,
          required: true,
        },

        email: {
          type: String,
          required: true,
        },

      },


      // ====================================
      // SHIPPING INFORMATION
      // ====================================

      shipping: {

        name: {
          type: String,
          required: true,
        },

        email: {
          type: String,
          required: true,
        },

        phone: {
          type: String,
          required: true,
        },

        address: {
          type: String,
          required: true,
        },

        city: {
          type: String,
          required: true,
        },

        state: {
          type: String,
          required: true,
        },

        zip: {
          type: String,
          required: true,
        },

      },


      // ====================================
      // ORDER PRODUCTS
      // ====================================

      items: {
        type: [orderItemSchema],
        required: true,
      },


      // ====================================
      // ORDER AMOUNTS
      // ====================================

      subtotal: {
        type: Number,
        required: true,
      },

      shippingCost: {
        type: Number,
        required: true,
      },

      tax: {
        type: Number,
        required: true,
      },

      total: {
        type: Number,
        required: true,
      },


      // ====================================
      // ORDER STATUS
      // ====================================

      orderStatus: {
        type: String,
        default: "Placed",
      },

    },

    {
      timestamps: true,
    }

  );


// ========================================
// ORDER MODEL
// ========================================

const Order =
  mongoose.model(
    "Order",
    orderSchema
  );


export default Order;