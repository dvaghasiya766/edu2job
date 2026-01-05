import { Box, Button, TextField, Alert, CircularProgress } from "@mui/material";
import { Colors } from "../Consts/Colors";
import React, { useState } from "react";
import FormBodyText from "../Components/FormBodyText";
import { Pages } from "../Consts/Pages";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../Components/GlobalPopup";

const RegisterFrom = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Name validation (matches backend)
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Email validation (matches backend)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Valid email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    // Password validation (matches backend exactly)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8 || formData.password.length > 20) {
        newErrors.password = "Password must be 8–20 characters long";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/[@$!%*?&#]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Registration Successful!', 'Please check your email for verification link.');
        setTimeout(() => {
          navigate(Pages.LOGIN);
        }, 3000);
      } else {
        // Handle all backend error cases
        switch (response.status) {
          case 422: // Validation errors
            if (data.errors && Array.isArray(data.errors)) {
              const backendErrors: {[key: string]: string} = {};
              data.errors.forEach((error: any) => {
                const field = error.field || error.path;
                if (field) {
                  backendErrors[field] = error.message;
                }
              });
              setErrors(backendErrors);
            } else {
              setErrors({ general: data.message || "Invalid data provided" });
            }
            break;
            
          case 400: // Bad request (email exists, missing fields)
            if (data.errors && data.errors.path) {
              setErrors({ [data.errors.path]: data.errors.message });
            } else if (data.message) {
              if (data.message.includes('email') || data.message.includes('Email')) {
                setErrors({ email: "Email already exists" });
              } else if (data.message.includes('fields')) {
                setErrors({ general: "All fields are required" });
              } else {
                setErrors({ general: data.message });
              }
            } else {
              setErrors({ general: "Registration failed" });
            }
            break;
            
          case 500: // Server error
            setErrors({ general: "Server error. Please try again later." });
            break;
            
          default:
            setErrors({ general: data.message || "Registration failed. Please try again." });
        }
      }
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrors({ general: "Cannot connect to server. Please check if the server is running." });
      } else if (err.name === 'AbortError') {
        setErrors({ general: "Request timeout. Please try again." });
      } else {
        setErrors({ general: "Network error. Please check your connection." });
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
      {errors.general && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      
      <Box marginBottom={2} width="100%">
        <TextField
          type="text"
          label="Name"
          variant="standard"
          fullWidth
          color="primary"
          value={formData.name}
          onChange={handleChange("name")}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
      </Box>
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
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !formData.name || !formData.email || !formData.password}
        sx={{
          background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
          fontFamily: "Roboto",
          fontSize: 18,
          color: "white !important",
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Register Now"}
      </Button>
      <FormBodyText
        text="If you already have an account! Kindly"
        linkText="LogIn Here."
        redirectionPath={Pages.LOGIN}
        textAlign="center"
        fullWidth
      />
    </Box>
  );
};

export default RegisterFrom;
