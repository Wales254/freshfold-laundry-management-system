import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      id: 1,
      customer: "John Doe",
      phone: "0712345678",
      service: "Wash & Fold",
      quantity: 5,
      total: 25,
      status: "Received",
      deliveryDate: "2026-07-12",

      // Payment Information
      paymentStatus: "Pending",
      paymentMethod: "",
      amountPaid: 0,
      balance: 25,
      change: 0,
      paymentDate: "",
    },
    {
      id: 2,
      customer: "Jane Smith",
      phone: "0700111222",
      service: "Dry Cleaning",
      quantity: 3,
      total: 40,
      status: "Received",
      deliveryDate: "2026-07-11",

      // Payment Information
      paymentStatus: "Pending",
      paymentMethod: "",
      amountPaid: 0,
      balance: 40,
      change: 0,
      paymentDate: "",
    },
  ],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    // =============================
    // Add Order
    // =============================
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },

    // =============================
    // Delete Order
    // =============================
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },

    // =============================
    // Update Order Status
    // =============================
    updateStatus: (state, action) => {
      const { id, status } = action.payload;

      const order = state.orders.find(
        (order) => order.id === id
      );

      if (order) {
        order.status = status;
      }
    },

    // =============================
    // Edit Order
    // =============================
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order.id === updatedOrder.id
      );

      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },

    // =============================
    // Update Payment
    // =============================
    updatePayment: (state, action) => {
      const {
        id,
        paymentMethod,
        amountPaid,
      } = action.payload;

      const order = state.orders.find(
        (order) => order.id === id
      );

      if (order) {
        const total = Number(order.total);
        const paid = Number(amountPaid);

        order.paymentMethod = paymentMethod;
        order.amountPaid = paid;

        if (paid >= total) {
          // Fully paid or overpaid
          order.balance = 0;
          order.change = paid - total;
          order.paymentStatus = "Paid";
        } else if (paid > 0) {
          // Partially paid
          order.balance = total - paid;
          order.change = 0;
          order.paymentStatus = "Partial";
        } else {
          // No payment made
          order.balance = total;
          order.change = 0;
          order.paymentStatus = "Pending";
        }

        order.paymentDate = new Date()
          .toISOString()
          .split("T")[0];
      }
    },
  },
});

export const {
  addOrder,
  deleteOrder,
  updateStatus,
  updateOrder,
  updatePayment,
} = orderSlice.actions;

export default orderSlice.reducer;