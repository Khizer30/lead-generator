import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { startNotificationStream, stopNotificationStream } from "../actions/notificationActions";

export type NotificationEvent = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  source: "local" | "sse";
};

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

type NotificationsState = {
  items: NotificationEvent[];
  connectionStatus: ConnectionStatus;
  error: string | null;
};

const initialState: NotificationsState = {
  items: [],
  connectionStatus: "idle",
  error: null
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationReceived: (state, action: PayloadAction<NotificationEvent>) => {
      state.items = [action.payload, ...state.items].slice(0, 100);
    },
    pushLocalNotification: (state, action: PayloadAction<{ type: string; message: string }>) => {
      const notification: NotificationEvent = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: action.payload.type,
        message: action.payload.message,
        createdAt: new Date().toISOString(),
        source: "local"
      };
      state.items = [notification, ...state.items].slice(0, 100);
    },
    notificationConnectionError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = "error";
      state.error = action.payload;
    },
    clearNotificationError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startNotificationStream.pending, (state) => {
        state.connectionStatus = "connecting";
        state.error = null;
      })
      .addCase(startNotificationStream.fulfilled, (state) => {
        state.connectionStatus = "connected";
      })
      .addCase(startNotificationStream.rejected, (state, action) => {
        state.connectionStatus = "error";
        state.error = (action.payload as string) || "Failed to subscribe notifications";
      })
      .addCase(stopNotificationStream.fulfilled, (state) => {
        state.connectionStatus = "idle";
      });
  }
});

export const { notificationReceived, pushLocalNotification, notificationConnectionError, clearNotificationError } =
  notificationSlice.actions;

export default notificationSlice.reducer;

