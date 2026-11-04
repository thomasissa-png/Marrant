# Contrôle ciblé du cadrage v3.2 de l'app iPhone (@fullstack, s23, tour 5 bis, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (v3.2, commit `bccfb52`), **passages modifiés seulement** (ligne v3.2 du §16, l. 339), confrontés à ma revue v3.1 (`fullstack-v3-1.md`) et au code. Pas un tour complet. Aucun code, cadrage ou base modifié ; rien commité ; aucun secret affiché. Références `fichier:ligne` relatives à `apps/web/src/`.

## 1. Corrections obligatoires du tour 5

| # | Statut | Où | Vérification face au code |
|---|---|---|---|
| O4-1 | **Écrite et juste** | §3.2 l. 110 et l. 113, §3.3 l. 120, S12 l. 261, décision 18 l. 311 | `parisDayNumber` (`lib/progression.ts:65`) est bien la seule fonction de jour, appelée par `nextStreak` (l. 73) et `effectiveStreak` (l. 82) ; seuls appelants hors tests : `api/user/route.ts:66` et `api/parcours/[id]/progress/route.ts:183` (vérifié). Unicité des points de `pratique` sur « compte et jour de série, le même `parisDayNumber` », exemple 23 h puis 1 h = un crédit : juste. Série locale de l'app : fonction copiée, même test. Les deux tests Jest sont justes : lundi 22 h puis mercredi 0 h 30 = jour de série du mardi, +1 ; lundi 23 h, affichage mercredi 2 h = écart 1, série visible. Réserve sur le texte de la décision 18 : O5-1. |
| O4-2 | **Écrite et juste** | §3.2 l. 86, §7 l. 210 | `PushToken.token` est `@unique` (`apps/web/prisma/schema.prisma:579`) : rattacher le jeton connu à l'installation authentifiée et le retirer de l'ancienne en une transaction est la seule voie compatible avec la contrainte ; l'ancienne part à la purge sur le critère de dernière activité. Test au lot 5b-0 « même jeton présenté par une nouvelle installation (un seul envoi, vanne de la nouvelle) » : présent. |
| O4-3 | **Écrite et juste** | §3.6 (e) l. 147 | Conforme à `lib/video-content-s20.ts:10-40` : garde-fou par empreinte, refus journalisé sans écriture ni marqueur, `DataPatch` dans la même transaction, `note.before`, jamais de throw. « Sans passe autoritaire » et le rejet explicite de `applyJokeDecryptagesTask` corrigent l'erreur de ma revue v3. |

## 2. Souhaitables S4-1 et S4-2

- **S4-1 : repris et juste** (§3.2 l. 86). Empreinte SHA-256 non salée tronquée (`hashRateLimitKey`, `lib/rate-limit.ts:79-81`), stockée dans `JobLock`, 24 h au plus plus délai de ménage (l. 144), « pseudonymisée, pas anonyme », /64 avant hachage, même durée dans `/confidentialite` : exact. Nuance non écrite (S5-2).
- **S4-2 : repris et juste** (§3.2 l. 82). Champ de dernière activité sur `Installation`, écrit au plus une fois par jour, cohérent avec le critère de purge de la l. 86.
- Repris en plus : S4-4 (J+1 et J+2 réécrits au changement de thèmes, 5 défis par installation, 150 par IP : calcul juste, 3 + 2 = 5, × 30 = 150) et S4-7 (« une fois par retrait »).

## 3. Erreur technique dans un passage modifié

