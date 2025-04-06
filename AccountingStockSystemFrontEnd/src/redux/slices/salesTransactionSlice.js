import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const BASE_URL = "/trackinventories";

// Async thunks
export const fetchSalesTransactions = createAsyncThunk(
  "salesTransactions/fetchSalesTransactions",
  async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Re-throw the error to be handled by the async thunk's rejected state
    }
  }
);

export const createSalesTransaction = createAsyncThunk(
  "salesTransactions/createSalesTransaction",
  async (saleData) => {
    try {
      //console.log("Sending data:", saleData);
      const response = await apiClient.post(BASE_URL, saleData);
      //console.log("Received response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  }
);

// export const updateSalesTransaction = createAsyncThunk(
//   "salesTransactions/updateSalesTransaction",
//   async ({ id, saleData }) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/${id}`,
//         saleData,
//         getConfig()
//       );
//       return response.data.data;
//     } catch (error) {
//       console.error("API Error:", error);
//       throw error;
//     }
//   }
// );

export const updateSalesTransaction = createAsyncThunk(
  "salesTransactions/updateSalesTransaction",
  async ({ transactionId, saleData }) => {
    // Changed 'id' to 'transactionId'
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${transactionId}`, // Use transactionId here
        saleData
      );
      return response.data.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

export const voidSalesTransaction = createAsyncThunk(
  "salesTransactions/voidSalesTransaction",
  async (id) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${id}/void`,
        {} // You might not need to send any data for voiding
      );
      return response.data; // Return the response data (might contain success message)
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

// New thunk: Fetch today's sales
export const fetchTodaySales = createAsyncThunk(
  "salesTransactions/fetchTodaySales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales/today`);
      //console.log("Today Sales API Response:", response.data);
      return response.data.data; // { date, totalSales, breakdown }
    } catch (error) {
      console.error("Error fetching today's sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch today's sales",
      });
    }
  }
);

// New thunk: Fetch all-time total sales
export const fetchAllTimeTotalSales = createAsyncThunk(
  "salesTransactions/fetchAllTimeTotalSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales/all-time-total`);
      //console.log("All-Time Total Sales API Response:", response.data);
      return response.data.data; // { totalSales }
    } catch (error) {
      console.error("Error fetching all-time total sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all-time total sales",
      });
    }
  }
);

// New thunk: Fetch last seven days sales
export const fetchLastSevenDaysSales = createAsyncThunk(
  "salesTransactions/fetchLastSevenDaysSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales/last-seven-days`);
      //console.log("Last Seven Days Sales API Response:", response.data);
      return response.data.data; // Array of { date, totalSales }
    } catch (error) {
      console.error("Error fetching last seven days sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch last seven days sales",
      });
    }
  }
);

// New thunk: Fetch sales for the last two weeks
export const fetchSalesForLastTwoWeeks = createAsyncThunk(
  "salesTransactions/fetchSalesForLastTwoWeeks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales/last-two-weeks`);
      //console.log("Last Two Weeks Sales API Response:", response.data);
      return response.data.data; // Array of { date, totalSales }
    } catch (error) {
      console.error("Error fetching last two weeks sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch last two weeks sales",
      });
    }
  }
);

