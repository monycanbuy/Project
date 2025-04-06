import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const BASE_URL = "/unified-sales"; // Your API base URL

export const createUnifiedSale = createAsyncThunk(
  "unifiedSales/createUnifiedSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        BASE_URL, // Since BASE_URL already includes the path to unified-sales
        saleData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating sale");
    }
  }
);

export const addItemToSale = createAsyncThunk(
  "unifiedSales/addItemToSale",
  async ({ saleId, itemData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${BASE_URL}/${saleId}/items`, // Correct path for adding items
        itemData
      );
      return { ...response.data, saleId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error adding item to sale"
      );
    }
  }
);

export const updateUnifiedSale = createAsyncThunk(
  "unifiedSales/updateUnifiedSale",
  async ({ saleId, updatedSaleData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${saleId}`, // Correct path for updating sales
        updatedSaleData
      );
      return { ...response.data, saleId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating sale");
    }
  }
);

export const getAllUnifiedSales = createAsyncThunk(
  "unifiedSales/getAllUnifiedSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching sales");
    }
  }
);

const unifiedSalesSlice = createSlice({
  name: "unifiedSales",
  initialState: {
    sales: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Sale
      .addCase(createUnifiedSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUnifiedSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales.push(action.payload);
      })
      .addCase(createUnifiedSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Item to Sale
      .addCase(addItemToSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemToSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const sale = state.sales.find((s) => s._id === action.payload.saleId);
        if (sale) {
          sale.items.push(action.payload.saleItem);
          sale.totalAmount += action.payload.saleItem.subTotal; // Update total amount
        }
      })
      .addCase(addItemToSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Sale
      .addCase(updateUnifiedSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUnifiedSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.sales.findIndex(
          (s) => s._id === action.payload.saleId
        );
        if (index !== -1) {
          state.sales[index] = { ...state.sales[index], ...action.payload };
        }
      })
      .addCase(updateUnifiedSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get All Sales
      .addCase(getAllUnifiedSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllUnifiedSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = action.payload;
      })
      .addCase(getAllUnifiedSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default unifiedSalesSlice.reducer;
