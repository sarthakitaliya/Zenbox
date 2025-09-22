import { apiEmail } from "@repo/api-client/apis";
import { create } from "zustand";
import { useUIStore } from "./useUIStore";

const { setLoading, setError, setLoadingList } = useUIStore.getState();

export interface Email {
  threadId: string;
  messageCount: number;
  categoryName?: string;
  latest: {
    from: string;
    subject: string;
    snippet: string;
    date: string;
    category: string;
    read: boolean;
    body?: {
      content: string;
      contentType: string;
    };
    profileImage?: string;
    senderEmail?: string;
    senderName?: string;
    to: string;
  };
}
interface threadEmail {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category: string;
  labelIds: string[];
  body?: {
    content: string;
    contentType: string;
  };
  profileImage?: string;
  senderEmail?: string;
  senderName?: string;
  to: string;
}
interface selectedEmail {
  threadId: string;
  subject: string;
  messageCount: number;
  categoryIcon?: string;
  messages: threadEmail[];
}
interface State {
  emails: Email[];
  allEmails: Email[];
  selectedThread: selectedEmail | null;
  setEmails: (emails: Email[]) => void;
  clearEmails: () => void;
  selectedEmail: { threadId: string; message: Email[] } | null;
  setSelectedThread: (email: selectedEmail | null) => void;
  clearSelectedEmail: () => void;
  getEmails: (filter: string) => Promise<Email[]>;
  getFullEmail: (threadId: string) => Promise<Email>;
  filterEmails: (category: string) => void;
  getRecentEmails: (since: number) => Promise<Email[]>;
  archiveThread: (threadId: string) => Promise<any>;
  trashThread: (threadId: string) => Promise<any>;
  starThread: (threadId: string) => Promise<any>;
  unstarThread: (threadId: string) => Promise<any>;
}

export const useEmailStore = create<State>((set) => ({
  emails: [],
  allEmails: [],
  selectedThread: null,
  setEmails: (emails) => {
    console.log("Setting emails:", emails);
    set({ emails, allEmails: emails });
  },
  clearEmails: () => {
    console.log("Clearing emails");
    set({ emails: [] });
    set({ selectedEmail: null });
  },
  selectedEmail: null,
  setSelectedThread: (email) => {
    console.log("Setting selected thread:", email);

    set({ selectedThread: email });
  },
  clearSelectedEmail: () => {
    console.log("Clearing selected email");
    set({ selectedEmail: null });
  },
  getEmails: async (filter) => {
    try {
      setLoadingList(true);
      const res = await apiEmail.getEmails(filter);
      console.log("Fetched emails:", res);
      set({ emails: res, allEmails: res });
      return res;
    } catch (error) {
      console.error("Failed to fetch emails", error);
      setError("Failed to fetch emails");
      throw error;
    } finally {
      setLoadingList(false);
    }
  },
  getFullEmail: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.getFullEmail(threadId);
      console.log("Fetched full email:", res);

      // Update both selectedEmail and mark the email as read in the list
      set({ selectedThread: res });

      return res;
    } catch (error) {
      console.error("Failed to fetch full email", error);
      setError("Failed to fetch full email");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  filterEmails: (category) => {
    const state = useEmailStore.getState();
    if (category === "all" || !category) {
      set({ emails: state.allEmails });
      return;
    }
    const filtered = state.allEmails.filter(
      (email) => email.categoryName === category
    );
    set({ emails: filtered });
  },
  getRecentEmails: async (since: number) => {
    try {
      const res = await apiEmail.getRecentEmails(since);
      console.log("Fetched recent emails:", res);
      return res;
    } catch (error) {
      console.error("Failed to fetch recent emails", error);
      setError("Failed to fetch recent emails");
      throw error;
    } finally {
      setLoadingList(false);
    }
  },
  archiveThread: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.archiveThread(threadId);
      console.log("Archived thread:", res);
      set((state) => ({
        emails: state.emails.filter((email) => email.threadId !== threadId),
        allEmails: state.allEmails.filter(
          (email) => email.threadId !== threadId
        ),
      }));
      return res;
    } catch (error) {
      console.error("Failed to archive thread", error);
      setError("Failed to archive thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  trashThread: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.trashThread(threadId);
      console.log("Trashed thread:", res);
      set((state) => ({
        emails: state.emails.filter((email) => email.threadId !== threadId),
        allEmails: state.allEmails.filter(
          (email) => email.threadId !== threadId
        ),
      }));
      return res;
    } catch (error) {
      console.error("Failed to trash thread", error);
      setError("Failed to trash thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  starThread: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.starThread(threadId);
      console.log("Starred thread:", res);
      return res;
    } catch (error) {
      console.error("Failed to star thread", error);
      setError("Failed to star thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  unstarThread: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.unstarThread(threadId);
      console.log("Unstarred thread:", res);
      return res;
    } catch (error) {
      console.error("Failed to unstar thread", error);
      setError("Failed to unstar thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
}));
