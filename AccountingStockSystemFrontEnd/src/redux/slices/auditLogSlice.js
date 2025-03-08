import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/auditlogs";

// Async thunks for CRUD operations
// export const fetchAuditLogs = createAsyncThunk(
//   "auditlogs/fetchAuditLogs",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(BASE_URL);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Error fetching audit logs"
//       );
//     }
//   }
// );
export const fetchAuditLogs = createAsyncThunk(
  "auditlogs/fetchAuditLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data; // Ensure you're returning response.data
    } catch (error) {
      // More detailed error handling
      return rejectWithValue({
        message: error.response?.data?.message || "Error fetching audit logs",
        status: error.response?.status,
      });
    }
  }
);

export const deleteAuditLog = createAsyncThunk(
  "auditlogs/deleteAuditLog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error deleting audit log"
      );
    }
  }
);

const initialState = {
  auditLogs: [],
  status: "idle",
  error: null,
};

const auditLogsSlice = createSlice({
  name: "auditlogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.auditLogs = action.payload.data;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAuditLog.fulfilled, (state, action) => {
        state.auditLogs = state.auditLogs.filter(
          (log) => log._id !== action.payload.data._id
        );
      });
  },
});

export default auditLogsSlice.reducer;
