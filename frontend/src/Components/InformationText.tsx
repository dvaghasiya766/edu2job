import {
  Box,
  Paper,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Colors } from "../Consts/Colors";

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode; // optional icon
}

const InfoItem = ({ label, value, icon }: InfoItemProps) => {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 0.9,
          mb: 2,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <ListItem sx={{ px: 0 }}>
          {icon && (
            <ListItemIcon sx={{ minWidth: 35, color: Colors.LabelText }}>
              {icon}
            </ListItemIcon>
          )}

          <ListItemText
            primary={
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: Colors.LabelText }}
              >
                {label}
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                sx={{
                  color: Colors.SubTitle,
                  mt: 0.3,
                  fontSize: { xs: 18, md: 20 },
                }}
              >
                {value}
              </Typography>
            }
          />
        </ListItem>
      </Paper>
    </Box>
  );
};

export default InfoItem;
