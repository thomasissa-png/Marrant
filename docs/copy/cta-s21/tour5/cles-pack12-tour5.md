# Clés de tirage des duels CTA s21, tour 5, packs 1 et 2 (ne jamais transmettre aux relecteurs, ni copier dans le pack)

> « A » = le gagnant du tour 4 poli avec les « manque pour 10 » des 3 verdicts et les consignes de Thomas. « B » = le gagnant du tour 4 tel quel (B1, B2, B18, B3 : le texte A du tour 4 ; B4 + B5 : le texte B du tour 4, soit le texte 1 du pack tour 4 ; B6 : « 2,99 €/mois »). Critère unique : l'envie de payer (choix de Thomas du 18/10). Le pack 3 n'est pas traité ici.

**Tirage** (pas de générateur aléatoire disponible) : les caractères 9 à 20 de l'identifiant de session (`01Ny4UaXcj6i1VwL3T1j7rJZ`) ont servi aux tours 3 et 4. Pour le tour 5 : caractères 21 à 24 (`7 r J Z`), puis 1 et 2 (`0 1`), dans l'ordre B1, B2, B18, B3, B4 + B5, B6. Pair = A en Texte 1, impair = A en Texte 2. Codes : 7 = 55 (impair), r = 114 (pair), J = 74 (pair), Z = 90 (pair), 0 = 48 (pair), 1 = 49 (impair). Résultat : 4 duels avec A en Texte 1, 2 avec A en Texte 2. Tranche avant l'écriture des textes, indépendante de leur qualité.

| Bloc | Texte 1 | Texte 2 | A (poli) | B (gagnant du tour 4 tel quel) |
|---|---|---|---|---|
| B1 encart milieu | B | A | `[S7]` : « Gratuit, sans compte : la réplique, pourquoi elle marche et quoi dire si ça se tend. Et chaque mois, de nouvelles situations dans Premium, l'abonnement du site. » | `[S7]` : « … une sortie polie si ça se tend. Les autres situations, nouvelles chaque mois, sont dans Premium, l'abonnement du site. » |
| B2 bloc de fin | A | B | `[S5']` en 5 phrases courtes, « la bonne vanne » nommée, « la vanne tombée à plat qui devient une deuxième chance », défi « en vrai ou à l'écrit » | `[S5']` du tour 4 (une phrase longue d'étapes, « la bonne » sans nom, « rebondir quand une vanne tombe à plat ») |
| B18 lettre | A | B | « Un e-mail par mois, avec une vanne comme celle-ci : … Puis ce qui la fait marcher, et un exercice en trois étapes pour écrire la tienne, exemple à l'appui. … » | « Ça donne, par exemple : … Tu reçois aussi … avec son exemple. … » |
| B3 haut d'accueil | A | B | `[S20]` : « Tes premières répliques se lisent sans compte, quiz compris. La suite est dans Premium, … » | `[S20]` : « Ça se lit sans compte, quiz compris. La suite est dans Premium, … » |
| B4 + B5 carte Premium | A | B | Titre « ton », `[S11]` en 3 phrases (scène + sujet « Chaque parcours » + correspondance), `[S12]` « Ou 24,99 €/an (…). Prix TTC. », bouton « les 5 parcours » | Titre « le », `[S11]` de 4 phrases avec « sans compte, quiz compris », `[S12]` « Prix TTC, ou … », bouton « tous les parcours » |
| B6 en-tête | B | A | « Voir les prix » | « 2,99 €/mois » |

**B6, attention à la lecture des colonnes** : il n'y a rien à « polir » dans un libellé de 12 caractères. Le duel est le duel final demandé par Thomas : A = « Voir les prix » (l'autre libellé), B = « 2,99 €/mois » (gagnant du tour 4). Le tirage place A en Texte 2.

## Éléments identiques dans A et B

- B1 : `[S1]`, `[S2]` (la situation du rendez-vous, déjà jugée 8 par les trois), `[S3]`, `[S6]`.
- B2 : surtitre, titre, bouton, lien « Débloquer les 5 parcours, 2,99 €/mois », `[S9]` (R2 : « correct, je le laisse tel quel »).
- B18 : ligne repliée, titre du formulaire, champ, case, mention, bouton, note.
- B3 : hero, bouton plein, lien, fin de `[S20]` (la suite, Premium, résiliation, garantie).
- B4 + B5 : en-tête « Premium · 2,99 €/mois », les 4 avantages, bouton contour, `[S13]`, « Déjà 1 500+ inscrits, et toi ? », première phrase de `[S11]` (la scène).

## Règle de lecture

- Compter, par duel, les avis (3 relecteurs) sur A contre B ; l'envie de payer départage l'écriture. Objectif : 10/10 chez les trois. Règle d'or P0 s18 : un texte n'entre en ligne que s'il atteint le niveau ; sinon, retour aux « manque pour 10 ».
- **Si B gagne un duel** : on branche B tel quel (c'est le gagnant du tour 4). `textes-finaux-12.md` donne les textes A ; les textes B sont dans les clés ci-dessus et dans le pack tour 4.
- **B6** : si « Voir les prix » (A) gagne, on le garde. Si « 2,99 €/mois » (B) gagne, on le met en test sur le trafic réel (annexe §5). « C'est combien ? » est une piste d'annexe, hors duel.
- **B4 + B5, risque de duel serré** : A et B partagent la scène et le bouton contour ; les écarts sont le titre, la longueur de `[S11]`, `[S12]` et le bouton plein.

## Sources des faits nouveaux de ce tour

Aucun fait nouveau. Faits de `docs/copy/cta-s21/tour4/cles-pack12-tour4.md` (carnet `apps/web/src/data/carnet/2026-10.json`, lettre `numeros.json`, `config/premium.ts`, `config/textes/offre.ts`). Nouvelles formulations vérifiées contre les faits vrais du pack : « en vrai ou à l'écrit » (le défi se tente dans la vie ou à l'écrit), « la vanne tombée à plat qui devient une deuxième chance » (conseil « Savoir rebondir sur un raté »), « quoi dire si ça se tend » (la sortie polie de la fiche).
