import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [
    {
      id: 1,
      name: "Wash",
      category: "Laundry",
      unit: "Per Kg",
      price: 80,
      status: "Active",
    },
    {
      id: 2,
      name: "Wash & Fold",
      category: "Laundry",
      unit: "Per Kg",
      price: 120,
      status: "Active",
    },
    {
      id: 3,
      name: "Ironing",
      category: "Laundry",
      unit: "Per Item",
      price: 50,
      status: "Active",
    },
    {
      id: 4,
      name: "Dry Cleaning",
      category: "Dry Cleaning",
      unit: "Per Item",
      price: 250,
      status: "Active",
    },
    {
      id: 5,
      name: "Blanket",
      category: "Bedding",
      unit: "Each",
      price: 450,
      status: "Active",
    },
    {
      id: 6,
      name: "Duvet",
      category: "Bedding",
      unit: "Each",
      price: 900,
      status: "Active",
    },
    {
      id: 7,
      name: "Curtains",
      category: "Curtains",
      unit: "Pair",
      price: 600,
      status: "Active",
    },
    {
      id: 8,
      name: "Carpet",
      category: "Carpets",
      unit: "Square Meter",
      price: 180,
      status: "Active",
    },
    {
      id: 9,
      name: "Shoes",
      category: "Footwear",
      unit: "Pair",
      price: 350,
      status: "Active",
    },
    {
      id: 10,
      name: "Suit",
      category: "Dry Cleaning",
      unit: "Per Item",
      price: 400,
      status: "Active",
    },
  ],
};

const pricingSlice = createSlice({
  name: "pricing",
  initialState,

  reducers: {
    addService: (state, action) => {
      state.services.push(action.payload);
    },

    updateService: (state, action) => {
      const updated = action.payload;

      const index = state.services.findIndex(
        (service) => service.id === updated.id
      );

      if (index !== -1) {
        state.services[index] = updated;
      }
    },

    deleteService: (state, action) => {
      state.services = state.services.filter(
        (service) => service.id !== action.payload
      );
    },
  },
});

export const {
  addService,
  updateService,
  deleteService,
} = pricingSlice.actions;

export default pricingSlice.reducer;