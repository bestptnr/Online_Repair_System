import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./authReducer";

export default configureStore({
  reducer: {
    data: authReducer,
    devTools: true,
  }
});
