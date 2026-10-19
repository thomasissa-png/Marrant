# Clés de tirage des duels CTA s21, tour 3, packs 1 et 2 (ne jamais transmettre aux relecteurs, ni copier dans le pack)

> « A » = la version fusionnée, écrite pour faire désirer et payer, qui porte le meilleur libellé de bouton (Thomas : « Faut des CTA qui donnent envie de payer »). « B » = le gagnant du tour 2 avec seulement les corrections bloquantes, qui garde les libellés d'avant (le duel tranche nouveau contre ancien). Le pack 3 n'est pas traité ici.

**Tirage** (pas de générateur aléatoire disponible) : position de A fixée par la parité du code ASCII des caractères 15 à 20 de l'identifiant de session (`01Ny4UaXcj6i1VwL3T1j7rJZ`), soit `w L 3 T 1 j`, dans l'ordre B1, B2, B18, B3, B4 + B5, B6. Pair = A en Texte 1, impair = A en Texte 2. Codes : w = 119 (impair), L = 76 (pair), 3 = 51 (impair), T = 84 (pair), 1 = 49 (impair), j = 106 (pair). Résultat : 3 duels avec A en Texte 1, 3 avec A en Texte 2. Tirage indépendant de la qualité des textes.

| Bloc | Texte 1 | Texte 2 | A (fusionné, désir) | B (gagnant tour 2 + corrections bloquantes) |
|---|---|---|---|---|
| B1 encart milieu | B | A | Bouton « Voir la réplique » ; note « Gratuit, sans compte, avec le pourquoi du rire et une sortie polie si ça se tend. Les autres situations du mois t'attendent dans Premium, l'abonnement payant du site. » | Même carte ; note allégée « Gratuit, sans compte, avec pourquoi elle marche. Les autres situations du mois sont dans Premium, l'abonnement du site. » |
| B2 bloc de fin | A | B | Scène (« Imagine la table qui rit… »), 3 contenus d'étape + défi, bouton « Tester mes premières répliques, gratuit », lien « Débloquer toute Répartie, 2,99 €/mois », `[S9]` avec « Premium, l'abonnement du site » | Paragraphe sans « Au programme : » ni jargon, bouton « Lire la première étape gratuite de Répartie », lien « Accéder aux parcours complets », `[S9]` du tour 2 |
| B18 lettre | B | A | Titre sans virgule, sous-titre « pour écrire la tienne » + mention honnête (lecture à suivre, mot sur Premium), ligne repliée « Une vanne gratuite par mois, et pourquoi elle marche. » + « Recevoir par e-mail » | Texte du tour 2 avec « C'est gratuit, par e-mail » (accord corrigé), « Recevoir la lettre », aucune mention de Premium |
| B3 haut d'accueil | A | B | Bouton « Tester mes premières répliques, gratuit », lien « Débloquer tous les parcours, 2,99 €/mois », note : Premium défini, garantie en formule exacte, « sans compte » en dernier | Bouton « Lire la première étape gratuite de Répartie », lien « Accéder aux parcours complets », note : sans compte d'abord, garantie en formule exacte |
| B4 + B5 carte Premium | B | A | Titre « Et si le « j'aurais dû dire » devenait un « j'ai dit » ? », scène + défi + correspondance parcours, prix unifié « €/mois », 10,89 € économisés, boutons « Débloquer tous les parcours, 2,99 €/mois » et « Tester mes premières répliques, gratuit » | Titre « La première étape est gratuite, la suite est dans Premium », « à raison de » retiré, prix en deux écritures, boutons « Commencer à 2,99 €/mois » et « Lire la première étape gratuite de Répartie » |
| B6 en-tête | A | B | « Voir les prix » | « Commencer » (libellé d'avant) |

## Éléments identiques dans A et B

- `[S12]` ne contient plus « Droit de rétractation » dans aucun des deux textes (consigne de Thomas : retiré, non reporté ailleurs). `[S13]` identique mot pour mot. Les 4 avantages, « 1 500+ » et « Déjà 1 500+ inscrits, et toi ? » identiques. Hero de l'accueil identique. Champ, case, mention d'éditeur et bouton du formulaire de la lettre identiques. Note « Gratuit, sans compte. Désinscription en un clic. » identique.

## Règle de lecture

- Compter, par duel, les avis (3 relecteurs) sur A contre B ; la conversion départage l'écriture.
- Un texte n'entre en ligne que s'il atteint le niveau (règle d'or P0 s18). Si A et B sont tous deux sous le niveau, réécrire avec les « manque pour 10 » puis relire.
- Dans B1, B2, B18, A et B diffèrent aussi par l'angle (désir de la scène contre clarté descriptive) : si B gagne, ne pas reprendre les libellés de A sans les tester seuls.
- B6 : « Commencer » est le libellé en ligne aujourd'hui (largeur de référence). Si B gagne, la question « le visiteur sait-il où il arrive » est tranchée contre « Voir les prix ».

## Sources des faits nouveaux de ce tour

Chemins relatifs à `/home/user/Marrant/`. Sources du tour 2 : voir `docs/copy/cta-s21/tour2/cles-tour2.md`.

| Fait | Source |
|---|---|
| Contenu d'un numéro de la lettre : vanne, « Pourquoi ça marche », « À toi de jouer » en 3 étapes + exemple, puis une lecture à suivre (article du blog dans les numéros 1, 2, 4, 5 ; première étape d'un parcours dans les numéros 3 et 6), puis un PS sur Premium (les 6 numéros) | `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src/data/lettre/numeros.json` (numéros 1 à 6 lus) |
| Les exercices de la lettre guident l'écriture d'une vanne (« Écris deux phrases… », « Raconte en trois courtes phrases… ») : « pour écrire la tienne » | même fichier, rubriques « À toi de jouer » |
| Fiche gratuite du carnet : situation, ce qu'on te dit, réplique, pourquoi ça marche, sortie polie, exercice | `apps/web/src/data/carnet/2026-10.json` l. 6-16 |
| Formule de garantie « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » | `config/textes/offre.ts` l. 35-36 (`REASSURANCE_PAIEMENT`) |
| 10,89 € économisés par an, 2,08 € par mois | `config/premium.ts` l. 31-50 |
| Titres des étapes de Répartie (« Tes premières répliques », « Le rythme et les silences », « Retourner les piques avec le sourire »), conseil de l'étape 4 « Savoir rebondir sur un raté » | `docs/content/parcours-seed.json` l. 284-287, 362-365, 440-443, 518-521 |
