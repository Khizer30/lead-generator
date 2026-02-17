import { createAsyncThunk } from "@reduxjs/toolkit";

import { notificationApi } from "../../services/notificationApi";
import { notificationConnectionError, notificationReceived } from "../slices/notificationSlice";

const toNotificationMessage = (rawData: string) => {
  if (!rawData) {
    return {
      id: `sse-${Date.now()}`,
      type: "INFO",
      message: "New notification received.",
      createdAt: new Date().toISOString(),
      source: "sse" as const
    };
  }

  try {
    const parsed = JSON.parse(rawData) as { type?: string; message?: string; createdAt?: string; id?: string };
    return {
      id: parsed.id || `sse-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: parsed.type || "INFO",
      message: parsed.message || "New notification received.",
      createdAt: parsed.createdAt || new Date().toISOString(),
      source: "sse" as const
    };
  } catch {
    return {
      id: `sse-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "INFO",
      message: rawData,
      createdAt: new Date().toISOString(),
      source: "sse" as const
    };
  }
};

export const startNotificationStream = createAsyncThunk(
  "notifications/startStream",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      notificationApi.subscribe({
        onOpen: () => {
          console.log("[Notification] SSE connected");
        },
        onMessage: (rawData) => {
          const notification = toNotificationMessage(rawData);
          console.log("[Notification] SSE message", notification);
          dispatch(notificationReceived(notification));
        },
        onError: (message) => {
          console.error("[Notification] SSE error", message);
          dispatch(notificationConnectionError(message));
        }
      });
      return { connected: true };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to subscribe notification stream");
    }
  }
);

export const stopNotificationStream = createAsyncThunk("notifications/stopStream", async () => {
  notificationApi.unsubscribe();
  return { connected: false };
});

