import mongoose from "mongoose";


// ========================================
// WISHLIST ITEM SCHEMA
// ========================================

const wishlistItemSchema =
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


      category: {

        type: String,

        default: "",

      },


      rating: {

        type: Number,

        default: 0,

      },

    },

    {

      _id: false,

    }

  );


// ========================================
// WISHLIST SCHEMA
// ========================================

const wishlistSchema =
  new mongoose.Schema(

    {

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

      },


      items: {

        type: [
          wishlistItemSchema
        ],

        default: [],

      },

    },

    {

      timestamps: true,

    }

  );


// ========================================
// MODEL
// ========================================

const Wishlist =
  mongoose.model(
    "Wishlist",
    wishlistSchema
  );


export default Wishlist;