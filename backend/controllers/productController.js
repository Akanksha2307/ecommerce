import Product from "../models/Product.js";


// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async (req, res) => {

  try {

    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {

    console.error(
      "Error fetching products:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch products",
    });

  }

};


// ========================================
// GET SINGLE PRODUCT
// ========================================

export const getProductById = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findOne({
        id: Number(req.params.id),
      });


    if (!product) {

      return res.status(404).json({
        message: "Product not found",
      });

    }


    res.status(200).json(product);

  } catch (error) {

    console.error(
      "Error fetching product:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch product",
    });

  }

};