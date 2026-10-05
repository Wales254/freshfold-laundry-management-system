import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // ==========================
    // Login Start
    // ==========================
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ==========================
    // Login Success
    // ==========================
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Save login session
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );
    },

    // ==========================
    // Login Failed
    // ==========================
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    // ==========================
    // Logout
    // ==========================
    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("auth");
    },

    // ==========================
    // Update User Profile
    // ==========================
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        // Keep localStorage synchronized
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
          })
        );
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;