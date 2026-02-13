import { apiAI } from "@repo/api-client/apis";
import { create } from "zustand";
import { useUIStore } from "./useUIStore";

const { setMessage, setLoadingList } = useUIStore.getState();

type CategorizeInitialEmailsResult = {
  success: boolean;
  data?: {
    newlyCategorizedCount: number;
    totalCategorizedCount: number;
    isFirstCategorization: boolean;
  };
  message?: string;
};

export const useAiStore = create<State>((set) => ({
  getcategorizeInitialEmails: async (limit: number) => {
    try {
      setLoadingList(true);
      const response =
        await apiAI.categorizeInitialEmails(limit) as CategorizeInitialEmailsResult;

      if (response?.success && response.data?.isFirstCategorization) {
        setMessage("Initial emails categorized successfully");
      }

      return response;
    } catch (error) {
      console.error("Error categorizing initial emails:", error);
      return { success: false, message: "Initial categorization failed." };
    } finally {
      setLoadingList(false);
    }
  },
}));

interface State {
  getcategorizeInitialEmails: (limit: number) => Promise<CategorizeInitialEmailsResult>;
}
