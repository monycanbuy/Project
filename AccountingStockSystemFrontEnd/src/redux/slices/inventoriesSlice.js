import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/inventories";

// Helper function to get config with Authorization header
const getConfig = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined, // Include if authenticated
    },
  };
};

// --- Async Thunks for Reports ---

// Low Stock Report
export const fetchLowStockReport = createAsyncThunk(
  "inventories/fetchLowStockReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/reports/low-stock`);
      return response.data.data; // Expects { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching low stock report"
      );
    }
  }
);

// Inventory Value by Category Report
export const fetchInventoryValueByCategory = createAsyncThunk(
  "inventories/fetchInventoryValueByCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/reports/value-by-category`
      );
      return response.data.data; // Expects { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching inventory value by category"
      );
    }
  }
);

// Near Expiry Report
export const fetchNearExpiryReport = createAsyncThunk(
  "inventories/fetchNearExpiryReport",
  async (days, { rejectWithValue }) => {
    // Accepts 'days' as an argument
    try {
      const response = await apiClient.get(
        `${BASE_URL}/reports/near-expiry?days=${days}`
      ); // Include 'days' in the URL
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching near expiry report"
      );
    }
  }
);

// Inventory by location
export const fetchInventoryByLocation = createAsyncThunk(
  "inventories/fetchInventoryByLocation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/reports/inventory-by-location`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching inventory by location"
      );
    }
  }
);

// Get total inventory count
export const fetchTotalInventoryCount = createAsyncThunk(
  "inventories/fetchTotalInventoryCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/reports/total-count`);
      return response.data.data.count; // Return just the count
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching total count"
      );
    }
  }
);

// Get total inventory value
export const fetchTotalInventoryValue = createAsyncThunk(
  "inventories/fetchTotalInventoryValue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/reports/total-value`);
      return response.data.data.totalValue; // Return just the value
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching total value"
      );
    }
  }
);

// Thunk for total inventory and sales
export const fetchTotalInventoryAndSales = createAsyncThunk(
  "inventories/fetchTotalInventoryAndSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/reports/total-inventory-sales`
      );
      return response.data.data; // Expects { success: true, data: { totalValue, totalDailySales } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching total inventory and sales"
      );
    }
  }
);

// Thunk for total daily sales (Flexible Date Range)
export const fetchTotalDailySales = createAsyncThunk(
  "inventories/fetchTotalDailySales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/reports/total-daily-sales`
      );
      return response.data.data.totalDailySales; // Return just the NUMBER
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching daily sales"
      );
    }
  }
);

// Get total sales
export const fetchTotalSales = createAsyncThunk(
  "inventories/fetchTotalSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/reports/total-sales`);
      return response.data.data.totalSales; // Return just the NUMBER
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching total sales"
      );
    }
  }
);

// New Thunk for Flexible Daily Sales (Latest Method)
export const fetchDailySales = createAsyncThunk(
  "inventories/fetchDailySales",
  async (dateRange = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (dateRange.startDate) params.append("startDate", dateRange.startDate);
      if (dateRange.endDate) params.append("endDate", dateRange.endDate);

      const response = await apiClient.get(
        `${BASE_URL}/reports/daily-sales?${params.toString()}`
      );
      return response.data.data; // Expects array of { date, totalSales }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching daily sales"
      );
    }
  }
);
// New Thunk for Top Selling Items
export const fetchTopSellingItems = createAsyncThunk(
  "inventories/fetchTopSellingItems",
  async (options = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append("limit", options.limit); // Optional limit param
      const response = await apiClient.get(
        `${BASE_URL}/reports/top-selling-items?${params.toString()}`
      );
      return response.data.data; // Array of top items
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching top selling items"
      );
    }
  }
);

// --- Existing Thunks (Keep these) ---
export const fetchInventories = createAsyncThunk(
  "inventories/fetchInventories",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(); // Use URLSearchParams for easier query param building

      // Add filtering parameters dynamically
      for (const key in filters) {
        if (
          filters.hasOwnProperty(key) &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          if (Array.isArray(filters[key])) {
            // Handle array parameters (like locationName)
            filters[key].forEach((value) => params.append(key, value));
          } else {
            params.append(key, filters[key]);
          }
        }
      }

      const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
      return response.data; // Expects { success: true, data: [], pagination: {} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching inventories"
      );
    }
  }
);

export const createInventory = createAsyncThunk(
  "inventories/createInventory",
  async (inventoryData, { rejectWithValue }) => {
    try {
      // No need to set Content-Type: multipart/form-data; axios handles it
      const response = await apiClient.post(BASE_URL, inventoryData);
      return response.data.data; // Expects { success: true, data: {} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating inventory"
      );
    }
  }
);

