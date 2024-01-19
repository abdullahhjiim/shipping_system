import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addToCarts = createAsyncThunk("carts/addToCarts", (data) => {
  return data;
});

export const vehicleIDChange = createAsyncThunk("carts/vehicleIDChange", (data) => {
  return data;
});

export const processStatusChange = createAsyncThunk("carts/processStatusChange", (data) => {
  return data;
});

export const clearCarts = createAsyncThunk("carts/clearCarts", () => {
  return true;
});

export const cartsSlice = createSlice({
  name: "carts",
  initialState: {
    checkoutsTransit : [],
    checkoutsDestination : [],
    lastVehicleStatus : "",
    allVehicleIDs : [],
  },
  reducers: {},
  extraReducers: {
    [addToCarts.fulfilled]: (state, action) => {
      state[action.payload.type] = action.payload.data;
      state.lastVehicleStatus = action.payload.type;
      state.allVehicleIDs = action.payload.allVehicleIDs;
    },
    [vehicleIDChange.fulfilled]: (state, action) => {
      state.allVehicleIDs = action.payload;
    },
    [processStatusChange.fulfilled]: (state, action) => {
      state.lastVehicleStatus = action.payload;
    },
    [clearCarts.fulfilled]: (state, action) => {
      state.checkoutsTransit = [];
      state.checkoutsDestination = [];
      state.lastVehicleStatus = "";
      state.allVehicleIDs = [];
    },
  },
});

export const { updateStart, updateSuccess, updateFailure } = cartsSlice.actions;
export default cartsSlice.reducer;

