import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const PETTY_CASH_URL = "/petty-cashes";

// Thunks
export const fetchPettyCashes = createAsyncThunk(
  "pettyCash/fetchPettyCashes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(PETTY_CASH_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch petty cashes"
      );
    }
  }
);

export const createPettyCash = createAsyncThunk(
  "pettyCash/createPettyCash",
  async (pettyCashData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(PETTY_CASH_URL, pettyCashData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create petty cash"
      );
    }
  }
);

export const updatePettyCash = createAsyncThunk(
  "pettyCash/updatePettyCash",
  async ({ id, pettyCashData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `${PETTY_CASH_URL}/${id}`,
        pettyCashData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update petty cash"
      );
    }
  }
);

export const deletePettyCash = createAsyncThunk(
  "pettyCash/deletePettyCash",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${PETTY_CASH_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete petty cash"
      );
    }
  }
);

// export const addPettyCashTransaction = createAsyncThunk(
//   "pettyCash/addPettyCashTransaction",
//   async ({ id, transactionData }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(
//         `${PETTY_CASH_URL}/${id}/transactions`,
//         transactionData
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to add petty cash transaction"
//       );
//     }
//   }
// );
export const addPettyCashTransaction = createAsyncThunk(
  "pettyCash/addTransaction",
  async ({ id, transactionData }, { rejectWithValue }) => {
    // console.log("addPettyCashTransaction - ID:", id);
    // console.log(
    //   "addPettyCashTransaction - Payload:",
    //   JSON.stringify(transactionData, null, 2)
    // );
    try {
      const response = await apiClient.post(
        `${PETTY_CASH_URL}/${id}/transactions`,
        transactionData
      );
      // console.log(
      //   "addPettyCashTransaction - Response:",
      //   JSON.stringify(response.data, null, 2)
      // );
      return response.data;
    } catch (error) {
      console.error(
        "addPettyCashTransaction - Error:",
        JSON.stringify(error.response?.data, null, 2)
      );
      return rejectWithValue(
        error.response?.data || "Failed to add petty cash transaction"
      );
    }
  }
);

export const recalculatePettyCashBalance = createAsyncThunk(
  "pettyCash/recalculatePettyCashBalance",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `${PETTY_CASH_URL}/${id}/recalculate-balance`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to recalculate petty cash balance"
      );
    }
  }
);

export const fetchAllPettyCashTransactions = createAsyncThunk(
  "pettyCash/fetchAllPettyCashTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${PETTY_CASH_URL}/transactions`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all petty cash transactions"
      );
    }
  }
);

// Slice
const pettyCashSlice = createSlice({
  name: "pettyCash",
  initialState: {
    pettyCashes: [],
    transactions: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    resetPettyCashState: (state) => {
      state.pettyCashes = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchPettyCashes
    builder
      .addCase(fetchPettyCashes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPettyCashes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pettyCashes = action.payload;
        state.error = null;
      })
      .addCase(fetchPettyCashes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // createPettyCash
    builder
      .addCase(createPettyCash.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPettyCash.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pettyCashes.push(action.payload);
        state.error = null;
      })
      .addCase(createPettyCash.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // updatePettyCash
    builder
      .addCase(updatePettyCash.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePettyCash.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.pettyCashes.findIndex(
          (pc) => pc._id === action.payload._id
        );
        if (index !== -1) {
          state.pettyCashes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePettyCash.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // deletePettyCash
    builder
      .addCase(deletePettyCash.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePettyCash.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pettyCashes = state.pettyCashes.filter(
          (pc) => pc._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(deletePettyCash.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // addPettyCashTransaction
    builder
      .addCase(addPettyCashTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPettyCashTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.pettyCashes.findIndex(
          (pc) => pc._id === action.payload._id
        );
        if (index !== -1) {
          state.pettyCashes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(addPettyCashTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // recalculatePettyCashBalance
    builder
      .addCase(recalculatePettyCashBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(recalculatePettyCashBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.pettyCashes.findIndex(
          (pc) => pc._id === action.payload._id
        );
        if (index !== -1) {
          state.pettyCashes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(recalculatePettyCashBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllPettyCashTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllPettyCashTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchAllPettyCashTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

// Actions
export const { resetPettyCashState } = pettyCashSlice.actions;

// Reducer
export default pettyCashSlice.reducer;
