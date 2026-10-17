
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/authSlice";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

// Backend API URL.
// Local development defaults to port 5000.
// Set VITE_API_URL to your deployed backend URL for production.
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!form.username.trim() || !form.password) {
      dispatch(
        loginFailure("Enter your username and password.")
      );
      return;
    }

    dispatch(loginStart());

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        dispatch(
          loginFailure(
            data.message || "Login failed. Please try again."
          )
        );
        return;
      }

      if (!data.token || !data.user) {
        dispatch(
          loginFailure(
            "The server returned an invalid login response."
          )
        );
        return;
      }

      // Save the authenticated user and token through Redux.
      // authSlice handles session storage.
      dispatch(
        loginSuccess({
          token: data.token,
          user: data.user,
        })
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login request failed:", error);

      dispatch(
        loginFailure(
          "Unable to connect to the server. Check your backend URL and connection."
        )
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin}>
      <Typography variant="h4" fontWeight="bold">
        Sign In
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Enter your employee account credentials.
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Username"
        name="username"
        autoComplete="username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={form.remember}
              name="remember"
              onChange={handleChange}
            />
          }
          label="Remember Me"
        />

        <Link href="/forgot-password" underline="hover">
          Forgot Password?
        </Link>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        sx={{
          mt: 4,
          py: 1.5,
          borderRadius: 2,
        }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Sign In"
        )}
      </Button>
    </Box>
  );
}

export default LoginForm;
