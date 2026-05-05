#!/usr/bin/env bash
# scripts/check-prisma-enums.sh
#
# Détecte les chaînes en MAJUSCULES_SNAKE utilisées dans apps/web/src/
# qui ne correspondent à AUCUN enum déclaré dans schema.prisma.
#
# Pourquoi ce script existe :
# Session 8 (05/05/2026) — 3 bugs P0 d'affilée sur l'enum SocialFormat :
#   1. MINI_STANDUP / POTE_AU_TAF / IMAGE_QUI_CLAQUE manquaient → cron crash
#   2. WILD_CARD utilisé en code mais jamais ajouté à l'enum → publish-social crash
# Ce script aurait détecté ces 2 bugs avant runtime.
#
# Usage :
#   bash scripts/check-prisma-enums.sh
#   → exit 0 si aucune incohérence
#   → exit 1 si chaînes UPPER_CASE non déclarées détectées (review humaine)
#
# Whitelist : ajouter ci-dessous toute constante UPPER_CASE attendue qui
# n'est pas un enum Prisma (env var, méthode HTTP, code device, etc.).

set -uo pipefail

SCHEMA="apps/web/prisma/schema.prisma"
SRC_DIR="apps/web/src"

if [ ! -f "$SCHEMA" ]; then
  echo "ERROR: $SCHEMA not found"
  exit 2
fi

# Extraire toutes les valeurs déclarées dans tous les enums du schema
# Pattern : ligne dans un block "enum X { ... }" qui commence par 2 espaces puis MAJUSCULES
declared=$(awk '/^enum [A-Z]/,/^}/' "$SCHEMA" \
  | grep -oE "^  [A-Z][A-Z_0-9]+" \
  | tr -d ' ' \
  | sort -u)

# Whitelist : valeurs UPPER_CASE_SNAKE attendues hors enum Prisma
# Maintenue manuellement — ajouter ici toute nouvelle constante interne en UPPER_CASE.
# Catégorisée pour faciliter la maintenance.
WHITELIST="
# HTTP / config / env vars
GET POST PUT DELETE PATCH HEAD OPTIONS
TRUE FALSE NULL ERROR
NODE_ENV DATABASE_URL INDEXNOW_KEY RESEND_API_KEY ADMIN_PASSWORD
CRON_SECRET NEXTAUTH_SECRET NEXTAUTH_URL ANTHROPIC_API_KEY YOUTUBE_API_KEY
STRIPE_SECRET_KEY STRIPE_PRICE_ID STRIPE_WEBHOOK_SECRET STRIPE_PUBLIC_KEY
EMAIL_FROM BUILD_DATE PORT VERCEL_URL REPLIT_DEV_DOMAIN
BUFFER_ACCESS_TOKEN BUFFER_ORGANIZATION_ID
BUFFER_CHANNEL_TWITTER BUFFER_CHANNEL_LINKEDIN BUFFER_CHANNEL_INSTAGRAM
NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_UMAMI_WEBSITE_ID NEXT_PUBLIC_UMAMI_HOST
GCS_BUCKET_NAME GOOGLE_APPLICATION_CREDENTIALS
USER_AGENT CONTENT_TYPE

# Acronymes / codes techniques
SET MAP JSON HTML CSS DOM API CDN DNS SDK
URL URI HTTP HTTPS UUID ISO UTC EU USD EUR
SVG PNG JPG JPEG WEBP ICO PDF CSV TXT MP3 MP4
PRO HD 4K
SEO GEO LTV CAC MRR ARR ROI KPI TTFB
SPAN

# Codes erreurs Node.js (lib/ai/client.ts retry handler)
ECONNREFUSED ECONNRESET EHOSTUNREACH ETIMEDOUT ENOTFOUND ECONNABORTED EPIPE

# Codes erreurs Prisma
P2002 P2021 P2025 P2003 P2014

# Catégories blog Marrant (constantes internes blog-articles.ts)
GUIDE PRATIQUE ANALYSE CATALOGUE CONTEXTE CRITIQUE HABITUDES PSYCHOLOGIE ROADMAP STORYTELLING SAISONNIER

# Personas internes Marrant (jamais exposés public, voix narrateur)
YANIS SOPHIE MARC PUNCHLINEUR OBSERVATEUR STORYTELLER TAQUIN

# Quiz humor (humor-quiz.tsx — typologies internes)
AVANCE CONFIANCE GLOBAL

