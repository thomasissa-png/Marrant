#!/bin/bash
# Page de test EN LIGNE (Worker isolé `marrant-preversion`, workers.dev seulement) : chaîne s25.
#   (a) rsync de l'arbre de travail du dépôt vers la copie hors dépôt, interrupteur à true dans la COPIE
#   (b) dans la copie : wrangler.jsonc dédié (généré depuis celui du dépôt, garde-fous), noindex
#       (robots.txt « Disallow: / », X-Robots-Tag sur toutes les réponses : Worker et _headers),
#       Worker sans handler `scheduled`
#   (c) build:cf en environnement vide (env -i, variables factices, aucune clé)
#   (c bis) comparaison en LECTURE SEULE avec le Worker en ligne (si CLOUDFLARE_DM_TOKEN est là)
#   (d) --envoyer seulement : `opennextjs-cloudflare deploy` vers marrant-preversion, nom vérifié juste avant
#   (e) contrôles en ligne (après --envoyer, ou seuls avec --controles)
# Sans option : s'arrête après le build et affiche la config générée. RIEN n'est envoyé.
# RÈGLES P0 : jamais la config apps/web/wrangler.* du dépôt telle quelle ; jamais le Worker `marrant` ;
# le dépôt garde ESPACE_CLIENT_PUBLIE = false ; seul CLOUDFLARE_DM_TOKEN (+ ACCOUNT_ID) sert, à l'envoi.
set -euo pipefail
ICI=$(dirname "$(readlink -f "$0")")
DEPOT_SOURCE="${DEPOT_SOURCE:-/home/user/Marrant}"
COPIE=/root/marrant-preversion-en-ligne-s25
WEB="$COPIE/apps/web"
OUTILS=/root/marrant-preversion-en-ligne-s25-outils   # cache des polices, journaux (hors copie)
LOCALE=/root/marrant-preversion-s25                     # préversion locale (node_modules réutilisable)
NOM=marrant-preversion
URL=https://marrant-preversion.thomas-issa.workers.dev
HYPERDRIVE_ID=47335c154dde4af8879d82e514573eb7
BUCKET=marrant-preversion-next-cache
FACTICE_HD=postgres://factice:factice@localhost:5432/factice
BASE_LOCALE=postgresql://preversion:preversion@127.0.0.1:5432/marrant_preview_s25
INTER=apps/web/src/config/espace-client.ts
LIGNE_FERMEE='^export const ESPACE_CLIENT_PUBLIE: boolean = false;'
LIGNE_OUVERTE='^export const ESPACE_CLIENT_PUBLIE: boolean = true;'

ENVOYER=0; CONTROLES_SEULS=0
for a in "$@"; do case "$a" in --envoyer) ENVOYER=1 ;; --controles) CONTROLES_SEULS=1 ;; *) echo "option inconnue : $a" >&2; exit 2 ;; esac; done
T0=$(date +%s)
etape() { echo "[$(( $(date +%s) - T0 ))s] $*"; }
arret() { echo "ARRÊT : $*" >&2; exit 1; }

# Variables du Worker en ligne (relues le 14/11 sur la version 5efd3428) : aucune clé, tout est factice.
VARS_JSON=$(cat <<EOF
{ "CRON_ENABLED": "false", "CRON_ORIGIN": "$URL", "NEXTAUTH_URL": "$URL",
  "NEXT_PUBLIC_BASE_URL": "$URL", "NEXT_PUBLIC_SITE_URL": "$URL",
  "RESEND_API_KEY": "re_factice_preversion", "RESEND_BASE_URL": "https://resend.invalid",
  "STRIPE_PREMIUM_PRICE_ID": "price_e2e_local_mensuel", "STRIPE_PREMIUM_ANNUAL_PRICE_ID": "price_e2e_local_annuel" }
EOF
)

# Environnement vide pour tout outil Node du build : PATH, HOME, valeurs factices. Aucune variable du shell.
env_vide() {
  env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 CI=true NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="$DB_BUILD" \
    CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="$FACTICE_HD" \
    NEXTAUTH_URL="$URL" NEXTAUTH_SECRET=secret-factice-build-preversion \
    NEXT_PUBLIC_BASE_URL="$URL" NEXT_PUBLIC_SITE_URL="$URL" \
    RESEND_API_KEY=re_factice_preversion RESEND_BASE_URL=https://resend.invalid \
    STRIPE_PREMIUM_PRICE_ID=price_e2e_local_mensuel STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_e2e_local_annuel \
    "$@"
}

