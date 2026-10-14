import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function DashboardCard({ title, value, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        minWidth: 0,
        borderRadius: 3,
        border: "1px solid #e8edf4",
        borderLeft: `5px solid ${color || "#1976d2"}`,
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 18px rgba(30, 55, 90, 0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(30, 55, 90, 0.10)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          "&:last-child": {
            pb: { xs: 2, sm: 2.5, md: 3 },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#758198",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Typography>

          <TrendingUpIcon
            sx={{
              color: color || "#1976d2",
              fontSize: 21,
              flexShrink: 0,
            }}
          />
        </Box>

        <Typography
          component="div"
          sx={{
            color: "#243247",
            fontWeight: 800,
            fontSize: {
              xs: "1.65rem",
              sm: "1.85rem",
              md: "2rem",
            },
            lineHeight: 1.25,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>

        <Box
          sx={{
            mt: 2,
            width: 38,
            height: 3,
            borderRadius: 5,
            bgcolor: color || "#1976d2",
            opacity: 0.65,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default DashboardCard;