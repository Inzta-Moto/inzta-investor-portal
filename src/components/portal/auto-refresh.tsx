"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const INTERVAL_MS = 30_000;
// A tab left open on a desktop counts as visible all day; stopping after this long without input keeps Firestore reads
// (shared quota with the internal dashboard) bounded.
const IDLE_AFTER_MS = 15 * 60_000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

function useOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

/**
 * Re-renders the server components every 30 seconds while the tab is visible and the investor has used the page in
 * the last 15 minutes, and right away when they come back to the tab, touch an idle page, or the connection returns
 * (ADR-0006). Hidden or idle tabs do not poll, which keeps Firestore reads low.
 */
export function AutoRefresh({ updatedAt }: { updatedAt: string }) {
  const router = useRouter();
  const online = useOnline();
  const [idle, setIdle] = useState(false);
  const lastActive = useRef(0);

  useEffect(() => {
    lastActive.current = Date.now();
    const canRefresh = () => document.visibilityState === "visible" && navigator.onLine;
    const tick = () => {
      if (Date.now() - lastActive.current >= IDLE_AFTER_MS) setIdle(true);
      else if (canRefresh()) router.refresh();
    };
    const activity = () => {
      const wasIdle = Date.now() - lastActive.current >= IDLE_AFTER_MS;
      lastActive.current = Date.now();
      if (wasIdle) {
        setIdle(false);
        if (canRefresh()) router.refresh();
      }
    };
    const resume = () => {
      lastActive.current = Date.now();
      setIdle(false);
      if (canRefresh()) router.refresh();
    };
    const timer = window.setInterval(tick, INTERVAL_MS);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    for (const name of ACTIVITY_EVENTS) window.addEventListener(name, activity, { passive: true });
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
      for (const name of ACTIVITY_EVENTS) window.removeEventListener(name, activity);
    };
  }, [router]);

  const live = online && !idle;
  return (
    <p role="status" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3">
      <span className={`size-2 rounded-full ${live ? "bg-good" : "bg-warn"}`} aria-hidden="true" />
      {!online
        ? `Terputus · data per ${updatedAt} WIB`
        : idle
          ? `Data per ${updatedAt} WIB · sentuh layar untuk memperbarui`
          : `Data langsung · diperbarui ${updatedAt} WIB`}
    </p>
  );
}

const RETRY_MS = 5 * 60_000;

/**
 * On the "data not ready" page, such as an exhausted Firestore read quota, retries every 5 minutes while the tab is
 * visible and right away when the investor returns to it, so the data appears once reads are allowed again without a
 * manual reload. A refused read is not billed, and the longer interval keeps retries few.
 */
export function RetryWhenReady() {
  const router = useRouter();
  useEffect(() => {
    const retry = () => {
      if (document.visibilityState === "visible" && navigator.onLine) router.refresh();
    };
    const timer = window.setInterval(retry, RETRY_MS);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [router]);
  return null;
}
