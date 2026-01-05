import React from 'react';
import { Box, Alert } from '@mui/material';
import AdminDashboard from '../Components/AdminDashboard';
import { useAuth } from '../Hooks/Context/AuthContext';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Box>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;