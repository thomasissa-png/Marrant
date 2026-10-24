# Clés de tirage des duels CTA s21, tour 2, packs 1 et 2 (ne jamais transmettre aux relecteurs, ni copier dans les packs)

> « A » = la version corrigée du gagnant du tour 1 (tous les « manque pour 10 » des 3 verdicts appliqués). « B » = le challenger : un autre angle, qui corrige aussi tous les défauts relevés. Le pack 3 n'est pas traité ici (voir `cles-pack3-tour2.md`).

**Tirage** (pas de générateur aléatoire disponible dans cette session) : position de A fixée par la parité du code ASCII des caractères 9 à 14 de l'identifiant de session (`01Ny4UaXcj6i1VwL3T1j7rJZ`), soit `c j 6 i 1 V`, dans l'ordre B1, B2, B18, B3, B4 + B5, B6. Pair = A en Texte 1, impair = A en Texte 2. Codes : c = 99 (impair), j = 106 (pair), 6 = 54 (pair), i = 105 (impair), 1 = 49 (impair), V = 86 (pair). Résultat : 3 duels avec A en Texte 1, 3 avec A en Texte 2. Tirage indépendant de la qualité des textes.

| Pack | Bloc | Texte 1 | Texte 2 | A (gagnant corrigé) | B (challenger) |
|---|---|---|---|---|---|
| 1 | B1 encart milieu | B | A | Situation du carnet avec la réplique et « Pourquoi ça marche » montrés, bouton qui dit ce qu'on gagne (« Voir la sortie polie et l'exercice ») | Même situation, réplique cachée (« Tu réponds quoi ? »), bouton « Voir la réplique » |
| 1 | B2 bloc de fin | A | B | Programme de Répartie sans vanne, titre de situation, contenu réel des 4 étapes | Vanne décryptée (comparaison sonore) + une ligne de format du parcours, titre « Après les blagues à raconter, la répartie pour répondre » |
| 1 | B18 lettre | A | B | « La vanne du mois, et pourquoi elle marche » | « Une vanne dans ta boîte mail, une fois par mois » |
| 2 | B3 haut d'accueil | B | A | Plein = « Lire l'étape 1 gratuite de Répartie », E1 en lien, note réordonnée | Plein = E1 (libellé inchangé), note prix et garantie juste dessous, lien étape 1 en dernier |
| 2 | B4 + B5 carte Premium | B | A | Titre « Après les vannes, les parcours », « lire, c'est un début » + persona sans triade + défi + 15 à 20 min | Titre « La première étape est gratuite, la suite est dans Premium », angle « essaie d'abord » + même mapping persona + 15 à 20 min |
| 2 | B6 en-tête | A | B | « Voir l'offre » (72 px estimés) | « Voir les prix » (81 px estimés) |

## Éléments identiques dans A et B (variable contrôlée, pour que le duel mesure l'angle)

- B2 : bouton, lien E1 et note `[S9]` identiques. B18 : note « Gratuit, sans compte. Désinscription en un clic. » identique. B3 : phrase « Les parcours complets sont dans Premium : 2,99 € TTC par mois, résiliable en ligne, premier paiement remboursable sous 14 jours. » identique. B4 + B5 : `[S12]`, `[S13]` et phrase de correspondance parcours/persona identiques.
- Boutons non modifiés : « Lire la première étape gratuite de Répartie » (B2, B4 + B5), « Commencer à 2,99 €/mois », « 1 500+ », « Accéder aux parcours complets » (B2, B3, intact).

## Règle de lecture

- Compter, par duel, les avis (3 relecteurs) sur A contre B ; la conversion départage l'écriture.
- Un texte n'entre en ligne que s'il atteint le niveau (règle d'or P0 s18). Si A et B sont tous deux sous le niveau, réécrire avec les « manque pour 10 » puis relire.
- B3 B conserve la forme du libellé E1 en plein : si B gagne, la forme de la spec design ne s'applique pas à ce bloc.
- B6 : les deux libellés sont plus étroits que « Commencer » ; l'estimation en pixels doit être confirmée à 360 px (voir l'annexe).

## Sources de chaque fait utilisé dans les packs

