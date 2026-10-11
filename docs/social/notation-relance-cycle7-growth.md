# Notation cycle 7, angle acquisition (@growth, s15, 05/10/2026, état RÉEL du code et des documents)

> Notateur indépendant. Code relu (lignes citées) : `app/liens/page.tsx`, `app/liens/[reseau]/page.tsx`, `components/liens/liens-page-content.tsx`, `lib/liens.ts`, `lib/attribution.ts`, `lib/umami.ts`, `lib/auth-links.ts`, `lib/in-app-browser.ts`, `config/in-app-browser.ts`, `components/auth/in-app-browser-notice.tsx`, `auth-return-tracker.tsx`, `attribution-capture.tsx`, `(auth)/register/page.tsx`, `premium/abonnement-view.tsx`, `abonnement/success/page.tsx`, `quiz/viral-quiz.tsx`, `blog/article-cta.tsx`, `app/layout.tsx`, tests `liens-page`, `in-app-browser-auth`. Documents relus : cycle 6, `REPLIT_ACTIONS.md`, `mesure.md` en entier, `strategie-relance-v5.md` (§1, §2, §4), `suppression-compte-gratuit-s15.md`, `founder-preferences.md`:55-63, snapshot §5. `[non relu]` : `login/page.tsx` (couvert par `in-app-browser-auth.test.tsx`). **Production NON reproduite ici** : cette session n'a ni Bash ni curl ; la preuve prod ci-dessous est celle de `REPLIT_ACTIONS.md`:7 (session de déploiement), commande de contrôle en fin de document.

## Notes

| Critère | Cycle 6 | Cycle 7 | Raison courte |
|---|---|---|---|
| K1 Angle acquisition | 8,5 | **9** | D1, D2, D4, D6 soldés ; reste le calcul de l'angle sur le nouveau parcours (abonné, pas inscrit) et 4 phrases périmées de v5 |
| K6 Trafic et conversion | 6,5 | **8** | C1 à C5 livrés et déployés ; reste le lien de bio non posé, l'attribution du paiement, la promesse « compte gratuit » encore en ligne |
| K8 Mesure | 8 | **8,5** | D2 à D5 en place ; `mesure.md` en retard sur le code (registre, tests appareil, clé Buffer) et sur le choix « pas de compte gratuit » |

## Vérification des corrections du cycle 6

| Réf. | Verdict | Preuve |
|---|---|---|
| C1 `/liens` 3 routes, UTM, ordre | **Livré** (écart toléré) | `liens/page.tsx`:20 `origine: "instagram"` ; `[reseau]/page.tsx`:33-35 `origineFromSegment` sinon `notFound()` ; `lib/liens.ts`:32-40 `utm_source` du réseau + `utm_medium=social` + `utm_campaign=bio` + `utm_content=bio-*` ; :59-66 règle des 48 h ; bloc quiz `liens-page-content.tsx`:53-64. Écart : `dynamicParams = true` (au lieu de `false`, 404 en prod sous OpenNext) ; 404 gardé par `notFound()`, `REPLIT_ACTIONS.md`:5. Prod : `/liens`, `/liens/x`, `/liens/li` 200, `/liens/ig` 404 `[rapporté, non reproduit]` |
| C2 `origine`/`contenu` | **Livré, périmètre incomplet** | `attribution.ts`:14-30 listes blanches, :59-70 UTM d'arrivée prioritaire ; `umami.ts`:21-28 six événements ; `layout.tsx`:11-12 capture montée. Test : `attribution.test.tsx`. **Manque** `abonnement-clic`, `abonnement-reussi`, `abonnement-annule` (`abonnement-view.tsx`:68, 94 ; `success/page.tsx`:105) |
| C3 e-mail avant Google | **Livré** | `register/page.tsx`:245-259 (bouton e-mail puis Google, plus de `order-first` sur Google) ; test `in-app-browser-auth.test.tsx`:43-52 |
| C4 navigateur intégré | **Livré, réglage non confirmé sur appareil** | `lib/in-app-browser.ts`:21-34 marqueurs, :42-53 `intent:` Android ; `in-app-browser-notice.tsx`:70-91 copie du lien en premier sur iOS ; `config/in-app-browser.ts`:13-18 une ligne par application (`x: false`, `[HYPOTHÈSE]`) ; Thomas a renoncé aux tests téléphone (`founder-preferences.md`:57) |
| C5 `callbackUrl`/`src`/`origine`/`contenu` | **Livré** | `auth-links.ts`:32-46 ; `in-app-browser-notice.tsx`:63 relit le stockage. `withAuthReturnMarker` ne garde que `src` : sans conséquence (sessionStorage, même onglet) |
| D1 | **Fait** | `v5`:32 dérogation 06/10, J0 12/10 `[HYPOTHÈSE]` |
| D2 | **Partiel** | `mesure.md`:31-34 semaine 0, baseline 2 ; registre §6:100-102 : C2 et C3 encore `[à renseigner]` alors que le code est en ligne depuis le 05/10 (~22:45) |
| D3 | **Fait, périmé** | `mesure.md`:5, 43 « clé demandée, échéance 08/10 » : Thomas a répondu « plus tard » (`founder-preferences.md`:61) |
| D4, D5 | **Faits** | `mesure.md`:87-92 ; :23. Base 0,21 % à refaire (voir K1) |
| D6 | **Sans objet** | le bloc quiz existe sur les 3 routes ; vrai seulement quand la bio pointe `/liens` (voir K6-a) |
| D7 | **Obsolète** | `mesure.md`:20 et `v5`:57 parlent encore d'un lien provisoire |
| D8 | **Non fait** | aucun événement Umami de test par `origine` consigné ; baseline 2 = dimanche 11/10 (futur) |

