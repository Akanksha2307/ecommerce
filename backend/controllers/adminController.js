import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Admin from "../models/Admin.js";

import cloudinary from "../config/cloudinary.js";

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "../config/adminConfig.js";


// ======================================================
// PERMISSION HELPERS
// ======================================================

const hasPermission = (
  req,
  permission
) => {

  return (
    req.admin?.role === "admin" &&
    req.admin?.permissions?.[permission] === true
  );

};


const requirePermission = (
  req,
  res,
  permission
) => {

  if (
    !hasPermission(
      req,
      permission
    )
  ) {

    return res.status(403).json({

      message:
        `You do not have permission to access ${permission}`,

      permission,

    });

  }

  return true;

};


// ======================================================
// UPLOAD IMAGE TO CLOUDINARY
// ======================================================

const uploadToCloudinary =
  (buffer) => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const stream =
          cloudinary.uploader.upload_stream(

            {
              folder:
                "greencart/products",
            },

            (
              error,
              result
            ) => {

              if (error) {

                reject(
                  error
                );

              } else {

                resolve(
                  result
                );

              }

            }

          );


        stream.end(
          buffer
        );

      }
    );

  };


// ======================================================
// UPLOAD PRODUCT IMAGE
// PRODUCTS PERMISSION REQUIRED
// ======================================================

export const uploadProductImage =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "products"
      )
    ) {
      return;
    }


    try {

      if (!req.file) {

        return res.status(400).json({

          message:
            "Please select an image",

        });

      }


      const result =
        await uploadToCloudinary(
          req.file.buffer
        );


      return res.status(200).json({

        message:
          "Image uploaded successfully",

        url:
          result.secure_url,

      });

    } catch (
      error
    ) {

      console.error(
        "Cloudinary upload error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to upload image",

        error:
          error.message,

      });

    }

  };


// ======================================================
// ADMIN LOGIN
// ======================================================

export const adminLogin =
  async (
    req,
    res
  ) => {

    try {

      const {
        email,
        password,
      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Email and password are required",

        });

      }


      const normalizedEmail =
        email
          .trim()
          .toLowerCase();


      // ==================================================
      // CHECK DATABASE ADMIN
      // ==================================================

      const databaseAdmin =
        await Admin.findOne({

          email:
            normalizedEmail,

          role:
            "admin",

        });


      if (
        databaseAdmin
      ) {

        // ================================================
        // CHECK STATUS
        // ================================================

        if (
          databaseAdmin.status !==
          "active"
        ) {

          return res.status(403).json({

            message:
              "Your admin account has been deactivated",

          });

        }


        // ================================================
        // CHECK PASSWORD
        // ================================================

        const passwordMatch =
          await bcrypt.compare(

            password,

            databaseAdmin.password

          );


        if (
          !passwordMatch
        ) {

          return res.status(401).json({

            message:
              "Invalid admin credentials",

          });

        }


        // ================================================
        // GET PERMISSIONS
        // ================================================

        const permissions = {

          products:
            databaseAdmin.permissions?.products === true,

          users:
            databaseAdmin.permissions?.users === true,

          carts:
            databaseAdmin.permissions?.carts === true,

          orders:
            databaseAdmin.permissions?.orders === true,

        };


        // ================================================
        // CREATE JWT
        // ================================================

        const token =
          jwt.sign(

            {

              id:
                databaseAdmin._id,

              email:
                databaseAdmin.email,

              role:
                "admin",

              permissions,

            },

            process.env.JWT_SECRET,

            {

              expiresIn:
                "7d",

            }

          );


        // ================================================
        // RETURN ADMIN
        // ================================================

        return res.status(200).json({

          message:
            "Admin login successful",

          token,

          admin: {

            id:
              databaseAdmin._id,

            name:
              databaseAdmin.name,

            email:
              databaseAdmin.email,

            role:
              databaseAdmin.role,

            status:
              databaseAdmin.status,

            permissions,

          },

        });

      }


      // ==================================================
      // OLD / LEGACY ADMIN LOGIN
      // ==================================================

      if (

        normalizedEmail ===
        String(
          ADMIN_EMAIL
        )
          .trim()
          .toLowerCase()

        &&

        password ===
        ADMIN_PASSWORD

      ) {

        const permissions = {

          products:
            true,

          users:
            true,

          carts:
            true,

          orders:
            true,

        };


        const token =
          jwt.sign(

            {

              id:
                "legacy-admin",

              email:
                ADMIN_EMAIL,

              role:
                "admin",

              permissions,

            },

            process.env.JWT_SECRET,

            {

              expiresIn:
                "7d",

            }

          );


        return res.status(200).json({

          message:
            "Admin login successful",

          token,

          admin: {

            id:
              "legacy-admin",

            name:
              "Admin",

            email:
              ADMIN_EMAIL,

            role:
              "admin",

            status:
              "active",

            permissions,

          },

        });

      }


      // ==================================================
      // INVALID LOGIN
      // ==================================================

      return res.status(401).json({

        message:
          "Invalid admin credentials",

      });

    } catch (
      error
    ) {

      console.error(
        "Admin login error:",
        error
      );


      return res.status(500).json({

        message:
          "Admin login failed",

        error:
          error.message,

      });

    }

  };


