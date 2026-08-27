import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  UserPlus,
} from "lucide-react";

import {
  GoogleLogin,
} from "@react-oauth/google";

import {
  registerUser,
} from "../services/authService";

import "./Register.css";


function Register() {

  const navigate = useNavigate();


  // ========================================
  // FORM
  // ========================================

  const [form, setForm] = useState({

    name: "",

    email: "",

    password: "",

    confirmPassword: "",

  });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);


  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({

      ...previous,

      [name]: value,

    }));


    setError("");

  };


  // ========================================
  // NORMAL REGISTRATION
  // ========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    // ========================================
    // PASSWORD MATCH
    // ========================================

    if (
      form.password !==
      form.confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;

    }


    try {

      setLoading(true);


      await registerUser({

        name:
          form.name,

        email:
          form.email,

        password:
          form.password,

      });


      alert(
        "Registration successful! Please login."
      );


      navigate("/login");


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // GOOGLE REGISTRATION / LOGIN
  // ========================================

  const handleGoogleSuccess =
    async (credentialResponse) => {

      try {

        setGoogleLoading(true);

        setError("");


        // ========================================
        // CHECK GOOGLE CREDENTIAL
        // ========================================

        if (
          !credentialResponse?.credential
        ) {

          throw new Error(
            "Google credential was not received"
          );

        }


        // ========================================
        // SEND TO BACKEND
        // ========================================

        const response =
          await fetch(
            "http://localhost:5000/api/auth/google",
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
        // BACKEND ERROR
        // ========================================

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Google registration failed"
          );

        }


        // ========================================
        // SAVE TOKEN
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
        // GO TO HOME
        // ========================================

        navigate("/");

      } catch (error) {

        console.error(
          "Google registration error:",
          error
        );


        setError(
          error.message ||
          "Google registration failed"
        );

      } finally {

        setGoogleLoading(false);

      }

    };


  // ========================================
  // GOOGLE ERROR
  // ========================================

  const handleGoogleError = () => {

    setError(
      "Google registration failed. Please try again."
    );

  };


  return (

    <section className="auth-page">

      <div className="auth-card">


        {/* ========================================
            ICON
        ======================================== */}

        <div className="auth-icon">

          <UserPlus
            size={28}
          />

        </div>


        {/* ========================================
            TITLE
        ======================================== */}

        <h1>
          Create Account
        </h1>


        <p className="auth-subtitle">

          Create your GreenCart account

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
            REGISTRATION FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
        >


          {/* FULL NAME */}

          <div className="auth-field">

            <label htmlFor="name">

              Full Name

            </label>


            <input
              id="name"

              type="text"

              name="name"

              placeholder="Enter your name"

              value={
                form.name
              }

              onChange={
                handleChange
              }

              required
            />

          </div>


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

              value={
                form.email
              }

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

              placeholder="Minimum 6 characters"

              value={
                form.password
              }

              onChange={
                handleChange
              }

              minLength="6"

              required
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="auth-field">

            <label htmlFor="confirmPassword">

              Confirm Password

            </label>


            <input
              id="confirmPassword"

              type="password"

              name="confirmPassword"

              placeholder="Confirm your password"

              value={
                form.confirmPassword
              }

              onChange={
                handleChange
              }

              required
            />

          </div>


          {/* CREATE ACCOUNT */}

          <button
            type="submit"

            className="auth-button"

            disabled={
              loading ||
              googleLoading
            }
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>


        </form>


        {/* ========================================
            OR
        ======================================== */}

        <div
          className="auth-or"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            margin: "22px 0",
            color: "#777",
          }}
        >

          <span
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          />

          <span>
            OR
          </span>

          <span
            style={{
              flex: 1,
              height: "1px",
              background: "#ddd",
            }}
          />

        </div>


        {/* ========================================
            GOOGLE
        ======================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >

          {googleLoading ? (

            <p>
              Creating account with Google...
            </p>

          ) : (

            <GoogleLogin

              onSuccess={
                handleGoogleSuccess
              }

              onError={
                handleGoogleError
              }

            />

          )}

        </div>


        {/* ========================================
            LOGIN
        ======================================== */}

        <p className="auth-switch">

          Already have an account?{" "}

          <Link to="/login">

            Login

          </Link>

        </p>


      </div>

    </section>

  );

}


export default Register;