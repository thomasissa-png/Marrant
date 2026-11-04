# Revue technique à l'aveugle du cadrage v3.1 de l'app iPhone (@fullstack, s23, tour 5, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (v3.1, commit `3b60876`), confronté à ma revue v3 (`docs/mobile/revues-cadrage/fullstack-v3.md`) et au code de la branche courante. Revues v3.1 des autres relecteurs non lues. Aucun code, cadrage ou base modifié ; rien commité ni déployé ; aucun secret affiché.
> Références `fichier:ligne` relatives à `apps/web/src/` sauf mention contraire.

## 1. Notes

| Critère | v1 | v2 | v3 | v3.1 | Motif principal |
|---|---|---|---|---|---|
| Faisabilité | 8 | 8 | 8 | 9/10 | La chaîne du défi ne dépend plus d'aucun pipeline quotidien : rédaction par lot en session, import sans IA, statut stocké (§3.6). Tout ce qui est décrit s'exécute avec le code et la configuration actuels (`CONTENT_GENERATION_ENABLED` absent de `apps/web/wrangler.jsonc`, vérifié). |
| Exactitude par rapport au code | 7 | 7 | 8 | 8,5/10 | `sharedRateLimit`, `nextStreak`, `effectiveStreak`, génération coupée : exacts. Une erreur de modèle, **reprise de ma propre revue v3** : `applyJokeDecryptagesTask` n'a ni marqueur ni garde-fou, il apparie par `content` et réécrase à chaque démarrage (O4-3). |
| Sécurité (comptes, Premium, jetons) | 7 | 8,5 | 8,5 | 9/10 | `pratique` fermée (409, une fois par compte et par jour, hors file, limiteur partagé) ; secret de 32 octets, empreinte SHA-256, comparaison en temps constant ; limite chiffrée par IP avec /64. |
| Cohérence Premium site et app | 7,5 | 9 | 9 | 9/10 | Inchangée et juste. |
| Testabilité | 7 | 8,5 | 8,5 | 9/10 | Tests de `pratique` (§3.3) et des cas O3 (§7, lot 5b-0) écrits ; test de bascule chiffré et juste. |
| Plan technique par dépendances | 6,5 | 8,5 | 8 | 9/10 | C(u) réécrit en outillage sans job planifié, C(d0) sur le chemin du build 0, job de purge au lot 5b-0, décision 19 avant 5b-0. |
| **Note globale** | **7,2** | **8,2** | **8,5** | **8,8/10** | **GO technique, encore juste sous 9** : les 5 corrections du tour 4 sont traitées dans le texte et tiennent face au code. Restent 3 corrections obligatoires d'une phrase chacune (§4), toutes dans le périmètre demandé (décision 18, réinstallation, modèle d'import). Une fois écrites, ma note passe à 9/10 sur **contrôle du seul passage modifié**, sans nouveau tour complet. |

## 2. Statut de O3-1 à O3-5 (texte et code)

| # | Sujet | Statut | Où (lignes du cadrage) | Vérification / réserve |
|---|---|---|---|---|
| O3-1 | Chaîne du défi par lot en session, sans pipeline IA | **Traitée, réserve O4-3** | §3.6 l. 147-148, §3.2 l. 88, lots C(u), C(d0), C(d1) l. 270-272, décision 7 bis l. 297 | (a) rédaction en session par lot, @ia outil, 2 sur 3, pools du build 0 d'abord : oui. (b) toute nouvelle vanne arrive avec son défi, lot mensuel du playbook inclus : oui. (c) import indexé par identifiant, tâche de démarrage sans IA, marqueur par vanne, refus si l'empreinte ne correspond plus : oui. (d) `defi30s`, `defi30sValideAt`, `defi30sEmpreinte`, pool = validé ET empreinte égale au texte courant : oui (l. 88, l. 147 f). (e) échec signalé par le récapitulatif admin, jamais par un job qui produit : oui. « Commandement 5 » retiré, [CHOIX UTILISATEUR] des 30/09 et 01/10 cité sans être rouvert : conforme. Réserve : le modèle cité ne fait pas ce que la phrase décrit (§3.1 ci-dessous). |
| O3-2 | Route `pratique` | **Traitée** | §3.3 l. 120, §4 « Hors ligne » l. 162, §7 l. 219 | 409 si la vanne n'est pas l'assignation du jour local courant ; une fois par compte et par jour de Paris, rejeu 200 sans effet, seconde installation 200 sans points ; `nextStreak` sur l'instant de pratique ; jamais en file ; `sharedRateLimit` nommé ; 4 tests Jest nommés. Réserve de clé de jour : O4-1. |
| O3-3 | Horloge unique, décision 18, heure d'envoi | **Traitée, réserve O4-1** | §3.2 l. 109-113, §3.3 l. 119, §4.1 l. 154, §12 S12 l. 260, décision 18 l. 307 | Une seule horloge pour la série locale et celle du compte, contenu au jour local à 4 h ; fusion sans conversion ; écart nocturne écrit pour l'alternative « minuit » avec exemple **juste** (22 h lundi puis 0 h 30 mercredi : +1 avec bascule, remise à 1 sans) ; Montréal juste (14 h le 5 = jour de Paris 5, 23 h le 6 = 5 h à Paris le 7) ; heure d'envoi bornée 4 h à 23 h 45, reprise à l'écran 2 ; fuseau IANA mis à jour par `PATCH`. Réserve : la décision 18 ne nomme que `nextStreak`. |
| O3-4 | Contradictions du §3.2 | **Traitée** | §3.2 l. 83, l. 85, l. 104 | « Figée face aux mouvements du pool » contre « réécrite une seule fois sur retrait qualité » : levé, avec purge du cache des retirés à chaque ouverture (P0 s18). Défi servi pour J à J+2 : levé, cohérent avec le préchargement l. 103. Reliquat mineur en S4-4. |
| O3-5 | Cycle de vie de l'installation | **Traitée, réserve O4-2** | §3.2 l. 86, l. 85, §7 l. 209, §9.3 l. 236, §9.6 l. 239, décision 19 l. 308 | Secret 32 octets, renvoyé une fois, SHA-256, temps constant, `expo-secure-store`, marqueur hors trousseau à la réinstallation ; `sharedRateLimit`, clé IP, IPv6 par /64, seuils 10/h et 30/j en [HYPOTHÈSE] et risque résiduel recalculé (90 par IP et par jour) ; écran 1 jamais vide (vanne embarquée relue, sans défi ni série, nouvel essai) ; purge jeton ou non, `AssignationJour` en cascade, horizon en décision 19 et dans `/confidentialite` ; effacement depuis Profil en plus. Réserve : le jeton de notification à la réinstallation. |

