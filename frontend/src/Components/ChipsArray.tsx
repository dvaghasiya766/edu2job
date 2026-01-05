import {
  Box,
  Button,
  Chip,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Colors } from "../Consts/Colors";

interface ChipArrayProps {
  skills: string[];
  icon?: boolean;
  onDelete?: (label: string) => void;
}

const ChipsArray = ({ skills, icon = false, onDelete }: ChipArrayProps) => {
  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          mb: 2,
          bgcolor: Colors.SecondaryBG ?? "background.paper",
          borderRadius: 3,
          boxShadow: "0px 3px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: Colors.LabelText,
            mb: 1.5,
            fontSize: 18,
          }}
        >
          Skills
        </Typography>

        <Box
          component="ul"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.2,
            p: 0,
            m: 0,
            listStyle: "none",
          }}
        >
          <Box
            component="form"
            noValidate
            marginBottom={2}
            width="100%"
            display={"flex"}
          >
            <TextField
              type="text"
              label="Add New Skill"
              variant="standard"
              fullWidth
              color="primary"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
                fontFamily: "Roboto",
                fontSize: 15,
                color: "white !important",
                letterSpacing: 1,
                marginLeft: 3,
                width: 200,
              }}
              disabled
            >
              Add Now
            </Button>
          </Box>

          {skills.map((skill) => (
            <ListItem key={skill} sx={{ width: "auto", p: 0 }}>
              <Chip
                label={skill}
                variant="outlined"
                deleteIcon={
                  icon ? (
                    <CloseIcon sx={{ color: Colors.GradientBlue }} />
                  ) : undefined
                }
                onDelete={icon && onDelete ? () => onDelete(skill) : undefined}
                sx={{
                  px: 1.2,
                  py: 0.5,
                  fontSize: 14,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  color: Colors.GradientBlue,
                  border: "solid 2px",
                  borderColor: Colors.GradientBlue,
                  transition: "0.25s ease",
                  "&:hover": {
                    bgcolor: Colors.GradientBlue + "22",
                    borderColor: Colors.GradientBlue,
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.10)",
                  },
                }}
              />
            </ListItem>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChipsArray;
