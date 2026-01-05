import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider
} from '@mui/material';
import { useAuth } from '../Hooks/Context/AuthContext';
import { stringAvatar } from '../Components/NavBar';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Admin Profile
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              {...stringAvatar(user.name || 'Admin', 80)}
              sx={{ 
                ...stringAvatar(user.name || 'Admin', 80).sx,
                mr: 3 
              }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user.name}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Email Address
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1">
                Administrator
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminProfile;