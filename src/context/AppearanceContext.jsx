import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const AppearanceContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freshfold-laundry-management-system.onrender.com"
).replace(/\/$/, "");

const DEFAULT_SETTINGS = {
  theme: "Light",
  primaryColor: "Blue",
  layout: "Comfortable",
  fontSize: "Medium",
  language: "English",
};

const COLORS = {
  Blue: "#1976d2",
  Green: "#2e7d32",
  Purple: "#7b1fa2",
  Orange: "#ed6c02",
  Red: "#d32f2f",
};

function getAuthToken() {
  try {
    const auth = JSON.parse(sessionStorage.getItem("auth") || "null");
    return auth?.token || null;
  } catch {
    return null;
  }
}

export function AppearanceProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  const refreshAppearance = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setLoaded(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/settings/appearance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load appearance preferences.");
      }

      const data = await response.json();

      if (data.settings) {
        setSettings((previous) => ({
          ...previous,
          ...data.settings,
        }));
      }
    } catch (error) {
      console.error("Appearance preferences could not be loaded:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshAppearance();
  }, [refreshAppearance]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const mode =
    settings.theme === "Dark" ||
    (settings.theme === "System" && systemDark)
      ? "dark"
      : "light";

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: COLORS[settings.primaryColor] || COLORS.Blue,
          },
          background:
            mode === "dark"
              ? {
                  default: "#121212",
                  paper: "#1e1e1e",
                }
              : {
                  default: "#f5f7fb",
                  paper: "#ffffff",
                },
        },
        typography: {
          fontSize:
            settings.fontSize === "Small"
              ? 12
              : settings.fontSize === "Large"
                ? 16
                : 14,
        },
        shape: {
          borderRadius: settings.layout === "Compact" ? 6 : 10,
        },
      }),
    [mode, settings.primaryColor, settings.fontSize, settings.layout]
  );

  const saveAppearance = useCallback(async (newSettings) => {
    const token = getAuthToken();

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(`${API_URL}/api/settings/appearance`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSettings),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Unable to save appearance settings.");
    }

    setSettings((previous) => ({
      ...previous,
      ...(data.settings || newSettings),
    }));

    return data;
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      saveAppearance,
      refreshAppearance,
      loaded,
    }),
    [settings, saveAppearance, refreshAppearance, loaded]
  );

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error(
      "useAppearance must be used inside AppearanceProvider."
    );
  }

  return context;
}