# Garde du nom : relit la config de la COPIE et refuse tout ce qui n'est pas la page de test.
garde_config() {
  [ "$(pwd -P)" = "$(readlink -f "$WEB")" ] || arret "pas dans la copie ($WEB)"
  case "$(pwd -P)" in "$(readlink -f "$DEPOT_SOURCE")"*) arret "dossier du dépôt : refus" ;; esac
  ls wrangler.* | grep -qx wrangler.jsonc && [ "$(ls wrangler.* | wc -l)" = 1 ] || arret "config wrangler inattendue"
  grep -q "^  \"name\": \"$NOM\",$" wrangler.jsonc || arret "name != $NOM dans wrangler.jsonc"
  node -e '
    const c = JSON.parse(require("fs").readFileSync("wrangler.jsonc", "utf8").replace(/^\/\/.*$/gm, ""));
    const [nom, hd, b] = process.argv.slice(1);
    const ok = c.name === nom && !c.routes && !c.route && c.triggers && Array.isArray(c.triggers.crons)
      && c.triggers.crons.length === 0 && c.services.every((s) => s.service === nom)
      && c.hyperdrive.length === 1 && c.hyperdrive[0].id === hd
      && c.r2_buckets.length === 1 && c.r2_buckets[0].bucket_name === b && c.vars.CRON_ENABLED === "false";
    if (!ok) { console.error("config refusée"); process.exit(1); }' "$NOM" "$HYPERDRIVE_ID" "$BUCKET" \
    || arret "garde de configuration"
}

controles() {
  etape "(e) contrôles en ligne sur $URL"
  local echec=0 code j="$OUTILS/cookies.txt"
  bon() { echo "  OK    $*"; }; mauvais() { echo "  ÉCHEC $*"; echec=1; }
  code=$(curl -sS -o /dev/null -w '%{http_code}' "$URL/login"); [ "$code" = 200 ] && bon "/login 200" || mauvais "/login $code"
  for p in / /login /mon-espace; do
    curl -sS -o /dev/null -D - "$URL$p" | grep -qi '^x-robots-tag: noindex, nofollow' && bon "X-Robots-Tag $p" || mauvais "X-Robots-Tag absent $p"
  done
  [ "$(curl -sS "$URL/robots.txt" | tr -d '\r' | grep -v '^$' | grep -vi '^user-agent: \*$')" = "Disallow: /" ] \
    && bon "robots.txt = Disallow: /" || mauvais "robots.txt inattendu"
  if [ -n "${CLOUDFLARE_DM_TOKEN:-}" ]; then
    curl -sS -H "Authorization: Bearer $CLOUDFLARE_DM_TOKEN" \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$NOM/schedules" \
      | grep -q '"schedules": *\[\]' && bon "0 cron (schedules: [])" || mauvais "crons présents ou illisibles"
  fi
  rm -f "$j"
  local csrf; csrf=$(curl -sS -c "$j" -b "$j" "$URL/api/auth/csrf" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).csrfToken))')
  curl -sS -o /dev/null -c "$j" -b "$j" -X POST "$URL/api/auth/callback/credentials" \
    --data-urlencode "csrfToken=$csrf" --data-urlencode "email=abonne-en-cours@preversion.test" \
    --data-urlencode "password=preversion-s24" --data-urlencode "callbackUrl=$URL/mon-espace" --data-urlencode "json=true"
  code=$(curl -sS -o /dev/null -w '%{http_code}' -b "$j" "$URL/mon-espace")
  [ "$code" = 200 ] && bon "connexion abonne-en-cours@ puis /mon-espace 200" || mauvais "/mon-espace connecté : $code"
  rm -f "$j"
  return $echec
}

