import { api } from "./axiosInstance";
import { handleError } from "./handleError";

const categorizeInitialEmails = async (limit: number) => {
  try {
    const response = await api.get(`/ai/categorize-initial-emails?limit=${limit}`);
    console.log("Categorized initial emails:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error categorizing initial emails:", error);
    return handleError(error);
  }
}

export const apiAI = {
  categorizeInitialEmails
};