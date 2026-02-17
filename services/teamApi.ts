import { BACKEND_URL } from "../config/env";
import {
  DeleteTeamMemberPayload,
  GetTeamMembersParams,
  InviteTeamMemberPayload,
  TeamInvitation,
  TeamMember
} from "../store/slices/teamSlice";

type TeamApiResponse = {
  success?: boolean;
  message?: string;
  users?: TeamMember[];
  user?: TeamMember;
  total?: number;
  page?: number;
  limit?: number;
  invitation?: TeamInvitation;
  role?: string;
  email?: string;
  expiresAt?: string;
};

const parseJsonSafe = async (response: Response): Promise<TeamApiResponse> => {
  try {
    return (await response.json()) as TeamApiResponse;
  } catch {
    return {};
  }
};

const request = async (path: string, init?: RequestInit): Promise<TeamApiResponse> => {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      credentials: "include",
      ...init
    });
  } catch {
    throw new Error("Network/CORS error: unable to reach team service.");
  }

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.message || "Team request failed");
  }

  return data;
};

export const teamApi = {
  getTeamMembers: async (
    params: GetTeamMembersParams
  ): Promise<{ users: TeamMember[]; total: number; page: number; limit: number }> => {
    const query = new URLSearchParams();
    if (params.teamId) query.set("teamId", params.teamId);
    if (params.search) query.set("search", params.search);
    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));

    const path = query.toString() ? `/user?${query.toString()}` : "/user";
    const response = await request(path, { method: "GET" });

    return {
      users: response.users || [],
      total: response.total || 0,
      page: response.page || params.page || 1,
      limit: response.limit || params.limit || 10
    };
  },

  inviteTeamMember: async (payload: InviteTeamMemberPayload): Promise<{ message: string }> => {
    const body = new URLSearchParams();
    body.append("email", payload.email);
    body.append("role", payload.role);

    const response = await request("/team/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    });

    return {
      message: response.message || "Invitation sent successfully"
    };
  },

  getInvitationById: async (invitationId: string): Promise<TeamInvitation> => {
    const response = await request(`/team/invitation/${invitationId}`, { method: "GET" });

    if (response.invitation) {
      return response.invitation;
    }

    return {
      id: invitationId,
      email: response.email || "",
      role: response.role || "",
      expiresAt: response.expiresAt
    };
  },

  deleteTeamMember: async ({ userId }: DeleteTeamMemberPayload): Promise<{ userId: string; message: string }> => {
    const response = await request(`/user/${userId}`, { method: "DELETE" });

    return {
      userId,
      message: response.message || "Team member deleted successfully"
    };
  }
};
