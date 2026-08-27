import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
    } = req.body;


    // ========================================
    // VALIDATE SHIPPING INFORMATION
    // ========================================

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !zip
    ) {

      return res.status(400).json({

        message:
          "All shipping information is required",

      });

    }


    // ========================================
    // GET USER
    // ========================================

    const user =
      await User.findById(
        req.userId
      );


    if (!user) {

      return res.status(404).json({

        message:
          "User not found",

      });

    }


    // ========================================
    // GET CART
    // ========================================

    const cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {

      return res.status(400).json({

        message:
          "Your cart is empty",

      });

    }


    // ========================================
    // VERIFY STOCK BEFORE ORDER
    // ========================================

    for (
      const item of cart.items
    ) {

      const product =
        await Product.findOne({

          id:
            Number(item.productId),

        });


      if (!product) {

        return res.status(400).json({

          message:
            `${item.title} is no longer available`,

        });

      }


      const stock =
        Number(
          product.stock || 0
        );


      const quantity =
        Number(
          item.quantity || 0
        );


      if (stock <= 0) {

        return res.status(400).json({

          message:
            `${product.title} is out of stock`,

        });

      }


      if (
        quantity > stock
      ) {

        return res.status(400).json({

          message:
            `Only ${stock} item(s) of ${product.title} are available in stock`,

        });

      }

    }


    // ========================================
    // CALCULATE SUBTOTAL
    // ========================================

    const subtotal =
      cart.items.reduce(

        (total, item) =>

          total +
          Number(item.price) *
          Number(item.quantity),

        0

      );


    // ========================================
    // SHIPPING
    // ========================================

    const shippingCost =
      subtotal > 50
        ? 0
        : 5.99;


    // ========================================
    // TAX
    // ========================================

    const tax =
      subtotal * 0.08;


    // ========================================
    // TOTAL
    // ========================================

    const total =
      subtotal +
      shippingCost +
      tax;


    // ========================================
    // ORDER NUMBER
    // ========================================

    const orderNumber =
      "GC" +
      Date.now();


    // ========================================
    // CREATE ORDER
    // ========================================

    const order =
      await Order.create({

        orderNumber,

        userId:
          req.userId,


        // ====================================
        // CUSTOMER
        // ====================================

        customer: {

          name:
            user.name,

          email:
            user.email,

        },


        // ====================================
        // SHIPPING
        // ====================================

        shipping: {

          name,

          email,

          phone,

          address,

          city,

          state,

          zip,

        },


        // ====================================
        // PRODUCTS
        // ====================================

        items:
          cart.items.map(
            (item) => ({

              productId:
                item.productId,

              title:
                item.title,

              price:
                item.price,

              thumbnail:
                item.thumbnail,

              quantity:
                item.quantity,

            })
          ),


        // ====================================
        // TOTALS
        // ====================================

        subtotal,

        shippingCost,

        tax,

        total,


        // ====================================
        // STATUS
        // ====================================

        orderStatus:
          "Placed",

      });


    // ========================================
    // REDUCE PRODUCT STOCK
    // ========================================

    for (
      const item of cart.items
    ) {

      await Product.findOneAndUpdate(

        {
          id:
            Number(item.productId),

        },

        {
          $inc: {

            stock:
              -Number(item.quantity),

          },

        }

      );

    }


    // ========================================
    // CLEAR CART
    // ========================================

    cart.items = [];

    await cart.save();


    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({

      message:
        "Order placed successfully",

      order,

    });

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to place order",

      error:
        error.message,

    });

  }

};


// ========================================
// GET ALL USER ORDERS
// ========================================

export const getUserOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find({

        userId:
          req.userId,

      }).sort({

        createdAt:
          -1,

      });


    return res.status(200).json(
      orders
    );

  } catch (error) {

    console.error(
      "Get user orders error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch your orders",

    });

  }

};


// ========================================
// GET SINGLE USER ORDER
// ========================================

export const getOrderById = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.id,

        userId:
          req.userId,

      });


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found",

      });

    }


    return res.status(200).json(
      order
    );

  } catch (error) {

    console.error(
      "Get order error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch order",

    });

  }

};