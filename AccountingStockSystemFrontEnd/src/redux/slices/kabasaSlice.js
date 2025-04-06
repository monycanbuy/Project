import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/apiClient";

const KABASA_URL = "/kabasa";

export const createKabasa = createAsyncThunk(
  "kabasa/create",
  async (kabasaData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(KABASA_URL, kabasaData);
      //console.log("API response:", response.data);
      return response.data.kabasa;
    } catch (error) {
      console.error("Error creating Kabasa sale:", error);
      return rejectWithValue(error.message || "Failed to create Kabasa sale");
    }
  }
);

export const fetchKabasas = createAsyncThunk(
  "kabasa/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(KABASA_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching Kabasa sales:", error);
      return rejectWithValue(error.message || "Failed to fetch Kabasa sales");
    }
  }
);

export const getKabasaById = createAsyncThunk(
  "kabasa/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${KABASA_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Kabasa sale by ID:", error);
      return rejectWithValue(error.message || "Failed to fetch Kabasa sale");
    }
  }
);

export const updateKabasa = createAsyncThunk(
  "kabasa/update",
  async ({ id, kabasaData }, { rejectWithValue }) => {
    try {
      // Calculate totalAmount if necessary before sending to the server
      let dataToSend = { ...kabasaData };
      if (kabasaData.orderItems && kabasaData.orderItems.length > 0) {
        const totalAmount = kabasaData.orderItems.reduce((sum, item) => {
          return sum + item.qty * item.unitPrice;
        }, 0);
        const discountPercentage = kabasaData.discount / 100; // Assuming discount is in percentage
        const discountAmount = totalAmount * discountPercentage;
        dataToSend.totalAmount = totalAmount - discountAmount;
      }

      const response = await apiClient.put(`${KABASA_URL}/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error("Error updating Kabasa sale:", error);
      // Check if there's a specific error message from the server
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message ||
            error.message ||
            "Failed to update Kabasa sale"
        );
      }
      return rejectWithValue(error.message || "Failed to update Kabasa sale");
    }
  }
);

export const cancelKabasa = createAsyncThunk(
  "kabasa/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${KABASA_URL}/${id}/cancel`, {});
      return response.data;
    } catch (error) {
      console.error("Error canceling Kabasa sale:", error);
      return rejectWithValue(error.message || "Failed to cancel Kabasa sale");
    }
  }
);

export const fetchKabasaSummary = createAsyncThunk(
  "kabasa/fetchSummary",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const response = await apiClient.get(`${KABASA_URL}/summary`, {
        params: params,
      });
      //console.log("API Response:", response.data);
      return response.data; // Directly return the data as it matches your expected structure
    } catch (error) {
      // Handle errors
      return rejectWithValue({
        status: error.response?.status || 500,
        message: error.message || "An error occurred",
      });
    }
  }
);

export const voidKabasa = createAsyncThunk(
  "kabasa/void",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`${KABASA_URL}/${id}`, {});
      // Convert Date to ISO string if it's part of the response
      if (response.data.data.voidedAt instanceof Date) {
        response.data.data.voidedAt = response.data.data.voidedAt.toISOString();
      }
      return response.data.data;
    } catch (error) {
      console.error("Error voiding Kabasa:", error);
      return rejectWithValue(error.message || "Failed to void Kabasa");
    }
  }
);

// New Thunk: Fetch Kabasa Daily Sales Summary
export const fetchKabasaDailySalesSummary = createAsyncThunk(
  "kabasa/fetchDailySalesSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${KABASA_URL}/daily-sales-summary`);
      //console.log("Daily Sales Summary Response:", response.data);
      return response.data.data; // Return only the 'data' object
    } catch (error) {
      console.error("Error fetching Kabasa daily sales summary:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch Kabasa daily sales summary",
      });
    }
  }
);

// New Thunk: Fetch Kabasa All-Time Sales
export const fetchKabasaAllTimeSales = createAsyncThunk(
  "kabasa/fetchAllTimeSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${KABASA_URL}/all-time-sales`);
      //console.log("All-Time Sales Response:", response.data);
      return response.data.data; // Return only the 'data' object { totalSales }
    } catch (error) {
      console.error("Error fetching Kabasa all-time sales:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch Kabasa all-time sales",
      });
    }
  }
);

// New Thunk: Fetch Kabasa Daily Sales for All Days
export const fetchKabasaDailySalesAllDays = createAsyncThunk(
  "kabasa/fetchDailySalesAllDays",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `${KABASA_URL}/daily-sales-all-days`
      );
      //console.log("Daily Sales All Days Response:", response.data);
      return response.data.data; // Return the array of { date, totalSales }
    } catch (error) {
      console.error("Error fetching Kabasa daily sales for all days:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch Kabasa daily sales for all days",
      });
    }
  }
);

