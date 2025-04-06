// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice";

// // API Base URL
// const BASE_URL = "/aggregate-sales";

// // Get config with Authorization header

// // Async thunk for fetching daily sales report
// // export const fetchDailySalesReport = createAsyncThunk(
// //   "aggregateSales/fetchDailySales",
// //   async (date, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${BASE_URL}/daily?date=${date.toISOString().split("T")[0]}`, // Adjusted URL to match your complete URL
// //         getConfig()
// //       );
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data ||
// //           "An error occurred while fetching the sales report"
// //       );
// //     }
// //   }
// // );
// export const fetchDailySalesReport = createAsyncThunk(
//   "aggregateSales/fetchDailySales",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/daily`, getConfig());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data ||
//           "An error occurred while fetching the sales report"
//       );
//     }
//   }
// );

// // Create slice
// const aggregateSalesSlice = createSlice({
//   name: "aggregateSales",
//   initialState: {
//     salesReport: {},
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDailySalesReport.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.salesReport = action.payload;
//       })
//       .addCase(fetchDailySalesReport.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// // Export reducer
// export default aggregateSalesSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice"; // Assuming apiClient handles auth

// // API Base URL
// const BASE_URL = "/aggregate-sales";

// // Async thunk for fetching daily sales history
// export const fetchDailySalesReport = createAsyncThunk(
//   "aggregateSales/fetchDailySalesReport",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/daily`);
//       return response.data; // Return the array directly
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//           "An error occurred while fetching the daily sales report"
//       );
//     }
//   }
// );

// // Async thunk for fetching daily sales report from /daily-report
// export const getDailySalesReportData = createAsyncThunk(
//   // Changed name here
//   "aggregateSales/getDailySalesReportData", // Changed action type string
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/daily-report`);
//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the daily sales report";
//       return rejectWithValue(message);
//     }
//   }
// );

// // Create slice
// const aggregateSalesSlice = createSlice({
//   name: "aggregateSales",
//   initialState: {
//     salesReport: [], // Array to match /daily response
//     dailySalesReport: {
//       date: "",
//       overallDailySales: 0,
//       departments: {
//         restaurant: { totalSales: 0 },
//         minimart: { totalSales: 0 },
//         laundry: { totalSales: 0 },
//         kabasa: { totalSales: 0 },
//         hall: { totalSales: 0 },
//         frontOffice: { totalSales: 0 },
//         seminar: { totalSales: 0 },
//       },
//       excludedTransactions: {
//         voided: 0,
//         canceled: 0,
//         refunded: 0,
//       },
//     },
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDailySalesReport.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchDailySalesReport.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.salesReport = action.payload;
//       })
//       .addCase(fetchDailySalesReport.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(getDailySalesReport.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(getDailySalesReport.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.dailySalesReport = {
//           ...state.dailySalesReport,
//           date: action.payload.date || state.dailySalesReport.date,
//           overallDailySales:
//             action.payload.overallDailySales ||
//             state.dailySalesReport.overallDailySales,
//           departments: {
//             restaurant: {
//               totalSales:
//                 action.payload.departments?.restaurant?.totalSales ||
//                 state.dailySalesReport.departments.restaurant.totalSales,
//             },
//             minimart: {
//               totalSales:
//                 action.payload.departments?.minimart?.totalSales ||
//                 state.dailySalesReport.departments.minimart.totalSales,
//             },
//             laundry: {
//               totalSales:
//                 action.payload.departments?.laundry?.totalSales ||
//                 state.dailySalesReport.departments.laundry.totalSales,
//             },
//             kabasa: {
//               totalSales:
//                 action.payload.departments?.kabasa?.totalSales ||
//                 state.dailySalesReport.departments.kabasa.totalSales,
//             },
//             hall: {
//               totalSales:
//                 action.payload.departments?.hall?.totalSales ||
//                 state.dailySalesReport.departments.hall.totalSales,
//             },
//             frontOffice: {
//               totalSales:
//                 action.payload.departments?.frontOffice?.totalSales ||
//                 state.dailySalesReport.departments.frontOffice.totalSales,
//             },
//           },
//           excludedTransactions: {
//             voided:
//               action.payload.excludedTransactions?.voided ||
//               state.dailySalesReport.excludedTransactions.voided,
//             canceled:
//               action.payload.excludedTransactions?.canceled ||
//               state.dailySalesReport.excludedTransactions.canceled,
//             refunded:
//               action.payload.excludedTransactions?.refunded ||
//               state.dailySalesReport.excludedTransactions.refunded,
//           },
//         };
//       })
//       .addCase(getDailySalesReport.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// // Export reducer
// export default aggregateSalesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";
// API Base URL
const BASE_URL = "/aggregate-sales";

// Async thunk for fetching daily sales history (from /daily) - KEEP THIS
export const fetchDailySalesHistory = createAsyncThunk(
  // Corrected name here
  "aggregateSales/fetchDailySalesHistory", // Corrected action type
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily`);
      return response.data; // Return the array directly
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching the daily sales history" // Corrected message
      );
    }
  }
);

// export const getDailySalesReportData = createAsyncThunk(
//   "aggregateSales/getDailySalesReportData",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/daily-report`);
//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the daily sales report";
//       return rejectWithValue(message);
//     }
//   }
// );
export const getDailySalesReportData = createAsyncThunk(
  "aggregateSales/getDailySalesReportData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily-report`);
      //console.log("Thunk - getDailySalesReportData Response:", response.data);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while fetching the daily sales report";
      console.error(
        "Thunk - getDailySalesReportData Error:",
        error.response || error
      );
      return rejectWithValue(message);
    }
  }
);

// New async thunk for fetching total revenue from /total-revenue
// export const getTotalRevenue = createAsyncThunk(
//   "aggregateSales/getTotalRevenue",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/total-revenue`);
//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the total revenue";
//       return rejectWithValue(message);
//     }
//   }
// );
export const getTotalRevenue = createAsyncThunk(
  "aggregateSales/getTotalRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/total-revenue`);
      //console.log("API Response:", response.data); // Debug API response
      return response.data; // { success: true, data: { currentMonth: {...}, lastMonth: {...} }, message: "..." }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while fetching the total revenue";
      return rejectWithValue(message);
    }
  }
);

// New async thunk for fetching payment methods report from /payment-methods-report
// export const getPaymentMethodsReport = createAsyncThunk(
//   "aggregateSales/getPaymentMethodsReport",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(
//         `${BASE_URL}/payment-methods-report`
//       );
//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the payment methods report";
//       return rejectWithValue(message);
//     }
//   }
// );
// New async thunk for fetching payment methods report from /payment-methods-report

// export const getPaymentMethodsReport = createAsyncThunk(
//   "aggregateSales/getPaymentMethodsReport",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(
//         `${BASE_URL}/payment-methods-report`
//       );
//       console.log("API Response:", response.data); // *** IMPORTANT: LOG THE RESPONSE ***
//       return response.data;
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the payment methods report";
//       console.error("API Error:", error); // *** IMPORTANT: LOG THE ERROR ***
//       return rejectWithValue(message);
//     }
//   }
// );

// New thunk for fetching monthly sales across departments
export const getPaymentMethodsReport = createAsyncThunk(
  "aggregateSales/getPaymentMethodsReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/payment-methods-report`
      );
      //console.log("API Response:", response.data);
      return response.data.data; // Return the breakdown directly
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch payment methods report";
      console.error("API Error:", error);
      return rejectWithValue(message);
    }
  }
);

export const getMonthlySalesAcrossDepartments = createAsyncThunk(
  "aggregateSales/getMonthlySalesAcrossDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/monthly-sales`);
      //console.log("Thunk - API response:", response.data);
      return response.data; // Should return { success, data, message }
    } catch (error) {
      const message = error.response?.data?.message || "Fetch failed";
      console.error("Thunk - API error:", error);
      return rejectWithValue(message);
    }
  }
);

// New thunk for fetching daily sales all time
export const getDailySalesAllTime = createAsyncThunk(
  "aggregateSales/getDailySalesAllTime",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/daily-sales-all-time`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred while fetching the daily sales all time report";
      return rejectWithValue(message);
    }
  }
);

// export const getAllTimeTotalSales = createAsyncThunk(
//   "aggregateSales/getAllTimeTotalSales",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/all-time-total`);
//       console.log("API Response:", response.data);
//       return response.data.data.totalSales; // Just the number
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to fetch all-time total sales";
//       return rejectWithValue(message);
//     }
//   }
// );

// // Add this new thunk above the slice definition
// export const getMonthlySalesComparison = createAsyncThunk(
//   "aggregateSales/getMonthlySalesComparison",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/monthly-comparison`);
//       console.log("Monthly Comparison API Response:", response.data);
//       return response.data.data; // Return { dates, series }
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         "An error occurred while fetching the monthly sales comparison";
//       console.error("Monthly Comparison API Error:", error);
//       return rejectWithValue(message);
//     }
//   }
// );

// export const getAllTimeTotalSales = createAsyncThunk(
//   "aggregateSales/getAllTimeTotalSales",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(`${BASE_URL}/all-time-total`);
//       console.log("Thunk - getAllTimeTotalSales Response:", response.data);
//       return response.data.data.totalSales; // 2489558.24
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "Failed to fetch all-time total sales";
//       console.error("Thunk - getAllTimeTotalSales Error:", error);
//       return rejectWithValue(message);
//     }
//   }
// );

