import { createSlice } from "@reduxjs/toolkit";

import {
  addLeadsToProject,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  removeLeadFromProject,
  updateProject
} from "../actions/projectActions";

export type ProjectRecord = {
  id: string;
  title: string;
  description?: string;
  projectManagerId?: string;
  projectManagerName?: string;
  leadCount?: number | string;
  leadIds?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProjectPayload = {
  title: string;
  description?: string;
  projectManagerId: string;
  leadIds?: string[];
};

export type UpdateProjectPayload = {
  projectId: string;
  data: Partial<CreateProjectPayload>;
};

export type GetProjectsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type AddLeadsToProjectPayload = {
  projectId: string;
  leadIds: string[];
};

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

type ProjectsState = {
  projects: ProjectRecord[];
  selectedProject: ProjectRecord | null;
  total: number;
  page: number;
  limit: number;
  listStatus: AsyncStatus;
  detailStatus: AsyncStatus;
  createStatus: AsyncStatus;
  updateStatus: AsyncStatus;
  addLeadsStatus: AsyncStatus;
  removeLeadStatus: AsyncStatus;
  deleteStatus: AsyncStatus;
  error: string | null;
  successMessage: string | null;
};

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  total: 0,
  page: 1,
  limit: 10,
  listStatus: "idle",
  detailStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  addLeadsStatus: "idle",
  removeLeadStatus: "idle",
  deleteStatus: "idle",
  error: null,
  successMessage: null
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
      state.detailStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.projects = action.payload.projects;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch projects";
      })
      .addCase(getProjectById.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch project";
      })
      .addCase(createProject.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.projects = [action.payload.project, ...state.projects];
        state.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = (action.payload as string) || "Failed to create project";
      })
      .addCase(updateProject.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.selectedProject = action.payload.project;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.project.id ? action.payload.project : project
        );
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = (action.payload as string) || "Failed to update project";
      })
      .addCase(addLeadsToProject.pending, (state) => {
        state.addLeadsStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addLeadsToProject.fulfilled, (state, action) => {
        state.addLeadsStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.selectedProject = action.payload.project;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.project.id ? action.payload.project : project
        );
      })
      .addCase(addLeadsToProject.rejected, (state, action) => {
        state.addLeadsStatus = "failed";
        state.error = (action.payload as string) || "Failed to add leads to project";
      })
      .addCase(removeLeadFromProject.pending, (state) => {
        state.removeLeadStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeLeadFromProject.fulfilled, (state, action) => {
        state.removeLeadStatus = "succeeded";
        state.successMessage = action.payload.message;
        if (state.selectedProject?.id === action.payload.projectId && state.selectedProject.leadIds) {
          state.selectedProject.leadIds = state.selectedProject.leadIds.filter((id) => id !== action.payload.leadId);
        }
      })
      .addCase(removeLeadFromProject.rejected, (state, action) => {
        state.removeLeadStatus = "failed";
        state.error = (action.payload as string) || "Failed to remove lead from project";
      })
      .addCase(deleteProject.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.successMessage = action.payload.message;
        state.projects = state.projects.filter((project) => project.id !== action.payload.projectId);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedProject?.id === action.payload.projectId) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = (action.payload as string) || "Failed to delete project";
      });
  }
});

export const { clearProjectMessages, clearSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
