// alertsSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
// const BASE_URL = `${API_BASE_URL}/api/alerts`;

// // Helper function to get config (for authenticated requests)
// const getConfig = () => {
//   const token = localStorage.getItem("accessToken"); //  Use a more descriptive key
//   return {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : undefined, //  Conditional
//     },
//   };
// };

// // Async thunk for marking an alert as read.
// export const markAlertAsRead = createAsyncThunk(
//   "alerts/markAlertAsRead",
//   async (id, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.patch(
//         `${BASE_URL}/${id}`,
//         { read: true },
//         config
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error marking alert as read"
//       );
//     }
//   }
// );

// // Async Thunk to fetch ALL alerts.
// export const fetchAlerts = createAsyncThunk(
//   "alerts/fetchAlerts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.get(`${BASE_URL}`, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error Fetching alert");
//     }
//   }
// );
// // Async thunks for CRUD operations
// export const createAlert = createAsyncThunk(
//   "alerts/createAlert",
//   async (alertData, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.post(BASE_URL, alertData, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error creating alert");
//     }
//   }
// );

// export const updateAlert = createAsyncThunk(
//   "alerts/updateAlert",
//   async ({ id, alertData }, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.patch(
//         `${BASE_URL}/${id}`,
//         alertData,
//         config
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error updating alert");
//     }
//   }
// );

// export const deleteAlert = createAsyncThunk(
//   "alerts/deleteAlert",
//   async (id, { rejectWithValue }) => {
//     try {
//       const config = getConfig();
//       const response = await axios.delete(`${BASE_URL}/${id}`, config);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error Deleting alert");
//     }
//   }
// );

// const initialState = {
//   alerts: [],
//   status: "idle",
//   error: null,
// };

// const alertsSlice = createSlice({
//   name: "alerts",
//   initialState,
//   reducers: {
//     addNewAlert: (state, action) => {
//       const existingIndex = state.alerts.findIndex(
//         (alert) => alert._id === action.payload._id
//       );
//       if (existingIndex === -1) {
//         state.alerts.unshift(action.payload);
//       }
//     },
//     updateExistingAlert: (state, action) => {
//       const updatedAlert = action.payload;
//       const index = state.alerts.findIndex((a) => a._id === updatedAlert._id);
//       if (index !== -1) {
//         state.alerts[index] = updatedAlert;
//       }
//     },
//     // Add a logout action
//     clearAlerts: (state) => {
//       state.alerts = [];
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(markAlertAsRead.fulfilled, (state, action) => {
//         const updatedAlertId = action.payload.data._id;
//         const index = state.alerts.findIndex((a) => a._id === updatedAlertId);
//         if (index !== -1) {
//           state.alerts[index].read = true;
//         }
//       })
//       .addCase(fetchAlerts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchAlerts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.alerts = action.payload.data;
//       })
//       .addCase(fetchAlerts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(createAlert.fulfilled, (state, action) => {
//         state.alerts.push(action.payload.data);
//       })
//       .addCase(updateAlert.fulfilled, (state, action) => {
//         const updatedAlert = action.payload.data;
//         const index = state.alerts.findIndex((a) => a._id === updatedAlert._id);
//         if (index !== -1) {
//           state.alerts[index] = updatedAlert;
//         }
//       })
//       .addCase(deleteAlert.fulfilled, (state, action) => {
//         state.alerts = state.alerts.filter(
//           (alert) => alert._id !== action.payload.data._id
//         );
//       });
//   },
// });

// export const { addNewAlert, updateExistingAlert, clearAlerts } =
//   alertsSlice.actions; // Export actions
// export default alertsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";
// Import apiClient from authSlice (adjust path)

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const BASE_URL = `${API_BASE_URL}/api/alerts`;

// Async thunk for marking an alert as read
export const markAlertAsRead = createAsyncThunk(
  "alerts/markAlertAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/${id}`, {
        read: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error marking alert as read"
      );
    }
  }
);

// Async thunk to fetch all alerts
export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching alerts");
    }
  }
);

// Async thunks for CRUD operations
export const createAlert = createAsyncThunk(
  "alerts/createAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, alertData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating alert");
    }
  }
);

export const updateAlert = createAsyncThunk(
  "alerts/updateAlert",
  async ({ id, alertData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/${id}`, alertData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating alert");
    }
  }
);

export const deleteAlert = createAsyncThunk(
  "alerts/deleteAlert",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting alert");
    }
  }
);

const initialState = {
  alerts: [],
  status: "idle",
  error: null,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addNewAlert: (state, action) => {
      const existingIndex = state.alerts.findIndex(
        (alert) => alert._id === action.payload._id
      );
      if (existingIndex === -1) {
        state.alerts.unshift(action.payload);
      }
    },
    updateExistingAlert: (state, action) => {
      const updatedAlert = action.payload;
      const index = state.alerts.findIndex((a) => a._id === updatedAlert._id);
      if (index !== -1) {
        state.alerts[index] = updatedAlert;
      }
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        const updatedAlertId = action.payload.data._id;
        const index = state.alerts.findIndex((a) => a._id === updatedAlertId);
        if (index !== -1) {
          state.alerts[index].read = true;
        }
      })
      .addCase(fetchAlerts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.alerts = action.payload.data;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload.data);
      })
      .addCase(updateAlert.fulfilled, (state, action) => {
        const updatedAlert = action.payload.data;
        const index = state.alerts.findIndex((a) => a._id === updatedAlert._id);
        if (index !== -1) {
          state.alerts[index] = updatedAlert;
        }
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter(
          (alert) => alert._id !== action.payload.data._id
        );
      });
  },
});

export const { addNewAlert, updateExistingAlert, clearAlerts } =
  alertsSlice.actions;
export default alertsSlice.reducer;
