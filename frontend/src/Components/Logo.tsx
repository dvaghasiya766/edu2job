import { Avatar, Box, Typography, Chip } from "@mui/material";
import { Colors } from "../Consts/Colors";
import LogoImg from "../Assets/EDU2 Logo.png";
import React from "react";
import { Pages } from "../Consts/Pages";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(Pages.DASHBOARD);
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      gap={{ xs: 1, md: 2 }}
      sx={{
        cursor: "pointer",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
      onClick={handleLogoClick}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Edu2Job Logo"
          src={LogoImg}
          sx={{
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            border: `2px solid ${Colors.GradientBlue}30`,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${Colors.GradientBlue}20`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 6px 20px ${Colors.GradientBlue}40`,
              border: `2px solid ${Colors.GradientBlue}60`,
            },
          }}
          variant="rounded"
        />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Typography
          variant="h6"
          noWrap
          fontSize={{ xs: 20, md: 26 }}
          fontFamily="Niconne"
          fontWeight="bold"
          letterSpacing=".1rem"
          sx={{
            background: `linear-gradient(135deg, ${Colors.GradientBlue}, ${Colors.GradientGreen})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              letterSpacing: ".15rem",
            },
          }}
        >
          Edu2Job
        </Typography>
        <Chip
          label="Career Platform"
          size="small"
          sx={{
            height: 18,
            fontSize: 10,
            fontWeight: "bold",
            bgcolor: Colors.GradientBlue + "15",
            color: Colors.GradientBlue,
            border: `1px solid ${Colors.GradientBlue}30`,
            display: { xs: "none", md: "flex" },
          }}
        />
      </Box>
    </Box>
  );
};

export default Logo;
