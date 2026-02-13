import { apiEmail } from "@repo/api-client/apis";
import { create } from "zustand";
import { useUIStore } from "./useUIStore";

const { setLoading, setError, setLoadingList } = useUIStore.getState();
const EMAIL_CACHE_TTL_MS = 5 * 60 * 1000;

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

type GetEmailsOptions = {
  forceRefresh?: boolean;
};

interface State {
  emails: Email[];
  allEmails: Email[];
  emailsByFolder: Record<string, Email[]>;
  lastFetchedAtByFolder: Record<string, number>;
  selectedThread: selectedEmail | null;
  setEmails: (
    updater: Email[] | ((previousEmails: Email[]) => Email[]),
    folder?: string
  ) => void;
  clearEmails: () => void;
  selectedEmail: { threadId: string; message: Email[] } | null;
  setSelectedThread: (email: selectedEmail | null) => void;
  clearSelectedEmail: () => void;
  getEmails: (filter: string, options?: GetEmailsOptions) => Promise<Email[]>;
  getFullEmail: (threadId: string) => Promise<Email>;
  filterEmails: (category: string) => void;
  getRecentEmails: (since: number) => Promise<Email[]>;
  archiveThread: (threadId: string) => Promise<any>;
  unarchiveThread: (threadId: string) => Promise<any>;
  trashThread: (threadId: string) => Promise<any>;
  starThread: (threadId: string) => Promise<any>;
  unstarThread: (threadId: string) => Promise<any>;
  sendEmail: (payload: { to: string; subject: string; body: string }) => Promise<any>;
}

export const useEmailStore = create<State>((set, get) => ({
  emails: [],
  allEmails: [],
  emailsByFolder: {},
  lastFetchedAtByFolder: {},
  selectedThread: null,
  setEmails: (updater, folder = "inbox") => {
    set((state) => {
      const nextEmails =
        typeof updater === "function"
          ? updater(state.emails)
          : updater;
      return {
        emails: nextEmails,
        allEmails: nextEmails,
        emailsByFolder: {
          ...state.emailsByFolder,
          [folder]: nextEmails,
        },
        lastFetchedAtByFolder: {
          ...state.lastFetchedAtByFolder,
          [folder]: Date.now(),
        },
      };
    });
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
  getEmails: async (filter, options = {}) => {
    const folder = filter || "inbox";
    const { forceRefresh = false } = options;

    const state = get();
    const cachedEmails = state.emailsByFolder[folder];
    const lastFetchedAt = state.lastFetchedAtByFolder[folder] || 0;
    const isCacheFresh = Date.now() - lastFetchedAt < EMAIL_CACHE_TTL_MS;

    if (!forceRefresh && cachedEmails && isCacheFresh) {
      set({ emails: cachedEmails, allEmails: cachedEmails });
      return cachedEmails;
    }

    try {
      setLoadingList(true);
      const res = await apiEmail.getEmails(folder);
      console.log("Fetched emails:", res);
      set((currentState) => ({
        emails: res,
        allEmails: res,
        emailsByFolder: {
          ...currentState.emailsByFolder,
          [folder]: res,
        },
        lastFetchedAtByFolder: {
          ...currentState.lastFetchedAtByFolder,
          [folder]: Date.now(),
        },
      }));
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
    const state = get();
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
      set((state) => {
        const pruneThread = (list: Email[]) =>
          list.filter((email) => email.threadId !== threadId);

        const nextEmailsByFolder = Object.fromEntries(
          Object.entries(state.emailsByFolder).map(([folder, list]) => [
            folder,
            pruneThread(list),
          ])
        ) as Record<string, Email[]>;

        return {
          emails: pruneThread(state.emails),
          allEmails: pruneThread(state.allEmails),
          emailsByFolder: nextEmailsByFolder,
          lastFetchedAtByFolder: {
            ...state.lastFetchedAtByFolder,
            inbox: 0,
            archive: 0,
          },
        };
      });
      return res;
    } catch (error) {
      console.error("Failed to archive thread", error);
      setError("Failed to archive thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  unarchiveThread: async (threadId: string) => {
    try {
      setLoading(true);
      const res = await apiEmail.unarchiveThread(threadId);
      console.log("Unarchived thread:", res);
      set((state) => {
        const pruneThread = (list: Email[]) =>
          list.filter((email) => email.threadId !== threadId);

        const nextEmailsByFolder = Object.fromEntries(
          Object.entries(state.emailsByFolder).map(([folder, list]) => [
            folder,
            pruneThread(list),
          ])
        ) as Record<string, Email[]>;

        return {
          emails: pruneThread(state.emails),
          allEmails: pruneThread(state.allEmails),
          emailsByFolder: nextEmailsByFolder,
          lastFetchedAtByFolder: {
            ...state.lastFetchedAtByFolder,
            inbox: 0,
            archive: 0,
          },
        };
      });
      return res;
    } catch (error) {
      console.error("Failed to unarchive thread", error);
      setError("Failed to unarchive thread");
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
      set((state) => {
        const pruneThread = (list: Email[]) =>
          list.filter((email) => email.threadId !== threadId);

        const nextEmailsByFolder = Object.fromEntries(
          Object.entries(state.emailsByFolder).map(([folder, list]) => [
            folder,
            pruneThread(list),
          ])
        ) as Record<string, Email[]>;

        return {
          emails: pruneThread(state.emails),
          allEmails: pruneThread(state.allEmails),
          emailsByFolder: nextEmailsByFolder,
        };
      });
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
      set((state) => ({
        lastFetchedAtByFolder: {
          ...state.lastFetchedAtByFolder,
          starred: 0,
        },
      }));
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
      set((state) => ({
        lastFetchedAtByFolder: {
          ...state.lastFetchedAtByFolder,
          starred: 0,
        },
      }));
      return res;
    } catch (error) {
      console.error("Failed to unstar thread", error);
      setError("Failed to unstar thread");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  sendEmail: async (payload) => {
    try {
      setLoading(true);
      const res = await apiEmail.sendEmail(payload);
      return res;
    } catch (error) {
      console.error("Failed to send email", error);
      setError("Failed to send email");
      throw error;
    } finally {
      setLoading(false);
    }
  },
}));
