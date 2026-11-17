#!/bin/bash
# Suite Playwright locale COMPLÈTE (projets local + local-compteurs) en environnement vide, calquée sur e2e-local.
# Usage : a1-pw.sh ouvert|ferme <sortie> [args playwright supplémentaires...]
REGIME=$1; SORTIE=$2; shift 2
I=/tmp/claude-0/-home-user-Marrant/d6602e0f-29e9-5866-8a98-b2a3406a6992/scratchpad/integ
case "$REGIME" in
  ouvert) PORT=5500; RESEND=5402; BASE=marrant_e2e_a13; OUVERT=1 ;;
  ferme) PORT=5501; RESEND=5403; BASE=marrant_e2e_a1_ferme; OUVERT= ;;
  *) exit 2 ;;
esac
cd /home/user/Marrant/apps/web
env -i PATH="$PATH" HOME="$HOME" LANG=C.UTF-8 CI=true \
  E2E_BASE_URL=http://localhost:$PORT \
  E2E_DATABASE_URL="postgresql://preversion:preversion@127.0.0.1:5432/$BASE" \
  E2E_FAUX_RESEND_PORT=$RESEND E2E_ESPACE_OUVERT=$OUVERT \
  E2E_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome \
  NODE_PATH="$PWD/node_modules" npx playwright test -c ../../playwright/playwright.config.ts \
  --project=local --project=local-compteurs --trace off --reporter=line --output=/tmp/claude-0/-home-user-Marrant/d6602e0f-29e9-5866-8a98-b2a3406a6992/scratchpad/integ/a13-pw-out-$REGIME "$@" > "$I/$SORTIE" 2>&1
echo "FIN $?" >> "$I/$SORTIE"
