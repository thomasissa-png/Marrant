# Clés de tirage des duels CTA s21, tour 4, packs 1 et 2 (ne jamais transmettre aux relecteurs, ni copier dans le pack)

> « A » = le texte poli qui intègre le meilleur des 3 verdicts du tour 3 et les 7 corrections de Thomas. « B » = le gagnant du tour 3 tel quel (B1 : le texte B du tour 3 ; B2, B18, B3, B4 + B5 : le texte A du tour 3 ; B6 : « Voir les prix »). Critère unique : l'envie de payer (choix de Thomas du 18/10). Le pack 3 n'est pas traité ici.

**Tirage** (pas de générateur aléatoire disponible) : position de A fixée par la parité du code ASCII des caractères 9 à 14 de l'identifiant de session (`01Ny4UaXcj6i1VwL3T1j7rJZ`; les caractères 15 à 20 ont servi au tour 3), soit `c j 6 i 1 V`, dans l'ordre B1, B2, B18, B3, B4 + B5, B6. Pair = A en Texte 1, impair = A en Texte 2. Codes : c = 99 (impair), j = 106 (pair), 6 = 54 (pair), i = 105 (impair), 1 = 49 (impair), V = 86 (pair). Résultat : 3 duels avec A en Texte 1, 3 avec A en Texte 2. Tranche choisie avant d'écrire les textes, indépendante de leur qualité.

| Bloc | Texte 1 | Texte 2 | A (poli) | B (gagnant du tour 3 tel quel) |
|---|---|---|---|---|
| B1 encart milieu | B | A | Situation du carnet « Le premier rendez-vous silencieux » (« Tu parles toujours aussi peu ? »), bouton « Voir la réplique », note avec réplique + pourquoi + sortie polie, « nouvelles chaque mois » | Situation « Le soleil dans l'ascenseur », note « Gratuit, sans compte, avec pourquoi elle marche. Les autres situations du mois sont dans Premium, l'abonnement du site. » |
| B2 bloc de fin | A | B | Scène propre au bloc (50 vannes lues, la seconde qui compte, bouche contre téléphone), « Imagine » et « table qui rit » retirés, 4 contenus d'étape dans l'ordre, lien « Débloquer les 5 parcours, 2,99 €/mois », `[S9]` avec 2,08 €/mois | Scène « Imagine la table qui rit… », lien « Débloquer toute Répartie, 2,99 €/mois », `[S9]` du tour 3 |
| B18 lettre | A | B | Sous-titre avec une vraie vanne en exemple (numéro 3), ce qui la fait marcher, exercice « pour écrire la tienne », mention de Premium | Sous-titre du tour 3 sans exemple de vanne (aucun correctif factuel nécessaire : voir annexe §4) |
| B3 haut d'accueil | B | A | Lien « Débloquer les 5 parcours, 2,99 €/mois », note : « Ça se lit sans compte, quiz compris. » puis Premium, résiliation et garantie en une phrase, sans prix | Lien « Débloquer tous les parcours, 2,99 €/mois », note : Premium + prix, garantie, puis « L'étape 1 de Répartie se lit sans compte, quiz compris. » |
| B4 + B5 carte Premium | B | A | Titre « Et si ton « j'aurais dû dire » devenait un « j'ai dit » ? », `[S11]` en 2 phrases sans « table qui rit », `[S12]` « Ou 24,99 €/an (…). Prix TTC. », bouton « Débloquer les 5 parcours, 2,99 €/mois » | Titre « Et si le « j'aurais dû dire »… », `[S11]` de 5 phrases avec « La table qui rit », `[S12]` « Prix TTC, ou 24,99 €/an (…) », bouton « Débloquer tous les parcours, 2,99 €/mois » |
| B6 en-tête | A | B | « 2,99 €/mois » | « Voir les prix » |

## Éléments identiques dans A et B

- B18 : ligne repliée (« Une vanne gratuite par mois, et pourquoi elle marche. » + « Recevoir par e-mail »), titre du formulaire, champ, case, mention d'éditeur, bouton, note « Gratuit, sans compte. Désinscription en un clic. ».
- B3 : hero (titre, paragraphe, « 1 500+ membres », pastilles) et bouton « Tester mes premières répliques, gratuit ».
- B4 + B5 : les 4 avantages, `[S13]`, « Déjà 1 500+ inscrits, et toi ? », en-tête « Premium · 2,99 €/mois », bouton contour « Tester mes premières répliques, gratuit ».
- B2 : surtitre, titre, bouton « Tester mes premières répliques, gratuit ». B1 : `[S1]`, `[S3]`, `[S6]`.

## Règle de lecture

- Compter, par duel, les avis (3 relecteurs) sur A contre B ; l'envie de payer départage l'écriture.
- Objectif de Thomas : 10/10 chez les trois relecteurs. Règle d'or P0 s18 : un texte n'entre en ligne que s'il atteint le niveau. Si A et B sont sous le niveau, réécrire avec les « manque pour 10 » puis relire.
- B1 : A et B diffèrent par la situation montrée ET par la note. Si A gagne, on ne sait pas quelle part vient de la situation : à l'intérieur de A, la situation est le levier attendu (verdicts du tour 3). A n'est publiable que si la situation offerte du mois est un chambrage (annexe §5).
- B6 : le duel tranche « prix en chiffres » contre « mot qui annonce la page ». Si B (« Voir les prix ») gagne, on garde le libellé du tour 3. Si A gagne, on le met en test sur le trafic réel (annexe §6).

## Sources des faits nouveaux de ce tour

Chemins relatifs à `/home/user/Marrant/`. Sources des tours précédents : `docs/copy/cta-s21/tour3/cles-pack12-tour3.md`.

| Fait | Source |
|---|---|
| Situation « Le premier rendez-vous silencieux » : « Premier rendez-vous dans un restaurant, au dessert, tu viens de prononcer ta troisième phrase de la soirée. » ; ce qu'on te dit « Tu parles toujours aussi peu ? » ; réplique, sortie polie, exercice | `apps/web/src/data/carnet/2026-10.json` l. 160-169 (fiche `2026-10-15`, contexte `couple`) |
| Situation offerte actuelle : « Le soleil dans l'ascenseur » (fiche `2026-10-01`, contexte `quotidien`) | même fichier l. 6-16 |
| Ordre des fiches : « rangées de la moins tendue à la plus tendue » | même fichier l. 4 (`intro`) |
| Vanne d'exemple « J'ai pris un chien pour me faire des amis. Il en a plein. Moi, je tiens la laisse. » (numéro 3, statut VALIDE, envoi prévu 2027-01-07) | `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src/data/lettre/numeros.json`, numéro 3 |
| Exercices de la lettre : un exercice en 3 étapes avec exemple écrit dans les 6 numéros ; lecture à suivre (article dans 1, 2, 4, 5 ; étape 1 de parcours dans 3, 6) ; mention de Premium dans les 6 | même fichier, numéros 1 à 6 relus |
| 2,08 € par mois, 10,89 € économisés par an, prix | `config/premium.ts` (voir tour 3) |
| Garantie : formule `REASSURANCE_PAIEMENT` | `config/textes/offre.ts` l. 35-36 (voir tour 3) |
