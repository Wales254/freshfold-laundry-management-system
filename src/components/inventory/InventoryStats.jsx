import { useSelector } from "react-redux";

import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";

function InventoryStats() {
  const inventory = useSelector(
    (state) => state.inventory.inventory
  );

  const totalItems = inventory.length;

  const inStock = inventory.filter(
    (item) => item.quantity > item.minStock
  ).length;

  const lowStock = inventory.filter(
    (item) =>
      item.quantity > 0 &&
      item.quantity <= item.minStock
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.quantity === 0
  ).length;

  const cards = [
    {
      title: "Total Items",
      value: totalItems,
      icon: <Inventory2Icon fontSize="large" color="primary" />,
    },
    {
      title: "In Stock",
      value: inStock,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <WarningAmberIcon fontSize="large" color="warning" />,
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: <CancelIcon fontSize="large" color="error" />,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <Card elevation={3}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Typography
                  color="text.secondary"
                  gutterBottom
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {card.value}
                </Typography>
              </div>

              {card.icon}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default InventoryStats;