export const getAllTimeTotalSales = createAsyncThunk(
  "aggregateSales/getAllTimeTotalSales",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/all-time-total?ts=${Date.now()}`;
      const response = await apiClient.get(url, {
        headers: { "Cache-Control": "no-cache" },
      });
      //console.log("Thunk - Full API Response:", response.data);
      return response.data.data.totalSales;
    } catch (error) {
      const message =
        error.response?.status === 401
          ? "Unauthorized: Please log in again"
          : error.response?.data?.message ||
            "Failed to fetch all-time total sales";
      console.error("Thunk - Detailed Error:", error.response || error);
      return rejectWithValue(message);
    }
  }
);

export const getMonthlySalesComparison = createAsyncThunk(
  "aggregateSales/getMonthlySalesComparison",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/monthly-comparison`);
      //console.log("Thunk - getMonthlySalesComparison Response:", response.data);
      return response.data.data; // { dates, series }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch monthly sales comparison";
      console.error("Thunk - getMonthlySalesComparison Error:", error);
      return rejectWithValue(message);
    }
  }
);

// Create slice
const aggregateSalesSlice = createSlice({
  name: "aggregateSales",
  initialState: {
    salesHistory: [], // Renamed to salesHistory for clarity, stores data from /daily
    dailySalesReport: {
      date: "",
      overallDailySales: 0,
      departments: {
        restaurant: { totalSales: 0 },
        minimart: { totalSales: 0 },
        laundry: { totalSales: 0 },
        kabasa: { totalSales: 0 },
        hall: { totalSales: 0 },
        frontOffice: { totalSales: 0 },
        seminar: { totalSales: 0 },
      },
      excludedTransactions: {
        voided: 0,
        canceled: 0,
        refunded: 0,
      },
    },
    totalRevenueReport: {
      currentMonth: {
        month: "", // e.g., "2025-02"
        totalRevenue: 0,
        departments: {
          restaurant: { totalRevenue: 0 },
          minimart: { totalRevenue: 0 },
          laundry: { totalRevenue: 0 },
          kabasa: { totalRevenue: 0 },
          hall: { totalRevenue: 0 },
          frontOffice: { totalRevenue: 0 },
          seminar: { totalRevenue: 0 },
          // Seminar omitted as it’s not in your API response; add if needed
        },
        excludedTransactions: {
          voided: 0,
          canceled: 0,
          refunded: 0,
        },
      },
      lastMonth: {
        month: "", // e.g., "2025-01"
        totalRevenue: 0,
        departments: {
          restaurant: { totalRevenue: 0 },
          minimart: { totalRevenue: 0 },
          laundry: { totalRevenue: 0 },
          kabasa: { totalRevenue: 0 },
          hall: { totalRevenue: 0 },
          frontOffice: { totalRevenue: 0 },
          seminar: { totalRevenue: 0 },
          // Seminar omitted as it’s not in your API response; add if needed
        },
        excludedTransactions: {
          voided: 0,
          canceled: 0,
          refunded: 0,
        },
      },
    },
    paymentMethodsReport: {
      // *** MATCH THIS TO YOUR API RESPONSE ***
      cash: { totalSales: 0 },
      pos: { totalSales: 0 },
      transfer: { totalSales: 0 },
      "signing credit": { totalSales: 0 },
      credits: { totalSales: 0 },
    },
    // resetPaymentMethodsReport: (state) => {
    //   state.paymentMethodsReport = {
    //     cash: { totalSales: 0 },
    //     pos: { totalSales: 0 },
    //     transfer: { totalSales: 0 },
    //     "signing credit": { totalSales: 0 },
    //     credits: { totalSales: 0 },
    //   };
    //   state.status = "idle";
    // },
    monthlySales: [], // For /monthly-sales: array of { month, totalSales }
    dailySalesAllTime: [],
    status: "idle", //  Status for *both* thunks (you can have separate statuses if needed)
    allTimeTotalSales: 0,
    error: null, // Error for *both* thunks
    pollingStatus: "idle", // NEW: Status for polling updates
    pollingError: null, // NEW: Error for polling updates
    // New field for monthly comparison
    monthlyComparison: {
      dates: [],
      series: [
        { name: "Last Month", data: [] },
        { name: "Running Month", data: [] },
      ],
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetchDailySalesHistory (/daily)
      .addCase(fetchDailySalesHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDailySalesHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesHistory = action.payload; // Store in salesHistory
      })
      .addCase(fetchDailySalesHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for getDailySalesReportData (/daily-report)
      // .addCase(getDailySalesReportData.pending, (state) => {
      //   // Only set pollingStatus to loading.  Leave 'status' alone.
      //   state.pollingStatus = "loading";
      //   state.pollingError = null; // Clear any previous polling error
      // })
      // .addCase(getDailySalesReportData.fulfilled, (state, action) => {
      //   state.pollingStatus = "succeeded"; // Polling succeeded
      //   state.dailySalesReport = action.payload.data;
      //   //If it's the initial load, also update 'status'.
      //   if (state.status === "idle") {
      //     state.status = "succeeded";
      //   }
      // })
      // .addCase(getDailySalesReportData.rejected, (state, action) => {
      //   state.pollingStatus = "failed";
      //   state.pollingError = action.payload;
      //   //If it's the initial load, also update 'status'.
      //   if (state.status === "idle") {
      //     state.status = "failed";
      //     state.error = action.payload;
      //   }
      // })
      .addCase(getDailySalesReportData.pending, (state) => {
        state.pollingStatus = "loading";
        state.pollingError = null;
        //console.log("Slice - getDailySalesReportData Pending");
      })
      .addCase(getDailySalesReportData.fulfilled, (state, action) => {
        state.pollingStatus = "succeeded";
        state.dailySalesReport = action.payload.data;
        if (state.status === "idle" || state.status === "loading") {
          state.status = "succeeded";
        }
        // console.log(
        //   "Slice - getDailySalesReportData Fulfilled, Payload:",
        //   action.payload
        // );
        // console.log("Updated dailySalesReport:", state.dailySalesReport);
      })
      .addCase(getDailySalesReportData.rejected, (state, action) => {
        state.pollingStatus = "failed";
        state.pollingError = action.payload;
        if (state.status === "idle" || state.status === "loading") {
          state.status = "failed";
          state.error = action.payload;
        }
        // console.log(
        //   "Slice - getDailySalesReportData Rejected, Error:",
        //   action.payload
        // );
      })
      .addCase(getTotalRevenue.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTotalRevenue.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Fix: Assign the nested 'data' object directly
        state.totalRevenueReport = action.payload.data; // { currentMonth: {...}, lastMonth: {...} }
        //console.log("Updated totalRevenueReport:", state.totalRevenueReport);
      })
      .addCase(getTotalRevenue.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for getPaymentMethodsReport (/payment-methods-report)
      .addCase(getPaymentMethodsReport.pending, (state) => {
        state.status = "loading"; // Use a separate status if you want
        state.error = null;
      })
      .addCase(getPaymentMethodsReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentMethodsReport = action.payload;
        //state.paymentMethodsReport = action.payload.data; // *** DIRECT ASSIGNMENT ***
        // console.log(
        //   "Updated paymentMethodsReport:",
        //   state.paymentMethodsReport
        // );
      })
      .addCase(getPaymentMethodsReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // New reducers for getMonthlySalesAcrossDepartments
      .addCase(getMonthlySalesAcrossDepartments.pending, (state) => {
        state.status = "loading";
        state.error = null;
        //console.log("Pending: Setting status to loading");
      })
      .addCase(getMonthlySalesAcrossDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthlySales = action.payload.data; // Should set monthlySales here
        //console.log("Fulfilled: Updated monthlySales:", action.payload.data);
      })
      .addCase(getMonthlySalesAcrossDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        //console.log("Rejected: Error:", action.payload);
      })
      // New reducers for getDailySalesAllTime
      .addCase(getDailySalesAllTime.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDailySalesAllTime.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailySalesAllTime = action.payload.data; // Store the array of { date, totalSales }
      })
      .addCase(getDailySalesAllTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // In extraReducers:
      .addCase(getAllTimeTotalSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
        //console.log("Slice - getAllTimeTotalSales Pending");
      })
      .addCase(getAllTimeTotalSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTimeTotalSales = action.payload; // New field for the total
        // console.log(
        //   "Slice - getAllTimeTotalSales Fulfilled, Payload:",
        //   action.payload
        // );
        // console.log("Updated allTimeTotalSales:", state.allTimeTotalSales);
      })
      .addCase(getAllTimeTotalSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // console.log(
        //   "Slice - getAllTimeTotalSales Rejected, Error:",
        //   action.payload
        // );
      })
      // New cases for getMonthlySalesComparison
      .addCase(getMonthlySalesComparison.pending, (state) => {
        state.status = "loading";
        state.error = null;
        //console.log("Slice - getMonthlySalesComparison Pending");
      })
      .addCase(getMonthlySalesComparison.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.monthlyComparison = action.payload; // { dates, series }
        // console.log(
        //   "Slice - getMonthlySalesComparison Fulfilled, Payload:",
        //   action.payload
        // );
        // console.log("Updated monthlyComparison:", state.monthlyComparison);
      })
      .addCase(getMonthlySalesComparison.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // console.log(
        //   "Slice - getMonthlySalesComparison Rejected, Error:",
        //   action.payload
        // );
      });
  },
});
//export const { resetPaymentMethodsReport } = aggregateSalesSlice.actions;
export default aggregateSalesSlice.reducer;