# Verdicts / statuts internes Director / agents IA
APPROVED NEEDS_REVISION REJECTED VALIDATION_IMPOSSIBLE INVALID INVALIDE
INVALID_CAT INVALID_DIFF INVALID_TYPE INVALID_VERDICT
RATE_LIMIT SAVE_ERROR CRASH MANQUANT INCONNU NEXT_NOT_FOUND

# Levels / priorités internes
HIGH MEDIUM LOW URGENT NORMAL CRITICAL CRASH BLOQUANT

# RevenueCat webhook events (apps/web/src/app/api/iap/revenuecat-webhook/route.ts)
INITIAL_PURCHASE RENEWAL CANCELLATION UNCANCELLATION EXPIRATION
PRODUCT_CHANGE BILLING_ISSUE NON_RENEWING_PURCHASE

# Plateformes / types externes
INSTAGRAM_REELS YOUTUBE_SHORTS TIKTOK REEL MAIN_FEED FINISHED ORIGINAL
PUBLIC PRIVATE READ_ONLY_MODELS USER_LEVELS SITE_COPY SOCIAL DESIGN
BLOG VANNES BUTTON ONESHOT GENERAL HARO

# Durées ISO 8601 (YouTube Data API)
PT5M30S PT7M30S PT12M30S PT30M PT1H5M

# Channel IDs YouTube (testIDs)
UC123

# Saisons / dates
SAINT_VALENTIN

# Placeholders explicites (prompts LLM)
ID_EXACT_DE_LA_VIDEO
"

# Liste des valeurs UPPER_CASE_SNAKE entre guillemets dans le code TS/TSX
# Pattern : "VALEUR" ou 'VALEUR' où VALEUR matche [A-Z][A-Z_0-9]{3,}
used=$(grep -rhoE "[\"'][A-Z][A-Z_0-9]{3,}[\"']" "$SRC_DIR" \
  --include="*.ts" --include="*.tsx" 2>/dev/null \
  | sed -E "s/^[\"']//; s/[\"']$//" \
  | sort -u)

mismatches=()
for v in $used; do
  # Skip whitelist
  if echo "$WHITELIST" | tr -s ' \n' '\n' | grep -qx "$v"; then
    continue
  fi
  # Skip si dans le schema
  if echo "$declared" | grep -qx "$v"; then
    continue
  fi
  mismatches+=("$v")
done

# Audit inverse : valeurs déclarées dans le schema qui ne sont JAMAIS utilisées
# (peut indiquer un enum value mort à supprimer — non bloquant)
unused=()
for d in $declared; do
  count=$(grep -rln "[\"']$d[\"']" "$SRC_DIR" \
    --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  if [ "$count" -eq 0 ]; then
    unused+=("$d")
  fi
done

# Rapport
echo "===== check-prisma-enums ====="
echo "Schema    : $SCHEMA"
echo "Source dir: $SRC_DIR"
echo "Enums déclarés : $(echo "$declared" | wc -l) valeurs"
echo "Strings UPPER_CASE_SNAKE utilisées : $(echo "$used" | wc -l)"
echo ""

if [ ${#mismatches[@]} -gt 0 ]; then
  echo "❌ BLOQUANT — ${#mismatches[@]} chaîne(s) UPPER_CASE_SNAKE utilisée(s) dans src/ ABSENTE(S) des enums Prisma :"
  echo "   (peut causer un crash Prisma à runtime si passée à un champ enum)"
  echo "   Si attendu hors enum : ajouter à WHITELIST dans scripts/check-prisma-enums.sh"
  echo ""
  for v in "${mismatches[@]}"; do
    refs=$(grep -rln "[\"']$v[\"']" "$SRC_DIR" \
      --include="*.ts" --include="*.tsx" 2>/dev/null | head -3)
    echo "  ❌ $v"
    if [ -n "$refs" ]; then
      echo "$refs" | sed 's/^/      /'
    fi
    echo ""
  done
fi

if [ ${#unused[@]} -gt 0 ]; then
  echo "ℹ️  INFO — ${#unused[@]} valeur(s) d'enum déclarée(s) jamais utilisée(s) dans src/ (non bloquant) :"
  printf "  - %s\n" "${unused[@]}"
  echo ""
fi

if [ ${#mismatches[@]} -eq 0 ]; then
  echo "✅ check-prisma-enums : aucune incohérence bloquante."
  exit 0
fi

exit 1
