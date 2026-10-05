import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [
    {
      id: 1,
      orderId: 1,
      customer: "John Doe",
      phone: "0712345678",
      totalAmount: 1200,
      amountPaid: 1200,
      balance: 0,
      paymentMethod: "Cash",
      transactionCode: "",
      paymentStatus: "Paid",
      paymentDate: new Date().toISOString(),
    },
    {
      id: 2,
      orderId: 2,
      customer: "Jane Smith",
      phone: "0798765432",
      totalAmount: 2500,
      amountPaid: 1000,
      balance: 1500,
      paymentMethod: "M-Pesa",
      transactionCode: "QGH45HJK",
      paymentStatus: "Partial",
      paymentDate: new Date().toISOString(),
    },
  ],
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },

    updatePayment: (state, action) => {
      const index = state.payments.findIndex(
        (payment) => payment.id === action.payload.id
      );

      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },

    deletePayment: (state, action) => {
      state.payments = state.payments.filter(
        (payment) => payment.id !== action.payload
      );
    },
  },
});

export const {
  addPayment,
  updatePayment,
  deletePayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;