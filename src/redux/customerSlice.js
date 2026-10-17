
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  createCustomer,
  updateCustomerApi,
  deleteCustomerApi,
} from "../api/customersApi";

export const fetchCustomersFromApi = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCustomers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCustomerToApi = createAsyncThunk(
  "customers/addCustomer",
  async (customer, { rejectWithValue }) => {
    try {
      return await createCustomer(customer);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomerInApi = createAsyncThunk(
  "customers/updateCustomer",
  async (customer, { rejectWithValue }) => {
    try {
      const { id, ...changes } = customer;
      return await updateCustomerApi(id, changes);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomerFromApi = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCustomerApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersFromApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersFromApi.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomersFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addCustomerToApi.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })
      .addCase(addCustomerToApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCustomerInApi.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (customer) => String(customer.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomerInApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteCustomerFromApi.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (customer) => String(customer.id) !== String(action.payload)
        );
      })
      .addCase(deleteCustomerFromApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default customerSlice.reducer;
