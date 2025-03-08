// hallTypesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

// API Base URL
const BASE_URL = "/hall-types";

// Async Thunks

// Fetch all hall types
export const fetchHallTypes = createAsyncThunk(
  "hallTypes/fetchHallTypes",
  async (_, { rejectWithValue }) => {
    console.log("Fetching hall types...");
    try {
      const response = await apiClient.get(BASE_URL);
      console.log("Hall types fetched:", response.data.halls); // Changed to 'halls'
      return response.data.halls; // Return 'halls' instead of 'hallTypes'
    } catch (error) {
      console.error("Error fetching hall types:", error);
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch hall types.",
        }
      );
    }
  }
);

// Create a new hall type
export const createHallType = createAsyncThunk(
  "hallTypes/createHallType",
  async (hallData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, hallData);
      return response.data.hall; // Assuming the response structure matches your API
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create hall type.",
        }
      );
    }
  }
);

export const updateHallType = createAsyncThunk(
  "hallTypes/updateHallType",
  async ({ hallId, hallData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${hallId}`, hallData);
      return response.data.hall; // Return the updated hall type
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update hall type.",
        }
      );
    }
  }
);

// Delete a hall type
export const deleteHallType = createAsyncThunk(
  "hallTypes/deleteHallType",
  async (hallId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${hallId}`);
      return hallId; // Return the ID of the deleted hall type for confirmation
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete hall type.",
        }
      );
    }
  }
);

// Slice
const hallTypesSlice = createSlice({
  name: "hallTypes",
  initialState: {
    list: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Hall Types
      .addCase(fetchHallTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHallTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchHallTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Hall Type
      .addCase(createHallType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHallType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(createHallType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Hall Type
      .addCase(updateHallType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateHallType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex(
          (hall) => hall._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateHallType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Hall Type
      .addCase(deleteHallType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteHallType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((hall) => hall._id !== action.meta.arg);
      })
      .addCase(deleteHallType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default hallTypesSlice.reducer;
