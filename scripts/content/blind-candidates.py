#!/usr/bin/env python3
"""Mélange les candidates d'un article pour relecture à l'aveugle.
Usage : blind-candidates.py <candidates.md> <prefixe-sortie> [graine]
Entrée : lignes « - Hn-k : texte » précédées d'une ligne « **Hn** · contexte ».
Sortie : <prefixe>-aveugle.md (n° aveugle, contexte, texte) et <prefixe>-map.tsv (n° aveugle, id d'origine).
"""
import random, re, sys
src, out = sys.argv[1], sys.argv[2]
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 20261005
ctx, items, cur = {}, [], None
for line in open(src, encoding="utf-8"):
    m = re.match(r"(?:\*\*|#{2,4}\s*)(H\d+)(?:\*\*)?\s*[·:]\s*(.+)", line.strip())
    if m:
        cur = m.group(1); ctx[cur] = m.group(2).strip(); continue
    m = re.match(r"-\s*\**(H\d+-\d+)\**\s*:\s*(.+)", line.strip())
    if m:
        slot = m.group(1).split("-")[0]
        items.append((m.group(1), ctx.get(slot, ""), m.group(2).strip()))
random.Random(seed).shuffle(items)
with open(out + "-aveugle.md", "w", encoding="utf-8") as f:
    f.write(f"# Relecture à l'aveugle ({len(items)} lignes, ordre mélangé)\n\n")
    for i, (_, c, t) in enumerate(items, 1):
        f.write(f"{i}. [{c}] {t}\n")
with open(out + "-map.tsv", "w", encoding="utf-8") as f:
    for i, (oid, _, _) in enumerate(items, 1):
        f.write(f"{i}\t{oid}\n")
print(len(items), "lignes ;", len(ctx), "contextes")
