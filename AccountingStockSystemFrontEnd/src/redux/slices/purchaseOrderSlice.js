import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const BASE_URL = "/purchaseorders";

// --- Async Thunks ---
export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error)); // Use helper function
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  "purchaseOrders/updatePurchaseOrder",
  async ({ id, purchaseOrderData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${id}`,
        purchaseOrderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const voidPurchaseOrder = createAsyncThunk(
  "purchaseOrders/voidPurchaseOrder",
  async (id, { rejectWithValue }) => {
    try {
      // Use the correct endpoint: /purchaseorders/:id/void (PUT request)
      const response = await apiClient.put(`${BASE_URL}/${id}/void`);
      return { id }; // Return the ID of the voided order
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// --- Helper Function for Error Handling (DRY Principle) ---
const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || "An API error occurred",
      data: error.response.data, // Optional: Include full response data for debugging
    };
  } else if (error.request) {
    return { message: "No response received from the server" };
  } else {
    return { message: error.message || "An unexpected error occurred" };
  }
};

// --- Initial State ---
const initialState = {
  purchaseOrders: [],
  status: "idle",
  error: null,
};

// --- Redux Slice ---
const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchPurchaseOrders ---
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchaseOrders = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- updatePurchaseOrder ---
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedOrder = action.payload.data;
        const index = state.purchaseOrders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.purchaseOrders[index] = updatedOrder;
        }
        state.error = null;
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- voidPurchaseOrder ---
      .addCase(voidPurchaseOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(voidPurchaseOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchaseOrders = state.purchaseOrders.filter(
          (order) => order._id !== action.payload.id // Filter out by ID
        );
        state.error = null;
      })
      .addCase(voidPurchaseOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default purchaseOrdersSlice.reducer;
