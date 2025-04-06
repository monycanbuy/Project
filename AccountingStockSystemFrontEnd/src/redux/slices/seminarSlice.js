import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const SEMINAR_URL = "/seminars";

export const fetchSeminars = createAsyncThunk(
  "seminar/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(SEMINAR_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching seminars:", error);
      return rejectWithValue(error.message || "Failed to fetch seminars");
    }
  }
);

export const createSeminar = createAsyncThunk(
  "seminar/create",
  async (seminarData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(SEMINAR_URL, seminarData);
      return response.data;
    } catch (error) {
      console.error("Error creating seminar:", error);
      return rejectWithValue(error.message || "Failed to create seminar");
    }
  }
);

export const getSeminarById = createAsyncThunk(
  "seminar/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SEMINAR_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching seminar by ID:", error);
      return rejectWithValue(error.message || "Failed to fetch seminar");
    }
  }
);

export const updateSeminar = createAsyncThunk(
  "seminar/update",
  async ({ id, seminarData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${SEMINAR_URL}/${id}`, seminarData);
      return response.data;
    } catch (error) {
      console.error("Error updating seminar:", error);
      return rejectWithValue(error.message || "Failed to update seminar");
    }
  }
);

export const voidSeminar = createAsyncThunk(
  "seminar/void",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${SEMINAR_URL}/${id}/void`, {});
      // Convert Date to ISO string if it's part of the response
      if (response.data.data.voidedAt instanceof Date) {
        response.data.data.voidedAt = response.data.data.voidedAt.toISOString();
      }
      return response.data; // Return the entire response
    } catch (error) {
      console.error("Error voiding Seminar:", error);
      return rejectWithValue(error.message || "Failed to void Seminar");
    }
  }
);

// Fetch Seminars Summary
export const fetchSeminarsSummary = createAsyncThunk(
  "seminar/fetchSummary",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await apiClient.get(`${SEMINAR_URL}/summary`, {
        params: params,
      });
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

// Fetch Daily Sales
export const fetchDailySales = createAsyncThunk(
  "seminar/fetchDailySales",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Use the correct endpoint (adjust if you chose a different path)
      const response = await apiClient.get(`${SEMINAR_URL}/daily-sales`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "An error occurred fetching daily sales",
      });
    }
  }
);

// Fetch All-Time Sales (New Method)
export const fetchAllTimeSales = createAsyncThunk(
  "seminar/fetchAllTimeSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${SEMINAR_URL}/all-time-sales`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all-time sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all-time sales",
      });
    }
  }
);

// Fetch Daily Sales for All Days
export const fetchDailySalesAllDays = createAsyncThunk(
  "seminar/fetchDailySalesAllDays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${SEMINAR_URL}/daily-sales-all-days`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching daily sales for all days:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch daily sales for all days",
      });
    }
  }
);

