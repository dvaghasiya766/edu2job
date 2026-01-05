import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { adminService } from '../services/adminService';

interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  modelMetrics: {
    f1Score: number;
    accuracy: number;
    datasetRows: number;
  };
}

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
  isVerified: boolean;
  createdAt: string;
}

interface Prediction {
  _id: string;
  userID: {
    name: string;
    email: string;
    degree: string;
  };
  predictedJobRoles: Array<{
    job_role: string;
    confidence: number;
  }>;
  modelMetrics: {
    f1Score: number;
    accuracy: number;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, predictionsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(),
        adminService.getAllPredictions()
      ]);
      
      setStats(statsData.stats);
      setUsers(usersData.users);
      setPredictions(predictionsData.predictions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      const userDetails = await adminService.getUserDetails(userId);
      setSelectedUser(userDetails);
      setUserDetailsOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Predictions
                </Typography>
                <Typography variant="h4">
                  {stats.totalPredictions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Model Performance
                </Typography>
                <Typography variant="h6">
                  F1: {stats.modelMetrics.f1Score}%
                </Typography>
                <Typography variant="h6">
                  Acc: {stats.modelMetrics.accuracy}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dataset: {stats.modelMetrics.datasetRows} rows
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Users" />
          <Tab label="Predictions" />
        </Tabs>
      </Box>

      {/* Users Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Management
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
                    <TableCell>Certifications</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.degree || 'N/A'}</TableCell>
                      <TableCell>{user.yearOfPassing || 'N/A'}</TableCell>
                      <TableCell>{user.CGPA || 'N/A'}</TableCell>
                      <TableCell>
                        {user.skills && user.skills.length > 0 ? (
                          <Box>
                            {user.skills.slice(0, 2).map((skill, index) => (
                              <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                            {user.skills.length > 2 && (
                              <Typography variant="caption" color="text.secondary">
                                +{user.skills.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {user.Certifications && user.Certifications.length > 0 ? user.Certifications.length : 0}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleUserClick(user._id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Predictions Tab */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Prediction History
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Predicted Roles</TableCell>
                    <TableCell>F1 Score</TableCell>
                    <TableCell>Accuracy</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predictions.map((prediction) => (
                    <TableRow key={prediction._id}>
                      <TableCell>{prediction.userID.name}</TableCell>
                      <TableCell>{prediction.userID.email}</TableCell>
                      <TableCell>
                        {prediction.predictedJobRoles.map((role, index) => (
                          <Chip
                            key={index}
                            label={`${role.job_role} (${role.confidence}%)`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{prediction.modelMetrics?.f1Score || 86}%</TableCell>
                      <TableCell>{prediction.modelMetrics?.accuracy || 70}%</TableCell>
                      <TableCell>{formatDate(prediction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* User Details Dialog */}
      <Dialog
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedUser.user.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Email: {selectedUser.user.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Degree: {selectedUser.user.degree}
              </Typography>
              <Typography variant="body2" gutterBottom>
                CGPA: {selectedUser.user.CGPA}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Skills: {selectedUser.user.skills?.join(', ') || 'None'}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Prediction History ({selectedUser.totalPredictions})
              </Typography>
              {selectedUser.predictions.map((pred: any, index: number) => (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardContent>
                    <Typography variant="body2">
                      Date: {formatDate(pred.createdAt)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {pred.predictedJobRoles.map((role: any, roleIndex: number) => (
                        <Chip
                          key={roleIndex}
                          label={`${role.job_role} (${role.confidence}%)`}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;