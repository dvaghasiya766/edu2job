import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  Button,
} from "@mui/material";
import { adminService } from "../services/adminService";

interface User {
  _id: string;
  name: string;
  email: string;
  degree: string;
  yearOfPassing: number;
  CGPA: string;
  skills: string[];
  Certifications: any[];
  status: string;
  createdAt: string;
}

interface Prediction {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    degree?: string;
    yearOfPassing?: number;
    CGPA?: string;
    skills?: string[];
  };
  predictedJobRoles: Array<{
    job_role: string;
    confidence: number;
  }>;
  userProfile: {
    degree: string;
    specialization: string;
    yearOfPassing: number;
    cgpa: number;
    certifications: number;
  };
  feedback?: string;
  modelMetrics?: {
    f1Score: number;
    accuracy: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  feedbackStats: {
    good: number;
    avg: number;
    bad: number;
    total: number;
  };
  modelMetrics: {
    accuracy: number;
    f1Score: number;
    totalPredictions: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, predictionsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllPredictions(),
      ]);

      console.log("Users data:", usersData);
      console.log("Predictions data:", predictionsData);

      setUsers(usersData.users || []);
      setPredictions((predictionsData.predictions as any) || []);

      // Calculate stats from local data
      setDashboardStats({
        totalUsers: usersData.totalUsers || usersData.users?.length || 0,
        totalPredictions:
          predictionsData.totalPredictions ||
          predictionsData.predictions?.length ||
          0,
        feedbackStats: {
          good: (predictionsData.predictions || []).filter(
            (p: any) => p.feedback === "good"
          ).length,
          avg: (predictionsData.predictions || []).filter(
            (p: any) => p.feedback === "avg"
          ).length,
          bad: (predictionsData.predictions || []).filter(
            (p: any) => p.feedback === "bad"
          ).length,
          total: (predictionsData.predictions || []).length,
        },
        modelMetrics: {
          accuracy: 70,
          f1Score: 86,
          totalPredictions: (predictionsData.predictions || []).length,
        },
      });
    } catch (err: any) {
      console.error("Admin dashboard error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
    } finally {
      setLoading(false);
    }
  };

  const debugDatabase = async () => {
    try {
      const debugData = await adminService.debugPredictions();
      console.log("Debug data:", debugData);
      alert(`Found ${debugData.totalCount} predictions in database`);
    } catch (err) {
      console.error("Debug error:", err);
      alert("Debug failed - check console");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFeedbackColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "success";
      case "bad":
        return "error";
      case "avg":
        return "warning";
      default:
        return "default";
    }
  };

  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;

  const feedbackStats = dashboardStats?.feedbackStats || {
    good: predictions.filter((p) => p.feedback === "good").length,
    avg: predictions.filter((p) => p.feedback === "avg").length,
    bad: predictions.filter((p) => p.feedback === "bad").length,
    total: predictions.length,
  };

  const noFeedback = predictions.filter((p) => !p.feedback).length;
  const modelMetrics = dashboardStats?.modelMetrics || {
    accuracy: 70,
    f1Score: 86,
    totalPredictions: predictions.length,
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box>
          <Button variant="contained" onClick={fetchData} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="outlined" onClick={debugDatabase}>
            Debug DB
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button onClick={fetchData} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {predictions.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No predictions found. Users need to generate job predictions first.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Users ({users.length} total)
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Active</Typography>
                  <Typography variant="body2">{activeUsers}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={users.length ? (activeUsers / users.length) * 100 : 0}
                  color="success"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Inactive</Typography>
                  <Typography variant="body2">{inactiveUsers}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    users.length ? (inactiveUsers / users.length) * 100 : 0
                  }
                  color="warning"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feedback ({predictions.length} total)
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Good</Typography>
                  <Typography variant="body2">{feedbackStats.good}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    feedbackStats.total
                      ? (feedbackStats.good / feedbackStats.total) * 100
                      : 0
                  }
                  color="success"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Average</Typography>
                  <Typography variant="body2">{feedbackStats.avg}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    feedbackStats.total
                      ? (feedbackStats.avg / feedbackStats.total) * 100
                      : 0
                  }
                  color="warning"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Bad</Typography>
                  <Typography variant="body2">{feedbackStats.bad}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    feedbackStats.total
                      ? (feedbackStats.bad / feedbackStats.total) * 100
                      : 0
                  }
                  color="error"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Bad</Typography>
                  <Typography variant="body2">{noFeedback}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    feedbackStats.total
                      ? (noFeedback / feedbackStats.total) * 100
                      : 0
                  }
                  color="inherit"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Performance
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary">
                  {modelMetrics.f1Score}%
                </Typography>
                <Typography variant="body2" gutterBottom>
                  F1 Score
                </Typography>
                <Typography variant="h3" color="secondary">
                  {modelMetrics.accuracy}%
                </Typography>
                <Typography variant="body2">Accuracy</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Users" />
        <Tab label="Predictions" />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Management ({users.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Degree</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>CGPA</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.degree || "N/A"}</TableCell>
                      <TableCell>{user.yearOfPassing || "N/A"}</TableCell>
                      <TableCell>{user.CGPA || "N/A"}</TableCell>
                      <TableCell>
                        {user.skills && user.skills.length > 0 ? (
                          <Box>
                            {user.skills.slice(0, 2).map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {user.skills.length > 2 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                +{user.skills.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status || "active"}
                          color={
                            user.status === "active" ? "success" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Prediction History ({predictions.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Predicted Roles</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.map((prediction) => (
                    <TableRow key={prediction._id}>
                      <TableCell>{prediction.user?.name || "N/A"}</TableCell>
                      <TableCell>{prediction.user?.email || "N/A"}</TableCell>
                      <TableCell>
                        {prediction.predictedJobRoles?.map((role, index) => (
                          <Chip
                            key={index}
                            label={`${role.job_role} (${role.confidence}%)`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )) || "No predictions"}
                      </TableCell>
                      <TableCell>
                        {prediction.feedback ? (
                          <Chip
                            label={prediction.feedback}
                            color={getFeedbackColor(prediction.feedback)}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Good
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(prediction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminDashboard;
