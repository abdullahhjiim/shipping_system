import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api_base_url = process.env.REACT_APP_API_BASE_URL

export const login = createAsyncThunk("auth/login", async (loginData) => {
  const response = await axios.post(
    `${api_base_url}/login`,
    loginData
  );
  return response.data;
});

export const logOut = createAsyncThunk("auth/logout", () => {
  return new Promise((response, reject) => response(true) );
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    _token: null,
    pending: null,
    error: null,
    errorMessage: null,
    userData: null,
    permissions : null,
    statusOverview : [],
    language : 'en',
  },
  reducers: {
    setGlobalLanguage : (state, action) => {
      state.language = action.payload;
    }
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.pending = true;
      state.error = false;
    },
    [login.fulfilled]: (state, action) => {
      state.userData = action.payload.user;
      state._token = action.payload.access_token;
      state.permissions = action.payload.permissions;
      state.statusOverview = action.payload.status_overview;
      state.pending = false;
      localStorage.setItem("_token",  action.payload.access_token);
    },
    [login.rejected]: (state, error) => {
      state.pending = false;
      state.error = true;
      state.errorMessage = error.error.message;
    },
    [logOut.fulfilled]: (state, action) => {
      state.userData = null;
      state._token = null;
      state.pending = false;
      localStorage.setItem("_token",  null);
      localStorage.setItem("checkoutsTransit",  "");
      localStorage.setItem("checkoutsDestination",  "");
    },

  },
});

export const { updateStart, updateSuccess, updateFailure , setGlobalLanguage} = authSlice.actions;
export default authSlice.reducer;

