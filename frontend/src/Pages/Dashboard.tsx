import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { useAuth } from "../Hooks/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pages } from "../Consts/Pages";
import JobPredictionDashboard from "../Components/JobPredictionDashboard";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(Pages.LOGIN);
  };

  const handleProfile = () => {
    navigate(Pages.PROFILE);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Dashboard, {user?.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Typography>Email: {user?.email}</Typography>
              <Typography>Status: {user?.status}</Typography>
              <Typography>
                Verified: {user?.isVerified ? "Yes" : "No"}
              </Typography>
              {user?.degree && <Typography>Degree: {user.degree}</Typography>}
              {user?.CGPA && <Typography>CGPA: {user.CGPA}</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                <Button variant="contained" onClick={handleProfile}>
                  View Profile
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Prediction Dashboard */}
      <Box sx={{ mt: 4 }}>
        <JobPredictionDashboard />
      </Box>
    </Box>
  );
};

export default Dashboard;
