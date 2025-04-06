import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

// Base URL for ledger transactions (corrected typo)
const LEDGERTRANSACTION_URL = "/ledger-transactions";

// Async Thunks for API calls

// 1. Fetch all ledger transactions

export const fetchLedgerTransactions = createAsyncThunk(
  "ledgerTransactions/fetchLedgerTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(LEDGERTRANSACTION_URL, {
        params: { populate: "referenceId,entries.account,createdBy" }, // Populate referenceId, accounts, and createdBy
      });
      return response.data.data; // Assuming backend returns { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch ledger transactions"
      );
    }
  }
);

// Thunk to fetch account ledger summary data
export const fetchAccountLedger = createAsyncThunk(
  "accountLedger/fetchAccountLedger",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${LEDGERTRANSACTION_URL}/summary`, {
        params: { startDate, endDate },
      });
      return response.data; // Returns { success: true, data: [...], totals: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch account ledger summary"
      );
    }
  }
);

// 2. Create a new ledger transaction
export const createLedgerTransaction = createAsyncThunk(
  "ledgerTransactions/createLedgerTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        LEDGERTRANSACTION_URL,
        transactionData
      );
      return response.data.data; // Assuming { success: true, message: "...", data: {...} }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 3. Update an existing ledger transaction
export const updateLedgerTransaction = createAsyncThunk(
  "ledgerTransactions/updateLedgerTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${LEDGERTRANSACTION_URL}/${id}`,
        transactionData
      );
      return response.data.data; // Assuming { success: true, message: "...", data: {...} }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 4. Void a ledger transaction (soft delete)
export const voidLedgerTransaction = createAsyncThunk(
  "ledgerTransactions/voidLedgerTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${LEDGERTRANSACTION_URL}/${id}`);
      return response.data.data; // Assuming { success: true, message: "...", data: {...} }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 5. Fetch transactions by account
export const fetchTransactionsByAccount = createAsyncThunk(
  "ledgerTransactions/fetchTransactionsByAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${LEDGERTRANSACTION_URL}/by-account/${accountId}`
      );
      return response.data.data; // Assuming { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Ledger Transaction Slice
const ledgerTransactionSlice = createSlice({
  name: "ledgerTransactions",
  initialState: {
    transactions: [],
    summary: {
      entries: [], // Summary entries: { date, account, sumOfDebit, sumOfCredit }
      totals: { totalDebit: 0, totalCredit: 0 }, // Totals for summary
    },
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Optional: Add manual state reset or updates if needed
    resetLedgerTransactions: (state) => {
      state.transactions = [];
      state.status = "idle";
      state.error = null;
    },
    resetLedgerState: (state) => {
      state.transactions = [];
      state.summary.entries = [];
      state.summary.totals = { totalDebit: 0, totalCredit: 0 };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Ledger Transactions
    builder
      .addCase(fetchLedgerTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLedgerTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchLedgerTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch transactions";
      })

      // Create Ledger Transaction
      .addCase(createLedgerTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createLedgerTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions.push(action.payload);
      })
      .addCase(createLedgerTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create transaction";
      })

      // Update Ledger Transaction
      .addCase(updateLedgerTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLedgerTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(
          (t) => t._id === updatedTransaction._id
        );
        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }
      })
      .addCase(updateLedgerTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update transaction";
      })

      // Void Ledger Transaction
      .addCase(voidLedgerTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidLedgerTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const voidedTransaction = action.payload;
        state.transactions = state.transactions.filter(
          (t) => t._id !== voidedTransaction._id
        );
      })
      .addCase(voidLedgerTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to void transaction";
      })

      // Fetch Transactions by Account
      .addCase(fetchTransactionsByAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactionsByAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsByAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch transactions by account";
      })
      // Fetch Account Ledger Summary
      .addCase(fetchAccountLedger.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccountLedger.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary.entries = action.payload.data;
        state.summary.totals = action.payload.totals;
      })
      .addCase(fetchAccountLedger.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch account ledger summary";
      });
  },
});

// Export actions and reducer
export const { resetLedgerTransactions } = ledgerTransactionSlice.actions;
export default ledgerTransactionSlice.reducer;
