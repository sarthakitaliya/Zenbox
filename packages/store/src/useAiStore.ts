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

type SummarizeEmailResult = {
  success: boolean;
  data?: {
    summary: string;
  };
  message?: string;
};

export const useAiStore = create<State>((set, get) => ({
  summariesByThread: {},
  summaryLoadingByThread: {},
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
  summarizeEmail: async (
    threadId: string,
    subject: string,
    content: string
  ): Promise<SummarizeEmailResult> => {
    const cachedSummary = get().summariesByThread[threadId];
    if (cachedSummary) {
      return { success: true, data: { summary: cachedSummary } };
    }

    set((state) => ({
      summaryLoadingByThread: {
        ...state.summaryLoadingByThread,
        [threadId]: true,
      },
    }));

    try {
      const response =
        await apiAI.summarizeEmail(subject, content) as SummarizeEmailResult;

      if (response?.success && response.data?.summary) {
        set((state) => ({
          summariesByThread: {
            ...state.summariesByThread,
            [threadId]: response.data!.summary,
          },
        }));
      }

      return response;
    } catch (error) {
      console.error("Error summarizing email:", error);
      return { success: false, message: "Failed to generate summary." };
    } finally {
      set((state) => ({
        summaryLoadingByThread: {
          ...state.summaryLoadingByThread,
          [threadId]: false,
        },
      }));
    }
  },
}));

interface State {
  summariesByThread: Record<string, string>;
  summaryLoadingByThread: Record<string, boolean>;
  getcategorizeInitialEmails: (limit: number) => Promise<CategorizeInitialEmailsResult>;
  summarizeEmail: (threadId: string, subject: string, content: string) => Promise<SummarizeEmailResult>;
}
