import React from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import AppRoutes from "./Routes/AppRoutes";
import { AuthProvider } from "./Hooks/Context/AuthContext";
import NotificationProvider from "./Components/GlobalPopup";

import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily:
      '"Roboto", "Roboto Condensed", "Oswald", "Niconne", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
