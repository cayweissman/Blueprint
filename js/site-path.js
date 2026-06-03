function resolveSiteBase() {
  const meta = document.querySelector('meta[name="blueprint-base"]');
  const metaBase = (meta?.getAttribute("content") || "").replace(/\/$/, "");
  const configured =
    typeof window !== "undefined" && window.__BLUEPRINT_BASE__ != null
      ? String(window.__BLUEPRINT_BASE__).replace(/\/$/, "")
      : metaBase;

  if (!configured || typeof window === "undefined") return configured;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === configured || path.startsWith(`${configured}/`)) {
    return configured;
  }

  return "";
}

export function getSiteBase() {
  return resolveSiteBase();
}

export function sitePath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getSiteBase();
  return base ? `${base}${normalized}` : normalized;
}
