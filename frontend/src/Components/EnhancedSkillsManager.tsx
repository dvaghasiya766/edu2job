import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import React, { useState } from "react";
import { Colors } from "../Consts/Colors";
import { useAuth } from "../Hooks/Context/AuthContext";
import { useNotification } from "./GlobalPopup";

interface EnhancedSkillsManagerProps {
  skills: string[];
  onSkillsChange?: (skills: string[]) => void;
  readOnly?: boolean;
}

const popularSkills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
  "HTML", "CSS", "MongoDB", "MySQL", "Git", "Docker", "AWS",
  "Angular", "Vue.js", "Express.js", "Spring Boot", "Django",
  "Machine Learning", "Data Analysis", "UI/UX Design", "Figma"
];

const EnhancedSkillsManager = ({ 
  skills: initialSkills, 
  onSkillsChange,
  readOnly = false 
}: EnhancedSkillsManagerProps) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { accessToken, updateUser } = useAuth();
  const { showNotification } = useNotification();

  const updateSkillsOnServer = async (updatedSkills: string[]) => {
    if (!accessToken) return false;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/users/update-skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ skills: updatedSkills }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser({ skills: updatedSkills });
        return true;
      } else {
        showNotification('error', 'Update Failed', data.message || 'Failed to update skills');
        return false;
      }
    } catch (error) {
      showNotification('error', 'Network Error', 'Failed to connect to server');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const updatedSkills = [...skills, trimmedSkill];
      const success = await updateSkillsOnServer(updatedSkills);
      
      if (success) {
        setSkills(updatedSkills);
        onSkillsChange?.(updatedSkills);
        setNewSkill("");
        setShowAlert({type: 'success', message: `Added "${trimmedSkill}" to your skills`});
      }
    } else if (skills.includes(trimmedSkill)) {
      setShowAlert({type: 'error', message: 'Skill already exists'});
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    const success = await updateSkillsOnServer(updatedSkills);
    
    if (success) {
      setSkills(updatedSkills);
      onSkillsChange?.(updatedSkills);
      setShowAlert({type: 'success', message: `Removed "${skillToRemove}" from your skills`});
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
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
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: Colors.LabelText,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        💡 Skills & Technologies
        <Chip 
          label={skills.length} 
          size="small" 
          color="primary" 
          sx={{ ml: 1 }}
        />
      </Typography>

      {!readOnly && (
        <Box sx={{ mb: 3 }}>
          <Box display="flex" gap={1} mb={2}>
            <Autocomplete
              freeSolo
              options={popularSkills.filter(skill => !skills.includes(skill))}
              value={newSkill}
              onInputChange={(_, value) => setNewSkill(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add a new skill..."
                  variant="outlined"
                  size="small"
                  onKeyPress={handleKeyPress}
                  sx={{ flexGrow: 1 }}
                />
              )}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleAddSkill}
              disabled={!newSkill.trim() || loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Add />}
              sx={{
                background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
                minWidth: 100,
              }}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </Box>
          
          {popularSkills.filter(skill => !skills.includes(skill)).length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Suggested skills:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {popularSkills
                  .filter(skill => !skills.includes(skill))
                  .slice(0, 6)
                  .map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => {
                        setNewSkill(skill);
                        handleAddSkill();
                      }}
                      sx={{
                        borderColor: Colors.GradientBlue + "40",
                        "&:hover": {
                          borderColor: Colors.GradientBlue,
                          bgcolor: Colors.GradientBlue + "10"
                        }
                      }}
                    />
                  ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Box display="flex" flexWrap="wrap" gap={1.5}>
        {skills.map((skill, index) => (
          <Chip
            key={skill}
            label={skill}
            variant="filled"
            {...(!readOnly && {
              onDelete: loading ? undefined : () => handleRemoveSkill(skill),
              deleteIcon: <Close />
            })}
            sx={{
              px: 1,
              py: 0.5,
              fontSize: 14,
              fontWeight: "600",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${Colors.GradientBlue}15, ${Colors.GradientGreen}15)`,
              color: Colors.GradientBlue,
              border: `2px solid ${Colors.GradientBlue}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${Colors.GradientBlue}30`,
                background: `linear-gradient(135deg, ${Colors.GradientBlue}25, ${Colors.GradientGreen}25)`,
              },
            }}
          />
        ))}
        
        {skills.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No skills added yet. {!readOnly && "Start by adding your first skill!"}
          </Typography>
        )}
      </Box>

      <Snackbar
        open={!!showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default EnhancedSkillsManager;