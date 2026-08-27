import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";

import "./Cart.css";


function Cart() {

  const dispatch =
    useDispatch();


  const navigate =
    useNavigate();


  // ========================================
  // CART
  // ========================================

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );


  // ========================================
  // CART ERROR
  // ========================================

  const cartError =
    useSelector(
      (state) =>
        state.cart.error
    );


  // ========================================
  // SUBTOTAL
  // ========================================

  const subtotal =
    cartItems.reduce(

      (total, item) =>
        total +
        Number(item.price) *
        Number(item.quantity),

      0

    );


  // ========================================
  // SHIPPING
  // ========================================

  const shipping =
    subtotal > 50 ||
    subtotal === 0
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
    shipping +
    tax;


  // ========================================
  // EMPTY CART
  // ========================================

  if (
    cartItems.length === 0
  ) {

    return (

      <section className="empty-cart">

        <ShoppingBag
          size={70}
        />

        <h1>
          Your cart is empty
        </h1>

        <p>
          Looks like you haven't
          added anything yet.
        </p>

        <Link
          to="/products"
          className="shop-button"
        >

          Start Shopping

        </Link>

      </section>

    );

  }


  return (

    <section className="cart-page">

      <div className="container">


        {/* HEADER */}

        <div className="cart-header">

          <span>
            SHOPPING BAG
          </span>

          <h1>
            Your Cart
          </h1>

        </div>


        {/* ERROR */}

        {cartError && (

          <div className="cart-stock-error">

            {cartError}

          </div>

        )}


        <div className="cart-layout">


          {/* CART ITEMS */}

          <div className="cart-items">

            {cartItems.map(

              (item) => (

                <div
                  className="cart-item"
                  key={
                    item.productId
                  }
                >


                  {/* IMAGE */}

                  <img
                    src={
                      item.thumbnail ||
                      ""
                    }
                    alt={
                      item.title
                    }
                  />


                  {/* INFORMATION */}

                  <div className="cart-item-info">

                    <h3>
                      {item.title}
                    </h3>

                    <p>

                      $
                      {Number(
                        item.price
                      ).toFixed(2)}

                    </p>


                    {/* QUANTITY */}

                    <div className="quantity">

                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity(
                              item.productId
                            )
                          )
                        }
                      >

                        <Minus
                          size={15}
                        />

                      </button>


                      <span>
                        {item.quantity}
                      </span>


                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity(
                              item.productId
                            )
                          )
                        }
                      >

                        <Plus
                          size={15}
                        />

                      </button>

                    </div>

                  </div>


                  {/* PRICE */}

                  <div className="cart-item-right">

                    <strong>

                      $
                      {(
                        Number(
                          item.price
                        ) *
                        Number(
                          item.quantity
                        )
                      ).toFixed(2)}

                    </strong>


                    <button
                      className="delete-button"
                      onClick={() =>
                        dispatch(
                          removeFromCart(
                            item.productId
                          )
                        )
                      }
                    >

                      <Trash2
                        size={18}
                      />

                    </button>

                  </div>

                </div>

              )

            )}

          </div>


          {/* ORDER SUMMARY */}

          <div className="order-summary">

            <h2>
              Order Summary
            </h2>


            <div>

              <span>
                Subtotal
              </span>

              <strong>

                $
                {subtotal.toFixed(2)}

              </strong>

            </div>


            <div>

              <span>
                Shipping
              </span>

              <strong>

                {shipping === 0
                  ? "FREE"
                  : `$${shipping.toFixed(2)}`}

              </strong>

            </div>


            <div>

              <span>
                Tax
              </span>

              <strong>

                $
                {tax.toFixed(2)}

              </strong>

            </div>


            <hr />


            <div className="total-row">

              <span>
                Total
              </span>

              <strong>

                $
                {total.toFixed(2)}

              </strong>

            </div>


            {/* CHECKOUT */}

            <button
              className="checkout-button"
              onClick={() =>
                navigate("/checkout")
              }
            >

              Checkout

              <ArrowRight
                size={18}
              />

            </button>

          </div>

        </div>

      </div>

    </section>

  );

}


export default Cart;