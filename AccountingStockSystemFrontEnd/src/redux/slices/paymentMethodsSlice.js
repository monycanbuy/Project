import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/payment-methods"; // Relative path, apiClient adds /api

export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("apiClient baseURL:", apiClient.defaults.baseURL);
      console.log("BASE_URL:", BASE_URL);
      const response = await apiClient.get(BASE_URL);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment method:", error);
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || "Server error",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({
          message: "No response received from server",
        });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to fetch payment methods",
        });
      }
    }
  }
);

// Update other thunks
export const addPaymentMethod = createAsyncThunk(
  "paymentMethods/add",
  async (newPaymentMethod, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/payment-methods",
        newPaymentMethod
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add payment method"
      );
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  "paymentMethods/update",
  async ({ paymentMethodId, paymentMethodData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/payment-methods/${paymentMethodId}`,
        paymentMethodData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment method"
      );
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "paymentMethods/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/payment-methods/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete payment method"
      );
    }
  }
);

const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState: {
    paymentMethods: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetPaymentMethodsError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentMethods = action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload);
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        const index = state.paymentMethods.findIndex(
          (method) => method._id === action.payload._id
        );
        if (index !== -1) {
          state.paymentMethods[index] = action.payload;
        }
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter(
          (method) => method._id !== action.payload
        );
      });
  },
});

export const { resetPaymentMethodsError } = paymentMethodsSlice.actions;
export default paymentMethodsSlice.reducer;
