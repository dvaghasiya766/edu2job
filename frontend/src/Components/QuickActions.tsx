import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import {
  Share,
  GetApp,
  Visibility,
  Edit,
  Assessment,
  Work,
} from "@mui/icons-material";
import { Colors } from "../Consts/Colors";

interface QuickActionsProps {
  onEditProfile?: () => void;
  onDownloadCV?: () => void;
  onViewAnalytics?: () => void;
}

const QuickActions = ({ 
  onEditProfile, 
  onDownloadCV, 
  onViewAnalytics 
}: QuickActionsProps) => {
  const actions = [
    {
      title: "Edit Profile",
      description: "Update your information",
      icon: <Edit />,
      color: Colors.GradientBlue,
      onClick: onEditProfile,
    },
    {
      title: "Download CV",
      description: "Get your resume",
      icon: <GetApp />,
      color: Colors.GradientGreen,
      onClick: onDownloadCV,
    },
    {
      title: "Share Profile",
      description: "Share with recruiters",
      icon: <Share />,
      color: "#9C27B0",
      onClick: () => console.log("Share profile"),
    },
    {
      title: "View Analytics",
      description: "Profile performance",
      icon: <Assessment />,
      color: "#FF9800",
      onClick: onViewAnalytics,
    },
    {
      title: "Preview Profile",
      description: "See public view",
      icon: <Visibility />,
      color: "#607D8B",
      onClick: () => console.log("Preview profile"),
    },
    {
      title: "Job Matches",
      description: "Find suitable jobs",
      icon: <Work />,
      color: "#4CAF50",
      onClick: () => console.log("Job matches"),
    },
  ];

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⚡ Quick Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={action.onClick}
                sx={{
                  p: 2,
                  height: "100%",
                  flexDirection: "column",
                  gap: 1,
                  borderColor: action.color + "40",
                  color: action.color,
                  "&:hover": {
                    borderColor: action.color,
                    bgcolor: action.color + "10",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ color: action.color, fontSize: 32 }}>
                  {action.icon}
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {action.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;