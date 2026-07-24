import { Box, Typography, Paper } from "@mui/material";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >

      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          background: "#111827",
        }}
      >

        {/* Branding Section */}
        <Box
          sx={{
            flex: 1,
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: "column",
            justifyContent: "center",
            p: 6,
            background:
              "linear-gradient(135deg,#1f2937,#111827)",
          }}
        >

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#ffffff",
            }}
          >
            FreshFold
          </Typography>


          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: "#94a3b8",
            }}
          >
            Laundry Management System
          </Typography>


          <Typography
            sx={{
              mt: 3,
              color: "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            Manage laundry orders,
            customers, payments and
            inventory from one secure
            dashboard.
          </Typography>

        </Box>



        {/* Login Form Section */}
        <Box
          sx={{
            flex: 1,
            p: 5,
            background: "#ffffff",
          }}
        >

          <LoginForm />

        </Box>


      </Paper>

    </Box>
  );
}

export default Login;