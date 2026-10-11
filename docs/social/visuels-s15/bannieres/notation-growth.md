# Notation growth des bannières s15, cycle 1 (06/10/2026)

> @growth. Lu : `index.md`, les 8 PNG ouverts un par un, bios (`corrections-cycle7-copy.md` §5, signées le 06/10 : IG 1, X 2, LinkedIn 2), `strategie-relance-v5.md` §1 et §2, `founder-preferences.md`. Test : en 2 secondes, une raison de suivre et un chemin vers le site.
> Unit economics : budget 0 €, CAC direct nul, effet lu à J+28 (`mesure.md`). `[HYPOTHÈSE : une bannière plus claire augmente le taux d'abonnement par visite de profil ; relever visites de profil et abonnés avant/après dans X Analytics et LinkedIn]`

## Notes et choix

| Visuel | Note | Verdict |
|---|---|---|
| X A message | 8 | **Retenue.** Promesse lisible (22 px sur mobile), mais aucun appel : l'adresse du pied tombe à 8-11 px et le quiz n'apparaît nulle part |
| X B vanne | 7 | Écartée. Prouve le ton, mais vanne à 12 px sur mobile, figée, exposée en permanence ; la page répète déjà la preuve (post épinglé, fil) |
| LinkedIn A noir | 7 | Écartée. 15 px sur mobile, pied à 8 px illisible, monogramme redondant avec le logo de la page |
| LinkedIn B aplat | 8 | **Retenue.** 19 px sur mobile, promesse puis quiz, même aplat que les couvertures Instagram |
| Instagram Quiz | 9 | Entrée de conversion, à placer en premier |
| Instagram Conseils | 9 | Claire, hors défaut visuel |
| Instagram Vannes | 8 | Picto lisible comme « précédent / suivant » à 60 px |
| Instagram Bureau | 6 | Thème de Sophie (LinkedIn), hors cible Instagram (Yanis) |

**Règles : toutes passent.** Aucun prix, aucun compte gratuit (« sans inscription » vaut pour le quiz, vérifié FAQ), aucun tiret cadratin, aucune IA, aucun « je » de marque (le « Ma mère » de X B est une vanne entre « »). Cohérence bios : les 3 bannières reprennent la promesse des bios (« une vanne par jour pour devenir plus drôle » ; « des vannes pour le bureau, un quiz pour ton profil d'humour »). La répétition bannière + bio est voulue : la bio fait 13 px sur mobile.

**Appel sur la bannière ? Oui, léger, sur X et LinkedIn ; non sur Instagram.** Aucune bannière n'est cliquable : l'appel ne sert qu'à nommer le quiz (le chemin le plus court vers la valeur, sans compte, environ 2 minutes) et à pointer le lien de la bio ou le bouton de la page. Pas d'URL longue, pas de flèche, pas de « lien en bio ». Sur Instagram, le cercle de 60 px ne porte aucun texte lisible : l'appel va dans la story.

## Corrections exécutables

**X A (8 vers 10)** : le message ne change pas. Dans le pied, retirer le monogramme (la photo de profil le porte, et agrandi il tomberait dans la zone photo x 0-400) et l'adresse (le lien est dans la bio). Poser à la place une seule ligne, alignée à droite (fin x 1388, y 350 à 410), Inter 52 px, gris `#D4D4D4` : « Quiz d'humour, sans inscription. » (mobile : 13 px). Contrôle : la ligne commence après x 580, hors zone photo et hors recadrage.

**X B (7)** : si Thomas la préfère malgré tout : vanne à 56 px, message à 2 lignes, même ligne « Quiz d'humour, sans inscription. » en pied, et sortir `cs14jk90226d6abb90287724` de tous les lots (une bannière compte comme publication sous la règle des 90 jours).

**LinkedIn B (8 vers 10)** :
1. Sous-titre : « Fais le quiz de ton profil d'humour. » (impératif, tutoiement, remplace « Un quiz pour ton profil d'humour. »), 38 px au lieu de 32, `#DDD6FE` inchangé. Largeur environ 710 px, tient dans x 300 à 1108.
2. Titre « Des vannes pour le bureau. » inchangé (54 px, blanc). Recentrer les deux lignes verticalement, marge haut et bas d'au moins 20 px. Ni pied ni URL.
3. Bouton de la page : « Visiter le site web » vers `/liens/li` (route prévue, UTM `linkedin`). Durée et « sans inscription » restent dans la tagline signée. `[À VÉRIFIER dans l'interface LinkedIn : boutons personnalisables]`
**LinkedIn A (7)** : non retenue, aucune correction demandée.

**Instagram** (lignes de pied : un seul geste de Thomas, pas de tâche hebdomadaire ; Instagram demande des stories publiées avant tout classement à la une, `[À VÉRIFIER : Buffer ne gère pas les stories à la une]`) :
- **Bureau (6) : ne pas poser.** Créer `instagram-alaune-repartie.png`, même gabarit : libellé « Répartie » blanc 132 px, picto de deux bulles de dialogue en tracé (même épaisseur que l'ampoule, `#DDD6FE`, 400 px de large, centré en 540, 960). Raison : la répartie est la promesse n°1 du site (parcours Répartie, bloc 4 de `/liens`) et la douleur de Yanis ; aucune couverture actuelle ne mène au parcours, le produit.
- **Vannes (8)** : rapprocher « et » (écart de 84 px à 30 px, largeur totale de 440 à 360 px) pour qu'ils se lisent comme une paire de guillemets, pas comme deux flèches.
- **Quiz (9)** : PNG validé. Pour 10 : placer en 1re position (ordre : Quiz, Répartie, Vannes, Conseils) et y mettre une story avec sticker lien `https://deviens-marrant.fr/quiz-humour?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=bio-quiz` (valeur déjà en liste blanche), texte « Quel est ton profil d'humour ? Environ 2 minutes, sans inscription. »
- **Conseils (9)** : PNG validé. Pour 10 : contenu = 3 cartes conseils déjà publiées, aucune création, aucun lien.

## Handoff @orchestrator
- Fichier : `/home/user/Marrant/docs/social/visuels-s15/bannieres/notation-growth.md`. Décisions : X = A + ligne quiz ; LinkedIn = B + sous-titre impératif + bouton de page ; Instagram : Bureau remplacé par Répartie, Quiz en premier avec sticker lien.
- À faire par @design (3 PNG : X A, LinkedIn B, Répartie ; Vannes retouchée) puis re-notation cycle 2.
