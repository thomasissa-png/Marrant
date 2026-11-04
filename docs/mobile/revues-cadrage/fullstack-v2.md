# Revue technique à l'aveugle du cadrage v2 de l'app iPhone (@fullstack, s23, tour 3, 04/11/2026)

> Document relu : `docs/mobile/cadrage-app-native-s23.md` (v2, commit `1db5c79`), confronté à ma revue v1 (`docs/mobile/revues-cadrage/fullstack-v1.md`), au code de la branche `claude/ouverture-session-nzwj0w` et à la base de production en **lecture seule** (pilote Neon HTTPS, transactions `READ ONLY`, aucune URL ni secret affiché, comptes seulement, aucune donnée personnelle). Revues v2 des autres relecteurs non lues. Aucun code, cadrage ou base modifié ; rien commité ni déployé.
> Références `fichier:ligne` relatives à `apps/web/` sauf mention contraire.

## 1. Notes

| Critère | v0 | v1 | v2 | Motif principal |
|---|---|---|---|---|
| Faisabilité | 7 | 8 | 8/10 | Build 0 réduit au geste, lots découpés : bien. Mais la vanne assignée « déterministe, sans état serveur, sans répétition » n'est pas stable quand le pool change (préchargement J+1/J+2 et notification divergent), une installation sans notification n'a aucune identité serveur, et les pools par thème mesurés sont de 9 à 29 vannes (§3.3). |
| Exactitude par rapport au code | 5 | 7 | 7/10 | Les 4 erreurs de la v1 sont retirées (widget, `TRANSFER`, `activerLettreHebdo`, `/api/daily`). Erreur nouvelle et lourde : **les deux vannes « réelles » du §2.1 n'existent pas en base** (ni actives, ni inactives). Plus : `getWidgetVanneDuJour` ne fait pas ce que le §3.2 lui prête ; `nextStreak` ne reçoit pas une « clé de jour ». |
| Sécurité (comptes, Premium, jetons) | 4 | 7 | 8,5/10 | Liste fermée SANDBOX, interrupteur, aucun build public avec achat avant le lot 10, `amount` calculé serveur, fusion bornée et idempotente : bien. Reste la fenêtre de revue (le relecteur d'Apple crée un compte neuf dans le trajet d'achat, donc hors liste, donc interrupteur ouvert, donc TestFlight public exposé). |
| Cohérence Premium site ↔ app | 5 | 7,5 | 9/10 | `PremiumGrant`, inventaire, mode « calcul et alerte », webhook qui n'appelle que `recalculerPlan`, `TRANSFER` sur les deux comptes : conformes. Inventaire mesuré aujourd'hui : 5 comptes PREMIUM, 0 sans ligne Stripe active en base. |
| Testabilité | 4 | 7 | 8,5/10 | 5b-0 en production derrière interrupteurs avant le lot 8, non-régression Stripe sur copie de base, fixture de transfert : conformes. Manque le test de stabilité de l'assignation (pool modifié entre préchargement et envoi). |
| Plan technique par dépendances | 6 | 6,5 | 8,5/10 | O-8 traité (5a moteur / écrans, 5b-0 en production avant le lot 8, lot C avant 5b-0). Le lot C doit lire la base, pas le seed (§3.1). |
| **Note globale** | **5,2** | **7,2** | **8,2/10** | **GO sous réserve, sous la barre de 9** : 6 corrections obligatoires (§4), dont 1 erreur factuelle sur le contenu montré au panel et 2 trous de conception sur l'assignation. Architecture serveur juste. |

## 2. Statut de mes 9 corrections obligatoires v1 (vérifié dans le texte et dans le code)

