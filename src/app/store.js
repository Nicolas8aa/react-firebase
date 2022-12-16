import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../components/Login/loginSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
