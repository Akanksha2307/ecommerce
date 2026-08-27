import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";

dotenv.config();


// ========================================
// GOOGLE CLIENT
// ========================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);


// ========================================
// REGISTER USER
// ========================================

export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;


    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "Name, email and password are required",
      });

    }


    const existingUser =
      await User.findOne({
        email,
      });


    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

      });


    return res.status(201).json({

      message:
        "Registration successful",

      user: {

        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

      },

    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message:
        "Registration failed",
    });

  }

};


// ========================================
// LOGIN USER
// ========================================

export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    const user =
      await User.findOne({
        email,
      });


    if (!user) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    if (!user.password) {

      return res.status(401).json({
        message:
          "This account uses Google login. Please continue with Google.",
      });

    }


    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    const token =
      jwt.sign(

        {
          userId:
            user._id.toString(),

          email:
            user.email,

        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1d",
        }

      );


    return res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        profileImage:
          user.profileImage || "",

      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Login failed",
    });

  }

};


// ========================================
// GOOGLE LOGIN
// ========================================

export const googleLogin = async (
  req,
  res
) => {

  try {

    const {
      credential,
    } = req.body;


    if (!credential) {

      return res.status(400).json({
        message:
          "Google credential is required",
      });

    }


    if (!process.env.GOOGLE_CLIENT_ID) {

      console.error(
        "GOOGLE_CLIENT_ID is missing in backend .env"
      );

      return res.status(500).json({
        message:
          "Google Client ID is not configured",
      });

    }


    const ticket =
      await googleClient.verifyIdToken({

        idToken:
          credential,

        audience:
          process.env.GOOGLE_CLIENT_ID,

      });


    const payload =
      ticket.getPayload();


    const {
      sub,
      email,
      name,
      picture,
    } = payload;


    if (!email) {

      return res.status(400).json({
        message:
          "Google account email not available",
      });

    }


    let user =
      await User.findOne({
        email,
      });


    if (!user) {

      user =
        await User.create({

          name:name || "Google User",

          email,

          password:"",

          googleId:sub,

          profileImage: picture || "",

        });

    } else {

      if (!user.googleId) {

        user.googleId =sub;

      }


      if (picture) {

        user.profileImage =
          picture;

      }

      await user.save();

    }

    const token =
      jwt.sign(

        {
          userId:
            user._id.toString(),

          email:
            user.email,

        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1d",
        }

      );


    return res.status(200).json({

      message:
        "Google login successful",

      token,

      user: {

        id: user._id,

        name:user.name,

        email:user.email,

        profileImage:user.profileImage || "",

      },

    });

  } catch (error) {

    console.error(
      "Google login error:",
      error
    );

    return res.status(401).json({
      message:
        "Google authentication failed",
    });

  }

};