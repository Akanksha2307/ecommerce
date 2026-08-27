import {
  useEffect,
  useState,
} from "react";

import {
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  getUserOrders,
} from "../services/orderService";

import "./Orders.css";


function Orders() {

  // ========================================
  // ORDERS
  // ========================================

  const [orders, setOrders] =
    useState([]);


  // ========================================
  // LOADING
  // ========================================

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // ERROR
  // ========================================

  const [error, setError] =
    useState("");


  // ========================================
  // LOAD USER ORDERS
  // ========================================

  useEffect(() => {

    const loadOrders = async () => {

      try {

        const data =
          await getUserOrders();

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Orders loading error:",
          error
        );

        setError(
          error.message ||
          "Failed to load orders"
        );

      } finally {

        setLoading(false);

      }

    };


    loadOrders();

  }, []);


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <section className="orders-page">

        <div className="orders-container">

          <h1>
            My Orders
          </h1>

          <div className="orders-message">

            Loading your orders...

          </div>

        </div>

      </section>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <section className="orders-page">

        <div className="orders-container">

          <h1>
            My Orders
          </h1>

          <div className="orders-message error">

            {error}

          </div>

        </div>

      </section>

    );

  }


  // ========================================
  // NO ORDERS
  // ========================================

  if (orders.length === 0) {

    return (

      <section className="orders-page">

        <div className="orders-container">

          <div className="orders-header">

            <span>
              ORDERS
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              You have not placed any
              orders yet.
            </p>

          </div>


          <div className="no-orders">

            <Package
              size={60}
            />

            <h2>
              No Orders Yet
            </h2>

            <p>
              Start shopping and your
              orders will appear here.
            </p>


            <Link
              to="/products"
              className="shop-button"
            >

              <ShoppingBag
                size={18}
              />

              Start Shopping

            </Link>

          </div>

        </div>

      </section>

    );

  }


  // ========================================
  // ORDERS PAGE
  // ========================================

  return (

    <section className="orders-page">

      <div className="orders-container">


        {/* ==================================
            HEADER
        ================================== */}

        <div className="orders-header">

          <span>
            ORDERS
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            View all your previous orders.
          </p>

        </div>


        {/* ==================================
            ORDER LIST
        ================================== */}

        <div className="orders-list">

          {orders.map(
            (order) => (

              <div
                className="order-card"
                key={order._id}
              >


                {/* ==========================
                    ORDER HEADER
                ========================== */}

                <div className="order-card-header">

                  <div>

                    <span>
                      Order Number
                    </span>

                    <strong>
                      #{order.orderNumber}
                    </strong>

                  </div>


                  <div
                    className="order-status"
                  >

                    {
                      order.orderStatus ||
                      "Placed"
                    }

                  </div>

                </div>


                {/* ==========================
                    ORDER DATE
                ========================== */}

                <div className="order-date">

                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "-"}

                </div>


                {/* ==========================
                    PRODUCTS
                ========================== */}

                <div className="order-products">

                  <h3>
                    Products
                  </h3>


                  {order.items?.map(
                    (item, index) => (

                      <div
                        className="order-product"
                        key={index}
                      >

                        <div>

                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            Quantity: {
                              item.quantity
                            }
                          </span>

                        </div>


                        <strong>

                          $
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toFixed(2)}

                        </strong>

                      </div>

                    )
                  )}

                </div>


                {/* ==========================
                    ORDER TOTAL
                ========================== */}

                <div className="order-summary">

                  <div>

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


                  <div>

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


                  <div>

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


                  <div className="order-total">

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


                {/* ==========================
                    VIEW BILLING
                ========================== */}

                <Link
                  to={`/order-success/${order._id}`}
                  className="view-order"
                >

                  View Order

                </Link>


              </div>

            )
          )}

        </div>

      </div>

    </section>

  );

}


export default Orders;