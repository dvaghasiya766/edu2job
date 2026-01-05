import {
  Backdrop,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  Modal,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Colors } from "../Consts/Colors";
import { stringToColor } from "../Components/NavBar";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../Hooks/Context/AuthContext";
import InformationText from "../Components/InformationText";
import EnhancedSkillsManager from "../Components/EnhancedSkillsManager";
import EnhancedCertificationsManager from "../Components/EnhancedCertificationsManager";
import QuickActions from "../Components/QuickActions";
import ProfileAnalytics from "../Components/ProfileAnalytics";
import {
  Edit,
  PhotoCamera,
  School,
  Work,
  Star,
  TrendingUp,
  Assessment,
  Download,
} from "@mui/icons-material";
import UpdateDetailForm from "../Forms/UpdateDetailForm";
import FormHeading from "../Components/FormHeading";

// const dummy_data = {
//   userInfo: {
//     name: "Dev",
//     email: "dvahasiya766@rku.ac.in",
//     degree: "B.Tech Information Technology",
//     yearOfPassing: 2025,
//     skills: ["HTML", "CSS", "JS", "React", "NodeJS", "Express"],
//     CGPA: "8.04",
//     Collage: "RKU",
//     Certifications: [
//       {
//         title: "Full Stack Web Development",
//         issuer: "Coursera",
//         year: 2023,
//       },
//       {
//         title: "Cloud Fundamentals",
//         issuer: "AWS",
//         year: 2024,
//       },
//     ],
//   },
// };

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const [open, setOpen] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { updateUser } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculateProfileCompletion = (user: any) => {
    if (!user) return 0;
    let completion = 0;
    if (user.name) completion += 20;
    if (user.email) completion += 20;
    if (user.degree) completion += 15;
    if (user.CGPA) completion += 15;
    if (user.skills && user.skills.length > 0) completion += 15;
    if (user.Certifications && user.Certifications.length > 0) completion += 15;
    return completion;
  };

  const profileCompletion = calculateProfileCompletion(userData);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        updateUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  const stats = {
    applications: 12,
    interviews: 5,
    offers: 2,
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: Colors.PrimaryBG,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: Colors.PrimaryBG, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Profile Header Card */}
        <Card
          elevation={3}
          sx={{ mb: 3, borderRadius: 3, overflow: "visible" }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid
                size={{ xs: 12, md: 3 }}
                display="flex"
                justifyContent="center"
              >
                <Box position="relative">
                  <Avatar
                    src={profileImage || undefined}
                    sx={{
                      width: 150,
                      height: 150,
                      bgcolor: profileImage
                        ? "transparent"
                        : stringToColor(userData?.name || "User"),
                      fontSize: "3rem",
                      border: `4px solid ${Colors.GradientBlue}`,
                      boxShadow: "0 8px 32px rgba(33, 150, 243, 0.3)",
                    }}
                  >
                    {!profileImage && (userData?.name?.[0] || "U")}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profile-image-upload">
                    <Tooltip title="Change Profile Picture">
                      <IconButton
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: Colors.GradientBlue,
                          color: "white",
                          "&:hover": { bgcolor: Colors.GradientGreen },
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </Tooltip>
                  </label>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {userData?.name || "Loading..."}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {userData?.degree || "Not specified"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {userData?.email || "Loading..."}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Profile Completion
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {profileCompletion}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={profileCompletion}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Grid>

              <Grid
                size={{ xs: 12, md: 3 }}
                display="flex"
                flexDirection="column"
                gap={1}
              >
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleOpen}
                  sx={{
                    background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
                    borderRadius: 2,
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{ borderRadius: 2 }}
                >
                  Download CV
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{ borderRadius: 2, textAlign: "center", p: 2 }}
            >
              <Work sx={{ fontSize: 40, color: Colors.GradientBlue, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.applications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Applications
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{ borderRadius: 2, textAlign: "center", p: 2 }}
            >
              <TrendingUp
                sx={{ fontSize: 40, color: Colors.GradientGreen, mb: 1 }}
              />
              <Typography variant="h4" fontWeight="bold">
                {stats.interviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interviews
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={2}
              sx={{ borderRadius: 2, textAlign: "center", p: 2 }}
            >
              <Star sx={{ fontSize: 40, color: "#FFD700", mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.offers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Job Offers
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Academic Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <School sx={{ mr: 1, color: Colors.GradientBlue }} />
                  <Typography variant="h6" fontWeight="bold">
                    Academic Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <InformationText
                  label="CGPA"
                  value={userData?.CGPA || "Not specified"}
                />
                <InformationText
                  label="College"
                  value={userData?.Collage || "Not specified"}
                />
                <InformationText
                  label="Year of Passing"
                  value={userData?.yearOfPassing?.toString() || "Not specified"}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Assessment sx={{ mr: 1, color: Colors.GradientGreen }} />
                  <Typography variant="h6" fontWeight="bold">
                    Skills & Expertise
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <EnhancedSkillsManager
                  skills={userData?.skills || []}
                  onSkillsChange={(skills: string[]) => {
                    setUserData((prev: any) => ({ ...prev, skills }));
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Certifications */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <EnhancedCertificationsManager
                  certifications={userData?.Certifications || []}
                  onCertificationsChange={async (certs: any[]) => {
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
                          body: JSON.stringify({ certifications: certs }),
                        }
                      );
                      if (response.ok) {
                        const data = await response.json();
                        setUserData(data.user);
                        updateUser(data.user);
                      }
                    } catch (error) {
                      console.error("Error updating certifications:", error);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <QuickActions
                onEditProfile={handleOpen}
                onDownloadCV={() => console.log("Download CV")}
                onViewAnalytics={() => console.log("View Analytics")}
              />
              <ProfileAnalytics />
            </Box>
          </Grid>
        </Grid>

        {/* Edit Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          disableScrollLock
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: { TransitionComponent: Fade },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <FormHeading
                mainTitle="Update Your Details"
                subTitle="Keep your profile up to date"
                alignCenter
              />
              <UpdateDetailForm
                CGPA={userData?.CGPA || ""}
                degree={userData?.degree || ""}
                name={userData?.name || ""}
                yearOfPassing={
                  userData?.yearOfPassing || new Date().getFullYear()
                }
                collage={userData?.Collage || ""}
                onUpdate={fetchUserProfile}
                onClose={handleClose}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default Profile;
