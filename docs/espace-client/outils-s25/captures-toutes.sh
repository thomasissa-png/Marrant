#!/bin/bash
# Captures de toutes les sections en parallèle (4 à la fois) : captures-toutes.sh <dossier-sortie>
# Une sous-série par section : <dossier>/<section>/. Préversion locale 5400 démarrée, comptes remis à zéro.
cd "$(dirname "$(readlink -f "$0")")"
OUT="${1:?dossier de sortie}"
SECTIONS="entete aujourdhui quoi-repondre bibliotheque s-entrainer questions repliques lettre favoris carnet parcours profil vannes fiches"
mkdir -p "$OUT"
# connexions d'abord (une fois), pour que les séries parallèles partagent les états
LARGEURS=375 node captures-sections.mjs etalon "$OUT/_amorce" >/dev/null 2>&1
for c in gratuit en-cours nouvel; do LARGEURS=375 COMPTES=$c node captures-sections.mjs profil "$OUT/_amorce" >/dev/null 2>&1; done
rm -rf "$OUT/_amorce"
echo "$SECTIONS" | tr ' ' '\n' | xargs -P 4 -I{} sh -c 'node captures-sections.mjs {} "'"$OUT"'/{}" > "'"$OUT"'/{}.log" 2>&1; echo "{} : $(ls "'"$OUT"'/{}" | wc -l) fichiers"'
