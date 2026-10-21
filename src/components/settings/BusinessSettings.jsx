
import { useEffect, useRef, useState } from "react";
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
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const EMPTY_BUSINESS = {
  name: "",
  phone: "",
  email: "",
  website: "",
  address: "",
};

const MAX_LOGO_SIZE = 1024 * 1024; // 1 MB

function BusinessSettings() {
  const [business, setBusiness] = useState(EMPTY_BUSINESS);
  const [logoData, setLogoData] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBusiness() {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("Please log in again to load business settings.");
        }

        const response = await fetch(
          `${API_URL}/api/settings/business`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

        setLogoData(data.business.logo_data || "");
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
    setBusiness((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again.
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select an image file.",
      });
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setMessage({
        type: "error",
        text: "The logo must be 1 MB or smaller.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoData(reader.result);
        setMessage({
          type: "info",
          text: "Logo selected. Click Save Changes to store it permanently.",
        });
      }
    };

    reader.onerror = () => {
      setMessage({
        type: "error",
        text: "Unable to read this image. Please try another file.",
      });
    };

    reader.readAsDataURL(file);
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
          body: JSON.stringify({ ...business, logoData }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save business settings."
        );
      }

      setBusiness({ ...EMPTY_BUSINESS, ...data.business });
      setLogoData(data.business.logo_data || "");

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
            <Avatar
              src={logoData || undefined}
              alt="Business logo preview"
              variant="rounded"
              sx={{ width: 100, height: 100 }}
              imgProps={{ style: { objectFit: "contain" } }}
            >
              <BusinessIcon fontSize="large" />
            </Avatar>

            <Stack spacing={1}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />

              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Logo
              </Button>

              <Typography variant="caption" color="text.secondary">
                Select an image up to 1 MB. Save Changes to keep it.
              </Typography>
            </Stack>
          </Stack>
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
