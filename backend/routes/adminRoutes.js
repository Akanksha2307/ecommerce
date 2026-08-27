import express from "express";

import upload
  from "../middleware/uploadMiddleware.js";

import {
  adminLogin,
  getStats,
  getCarts,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getOrders,
  uploadProductImage,
} from "../controllers/adminController.js";

import adminMiddleware
  from "../middleware/adminMiddleware.js";

import adminPermissionMiddleware
  from "../middleware/adminPermissionMiddleware.js";


const router =
  express.Router();


// ======================================================
// ADMIN LOGIN
// PUBLIC
// ======================================================

router.post(
  "/login",
  adminLogin
);


// ======================================================
// DASHBOARD
//
// Dashboard is available to every authenticated admin.
//
// IMPORTANT:
// Do NOT use:
// adminPermissionMiddleware("dashboard")
//
// because "dashboard" is NOT in Admin.permissions.
// ======================================================

router.get(
  "/stats",
  adminMiddleware(),
  getStats
);


// ======================================================
// CARTS
// ======================================================

router.get(
  "/carts",
  adminMiddleware(),
  adminPermissionMiddleware("carts"),
  getCarts
);


// ======================================================
// PRODUCTS
// ======================================================

router.get(
  "/products",
  adminMiddleware(),
  adminPermissionMiddleware("products"),
  getProducts
);


// ======================================================
// PRODUCT IMAGE UPLOAD
// ======================================================

router.post(
  "/products/upload-image",
  adminMiddleware(),
  adminPermissionMiddleware("products"),
  upload.single("image"),
  uploadProductImage
);


// ======================================================
// ADD PRODUCT
// ======================================================

router.post(
  "/products",
  adminMiddleware(),
  adminPermissionMiddleware("products"),
  addProduct
);


// ======================================================
// UPDATE PRODUCT
// ======================================================

router.put(
  "/products/:id",
  adminMiddleware(),
  adminPermissionMiddleware("products"),
  updateProduct
);


// ======================================================
// DELETE PRODUCT
// ======================================================

router.delete(
  "/products/:id",
  adminMiddleware(),
  adminPermissionMiddleware("products"),
  deleteProduct
);


// ======================================================
// USERS
// ======================================================

router.get(
  "/users",
  adminMiddleware(),
  adminPermissionMiddleware("users"),
  getUsers
);


router.post(
  "/users",
  adminMiddleware(),
  adminPermissionMiddleware("users"),
  addUser
);


router.put(
  "/users/:id",
  adminMiddleware(),
  adminPermissionMiddleware("users"),
  updateUser
);


router.delete(
  "/users/:id",
  adminMiddleware(),
  adminPermissionMiddleware("users"),
  deleteUser
);


// ======================================================
// ORDERS
// ======================================================

router.get(
  "/orders",
  adminMiddleware(),
  adminPermissionMiddleware("orders"),
  getOrders
);


export default router;