import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/inventoryadjustments";

// Async thunks for CRUD operations
export const fetchInventoryAdjustments = createAsyncThunk(
  "inventoryAdjustments/fetchInventoryAdjustments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching inventory adjustments"
      );
    }
  }
);

export const createInventoryAdjustment = createAsyncThunk(
  "inventoryAdjustments/createInventoryAdjustment",
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, adjustmentData);
      return response.data; // Return the data here, not just the response object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error creating inventory adjustment"
      );
    }
  }
);

export const updateInventoryAdjustment = createAsyncThunk(
  "inventoryAdjustments/updateInventoryAdjustment",
  async ({ id, adjustmentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, adjustmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating inventory adjustment"
      );
    }
  }
);

export const deleteInventoryAdjustment = createAsyncThunk(
  "inventoryAdjustments/deleteInventoryAdjustment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error deleting inventory adjustment"
      );
    }
  }
);

export const fetchDailyProfitAndLoss = createAsyncThunk(
  "inventoryAdjustments/fetchDailyProfitAndLoss",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily-profit-loss`);
      console.log("Raw API Response:", response); // Log full response object
      console.log("Extracted Data:", response.data.data); // Log what we return
      return response.data.data; // Should be { date, revenue, cogs, inventoryLosses, profit }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error fetching P&L");
    }
  }
);

const initialState = {
  inventoryAdjustments: [],
  dailyProfitAndLoss: {
    date: "",
    revenue: 0,
    cogs: 0,
    inventoryLosses: 0,
    profit: 0,
  },
  status: "idle",
  error: null,
};

const inventoryAdjustmentsSlice = createSlice({
  name: "inventoryAdjustments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryAdjustments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInventoryAdjustments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventoryAdjustments = action.payload.data;
      })
      .addCase(fetchInventoryAdjustments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createInventoryAdjustment.fulfilled, (state, action) => {
        state.inventoryAdjustments.push(action.payload.data);
      })
      .addCase(updateInventoryAdjustment.fulfilled, (state, action) => {
        const updatedAdjustment = action.payload.data;
        const index = state.inventoryAdjustments.findIndex(
          (a) => a._id === updatedAdjustment._id
        );
        if (index !== -1) {
          state.inventoryAdjustments[index] = updatedAdjustment;
        }
      })
      .addCase(deleteInventoryAdjustment.fulfilled, (state, action) => {
        state.inventoryAdjustments = state.inventoryAdjustments.filter(
          (adjustment) => adjustment._id !== action.payload.data._id
        );
      })
      // Fetch daily profit and loss
      // Updated P&L cases
      .addCase(fetchDailyProfitAndLoss.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("P&L Fetch Started - Status: loading");
      })
      .addCase(fetchDailyProfitAndLoss.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("P&L Payload Received:", action.payload);
        state.dailyProfitAndLoss = { ...action.payload }; // Explicitly spread payload
        console.log("Updated dailyProfitAndLoss:", state.dailyProfitAndLoss);
      })
      .addCase(fetchDailyProfitAndLoss.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.log("P&L Fetch Failed - Error:", action.payload);
      });
  },
});

export default inventoryAdjustmentsSlice.reducer;
