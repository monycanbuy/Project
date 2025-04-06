// debtorSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const DEBTOR_URL = "/debtors";

// Async Thunks for Debtor Operations

// Fetch all debtors
export const fetchDebtors = createAsyncThunk(
  "debtors/fetchDebtors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(DEBTOR_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new debtor
export const createDebtor = createAsyncThunk(
  "debtors/createDebtor",
  async (debtorData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(DEBTOR_URL, debtorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update an existing debtor
export const updateDebtor = createAsyncThunk(
  "debtors/updateDebtor",
  async ({ id, debtorData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${DEBTOR_URL}/${id}`, debtorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Soft delete a debtor
export const deleteDebtor = createAsyncThunk(
  "debtors/deleteDebtor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${DEBTOR_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch invoices for a specific debtor
export const fetchDebtorInvoices = createAsyncThunk(
  "debtors/fetchDebtorInvoices",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${DEBTOR_URL}/${id}/invoices`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add an invoice to a debtor
export const addInvoice = createAsyncThunk(
  "debtors/addInvoice",
  async ({ debtorId, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${DEBTOR_URL}/${debtorId}/invoices`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a specific invoice
export const updateInvoice = createAsyncThunk(
  "debtors/updateInvoice",
  async ({ debtorId, invoiceId, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${DEBTOR_URL}/${debtorId}/invoices/${invoiceId}`,
        invoiceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a payment to an invoice
export const addPayment = createAsyncThunk(
  "debtors/addPayment",
  async ({ debtorId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${DEBTOR_URL}/${debtorId}/payments`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add or update an initial payment for an invoice
// export const addInitialPayment = createAsyncThunk(
//   "debtors/addInitialPayment",
//   async ({ debtorId, invoiceId, paymentData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(
//         `${DEBTOR_URL}/${debtorId}/invoices/${invoiceId}/initial-payment`,
//         paymentData
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// Recalculate debtor balance
export const addInitialPayment = createAsyncThunk(
  "debtors/addInitialPayment",
  async ({ debtorId, invoiceId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${DEBTOR_URL}/${debtorId}/invoices/${invoiceId}/initial-payment`,
        paymentData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const recalculateDebtorBalance = createAsyncThunk(
  "debtors/recalculateDebtorBalance",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${DEBTOR_URL}/${id}/recalculate-balance`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "debtors/fetchPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${DEBTOR_URL}/payments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice Definition
const debtorSlice = createSlice({
  name: "debtors",
  initialState: {
    debtors: [],
    invoices: {}, // Store invoices by debtor ID
    paymentHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Debtors
    builder
      .addCase(fetchDebtors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebtors.fulfilled, (state, action) => {
        state.loading = false;
        state.debtors = action.payload.data;
      })
      .addCase(fetchDebtors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch debtors";
      })

      // Create Debtor
      .addCase(createDebtor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDebtor.fulfilled, (state, action) => {
        state.loading = false;
        state.debtors.push(action.payload.data);
      })
      .addCase(createDebtor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create debtor";
      })

      // Update Debtor
      .addCase(updateDebtor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDebtor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data;
        }
      })
      .addCase(updateDebtor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update debtor";
      })

      // Delete Debtor
      .addCase(deleteDebtor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDebtor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data; // Update with "deleted" status
        }
      })
      .addCase(deleteDebtor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete debtor";
      })

      // Fetch Debtor Invoices
      .addCase(fetchDebtorInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebtorInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices[action.meta.arg] = action.payload.data; // Store invoices by debtor ID
      })
      .addCase(fetchDebtorInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch invoices";
      })

      // Add Invoice
      .addCase(addInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data; // Update debtor with new invoice
        }
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add invoice";
      })

      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update invoice";
      })

      // Add Payment
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data;
        }
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add payment";
      })

      // Add Initial Payment
      .addCase(addInitialPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInitialPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data;
        }
      })
      .addCase(addInitialPayment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to add initial payment";
      })

      // Recalculate Debtor Balance
      .addCase(recalculateDebtorBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recalculateDebtorBalance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.debtors.findIndex(
          (debtor) => debtor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.debtors[index] = action.payload.data;
        }
      })
      .addCase(recalculateDebtorBalance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to recalculate debtor balance";
      })
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.data;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch payment history";
      });
  },
});

export const { clearError } = debtorSlice.actions;
export default debtorSlice.reducer;
