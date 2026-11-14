#!/bin/bash
# Préversion locale s25 : remet les 3 comptes de TEST dans leur état de référence (comptes.sql),
# dates recalculées par rapport au jour courant. Rejouable à volonté, serveur démarré ou non.
# Mot de passe des 3 comptes : preversion-s24. Option --etat : affiche seulement l'état en base.
source "$(dirname "$(readlink -f "$0")")/env.sh"
base_prete

etat() {
  psql_base -F ' | ' <<'SQL'
SELECT u.email, u.plan, coalesce(s.status::text, '-') AS abonnement,
       coalesce(to_char(s."createdAt", 'YYYY-MM-DD'), '-') AS depuis, u.xp, u.level,
       (SELECT count(*) FROM "UserPathStepCompletion" c WHERE c."userId" = u.id) AS etapes,
       (SELECT count(*) FROM "CapAnnonce" a WHERE a."userId" = u.id) AS annonces_cap,
       (SELECT count(*) FROM "CarteReponse" r WHERE r."userId" = u.id AND r."repondueLe" < date_trunc('day', now() AT TIME ZONE 'Europe/Paris') AT TIME ZONE 'Europe/Paris') AS cartes_passees,
       (SELECT count(*) FROM "CarteSuivi" r WHERE r."userId" = u.id AND r."dueLe" <= now()) AS revisions_dues,
       (SELECT count(*) FROM "UserReplique" r WHERE r."userId" = u.id) AS repliques,
       (SELECT count(*) FROM "FicheFait" r WHERE r."userId" = u.id) AS faites,
       (SELECT count(*) FROM "MissionRetour" r WHERE r."userId" = u.id) AS missions,
       (SELECT count(*) FROM "UserFavorite" r WHERE r."userId" = u.id) AS favoris,
       (SELECT count(*) FROM "EquipeFil" f WHERE f."userId" = u.id AND f.statut = 'REPONDU' AND f."ouvertParAbonneLe" IS NULL) AS reponses_non_lues
FROM "User" u LEFT JOIN "Subscription" s ON s."userId" = u.id
WHERE u.email LIKE '%@preversion.test' ORDER BY u.email;
SQL
}
if [ "${1:-}" = --etat ]; then
  echo "email | plan | abonnement | depuis | xp | niveau | étapes | annonces cap | cartes passées | révisions dues | répliques | faites | missions | favoris | réponses non lues"
  etat; exit 0
fi

[ "$(psql_base -c 'SELECT count(*) FROM "LearningPath" WHERE slug IN ('"'repartie','machine-a-cafe'"')')" = 2 ] \
  || { echo "Parcours Répartie / Machine à café absents : lancer reconstruire.sh --seed" >&2; exit 1; }

# Même hachage que apps/web/src/lib/password.ts (scrypt N=2^15, r=8, p=1, sel hexadécimal 16 octets).
hacher() {
  env -i PATH="$PATH" node -e '
    const { randomBytes, scryptSync } = require("node:crypto");
    const sel = randomBytes(16).toString("hex");
    const cle = scryptSync("preversion-s24", sel, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    process.stdout.write(`${sel}:${cle.toString("hex")}`);'
}
J1=$(psql_base -c 'SELECT id FROM "Joke" WHERE "isActive" AND NOT "humourNoir" ORDER BY "createdAt", id LIMIT 1')
J2=$(psql_base -c 'SELECT id FROM "Joke" WHERE "isActive" AND NOT "humourNoir" ORDER BY "createdAt", id OFFSET 1 LIMIT 1')
T1=$(psql_base -c 'SELECT id FROM "Tip" WHERE "isActive" ORDER BY "createdAt", id LIMIT 1')
[ -n "$J1" ] && [ -n "$J2" ] && [ -n "$T1" ] || { echo "Vannes ou conseils absents du seed" >&2; exit 1; }

psql_base -v h1="$(hacher)" -v h2="$(hacher)" -v h3="$(hacher)" -v j1="$J1" -v j2="$J2" -v t1="$T1" \
  -f "$PREV_DIR/comptes.sql"
echo "Comptes remis à zéro (mot de passe : preversion-s24) :"
etat
