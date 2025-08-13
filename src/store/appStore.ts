import { create } from 'zustand';

interface AppState {
  // Loading states
  isUploading: boolean;
  isRecognizing: boolean;
  isSaving: boolean;
  
  // Current operation data
  currentSketch: any | null;
  recognitionResult: any | null;
  
  // UI state
  sidebarOpen: boolean;
  currentPage: string;
  
  // Actions
  setUploading: (loading: boolean) => void;
  setRecognizing: (loading: boolean) => void;
  setSaving: (loading: boolean) => void;
  setCurrentSketch: (sketch: any) => void;
  setRecognitionResult: (result: any) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  clearAllData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isUploading: false,
  isRecognizing: false,
  isSaving: false,
  currentSketch: null,
  recognitionResult: null,
  sidebarOpen: false,
  currentPage: 'dashboard',

  // Actions
  setUploading: (loading: boolean) => set({ isUploading: loading }),
  setRecognizing: (loading: boolean) => set({ isRecognizing: loading }),
  setSaving: (loading: boolean) => set({ isSaving: loading }),
  
  setCurrentSketch: (sketch: any) => set({ currentSketch: sketch }),
  setRecognitionResult: (result: any) => set({ recognitionResult: result }),
  
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setCurrentPage: (page: string) => set({ currentPage: page }),
  
  clearAllData: () => set({
    currentSketch: null,
    recognitionResult: null,
    isUploading: false,
    isRecognizing: false,
    isSaving: false,
  }),
}));