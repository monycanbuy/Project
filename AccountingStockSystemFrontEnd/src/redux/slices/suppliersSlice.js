import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/suppliers";

// Async thunks for CRUD operations
export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching suppliers"
      );
    }
  }
);

export const createSupplier = createAsyncThunk(
  "suppliers/createSupplier",
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, supplierData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating supplier");
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/updateSupplier",
  async ({ id, supplierData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, supplierData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating supplier");
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/deleteSupplier",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting supplier");
    }
  }
);

// Initial state
const initialState = {
  suppliers: [],
  status: "idle",
  error: null,
};

// Suppliers slice
const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch suppliers
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create supplier
      .addCase(createSupplier.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers.push(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update supplier
      .addCase(updateSupplier.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.suppliers.findIndex(
          (supplier) => supplier._id === action.payload._id
        );
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers = state.suppliers.filter(
          (supplier) => supplier._id !== action.payload._id
        );
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default suppliersSlice.reducer;
