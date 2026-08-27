import React from "react";

import ReactDOM from "react-dom/client";

import {
  Provider,
} from "react-redux";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import {
  ThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";

import store from "./redux/store";

import theme from "./theme/theme";

import {
  ThemeContextProvider,
} from "./context/ThemeContext";

import "./index.css";
import "./theme.css";

// ======================================================
// ROOT
// ======================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Provider
      store={store}
    >

      <GoogleOAuthProvider
        clientId={
          import.meta.env
            .VITE_GOOGLE_CLIENT_ID
        }
      >

        <ThemeProvider
          theme={theme}
          defaultMode="light"
          noSsr
        >

          <CssBaseline />

          <ThemeContextProvider>

            <App />

          </ThemeContextProvider>

        </ThemeProvider>

      </GoogleOAuthProvider>

    </Provider>

  </React.StrictMode>

);