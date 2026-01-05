import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  Snackbar,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  MoreVert,
  WorkspacePremium,
  CalendarToday,
  Business,
} from "@mui/icons-material";
import React, { useState } from "react";
import { Colors } from "../Consts/Colors";
import FormHeading from "./FormHeading";

interface Certification {
  title: string;
  issuer: string;
  year: number;
  _id?: string;
}

interface EnhancedCertificationsManagerProps {
  certifications: Certification[];
  onCertificationsChange?: (certifications: Certification[]) => void;
  readOnly?: boolean;
}

const EnhancedCertificationsManager = ({
  certifications: initialCertifications,
  onCertificationsChange,
  readOnly = false,
}: EnhancedCertificationsManagerProps) => {
  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications
  );
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    year: new Date().getFullYear(),
  });
  const [showAlert, setShowAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleAddCertification = async () => {
    if (newCert.title.trim() && newCert.issuer.trim()) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/users/certifications', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCert)
        });
        
        if (response.ok) {
          const data = await response.json();
          const updatedCerts = [...certifications, data.certification];
          setCertifications(updatedCerts);
          onCertificationsChange?.(updatedCerts);
          setShowAlert({type: 'success', message: 'Certification added successfully!'});
          setNewCert({ title: "", issuer: "", year: new Date().getFullYear() });
          setOpen(false);
        } else {
          setShowAlert({type: 'error', message: 'Failed to add certification'});
        }
      } catch (error) {
        setShowAlert({type: 'error', message: 'Network error'});
      }
    }
  };

  const handleEditCertification = (index: number) => {
    setEditIndex(index);
    setNewCert(certifications[index]);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleRemoveCertification = (index: number) => {
    const updatedCerts = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCerts);
    onCertificationsChange?.(updatedCerts);
    setShowAlert({ type: "success", message: "Certification removed" });
    setDeleteConfirmOpen(false);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: Colors.SecondaryBG,
        borderRadius: 3,
        border: `1px solid ${Colors.GradientBlue}20`,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: Colors.LabelText,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🏆 Certifications & Achievements
          <Chip
            label={certifications.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Typography>

        {!readOnly && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            size="small"
            sx={{
              borderColor: Colors.GradientBlue,
              color: Colors.GradientBlue,
              "&:hover": {
                bgcolor: Colors.GradientBlue + "10",
                borderColor: Colors.GradientBlue,
              },
            }}
          >
            Add
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {certifications.map((cert, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <Card
              elevation={1}
              sx={{
                borderRadius: 2,
                border: `1px solid ${Colors.GradientBlue}20`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${Colors.GradientBlue}20`,
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box display="flex" gap={2} flexGrow={1}>
                    <WorkspacePremium
                      sx={{
                        color: Colors.GradientBlue,
                        fontSize: 28,
                        mt: 0.5,
                      }}
                    />
                    <Box flexGrow={1}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {cert.title}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        flexWrap="wrap"
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Business
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {cert.issuer}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarToday
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {cert.year}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {!readOnly && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, index)}
                      sx={{
                        color: "text.secondary",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {certifications.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", textAlign: "center", py: 2 }}
            >
              No certifications added yet.{" "}
              {!readOnly && "Click 'Add' to include your achievements!"}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
      >
        <MenuItem
          onClick={() =>
            selectedIndex !== null && handleEditCertification(selectedIndex)
          }
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        disableScrollLock
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { TransitionComponent: Fade },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxWidth: 500,
              width: "90%",
            }}
          >
            <FormHeading
              mainTitle={
                editIndex !== null
                  ? "Edit Certification"
                  : "Add New Certification"
              }
              subTitle={
                editIndex !== null
                  ? "Update your certification details"
                  : "Add a new certification to your profile"
              }
              alignCenter
            />
            <Box display="flex" flexDirection="column" gap={2} pt={2}>
              <TextField
                label="Certification Title"
                value={newCert.title}
                onChange={(e) =>
                  setNewCert((prev) => ({ ...prev, title: e.target.value }))
                }
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Issuing Organization"
                value={newCert.issuer}
                onChange={(e) =>
                  setNewCert((prev) => ({ ...prev, issuer: e.target.value }))
                }
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Year"
                type="number"
                value={newCert.year}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    year: parseInt(e.target.value),
                  }))
                }
                fullWidth
                variant="outlined"
                inputProps={{ min: 2000, max: new Date().getFullYear() + 1 }}
              />
              <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleAddCertification}
                  variant="contained"
                  disabled={!newCert.title.trim() || !newCert.issuer.trim()}
                  sx={{
                    background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
                  }}
                >
                  {editIndex !== null
                    ? "Update Certification"
                    : "Add Certification"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        closeAfterTransition
        disableScrollLock
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: { TransitionComponent: Fade },
        }}
      >
        <Fade in={deleteConfirmOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <FormHeading
              mainTitle="Delete Certification"
              subTitle="Are you sure you want to delete this certification? This action cannot be undone."
              alignCenter
            />
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedIndex !== null &&
                  handleRemoveCertification(selectedIndex)
                }
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={!!showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={showAlert?.type}
          onClose={() => setShowAlert(null)}
          sx={{ minWidth: 300 }}
        >
          {showAlert?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EnhancedCertificationsManager;
