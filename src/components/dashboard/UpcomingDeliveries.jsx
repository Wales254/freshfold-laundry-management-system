import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const deliveries = [
  {
    customer: "John Doe",
    date: "Today",
  },
  {
    customer: "Jane Smith",
    date: "Tomorrow",
  },
  {
    customer: "Michael Lee",
    date: "Friday",
  },
];

function UpcomingDeliveries() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Deliveries
      </Typography>

      <List>
        {deliveries.map((item, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={item.customer}
                secondary={item.date}
              />
            </ListItem>

            {index !== deliveries.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  );
}

export default UpcomingDeliveries;