import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
// const BASE_URL = `${API_BASE_URL}/api/laundry`;
const BASE_URL = "/laundry";

export const fetchLaundries = createAsyncThunk(
  "laundry/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching laundries:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch laundries"
      );
    }
  }
);

export const addLaundry = createAsyncThunk(
  "laundry/add",
  async (laundryData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, laundryData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding laundry:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add laundry"
      );
    }
  }
);

export const updateLaundry = createAsyncThunk(
  "laundry/update",
  async ({ id, laundryData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, laundryData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating laundry:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update laundry"
      );
    }
  }
);

export const voidLaundry = createAsyncThunk(
  "laundry/void",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/${id}`, {});
      return response.data; // Return full response
    } catch (error) {
      console.error("Error voiding laundry:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to void laundry"
      );
    }
  }
);

export const fetchLaundrySummary = createAsyncThunk(
  "laundry/fetchSummary",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const params = { fromDate, toDate };
      const response = await apiClient.get(`${BASE_URL}/summary`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching laundry summary:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to fetch summary",
      });
    }
  }
);

// export const fetchDailyLaundrySales = createAsyncThunk(
//   "laundry/fetchDailySales",
//   async ({ date }, { rejectWithValue }) => {
//     try {
//       const params = { date };
//       const response = await apiClient.get(`${BASE_URL}/daily-sales`, {
//         params,
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching daily laundry sales:", error);
//       return rejectWithValue({
//         status: error.response?.status || 500,
//         message: error.response?.data?.message || "Failed to fetch daily sales",
//       });
//     }
//   }
// );
export const fetchDailyLaundrySales = createAsyncThunk(
  "laundry/fetchDailySales",
  async (args = {}, { rejectWithValue }) => {
    // Default to empty object
    try {
      const { date } = args; // Destructure, date can be undefined
      const params = date ? { date } : {}; // Only include date if provided
      // console.log("Thunk started, params:", params);
      // console.log(
      //   "Request URL:",
      //   `${apiClient.defaults.baseURL}${BASE_URL}/daily-sales${
      //     date ? `?date=${date}` : ""
      //   }`
      // );
      const response = await apiClient.get(`${BASE_URL}/daily-sales`, {
        params,
      });
      // console.log("Raw API Response:", response);
      // console.log("Extracted Data:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Thunk error:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to fetch daily sales",
      });
    }
  }
);

export const fetchAllTimeLaundrySales = createAsyncThunk(
  "laundry/fetchAllTimeSales",
  async ({ fromDate, toDate } = {}, { rejectWithValue }) => {
    try {
      const params = { fromDate, toDate };
      const response = await apiClient.get(`${BASE_URL}/all-time-sales`, {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all-time laundry sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message || "Failed to fetch all-time sales",
      });
    }
  }
);

export const fetchDailySalesAllDays = createAsyncThunk(
  "laundry/fetchDailySalesAllDays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily-sales-all-days`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching daily sales for all days:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          "Failed to fetch daily sales for all days",
      });
    }
  }
);

const laundrySlice = createSlice({
  name: "laundry",
  initialState: {
    laundries: [],
    currentLaundry: null,
    summary: {
      totalSales: 0,
      totalDiscountCount: 0,
      totalDiscountSum: 0,
      paymentMethods: [],
      statusCounts: {},
    },
    dailySales: {
      totalSales: 0,
      paymentMethodSales: {},
    },
    allTimeSales: { totalSales: 0 },
    dailySalesAllDays: [],
    status: "idle",
    error: null,
    dailySalesStatus: "idle",
    dailySalesError: null,
    allTimeSalesStatus: "idle",
    allTimeSalesError: null,
    dailySalesAllDaysStatus: "idle",
    dailySalesAllDaysError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaundries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLaundries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.laundries = action.payload;
        state.error = null;
      })
      .addCase(fetchLaundries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addLaundry.fulfilled, (state, action) => {
        state.laundries.push(action.payload);
      })
      .addCase(updateLaundry.fulfilled, (state, action) => {
        const index = state.laundries.findIndex(
          (laundry) => laundry._id === action.payload._id
        );
        if (index !== -1) {
          state.laundries[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(voidLaundry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidLaundry.fulfilled, (state, action) => {
        const index = state.laundries.findIndex(
          (laundry) => laundry._id === action.payload.data._id
        );
        if (index !== -1) {
          state.laundries[index] = {
            ...state.laundries[index],
            isVoided: true,
            voidedAt: action.payload.data.voidedAt || new Date().toISOString(),
          };
        }
        state.status = "succeeded";
      })
      .addCase(voidLaundry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLaundrySummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLaundrySummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload;
        state.error = null;
      })
      .addCase(fetchLaundrySummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchDailyLaundrySales.pending, (state) => {
        state.dailySalesStatus = "loading";
        //console.log("fetchDailyLaundrySales pending");
      })
      .addCase(fetchDailyLaundrySales.fulfilled, (state, action) => {
        state.dailySalesStatus = "succeeded";
        state.dailySales = action.payload;
        state.dailySalesError = null;
        // console.log(
        //   "fetchDailyLaundrySales fulfilled, payload:",
        //   action.payload
        // );
        // console.log("Updated dailySales state:", state.dailySales);
      })
      .addCase(fetchDailyLaundrySales.rejected, (state, action) => {
        state.dailySalesStatus = "failed";
        state.dailySalesError = action.payload;
        //console.log("fetchDailyLaundrySales rejected, error:", action.payload);
      })
      .addCase(fetchAllTimeLaundrySales.pending, (state) => {
        state.allTimeSalesStatus = "loading";
      })
      .addCase(fetchAllTimeLaundrySales.fulfilled, (state, action) => {
        state.allTimeSalesStatus = "succeeded";
        state.allTimeSales = action.payload;
        state.allTimeSalesError = null;
      })
      .addCase(fetchAllTimeLaundrySales.rejected, (state, action) => {
        state.allTimeSalesStatus = "failed";
        state.allTimeSalesError = action.payload;
      })
      .addCase(fetchDailySalesAllDays.pending, (state) => {
        state.dailySalesAllDaysStatus = "loading";
      })
      .addCase(fetchDailySalesAllDays.fulfilled, (state, action) => {
        state.dailySalesAllDaysStatus = "succeeded";
        state.dailySalesAllDays = action.payload;
        state.dailySalesAllDaysError = null;
      })
      .addCase(fetchDailySalesAllDays.rejected, (state, action) => {
        state.dailySalesAllDaysStatus = "failed";
        state.dailySalesAllDaysError = action.payload;
      });
  },
});

export default laundrySlice.reducer;
