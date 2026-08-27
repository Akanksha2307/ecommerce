import {
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-brand">

          <h2>GreenCart</h2>

          <p>
            Simple shopping. Better choices.
          </p>

          <div className="footer-contact">

            <p>
              <Mail size={17} />
              support@greencart.com
            </p>

            <p>
              <Phone size={17} />
              +91 98765 43210
            </p>

            <p>
              <MapPin size={17} />
              Hyderabad, India
            </p>

          </div>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/cart">
            Cart
          </Link>

        </div>


        {/* CUSTOMER SERVICE */}

        <div className="footer-links">

          <h3>Customer Service</h3>

          <Link to="/products">
            Shop
          </Link>

          <Link to="/cart">
            Shopping Cart
          </Link>

          <Link to="/checkout">
            Checkout
          </Link>

          <Link to="/products">
            Help Center
          </Link>

        </div>


        {/* ABOUT */}

        <div className="footer-about">

          <h3>GreenCart</h3>

          <p>
            Discover products you'll love with
            a simple and enjoyable shopping
            experience.
          </p>

          <div className="footer-love">
            Made with
            <Heart
              size={16}
              fill="currentColor"
            />
            for shoppers
          </div>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 GreenCart. All rights reserved.
        </p>

        <p>
          Privacy Policy&nbsp;&nbsp; | &nbsp;&nbsp;
          Terms & Conditions
        </p>

      </div>

    </footer>
  );
}

export default Footer;