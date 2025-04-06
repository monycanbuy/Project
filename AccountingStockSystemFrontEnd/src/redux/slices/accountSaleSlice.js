import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import { apiClient } from "./authSlice";
import { apiClient } from "../../utils/apiClient";

const ACCOUNT_SALE_URL = "/account-sales";

// Async Thunks for CRUD Operations

// Fetch all account sales
export const fetchAccountSales = createAsyncThunk(
  "accountSales/fetchAccountSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ACCOUNT_SALE_URL);
      return response.data.data; // Assuming backend returns { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch account sales"
      );
    }
  }
);

// Create a new account sale
export const createAccountSale = createAsyncThunk(
  "accountSales/createAccountSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ACCOUNT_SALE_URL, saleData);
      return response.data.data; // { success: true, message: "...", data: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account sale"
      );
    }
  }
);

// Update an existing account sale
export const updateAccountSale = createAsyncThunk(
  "accountSales/updateAccountSale",
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${ACCOUNT_SALE_URL}/${id}`,
        saleData
      );
      return response.data; // Ensure this returns { success, message, data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update account sale" }
      );
    }
  }
);

// Delete (cancel) an account sale
export const deleteAccountSale = createAsyncThunk(
  "accountSales/deleteAccountSale",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${ACCOUNT_SALE_URL}/${id}`);
      return id; // Return the ID of the cancelled sale
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account sale"
      );
    }
  }
);

// Account Sale Slice
const accountSaleSlice = createSlice({
  name: "accountSales",
  initialState: {
    accountSales: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {
    resetAccountSaleState: (state) => {
      state.accountSales = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Account Sales
    builder
      .addCase(fetchAccountSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccountSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accountSales = action.payload;
      })
      .addCase(fetchAccountSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Create Account Sale
    builder
      .addCase(createAccountSale.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createAccountSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accountSales.push(action.payload);
      })
      .addCase(createAccountSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Update Account Sale
    builder
      .addCase(updateAccountSale.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateAccountSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedSale = action.payload;
        const index = state.accountSales.findIndex(
          (sale) => sale._id === updatedSale._id
        );
        if (index !== -1) {
          state.accountSales[index] = updatedSale;
        }
      })
      .addCase(updateAccountSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Delete Account Sale
    builder
      .addCase(deleteAccountSale.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccountSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accountSales = state.accountSales.filter(
          (sale) => sale._id !== action.payload
        );
      })
      .addCase(deleteAccountSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetAccountSaleState } = accountSaleSlice.actions;
export default accountSaleSlice.reducer;
