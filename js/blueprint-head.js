(function () {
  const meta = document.querySelector('meta[name="blueprint-base"]');
  const base = (meta?.getAttribute("content") || "").replace(/\/$/, "");
  window.__BLUEPRINT_BASE__ = base;

  const saved = sessionStorage.getItem("blueprint-spa-redirect");
  if (saved) {
    sessionStorage.removeItem("blueprint-spa-redirect");
    history.replaceState(null, "", saved);
  }

  function bp(path) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return base ? `${base}${normalized}` : normalized;
  }

  const cacheVersion = document.currentScript?.dataset?.cache || "20260602-105";

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = bp(`/styles.css?v=${cacheVersion}`);
  document.head.appendChild(stylesheet);

  for (const src of ["/js/vendor/p5.min.js", "/js/vendor/vanta.topology.min.js"]) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = bp(src);
    document.head.appendChild(script);
  }

  const app = document.createElement("script");
  app.type = "module";
  app.src = bp(`/js/app.js?v=${cacheVersion}`);
  document.head.appendChild(app);
})();
