import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// ========================================
// GET USER CART
// ========================================

export const getCart = async (
  req,
  res
) => {

  try {

    let cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    if (!cart) {

      cart =
        await Cart.create({

          userId:
            req.userId,

          items: [],

        });

    }


    // ========================================
    // REMOVE OUT-OF-STOCK PRODUCTS
    // ========================================

    const validItems = [];


    for (
      const item of cart.items
    ) {

      const product =
        await Product.findOne({

          id:
            Number(item.productId),

        });


      if (
        !product ||
        Number(product.stock || 0) <= 0
      ) {

        continue;

      }


      // ======================================
      // LIMIT CART QUANTITY TO STOCK
      // ======================================

      if (
        Number(item.quantity) >
        Number(product.stock)
      ) {

        item.quantity =
          Number(product.stock);

      }


      // ======================================
      // UPDATE PRODUCT INFORMATION
      // ======================================

      item.title =
        product.title;

      item.price =
        product.price;

      item.thumbnail =
        product.thumbnail || "";


      validItems.push(item);

    }


    cart.items =
      validItems;


    await cart.save();


    return res.status(200).json(
      cart.items
    );

  } catch (error) {

    console.error(
      "Get cart error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch cart",

    });

  }

};


// ========================================
// ADD TO CART
// ========================================

export const addToCart = async (
  req,
  res
) => {

  try {

    const {
      id,
      title,
      price,
      quantity,
    } = req.body;


    // ========================================
    // VALIDATION
    // ========================================

    if (
      id === undefined ||
      id === null ||
      !title ||
      price === undefined
    ) {

      return res.status(400).json({

        message:
          "Product information is required",

      });

    }


    const productId =
      Number(id);


    if (
      Number.isNaN(productId)
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    // ========================================
    // GET PRODUCT
    // ========================================

    const product =
      await Product.findOne({

        id:
          productId,

      });


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    // ========================================
    // CHECK STOCK
    // ========================================

    const availableStock =
      Number(
        product.stock || 0
      );


    if (
      availableStock <= 0
    ) {

      return res.status(400).json({

        message:
          `${product.title} is out of stock`,

      });

    }


    // ========================================
    // REQUESTED QUANTITY
    // ========================================

    const requestedQuantity =
      Number(quantity) || 1;


    if (
      requestedQuantity <= 0
    ) {

      return res.status(400).json({

        message:
          "Quantity must be at least 1",

      });

    }


    if (
      requestedQuantity >
      availableStock
    ) {

      return res.status(400).json({

        message:
          `Only ${availableStock} item(s) available in stock`,

      });

    }


    // ========================================
    // FIND CART
    // ========================================

    let cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    // ========================================
    // CREATE CART
    // ========================================

    if (!cart) {

      cart =
        new Cart({

          userId:
            req.userId,

          items: [],

        });

    }


    // ========================================
    // FIND EXISTING ITEM
    // ========================================

    const existingItem =
      cart.items.find(

        (item) =>
          Number(item.productId) ===
          productId

      );


    // ========================================
    // EXISTING PRODUCT
    // ========================================

    if (existingItem) {

      const currentQuantity =
        Number(
          existingItem.quantity || 0
        );


      const newQuantity =
        currentQuantity +
        requestedQuantity;


      if (
        newQuantity >
        availableStock
      ) {

        return res.status(400).json({

          message:
            `Only ${availableStock} item(s) available in stock`,

        });

      }


      existingItem.quantity =
        newQuantity;


      existingItem.title =
        product.title;

      existingItem.price =
        product.price;

      existingItem.thumbnail =
        product.thumbnail || "";

    }


    // ========================================
    // NEW PRODUCT
    // ========================================

    else {

      cart.items.push({

        productId:
          product.id,

        title:
          product.title,

        price:
          product.price,

        thumbnail:
          product.thumbnail || "",

        quantity:
          requestedQuantity,

      });

    }


    await cart.save();


    return res.status(200).json(
      cart.items
    );

  } catch (error) {

    console.error(
      "Add to cart error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to add product to cart",

    });

  }

};


// ========================================
// INCREASE QUANTITY
// ========================================

export const increaseQuantity = async (
  req,
  res
) => {

  try {

    const productId =
      Number(req.params.id);


    if (
      Number.isNaN(productId)
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    const cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    if (!cart) {

      return res.status(404).json({

        message:
          "Cart not found",

      });

    }


    const item =
      cart.items.find(

        (item) =>
          Number(item.productId) ===
          productId

      );


    if (!item) {

      return res.status(404).json({

        message:
          "Product not found in cart",

      });

    }


    // ========================================
    // GET CURRENT PRODUCT
    // ========================================

    const product =
      await Product.findOne({

        id:
          productId,

      });


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    const availableStock =
      Number(
        product.stock || 0
      );


    // ========================================
    // OUT OF STOCK
    // ========================================

    if (
      availableStock <= 0
    ) {

      return res.status(400).json({

        message:
          `${product.title} is out of stock`,

      });

    }


    const newQuantity =
      Number(item.quantity) + 1;


    // ========================================
    // STOCK LIMIT
    // ========================================

    if (
      newQuantity >
      availableStock
    ) {

      return res.status(400).json({

        message:
          `Only ${availableStock} item(s) available in stock`,

      });

    }


    item.quantity =
      newQuantity;


    await cart.save();


    return res.status(200).json(
      cart.items
    );

  } catch (error) {

    console.error(
      "Increase quantity error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to increase quantity",

    });

  }

};


// ========================================
// DECREASE QUANTITY
// ========================================

export const decreaseQuantity = async (
  req,
  res
) => {

  try {

    const productId =
      Number(req.params.id);


    if (
      Number.isNaN(productId)
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    const cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    if (!cart) {

      return res.status(404).json({

        message:
          "Cart not found",

      });

    }


    const item =
      cart.items.find(

        (item) =>
          Number(item.productId) ===
          productId

      );


    if (!item) {

      return res.status(404).json({

        message:
          "Product not found in cart",

      });

    }


    // ========================================
    // DECREASE
    // ========================================

    if (
      Number(item.quantity) > 1
    ) {

      item.quantity =
        Number(item.quantity) - 1;

    } else {

      cart.items =
        cart.items.filter(

          (item) =>
            Number(item.productId) !==
            productId

        );

    }


    await cart.save();


    return res.status(200).json(
      cart.items
    );

  } catch (error) {

    console.error(
      "Decrease quantity error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to decrease quantity",

    });

  }

};


// ========================================
// REMOVE FROM CART
// ========================================

export const removeFromCart = async (
  req,
  res
) => {

  try {

    const productId =
      Number(req.params.id);


    if (
      Number.isNaN(productId)
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    const cart =
      await Cart.findOne({

        userId:
          req.userId,

      });


    if (!cart) {

      return res.status(404).json({

        message:
          "Cart not found",

      });

    }


    const itemExists =
      cart.items.some(

        (item) =>
          Number(item.productId) ===
          productId

      );


    if (!itemExists) {

      return res.status(404).json({

        message:
          "Product not found in cart",

      });

    }


    // ========================================
    // REMOVE ITEM
    // ========================================

    cart.items =
      cart.items.filter(

        (item) =>
          Number(item.productId) !==
          productId

      );


    await cart.save();


    return res.status(200).json(
      cart.items
    );

  } catch (error) {

    console.error(
      "Remove cart item error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to remove product from cart",

    });

  }

};