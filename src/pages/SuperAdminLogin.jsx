import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  superAdminLogin,
} from "../services/superAdminService";

import "./SuperAdmin.css";


const SuperAdminLogin =
  () => {

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

          const data =
            await superAdminLogin(

              email,

              password

            );


          localStorage.setItem(

            "superAdminToken",

            data.token

          );


          localStorage.setItem(

            "superAdminEmail",

            data.admin.email

          );


          localStorage.setItem(

            "superAdminName",

            data.admin.name

          );


          navigate(
            "/super-admin"
          );

        } catch (
          error
        ) {

          setError(
            error.message
          );

        } finally {

          setLoading(
            false
          );

        }

      };


    return (

      <div className="super-admin-login-page">

        <div className="super-admin-login-card">

          <div className="super-admin-logo">

            GreenCart

          </div>


          <h1>
            Super Admin
          </h1>


          <p>
            Manage administrators and permissions
          </p>


          {error && (

            <div className="super-admin-error">

              {error}

            </div>

          )}


          <form
            onSubmit={
              handleSubmit
            }
          >

            <input
              type="email"
              placeholder="Email"
              value={
                email
              }
              onChange={
                (e) =>
                  setEmail(
                    e.target.value
                  )
              }
              required
            />


            <input
              type="password"
              placeholder="Password"
              value={
                password
              }
              onChange={
                (e) =>
                  setPassword(
                    e.target.value
                  )
              }
              required
            />


            <button
              type="submit"
              disabled={
                loading
              }
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


export default SuperAdminLogin;