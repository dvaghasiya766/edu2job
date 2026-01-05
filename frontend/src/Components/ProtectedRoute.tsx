import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/Context/AuthContext";
import { Pages } from "../Consts/Pages";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  return isLoggedIn ? <>{children}</> : <Navigate to={Pages.LOGIN} replace />;
};

export default ProtectedRoute;