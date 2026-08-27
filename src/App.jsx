import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";


// ======================================================
// COMMON COMPONENTS
// ======================================================

import Navbar
  from "./components/Navbar";

import Footer
  from "./components/Footer";

import ScrollToTop
  from "./components/ScrollToTop";

import ProtectedRoute
  from "./components/ProtectedRoute";

import AdminRoute
  from "./components/AdminRoute";


// ======================================================
// USER PAGES
// ======================================================

import Login
  from "./pages/Login";

import Register
  from "./pages/Register";

import Home
  from "./pages/Home";

import Products
  from "./pages/Products";

import ProductDetails
  from "./pages/ProductDetails";

import Cart
  from "./pages/Cart";

import Wishlist
  from "./pages/Wishlist";

import Checkout
  from "./pages/Checkout";

import OrderSuccess
  from "./pages/OrderSuccess";

import Orders
  from "./pages/Orders";


// ======================================================
// ADMIN PAGES
// ======================================================

import AdminLogin
  from "./pages/AdminLogin";

import AdminDashboard
  from "./pages/AdminDashboard";


// ======================================================
// SUPER ADMIN PAGES
// ======================================================

import SuperAdminLogin
  from "./pages/SuperAdminLogin";

import SuperAdminDashboard
  from "./pages/SuperAdminDashboard";


// ======================================================
// REDUX
// ======================================================

import {
  loadUserCart,
} from "./redux/slices/cartSlice";

import {
  loadUserWishlist,
} from "./redux/slices/wishlistSlice";


// ======================================================
// GLOBAL CSS
// ======================================================

import "./App.css";


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      {/* ================================================
          SCROLL TO TOP
      ================================================ */}

      <ScrollToTop />


      <Routes>


        {/* ==================================================
            USER LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* ==================================================
            USER REGISTER
        ================================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ==================================================
            NORMAL ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />


        {/* ==================================================
            NORMAL ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/admin"
          element={

            <AdminRoute>

              <AdminDashboard />

            </AdminRoute>

          }
        />


        {/* ==================================================
            SUPER ADMIN LOGIN
        ================================================== */}

        <Route
          path="/super-admin/login"
          element={
            <SuperAdminLogin />
          }
        />


        {/* ==================================================
            SUPER ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/super-admin"
          element={
            <SuperAdminDashboard />
          }
        />


        {/* ==================================================
            USER APPLICATION
            EVERYTHING BELOW IS PROTECTED
        ================================================== */}

        <Route
          path="/*"
          element={

            <ProtectedRoute>

              <Application />

            </ProtectedRoute>

          }
        />


      </Routes>

    </BrowserRouter>

  );

}


// ======================================================
// USER APPLICATION
// ======================================================

function Application() {

  const dispatch =
    useDispatch();


  // ====================================================
  // LOAD USER CART + WISHLIST
  // ====================================================

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      return;

    }


    dispatch(
      loadUserCart()
    );


    dispatch(
      loadUserWishlist()
    );

  }, [dispatch]);


  return (

    <>

      {/* ==================================================
          USER NAVBAR
      ================================================== */}

      <Navbar />


      {/* ==================================================
          USER MAIN CONTENT
      ================================================== */}

      <main>

        <Routes>


          {/* ==================================================
              HOME
          ================================================== */}

          <Route
            path="/"
            element={
              <Home />
            }
          />


          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <Route
            path="/products"
            element={
              <Products />
            }
          />


          {/* ==================================================
              PRODUCT DETAILS
          ================================================== */}

          <Route
            path="/product/:id"
            element={
              <ProductDetails />
            }
          />


          {/* ==================================================
              CART
          ================================================== */}

          <Route
            path="/cart"
            element={
              <Cart />
            }
          />


          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Route
            path="/wishlist"
            element={
              <Wishlist />
            }
          />


          {/* ==================================================
              CHECKOUT
          ================================================== */}

          <Route
            path="/checkout"
            element={
              <Checkout />
            }
          />


          {/* ==================================================
              ORDERS
          ================================================== */}

          <Route
            path="/orders"
            element={
              <Orders />
            }
          />


          {/* ==================================================
              ORDER SUCCESS
          ================================================== */}

          <Route
            path="/order-success/:id"
            element={
              <OrderSuccess />
            }
          />


          {/* ==================================================
              UNKNOWN USER ROUTE
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />


        </Routes>

      </main>


      {/* ==================================================
          USER FOOTER
      ================================================== */}

      <Footer />

    </>

  );

}


export default App;