# Lecture SEULE de la config en ligne (API GET) et comparaison avec la config générée.
comparer_en_ligne() {
  [ -n "${CLOUDFLARE_DM_TOKEN:-}" ] && [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ] || { echo "  (pas de jeton : comparaison sautée)"; return 0; }
  local api="https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$NOM"
  curl -sS -H "Authorization: Bearer $CLOUDFLARE_DM_TOKEN" "$api/settings" > "$OUTILS/en-ligne-settings.json"
  curl -sS -H "Authorization: Bearer $CLOUDFLARE_DM_TOKEN" "$api/schedules" > "$OUTILS/en-ligne-schedules.json"
  node -e '
    const fs = require("fs"); const [s, sc, cfg] = process.argv.slice(1).map((f) => fs.readFileSync(f, "utf8"));
    const live = JSON.parse(s).result, crons = JSON.parse(sc).result.schedules, c = JSON.parse(cfg.replace(/^\/\/.*$/gm, ""));
    const L = (b) => b.type === "plain_text" ? `var ${b.name}=${b.text}` : b.type === "secret_text" ? `secret ${b.name}`
      : b.type === "hyperdrive" ? `hyperdrive ${b.name}=${b.id}` : b.type === "r2_bucket" ? `r2 ${b.name}=${b.bucket_name}`
      : b.type === "service" ? `service ${b.name}=${b.service}` : `${b.type} ${b.name}`;
    const enLigne = new Set(live.bindings.filter((b) => b.type !== "secret_text").map(L));
    const genere = new Set([...Object.entries(c.vars).map(([k, v]) => `var ${k}=${v}`),
      ...c.hyperdrive.map((h) => `hyperdrive ${h.binding}=${h.id}`), ...c.r2_buckets.map((r) => `r2 ${r.binding}=${r.bucket_name}`),
      ...c.services.map((x) => `service ${x.binding}=${x.service}`), `assets ${c.assets.binding}`]);
    const diff = [...[...enLigne].filter((x) => !genere.has(x)).map((x) => `  - en ligne seulement : ${x}`),
      ...[...genere].filter((x) => !enLigne.has(x)).map((x) => `  + généré seulement : ${x}`)];
    console.log(diff.length ? diff.join("\n") : "  vars et bindings identiques (" + genere.size + ")");
    console.log("  secrets en ligne (gardés, non touchés) : " + live.bindings.filter((b) => b.type === "secret_text").map((b) => b.name).join(", "));
    console.log("  crons en ligne : " + JSON.stringify(crons) + " ; générés : " + JSON.stringify(c.triggers.crons));
    console.log("  compatibilité en ligne : " + live.compatibility_date + " " + live.compatibility_flags.join(",")
      + " ; générée : " + c.compatibility_date + " " + c.compatibility_flags.join(","));
  ' "$OUTILS/en-ligne-settings.json" "$OUTILS/en-ligne-schedules.json" "$WEB/wrangler.jsonc"
}

if [ "$CONTROLES_SEULS" = 1 ]; then mkdir -p "$OUTILS"; controles; exit $?; fi

# Garde-fou : le dépôt doit rester fermé.
grep -q "$LIGNE_FERMEE" "$DEPOT_SOURCE/$INTER" || arret "le dépôt n'a pas l'interrupteur à false"

etape "(a) synchronisation dépôt -> $COPIE (sans .git, node_modules, .next, .open-next, .env)"
command -v rsync >/dev/null || arret "rsync absent"
mkdir -p "$COPIE" "$OUTILS"
ln -sfn "$COPIE" "$OUTILS/depot"   # polices.sh attend <PREV_DIR>/depot/apps/web
rsync -a --delete \
  --exclude=/.git --exclude=node_modules --exclude=/apps/web/.next --exclude=/apps/web/.open-next \
  --exclude=/apps/web/.wrangler --exclude='.env' --exclude='.env.*.local' --exclude='.env.local' \
  --exclude='.env.production' --exclude='.dev.vars*' --exclude=/playwright/playwright-report \
  --exclude=/playwright/test-results --exclude=/docs/captures \
  "$DEPOT_SOURCE/" "$COPIE/"
echo "  copie : commit de base $(git -C "$DEPOT_SOURCE" rev-parse --short HEAD) + arbre de travail ($(git -C "$DEPOT_SOURCE" status --porcelain | wc -l) entrée(s) non commitée(s))"
sed -i "s/$LIGNE_FERMEE/export const ESPACE_CLIENT_PUBLIE: boolean = true;/" "$COPIE/$INTER"
grep -q "$LIGNE_OUVERTE" "$COPIE/$INTER" || arret "interrupteur introuvable dans la copie"
grep -q "$LIGNE_FERMEE" "$DEPOT_SOURCE/$INTER" && echo "  interrupteur : copie true, dépôt false (vérifié)"

