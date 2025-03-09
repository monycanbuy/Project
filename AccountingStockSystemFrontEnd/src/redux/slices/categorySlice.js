// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const CATEGORIES_URL = "http://localhost:8000/api/categories";

// const getConfig = () => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     throw new Error("No access token found");
//   }
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // Thunk for fetching all categories
// // In your categories slice, ensure you fetch categories:
// export const fetchCategories = createAsyncThunk(
//   "categories/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.get(CATEGORIES_URL, config);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching Category:", error);
//       return rejectWithValue(error.message || "Failed to fetch Category");
//     }
//   }
// );

// // Thunk for creating a new category
// export const createCategory = createAsyncThunk(
//   "categories/create",
//   async (categoryData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         CATEGORIES_URL,
//         categoryData,
//         getConfig()
//       );
//       return response.data.category;
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         return rejectWithValue(error.response.data.message); // Use the exact message from the server
//       }
//       return rejectWithValue(
//         error.message || "An error occurred while creating the category"
//       );
//     }
//   }
// );

// // Thunk for updating an existing category
// export const updateCategory = createAsyncThunk(
//   "categories/update",
//   async ({ categoryId, categoryData }, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.put(
//         `${CATEGORIES_URL}/${categoryId}`,
//         categoryData,
//         config
//       );
//       return response.data.category; // Assuming this is how the response is structured
//     } catch (error) {
//       console.error("Error updating category:", error);
//       return rejectWithValue(error.message || "Error updating category");
//     }
//   }
// );

// // Thunk for deleting a category
// export const deleteCategory = createAsyncThunk(
//   "categories/delete",
//   async (categoryId, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.delete(
//         `${CATEGORIES_URL}/${categoryId}`,
//         config
//       );
//       return categoryId; // Return the ID as confirmation of deletion
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       return rejectWithValue(error.message || "Error deleting category");
//     }
//   }
// );

// const categoriesSlice = createSlice({
//   name: "categories",
//   initialState: {
//     categories: [],
//     status: "idle",
//     error: null,
//     isLoading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(createCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(createCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories.push(action.payload);
//       })
//       .addCase(createCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         const index = state.categories.findIndex(
//           (category) => category._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.categories[index] = action.payload;
//         }
//       })
//       .addCase(updateCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories = state.categories.filter(
//           (category) => category._id !== action.payload
//         );
//       })
//       .addCase(deleteCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {} = categoriesSlice.actions;

// export default categoriesSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice";

// // Base URL for the API
// const CATEGORIES_URL = "/categories";

// // Thunk for fetching all categories
// // In your categories slice, ensure you fetch categories:
// export const fetchCategories = createAsyncThunk(
//   "categories/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(CATEGORIES_URL);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching Category:", error);
//       return rejectWithValue(error.message || "Failed to fetch Category");
//     }
//   }
// );

// // Thunk for creating a new category
// export const createCategory = createAsyncThunk(
//   "categories/create",
//   async (categoryData, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(CATEGORIES_URL, categoryData);
//       return response.data.category;
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         return rejectWithValue(error.response.data.message); // Use the exact message from the server
//       }
//       return rejectWithValue(
//         error.message || "An error occurred while creating the category"
//       );
//     }
//   }
// );

// // Thunk for updating an existing category
// export const updateCategory = createAsyncThunk(
//   "categories/update",
//   async ({ categoryId, categoryData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(
//         `${CATEGORIES_URL}/${categoryId}`,
//         categoryData
//       );
//       return response.data.category; // Assuming this is how the response is structured
//     } catch (error) {
//       console.error("Error updating category:", error);
//       return rejectWithValue(error.message || "Error updating category");
//     }
//   }
// );

// // Thunk for deleting a category
// export const deleteCategory = createAsyncThunk(
//   "categories/delete",
//   async (categoryId, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.delete(
//         `${CATEGORIES_URL}/${categoryId}`
//       );
//       return categoryId; // Return the ID as confirmation of deletion
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       return rejectWithValue(error.message || "Error deleting category");
//     }
//   }
// );

// const categoriesSlice = createSlice({
//   name: "categories",
//   initialState: {
//     categories: [],
//     status: "idle",
//     error: null,
//     isLoading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(createCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(createCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories.push(action.payload);
//       })
//       .addCase(createCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         const index = state.categories.findIndex(
//           (category) => category._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.categories[index] = action.payload;
//         }
//       })
//       .addCase(updateCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteCategory.pending, (state) => {
//         state.status = "loading";
//         state.isLoading = true;
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.isLoading = false;
//         state.categories = state.categories.filter(
//           (category) => category._id !== action.payload
//         );
//       })
//       .addCase(deleteCategory.rejected, (state, action) => {
//         state.status = "failed";
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {} = categoriesSlice.actions;

// export default categoriesSlice.reducer;

// categorySlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const CATEGORIES_URL = "/categories";

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log(
        "Fetching categories from:",
        apiClient.defaults.baseURL + CATEGORIES_URL
      );
      const response = await apiClient.get(CATEGORIES_URL);
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(CATEGORIES_URL, categoryData);
      return response.data.category;
    } catch (error) {
      console.error("Error creating category:", error); // Keep for console
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Server error creating category",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to create category",
        });
      }
    }
  }
);

// export const updateCategory = createAsyncThunk(
//   "categories/update",
//   async ({ categoryId, categoryData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(
//         `${CATEGORIES_URL}/${categoryId}`,
//         categoryData
//       );
//       return response.data.category;
//     } catch (error) {
//       console.error("Error updating category:", error); // Keep for console
//       if (error.response) {
//         return rejectWithValue({
//           status: error.response.status,
//           message:
//             error.response.data.message || "Server error updating category",
//           data: error.response.data,
//         });
//       } else if (error.request) {
//         return rejectWithValue({ message: "No response from server" });
//       } else {
//         return rejectWithValue({
//           message: error.message || "Failed to update category",
//         });
//       }
//     }
//   }
// );
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${CATEGORIES_URL}/${categoryId}`,
        categoryData
      );
      return response.data; // Return full { success, message, category }
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        return rejectWithValue(error.response.data); // Use server-provided error
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to update category",
        });
      }
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(
        `${CATEGORIES_URL}/${categoryId}`
      );
      return categoryId; // Return the ID as confirmation
    } catch (error) {
      console.error("Error deleting category:", error); // Keep for console
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message:
            error.response.data.message || "Server error deleting category",
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server" });
      } else {
        return rejectWithValue({
          message: error.message || "Failed to delete category",
        });
      }
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    status: "idle",
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        // Store the *detailed* error object:
        state.error = action.payload;
      })
      // ... (rest of your extraReducers, make sure to handle .rejected for other thunks similarly) ...
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        const updatedCategory = action.payload.category; // Extract category from payload
        const index = state.categories.findIndex(
          (category) => category._id === updatedCategory._id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload; // Payload is now { success, message }
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {} = categoriesSlice.actions; // You don't have any specific reducers, so this is empty

export default categoriesSlice.reducer;
