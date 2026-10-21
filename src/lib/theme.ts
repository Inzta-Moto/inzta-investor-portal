// The investor's light or dark choice lives in a cookie, so the server renders the right theme on the first paint.
// No cookie means "follow the device" through prefers-color-scheme in globals.css.

export const THEME_COOKIE = "inzta_theme";
export const THEME_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export type Theme = "light" | "dark";

export function parseTheme(value: string | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}
