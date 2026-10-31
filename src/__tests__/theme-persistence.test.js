import { act, renderHook } from "@testing-library/react";
import useTheme, { initializeTheme } from "../useTheme";

beforeEach(() => {
  localStorage.removeItem("modoOscuroActivo");
  document.documentElement.removeAttribute("data-theme");
});

test.each([["false", "light"], ["true", "dark"]])("startup preserves saved preference %s", (saved, theme) => {
  localStorage.setItem("modoOscuroActivo", saved);
  initializeTheme();
  expect(document.documentElement.getAttribute("data-theme")).toBe(theme);
  expect(localStorage.getItem("modoOscuroActivo")).toBe(saved);
});

test("defaults to dark without overwriting storage", () => {
  initializeTheme();
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(localStorage.getItem("modoOscuroActivo")).toBeNull();
});

test("toggled theme survives reinitialization and remount", () => {
  const first = renderHook(() => useTheme());
  act(() => first.result.current.toggleTheme());
  expect(first.result.current.isDark).toBe(false);
  first.unmount();
  initializeTheme();
  const second = renderHook(() => useTheme());
  expect(second.result.current.isDark).toBe(false);
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  act(() => second.result.current.toggleTheme());
  second.unmount();
  initializeTheme();
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});
