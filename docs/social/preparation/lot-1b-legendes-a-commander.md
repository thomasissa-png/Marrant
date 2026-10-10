# Lot 1b : légendes Instagram à commander (@copywriter)

> @fullstack, 10/10/2026. Source : dry-run 1b, **révision 4** (`lot-1b-dry-run-08-10.md`), lancé sur la base réelle **après l'insertion du lot 1a** (09/10). Sorties dans `/tmp/1b-0910.md` (JSON non écrit : erreurs bloquantes), hors dépôt. Rien n'a été inséré ni déployé. **Remplace la commande de la révision 3** : sur ses 5 relais, 3 n'ont plus de vanne (05/11, 09/11, 12/11) et les 2 autres ont changé de vanne. Ne rien écrire d'après l'ancienne liste.

## Ce qui est commandé

**4 légendes « À envoyer à... »**, une par vanne tirée : 3 relais Instagram et 1 vanne Instagram. Chaque légende est écrite pour **cette vanne-là** (elle reste attachée à la vanne dans `social-lot-v5-legendes.ts`), puis passe à la relecture à l'aveugle (barre des légendes, 2 relecteurs) avant versement.

**Longueur** : sur un relais, la légende compte le renvoi « lien en bio » dans ses 80 caractères (`ecartsLegende`, R3). Le script ajoute lui-même le renvoi, après une espace. La colonne « Max » donne la longueur maximale de la partie « À envoyer à... » (80, moins le renvoi, moins l'espace), en caractères, ponctuation et espaces compris. Sur une vanne simple (pas de renvoi), le plafond est 80.

| Case IG | Article relayé | Vanne tirée (id) | Texte de la vanne (cartes 1 et 2) | Renvoi exact ajouté par le script | Max « À envoyer à... » |
|---|---|---|---|---|---|
| lun. 19/10, relais | `humour-en-colocation-desamorcer-tensions` | `cs14jk76ca7ad32cce9041ce` (TGV) | « Dans le TGV, la seule prise qui marche est sous le siège d'un inconnu. » / « J'ai voyagé à genoux devant lui. On n'en a jamais parlé. » | « Les autres exemples : lien en bio. » (34) | **45** |
| mar. 20/10, vanne | aucun | `cs14jk29357d022f6880a69e` (bouc) | « Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagram. » / « Elle m'a demandé pourquoi j'avais eu un bouc. » | aucun | **80** |
| jeu. 29/10, relais | `premier-message-drole-appli-de-rencontre` | `cs14jkbc3334e2de46753dcf` (théâtre) | « Au théâtre, l'acteur s'est arrêté au milieu d'une phrase. Silence de deux minutes. » / « Le monsieur devant moi a dit « c'est puissant ». » | « Les autres exemples : lien en bio. » (34) | **45** |
| lun. 02/11, relais | `humour-en-visio-reunion-en-ligne` | `cs14jk4f97079b992f85eeb1` (l'ex et sa liste) | « Mon ex est venue nous dire bonjour pendant mon rendez-vous. Mon date lui a demandé si elle avait des conseils. » / « Elle avait une liste. » | « Les autres exemples : lien en bio. » (34) | **45** |

Notes par case :
- **19/10** : la vanne a déjà une légende, **L12** (« À envoyer à ta sœur, qui demande toujours si t'as un câble. », 59 caractères, 9 / 9), écrite pour une case de vanne sans renvoi. Sur ce relais, elle fait 59 + 1 + 34 = **94 > 80** : 2 erreurs au dry-run (« trop long », « légende de 94 caractères »). Il faut une version courte, 45 au plus. Elle remplacera L12 dans `social-lot-v5-legendes.ts` (une seule légende par vanne ; la TGV n'est tirée nulle part ailleurs dans le 1b).
- **20/10** : la case n'est pas un relais. C'est une vanne IG simple, et la légende manque (« légende manquante pour la vanne cs14jk29357d022f6880a69e »). Elle est ajoutée ici parce que la cascade l'a fait apparaître (la même vanne était le relais du 29/10 en révision 3).
- **29/10 et 02/11** : aucune légende pour ces vannes. Le script écrit le renvoi seul, d'où l'erreur « légende sans « À envoyer à » en tête ».
- Ces 3 vannes de relais sont des vannes du catalogue tirées dans le même thème que l'article, faute de ligne de l'article disponible. Elles ne viennent pas de l'article relayé.

## Légendes voisines et tournures interdites

Règle (corrections-cycle7-copy.md §3, `tournure()`) : jamais la même tournure deux jours de suite sur Instagram. Tournures suivies : « celui qui », « celle qui », « ceux qui », « qui », « ton/ta/tes » ; tout le reste compte comme « autre », sans contrainte.

| Case | Légende IG précédente | Légende IG suivante | À éviter |
|---|---|---|---|
| 19/10 | ven. 16/10 (lot 1a, en base) : « À envoyer à ta mère, qui t'avait dit de surveiller le four. » (ton/ta) | mar. 20/10 : à écrire (bouc) | ton/ta, et la tournure choisie pour le 20/10 |
| 20/10 | lun. 19/10 : à écrire (TGV) | mer. 21/10 : « À envoyer à qui a déjà décroché un « pas mal » et l'a gardé précieusement. » (qui) | « qui », et la tournure choisie pour le 19/10 |
| 29/10 | mer. 28/10 : « À envoyer à ton homonyme. » (ton/ta) | ven. 30/10 : « À envoyer à celui qui planifie le costume avant le deuxième rendez-vous. » (celui qui) | ton/ta, celui qui |
| 02/11 | ven. 30/10 : « À envoyer à celui qui planifie le costume avant le deuxième rendez-vous. » (celui qui) | mar. 03/11 : « À envoyer à la collègue qui répond « absolument » à tout. » (autre) | celui qui |

Autres légendes IG du 1b pour l'anti-répétition : 22/10 « À envoyer à ton hôte d'anniversaire. », 23/10 « À envoyer à ton ami qui part en camping malgré la météo. », 26/10 « À envoyer à qui t'a fait lire son roman. », 27/10 « À envoyer à ton tuteur de stage. », 06/11 « À envoyer à ton ami qui demande au serveur ce qu'est une émulsion. », 10/11 « À envoyer à ton manager qui signe tout « Cordialement ». », 13/11 « À envoyer à ton ami qui ne demande jamais son chemin. ».

## Contraintes (contrôlées par le script)

- « À envoyer à » en tête, sans lien ni renvoi (le script l'ajoute), zéro tiret cadratin, pas de « je » hors guillemets (R6), pas de « deviens-marrant ».
- L'alerte « copain » 3 fois dans la semaine du 19/10 a disparu en révision 4 : il ne reste qu'un « copain », dans le X du 20/10. Éviter quand même d'en ajouter un le 19/10 ou le 20/10.

## Hors commande de légendes : 7 cases vides

Le tirage n'a plus de vanne pour **04/11 IG, 05/11 X et IG, 09/11 X et IG, 12/11 X et IG** (« repli du mix sans texte validé »). Stock éligible : 15 vannes, 0 repli en réserve. Il n'y a donc pas de vanne à légender sur ces cases. Il faut des textes (lignes d'article notées, carrousel R9 pour le 04/11) ou un élargissement du pool : à trancher, voir `lot-1b-dry-run-08-10.md`, révision 4. **Si le pool est élargi ou si de nouveaux textes sont versés, le tirage des 4 cases ci-dessus peut changer** (la cascade l'a déjà fait trois fois) : relancer le dry-run et revérifier les 4 ids avant de verser une légende.
