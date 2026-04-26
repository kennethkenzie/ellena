"use client";

import { useEffect, useState } from "react";
import { apiGetSettings, API_ORIGIN, type ApiSiteSettings } from "./api";

let cached: ApiSiteSettings | null = null;
const listeners: Array<(s: ApiSiteSettings) => void> = [];

function subscribe(fn: (s: ApiSiteSettings) => void) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i !== -1) listeners.splice(i, 1);
  };
}

function notify(s: ApiSiteSettings) {
  cached = s;
  listeners.forEach((fn) => fn(s));
}

let fetching = false;

function ensureFetched() {
  if (cached || fetching) return;
  fetching = true;
  apiGetSettings()
    .then(notify)
    .catch(() => {})
    .finally(() => { fetching = false; });
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<ApiSiteSettings | null>(cached);

  useEffect(() => {
    if (cached) { setSettings(cached); return; }
    const unsub = subscribe(setSettings);
    ensureFetched();
    return unsub;
  }, []);

  return settings;
}

export function logoSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return API_ORIGIN + url;
}
