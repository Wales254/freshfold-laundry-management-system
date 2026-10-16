
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchOrders,
  createOrder,
  updateOrderApi,
  deleteOrderApi,
} from "../api/ordersApi";

// Fetch orders from PostgreSQL
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

// Create an order in PostgreSQL
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

// Update an order in PostgreSQL
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

// Delete an order from PostgreSQL
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
    // Update order status locally
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find(
        (item) => String(item.id) === String(id)
      );

      if (order) {
        order.status = status;
      }
    },

    // Update an order locally
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (item) => String(item.id) === String(updatedOrder.id)
      );

      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },

    // Record payment locally (database integration comes next)
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

      const paymentAmount = Number(amountPaid);

      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        return;
      }

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
        (sum, payment) => sum + Number(payment.amount),
        0
      );

      const total = Number(order.total);

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

    // Clear payment history locally
    clearPayments: (state, action) => {
      const order = state.orders.find(
        (item) => String(item.id) === String(action.payload)
      );

      if (!order) return;

      order.payments = [];
      order.amountPaid = 0;
      order.balance = Number(order.total);
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
        state.orders = action.payload.map((order) => ({
          ...order,
          total: Number(order.total),
          amountPaid: Number(order.amountPaid || 0),
          balance: Number(order.balance || 0),
          change: Number(order.change || 0),
          payments: order.payments || [],
        }));
      })
      .addCase(fetchOrdersFromApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addOrderToApi.fulfilled, (state, action) => {
        const order = action.payload;

        state.orders.unshift({
          ...order,
          total: Number(order.total),
          amountPaid: Number(order.amountPaid || 0),
          balance: Number(order.balance || 0),
          change: Number(order.change || 0),
          payments: order.payments || [],
        });
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
          state.orders[index] = {
            ...state.orders[index],
            ...updatedOrder,
            total: Number(updatedOrder.total),
            amountPaid: Number(updatedOrder.amountPaid || 0),
            balance: Number(updatedOrder.balance || 0),
            change: Number(updatedOrder.change || 0),
          };
        }
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