// Update Inventory
export const updateInventory = createAsyncThunk(
  "inventories/updateInventory",
  async ({ id, inventoryData }, { rejectWithValue }) => {
    try {
      // No need to set Content-Type: multipart/form-data; axios handles it.
      const response = await apiClient.put(`${BASE_URL}/${id}`, inventoryData); // Use PATCH
      return response.data.data; // Expects { success: true, data: {} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating inventory"
      );
    }
  }
);

// Delete Inventory
export const deleteInventory = createAsyncThunk(
  "inventories/deleteInventory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return { _id: id }; // Return the ID of the deleted item, for easier state update
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting inventory"
      );
    }
  }
);

// --- Initial State ---

const initialState = {
  inventories: [], // Your main inventory list
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    // Keep pagination state
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  lowStockReport: [],
  lowStockReportStatus: "idle",
  lowStockReportError: null,
  inventoryValueByCategory: [],
  inventoryValueByCategoryStatus: "idle",
  inventoryValueByCategoryError: null,
  nearExpiryReport: [],
  nearExpiryReportStatus: "idle",
  nearExpiryReportError: null,
  totalInventoryCount: 0,
  inventoryByLocation: [],
  totalInventoryCountStatus: "idle", // Added missing status
  totalInventoryCountError: null,
  totalInventoryValue: 0,
  inventoryByLocationStatus: "idle",
  inventoryByLocationError: null,
  totalDailySales: 0, // Single value for current day
  totalInventoryValueStatus: "idle", // Added missing status
  totalInventoryValueError: null,
  totalDailySalesStatus: "idle",
  totalDailySalesError: null,
  totalSales: 0,
  totalSalesStatus: "idle",
  totalSalesError: null,
  dailySales: [], // New field for array of daily sales
  dailySalesStatus: "idle", // New status for fetchDailySales
  dailySalesError: null, // New error field for fetchDailySales
  topSellingItems: [], // New field for top selling items
  topSellingItemsStatus: "idle", // New status
  topSellingItemsError: null, // New error field
};

// --- Reducers (and extraReducers) ---

