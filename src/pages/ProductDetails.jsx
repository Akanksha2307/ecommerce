import { useEffect } from "react";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProducts,
} from "../redux/slices/productSlice";

import {
  addToCart,
} from "../redux/slices/cartSlice";

import {
  toggleWishlist,
} from "../redux/slices/wishlistSlice";

import Loader from "../components/Loader";

import "./ProductDetails.css";


function ProductDetails() {

  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();


  const dispatch =
    useDispatch();


  // ========================================
  // PRODUCTS
  // ========================================

  const {
    items: products,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.products
  );


  // ========================================
  // WISHLIST
  // ========================================

  const wishlistItems =
    useSelector(
      (state) =>
        state.wishlist.items
    );


  // ========================================
  // FETCH PRODUCTS
  // ========================================

  useEffect(() => {

    if (
      products.length === 0
    ) {

      dispatch(
        fetchProducts()
      );

    }

  }, [
    dispatch,
    products.length,
  ]);


  // ========================================
  // FIND PRODUCT
  // ========================================

  const product =
    products.find(

      (item) =>
        item.id ===
        Number(id)

    );


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return <Loader />;

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <div className="product-error">

        <h2>
          {error}
        </h2>

        <Link to="/products">
          Back to Products
        </Link>

      </div>

    );

  }


  // ========================================
  // PRODUCT NOT FOUND
  // ========================================

  if (!product) {

    return (

      <div className="product-error">

        <h2>
          Product not found
        </h2>

        <Link to="/products">
          Back to Products
        </Link>

      </div>

    );

  }


  // ========================================
  // WISHLIST
  // ========================================

  const isWishlisted =
    wishlistItems.some(

      (item) =>
        Number(item.productId) ===
        Number(product.id)

    );


  // ========================================
  // STOCK
  // ========================================

  const stock =
    Number(
      product.stock || 0
    );


  const isOutOfStock =
    stock <= 0;


  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = () => {

    if (
      isOutOfStock
    ) {

      return;

    }


    dispatch(
      addToCart(product)
    );

  };


  // ========================================
  // WISHLIST
  // ========================================

  const handleWishlist = () => {

    dispatch(
      toggleWishlist(product)
    );

  };


  // ========================================
  // BUY NOW
  // ========================================

  const handleBuyNow = () => {

    if (
      isOutOfStock
    ) {

      return;

    }


    dispatch(
      addToCart(product)
    );


    navigate("/cart");

  };


  return (

    <section className="details-page">

      <div className="container">


        {/* BACK */}

        <Link
          to="/products"
          className="back-link"
        >

          <ArrowLeft
            size={18}
          />

          Back to Products

        </Link>


        <div className="details-grid">


          {/* PRODUCT IMAGE */}

          <div className="details-image">

            <img
              src={
                product.thumbnail ||
                product.images?.[0] ||
                product.image
              }
              alt={
                product.title
              }
            />

          </div>


          {/* PRODUCT INFORMATION */}

          <div className="details-content">


            {/* CATEGORY */}

            <span className="details-category">

              {product.category}

            </span>


            {/* TITLE */}

            <h1>
              {product.title}
            </h1>


            {/* RATING */}

            <div className="details-rating">

              <Star
                size={20}
                fill="currentColor"
              />

              <strong>

                {
                  typeof product.rating ===
                  "object"

                    ? product.rating?.rate || 0

                    : product.rating || 0
                }

              </strong>

              <span>

                (
                {
                  typeof product.rating ===
                  "object"

                    ? product.rating?.count || 0

                    : 0
                }
                {" "}reviews)

              </span>

            </div>


            {/* PRICE */}

            <h2 className="details-price">

              $
              {Number(
                product.price
              ).toFixed(2)}

            </h2>


            {/* STOCK MESSAGE */}

            {isOutOfStock ? (

              <div className="stock-message out-of-stock-message">

                Out of Stock

              </div>

            ) : (

              <div className="stock-message in-stock-message">

                {stock} item
                {stock !== 1
                  ? "s"
                  : ""}{" "}
                available

              </div>

            )}


            {/* DESCRIPTION */}

            <p className="details-description">

              {product.description}

            </p>


            {/* ACTIONS */}

            <div className="details-actions">


              {/* ADD TO CART */}

              <button
                className={`add-cart-large ${
                  isOutOfStock
                    ? "out-of-stock-button"
                    : ""
                }`}
                onClick={
                  handleAddToCart
                }
                disabled={
                  isOutOfStock
                }
              >

                <ShoppingCart
                  size={20}
                />

                {isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}

              </button>


              {/* WISHLIST */}

              <button
                className={`wishlist-large ${
                  isWishlisted
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleWishlist
                }
              >

                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />

              </button>

            </div>


            {/* BUY NOW */}

            <button
              className={`buy-now ${
                isOutOfStock
                  ? "out-of-stock-button"
                  : ""
              }`}
              onClick={
                handleBuyNow
              }
              disabled={
                isOutOfStock
              }
            >

              {isOutOfStock
                ? "Out of Stock"
                : "Buy Now"}

            </button>


          </div>

        </div>

      </div>

    </section>

  );

}


export default ProductDetails;