| # v1 | Sujet | Statut | Où dans la v2 | Vérification / réserve |
|---|---|---|---|---|
| O-1 | Exercice de la vanne du jour, liste fermée de champs | **Traitée** | §3.2 « Exercice », §7 « Routes », S10, décision 5 | Fait juste (`api/daily/route.ts:21-36`). Bonne prise du PM : avec des thèmes, la vanne assignée n'est plus celle du site, l'exercice ouvert étend l'offre ; c'est dit et soumis à la décision 5. |
| O-2 | `TRANSFER` ne disparaît pas | **Traitée** | §7 « Webhook », « Restauration », décision 8 | Conforme. Reliquat de formulation au §11 plan B et à la décision 3 (S2-1). |
| O-3 | Pas d'`activerLettreHebdo` | **Traitée** | §7 « Webhook » | Conforme au code : `recoitHebdo` découle de `plan = PREMIUM` (`lib/lettre/hebdo.ts:87-90`), `activerLettreHebdo` efface un arrêt explicite (`:154-163`). |
| O-4 | Premium gratuit par TestFlight public | **Partielle** | §7 « Bac à sable », §11, décision 9 | Règle écrite. Trou restant : compte du relecteur d'Apple créé dans le trajet d'achat (O2-6). |
| O-5 | Accès offert et inventaire | **Traitée** | §7 « Plan Premium », §10 | Conforme. Mesure en lecture seule du 04/11 : 5 PREMIUM, 0 sans `Subscription` ACTIVE/TRIALING/PAST_DUE en base (l'API Stripe n'a pas été lue) ; l'inventaire reste à refaire avant 5a (S2-6). |
| O-6 | Une définition du jour, hors ligne | **Partielle** | §3.2, §4 « Hors ligne », §7 `daily-push` | Clé UTC pour le contenu : bien. Mais la série est mise en UTC alors que `nextStreak` ne le permet pas (O2-4), le préchargement repose sur une assignation instable (O2-2), et `ensureDailyContentFromStock` n'a plus de rôle (O2-5). |
| O-7 | Widget en ligne, tout public, route dédiée | **Traitée, réserve** | §3.2, §4.8, §7 « Widget », S8 supprimé | (a) (b) (c) conformes (`WIDGET_VANNE_DU_JOUR_PUBLIE = true`, `config/widget-vanne-du-jour.ts:18` ; 93 identifiants, tous encore dans le pool validé hors catégories exclues, mesuré en base). (d) la route dédiée « importe `getWidgetVanneDuJour` » : mauvaise fonction (O2-5). |
| O-8 | Dépendances 5a et lot 8 | **Traitée** | §13 | Conforme. |
| O-9 | Route de pratique, fusion bornée | **Traitée, réserve** | §3.3 | Route, idempotence, bornes, `amount` serveur (le code accepte bien 1 à 500 du client, `api/user/xp/route.ts:12`) : conformes. Réserve : jour de la série (O2-4). |

Souhaitables v1 : S-1 (S10), S-2 (§3.1 étape 5), S-3 (§7 Comptes Google), S-4 (§9.5, option retirée), S-5 (`SetNull`), S-6 (routes nommées), S-8 (réconciliation), S-9 (`rappel-parcours.ts`), S-10 (Profil), S-11 (en-tête) : repris. S-7 : secrets nommés au §7, mais ni `.env.example` ni `REPLIT_ACTIONS.md` cités (mineur).

Bilan : 7 traitées (dont 2 avec réserve : O-7, O-9), 2 partielles (O-4, O-6), 0 non traitée.

## 3. Vérifications demandées

### 3.1 Les deux vannes du §2.1 : présentes dans les fichiers, **absentes de la base**, donc hors des 93

