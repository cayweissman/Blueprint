#!/usr/bin/env bash
cd "$(dirname "$0")"
exec python3 serve.py --host 0.0.0.0 --port "${PORT:-8000}"
