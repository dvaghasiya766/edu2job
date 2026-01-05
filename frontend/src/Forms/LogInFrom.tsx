import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { Colors } from "../Consts/Colors";
import React, { useState } from "react";
import FormBodyText from "../Components/FormBodyText";
import { useNavigate } from "react-router-dom";
import { Pages } from "../Consts/Pages";
import { useAuth } from "../Hooks/Context/AuthContext";
import { useNotification } from "../Components/GlobalPopup";
import { Google } from "@mui/icons-material";

const LogInFrom = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Valid email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(
          "success",
          "Login Successful!",
          `Welcome back, ${data.user?.name || "User"}!`
        );
        login(data.user, data.accessToken, data.refreshToken);
        setTimeout(() => navigate(Pages.DASHBOARD), 1500);
      } else {
        switch (response.status) {
          case 422:
            if (data.errors && Array.isArray(data.errors)) {
              const backendErrors: { [key: string]: string } = {};
              data.errors.forEach((error: any) => {
                const field = error.field || error.path;
                if (field) backendErrors[field] = error.message;
              });
              setErrors(backendErrors);
            }
            break;
          case 400:
            if (data.errors && data.errors.path) {
              if (data.errors.path === "isVerified") {
                showNotification(
                  "warning",
                  "Account Not Verified",
                  data.errors.message
                );
                setErrors({ general: data.errors.message });
              } else {
                setErrors({ [data.errors.path]: data.errors.message });
              }
            } else if (data.message) {
              if (
                data.message.includes("Email") ||
                data.message.includes("email")
              ) {
                setErrors({ email: "Email not found" });
              } else if (data.message.includes("password")) {
                setErrors({ password: "Invalid password" });
              } else if (
                data.message.includes("Verified") ||
                data.message.includes("verified")
              ) {
                showNotification(
                  "warning",
                  "Account Not Verified",
                  "Please verify your account first. Check your email for the verification link."
                );
                setErrors({
                  general:
                    "Please verify your account first. Check your email for the verification link.",
                });
              } else if (data.message.includes("active")) {
                showNotification(
                  "warning",
                  "Account Inactive",
                  "Account is not active. Please contact support."
                );
                setErrors({
                  general: "Account is not active. Please contact support.",
                });
              } else {
                setErrors({ general: data.message });
              }
            }
            break;
          case 401:
            setErrors({ general: "Invalid credentials" });
            break;
          case 404:
            setErrors({ email: "User not found" });
            break;
          default:
            setErrors({ general: data.message || "Login failed" });
        }
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        showNotification(
          "error",
          "Connection Error",
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        showNotification(
          "error",
          "Network Error",
          "Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="start"
      gap={0}
      width="100vw"
      maxWidth={500}
      paddingY={{ xs: 1, md: 2 }}
      paddingX={4}
    >
      <Box marginBottom={2} width="100%">
        <TextField
          type="email"
          label="Email"
          variant="standard"
          fullWidth
          color="primary"
          value={formData.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
      </Box>
      <Box marginBottom={2} width="100%">
        <TextField
          type="password"
          label="Password"
          variant="standard"
          fullWidth
          color="primary"
          value={formData.password}
          onChange={handleChange("password")}
          error={!!errors.password}
          helperText={errors.password}
          required
        />
      </Box>
      <FormBodyText
        text="do you want to"
        linkText="Forget Password?"
        redirectionPath="forgetpassword"
        textAlign="end"
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !formData.email || !formData.password}
        sx={{
          background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
          fontFamily: "Roboto",
          fontSize: 18,
          color: "white !important",
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Log In Here"
        )}
      </Button>
      <Box display="flex" alignItems="center" width="100%" mb={2}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>
      <Button
        fullWidth
        onClick={() =>
          window.open("http://localhost:8000/auth/google", "_self")
        }
        variant="outlined"
        startIcon={<Google />}
        sx={{
          fontSize: 18,
          // color: grey[500],
          // borderColor: grey[500],
          color: Colors.GradientGreen,
          borderColor: Colors.GradientGreen,
          textTransform: "capitalize",
        }}
      >
        Signin with Google
      </Button>
    </Box>
  );
};

export default LogInFrom;
