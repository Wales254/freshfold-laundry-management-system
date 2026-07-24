import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import PrintIcon from "@mui/icons-material/Print";

import ReportCards from "../components/reports/ReportCards";
import RevenueChart from "../components/reports/RevenueChart";
import OrdersStatusChart from "../components/reports/OrdersStatusChart";
import PopularServicesChart from "../components/reports/PopularServicesChart";
import MonthlyOrdersChart from "../components/reports/MonthlyOrdersChart";
import RevenueTable from "../components/reports/RevenueTable";

import {
  exportPDF,
  exportExcel,
  printReport,
} from "../utils/reportExport";

function Reports() {
  const [period, setPeriod] = useState("This Month");

  // Get orders from Redux
  const orders = useSelector((state) => state.orders.orders);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Reports & Analytics
          </Typography>

          <Typography color="text.secondary">
            View business performance, analytics and export reports.
          </Typography>
        </Box>

        {/* Export Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => exportPDF(orders)}
          >
            Export PDF
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={() => exportExcel(orders)}
          >
            Export Excel
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={printReport}
          >
            Print Report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <ReportCards />

      {/* Filters */}
      <Grid container spacing={3} sx={{ mt: 3, mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Reporting Period</InputLabel>

            <Select
              value={period}
              label="Reporting Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="This Year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueChart period={period} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <OrdersStatusChart period={period} />
        </Grid>
      </Grid>

      {/* Secondary Charts */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PopularServicesChart period={period} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyOrdersChart period={period} />
        </Grid>
      </Grid>

      {/* Revenue Table */}
      <Box sx={{ mt: 4 }}>
        <RevenueTable period={period} />
      </Box>
    </Box>
  );
}

export default Reports;