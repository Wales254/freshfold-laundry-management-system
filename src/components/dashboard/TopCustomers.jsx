import { useSelector } from "react-redux";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";

function TopCustomers() {
  const orders = useSelector((state) => state.orders.orders);

  const customerTotals = {};

  orders.forEach((order) => {
    if (!customerTotals[order.phone]) {
      customerTotals[order.phone] = {
        name: order.customer,
        phone: order.phone,
        spent: 0,
      };
    }

    customerTotals[order.phone].spent += Number(order.total);
  });

  const topCustomers = Object.values(customerTotals)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
      >
        Top Customers
      </Typography>

      <List>
        {topCustomers.map((customer) => (
          <ListItem key={customer.phone}>
            <ListItemAvatar>
              <Avatar>
                {customer.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={customer.name}
              secondary={`KES ${customer.spent}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default TopCustomers;