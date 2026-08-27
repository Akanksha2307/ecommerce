import { useState } from "react";
import "./Navbar.css";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  Store,
} from "lucide-react";

import {
  useSelector,
} from "react-redux";

import ThemeToggle from "./ThemeToggle";


function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate =
    useNavigate();

  // ========================================
  // CART ITEMS FROM REDUX
  // ========================================

  const cartItems =
    useSelector(
      (state) =>
        state.cart.items
    );

  // ========================================
  // WISHLIST ITEMS FROM REDUX
  // ========================================

  const wishlistItems =
    useSelector(
      (state) =>
        state.wishlist.items
    );

  // ========================================
  // CART COUNT
  // ========================================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    );

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setMenuOpen(false);

    navigate("/login");
  };


  return (

    <header className="navbar">

      <div className="nav-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="logo"
        >

          <Store size={27} />

          <span>
            GreenCart
          </span>

        </Link>


        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          className="mobile-menu"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >

          {menuOpen
            ? <X />
            : <Menu />}

        </button>


        {/* =========================
            NAVIGATION
        ========================= */}

        <nav
          className={
            menuOpen
              ? "nav-links open"
              : "nav-links"
          }
        >

          {/* HOME */}

          <NavLink
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </NavLink>


          {/* PRODUCTS */}

          <NavLink
            to="/products"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Products
          </NavLink>


          {/* WISHLIST */}

          <NavLink
            to="/wishlist"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Wishlist
          </NavLink>


          {/* CART */}

          <NavLink
            to="/cart"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Cart
          </NavLink>


          {/* ORDERS */}

          <NavLink
            to="/orders"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Orders
          </NavLink>


          {/* LOGOUT */}

          <button
            className="nav-logout"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </nav>


        {/* =========================
            WISHLIST, CART & THEME
        ========================= */}

        <div className="nav-actions">

          {/* THEME */}

          <ThemeToggle />


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="nav-icon"
          >

            <Heart size={22} />

            {wishlistItems.length >
              0 && (

              <span>
                {
                  wishlistItems.length
                }
              </span>

            )}

          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="nav-icon"
          >

            <ShoppingCart
              size={22}
            />

            {cartCount > 0 && (

              <span>
                {cartCount}
              </span>

            )}

          </Link>

        </div>

      </div>

    </header>

  );
}


export default Navbar;