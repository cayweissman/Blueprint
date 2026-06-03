"""Live market returns since fund launch (Yahoo Finance)."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

LAUNCH_DATE = "2026-01-20"
SP500_SYMBOL = "^GSPC"
ROOT = Path(__file__).resolve().parent
SP500_CACHE_PATH = ROOT / "api" / "sp500-since-launch.json"
HOLDINGS_CACHE_PATH = ROOT / "api" / "holdings-since-launch.json"

HOLDINGS = [
    {"key": "nebius", "symbol": "NBIS", "name": "Nebius", "category": "AI infrastructure"},
    {"key": "robinhood", "symbol": "HOOD", "name": "Robinhood", "category": "Retail investing"},
    {"key": "oklo", "symbol": "OKLO", "name": "Oklo", "category": "Advanced nuclear"},
    {"key": "crispr", "symbol": "CRSP", "name": "CRISPR", "category": "Gene editing"},
    {"key": "xenergy", "symbol": "XE", "name": "X-Energy", "category": "Modular nuclear"},
    {"key": "aurora", "symbol": "AUR", "name": "Aurora", "category": "Autonomous freight"},
    {"key": "ginkgo", "symbol": "DNA", "name": "Ginkgo", "category": "Synthetic biology"},
    {"key": "tempus", "symbol": "TEM", "name": "Tempus", "category": "Precision medicine"},
    {"key": "avav", "symbol": "AVAV", "name": "AeroVironment", "category": "Defense drones"},
    {"key": "amazon", "symbol": "AMZN", "name": "Amazon", "category": "Cloud & commerce"},
    {"key": "arm", "symbol": "ARM", "name": "Arm", "category": "Semiconductors"},
    {"key": "cloudflare", "symbol": "NET", "name": "Cloudflare", "category": "Edge infrastructure"},
    {"key": "ionq", "symbol": "IONQ", "name": "IonQ", "category": "Quantum computing"},
    {"key": "palantir", "symbol": "PLTR", "name": "Palantir", "category": "Enterprise software"},
    {"key": "symbotic", "symbol": "SYM", "name": "Symbotic", "category": "Warehouse automation"},
    {"key": "tesla", "symbol": "TSLA", "name": "Tesla", "category": "EV & energy"},
]


def fetch_symbol_since_launch(symbol: str) -> dict:
    start_ts = _utc_timestamp(LAUNCH_DATE) - 86400
    end_ts = int(datetime.now(timezone.utc).timestamp())
    encoded = urllib.parse.quote(symbol, safe="")

    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{encoded}"
        f"?period1={start_ts}&period2={end_ts}&interval=1d"
    )
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.load(response)

    result = payload["chart"]["result"][0]
    timestamps = result["timestamp"]
    closes = result["indicators"]["quote"][0]["close"]
    pairs = [(timestamp, close) for timestamp, close in zip(timestamps, closes) if close is not None]

    if len(pairs) < 2:
        raise ValueError("Insufficient market data")

    launch_day = datetime.strptime(LAUNCH_DATE, "%Y-%m-%d").date()
    start_pair = next(
        pair for pair in pairs if datetime.fromtimestamp(pair[0], tz=timezone.utc).date() >= launch_day
    )
    end_pair = pairs[-1]
    return_pct = (end_pair[1] / start_pair[1] - 1) * 100

    return {
        "symbol": symbol,
        "launchDate": LAUNCH_DATE,
        "startDate": datetime.fromtimestamp(start_pair[0], tz=timezone.utc).strftime("%Y-%m-%d"),
        "endDate": datetime.fromtimestamp(end_pair[0], tz=timezone.utc).strftime("%Y-%m-%d"),
        "startClose": round(start_pair[1], 4),
        "endClose": round(end_pair[1], 4),
        "return": round(return_pct, 4),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "live",
    }


def fetch_sp500_since_launch() -> dict:
    data = fetch_symbol_since_launch(SP500_SYMBOL)
    return {
        **data,
        "symbol": SP500_SYMBOL,
        "sp500Return": data["return"],
    }


def _fetch_holding_entry(holding: dict) -> dict:
    base = {
        "key": holding["key"],
        "name": holding["name"],
        "category": holding["category"],
        "symbol": holding["symbol"],
        "launchDate": LAUNCH_DATE,
    }

    if not holding["symbol"]:
        return {
            **base,
            "return": None,
            "error": "Not publicly traded",
            "source": "unavailable",
        }

    try:
        data = fetch_symbol_since_launch(holding["symbol"])
        return {
            **base,
            "return": data["return"],
            "startDate": data["startDate"],
            "endDate": data["endDate"],
            "startClose": data["startClose"],
            "endClose": data["endClose"],
            "updatedAt": data["updatedAt"],
            "source": "live",
        }
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError, KeyError, IndexError) as error:
        return {
            **base,
            "return": None,
            "error": str(error),
            "source": "error",
        }


def fetch_holdings_since_launch() -> dict:
    holdings: dict[str, dict] = {}

    with ThreadPoolExecutor(max_workers=len(HOLDINGS)) as pool:
        futures = {pool.submit(_fetch_holding_entry, holding): holding["key"] for holding in HOLDINGS}
        for future in as_completed(futures):
            entry = future.result()
            holdings[entry["key"]] = entry

    return {
        "launchDate": LAUNCH_DATE,
        "holdings": holdings,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "live",
    }


def _load_existing_cache(path: Path) -> dict | None:
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def write_benchmark_cache() -> dict:
    try:
        data = fetch_sp500_since_launch()
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError, KeyError, IndexError):
        existing = _load_existing_cache(SP500_CACHE_PATH)
        if existing and isinstance(existing.get("sp500Return"), (int, float)):
            return existing
        raise

    SP500_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    SP500_CACHE_PATH.write_text(json.dumps(data), encoding="utf-8")
    return data


def write_holdings_cache() -> dict:
    data = fetch_holdings_since_launch()
    existing = _load_existing_cache(HOLDINGS_CACHE_PATH)
    if existing and isinstance(existing.get("holdings"), dict):
        for key, entry in data["holdings"].items():
            if entry.get("return") is not None:
                continue
            previous = existing["holdings"].get(key)
            if previous and isinstance(previous.get("return"), (int, float)):
                data["holdings"][key] = previous

    HOLDINGS_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    HOLDINGS_CACHE_PATH.write_text(json.dumps(data), encoding="utf-8")
    return data


def _utc_timestamp(date_str: str) -> int:
    dt = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    return int(dt.timestamp())
