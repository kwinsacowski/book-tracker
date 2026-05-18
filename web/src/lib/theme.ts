export type ThemeColors = {
  background: string;
  foreground: string;
  surface: string;
  surfaceStrong: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  navStart: string;
  navEnd: string;
};

export type ThemeSettings = {
  activeThemeId: string;
  colors: ThemeColors;
};

export const THEME_STORAGE_KEY = "inkling-theme-settings";

export const DEFAULT_THEME_COLORS: ThemeColors = {
  background: "#efe7da",
  foreground: "#1f2520",
  surface: "#fffaf2",
  surfaceStrong: "#fffdf8",
  primary: "#2f3e34",
  primaryHover: "#243129",
  secondary: "#5f7a61",
  accent: "#c2a878",
  navStart: "#425347",
  navEnd: "#2f3e34",
};

export const THEME_PRESETS = [
  {
    id: "inkling-classic",
    name: "Inkling Classic",
    colors: DEFAULT_THEME_COLORS,
  },
  {
    id: "midnight-library",
    name: "Midnight Library",
    colors: {
      background: "#171c24",
      foreground: "#f3eadb",
      surface: "#232b36",
      surfaceStrong: "#2d3542",
      primary: "#d4af7a",
      primaryHover: "#b88e5c",
      secondary: "#8197a8",
      accent: "#c89b6d",
      navStart: "#111722",
      navEnd: "#202938",
    },
  },
  {
    id: "rose-parchment",
    name: "Rose Parchment",
    colors: {
      background: "#f7e9e4",
      foreground: "#33201f",
      surface: "#fff8f4",
      surfaceStrong: "#ffffff",
      primary: "#7a3f45",
      primaryHover: "#5e2f35",
      secondary: "#a8666f",
      accent: "#d8a48f",
      navStart: "#7a3f45",
      navEnd: "#4b252a",
    },
  },
  {
    id: "forest-magic",
    name: "Forest Magic",
    colors: {
      background: "#e7efe3",
      foreground: "#17251b",
      surface: "#f7fbf3",
      surfaceStrong: "#ffffff",
      primary: "#24452d",
      primaryHover: "#183320",
      secondary: "#5d7f47",
      accent: "#b8a557",
      navStart: "#31513a",
      navEnd: "#17251b",
    },
  },
];

export function getDefaultThemeSettings(): ThemeSettings {
  return {
    activeThemeId: "inkling-classic",
    colors: DEFAULT_THEME_COLORS,
  };
}

export function getThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") {
    return getDefaultThemeSettings();
  }

  const raw = localStorage.getItem(THEME_STORAGE_KEY);

  if (!raw) {
    return getDefaultThemeSettings();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ThemeSettings>;

    return {
      activeThemeId: parsed.activeThemeId ?? "inkling-classic",
      colors: {
        ...DEFAULT_THEME_COLORS,
        ...(parsed.colors ?? {}),
      },
    };
  } catch {
    return getDefaultThemeSettings();
  }
}

export function applyThemeColors(colors: ThemeColors) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--surface", colors.surface);
  root.style.setProperty("--surface-strong", colors.surfaceStrong);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-hover", colors.primaryHover);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--nav-start", colors.navStart);
  root.style.setProperty("--nav-end", colors.navEnd);
}

export function saveThemeSettings(settings: ThemeSettings) {
  if (typeof window === "undefined") return;

  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  applyThemeColors(settings.colors);
  window.dispatchEvent(new Event("theme-settings-change"));
}

export function resetThemeSettings() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(THEME_STORAGE_KEY);
  applyThemeColors(DEFAULT_THEME_COLORS);
  window.dispatchEvent(new Event("theme-settings-change"));
}