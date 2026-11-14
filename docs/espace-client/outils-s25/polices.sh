#!/bin/bash
# Préversion locale s25 : cache local des polices Google (Inter, Plus Jakarta Sans) pour le build.
# Le build tourne en environnement VIDE (aucun proxy, aucune variable du shell) : next/font ne peut pas
# joindre Google Fonts. On télécharge donc une fois, ICI (curl, hors build, aucun code applicatif),
# le CSS et les .woff2 exacts que Next demanderait, puis le build lit ces fichiers via le crochet
# officiel de next/font `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` (chemin d'un module local). Mêmes polices
# qu'en production. Idempotent : ne retélécharge rien si le cache correspond déjà aux URL du layout.
source "$(dirname "$(readlink -f "$0")")/env.sh"
CACHE="$PREV_DIR/polices"
mkdir -p "$CACHE"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'

# URL exactes calculées par les fonctions internes de next/font à partir des appels de layout.tsx.
URLS=$(cd "$WEB" && env -i PATH="$PATH" node -e '
  const d = "next/dist/compiled/@next/font/dist/google/";
  const { validateGoogleFontFunctionCall: v } = require(d + "validate-google-font-function-call");
  const { getFontAxes } = require(d + "get-font-axes");
  const { getGoogleFontsUrl } = require(d + "get-google-fonts-url");
  const src = require("fs").readFileSync("src/app/layout.tsx", "utf8");
  for (const [, fn, args] of src.matchAll(/^const \w+ = (\w+)\((\{[\s\S]*?\})\);/gm)) {
    const opts = Function(`return (${args})`)();
    const r = v(fn, opts);
    console.log(getGoogleFontsUrl(r.fontFamily, getFontAxes(r.fontFamily, r.weights, r.styles, r.selectedVariableAxes), r.display));
  }')
[ -n "$URLS" ] || { echo "Aucune police trouvée dans layout.tsx" >&2; exit 1; }
if [ -f "$CACHE/urls.txt" ] && [ "$(cat "$CACHE/urls.txt")" = "$URLS" ] && [ -f "$CACHE/mock.js" ]; then
  echo "Polices : cache à jour ($(echo "$URLS" | wc -l) familles)"; exit 0
fi

echo "module.exports = {" > "$CACHE/mock.js.tmp"
while read -r url; do
  css=$(curl -sSf -A "$UA" "$url")
  for f in $(grep -o 'https://fonts.gstatic.com/[^)]*' <<< "$css" | sort -u); do
    local_f="$CACHE/$(echo "$f" | sha256sum | cut -c1-16).woff2"
    [ -s "$local_f" ] || curl -sSf -o "$local_f" "$f"
    css=${css//"$f"/"$local_f"}
  done
  printf '  %s: %s,\n' "$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$url")" \
    "$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$css")" >> "$CACHE/mock.js.tmp"
done <<< "$URLS"
echo "};" >> "$CACHE/mock.js.tmp"
mv "$CACHE/mock.js.tmp" "$CACHE/mock.js"
echo "$URLS" > "$CACHE/urls.txt"
echo "Polices : $(echo "$URLS" | wc -l) familles, $(ls "$CACHE"/*.woff2 | wc -l) fichiers .woff2 en cache"
