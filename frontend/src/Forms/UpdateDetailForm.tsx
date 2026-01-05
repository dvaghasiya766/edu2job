import {
  Box,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Colors } from "../Consts/Colors";
import {
  School,
  Person,
  Grade,
  CalendarToday,
  Business,
} from "@mui/icons-material";
import React, { useState } from "react";

interface UpdateDetailFormProps {
  name: string;
  degree: string;
  yearOfPassing: number;
  CGPA: string;
  collage: string;
  onUpdate?: () => void;
  onClose?: () => void;
}

const degrees = [
  "B.Tech Computer Science",
  "B.Tech Information Technology",
  "B.Tech Electronics",
  "B.E Computer Science",
  "BCA",
  "MCA",
  "M.Tech",
  "Other",
];

const UpdateDetailForm = ({
  name: initialName,
  degree: initialDegree,
  CGPA: initialCGPA,
  yearOfPassing: initialYear,
  collage: initialCollage,
  onUpdate,
  onClose,
}: UpdateDetailFormProps) => {
  const [formData, setFormData] = useState({
    name: initialName,
    degree: initialDegree,
    CGPA: initialCGPA,
    yearOfPassing: initialYear,
    collage: initialCollage,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !formData.CGPA ||
      parseFloat(formData.CGPA) < 0 ||
      parseFloat(formData.CGPA) > 10
    ) {
      newErrors.CGPA = "CGPA must be between 0 and 10";
    }
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (formData.yearOfPassing < 2020 || formData.yearOfPassing > 2030) {
      newErrors.yearOfPassing = "Year must be between 2020 and 2030";
    }
    if (!formData.collage.trim())
      newErrors.collage = "College name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          "http://localhost:8000/users/update-profile",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              degree: formData.degree,
              yearOfPassing: formData.yearOfPassing,
              CGPA: formData.CGPA,
              Collage: formData.collage,
            }),
          }
        );

        if (response.ok) {
          setShowSuccess(true);
          onUpdate?.();
          setTimeout(() => {
            onClose?.();
          }, 1000);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 600,
        p: 3,
      }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={handleChange("name")}
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="CGPA"
            value={formData.CGPA}
            onChange={handleChange("CGPA")}
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ min: 0, max: 10, step: 0.01 }}
            error={!!errors.CGPA}
            helperText={errors.CGPA}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Grade color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            select
            label="Degree"
            value={formData.degree}
            onChange={handleChange("degree")}
            variant="outlined"
            fullWidth
            error={!!errors.degree}
            helperText={errors.degree}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {degrees.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Year of Passing"
            value={formData.yearOfPassing}
            onChange={handleChange("yearOfPassing")}
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ min: 2020, max: 2030 }}
            error={!!errors.yearOfPassing}
            helperText={errors.yearOfPassing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="College Name"
            value={formData.collage}
            onChange={handleChange("collage")}
            variant="outlined"
            fullWidth
            error={!!errors.collage}
            helperText={errors.collage}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
              fontFamily: "Roboto",
              fontSize: 18,
              color: "white !important",
              letterSpacing: 1,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                background: `linear-gradient(135deg, ${Colors.GradientGreen}, ${Colors.GradientBlue})`,
              },
            }}
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateDetailForm;
