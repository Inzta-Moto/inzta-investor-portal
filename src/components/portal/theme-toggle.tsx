"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { MoonIcon, SunIcon } from "@/components/icons";
import { THEME_COOKIE, THEME_MAX_AGE_SECONDS, type Theme } from "@/lib/theme";

// Matches --c-bg in globals.css, so the browser bar follows the chosen theme rather than the device setting.
const BAR_COLOR: Record<Theme, string> = { light: "#ffffff", dark: "#0c0a09" };

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeDevice(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function deviceTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function paintBar(theme: Theme) {
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) meta.content = BAR_COLOR[theme];
}

function apply(theme: Theme) {
  // Every colour token changes at once; without this, hover and border transitions smear the switch.
  const pause = document.createElement("style");
  pause.textContent = "*,*::before,*::after{transition:none !important}";
  document.head.appendChild(pause);
  document.documentElement.dataset.theme = theme;
  void document.body.offsetHeight;
  requestAnimationFrame(() => pause.remove());
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_MAX_AGE_SECONDS}; samesite=lax`;
  paintBar(theme);
}

/**
 * Light or dark, chosen by the investor and kept for a year. Until a choice is stored the portal follows the device,
 * so the control shows the device's theme as the current one.
 */
export function ThemeToggle({ initial, variant }: { initial: Theme | null; variant: "segmented" | "icon" }) {
  const [choice, setChoice] = useState<Theme | null>(initial);
  // Null on the server, where the device setting is unknown; the pressed state appears after hydration.
  const device = useSyncExternalStore(subscribeDevice, deviceTheme, () => null);
  const theme = choice ?? device;

  useEffect(() => {
    if (initial) paintBar(initial);
  }, [initial]);

  const choose = (next: Theme) => {
    apply(next);
    setChoice(next);
  };

  if (variant === "icon") {
    const next: Theme = theme === "dark" ? "light" : "dark";
    return (
      <button
        type="button"
        onClick={() => choose(next)}
        aria-label={next === "dark" ? "Pakai tema gelap" : "Pakai tema terang"}
        className="grid size-11 place-items-center rounded-[10px] text-ink-2 hover:bg-surface-sunk hover:text-ink"
      >
        {next === "dark" ? <MoonIcon /> : <SunIcon />}
      </button>
    );
  }

  const option = (value: Theme, label: string, Icon: typeof SunIcon) => (
    <button
      type="button"
      aria-pressed={theme === value}
      onClick={() => choose(value)}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold ${
        theme === value ? "bg-surface text-ink shadow-sm" : "text-ink-2 hover:text-ink"
      }`}
    >
      <Icon className="size-[18px]" />
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Tema tampilan" className="grid grid-cols-2 gap-1 rounded-[10px] border border-line bg-surface-sunk p-1">
      {option("light", "Terang", SunIcon)}
      {option("dark", "Gelap", MoonIcon)}
    </div>
  );
}
