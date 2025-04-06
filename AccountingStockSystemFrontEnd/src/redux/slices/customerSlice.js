// customerSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const CUSTOMER_URL = "/customers";

// Async thunks for customer operations
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(CUSTOMER_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(CUSTOMER_URL, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${CUSTOMER_URL}/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${CUSTOMER_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCustomerDebtors = createAsyncThunk(
  "customers/fetchCustomerDebtors",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${CUSTOMER_URL}/${id}/debtors`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create slice
const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    debtors: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch customers";
      })

      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload.data);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create customer";
      })

      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (customer) => customer._id === action.payload.data._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload.data;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update customer";
      })

      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (customer) => customer._id === action.payload.data._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload.data; // Update with soft-deleted status
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete customer";
      })

      // Fetch customer debtors
      .addCase(fetchCustomerDebtors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDebtors.fulfilled, (state, action) => {
        state.loading = false;
        state.debtors = action.payload.data;
      })
      .addCase(fetchCustomerDebtors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch debtors";
      });
  },
});

export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;
