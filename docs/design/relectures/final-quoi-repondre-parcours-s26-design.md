# Relecture à l'aveugle, Quoi répondre + Parcours (s26, final), design

Méthode : 70 captures vues dans l'ordre des séquences (qr-* et pa-*, 375 et 1280, les 4 comptes), sans spec ni mesure. Lecture à l'œil, barème du brief v7. Échelle `typo.ts` : aucun texte hors échelle repéré (pas de capitales), la hiérarchie H1 / titre de carte / texte tient. Les fautes sont de mise en page, de vides et de continuité.

## Notes par page
- **Quoi répondre : 6,5/10.** Fiche + liste solides pour l'abonné ; l'aperçu fermé (visiteur, gratuit) a des vides et une tuile inerte.
- **Parcours : 6,5/10.** Cartes propres, mais le détail d'un parcours et le hero abonné ont des alignements faibles et trop d'espace mort.

## Notes par trajet
| Trajet | Note |
|---|---|
| qr-visiteur-375 | 6 |
| qr-visiteur-1280 | 6 |
| qr-gratuit-375 | 6 |
| qr-gratuit-1280 | 6,5 |
| qr-abonne-en-cours-375 | 6,5 |
| qr-abonne-en-cours-1280 | 7 |
| qr-nouvel-abonne-375 | 7 |
| qr-nouvel-abonne-1280 | 7 |
| pa-visiteur-375 | 6 |
| pa-visiteur-1280 | 6 |
| pa-gratuit-375 | 6 |
| pa-gratuit-1280 | 6,5 |
| pa-abonne-en-cours-375 | 6,5 |
| pa-abonne-en-cours-1280 | 6,5 |
| pa-nouvel-abonne-375 | 7 |
| pa-nouvel-abonne-1280 | 7 |

## Défauts (toutes les notes sont < 9)

### D1. Tuile fermée inerte : le clic ne produit rien (qr-visiteur/gratuit, 1 -> 2)
Les captures 1 et 2 sont identiques (1280 : pixel pour pixel). Un clic sur une tuile verrouillée sans retour est un mur silencieux. Correction : au clic, scroller vers le bloc d'offre en haut (375) ou lui donner un état focus visible (anneau violet 2 px, 300 ms) ; au minimum curseur normal et pas de hover sur une tuile morte.

### D2. Vides visibles de l'aperçu fermé (qr-visiteur/gratuit 1280-1, pleine page)
- Colonne gauche du bandeau : 60 px entre « Quoi répondre » et la phrase, puis 80 px entre les pastilles et « Voici un exemple », pendant que la carte d'offre à droite descend à 355 px. Le bloc gauche flotte, la carte à droite est plus haute : deux hauteurs qui ne s'alignent pas.
- Bandeau « Pour quoi faire ? » : pastilles calées à gauche, 350 px vides à droite.
- Cartes « La sûre / La joueuse / La risquée » : deux barres grises par carte sur 100 px de haut, ça se lit comme un chargement, pas comme un contenu fermé.
Correction minimale : coller la phrase au titre (mb-2), aligner le bas du bloc gauche sur le bas de la carte d'offre (items-stretch + justify-between), ramener l'écart avant « Voici un exemple » à 24 px, et mettre une vraie première ligne floutée plutôt que des barres.

### D3. Violet : un second « plein » sans raison (qr-abonné/nouvel, 1280-1 et 375)
« Essayé, ça a marché » est un bouton violet plein AVANT tout clic, pendant que « Pas essayé » et « Essayé, bof » sont en contour : l'œil le lit comme réponse pré-cochée ou comme l'action principale. Après clic il passe en contour et « Situation suivante » devient le seul plein : le plein change de place (frames 1 -> 3). Au 375 « Voir » (plein) + hero violet. Correction : les 3 choix en contour égaux au repos (sélection = contour violet + coche, déjà fait), « Situation suivante » seul plein et visible dès le chargement.

