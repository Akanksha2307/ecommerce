import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";


const router =
  express.Router();


// ========================================
// ALL WISHLIST ROUTES REQUIRE LOGIN
// ========================================

router.use(
  authMiddleware
);


// ========================================
// GET WISHLIST
// ========================================

router.get(
  "/",
  getWishlist
);


// ========================================
// ADD TO WISHLIST
// ========================================

router.post(
  "/",
  addToWishlist
);


// ========================================
// REMOVE FROM WISHLIST
// ========================================

router.delete(
  "/:id",
  removeFromWishlist
);


export default router;