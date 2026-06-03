import { holdingTheses } from "./holding-theses.js";
import { aboutContent, principlesContent } from "./institutional-content.js";
import { getSiteBase, sitePath } from "./site-path.js";

const STORAGE_KEY = "blueprint-mvp-store-raw";
const AUTH_KEY = "blueprint-mvp-admin-auth";

const ADMIN_CREDENTIALS = {
  username: "blueprint",
  password: "transparency",
};

const schemaModels = [
  {
    model: "PortfolioPosition",
    fields: [
      "id",
      "ticker",
      "companyName",
      "weight",
      "shares",
      "costBasis",
      "currentPrice",
      "convictionScore",
      "thesisSlug",
      "status",
      "dateInitiated",
      "originalThesis",
      "risks",
      "createdAt",
    ],
  },
  {
    model: "ResearchArticle",
    fields: [
      "id",
      "title",
      "slug",
      "category",
      "company",
      "industry",
      "author",
      "summary",
      "body",
      "readTime",
      "publishedAt",
    ],
  },
  {
    model: "InvestorLetter",
    fields: [
      "id",
      "title",
      "slug",
      "summary",
      "body",
      "publishedAt",
    ],
  },
  {
    model: "PerformanceSnapshot",
    fields: [
      "id",
      "date",
      "portfolioValue",
      "sinceInceptionReturn",
      "annualizedReturn",
      "portfolioCagr",
      "sp500Return",
      "nasdaqReturn",
      "alpha",
      "maxDrawdown",
      "cashPosition",
      "holdingsCount",
    ],
  },
  {
    model: "PerformancePeriodReturn",
    fields: ["id", "periodType", "periodLabel", "blueprintReturn", "sp500Return", "nasdaqReturn"],
  },
  {
    model: "HoldingUpdate",
    fields: ["id", "ticker", "updateType", "title", "body", "createdAt"],
  },
  {
    model: "Principle",
    fields: ["id", "title", "body"],
  },
  {
    model: "SiteContent",
    fields: ["home", "about", "navigation", "adminNotes"],
  },
];

const seedData = {
  siteContent: {
    navigation: ["Portfolio", "Principles", "About"],
    home: {
      name: "Blueprint",
      manifesto: [],
    },
    about: {
      mission: "",
      philosophy: "",
      transparency: "",
    },
    adminNotes: [
      "This MVP starts empty by design.",
      "Edit the JSON sections below to add your own data.",
      "Use Export to download the full dataset at any time.",
    ],
  },
  positions: null,
  researchArticles: [],
  investorLetters: [],
  performanceSnapshots: [],
  performanceHistory: {
    yearly: [],
    quarterly: [],
    monthly: [],
  },
  holdingUpdates: [],
  principles: [],
};

const uiState = {
  researchSearch: "",
  researchCompany: "all",
  researchCategory: "all",
  researchDate: "all",
};

const backgroundVideos = {
  aurora: {
    company: "Aurora",
    descriptor: "Autonomous freight technology",
    type: "video",
    src: "/assets/aurora.mp4?v=3",
  },
  robinhood: {
    company: "Robinhood",
    descriptor: "Retail investing platform",
    type: "video",
    src: "/assets/robinhood-dotcom-animation.webm",
  },
  tempus: {
    company: "Tempus",
    descriptor: "Precision medicine platform",
    type: "tempus-orb",
  },
  ginkgo: {
    company: "Ginkgo",
    descriptor: "Synthetic biology platform",
    type: "video",
    src: "/assets/ginkgo-landscape.mp4?v=2",
  },
  arm: {
    company: "Arm",
    descriptor: "Semiconductor IP",
    type: "simple-animation",
  },
  oklo: {
    company: "Oklo",
    descriptor: "Advanced nuclear energy",
    type: "transparent-video-animation",
    src: "/assets/oklo-aurora-animation.mp4?v=3",
    pingPong: true,
  },
  xenergy: {
    company: "X-Energy",
    descriptor: "Modular nuclear reactors",
    type: "transparent-video-animation",
    src: "/assets/x-energy-sunrise.mp4?v=4",
    pingPong: true,
  },
  nebius: {
    company: "Nebius",
    descriptor: "AI cloud infrastructure",
    type: "transparent-video-animation",
    src: "/assets/nebius-green3-inverted.mp4?v=1",
  },
  avav: {
    company: "AeroVironment",
    descriptor: "Autonomous defense systems",
    type: "simple-animation",
  },
  symbotic: {
    company: "Symbotic",
    descriptor: "Warehouse automation systems",
    type: "simple-animation",
  },
  palantir: {
    company: "Palantir",
    descriptor: "Enterprise intelligence software",
    type: "video",
    src: "/assets/palantir-800x450.mp4",
    pingPong: true,
  },
  amazon: {
    company: "Amazon",
    descriptor: "Cloud and commerce platform",
    type: "video",
    src: "/assets/amazon-2016.mp4",
    pingPong: true,
  },
  tesla: {
    company: "Tesla",
    descriptor: "EV and energy technology",
    type: "video",
    src: "/assets/tesla-loop.mp4",
    pingPong: true,
  },
  cloudflare: {
    company: "Cloudflare",
    descriptor: "Edge network infrastructure",
    type: "simple-animation",
  },
  crispr: {
    company: "CRISPR",
    descriptor: "Gene editing therapeutics",
    type: "video",
    src: "/assets/crispr-gene-editing.mp4?v=6",
    pingPong: true,
  },
  ionq: {
    company: "IonQ",
    descriptor: "Quantum computing systems",
    type: "video",
    src: "/assets/ionq-loop.mp4",
    pingPong: true,
  },
};

const HOLDING_EYEBROWS = {
  avav: "AeroVironment",
  amazon: "Amazon",
  arm: "Arm",
  aurora: "Aurora",
  cloudflare: "Cloudflare",
  crispr: "CRISPR",
  ginkgo: "Ginkgo",
  ionq: "IonQ",
  nebius: "Nebius",
  oklo: "Oklo",
  palantir: "Palantir",
  robinhood: "Robinhood",
  symbotic: "Symbotic",
  tesla: "Tesla",
  tempus: "Tempus",
  xenergy: "X-Energy",
};

const VISIBLE_PORTFOLIO_ORDER = [
  "nebius",
  "robinhood",
  "oklo",
  "crispr",
  "xenergy",
  "aurora",
  "ginkgo",
  "tempus",
];

const HIDDEN_PORTFOLIO_KEYS = new Set([
  "avav",
  "amazon",
  "arm",
  "cloudflare",
  "ionq",
  "palantir",
  "symbotic",
  "tesla",
]);

const ALL_PORTFOLIO_HOLDINGS = [
  ...VISIBLE_PORTFOLIO_ORDER.map((key) => ({ key, eyebrow: HOLDING_EYEBROWS[key] })),
  ...Object.keys(HOLDING_EYEBROWS)
    .filter((key) => !VISIBLE_PORTFOLIO_ORDER.includes(key))
    .map((key) => ({ key, eyebrow: HOLDING_EYEBROWS[key] })),
];

const PORTFOLIO_HOLDINGS = ALL_PORTFOLIO_HOLDINGS.filter((holding) => !HIDDEN_PORTFOLIO_KEYS.has(holding.key));

const PORTFOLIO_ALLOCATIONS = {
  nebius: 16.5,
  robinhood: 16.3,
  oklo: 14.9,
  crispr: 14.4,
  xenergy: 10.6,
  aurora: 10.3,
  ginkgo: 9.9,
  tempus: 7.1,
};

const sectionVideoSequence = PORTFOLIO_HOLDINGS.map((holding) => holding.key);

const FUND_LAUNCH_LABEL = "01/20/26";
const HOLDINGS_COUNT_DEFAULT = PORTFOLIO_HOLDINGS.length;

function getHoldingAllocation(companyKey) {
  return PORTFOLIO_ALLOCATIONS[companyKey] ?? 0;
}

const companyHoldingsMeta = {
  aurora: { ticker: "AUR", category: "Autonomous freight" },
  robinhood: { ticker: "HOOD", category: "Retail investing" },
  tempus: { ticker: "TEM", category: "Precision medicine" },
  arm: { ticker: "ARM", category: "Semiconductors" },
  ginkgo: { ticker: "DNA", category: "Synthetic biology" },
  oklo: { ticker: "OKLO", category: "Advanced nuclear" },
  xenergy: { ticker: "XE", category: "Modular nuclear" },
  nebius: { ticker: "NBIS", category: "AI infrastructure" },
  symbotic: { ticker: "SYM", category: "Warehouse automation" },
  avav: { ticker: "AVAV", category: "Defense drones" },
  palantir: { ticker: "PLTR", category: "Enterprise software" },
  amazon: { ticker: "AMZN", category: "Cloud & commerce" },
  tesla: { ticker: "TSLA", category: "EV & energy" },
  cloudflare: { ticker: "NET", category: "Edge infrastructure" },
  crispr: { ticker: "CRSP", category: "Gene editing" },
  ionq: { ticker: "IONQ", category: "Quantum computing" },
};

function buildSeedPositions() {
  const createdAt = new Date().toISOString();

  return PORTFOLIO_HOLDINGS.map((holding) => {
    const meta = companyHoldingsMeta[holding.key] || { ticker: "—" };

    return {
      id: `position-${holding.key}`,
      ticker: meta.ticker,
      companyName: holding.eyebrow,
      weight: getHoldingAllocation(holding.key),
      shares: 0,
      costBasis: 0,
      currentPrice: 0,
      convictionScore: 8,
      thesisSlug: holding.key,
      status: "current",
      dateInitiated: "2026-01-20",
      originalThesis: "",
      risks: "",
      createdAt,
    };
  });
}

function normalizeStorePositions(data) {
  const defaults = buildSeedPositions();
  const defaultsByTicker = new Map(defaults.map((position) => [String(position.ticker || "").toUpperCase(), position]));

  if (!data.positions?.length) {
    data.positions = defaults;
    return data;
  }

  data.positions = data.positions.map((position) => {
    const match = defaultsByTicker.get(String(position.ticker || "").toUpperCase());
    if (!match) return position;
    return { ...position, weight: match.weight, companyName: match.companyName };
  });

  return data;
}

seedData.positions = buildSeedPositions();

