import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// ADMIN ROUTES
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes
  from "./routes/superAdminRoutes.js";
dotenv.config();

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(
  express.json()
);


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// AUTH ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);


// ========================================
// PRODUCT ROUTES
// ========================================

app.use(
  "/api/products",
  productRoutes
);


// ========================================
// CART ROUTES
// ========================================

app.use(
  "/api/cart",
  cartRoutes
);


// ========================================
// WISHLIST ROUTES
// ========================================

app.use(
  "/api/wishlist",
  wishlistRoutes
);


// ========================================
// ADMIN ROUTES
// ========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// ORDER ROUTES
// ========================================

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/super-admin",
  superAdminRoutes
);
// ========================================
// TEST ROUTE
// ========================================

app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "GreenCart backend is running",

    });

  }
);


// ========================================
// SERVER
// ========================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);
// GitHub Actions backend deployment test
// Backend CI/CD test - SSH fixed
