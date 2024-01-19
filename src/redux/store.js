import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from "./auth/authSlice";
import cartsReducer from "./carts/cartsSlice";
import userReducer from "./user/userSlice";

//store.js
const persistConfig = {
  key: 'user',
  storage,
};

const reducers = combineReducers( {
      user: userReducer,
      auth: authReducer,
      carts: cartsReducer,
    });

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
      }),
});