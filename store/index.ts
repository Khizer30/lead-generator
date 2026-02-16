import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
