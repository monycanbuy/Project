import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

// Base URL for the API
const API_URL = "/dishes";

// Thunk for fetching all dishes
export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data; // Assuming response.data is an array of dishes
    } catch (error) {
      console.error("Error fetching dishes:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching dishes"
      );
    }
  }
);

// Thunk for creating a new dish
export const createDish = createAsyncThunk(
  "dishes/createDish",
  async (dishData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_URL, dishData);
      return response.data.dish; // Assuming response.data.dish contains the created dish
    } catch (error) {
      console.error("Error adding dish:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error adding dish"
      );
    }
  }
);

// Thunk for updating an existing dish
export const updateDish = createAsyncThunk(
  "dishes/updateDish",
  async ({ dishId, dishData }, { rejectWithValue }) => {
    try {
      console.log("Inside updateDish thunk - dishId:", dishId); // Log 1: Check dishId
      console.log("Inside updateDish thunk - dishData:", dishData);
      const response = await apiClient.put(`${API_URL}/${dishId}`, dishData);
      console.log("Inside updateDish thunk - response.data:", response.data); // Log 3: Check API response
      return response.data.dish; // Assuming response.data.dish contains the updated dish
    } catch (error) {
      console.error("Error updating dish:", error);
      console.error("Inside updateDish thunk - Error:", error); // Log 4: Detailed error inside thunk
      console.error(
        "Inside updateDish thunk - Error Response Data:",
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.message || "Error updating dish"
      );
    }
  }
);

// Thunk for deleting a dish
export const deleteDish = createAsyncThunk(
  "dishes/deleteDish",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return id; // Return the id of the deleted dish
    } catch (error) {
      console.error("Error deleting dish:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error deleting dish"
      );
    }
  }
);

const dishesSlice = createSlice({
  name: "dishes",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addDishOptimistically: (state, action) => {
      state.items.push(action.payload);
    },
    updateDishOptimistically: (state, action) => {
      const index = state.items.findIndex(
        (dish) => dish._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dishes
      .addCase(fetchDishes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Array of dishes
        state.error = null;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create Dish
      .addCase(createDish.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
        state.error = null; // Clear any previous error
      })
      .addCase(createDish.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Dish
      .addCase(updateDish.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (dish) => dish._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete Dish
      .addCase(deleteDish.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((dish) => dish._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteDish.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// export const { addDishOptimistically, updateDishOptimistically } =
//   dishesSlice.actions;
export const selectDishes = createSelector(
  [(state) => state.dishes.items],
  (items) => items
);

export default dishesSlice.reducer;