## K1 Angle acquisition : 9

Acquis : grille, Marc, calendrier relatif, démarrage réel documenté, économie du social (coût cash 0 €, temps 41 min par semaine). **Défauts restants**
1. **Angle non recalculé sur « pas de compte gratuit »** (`founder-preferences.md`:62-63). Le parcours devient réseau > contenu > compte créé pour s'abonner > Stripe ; `mesure.md`:91 et :144 calculent encore sur 5 comptes pour 2 399 visites (0,21 %), taux d'un palier qui disparaît. Les 2 abonnés actifs ont 9 paiements (snapshot §5:69-70) : ils datent probablement d'avant les 90 jours, donc **la base de conversion payante n'est pas établie** `[À VÉRIFIER @data-analyst : abonnements créés sur 90 jours, Stripe]`. Seul énoncé tenable : un abonné d'origine sociale ne peut pas dépasser les 0,26 inscrit attendus à J+56 (payants inclus dans les comptes) et sera en pratique nul. Aucun CAC par abonné avant 30 jours de données réelles.
2. **Phrases périmées de v5** : :32 et :65 exigent un test « dans l'application DU réseau » avant J0 (Thomas y a renoncé) ; :57 lien provisoire « déploiement du 10/10 » ; :60 `dynamicParams = false` (déployé : `true` + `notFound()`).
3. **Premier levier non activé** : les 3 bios ne pointent pas `/liens` (`REPLIT_ACTIONS.md`:8).

## K6 Trafic et conversion : 8

Chaîne livrée et testée (3 133 tests PASS, `REPLIT_ACTIONS.md`:6) ; `quiz-termine`, `inscription-*`, `parcours-etape`, `onboarding-termine`, `blog-cta-clic` portent `origine`/`contenu`. **Défauts restants**
- **K6-a** : zéro trafic suivi tant que les bios ne pointent pas `/liens`, `/liens/x`, `/liens/li`.
- **K6-b** : l'événement qui compte devient le paiement ; `abonnement-clic|reussi|annule` n'ont pas `origine` (pas dans `ATTRIBUTED_EVENTS`). Aujourd'hui déjà aveugle : un visiteur social qui paie n'est pas attribué.
- **K6-c** : les pages d'atterrissage du social promettent un compte qui n'existe plus : `viral-quiz.tsx`:97-104 « Crée ton compte gratuit… », `article-cta.tsx`:30-31 « Essaie gratuitement » / « Compte gratuit : 10 vannes… », 12 CTA de `config/blog-cta.ts`, `register/page.tsx`:153. Les articles Marc (29/10, 05/11) et le quiz sont les cibles des posts. Non codé (suppression « non encore codée », L0 : étalons Thomas, P0 s8).
- **K6-d** : Google par application non confirmé (`x: false`, `[HYPOTHÈSE]`) ; limité par l'e-mail en premier, mais sans règle de correction à la mesure.

## K8 Mesure : 8,5

