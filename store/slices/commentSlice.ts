import { createSlice } from "@reduxjs/toolkit";

import { createComment, getComments } from "../actions/commentActions";

export type CommentRecord = {
  id: string;
  userId: string;
  leadId: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCommentPayload = {
  userId: string;
  leadId: string;
  text: string;
};

export type GetCommentsParams = {
  userId?: string;
  leadId?: string;
  page?: number;
  limit?: number;
};

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

type CommentsState = {
  comments: CommentRecord[];
  total: number;
  page: number;
  limit: number;
  listStatus: AsyncStatus;
  createStatus: AsyncStatus;
  error: string | null;
  successMessage: string | null;
};

const initialState: CommentsState = {
  comments: [],
  total: 0,
  page: 1,
  limit: 10,
  listStatus: "idle",
  createStatus: "idle",
  error: null,
  successMessage: null
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.comments = action.payload.comments;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch comments";
      })
      .addCase(createComment.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.comments = [action.payload.comment, ...state.comments];
        state.total += 1;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = (action.payload as string) || "Failed to create comment";
      });
  }
});

export const { clearCommentMessages } = commentSlice.actions;
export default commentSlice.reducer;
