import { createSlice } from "@reduxjs/toolkit";

import { createDeal, getDeals } from "../actions/dealActions";

export type DealTypeApi = "CONSULTING" | "ONLINE_TRADING" | "OFF_SITE" | string;
export type DealCurrencyApi = "DOLLAR" | "EURO" | "USD" | "EUR" | string;

export type DealRecord = {
  id: string;
  name: string;
  leadId: string;
  ownerId?: string;
  projectId?: string;
  dealType: DealTypeApi;
  currency: DealCurrencyApi;
  totalAmount: number;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateDealPayload = {
  name: string;
  leadId: string;
  ownerId?: string;
  projectId?: string;
  dealType: DealTypeApi;
  currency: DealCurrencyApi;
  totalAmount: number;
  startDate: string;
  endDate: string;
  description?: string;
};

export type GetDealsParams = {
  leadId?: string;
  ownerId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
};

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

type DealsState = {
  deals: DealRecord[];
  total: number;
  page: number;
  limit: number;
  listStatus: AsyncStatus;
  createStatus: AsyncStatus;
  error: string | null;
  successMessage: string | null;
};

const initialState: DealsState = {
  deals: [],
  total: 0,
  page: 1,
  limit: 10,
  listStatus: "idle",
  createStatus: "idle",
  error: null,
  successMessage: null
};

const dealSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    clearDealMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeals.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.deals = action.payload.deals;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getDeals.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch deals";
      })
      .addCase(createDeal.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.deals = [action.payload.deal, ...state.deals];
        state.total += 1;
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = (action.payload as string) || "Failed to create deal";
      });
  }
});

export const { clearDealMessages } = dealSlice.actions;
export default dealSlice.reducer;