Cadre solide (deux modes de relevé, baseline 2, tests un facteur, limite de puissance). **Défauts restants** : registre §6 et conditions de J0 non alignés sur le code déployé et sur la renonciation aux tests appareil ; `mesure.md`:22 et :48 ignorent `abonnement-*` et l'entonnoir s'arrête à `onboarding-termine` (désormais après paiement) ; critère Marc (:84) fondé sur le bouton `inscription` et `inscription-reussie src=blog-<slug>` : `abonnement-clic` porte `src: "abonnement"` fixe (`abonnement-view.tsx`:94), le lien à l'article se perd après l'inscription ; aucun marqueur de rupture de série pour la suppression du compte gratuit ; D8 sans preuve ; clé Buffer périmée.

## Correction exacte restante (toute note < 10)

**K6 vers 10**
- **K6-a** (Thomas, 3 x 1 min, ou session si accès) : Instagram `https://deviens-marrant.fr/liens`, X `https://deviens-marrant.fr/liens/x`, LinkedIn `https://deviens-marrant.fr/liens/li` ; date dans `REPLIT_ACTIONS.md` et `mesure.md` §6 ; preuve : 1 visite `/liens/x` vue dans Umami.
- **K6-b** (@fullstack) : `lib/umami.ts`:21-28 ajouter `abonnement-clic`, `abonnement-reussi`, `abonnement-annule` à `ATTRIBUTED_EVENTS` ; test dans `attribution.test.tsx` (`abonnement-reussi` avec `origine`, sans arrivée sociale inchangé). Même livraison que la suppression du compte gratuit.
- **K6-c** : livrer L3 puis L4 de `suppression-compte-gratuit-s15.md` AVANT le J0 du 12/10 au moins sur le quiz (`viral-quiz.tsx`:97-104), `article-cta.tsx`, `config/blog-cta.ts`, `/register` ; sinon le J0 de mesure glisse (aucun réseau en pause, seul J0 bouge). Étalons Thomas d'abord ; diff réel mesuré.
- **K6-d** (règle, `mesure.md` §3) : au relevé du lundi, par `origine`, `inscription-envoi methode=google` ≥ 5 avec 0 `inscription-reussie methode=google` : passer la ligne de l'application à `true` dans `config/in-app-browser.ts`.

