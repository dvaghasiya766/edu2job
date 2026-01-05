import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Visibility,
  ThumbUp,
  Star,
} from "@mui/icons-material";
import { Colors } from "../Consts/Colors";

interface ProfileAnalyticsProps {
  profileViews?: number;
  profileLikes?: number;
  skillsRating?: number;
  completionRate?: number;
}

const ProfileAnalytics = ({
  profileViews = 156,
  profileLikes = 23,
  skillsRating = 4.2,
  completionRate = 85,
}: ProfileAnalyticsProps) => {
  const metrics = [
    {
      title: "Profile Views",
      value: profileViews,
      icon: <Visibility />,
      color: Colors.GradientBlue,
      change: "+12%",
    },
    {
      title: "Profile Likes",
      value: profileLikes,
      icon: <ThumbUp />,
      color: Colors.GradientGreen,
      change: "+8%",
    },
    {
      title: "Skills Rating",
      value: skillsRating.toFixed(1),
      icon: <Star />,
      color: "#FFD700",
      change: "+0.3",
    },
  ];

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return Colors.GradientGreen;
    if (rate >= 60) return "#FF9800";
    return "#F44336";
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <TrendingUp sx={{ mr: 1, color: Colors.GradientBlue }} />
          <Typography variant="h6" fontWeight="bold">
            Profile Analytics
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Completion Rate */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold">
              Profile Completion
            </Typography>
            <Chip 
              label={`${completionRate}%`} 
              size="small" 
              sx={{ 
                bgcolor: getCompletionColor(completionRate) + "20",
                color: getCompletionColor(completionRate),
                fontWeight: "bold"
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: getCompletionColor(completionRate),
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {completionRate >= 80 ? "Excellent!" : completionRate >= 60 ? "Good progress" : "Needs improvement"}
          </Typography>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: metric.color + "10",
                  border: `1px solid ${metric.color}20`,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ color: metric.color }}>
                      {metric.icon}
                    </Box>
                    <Typography variant="body2" fontWeight="500">
                      {metric.title}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" fontWeight="bold" color={metric.color}>
                      {metric.value}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {metric.change}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Insights */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            💡 Insights
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Your profile is performing well! Consider adding more certifications to boost your visibility.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileAnalytics;