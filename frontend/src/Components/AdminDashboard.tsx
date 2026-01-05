import React, { useState, useEffect } from 'react';
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
  LinearProgress
} from '@mui/material';
import { adminService } from '../services/adminService';

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
  userID: {
    name: string;
    email: string;
  };
  predictedJobRoles: Array<{
    job_role: string;
    confidence: number;
  }>;
  feedback?: {
    rating: string;
    submittedAt: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, predictionsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllPredictions()
      ]);
      
      setUsers(usersData.users);
      setPredictions(predictionsData.predictions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFeedbackColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'success';
      case 'bad': return 'error';
      case 'avg': return 'warning';
      default: return 'default';
    }
  };

  // Calculate statistics
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const goodFeedback = predictions.filter(p => p.feedback?.rating === 'good').length;
  const avgFeedback = predictions.filter(p => p.feedback?.rating === 'avg').length;
  const badFeedback = predictions.filter(p => p.feedback?.rating === 'bad').length;
  const noFeedback = predictions.filter(p => !p.feedback).length;

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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Status ({users.length} total)
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
                  value={users.length ? (inactiveUsers / users.length) * 100 : 0} 
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
                Feedback Summary ({predictions.length} total)
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Good</Typography>
                  <Typography variant="body2">{goodFeedback}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={predictions.length ? (goodFeedback / predictions.length) * 100 : 0} color="success" sx={{ mb: 1 }} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Average</Typography>
                  <Typography variant="body2">{avgFeedback}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={predictions.length ? (avgFeedback / predictions.length) * 100 : 0} color="warning" sx={{ mb: 1 }} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Bad</Typography>
                  <Typography variant="body2">{badFeedback}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={predictions.length ? (badFeedback / predictions.length) * 100 : 0} color="error" sx={{ mb: 1 }} />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">No Feedback</Typography>
                  <Typography variant="body2">{noFeedback}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={predictions.length ? (noFeedback / predictions.length) * 100 : 0} color="inherit" />
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
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">
                  86%
                </Typography>
                <Typography variant="body2" gutterBottom>
                  F1 Score
                </Typography>
                <Typography variant="h3" color="secondary">
                  70%
                </Typography>
                <Typography variant="body2">
                  Accuracy
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
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
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
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
                      <TableCell>
                        {prediction.feedback ? (
                          <Chip
                            label={prediction.feedback.rating}
                            color={getFeedbackColor(prediction.feedback.rating)}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No feedback
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