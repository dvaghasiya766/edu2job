import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Pages } from "../Consts/Pages";
import Dashboard from "../Pages/Dashboard";
import RegisterPage from "../Pages/RegisterPage";
import LogInPage from "../Pages/LogInPage";
import VerificationPage from "../Pages/VerificationPage";
import Profile from "../Pages/Profile";
import AdminPage from "../Pages/AdminPage";
import Layout from "../Modals/Layout";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useAuth } from "../Hooks/Context/AuthContext";
import AuthPage from "../Pages/AuthPage";
import AuthCallback from "../Pages/AuthCallback";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Protected Routes that share NavBar */}
        <Route
          path={Pages.DASHBOARD}
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path={Pages.PROFILE} element={<Profile />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path={Pages.REGISTER} element={<RegisterPage />} />
        <Route path={Pages.LOGIN} element={<LogInPage />} />
        <Route path={Pages.VERIFICATION} element={<VerificationPage />} />
        <Route path={Pages.AUTHSUCCESS} element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to={Pages.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const RootRedirect = () => {
  const { isLoggedIn } = useAuth();
  return <Navigate to={isLoggedIn ? Pages.DASHBOARD : Pages.LOGIN} replace />;
};

export default AppRoutes;
