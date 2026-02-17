import { createAsyncThunk } from "@reduxjs/toolkit";

import { dealApi } from "../../services/dealApi";
import { CreateDealPayload, GetDealsParams } from "../slices/dealSlice";

export const createDeal = createAsyncThunk("deals/createDeal", async (payload: CreateDealPayload, { rejectWithValue }) => {
  try {
    return await dealApi.createDeal(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to create deal");
  }
});

export const getDeals = createAsyncThunk("deals/getDeals", async (params: GetDealsParams | undefined, { rejectWithValue }) => {
  try {
    return await dealApi.getDeals(params);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch deals");
  }
});
