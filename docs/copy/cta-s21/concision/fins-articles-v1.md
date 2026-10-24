# Fins d'article propres aux articles « à forte frappe » : v1 (correction C1 de la revue v3)

> Statut : PROPOSITION pour relecture à l'aveugle (pack : `/tmp/claude-0/-home-user-Marrant/3787bb61-f373-5413-8849-f5156f0bd519/scratchpad/concision/pack-fins-articles.md`), puis branchement par @fullstack dans `apps/web/src/config/blog-cta.ts` (`BLOG_CTA_BY_SLUG`). Aucun code touché. `[Framework : AIDA allégé, une idée + un plein]` · `[Conscience : Solution-Aware, le lecteur vient de lire un texte prêt à envoyer ; on lui montre la suite orale]`

## Gabarit (textes-v5-a.md §3)

Titre (≤ 10 mots) + 1 phrase (≤ 15 mots) + bouton plein gratuit + « Sans compte. » + lien payant. Budget hors bouton : 25 mots, « Sans compte. » (2 mots) comprise. Pas de réassurance affichée (le plein est gratuit, le lien mène à /abonnement).

- **Bouton plein** : `Tester l'étape 1 de {P}, gratuite` quand l'entrée actuelle a un `parcoursHref` (Confiance ou Répartie) ; `Tester mes premières répliques, gratuit` sinon (GRATUIT_ACCUEIL).
- **Lien** (partout) : `Ouvrir les 5 parcours · 2,99 €/mois`.
- **Aucun** `primaryLabel` « Passer à Premium » / « Commencer le parcours X » : remplacé par le plein gratuit.

## Écart de périmètre à connaître

`BLOG_CTA_BY_SLUG` contient **12 entrées**, pas 10 (la revue v3 parle de 10). Les 12 sont traitées : la ligne 1 est l'étalon n°1, déjà validé en v5 (§3 de `textes-v5-a.md`), simplement repris.

## Tableau

| # | Slug | Sujet de l'article | Titre | Phrase | Bouton plein | Titre + phrase | Avec « Sans compte. » |
|---|---|---|---|---|---|---|---|
| 1 | `meilleures-blagues-droles-2026` | 50 blagues à ressortir en 2026, par situation | La vanne dans ta bouche, pas dans ton téléphone | La placer à voix haute, ça s'entraîne. | Tester mes premières répliques, gratuit | 9+7 = 16 | 18 |
| 2 | `message-anniversaire-drole-par-situation` | 21 messages d'anniversaire drôles à copier-coller (pote, collègue, parent, ami perdu de vue) | Au moment du gâteau, tout le monde t'écoute | Deux ou trois répliques à tester avant la fête. | Tester mes premières répliques, gratuit | 8+9 = 17 | 19 |
| 3 | `voeux-drole-nouvelle-annee` | 27 vœux drôles par destinataire (collègues, patron, famille, groupe WhatsApp, ex) | En janvier, les vœux se disent aussi en face. | Prépare quelques répliques pour la tournée des bises. | Tester mes premières répliques, gratuit | 9+8 = 17 | 19 |
| 4 | `premier-message-drole-appli-de-rencontre` | Écrire un premier message drôle sur une appli (bio, photo, relance après un silence) | On te répond. Tu écris quoi, maintenant ? | Entraîne-toi à tenir la conversation avant qu'elle arrive. | Tester l'étape 1 de Confiance, gratuite | 7+8 = 15 | 17 |
| 5 | `blagues-de-couple-drole` | 30 blagues de couple par situation (canapé, courses, beaux-parents, vacances) | Ta moitié a toujours le dernier mot ? | Répartie t'entraîne à répondre du tac au tac. | Tester l'étape 1 de Répartie, gratuite | 7+8 = 15 | 17 |
| 6 | `blagues-poisson-d-avril-adultes` | 15 canulars du 1er avril pour adultes (bureau, famille, potes, couple) | Le 1er avril, tu peux aussi être la cible. | Une riposte, ça se prépare avant. | Tester mes premières répliques, gratuit | 9+6 = 15 | 17 |
| 7 | `blagues-de-gamer-jeux-video` | 24 blagues de gamer par moment (partie en ligne, vocal avec la team, défaite, nuit blanche) | En vocal, la team ne laisse rien passer. | Entraîne ta répartie avant la prochaine partie. | Tester l'étape 1 de Répartie, gratuite | 8+7 = 15 | 17 |
| 8 | `refuser-une-invitation-avec-humour` | 21 réponses drôles pour refuser une invitation (soirée, pot, repas de famille, groupe WhatsApp) | Après ton non, il y a le « t'es sûr ? » | Répondre sans dix excuses, ça se travaille. | Tester mes premières répliques, gratuit | 9+7 = 16 | 18 |
| 9 | `mot-de-depart-collegue-drole` | 22 mots de départ drôles pour un collègue, par support (carte, canal d'équipe, message privé, mail) | Le pot de départ, c'est aussi de l'oral. | Autour du buffet, quelques répliques de plus dans ta poche. | Tester mes premières répliques, gratuit | 8+10 = 18 | 20 |
| 10 | `message-drole-fete-des-meres` | 23 messages drôles pour la fête des mères, par moment (carte, cadeau, appel, repas) | À table, plus de texte à copier. | Confiance t'entraîne à trouver tes mots à toi. | Tester l'étape 1 de Confiance, gratuite | 7+8 = 15 | 17 |
| 11 | `message-drole-fete-des-peres` | 19 messages drôles pour la fête des pères (bricolage, barbecue et voiture, appel et répondeur) | Le SMS part, le repas arrive. | Quelques répliques à essayer avant le grand jour. | Tester mes premières répliques, gratuit | 6+8 = 14 | 16 |
| 12 | `blagues-vacances-ete-entre-amis` | 20 blagues de vacances entre amis par situation (location, route, comptes, groupe, photos) | Cet été, la blague du groupe peut être la tienne. | Confiance t'entraîne à oser, avant de partir. | Tester l'étape 1 de Confiance, gratuite | 10+7 = 17 | 19 |

Maximum : 20 mots avec « Sans compte. » (budget 25 : marge de 5). Comptage selon §0 de `textes-v5-a.md` (signes seuls non comptés, `Entraîne-toi` et `jour-là` = 1 mot).

## Contrôles

- **Libellés uniques** : bouton plein et lien non modifiés (aucune formule nouvelle).
- **Rien de faux** : aucune promesse de résultat ; « t'entraîne à » reprend la formulation déjà en ligne pour Répartie et Confiance ; le bouton gratuit est cohérent avec la phrase (jamais « les parcours complets » au-dessus d'un plein gratuit).
- **Interdits** : zéro « X, pas Y » (sauf n°1, étalon v5 déjà validé), zéro « Et si… ? », zéro « sans te forcer », zéro « d'un coup », zéro tiret cadratin, guillemets « ».
- **Répétitions évitées** : chaque titre part d'une scène propre à l'article (gâteau, bises de janvier, réponse d'appli, dernier mot du couple, 1er avril, vocal, « t'es sûr ? », pot, repas de fête des mères, SMS de fête des pères, groupe de vacances). Tournures « ça s'entraîne / ça se travaille / ça se prépare » : une seule fois chacune.
- **Animation de la phrase** : n°5, 7, 10, 12 nomment le parcours (Répartie ou Confiance), parce que le bouton plein le nomme ; les 7 autres restent sur « répliques » (bouton générique).

