import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {

    // ========================================
    // GET AUTHORIZATION HEADER
    // ========================================

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        message:
          "Authentication required",
      });

    }


    // ========================================
    // GET TOKEN
    // ========================================

    const token =
      authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message:
          "Authentication token missing",
      });

    }


    // ========================================
    // VERIFY TOKEN
    // ========================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ========================================
    // FIND USER
    // ========================================

    const user =
      await User.findById(
        decoded.userId
      );


    if (!user) {

      return res.status(401).json({
        message:
          "User no longer exists",
      });

    }


    // ========================================
    // ATTACH USER
    // ========================================

    req.user = user;

    req.userId =
      user._id.toString();


    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });

  }
};

export default authMiddleware;