import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";


// ======================================================
// LOGIN SUPER ADMIN
// ======================================================

export const superAdminLogin =
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        password,
      } = req.body;


      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Email and password are required",

        });

      }


      const admin =
        await Admin.findOne({

          email:
            email.toLowerCase(),

          role:
            "superadmin",

        });


      if (!admin) {

        return res.status(401).json({

          message:
            "Invalid Super Admin credentials",

        });

      }


      if (
        admin.status !==
        "active"
      ) {

        return res.status(403).json({

          message:
            "Super Admin account is deactivated",

        });

      }


      const passwordMatch =
        await bcrypt.compare(
          password,
          admin.password
        );


      if (
        !passwordMatch
      ) {

        return res.status(401).json({

          message:
            "Invalid Super Admin credentials",

        });

      }


      const token =
        jwt.sign(

          {
            id:
              admin._id,

            email:
              admin.email,

            role:
              "superadmin",

          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "7d",
          }

        );


      return res.status(200).json({

        message:
          "Super Admin login successful",

        token,

        admin: {

          id:
            admin._id,

          name:
            admin.name,

          email:
            admin.email,

          role:
            admin.role,

        },

      });

    } catch (
      error
    ) {

      console.error(
        "Super Admin login error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to login",

      });

    }

  };


// ======================================================
// GET ALL ADMINS
// ======================================================

export const getAdmins =
  async (
    req,
    res
  ) => {

    try {

      const admins =
        await Admin.find({

          role:
            "admin",

        })
          .select(
            "-password"
          )
          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        admins
      );

    } catch (
      error
    ) {

      console.error(
        "Get admins error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch admins",

      });

    }

  };


// ======================================================
// CREATE ADMIN
// ======================================================

export const createAdmin =
  async (
    req,
    res
  ) => {

    try {

      const {
        name,
        email,
        password,
        permissions,
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


      const existingAdmin =
        await Admin.findOne({

          email:
            email.toLowerCase(),

        });


      if (
        existingAdmin
      ) {

        return res.status(409).json({

          message:
            "An admin with this email already exists",

        });

      }


      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      const admin =
        await Admin.create({

          name:
            name.trim(),

          email:
            email.toLowerCase().trim(),

          password:
            hashedPassword,

          role:
            "admin",

          status:
            "active",

          permissions: {

            products:
              Boolean(
                permissions?.products
              ),

            users:
              Boolean(
                permissions?.users
              ),

            carts:
              Boolean(
                permissions?.carts
              ),

            orders:
              Boolean(
                permissions?.orders
              ),

          },

        });


      const adminResponse =
        await Admin.findById(
          admin._id
        ).select(
          "-password"
        );


      return res.status(201).json({

        message:
          "Admin created successfully",

        admin:
          adminResponse,

      });

    } catch (
      error
    ) {

      console.error(
        "Create admin error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to create admin",

        error:
          error.message,

      });

    }

  };


// ======================================================
// UPDATE ADMIN
// ======================================================

export const updateAdmin =
  async (
    req,
    res
  ) => {

    try {

      const {
        id,
      } = req.params;


      const {
        name,
        email,
        password,
        permissions,
      } = req.body;


      const admin =
        await Admin.findOne({

          _id:
            id,

          role:
            "admin",

        });


      if (!admin) {

        return res.status(404).json({

          message:
            "Admin not found",

        });

      }


      if (
        name !== undefined
      ) {

        admin.name =
          name.trim();

      }


      if (
        email !== undefined
      ) {

        admin.email =
          email.toLowerCase().trim();

      }


      if (
        password
      ) {

        admin.password =
          await bcrypt.hash(
            password,
            10
          );

      }


      if (
        permissions
      ) {

        admin.permissions = {

          products:
            Boolean(
              permissions.products
            ),

          users:
            Boolean(
              permissions.users
            ),

          carts:
            Boolean(
              permissions.carts
            ),

          orders:
            Boolean(
              permissions.orders
            ),

        };

      }


      await admin.save();


      const updatedAdmin =
        await Admin.findById(
          admin._id
        ).select(
          "-password"
        );


      return res.status(200).json({

        message:
          "Admin updated successfully",

        admin:
          updatedAdmin,

      });

    } catch (
      error
    ) {

      console.error(
        "Update admin error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update admin",

      });

    }

  };


// ======================================================
// TOGGLE ADMIN STATUS
// ======================================================

export const toggleAdminStatus =
  async (
    req,
    res
  ) => {

    try {

      const {
        id,
      } = req.params;


      const admin =
        await Admin.findOne({

          _id:
            id,

          role:
            "admin",

        });


      if (!admin) {

        return res.status(404).json({

          message:
            "Admin not found",

        });

      }


      admin.status =
        admin.status ===
        "active"

          ? "deactivated"

          : "active";


      await admin.save();


      return res.status(200).json({

        message:
          admin.status ===
          "active"

            ? "Admin activated successfully"

            : "Admin deactivated successfully",

        status:
          admin.status,

      });

    } catch (
      error
    ) {

      console.error(
        "Toggle admin error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update admin status",

      });

    }

  };


// ======================================================
// DELETE ADMIN
// ======================================================

export const deleteAdmin =
  async (
    req,
    res
  ) => {

    try {

      const {
        id,
      } = req.params;


      const admin =
        await Admin.findOne({

          _id:
            id,

          role:
            "admin",

        });


      if (!admin) {

        return res.status(404).json({

          message:
            "Admin not found",

        });

      }


      await Admin.deleteOne({

        _id:
          id,

      });


      return res.status(200).json({

        message:
          "Admin deleted successfully",

      });

    } catch (
      error
    ) {

      console.error(
        "Delete admin error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to delete admin",

      });

    }

  };