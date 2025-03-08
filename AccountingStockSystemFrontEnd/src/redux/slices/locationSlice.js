import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const LOCATIONS_URL = "/locations";

// Async thunk to fetch locations
export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(LOCATIONS_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to create a new location
export const createLocation = createAsyncThunk(
  "locations/createLocation",
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(LOCATIONS_URL, locationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update a location
export const updateLocation = createAsyncThunk(
  "locations/updateLocation",
  async ({ id, locationData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${LOCATIONS_URL}/${id}`,
        locationData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a location
export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${LOCATIONS_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    locations: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex(
          (location) => location._id === action.payload._id
        );
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(
          (location) => location._id !== action.payload
        );
      });
  },
});

export default locationSlice.reducer;
