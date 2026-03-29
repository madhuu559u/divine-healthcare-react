import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: parseInt(localStorage.getItem('dh-theme') || '1'),
  setTheme: (theme) => {
    localStorage.setItem('dh-theme', theme.toString());
    set({ theme });
  },
}));

export default useThemeStore;
