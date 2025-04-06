import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

// API Base URL
const BASE_URL = "/hall-transactions";

// Async Thunks

// Fetch all hall transactions
export const fetchHallTransactions = createAsyncThunk(
  "hallTransactions/fetchHallTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data; // Assuming the API returns transactions in a 'data' key
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch hall transactions.",
        }
      );
    }
  }
);

// Fetch a specific hall transaction by id
export const fetchHallTransactionById = createAsyncThunk(
  "hallTransactions/fetchHallTransactionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data; // Assuming the API returns a single transaction object
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch hall transaction.",
        }
      );
    }
  }
);

// Create a new hall transaction
export const createHallTransaction = createAsyncThunk(
  "hallTransactions/createHallTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create hall transaction.",
        }
      );
    }
  }
);

// Update a hall transaction
export const updateHallTransaction = createAsyncThunk(
  "hallTransactions/updateHallTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      // console.log("Updating transaction with ID:", id);
      // console.log("Transaction data being sent to backend:", transactionData);
      const response = await apiClient.put(
        `${BASE_URL}/${id}`,
        transactionData
      );
      //console.log("Response from backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error from backend:", error.response?.data);
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update hall transaction.",
        }
      );
    }
  }
);

// Void a hall transaction (Mark as voided)
export const voidHallTransaction = createAsyncThunk(
  "hallTransactions/voidHallTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return { id, ...response.data }; // Return the id along with the response to ensure we know which transaction was affected
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to void hall transaction.",
        }
      );
    }
  }
);

// Fetch Hall Summary
export const fetchHallSummary = createAsyncThunk(
  "hallTransactions/fetchSummary",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await apiClient.get(`${BASE_URL}/summary`, {
        params: params,
      });
      //console.log("API Response:", response.data);
      return response.data; // Directly return the data as it matches your expected structure
    } catch (error) {
      // Handle errors
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.message || "An error occurred",
      });
    }
  }
);

// NEW: Fetch Hall Daily Sales by Event Type
export const fetchHallDailySalesByEventType = createAsyncThunk(
  "hallTransactions/fetchHallDailySalesByEventType",
  async (_, { rejectWithValue }) => {
    // No parameters needed, always for today
    try {
      const response = await apiClient.get(
        `${BASE_URL}/daily-sales-by-event-type`
      ); // Correct endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "An error occurred fetching daily sales by event type",
      });
    }
  }
);

// New Method: Fetch Hall All-Time Total Sales
export const fetchHallAllTimeSales = createAsyncThunk(
  "hallTransactions/fetchHallAllTimeSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/all-time-sales`);
      return response.data; // { success: true, data: { totalSales } }
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch hall all-time sales",
      });
    }
  }
);

// New Method: Fetch Hall Daily Sales for All Days (Count of Transactions per Day)
export const fetchHallDailySalesAllDays = createAsyncThunk(
  "hallTransactions/fetchHallDailySalesAllDays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily-sales-all-days`);
      return response.data; // { success: true, data: [{ totalSales, date }, ...] }
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch hall daily sales for all days",
      });
    }
  }
);

