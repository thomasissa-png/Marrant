# Lot C(a) : mesures du stock de vannes pour l'app iPhone (session 23)

> **Mesure du 04/11/2026 à 20:42 UTC** (21:42 à Paris), base de production Neon, **lecture seule** : 2 transactions `READ ONLY` (`transaction_read_only = on` vérifié), pilote Neon HTTPS. Aucune écriture, aucun code ni seed touché. Scripts hors dépôt, dans le dossier temporaire de la session.
> Références : cadrage `docs/mobile/cadrage-app-native-s23.md` (§3.2, §3.6, §6 H-stock, lot C(a), décision 7), étalons `docs/mobile/etalons-app-s23.md` (1A, 3A). Tout public = les 93 de `WIDGET_JOKE_IDS`. Auteur : @fullstack. Hypothèses du cadrage reprises sans les trancher : seuil 90, horizon sortie + 90 j, 10 vannes par mois et par thème, 110 caractères.

## 1. Pool utilisable par l'app, par thème

Pool = `isActive` ET `copyVerdict = 'GARDER'` ET `comedyTechnique` non nul ET « Pourquoi ça marche » (`techniqueExplanation`) ET « À toi de jouer » (`howToApply`) non vides. **Utile** = pool moins les vannes du calendrier du site sur les 7 prochains jours (`DailyContent`, du 04/11 au 10/11 : 7 vannes, filtre du §3.2). Le champ `defi30s` n'existe pas encore : **le pool réel de l'app est aujourd'hui de 0** (§3.6) ; les chiffres ci-dessous sont un plafond, avant validation des défis.

| Thème | Catégories | Actives | Pool | Utile | Dont dans les 93 |
|---|---|---|---|---|---|
| soirées | SOIREES | 9 | 8 | 8 | 0 |
| couple et dates | COUPLE + DATING | 26 | 26 | 24 | 0 |
| boulot | BOULOT | 29 | 28 | 28 | 21 |
| vie étudiante | ECOLE | 5 | 5 | 5 | 4 |
| tout public | 93 du widget | 93 | 90 | **86** | 90 |
| catalogue entier | 14 catégories | 149 | 144 | 137 | 90 |

- Base : 869 vannes, 149 actives, toutes `GARDER` avec technique. **5 actives sortent du pool, toutes faute d'« À toi de jouer »** (« Pourquoi ça marche » présent partout) : SITUATION 3 (les 3 des 93 hors pool), SOIREES 1, BOULOT 1.
- Écarts avec le tableau du §3.2 : soirées 9 → 8 et boulot 29 → 28 (« À toi de jouer » vide), couple et dates 26 → 24 utiles (une COUPLE et une DATING au calendrier des 7 jours).
- Recouvrement avec les 93 : seulement BOULOT (21 sur 28) et ECOLE (4 sur 5) ; soirées et couple et dates en sont exclus (filtre du widget, choix du 24/10).

## 2. Jours de thème avant épuisement (règle de mélange à 90)

Simulation par installation créée le jour de la sortie, sur le pool utile : jour 1 tout public ; union des thèmes sous 90 : thème aux jours 3, 6, 9…, tout public les autres jours ; à partir de 90 : thème chaque jour ; thème épuisé : tout public non encore assigné, puis répétition. Les jours tout public prennent d'abord les vannes des 93 hors thème ; quand elles sont vues, ils puisent dans le recouvrement (d'où une jauge inférieure à 3 × pool pour boulot et ses combinaisons).

| Installation | Pool des thèmes (union) | Jours de thème avant épuisement | Première répétition | Horizon 90 j |
|---|---|---|---|---|
| soirées | 8 | **24** | jour 95 | non (alerte < 60) |
| couple et dates | 24 | **72** | jour 111 | non |
| boulot | 28 | **84** | jour 94 | non |
| vie étudiante | 5 | **15** | jour 88 | non (alerte < 60) |
| sans thème (tout public) | 86 | sans objet | **jour 87** | non (répète avant 90) |
| **Yanis** : soirées + vie étudiante | 13 | **39** | jour 96 | non (alerte < 60) |
| **Marc** : couple et dates + boulot | 52 | **117** | jour 118 | oui |
| soirées + couple et dates | 32 | 96 | jour 119 | oui |
| boulot + soirées (afterwork, Sophie) | 36 | 101 | jour 102 | oui |
| soirées + vie étudiante + couple et dates | 37 | 111 | jour 120 | oui |
| boulot + soirées + couple et dates | 60 | 125 | jour 126 | oui |