**Décision 18 (l. 311) : « plus tolérant, rien n'est retiré » est faux.** La phrase était déjà en v3.1 et je l'ai laissée passer au tour 5 ; la v3.2 l'a reconduite en réécrivant la décision. Une bascule à 4 h **déplace** la frontière du jour, elle ne l'élargit pas :
- cas perdant, en régime courant : pratique le mardi à 1 h 30 (jour de série du lundi avec bascule), puis le mercredi à 20 h. Aujourd'hui : écart 1, série +1. Avec bascule : écart 2, série remise à 1 ;
- au déploiement côté site : toute série dont la dernière pratique (`lastPracticeAt`) tombe entre 0 h et 4 h la veille est relue comme datant de l'avant-veille et s'affiche à 0 (`effectiveStreak`) ;
- le test existant `__tests__/lib/progression-s17.test.ts:35-38` affirme le comportement inverse (10 h le 07/10 puis 1 h 30 le 08/10 à Paris = +1, attendu 4) : avec bascule, c'est le même jour de série, attendu 3. Il doit être réécrit au lot 5b-1, sinon la CI tombe.

Ce texte est l'argument présenté à Thomas pour son go : il doit être exact (aucune architecture ne change, la reco peut rester).

## 4. Correction OBLIGATOIRE restante

**O5-1. Décision 18 l. 311 (seule occurrence, vérifié) :** remplacer « plus tolérant, rien n'est retiré » par « la frontière du jour passe de minuit à 4 h : plus tolérant pour qui pratique tard le soir de façon régulière, moins pour qui pratique entre minuit et 4 h puis le surlendemain en soirée ; au déploiement, les séries dont la dernière pratique tombe entre 0 h et 4 h la veille s'affichent à 0 ; le test `progression-s17.test.ts:35-38` est réécrit (attendu 3) ». Une phrase, contrôle par lecture de la seule ligne.

## 5. Souhaitables (non bloquants)

1. **S5-1** Écrire la bascule sur l'heure locale de Paris (`parisParts(date).hour < 4` donne la veille) et non en retirant 4 h à l'instant UTC : sinon, les deux nuits de changement d'heure, la bascule tombe à 3 h ou 5 h. Ajouter un test sur la nuit du dernier dimanche d'octobre.
2. **S5-2** S4-1 : si la base est indisponible, `sharedRateLimit` se replie sur le limiteur en mémoire avec la clé `${scope}:${key}` **en clair** (`lib/rate-limit.ts:158-160`) : l'IP reste alors dans la mémoire du processus, au plus la fenêtre, jamais en base. À ajouter à la phrase pour l'avocat (ou hacher la clé avant le repli).
3. Reliquats S4-3, S4-5, S4-6 et S3-3 à S3-9 : inchangés, toujours valables (§16 l. 340 les liste comme non repris).

## 6. Notes

| Critère | v3 | v3.1 | v3.2 | Motif |
|---|---|---|---|---|
| Faisabilité | 8 | 9 | 9/10 | Inchangée. |
| Exactitude par rapport au code | 8 | 8,5 | 8,5/10 | O4-1 à O4-3 exacts face au code ; reste l'argument faux de la décision 18 et le test existant contraire (O5-1). |
| Sécurité | 8,5 | 9 | 9/10 | Jeton à la réinstallation traité ; IP décrite exactement. |
| Cohérence Premium site et app | 9 | 9 | 9/10 | Inchangée. |
| Testabilité | 8,5 | 9 | 9/10 | Tests O4-1 et O4-2 écrits et justes. |
| Plan par dépendances | 8 | 9 | 9/10 | Inchangé. |
| **Note globale** | **8,5** | **8,8** | **8,9/10** | **GO technique, juste sous la barre** : les 3 corrections obligatoires du tour 5 sont écrites et tiennent face au code. Reste O5-1, une phrase sur un argument faux présenté à Thomas (erreur que j'aurais dû relever au tour 5). Écrite, la note passe à **9/10** sur lecture de la seule ligne de la décision 18, sans nouveau tour. |

---

**Handoff → session principale** (puis @product-manager pour O5-1)
- Fichier produit : `docs/mobile/revues-cadrage/fullstack-v3-2.md`
- Décisions prises : aucune ; recommandations seulement.
- Points d'attention : O5-1 tient en une phrase dans la décision 18 ; au lot 5b-1, réécrire `progression-s17.test.ts:35-38` et tester la nuit de changement d'heure (S5-1).
- Actions infra requises : aucune.
- Pre-commit check : sans objet (aucun code modifié, rien commité).
