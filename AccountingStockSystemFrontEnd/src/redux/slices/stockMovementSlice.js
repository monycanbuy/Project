// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice";

// const BASE_URL = "/stockmovements";

// // Async thunks for CRUD operations
// export const fetchStockMovements = createAsyncThunk(
//   "stockMovements/fetchStockMovements",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(BASE_URL);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error fetching stock movements"
//       );
//     }
//   }
// );

// export const createStockMovement = createAsyncThunk(
//   "stockMovements/createStockMovement",
//   async (stockMovementData, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(BASE_URL, stockMovementData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error creating stock movement"
//       );
//     }
//   }
// );

// export const updateStockMovement = createAsyncThunk(
//   "stockMovements/updateStockMovement",
//   async ({ id, stockMovementData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(
//         `${BASE_URL}/${id}`,
//         stockMovementData
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error updating stock movement"
//       );
//     }
//   }
// );

// export const deleteStockMovement = createAsyncThunk(
//   "stockMovements/deleteStockMovement",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.delete(`${BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error deleting stock movement"
//       );
//     }
//   }
// );

// const initialState = {
//   stockMovements: [],
//   status: "idle",
//   error: null,
// };

// const stockMovementsSlice = createSlice({
//   name: "stockMovements",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStockMovements.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchStockMovements.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.stockMovements = action.payload.data;
//       })
//       .addCase(fetchStockMovements.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(createStockMovement.fulfilled, (state, action) => {
//         state.stockMovements.push(action.payload.data);
//       })
//       .addCase(updateStockMovement.fulfilled, (state, action) => {
//         const updatedMovement = action.payload.data;
//         const index = state.stockMovements.findIndex(
//           (a) => a._id === updatedMovement._id
//         );
//         if (index !== -1) {
//           state.stockMovements[index] = updatedMovement;
//         }
//       })
//       .addCase(deleteStockMovement.fulfilled, (state, action) => {
//         state.stockMovements = state.stockMovements.filter(
//           (movement) => movement._id !== action.payload.data._id
//         );
//       });
//   },
// });

// export default stockMovementsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/stockmovements";

// Async thunks for CRUD operations
export const fetchStockMovements = createAsyncThunk(
  "stockMovements/fetchStockMovements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      // IMPROVED ERROR HANDLING:
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Error fetching stock movements",
          data: error.response.data, // Include full response data
        });
      } else if (error.request) {
        return rejectWithValue({
          message: "No response received from server",
        });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to fetch stock movements",
        });
      }
    }
  }
);

export const createStockMovement = createAsyncThunk(
  "stockMovements/createStockMovement",
  async (stockMovementData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, stockMovementData);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Error creating stock movement",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to create stock movement",
        });
      }
    }
  }
);

export const updateStockMovement = createAsyncThunk(
  "stockMovements/updateStockMovement",
  async ({ id, stockMovementData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${id}`,
        stockMovementData
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Error updating stock movement",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to update stock movement",
        });
      }
    }
  }
);

export const deleteStockMovement = createAsyncThunk(
  "stockMovements/deleteStockMovement",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return { id }; // Return the ID for removal
    } catch (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Error deleting stock movement",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to delete stock movement",
        });
      }
    }
  }
);
const initialState = {
  stockMovements: [],
  status: "idle",
  error: null,
};

const stockMovementsSlice = createSlice({
  name: "stockMovements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockMovements = action.payload.data; // Access data property
        state.error = null;
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store the detailed error
      })
      .addCase(createStockMovement.fulfilled, (state, action) => {
        state.stockMovements.push(action.payload.data); //Access data
      })
      .addCase(updateStockMovement.fulfilled, (state, action) => {
        const updatedMovement = action.payload.data; //Access data
        const index = state.stockMovements.findIndex(
          (a) => a._id === updatedMovement._id
        );
        if (index !== -1) {
          state.stockMovements[index] = updatedMovement;
        }
      })
      .addCase(deleteStockMovement.pending, (state) => {
        state.status = "loading"; // Set loading state on delete
      })
      .addCase(deleteStockMovement.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockMovements = state.stockMovements.filter(
          (movement) => movement._id !== action.payload.id // Use the returned ID
        );
      })
      .addCase(deleteStockMovement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error on delete failure
      });
  },
});

export default stockMovementsSlice.reducer;
