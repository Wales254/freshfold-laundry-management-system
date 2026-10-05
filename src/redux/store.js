import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "./orderSlice";
import inventoryReducer from "./inventorySlice";
import pricingReducer from "./pricingSlice";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import paymentReducer from "./paymentSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    inventory: inventoryReducer,
    pricing: pricingReducer,
    auth: authReducer,
    users: userReducer,
    payment: paymentReducer,
  },
});