function renderHoldingThesisParagraphs(paragraphs) {
  if (!paragraphs?.length) {
    return '<p class="holding-thesis-empty muted">Investment thesis for this holding is being published.</p>';
  }

  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function getPortfolioHoldingBySlug(slug) {
  const token = String(slug || "").trim();
  if (!token) return null;

  const lower = token.toLowerCase();
  const upper = token.toUpperCase();

  const holding = PORTFOLIO_HOLDINGS.find((entry) => {
    const meta = companyHoldingsMeta[entry.key] || {};
    return entry.key === lower || String(meta.ticker || "").toUpperCase() === upper;
  });

  if (!holding) return null;

  const meta = companyHoldingsMeta[holding.key] || { ticker: "—", category: "—" };
  const live = companyReturnsState.holdings[holding.key];
  const returnPct = live?.return ?? null;
  const allocation = getHoldingAllocation(holding.key);
  const contribution = returnPct != null ? (allocation * returnPct) / 100 : null;
  const thesis = holdingTheses[holding.key] || {
    paragraphs: [],
    thesisPoints: [],
  };

  return {
    key: holding.key,
    name: live?.name ?? holding.eyebrow,
    ticker: live?.symbol ?? meta.ticker,
    category: live?.category ?? meta.category,
    returnPct,
    allocation,
    contribution,
    alpha: getCompanyAlphaVsSp500(holding.key),
    startClose: live?.startClose ?? null,
    endClose: live?.endClose ?? null,
    thesisParagraphs: thesis.paragraphs || [],
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadStore() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = normalizeStorePositions(clone(seedData));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return normalizeStorePositions(JSON.parse(stored));
  } catch (error) {
    const initial = normalizeStorePositions(clone(seedData));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

let store = loadStore();

function saveStore(nextStore) {
  store = nextStore;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function resetStore() {
  saveStore(clone(seedData));
}

function isAdminAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

function setAdminAuthed(value) {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, "true");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

function formatPercentPrecise(value) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

const BENCHMARK_REFRESH_MS = 5 * 60 * 1000;

let benchmarkState = {
  sp500Return: null,
  loading: false,
  error: null,
  asOf: null,
};

let benchmarkFetchPromise = null;
let benchmarkRefreshInterval = null;

let companyReturnsState = {
  holdings: {},
  loading: false,
  error: null,
  asOf: null,
};

let companyReturnsFetchPromise = null;
let companyReturnsRefreshInterval = null;

function formatAllocation(value) {
  return `${value.toFixed(1)}%`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function valueClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "";
}

function splitParagraphs(text) {
  return text
    .split("\n\n")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function getLatestSnapshot() {
  return [...store.performanceSnapshots].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

function getEmptySnapshot() {
  return {
    date: "",
    portfolioValue: 0,
    sinceInceptionReturn: 74.68,
    annualizedReturn: 0,
    portfolioCagr: 0,
    sp500Return: 0,
    nasdaqReturn: 0,
    alpha: 0,
    maxDrawdown: 0,
    cashPosition: 0,
    holdingsCount: HOLDINGS_COUNT_DEFAULT,
  };
}

function getHoldingsCount() {
  const fromPositions = getCurrentPositions().length;
  if (fromPositions > 0) return fromPositions;
  const snapshot = getLatestSnapshot();
  if (snapshot?.holdingsCount > 0) return snapshot.holdingsCount;
  return HOLDINGS_COUNT_DEFAULT;
}

function getSinceInceptionReturn() {
  const snapshot = getLatestSnapshot();
  if (snapshot?.sinceInceptionReturn) return snapshot.sinceInceptionReturn;
  return 74.68;
}

function getCompanyReturn(companyKey) {
  return companyReturnsState.holdings[companyKey]?.return ?? null;
}

function getCompanyWeightedReturn(companyKey) {
  const returnValue = getCompanyReturn(companyKey);
  if (returnValue == null) return null;
  return (getHoldingAllocation(companyKey) * returnValue) / 100;
}

function getWeightedPortfolioReturn() {
  let total = 0;

  for (const holding of PORTFOLIO_HOLDINGS) {
    const weighted = getCompanyWeightedReturn(holding.key);
    if (weighted == null) return null;
    total += weighted;
  }

  return total;
}

function getHeroSinceInceptionReturn() {
  const weighted = getWeightedPortfolioReturn();
  if (weighted != null) return weighted;
  return null;
}

function getSp500SinceInception() {
  return benchmarkState.sp500Return;
}

function getHeroAlphaVsSp500() {
  const weighted = getWeightedPortfolioReturn();
  const sp500Return = getSp500SinceInception();
  if (weighted == null || sp500Return == null) return null;
  return weighted - sp500Return;
}

function getAlphaVsSp500() {
  const sp500Return = getSp500SinceInception();
  if (sp500Return == null) return null;
  const heroReturn = getHeroSinceInceptionReturn() ?? getSinceInceptionReturn();
  return heroReturn - sp500Return;
}

function formatLiveBenchmarkPercent(value) {
  if (benchmarkState.loading && value == null) return "Loading…";
  if (value == null) return "—";
  return formatPercentPrecise(value);
}

function benchmarkValueClass(value) {
  if (value == null) return benchmarkState.loading ? "benchmark-pending" : "";
  return valueClass(value);
}

function updateBenchmarkDisplays() {
  updateCompanyReturnDisplays();

  const sp500Return = getSp500SinceInception();
  const benchmarkLoading = benchmarkState.loading;

  app.querySelectorAll("[data-benchmark-sp500]:not([data-hero-alpha]) .metric-value").forEach((element) => {
    setAnimatedPercent(element, sp500Return, {
      loading: benchmarkLoading,
      className: `metric-value ${benchmarkValueClass(sp500Return)}`.trim(),
    });
  });

  app.querySelectorAll("[data-benchmark-sp500-inline]").forEach((element) => {
    setAnimatedPercent(element, sp500Return, {
      loading: benchmarkLoading,
      className: benchmarkValueClass(sp500Return),
    });
  });

  app.querySelectorAll("[data-benchmark-alpha] .metric-value").forEach((element) => {
    const alpha = getAlphaVsSp500();
    setAnimatedPercent(element, alpha, {
      loading: benchmarkLoading,
      className: `metric-value ${benchmarkValueClass(alpha)}`.trim(),
    });
  });

  app.querySelectorAll("[data-benchmark-alpha-inline]").forEach((element) => {
    const alpha = getAlphaVsSp500();
    setAnimatedPercent(element, alpha, {
      loading: benchmarkLoading,
      className: benchmarkValueClass(alpha),
    });
  });
}

function getCompanyAlphaVsSp500(companyKey) {
  const returnValue = getCompanyReturn(companyKey);
  const sp500Return = getSp500SinceInception();
  if (returnValue == null || sp500Return == null) return null;
  return returnValue - sp500Return;
}

function getPortfolioHoldingsRows() {
  return PORTFOLIO_HOLDINGS.map((holding) => {
    const meta = companyHoldingsMeta[holding.key] || { ticker: "—", category: "—" };
    const live = companyReturnsState.holdings[holding.key];
    const returnPct = live?.return ?? null;
    const alpha = getCompanyAlphaVsSp500(holding.key);
    const allocation = getHoldingAllocation(holding.key);
    const contribution = returnPct != null ? (allocation * returnPct) / 100 : null;

    return {
      key: holding.key,
      name: live?.name ?? holding.eyebrow,
      ticker: live?.symbol ?? meta.ticker,
      category: live?.category ?? meta.category,
      allocation,
      returnPct,
      alpha,
      contribution,
      startClose: live?.startClose ?? null,
      endClose: live?.endClose ?? null,
      startDate: live?.startDate ?? null,
      endDate: live?.endDate ?? null,
    };
  });
}

function updatePortfolioPageDisplays() {
  const page = app.querySelector(".page-portfolio");
  if (!page) return;

  const loading = companyReturnsState.loading || benchmarkState.loading;
  const rows = getPortfolioHoldingsRows();
  const weighted = getWeightedPortfolioReturn();
  const alpha = getHeroAlphaVsSp500();

  const summaryReturn = page.querySelector("[data-portfolio-summary-return] .metric-value");
  setAnimatedPercent(summaryReturn, weighted, {
    loading,
    className: `metric-value ${weighted == null ? (loading ? "benchmark-pending" : "") : valueClass(weighted)}`.trim(),
  });

  const summaryAlpha = page.querySelector("[data-portfolio-summary-alpha] .metric-value");
  setAnimatedPercent(summaryAlpha, alpha, {
    loading,
    className: `metric-value ${benchmarkValueClass(alpha)}`.trim(),
  });

  rows.forEach((row) => {
    const setMetricCell = (selector, value, className = "", format = formatPercentPrecise) => {
      page.querySelectorAll(`[${selector}="${row.key}"]`).forEach((element) => {
        setAnimatedPercent(element, value, { loading, className, format });
      });
    };

    setMetricCell("data-portfolio-start", row.startClose, "", formatPrice);
    setMetricCell(
      "data-portfolio-end",
      row.endClose,
      `portfolio-end ${companyReturnValueClass(row.returnPct)}`.trim(),
      formatPrice,
    );
    setMetricCell(
      "data-portfolio-allocation",
      row.allocation,
      "portfolio-allocation",
      formatAllocation,
    );
    setMetricCell(
      "data-portfolio-return",
      row.returnPct,
      `portfolio-return ${companyReturnValueClass(row.returnPct)}`.trim(),
    );
    setMetricCell(
      "data-portfolio-alpha",
      row.alpha,
      `portfolio-alpha ${benchmarkValueClass(row.alpha)}`.trim(),
    );
    setMetricCell(
      "data-portfolio-contribution",
      row.contribution,
      `portfolio-contribution ${row.contribution == null ? (loading ? "benchmark-pending" : "") : valueClass(row.contribution)}`.trim(),
    );
  });
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchLiveSp500Return() {
  const sources = [sitePath("/api/sp500-since-launch.json")];

  for (const url of sources) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) continue;

      const data = await response.json();
      if (typeof data.sp500Return === "number") {
        return { sp500Return: data.sp500Return, asOf: data.endDate || null };
      }
    } catch (_) {
      // Try the next source.
    }
  }

  throw new Error("Benchmark API unavailable");
}

async function refreshLiveBenchmark() {
  if (benchmarkFetchPromise) return benchmarkFetchPromise;

  const hadBenchmark = benchmarkState.sp500Return != null;
  if (!hadBenchmark) {
    benchmarkState = { ...benchmarkState, loading: true, error: null };
    updateBenchmarkDisplays();
  }

  benchmarkFetchPromise = (async () => {
    try {
      const data = await fetchLiveSp500Return();
      benchmarkState = {
        sp500Return: data.sp500Return,
        loading: false,
        error: null,
        asOf: data.asOf || null,
      };
    } catch (error) {
      benchmarkState = {
        sp500Return: benchmarkState.sp500Return,
        loading: false,
        error: error instanceof Error ? error.message : "Benchmark unavailable",
        asOf: benchmarkState.asOf,
      };
    } finally {
      benchmarkFetchPromise = null;
      updateBenchmarkDisplays();
    }
  })();

  return benchmarkFetchPromise;
}

function cleanupLiveBenchmark() {
  if (benchmarkRefreshInterval) {
    clearInterval(benchmarkRefreshInterval);
    benchmarkRefreshInterval = null;
  }
}

function setupLiveBenchmark() {
  cleanupLiveBenchmark();
  refreshLiveBenchmark();
  benchmarkRefreshInterval = setInterval(refreshLiveBenchmark, BENCHMARK_REFRESH_MS);
}

function formatCompanyReturnPercent(value) {
  if (companyReturnsState.loading && value == null) return "Loading…";
  if (value == null) return "—";
  return formatPercentPrecise(value);
}

function companyReturnValueClass(value) {
  if (value == null) return companyReturnsState.loading ? "benchmark-pending" : "";
  return valueClass(value);
}

function updateCompanyReturnDisplays() {
  const loading = companyReturnsState.loading || benchmarkState.loading;

  app.querySelectorAll("[data-company-return]").forEach((element) => {
    const key = element.dataset.companyReturn;
    const returnValue = getCompanyReturn(key);
    setAnimatedPercent(element, returnValue, {
      loading,
      className: `hero-return company-return ${companyReturnValueClass(returnValue)}`.trim(),
      wind: true,
    });
  });

  app.querySelectorAll("[data-company-alpha] .metric-value").forEach((element) => {
    const card = element.closest("[data-company-alpha]");
    const key = card?.dataset.companyAlpha;
    const alpha = key ? getCompanyAlphaVsSp500(key) : null;
    setAnimatedPercent(element, alpha, {
      loading,
      className: `metric-value ${benchmarkValueClass(alpha)}`.trim(),
    });
  });

  app.querySelectorAll("[data-holding-allocation]").forEach((element) => {
    const key = element.dataset.holdingAllocation;
    const allocation = key ? getHoldingAllocation(key) : null;
    setAnimatedPercent(element, allocation, {
      className: "hero-return",
      wind: true,
      format: formatAllocation,
    });
  });

  updateHeroMetricsDisplay();
  updatePortfolioPageDisplays();
  updateHoldingDetailPageDisplays();
}

function updateHeroMetricsDisplay() {
  const returnElement = app.querySelector(".section-hero [data-hero-since-inception]");
  const alphaElement = app.querySelector(".section-hero [data-hero-alpha] .metric-value");
  const loading = companyReturnsState.loading || benchmarkState.loading;
  const weighted = getWeightedPortfolioReturn();
  const alpha = getHeroAlphaVsSp500();

  setAnimatedPercent(returnElement, weighted, {
    loading,
    className: weighted == null ? `hero-return ${loading ? "benchmark-pending" : ""}`.trim() : `hero-return ${valueClass(weighted)}`.trim(),
    wind: true,
  });

  setAnimatedPercent(alphaElement, alpha, {
    loading,
    className: `metric-value ${alpha == null ? (loading ? "benchmark-pending" : "") : valueClass(alpha)}`.trim(),
  });
}

async function fetchLiveCompanyReturns() {
  const sources = [sitePath("/api/holdings-since-launch.json")];

  for (const url of sources) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) continue;

      const data = await response.json();
      if (data.holdings && typeof data.holdings === "object") {
        return {
          holdings: data.holdings,
          asOf: data.updatedAt || null,
        };
      }
    } catch (_) {
      // Try the next source.
    }
  }

  throw new Error("Holdings API unavailable");
}

async function refreshLiveCompanyReturns() {
  if (companyReturnsFetchPromise) return companyReturnsFetchPromise;

  const hadHoldings = Object.keys(companyReturnsState.holdings).length > 0;
  if (!hadHoldings) {
    companyReturnsState = { ...companyReturnsState, loading: true, error: null };
    updateCompanyReturnDisplays();
  }

  companyReturnsFetchPromise = (async () => {
    try {
      const data = await fetchLiveCompanyReturns();
      companyReturnsState = {
        holdings: data.holdings,
        loading: false,
        error: null,
        asOf: data.asOf || null,
      };
    } catch (error) {
      companyReturnsState = {
        holdings: companyReturnsState.holdings,
        loading: false,
        error: error instanceof Error ? error.message : "Returns unavailable",
        asOf: companyReturnsState.asOf,
      };
    } finally {
      companyReturnsFetchPromise = null;
      updateCompanyReturnDisplays();
    }
  })();

  return companyReturnsFetchPromise;
}

function cleanupLiveCompanyReturns() {
  if (companyReturnsRefreshInterval) {
    clearInterval(companyReturnsRefreshInterval);
    companyReturnsRefreshInterval = null;
  }
}

function setupLiveCompanyReturns() {
  cleanupLiveCompanyReturns();
  refreshLiveCompanyReturns();
  companyReturnsRefreshInterval = setInterval(refreshLiveCompanyReturns, BENCHMARK_REFRESH_MS);
}

function getCurrentPositions() {
  return store.positions.filter((position) => position.status === "current");
}

function getPositionReturn(position) {
  if (!position.costBasis) return 0;
  return ((position.currentPrice - position.costBasis) / position.costBasis) * 100;
}

function getCurrentValue(position) {
  return position.shares * position.currentPrice;
}

function getPortfolioContribution(position) {
  return (position.weight * getPositionReturn(position)) / 100;
}

function getTopHoldings(limit = 5) {
  return [...getCurrentPositions()].sort((a, b) => b.weight - a.weight).slice(0, limit);
}

function getLatestResearch(limit = 5) {
  return [...store.researchArticles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, limit);
}

function getLatestLetter() {
  return [...store.investorLetters].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0];
}

