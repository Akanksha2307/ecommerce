import express from "express";

import {
  registerUser,
  loginUser,
  googleLogin,
} from "../controllers/authController.js";

const router =
  express.Router();

// REGISTER

router.post("/register",registerUser);

// LOGIN

router.post("/login",loginUser);

// GOOGLE LOGIN

router.post("/google",googleLogin);

export default router;