Bilan : 5 traitées sur 5, dont 3 avec une réserve d'une phrase (§4). Aucune décision de Thomas présumée : les [HYPOTHÈSE] (seuils, horizon, bascule à 4 h) sont posées en décisions 5, 18 et 19, ce qui n'est pas un défaut.

## 3. Vérifications dans le code (branche `claude/ouverture-session-nzwj0w`)

### 3.1 Modèle de la tâche d'import (O3-1 e)

`applyJokeDecryptagesTask` (`lib/startup-tasks.ts:119-215`) apparie par `content` (`byContent`, l. 126) et fait une **passe autoritaire à chaque démarrage** : si le texte en base diffère du fichier, le fichier gagne (l. 175-215). Il n'a ni marqueur `DataPatch`, ni empreinte, ni refus. Le copier pour `defi30s` reproduirait la régression du 30/09 (texte corrigé en base réécrasé par une source plus ancienne). Le bon modèle existe : `applyVideoContentS20Task` (`lib/video-content-s20.ts:10-40`) : garde-fou par empreinte SHA-256 du texte lu (refus journalisé, aucune écriture, pas de marqueur), marqueur `DataPatch` posé dans la même transaction que l'écriture, `note.before` pour le retour arrière, jamais de throw. C'est exactement ce que décrit la phrase du cadrage. L'erreur vient de ma revue v3 (O3-1 b) : je la corrige ici (O4-3).

### 3.2 Série et décision 18

`parisDayNumber` (`lib/progression.ts:65`) est le seul calcul de jour de la série ; il sert à `nextStreak` (l. 71, appelé par `app/api/parcours/[id]/progress/route.ts:183`) **et** à `effectiveStreak` (l. 80, appelé par `app/api/user/route.ts:66` pour l'affichage). Aucun autre appelant hors tests. Si seule `nextStreak` reçoit la bascule à 4 h, comme l'écrivent la décision 18 et S12, l'affichage reste à minuit. Exemple : défi à 23 h le lundi, ouverture à 2 h le mercredi ; `effectiveStreak` voit deux jours civils et **affiche 0**, alors que `nextStreak` (jour de série du mardi) continue la série au défi suivant : Yanis voit sa série tomber à 0 puis remonter à N+1. Même lacune pour l'unicité des points de `pratique` (« jour de Paris », l. 120) : sur jour civil, un défi à 23 h et un autre à 1 h (même jour de série) seraient crédités deux fois.

### 3.3 Jeton de notification à la réinstallation

`PushToken.token` est `@unique` dans les deux schémas (`apps/web/prisma/schema.prisma:579`, `prisma/schema.prisma:46`). À la réinstallation, le secret est effacé et une nouvelle installation est créée, mais l'ancienne vit jusqu'à la purge avec son jeton. Si iOS rend le même jeton (rien ne garantit qu'il change), l'enregistrement par la nouvelle installation heurte la contrainte (aucune notification après réinstallation) ; un `upsert` naïf garderait le jeton sur l'ancienne installation (heure, thèmes et assignations de l'ancienne : la notification annoncerait une autre vanne que l'écran Aujourd'hui, contraire au « même identifiant partout » du §3.2). Le cadrage ne dit rien du cas.

### 3.4 Limiteur partagé et durée de l'IP

`sharedRateLimit(scope, key, options)` (`lib/rate-limit.ts:133-160`) : deux appels suffisent (portées distinctes pour 10/h et 30/j). La clé est stockée sous forme `sha256(clé)` tronquée à 32 caractères hexadécimaux, **sans sel** (l. 79-81) ; une ligne par créneau, supprimée au ménage opportuniste des créneaux expirés (l. 144). Conséquences : (a) l'IPv6 doit être ramenée au /64 **avant** l'appel (`getClientIp`, l. 88-96, renvoie l'adresse entière ; fonction à écrire) ; (b) la « durée courte » de l'IP du §3.2 est connue : au plus la fenêtre la plus longue, 24 h, plus le délai jusqu'au prochain ménage ; c'est une empreinte non salée, donc une donnée pseudonymisée (une IPv4 se retrouve par force brute), à dire tel quel à l'avocat (S4-1).

### 3.5 Génération coupée

`runDailyContentJob` (`lib/scheduler/jobs.ts:47-56`) ne génère rien si `isContentGenerationEnabled()` est faux ; la variable n'est pas dans `apps/web/wrangler.jsonc`. Le cadrage l'écrit (l. 147) : exact.

## 4. Corrections OBLIGATOIRES restantes

[EN COURS]

## 5. Corrections SOUHAITABLES

[EN COURS]
