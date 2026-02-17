import { createAsyncThunk } from "@reduxjs/toolkit";

import { teamApi } from "../../services/teamApi";
import { DeleteTeamMemberPayload, GetTeamMembersParams, InviteTeamMemberPayload } from "../slices/teamSlice";

export const getTeamMembers = createAsyncThunk(
  "team/getTeamMembers",
  async (params: GetTeamMembersParams, { rejectWithValue }) => {
    try {
      return await teamApi.getTeamMembers(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch team members");
    }
  }
);

export const inviteTeamMember = createAsyncThunk(
  "team/inviteTeamMember",
  async (payload: InviteTeamMemberPayload, { rejectWithValue }) => {
    try {
      return await teamApi.inviteTeamMember(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to invite team member");
    }
  }
);

export const getInvitationById = createAsyncThunk(
  "team/getInvitationById",
  async (invitationId: string, { rejectWithValue }) => {
    try {
      return await teamApi.getInvitationById(invitationId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch invitation");
    }
  }
);

export const deleteTeamMember = createAsyncThunk(
  "team/deleteTeamMember",
  async (payload: DeleteTeamMemberPayload, { rejectWithValue }) => {
    try {
      return await teamApi.deleteTeamMember(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete team member");
    }
  }
);