**K8 vers 10** (@growth + @data-analyst, 1 passe, `mesure.md`)
- **K8-a** §6:100-102 : C2 et C3 = « en ligne 05/10/2026, Worker `c5c0529b` » ; test appareil = « renoncé (Thomas, 05/10) », remplacé par le test de session (agent utilisateur émulé, Jest) + 1 événement Umami de test par `origine`, date de chaque test consignée (aucune date présumée). §2:33 et `v5`:32, :65 : « testés » devient « en ligne + preuve D8 ».
- **K8-b** :5, :43 : clé `insights:read` « plus tard » (Thomas), rappel au relevé du lundi seulement. :20 : retirer le lien provisoire.
- **K8-c** §1:22 et §3:48 : propriétés `origine`/`contenu` aussi sur `abonnement-*` ; entonnoir `/liens` > `quiz-termine` > `blog-cta-clic` > `inscription-reussie` (compte créé pour s'abonner) > `abonnement-clic` > `abonnement-reussi`. §5:84 Marc : garder `inscription-reussie src=blog-<slug>` comme critère (le seul porteur du slug) ; renommer le bouton `inscription` en `abonnement` coupe la série : dater la rupture dans §6.
- **K8-d** : ligne « rupture de série » datée au déploiement de la suppression ; baseline 2 (11/10) : ajouter abonnements actifs et créés (Stripe) aux comptes en base.

**K1 vers 10**
- **K1-a** `mesure.md` §5:91 et §8:144 : remplacer la base 0,21 % par « base payante non établie `[À VÉRIFIER]` » + la borne des 0,26 ; CAC et LTV par abonné, recalcul à 30 jours, jamais un critère d'arrêt.
- **K1-b** `v5`:32, :57, :60, :65 : les 4 phrases périmées ci-dessus. **K1-c** = K6-a.

Si K6-a à K6-d, K8-a à K8-d et K1-a à K1-c sont livrés et prouvés (`git show <branche déployée>:fichier`, événement Umami de test par `origine`), je renote 10 ; la baseline 2 du 11/10 est la seule pièce que le calendrier ne permet pas de produire avant cette date.

Contrôle prod à lancer (hors de cette session) : `for u in /liens /liens/x /liens/li /liens/ig; do curl -s -o /dev/null -w "$u %{http_code}\n" https://deviens-marrant.fr$u; done` (attendu 200, 200, 200, 404) ; `curl -s https://deviens-marrant.fr/liens/x | grep -o 'utm_source=[a-z]*' | sort -u` (attendu `utm_source=x`).

---
**Handoff → @orchestrator** (puis @fullstack K6-b et K6-c, @data-analyst K8-a à K8-d, @growth K1-a et K1-b, Thomas K6-a)
- Fichier produit : `/home/user/Marrant/docs/social/notation-relance-cycle7-growth.md`
- Décisions : K1 9, K6 8, K8 8,5 ; aucun seuil rouvert ; aucun réseau en pause (J0 seul peut glisser)
- Points d'attention : bios non pointées ; `abonnement-*` sans `origine` ; promesse « compte gratuit » encore en ligne sur quiz et articles ; base de conversion payante inconnue ; prod non reproduite par cette session

## Corrections cycle 7 (@growth, 05/10/2026, appliquées dans `docs/social/mesure.md` uniquement ; aucun seuil §4 modifié)

- **K8-a, registre §6 et §2** : C2 et C3 « en ligne le 05/10/2026 (~22:45), Worker `c5c0529b` » ; test appareil « renoncé (Thomas, 05/10) » remplacé par la preuve D8 (test de session + 1 événement Umami de test par `origine`, daté, exclu des relevés) ; dates de preuve laissées `[à renseigner]`, aucune présumée ; J0 glisse si la preuve manque le 11/10.
- **K8-b, clé Buffer** : « plus tard » (Thomas), sans échéance ni relance quotidienne, rappel au seul e-mail du lundi (§1 en-tête, §3) ; lien de bio provisoire retiré (§1).
- **K8-c, attribution** : `blog-cta-clic` ajouté aux six événements attribués ; `abonnement-*` signalé SANS `origine` (à livrer par @fullstack, K6-b) ; entonnoir `/liens` > `quiz-termine` > `blog-cta-clic` > `inscription-reussie` > `abonnement-clic` > `abonnement-reussi` (§3) ; critère Marc inchangé en seuil, bouton `inscription` ou `abonnement` compte (§5).
- **K8-d, ruptures de série (§6)** : 3 lignes datées (C2 05/10 ; fin du compte gratuit, date de déploiement `[à renseigner]`, non codée ; livraison de `origine` sur `abonnement-*`) ; baseline 2 du 11/10 étendue aux comptes créés, abonnements actifs et créés, MRR (Stripe).
- **K1-a, économie du social (§5, §8)** : base 0,21 % requalifiée en majorant (palier gratuit disparu, tout abonné est un compte, `[HYPOTHÈSE]`) ; base payante observée : 2 abonnés actifs, 9 paiements, MRR 1,98 €, `[À VÉRIFIER @data-analyst]` ; aucun taux visite vers abonné ; CAC temps par inscrit remplacé par coût temps par `quiz-termine` et `blog-cta-clic` ; CAC et LTV par abonné au recalcul à 30 jours, jamais un critère d'arrêt.
- **K1-c = K6-a, liens de bio (§6)** : registre des 3 bios (`/liens`, `/liens/x`, `/liens/li`), date de pose et preuve Umami `[à renseigner]` ; sans bio pointée, aucun trafic suivi (Thomas 3 x 1 min ou session).
- **Reviewer M:28, M:36, M:43, M:89** : « abonnés totaux » remplacé par « depuis la seconde baseline du 11/10 » ; baseline « visites depuis le 06/10, relevées le 11/10 » ; clé Buffer alignée sur FP:61 ; CAC temps réécrit sans inscrit.
- **Social D1 à D3 et « lien oui/non »** : colonne « Posts avec / sans lien » (§3, §6), lecture à part, jamais décisive ; marqueur `[heure:B]` et dépendance F1 (§7) ; signal des commentaires = notifications, réponse sous 24 h, aucune fenêtre (§3) ; T4 renvoyée à Thomas (§7).
- **Non fait dans ce périmètre** : K1-b (phrases périmées de `strategie-relance-v5.md`, @social), K6-b et K6-c (@fullstack, étalons Thomas), K6-d (règle Google par application, non demandée dans cette passe), `horaires-sources-s15.md` §6, K6-a et preuve D8 (action session ou Thomas), baseline 2 (11/10).
- **Note inchangée** : K1 9, K6 8, K8 8,5 jusqu'à preuve ; K8 vise 10 quand la preuve D8 et la baseline 2 sont consignées ; pas de Grep ni de shell dans cette session, relecture de `mesure.md` faite par lecture directe, `git diff --stat` à lancer par la session (P0 s11).
