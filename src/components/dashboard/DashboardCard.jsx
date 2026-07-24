import { Card, CardContent, Typography } from "@mui/material";

function DashboardCard({ title, value, color }) {
  return (
    <Card
      sx={{
        borderLeft: `6px solid ${color}`,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mt: 1,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;