## Consignes pour @fullstack (après la relecture à l'aveugle)

1. Dans `BLOG_CTA_BY_SLUG`, remplacer `title` et `text` par les valeurs ci-dessus. Les entrées sans `parcoursHref` affichent le bouton GRATUIT_ACCUEIL ; celles avec `parcoursHref` affichent `Tester l'étape 1 de {P}, gratuite` ; plus de `primaryLabel` « Passer à Premium » / « Commencer le parcours X » ni de `secondaryLabel` « Lire l'étape 1 de X » au-dessus du plein gratuit.
2. Entrée n°1 : le plus simple est de la **supprimer** (la déclinaison v5 du bloc de fin affiche déjà exactement ce titre et cette phrase).
3. Mettre à jour les tests qui figent les anciens textes (`blog-article-cta-position`, `blog-cta-mesure-s20`, `concision-v5-textes`) et ajouter le contrôle « budget de mots ≤ 25 hors bouton » sur ces 12 entrées.
4. Documenter dans `REPLIT_ACTIONS.md` (contrôle 14 de la liste P6).

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/copy/cta-s21/concision/fins-articles-v1.md` ; pack à l'aveugle `/tmp/claude-0/-home-user-Marrant/3787bb61-f373-5413-8849-f5156f0bd519/scratchpad/concision/pack-fins-articles.md`.
- Décisions : gabarit §3 de `textes-v5-a.md` ; boutons selon `parcoursHref` ; 12 entrées (pas 10) ; n°1 repris de la v5.
- Points d'attention : tour à l'aveugle court à lancer sur les 11 blocs nouveaux ; relecteurs à interroger sur les titres n°3 (janvier), n°5 (« Ta moitié ») et n°9 (le pot) en priorité (humour léger, risque de « moyen » ; si la barre n'est pas atteinte, version sans trait d'esprit plutôt qu'une vanne moyenne) ; aucune référence de marché consultée (ajustement de gabarit interne, pas de nouveau livrable).
---
