import { createAsyncThunk } from "@reduxjs/toolkit";

import { leadApi } from "../../services/leadApi";
import { CreateLeadPayload, GetLeadsParams, UpdateLeadPayload } from "../slices/leadSlice";

export const createLead = createAsyncThunk("leads/createLead", async (payload: CreateLeadPayload, { rejectWithValue }) => {
  try {
    return await leadApi.createLead(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to create lead");
  }
});

export const updateLead = createAsyncThunk("leads/updateLead", async (payload: UpdateLeadPayload, { rejectWithValue }) => {
  try {
    return await leadApi.updateLead(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to update lead");
  }
});

export const getLeads = createAsyncThunk("leads/getLeads", async (params: GetLeadsParams | undefined, { rejectWithValue }) => {
  try {
    return await leadApi.getLeads(params);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch leads");
  }
});

export const getLeadById = createAsyncThunk("leads/getLeadById", async (leadId: string, { rejectWithValue }) => {
  try {
    return await leadApi.getLeadById(leadId);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch lead");
  }
});

export const deleteLead = createAsyncThunk("leads/deleteLead", async (leadId: string, { rejectWithValue }) => {
  try {
    return await leadApi.deleteLead(leadId);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete lead");
  }
});
