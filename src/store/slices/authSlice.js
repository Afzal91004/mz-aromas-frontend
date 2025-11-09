// src/store/slices/authSlice.js - COMPLETE FIX
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../config/api";
import { toast } from "react-toastify";

// ============================================
// ASYNC THUNKS
// ============================================

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/register", userData);

      // Store user and token in localStorage as backup
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Registration successful!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/login", credentials);

      // Store user and token in localStorage as backup
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Login successful!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await API.get("/logout");

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      toast.success("Logged out successfully");
      return null;
    } catch (error) {
      // Even if API fails, clear local data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get User Profile (verify session)
export const getUserProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/me");

      // Update localStorage with latest user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      // If profile fetch fails, clear auth state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.put("/me/update", userData);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Profile updated successfully!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false,
        error: null,
        initialized: false, // Will verify with server
      };
    }
  } catch (error) {
    console.error("Error loading auth state:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  };
};

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    // Mark auth as initialized (after checking with server)
    setInitialized: (state) => {
      state.initialized = true;
    },

    // Force logout (for when session is invalid)
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // Restore session from localStorage (temporary until verified)
    restoreSession: (state) => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          state.user = JSON.parse(storedUser);
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // ============================================
      // REGISTER
      // ============================================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      // ============================================
      // LOGIN
      // ============================================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      // ============================================
      // LOGOUT
      // ============================================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails on server, clear local state
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })

      // ============================================
      // GET PROFILE (Session Verification)
      // ============================================
      .addCase(getUserProfile.pending, (state) => {
        // Don't set loading for profile check (silent operation)
        // state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.initialized = true;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state) => {
        // Session is invalid
        state.isAuthenticated = false;
        state.user = null;
        state.initialized = true;
      })

      // ============================================
      // UPDATE PROFILE
      // ============================================
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      });
  },
});

export const { clearError, setInitialized, forceLogout, restoreSession } =
  authSlice.actions;
export default authSlice.reducer;
