import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Hooks/Context/AuthContext";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Pages } from "../Consts/Pages";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      const token = searchParams.get("token");
      const refresh = searchParams.get("refresh");
      const userParam = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        setLoading(false);
        navigate(`${Pages.LOGIN}?error=auth_failed`);
        return;
      }

      if (token && refresh && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          login(userData, token, refresh);
          setLoading(false);
          navigate(Pages.DASHBOARD);
        } catch (err) {
          setLoading(false);
          navigate(`${Pages.LOGIN}?error=invalid_data`);
        }
      } else {
        setLoading(false);
        navigate(`${Pages.LOGIN}?error=missing_params`);
      }
    };

    processAuth();
  }, [searchParams, login, navigate]);

  if (!loading) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography>Authenticating...</Typography>
    </Box>
  );
};

export default AuthCallback;