function getPositionByTicker(ticker) {
  return store.positions.find((position) => position.ticker.toLowerCase() === ticker.toLowerCase());
}

function getResearchBySlug(slug) {
  return store.researchArticles.find((article) => article.slug === slug);
}

function getLetterBySlug(slug) {
  return store.investorLetters.find((letter) => letter.slug === slug);
}

function getHoldingUpdates(ticker) {
  return store.holdingUpdates
    .filter((update) => update.ticker.toLowerCase() === ticker.toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getRoute() {
  let path = window.location.pathname.replace(/\/+$/, "") || "/";
  const base = getSiteBase();
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || "/";
  }
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "index.html" || parts[0] === "404.html") return { page: "home", params: {} };
  if (parts[0] === "portfolio" && parts[1] && parts[1] !== "index.html" && parts[1] !== "404.html") {
    return { page: "holding-detail", params: { ticker: parts[1].toUpperCase() } };
  }
  if (parts[0] === "portfolio") return { page: "portfolio", params: {} };
  if (parts[0] === "research" && parts[1]) return { page: "research-detail", params: { slug: parts[1] } };
  if (parts[0] === "research") return { page: "research", params: {} };
  if (parts[0] === "principles") return { page: "principles", params: {} };
  if (parts[0] === "about") return { page: "about", params: {} };
  if (parts[0] === "admin") return { page: "admin", params: {} };
  return { page: "not-found", params: {} };
}

const SCROLL_TO_POSITIONS_KEY = "scrollToPositions";

let mobileNavCleanup = null;
let heroVantaResizeCleanup = null;

function isMobileLayout() {
  return window.matchMedia("(max-width: 960px)").matches;
}

function getPublicHeaderOffset() {
  const header = app.querySelector(".public-header");
  if (!header) return 0;
  return header.getBoundingClientRect().height + 12;
}

function closeMobileNav() {
  const header = app.querySelector(".public-header");
  const toggle = app.querySelector("[data-nav-toggle]");
  if (!header || !toggle) return;

  header.classList.remove("is-nav-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("mobile-nav-open");
}

function setupMobileNav() {
  if (mobileNavCleanup) {
    mobileNavCleanup();
    mobileNavCleanup = null;
  }

  const header = app.querySelector(".public-header");
  const toggle = app.querySelector("[data-nav-toggle]");
  const nav = header?.querySelector("[data-primary-nav]");
  if (!header || !toggle || !nav) return;

  const onToggle = () => {
    const open = header.classList.toggle("is-nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("mobile-nav-open", open);
  };

  const onNavClick = (event) => {
    if (event.target.closest("a")) {
      closeMobileNav();
      return;
    }
    if (event.target.closest(".primary-nav")) closeMobileNav();
  };

  const onDocumentClick = (event) => {
    if (!header.classList.contains("is-nav-open")) return;
    if (event.target.closest(".primary-nav") || event.target.closest("[data-nav-toggle]")) return;
    closeMobileNav();
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") closeMobileNav();
  };

  toggle.addEventListener("click", onToggle);
  nav.addEventListener("click", onNavClick);
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeyDown);

  const mobileQuery = window.matchMedia("(max-width: 960px)");
  const onMobileQueryChange = (event) => {
    if (!event.matches) closeMobileNav();
  };
  mobileQuery.addEventListener("change", onMobileQueryChange);

  mobileNavCleanup = () => {
    toggle.removeEventListener("click", onToggle);
    nav.removeEventListener("click", onNavClick);
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKeyDown);
    mobileQuery.removeEventListener("change", onMobileQueryChange);
    closeMobileNav();
  };
}

function getScrollSnapOffset(container) {
  if (container?.classList.contains("page-home")) return 0;
  return isMobileLayout() ? getPublicHeaderOffset() : 0;
}

function scrollContainerToSection(container, section, behavior = "smooth") {
  if (!container || !section) return false;

  const offset = getScrollSnapOffset(container);
  container.scrollTo({ top: Math.max(0, section.offsetTop - offset), behavior });
  return true;
}

function navigate(pathname) {
  window.history.pushState({}, "", sitePath(pathname));
  render();
}

function scrollToFirstPosition(behavior = "smooth") {
  const container = app.querySelector(".public-page");
  const target = document.getElementById("positions");
  if (!container || !target) return false;

  return scrollContainerToSection(container, target, behavior);
}

function scrollToHomeSection(section, behavior = "smooth") {
  const container = app.querySelector(".public-page");
  if (!container || !section) return false;

  return scrollContainerToSection(container, section, behavior);
}

function getHomeScrollSections() {
  const container = app.querySelector(".page-home.public-page");
  if (!container) return [];

  return [...container.querySelectorAll(":scope > .section")];
}

function getActiveHomeSectionIndex(sections = getHomeScrollSections()) {
  const activeIndex = sections.findIndex((section) => section.classList.contains("is-active"));
  return activeIndex >= 0 ? activeIndex : 0;
}

function updateHomeScrollCta(activeIndex, sectionCount = getHomeScrollSections().length) {
  const cta = app.querySelector("[data-home-scroll-cta]");
  const label = cta?.querySelector("[data-home-scroll-cta-label]");
  if (!cta || !label) return;

  const inPortfolio = activeIndex > 0;
  const isLastSection = activeIndex === sectionCount - 1;

  cta.hidden = inPortfolio && isLastSection;
  label.textContent = inPortfolio ? "Next position" : "See positions";
  cta.classList.remove("is-chrome-tone");
}

function handleHomeScrollCtaClick() {
  const sections = getHomeScrollSections();
  if (!sections.length) return;

  const activeIndex = getActiveHomeSectionIndex(sections);

  if (activeIndex <= 0) {
    goToPositions();
    return;
  }

  const nextSection = sections[activeIndex + 1];
  if (!nextSection) return;

  scrollToHomeSection(nextSection);
}

function goToPositions(behavior = "smooth") {
  if (getRoute().page === "home") {
    scrollToFirstPosition(behavior);
    return;
  }

  sessionStorage.setItem(SCROLL_TO_POSITIONS_KEY, "1");
  navigate("/");
}

