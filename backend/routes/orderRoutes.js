import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/orderController.js";


const router =
  express.Router();


// ========================================
// ALL ORDER ROUTES REQUIRE LOGIN
// ========================================

router.use(
  authMiddleware
);


// ========================================
// CREATE ORDER
// ========================================

router.post(
  "/",
  createOrder
);


// ========================================
// GET ALL ORDERS OF LOGGED-IN USER
// ========================================

router.get(
  "/my-orders",
  getUserOrders
);


// ========================================
// GET SINGLE USER ORDER
// ========================================

router.get(
  "/:id",
  getOrderById
);


export default router;