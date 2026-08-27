import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";


const createSuperAdmin =
  async () => {

    try {

      // ========================================
      // CONNECT TO MONGODB
      // ========================================

      await mongoose.connect(
        process.env.MONGO_URI
      );


      console.log(
        "MongoDB connected"
      );


      // ========================================
      // SUPER ADMIN DETAILS
      // ========================================

      const name =
        "Super Admin";

      const email =
        "superadmin@greencart.com";

      const password =
        "SuperAdmin@123";


      // ========================================
      // CHECK EXISTING
      // ========================================

      const existingAdmin =
        await Admin.findOne({

          email:
            email.toLowerCase(),

        });


      if (
        existingAdmin
      ) {

        console.log(
          "Super Admin already exists."
        );

        console.log(
          "Email:",
          existingAdmin.email
        );

        process.exit(0);

      }


      // ========================================
      // HASH PASSWORD
      // ========================================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      // ========================================
      // CREATE SUPER ADMIN
      // ========================================

      const admin =
        await Admin.create({

          name,

          email:
            email.toLowerCase(),

          password:
            hashedPassword,

          role:
            "superadmin",

          status:
            "active",

          permissions: {

            products:
              true,

            users:
              true,

            carts:
              true,

            orders:
              true,

          },

        });


      console.log(
        "================================="
      );

      console.log(
        "SUPER ADMIN CREATED SUCCESSFULLY"
      );

      console.log(
        "================================="
      );

      console.log(
        "Name:",
        admin.name
      );

      console.log(
        "Email:",
        email
      );

      console.log(
        "Password:",
        password
      );

      console.log(
        "Role:",
        admin.role
      );

      console.log(
        "================================="
      );


      process.exit(0);

    } catch (
      error
    ) {

      console.error(
        "Failed to create Super Admin:"
      );

      console.error(
        error
      );

      process.exit(1);

    }

  };


createSuperAdmin();