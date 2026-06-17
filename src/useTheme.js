import { useCallback, useSyncExternalStore } from "react";

/**
 * useTheme — Gestión de tema (dark/light) para QuickFood.
 *
 * Reemplaza useDynamicColors() + window.location.reload().
 * Aplica data-theme="dark"|"light" al <html> para que los
 * CSS custom properties de _theme.scss funcionen sin page reload.
 *
 * Usa un store externo compartido (módulo) para que TODOS los
 * switches de tema de la app (sidebar, chat, etc.) se mantengan
 * sincronizados y se re-rendericen juntos al cambiar el tema.
 * También sincroniza entre pestañas vía el evento `storage`.
 *
 * Default: dark mode (modoOscuroActivo = true cuando localStorage es null).
 */
const STORAGE_KEY = "modoOscuroActivo";

const getIsDark = () => {
  if (typeof localStorage === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
};

const applyTheme = (isDark) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }
};

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

const setIsDark = (next) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(next));
  }
  applyTheme(next);
  notify();
};

// Sincronización entre pestañas/ventanas.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      applyTheme(getIsDark());
      notify();
    }
  });
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const useTheme = () => {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => true);

  const toggleTheme = useCallback(() => {
    setIsDark(!getIsDark());
  }, []);

  return { isDark, toggleTheme };
};

export default useTheme;
