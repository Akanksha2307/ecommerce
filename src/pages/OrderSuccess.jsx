import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getOrderById,
} from "../services/orderService";

import "./OrderSuccess.css";


function OrderSuccess() {

  // ========================================
  // GET ORDER ID FROM URL
  // ========================================

  const { id } = useParams();


  // ========================================
  // ORDER STATE
  // ========================================

  const [order, setOrder] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ========================================
  // LOAD ORDER
  // ========================================

  useEffect(() => {

    const loadOrder = async () => {

      try {

        const data =
          await getOrderById(id);

        setOrder(data);

      } catch (error) {

        console.error(
          "Order loading error:",
          error
        );

        setError(
          error.message ||
          "Unable to load order"
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      loadOrder();

    }

  }, [id]);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <section className="success-page">

        <div className="success-card">

          <h2>
            Loading your order...
          </h2>

        </div>

      </section>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !order) {

    return (

      <section className="success-page">

        <div className="success-card">

          <h2>
            Order not found
          </h2>

          <p>
            {error ||
              "We could not find your order."}
          </p>


          <Link
            to="/products"
            className="continue-shopping"
          >

            <ShoppingBag size={18} />

            Continue Shopping

          </Link>

        </div>

      </section>

    );

  }


  // ========================================
  // ORDER BILLING
  // ========================================

  return (

    <section className="success-page">

      <div className="success-card">


        {/* ==================================
            SUCCESS ICON
        ================================== */}

        <CheckCircle
          className="success-icon"
          size={80}
        />


        {/* ==================================
            TITLE
        ================================== */}

        <h1>
          Order Confirmed!
        </h1>


        <p>
          Thank you for shopping
          with GreenCart.
        </p>


        {/* ==================================
            ORDER NUMBER
        ================================== */}

        <div className="order-number">

          <span>
            Order Number
          </span>

          <strong>
            #{order.orderNumber}
          </strong>

        </div>


        {/* ==================================
            BILLING
        ================================== */}

        <div className="billing-box">

          <h2>
            Order Billing
          </h2>


          {/* ==================================
              CUSTOMER
          ================================== */}

          <div className="billing-row">

            <span>
              Customer
            </span>

            <strong>
              {order.customer?.name ||
                "Customer"}
            </strong>

          </div>


          {/* ==================================
              EMAIL
          ================================== */}

          <div className="billing-row">

            <span>
              Email
            </span>

            <strong>
              {order.customer?.email ||
                "-"}
            </strong>

          </div>


          {/* ==================================
              ORDER STATUS
          ================================== */}

          <div className="billing-row">

            <span>
              Order Status
            </span>

            <strong>
              {order.orderStatus ||
                "Placed"}
            </strong>

          </div>


          <hr />


          {/* ==================================
              PRODUCTS
          ================================== */}

          <h3>
            Products
          </h3>


          {order.items?.map(
            (item, index) => (

              <div
                className="billing-item"
                key={index}
              >

                <div>

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>


                <strong>

                  $
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}

                </strong>

              </div>

            )
          )}


          <hr />


          {/* ==================================
              SUBTOTAL
          ================================== */}

          <div className="billing-row">

            <span>
              Subtotal
            </span>

            <strong>

              $
              {Number(
                order.subtotal || 0
              ).toFixed(2)}

            </strong>

          </div>


          {/* ==================================
              SHIPPING
          ================================== */}

          <div className="billing-row">

            <span>
              Shipping
            </span>

            <strong>

              {Number(
                order.shippingCost || 0
              ) === 0

                ? "FREE"

                : `$${Number(
                    order.shippingCost
                  ).toFixed(2)}`}

            </strong>

          </div>


          {/* ==================================
              TAX
          ================================== */}

          <div className="billing-row">

            <span>
              Tax
            </span>

            <strong>

              $
              {Number(
                order.tax || 0
              ).toFixed(2)}

            </strong>

          </div>


          {/* ==================================
              TOTAL
          ================================== */}

          <div className="billing-total">

            <span>
              Total
            </span>

            <strong>

              $
              {Number(
                order.total || 0
              ).toFixed(2)}

            </strong>

          </div>

        </div>


        {/* ==================================
            CONTINUE SHOPPING
        ================================== */}

        <Link
          to="/products"
          className="continue-shopping"
        >

          <ShoppingBag size={18} />

          Continue Shopping

        </Link>


      </div>

    </section>

  );

}


export default OrderSuccess;