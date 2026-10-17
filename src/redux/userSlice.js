
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.error = null;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (index !== -1) {
        state.users[index] = {
          ...state.users[index],
          ...action.payload,
        };
      }
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => String(user.id) !== String(action.payload)
      );
    },

    setUserStatus: (state, action) => {
      const user = state.users.find(
        (item) => String(item.id) === String(action.payload.id)
      );

      if (user) {
        user.status = action.payload.status;
      }
    },

    setUsersLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUsersError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setUserStatus,
  setUsersLoading,
  setUsersError,
} = userSlice.actions;

export default userSlice.reducer;
