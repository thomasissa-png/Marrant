# Lot 1b (19/10 au 15/11/2026) : commande de textes du repli du mix (@copywriter)

> @fullstack, 08/10/2026. Source : dry-run `--lot relance-s15 --pool strict --debut 2026-10-19 --fin 2026-11-15` (sorties `/tmp/fs-mix/1b-new.*`, hors dépôt, lectures Neon en SELECT seulement), avec `textes-formats-valides.json` vide. Règles : `docs/social/mix-formats-s15.md` §2 (ordre), §4 (barres), §6 (plafonds) ; [CHOIX UTILISATEUR] du 06/10 (barre Alexa intacte, cadence 5/5/2 tenue par les autres formats). Rien n'a été inséré ni déployé.

## Ce que dit le dry-run

33 posts posés (X 14, Instagram 14, LinkedIn 5), **18 erreurs** contre 22 avant le mix :
- **13 « repli du mix sans texte validé »** : les 13 cases sans vanne au niveau du 05/11 au 13/11. Elles remplacent les 17 erreurs de stock d'avant (une case de relais en comptait 2). Aucune case n'est omise : chacune attend un texte du fichier.
- **5 légendes Instagram** (hors mix, inchangées) : voir la fin du document.

Les 33 posts déjà posés sont identiques à ceux du dry-run d'avant le mix (seules les lignes d'erreur changent).

## Les 13 textes à fournir (dans `docs/social/preparation/textes-formats-valides.json`)

Ordre de service du script : mardis et vendredis d'abord, puis les autres jours. Le format « à défaut » sert si le premier manque.

| Créneau | Réseau | Format attendu | À défaut | Contexte de la case |
|---|---|---|---|---|
| jeu. 05/11 08:15 | LinkedIn | relais LinkedIn à angle travail | aucun (jamais de conseil sur LinkedIn) | 2e relais de la semaine (le 03/11 relaie déjà la visio du 02/11). Articles de 7 jours au plus : `humour-en-visio-reunion-en-ligne` (02/11, thème bureau), `blagues-de-couple-drole` (05/11), `premier-message-drole-appli-de-rencontre` (29/10) : ces deux derniers avec `"angleTravail": true` |
| ven. 06/11 12:30 | X | conseil | ligne d'article notée | vendredi conseil (plan §3) |
| ven. 06/11 19:30 | Instagram | conseil | ligne d'article notée | vendredi conseil (plan §3) |
| lun. 09/11 12:30 | X | conseil | ligne d'article notée | relais de `chambrer-sans-blesser-entre-potes` sans ligne au niveau : conseil du même réseau (mix §2) |
| lun. 09/11 19:30 | Instagram | conseil | ligne d'article notée | idem |
| mar. 10/11 12:30 | X | conseil | ligne d'article notée | mardi conseil |
| mar. 10/11 19:30 | Instagram | conseil | ligne d'article notée | mardi conseil |
| mar. 10/11 08:15 | LinkedIn | relais LinkedIn à angle travail | aucun | articles de 7 jours au plus : `chambrer-sans-blesser-entre-potes` (09/11), `blagues-de-couple-drole` (05/11), tous deux avec `"angleTravail": true` ; la visio (02/11) a 8 jours, elle est exclue |
| jeu. 12/11 12:30 | X | conseil | ligne d'article notée | relais de `voeux-drole-nouvelle-annee` sans ligne au niveau |
| jeu. 12/11 19:30 | Instagram | conseil | ligne d'article notée | idem |
| jeu. 12/11 08:15 | LinkedIn | relais LinkedIn à angle travail | aucun | mix §6 : « jeu relais vœux [angle à vérifier] » : `voeux-drole-nouvelle-annee` (12/11) avec `"angleTravail": true`, ou `chambrer-sans-blesser-entre-potes` (09/11) |
| ven. 13/11 12:30 | X | conseil | ligne d'article notée | vendredi conseil (plan §3) |
| ven. 13/11 19:30 | Instagram | conseil | ligne d'article notée | vendredi conseil (plan §3) |

