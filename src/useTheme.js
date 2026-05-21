import { useCallback, useEffect, useState } from "react";

/**
 * useTheme — Gestión de tema (dark/light) para QuickFood.
 *
 * Reemplaza useDynamicColors() + window.location.reload().
 * Aplica data-theme="dark"|"light" al <html> para que los
 * CSS custom properties de _theme.scss funcionen sin page reload.
 *
 * Default: dark mode (modoOscuroActivo = true cuando localStorage es null).
 */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("modoOscuroActivo");
    return stored === null ? true : stored === "true";
  });

  // Aplica el atributo data-theme al <html> cada vez que cambia isDark
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("modoOscuroActivo", String(next));
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
};

export default useTheme;