**Aucun thème seul ne tient 90 jours.** Les combinaisons tiennent dès qu'elles contiennent couple et dates ou boulot plus un autre thème ; la combinaison type de Yanis ne tient pas. Constat de méthode : la jauge n'est pas monotone au seuil (union de 89 → 267 jours en mélange, union de 90 → 90 jours en thème seul) ; à signaler à @data-analyst avant de ratifier la règle.

## 3. Vannes inactives par catégorie (matière à corriger puis relire à l'aveugle)

**Motif d'inactivité non stocké** (aucune colonne de motif ; aucun verdict `RETIRER` ni `REECRIRE` en base). Indices disponibles : le verdict (`GARDER` = relue puis retirée par lot ou soft delete, ex. `weak-jokes.json` ; vide = jamais relue), l'origine IA, la présence du décryptage complet, la trace d'une réécriture (`originalContent`).

| Catégorie | Inactives | Verdict GARDER | Sans verdict | Générées par IA | Décryptage complet | Réécrites (s11) |
|---|---|---|---|---|---|---|
| SOIREES | 27 | 20 | 7 | 7 | 21 | 8 |
| ECOLE | 28 | 16 | 12 | 6 | 24 | 6 |
| COUPLE | 194 | 61 | 133 | 168 | 42 | 17 |
| DATING | 31 | 17 | 14 | 12 | 19 | 6 |
| BOULOT | 47 | 32 | 15 | 20 | 40 | 14 |
| SITUATION | 72 | 24 | 48 | 47 | 39 | 9 |
| CULTUREL | 70 | 24 | 46 | 49 | 24 | 19 |
| **Total (14 catégories)** | **720** | **303** | **417** | **371** | **343** | **131** |

Autres catégories (inactives / GARDER / sans verdict / IA / décryptage / réécrites) : JEUX_DE_MOTS 49/3/46/3/6/1, OBSERVATIONNEL 40/17/23/17/28/8, ABSURDE 35/9/26/5/10/2, AUTODERISION 35/23/12/6/30/3, PARENTS 33/23/10/13/23/3, RESEAUX_SOCIAUX 32/16/16/11/18/7, GAMING 27/18/9/7/19/8. Le taux de passage à l'aveugle d'une vanne inactive n'est pas mesuré : à mesurer sur le premier lot (C(d1)), pas à supposer.

## 4. Longueur des amorces (notification, étalon 3A)

Amorce = `content`, espaces normalisés, en caractères. Repère 110 caractères guillemets compris [HYPOTHÈSE] = **106 caractères d'amorce** (« » et espaces insécables : 4 caractères, comme l'étalon 3A).

| Thème (pool) | Vannes | Amorce > 106 | Médiane | Max |
|---|---|---|---|---|
| soirées | 8 | 1 | 77 | 108 |
| couple et dates | 26 | 1 | 73 | 110 |
| boulot | 28 | 4 | 85 | 163 |
| vie étudiante | 5 | 0 | 72 | 81 |
| tout public (93 au pool) | 90 | 5 | 75 | 163 |
| catalogue entier | 144 | 8 | 73 | 163 |

