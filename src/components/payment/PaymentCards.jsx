import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function PaymentCards() {
  const payments = useSelector(
    (state) => state.payment.payments
  );

  const totalPayments = payments.length;

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amountPaid),
    0
  );

  const outstandingBalance = payments.reduce(
    (sum, payment) => sum + Number(payment.balance),
    0
  );

  const fullyPaid = payments.filter(
    (payment) => payment.paymentStatus === "Paid"
  ).length;

  const cards = [
    {
      title: "Total Payments",
      value: totalPayments,
    },
    {
      title: "Revenue Collected",
      value: `KES ${totalRevenue}`,
    },
    {
      title: "Outstanding Balance",
      value: `KES ${outstandingBalance}`,
    },
    {
      title: "Fully Paid Orders",
      value: fullyPaid,
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

export default PaymentCards;