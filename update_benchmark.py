#!/usr/bin/env python3
"""Refresh api/sp500-since-launch.json (run alongside python -m http.server if needed)."""

from __future__ import annotations

import argparse
import time

from benchmark import write_benchmark_cache, write_holdings_cache


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--watch", action="store_true", help="Refresh every 5 minutes")
    args = parser.parse_args()

    while True:
        sp500 = write_benchmark_cache()
        print(f"S&P 500 since launch: {sp500['sp500Return']:+.2f}% (as of {sp500['endDate']})")
        holdings = write_holdings_cache()
        for key, entry in holdings["holdings"].items():
            if entry.get("return") is None:
                print(f"  {key}: unavailable ({entry.get('error', 'n/a')})")
            else:
                print(f"  {key}: {entry['return']:+.2f}%")
        if not args.watch:
            break
        time.sleep(300)


if __name__ == "__main__":
    main()
