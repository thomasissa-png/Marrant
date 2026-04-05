# Système de Gates — deviens-marrant.fr

> Chaque gate est un check automatisé qui BLOQUE le déploiement ou ALERTE si un problème est détecté.
> Objectif : plus jamais une semaine de debug sur un bug qui aurait été trouvé en 10 secondes.

---

## Gate 1 — Pre-commit (local, avant chaque push)

### G1.1 — Tests passent
```bash
cd apps/web && npx jest --no-coverage --bail
```
**Bloque si** : 1+ test échoue

### G1.2 — Pas de clés hardcodées
```bash
grep -rn "35cc97ed\|INDEXNOW_KEY.*??.*\"[a-f0-9]" apps/web/src/ --include="*.ts"
```
**Bloque si** : fallback hardcodé trouvé pour une clé d'API

### G1.3 — Pas de REPLIT_DEV_DOMAIN dans les URLs publiques
```bash
grep -rn "REPLIT_DEV_DOMAIN" apps/web/src/ --include="*.ts" | grep -v "test\|__tests__"
```
**Bloque si** : REPLIT_DEV_DOMAIN utilisé hors des tests (cause des URLs 404 en prod)

### G1.4 — Pas de clés dupliquées dans les objets metadata
```bash
# Vérifie les doublons de propriétés dans les exports metadata
grep -Pzo "(?s)metadata.*?=.*?\{.*?\}" apps/web/src/app/layout.tsx | grep -oP '^\s+\w+:' | sort | uniq -d
```
**Bloque si** : propriété dupliquée (ex: double `other`)

### G1.5 — Pas de logique dupliquée instrumentation.ts ↔ crons
```bash
# instrumentation.ts ne doit contenir que des fetch localhost, pas de logique Prisma directe pour social
grep -n "prisma\.\(socialPost\|blogArticle\)" apps/web/src/instrumentation.ts
```
**Bloque si** : instrumentation.ts fait des opérations Prisma social directes (doit déléguer aux crons HTTP)

---

## Gate 2 — Post-deploy (automatisé, après chaque déploiement)

### G2.1 — Site accessible
```bash
curl -sf https://deviens-marrant.fr > /dev/null
```
**Alerte si** : status != 200

### G2.2 — Redirection www propre (PAS de :port)
```bash
REDIRECT=$(curl -sI https://www.deviens-marrant.fr | grep -i "location:" | head -1)
echo "$REDIRECT" | grep -v ":[0-9]\{4\}" > /dev/null
```
**Alerte si** : la redirection contient un port (ex: `:5904`)

### G2.3 — Sitemap valide
```bash
curl -sf https://deviens-marrant.fr/sitemap.xml | grep "<url>" | wc -l
```
**Alerte si** : < 10 URLs (sitemap cassé)

### G2.4 — IndexNow key accessible et non-vide
```bash
KEY=$(curl -sf https://deviens-marrant.fr/indexnow-key.txt)
[ -n "$KEY" ] && [ ${#KEY} -ge 10 ]
```
**Alerte si** : clé vide ou trop courte

### G2.5 — Canonical pas de port interne
```bash
curl -sf https://deviens-marrant.fr | grep 'rel="canonical"' | grep -v ":[0-9]\{4\}"
```
**Alerte si** : canonical contient un port interne

### G2.6 — Meta robots pas de noindex sur pages publiques
```bash
for page in / /vannes /conseils /videos /blog /parcours; do
  ROBOTS=$(curl -sf "https://deviens-marrant.fr$page" | grep 'name="robots"' | head -1)
  echo "$ROBOTS" | grep -q "noindex" && echo "FAIL: $page has noindex"
done
```
**Alerte si** : noindex sur une page publique

### G2.7 — Image Instagram accessible (pas de dev domain)
```bash
# Vérifie que la dernière image Instagram en DB pointe vers deviens-marrant.fr
# (via API admin ou log du cron)
```
**Alerte si** : imageUrl contient "replit.dev" ou "localhost"

---

## Gate 3 — Cron health (toutes les 6h)

### G3.1 — Contenu du jour existe
```sql
SELECT COUNT(*) FROM "DailyContent" WHERE date = CURRENT_DATE;
```
**Alerte si** : 0 (le cron daily-content n'a pas tourné)

### G3.2 — Posts sociaux générés par plateforme
```sql
SELECT platform, COUNT(*) FROM "SocialPost"
WHERE "createdAt" >= CURRENT_DATE
GROUP BY platform;
```
**Alerte si** : une plateforme manque (le bug du compteur global)

### G3.3 — Pas de boucle 429
```sql
SELECT platform, COUNT(*) FROM "SocialPost"
WHERE status = 'FAILED'
AND "directorNote" LIKE '%429%'
AND "updatedAt" >= NOW() - INTERVAL '24 hours'
GROUP BY platform;
```
**Alerte si** : > 3 posts FAILED 429 sur la même plateforme en 24h (circuit breaker devrait avoir coupé)

### G3.4 — Pas d'accumulation de posts APPROVED non publiés
```sql
SELECT platform, COUNT(*) FROM "SocialPost"
WHERE status = 'APPROVED'
AND "scheduledAt" < NOW() - INTERVAL '6 hours'
GROUP BY platform;
```
**Alerte si** : > 5 posts APPROVED en retard de > 6h (pipeline bloqué)

### G3.5 — Connection pool Prisma sain
```
Monitorer les logs pour "Timed out fetching a new connection from the connection pool"
```
**Alerte si** : message détecté dans les dernières 6h

---

## Gate 4 — Qualité contenu (dans le pipeline IA)

### G4.1 — Punchline ≠ constat (déjà implémenté)
Le Stand-Up Director rejette les vannes dont la punchline est un simple constat.
Score plafonné à 5 si pas de twist comique.

### G4.2 — Diversité humoristes (déjà implémenté)
Rotation quotidienne des 8 humoristes de référence.
Critère #11 dans la validation Director.

### G4.3 — Persona leak guard (déjà implémenté)
Rejet automatique si "Yanis", "Sophie" ou "Marc" dans le contenu public.

### G4.4 — Validation Director obligatoire
Aucun contenu (vanne, conseil, article) n'est publié sans validation Director.
Si l'API crash → status PENDING + review manuelle.

---

## Mapping bugs → gates

| Bug rencontré | Gate qui l'aurait empêché |
|---------------|--------------------------|
| www :5904 redirect | G2.2 |
| Instagram URLs dev domain | G1.3, G2.7 |
| Doubles posts (instrumentation.ts) | G1.5 |
| IndexNow clés mismatch | G1.2, G2.4 |
| Prisma pool timeout | G3.5 |
| 429 boucle infinie | G3.3 |
| LinkedIn 0 posts (compteur global) | G3.2 |
| Double clé `other` layout.tsx | G1.4 |
| Vanne sans punchline | G4.1 |
| GCS signed URLs impossibles | (pas de gate — erreur de conception) |

---

## Implémentation

### Phase 1 — Immédiat (0 dev)
- G2.1 à G2.6 : script bash post-deploy à lancer manuellement après chaque déploiement
- G3.1 à G3.4 : requêtes SQL à lancer dans l'admin DB

### Phase 2 — Automatisé (1-2h dev @fullstack)
- Cron `/api/cron/health-check` qui exécute les gates G2 + G3 et envoie une alerte email si 1+ gate FAIL
- Fréquence : toutes les 6h

### Phase 3 — Pre-commit hook (30 min)
- Script `.claude/hooks/pre-commit.sh` qui exécute G1.1 à G1.5
- Bloque le commit si 1+ gate FAIL
