import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";


// ========================================
// GET USER WISHLIST
// ========================================

export const getWishlist = async (
  req,
  res
) => {

  try {

    let wishlist =
      await Wishlist.findOne({
        userId:
          req.userId,
      });


    // ========================================
    // CREATE EMPTY WISHLIST
    // ========================================

    if (!wishlist) {

      wishlist =
        await Wishlist.create({

          userId:
            req.userId,

          items: [],

        });

    }


    // ========================================
    // GET CURRENT PRODUCT STOCK
    // FROM PRODUCT COLLECTION
    // ========================================

    const wishlistItems =
      await Promise.all(

        wishlist.items.map(
          async (item) => {

            const product =
              await Product.findOne({

                id:
                  Number(
                    item.productId
                  ),

              });


            return {

              productId:
                item.productId,

              title:
                item.title,

              price:
                item.price,

              thumbnail:
                item.thumbnail || "",

              category:
                item.category || "",

              rating:
                item.rating || 0,

              // IMPORTANT
              // Get CURRENT stock
              // from Product collection

              stock:
                product
                  ? Number(
                      product.stock || 0
                    )
                  : 0,

            };

          }
        )

      );


    return res.status(200).json(
      wishlistItems
    );


  } catch (error) {

    console.error(
      "Get wishlist error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch wishlist",

    });

  }

};


// ========================================
// ADD TO WISHLIST
// ========================================

export const addToWishlist = async (
  req,
  res
) => {

  try {

    const {
      id,
      title,
      price,
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


    // ========================================
    // NORMALIZE PRODUCT ID
    // ========================================

    const numericProductId =
      Number(id);


    if (
      Number.isNaN(
        numericProductId
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    // ========================================
    // FIND PRODUCT
    // ========================================

    const product =
      await Product.findOne({

        id:
          numericProductId,

      });


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found",

      });

    }


    // ========================================
    // FIND WISHLIST
    // ========================================

    let wishlist =
      await Wishlist.findOne({

        userId:
          req.userId,

      });


    // ========================================
    // CREATE WISHLIST
    // ========================================

    if (!wishlist) {

      wishlist =
        new Wishlist({

          userId:
            req.userId,

          items: [],

        });

    }


    // ========================================
    // CHECK EXISTING PRODUCT
    // ========================================

    const existingItem =
      wishlist.items.find(

        (item) =>
          Number(
            item.productId
          ) ===
          numericProductId

      );


    // ========================================
    // ADD PRODUCT
    // ========================================

    if (!existingItem) {

      wishlist.items.push({

        productId:
          numericProductId,

        title:
          product.title,

        price:
          product.price,

        thumbnail:
          product.thumbnail ||
          "",

        category:
          product.category ||
          "",

        rating:
          typeof product.rating ===
          "object"

            ? Number(
                product.rating?.rate
              ) || 0

            : Number(
                product.rating
              ) || 0,

      });

    }


    await wishlist.save();


    // ========================================
    // RETURN WISHLIST WITH CURRENT STOCK
    // ========================================

    const wishlistItems =
      await Promise.all(

        wishlist.items.map(
          async (item) => {

            const currentProduct =
              await Product.findOne({

                id:
                  Number(
                    item.productId
                  ),

              });


            return {

              productId:
                item.productId,

              title:
                item.title,

              price:
                item.price,

              thumbnail:
                item.thumbnail ||
                "",

              category:
                item.category ||
                "",

              rating:
                item.rating ||
                0,

              // CURRENT STOCK

              stock:
                currentProduct
                  ? Number(
                      currentProduct.stock ||
                      0
                    )
                  : 0,

            };

          }
        )

      );


    return res.status(200).json(
      wishlistItems
    );


  } catch (error) {

    console.error(
      "Add wishlist error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to add to wishlist",

    });

  }

};


// ========================================
// REMOVE FROM WISHLIST
// ========================================

export const removeFromWishlist = async (
  req,
  res
) => {

  try {

    // ========================================
    // GET PRODUCT ID
    // ========================================

    const productId =
      Number(
        req.params.id
      );


    if (
      Number.isNaN(productId)
    ) {

      return res.status(400).json({

        message:
          "Invalid product ID",

      });

    }


    // ========================================
    // FIND USER WISHLIST
    // ========================================

    const wishlist =
      await Wishlist.findOne({

        userId:
          req.userId,

      });


    if (!wishlist) {

      return res.status(404).json({

        message:
          "Wishlist not found",

      });

    }


    // ========================================
    // REMOVE PRODUCT
    // ========================================

    wishlist.items =
      wishlist.items.filter(

        (item) =>
          Number(
            item.productId
          ) !==
          productId

      );


    await wishlist.save();


    // ========================================
    // RETURN REMAINING ITEMS
    // WITH CURRENT STOCK
    // ========================================

    const wishlistItems =
      await Promise.all(

        wishlist.items.map(
          async (item) => {

            const product =
              await Product.findOne({

                id:
                  Number(
                    item.productId
                  ),

              });


            return {

              productId:
                item.productId,

              title:
                item.title,

              price:
                item.price,

              thumbnail:
                item.thumbnail ||
                "",

              category:
                item.category ||
                "",

              rating:
                item.rating ||
                0,

              stock:
                product
                  ? Number(
                      product.stock ||
                      0
                    )
                  : 0,

            };

          }
        )

      );


    return res.status(200).json(
      wishlistItems
    );


  } catch (error) {

    console.error(
      "Remove wishlist error:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to remove wishlist item",

    });

  }

};