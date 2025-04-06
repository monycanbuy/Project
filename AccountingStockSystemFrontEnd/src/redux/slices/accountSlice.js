// accountSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";
const ACCOUNT_URL = "/accounts";

// Async thunks for account operations
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (typeFilter = "", { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${ACCOUNT_URL}${typeFilter ? `?type=${typeFilter}` : ""}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createAccount = createAsyncThunk(
  "accounts/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ACCOUNT_URL, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ id, accountData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${ACCOUNT_URL}/${id}`, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${ACCOUNT_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create slice
const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.data;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch accounts";
      })

      // Create account
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload.data);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create account";
      })

      // Update account
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (account) => account._id === action.payload.data._id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload.data;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update account";
      })

      // Delete account (soft delete)
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (account) => account._id === action.payload.data._id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload.data; // Update with inactive status
        }
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete account";
      });
  },
});

export const { clearError } = accountSlice.actions;
export default accountSlice.reducer;
