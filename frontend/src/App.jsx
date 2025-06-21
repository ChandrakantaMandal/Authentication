import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/authStore";

import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import HomePage from "./Pages/HomePage";
import LoadingSpiner from "./components/LoadingSpiner";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from './Pages/ResetPasswordPage'

//procete route that requried authication
const ProctectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user exists before accessing its properties
  if (!user || !user.isVerified) {
    return <Navigate to="/signup" replace />;
  }
  
  return children;
};

//redirect authenicated User to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  // Check if user exists before accessing its properties
  if (isAuthenticated && user && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpiner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex justify-center items-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProctectedRoute>
              <HomePage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
      
				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;



