import React from 'react';
import { Button, Box } from '@mui/material';
import { Google } from '@mui/icons-material';

const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleGoogleLogin}
      startIcon={<Google />}
      sx={{
        py: 1.5,
        borderColor: '#4285f4',
        color: '#4285f4',
        '&:hover': {
          borderColor: '#3367d6',
          backgroundColor: '#f8f9fa',
        },
      }}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;