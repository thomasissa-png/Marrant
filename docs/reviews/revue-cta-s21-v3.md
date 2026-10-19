# Revue croisée v3 : concision du tunnel (branche `claude/marrant-s21-integration`), 18/10/2026

- Réviseur : @reviewer. HEAD relu : `712d6ae` (journal de la branche : `be7706c` à `1b326c8` structure, `073c164` à `5c91d30` textes v5, `712d6ae` REPLIT). Worktree `.claude/worktrees/agent-a6072b0ac19da7774`, chemins de code relatifs à `apps/web/src/`.
- Références : `docs/copy/cta-s21/concision/VALIDE.md` et `textes-v5-a/b/c.md`, choix de Thomas du 18/10 (`docs/founder-preferences.md` l. 113 à 118), `docs/ux/audit-charge-lecture-s21.md`, revue précédente `revue-cta-s21-v2.md` (9/10).
- Limites : pas de shell. Je n'ai donc vérifié ni `tsc`, ni Jest, ni le build, ni la CI, ni le diff chiffré : la comparaison s'est faite texte par texte, entre la config et la v5. Je n'ai pas pu faire le commit ni le push de `REPLIT_ACTIONS.md` (voir §4).

## Résumé exécutif

Les textes v5 sont branchés mot pour mot dans la config, sur toutes les surfaces du tunnel : accueil, en-tête, murs, fiches, fenêtre, quiz, fin d'étape 1, /parcours, /abonnement, /register, carnet, profil, fins de page, FAQ, e-mail et retour de paiement. Les anciens pavés ont disparu du code (0 occurrence de `lignePrixGarantie`, `FENETRE_GARANTIE`, `PHRASES_PROFIL`, « Tout ouvrir », « Débloque », « 1 clic »). Je n'ai trouvé aucun fait faux et aucune promesse de résultat dans les blocs d'appel. Un vrai trou reste : **10 articles « à forte frappe » gardent leur ancien bloc de fin** (titre + texte de 16 à 26 mots, 27 à 38 mots au total pour un budget de 25), et ce texte vend « les parcours complets » au-dessus d'un bouton gratuit. Deuxième point : la concision n'a été contre-testée ni par @qa ni en captures. Lien de test : oui. Mise en ligne : après ces deux points.

## Note et verdict

**Note : 8,5/10** (9 en v2 avant la concision ; le chantier est plus gros, et il reste un trou de périmètre).
- **Lien de test : GO**, conditions T1 à T3 de la v2 inchangées (CI verte sur `712d6ae`, `?ne-pas-compter=1`, aucun paiement ni inscription à la lettre sur les liaisons de production).
- **Mise en ligne : NO-GO tant que C1 et C2 ne sont pas faits**, puis GO sans nouvelle revue complète (re-vérification des seules gates en FAIL). Le reste est mineur.

## 1. Conformité aux règles de concision

| Règle | Verdict | Évidence |
|---|---|---|
| Un bloc = une idée + un plein | PASS (sauf C1) | `cta-pages.ts:52-101` (murs, fiches : titre, 1 phrase, plein, lien) ; `cta-articles-accueil.ts:90-137` ; `step-blocks.tsx:104-123` |
| Budgets de mots | PASS (sauf C1) | Textes identiques à la v5 (totaux v5 : /abonnement ≤ 103, blocs ≤ 25) ; test « budget de mots par surface » annoncé dans `5c91d30` |
| Réassurance unique | PASS | `offre.ts:39` `REASSURANCE_UNIQUE`, rendue sous chaque plein qui porte un prix (`step-blocks.tsx:100,120`, `carnet-page.tsx:142`, `register/page.tsx:338`) ; aucune ancienne variante dans `src/` |
| Détail de l'offre seulement sur /abonnement | PASS | `AvantagesPremium` n'est utilisé que dans `abonnement-view.tsx:313` ; prix annuel absent ailleurs |
| Un fait une fois par page | PASS | « 1 500+ » : dans le haut de l'accueil seulement (`cta-articles-accueil.ts:119`), carte sans preuve ; /a-propos : la preuve n'est que dans la fin de page |
| Libellés uniques | PASS | `libelleOuvrirParcours`, `GRATUIT_ACCUEIL`, `libelleGratuitParcours` (`cta-articles-accueil.ts:42-51`), réutilisés partout |
| FAQ de vente à 4 questions, réponse prix v5 | PASS | `lib/faqs.ts:37,54,61-71` ; `llms-content.ts:79` corrigé |

