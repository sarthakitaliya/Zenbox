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

const summarizeEmail = async (subject: string, content: string) => {
  try {
    const response = await api.post(`/ai/summarize-email`, { subject, content });
    return response.data;
  } catch (error) {
    console.error("Error summarizing email:", error);
    return handleError(error);
  }
}

const generateEmailBody = async (prompt: string) => {
  try {
    const response = await api.post(`/ai/generate-email-body`, { prompt });
    return response.data;
  } catch (error) {
    console.error("Error generating email body:", error);
    return handleError(error);
  }
}

export const apiAI = {
  categorizeInitialEmails,
  summarizeEmail,
  generateEmailBody
};