etape "(b) config wrangler dédiée + noindex + Worker sans scheduled (copie seulement)"
cd "$WEB"
# Générée depuis la config du dépôt (même compatibilité, mêmes assets) ; toute clé inconnue = arrêt.
node -e '
  const fs = require("fs"); const [nom, url, hd, bucket, vars] = process.argv.slice(1);
  const src = fs.readFileSync("wrangler.jsonc", "utf8").split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n");
  const d = JSON.parse(src);
  const connues = ["$schema", "name", "main", "compatibility_date", "compatibility_flags", "workers_dev", "preview_urls",
    "routes", "assets", "services", "r2_buckets", "hyperdrive", "images", "analytics_engine_datasets", "vars", "triggers", "observability"];
  const inconnues = Object.keys(d).filter((k) => !connues.includes(k));
  if (inconnues.length) { console.error("clé(s) nouvelle(s) dans la config du dépôt : " + inconnues.join(", ")); process.exit(1); }
  if (d.name !== "marrant") { console.error("config du dépôt inattendue"); process.exit(1); }
  const c = {
    $schema: d.$schema, name: nom, main: d.main,
    compatibility_date: d.compatibility_date, compatibility_flags: d.compatibility_flags,
    workers_dev: true, preview_urls: false,
    assets: d.assets,
    services: [{ binding: "WORKER_SELF_REFERENCE", service: nom }],
    r2_buckets: [{ binding: "NEXT_INC_CACHE_R2_BUCKET", bucket_name: bucket }],
    hyperdrive: [{ binding: "HYPERDRIVE", id: hd }],
    vars: JSON.parse(vars),
    triggers: { crons: [] },
    observability: d.observability,
  };
  fs.writeFileSync("wrangler.jsonc", "// GÉNÉRÉ par page-de-test.sh : page de TEST " + url + " (jamais la production)\n"
    + JSON.stringify(c, null, 2) + "\n");
' "$NOM" "$URL" "$HYPERDRIVE_ID" "$BUCKET" "$VARS_JSON"
rm -f wrangler.toml wrangler.json
# robots.txt : tout interdit (rendu « User-Agent: * / Disallow: / », comme la version en ligne de s24).
cat > src/app/robots.ts <<'EOF'
import type { MetadataRoute } from "next";

// Page de TEST (page-de-test.sh) : rien n'est explorable.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
EOF
# Worker : l'objet d'origine n'est plus exporté ; seul `fetch` l'est (pas de handler scheduled),
# et X-Robots-Tag est posé sur TOUTES les réponses, chunks /_next/static compris.
[ "$(grep -c '^export default {$' cloudflare/worker.ts)" = 1 ] || arret "worker.ts : export default introuvable"
sed -i 's/^export default {$/const baseWorker = {/' cloudflare/worker.ts
cat >> cloudflare/worker.ts <<'EOF'

