import { 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Chip, 
  Typography,
  Autocomplete,
  Alert,
  CircularProgress
} from "@mui/material";
import { Colors } from "../Consts/Colors";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pages } from "../Consts/Pages";
import { useNotification } from "../Components/GlobalPopup";

const degrees = [
  "Bachelor of Computer Science",
  "Bachelor of Information Technology", 
  "Bachelor of Engineering",
  "Bachelor of Technology",
  "Master of Computer Applications",
  "Master of Technology",
  "Other"
];

const popularSkills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
  "HTML", "CSS", "MongoDB", "MySQL", "Git", "Docker", "AWS",
  "Angular", "Vue.js", "Express.js", "Spring Boot", "Django",
  "Machine Learning", "Data Analysis", "UI/UX Design", "Figma"
];

const VerificationForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    degree: "",
    yearOfPassing: new Date().getFullYear(),
    skills: [] as string[],
    CGPA: "",
    certifications: [{ title: "", issuer: "", year: new Date().getFullYear() }],
    collage: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({ ...prev, skills: newSkills }));
    setErrors(prev => ({ ...prev, skills: "" }));
  };

  const handleCertificationChange = (index: number, field: string, value: string | number) => {
    const updatedCerts = [...formData.certifications];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    setFormData(prev => ({ ...prev, certifications: updatedCerts }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { title: "", issuer: "", year: new Date().getFullYear() }]
    }));
  };

  const removeCertification = (index: number) => {
    if (formData.certifications.length > 1) {
      setFormData(prev => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (!formData.yearOfPassing || formData.yearOfPassing < 2000 || formData.yearOfPassing > 2030) {
      newErrors.yearOfPassing = "Valid year is required";
    }
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!formData.CGPA || parseFloat(formData.CGPA) < 0 || parseFloat(formData.CGPA) > 10) {
      newErrors.CGPA = "CGPA must be between 0 and 10";
    }
    if (formData.certifications.some(cert => !cert.title || !cert.issuer)) {
      newErrors.certifications = "All certification fields are required";
    }
    if (!formData.collage) newErrors.collage = "College name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    const token = searchParams.get('token');
    if (!token) {
      // For testing - show notification but allow manual token input
      showNotification('warning', 'No Token Found', 'Enter verification token manually or use email link.');
      const manualToken = prompt('Enter verification token for testing:');
      if (!manualToken) {
        showNotification('error', 'Token Required', 'Verification token is required.');
        return;
      }
      // Use manual token for testing
      await submitVerification(manualToken);
      return;
    }
    
    await submitVerification(token);
  };

  const submitVerification = async (token: string) => {
    
    setLoading(true);
    setErrors({});

    try {
      console.log('Submitting verification with token:', token);
      console.log('Form data:', formData);
      
      const response = await fetch("http://localhost:8000/users/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          degree: formData.degree,
          yearOfPassing: formData.yearOfPassing.toString(),
          skills: formData.skills,
          CGPA: parseFloat(formData.CGPA),
          certifications: formData.certifications,
          collage: formData.collage
        }),
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (response.ok) {
        showNotification('success', 'Verification Complete!', 'Your profile has been verified successfully. You can now login.');
        setTimeout(() => navigate(Pages.LOGIN), 2000);
      } else {
        switch (response.status) {
          case 400:
            if (data.message?.includes('expired')) {
              showNotification('error', 'Token Expired', 'Your verification link has expired. Please register again.');
            } else if (data.message?.includes('fields')) {
              setErrors({ general: "All fields are required" });
            } else {
              setErrors({ general: data.message || "Verification failed" });
            }
            break;
          case 401:
            showNotification('error', 'Invalid Token', 'Your verification link is invalid. Please register again.');
            break;
          case 404:
            showNotification('error', 'User Not Found', 'User not found. Please register again.');
            break;
          default:
            setErrors({ general: data.message || "Verification failed" });
        }
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      showNotification('error', 'Network Error', 'Cannot connect to server. Please try again.');
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
      justifyContent="flex-start"
      alignItems="start"
      gap={2}
      width="100vw"
      maxWidth={600}
      paddingY={{ xs: 1, md: 2 }}
      paddingX={4}
      maxHeight="60vh"
      overflow="auto"
    >
      {errors.general && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <TextField
        select
        label="Degree"
        value={formData.degree}
        onChange={handleChange("degree")}
        fullWidth
        error={!!errors.degree}
        helperText={errors.degree}
        required
      >
        {degrees.map((degree) => (
          <MenuItem key={degree} value={degree}>
            {degree}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        type="number"
        label="Year of Passing"
        value={formData.yearOfPassing}
        onChange={handleChange("yearOfPassing")}
        fullWidth
        error={!!errors.yearOfPassing}
        helperText={errors.yearOfPassing}
        inputProps={{ min: 2000, max: 2030 }}
        required
      />

      <Box width="100%">
        <Autocomplete
          multiple
          options={popularSkills}
          value={formData.skills}
          onChange={(_, newValue) => handleSkillsChange(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Skills"
              error={!!errors.skills}
              helperText={errors.skills}
              required
            />
          )}
        />
      </Box>

      <TextField
        type="number"
        label="CGPA"
        value={formData.CGPA}
        onChange={handleChange("CGPA")}
        fullWidth
        error={!!errors.CGPA}
        helperText={errors.CGPA}
        inputProps={{ min: 0, max: 10, step: 0.01 }}
        required
      />

      <TextField
        label="College Name"
        value={formData.collage}
        onChange={handleChange("collage")}
        fullWidth
        error={!!errors.collage}
        helperText={errors.collage}
        required
      />

      <Box width="100%">
        <Typography variant="subtitle2" gutterBottom>
          Certifications
        </Typography>
        {formData.certifications.map((cert, index) => (
          <Box key={index} display="flex" gap={1} mb={2} alignItems="center">
            <TextField
              label="Title"
              value={cert.title}
              onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
              size="small"
              required
            />
            <TextField
              label="Issuer"
              value={cert.issuer}
              onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
              size="small"
              required
            />
            <TextField
              type="number"
              label="Year"
              value={cert.year}
              onChange={(e) => handleCertificationChange(index, "year", parseInt(e.target.value))}
              size="small"
              inputProps={{ min: 2000, max: new Date().getFullYear() }}
              required
            />
            {formData.certifications.length > 1 && (
              <Button onClick={() => removeCertification(index)} color="error" size="small">
                Remove
              </Button>
            )}
          </Box>
        ))}
        <Button onClick={addCertification} variant="outlined" size="small">
          Add Certification
        </Button>
        {errors.certifications && (
          <Typography variant="caption" color="error" display="block" mt={1}>
            {errors.certifications}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
          fontFamily: "Roboto",
          fontSize: 18,
          color: "white !important",
          letterSpacing: 1,
          py: 1.5,
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Verification"}
      </Button>
    </Box>
  );
};

export default VerificationForm;