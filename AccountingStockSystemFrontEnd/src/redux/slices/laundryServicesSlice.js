import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient"; // Adjust path if needed (e.g., "../slices/authSlice")

const BASE_URL = "/laundry-services";
//const LAUNDRY_SERVICES_URL = "/api/laundry-services";

export const fetchLaundryServices = createAsyncThunk(
  "laundryServices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching laundry services:", error);
      return rejectWithValue(
        error.message || "Error fetching laundry services"
      );
    }
  }
);

export const addLaundryService = createAsyncThunk(
  "laundryServices/add",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, serviceData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding laundry service:", error);
      return rejectWithValue(error.message || "Error adding laundry service");
    }
  }
);

export const updateLaundryService = createAsyncThunk(
  "laundryServices/update",
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, {
        serviceType: serviceData.serviceType,
        price: serviceData.price, // Send only editable fields
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating laundry service"
      );
    }
  }
);

export const deleteLaundryService = createAsyncThunk(
  "laundryServices/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data || id; // Return server response or id if no response data
    } catch (error) {
      console.error("Error deleting laundry service:", error);
      return rejectWithValue(error.message || "Error deleting laundry service");
    }
  }
);

const laundryServicesSlice = createSlice({
  name: "laundryServices",
  initialState: {
    services: [],
    isLoadingServices: false,
    servicesError: null,
  },
  reducers: {
    // Sync actions if needed can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaundryServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLaundryServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchLaundryServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addLaundryService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateLaundryService.fulfilled, (state, action) => {
        const index = state.services.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.services[index] = action.payload;
      })
      .addCase(deleteLaundryService.fulfilled, (state, action) => {
        state.services = state.services.filter(
          (service) => service._id !== action.payload
        );
      });
  },
});

export const {} = laundryServicesSlice.actions;

export default laundryServicesSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice"; // Adjust path if needed (e.g., "../slices/authSlice")

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
// const BASE_URL = `${API_BASE_URL}/api/laundry-services`;
// //const LAUNDRY_SERVICES_URL = "/api/laundry-services"; // Relative path for Vite proxy

// export const fetchLaundryServices = createAsyncThunk(
//   "laundryServices/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(BASE_URL);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error fetching laundry services:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Error fetching laundry services"
//       );
//     }
//   }
// );

// export const addLaundryService = createAsyncThunk(
//   "laundryServices/add",
//   async (serviceData, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(BASE_URL, serviceData);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error adding laundry service:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Error adding laundry service"
//       );
//     }
//   }
// );

// export const updateLaundryService = createAsyncThunk(
//   "laundryServices/update",
//   async ({ id, serviceData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.put(`${BASE_URL}/${id}`, serviceData);
//       return response.data.data;
//     } catch (error) {
//       console.error("Error updating laundry service:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Error updating laundry service"
//       );
//     }
//   }
// );

// export const deleteLaundryService = createAsyncThunk(
//   "laundryServices/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.delete(`${BASE_URL}/${id}`);
//       return response.data?.data || id; // Return id if no data in response
//     } catch (error) {
//       console.error("Error deleting laundry service:", error);
//       return rejectWithValue(
//         error.response?.data?.message || "Error deleting laundry service"
//       );
//     }
//   }
// );

// const laundryServicesSlice = createSlice({
//   name: "laundryServices",
//   initialState: {
//     services: [],
//     status: "idle", // Updated to match your naming convention
//     error: null,
//   },
//   reducers: {
//     // Add sync actions if needed later
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Laundry Services
//       .addCase(fetchLaundryServices.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchLaundryServices.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.services = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchLaundryServices.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       // Add Laundry Service
//       .addCase(addLaundryService.fulfilled, (state, action) => {
//         state.services.push(action.payload);
//       })
//       // Update Laundry Service
//       .addCase(updateLaundryService.fulfilled, (state, action) => {
//         const index = state.services.findIndex(
//           (service) => service._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.services[index] = action.payload;
//         }
//       })
//       // Delete Laundry Service
//       .addCase(deleteLaundryService.fulfilled, (state, action) => {
//         state.services = state.services.filter(
//           (service) => service._id !== action.payload
//         );
//       });
//   },
// });

// export default laundryServicesSlice.reducer;
