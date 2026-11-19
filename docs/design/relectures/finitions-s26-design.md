# Relecture design à l'aveugle, finitions s26 : La lettre, Profil, Vannes

Périmètre : lot de finitions (commit `8fd26733`) sur `/lettre` (inscription + archive de l'abonné), `/profil`, `/vannes`. Sources : captures `docs/captures/s26/finitions/{lettre,profil,vannes}/` (lues : lettre gratuit 375 et 1280, archive en-cours 375 et 1280, profil en-cours 375 et 1280, vannes en-cours 375, 768, 1280) et code des composants (`lettre-inscription.tsx`, `lettres-abonne-cartes.tsx`, `archive-lettres.tsx`, `lettre-page-ouverte.tsx`, `supprimer-compte-card.tsx`, `list-pagination.tsx`, `button.tsx`). `git show` n'était pas exécutable dans cette session (pas de shell) : le diff n'est pas relu, le code actuel l'est. Sortie de `tailles.mjs` non fournie dans le prompt : pas de comptage mesuré cité, la gate typo n'est donc évaluée que sur le code (ci-dessous) et aucune note n'atteint 10.

## Verdict sur les finitions demandées

| Finition | Verdict | Preuve |
|---|---|---|
| Contour du champ e-mail #707070 | Juste. 3,33:1 sur la carte (seuil 3:1 WCAG 1.4.11), focus violet 2 px conservé. | `CHAMP_EMAIL_OUVERT` : `border-border-input`, `h-12`, `px-4` (16). |
| Indication #B3B3B3 | Juste (7:1, même gris que le texte courant). | `placeholder:text-text-secondary`. |
| Marges 16 px du formulaire | Justes : champ vers case `gap-4`, case vers bouton `gap-4`, label vers champ `mt-2`. Case 24 px dans un libellé `min-h-11` (44 px). | `echelleEspace`. |
| Mention sous le bouton | **Non faite** : reste `text-xs text-text-muted` (12 px, troisième gris). Voir faute 1. | `lettre-inscription.tsx` ligne 316 (`<p className="mt-2 text-xs text-text-muted">`), aucune branche `echelleEspace`. |
| « Supprimer mon compte » | Cible 44 px (`h-11`), contour rouge 1 px, texte `text-error-text`, aligné à gauche : juste. Taille rendue **14 px** (`Button size="sm"` = `text-sm`, `BOUTON_SUPPRIMER_OUVERT` n'ajoute aucun `text-base`) : dans l'échelle, mais l'annonce « 16 px » est inexacte. | `supprimer-compte-card.tsx` l. 32, `button.tsx` l. 33. |
| Pagination 44 x 44 dès 768 | Juste : `cibles44` ajoute `md:h-11 md:min-w-11` aux numéros et à Précédent/Suivant ; sous 768 `max-md:h-11 w-11` déjà là ; capture 768 et 1280 : cellules carrées, page courante en seul aplat violet. | `list-pagination.tsx` l. 39, 68-69. |
| Chevrons des tuiles d'archive | Justes : SVG 16 px, `text-text-secondary` (#B3B3B3, 7:1 sur carte, > 3:1 non-texte), centré en hauteur (`items-center`), à droite avec `gap-4`, lien étiré sur toute la tuile (cible = la tuile entière, 44 px largement dépassés). | `lettres-abonne-cartes.tsx` l. 17-26, captures 375/1280. |
| Texte des cartes de Profil | Cohérent : texte courant en `text-text-secondary`, valeurs (« Formule mensuelle », « Mes questions », nombres) en blanc. Un seul écart assumé : l'encart d'avertissement d'abonné reste en blanc `text-text-primary` (encadré ambre, signal). | captures 375/1280. |

## La lettre (formulaire d'inscription + archive)

Formulaire : carte neutre, titre blanc à gauche, un seul plein violet (« Envoie-moi la lettre »), colonne sticky (`lg:sticky lg:top-36`) donc le vide sous le formulaire à 1280 (visible en pleine page, environ 2 000 px) n'en est pas un à l'écran. Rythme au pas de 8 vérifié au code sauf la mention et les messages d'erreur. Contraste du champ désormais conforme. Case à cocher native 24 px : alignement 2 px sous le centre de la première ligne (décision documentée dans le code, non notée).

Archive (abonné) : tuile de tête en `TITRE_CARTE` 20/600 + objet 16/400, précédentes en 3/2/1 colonnes (`gap-6`, `p-6`, `mt-12` entre bloc de tête et grille), titre 16/600 + objet 14/400, chevrons alignés et identiques sur les deux types de tuile. À 1280 la grille 3 colonnes ne contient qu'une tuile (389 px, 800 px vides à droite) : acceptable pour 2 lettres, la rangée se remplira.

Fautes dures chiffrables :
- **F1.** Mention d'information sous le bouton (« Gratuit, sans compte… Confidentialité ») : **12 px** (`text-xs`) en `text-text-muted`. Hors de l'échelle 14/16/20/24 (le brief rend tout élément hors échelle faute dure) et troisième gris de texte alors que la finition demande deux niveaux (blanc, #B3B3B3) ; c'est la seule ligne du formulaire que le lot n'a pas rattrapée, visible sur toutes les captures `*-lettre-*` sous le bouton. Fichier : `apps/web/src/components/lettre/lettre-inscription.tsx` l. 316. Correction codable : `className={echelleEspace ? META_mention : "mt-2 text-xs text-text-muted"}` avec `META` de `typo.ts` (`text-sm text-text-secondary`), `mt-2` conservé ; le lien garde sa zone tactile (`after:-inset-y-3`).

Pistes (2 max) :
1. Messages d'erreur du formulaire (`erreur === "email"/"case"`) : `mt-1` (4 px, pas interdit au rythme de 8) et `text-sm text-error-text` : passer à `mt-2` quand `echelleEspace` (l. 253 et 280). Non visible sur les captures (états d'erreur non capturés).
2. Tuile de tête de l'archive : bordure et dégradé violets (`CARTE_ACTION`), identiques à « Reprendre ton parcours » de Profil. Cohérent entre pages, non noté ; à confirmer par Thomas si « un seul accent violet » doit aussi couvrir ce filet (la spec s25 §2.1 le déclarait neutre).

Note : formulaire 8/10 (faute 1), archive 9/10. Globale = minimum.

## Profil

Page en 8/4 colonnes à 1280, pile à 375 : cohérente avec Aujourd'hui. Cartes à `p-6`, titres 20/600, textes 14/400 gris secondaire homogènes (Abonnement, Rappel, Lettre de la semaine, Prénom, question à l'équipe), valeurs en blanc 600. Carte « Supprimer mon compte » en pleine largeur sous un filet, texte à `max-w-prose` (décision de tour 3, non notée), action sous le texte alignée à gauche, cible 44 px. Un seul plein violet (« Reprendre l'étape 3 »). Aucune faute dure chiffrable trouvée au code ni sur les captures.

Pistes :
1. 1280 : sous « Mes parcours » la colonne de gauche s'arrête à environ 1 060 px, la colonne de droite à environ 1 353 px : un vide d'environ 295 px de haut sur 800 px de large avant le filet de la carte de suppression. Piste : placer « Ton prénom » ou « Ta question à l'équipe » dans la colonne de gauche (`profil/page`, ordre du DOM à vérifier avec @ux) pour équilibrer à 20 px près.
2. Contour du sélecteur « Jour du rappel » et du champ « Ton prénom » : le champ e-mail de /lettre est passé à #707070 (3,33:1), pas ces champs (le sélecteur est quasi invisible sur la capture, grisé tant que le rappel est éteint, donc exempté). Pour le champ « Ton prénom » actif, aligner sur `border-border-input` via le composant `ui/input.tsx` (même risque WCAG 1.4.11 que celui corrigé sur /lettre).

Note : 9/10.

## Vannes

Pagination : Précédent / 1..8 / Suivant, cellules 44 x 44 à 768 et 1280, grille régulière sous 768 (carrés 44 px centrés, chevrons bordés), page courante en aplat violet (le seul de la liste, les puces de filtre sont des contours blancs), `mt-8` du bloc de cartes puis 48 px avant le filet des questions fréquentes : rythme tenu. Cartes 3/2/1 colonnes à hauteurs égales dans la rangée, titres 14/600 « Révéler la chute », aide 14/400. Aucune faute dure chiffrable trouvée.

Pistes :
1. Marges de la pagination hors pas de 8 : `md:mr-3` et `md:ml-3` (12 px) autour de Précédent/Suivant, `gap-1` (4) à partir de 768 et `gap-0.5` (2) sous 768 (`list-pagination.tsx` l. 113-118, 145). Piste : `md:mx-4` (16) et `md:gap-2` (8) ; les cibles restent à 44 px, l'espace entre elles passe de 4 à 8 px, plus lisible au doigt.
2. Icônes d'action des cartes (étoile, partage, flèche de la chute) : environ 30 à 33 px de diamètre estimés sur les captures 768 et 1280 (non mesurés au code, composant non relu car hors lot). Si confirmé sous 44 px en tactile, étendre la zone cliquable (pseudo-élément) comme pour la pagination.

Note : 9/10.

## Cohérence transverse

Gris de texte : #FFFFFF et #B3B3B3 partout sur les trois pages sauf F1 (muted) et les extrémités désactivées de la pagination (`text-text-muted`, fonctionnel). Rayons 12 px (cartes, champ, boutons), 1 px de bordure, aucune ombre. Un plein violet par écran. La finition au niveau de l'accueil est tenue ; la seule ligne qui trahit l'ancien système est la mention du formulaire.

NOTE GLOBALE La lettre : 8/10
NOTE GLOBALE Profil : 9/10
NOTE GLOBALE Vannes : 9/10

Fautes dures :
1. `apps/web/src/components/lettre/lettre-inscription.tsx` l. 316 : mention sous le bouton en `text-xs text-text-muted` (12 px, hors échelle 14/16/20/24, troisième gris) dans le formulaire de `/lettre` ouvert ; corriger en `text-sm text-text-secondary` quand `echelleEspace`.
