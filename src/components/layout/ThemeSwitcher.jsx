import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../store/useThemeStore';
import { THEME_NAMES } from '../../utils/constants';

const themeColors = [
  { primary: '#0D7377', accent: '#D4A843' },
  { primary: '#2D5A3D', accent: '#B87333' },
  { primary: '#1B3A5C', accent: '#F59E0B' },
  { primary: '#722F37', accent: '#D4A373' },
  { primary: '#7C9A82', accent: '#E8C4B8' },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-0 p-4 rounded-2xl shadow-xl min-w-[200px]"
            style={{ background: 'var(--white)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>Color Theme</span>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-black/5"><X size={14} /></button>
            </div>
            <div className="space-y-2">
              {themeColors.map((colors, i) => (
                <button key={i} onClick={() => setTheme(i + 1)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${theme === i + 1 ? 'ring-2' : 'hover:bg-black/5'}`}
                  style={theme === i + 1 ? { background: 'var(--bg-alt)', ringColor: 'var(--primary)' } : {}}>
                  <div className="w-8 h-8 rounded-full overflow-hidden flex shrink-0">
                    <div className="w-1/2 h-full" style={{ background: colors.primary }} />
                    <div className="w-1/2 h-full" style={{ background: colors.accent }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-main)' }}>{THEME_NAMES[i]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: 'var(--primary)' }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change color theme"
      >
        <Settings size={22} />
      </motion.button>
    </div>
  );
}
