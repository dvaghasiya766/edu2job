import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Badge,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,

} from "@mui/material";
import {
  Notifications,
  Person,
  Dashboard,
  Logout,
  Settings,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import Logo from "./Logo";
import { Colors } from "../Consts/Colors";
import { useNavigate } from "react-router-dom";
import { Pages } from "../Consts/Pages";
import { useAuth } from "../Hooks/Context/AuthContext";

interface NavBarProps {
  userName?: string;
}

const settings = [
  { label: "Dashboard", path: Pages.DASHBOARD, icon: <Dashboard /> },
  { label: "Profile", path: Pages.PROFILE, icon: <Person /> },
  { label: "Settings", path: "/settings", icon: <Settings /> },
  { label: "Logout", path: Pages.LOGOUT, icon: <Logout /> },
];

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const stringAvatar = (
  name: string | React.HTMLElementType,
  size?: number
) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: size || 35,
      height: size || 35,
    },
    children: `${name.split(" ")[0][0]}`,
  };
};

const NavBar = ({ userName: propUserName }: NavBarProps) => {
  const navigate = useNavigate();
  const { user, logout, accessToken } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState(3);
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  const userName = propUserName || user?.name || "User";

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path?: string) => {
    setAnchorEl(null);
    if (path === Pages.LOGOUT) {
      handleLogout();
    } else if (path) {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setLogoutLoading(true);
    try {
      const response = await fetch("http://localhost:8000/users/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        logout();
        navigate(Pages.LOGIN);
      } else {
        // Even if API fails, logout locally for security
        logout();
        navigate(Pages.LOGIN);
      }
    } catch (error) {
      // Network error - logout locally anyway
      logout();
      navigate(Pages.LOGIN);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: Colors.SecondaryBG,
        borderBottom: `1px solid ${Colors.GradientBlue}20`,
        backdropFilter: "blur(10px)"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Logo />
          
          {/* Right Side Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            
            {/* Notifications */}
            <IconButton
              size="large"
              sx={{
                color: Colors.GradientBlue,
                "&:hover": { bgcolor: Colors.GradientBlue + "10" },
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <IconButton size="large" onClick={handleMenu} sx={{ p: 0, ml: 1 }}>
              <Avatar 
                {...stringAvatar(userName, 40)}
                sx={{
                  ...stringAvatar(userName, 40).sx,
                  border: `2px solid ${Colors.GradientBlue}`,
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease",
                  },
                }}
              />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleClose()}
              disableScrollLock
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    "&:hover": {
                      bgcolor: Colors.GradientBlue + "10",
                    },
                  },
                },
              }}
            >
              {/* User Info Header */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || "user@example.com"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              
              {settings.map((setting) => (
                <MenuItem
                  key={setting.path}
                  onClick={() => handleClose(setting.path)}
                  disabled={setting.label === "Logout" && logoutLoading}
                  sx={{
                    ...(setting.label === "Logout" && {
                      color: "error.main",
                      "&:hover": { bgcolor: "error.light", color: "error.dark" },
                    }),
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                    {setting.label === "Logout" && logoutLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      setting.icon
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    {setting.label === "Logout" && logoutLoading ? "Logging out..." : setting.label}
                  </ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
