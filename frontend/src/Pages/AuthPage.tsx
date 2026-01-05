import axios from "axios";
import React, { useEffect } from "react";
import { useAuth } from "../Hooks/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pages } from "../Consts/Pages";

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("accessToken", token);
        window.location.href = "/dashboard";
        try {
          const response = await axios.get("http://localhost:8000/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.success) {
            const user = response.data;
            console.log(user);
            login(user, token, token);
            navigate(Pages.DASHBOARD);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    handleAuth();
  });
  return <div>AuthPage</div>;
};

export default AuthPage;
