import { createTheme } from "@mui/material/styles";

// Tells MUI to generate CSS vars and flip dark/light by setting
// data-theme="dark" / data-theme="light" on <html> -- matching the
// attribute your theme.css already relies on everywhere.
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-theme",
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
});

export default theme;