const inventoriesSlice = createSlice({
  name: "inventories",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed, e.g., for clearing errors:
    clearInventoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Inventories ---
      .addCase(fetchInventories.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventories = action.payload.data; // Update the inventory list
        state.pagination = action.payload.pagination; // Update pagination
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store the error message
      })

      // --- Create Inventory ---
      .addCase(createInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventories.push(action.payload); // Add the new inventory item
      })
      .addCase(createInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Update Inventory ---
      .addCase(updateInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedInventory = action.payload;
        const index = state.inventories.findIndex(
          (item) => item._id === updatedInventory._id
        );
        if (index !== -1) {
          state.inventories[index] = updatedInventory; // Replace the updated item
        }
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Delete Inventory ---
      .addCase(deleteInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inventories = state.inventories.filter(
          (item) => item._id !== action.payload._id // Remove by ID
        );
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Low Stock Report ---
      .addCase(fetchLowStockReport.pending, (state) => {
        state.lowStockReportStatus = "loading";
        state.lowStockReportError = null;
      })
      .addCase(fetchLowStockReport.fulfilled, (state, action) => {
        state.lowStockReportStatus = "succeeded";
        state.lowStockReport = action.payload; // Store report data
      })
      .addCase(fetchLowStockReport.rejected, (state, action) => {
        state.lowStockReportStatus = "failed";
        state.lowStockReportError = action.payload;
      })

      // --- Inventory Value by Category Report ---
      .addCase(fetchInventoryValueByCategory.pending, (state) => {
        state.inventoryValueByCategoryStatus = "loading";
        state.inventoryValueByCategoryError = null;
      })
      .addCase(fetchInventoryValueByCategory.fulfilled, (state, action) => {
        state.inventoryValueByCategoryStatus = "succeeded";
        state.inventoryValueByCategory = action.payload;
      })
      .addCase(fetchInventoryValueByCategory.rejected, (state, action) => {
        state.inventoryValueByCategoryStatus = "failed";
        state.inventoryValueByCategoryError = action.payload;
      })

      // --- Near Expiry Report ---
      .addCase(fetchNearExpiryReport.pending, (state) => {
        state.nearExpiryReportStatus = "loading";
        state.nearExpiryReportError = null;
      })
      .addCase(fetchNearExpiryReport.fulfilled, (state, action) => {
        state.nearExpiryReportStatus = "succeeded";
        state.nearExpiryReport = action.payload;
      })
      .addCase(fetchNearExpiryReport.rejected, (state, action) => {
        state.nearExpiryReportStatus = "failed";
        state.nearExpiryReportError = action.payload;
      })

      // --- Inventory By Location ---
      .addCase(fetchInventoryByLocation.pending, (state) => {
        state.inventoryByLocationStatus = "loading";
        state.inventoryByLocationError = null;
      })
      .addCase(fetchInventoryByLocation.fulfilled, (state, action) => {
        state.inventoryByLocationStatus = "succeeded";
        state.inventoryByLocation = action.payload;
      })
      .addCase(fetchInventoryByLocation.rejected, (state, action) => {
        state.inventoryByLocationStatus = "failed";
        state.inventoryByLocationError = action.payload;
      })

      // --- Total Inventory Count ---
      .addCase(fetchTotalInventoryCount.pending, (state) => {
        state.totalInventoryCountStatus = "loading";
        state.totalInventoryCountError = null;
      })
      .addCase(fetchTotalInventoryCount.fulfilled, (state, action) => {
        state.totalInventoryCountStatus = "succeeded";
        state.totalInventoryCount = action.payload; // Just a number
      })
      .addCase(fetchTotalInventoryCount.rejected, (state, action) => {
        state.totalInventoryCountStatus = "failed";
        state.totalInventoryCountError = action.payload;
      })

      // --- Total Inventory Value ---
      .addCase(fetchTotalInventoryValue.pending, (state) => {
        state.totalInventoryValueStatus = "loading";
        state.totalInventoryValueError = null;
      })
      .addCase(fetchTotalInventoryValue.fulfilled, (state, action) => {
        state.totalInventoryValueStatus = "succeeded";
        state.totalInventoryValue = action.payload; // Just a number
      })
      .addCase(fetchTotalInventoryValue.rejected, (state, action) => {
        state.totalInventoryValueStatus = "failed";
        state.totalInventoryValueError = action.payload;
      })

      // --- Total Inventory and Sales ---
      .addCase(fetchTotalInventoryAndSales.pending, (state) => {
        state.totalInventoryValueStatus = "loading"; // Use same loading state
        state.totalDailySalesStatus = "loading";
        state.totalInventoryValueError = null; // Clear previous errors
        state.totalDailySalesError = null;
      })
      .addCase(fetchTotalInventoryAndSales.fulfilled, (state, action) => {
        state.totalInventoryValueStatus = "succeeded";
        state.totalDailySalesStatus = "succeeded";
        state.totalInventoryValue = action.payload.totalValue;
        state.totalDailySales = action.payload.totalDailySales;
      })
      .addCase(fetchTotalInventoryAndSales.rejected, (state, action) => {
        state.totalInventoryValueStatus = "failed";
        state.totalDailySalesStatus = "failed";
        state.totalInventoryValueError = action.payload; // Store the error
        state.totalDailySalesError = action.payload;
      })

      // --- Total Daily Sales ---
      .addCase(fetchTotalDailySales.pending, (state) => {
        state.totalDailySalesStatus = "loading";
        state.totalDailySalesError = null;
      })
      .addCase(fetchTotalDailySales.fulfilled, (state, action) => {
        state.totalDailySalesStatus = "succeeded";
        state.totalDailySales = action.payload; // Now a single value
      })
      .addCase(fetchTotalDailySales.rejected, (state, action) => {
        state.totalDailySalesStatus = "failed";
        state.totalDailySalesError = action.payload; // Store the error message
      })

      // --- Total Sales ---
      .addCase(fetchTotalSales.pending, (state) => {
        state.totalSalesStatus = "loading";
        state.totalSalesError = null;
      })
      .addCase(fetchTotalSales.fulfilled, (state, action) => {
        state.totalSalesStatus = "succeeded";
        state.totalSales = action.payload; // Now a single value
      })
      .addCase(fetchTotalSales.rejected, (state, action) => {
        state.totalSalesStatus = "failed";
        state.totalSalesError = action.payload; // Store the error message
      })
      // --- New Thunk: Fetch Daily Sales ---
      .addCase(fetchDailySales.pending, (state) => {
        state.dailySalesStatus = "loading";
        state.dailySalesError = null;
      })
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.dailySalesStatus = "succeeded";
        state.dailySales = action.payload; // Array of { date, totalSales }
      })
      .addCase(fetchDailySales.rejected, (state, action) => {
        state.dailySalesStatus = "failed";
        state.dailySalesError = action.payload;
      })
      // --- Top Selling Items ---
      .addCase(fetchTopSellingItems.pending, (state) => {
        state.topSellingItemsStatus = "loading";
        state.topSellingItemsError = null;
      })
      .addCase(fetchTopSellingItems.fulfilled, (state, action) => {
        state.topSellingItemsStatus = "succeeded";
        state.topSellingItems = action.payload;
      })
      .addCase(fetchTopSellingItems.rejected, (state, action) => {
        state.topSellingItemsStatus = "failed";
        state.topSellingItemsError = action.payload;
      });
  },
});

export const { clearInventoryError } = inventoriesSlice.actions;
export default inventoriesSlice.reducer;
