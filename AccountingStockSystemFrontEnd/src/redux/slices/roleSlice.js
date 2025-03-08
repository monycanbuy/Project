// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // // API Base URL
// // const BASE_URL = "http://localhost:8000/api/roles";

// // // Get config with Authorization header
// // const getConfig = () => {
// //   const token = localStorage.getItem("accessToken");
// //   if (!token) {
// //     throw new Error("No access token found");
// //   }
// //   return {
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //     },
// //   };
// // };

// // // Async Thunks

// // // Fetch all roles
// // export const fetchRoles = createAsyncThunk(
// //   "roles/fetchRoles",
// //   async (_, { rejectWithValue }) => {
// //     console.log("Fetching roles...");
// //     try {
// //       const config = getConfig();
// //       const response = await axios.get(BASE_URL, config);
// //       console.log("Roles fetched:", response.data.roles);
// //       return response.data.roles; // Assuming the response has a 'roles' field
// //     } catch (error) {
// //       console.error("Error fetching roles:", error);
// //       return rejectWithValue(
// //         error.response?.data || {
// //           message: "Failed to fetch roles.",
// //         }
// //       );
// //     }
// //   }
// // );

// // // Create a new role
// // export const createRole = createAsyncThunk(
// //   "roles/createRole",
// //   async (roleData, { rejectWithValue }) => {
// //     try {
// //       const config = getConfig();
// //       const response = await axios.post(BASE_URL, roleData, config);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data || {
// //           message: "Failed to create role.",
// //         }
// //       );
// //     }
// //   }
// // );

// // export const updateRole = createAsyncThunk(
// //   "roles/updateRole",
// //   async ({ roleId, roleData }, { rejectWithValue }) => {
// //     try {
// //       const config = getConfig();
// //       const response = await axios.patch(
// //         `${BASE_URL}/${roleId}`,
// //         roleData,
// //         config
// //       );
// //       return response.data.role; // Return the updated role
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data || {
// //           message: "Failed to update role.",
// //         }
// //       );
// //     }
// //   }
// // );

// // // Delete a role
// // export const deleteRole = createAsyncThunk(
// //   "roles/deleteRole",
// //   async (roleId, { rejectWithValue }) => {
// //     try {
// //       const config = getConfig();
// //       const response = await axios.delete(`${BASE_URL}/${roleId}`, config);
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data || {
// //           message: "Failed to delete role.",
// //         }
// //       );
// //     }
// //   }
// // );

// // // Slice
// // const roleSlice = createSlice({
// //   name: "roles",
// //   initialState: {
// //     list: [],
// //     status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // Fetch Roles
// //       .addCase(fetchRoles.pending, (state) => {
// //         state.status = "loading";
// //         state.error = null;
// //       })
// //       .addCase(fetchRoles.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.list = action.payload;
// //       })
// //       .addCase(fetchRoles.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       // Create Role
// //       .addCase(createRole.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(createRole.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.list.push(action.payload);
// //       })
// //       .addCase(createRole.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       // Update Role
// //       .addCase(updateRole.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(updateRole.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         const index = state.list.findIndex(
// //           (role) => role._id === action.payload._id
// //         );
// //         if (index !== -1) {
// //           state.list[index] = action.payload;
// //         }
// //       })
// //       .addCase(updateRole.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       // Delete Role
// //       .addCase(deleteRole.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(deleteRole.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.list = state.list.filter((role) => role._id !== action.meta.arg);
// //       })
// //       .addCase(deleteRole.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export default roleSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { apiClient } from "./authSlice"; // Adjust path if needed (e.g., "../slices/authSlice")

// const BASE_URL = "/roles";

// // Async Thunks
// export const fetchRoles = createAsyncThunk(
//   "roles/fetchRoles",
//   async (_, { rejectWithValue }) => {
//     console.log("Fetching roles...");
//     try {
//       const response = await apiClient.get(BASE_URL);
//       console.log("Roles fetched:", response.data.roles);
//       return response.data.roles; // Assuming the response has a 'roles' field
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to fetch roles" }
//       );
//     }
//   }
// );

// export const createRole = createAsyncThunk(
//   "roles/createRole",
//   async (roleData, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(BASE_URL, roleData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to create role" }
//       );
//     }
//   }
// );

// export const updateRole = createAsyncThunk(
//   "roles/updateRole",
//   async ({ roleId, roleData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(`${BASE_URL}/${roleId}`, roleData);
//       return response.data.role; // Return the updated role
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to update role" }
//       );
//     }
//   }
// );

// export const deleteRole = createAsyncThunk(
//   "roles/deleteRole",
//   async (roleId, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.delete(`${BASE_URL}/${roleId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to delete role" }
//       );
//     }
//   }
// );

// const roleSlice = createSlice({
//   name: "roles",
//   initialState: {
//     list: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRoles.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchRoles.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.list = action.payload;
//       })
//       .addCase(fetchRoles.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(createRole.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createRole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.list.push(action.payload);
//       })
//       .addCase(createRole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(updateRole.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(updateRole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.list.findIndex(
//           (role) => role._id === action.payload._id
//         );
//         if (index !== -1) state.list[index] = action.payload;
//       })
//       .addCase(updateRole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(deleteRole.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteRole.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.list = state.list.filter((role) => role._id !== action.meta.arg);
//       })
//       .addCase(deleteRole.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export default roleSlice.reducer;

// roleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./authSlice";

const BASE_URL = "/roles";
const PERMISSION_BASE_URL = "/permissions";

export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    console.log("Fetching roles...");
    try {
      const response = await apiClient.get(BASE_URL);
      console.log("Roles fetched:", response.data.roles);
      return response.data.roles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch roles" }
      );
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "roles/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(PERMISSION_BASE_URL);
      console.log("Permissions fetched:", response.data.permissions);
      return response.data.permissions;
    } catch (error) {
      console.error(
        "Error fetching permissions:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch permissions" }
      );
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ name, permissions }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(BASE_URL, { name, permissions });
      return response.data.role; // Adjust based on your API response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create role" }
      );
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ roleId, name, permissions }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${BASE_URL}/${roleId}`, {
        name,
        permissions,
      });
      return response.data.role;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update role" }
      );
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/${roleId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete role" }
      );
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    permissions: [],
    status: "idle",
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex(
          (role) => role._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((role) => role._id !== action.meta.arg);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
