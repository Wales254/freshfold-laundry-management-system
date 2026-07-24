import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteInventoryItem } from "../../redux/inventorySlice";

import EditInventoryDialog from "./EditInventoryDialog";
import StockInDialog from "./StockInDialog";
import StockOutDialog from "./StockOutDialog";

function InventoryTable({
  search,
  categoryFilter,
  statusFilter,
  sortBy,
}) {
  const inventory = useSelector(
    (state) => state.inventory.inventory
  );

  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openStockIn, setOpenStockIn] = useState(false);
  const [openStockOut, setOpenStockOut] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenEdit(true);
  };

  const handleStockIn = (item) => {
    setSelectedItem(item);
    setOpenStockIn(true);
  };

  const handleStockOut = (item) => {
    setSelectedItem(item);
    setOpenStockOut(true);
  };

  // Determine stock status
  const getStatus = (item) => {
    if (item.quantity === 0) return "Out of Stock";
    if (item.quantity <= item.minStock) return "Low Stock";
    return "In Stock";
  };

  // Status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
    }
  };

  // Search
  let filteredInventory = inventory.filter((item) => {
    const term = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.supplier.toLowerCase().includes(term)
    );
  });

  // Category Filter
  if (categoryFilter !== "All") {
    filteredInventory = filteredInventory.filter(
      (item) => item.category === categoryFilter
    );
  }

  // Status Filter
  if (statusFilter !== "All") {
    filteredInventory = filteredInventory.filter(
      (item) => getStatus(item) === statusFilter
    );
  }

  // Sorting
  switch (sortBy) {
    case "A-Z":
      filteredInventory.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "Z-A":
      filteredInventory.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      break;

    case "Quantity High-Low":
      filteredInventory.sort(
        (a, b) => b.quantity - a.quantity
      );
      break;

    case "Quantity Low-High":
      filteredInventory.sort(
        (a, b) => a.quantity - b.quantity
      );
      break;

    case "Cost High-Low":
      filteredInventory.sort(
        (a, b) => b.unitCost - a.unitCost
      );
      break;

    case "Cost Low-High":
      filteredInventory.sort(
        (a, b) => a.unitCost - b.unitCost
      );
      break;

    default:
      break;
  }

  // Pagination
  const paginatedInventory = filteredInventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Unit</strong></TableCell>
              <TableCell><strong>Supplier</strong></TableCell>
              <TableCell><strong>Unit Cost</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedInventory.length > 0 ? (
              paginatedInventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>

                  <TableCell>{item.category}</TableCell>

                  <TableCell>{item.quantity}</TableCell>

                  <TableCell>{item.unit}</TableCell>

                  <TableCell>{item.supplier}</TableCell>

                  <TableCell>
                    KES {item.unitCost}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStatus(item)}
                      color={getStatusColor(getStatus(item))}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <IconButton
                        color="success"
                        onClick={() => handleStockIn(item)}
                        title="Stock In"
                      >
                        <AddIcon />
                      </IconButton>

                      <IconButton
                        color="warning"
                        onClick={() => handleStockOut(item)}
                        title="Stock Out"
                      >
                        <RemoveIcon />
                      </IconButton>

                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        title="Delete"
                        onClick={() =>
                          dispatch(deleteInventoryItem(item.id))
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredInventory.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(event, newPage) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(event) => {
            setRowsPerPage(
              parseInt(event.target.value, 10)
            );
            setPage(0);
          }}
        />
      </TableContainer>

      <EditInventoryDialog
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        item={selectedItem}
      />

      <StockInDialog
        open={openStockIn}
        handleClose={() => setOpenStockIn(false)}
        item={selectedItem}
      />

      <StockOutDialog
        open={openStockOut}
        handleClose={() => setOpenStockOut(false)}
        item={selectedItem}
      />
    </>
  );
}

export default InventoryTable;