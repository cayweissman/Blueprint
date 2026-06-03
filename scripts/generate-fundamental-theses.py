#!/usr/bin/env python3
"""Generate fundamental ~1000-word holding theses (no performance commentary)."""

from pathlib import Path

from thesis_data import ALL

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "js" / "holding-theses.js"


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def wc(paragraphs):
    return sum(len(p.split()) for p in paragraphs)


lines = ["export const holdingTheses = {"]
for key, paras in ALL.items():
    w = wc(paras)
    print(f"{key}: {w} words, {len(paras)} paragraphs")
    lines.append(f"  {key}: {{")
    lines.append('    asOf: "2026-06-02",')
    lines.append("    paragraphs: [")
    for p in paras:
        lines.append(f'      "{esc(p.strip())}",')
    lines.append("    ],")
    lines.append("  },")
lines.append("};")
lines.append("")

OUT.write_text("\n".join(lines), encoding="utf-8")
print("written", OUT)
