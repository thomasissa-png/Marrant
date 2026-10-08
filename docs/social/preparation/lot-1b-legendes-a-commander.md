# Lot 1b : légendes de relais Instagram à commander (@copywriter)

> @fullstack, 08/10/2026. Source : dry-run 1b, révision 3 (`lot-1b-dry-run-08-10.md`), sorties dans `/tmp/fs-1b-v3/`, hors dépôt. Ces 5 relais Instagram sont les **seules erreurs restantes du lot 1b** (0 erreur de mix). Rien n'a été inséré ni déployé.

## Ce qui est commandé

5 légendes « À envoyer à... » pour 5 relais Instagram, une par vanne tirée. Chaque légende est écrite pour **cette vanne-là** (la légende reste attachée à la vanne dans `social-lot-v5-legendes.ts`), puis passe à la relecture à l'aveugle (barre des légendes, 2 relecteurs) avant versement.

**Longueur** : la légende d'un relais compte le renvoi « lien en bio » dans ses 80 caractères (`ecartsLegende`, R3). Le script ajoute lui-même le renvoi, après une espace. La colonne « Max » donne la longueur maximale de la partie « À envoyer à... » (80 moins le renvoi, moins l'espace), en caractères, ponctuation et espaces compris.

| Relais IG | Article relayé | Vanne tirée (id) | Texte de la vanne (cartes 1 et 2) | Renvoi ajouté par le script | Max |
|---|---|---|---|---|---|
| lun. 19/10 | `humour-en-colocation-desamorcer-tensions` | `cs14jkd9058d03e24961004a` | « Un mec a filmé tout le concert devant moi, téléphone en l'air. J'ai suivi le concert sur son écran. » / « À la fin, il m'a demandé si c'était bien. » | « Les autres exemples : lien en bio. » (34) | **45** |
| jeu. 29/10 | `premier-message-drole-appli-de-rencontre` | `cs14jk29357d022f6880a69e` | « Pendant que j'étais aux toilettes, mon date a remonté tout mon Instagram. » / « Elle m'a demandé pourquoi j'avais eu un bouc. » | « Les autres exemples : lien en bio. » (34) | **45** |
| jeu. 05/11 | `blagues-de-couple-drole` | `cs14jkbc3334e2de46753dcf` | « Au théâtre, l'acteur s'est arrêté au milieu d'une phrase. Silence de deux minutes. » / « Le monsieur devant moi a dit « c'est puissant ». » | « Les 30 vannes : lien en bio. » (28) | **51** |
| lun. 09/11 | `chambrer-sans-blesser-entre-potes` | `cs14jk4f97079b992f85eeb1` | « Mon ex est venue nous dire bonjour pendant mon rendez-vous. Mon date lui a demandé si elle avait des conseils. » / « Elle avait une liste. » | « Les autres exemples : lien en bio. » (34) | **45** |
| jeu. 12/11 | `voeux-drole-nouvelle-annee` | `cp0465e601e49c114994d1a00` | « Mon père m'a dit qu'il fallait que je « fasse mes preuves ». » / « J'ai sorti mon justificatif de domicile : c'est chez lui. » | « Les 27 messages : lien en bio. » (30) | **49** |

Toutes ces vannes sont des vannes du catalogue tirées « du même thème » que l'article (aucune ligne de l'article disponible) : elles ne viennent pas de l'article relayé.

## Contraintes (contrôlées par le script)

- « À envoyer à » en tête, sans lien ni renvoi (le script l'ajoute), zéro tiret cadratin, pas de « je » hors guillemets (R6).
- Tournure : jamais la même deux jours de suite sur Instagram (corrections-cycle7-copy.md §3). Légendes IG voisines dans le dry-run : 20/10 « À envoyer à qui ne sait jamais où dîner. », 28/10 « À envoyer à qui a ton chargeur depuis la fac. », 30/10 « À envoyer à celui qui planifie le costume avant le deuxième rendez-vous. », 04/11 « À envoyer à celui qui adore les gadgets. », 06/11 « À envoyer à ton ami qui demande au serveur ce qu'est une émulsion. », 10/11 « À envoyer à ton manager qui signe tout « Cordialement ». », 13/11 « À envoyer à ton ami qui ne demande jamais son chemin. ».
- « copain / copine » : déjà 3 fois la semaine du 19/10 (plafond 2 [HYPOTHÈSE]) : à éviter dans la légende du 19/10.

## Point de vigilance avant d'écrire

Le 1b sera régénéré après l'insertion du lot 1a (09/10). Les vannes du 1a sortiront alors du tirage et **les vannes de ces 5 relais peuvent changer** (la cascade du tirage l'a déjà fait deux fois). Relancer le dry-run 1b après l'insertion du 1a et vérifier les 5 ids ci-dessus **avant** de lancer l'écriture ; une légende écrite pour une vanne qui n'est plus tirée n'est pas reprise.
