
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchOrders,
  createOrder,
  updateOrderApi,
  deleteOrderApi,
} from "../api/ordersApi";

// Safely convert values to numbers.
const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

// Normalize an order without discarding its payment history.
const normalizeOrder = (order, existingOrder = {}) => {
  const mergedOrder = {
    ...existingOrder,
    ...order,
  };

  const total = toAmount(mergedOrder.total);

  const payments = Array.isArray(order.payments)
    ? order.payments
    : Array.isArray(existingOrder.payments)
      ? existingOrder.payments
      : [];

  const amountPaid =
    order.amountPaid != null
      ? toAmount(order.amountPaid)
      : existingOrder.amountPaid != null
        ? toAmount(existingOrder.amountPaid)
        : payments.reduce(
            (sum, payment) => sum + toAmount(payment.amount),
            0
          );

  const balance =
    order.balance != null
      ? toAmount(order.balance)
      : existingOrder.balance != null
        ? toAmount(existingOrder.balance)
        : Math.max(total - amountPaid, 0);

  return {
    ...mergedOrder,
    total,
    amountPaid,
    balance,
    change:
      order.change != null
        ? toAmount(order.change)
        : toAmount(existingOrder.change),
    payments,
  };
};

// Fetch orders from PostgreSQL.
export const fetchOrdersFromApi = createAsyncThunk(
  "orders/fetchFromApi",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create an order in PostgreSQL.
export const addOrderToApi = createAsyncThunk(
  "orders/addToApi",
  async (order, { rejectWithValue }) => {
    try {
      return await createOrder(order);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an order in PostgreSQL.
export const updateOrderInApi = createAsyncThunk(
  "orders/updateInApi",
  async (order, { rejectWithValue }) => {
    try {
      const { id, ...changes } = order;
      return await updateOrderApi(id, changes);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete an order from PostgreSQL.
export const deleteOrderFromApi = createAsyncThunk(
  "orders/deleteFromApi",
  async (id, { rejectWithValue }) => {
    try {
      await deleteOrderApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    // Update order status locally.
    updateStatus: (state, action) => {
      const { id, status } = action.payload;

      const order = state.orders.find(
        (item) => String(item.id) === String(id)
      );

      if (order) {
        order.status = status;
      }
    },

    // Update an order locally while preserving payment history
    // if the supplied order does not contain a payments array.
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (item) => String(item.id) === String(updatedOrder.id)
      );

      if (index !== -1) {
        state.orders[index] = normalizeOrder(
          updatedOrder,
          state.orders[index]
        );
      }
    },

    // Record a payment locally.
    // Persistent payments should be recorded through the backend API.
    updatePayment: (state, action) => {
      const {
        id,
        paymentMethod,
        amountPaid,
        transactionCode,
      } = action.payload;

      const order = state.orders.find(
        (item) => String(item.id) === String(id)
      );

      if (!order) return;

      const paymentAmount = toAmount(amountPaid);

      if (paymentAmount <= 0) return;

      if (!Array.isArray(order.payments)) {
        order.payments = [];
      }

      order.payments.push({
        id: Date.now(),
        amount: paymentAmount,
        method: paymentMethod,
        transactionCode: transactionCode || "",
        date: new Date().toISOString(),
      });

      const totalPaid = order.payments.reduce(
        (sum, payment) => sum + toAmount(payment.amount),
        0
      );

      const total = toAmount(order.total);

      order.amountPaid = totalPaid;
      order.balance = Math.max(total - totalPaid, 0);
      order.change = Math.max(totalPaid - total, 0);

      order.paymentStatus =
        totalPaid >= total
          ? "Paid"
          : totalPaid > 0
            ? "Partial"
            : "Unpaid";
    },

    // Explicit local reset only. Do not dispatch this during
    // normal order updates or payment-page refreshes.
    clearPayments: (state, action) => {
      const order = state.orders.find(
        (item) => String(item.id) === String(action.payload)
      );

      if (!order) return;

      order.payments = [];
      order.amountPaid = 0;
      order.balance = toAmount(order.total);
      order.change = 0;
      order.paymentStatus = "Unpaid";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersFromApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrdersFromApi.fulfilled, (state, action) => {
        state.loading = false;

        // Normalize fetched orders while preserving payment arrays
        // supplied by the backend.
        state.orders = action.payload.map((order) => {
          const existingOrder = state.orders.find(
            (item) => String(item.id) === String(order.id)
          );

          return normalizeOrder(order, existingOrder || {});
        });
      })

      .addCase(fetchOrdersFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addOrderToApi.fulfilled, (state, action) => {
        const order = normalizeOrder(action.payload);

        // Avoid adding the same order twice.
        const existingIndex = state.orders.findIndex(
          (item) => String(item.id) === String(order.id)
        );

        if (existingIndex !== -1) {
          state.orders[existingIndex] = normalizeOrder(
            order,
            state.orders[existingIndex]
          );
        } else {
          state.orders.unshift(order);
        }

        state.error = null;
      })

      .addCase(addOrderToApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(updateOrderInApi.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        const index = state.orders.findIndex(
          (item) => String(item.id) === String(updatedOrder.id)
        );

        if (index !== -1) {
          state.orders[index] = normalizeOrder(
            updatedOrder,
            state.orders[index]
          );
        }

        state.error = null;
      })

      .addCase(updateOrderInApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(deleteOrderFromApi.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (item) => String(item.id) !== String(action.payload)
        );
      })

      .addCase(deleteOrderFromApi.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  updateStatus,
  updateOrder,
  updatePayment,
  clearPayments,
} = orderSlice.actions;

export default orderSlice.reducer;
