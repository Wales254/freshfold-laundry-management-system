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

      createdAt: "2026-07-10",
      deliveryDate: "2026-07-12",

      // Payment Summary
      paymentStatus: "Pending",
      amountPaid: 0,
      balance: 25,
      change: 0,

      // Payment History
      payments: [],
    },

    {
      id: 2,
      customer: "Jane Smith",
      phone: "0700111222",
      service: "Dry Cleaning",
      quantity: 3,
      total: 40,
      status: "Received",

      createdAt: "2026-07-10",
      deliveryDate: "2026-07-11",

      paymentStatus: "Pending",
      amountPaid: 0,
      balance: 40,
      change: 0,

      payments: [],
    },
  ],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,

  reducers: {
    // =====================================
    // Add Order
    // =====================================
    addOrder: (state, action) => {
      state.orders.push({
        ...action.payload,

        createdAt: new Date()
          .toISOString()
          .split("T")[0],

        paymentStatus: "Pending",
        amountPaid: 0,
        balance: Number(action.payload.total),
        change: 0,

        payments: [],
      });
    },

    // =====================================
    // Delete Order
    // =====================================
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },

    // =====================================
    // Update Order Status
    // =====================================
    updateStatus: (state, action) => {
      const { id, status } = action.payload;

      const order = state.orders.find(
        (order) => order.id === id
      );

      if (order) {
        order.status = status;
      }
    },

    // =====================================
    // Edit Order
    // =====================================
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      const index = state.orders.findIndex(
        (order) => order.id === updatedOrder.id
      );

      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    },

    // =====================================
    // Receive Payment
    // =====================================
    updatePayment: (state, action) => {
      const {
        id,
        paymentMethod,
        amountPaid,
        transactionCode,
      } = action.payload;

      const order = state.orders.find(
        (order) => order.id === id
      );

      if (!order) return;

      const paymentAmount = Number(amountPaid);

      // Save payment history
      order.payments.push({
        id: Date.now(),
        amount: paymentAmount,
        method: paymentMethod,
        transactionCode: transactionCode || "",
        date: new Date().toISOString(),
      });

      // Calculate total paid
      const totalPaid = order.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );

      order.amountPaid = totalPaid;

      const total = Number(order.total);

      if (totalPaid >= total) {
        order.balance = 0;
        order.change = totalPaid - total;
        order.paymentStatus = "Paid";
      } else if (totalPaid > 0) {
        order.balance = total - totalPaid;
        order.change = 0;
        order.paymentStatus = "Partial";
      } else {
        order.balance = total;
        order.change = 0;
        order.paymentStatus = "Pending";
      }
    },

    // =====================================
    // Clear Payments (Optional)
    // =====================================
    clearPayments: (state, action) => {
      const order = state.orders.find(
        (order) => order.id === action.payload
      );

      if (!order) return;

      order.payments = [];
      order.amountPaid = 0;
      order.balance = Number(order.total);
      order.change = 0;
      order.paymentStatus = "Pending";
    },
  },
});

export const {
  addOrder,
  deleteOrder,
  updateStatus,
  updateOrder,
  updatePayment,
  clearPayments,
} = orderSlice.actions;

export default orderSlice.reducer;