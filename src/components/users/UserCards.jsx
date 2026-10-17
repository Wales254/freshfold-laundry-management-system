
import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function UserCards() {
  const users = useSelector((state) => state.users.users);

  const getRoleCount = (role) =>
    users.filter(
      (user) => String(user.role || "").toLowerCase() === role
    ).length;

  const totalUsers = users.length;
  const admins = getRoleCount("admin");
  const managers = getRoleCount("manager");
  const cashiers = getRoleCount("cashier");
  const attendants = getRoleCount("attendant");

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const cards = [
    { title: "Total Users", value: totalUsers },
    { title: "Admins", value: admins },
    { title: "Managers", value: managers },
    { title: "Cashiers", value: cashiers },
    { title: "Attendants", value: attendants },
    { title: "Active Users", value: activeUsers },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 4, lg: 2 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mt: 1 }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default UserCards;
