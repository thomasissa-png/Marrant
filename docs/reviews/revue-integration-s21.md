# Revue croisée : intégration s21 (lettre, lot 2, mentions) : 17/10/2026

Revue @reviewer de la branche `claude/marrant-s21-integration`, lue dans sa copie de travail `.claude/worktrees/agent-a6072b0ac19da7774` (dernier commit `bb64d370`, d'après le reflog), et comparée à la production (`main` / `claude/ouverture-session-nzwj0w`). Aucun code modifié, aucune commande git lancée.

## Résumé exécutif

Les textes sont propres. Chaque texte affiché ou envoyé par la lettre, le menu, le bloc d'accueil et le lot 2 se retrouve mot pour mot dans un duel gagné à l'aveugle (2 ou 3 relecteurs sur 3, jugé au niveau) ou dans un texte @legal. Il n'y a aucun tiret cadratin, et les prix, la mention « TTC », le remboursement du « premier paiement », la signature et l'éditeur sont cohérents sur toutes les pages. Les exigences @legal B1 à B7 sont présentes dans le code. La mise à jour ne peut pourtant pas partir telle quelle. La décision de tout mettre en ligne avant le bilan du lot 1 n'est pas inscrite dans les préférences du fondateur, qui disent encore le contraire. Les 6 numéros sont marqués « validés », donc ils partiront seuls, sans trace d'un accord de Thomas sur leur contenu. La QA d'intégration n'est pas faite. Enfin, un numéro reporté peut partir à n'importe quelle heure. Ce sont des corrections courtes : aucun texte n'est à réécrire.

## Note : 7,5 / 10 (NO-GO en l'état, GO dès que les 4 bloquants et M1, M2, M3 sont levés)

| Axe | Constat | Points |
|---|---|---|
| (1) Textes validés à l'aveugle | 100 % tracés, aucun texte nouveau non relu côté produit ; textes juridiques non relus (m2) | 2 / 2 |
| (2) Cohérence entre pages | prix, TTC, « premier paiement », « La lettre », mensuel, signature, éditeur : conformes ; « newsletter » reste dans `compte.ts` (m1) | 1,5 / 2 |
| (3) Décisions de Thomas et @legal B1 à B7 | B1 à B7 conformes dans le code ; décisions du 17/10 non tracées (B-1, B-2), A1 à A7 de l'avocat non tranchés (M4) | 1,5 / 2 |
| (4) Risques de casse | migration additive et rejouable, interrupteurs clairs, dates justes ; QA absente (B-4), envoi hors créneau (M1), échange des dates d'articles fragile (M2), prérequis de production non vérifiés (B-3) | 1 / 2 |
| (5) Zéro tiret cadratin | 0 occurrence (détail en « Contrôles passés ») | 1,5 / 1,5 |
| Rendu | captures lues : en-tête à 1280 px connecté dégradé (M3) | 0 / 0,5 |

## Défauts bloquants

**B-1. La décision « une seule mise en ligne avant le bilan du lot 1 » n'est pas dans le document du fondateur.**
- `docs/founder-preferences.md` l.109 ([CHOIX UTILISATEUR] du 17/10) : « Mise en ligne après le bilan du lot 1 (~10/11), séparée du lot 2 ».
- `docs/copy/lot2-boutons-abonnement-s21.md` §7.1 dit : « Rien n'est déployé ni ne doit l'être avant ». `REPLIT_ACTIONS.md` l.21 dit : « À DÉPLOYER APRÈS LE BILAN DU LOT 1 ».
- `docs/marrant/plan-integration-s21.md` invoque au contraire une « Décision de Thomas (17/10) » de tout mettre en ligne ensemble, sans citation.
- Conséquence concrète : la mesure du lot 1 (J+28, le 10/11) est faussée. Les boutons mesurés des encarts d'articles changent de libellé (`config/textes/encarts-blog-s20.ts` l.12), et un formulaire de lettre s'ajoute sous le bloc de fin des articles (`components/blog/blog-article-view.tsx` l.45).
- **Correction** (orchestrateur) : ajouter dans `founder-preferences.md` une ligne [CHOIX UTILISATEUR] datée du 17/10, avec la citation de Thomas, qui remplace explicitement la fin de la l.109. Ajouter aussi dans `docs/marrant/audit-conversion-s20.md` la date de rupture de la mesure du lot 1 (jour de mise en ligne), pour que le bilan du 10/11 compare des périodes propres. Je ne rouvre pas le choix : il faut seulement l'écrire.

**B-2. Les 6 numéros sont « VALIDE » et les envois sont ouverts, sans trace d'une validation de Thomas.**
- `apps/web/src/data/lettre/numeros.json` l.7 à l.57 : `"statut": "VALIDE"` × 6, avec `LETTRE_ENVOIS_OUVERTS = true` (`config/lettre.ts` l.28). Le n°1 part donc seul le 05/11 à 8 h.
- Or `numeros-1-a-6.md` l.5 et §« Fabrication » point 4, ainsi que `project-context.md` l.123, exigent « relecture à l'aveugle puis validation de Thomas avant tout envoi ». `numeros.ts` l.6 pose que « le commit vaut validation », ce qui est une règle d'agent, pas une décision de Thomas.
- Deux points restent ouverts pour Thomas (`numeros-1-a-6.md` l.395 et l.397) : la vanne du n°3, jugée fragile, et le libellé « Voir les parcours » du n°1.
- **Correction** : le feu vert de Thomas (étape E) doit citer explicitement « les 6 numéros tels que validés » et trancher ces 2 points. À défaut, mettre les n°2 à 6 en `"statut": "BROUILLON"` et ne laisser `VALIDE` que le n°1.

**B-3. Des prérequis de production ne se voient pas dans le code et ne sont pas verrouillés.**
- `REPLIT_ACTIONS.md` l.17 exige que la table `NewsletterSubscriber` soit **vide** en base. S'il reste des lignes `CONFIRMED` de l'ancienne newsletter (`lib/newsletter.ts` existait avant s21), elles recevraient le n°1 sans la case v2 ni le double opt-in : manquement direct à L.34-5.
- Le suivi d'ouverture et de clic doit être désactivé dans Resend (B4 @legal).
- `UNSUBSCRIBE_HMAC_SECRET` doit faire au moins 32 caractères en production. Sinon `empreinteIp` (`lib/lettre/inscription.ts` l.59 à 63) ne stocke rien, et la politique promet pourtant une empreinte.
- **Correction** (@infrastructure) : passer ces 3 contrôles en étapes **bloquantes et relevées**, AVANT la migration, dans la procédure de `REPLIT_ACTIONS.md` l.19 (requête `SELECT status, count(*) FROM "NewsletterSubscriber" GROUP BY 1`, capture du réglage Resend, présence de la variable). Si la table n'est pas vide : décision de Thomas (passer les lignes en `UNSUBSCRIBED` ou les purger), jamais d'envoi.

**B-4. La QA d'intégration (étape C du plan) n'est pas faite.**
- `docs/qa/qa-integration-s21.md` : les 5 sections sont « [en cours] ».
- Seules 11 captures du menu et de l'accueil existent (`docs/qa/captures-s21/integration/`). Il n'y en a aucune du parcours complet (formulaire en fin d'article, quiz, `/lettre`, confirmer, désinscrire, haut de `/abonnement` à 375 px avec le bouton au premier écran).
- **Correction** : @qa termine le rapport (3 largeurs, parcours bout en bout, e-mail de test sur liste de test), puis nouvelle revue.

## Défauts majeurs

**M1. Un numéro reporté part hors du créneau « jeudi 8 h » décidé par Thomas.**
- `lib/lettre/envoi.ts` l.186 à 206 : après un report (article cité pas encore en ligne), le numéro part au premier passage de 15 min qui suit la publication, par exemple lundi 16/11 à 0 h 15.
- **Correction** (@fullstack) : remplacer l'échéance par `dateEnvoiLettre(periode, jourParis(date de mise en ligne réelle du dernier article cité))`. Le report tombe ainsi le jeudi suivant à 8 h. Ajouter un test dans `lettre-article-publie-s21.test.ts`.
- **Correction complémentaire** : dans `applyLettreNumerosTask` (`lib/lettre/numeros.ts` l.143), comparer au démarrage chaque `datePlancher` au `publishedAt` réel de l'article cité, et alerter dès le jour du déploiement plutôt que le 05/11.

**M2. L'échange des dates d'articles casse le calendrier social de novembre.**
- `docs/social/preparation/2026-11.md` l.134 et 135 programme « Humour en visio » le 02/11 à 12 h 30 et 18 h 30, et « Soirée de Noël » le 16/11 (l.152 et 153).
- Une fois l'échange fait, les posts du 02/11 renverraient vers un article publié seulement le 16/11.
- **Correction** (@social, à la reprise du 26/10) : régénérer le lot de novembre APRÈS l'échange en base (`prepare-social-month --month 2026-11`), ou intervertir les deux paires de posts. À ajouter à la procédure de `REPLIT_ACTIONS.md` l.19.

**M3. En-tête ordinateur, utilisateur connecté sans abonnement, à 1280 px et plus : la recherche est tronquée.**
- La capture `menu-1280-connecte-sans-abonnement.png` montre « Rech » coupé, cause directe de l'onglet « La lettre ». Le défaut est déjà signalé dans `REPLIT_ACTIONS.md` l.13, mais il n'est pas corrigé.
- **Correction** (@design puis @fullstack) : pour un utilisateur connecté, afficher l'onglet seulement à partir de `2xl` (1536 px) dans `components/layout/header.tsx` l.23, ou réduire les marges entre onglets. Le libellé et la place de « Commencer » ne changent pas.

**M4. La validation par un avocat (A1 à A7) n'est pas tranchée avant l'ouverture.**
- `docs/marrant/retour-thomas-s21.md` l.21 et `docs/legal/lettre-et-questions-s21.md` l.22 classent ces 7 points « à faire valider avant d'ouvrir la lettre ».
- Le plan ouvre les inscriptions dès la mise en ligne. Seule la réserve R4 (la SAS) est explicitement acceptée par Thomas (`founder-preferences.md` l.110).
- **Correction** : faire écrire par Thomas, dans `founder-preferences.md`, « ouverture sans avis d'avocat, A1 à A7 acceptés en l'état » ou « attendre l'avis ».

## Défauts mineurs

- **m1** `config/textes/compte.ts` l.107 : « ton inscription à la newsletter » s'affiche encore au moment de supprimer le compte. Cela contredit le vocabulaire (« jamais newsletter à l'écran », `lettre-s21.ts` l.12) et la politique mise à jour (« ton inscription à la lettre faite avec l'adresse de ton compte »). Correction : reprendre cette dernière formule, passée en relecture à l'aveugle (règle d'or).
- **m2** Les textes juridiques nouveaux n'ont pas été relus à l'aveugle : `/confidentialite` section 8 et phrase de la section 7, `/cgu` articles 8 (ajout) et 10. Le plan exige pourtant que tout texte nouveau passe cette relecture. Correction : soit Thomas déclare les textes juridiques exemptés (à écrire dans la charte), soit un pack court (clarté, aucune promesse au-delà des faits, sans toucher au fond juridique).
- **m3** `/cgu` : l'ajout de l'article 8 (« ni ne te prive des droits ») et l'article 10 tutoient, alors que le reste du document dit « l'utilisateur » (l.25, l.59). Correction (@legal) : « ni ne prive l'utilisateur des droits que la loi lui garantit », ou bien tutoiement de toutes les CGU dans un lot séparé.
- **m4** Abonné Premium connecté : le lien « La lettre du mois » reste visible en pied de page (`footer.tsx` l.62 à 66), alors que l'onglet et le bloc d'accueil sont masqués. Sur `/lettre`, il voit ensuite le H1 et la phrase sans formulaire, car `lettre-inscription.tsx` l.66 renvoie `null` : impasse. Correction : masquer le lien de pied de page pour un Premium (même règle que `header.tsx` l.64), et masquer l'en-tête de `/lettre` quand le formulaire est masqué. Aucun texte nouveau.
- **m5** `REPLIT_ACTIONS.md` l.17 dit « aucun contrôle automatique » si l'article n'est pas publié, ce qui contredit l.14 (le garde-fou existe). Correction : réécrire « le n°1 est reporté jusqu'à la publication (garde-fou) ».
- **m6** `app/(dashboard)/lettre/desinscrire/page.tsx` l.16 : le `<title>` reçoit le texte déjà passé par `insecables()`. Cela va contre la convention « jamais de typographie de rendu dans `metadata` » (`lettre-s21.ts` l.37). Correction : ajouter `page.desinscrire.titre` à la liste `garder` pour le titre de métadonnées, ou lire la chaîne source.
- **m7** `project-context.md` : l'historique n'a pas d'entrée pour l'intégration s21 (la dernière, l.123, présente encore les numéros comme des « BROUILLONS »). À mettre à jour à la clôture.

## Contrôles passés

- **Textes affichés et envoyés = textes validés.** Chaque chaîne de `config/textes/lettre-s21.ts` correspond au pack et au duel indiqués en commentaire. Packs relus : `pack-relecture-textes-lettre.md` (duels 3 B, 4 A, 5 B, 7 A, 10 B, 12 B, 13 A), `…-tour2.md` (duels 1 A, 2 B, 6 B, 8 A, 9 B, 11 B), relecture neutre (« C'est bon, c'est confirmé. » 3/3, pied « l'as demandée » 3/3), place sur le site (menu A « La lettre » 2/3, accueil A 3/3). Les verdicts confirment chaque choix et le niveau.
- **Lot 2 dans `offre.ts`.** `MUR_PREMIUM_BOUTON` (duel 1, 3/3), `etape1GratuiteBouton` (duel 2, 3/3), haut de `/abonnement` et réassurance (tour 3, 3/3), `/register` (3/3). « Voir Premium » est un libellé existant. Numéros 1 à 6 : correspondance vérifiée par sondage sur le n°1 (tour 2, 3/3).
- **Cohérence entre pages.**
  - Prix et TTC : « TTC / mois » à côté du prix dans `plan-selector`, `premium-modal`, `premium-cta` et `abonnement-view`.
  - Remboursement : « premier paiement » dans les deux réassurances (`offre.ts` l.41 et l.50).
  - Nom et rythme : « La lettre » au menu, « La lettre du mois » en pied de page, rythme mensuel partout.
  - Signature : « L'Équipe Deviens Marrant » (e-mails automatiques, choix du 14/10 et du 17/10).
  - Éditeur : « deviens-marrant SAS » identique dans la mention, les pieds d'e-mail, `/mentions-legales` et `/confidentialite`.
  - Rien n'annonce « Ta question à l'équipe » ni la lettre hebdomadaire.
- **Exigences @legal.**
  - B1 : case non cochée, version `lettre-mensuelle-v2`, archive v1 conservée (R1).
  - B2 : seul le POST confirme (`confirm/[token]/route.ts`).
  - B3 : en-têtes `List-Unsubscribe` et `-Post`, page à bouton, exclusions à chaque envoi.
  - B5 : pieds conformes à L3.
  - B6 : purge à 7 jours, empreinte HMAC de l'IP, agent utilisateur à `null`, migration qui vide `userAgent`.
  - B7 : textes publiés dans la même mise en ligne.
  - R2 : contrôlé par la QA du lot lettre. R3 : « Te réinscrire » ramène au formulaire.
- **Dates.** Le 01/11/2026 est un dimanche, donc le n°1 part le jeudi 05/11 à 8 h (+01:00), après la publication du 02/11. Les n°2 à 6 partent les 03/12, 07/01, 04/02 et 04/03 (+01:00) et le 01/04/2027 (+02:00, heure d'été depuis le 28/03) : tous des premiers jeudis, conformes à `dateEnvoiLettre`.
- **Migration 14.** Uniquement des ajouts (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`) : rejouable, sans suppression.
- **Garde-fou d'article non publié.** Présent (`envoi.ts` l.200 à 206) et testé.
- **Zéro tiret cadratin.** Recherche de U+2014, U+2013, `—`, `–` et `&mdash;` dans `numeros.json`, `config/textes/**`, `config/lettre.ts`, les composants lettre, accueil, en-tête, pied de page, Premium, carnet et blog, les pages lettre, `/cgu`, `/confidentialite`, `/abonnement` et `/register`, ainsi que `lib/lettre/**` et `lib/email.ts` : 0 occurrence. La seule trouvée est la constante du filtre (`numeros.ts` l.35). Le schéma zod refuse en plus tout tiret cadratin dans un numéro.
- **Captures lues.** `accueil-375-bloc-lettre.png` et `accueil-1280-bloc-lettre.png` : bloc discret, sans bouton, après la FAQ Premium. `menu-mobile-ouvert-375.png` : « La lettre » en dernier, dans le menu déroulant seulement.

## Décisions à confirmer par Thomas (aucune ne rouvre un [CHOIX UTILISATEUR])
1. Écrire la décision du 17/10 « tout en une mise en ligne, avant le bilan du lot 1 » (B-1).
2. Valider le contenu des 6 numéros ; trancher la vanne du n°3 et le libellé « Voir les parcours » du n°1 (B-2).
3. Ouvrir sans avis d'avocat sur A1 à A7, ou attendre (M4).
4. Exempter ou non les textes juridiques de la relecture à l'aveugle (m2).

## Ce qui manque pour 10/10
1. B-1 à B-4 levés (2 lignes dans `founder-preferences.md`, statut des numéros, 3 contrôles de production dans la procédure, rapport QA complet).
2. M1 (envoi reporté recalé sur jeudi 8 h, contrôle de la date plancher au démarrage), M2 (calendrier social de novembre), M3 (recherche de l'en-tête), M4 (décision sur l'avocat).
3. m1 à m7 corrigés, dont `compte.ts` passé en relecture à l'aveugle.
4. Nouvelle revue limitée aux points ci-dessus, avec le rapport QA et la CI verte sur le dernier commit.

## Limites de cette revue
- Je n'avais ni shell ni Python : je n'ai pas pu lancer le `git diff --stat` ni le contrôle des tirets en Python. Je les ai remplacés par la lecture directe de la copie de travail d'intégration et par Grep (même recherche de caractère).
- Je n'ai pas vérifié que `origin/claude/marrant-s21-integration` est bien au commit `bb64d370` (aucune référence distante locale pour cette branche).
- Je n'ai pas vérifié non plus les tests, le build, la CI ni la base de production.

---

# Tour 2 : 17/10/2026

Revue de la branche `claude/marrant-s21-integration` au commit `46d455fb` (dernier commit local et distant d'après les reflogs, copie de travail `.claude/worktrees/agent-a6072b0ac19da7774` sur cette branche). Aucun code modifié, aucune commande git lancée.

## Résumé exécutif (tour 2)

Le code est prêt. Le défaut qui bloquait la confirmation d'inscription est corrigé, et @legal a validé la correction (`docs/legal/lettre-et-questions-s21.md` l.115). Les captures du tour 2 le montrent : « C'est bon, c'est confirmé. », sans formulaire répété. L'en-tête ne tronque plus la recherche, et un numéro reporté part bien le jeudi suivant à 8 h. Les décisions de Thomas sont écrites (`founder-preferences.md` l.111 et l.72). Ce qui manque est **uniquement dans la procédure de mise en ligne** (`REPLIT_ACTIONS.md`) :
- les 3 contrôles de production n'y figurent pas ;
- elle demande encore d'échanger les deux dates d'articles ;
- elle ne prévoit aucun essai réel d'inscription et de confirmation une fois le site en ligne.

Il n'y a aucun code à toucher pour passer au vert : il faut une procédure réécrite et une contre-épreuve @qa.

## Note : 8,5 / 10 (NO-GO tant que la procédure n'est pas réécrite ; GO dès que les 4 points de « Ce qui manque pour 10/10 » numérotés 1 à 4 sont faits)

| Axe | Constat tour 2 | Tour 1 | Tour 2 |
|---|---|---|---|
| (1) Textes validés à l'aveugle | Tous les textes affichés restent tracés. Il y a un seul texte nouveau, « Mon compte », PROVISOIRE et non relu, et il s'affiche en infobulle (N3) | 2 / 2 | 1,75 / 2 |
| (2) Cohérence entre pages | « newsletter » a disparu de l'écran (m1 levé). Le tutoiement de l'article 8 des CGU (m3) reste, mais il est compté en mineur | 1,5 / 2 | 2 / 2 |
| (3) Décisions de Thomas et @legal | B-1, B-2, M4 levés, `same-origin` validé par @legal. Les 2 points « à trancher par Thomas » du document des numéros ne sont pas refermés (m8) | 1,5 / 2 | 1,75 / 2 |
| (4) Risques de casse | M1 et M3 levés, B1 de la QA corrigé. B-3 n'est pas levé, M2 non plus (la procédure contredit la décision), aucun essai réel après la mise en ligne (N1), pas de contre-épreuve @qa ni de CI vérifiée sur `46d455fb` | 1 / 2 | 1 / 2 |
| (5) Zéro tiret cadratin | 0 occurrence dans les fichiers client touchés au tour 2 (Grep U+2014, U+2013, `&mdash;`, `&ndash;` sur `config/textes`, `config/lettre.ts`, `components/layout`, `components/lettre`, pages lettre, CGU, confidentialité, `data/lettre`) | 1,5 / 1,5 | 1,5 / 1,5 |
| Rendu | Captures du tour 2 lues, recherche entière à 1024, 1280 et 1440 | 0 / 0,5 | 0,5 / 0,5 |
| **Total** | | **7,5** | **8,5** |

## Points du tour 1 : levé / non levé

| Point | Verdict | Évidence |
|---|---|---|
| B-1 décision non écrite | **Levé** | `founder-preferences.md` l.111 ([CHOIX UTILISATEUR] du 17/10, avec la citation) remplace explicitement la consigne « lot 2 seul après le bilan ». Reste à faire, le jour J : noter la date de mise en ligne dans `docs/marrant/audit-conversion-s20.md`, qui n'en dit encore rien (Grep « rupture », « s21 », « 17/10 » : 0). Étape à mettre dans la procédure, voir P7. |
| B-2 numéros VALIDE sans accord | **Levé** | l.111 : « Premier envoi la semaine du 2 novembre (n°1 le jeudi 05/11 à 8 h ; numéros suivants le premier jeudi du mois à 8 h) ». Les 6 numéros sont passés à l'aveugle. Le n°1 a été envoyé en test à alex@ le 17/10 (`REPLIT_ACTIONS.md` l.57, identifiants Resend). Reliquat documentaire en m8. |
| B-3 contrôles de production | **Non levé** | La procédure (`REPLIT_ACTIONS.md` l.26) ne contient aucun des 3 contrôles. La l.17 cite « Resend » et « `NewsletterSubscriber` vide » en « prérequis restants », sans commande ni critère. `UNSUBSCRIBE_HMAC_SECRET` est absent de l'entrée d'intégration. Texte attendu en P1. |
| B-4 QA non faite | **Levé, avec reliquat** | Le rapport `docs/qa/qa-integration-s21.md` est complet (sur `bb64d37`). Son bloquant B1 et ses mineurs m1 à m3 sont corrigés dans `46d455fb` (`REPLIT_ACTIONS.md` l.19 et l.23). Captures `docs/qa/captures-s21/tour2/` lues : `lettre-confirmee-375`, `lettre-statut-invalide-375`, `lettre-statut-erreur-375` (texte validé, bloc 9). Reliquat : ces preuves viennent de @fullstack. @qa n'a pas rejoué le bouton « Confirmer » ni la suite smoke sur `46d455fb`, et la CI de ce commit n'est pas vérifiée (je n'ai pas de shell). |
| M1 envoi hors créneau | **Levé** | `lib/lettre/envoi.ts` l.96 à 106 (`prochainCreneauLettre`) et l.257 à 268 (report au jeudi 8 h, envoi commencé terminé). `lib/lettre/numeros.ts` l.150 à 175 et l.188 : alerte au démarrage. |
| M2 dates d'articles | **Non levé** (au regard de la décision actuelle) | La procédure dit encore l'inverse de la décision « seul Soirée de Noël avance au 02/11 » : `REPLIT_ACTIONS.md` l.17 « échanger en base les dates de publication de `soiree-de-noel-entreprise-humour` (→ lundi 02/11) et `humour-en-visio-reunion-en-ligne` (→ 16/11) », l.14 « l'échange de dates du 02/11 », `plan-integration-s21.md` l.12 « on recule Humour en visio au 16/11 ». Aucune commande, aucun critère. Les dépendances au 16/11 sont détaillées en N2. |
| M3 en-tête tronqué | **Levé** | Captures `tour2/menu-1024-gratuit`, `menu-1280-gratuit`, `menu-compte-ouvert-1024-gratuit` et `menu-mobile-ouvert-375x550` : loupe à 1024, champ « Rechercher… » entier à 1280, menu de compte lisible, « La lettre » en place, rien de rogné. |
| M4 avocat | **Levé** | `founder-preferences.md` l.72 ([CHOIX UTILISATEUR] du 07/10 : avocat et points juridiques secondaires reportés à la fin des chantiers), confirmé par la consigne de Thomas pour cette mise en ligne. Je ne le rouvre pas (P0 s8). |
| m1 « newsletter » | **Levé** | `config/textes/compte.ts` l.110 : « …ta progression et ton inscription à la lettre. » C'est un seul mot changé dans un texte PROVISOIRE s16 déjà en ligne. La note de `REPLIT_ACTIONS.md` l.15 (« dit encore newsletter ») est périmée (N4). |
| m2 textes juridiques non relus | **Non levé**, non bloquant | Aucune décision écrite. Proposition : le classer sous l.72 (point juridique secondaire reporté), en une ligne de l'orchestrateur. |
| m3 tutoiement CGU | **Non levé** | `app/(dashboard)/cgu/page.tsx` l.61 : « ni ne te prive des droits que la loi te garantit ». |
| m4 impasse Premium | **Levé** | `REPLIT_ACTIONS.md` l.23 ; pied de page par `LienLettrePied` (`footer.tsx` l.124 et 125). |
| m5 « aucun contrôle automatique » | **Non levé** | `REPLIT_ACTIONS.md` l.17 contredit toujours la l.14. |
| m6 `<title>` avec insécables | **Levé** | `lettre/desinscrire/page.tsx` l.16 lit `TITRES_META_LETTRE.desinscrire`. |
| m7 historique `project-context.md` | Non levé, attendu | À faire à la clôture. |

## Nouveaux défauts

**N1 (majeur, procédure). Rien ne vérifie, en production, qu'une vraie personne peut s'inscrire et confirmer.**
- Le B1 de la QA était précisément ce chemin, et il dépendait des en-têtes envoyés par le navigateur (`Origin`, `Referrer-Policy`). Cloudflare et le vrai domaine ne sont pas la base locale.
- Les contrôles d'après mise en ligne (`REPLIT_ACTIONS.md` l.26) s'arrêtent à des pages en 200.
- Correction : ajouter l'étape P5 ci-dessous.

**N2 (majeur, procédure). Avancer « Soirée de Noël » demande une écriture précise, faite à temps, avant les tâches de démarrage.**
- Un article planifié est en base avec `isPublished = false` et `publishedAt` à la date prévue. `publishDueScheduledArticles` (`lib/scheduler/prepared-content.ts` l.118 à 123) ne publie que les articles **de la semaine ISO en cours**. Une date posée après le dimanche 08/11 laisserait donc l'article non publié pour toujours.
- Dans ce cas, le n°1 serait reporté chaque jeudi. Au 1er décembre, la tâche ne cherche plus que le numéro du mois en cours (`envoi.ts` l.234 à 236) : **le n°1 ne partirait jamais**, sans autre alerte que le report.
- Si l'écriture vient après l'appel des tâches de démarrage, `controlerDatesPlancher` lève une alerte sur 2026-11, ce qui brouille le contrôle.
- Le slug n'est pas un article du code (Grep : seulement `numeros.json` et des tests) : la ligne doit exister en base.
- Ce qui dépend encore du 16/11, à part la base :
  - `docs/social/preparation/2026-11.md` l.152 et 153 : posts « Article du lundi » du 16/11 pour un article sorti 2 semaines plus tôt, et aucun post le 02/11 pour lui. Ce n'est pas un lien mort. À trancher par @social à la reprise du 26/10, sans bloquer la mise en ligne.
  - `docs/copy/articles-q4/S7-soiree-de-noel-entreprise.md` l.1 et l.15, `docs/seo/calendrier-editorial-q4-2026.md` : documentation seulement.
  - Rien dans le code de production (tests mis à part) ni dans les numéros 2 à 6.
- Correction : étape P3.

**N3 (mineur, texte). « Mon compte » s'affiche.**
- `components/layout/account-menu.tsx` l.27 pose `title={TEXTES_CONNEXION.menuCompte}`. Au survol, sur ordinateur, une infobulle « Mon compte » apparaît donc. Le commentaire « jamais affiché » (`config/textes/compte.ts` l.46 et 47) est inexact.
- Sur le fond, le libellé ne pose pas de problème : il est clair, attendu sur une icône de profil, et cohérent avec « Supprimer mon compte » et « Mon profil ». Mais c'est un texte nouveau, PROVISOIRE, qui n'est pas passé à l'aveugle (règle d'or).
- Correction (@fullstack, au choix) : retirer `title`, pour que le texte ne soit plus qu'un nom vocal, et corriger le commentaire ; ou bien garder l'infobulle et ajouter « Mon compte » au prochain pack de relecture à l'aveugle.

**N4 (mineur, procédure). `REPLIT_ACTIONS.md` contient des consignes périmées qui peuvent égarer celui qui déploie.**
- l.7 : « Étapes encore à venir : … QA, revue ».
- l.15 : « compte.ts dit encore newsletter ».
- l.47 et l.60 à 66 : procédure d'ouverture avec `LETTRE_OUVERTE`, une variable qui n'existe plus, et n°1 le 19/11.
- l.28 et l.47 : titres « À DÉPLOYER APRÈS LE BILAN DU LOT 1 ».
- Correction : coiffer les deux entrées d'origine de « INCLUS DANS L'INTÉGRATION S21, ne pas déployer ni suivre séparément », et mettre à jour l.7 et l.15.

**N5 (mineur, procédure). Le retour arrière ne dit pas ce qu'il laisse derrière lui.**
- Sur la version N-1, `/lettre`, `/lettre/confirmer` et `/lettre/desinscrire` répondent 404 (QA, « Comparaison avec la production »). Après un premier envoi, le lien de désinscription **du corps** des e-mails (`lib/newsletter.ts` l.29 et 30) serait donc mort.
- Le lien en un clic des en-têtes reste servi par N-1 (`app/api/newsletter/unsubscribe/[token]/route.ts`, GET et POST).
- La base garde la migration 14, ce qui est compatible (ajouts seulement), et la nouvelle date de l'article.
- L'interrupteur demande un commit, un build et un déploiement, soit plusieurs minutes. Le rollback ne prend que quelques secondes et coupe aussi l'envoi, puisque N-1 n'a pas de tâche lettre.
- Correction : étape P8.

**m8 (mineur, document).** `docs/copy/lettre-mensuelle-s21/numeros-1-a-6.md` l.395 et l.397 laisse « à trancher par Thomas » la vanne du n°3 et le libellé « Voir les parcours » du n°1. Or l.111 autorise les envois et les deux points ont un défaut évident : la version validée à l'aveugle (« ou le laisser tel quel (VALIDÉ) »). Correction (orchestrateur) : écrire « tranché par défaut le 17/10 : versions validées gardées (founder-preferences l.111) », pour qu'aucun agent ne bloque le 05/11 sur ces points.

## Procédure de mise en ligne : vérification

| Élément demandé | Présent à l.26 ? | Manque |
|---|---|---|
| Version précédente relevée | Oui (`npx wrangler deployments list`) | Valeur attendue : `5ea46dd8-1e31-4175-bc99-3d0873925901` (l.78), sauf déploiement entre-temps. La noter dans l'entrée avant de déployer. |
| Retour arrière | Oui (`wrangler rollback`, ou interrupteurs et redéploiement) | Ce qu'il laisse (N5), et lequel choisir avant ou après un envoi (P8) |
| Contrôles avant | Migration ×2 seulement | Les 3 contrôles B-3 (P1), CI verte et commit exact (P0) |
| Contrôles après | Pages en 200, bloc lettre, pied de page, entrée lot 2 | Essai réel (P5), en-tête `Referrer-Policy`, numéros en base, 0 envoi, journal de démarrage (P4), contrôles du 02/11 et du 05/11 (P6) |
| Interrupteurs | Oui, documentés (l.9), tous deux à `true`, testés | La vitesse de chaque arrêt (P8) |
| Date d'article | Oui, mais en échange de deux dates (contraire à la décision) | P3 |

**Texte attendu dans la procédure** (à écrire par @infrastructure, d'après les éléments ci-dessus ; les noms de table SQL sont à vérifier contre `schema.prisma` avant usage) :
- **P0. Avant tout.** Déployer le commit exact (`46d455fb` ou le dernier de la branche, noté dans l'entrée), avec la CI GitHub verte sur ce commit. Feu vert de Thomas obtenu. La mise en ligne doit se faire avant le dimanche 01/11 (contrainte de P3), et en tout cas avant le jeudi 05/11 à 8 h (l.17).
- **P1. Trois contrôles bloquants, avant la migration.**
  - (a) `SELECT status, count(*) FROM "NewsletterSubscriber" GROUP BY 1;` doit renvoyer **0 ligne**. Sinon : arrêt, puis décision de Thomas (passer en `UNSUBSCRIBED` ou purger), et jamais d'envoi d'ici là.
  - (b) Resend, réglages du domaine d'envoi : suivi d'ouverture **et** de clic désactivés. Garder une capture (la clé d'API est limitée à l'envoi, l.56 : c'est donc Thomas ou le tableau de bord qui fait foi).
  - (c) `npx wrangler secret list` : `UNSUBSCRIBE_HMAC_SECRET` présent. La longueur de 32 caractères ou plus est prouvée en P5 (`ipHash` non nul). Ne jamais régénérer ce secret, car cela casserait les liens de désinscription des e-mails CEO (l.1901).
- **P2.** Migration 14, deux passes (commande l.52). Critère : code de sortie 0 aux deux passes.
- **P3. Article « Soirée de Noël au boulot » seul.**
  - Relever `slug`, `isPublished` et `publishedAt` de `soiree-de-noel-entreprise-humour` et de `humour-en-visio-reunion-en-ligne`. Attendu : les deux lignes existent, avec `isPublished = false`.
  - Puis `UPDATE … SET "publishedAt" = '2026-11-02 05:00:00+00' WHERE slug = 'soiree-de-noel-entreprise-humour' AND "isPublished" = false AND "publishedAt" = <valeur relevée>`. Critère : 1 ligne modifiée.
  - Ne pas toucher à `isPublished` : c'est la tâche planifiée qui publie. Ne pas toucher à « Humour en visio ».
  - Faire cette écriture **avant** P4, et au plus tard le dimanche 01/11.
  - Retour : même `UPDATE` vers la valeur relevée.
- **P4. Déploiement, puis tâches de démarrage.**
  - `GET /api/cron/startup-tasks` (Bearer `CRON_SECRET`). Critère dans le journal : « lettre : 6 numéro(s) créé(s) » et **aucune** ligne « lettre : ALERTE ».
  - En base : `NewsletterIssue` contient 6 lignes `VALIDE`, dont `scheduledFor` du n°1 = 2026-11-05 07:00 UTC, et `NewsletterSend` = 0 ligne.
- **P5. Essai réel en production**, avec l'adresse d'Alex, en navigation normale (pas curl) :
  - `curl -sI https://deviens-marrant.fr/lettre` doit montrer `Referrer-Policy: same-origin`.
  - Inscription sur `/lettre`, e-mail reçu, clic sur « Confirmer mon adresse ». Attendu : « C'est bon, c'est confirmé. ». En base : `status = CONFIRMED` et `ipHash` non nul.
  - Désinscription par le lien en un clic de Gmail (en-tête `List-Unsubscribe`). Attendu : `UNSUBSCRIBED`.
  - Réinscription si Thomas veut recevoir le n°1.
  - Ensuite : pages en 200 et contrôles de l'entrée lot 2 (déjà écrits).
- **P6. Contrôles datés.**
  - Lundi 02/11 après 06:00 Paris : article en ligne (`/blog/soiree-de-noel-entreprise-humour` en 200) et `isPublished = true`.
  - Jeudi 05/11 après 08:15 : journal `[scheduler:lettre-mensuelle]` sans « reporté » ni « bloqué », et `NewsletterSend` égal au nombre de confirmés (hors exclus).
- **P7.** Noter la date et l'heure de mise en ligne dans `docs/marrant/audit-conversion-s20.md` (rupture de la mesure du lot 1, B-1), ainsi que la version déployée et la version N-1 dans l'entrée.
- **P8. Arrêts.**
  - Avant le 05/11, ou pour un problème d'affichage : `npx wrangler rollback <N-1>` (quelques secondes).
  - Pendant ou après un envoi : préférer `LETTRE_ENVOIS_OUVERTS = false` puis redéploiement, pour garder `/lettre/desinscrire` en ligne. Un rollback ne se fait que si l'envoi part mal ; il faut alors redéployer au plus vite une version qui sert les liens de désinscription.

## Ce qui manque pour 10/10 (liste exacte)
1. **B-3 et N1 à N2 (bloquant pour GO)** : P0 à P8 écrits dans l'entrée d'intégration de `REPLIT_ACTIONS.md`, et m5 corrigé dans la foulée (l.17).
2. **M2 (bloquant pour GO)** : l.14 et l.17 de `REPLIT_ACTIONS.md` et l.12 de `plan-integration-s21.md` réécrits en « seul Soirée de Noël avance au 02/11 », selon P3.
3. **B-4, reliquat (bloquant pour GO)** : contre-épreuve @qa sur le commit final, dans un vrai navigateur (inscription, Confirmer, `CONFIRMED`, désinscription), suite smoke verte, captures en-tête 1024, 1280 et 1440 connecté ; puis CI verte sur ce commit.
4. **m8** : les 2 points de `numeros-1-a-6.md` refermés par défaut (une ligne).
5. **N3** : `title` retiré ou « Mon compte » relu à l'aveugle.
6. **N4 et N5** : entrées d'origine marquées « incluses », notes périmées retirées, effets du retour arrière écrits (P8).
7. **m3** (une phrase @legal), **m2** (classé sous l.72 ou pack court), **m7** à la clôture.

Les points 1 à 4 suffisent pour GO à 9,5. Les points 5 à 7 font le 10/10. Aucun ne touche un texte validé ni un [CHOIX UTILISATEUR].

## Limites du tour 2
- Je n'avais ni shell ni accès à la CI : le `git diff --stat` n'a pas été lancé, la CI de `46d455fb` n'est pas vérifiée, et les tests n'ont pas été rejoués. Le commit a été établi par les reflogs locaux, la branche locale et `origin` étant tous deux sur `46d455fb`.
- Les captures du tour 2 viennent de @fullstack, pas de @qa.
- Je n'ai pas vérifié l'état de la base de production : existence et date de l'article, inscrits, réglage Resend.