// ======================================================
// DASHBOARD STATS
// ======================================================

export const getStats =
  async (
    req,
    res
  ) => {

    try {

      const permissions =
        req.admin?.permissions || {};


      const canProducts =
        permissions.products === true;


      const canUsers =
        permissions.users === true;


      const canCarts =
        permissions.carts === true;


      const canOrders =
        permissions.orders === true;


      // ==================================================
      // FETCH ONLY ALLOWED DATA
      // ==================================================

      const [
        products,
        users,
        orders,
        carts,
      ] =
        await Promise.all([

          canProducts

            ? Product.find()
                .sort({
                  createdAt:
                    -1,
                })

            : [],


          canUsers

            ? User.find()
                .select(
                  "-password"
                )
                .sort({
                  createdAt:
                    -1,
                })

            : [],


          canOrders

            ? Order.find()
                .sort({
                  createdAt:
                    -1,
                })

            : [],


          canCarts

            ? Cart.find({
                "items.0": {
                  $exists: true,
                },
              })
                .populate(
                  "userId",
                  "name email"
                )
                .sort({
                  updatedAt:
                    -1,
                })

            : [],

        ]);


      // ==================================================
      // PRODUCTS
      // ==================================================

      const totalProducts =
        canProducts
          ? products.length
          : 0;


      const lowStockProducts =
        canProducts

          ? products.filter(
              (product) =>
                Number(
                  product.stock ||
                  0
                ) <= 10
            )

          : [];


      const highStockProducts =
        canProducts

          ? products.filter(
              (product) =>
                Number(
                  product.stock ||
                  0
                ) > 10
            )

          : [];


      const inventoryValue =
        canProducts

          ? products.reduce(

              (
                sum,
                product
              ) => {

                return (

                  sum +

                  Number(
                    product.price ||
                    0
                  ) *

                  Number(
                    product.stock ||
                    0
                  )

                );

              },

              0

            )

          : 0;


      // ==================================================
      // USERS
      // ==================================================

      const totalUsers =
        canUsers
          ? users.length
          : 0;


      // ==================================================
      // ORDERS
      // ==================================================

      const totalOrders =
        canOrders
          ? orders.length
          : 0;


      const totalRevenue =
        canOrders

          ? orders.reduce(

              (
                sum,
                order
              ) => {

                return (

                  sum +

                  Number(
                    order.total ||
                    0
                  )

                );

              },

              0

            )

          : 0;


      const averageOrderValue =
        canOrders &&
        totalOrders > 0

          ? totalRevenue /
            totalOrders

          : 0;


      const ordersByStatus =
        canOrders

          ? orders.reduce(

              (
                result,
                order
              ) => {

                const status =
                  order.orderStatus ||
                  "Placed";


                result[status] =
                  (
                    result[status] ||
                    0
                  ) + 1;


                return result;

              },

              {}

            )

          : {};


      // ==================================================
      // CARTS
      // ==================================================

      const activeCarts =
        canCarts

          ? carts.filter(

              (cart) =>

                Array.isArray(
                  cart.items
                ) &&

                cart.items.length >
                0

            )

          : [];


      const activeCartItems =
        canCarts

          ? activeCarts.reduce(

              (
                total,
                cart
              ) => {

                return (

                  total +

                  cart.items.reduce(

                    (
                      sum,
                      item
                    ) =>

                      sum +

                      Number(
                        item.quantity ||
                        0
                      ),

                    0

                  )

                );

              },

              0

            )

          : 0;


      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({

        products:
          totalProducts,

        users:
          totalUsers,

        orders:
          totalOrders,

        revenue:
          totalRevenue,

        averageOrderValue,

        inventoryValue,

        activeCarts:
          activeCarts.length,

        activeCartItems,

        lowStockCount:
          lowStockProducts.length,

        ordersByStatus,

        lowStockProducts,

        highStockProducts,

        permissions: {

          products:
            canProducts,

          users:
            canUsers,

          carts:
            canCarts,

          orders:
            canOrders,

        },

      });

    } catch (
      error
    ) {

      console.error(
        "Dashboard stats error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch dashboard stats",

        error:
          error.message,

      });

    }

  };