// Fetch Payment Method Totals for Today (New Thunk)
export const fetchPaymentMethodTotalsForDay = createAsyncThunk(
  "seminar/fetchPaymentMethodTotalsForDay",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${SEMINAR_URL}/payment-method-totals-today`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment method totals for day:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch payment method totals for day",
      });
    }
  }
);

const seminarSlice = createSlice({
  name: "seminar",
  initialState: {
    seminars: [],
    currentSeminar: null,
    status: "idle",
    error: null,
    summary: null, // Add a place to store the summary
    dailySales: null, // Add a place to store daily sales data
    dailySalesStatus: "idle", // Status for daily sales requests
    dailySalesError: null, // Error for daily sales requests
    allTimeSales: null, // New state for all-time sales
    allTimeSalesStatus: "idle", // New status for all-time sales requests
    allTimeSalesError: null, // New error state for all-time sales
    dailySalesAllDays: null, // New state for all daily sales
    dailySalesAllDaysStatus: "idle", // New status
    dailySalesAllDaysError: null, // New error state
    paymentMethodTotals: null, // New state for payment method totals
    paymentMethodTotalsStatus: "idle", // New status
    paymentMethodTotalsError: null, // New error state
    //isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeminars.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSeminars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seminars = action.payload.data;
        //state.error = null;
      })
      .addCase(fetchSeminars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createSeminar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSeminar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seminars.push(action.payload);
        state.error = null;
      })
      .addCase(createSeminar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSeminarById.pending, (state) => {
        state.status = "loading";
        state.currentSeminar = null; // Reset current seminar while loading
      })
      .addCase(getSeminarById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentSeminar = action.payload;
        state.error = null;
      })
      .addCase(getSeminarById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentSeminar = null; // Set to null on failure
      })

      .addCase(updateSeminar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSeminar.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.seminars.findIndex(
          (seminar) => seminar._id === action.payload._id
        );
        if (index !== -1) {
          state.seminars[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSeminar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(voidSeminar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidSeminar.fulfilled, (state, action) => {
        const index = state.seminars.findIndex(
          (seminar) => seminar._id === action.payload._id
        );
        if (index !== -1) {
          state.seminars[index] = {
            ...state.seminars[index],
            isVoided: true,
            voidedAt: action.payload.voidedAt || new Date().toISOString(), // Convert to ISO string
          };
        }
      })
      .addCase(voidSeminar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSeminarsSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSeminarsSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSeminarsSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Daily Sales Cases
      .addCase(fetchDailySales.pending, (state) => {
        state.dailySalesStatus = "loading";
        state.dailySalesError = null; // Clear previous error
      })
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.dailySalesStatus = "succeeded";
        state.dailySales = action.payload.data; // Store the data
        state.dailySalesError = null;
      })
      .addCase(fetchDailySales.rejected, (state, action) => {
        state.dailySalesStatus = "failed";
        state.dailySalesError = action.payload; // Store the error
        state.dailySales = null; // Clear previous data
      })
      // Fetch All-Time Sales (New Cases)
      .addCase(fetchAllTimeSales.pending, (state) => {
        state.allTimeSalesStatus = "loading";
        state.allTimeSalesError = null;
      })
      .addCase(fetchAllTimeSales.fulfilled, (state, action) => {
        state.allTimeSalesStatus = "succeeded";
        state.allTimeSales = action.payload.data; // Store the totalSales object
        state.allTimeSalesError = null;
      })
      .addCase(fetchAllTimeSales.rejected, (state, action) => {
        state.allTimeSalesStatus = "failed";
        state.allTimeSalesError = action.payload;
        state.allTimeSales = null;
      });
    // Add new cases for fetchDailySalesAllDays
    builder
      .addCase(fetchDailySalesAllDays.pending, (state) => {
        state.dailySalesAllDaysStatus = "loading";
        state.dailySalesAllDaysError = null;
      })
      .addCase(fetchDailySalesAllDays.fulfilled, (state, action) => {
        state.dailySalesAllDaysStatus = "succeeded";
        state.dailySalesAllDays = action.payload.data; // Array of { date, totalSales }
        state.dailySalesAllDaysError = null;
      })
      .addCase(fetchDailySalesAllDays.rejected, (state, action) => {
        state.dailySalesAllDaysStatus = "failed";
        state.dailySalesAllDaysError = action.payload;
        state.dailySalesAllDays = null;
      })
      // NEW: Payment Method Totals Cases
      // Fetch Payment Method Totals for Today (New Cases)
      .addCase(fetchPaymentMethodTotalsForDay.pending, (state) => {
        state.paymentMethodTotalsStatus = "loading";
        state.paymentMethodTotalsError = null;
      })
      .addCase(fetchPaymentMethodTotalsForDay.fulfilled, (state, action) => {
        state.paymentMethodTotalsStatus = "succeeded";
        state.paymentMethodTotals = action.payload.data; // Array of { paymentMethodId, paymentMethod, totalAmount }
        state.paymentMethodTotalsError = null;
      })
      .addCase(fetchPaymentMethodTotalsForDay.rejected, (state, action) => {
        state.paymentMethodTotalsStatus = "failed";
        state.paymentMethodTotalsError = action.payload;
        state.paymentMethodTotals = null;
      });
  },
});

export const {} = seminarSlice.actions;

export default seminarSlice.reducer;
