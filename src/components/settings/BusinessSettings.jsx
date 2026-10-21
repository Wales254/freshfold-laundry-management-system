
import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const EMPTY_BUSINESS = {
  name: "",
  phone: "",
  email: "",
  website: "",
  address: "",
};

function BusinessSettings() {
  const [business, setBusiness] = useState(EMPTY_BUSINESS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBusiness() {
      try {
        const token = getToken();

        if (!token) {
          setMessage({
            type: "error",
            text: "Please log in again to load business settings.",
          });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/settings/business`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load business settings."
          );
        }

        setBusiness({
          ...EMPTY_BUSINESS,
          ...data.business,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage({
            type: "error",
            text: error.message || "Unable to load business settings.",
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBusiness();

    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBusiness((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setMessage(null);

    if (!business.name.trim()) {
      setMessage({
        type: "error",
        text: "Business name is required.",
      });
      return;
    }

    setSaving(true);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Please log in again before saving.");
      }

      const response = await fetch(
        `${API_URL}/api/settings/business`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(business),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save business settings."
        );
      }

      setBusiness({
        ...EMPTY_BUSINESS,
        ...data.business,
      });

      setMessage({
        type: "success",
        text: data.message || "Business settings saved successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Unable to save business settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading business settings...</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <BusinessIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          Business Information
        </Typography>
      </Stack>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Business Name"
            name="name"
            value={business.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={business.phone}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            name="email"
            value={business.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={business.website}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Business Address"
            name="address"
            value={business.address}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar sx={{ width: 80, height: 80 }}>
              <BusinessIcon fontSize="large" />
            </Avatar>

            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled
            >
              Logo Upload — Coming Next
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Logo upload will be connected separately so the image can
            be stored and used on receipts.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={
              saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default BusinessSettings;