// Page de TEST (page-de-test.sh) : fetch seul, noindex sur toute réponse.
export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContextLike): Promise<Response> {
    const res = await baseWorker.fetch(request, env, ctx);
    const headers = new Headers(res.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
EOF
# Couche assets (fichiers servis sans le Worker : favicon, polices, images).
printf '\n# Page de TEST (page-de-test.sh) : jamais indexée.\n/*\n  X-Robots-Tag: noindex, nofollow\n' >> public/_headers
[ "$(grep -c '^export default {$' cloudflare/worker.ts)" = 1 ] && grep -q '^const baseWorker = {$' cloudflare/worker.ts \
  || arret "worker.ts modifié de façon inattendue"
garde_config
echo "  wrangler.jsonc généré, robots.ts, worker.ts, _headers ajustés (copie)"

etape "dépendances de la copie"
HASH_LOCK=$(sha256sum package-lock.json | cut -c1-16)
if [ ! -d node_modules ] || [ "$(cat "$OUTILS/.etat-lock" 2>/dev/null)" != "$HASH_LOCK" ]; then
  rm -rf node_modules
  if [ -d "$LOCALE/depot/apps/web/node_modules" ] && [ "$(cat "$LOCALE/.etat-lock" 2>/dev/null)" = "$HASH_LOCK" ]; then
    echo "  copie réelle du node_modules de la préversion locale (même package-lock)"
    cp -a "$LOCALE/depot/apps/web/node_modules" node_modules
  else
    # Réseau requis (registre npm, moteurs Prisma) : seulement le proxy de sortie, aucune clé.
    env -i PATH="$PATH" HOME="$HOME" HTTPS_PROXY="${HTTPS_PROXY:-}" https_proxy="${HTTPS_PROXY:-}" \
      NO_PROXY="${NO_PROXY:-localhost,127.0.0.1}" NODE_EXTRA_CA_CERTS="${NODE_EXTRA_CA_CERTS:-}" \
      npm_config_https_proxy="${HTTPS_PROXY:-}" NEXT_TELEMETRY_DISABLED=1 npm ci --no-audit --no-fund
  fi
  echo "$HASH_LOCK" > "$OUTILS/.etat-lock"
fi
[ -L node_modules ] && arret "node_modules ne doit pas être un lien (bundle faussé, incident s21)"

# Base de build : la base LOCALE jetable de la préversion s25 (données de test du seed) pour les pages
# prérendues ; jamais une base Neon. Sans elle, repli factice (pages figées sur leurs données de repli).
DB_BUILD="$FACTICE_HD"
if pg_isready -q -h 127.0.0.1 -p 5432 2>/dev/null \
  && env -i PATH="$PATH" PGPASSWORD=preversion psql -qAt -h 127.0.0.1 -U preversion -d marrant_preview_s25 -c 'select 1' >/dev/null 2>&1; then
  DB_BUILD="$BASE_LOCALE"; echo "  base de build : locale jetable marrant_preview_s25"
else
  echo "  base de build : AUCUNE (factice) ; lancer reconstruire.sh pour prérendre avec les données de test"
fi
env_vide npx prisma generate >/dev/null

etape "(c) build:cf en environnement vide (polices lues dans le cache local)"
PREV_DIR="$OUTILS" bash "$ICI/polices.sh"
rm -rf .open-next; [ -d .next ] && find .next -mindepth 1 -maxdepth 1 ! -name cache -exec rm -rf {} +
TB=$(date +%s)
env_vide NEXT_FONT_GOOGLE_MOCKED_RESPONSES="$OUTILS/polices/mock.js" npm run build:cf > "$OUTILS/build.log" 2>&1 \
  || { tail -40 "$OUTILS/build.log"; arret "build:cf"; }
echo "  build:cf OK en $(( $(date +%s) - TB ))s (journal : $OUTILS/build.log)"
# Aucune trace de base distante ni de clé dans le bundle.
if grep -rlE 'neon\.tech|sk_live_[A-Za-z0-9]{16}|rk_live_[A-Za-z0-9]{16}|whsec_[A-Za-z0-9]{16}|npg_[A-Za-z0-9]{8}|preversion:preversion@' .open-next --include='*.mjs' --include='*.js' --include='*.json' 2>/dev/null | head -3 | grep .; then
  arret "le bundle contient une URL de base ou une clé"
fi
echo "  bundle : 0 URL Neon, 0 clé Stripe ou Neon (motifs de clés réelles), 0 URL de la base locale"

etape "configuration générée (aucun secret)"
cat wrangler.jsonc
etape "(c bis) comparaison avec le Worker en ligne (lecture seule)"
comparer_en_ligne

if [ "$ENVOYER" = 0 ]; then
  etape "terminé SANS envoi (relancer avec --envoyer sur ordre de Thomas)"; exit 0
fi

etape "(d) envoi vers $NOM"
[ -n "${CLOUDFLARE_DM_TOKEN:-}" ] && [ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ] || arret "CLOUDFLARE_DM_TOKEN / CLOUDFLARE_ACCOUNT_ID absents"
cd "$WEB"; garde_config
env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 HTTPS_PROXY="${HTTPS_PROXY:-}" https_proxy="${HTTPS_PROXY:-}" \
  NO_PROXY="${NO_PROXY:-}" NODE_EXTRA_CA_CERTS="${NODE_EXTRA_CA_CERTS:-/root/.ccr/ca-bundle.crt}" \
  CLOUDFLARE_API_TOKEN="$CLOUDFLARE_DM_TOKEN" CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
  CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="$FACTICE_HD" \
  npx opennextjs-cloudflare deploy 2>&1 | tee "$OUTILS/envoi.log"
grep -E 'Current Version ID|Version ID' "$OUTILS/envoi.log" | tail -1
controles || arret "contrôles en ligne"
etape "terminé : envoyé et contrôlé"
# __SUITE__
