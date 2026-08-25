import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Saved mode: "light" | "dark" | "system"
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("app-theme") || "system";
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (themeMode === "dark") {
        isDark = true;
      } else if (themeMode === "light") {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      setIsDarkMode(isDark);
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();
    localStorage.setItem("app-theme", themeMode);

    const handleSystemChange = (e) => {
      if (themeMode === "system") {
        setIsDarkMode(e.matches);
        if (e.matches) root.classList.add("dark");
        else root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);