Variante à 87 caractères (option B de l'étalon) : 16 des 93 et 25 du pool dépassent. Au-delà de 146 (150 guillemets compris) : 1 seule vanne (BOULOT, aussi dans les 93).

## 5. Débit réel sur 90 jours (06/08 → 04/11/2026)

Vannes créées sur la période et aujourd'hui au pool, par date de création (lots de session ; génération automatique coupée depuis le 30/09).

| Catégorie | Sept. | Oct. | Total 90 j | Par mois | Depuis le 14/10 |
|---|---|---|---|---|---|
| SOIREES | 7 | 0 (1 créée, sans « À toi de jouer ») | 7 | 2,3 | 0 |
| COUPLE + DATING | 20 | 1 | 21 | 7 | 0 |
| BOULOT | 12 | 13 | 25 | 8,3 | 0 |
| ECOLE | 4 | 1 | 5 | 1,7 | 0 |
| autres catégories | 52 | 5 | 57 | 19 | 0 |

30/09 : 95 vannes `cs14jk*` datées du jour de la bascule vers Neon (lot de session s14 ; date probablement celle de l'import, pas de la rédaction [À VÉRIFIER]) + 4 générées par IA, inactives. Octobre : 24 vannes de session (s18 le 08/10, Boulot s19 le 11/10, 9 autres du 07 au 14/10), soit 0 à 1 par thème hors boulot (lot unique du parcours). **Plus aucune vanne créée depuis le 14/10 (21 jours).**

## 6. Écart à l'objectif (décision 7 : sortie + 90 jours)

En mélange, 90 jours de thème = **30 vannes utiles par thème** ; sans thème, 90 jours sans répétition = 90 vannes tout public utiles. Après la sortie, une installation à un thème consomme 1 vanne tous les 3 jours, soit 10 par mois : le débit cible du cadrage [HYPOTHÈSE] maintient exactement la jauge, il ne rattrape rien.

| Thème | Utile | Jauge | À ajouter pour la sortie | Puis débit cible | Débit constaté (90 j, par mois) |
|---|---|---|---|---|---|
| vie étudiante | 5 | 15 j | **+25** | 10 par mois | 1,7 |
| soirées | 8 | 24 j | **+22** | 10 par mois | 2,3 |
| couple et dates | 24 | 72 j | **+6** | 10 par mois | 7 |
| boulot | 28 | 84 j | **+2** | 10 par mois | 8,3 |
| tout public (liste des 93) | 86 | répète au jour 87 | **+4** (ajouts relus tout public, ou « À toi de jouer » des 3 SITUATION) | à fixer | 0 |

Ces écarts supposent que **chaque** vanne reçoit un défi validé (2 sur 3 à l'aveugle) : tout défi refusé creuse l'écart d'autant. Le filtre des 7 jours du site est mobile : garder 2 à 3 vannes de marge par thème.

## 7. Conclusions

- **Thèmes qui tiennent l'horizon** : aucun thème seul. Tiennent : couple et dates + boulot (Marc, 117 j), boulot + soirées (101 j), soirées + couple et dates (96 j), et les combinaisons à 3 thèmes mesurées (111 et 125 j ; boulot + vie étudiante + soirées : 102 j). Ne tient pas : soirées + vie étudiante (Yanis, 39 j).
- **À ne pas proposer avant production** (critère C(d1)) : **vie étudiante** (15 j) et **soirées** (24 j), sous l'alerte de 60 jours. Couple et dates (72 j) et boulot (84 j) sont au-dessus de l'alerte mais sous 90 : proposables seulement après +6 et +2.
- **Priorité de production** (avec défi, dans l'ordre) : (1) vie étudiante +25 ; (2) soirées +22 (persona principal : la combinaison de Yanis passe à 90 j avec +17 à répartir entre les deux) ; (3) couple et dates +6 ; (4) boulot +2 ; (5) tout public +4 ; (6) les 3 « À toi de jouer » manquants des 93 et les 2 du pool (gain immédiat de 5 vannes). Matière inactive disponible : ECOLE 28 et SOIREES 27, insuffisante même à 100 % de passage pour couvrir l'écart avec marge : prévoir de la rédaction neuve.
- **Notification** : 8 amorces sur 144 dépassent 106 caractères (4 en boulot) : accroche neutre ou retouche relue pour celles-là.
- **Débit** : nul depuis le 14/10 ; le lot mensuel du playbook doit viser 10 vannes avec défi par thème proposé, et rattraper l'écart avant la sortie.

## 8. Requêtes utilisées (SQL, sans secret ; `sql.transaction([...], { readOnly: true })`, jauge et longueurs calculées hors base)

```sql
-- P = "isActive" AND "copyVerdict"='GARDER' AND "comedyTechnique" IS NOT NULL AND btrim(coalesce("techniqueExplanation",''))<>'' AND btrim(coalesce("howToApply",''))<>''
SELECT category, count(*), count(*) FILTER (WHERE "isActive"), count(*) FILTER (WHERE P) FROM "Joke" GROUP BY 1;
SELECT id, category, content, id = ANY($ids93) AS in93, EXISTS (SELECT 1 FROM "DailyContent" d WHERE d."jokeId" = j.id AND d.date >= jour_paris AND d.date < jour_paris + 7) AS cal7 FROM "Joke" j WHERE P;
SELECT category, coalesce("copyVerdict",'(aucun)'), "generatedByAI", ("originalContent" IS NOT NULL), count(*) FROM "Joke" WHERE NOT "isActive" GROUP BY 1,2,3,4;
SELECT category, date_trunc('month',"createdAt"), count(*), count(*) FILTER (WHERE P) FROM "Joke" WHERE "createdAt" >= now() - interval '90 days' GROUP BY 1,2;
```