### D4. Perte de contexte entre écrans
- **Visiteur, 2 -> 3** (/abonnement et /register) : la bande de rubriques et le fil disparaissent d'un coup, pas de retour visible vers « Quoi répondre » / « Parcours » (register sans logo ni lien retour à 1280). Correction : lien « Retour » en tête de ces deux pages quand elles viennent d'une rubrique.
- **Abonné 375, fiche** : la liste disparaît (nécessaire) mais le « Retour : Quoi répondre » change de hauteur d'une fiche à l'autre (y 147 puis 171 entre captures 2 et 4) : le fil saute. Fixer sa hauteur et son marges.
- **Abonné 375, 4 -> 5** : le retour arrive à scrollY 24, le H1 « Quoi répondre » colle sous la bande (marge 8 px au lieu de 32). Correction : `scroll-mt` / réinitialiser scrollY à 0.
- **Parcours abonné/nouvel, 2 -> 3** : cliquer l'en-tête de l'étape 2 ouvre l'étape et fait sauter la page de 440 px ; l'étape 3 ouverte par défaut disparaît, on perd où l'on était. Correction : replier l'étape précédente SANS décaler la page (ancre sur l'en-tête cliqué, `scroll-margin-top`).
- Titre d'étape : « Sentir le bon moment » est souligné (état actif) mais « Raconter une anecdote » ne l'est pas : deux traitements pour le même rôle.

### D5. Alignements du hero « Étape en cours » (pa-abonne 1280-1)
Barre de progression (x 57-430) et bloc « Ton cap » (x 454) sur la même ligne mais non alignés avec « Machine à Café » ni avec le bouton « Reprendre » à droite ; le texte « Tu te lances · cap 2 sur 5 » tombe sous les pastilles, le bord droit reste vide (500 px). « Étape 3 sur 3 » à côté d'une barre à 2/3 : message contradictoire. Le bandeau « Nouveau cap : Tu te lances. » a son texte collé au bord haut (12 px) et un bouton « Fermer » seul sur sa ligne. Correction : grille 2 colonnes (gauche titre/étape, droite bouton), « Ton cap » sur une ligne pleine alignée à x 57, barre pleine largeur ; bandeau : « Fermer » en lien texte à droite sur la même ligne, padding 16 px.

### D6. Détail parcours, vides et rythme (pa-* 1280-2)
- Colonne droite visiteur : carte « Étape 1 gratuite » avec 85 px d'intervalle entre étapes pour 3 lignes courtes (zones vides dans la carte) et pastille « Lecture libre » verte (3e couleur d'accent).
- Étapes ouvertes : paragraphe limité à 690 px sur une carte de 1190 : tiers droit vide sur « Ce que tu vas apprendre » (abonné et nouvel, 1280-2/3). Correction : passer en 2 colonnes (texte | « Format ») ou centrer le texte sur une colonne de lecture identique à celle de l'en-tête.
- Liste parcours (1280-1) : méta (Débutant, 3 semaines) à 28 px du titre, puis titre collé à sa phrase (0 px) : le haut de carte est tassé, le bas aéré. Au 375 la méta passe sur 2 lignes (« 325 XP à gagner » orpheline) et le titre touche le paragraphe.
- Intro de page visiteur : 5 lignes sur 650 px et un quart droit vide au-dessus des cartes.

### D7. 375, bande de rubriques et en-tête
Au 375 la bande coupe « Bibli… » et affiche un cadenas orphelin à gauche (« 🔒 Parcours ») ; sur certains écrans « S'en » est tronqué. Le cadenas sans libellé se lit comme un défaut. Correction : masquer l'icône du premier élément coupé ou faire défiler pour centrer l'actif (déjà le cas abonné, pas visiteur).

### D8. Divers
- Pastille « Fait » après « À toi » : 4 px sous le texte du titre, puis le texte de consigne collé à la ligne (à toi → texte 26 px, alors que « La scène » → texte 30 px) ; espacement différent d'une carte à l'autre.
- Liste fiche 1280 : « Tu pars déjà ? » coupé en bas de la liste scrollable sans fondu : ajouter un dégradé de 24 px.
- « Voir » blanc souligné x 5 par étape : dense, mais cohérent.

## Violets (rappel)
Un seul plein par écran sauf D3 (chip précochée) et D3 au 375 (« Voir »). En-tête : « Tout ouvrir » plein en haut des pages Parcours visiteur/gratuit, seul plein de l'écran, correct. Logo et soulignement actif violets : acceptés.

## Verdict
Pas de validation. Priorité : D3, D1, D4 (Parcours étapes), D5, D2, D6.
