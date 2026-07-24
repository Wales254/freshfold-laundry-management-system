import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "./orderSlice";
import inventoryReducer from "./inventorySlice";
import pricingReducer from "./pricingSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    inventory: inventoryReducer,
    pricing: pricingReducer,
    auth: authReducer,
  },
});