// ======================================================
// GET ACTIVE CARTS
// CARTS PERMISSION REQUIRED
// ======================================================

export const getCarts =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "carts"
      )
    ) {
      return;
    }


    try {

      const carts =
        await Cart.find({

          "items.0": {
            $exists: true,
          },

        })
          .populate(
            "userId",
            "name email"
          )
          .sort({

            updatedAt:
              -1,

          });


      return res.status(200).json(
        carts
      );

    } catch (
      error
    ) {

      console.error(
        "Get carts error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch carts",

        error:
          error.message,

      });

    }

  };


// ======================================================
// GET ALL PRODUCTS
// PRODUCTS PERMISSION REQUIRED
// ======================================================

export const getProducts =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "products"
      )
    ) {
      return;
    }


    try {

      const products =
        await Product.find()
          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        products
      );

    } catch (
      error
    ) {

      console.error(
        "Get products error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch products",

        error:
          error.message,

      });

    }

  };


// ======================================================
// ADD PRODUCT
// PRODUCTS PERMISSION REQUIRED
// ======================================================

export const addProduct =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "products"
      )
    ) {
      return;
    }


    try {

      const {
        title,
        description,
        price,
        category,
        thumbnail,
        images,
        rating,
        stock,
      } = req.body;


      if (
        !title ||
        price === undefined ||
        !category
      ) {

        return res.status(400).json({

          message:
            "Title, price and category are required",

        });

      }


      const product =
        await Product.create({

          id:
            Date.now(),

          title:
            title.trim(),

          description:
            description || "",

          price:
            Number(price),

          category:
            category.trim(),

          thumbnail:
            thumbnail || "",

          images:
            Array.isArray(images)
              ? images
              : thumbnail
              ? [
                  thumbnail,
                ]
              : [],

          rating:
            Number(
              rating ||
              0
            ),

          stock:
            Number(
              stock ||
              0
            ),

        });


      return res.status(201).json({

        message:
          "Product added successfully",

        product,

      });

    } catch (
      error
    ) {

      console.error(
        "Add product error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to add product",

        error:
          error.message,

      });

    }

  };


// ======================================================
// UPDATE PRODUCT
// PRODUCTS PERMISSION REQUIRED
// ======================================================

export const updateProduct =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "products"
      )
    ) {
      return;
    }


    try {

      const {
        id,
      } = req.params;


      const product =
        await Product.findById(
          id
        );


      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }


      const {
        title,
        description,
        price,
        category,
        thumbnail,
        images,
        rating,
        stock,
      } = req.body;


      if (
        title !== undefined
      ) {

        product.title =
          title.trim();

      }


      if (
        description !== undefined
      ) {

        product.description =
          description;

      }


      if (
        price !== undefined
      ) {

        product.price =
          Number(
            price
          );

      }


      if (
        category !== undefined
      ) {

        product.category =
          category.trim();

      }


      if (
        thumbnail !== undefined
      ) {

        product.thumbnail =
          thumbnail;

      }


      if (
        images !== undefined
      ) {

        product.images =
          Array.isArray(
            images
          )

            ? images

            : product.thumbnail

            ? [
                product.thumbnail,
              ]

            : [];

      }


      if (
        rating !== undefined
      ) {

        product.rating =
          Number(
            rating
          );

      }


      if (
        stock !== undefined
      ) {

        product.stock =
          Number(
            stock
          );

      }


      await product.save();


      return res.status(200).json({

        message:
          "Product updated successfully",

        product,

      });

    } catch (
      error
    ) {

      console.error(
        "Update product error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update product",

        error:
          error.message,

      });

    }

  };


