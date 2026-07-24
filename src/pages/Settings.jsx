import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import BackupIcon from "@mui/icons-material/Backup";

import BusinessSettings from "../components/settings/BusinessSettings";
import AccountSettings from "../components/settings/AccountSettings";
import ReceiptSettings from "../components/settings/ReceiptSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import BackupSettings from "../components/settings/BackupSettings";

function Settings() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      {/* Page Header */}

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Settings
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Configure your laundry management system.
      </Typography>

      {/* Navigation */}

      <Paper
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<BusinessIcon />}
            iconPosition="start"
            label="Business"
          />

          <Tab
            icon={<PersonIcon />}
            iconPosition="start"
            label="Account"
          />

          <Tab
            icon={<ReceiptIcon />}
            iconPosition="start"
            label="Receipt"
          />

          <Tab
            icon={<NotificationsIcon />}
            iconPosition="start"
            label="Notifications"
          />

          <Tab
            icon={<PaletteIcon />}
            iconPosition="start"
            label="Appearance"
          />

          <Tab
            icon={<BackupIcon />}
            iconPosition="start"
            label="Backup"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}

      {tab === 0 && <BusinessSettings />}

      {tab === 1 && <AccountSettings />}

      {tab === 2 && <ReceiptSettings />}

      {tab === 3 && <NotificationSettings />}

      {tab === 4 && <AppearanceSettings />}

      {tab === 5 && <BackupSettings />}
    </Box>
  );
}

export default Settings;