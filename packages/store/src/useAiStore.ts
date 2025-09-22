import { apiAI } from "@repo/api-client/apis";
import { create } from "zustand";
import { useUIStore } from "./useUIStore";
import { useEmailStore } from "./useEmailStore";

const { setError, setMessage, setLoadingList } = useUIStore.getState();
export const useAiStore = create<State>((set) => ({
  getcategorizeInitialEmails: async (limit: number) => {
    try {
      setLoadingList(true);
      const response = await apiAI.categorizeInitialEmails(limit);
      setMessage("Initial emails categorized successfully");
      return response;
    } catch (error) {
      console.error("Error categorizing initial emails:", error);
      setError("Failed to categorize initial emails");
      throw error;
    } finally {
      setLoadingList(false);
    }
  },
}));

interface State {
  getcategorizeInitialEmails: (limit: number) => Promise<any>;
}
