import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/slices/cartSlice";

import {
  toggleWishlist,
} from "../redux/slices/wishlistSlice";

import "./ProductCard.css";


function ProductCard({
  product,
}) {

  const dispatch =
    useDispatch();


  // ========================================
  // CART
  // ========================================

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
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
  // FIND CART ITEM
  // ========================================

  const cartItem =
    cartItems.find(

      (item) =>
        Number(
          item.productId
        ) ===
        Number(
          product.id
        )

    );


  // ========================================
  // WISHLIST STATUS
  // ========================================

  const isWishlisted =
    wishlistItems.some(

      (item) =>
        Number(
          item.productId
        ) ===
        Number(
          product.id
        )

    );


  // ========================================
  // CURRENT STOCK
  // ========================================

  const stock =
    Number(
      product.stock
    );


  const isOutOfStock =
    !Number.isFinite(stock) ||
    stock <= 0;


  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart =
    () => {

      if (
        isOutOfStock
      ) {

        return;

      }


      dispatch(
        addToCart(
          product
        )
      );

    };


  // ========================================
  // INCREASE
  // ========================================

  const handleIncrease =
    () => {

      if (
        !cartItem
      ) {

        return;

      }


      if (
        isOutOfStock
      ) {

        return;

      }


      const currentQuantity =
        Number(
          cartItem.quantity
        );


      if (
        currentQuantity >=
        stock
      ) {

        return;

      }


      dispatch(
        increaseQuantity(
          product.id
        )
      );

    };


  // ========================================
  // DECREASE
  // ========================================

  const handleDecrease =
    () => {

      if (
        !cartItem
      ) {

        return;

      }


      dispatch(
        decreaseQuantity(
          product.id
        )
      );

    };


  // ========================================
  // WISHLIST
  // ========================================

  const handleWishlist =
    () => {

      dispatch(
        toggleWishlist(
          product
        )
      );

    };


  return (

    <div className="product-card">


      {/* ========================================
          WISHLIST
      ======================================== */}

      <button
        type="button"
        className={`wishlist-button ${
          isWishlisted
            ? "liked"
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


      {/* ========================================
          PRODUCT IMAGE
      ======================================== */}

      <Link
        to={`/product/${product.id}`}
      >

        <div className="product-image">

          <img
            src={
              product.thumbnail ||
              product.images?.[0] ||
              product.image ||
              ""
            }
            alt={
              product.title
            }
          />

        </div>

      </Link>


      {/* ========================================
          PRODUCT INFORMATION
      ======================================== */}

      <div className="product-info">


        {/* CATEGORY */}

        <p className="product-category">

          {product.category}

        </p>


        {/* TITLE */}

        <Link
          to={`/product/${product.id}`}
        >

          <h3>
            {product.title}
          </h3>

        </Link>


        {/* ========================================
            RATING
        ======================================== */}

        <div className="rating">

          <Star
            size={16}
            fill="currentColor"
          />

          <span>

            {
              typeof product.rating ===
              "object"

                ? product.rating?.rate || 0

                : product.rating || 0
            }

          </span>

        </div>


        {/* ========================================
            PRICE + CART
        ======================================== */}

        <div className="product-bottom">


          {/* PRICE */}

          <strong>

            $
            {Number(
              product.price || 0
            ).toFixed(2)}

          </strong>


          {/* ========================================
              OUT OF STOCK
          ======================================== */}

          {isOutOfStock ? (

            <button
              type="button"
              className="add-cart-button out-of-stock-button"
              disabled
            >

              <span>
                Out of Stock
              </span>

            </button>

          ) : !cartItem ? (

            /* ======================================
               ADD TO CART
            ====================================== */

            <button
              type="button"
              className="add-cart-button"
              onClick={
                handleAddToCart
              }
            >

              <ShoppingCart
                size={18}
              />

              <span>
                Add
              </span>

            </button>

          ) : (

            /* ======================================
               QUANTITY CONTROL
            ====================================== */

            <div className="quantity-control">


              {/* DECREASE */}

              <button
                type="button"
                onClick={
                  handleDecrease
                }
              >

                <Minus
                  size={15}
                />

              </button>


              {/* QUANTITY */}

              <span>
                {cartItem.quantity}
              </span>


              {/* INCREASE */}

              <button
                type="button"
                onClick={
                  handleIncrease
                }
                disabled={
                  isOutOfStock ||
                  Number(
                    cartItem.quantity
                  ) >= stock
                }
              >

                <Plus
                  size={15}
                />

              </button>

            </div>

          )}

        </div>


        {/* ========================================
            LOW STOCK
        ======================================== */}

        {!isOutOfStock &&
          stock <= 5 && (

            <p className="low-stock-message">

              Only {stock} left in stock

            </p>

          )}


      </div>

    </div>

  );

}


export default ProductCard;