import { create } from "zustand";

export const useUIStore = create<State>((set) => ({
  loading: false,
  loadingList: false,
  sidebarOpen: true,
  emailDetailOpen: false,
  showMailList: true, 
  isSmallScreen: false,
  error: null,
  message: null,
  setLoading: (v) => set({ loading: v }),
  setError: (msg) => set({ error: msg }),
  setMessage: (msg) => set({ message: msg }),
  setLoadingList: (v) => set({ loadingList: v }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setEmailDetailOpen: (v) => set({ emailDetailOpen: v }),
  setShowMailList: (v) => set({ showMailList: v }),
  setIsSmallScreen: (v) => set((state) => ({ isSmallScreen: v }))
}));

interface State {
  loading: boolean;
  error: string | null;
  message: string | null;
  loadingList: boolean;
  sidebarOpen: boolean;
  emailDetailOpen: boolean;
  showMailList: boolean;
  isSmallScreen: boolean;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setMessage: (msg: string | null) => void;
  setLoadingList: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  setEmailDetailOpen: (v: boolean) => void;
  setShowMailList: (v: boolean) => void;
  setIsSmallScreen: (v: boolean) => void;
}