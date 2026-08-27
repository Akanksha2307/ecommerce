import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const seedProducts = async () => {
  try {

    // Connect to MongoDB
    await connectDB();

    // Remove existing products
    await Product.deleteMany();

    // Product data
    const products = [

      // ========================================
      // BEAUTY
      // ========================================

      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        price: 9.99,
        description:
          "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
        category: "beauty",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
        images: [],
        rating: 2.56,
      },

      {
        id: 2,
        title: "Eyeshadow Palette with Mirror",
        price: 19.99,
        description:
          "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks.",
        category: "beauty",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
        images: [],
        rating: 2.86,
      },

      {
        id: 3,
        title: "Powder Canister",
        price: 14.99,
        description:
          "The Powder Canister is a finely milled setting powder designed to set makeup and control shine.",
        category: "beauty",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
        images: [],
        rating: 4.64,
      },

      {
        id: 4,
        title: "Red Lipstick",
        price: 12.99,
        description:
          "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips.",
        category: "beauty",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
        images: [],
        rating: 4.36,
      },

      {
        id: 5,
        title: "Red Nail Polish",
        price: 8.99,
        description:
          "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails.",
        category: "beauty",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
        images: [],
        rating: 4.32,
      },


      // ========================================
      // FRAGRANCES
      // ========================================

      {
        id: 6,
        title: "Calvin Klein CK One",
        price: 49.99,
        description:
          "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent.",
        category: "fragrances",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
        images: [],
        rating: 4.37,
      },

      {
        id: 7,
        title: "Chanel Coco Noir Eau De",
        price: 129.99,
        description:
          "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood.",
        category: "fragrances",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
        images: [],
        rating: 4.26,
      },

      {
        id: 8,
        title: "Dior J'adore",
        price: 89.99,
        description:
          "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine.",
        category: "fragrances",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
        images: [],
        rating: 3.80,
      },

      {
        id: 9,
        title: "Dolce Shine Eau de",
        price: 69.99,
        description:
          "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods.",
        category: "fragrances",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
        images: [],
        rating: 3.96,
      },

      {
        id: 10,
        title: "Gucci Bloom Eau de",
        price: 79.99,
        description:
          "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper.",
        category: "fragrances",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
        images: [],
        rating: 2.74,
      },


      // ========================================
      // FURNITURE
      // ========================================

      {
        id: 11,
        title: "Annibale Colombo Bed",
        price: 1899.99,
        description:
          "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials.",
        category: "furniture",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
        images: [],
        rating: 4.77,
      },

      {
        id: 12,
        title: "Annibale Colombo Sofa",
        price: 2499.99,
        description:
          "The Annibale Colombo Sofa is a sophisticated and comfortable seating option with premium upholstery.",
        category: "furniture",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
        images: [],
        rating: 3.92,
      },

      {
        id: 13,
        title: "Bedside Table African Cherry",
        price: 299.99,
        description:
          "The Bedside Table in African Cherry is a stylish and functional addition to your bedroom.",
        category: "furniture",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
        images: [],
        rating: 2.87,
      },

      {
        id: 14,
        title: "Knoll Saarinen Executive Conference Chair",
        price: 499.99,
        description:
          "The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair.",
        category: "furniture",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
        images: [],
        rating: 4.88,
      },

      {
        id: 15,
        title: "Wooden Bathroom Sink With Mirror",
        price: 799.99,
        description:
          "The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom.",
        category: "furniture",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
        images: [],
        rating: 3.59,
      },


      // ========================================
      // GROCERIES
      // ========================================

      {
        id: 16,
        title: "Apple",
        price: 1.99,
        description:
          "Fresh and crisp apples, perfect for snacking or incorporating into various recipes.",
        category: "groceries",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
        images: [],
        rating: 4.19,
      },

      {
        id: 17,
        title: "Beef Steak",
        price: 12.99,
        description:
          "High-quality beef steak, great for grilling or cooking to your preferred level of doneness.",
        category: "groceries",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
        images: [],
        rating: 4.47,
      },

      {
        id: 18,
        title: "Cat Food",
        price: 8.99,
        description:
          "Nutritious cat food formulated to meet the dietary needs of your feline friend.",
        category: "groceries",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
        images: [],
        rating: 3.13,
      },

      {
        id: 19,
        title: "Chicken Meat",
        price: 9.99,
        description:
          "Fresh and tender chicken meat, suitable for various culinary preparations.",
        category: "groceries",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
        images: [],
        rating: 3.19,
      },

      {
        id: 20,
        title: "Cooking Oil",
        price: 4.99,
        description:
          "Versatile cooking oil suitable for frying, sautéing, and various culinary applications.",
        category: "groceries",
        thumbnail:
          "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
        images: [],
        rating: 4.80,
      },

    ];

// ========================================
// ADD RANDOM STOCK
// ========================================

products.forEach((product) => {

  product.stock =
    Math.floor(
      Math.random() * 96
    ) + 5;

});


// ========================================
// INSERT PRODUCTS INTO MONGODB
// ========================================

await Product.insertMany(products);


    console.log(
      `${products.length} products seeded successfully`
    );


    // ========================================
    // CLOSE DATABASE CONNECTION
    // ========================================

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.error(
      "Error seeding products:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();