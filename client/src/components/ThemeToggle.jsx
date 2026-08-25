import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { themeMode, setThemeMode, isDarkMode } = useTheme();

  return (
    <div
      className={`p-1 rounded-xl border flex items-center gap-1 transition-colors ${
        isDarkMode
          ? "bg-zinc-900/90 border-zinc-800"
          : "bg-white border-slate-200/90 shadow-xs"
      }`}
    >
      <button
        onClick={() => setThemeMode("light")}
        title="Light Mode"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          themeMode === "light"
            ? "bg-indigo-600 text-white shadow-xs"
            : isDarkMode
            ? "text-zinc-400 hover:text-zinc-200"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setThemeMode("dark")}
        title="Dark Mode"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          themeMode === "dark"
            ? "bg-indigo-600 text-white shadow-xs"
            : isDarkMode
            ? "text-zinc-400 hover:text-zinc-200"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setThemeMode("system")}
        title="System Preference"
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
          themeMode === "system"
            ? "bg-indigo-600 text-white shadow-xs"
            : isDarkMode
            ? "text-zinc-400 hover:text-zinc-200"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}