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
