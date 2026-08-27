import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  adminLogin,
} from "../services/adminService";

import "./Admin.css";


const AdminLogin = () => {

  const navigate =
    useNavigate();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit =
    async (
      e
    ) => {

      e.preventDefault();


      setError(
        ""
      );


      setLoading(
        true
      );


      try {

        // ==================================================
        // BACKEND LOGIN
        // ==================================================

        const data =
          await adminLogin(

            email,

            password

          );


        // ==================================================
        // CHECK RESPONSE
        // ==================================================

        if (
          !data ||
          !data.token ||
          !data.admin
        ) {

          throw new Error(
            "Invalid login response from server"
          );

        }


        // ==================================================
        // SAVE ADMIN TOKEN
        // ==================================================

        localStorage.setItem(

          "adminToken",

          data.token

        );


        // ==================================================
        // SAVE ADMIN EMAIL
        // ==================================================

        localStorage.setItem(

          "adminEmail",

          data.admin.email ||
          ""

        );


        // ==================================================
        // SAVE ADMIN NAME
        // ==================================================

        localStorage.setItem(

          "adminName",

          data.admin.name ||
          ""

        );


        // ==================================================
        // SAVE ADMIN ROLE
        // ==================================================

        localStorage.setItem(

          "adminRole",

          data.admin.role ||
          "admin"

        );


        // ==================================================
        // SAVE ADMIN STATUS
        // ==================================================

        localStorage.setItem(

          "adminStatus",

          data.admin.status ||
          "active"

        );


        // ==================================================
        // SAVE ADMIN PERMISSIONS
        // ==================================================

        const permissions =
          data.admin.permissions || {

            products:
              false,

            users:
              false,

            carts:
              false,

            orders:
              false,

          };


        localStorage.setItem(

          "adminPermissions",

          JSON.stringify(
            permissions
          )

        );


        // ==================================================
        // LOGIN SUCCESS
        // ==================================================

        navigate(
          "/admin"
        );

      } catch (
        error
      ) {

        console.error(

          "Admin login error:",

          error

        );


        setError(

          error.message ||

          "Invalid admin credentials"

        );

      } finally {

        setLoading(
          false
        );

      }

    };


  return (

    <div className="admin-login-page">

      <div className="admin-login-card">


        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="admin-logo">

          GreenCart

        </div>


        {/* ==================================================
            TITLE
        ================================================== */}

        <h1>

          Admin Login

        </h1>


        <p>

          Sign in to manage your store

        </p>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="admin-error">

            {error}

          </div>

        )}


        {/* ==================================================
            LOGIN FORM
        ================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
        >


          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="admin-form-group">

            <label>
              Email
            </label>


            <input
              type="email"
              value={
                email
              }
              onChange={

                (e) =>

                  setEmail(
                    e.target.value
                  )

              }
              placeholder="Admin email"
              autoComplete="email"
              required
            />

          </div>


          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div className="admin-form-group">

            <label>
              Password
            </label>


            <input
              type="password"
              value={
                password
              }
              onChange={

                (e) =>

                  setPassword(
                    e.target.value
                  )

              }
              placeholder="Admin password"
              autoComplete="current-password"
              required
            />

          </div>


          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="admin-login-button"
          >

            {loading

              ? "Signing in..."

              : "Login"}

          </button>


        </form>


      </div>

    </div>

  );

};


export default AdminLogin;