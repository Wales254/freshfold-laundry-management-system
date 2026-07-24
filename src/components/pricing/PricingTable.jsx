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

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteService } from "../../redux/pricingSlice";

import EditServiceDialog from "./EditServiceDialog";

function PricingTable({
  search,
  categoryFilter,
  statusFilter,
  sortBy,
}) {
  const services = useSelector(
    (state) => state.pricing.services
  );

  const dispatch = useDispatch();

  const [selectedService, setSelectedService] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleEdit = (service) => {
    setSelectedService(service);
    setOpenEdit(true);
  };

  // Search
  let filteredServices = services.filter((service) => {
    const term = search.toLowerCase();

    return (
      service.name.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      service.unit.toLowerCase().includes(term)
    );
  });

  // Category Filter
  if (categoryFilter !== "All") {
    filteredServices = filteredServices.filter(
      (service) => service.category === categoryFilter
    );
  }

  // Status Filter
  if (statusFilter !== "All") {
    filteredServices = filteredServices.filter(
      (service) => service.status === statusFilter
    );
  }

  // Sorting
  switch (sortBy) {
    case "A-Z":
      filteredServices.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "Z-A":
      filteredServices.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      break;

    case "Highest Price":
      filteredServices.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "Lowest Price":
      filteredServices.sort(
        (a, b) => a.price - b.price
      );
      break;

    default:
      break;
  }

  const paginatedServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Service</strong>
              </TableCell>

              <TableCell>
                <strong>Category</strong>
              </TableCell>

              <TableCell>
                <strong>Unit</strong>
              </TableCell>

              <TableCell>
                <strong>Price</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell>
                    {service.name}
                  </TableCell>

                  <TableCell>
                    {service.category}
                  </TableCell>

                  <TableCell>
                    {service.unit}
                  </TableCell>

                  <TableCell>
                    KES {service.price}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={service.status}
                      color={
                        service.status === "Active"
                          ? "success"
                          : "default"
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEdit(service)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          dispatch(
                            deleteService(service.id)
                          )
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
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredServices.length}
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

      <EditServiceDialog
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        service={selectedService}
      />
    </>
  );
}

export default PricingTable;