function renderMetricCard(label, value, className = "", cardAttrs = "", hint = "") {
  return `
    <div class="stat-card"${cardAttrs ? ` ${cardAttrs}` : ""}>
      <div class="stat-label">${escapeHtml(label)}</div>
      ${hint ? `<div class="stat-hint">${escapeHtml(hint)}</div>` : ""}
      <div class="metric-value ${className}">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderHomePrimaryMetrics(returnMarkup, allocationWeight, holdingKey = "") {
  return `
    <div class="home-primary-metrics">
      <div>
        <div class="muted">Allocation</div>
        <div class="hero-return"${holdingKey ? ` data-holding-allocation="${escapeHtml(holdingKey)}"` : ""}>${escapeHtml(formatAllocation(allocationWeight))}</div>
      </div>
      <div>
        <div class="muted">Since inception</div>
        ${returnMarkup}
      </div>
    </div>
  `;
}

function renderTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHeader(route) {
  if (route.page === "admin") {
    return `
      <header class="site-header admin-header">
        <div class="header-row">
          <div>
            <div><strong>Blueprint Admin</strong></div>
            <div class="muted">Content editor and data controls.</div>
          </div>
          <a href="/" data-link>Return to public site</a>
        </div>
      </header>
    `;
  }

  const navItems = [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/principles", label: "Principles" },
    { href: "/about", label: "About" },
  ];

  return `
    <header class="site-header public-header">
      <div class="header-row">
        <div class="brand-block">
          <a href="/" class="brand-mark" data-link>Blueprint</a>
        </div>
        <button
          type="button"
          class="nav-toggle"
          data-nav-toggle
          aria-expanded="false"
          aria-controls="primary-nav-panel"
          aria-label="Open menu"
        >
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
        </button>
        <nav id="primary-nav-panel" aria-label="Primary" class="primary-nav" data-primary-nav>
          <ul class="nav-list">
            ${navItems
              .map((item) => {
                const isActive = !item.navPositions && getSectionForPage(route.page) === normalizePage(item.href);
                return `<li><a href="${item.href}" data-link${item.navPositions ? ' data-nav-positions' : ""} class="${isActive ? "is-active" : ""}">${item.label}</a></li>`;
              })
              .join("")}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

function normalizePage(href) {
  if (href === "/") return "home";
  if (href === "/portfolio") return "portfolio";
  if (href === "/research") return "research";
  if (href === "/principles") return "principles";
  if (href === "/about") return "about";
  if (href === "/admin") return "admin";
  return "";
}

function getSectionForPage(page) {
  if (page === "holding-detail") return "portfolio";
  if (page === "research-detail") return "research";
  return page;
}

function renderFooter() {
  if (document.body.classList.contains("theme-admin")) {
    return `
      <footer class="site-footer admin-footer">
        <div class="footer-row">
          <div class="muted">Admin remains intentionally utilitarian in this phase.</div>
        </div>
      </footer>
    `;
  }

  return "";
}

function renderHomePage() {
  const companySections = PORTFOLIO_HOLDINGS;

  return `
    <main class="page page-home public-page">
      <section class="section section-hero section-no-media">
        <div id="hero-vanta" class="hero-vanta" aria-hidden="true"></div>
        <div class="home-overview">
          <div class="hero-copy">
            <h1 class="hero-title">Blueprint</h1>
          </div>
          <div class="home-snapshot">
            <div>
              <div class="muted">Since inception</div>
              <div
                class="hero-return benchmark-pending"
                data-hero-since-inception
                data-return-target="0"
                aria-live="polite"
              >Loading…</div>
            </div>
            <div class="snapshot-grid">
              ${renderMetricCard("Launched", FUND_LAUNCH_LABEL)}
              ${renderMetricCard("Holdings", String(getHoldingsCount()))}
              <div class="stat-card" data-hero-alpha>
                <div class="stat-label">vs S&amp;P</div>
                <div class="metric-value benchmark-pending" data-return-target="0" aria-live="polite">Loading…</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${companySections
        .map((company, index) => {
          const meta = companyHoldingsMeta[company.key] || { ticker: "—", category: "—" };
          return `
            <section class="section section-company"${index === 0 ? ' id="positions"' : ""}>
              <div class="home-overview">
                <div class="hero-copy">
                  <h2 class="hero-title">${escapeHtml(company.eyebrow)}</h2>
                </div>
                <div class="home-snapshot">
                  ${renderHomePrimaryMetrics(
                    `
                    <div
                      class="hero-return company-return benchmark-pending"
                      data-company-return="${escapeHtml(company.key)}"
                      aria-live="polite"
                    >Loading…</div>
                  `,
                    getHoldingAllocation(company.key),
                    company.key,
                  )}
                  <div class="snapshot-grid">
                    ${renderMetricCard("Ticker", meta.ticker)}
                    ${renderMetricCard("vs S&P", "Loading…", "benchmark-pending", `data-company-alpha="${escapeHtml(company.key)}"`)}
                  </div>
                </div>
              </div>
            </section>
          `;
        })
        .join("")}
      <a href="#" class="hero-positions-cta page-home-scroll-cta" data-home-scroll-cta>
        <span data-home-scroll-cta-label>See positions</span>
        <svg class="hero-positions-chevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </main>
  `;
}

function renderPortfolioListRow(row) {
  const loading = companyReturnsState.loading || benchmarkState.loading;

  return `
    <tr data-portfolio-row="${escapeHtml(row.key)}">
      <td>
        <a href="/" data-link data-portfolio-home-link="${escapeHtml(row.key)}" class="portfolio-company-link">${escapeHtml(row.name)}</a>
      </td>
      <td><span class="tag">${escapeHtml(row.ticker)}</span></td>
      <td data-portfolio-allocation="${escapeHtml(row.key)}" class="portfolio-allocation">${escapeHtml(formatAllocation(row.allocation))}</td>
      <td data-portfolio-return="${escapeHtml(row.key)}" class="portfolio-return ${companyReturnValueClass(row.returnPct)}">${formatCompanyReturnPercent(row.returnPct)}</td>
      <td data-portfolio-start="${escapeHtml(row.key)}">${row.startClose != null ? formatPrice(row.startClose) : loading ? "Loading…" : "—"}</td>
      <td data-portfolio-end="${escapeHtml(row.key)}" class="portfolio-end ${companyReturnValueClass(row.returnPct)}">${row.endClose != null ? formatPrice(row.endClose) : loading ? "Loading…" : "—"}</td>
      <td data-portfolio-alpha="${escapeHtml(row.key)}" class="portfolio-alpha ${benchmarkValueClass(row.alpha)}">${loading && row.alpha == null ? "Loading…" : formatLiveBenchmarkPercent(row.alpha)}</td>
      <td data-portfolio-contribution="${escapeHtml(row.key)}" class="portfolio-contribution ${row.contribution == null ? (loading ? "benchmark-pending" : "") : valueClass(row.contribution)}">${row.contribution == null ? (loading ? "Loading…" : "—") : formatPercentPrecise(row.contribution)}</td>
      <td><a href="/portfolio/${escapeHtml(row.ticker)}" data-link class="public-soft-link portfolio-thesis-link">See Thesis</a></td>
    </tr>
  `;
}

function renderPortfolioCard(row) {
  const loading = companyReturnsState.loading || benchmarkState.loading;

  return `
    <article class="portfolio-card" data-portfolio-row="${escapeHtml(row.key)}">
      <div class="portfolio-card-head">
        <div>
          <a href="/" data-link data-portfolio-home-link="${escapeHtml(row.key)}" class="portfolio-company-link">${escapeHtml(row.name)}</a>
          <div class="portfolio-card-meta muted">${escapeHtml(row.ticker)}</div>
        </div>
      </div>
      <dl class="portfolio-card-metrics">
        <div>
          <dt class="stat-label">Allocation</dt>
          <dd data-portfolio-allocation="${escapeHtml(row.key)}" class="portfolio-allocation">${escapeHtml(formatAllocation(row.allocation))}</dd>
        </div>
        <div>
          <dt class="stat-label">Since inception</dt>
          <dd data-portfolio-return="${escapeHtml(row.key)}" class="portfolio-return ${companyReturnValueClass(row.returnPct)}">${formatCompanyReturnPercent(row.returnPct)}</dd>
        </div>
        <div>
          <dt class="stat-label">Inception</dt>
          <dd data-portfolio-start="${escapeHtml(row.key)}">${row.startClose != null ? formatPrice(row.startClose) : loading ? "Loading…" : "—"}</dd>
        </div>
        <div>
          <dt class="stat-label">Latest</dt>
          <dd data-portfolio-end="${escapeHtml(row.key)}" class="portfolio-end ${companyReturnValueClass(row.returnPct)}">${row.endClose != null ? formatPrice(row.endClose) : loading ? "Loading…" : "—"}</dd>
        </div>
        <div>
          <dt class="stat-label">Vs S&amp;P</dt>
          <dd data-portfolio-alpha="${escapeHtml(row.key)}" class="portfolio-alpha ${benchmarkValueClass(row.alpha)}">${loading && row.alpha == null ? "Loading…" : formatLiveBenchmarkPercent(row.alpha)}</dd>
        </div>
        <div>
          <dt class="stat-label">Contribution</dt>
          <dd data-portfolio-contribution="${escapeHtml(row.key)}" class="portfolio-contribution ${row.contribution == null ? (loading ? "benchmark-pending" : "") : valueClass(row.contribution)}">${row.contribution == null ? (loading ? "Loading…" : "—") : formatPercentPrecise(row.contribution)}</dd>
        </div>
      </dl>
      <p class="portfolio-card-thesis-link">
        <a href="/portfolio/${escapeHtml(row.ticker)}" data-link class="portfolio-thesis-link"><span class="portfolio-thesis-text">See Thesis</span><span class="portfolio-thesis-arrow" aria-hidden="true">›</span></a>
      </p>
    </article>
  `;
}

function renderPortfolioPage() {
  const rows = getPortfolioHoldingsRows();

  return `
    <main class="page page-portfolio public-page">
      <section class="section portfolio-section">
        <div class="page-header page-header-block">
          <div>
            <h1>Holdings</h1>
          </div>
        </div>

        <div class="stats-grid portfolio-summary">
          ${renderMetricCard("Holdings", String(rows.length), "", 'data-portfolio-summary-count=""')}
          ${renderMetricCard("Portfolio return", "Loading…", "benchmark-pending", 'data-portfolio-summary-return=""')}
          ${renderMetricCard("Vs S&P", "Loading…", "benchmark-pending", 'data-portfolio-summary-alpha=""')}
        </div>

        <div class="portfolio-list-panel">
          <div class="portfolio-list-wrap table-wrap" aria-label="Portfolio holdings">
            <table class="portfolio-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Ticker</th>
                  <th>Allocation</th>
                  <th>Since inception</th>
                  <th>Inception</th>
                  <th>Latest</th>
                  <th>Vs S&amp;P</th>
                <th>Contribution</th>
                <th>Thesis</th>
              </tr>
              </thead>
              <tbody>
                ${rows.map((row) => renderPortfolioListRow(row)).join("")}
              </tbody>
            </table>
          </div>

          <div class="portfolio-card-list" aria-label="Portfolio holdings">
            ${rows.map((row) => renderPortfolioCard(row)).join("")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function updateHoldingDetailPageDisplays() {
  const page = app.querySelector(".page-holding-thesis");
  if (!page) return;

  const holding = getPortfolioHoldingBySlug(page.dataset.holdingSlug);
  if (!holding) return;

  const loading = companyReturnsState.loading || benchmarkState.loading;

  setAnimatedPercent(page.querySelector("[data-holding-return]"), holding.returnPct, {
    loading,
    className: `hero-return company-return ${companyReturnValueClass(holding.returnPct)}`.trim(),
    wind: true,
  });

  setAnimatedPercent(page.querySelector("[data-holding-alpha] .metric-value"), holding.alpha, {
    loading,
    className: `metric-value ${benchmarkValueClass(holding.alpha)}`.trim(),
  });

  setAnimatedPercent(page.querySelector("[data-holding-start] .metric-value"), holding.startClose, {
    loading,
    className: "metric-value",
    format: formatPrice,
  });

  setAnimatedPercent(page.querySelector("[data-holding-end] .metric-value"), holding.endClose, {
    loading,
    className: `metric-value portfolio-end ${companyReturnValueClass(holding.returnPct)}`.trim(),
    format: formatPrice,
  });

  setAnimatedPercent(page.querySelector("[data-holding-contribution] .metric-value"), holding.contribution, {
    loading,
    className: `metric-value portfolio-contribution ${holding.contribution == null ? (loading ? "benchmark-pending" : "") : valueClass(holding.contribution)}`.trim(),
  });
}

function renderHoldingDetailPage(ticker) {
  const holding = getPortfolioHoldingBySlug(ticker);
  if (!holding) {
    return renderNotFoundPage("Holding not found", "This holding is not part of the current public portfolio.");
  }

  const loading = companyReturnsState.loading || benchmarkState.loading;

  return `
    <main class="page page-holding-thesis public-page" data-holding-slug="${escapeHtml(holding.ticker)}">
      <section class="section holding-thesis-section">
        <div class="holding-thesis-top home-overview">
          <div class="hero-copy holding-thesis-header">
            <h1 class="hero-title">${escapeHtml(holding.name)}</h1>
            <a href="/portfolio" data-link class="public-soft-link holding-back-link">
              <span class="holding-back-arrow" aria-hidden="true">‹</span>
              Back to portfolio
            </a>
          </div>
          <div class="home-snapshot holding-thesis-snapshot">
            ${renderHomePrimaryMetrics(
              `
              <div
                class="hero-return company-return ${companyReturnValueClass(holding.returnPct)}"
                data-holding-return
                data-company-return="${escapeHtml(holding.key)}"
                aria-live="polite"
              >${escapeHtml(formatCompanyReturnPercent(holding.returnPct))}</div>
            `,
              holding.allocation,
              holding.key,
            )}
            <div class="snapshot-grid">
              ${renderMetricCard("Category", holding.category)}
              ${renderMetricCard("Ticker", holding.ticker)}
              ${renderMetricCard(
                "vs S&P",
                loading && holding.alpha == null ? "Loading…" : formatLiveBenchmarkPercent(holding.alpha),
                benchmarkValueClass(holding.alpha),
                'data-holding-alpha=""',
              )}
              ${renderMetricCard(
                "Contribution",
                holding.contribution == null ? (loading ? "Loading…" : "—") : formatPercentPrecise(holding.contribution),
                holding.contribution == null ? (loading ? "benchmark-pending" : "") : valueClass(holding.contribution),
                'data-holding-contribution=""',
              )}
              ${renderMetricCard(
                "Inception",
                holding.startClose != null ? formatPrice(holding.startClose) : loading ? "Loading…" : "—",
                "",
                'data-holding-start=""',
              )}
              ${renderMetricCard(
                "Latest",
                holding.endClose != null ? formatPrice(holding.endClose) : loading ? "Loading…" : "—",
                companyReturnValueClass(holding.returnPct),
                'data-holding-end=""',
              )}
            </div>
          </div>
        </div>

        <article class="holding-thesis-article">
          ${renderHoldingThesisParagraphs(holding.thesisParagraphs)}
        </article>
      </section>
    </main>
  `;
}

function getResearchFilters() {
  const companies = [...new Set(store.researchArticles.map((article) => article.company))].sort();
  const categories = [...new Set(store.researchArticles.map((article) => article.category))].sort();
  const dates = [...new Set(store.researchArticles.map((article) => (article.publishedAt || "").slice(0, 7)).filter(Boolean))].sort().reverse();
  return { companies, categories, dates };
}

function getFilteredResearch() {
  return [...store.researchArticles]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .filter((article) => {
      const matchesSearch =
        !uiState.researchSearch ||
        `${article.title} ${article.company} ${article.industry} ${article.summary}`.toLowerCase().includes(uiState.researchSearch.toLowerCase());
      const matchesCompany = uiState.researchCompany === "all" || article.company === uiState.researchCompany;
      const matchesCategory = uiState.researchCategory === "all" || article.category === uiState.researchCategory;
      const matchesDate = uiState.researchDate === "all" || article.publishedAt.startsWith(uiState.researchDate);
      return matchesSearch && matchesCompany && matchesCategory && matchesDate;
    });
}

function renderResearchPage() {
  const filters = getResearchFilters();
  const articles = getFilteredResearch();

  return `
    <main class="page page-research public-page">
      <section class="section">
        <div class="page-header page-header-block">
          <div>
            <p class="section-eyebrow">Research</p>
            <h1>Research</h1>
            <p class="prose muted">A public knowledge base spanning company theses, industry reports, technology deep dives, earnings analysis, and market commentary.</p>
          </div>
        </div>
        <div class="filter-row">
          <label>
            Search
            <input type="search" data-control="research-search" value="${escapeHtml(uiState.researchSearch)}" placeholder="Search title, company, or topic" />
          </label>
          <label>
            Company
            <select data-control="research-company">
              <option value="all">All Companies</option>
              ${filters.companies
                .map((company) => `<option value="${escapeHtml(company)}" ${uiState.researchCompany === company ? "selected" : ""}>${escapeHtml(company)}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            Content Type
            <select data-control="research-category">
              <option value="all">All Content Types</option>
              ${filters.categories
                .map((category) => `<option value="${escapeHtml(category)}" ${uiState.researchCategory === category ? "selected" : ""}>${escapeHtml(category)}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            Date
            <select data-control="research-date">
              <option value="all">All Dates</option>
              ${filters.dates
                .map((date) => `<option value="${escapeHtml(date)}" ${uiState.researchDate === date ? "selected" : ""}>${escapeHtml(date)}</option>`)
                .join("")}
            </select>
          </label>
        </div>
      </section>

      <section class="section">
        <div class="card-grid">
          ${articles.length
            ? articles
                .map(
                  (article) => `
                    <article class="card">
                      <div class="tag">${escapeHtml(article.category)}</div>
                      <h2><a href="/research/${article.slug}" data-link>${escapeHtml(article.title)}</a></h2>
                      <div class="muted">${escapeHtml(article.company)} • ${escapeHtml(article.industry)} • ${formatDate(article.publishedAt)} • ${article.readTime} min read</div>
                      <p>${escapeHtml(article.summary)}</p>
                    </article>
                  `,
                )
                .join("")
            : '<div class="empty-state">No research pieces matched the current filters.</div>'}
        </div>
      </section>
    </main>
  `;
}

function renderResearchDetailPage(slug) {
  const article = getResearchBySlug(slug);
  if (!article) {
    return renderNotFoundPage("Research not found", "The requested research page does not exist in the current dataset.");
  }

  const relatedResearch = store.researchArticles
    .filter((candidate) => candidate.slug !== article.slug && (candidate.company === article.company || candidate.category === article.category))
    .slice(0, 3);

  const relatedHoldings = store.positions.filter(
    (position) =>
      position.companyName.toLowerCase() === article.company.toLowerCase() ||
      position.thesisSlug === article.slug,
  );

  return `
    <main class="page page-research-detail public-page">
      <section class="section section-hero">
        <p><a href="/research" data-link class="section-link">Back to research</a></p>
        <p class="section-eyebrow">Research Detail</p>
        <h1>${escapeHtml(article.title)}</h1>
        <ul class="meta-list muted">
          <li>${formatDate(article.publishedAt)}</li>
          <li>${escapeHtml(article.author)}</li>
          <li>${escapeHtml(article.company)}</li>
          <li>${escapeHtml(article.category)}</li>
          <li>${article.readTime} min read</li>
        </ul>
      </section>

      <section class="section">
        <div class="prose article-prose">
          ${splitParagraphs(article.body).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="split-layout">
          <div class="card">
            <h2>Related Research</h2>
            <ul class="stack">
              ${relatedResearch.length
                ? relatedResearch
                    .map((item) => `<li><a href="/research/${item.slug}" data-link>${escapeHtml(item.title)}</a></li>`)
                    .join("")
                : "<li>No related research yet.</li>"}
            </ul>
          </div>
          <div class="card">
            <h2>Related Holdings</h2>
            <ul class="stack">
              ${relatedHoldings.length
                ? relatedHoldings
                    .map((item) => `<li><a href="/portfolio/${item.ticker}" data-link>${escapeHtml(item.companyName)} (${escapeHtml(item.ticker)})</a></li>`)
                    .join("")
                : "<li>No related holding linked yet.</li>"}
            </ul>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderPerformancePage() {
  const latestSnapshot = getLatestSnapshot();
  const snapshot = latestSnapshot || getEmptySnapshot();

  const benchmarkRows = [
    { label: "Blueprint", sinceInception: getSinceInceptionReturn(), annualized: snapshot.annualizedReturn },
    { label: "S&P 500", sinceInception: null, annualized: 0, liveBenchmark: true },
    { label: "Nasdaq", sinceInception: snapshot.nasdaqReturn, annualized: 0 },
  ];

  const renderPeriodRows = (periods) =>
    periods
      .map(
        (period) => `
          <tr>
            <td>${escapeHtml(period.periodLabel)}</td>
            <td class="${valueClass(period.blueprintReturn)}">${formatPercent(period.blueprintReturn)}</td>
            <td class="${valueClass(period.sp500Return)}">${formatPercent(period.sp500Return)}</td>
            <td class="${valueClass(period.nasdaqReturn)}">${formatPercent(period.nasdaqReturn)}</td>
          </tr>
        `,
      )
      .join("");

  return `
    <main class="page page-performance public-page">
      <section class="section">
        <div class="page-header page-header-block">
          <div>
            <p class="section-eyebrow">Performance</p>
            <h1>Performance</h1>
            <p class="prose muted">The goal is full transparency: returns, benchmark comparison, cash, holdings count, and historical cadence.</p>
          </div>
        </div>
        ${latestSnapshot
          ? `
            <div class="stats-grid">
              ${renderMetricCard("Since inception return", formatPercent(getSinceInceptionReturn()), valueClass(getSinceInceptionReturn()))}
              ${renderMetricCard("Annualized return", formatPercent(snapshot.annualizedReturn), valueClass(snapshot.annualizedReturn))}
              ${renderMetricCard("Portfolio CAGR", formatPercent(snapshot.portfolioCagr), valueClass(snapshot.portfolioCagr))}
              ${renderMetricCard("Alpha vs S&P 500", "—", "benchmark-pending", 'data-benchmark-alpha=""')}
              ${renderMetricCard("Maximum drawdown", formatPercent(snapshot.maxDrawdown), valueClass(snapshot.maxDrawdown))}
              ${renderMetricCard("Current portfolio value", formatCurrency(snapshot.portfolioValue))}
              ${renderMetricCard("Cash position", formatAllocation(snapshot.cashPosition))}
              ${renderMetricCard("Number of holdings", String(getHoldingsCount()))}
            </div>
          `
          : '<div class="empty-state">No performance snapshot added yet.</div>'}
      </section>

      <section class="section">
        <div class="section-header section-heading">
          <div>
            <p class="section-eyebrow">Historical Record</p>
            <h2>Returns across yearly, quarterly, and monthly periods.</h2>
          </div>
        </div>
        <div class="stack">
          <div>
            <h3>Yearly Returns</h3>
            ${store.performanceHistory.yearly.length
              ? renderTable(["Period", "Blueprint", "S&P 500", "Nasdaq"], [renderPeriodRows(store.performanceHistory.yearly)])
              : '<div class="empty-state">No yearly return history added yet.</div>'}
          </div>
          <div>
            <h3>Quarterly Returns</h3>
            ${store.performanceHistory.quarterly.length
              ? renderTable(["Period", "Blueprint", "S&P 500", "Nasdaq"], [renderPeriodRows(store.performanceHistory.quarterly)])
              : '<div class="empty-state">No quarterly return history added yet.</div>'}
          </div>
          <div>
            <h3>Monthly Returns</h3>
            ${store.performanceHistory.monthly.length
              ? renderTable(["Period", "Blueprint", "S&P 500", "Nasdaq"], [renderPeriodRows(store.performanceHistory.monthly)])
              : '<div class="empty-state">No monthly return history added yet.</div>'}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header section-heading">
          <div>
            <p class="section-eyebrow">Benchmarks</p>
            <h2>Public comparison against major indices.</h2>
          </div>
        </div>
        ${renderTable(
          ["Benchmark", "Since Inception", "Annualized Return"],
          benchmarkRows.map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.label)}</td>
                <td${
                  row.liveBenchmark
                    ? ' data-benchmark-sp500-inline class="benchmark-pending"'
                    : ` class="${valueClass(row.sinceInception)}"`
                }>${row.liveBenchmark ? "—" : formatPercent(row.sinceInception)}</td>
                <td class="${valueClass(row.annualized)}">${formatPercent(row.annualized)}</td>
              </tr>
            `,
          ),
        )}
      </section>
    </main>
  `;
}

function renderLettersPage() {
  const letters = [...store.investorLetters].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return `
    <main class="page page-letters public-page">
      <section class="section">
        <div class="page-header page-header-block">
          <div>
            <p class="section-eyebrow">Letters</p>
            <h1>Letters</h1>
            <p class="prose muted">A chronological archive of partnership letters with printable PDF export via the browser.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card-grid">
          ${letters.length
            ? letters
                .map(
                  (letter) => `
                    <article class="card">
                      <h2><a href="/letters/${letter.slug}" data-link>${escapeHtml(letter.title)}</a></h2>
                      <div class="muted">${formatDate(letter.publishedAt)}</div>
                      <p>${escapeHtml(letter.summary)}</p>
                      <div class="admin-actions">
                        <a href="/letters/${letter.slug}" data-link>Read full letter</a>
                        <button type="button" data-action="print-letter" data-slug="${escapeHtml(letter.slug)}">Print / Save as PDF</button>
                      </div>
                    </article>
                  `,
                )
                .join("")
            : '<div class="empty-state">No letters published yet.</div>'}
        </div>
      </section>
    </main>
  `;
}

function renderLetterDetailPage(slug) {
  const letter = getLetterBySlug(slug);
  if (!letter) {
    return renderNotFoundPage("Letter not found", "The requested investor letter does not exist in the archive.");
  }

  return `
    <main class="page page-letter-detail public-page">
      <section class="section section-hero">
        <p><a href="/letters" data-link class="section-link">Back to letters</a></p>
        <p class="section-eyebrow">Investor Letter</p>
        <h1>${escapeHtml(letter.title)}</h1>
        <div class="muted">${formatDate(letter.publishedAt)}</div>
        <div class="admin-actions">
          <button type="button" data-action="print-letter" data-slug="${escapeHtml(letter.slug)}">Print / Save as PDF</button>
        </div>
      </section>

      <section class="section">
        <div class="prose article-prose">
          ${splitParagraphs(letter.body).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
      </section>
    </main>
  `;
}

function renderInstitutionalParagraphs(paragraphs) {
  if (!paragraphs?.length) return "";
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function renderInstitutionalSection(section) {
  const timeline = section.timeline?.length
    ? `
      <dl class="institutional-timeline">
        ${section.timeline
          .map(
            (item) => `
              <div class="institutional-timeline-item">
                <dt>${escapeHtml(item.time)}</dt>
                <dd>${escapeHtml(item.thought)}</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
    `
    : "";

  const pursue = section.pursue?.length
    ? `
      <div class="institutional-tag-row">
        <span class="institutional-tag-label">Communicate</span>
        ${section.pursue.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
      </div>
    `
    : "";

  const avoid = section.avoid?.length
    ? `
      <ul class="institutional-avoid-list">
        ${section.avoid.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `
    : "";

  return `
    <section class="institutional-section" ${section.id ? `id="${escapeHtml(section.id)}"` : ""}>
      <div class="institutional-section-head">
        <p class="section-eyebrow">${escapeHtml(section.eyebrow)}</p>
        <h2>${escapeHtml(section.title)}</h2>
      </div>
      <div class="institutional-prose">
        ${renderInstitutionalParagraphs(section.paragraphs)}
        ${pursue}
        ${avoid}
        ${timeline}
      </div>
    </section>
  `;
}

function renderInstitutionalClosing(closing) {
  return `
    <section class="institutional-section institutional-closing">
      <div class="institutional-section-head">
        <p class="section-eyebrow">${escapeHtml(closing.eyebrow)}</p>
        <h2>${escapeHtml(closing.title)}</h2>
      </div>
      <div class="institutional-prose">
        <p>${escapeHtml(closing.intro)}</p>
        <ol class="institutional-standard-list">
          ${closing.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
        </ol>
        <p class="institutional-closing-line">${escapeHtml(closing.outro)}</p>
      </div>
    </section>
  `;
}

function renderPillarGrid(pillars) {
  return `
    <div class="pillar-grid">
      ${pillars
        .map(
          (pillar) => `
            <article class="pillar-card">
              <h3>${escapeHtml(pillar.title)}</h3>
              <ul>
                ${pillar.traits.map((trait) => `<li>${escapeHtml(trait)}</li>`).join("")}
              </ul>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderPrinciplesPage() {
  return `
    <main class="page page-principles public-page page-holding-thesis">
      <section class="section holding-thesis-section">
        <div class="holding-thesis-top">
          <div class="holding-thesis-header">
            <h1 class="hero-title">Principles</h1>
          </div>
        </div>
        <article class="holding-thesis-article institutional-article">
          ${principlesContent.sections.map((section) => renderInstitutionalSection(section)).join("")}
          ${renderInstitutionalClosing(principlesContent.closing)}
        </article>
      </section>
    </main>
  `;
}

function renderAboutPage() {
  return `
    <main class="page page-about public-page page-holding-thesis">
      <section class="section holding-thesis-section">
        <div class="holding-thesis-top">
          <div class="holding-thesis-header">
            <h1 class="hero-title">About</h1>
          </div>
        </div>
        <article class="holding-thesis-article institutional-article">
          ${aboutContent.sections
            .map((section) => {
              if (section.eyebrow !== "Identity") {
                return renderInstitutionalSection(section);
              }

              return `
                <section class="institutional-section">
                  <div class="institutional-section-head">
                    <p class="section-eyebrow">${escapeHtml(section.eyebrow)}</p>
                    <h2>${escapeHtml(section.title)}</h2>
                  </div>
                  <div class="institutional-prose">
                    ${renderInstitutionalParagraphs(section.paragraphs)}
                  </div>
                  ${renderPillarGrid(aboutContent.pillars)}
                </section>
              `;
            })
            .join("")}
          ${renderInstitutionalClosing(aboutContent.closing)}
        </article>
      </section>
    </main>
  `;
}

function renderAdminSection(key, label, value) {
  return `
    <section class="admin-card">
      <div class="section-header">
        <h2>${escapeHtml(label)}</h2>
        <button type="button" data-action="save-section" data-section="${escapeHtml(key)}">Save ${escapeHtml(label)}</button>
      </div>
      <textarea id="admin-${escapeHtml(key)}">${escapeHtml(JSON.stringify(value, null, 2))}</textarea>
    </section>
  `;
}

function renderAdminPage() {
  if (!isAdminAuthed()) {
    return `
      <main class="page">
        <section class="section">
          <div class="auth-box">
            <h1>Admin Dashboard</h1>
            <p class="muted">Authenticated editing for portfolio, research, letters, performance, principles, and homepage metrics.</p>
            <form id="admin-login-form" class="form-grid">
              <label>
                Username
                <input type="text" name="username" value="blueprint" autocomplete="username" />
              </label>
              <label>
                Password
                <input type="password" name="password" autocomplete="current-password" />
              </label>
              <button type="submit">Login</button>
            </form>
            <div class="banner muted">Demo credentials are stored client-side for the static MVP only. Replace this with real authentication before production.</div>
          </div>
        </section>
      </main>
    `;
  }

  return `
    <main class="page">
      <section class="section">
        <div class="page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p class="prose muted">All public content is editable as JSON so the MVP stays data-driven while remaining static.</p>
          </div>
          <div class="admin-actions">
            <button type="button" data-action="export-data">Export data</button>
            <button type="button" data-action="reset-data">Reset seed data</button>
            <button type="button" data-action="logout">Logout</button>
          </div>
        </div>
        <div class="banner">
          ${store.siteContent.adminNotes.map((note) => `<div>${escapeHtml(note)}</div>`).join("")}
        </div>
      </section>

      <section class="section admin-grid">
        ${renderAdminSection("siteContent", "Site Content", store.siteContent)}
        ${renderAdminSection("positions", "Portfolio", store.positions)}
        ${renderAdminSection("researchArticles", "Research", store.researchArticles)}
        ${renderAdminSection("investorLetters", "Letters", store.investorLetters)}
        ${renderAdminSection("performanceSnapshots", "Performance Snapshots", store.performanceSnapshots)}
        ${renderAdminSection("performanceHistory", "Performance History", store.performanceHistory)}
        ${renderAdminSection("holdingUpdates", "Holding Updates", store.holdingUpdates)}
        ${renderAdminSection("principles", "Principles", store.principles)}
      </section>

      <section class="section">
        <div class="schema-block">
          <h2>Schema Reference</h2>
          <pre>${escapeHtml(JSON.stringify(schemaModels, null, 2))}</pre>
        </div>
      </section>
    </main>
  `;
}

function renderNotFoundPage(title = "Page not found", message = "The requested route is not part of this MVP.") {
  return `
    <main class="page public-page">
      <section class="section">
        <p class="section-eyebrow">Not Found</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="muted">${escapeHtml(message)}</p>
        <p><a href="/" data-link class="section-link">Return home</a></p>
      </section>
    </main>
  `;
}

function renderPage(route) {
  switch (route.page) {
    case "home":
      return renderHomePage();
    case "portfolio":
      return renderPortfolioPage();
    case "holding-detail":
      return renderHoldingDetailPage(route.params.ticker);
    case "research":
      return renderResearchPage();
    case "research-detail":
      return renderResearchDetailPage(route.params.slug);
    case "principles":
      return renderPrinciplesPage();
    case "about":
      return renderAboutPage();
    case "admin":
      return renderAdminPage();
    default:
      return renderNotFoundPage();
  }
}

let publicScrollCleanup = null;
let percentAnimationCleanups = [];
const pendingPercentByElement = new WeakMap();
const percentObservers = new Map();

function cleanupPercentAnimations() {
  percentAnimationCleanups.forEach((cleanup) => cleanup());
  percentAnimationCleanups = [];
  percentObservers.forEach((observer) => observer.disconnect());
  percentObservers.clear();
}

function cleanupHeroMetricsAnimations() {
  cleanupPercentAnimations();
}

function getPercentScrollRoot(element) {
  return (
    element.closest(".page-home.public-page")
    || element.closest(".portfolio-card-list")
    || element.closest(".portfolio-list-wrap")
    || element.closest(".page-portfolio")
    || element.closest(".page-holding-thesis")
    || null
  );
}

function unobservePercentElement(element) {
  percentObservers.forEach((observer) => observer.unobserve(element));
}

function playPendingPercentAnimation(element) {
  const pending = pendingPercentByElement.get(element);
  if (!pending) return;

  unobservePercentElement(element);
  pendingPercentByElement.delete(element);

  const cleanup = runCountUpAnimation(element, pending.value, {
    wind: pending.wind,
    format: pending.format,
  });
  element.__percentAnimCleanup = cleanup;
  percentAnimationCleanups.push(() => {
    cleanup();
    if (element.__percentAnimCleanup === cleanup) {
      element.__percentAnimCleanup = null;
    }
  });
}

function handlePercentIntersection(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    playPendingPercentAnimation(entry.target);
  });
}

function getPercentObserver(root) {
  const key = root || "viewport";
  if (!percentObservers.has(key)) {
    percentObservers.set(
      key,
      new IntersectionObserver(handlePercentIntersection, {
        root,
        threshold: 0.45,
      }),
    );
  }
  return percentObservers.get(key);
}

function queuePercentAnimation(element, value, { wind = false, format = formatPercentPrecise } = {}) {
  if (!element?.isConnected) return;

  const valueKey = String(value);
  const pending = pendingPercentByElement.get(element);

  if (element.__percentAnimCleanup && element.dataset.returnTarget === valueKey) {
    return;
  }

  if (pending && String(pending.value) === valueKey) {
    return;
  }

  if (element.__percentAnimCleanup) {
    element.__percentAnimCleanup();
    element.__percentAnimCleanup = null;
  }

  unobservePercentElement(element);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = format(value);
    element.dataset.percentAnimated = valueKey;
    element.dataset.returnTarget = valueKey;
    return;
  }

  if (element.dataset.percentAnimated === valueKey) {
    element.textContent = format(value);
    element.dataset.returnTarget = valueKey;
    return;
  }

  delete element.dataset.percentAnimated;
  element.dataset.returnTarget = valueKey;
  element.textContent = format(0);
  pendingPercentByElement.set(element, { value, wind, format });

  requestAnimationFrame(() => {
    if (!element.isConnected || !pendingPercentByElement.has(element)) return;
    getPercentObserver(getPercentScrollRoot(element)).observe(element);
  });
}

function setAnimatedPercent(element, value, options = {}) {
  const {
    loading = false,
    className = element?.className || "",
    wind = null,
    format = formatPercentPrecise,
  } = options;

  if (!element) return;

  const useWind = wind ?? element.classList.contains("hero-return");

  if (value == null) {
    if (element.__percentAnimCleanup) {
      element.__percentAnimCleanup();
      element.__percentAnimCleanup = null;
    }
    unobservePercentElement(element);
    pendingPercentByElement.delete(element);
    delete element.dataset.percentAnimated;
    element.textContent = loading ? "Loading…" : "—";
    if (className) element.className = className.trim();
    element.dataset.returnTarget = "0";
    return;
  }

  if (className) element.className = className.trim();
  element.dataset.returnTarget = String(value);
  queuePercentAnimation(element, value, { wind: useWind, format });
}

function cleanupPublicScrollExperience() {
  cleanupTempusOrb();
  cleanupHeroVanta();
  if (publicScrollCleanup) {
    publicScrollCleanup();
    publicScrollCleanup = null;
  }
}

let heroVantaEffect = null;

function cleanupHeroVanta() {
  if (heroVantaEffect) {
    heroVantaEffect.destroy();
    heroVantaEffect = null;
  }
  if (heroVantaResizeCleanup) {
    heroVantaResizeCleanup();
    heroVantaResizeCleanup = null;
  }
}

function shouldRenderHeroVanta() {
  return !isMobileLayout() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitForVantaReady(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tick = () => {
      if (window.VANTA?.TOPOLOGY && typeof window.p5 === "function") {
        resolve();
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        reject(new Error("Vanta topology scripts not ready"));
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}

function mountHeroVanta() {
  const element = document.getElementById("hero-vanta");
  if (!element || !shouldRenderHeroVanta()) return;

  cleanupHeroVanta();

  waitForVantaReady()
    .then(() => {
      const tryMount = (attempt = 0) => {
        const mountElement = document.getElementById("hero-vanta");
        if (!mountElement || !window.VANTA?.TOPOLOGY) return;

        const { width, height } = mountElement.getBoundingClientRect();
        if ((width < 10 || height < 10) && attempt < 40) {
          requestAnimationFrame(() => tryMount(attempt + 1));
          return;
        }

        heroVantaEffect = window.VANTA.TOPOLOGY({
          el: mountElement,
          mouseControls: !isMobileLayout(),
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 0.82,
          color: 0x6fafd6,
          backgroundColor: 0x03060a,
        });

        let resizeFrame = 0;
        const onResize = () => {
          if (resizeFrame) cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(() => {
            heroVantaEffect?.resize?.();
          });
        };

        window.addEventListener("resize", onResize, { passive: true });
        heroVantaResizeCleanup = () => {
          window.removeEventListener("resize", onResize);
          if (resizeFrame) cancelAnimationFrame(resizeFrame);
        };
      };

      tryMount();
    })
    .catch(() => {});
}

let tempusOrbScriptPromise = null;

function cleanupTempusOrb() {
  window.__tempusOrbUnmount?.();
  window.__tempusOrbUnmount = null;
}

function ensureTempusOrbScript() {
  if (typeof window.mountTempusOrb === "function") {
    return Promise.resolve();
  }

  if (!tempusOrbScriptPromise) {
    tempusOrbScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = sitePath("/js/vendor/tempus-orb-react-app.js");
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        tempusOrbScriptPromise = null;
        reject(new Error("Tempus orb failed to load"));
      };
      document.head.appendChild(script);
    });
  }

  return tempusOrbScriptPromise;
}

function mountTempusOrbBackground() {
  if (!document.getElementById("tempus-one-orb")) return;

  ensureTempusOrbScript()
    .then(() => {
      window.mountTempusOrb?.();
    })
    .catch(() => {});
}

function cleanupHeroReturnAnimation() {
  cleanupHeroMetricsAnimations();
}

function runCountUpAnimation(element, target, { wind = false, format = formatPercentPrecise } = {}) {
  if (!element || target == null || Number.isNaN(target)) {
    return () => {};
  }

  const duration = 1800;
  let rafId = 0;
  let cancelled = false;
  const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

  element.classList.toggle("hero-return--counting", wind);
  element.classList.toggle("metric-value--counting", !wind);
  element.textContent = format(0);

  const start = performance.now();

  const tick = (now) => {
    if (cancelled) return;

    const progress = Math.min((now - start) / duration, 1);
    const value = target * easeOutCubic(progress);
    element.textContent = format(value);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    element.textContent = format(target);
    element.classList.remove("hero-return--counting", "metric-value--counting");
    element.dataset.percentAnimated = String(target);
  };

  rafId = requestAnimationFrame(tick);

  function cancelAnimation() {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    element.classList.remove("hero-return--counting", "metric-value--counting");
    if (element.__percentAnimCleanup === cancelAnimation) {
      element.__percentAnimCleanup = null;
    }
  }

  return cancelAnimation;
}

function setupHeroReturnAnimation() {
  cleanupPercentAnimations();
  updateHeroMetricsDisplay();
}

function syncSectionMediaPlayback(sections, activeIndex) {
  sections.forEach((section, index) => {
    section.querySelectorAll(".section-media video").forEach((video) => {
      if (index === activeIndex) {
        if (video.dataset.pingPong === "true") {
          video.dispatchEvent(new Event("pingpong-activate"));
        } else {
          video.play().catch(() => {});
        }
      } else {
        if (video.dataset.pingPong === "true") {
          video.dispatchEvent(new Event("pingpong-deactivate"));
        }
        video.pause();
      }
    });
  });
}

function setupPingPongPlayback(videoElement) {
  let animationFrame = 0;
  let lastFrameTime = 0;
  let reversing = false;
  let initialized = false;
  let active = false;

  videoElement.dataset.pingPong = "true";

  const START_EPSILON = 0.03;
  const MAX_REVERSE_STEP = 1 / 30;

  const safeDuration = () => {
    const duration = videoElement.duration;
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  };

  const endEpsilon = (duration = safeDuration()) => Math.max(0.02, Math.min(0.05, duration * 0.04));

  const stopReverseScrub = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
    lastFrameTime = 0;
  };

  const init = () => {
    if (initialized || !safeDuration()) return;
    initialized = true;
    videoElement.loop = false;
    videoElement.removeAttribute("loop");
  };

  const playForward = () => {
    if (!active) return;

    reversing = false;
    stopReverseScrub();
    videoElement.loop = false;
    videoElement.removeAttribute("loop");
    videoElement.playbackRate = 1;

    const duration = safeDuration();
    const epsilon = endEpsilon(duration);
    if (duration && videoElement.currentTime >= duration - epsilon) {
      videoElement.currentTime = 0;
    }

    videoElement.play().catch(() => {});
  };

  const scrubReverseStep = (frameTime) => {
    if (!reversing || !active) return;

    if (!lastFrameTime) lastFrameTime = frameTime;

    const elapsedSeconds = Math.min((frameTime - lastFrameTime) / 1000, MAX_REVERSE_STEP * 2);
    lastFrameTime = frameTime;
    const nextTime = Math.max(0, videoElement.currentTime - elapsedSeconds);
    videoElement.currentTime = nextTime;

    if (nextTime <= START_EPSILON) {
      videoElement.currentTime = 0;
      playForward();
      return;
    }

    animationFrame = requestAnimationFrame(scrubReverseStep);
  };

  const playBackward = () => {
    if (!active || reversing) return;

    const duration = safeDuration();
    if (!duration) return;

    reversing = true;
    videoElement.pause();
    videoElement.playbackRate = 1;
    videoElement.currentTime = Math.max(0, duration - endEpsilon(duration));
    lastFrameTime = 0;
    animationFrame = requestAnimationFrame(scrubReverseStep);
  };

  const onTimeUpdate = () => {
    if (!active) return;

    const duration = safeDuration();
    if (!duration || reversing) return;

    if (videoElement.currentTime >= duration - endEpsilon(duration)) {
      playBackward();
    }
  };

  const onEnded = () => {
    if (!active || reversing) return;
    playBackward();
  };

  const onActivate = () => {
    init();
    const duration = safeDuration();
    if (!duration) return;

    active = true;

    if (reversing) return;

    if (videoElement.currentTime >= duration - endEpsilon(duration)) {
      playBackward();
      return;
    }

    playForward();
  };

  const onDeactivate = () => {
    active = false;
    stopReverseScrub();
    reversing = false;
    videoElement.pause();
  };

  if (videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
    init();
  } else {
    videoElement.addEventListener("loadedmetadata", init, { once: true });
  }

  videoElement.addEventListener("durationchange", init, { once: true });
  videoElement.addEventListener("ended", onEnded);
  videoElement.addEventListener("timeupdate", onTimeUpdate);
  videoElement.addEventListener("pingpong-activate", onActivate);
  videoElement.addEventListener("pingpong-deactivate", onDeactivate);

  return () => {
    initialized = false;
    active = false;
    delete videoElement.dataset.pingPong;
    videoElement.removeEventListener("loadedmetadata", init);
    videoElement.removeEventListener("durationchange", init);
    videoElement.removeEventListener("ended", onEnded);
    videoElement.removeEventListener("timeupdate", onTimeUpdate);
    videoElement.removeEventListener("pingpong-activate", onActivate);
    videoElement.removeEventListener("pingpong-deactivate", onDeactivate);
    stopReverseScrub();
    reversing = false;
    videoElement.playbackRate = 1;
  };
}

function setupHomeScrollSnapLock(container, sections) {
  let settleTimer = null;

  const settleToNearestSection = () => {
    if (document.body.classList.contains("mobile-nav-open")) return;

    const scrollTop = container.scrollTop;
    let nearestSection = sections[0];
    let nearestDistance = Infinity;

    sections.forEach((section) => {
      const targetTop = section.offsetTop;
      const distance = Math.abs(scrollTop - targetTop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = section;
      }
    });

    if (nearestDistance > 6 && nearestDistance < container.clientHeight * 0.35) {
      scrollContainerToSection(container, nearestSection, nearestDistance > 56 ? "smooth" : "auto");
    }
  };

  const scheduleSettle = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settleToNearestSection, 120);
  };

  if ("onscrollend" in window) {
    container.addEventListener("scrollend", settleToNearestSection);
    return () => {
      container.removeEventListener("scrollend", settleToNearestSection);
      clearTimeout(settleTimer);
    };
  }

  container.addEventListener("scroll", scheduleSettle, { passive: true });
  return () => {
    container.removeEventListener("scroll", scheduleSettle);
    clearTimeout(settleTimer);
  };
}

