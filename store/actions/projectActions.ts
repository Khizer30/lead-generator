import { createAsyncThunk } from "@reduxjs/toolkit";

import { projectApi } from "../../services/projectApi";
import { AddLeadsToProjectPayload, CreateProjectPayload, GetProjectsParams, UpdateProjectPayload } from "../slices/projectSlice";

export const createProject = createAsyncThunk("projects/createProject", async (payload: CreateProjectPayload, { rejectWithValue }) => {
  try {
    return await projectApi.createProject(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to create project");
  }
});

export const updateProject = createAsyncThunk("projects/updateProject", async (payload: UpdateProjectPayload, { rejectWithValue }) => {
  try {
    return await projectApi.updateProject(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to update project");
  }
});

export const getProjects = createAsyncThunk("projects/getProjects", async (params: GetProjectsParams | undefined, { rejectWithValue }) => {
  try {
    return await projectApi.getProjects(params);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch projects");
  }
});

export const getProjectById = createAsyncThunk("projects/getProjectById", async (projectId: string, { rejectWithValue }) => {
  try {
    return await projectApi.getProjectById(projectId);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch project");
  }
});

export const addLeadsToProject = createAsyncThunk("projects/addLeadsToProject", async (payload: AddLeadsToProjectPayload, { rejectWithValue }) => {
  try {
    return await projectApi.addLeadsToProject(payload);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to add leads to project");
  }
});

export const removeLeadFromProject = createAsyncThunk(
  "projects/removeLeadFromProject",
  async ({ projectId, leadId }: { projectId: string; leadId: string }, { rejectWithValue }) => {
    try {
      return await projectApi.removeLeadFromProject(projectId, leadId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to remove lead from project");
    }
  }
);

export const deleteProject = createAsyncThunk("projects/deleteProject", async (projectId: string, { rejectWithValue }) => {
  try {
    return await projectApi.deleteProject(projectId);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete project");
  }
});
