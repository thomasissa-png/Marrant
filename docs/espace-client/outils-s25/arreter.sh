#!/bin/bash
# Préversion locale s25 : arrête le serveur (5400) et le faux Resend (5401). Idempotent.
#   --serveur : le serveur seulement ; --tout : aussi le cluster Postgres local 16/main.
source "$(dirname "$(readlink -f "$0")")/env.sh"
MODE="${1:-}"
arreter() { # $1 = libellé, $2.. = pids
  local nom="$1"; shift
  [ $# -eq 0 ] && { echo "$nom : déjà arrêté"; return 0; }
  kill "$@" 2>/dev/null || true
  for _ in $(seq 1 20); do kill -0 "$@" 2>/dev/null || { echo "$nom : arrêté"; return 0; }; sleep 0.25; done
  kill -9 "$@" 2>/dev/null || true; echo "$nom : arrêté (forcé)"
}
# shellcheck disable=SC2046
arreter "serveur 5400" $(serveur_pid)
[ "$MODE" = --serveur ] && exit 0
# shellcheck disable=SC2046
arreter "faux Resend 5401" $(resend_pid)
if [ "$MODE" = --tout ]; then pg_ctlcluster 16 main stop 2>/dev/null || true; echo "Postgres 16/main : arrêté"; fi
