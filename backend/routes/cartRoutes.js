import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../controllers/cartController.js";


const router =
  express.Router();


// ========================================
// ALL CART ROUTES REQUIRE LOGIN
// ========================================

router.use(
  authMiddleware
);


// ========================================
// GET CART
// ========================================

router.get(
  "/",
  getCart
);


// ========================================
// ADD TO CART
// ========================================

router.post(
  "/",
  addToCart
);


// ========================================
// INCREASE QUANTITY
// ========================================

router.put(
  "/increase/:id",
  increaseQuantity
);


// ========================================
// DECREASE QUANTITY
// ========================================

router.put(
  "/decrease/:id",
  decreaseQuantity
);


// ========================================
// REMOVE FROM CART
// ========================================

router.delete(
  "/:id",
  removeFromCart
);


export default router;