
import { createSlice } from "@reduxjs/toolkit";

function loadSavedSession() {
  try {
    const saved = sessionStorage.getItem("auth");

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (
      !parsed ||
      typeof parsed.token !== "string" ||
      !parsed.token ||
      !parsed.user ||
      typeof parsed.user !== "object" ||
      !parsed.user.id ||
      !parsed.user.role
    ) {
      sessionStorage.removeItem("auth");
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem("auth");
    return null;
  }
}

const savedSession = loadSavedSession();

const initialState = {
  isAuthenticated: Boolean(savedSession),
  loading: false,
  user: savedSession?.user || null,
  token: savedSession?.token || null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      sessionStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );

      // Remove any older persistent session.
      localStorage.removeItem("auth");
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      sessionStorage.removeItem("auth");
      localStorage.removeItem("auth");
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;

      sessionStorage.removeItem("auth");
      localStorage.removeItem("auth");
    },

    updateProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        sessionStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
          })
        );
      }
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
