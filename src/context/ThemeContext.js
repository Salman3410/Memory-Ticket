import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

const THEME_KEY = "memento_theme";

const themes = {
  light: {
    mode: "light",
    colors: {
      background: "#F1F0F6",
      surface: "#FFFFFF",
      surfaceSecondary: "#F1F0F6",
      text: "#242424",
      textSecondary: "#707080",
      textMuted: "#9A99A5",
      border: "#D9D8E2",
      primary: "#34345C",
      primaryText: "#FFFFFF",
      accent: "#E76F51",
      icon: "#34345C",
      iconMuted: "#9A99A5",
      input: "#FFFFFF",
      danger: "#D9534F",
      divider: "#ECEBF0",
      shadow: "#000000",
    },
  },

  dark: {
    mode: "dark",
    colors: {
      background: "#171624",
      surface: "#211F30",
      surfaceSecondary: "#292740",
      text: "#F7F5FC",
      textSecondary: "#C4C0D0",
      textMuted: "#9792AA",
      border: "#39364D",
      primary: "#C8C2FF",
      primaryText: "#25223D",
      accent: "#FF8E72",
      icon: "#D7D2E6",
      iconMuted: "#9792AA",
      input: "#252333",
      danger: "#FF7772",
      divider: "#363248",
      shadow: "#000000",
    },
  },
};

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (mounted && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.warn("Unable to load saved theme:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setTheme = useCallback(async (mode) => {
    if (mode !== "light" && mode !== "dark") {
      return;
    }

    // Update the interface immediately.
    setThemeMode(mode);

    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.warn("Unable to save theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    return setTheme(themeMode === "dark" ? "light" : "dark");
  }, [themeMode, setTheme]);

  const theme = themes[themeMode];

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      isDark: themeMode === "dark",
      setTheme,
      toggleTheme,
      loading,
    }),
    [theme, themeMode, setTheme, toggleTheme, loading],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
