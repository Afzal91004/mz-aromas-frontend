// src/config/api.js - FIXED VERSION

import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // CRITICAL: Cookies ke liye zaroori
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Har request se pehle
API.interceptors.request.use(
  (config) => {
    // Attach bearer token from localStorage (fallback if cookie missing)
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Har response ke baad
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message);

    // Handle specific error codes
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - User logged out
      if (status === 401) {
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        // Don't redirect here - let Redux handle it
      }

      // 403 Forbidden
      if (status === 403) {
        toast.error("Access denied");
      }

      // 404 Not Found
      if (status === 404) {
        toast.error(data?.message || "Resource not found");
      }

      // 500 Internal Server Error
      if (status === 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // Request sent but no response
      toast.error("Network error. Please check your connection.");
      console.error("🌐 Network Error:", error.request);
    } else {
      // Something else happened
      toast.error("An unexpected error occurred");
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
