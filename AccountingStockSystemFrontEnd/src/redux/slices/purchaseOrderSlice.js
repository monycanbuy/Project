// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// //import axios from "axios";
// import { apiClient } from "./authSlice";

// // export const apiClient = axios.create({
// //   baseURL: "http://localhost:8000/api", // HARDCODED
// //   // ...
// // });

// const BASE_URL = "/purchaseorders";

// // Async thunks for CRUD operations
// // export const fetchPurchaseOrders = createAsyncThunk(
// //   "purchaseOrders/fetchPurchaseOrders",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const config = getConfig();
// //       const response = await apiClient.get(BASE_URL);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data || "Error fetching purchase orders"
// //       );
// //     }
// //   }
// // );
// export const fetchPurchaseOrders = createAsyncThunk(
//   "purchaseOrders/fetchPurchaseOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       // Add a console.log to see the apiClient object
//       console.log("apiClient:", apiClient);
//       console.log(
//         "Request URL:",
//         `<span class="math-inline">\{apiClient\.defaults\.baseURL\}</span>{BASE_URL}`
//       ); // Log the FULL URL

//       const response = await apiClient.get(BASE_URL);
//       return response.data;
//     } catch (error) {
//       // Use the detailed error handling (from previous responses)
//       if (error.response) {
//         return rejectWithValue({
//           status: error.response.status,
//           message:
//             error.response.data.message || "Error fetching purchase orders",
//           data: error.response.data,
//         });
//       } else if (error.request) {
//         return rejectWithValue({ message: "No response received from server" });
//       } else {
//         return rejectWithValue({
//           message: error.message || "Failed to fetch purchase orders",
//         });
//       }
//     }
//   }
// );

// export const updatePurchaseOrder = createAsyncThunk(
//   "purchaseOrders/updatePurchaseOrder",
//   async ({ id, purchaseOrderData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(
//         `${BASE_URL}/${id}`,
//         purchaseOrderData
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error updating purchase order"
//       );
//     }
//   }
// );

// export const voidPurchaseOrder = createAsyncThunk(
//   "purchaseOrders/voidPurchaseOrder",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(`${BASE_URL}/${id}/void`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error voiding purchase order"
//       );
//     }
//   }
// );

// const initialState = {
//   purchaseOrders: [],
//   status: "idle",
//   error: null,
// };

// const purchaseOrdersSlice = createSlice({
//   name: "purchaseOrders",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // .addCase(fetchPurchaseOrders.pending, (state) => {
//       //   state.status = "loading";
//       // })
//       // .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
//       //   state.status = "succeeded";
//       //   state.purchaseOrders = action.payload.data;
//       // })
//       // .addCase(fetchPurchaseOrders.rejected, (state, action) => {
//       //   state.status = "failed";
//       //   state.error = action.payload;
//       // })
//       .addCase(fetchPurchaseOrders.pending, (state) => {
//         state.status = "loading";
//         state.error = null; // Clear previous errors
//       })
//       .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.purchaseOrders = action.payload.data; // Access the .data property
//         state.error = null;
//       })
//       .addCase(fetchPurchaseOrders.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload; // Store the detailed error
//       })
//       .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
//         const updatedOrder = action.payload.data;
//         const index = state.purchaseOrders.findIndex(
//           (order) => order._id === updatedOrder._id
//         );
//         if (index !== -1) {
//           state.purchaseOrders[index] = updatedOrder;
//         }
//       })
//       .addCase(voidPurchaseOrder.fulfilled, (state, action) => {
//         const voidedOrder = action.payload.data;
//         const index = state.purchaseOrders.findIndex(
//           (order) => order._id === voidedOrder._id
//         );
//         if (index !== -1) {
//           state.purchaseOrders[index] = voidedOrder;
//         }
//       });
//   },
// });

// export default purchaseOrdersSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/purchaseorders";

// --- Async Thunks ---
export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error)); // Use helper function
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  "purchaseOrders/updatePurchaseOrder",
  async ({ id, purchaseOrderData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${id}`,
        purchaseOrderData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const voidPurchaseOrder = createAsyncThunk(
  "purchaseOrders/voidPurchaseOrder",
  async (id, { rejectWithValue }) => {
    try {
      // Use the correct endpoint: /purchaseorders/:id/void (PUT request)
      const response = await apiClient.put(`${BASE_URL}/${id}/void`);
      return { id }; // Return the ID of the voided order
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// --- Helper Function for Error Handling (DRY Principle) ---
const handleApiError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || "An API error occurred",
      data: error.response.data, // Optional: Include full response data for debugging
    };
  } else if (error.request) {
    return { message: "No response received from the server" };
  } else {
    return { message: error.message || "An unexpected error occurred" };
  }
};

// --- Initial State ---
const initialState = {
  purchaseOrders: [],
  status: "idle",
  error: null,
};

// --- Redux Slice ---
const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchPurchaseOrders ---
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchaseOrders = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- updatePurchaseOrder ---
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedOrder = action.payload.data;
        const index = state.purchaseOrders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.purchaseOrders[index] = updatedOrder;
        }
        state.error = null;
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // --- voidPurchaseOrder ---
      .addCase(voidPurchaseOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(voidPurchaseOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.purchaseOrders = state.purchaseOrders.filter(
          (order) => order._id !== action.payload.id // Filter out by ID
        );
        state.error = null;
      })
      .addCase(voidPurchaseOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default purchaseOrdersSlice.reducer;
