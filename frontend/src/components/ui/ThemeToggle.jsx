import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-105 dark:border-slate-700/60 dark:bg-gray-900/40 dark:text-slate-200 dark:hover:bg-gray-900 group overflow-hidden"
            aria-label="Toggle dark mode"
        >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-180'}`}>
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'opacity-0 scale-75 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
                <Sun className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        </button>
    );
}
