import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const BASE_URL = "/anotherunifiedsales"; // Your API base URL

// Async thunk for fetching sales
export const fetchAnotherUnifiedSales = createAsyncThunk(
  "anotherUnifiedSales/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "An error occurred while fetching sales"
      );
    }
  }
);

// Async thunk for creating a new sale
export const createAnotherUnifiedSale = createAsyncThunk(
  "anotherUnifiedSales/create",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`${BASE_URL}`, saleData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "An error occurred while creating the sale"
      );
    }
  }
);

export const updateAnotherUnifiedSale = createAsyncThunk(
  "anotherUnifiedSales/update",
  async ({ saleId, saleData }, { rejectWithValue }) => {
    // Receive saleId
    try {
      const response = await apiClient.put(
        `${BASE_URL}/${saleId}`, // Use saleId in the URL
        saleData
      );
      return response.data.sale; // Access the 'sale' property
    } catch (error) {
      return rejectWithValue(
        error.response.data || "An error occurred while updating the sale"
      );
    }
  }
);

export const voidAnotherUnifiedSale = createAsyncThunk(
  "anotherUnifiedSales/void",
  async (saleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `${BASE_URL}/${saleId}`, // Use saleId in the URL
        {} // Empty body for voiding
      );
      return response.data.sale; // Access the 'sale' property
    } catch (error) {
      return rejectWithValue(
        error.response.data || "An error occurred while voiding the sale"
      );
    }
  }
);

export const fetchAnotherUnifiedSalesSummary = createAsyncThunk(
  "anotherUnifiedSales/fetchSummary",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await apiClient.get(`${BASE_URL}/summary`, {
        params: params,
      });
      return response.data; // Directly return the data as it matches your expected structure
    } catch (error) {
      // Handle errors
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.message || "An error occurred while fetching sales summary",
      });
    }
  }
);

const anotherUnifiedSalesSlice = createSlice({
  name: "anotherUnifiedSales",
  initialState: {
    sales: [],
    summary: {
      totalSales: 0,
      totalDiscountCount: 0,
      totalDiscountSum: 0,
      restaurantSales: [],
      minimartSales: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching Sales
      .addCase(fetchAnotherUnifiedSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnotherUnifiedSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = action.payload;
        state.error = null;
      })
      .addCase(fetchAnotherUnifiedSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Creating Sale
      .addCase(createAnotherUnifiedSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAnotherUnifiedSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newSale = {
          ...action.payload,
          totalAmount: Number(action.payload.totalAmount.toFixed(2)),
        };
        state.sales.push(newSale);
        //state.sales.push(action.payload); // Assuming we want to add the new sale to our list
        state.error = null;
      })
      .addCase(createAnotherUnifiedSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Updating Sale
      .addCase(updateAnotherUnifiedSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAnotherUnifiedSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        // if (action.payload && action.payload._id) {
        //   const index = state.sales.findIndex(
        //     (sale) => sale._id === action.payload._id
        //   );
        //   if (index !== -1) {
        //     state.sales[index] = action.payload;
        //   } else {
        //     state.sales.push(action.payload);
        //   }
        // }
        const updatedSale = {
          ...action.payload,
          totalAmount: Number(action.payload.totalAmount.toFixed(2)),
        };
        const index = state.sales.findIndex((s) => s._id === updatedSale._id);
        if (index !== -1) {
          state.sales[index] = updatedSale;
        }
        state.error = null;
      })
      .addCase(updateAnotherUnifiedSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Voiding Sale
      .addCase(voidAnotherUnifiedSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidAnotherUnifiedSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.sales.findIndex(
          (sale) => sale._id === action.payload._id
        );
        if (index !== -1) {
          state.sales[index] = action.payload; // Update the sale in the array (isVoided will be true)
        }
        state.error = null;
      })
      .addCase(voidAnotherUnifiedSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAnotherUnifiedSalesSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnotherUnifiedSalesSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload; // Assuming payload matches the structure of your response
        state.error = null;
      })
      .addCase(fetchAnotherUnifiedSalesSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default anotherUnifiedSalesSlice.reducer;