Chemins relatifs à `/home/user/Marrant/`. Les fichiers de la lettre (marqués W) n'existent pas dans l'arbre principal : ils sont dans le worktree `.claude/worktrees/agent-a6072b0ac19da7774/` (branche d'intégration s21).

| Fait | Source |
|---|---|
| Prix 2,99 € / 24,99 € / 2,08 € / 10,89 € | `apps/web/src/config/premium.ts` l. 31-50 ; format TTC : `config/textes/offre.ts` `prixTtcLabel` |
| Remboursement du premier paiement sous 14 jours ; phrase « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » | `config/textes/offre.ts` l. 35-36 (`REASSURANCE_PAIEMENT`) ; phrase 1 seule : l. 45 |
| Durées et nombre de semaines des 5 parcours (15 ou 20 min) | `config/premium.ts` l. 72-82 (`PREMIUM_PARCOURS`) |
| « 15 à 20 minutes de la semaine » | `config/textes/parcours-emails.ts` l. 66 ; cohérent avec `PREMIUM_PARCOURS` |
| « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz. » affiché sur la carte d'étape | `docs/content/parcours-seed.json` (`moduleFormat`, Répartie l. 289, 367, 445, 523) ; affichage : `components/parcours/parcours-step-card.tsx` l. 391 (« Format : … ») |
| Titres des 4 étapes de Répartie | `parcours-seed.json` `moduleTitle` l. 287, 365, 443, 521 (affiché : `parcours-step-card.tsx` l. 201) ; conseils : `tipTitle` l. 284, 362, 440, 518 |
| Méthode en trois temps (accepter, exagérer, retourner) | `parcours-seed.json` l. 442 (`why`, étape 3) et l. 444 (`moduleDetail`) |
| Étape 4 : une vanne qui tombe à plat comme deuxième chance | `parcours-seed.json` l. 520 (`why`) |
| Le défi (mission à tenter, ou à l'écrit faute d'occasion) | `parcours-seed.json` l. 348-356 (quiz de l'étape 1) ; `config/textes/parcours.ts` l. 163-165 (« Alors, ce défi ? ») |
| Étape 1 sans compte, quiz compris ; étapes suivantes Premium | `parcours-seed.json` `free: true/false` ; fait repris tel quel du pack du tour 1 (confirmé par l'UX s17) |
| Fiche du carnet (6 rubriques) et 1 fiche gratuite ; autres fiches : titre et contexte seulement | `lib/carnet.ts` l. 30-40 (schéma), l. 52-57, l. 73 (`CARNET_FREE_FICHES = 1`), l. 142-155 (`carnetViewForPlan`) |
| Contenu de la fiche « Le soleil dans l'ascenseur » (situation, onTeDit, réponse, pourquoi, siTendu, exercice) | `apps/web/src/data/carnet/2026-10.json` l. 6-16 |
| Carnet nouveau chaque mois ; mois courant calculé (Paris) | `lib/carnet.ts` l. 105-134 ; libellé du mois généré : `formatCarnetMonth` / `deCarnetMonth` l. 163-173 |
| Fiche vanne n°173 : décryptage (3 phrases) et « À toi de jouer » (`howToApply`, Premium) | `apps/web/src/data/joke-decryptages.json` l. 735-738 (non utilisée dans ce tour) |
| Vanne « en toute bienveillance » et décryptage | `joke-decryptages.json` l. 783-786 |
| Lettre : structure d'un numéro (vanne, Pourquoi ça marche, À toi de jouer en 3 étapes + exemple, lien d'article, mention Premium) (W) | `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src/data/lettre/numeros.json` (numéros 1 à 4 lus) |
| Lettre gratuite, sans compte, une fois par mois ; « Je peux me désinscrire en un clic, à tout moment » (W) | `.../config/textes/lettre-s21.ts` l. 67 (case), l. 72 (réassurance) |
| Désinscription en un clic : lien dans le pied de chaque numéro, `List-Unsubscribe-Post` ; exigence légale | `lettre-s21.ts` l. 251-259 (W) ; `apps/web/src/lib/rappels/rappel-parcours.ts` l. 222-223 (même mécanisme sur les rappels) ; `docs/legal/lettre-et-questions-s21.md` l. 14 (B3) |
| Page de désinscription : un bouton « Me désinscrire » après le lien du message | `lettre-s21.ts` l. 124-129 (W) : voir point à vérifier dans l'annexe |
| Persona : « Pour toi si on te chambre en soirée, en coloc ou en TD… » (affiché sur le détail du parcours) | `parcours-seed.json` l. 271 ; affichage `components/parcours/parcours-detail.tsx` l. 524-528 |
| Pastilles, paragraphe et titre du haut d'accueil ; bouton plein de taille `lg`, pleine largeur sur mobile | `components/home/hero-section.tsx` l. 68-100 ; `components/ui/button.tsx` l. 24 |
| Pas de compte gratuit ; compte puis paiement | fait repris du pack du tour 1 ; `__tests__/feature/suppression-compte-gratuit-s15.test.ts` |
| Limites sans abonnement (10 vannes, 3 conseils, 3 vidéos) | `config/premium.ts` l. 106-111 |
| Bouton d'en-tête : place disponible | `components/layout/header.tsx` l. 69-76, 148-184 ; `button.tsx` l. 22 ; `docs/design/cta-forme-place-s21.md` l. 219 (≈ 107 px à 360) |
