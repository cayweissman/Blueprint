#!/usr/bin/env python3
"""Static file server with SPA routing and live benchmark API."""

from __future__ import annotations

import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from benchmark import fetch_holdings_since_launch, fetch_sp500_since_launch, write_benchmark_cache, write_holdings_cache

ROOT = Path(__file__).resolve().parent
INDEX_HTML = ROOT / "index.html"

STATIC_EXTENSIONS = {
    ".css",
    ".gif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".js",
    ".json",
    ".map",
    ".mp4",
    ".png",
    ".svg",
    ".webm",
    ".woff",
    ".woff2",
}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _resolve_file(self, path: str) -> Path | None:
        relative = path.lstrip("/")
        if not relative:
            return INDEX_HTML if INDEX_HTML.is_file() else None

        candidate = ROOT / relative
        if candidate.is_file():
            return candidate

        if candidate.is_dir():
            index = candidate / "index.html"
            if index.is_file():
                return index

        return None

    def _should_fallback_to_spa(self, path: str) -> bool:
        if path in ("/api/sp500-since-launch", "/api/sp500-since-launch.json", "/api/holdings-since-launch", "/api/holdings-since-launch.json"):
            return False

        suffix = Path(path).suffix.lower()
        if suffix in STATIC_EXTENSIONS:
            return False

        return self._resolve_file(path) is None

    def do_GET(self):
        path = self.path.split("?")[0]
        query = f"?{self.path.split('?', 1)[1]}" if "?" in self.path else ""

        if path in ("/api/sp500-since-launch", "/api/sp500-since-launch.json"):
            try:
                data = fetch_sp500_since_launch()
                write_benchmark_cache()
                self._send_json(200, data)
            except Exception as error:
                self._send_json(502, {"error": str(error)})
            return

        if path in ("/api/holdings-since-launch", "/api/holdings-since-launch.json"):
            try:
                data = fetch_holdings_since_launch()
                write_holdings_cache()
                self._send_json(200, data)
            except Exception as error:
                self._send_json(502, {"error": str(error)})
            return

        if self._should_fallback_to_spa(path):
            self.path = f"/index.html{query}"
            return super().do_GET()

        return super().do_GET()


def main() -> None:
    parser = argparse.ArgumentParser(description="Blueprint dev server (SPA + API)")
    parser.add_argument("--host", default="0.0.0.0", help="Bind address (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port (default: 8000)")
    args = parser.parse_args()

    try:
        write_benchmark_cache()
    except Exception as error:
        print(f"Warning: could not warm S&P cache: {error}")

    try:
        write_holdings_cache()
    except Exception as error:
        print(f"Warning: could not warm holdings cache: {error}")

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Serving {ROOT} at http://{args.host}:{args.port}")
    print("SPA routes (/research, /performance, …) refresh correctly on this server.")
    print("Do not use: python3 -m http.server (breaks refresh on subpages)")
    print("Live benchmark: /api/sp500-since-launch")
    print("Holdings returns: /api/holdings-since-launch")
    server.serve_forever()


if __name__ == "__main__":
    main()
