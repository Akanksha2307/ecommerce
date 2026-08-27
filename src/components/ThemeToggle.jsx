import {
  IconButton,
} from "@mui/material";

import {
  LightMode,
  DarkMode,
} from "@mui/icons-material";

import {
  useThemeContext,
} from "../context/ThemeContext";

import "../index.css";


const ThemeToggle = () => {

  const {
    mode,
    toggleTheme,
  } = useThemeContext();


  return (

    <IconButton
      className="theme-toggle"

      onClick={
        toggleTheme
      }

      aria-label="Toggle theme"

      sx={{
        padding: 0,

        color:
          "var(--text-primary)",

        background:
          "var(--surface)",

        border:
          "1px solid var(--border)",

        "&:hover": {
          background:
            "var(--background)",
        },

      }}
    >

      {mode === "dark"

        ? <LightMode />

        : <DarkMode />}

    </IconButton>

  );

};


export default ThemeToggle;