**Écarts signalés par l'agent de branchement : je tranche, Thomas n'a pas à décider**

| Écart | Décision | Motif |
|---|---|---|
| Lien « Page dédiée » gardé sur les cartes des listes (`vannes-list.tsx:330`, `conseils-list.tsx:317`, `videos-grid.tsx:315`) | **Garder** | C'est le seul lien explorable vers les fiches : la carte d'une vanne n'a pas de titre-lien, contrairement à ce que supposait l'audit UX §1.6. Il sert à la navigation, pas au tunnel. Avis @seo facultatif. |
| En-tête : « 2,99 €/mois » sous 640 px et à partir de 1 024 px, « Premium · 2,99 €/mois » seulement entre 640 et 1 023 px | **Garder** | Mesuré : le libellé complet déborde. Le nom accessible dit « voir l'offre Premium ». Mineur m4 : @design peut regagner 29 px à 1 280 px. |
| « Voir par où commencer » (abonné, quiz d'orientation, `cta-pages.ts:177`) | **Garder** | L'abonné est hors du tunnel d'achat ; la v5 ne retirait que le lien du compte sans abonnement. |
| Paywall natif « Passe Premium » (`premium-paywall.tsx:121`) | **Garder** | La v5 §9 dit « mobile natif : seul le texte de valeur change ». C'est conforme ; la liste « Disparaît » ne vaut que pour le web. |
| Bloc de fin par article (`config/blog-cta.ts`) | **À corriger (C1)** | Voir §5. |
| Google en premier sur /register (`register/page.tsx:252-264`) | **Garder** | C'est une règle de structure de l'audit UX, validée le 18/10 (l. 118 : « les règles de structure… s'appliquent aussi ») ; un geste de moins. Mineur m2 : la mention CGU n'apparaît qu'après le formulaire. |
| Surtitre du carnet (`carnet-extrait.ts:14`) | **Conforme** | Le mois et la position sont calculés (« Carnet d'octobre · Situation 15 », puis « de novembre · Situation 10 ») : c'est plus juste que la v5, qui écrivait le mois en dur. |

## 2. Rien de faux, cohérence des promesses : PASS (avec deux dates à tenir)

- **Faits du tunnel vérifiés dans le code** :
  - « Pas d'attente entre les étapes » : l'ordre n'est plus imposé (B-1, revue v2).
  - « de 15 à 20 minutes chacune » : calculé depuis `PREMIUM_PARCOURS` (`offre.ts:87-101`).
  - « Étape 2 sur {N} » : lu dans la donnée (`cta-pages.ts:40-42,185`).
  - « Les 10 gratuites » : `FREE_JOKE_LIMIT`.
  - Vote réservé à Premium.
  - « Sans compte. » : l'étape 1 est libre.
  - REASS : « premier paiement » et « depuis ton profil », sans « en un clic » côté abonnement.
  - FAQ prix : « tant que tu ne résilies pas » ; la promesse fausse « pas de reconduction » a été retirée.
- **Par profil** :
  - Visiteur : la fin d'étape 1 mène à `/register`, puis au paiement, puis au parcours (`parcours-detail.tsx:139-142`).
  - Compte sans abonnement : `/abonnement`, puis paiement direct, comme avant.
  - Abonné : il ne voit aucun prix (fins de page masquées, quiz sans lien payant, bloc de fin réduit à « Continuer mon parcours »).
  - Je n'ai trouvé aucun texte faux, quel que soit le profil.
- **Aucune promesse de résultat** dans les blocs. Hors blocs, la FAQ de vente garde « Nos membres gagnent en moyenne 50 XP par semaine… » et « La majorité de nos membres… introvertis ». Ces deux phrases sont protégées par un [CHOIX UTILISATEUR] (`founder-preferences.md` l. 26) : je ne les remets pas en cause. L'étude Crawford et Caltabiano (2011) citée en Q1 existe bien : essai randomisé de 8 semaines publié dans le *Journal of Positive Psychology*, 6(3).
- **Deux dates à tenir** (sinon le texte deviendrait faux) :
  - D1 : « Un nouveau carnet arrive chaque mois » (carnet, profil, avantages) suppose un carnet de décembre en ligne le 01/12. Aujourd'hui, `data/carnet/` ne contient que `2026-10` et `2026-11`. Il faut le préparer avant le 30/11 (@copywriter, puis @fullstack).
  - D2 : jusqu'au 31/10, l'intro du carnet d'octobre (`data/carnet/2026-10.json:4`, 50 mots, « situations », « pour que tu progresses ») est hors v5. Elle est déjà en ligne, ce n'est pas une régression, et la bascule du 01/11 la règle. On peut ne rien faire.

## 3. Mesure : ce qui change

| Source / événement | Changement | Effet sur le rapport du lundi et le bilan du 10/11 |
|---|---|---|
| `accueil-hero` | **Supprimée** : plus de lien payant dans le haut de l'accueil (`hero-section.tsx:96-97`) | La série s'arrête le jour de la mise en ligne, et `header` monte d'autant. Il faut comparer `accueil-hero + header` avant à `header` après. |
| `parcours-etape` (fin d'étape 1, visiteur) | Le visiteur va **directement sur /register** (`src=parcours-etape`, une seule fois) ; après l'inscription, le paiement s'ouvre seul | Plus d'`abonnement-vu {src: parcours-etape}` pour le visiteur. La source apparaît dans `inscription-envoi` / `inscription-reussie`, puis dans `checkout-ouvert {src: parcours-etape}`. **`abonnement-clic` baisse mécaniquement** : le clic manuel sur /abonnement disparaît, et seul reste le clic automatique, compté `src: abonnement, declencheur: auto` (`abonnement-view.tsx:171`). Ce n'est pas une baisse d'envie. |
| Lettre `emplacement: "parcours"` | Nouvel emplacement (fin d'étape 1) ; source `parcours` en base (`config/lettre.ts:49,112`) | `lettre-vu` / `lettre-inscrite` ont une valeur de plus. Le rapport ne ventile pas par emplacement : rien ne casse. |
| Fenêtre Premium | Le lien vers l'étape 1 est retiré | Moins d'ouvertures de parcours depuis `modale-…`, ce qui est voulu. |
| `/register`, lien vers l'étape 1 | La source envoyée est `abonnement` (`register/page.tsx:360`) | Mineur m3 : ce lien est compté comme `/abonnement` dans `parcours-ouvert`. |

**Consignes à transmettre à @data-analyst**
- **Indicateur pivot** : le bilan du 10/11 se lit sur `checkout-ouvert` par `src` et sur les paiements Stripe, rapportés aux visiteurs. Il ne se lit pas sur `abonnement-clic`, ni sur `abonnement-vu` par source.
- **Rupture de mesure** : il faut la dater (trace de P6 dans `docs/marrant/audit-conversion-s20.md`). Avec une mise en ligne entre le 26 et le 31/10, le bilan n'aura que 10 à 15 jours d'« après », et on lira l'effet combiné, comme le prévoit le choix du 17/10.
- **Liste des sources à jour** : dans REPLIT, rubrique « Mesure ».

## 4. REPLIT_ACTIONS : entrée consolidée

J'ai modifié le fichier dans le worktree, sans commit (pas de shell).
- **Une seule entrée, réécrite** : « Blocs d'appel s21 et concision du tunnel ». Elle contient l'état final, la rubrique « Mesure » et **une seule liste de contrôles P6, numérotée de 1 à 14**.
- **Valeurs attendues** : tirées de la config. Exemples : « Il en reste 14 / Et 11 autres répliques » pour octobre (15 fiches), « 29 / 26 » pour novembre (30 fiches), sha256 `e2b15d0f…` du carnet de novembre.
- **Retirés** : les sections historiques et leurs contrôles périmés (n° 2, 4, 5, 7, 8, 11, 12 et 13, les contrôles « structure » et « textes », la ligne « Textes » de P6 avec « Ta réplique pendant la soirée », « par semaine conseillée » → 1). La ligne « Non posé : B14/B18 » est remplacée par les décisions du 18/10.
- **P0 à P8 conservés tels quels** : relevé N-1, migration 14 jouée deux fois, variable Hyperdrive factice devant `build:cf` ET `deploy:cf` (P4), « Soirée de Noël » au 02/11 avec délai du 01/11 (P5), retour arrière `npx wrangler rollback <N-1>` (P8).
- **Ajouts** :
  - P0 exige la contre-épreuve @qa et la correction C1 ;
  - les lignes « Blocs d'appel » et « Textes » de P6 renvoient à la liste unique ;
  - contrôle 7 : carnet le 01/11 après 01:00 Paris ;
  - contrôle 13 : carnet de décembre le 01/12 ;
  - contrôle 14 : correction C1.
- **À faire par l'appelant** :

```
cd /home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774 && git add REPLIT_ACTIONS.md && git commit -m "docs(replit-s21): entrée « Blocs d'appel s21 » consolidée, une seule liste de contrôles P6 à jour (revue v3)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Ny4UaXcj6i1VwL3T1j7rJZ" && git push origin claude/marrant-s21-integration
```

## 5. Corrections classées

**Top 3** : C1, C2, D1.

**Bloquant pour la mise en ligne (pas pour le lien de test)**
- **C1 (@copywriter, puis @fullstack) : bloc de fin des 10 articles « à forte frappe »**
  - Problème : `config/blog-cta.ts:22-105` passe avant la v5 (`blog-article-view.tsx:136-137`). On voit donc un titre plus un texte de 16 à 26 mots (fête des mères : 10 + 26 + « Sans compte. » = 38 mots ; budget 25). Ce texte vend « Les parcours complets » ou « Le parcours X t'entraîne, étape après étape » au-dessus d'un plein gratuit : il viole « un bloc = une idée » sur des articles qui comptent parmi les plus visités.
  - Correction : pour chacun des 10, un titre et une phrase au gabarit v5 (§3 de `textes-v5-a.md`), puis un tour à l'aveugle court.
  - Repli si ce n'est pas prêt à J-1 : retirer `title` et `text` de `BLOG_CTA_BY_SLUG`, ce qui affiche la déclinaison v5 du parcours (déjà validée).
- **C2 (@qa) : contre-épreuve de la concision sur le commit final**
  - Pourquoi : aucune QA depuis `aef4240`. Les captures `docs/qa/captures-s21/` sont antérieures à la v5.
  - À vérifier :
    - les points de `VALIDE.md` l. 12 (libellé de Machine à Café à 375 px, en-tête à 320 px, fin d'étape 1 avec paiement et lettre empilés) ;
    - les 3 profils à 320, 375, 768 et 1 280 px ;
    - le parcours visiteur fin d'étape 1, `/register`, paiement mocké, retour au parcours ;
    - la lettre dépliée, puis la CI verte.

**Important**
- **D1 (@copywriter, puis @fullstack)** : carnet de décembre en ligne avant le 30/11 (§2). Sinon « Un nouveau carnet arrive chaque mois » devient faux sur 3 surfaces. Contrôle 13 de REPLIT.

**Mineur**
- m1 (@copywriter) : `docs/copy/carnet/novembre/carnet-2026-11.json` (copie de référence) garde l'ancienne intro ; il faut l'aligner sur `data/carnet/2026-11.json`.
- m2 (@fullstack) : sur /register, la phrase CGU n'apparaît qu'après le formulaire alors que Google est en tête. Il suffit de la remonter sous le bouton Google, ou de la répéter. C'est une phrase de contrat, pas un texte marketing.
- m3 (@fullstack) : lien vers l'étape 1 de `/register` compté `abonnement` (`register/page.tsx:360`) au lieu d'une source propre.
- m4 (@design) : en-tête à 1 280 px, 29 px à regagner pour afficher « Premium · 2,99 €/mois » sur ordinateur.
- m5 (@copywriter) : textes de la carte « Ton prénom » (`compte.ts:148-158`), encore `[PROVISOIRE]` mais neutres et exacts. Une relecture rapide suffit.
- m6 : la variante « quiz en cours » de la fin d'étape 1 envoie le visiteur sur `/abonnement` (`step-blocks.tsx:97`) et non sur `/register`. Ce n'est pas faux, mais c'est incohérent avec le plein principal.
- Reportés de la v2, inchangés : M-3 (@seo), M-4 et M-5 (@copywriter).

## 6. Points à trancher par Thomas

**Aucun nouveau.** Tous les écarts sont tranchés en §1, et la lettre (B14 oui, B18 non) l'est par le choix du 18/10. Seul reste son feu vert de mise en ligne, après le lien de test, une fois C1 et C2 faits (case P0).

---
**Handoff → @orchestrator**
- Fichiers :
  - produit : `docs/reviews/revue-cta-s21-v3.md` ;
  - modifié sans commit : `.claude/worktrees/agent-a6072b0ac19da7774/REPLIT_ACTIONS.md` (commande en §4).
- Décisions : 8,5/10 ; lien de test GO ; mise en ligne NO-GO jusqu'à C1 et C2, puis GO ; 6 écarts tranchés sans Thomas.
- Agents à relancer : @copywriter (C1, D1, m1, m5), @fullstack (branchement de C1, m2, m3, m6), @qa (C2), @design (m4), @data-analyst (§3).
---