// New thunk: Fetch daily sales by payment method
export const fetchDailySalesByPaymentMethod = createAsyncThunk(
  "salesTransactions/fetchDailySalesByPaymentMethod",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/sales/daily-sales-by-payment-method`
      );
      //console.log("Daily Sales by Payment Method API Response:", response.data);
      return response.data.data; // Array of { paymentMethodId, paymentMethod, totalAmount }
    } catch (error) {
      console.error("Error fetching daily sales by payment method:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch daily sales by payment method",
      });
    }
  }
);

// Add this thunk
export const fetchOrderItems = createAsyncThunk(
  "salesTransactions/fetchOrderItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/order-items"); // Adjust endpoint as needed
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  // salesTransactions: [],
  // status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  // error: null,
  salesTransactions: [],
  todaySales: {
    date: "",
    totalSales: 0,
    breakdown: { restaurant: 0, minimart: 0 },
  }, // New field for today's sales
  status: "idle", // General status for salesTransactions
  error: null,
  todaySalesStatus: "idle", // Separate status for todaySales
  todaySalesError: null,
  allTimeTotalSalesStatus: "idle", // Separate status for all-time total sales
  allTimeTotalSalesError: null,
  lastSevenDaysSalesStatus: "idle", // Separate status for last seven days
  lastSevenDaysSalesError: null, // Separate error for last seven days
  lastTwoWeeksSalesStatus: "idle", // Separate status for last two weeks
  lastTwoWeeksSalesError: null,
  dailySalesByPaymentMethodStatus: "idle", // Separate status for daily sales by payment method
  dailySalesByPaymentMethodError: null, // Separate error for daily sales by payment method
  orderItems: [], // Add this
  orderItemsStatus: "idle", // Add this
  orderItemsError: null, // Add this
};

const salesTransactionsSlice = createSlice({
  name: "salesTransactions",
  initialState,
  reducers: {}, // You can add other reducers here if needed
  extraReducers(builder) {
    builder
      .addCase(fetchSalesTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSalesTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesTransactions = action.payload;
      })
      .addCase(fetchSalesTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add similar cases for createSalesTransaction, updateSalesTransaction, and voidSalesTransaction
      .addCase(createSalesTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSalesTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesTransactions.push(action.payload); // Add the new sale transaction to the state
      })
      .addCase(createSalesTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSalesTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSalesTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the existing sale transaction in the state
        const updatedSale = action.payload;
        const index = state.salesTransactions.findIndex(
          (sale) => sale._id === updatedSale._id
        );
        if (index !== -1) {
          state.salesTransactions[index] = updatedSale;
        }
      })
      .addCase(updateSalesTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(voidSalesTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidSalesTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the voided sale transaction in the state
        const voidedSaleId = action.meta.arg; // Get the ID from the original action argument
        const index = state.salesTransactions.findIndex(
          (sale) => sale._id === voidedSaleId
        );
        if (index !== -1) {
          state.salesTransactions[index].isVoided = true;
        }
      })
      .addCase(voidSalesTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // New cases for fetchTodaySales
      .addCase(fetchTodaySales.pending, (state) => {
        state.todaySalesStatus = "loading";
        state.todaySalesError = null;
      })
      .addCase(fetchTodaySales.fulfilled, (state, action) => {
        state.todaySalesStatus = "succeeded";
        state.todaySales = action.payload;
        state.todaySalesError = null;
      })
      .addCase(fetchTodaySales.rejected, (state, action) => {
        state.todaySalesStatus = "failed";
        state.todaySalesError = action.payload;
      })
      // New cases for fetchAllTimeTotalSales
      .addCase(fetchAllTimeTotalSales.pending, (state) => {
        state.allTimeTotalSalesStatus = "loading";
        state.allTimeTotalSalesError = null;
      })
      .addCase(fetchAllTimeTotalSales.fulfilled, (state, action) => {
        state.allTimeTotalSalesStatus = "succeeded";
        state.allTimeTotalSales = action.payload; // { totalSales }
        state.allTimeTotalSalesError = null;
      })
      .addCase(fetchAllTimeTotalSales.rejected, (state, action) => {
        state.allTimeTotalSalesStatus = "failed";
        state.allTimeTotalSalesError = action.payload;
      })
      // New cases for fetchLastSevenDaysSales
      .addCase(fetchLastSevenDaysSales.pending, (state) => {
        state.lastSevenDaysSalesStatus = "loading";
        state.lastSevenDaysSalesError = null;
      })
      .addCase(fetchLastSevenDaysSales.fulfilled, (state, action) => {
        state.lastSevenDaysSalesStatus = "succeeded";
        state.lastSevenDaysSales = action.payload; // Array of { date, totalSales }
        state.lastSevenDaysSalesError = null;
      })
      .addCase(fetchLastSevenDaysSales.rejected, (state, action) => {
        state.lastSevenDaysSalesStatus = "failed";
        state.lastSevenDaysSalesError = action.payload;
      })
      // New cases for fetchSalesForLastTwoWeeks
      .addCase(fetchSalesForLastTwoWeeks.pending, (state) => {
        state.lastTwoWeeksSalesStatus = "loading";
        state.lastTwoWeeksSalesError = null;
      })
      .addCase(fetchSalesForLastTwoWeeks.fulfilled, (state, action) => {
        state.lastTwoWeeksSalesStatus = "succeeded";
        state.lastTwoWeeksSales = action.payload; // Array of { date, totalSales }
        state.lastTwoWeeksSalesError = null;
      })
      .addCase(fetchSalesForLastTwoWeeks.rejected, (state, action) => {
        state.lastTwoWeeksSalesStatus = "failed";
        state.lastTwoWeeksSalesError = action.payload;
      })
      // New cases for fetchDailySalesByPaymentMethod
      .addCase(fetchDailySalesByPaymentMethod.pending, (state) => {
        state.dailySalesByPaymentMethodStatus = "loading";
        state.dailySalesByPaymentMethodError = null;
      })
      .addCase(fetchDailySalesByPaymentMethod.fulfilled, (state, action) => {
        state.dailySalesByPaymentMethodStatus = "succeeded";
        state.dailySalesByPaymentMethod = action.payload; // Array of { paymentMethodId, paymentMethod, totalAmount }
        state.dailySalesByPaymentMethodError = null;
      })
      .addCase(fetchDailySalesByPaymentMethod.rejected, (state, action) => {
        state.dailySalesByPaymentMethodStatus = "failed";
        state.dailySalesByPaymentMethodError = action.payload;
      })
      .addCase(fetchOrderItems.pending, (state) => {
        state.orderItemsStatus = "loading";
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.orderItemsStatus = "succeeded";
        state.orderItems = action.payload;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.orderItemsStatus = "failed";
        state.orderItemsError = action.payload;
      });
  },
});

export default salesTransactionsSlice.reducer;
