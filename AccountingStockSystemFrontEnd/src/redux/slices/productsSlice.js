import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/products";

// Async thunks for CRUD operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      // Convert isPerishable to boolean explicitly
      const dataToSend = {
        ...productData,
        isPerishable: Boolean(productData.isPerishable),
      };
      const response = await apiClient.post(BASE_URL, dataToSend);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      // Convert isPerishable to boolean explicitly
      const dataToSend = {
        ...productData,
        isPerishable: Boolean(productData.isPerishable),
      };
      const response = await apiClient.put(`${BASE_URL}/${id}`, dataToSend);
      // Here, ensure `data` indeed contains just IDs for category and supplier
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    console.log("Deleting product with ID:", id);
    if (!id) {
      return rejectWithValue("Product ID is required");
    }

    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        return rejectWithValue(error.response.data || "Error deleting product");
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue("No response received from server");
      } else {
        // Something else happened while setting up the request
        return rejectWithValue(error.message || "Error deleting product");
      }
    }
  }
);

// Initial state
const initialState = {
  products: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.data;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
