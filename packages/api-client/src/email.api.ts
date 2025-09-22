import { api } from "./axiosInstance";
import { handleError } from "./handleError";

const getEmails = async (filter: string) => {
  try {
    const response = await api.get(`/emails?filter=${filter}`);
    console.log("Fetched emails:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return handleError(error);
  }
};

const getFullEmail = async (threadId: string) => {
  try {
    const response = await api.get(`/emails/body?threadId=${threadId}`);
    console.log("Fetched full email:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching full email:", error);
    return handleError(error);
  }
};

const getRecentEmails = async (since: number) => {
  try {
    const response = await api.get(`/emails/recent?since=${since}`);
    console.log("Fetched recent emails:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent emails:", error);
    return handleError(error);
  }
};

const archiveThread = async (threadId: string) => {
  try {
    const response = await api.post(`/emails/archive`, { threadId });
    console.log("Archived thread:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error archiving thread:", error);
    return handleError(error);
  }
};

const unarchiveThread = async (threadId: string) => {
  try {
    const response = await api.post(`/emails/unarchive`, { threadId });
    console.log("Unarchived thread:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error unarchiving thread:", error);
    return handleError(error);
  }
};

const trashThread = async (threadId: string) => {
  try {
    const response = await api.post(`/emails/trash`, { threadId });
    console.log("Trashed thread:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error trashing thread:", error);
    return handleError(error);
  }
};

const starThread = async (threadId: string) => {
  try {
    const response = await api.post(`/emails/star`, { threadId });
    console.log("Starred thread:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error starring thread:", error);
    return handleError(error);
  }
};

const unstarThread = async (threadId: string) => {
  try {
    const response = await api.post(`/emails/unstar`, { threadId });
    console.log("Unstarred thread:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error unstarring thread:", error);
    return handleError(error);
  }
};

export const apiEmail = {
  getEmails,
  getFullEmail,
  getRecentEmails,
  archiveThread,
  trashThread,
  starThread,
  unstarThread,
  unarchiveThread
}