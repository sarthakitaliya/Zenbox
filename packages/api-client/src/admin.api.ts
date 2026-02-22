import { api } from "./axiosInstance";
import { handleError } from "./handleError";

export interface AdminRegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  lastLoginAt?: string | Date | null;
}

export interface AdminOverviewStatsResponse {
  totals: {
    users: number;
    connectedAccounts: number;
    customCategories: number;
    categorizedMails: number;
  };
  activity: {
    activeUsers7d: number;
    newUsersLast7d: number;
  };
  recentSignups: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
  }>;
}

export interface AdminUserListItem {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  lastActiveAt: string | null;
}

export interface AdminUsersListResponse {
  users: AdminUserListItem[];
  nextCursor: string | null;
}

const registerAdmin = async (payload: AdminRegisterRequest) => {
  try {
    const response = await api.post<{ message: string; admin: AdminUser }>(
      "/admin/auth/register",
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const loginAdmin = async (payload: AdminLoginRequest) => {
  try {
    const response = await api.post<{ message: string; admin: AdminUser }>(
      "/admin/auth/login",
      payload
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const logoutAdmin = async () => {
  try {
    const response = await api.post<{ message: string }>("/admin/auth/logout");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getAdminMe = async () => {
  try {
    const response = await api.get<{ admin: AdminUser }>("/admin/auth/me");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getAdminSetupStatus = async () => {
  try {
    const response = await api.get<{ canRegister: boolean }>("/admin/auth/setup-status");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getAdminOverviewStats = async () => {
  try {
    const response = await api.get<AdminOverviewStatsResponse>("/admin/stats/overview");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getAdminUsers = async (params?: { limit?: number; cursor?: string }) => {
  try {
    const response = await api.get<AdminUsersListResponse>("/admin/users", {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteUserByAdmin = async (userId: string) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const response = await api.delete<{ message: string }>(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const apiAdmin = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  getAdminSetupStatus,
  getAdminOverviewStats,
  getAdminUsers,
  deleteUserByAdmin,
};
