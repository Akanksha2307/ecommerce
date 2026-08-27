import {
  useState,
} from "react";

import {
  MapPin,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  clearCart,
} from "../redux/slices/cartSlice";

import {
  createOrder,
} from "../services/orderService";

import "./Checkout.css";


function Checkout() {

  const navigate =
    useNavigate();


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
  // BILL
  // ========================================

  const subtotal =
    cartItems.reduce(

      (total, item) =>
        total +
        Number(item.price) *
        Number(item.quantity),

      0

    );


  const shipping =
    subtotal > 50
      ? 0
      : 5.99;


  const tax =
    subtotal * 0.08;


  const total =
    subtotal +
    shipping +
    tax;


  // ========================================
  // FORM
  // ========================================

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      phone: "",

      address: "",

      city: "",

      state: "",

      zip: "",

    });


  // ========================================
  // LOADING
  // ========================================

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);


  // ========================================
  // ERROR
  // ========================================

  const [
    orderError,
    setOrderError,
  ] = useState("");


  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (
    e
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };


  // ========================================
  // PLACE ORDER
  // ========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        placingOrder
      ) {

        return;

      }


      setPlacingOrder(true);

      setOrderError("");


      try {

        const data =
          await createOrder({

            name:
              form.name,

            email:
              form.email,

            phone:
              form.phone,

            address:
              form.address,

            city:
              form.city,

            state:
              form.state,

            zip:
              form.zip,

          });


        // ==================================
        // SUCCESS
        // ==================================

        dispatch(
          clearCart()
        );


        navigate(
          `/order-success/${data.order._id}`
        );

      } catch (error) {

        console.error(
          "Order placement error:",
          error
        );


        setOrderError(

          error.message ||
          "Failed to place order"

        );

      } finally {

        setPlacingOrder(
          false
        );

      }

    };


  // ========================================
  // EMPTY CART
  // ========================================

  if (
    cartItems.length === 0
  ) {

    return (

      <div className="checkout-empty">

        <h1>
          Your cart is empty
        </h1>

      </div>

    );

  }


  return (

    <section className="checkout-page">

      <div className="container">


        {/* HEADER */}

        <div className="checkout-header">

          <span>
            CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

        </div>


        {/* ERROR */}

        {orderError && (

          <div className="checkout-stock-error">

            {orderError}

          </div>

        )}


        <form
          className="checkout-layout"
          onSubmit={
            handleSubmit
          }
        >


          {/* LEFT */}

          <div className="checkout-form">


            {/* SHIPPING */}

            <div className="checkout-section">

              <div className="checkout-title">

                <MapPin />

                <h2>
                  Shipping Information
                </h2>

              </div>


              <div className="form-grid">


                <input
                  name="name"
                  placeholder="Full Name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="address"
                  placeholder="Address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="city"
                  placeholder="City"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="state"
                  placeholder="State"
                  value={
                    form.state
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                <input
                  name="zip"
                  placeholder="ZIP Code"
                  value={
                    form.zip
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>


            {/* PLACE ORDER */}

            <button
              type="submit"
              className="place-order"
              disabled={
                placingOrder
              }
            >

              {placingOrder
                ? "Checking Stock..."
                : "Place Order"}

            </button>

          </div>


          {/* RIGHT - SUMMARY */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            {cartItems.map(

              (item) => (

                <div
                  className="summary-item"
                  key={
                    item.productId
                  }
                >

                  <span>

                    {item.title.slice(
                      0,
                      25
                    )}

                    {item.title.length >
                      25 &&
                      "..."}

                    {" × "}

                    {item.quantity}

                  </span>


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

                </div>

              )

            )}


            <hr />


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


            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>

                $
                {total.toFixed(2)}

              </strong>

            </div>

          </div>

        </form>

      </div>

    </section>

  );

}


export default Checkout;