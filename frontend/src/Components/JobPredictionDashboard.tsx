import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { predictionService } from "../services/predictionService";

interface JobPrediction {
  job_role: string;
  confidence: number;
}

interface ModelMetrics {
  f1Score: number;
  accuracy: number;
}

interface ProfileInsights {
  skillsAnalysis: {
    totalSkills: number;
    techStack: string[];
    recommendations: string[];
  };
  certificationAnalysis: {
    totalCertifications: number;
    recentCertifications: any[];
    suggestions: string[];
  };
  profileStrength: {
    score: number;
    level: string;
    suggestions: string[];
  };
}

interface PredictionHistory {
  _id: string;
  predictedJobRoles: JobPrediction[];
  modelMetrics: ModelMetrics;
  createdAt: string;
}

const JobPredictionDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<JobPrediction[]>([]);
  const [insights, setInsights] = useState<ProfileInsights | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handlePredictJob = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await predictionService.predictJobRole();
      setPredictions(result.predictions);
      setUserProfile(result.userProfile);
      setModelMetrics(result.modelMetrics);
      fetchPredictionHistory(); // Refresh history after new prediction
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const result = await predictionService.getJobInsights();
      setInsights(result.insights);
    } catch (err: any) {
      console.error("Failed to fetch insights:", err.message);
    }
  };

  const fetchPredictionHistory = async () => {
    try {
      const result = await predictionService.getPredictionHistory();
      setPredictionHistory(result.predictions);
    } catch (err: any) {
      console.error("Failed to fetch prediction history:", err.message);
    }
  };

  useEffect(() => {
    fetchInsights();
    fetchPredictionHistory();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "success";
    if (confidence >= 50) return "warning";
    return "error";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Role Prediction Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Prediction Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI-Powered Job Role Prediction
              </Typography>

              {modelMetrics && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Model Performance Metrics:
                  </Typography>
                  <Typography variant="body2">
                    F1 Score: {modelMetrics.f1Score}% | Accuracy: {modelMetrics.accuracy}% | Dataset: 3200 rows
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handlePredictJob}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Predict My Job Role"
                )}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {predictions.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Top Job Role Predictions:
                  </Typography>
                  {predictions.map((prediction, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {prediction.job_role}
                        </Typography>
                        <Chip
                          label={`${prediction.confidence}%`}
                          color={getConfidenceColor(prediction.confidence)}
                          size="small"
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={prediction.confidence}
                        sx={{ mt: 1 }}
                        color={getConfidenceColor(prediction.confidence)}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {userProfile && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Profile Summary:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Degree:</strong> {userProfile.degree}
                    <br />
                    <strong>Specialization:</strong>{" "}
                    {userProfile.specialization}
                    <br />
                    <strong>CGPA:</strong> {userProfile.cgpa}
                    <br />
                    <strong>Certifications:</strong>{" "}
                    {userProfile.certifications}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Prediction History */}
          {predictionHistory.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prediction History
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Predicted Roles</TableCell>
                        <TableCell>F1 Score</TableCell>
                        <TableCell>Accuracy</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictionHistory.slice(0, 5).map((history) => (
                        <TableRow key={history._id}>
                          <TableCell>{formatDate(history.createdAt)}</TableCell>
                          <TableCell>
                            {history.predictedJobRoles.map((role, index) => (
                              <Chip
                                key={index}
                                label={`${role.job_role} (${role.confidence}%)`}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>{history.modelMetrics?.f1Score || 86}%</TableCell>
                          <TableCell>{history.modelMetrics?.accuracy || 70}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Insights Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          {insights && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profile Insights
                </Typography>

                {/* Profile Strength */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Profile Strength: {insights.profileStrength.level}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={insights.profileStrength.score}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {insights.profileStrength.score}/100
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Skills Analysis */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills ({insights.skillsAnalysis.totalSkills})
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {insights.skillsAnalysis.techStack
                      .slice(0, 3)
                      .map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                  </Box>
                  {insights.skillsAnalysis.recommendations.length > 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Recommended Skills:
                      </Typography>
                      <List dense>
                        {insights.skillsAnalysis.recommendations.map(
                          (rec, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                primary={rec}
                                primaryTypographyProps={{ variant: "body2" }}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Certifications */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Certifications (
                    {insights.certificationAnalysis.totalCertifications})
                  </Typography>
                  {insights.certificationAnalysis.suggestions.length > 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Suggested Certifications:
                      </Typography>
                      <List dense>
                        {insights.certificationAnalysis.suggestions.map(
                          (cert, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText
                                primary={cert}
                                primaryTypographyProps={{ variant: "body2" }}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobPredictionDashboard;