// Fetch Hall Daily Sales by Payment Method
export const fetchHallDailySalesByPaymentMethod = createAsyncThunk(
  "hallTransactions/fetchHallDailySalesByPaymentMethod",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/daily-sales-by-payment-method`
      );
      return response.data; // Assuming the API returns the data in a 'data' key
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch daily sales by payment method.",
        }
      );
    }
  }
);

// Slice
const hallTransactionsSlice = createSlice({
  name: "hallTransactions",
  initialState: {
    transactions: [], // Changed 'list' to 'transactions' to match API response
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    currentTransaction: null,
    error: null,
    summary: null, // Add summary to the initial state
    hallDailySales: null, // NEW: Store daily sales by event type
    hallDailySalesStatus: "idle", // NEW: Status for daily sales
    hallDailySalesError: null, // NEW: Error for daily sales
    hallAllTimeSales: null, // New: Store all-time sales
    hallAllTimeSalesStatus: "idle", // New: Status for all-time sales
    hallAllTimeSalesError: null, // New: Error for all-time sales
    isLoading: false,
    hallDailySalesAllDays: null, // New: Store daily sales for all days
    hallDailySalesAllDaysStatus: "idle", // New: Status for daily sales all days
    hallDailySalesAllDaysError: null, // New: Error for daily sales all days
    hallDailySalesByPaymentMethod: null, // New: Store daily sales by payment method
    hallDailySalesByPaymentMethodStatus: "idle", // New: Status for daily sales by payment method
    hallDailySalesByPaymentMethodError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Hall Transactions
      .addCase(fetchHallTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHallTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload; // Use 'transactions' instead of 'list'
      })
      .addCase(fetchHallTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Specific Hall Transaction
      .addCase(fetchHallTransactionById.pending, (state) => {
        state.status = "loading";
        state.currentTransaction = null;
        state.error = null;
      })
      .addCase(fetchHallTransactionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentTransaction = action.payload;
      })
      .addCase(fetchHallTransactionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Hall Transaction
      .addCase(createHallTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHallTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions.push(action.payload);
      })
      .addCase(createHallTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Hall Transaction
      .addCase(updateHallTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHallTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the transaction in the list if it exists, otherwise add it
        const index = state.transactions.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        } else {
          state.transactions.push(action.payload);
        }
      })
      .addCase(updateHallTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Void Hall Transaction
      .addCase(voidHallTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidHallTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload.id
        );
        if (
          state.currentTransaction &&
          state.currentTransaction._id === action.payload.id
        ) {
          state.currentTransaction = null;
        }
      })
      .addCase(voidHallTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchHallSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHallSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchHallSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // NEW: Hall Daily Sales by Event Type
      .addCase(fetchHallDailySalesByEventType.pending, (state) => {
        state.hallDailySalesStatus = "loading";
        state.hallDailySalesError = null;
      })
      .addCase(fetchHallDailySalesByEventType.fulfilled, (state, action) => {
        state.hallDailySalesStatus = "succeeded";
        state.hallDailySales = action.payload.data; // Store the data
        state.hallDailySalesError = null;
      })
      .addCase(fetchHallDailySalesByEventType.rejected, (state, action) => {
        state.hallDailySalesStatus = "failed";
        state.hallDailySalesError = action.payload;
        state.hallDailySales = null; // Clear previous data
      })
      // New: Fetch Hall All-Time Total Sales
      .addCase(fetchHallAllTimeSales.pending, (state) => {
        state.hallAllTimeSalesStatus = "loading";
        state.hallAllTimeSalesError = null;
      })
      .addCase(fetchHallAllTimeSales.fulfilled, (state, action) => {
        state.hallAllTimeSalesStatus = "succeeded";
        state.hallAllTimeSales = action.payload.data; // Store { totalSales }
        state.hallAllTimeSalesError = null;
      })
      .addCase(fetchHallAllTimeSales.rejected, (state, action) => {
        state.hallAllTimeSalesStatus = "failed";
        state.hallAllTimeSalesError = action.payload;
        state.hallAllTimeSales = null;
      })
      // New: Fetch Hall Daily Sales for All Days
      .addCase(fetchHallDailySalesAllDays.pending, (state) => {
        state.hallDailySalesAllDaysStatus = "loading";
        state.hallDailySalesAllDaysError = null;
      })
      .addCase(fetchHallDailySalesAllDays.fulfilled, (state, action) => {
        state.hallDailySalesAllDaysStatus = "succeeded";
        state.hallDailySalesAllDays = action.payload.data; // Store array of { totalSales, date }
        state.hallDailySalesAllDaysError = null;
      })
      .addCase(fetchHallDailySalesAllDays.rejected, (state, action) => {
        state.hallDailySalesAllDaysStatus = "failed";
        state.hallDailySalesAllDaysError = action.payload;
        state.hallDailySalesAllDays = null;
      })
      // Fetch Hall Daily Sales by Payment Method
      .addCase(fetchHallDailySalesByPaymentMethod.pending, (state) => {
        state.hallDailySalesByPaymentMethodStatus = "loading";
        state.hallDailySalesByPaymentMethodError = null;
      })
      .addCase(
        fetchHallDailySalesByPaymentMethod.fulfilled,
        (state, action) => {
          state.hallDailySalesByPaymentMethodStatus = "succeeded";
          state.hallDailySalesByPaymentMethod = action.payload.data;
          state.hallDailySalesByPaymentMethodError = null;
        }
      )
      .addCase(fetchHallDailySalesByPaymentMethod.rejected, (state, action) => {
        state.hallDailySalesByPaymentMethodStatus = "failed";
        state.hallDailySalesByPaymentMethodError = action.payload;
        state.hallDailySalesByPaymentMethod = null;
      });
  },
});

export default hallTransactionsSlice.reducer;
