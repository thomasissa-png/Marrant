#!/bin/bash
# Lance une commande avec un environnement PROPRE (aucun secret prod).
# Usage : cleanenv.sh <cmd...>
exec env -i \
  PATH="/usr/local/bin:/usr/bin:/bin:$(dirname "$(command -v node)")" \
  HOME="$HOME" \
  TERM=dumb \
  LANG=C.UTF-8 \
  NODE_EXTRA_CA_CERTS="$NODE_EXTRA_CA_CERTS" \
  NEXT_TELEMETRY_DISABLED=1 \
  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  DATABASE_URL="postgresql://postgres@127.0.0.1:55433/marrant_qa" \
  NEXTAUTH_URL="http://localhost:5000" \
  NEXTAUTH_SECRET="qa-local-secret-factice-0123456789abcdef" \
  CRON_SECRET="qa-local-cron-factice" \
  CONTENT_GENERATION_ENABLED=false \
  COPY_REVIEW_ENABLED=false \
  SKIP_JOKE_DECRYPTAGE_AI_BACKFILL=1 \
  PORT=5000 \
  ${QA_NODE_ENV:+NODE_ENV=$QA_NODE_ENV} \
  ${QA_EXTRA} \
  "$@"
