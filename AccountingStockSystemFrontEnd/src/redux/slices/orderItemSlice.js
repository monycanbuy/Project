import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

// Base URL for the API
const ORDER_ITEMS_URL = "/order-items";

export const fetchOrderItems = createAsyncThunk(
  "orderItems/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ORDER_ITEMS_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching order items:", error);
      return rejectWithValue(error.message || "Error fetching order items");
    }
  }
);

export const addOrderItem = createAsyncThunk(
  "orderItems/add",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ORDER_ITEMS_URL, itemData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding order item:", error);
      return rejectWithValue(error.message || "Error adding order item");
    }
  }
);

export const updateOrderItem = createAsyncThunk(
  "orderItems/update",
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${ORDER_ITEMS_URL}/${id}`,
        itemData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating order item:", error);
      return rejectWithValue(error.message || "Error updating order item");
    }
  }
);

export const deleteOrderItem = createAsyncThunk(
  "orderItems/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${ORDER_ITEMS_URL}/${id}`);
      return response.data || id; // Return server response or id if no response data
    } catch (error) {
      console.error("Error deleting order item:", error);
      return rejectWithValue(error.message || "Error deleting order item");
    }
  }
);

const orderItemsSlice = createSlice({
  name: "orderItems",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addOrderItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteOrderItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default orderItemsSlice.reducer;