function stripNonHomePageMedia() {
  app.querySelectorAll(
    "video, .section-media, .section-scrim, .section-source, .simple-motion, .palantir-motion, .tempus-orb-holder, .hero-vanta",
  ).forEach((element) => {
    if (element.closest(".page-home")) return;
    element.remove();
  });

  app.querySelectorAll(".public-page:not(.page-home) .section").forEach((section) => {
    section.classList.add("section-no-media");
    delete section.dataset.backdrop;
    delete section.dataset.mediaType;
  });
}

function enforcePageMediaPolicy(route) {
  document.body.dataset.page = route.page;
  cleanupHeroVanta();
  cleanupTempusOrb();

  app.querySelectorAll("video").forEach((video) => {
    if (route.page === "home" && video.closest(".page-home")) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  });

  if (route.page === "home") return;
  stripNonHomePageMedia();
}

function setupHomePageExperience() {
  const container = app.querySelector(".page-home.public-page");
  if (!container || document.body.classList.contains("theme-admin")) return;

  const sections = [...container.querySelectorAll(":scope > .section")];
  if (!sections.length) return;
  const cleanupCallbacks = [];

  let mediaSectionIndex = 0;

  sections.forEach((section) => {
    if (section.classList.contains("section-no-media")) return;
    if (!section.classList.contains("section-company")) return;

    const videoKey = sectionVideoSequence[mediaSectionIndex % sectionVideoSequence.length];
    mediaSectionIndex += 1;
    const video = backgroundVideos[videoKey];

    section.dataset.backdrop = videoKey;
    section.dataset.mediaType = video.type;

    if (isMobileLayout()) return;

    const mediaMarkup =
      video.type === "tempus-orb"
        ? `<div class="tempus-orb-holder" aria-hidden="true"><div id="tempus-one-orb"></div></div>`
        : video.type === "video"
        ? `<video src="${sitePath(video.src)}" autoplay muted ${video.pingPong ? "" : "loop"} playsinline preload="${video.pingPong ? "auto" : "metadata"}"></video>`
        : video.type === "transparent-video-animation"
          ? `<video class="transparent-motion-video" src="${sitePath(video.src)}" autoplay muted ${video.pingPong ? "" : "loop"} playsinline preload="${video.pingPong ? "auto" : "metadata"}"></video>`
        : video.type === "site-asset-animation"
          ? `<img class="site-asset-motion" src="${sitePath(video.src)}" alt="" loading="eager" />`
        : video.type === "site-layer-animation"
          ? `
            <img class="site-layer-motion site-layer-motion-base" src="${sitePath(video.src)}" alt="" loading="eager" />
            ${(video.layers || [])
              .map((layer, layerIndex) => `<img class="site-layer-motion site-layer-motion-${layerIndex + 1}" src="${sitePath(layer)}" alt="" loading="eager" />`)
              .join("")}
          `
        : video.type === "palantir-animation"
          ? `
            <div class="palantir-motion" aria-hidden="true">
              <div class="palantir-motion-grid"></div>
              <div class="palantir-motion-core"></div>
              <div class="palantir-motion-orbit palantir-motion-orbit-1"></div>
              <div class="palantir-motion-orbit palantir-motion-orbit-2"></div>
              <div class="palantir-motion-link palantir-motion-link-1"></div>
              <div class="palantir-motion-link palantir-motion-link-2"></div>
              <div class="palantir-motion-link palantir-motion-link-3"></div>
              <div class="palantir-motion-object palantir-motion-object-1">AIP</div>
              <div class="palantir-motion-object palantir-motion-object-2">OPS</div>
              <div class="palantir-motion-object palantir-motion-object-3">DATA</div>
              <div class="palantir-motion-object palantir-motion-object-4">EDGE</div>
            </div>
          `
        : video.type === "simple-animation"
          ? `
            <div class="simple-motion" aria-hidden="true">
              <div class="simple-motion-ring simple-motion-ring-1"></div>
              <div class="simple-motion-ring simple-motion-ring-2"></div>
              <div class="simple-motion-line simple-motion-line-1"></div>
              <div class="simple-motion-line simple-motion-line-2"></div>
              <div class="simple-motion-line simple-motion-line-3"></div>
              <div class="simple-motion-node simple-motion-node-1"></div>
              <div class="simple-motion-node simple-motion-node-2"></div>
              <div class="simple-motion-node simple-motion-node-3"></div>
            </div>
          `
        : video.type === "animation"
          ? `
            <img class="motion-base" src="${sitePath(video.src)}" alt="" loading="eager" />
            ${(video.layers || [])
              .map((layer, layerIndex) => `<img class="motion-layer motion-layer-${layerIndex + 1}" src="${sitePath(layer)}" alt="" loading="eager" />`)
              .join("")}
          `
        : `<img src="${sitePath(video.src)}" alt="" loading="eager" />`;

    section.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="section-media" aria-hidden="true">
          ${mediaMarkup}
        </div>
        <div class="section-scrim" aria-hidden="true"></div>
        <div class="section-source" aria-hidden="true">
          <span>${video.company}</span>
        </div>
      `,
    );

    if (video.pingPong) {
      const videoElement = section.querySelector(".section-media video");
      if (videoElement) cleanupCallbacks.push(setupPingPongPlayback(videoElement));
    }
  });

  const setActiveIndex = (nextIndex) => {
    sections.forEach((section, index) => {
      section.classList.toggle("is-active", index === nextIndex);
    });

    syncSectionMediaPlayback(sections, nextIndex);
    updateHomeScrollCta(nextIndex, sections.length);
  };

  const observerThresholds = isMobileLayout() ? [0.32, 0.48, 0.62] : [0.45, 0.6, 0.75];

  const observer = new IntersectionObserver(
    (entries) => {
      let bestEntry = null;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
          bestEntry = entry;
        }
      }

      if (!bestEntry) return;
      setActiveIndex(sections.indexOf(bestEntry.target));
    },
    {
      root: container,
      threshold: observerThresholds,
    },
  );

  sections.forEach((section, index) => {
    observer.observe(section);
    if (index === 0) {
      section.classList.add("is-active");
      syncSectionMediaPlayback(sections, 0);
    }
  });

  updateHomeScrollCta(0, sections.length);
  if (!isMobileLayout()) {
    requestAnimationFrame(() => mountHeroVanta());
  }

  if (!isMobileLayout() && document.getElementById("tempus-one-orb")) {
    requestAnimationFrame(() => mountTempusOrbBackground());
  }

  if (isMobileLayout()) {
    cleanupCallbacks.push(setupHomeScrollSnapLock(container, sections));
  }

  publicScrollCleanup = () => {
    observer.disconnect();
    cleanupCallbacks.forEach((cleanup) => cleanup());
    cleanupTempusOrb();
  };
}

function render() {
  if (window.location.hash === "#positions") {
    sessionStorage.setItem(SCROLL_TO_POSITIONS_KEY, "1");
  }
  if (window.location.hash) {
    window.history.replaceState({}, "", window.location.pathname);
  }

  const route = getRoute();
  cleanupPublicScrollExperience();
  cleanupLiveBenchmark();
  cleanupLiveCompanyReturns();
  if (mobileNavCleanup) {
    mobileNavCleanup();
    mobileNavCleanup = null;
  }
  document.body.className = route.page === "admin" ? "theme-admin" : "theme-public";
  document.body.dataset.page = route.page;
  const pageTitles = {
    portfolio: "Holdings",
    "holding-detail": "Holding",
    principles: "Principles",
    about: "About",
  };
  const pageTitleEntry = pageTitles[route.page];
  const pageTitle =
    route.page === "holding-detail"
      ? getPortfolioHoldingBySlug(route.params.ticker)?.name || pageTitleEntry
      : pageTitleEntry || route.page.replace("-", " ");
  document.title = route.page === "home" ? "Blueprint" : `Blueprint | ${pageTitle}`;
  app.innerHTML = `
    <div class="site-shell ${route.page === "admin" ? "site-shell-admin" : "site-shell-public"}">
      ${renderHeader(route)}
      ${renderPage(route)}
      ${renderFooter()}
    </div>
  `;
  cleanupPercentAnimations();
  enforcePageMediaPolicy(route);
  setupMobileNav();

  if (route.page === "home") {
    setupHomePageExperience();
  }

  if (route.page === "home" || route.page === "portfolio" || route.page === "holding-detail") {
    setupLiveBenchmark();
    setupLiveCompanyReturns();
    const activePage = route.page;
    requestAnimationFrame(() => {
      if (document.body.dataset.page !== activePage) return;
      updateBenchmarkDisplays();
    });
  } else {
    setupHeroReturnAnimation();
  }

  if (route.page === "home" && sessionStorage.getItem(SCROLL_TO_POSITIONS_KEY) === "1") {
    sessionStorage.removeItem(SCROLL_TO_POSITIONS_KEY);
    requestAnimationFrame(() => {
      scrollToFirstPosition("smooth");
    });
  }
}

function updateControl(target) {
  const control = target.dataset.control;
  if (!control) return;

  if (control === "research-search") uiState.researchSearch = target.value;
  if (control === "research-company") uiState.researchCompany = target.value;
  if (control === "research-category") uiState.researchCategory = target.value;
  if (control === "research-date") uiState.researchDate = target.value;
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "blueprint-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function printLetter(slug) {
  const letter = getLetterBySlug(slug);
  if (!letter) return;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(letter.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #111; }
          h1 { margin-bottom: 0.25rem; }
          .muted { color: #666; margin-bottom: 2rem; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(letter.title)}</h1>
        <div class="muted">${formatDate(letter.publishedAt)}</div>
        ${splitParagraphs(letter.body).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function saveAdminSection(section) {
  const textarea = document.getElementById(`admin-${section}`);
  if (!textarea) return;

  try {
    const parsed = JSON.parse(textarea.value);
    const nextStore = { ...store, [section]: parsed };
    saveStore(nextStore);
    render();
  } catch (error) {
    window.alert(`Invalid JSON in ${section}.`);
  }
}

const app = document.getElementById("app");

app.addEventListener("click", (event) => {
  if (event.target.closest("[data-home-scroll-cta]")) {
    event.preventDefault();
    handleHomeScrollCtaClick();
    return;
  }

  const link = event.target.closest("[data-link]");
  if (link) {
    event.preventDefault();
    closeMobileNav();
    if (link.hasAttribute("data-nav-positions")) {
      goToPositions();
      return;
    }
    if (link.hasAttribute("data-portfolio-home-link")) {
      sessionStorage.setItem(SCROLL_TO_POSITIONS_KEY, "1");
    }
    navigate(link.getAttribute("href"));
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const { action, section, slug } = actionTarget.dataset;

  if (action === "save-section" && section) saveAdminSection(section);
  if (action === "export-data") exportData();
  if (action === "reset-data") {
    const confirmed = window.confirm("Reset all content to the default seed data?");
    if (confirmed) {
      resetStore();
      render();
    }
  }
  if (action === "logout") {
    setAdminAuthed(false);
    render();
  }
  if (action === "print-letter" && slug) printLetter(slug);
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement) updateControl(target);
});

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.dataset.control === "research-search") {
    updateControl(target);
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.id === "admin-login-form") {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setAdminAuthed(true);
      render();
      return;
    }

    window.alert("Incorrect credentials.");
  }
});

window.addEventListener("popstate", render);

render();
