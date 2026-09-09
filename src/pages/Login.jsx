import { useState } from "react";
import {Link,useNavigate,} from "react-router-dom";
import {useDispatch,} from "react-redux";
import {LogIn,} from "lucide-react";
import {GoogleLogin,} from "@react-oauth/google";
import {loginUser,} from "../services/authService";
import {loadUserCart,} from "../redux/slices/cartSlice";
import {loadUserWishlist,} from "../redux/slices/wishlistSlice";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ========================================
  // LOGIN FORM
  // ========================================

  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  // ========================================
  // ERROR + LOADING
  // ========================================

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setError("");

  };

  // ========================================
  // NORMAL LOGIN
  // ========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    try {

      setLoading(true);

      // Login request
      const data =
        await loginUser(form);


      // ========================================
      // SAVE JWT TOKEN
      // ========================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ========================================
      // SAVE USER INFORMATION
      // ========================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );


      // ========================================
      // LOAD USER'S CART
      // ========================================

      dispatch(
        loadUserCart()
      );


      // ========================================
      // LOAD USER'S WISHLIST
      // ========================================

      dispatch(
        loadUserWishlist()
      );


      // ========================================
      // GO TO HOME
      // ========================================

      navigate("/");


    } catch (error) {

      setError(
        error.message
      );


    } finally {

      setLoading(false);

    }

  };

  // ========================================
  // GOOGLE LOGIN
  // ========================================

  const handleGoogleLogin = async (
    credentialResponse
  ) => {

    try {

      setError("");

      setLoading(true);


      // ========================================
      // SEND GOOGLE CREDENTIAL TO BACKEND
      // ========================================

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              credential:
                credentialResponse.credential,

            }),

          }
        );


      const data =
        await response.json();


      // ========================================
      // CHECK RESPONSE
      // ========================================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Google login failed"
        );

      }


      // ========================================
      // SAVE GREENCART JWT
      // ========================================

      localStorage.setItem(
        "token",
        data.token
      );


      // ========================================
      // SAVE USER
      // ========================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
      );


      // ========================================
      // LOAD USER'S CART
      // ========================================

      dispatch(
        loadUserCart()
      );


      // ========================================
      // LOAD USER'S WISHLIST
      // ========================================

      dispatch(
        loadUserWishlist()
      );


      // ========================================
      // GO TO HOME
      // ========================================

      navigate("/");


    } catch (error) {

      console.error(
        "Google login error:",
        error
      );


      setError(
        error.message ||
        "Google login failed"
      );


    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // GOOGLE LOGIN ERROR
  // ========================================

  const handleGoogleError = () => {

    setError(
      "Google login failed. Please try again."
    );

  };


  return (

    <section className="auth-page">

      <div className="auth-card">


        {/* ========================================
            LOGIN ICON
        ======================================== */}

        <div className="auth-icon">

          <LogIn size={28} />

        </div>


        {/* ========================================
            TITLE
        ======================================== */}

        <h1>
          Welcome Back
        </h1>


        <p className="auth-subtitle">

          Login to your
          GreenCart account

        </p>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <div className="auth-error">

            {error}

          </div>

        )}


        {/* ========================================
            LOGIN FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
        >


          {/* EMAIL */}

          <div className="auth-field">

            <label htmlFor="email">

              Email

            </label>


            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={
                handleChange
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="auth-field">

            <label htmlFor="password">

              Password

            </label>


            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={
                handleChange
              }
              required
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* ========================================
            GOOGLE LOGIN DIVIDER
        ======================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}
        >

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          />

          <span
            style={{
              color: "#777",
              fontSize: "14px",
            }}
          >
            OR
          </span>

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          />

        </div>


        {/* ========================================
            GOOGLE LOGIN
        ======================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >

          <GoogleLogin

            onSuccess={
              handleGoogleLogin
            }

            onError={
              handleGoogleError
            }

          />

        </div>


        {/* ========================================
            REGISTER LINK
        ======================================== */}

        <p className="auth-switch">

          Don't have an account?{" "}

          <Link to="/register">

            Create Account

          </Link>

        </p>

      </div>

    </section>

  );

}


export default Login;