# Fiche carrousel IG du mer. 21/10 19:30 (lot 1b), décision et texte

> Modèle : IG3 validé, `etalons-formats-sociaux-s15.md` §4. Règles : R2 (carte 3 = le mécanisme en une phrase, carte 4 = consigne + renvoi vrai au quiz), R3 (légende), R6 (cartes 1 et 2 entre « », une paire par ligne du catalogue, “ ” imbriqués ; cartes 3 et 4 sans guillemets), R9 (28 jours).
> Révision du 07/10 (cycle 8, C6) : mécanisme vérifié, cartes 3 et 4 réécrites sur la fiche, légende sans pied, renvoi au quiz sous garde. **Statut : cartes 3 et 4 et légende = textes neufs, non publiables avant relecture à l'aveugle** (`aveugle-textes-neufs-cycle8.md` : E2 = T06, E1 = T13, légende = T15).

## Décision : la vanne tirée est remplacée

`cmmnsqn15006kth63res9rqp9` (V007, « jeu de 120 Go ») **ne passe pas** :
1. **R9 non tenue** : le lot 1a la publie sur X le **ven. 16/10 10:30** (`lot-1a-dry-run-07-10.md` l.56), soit 5 jours avant le carrousel, pour 28 exigés. Elle figure aussi en IG le 27/11 dans le dry-run long.
2. **Aucune fiche écrite** : V007 n'est dans aucun `decryptage-ecrit-*.json` (recherche « 120 Go », « téléchargement », « désinstall » : seule une consigne d'une autre fiche cite « désinstallé »). Écrire les cartes 3 et 4 sans fiche vérifiée contredit « décryptage vrai ».
3. Note 8,5 / 8,5 : au niveau, mais la chute (« On a fait le téléchargement ensemble ») est la plus douce du pool pour un carrousel qui doit se lire en 4 cartes.

**Remplaçante retenue : V028, `cmmnsqn130033th63b54ux45o`** (CULTUREL, 8,5 / 8,5, au pool strict). Texte du catalogue (01/10) :
« Mon père a vu mon appart. Il a dit “c'est pas mal”. » // « Je lui ai demandé de me le mettre par écrit. »

Conditions R9 : jamais publiée (absente de `lot-semaine0.json`, des 9 posts validés et du lot 1a) ; hors Noël, hors V060 et V083 (carrousels fixes). Conséquence : **exclure V028 du tirage pool** avant le 21/10, **pas de reprise sur X avant le 18/11** (28 jours après sa 1re diffusion) et pas de reprise sur Instagram avant le 19/01 (90 jours). Persona Yanis (appartement, père), aucun sujet sensible.

## Mécanisme vérifié (C6)

La fiche de décryptage de V028 existe : `docs/content/vannes-actives-s17.json` l.382-391 (export des vannes actives, s17). Technique : **« La litote prise au sérieux »** ; explication : « C'est pas mal » est une litote, elle dit peu pour laisser entendre beaucoup ; la vanne la traite comme un vrai compliment, assez rare pour être encadré ; l'humour vient de la valeur donnée à une phrase minuscule. Les cartes 3 et 4 ci-dessous reprennent cette idée, rien d'autre. `[À VÉRIFIER @fullstack]` un SELECT confirme que la base porte la même technique (l'export date du s17) ; si la base dit autre chose, la base prime et les cartes 3 et 4 se réécrivent.

## La fiche, 4 cartes et légende

- **Cartes 1 et 2 (R6)** : rien à saisir, le rendu les tire de la vanne. **Ligne 1 du catalogue** (« Mon père a vu mon appart. Il a dit “c'est pas mal”. », deux phrases) = **une seule paire « »**, avec retour à la ligne de césure après « appart. » ; **ligne 2** = une seconde paire sur la carte 2. C'est la règle écrite (`strategie-relance-v5.md` l.166 : « deux phrases dans une ligne = une paire »), et la même structure que IG3 (« J'ai découvert que… / J'ai boudé trois jours. », une paire). Le « / » de la version précédente de la fiche était un retour à la ligne, pas une seconde paire. `[À VÉRIFIER @fullstack]` sur la capture `slide=0` : une paire « » autour des deux phrases, “c'est pas mal” en “ ” imbriqués.
- **Carte 3** (28 mots) : Pourquoi ça fait rire : dire pas mal est un compliment minuscule, que le narrateur traite comme un éloge assez rare pour être encadré, donc à confirmer par écrit.
- **Carte 4** (34 mots, quiz compris ; 25 sans) : À toi de jouer : repense à un compliment tiède que tu as reçu, puis traite-le comme un éloge rare, avec la solennité qui va avec. Le quiz est dans le lien de la bio.
- **Légende** (48 caractères, sans pied) : À envoyer à celui qui attend un vrai compliment.

**Garde du renvoi au quiz (S8, `founder-preferences.md` l.67)** : la phrase « Le quiz est dans le lien de la bio. » ne part que si la pose du lien de bio Instagram est consignée à `mesure.md` §3 (colonne « Posé le » renseignée) **la veille, le 20/10**. Sinon : carte 4 = « À toi de jouer : repense à un compliment tiède que tu as reçu, puis traite-le comme un éloge rare, avec la solennité qui va avec. » (25 mots, la dernière phrase retirée), 4 `threadParts` au lieu de 5.

**Version précédente (cycle 7), gardée pour la relecture à l'aveugle (E1)** : carte 3 « Pourquoi ça fait rire : un père qui dit pas mal a atteint son maximum d'éloge, et le fils exige ce compliment par écrit, comme un diplôme. » ; carte 4 « À toi de jouer : repense à un compliment tiède que tu as reçu, puis demande poliment qu'on te le confirme par écrit. Le quiz est dans le lien de la bio. » ; légende « À envoyer à celui qui attend un vrai compliment. deviens-marrant.fr » (pied contraire à `founder-preferences.md` l.67). E2 (ci-dessus) remplace E1 si elle est au niveau chez les 2 relecteurs ; sinon E1 ne passe que si elle l'est aussi, et dans les deux cas **sans le pied**.

Contrôles : plafonds 30 et 35 mots tenus (28, 34) ; cartes 3 et 4 sans guillemets ; zéro tiret cadratin ; la légende ne dit ni la chute ni « par écrit » ; la consigne de la carte 4 applique la technique de la fiche (prendre au sérieux une phrase minuscule) au lieu de rejouer la vanne ; « Le quiz est dans le lien de la bio » est vrai seulement sous la garde ci-dessus ; légende non consécutive à une tournure « celui qui » (22/10 : « ton hôte d'anniversaire »), à relire au dry-run du lot 1b avec le 20/10.

## Points à vérifier avant insertion

- `[À VÉRIFIER @fullstack]` la colonne de décryptage de V028 en base (voir « Mécanisme vérifié »).
- Le créneau est « carte vanne à la place du carrousel » dans le dry-run : la vanne V007 repart au tirage normal (elle reste publiée le 16/10 sur X).
- Entrée prête à coller dans `FIXES` : voir `corrections-cycle8-copy.md`, section « À appliquer par @fullstack » (après la relecture à l'aveugle).
- Remarque hors périmètre, à traiter avec le lot 2b : le lot 1a place V083 (`cs14jka3336e7e90a453a9d6`) en IG le **mar. 13/10 17:30**, alors que `complements-lot-s15.md` §1 la donne au carrousel du 23/12 : 71 jours, sous les 90. Le carrousel du 23/12 a besoin d'une autre vanne.
