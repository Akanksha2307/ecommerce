import {
  createContext,
  useContext,
} from "react";

/* eslint-disable react-refresh/only-export-components */

import {
  useColorScheme,
} from "@mui/material/styles";


// ======================================================
// THEME CONTEXT
// ======================================================

const ThemeContext =
  createContext(null);


// ======================================================
// PROVIDER
// ======================================================

export const ThemeContextProvider = ({
  children,
}) => {

  const {
    mode,
    setMode,
  } = useColorScheme();

  // ====================================================
  // TOGGLE
  // ====================================================

  const toggleTheme = () => {

    if (
      mode === "dark"
    ) {

      setMode("light");

    } else {

      setMode("dark");

    }

  };


  return (

    <ThemeContext.Provider
      value={{

        mode,

        setMode,

        toggleTheme,

      }}
    >

      {children}

    </ThemeContext.Provider>

  );

};


// ======================================================
// CUSTOM HOOK
// ======================================================

export const useThemeContext = () => {

  return useContext(
    ThemeContext
  );

};