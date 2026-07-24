import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function PricingCards() {
  const services = useSelector(
    (state) => state.pricing.services
  );

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.status === "Active"
  ).length;

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce(
            (sum, service) => sum + service.price,
            0
          ) / services.length
        )
      : 0;

  const highestPrice =
    services.length > 0
      ? Math.max(...services.map((s) => s.price))
      : 0;

  const cards = [
    {
      title: "Total Services",
      value: totalServices,
    },
    {
      title: "Active Services",
      value: activeServices,
    },
    {
      title: "Average Price",
      value: `KES ${averagePrice}`,
    },
    {
      title: "Highest Price",
      value: `KES ${highestPrice}`,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
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

export default PricingCards;