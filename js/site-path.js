export function getSiteBase() {
  if (typeof window !== "undefined" && window.__BLUEPRINT_BASE__ != null) {
    return String(window.__BLUEPRINT_BASE__).replace(/\/$/, "");
  }

  const meta = document.querySelector('meta[name="blueprint-base"]');
  const raw = meta?.getAttribute("content");
  if (!raw) return "";
  return raw.replace(/\/$/, "");
}

export function sitePath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getSiteBase();
  return base ? `${base}${normalized}` : normalized;
}
