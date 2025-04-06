import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const EXPENSE_CATEGORY_URL = "/expense-categories";

// Async Thunks
export const fetchExpenseCategories = createAsyncThunk(
  "expenseCategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(EXPENSE_CATEGORY_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch expense categories",
        }
      );
    }
  }
);

export const createExpenseCategory = createAsyncThunk(
  "expenseCategories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(EXPENSE_CATEGORY_URL, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create expense category" }
      );
    }
  }
);

export const updateExpenseCategory = createAsyncThunk(
  "expenseCategories/update",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${EXPENSE_CATEGORY_URL}/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update expense category" }
      );
    }
  }
);

export const deleteExpenseCategory = createAsyncThunk(
  "expenseCategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${EXPENSE_CATEGORY_URL}/${id}`);
      return { id, ...response.data }; // Include id in response for easier state update
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete expense category" }
      );
    }
  }
);

// Initial State
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// Slice
const expenseCategorySlice = createSlice({
  name: "expenseCategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data; // Assuming API returns { success, message, data }
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Create
    builder
      .addCase(createExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpenseCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.data); // Add new category to list
      })
      .addCase(createExpenseCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Update
    builder
      .addCase(updateExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpenseCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.data;
        const index = state.categories.findIndex(
          (cat) => cat._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory; // Update existing category
        }
      })
      .addCase(updateExpenseCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

    // Delete
    builder
      .addCase(deleteExpenseCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpenseCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload.id // Remove deleted category
        );
      })
      .addCase(deleteExpenseCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// Actions
export const { clearError } = expenseCategorySlice.actions;

// Reducer
export default expenseCategorySlice.reducer;