// Fetch Top 5 Selling Items
export const fetchKabasaTopSellingItems = createAsyncThunk(
  "kabasa/fetchTopSellingItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${KABASA_URL}/top-selling-items`);
      //console.log("Top Selling Items Response:", response.data);
      return response.data.data; // Array of { itemName, totalQty }
    } catch (error) {
      console.error("Error fetching Kabasa top selling items:", error);
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch Kabasa top selling items",
      });
    }
  }
);

const kabasaSlice = createSlice({
  name: "kabasa",
  initialState: {
    kabasas: [],
    currentKabasa: null,
    summary: null,
    dailySalesSummary: null,
    allTimeSales: null,
    dailySalesAllDays: null,
    topSellingItems: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKabasas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKabasas.fulfilled, (state, action) => {
        //console.log("Fetched Kabasa data:", action.payload);
        state.status = "succeeded";
        state.kabasas = action.payload.data; // Assuming the API returns an object with a 'kabasas' property
        state.error = null;
      })
      .addCase(fetchKabasas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createKabasa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createKabasa.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          //console.log("Received payload:", action.payload);
          if (Array.isArray(action.payload)) {
            // If the backend returns an array, take the first item or handle appropriately
            state.kabasas.push(
              ...action.payload.map((item) => ({
                ...item,
                paymentMethod: item.paymentMethod || null,
              }))
            );
          } else {
            // Assuming payload is an object representing one Kabasa
            state.kabasas.push({
              ...action.payload,
              paymentMethod: action.payload.paymentMethod || null,
            });
          }
        } else {
          console.warn("Unexpected empty payload from createKabasa action");
          // Here you might want to handle this case more gracefully
          // For example, you could show a warning in the UI
          state.error = "Created Kabasa but received no data.";
        }
        state.error = null;
      })
      .addCase(createKabasa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getKabasaById.pending, (state) => {
        state.status = "loading";
        state.currentKabasa = null;
      })
      .addCase(getKabasaById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentKabasa = action.payload;
        state.error = null;
      })
      .addCase(getKabasaById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentKabasa = null;
      })
      .addCase(updateKabasa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateKabasa.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.kabasas.findIndex(
          (kabasa) => kabasa._id === action.payload._id
        );
        if (index !== -1) {
          state.kabasas[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateKabasa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(cancelKabasa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(cancelKabasa.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.kabasas.findIndex(
          (kabasa) => kabasa._id === action.payload._id
        );
        if (index !== -1) {
          state.kabasas[index] = {
            ...state.kabasas[index],
            ...action.payload,
          };
        }
        state.error = null;
      })
      .addCase(cancelKabasa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchKabasaSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKabasaSummary.fulfilled, (state, action) => {
        //console.log("Action Payload:", action.payload);
        state.status = "succeeded";
        state.summary = action.payload; // Store the fetched summary
        state.error = null;
      })
      .addCase(fetchKabasaSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(voidKabasa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(voidKabasa.fulfilled, (state, action) => {
        const index = state.kabasas.findIndex(
          (kabasa) => kabasa._id === action.payload._id
        );
        if (index !== -1) {
          state.kabasas[index] = {
            ...state.kabasas[index],
            isVoided: true,
            voidedAt: action.payload.voidedAt || new Date().toISOString(), // Convert to ISO string
          };
        }
      })
      .addCase(voidKabasa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // New Cases for fetchKabasaDailySalesSummary
      .addCase(fetchKabasaDailySalesSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchKabasaDailySalesSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailySalesSummary = action.payload; // Store the daily sales summary
        state.error = null;
      })
      .addCase(fetchKabasaDailySalesSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.dailySalesSummary = null;
      })
      // New Cases for fetchKabasaAllTimeSales
      .addCase(fetchKabasaAllTimeSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchKabasaAllTimeSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTimeSales = action.payload; // Store { totalSales }
        state.error = null;
      })
      .addCase(fetchKabasaAllTimeSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.allTimeSales = null;
      })
      // New Cases for fetchKabasaDailySalesAllDays
      .addCase(fetchKabasaDailySalesAllDays.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchKabasaDailySalesAllDays.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dailySalesAllDays = action.payload; // Store array of { date, totalSales }
        state.error = null;
      })
      .addCase(fetchKabasaDailySalesAllDays.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.dailySalesAllDays = null;
      })
      // ... (Existing cases unchanged)
      .addCase(fetchKabasaTopSellingItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchKabasaTopSellingItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topSellingItems = action.payload;
        state.error = null;
      })
      .addCase(fetchKabasaTopSellingItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.topSellingItems = null;
      });
  },
});

export const {} = kabasaSlice.actions;

export default kabasaSlice.reducer;
