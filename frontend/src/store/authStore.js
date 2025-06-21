import { create } from "zustand";
import axios from "axios";

const API_url = "http://localhost:5000/api/auth";

// This is important for sending cookies with requests
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true, error: null });
      const response = await axios.get(`${API_url}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null
      });
    }
  },
  
  signup: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_url}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Signing Up",
        isLoading: false,
      });
      throw error;
    }
  },
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_url}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Logging In",
        isLoading: false,
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_url}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Logging Out",
        isLoading: false,
      });
      throw error;
    }
  },
  
  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_url}/verify-email`, {
        code: verificationCode,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },
  
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      if (!email) {
        set({
          isLoading: false,
          error: "Email is required"
        });
        throw new Error("Email is required");
      }
      
      const response = await axios.post(`${API_url}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_url}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  }
}));
