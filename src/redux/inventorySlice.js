import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventory: [
    {
      id: 1,
      name: "Laundry Detergent",
      category: "Cleaning Chemical",
      quantity: 25,
      unit: "Litres",
      minStock: 5,
      unitCost: 850,
      supplier: "CleanChem Ltd",
      lastRestocked: "2026-07-10",
    },
    {
      id: 2,
      name: "Fabric Softener",
      category: "Cleaning Chemical",
      quantity: 3,
      unit: "Litres",
      minStock: 5,
      unitCost: 700,
      supplier: "SoftCare Ltd",
      lastRestocked: "2026-07-08",
    },
    {
      id: 3,
      name: "Laundry Bags",
      category: "Packaging",
      quantity: 50,
      unit: "Pieces",
      minStock: 20,
      unitCost: 15,
      supplier: "Pack Kenya",
      lastRestocked: "2026-07-05",
    },
  ],

  transactions: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,

  reducers: {
    // Add Inventory Item
    addInventoryItem: (state, action) => {
      state.inventory.push(action.payload);
    },

    // Delete Inventory Item
    deleteInventoryItem: (state, action) => {
      state.inventory = state.inventory.filter(
        (item) => item.id !== action.payload
      );
    },

    // Edit Inventory Item
    updateInventoryItem: (state, action) => {
      const updatedItem = action.payload;

      const index = state.inventory.findIndex(
        (item) => item.id === updatedItem.id
      );

      if (index !== -1) {
        state.inventory[index] = updatedItem;
      }
    },

    // Stock In
    stockIn: (state, action) => {
      const {
        id,
        quantity,
        performedBy = "Admin",
      } = action.payload;

      const item = state.inventory.find(
        (item) => item.id === id
      );

      if (item) {
        item.quantity += Number(quantity);

        item.lastRestocked = new Date()
          .toISOString()
          .split("T")[0];

        state.transactions.unshift({
          id: Date.now(),
          itemId: item.id,
          itemName: item.name,
          type: "Stock In",
          quantity: Number(quantity),
          date: new Date().toLocaleString(),
          performedBy,
        });
      }
    },

    // Stock Out
    stockOut: (state, action) => {
      const {
        id,
        quantity,
        performedBy = "Admin",
      } = action.payload;

      const item = state.inventory.find(
        (item) => item.id === id
      );

      if (item && item.quantity >= quantity) {
        item.quantity -= Number(quantity);

        state.transactions.unshift({
          id: Date.now(),
          itemId: item.id,
          itemName: item.name,
          type: "Stock Out",
          quantity: Number(quantity),
          date: new Date().toLocaleString(),
          performedBy,
        });
      }
    },
  },
});

export const {
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  stockIn,
  stockOut,
} = inventorySlice.actions;

export default inventorySlice.reducer;