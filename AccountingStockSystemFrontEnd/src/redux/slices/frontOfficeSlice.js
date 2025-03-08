import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";
// API Base URL
const BASE_URL = "/front-office-sales";

// Async Thunks

// Fetch all front office sales
export const fetchFrontOfficeSales = createAsyncThunk(
  "frontOffice/fetchFrontOfficeSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.sales;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch front office sales.",
        }
      );
    }
  }
);

// Add a new front office sale
export const createFrontOfficeSale = createAsyncThunk(
  "frontOffice/createFrontOfficeSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, saleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create front office sale.",
        }
      );
    }
  }
);

export const fetchFrontOfficeSaleById = createAsyncThunk(
  "frontOffice/fetchSaleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFrontOfficeSale = createAsyncThunk(
  "frontOffice/updateSale",
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      console.log("Updating sale:", { id, saleData });
      const response = await apiClient.put(`${BASE_URL}/${id}`, saleData);
      console.log("Update response:", response.data); //
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const frontOfficeSlice = createSlice({
  name: "frontOffice",
  initialState: {
    sales: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all sales
      .addCase(fetchFrontOfficeSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFrontOfficeSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(fetchFrontOfficeSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create a new sale
      .addCase(createFrontOfficeSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFrontOfficeSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales.push(action.payload);
      })
      .addCase(createFrontOfficeSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFrontOfficeSaleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFrontOfficeSaleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSale = action.payload;
      })
      .addCase(fetchFrontOfficeSaleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateFrontOfficeSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFrontOfficeSale.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSale = action.payload;
        const index = state.sales.findIndex(
          (sale) => sale._id === updatedSale._id
        );
        if (index !== -1) {
          state.sales[index] = updatedSale;
        }
      })
      .addCase(updateFrontOfficeSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default frontOfficeSlice.reducer;
