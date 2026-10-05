import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [
    {
      id: 1,
      name: "Administrator",
      email: "admin@freshfold.com",
      phone: "0712345678",
      role: "Admin",
      status: "Active",
      password: "123456",
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      email: "manager@freshfold.com",
      phone: "0700111222",
      role: "Manager",
      status: "Active",
      password: "123456",
    },
    {
      id: 3,
      name: "Kevin Otieno",
      email: "cashier@freshfold.com",
      phone: "0799887766",
      role: "Cashier",
      status: "Active",
      password: "123456",
    },
    {
      id: 4,
      name: "Brian Kiptoo",
      email: "attendant@freshfold.com",
      phone: "0722334455",
      role: "Attendant",
      status: "Active",
      password: "123456",
    },
  ],
};

const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const updatedUser = action.payload;

      const index = state.users.findIndex(
        (user) => user.id === updatedUser.id
      );

      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user.id !== action.payload
      );
    },

    toggleUserStatus: (state, action) => {
      const user = state.users.find(
        (user) => user.id === action.payload
      );

      if (user) {
        user.status =
          user.status === "Active"
            ? "Suspended"
            : "Active";
      }
    },

    resetPassword: (state, action) => {
      const user = state.users.find(
        (user) => user.id === action.payload
      );

      if (user) {
        user.password = "123456";
      }
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetPassword,
} = userSlice.actions;

export default userSlice.reducer;