// ======================================================
// DELETE PRODUCT
// PRODUCTS PERMISSION REQUIRED
// ======================================================

export const deleteProduct =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "products"
      )
    ) {
      return;
    }


    try {

      const {
        id,
      } = req.params;


      const product =
        await Product.findByIdAndDelete(
          id
        );


      if (!product) {

        return res.status(404).json({

          message:
            "Product not found",

        });

      }


      return res.status(200).json({

        message:
          "Product deleted successfully",

      });

    } catch (
      error
    ) {

      console.error(
        "Delete product error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to delete product",

        error:
          error.message,

      });

    }

  };


// ======================================================
// GET USERS
// USERS PERMISSION REQUIRED
// ======================================================

export const getUsers =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "users"
      )
    ) {
      return;
    }


    try {

      const users =
        await User.find()
          .select(
            "-password"
          )
          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        users
      );

    } catch (
      error
    ) {

      console.error(
        "Get users error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch users",

        error:
          error.message,

      });

    }

  };


// ======================================================
// ADD USER
// USERS PERMISSION REQUIRED
// ======================================================

export const addUser =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "users"
      )
    ) {
      return;
    }


    try {

      const {
        name,
        email,
        password,
        profileImage,
        role,
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


      const normalizedEmail =
        email
          .toLowerCase()
          .trim();


      const existingUser =
        await User.findOne({

          email:
            normalizedEmail,

        });


      if (
        existingUser
      ) {

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

          name:
            name.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,

          profileImage:
            profileImage ||
            "",

          role:
            role === "admin"
              ? "admin"
              : "user",

        });


      return res.status(201).json({

        message:
          "User added successfully",

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          profileImage:
            user.profileImage,

          role:
            user.role,

          createdAt:
            user.createdAt,

        },

      });

    } catch (
      error
    ) {

      console.error(
        "Add user error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to add user",

        error:
          error.message,

      });

    }

  };


// ======================================================
// UPDATE USER
// USERS PERMISSION REQUIRED
// ======================================================

export const updateUser =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "users"
      )
    ) {
      return;
    }


    try {

      const {
        id,
      } = req.params;


      const user =
        await User.findById(
          id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      const {
        name,
        email,
        password,
        profileImage,
        role,
      } = req.body;


      if (
        name !== undefined
      ) {

        user.name =
          name.trim();

      }


      if (
        email !== undefined
      ) {

        user.email =
          email
            .toLowerCase()
            .trim();

      }


      if (
        password &&
        password.trim() !== ""
      ) {

        user.password =
          await bcrypt.hash(

            password,

            10

          );

      }


      if (
        profileImage !==
        undefined
      ) {

        user.profileImage =
          profileImage;

      }


      if (
        role === "user" ||
        role === "admin"
      ) {

        user.role =
          role;

      }


      await user.save();


      return res.status(200).json({

        message:
          "User updated successfully",

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          profileImage:
            user.profileImage,

          role:
            user.role,

          createdAt:
            user.createdAt,

        },

      });

    } catch (
      error
    ) {

      console.error(
        "Update user error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to update user",

        error:
          error.message,

      });

    }

  };


// ======================================================
// DELETE USER
// USERS PERMISSION REQUIRED
// ======================================================

export const deleteUser =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "users"
      )
    ) {
      return;
    }


    try {

      const {
        id,
      } = req.params;


      const user =
        await User.findByIdAndDelete(
          id
        );


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      return res.status(200).json({

        message:
          "User deleted successfully",

      });

    } catch (
      error
    ) {

      console.error(
        "Delete user error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to delete user",

        error:
          error.message,

      });

    }

  };


// ======================================================
// GET ALL ORDERS
// ORDERS PERMISSION REQUIRED
// ======================================================

export const getOrders =
  async (
    req,
    res
  ) => {

    if (
      !requirePermission(
        req,
        res,
        "orders"
      )
    ) {
      return;
    }


    try {

      const orders =
        await Order.find()
          .populate(
            "userId",
            "name email"
          )
          .sort({

            createdAt:
              -1,

          });


      return res.status(200).json(
        orders
      );

    } catch (
      error
    ) {

      console.error(
        "Get orders error:",
        error
      );


      return res.status(500).json({

        message:
          "Failed to fetch orders",

        error:
          error.message,

      });

    }

  };