**Total : 5 conseils X, 5 conseils Instagram, 3 relais LinkedIn.** Semaine du 09/11 : 8 conseils, soit le plafond (mix §2) ; aucun de plus ne passerait, la case suivante attendrait une ligne d'article notée. Le 11/11 est un silence.

## Contraintes vérifiées par le script (une entrée non conforme bloque le lot)

Communes : `id` unique (minuscules, chiffres, tirets), `notes` des 2 relecteurs à l'aveugle, `source` (document de notation). Chaque texte ne sert qu'une fois, ni rejoué dans le lot ni repris s'il est déjà en base.

- **Conseil X** (`"format": "conseil", "reseau": "TWITTER"`) : `texte` exact, 270 caractères au plus comptés par X, sans lien ; technique nommée en 4 mots, situation concrète puis réplique ou geste, chute courte (mix §4) ; tutoiement, sans tiret cadratin, sans « je » hors « » (R6). Notes : 8 au moins chez les 2 `[HYPOTHÈSE de mix §4]`.
- **Conseil Instagram** (`"reseau": "INSTAGRAM"`) : `cartes` (exactement 2, format 4:5) et `legende` « À envoyer à... » de 80 caractères au plus, sans lien ni « deviens-marrant » ([CHOIX UTILISATEUR] du 05/10). Les légendes des étalons E4, E7 et E2 portent encore le pied `deviens-marrant.fr` et E2 ne commence pas par « À envoyer à » : à reprendre avant toute entrée.
- **Ligne d'article notée** (à défaut) : `article` (slug publié avant la case), `texte` (X) ou `cartes` + `legende` (Instagram), recopié mot pour mot de l'article ; notes 8,5 au moins chez les 2 ; `rang` si la ligne est numérotée `**N.**`. Clé `slug#rang` soumise au registre des 90 jours.
- **Relais LinkedIn** (`"format": "relaisLinkedIn", "reseau": "LINKEDIN"`) : `article`, `texte` SANS lien (le script ajoute le lien UTM en dernière ligne) ; R4 : 3 phrases au plus (2 de scène, 1 renvoi de 15 mots au plus), jamais la chute de l'article, tutoiement ; 1re ligne de 140 caractères au plus ; article publié depuis 7 jours au plus ; article de thème bureau, sinon `"angleTravail": true` (angle porté par le texte). 2 relais LinkedIn par semaine au plus.

## Exemple d'entrée (forme seulement, aucun texte réel)

```json
{ "id": "conseil-x-2026-11-06", "format": "conseil", "reseau": "TWITTER", "notes": [8.5, 8],
  "source": "docs/social/preparation/<résultat de l'aveugle>.md", "texte": "<texte exact>" }
```

## Hors mix : 5 légendes Instagram toujours attendues (`social-lot-v5-legendes.ts`)

- relais 19/10 (vanne `cs14jkd9058d03e24961004a`), relais 29/10 (`cs14jka7e683e43af915bb60`), relais 05/11 (`cp0465e601e49c114994d1a00`) : légende « À envoyer à... » de la vanne, à placer avant le renvoi « lien en bio » ;
- vanne du 03/11 (`cs14jk76ca7ad32cce9041ce`) et vanne du 04/11 (`cs14jk55b4243d4d1c132b97`).

## Points d'attention

- **Liste valable pour le dry-run du 08/10.** Le 1b sera régénéré après l'insertion du 1a ; une vanne de P0 ou de V1 (26/10) au niveau reprend sa case et rend le texte de repli au fichier, sans le consommer.
- **Non codé** : l'affectation des vannes au niveau à LinkedIn d'abord (mix §2, « 1) LinkedIn ») ; le script sert les cases dans l'ordre des dates, d'où les 3 relais LinkedIn ci-dessus. Le coder déplacerait des vannes de X et d'Instagram (03/11 au 06/11) vers LinkedIn et transformerait ces cases en conseils : décision de @social ou de l'orchestrateur.
- Répartition Yanis / Sophie des conseils (plan §3 : au moins 24 Yanis et 14 Sophie sur la période) : champ `persona` facultatif ; à suivre par @copywriter.