| Contrôle | Vanne A (« Mes amis adorent venir dîner chez moi. ») | Vanne B (« Mon manager me dit que j'ai beaucoup de potentiel. ») |
|---|---|---|
| `docs/content/blagues-seed.json` | Oui, `id` 1, AUTODERISION, maturité 1, texte identique au cadrage | Oui, `id` 7, BOULOT, maturité 2, texte identique |
| `apps/web/src/data/joke-decryptages.json` | Oui (index 0), technique, « Pourquoi ça marche » et « À toi de jouer » identiques au cadrage | Oui (index 6), identiques |
| Base de production (`Joke`, recherche par amorce ET par chute, actives et inactives) | **0 ligne** | **0 ligne** |
| `WIDGET_JOKE_IDS` (93) / `docs/growth/widget-candidats-s22.md` (114) | Absente (ne peut pas y être) | Absente |

Ce que la base contient à la place des emplacements 1 et 7 du seed (lecture seule, 04/11) :
- emplacement 1 : `cmmnsqn120000th63o435xsb0`, AUTODERISION, active, `GARDER`, technique « L'avis de l'institution », **dans les 93**, déjà servie en vanne du jour : « Mon détecteur de fumée me sert de minuteur. La dernière fois, les pompiers sont venus. » / « Ils m'ont laissé un avis Google : une étoile. » ;
- emplacement 7 : `cmmnsqn120006th633634ej4h`, BOULOT, **inactive** : « Mon patron m'a dit : « Tu es irremplaçable. » Je me suis senti flatté. » / « Puis j'ai vu l'annonce de mon poste. Aucun candidat. ».

Explication : depuis s20, le seed n'est aligné sur la base que pour les 6 vannes actives qu'il contient (`__tests__/lib/blagues-seed-s20.test.ts:22-30`) ; les entrées 1 et 7 portent le texte de la refonte s11, jamais présent en production. `joke-decryptages.json` est indexé par `content` : ses entrées A, B et « agenda partagé » ne correspondent à aucune ligne en base et ne sont jamais appliquées. L'exemple couple (« On a un agenda partagé dans le couple. ») est lui aussi **absent de la base**. Aucune de ces vannes n'est visible sur le site (le repli des parcours, `lib/parcours-vannes.ts:1-6`, n'affiche que des lignes actives de la base). Le panel a donc jugé du contenu qui n'existe pas en ligne. O2-1.

### 3.2 Pool réel de la vanne du jour (base, 04/11, lecture seule)

| Mesure | Valeur |
|---|---|
| Vannes en base / actives | 869 / **149** (`project-context.md:82` dit ~602 actives : périmé, S2-3) |
| Pool validé (`VALIDATED_JOKE_WHERE`, `lib/ai/daily-joke-pool.ts:17-21`) | **149** |
| Par catégorie | BOULOT 29, COUPLE 17, PARENTS 17, AUTODERISION 13, CULTUREL 11, SITUATION 10, DATING 9, SOIREES 9, RESEAUX_SOCIAUX 9, ABSURDE 8, OBSERVATIONNEL 8, ECOLE 5, GAMING 4 (JEUX_DE_MOTS 0) |
| Regroupement de travail du §3.2 | soirées **9** ; couple et dates **26** ; boulot **29** ; sans thème (93 tout public) **93** ; « tout le reste » 85 |
| Validées sans « Pourquoi ça marche » ou sans « À toi de jouer » | 5 sur 149 |
| Jamais servies en vanne du jour du site | 55 ; `DailyContent` déjà planifié jusqu'au 31/12/2026 (58 jours à venir) |
| 93 identifiants du widget encore dans le pool hors catégories exclues | 93 sur 93 |

Catégories : l'énumération `JokeCategory` en compte 14 (`prisma/schema.prisma:160-175`, identique dans les deux schémas) ; le §3.2 en cite 8.

### 3.3 Réponse au `[À VÉRIFIER par @fullstack]` du §3.2 (série en clé de jour UTC) : **non, pas sans changer la série du site**

`nextStreak(streak, lastPracticeAt, now)` compare des **instants** convertis en jour de Paris (`lib/progression.ts:65-77`, `parisDayNumber`) ; il ne reçoit pas de clé de jour. `User.streak` et `User.lastPracticeAt` (`prisma/schema.prisma:67, 71`) sont **un seul compteur** partagé avec les parcours du site. Le passer en UTC pour l'app mélangerait deux horloges sur la même colonne (pratique à 00:30 à Paris = veille en UTC : série doublée ou cassée selon l'ordre). O2-4.

### 3.4 Autres faits du §7 relus dans le code : justes

`PremiumGrant` absent du schéma (aucun modèle d'accès offert) ; bouton admin qui remet FREE (`api/admin/users/route.ts:146-151`) ; réconciliation (`lib/billing/stripe-reconciliation.ts:80-84`) ; `register-token` et `PushToken.userId` obligatoire (`prisma/schema.prisma:576-588`) ; 26 fichiers / 34 appels `getServerSession(` recomptés ; `parcours-access.ts:1-6` (XP et validation Premium) ; `user/xp` 1 à 500 et limiteur en mémoire (`route.ts:12, 26`).
