"use client";

import { useEffect } from "react";
import { applyThemeColors, getThemeSettings } from "../lib/theme"

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    applyThemeColors(getThemeSettings().colors);

    function handleThemeChange() {
      applyThemeColors(getThemeSettings().colors);
    }

    window.addEventListener("theme-settings-change", handleThemeChange);

    return () => {
      window.removeEventListener("theme-settings-change", handleThemeChange);
    };
  }, []);

  return <>{children}</>;
}