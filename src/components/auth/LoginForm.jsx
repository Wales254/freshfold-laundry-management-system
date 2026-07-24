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


function LoginForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );


  const [showPassword, setShowPassword] =
    useState(false);


  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });


  const handleChange = (e) => {

    const {
      name,
      value,
      checked,
      type
    } = e.target;


    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };


  const handleLogin = () => {

    dispatch(loginStart());


    // Temporary login until backend is connected

    if (
      form.email === "admin@freshfold.com" &&
      form.password === "123456"
    ) {


      const userData = {

        token: "demo-token",

        user: {
          id: 1,
          name: "Administrator",
          email: form.email,
          role: "Admin",
        },

      };


      // Update Redux state
      dispatch(
        loginSuccess(userData)
      );


      // Save login session
      localStorage.setItem(
        "auth",
        JSON.stringify(userData)
      );


      alert("Login Successful");


      // Dashboard is the index route
      navigate("/");


    } else {


      dispatch(
        loginFailure(
          "Invalid email or password."
        )
      );

    }

  };


  return (

    <Box>


      <Typography
        variant="h4"
        fontWeight="bold"
      >
        Sign In
      </Typography>


      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Enter your account credentials.
      </Typography>



      <TextField

        fullWidth

        margin="normal"

        label="Email"

        name="email"

        value={form.email}

        onChange={handleChange}

      />



      <TextField

        fullWidth

        margin="normal"

        label="Password"

        name="password"

        type={
          showPassword
            ? "text"
            : "password"
        }

        value={form.password}

        onChange={handleChange}


        InputProps={{

          endAdornment:(

            <InputAdornment position="end">

              <IconButton

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

              >

                {showPassword ? (

                  <VisibilityOff />

                ) : (

                  <Visibility />

                )}

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



        <Link

          href="/forgot-password"

          underline="hover"

        >

          Forgot Password?

        </Link>


      </Box>




      {error && (

        <Typography

          color="error"

          sx={{ mt: 2 }}

        >

          {error}

        </Typography>

      )}





      <Button

        fullWidth

        variant="contained"

        size="large"

        sx={{

          mt: 4,

          py: 1.5,

          borderRadius: 2,

        }}

        onClick={handleLogin}

        disabled={loading}

      >


        {loading ? (

          <CircularProgress

            size={24}

            color="inherit"

          />

        ) : (

          "Sign In"

        )}


      </Button>



    </Box>

  );

}


export default LoginForm;