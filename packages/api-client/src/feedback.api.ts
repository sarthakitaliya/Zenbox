import { api } from "./axiosInstance";
import { handleError } from "./handleError";

export interface SubmitFeedbackRequest {
  name?: string;
  email: string;
  message: string;
  rating: number;
}

export interface SubmitFeedbackResponse {
  message: string;
}

export interface AdminFeedbackItem {
  id: string;
  name: string | null;
  email: string;
  message: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface AdminFeedbackListResponse {
  items: AdminFeedbackItem[];
}

const submitFeedback = async (payload: SubmitFeedbackRequest) => {
  try {
    const response = await api.post<SubmitFeedbackResponse>("/feedback", payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getAdminFeedback = async (params?: { limit?: number }) => {
  try {
    const response = await api.get<AdminFeedbackListResponse>("/admin/feedback", {
      params,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const apiFeedback = {
  submitFeedback,
  getAdminFeedback,
};
