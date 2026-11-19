# Relecture UX à l'aveugle : Mes questions et Mes répliques (s26, tour 3, dernier)

Méthode : brief v7 (grille UX, barre 9/10, faute dure = chiffrable), specs UX et design s26, captures `docs/captures/s26/lot2-tour-3/{questions,repliques}/` (4 comptes, 375/768/1280/1456/1920 ouverts pour les comptes clés), code lu pour la cause. Décisions tenues et non notées : titre blanc, grille 8/4, verrouillage réel, textes validés, 8 + 4 de Mes répliques.

## Gate typographique (citée, `TAILLES-mon-espace_questions.md` et `_repliques.md`)
| Page | Compte, largeurs | Tailles | Combinaisons | Verdict |
|---|---|---|---|---|
| Questions | visiteur et gratuit, 375 à 1920 | 4 (24 ou 30, 20, 16, 14) | 6 | PASS |
| Questions | en-cours, 375 à 1920 | 4 | 6 | PASS |
| Questions | nouvel, 375 et 768 / 1280 et 1920 | 4 | 5 / 6 | PASS |
| Répliques | visiteur et gratuit | 4 | 6 | PASS |
| Répliques | en-cours | 4 | 4 (375, 768) puis 5 (1280, 1920) | PASS |
| Répliques | nouvel | 3 | 4 | PASS |
Un seul aplat violet par premier écran sur les 8 combinaisons compte x page (bouton d'offre en haut pour visiteur et gratuit ; « L'équipe t'a répondu » ou « Envoyer à l'équipe » pour Questions abonné ; « Écrire ma première réplique » pour Répliques nouvel ; aucun pour Répliques en-cours, voulu par la spec).

---

# MES QUESTIONS

## Faute dure 1 (chiffrée) : la tuile « réponse non lue » écrase le titre « Mes envois » dès 1024
- Où : compte `en-cours`, `en-cours-questions-1280.png`, `-1456.png`, `-1920.png` (identique aux 3). La tuile finit à y = 498 ; le titre « Mes envois » (y ≈ 481 à 509) et son compteur « 1 / 1 » sont rognés : seule la moitié basse des lettres dépasse sous le bord de la tuile. Écart mesuré : -17 px au lieu des 24 px de `gap-6` voulus, soit 41 px de recouvrement par rapport à la spec. Le titre n'est plus lisible, le compteur de progression (critère UX 3) est invisible sur l'écran principal de l'abonné avancé.
- Cause (code) : `apps/web/src/components/espace/questions/reponse-non-lue.tsx` reçoit `lg:mt-11` depuis `mes-questions.tsx` ligne 42, alors que `CARTE_ACTION` (`aujourdhui/tableau.tsx` ligne 27) porte `h-full`. La hauteur de la tuile = hauteur de la rangée (233 px), décalée de 44 px par la marge : elle déborde de 44 px sur la rangée suivante. Preuve : tuile 265 à 498 = 233 px de haut pour un contenu de 190 px (vide de fin de tuile de 68 px sous le bouton, produit par le même défaut).
- Correction codable : dans `mes-questions.tsx` ligne 42, ajouter `lg:h-auto lg:self-start` à la `className` de `ReponseNonLue` (`cn()` fusionne : `h-auto` bat `h-full`). Résultat attendu : tuile 265 à 454, « Mes envois » à y ≈ 478 sous 24 px d'air, 68 px de vide inutile supprimés. Aucune taille de police ajoutée.
- Régression à tester : captures 1280 et 1456 du compte en-cours, titre « Mes envois » entier, compteur « 1 / 1 » lisible.

## Notes par critère (Questions)
| Critère | Note | Évidence |
|---|---|---|
| UX1 Prospect, 3 secondes | 9 | 375 : promesse, bouton d'offre à y ≈ 325 (< 700), aperçu « Mes envois » EN CLAIR (2 exemples avant y = 760), historique verrouillé lu comme fermé (verrous, barres), bouton de fin y ≈ 1 818 (> 812). 1280 : bouton d'offre y = 203 (< 450), fin y = 1 175 (> 900). Une offre en haut ; le bloc « La suite est dans Premium » reste sous le fondu, hors premier écran. |
| UX2 Abonné, clarté | 7 | 375 et 768 : la tuile de réponse non lue est le premier élément, l'action est évidente. 1280 : correct sauf la faute 1. Nouvel, 1280x900 : le bouton plein « Envoyer à l'équipe » est à y 928 à 976, donc SOUS le pli (900) ; le formulaire mesure 750 px et n'est collant que si la fenêtre fait au moins 1 024 px de haut. |
| UX3 Abonné, envie de continuer | 5 | La progression « 1 / 1 » est masquée par la faute 1 à 1280/1456/1920 ; à 375 et 768 elle est lisible. Le fil répondu apparaît deux fois (tuile + ligne) sans marque de lien entre les deux. |
| UX4 Nouvel abonné | 9 | Jamais une page morte : formulaire + exemples par type en clair (tuile 8 col), bouton plein dans le formulaire. Vide de fin de colonne droite (538 à 1017) permis. |
| UX5 Accessibilité, cohérence | 8 | Cibles 44 px visibles (pastilles de type, « Retirer », « Répondu le... »), focus non évalué sur capture. L'ordre DOM met la tuile avant le formulaire : cohérent 375 / 768 / 1280. 768 : formulaire pleinement ouvert alors que la spec le voulait replié (« Continuer ») : écart non chiffrable, voir piste 3. |

**NOTE GLOBALE Mes questions : 5/10** (minimum des critères, plafonnée par la faute dure 1).

## Pistes Questions (3 maximum, non bloquantes)
1. Aplat sous le pli à 1280x900 (nouvel) : rendre le pied du formulaire collant (`lg:sticky lg:bottom-4` sur le conteneur du bouton, dans `formulaire.tsx`) pour que « Envoyer à l'équipe » reste à l'écran ; ferait 9 sur UX2.
2. Marquer le lien entre la tuile de réponse et la ligne d'historique : la ligne répondue du fil non lu pourrait porter le filet blanc 2 px de l'élément actif (`border-l-2 border-text-primary`, classes déjà dans la spec design §0), sans texte neuf.
3. Le libellé du bouton plein « L'équipe t'a répondu » dit un état, pas une action. Piste TEXTE À VALIDER par Thomas (non appliquée) : un verbe de lecture ; à défaut, rien ne change.

---

# MES RÉPLIQUES

## Faute dure : aucune
Aucun recouvrement, débordement, second aplat ni hors-échelle mesurable. Aperçu : bouton d'offre y = 203 (1280) et ≈ 347 (375), bouton de fin y ≈ 1 163 (1280) et > 812 (375) ; extrait en clair de la fiche « Coloc : la poêle » + tuile fermée à verrous et barres : un prospect lit « fermé » au premier coup d'œil.

## Notes par critère (Répliques)
| Critère | Note | Évidence |
|---|---|---|
| UX1 Prospect, 3 secondes | 9 | Pastilles « Ma réplique à moi, Modifier, Supprimer » dans le hero = valeur lisible ; champ de réplique inerte ; une seule offre en haut. La tuile fermée de droite n'a aucun titre (seulement verrous et barres) : lisible comme « verrouillé » mais pas comme « Tes répliques ». |
| UX2 Abonné, clarté | 9 | Avec 1 réplique : la carte de 8 col, « Modifier » et « Supprimer » soulignés (cibles 44 px). Tuile de 4 col : bouton « Écrire ma prochaine réplique » en contour, aucun aplat (page de référence, voulu). |
| UX3 Abonné, envie de continuer | 9 | Compteur « 1 » à droite du titre, sans unité : un chiffre nu à côté de « Mes répliques » se lit mal (1280, 768, 375). La prochaine action reste présente à toutes les largeurs (tuile 1280, lien d'en-tête 768 et 375). |
| UX4 Nouvel abonné | 9 | Jamais morte : tuile 8 col avec texte + bouton plein « Écrire ma première réplique » ; à 375 le lien « Quoi répondre » suit le bouton. À 1280 la tuile de 4 col ne contient que le bouton « Quoi répondre », sans phrase qui dise pourquoi. |
| UX5 Accessibilité, cohérence | 9 | Cohérent entre comptes : titre blanc à gauche, mêmes cartes. À 768 avec 1 réplique, la moitié droite de la grille est vide (carte 372 px à gauche, vide à droite sur toute la hauteur de rangée) : vide de fin de rangée, permis, mais l'écran paraît inachevé. |

**NOTE GLOBALE Mes répliques : 9/10**

## Pistes Répliques (3 maximum)
1. Unité du compteur : le « 1 » seul ne dit pas ce qu'il compte. Piste TEXTE À VALIDER par Thomas (non appliquée) : un libellé court après le chiffre, ou rien. Aucune taille neuve (`META tabular-nums` existant). Ferait 10 sur UX3.
2. Tuile de 4 col du nouvel abonné à 1280 : ajouter un libellé au-dessus du bouton « Quoi répondre » (TEXTE À VALIDER par Thomas) pour qu'elle ne soit plus un bouton isolé dans un cadre. Ferait 10 sur UX4.
3. 768 avec 1 réplique : placer la tuile « Écrire ma prochaine réplique » (déjà codée pour 1280) dans la 2e colonne de la grille à 768, au lieu du lien d'en-tête, pour combler la moitié droite sans texte ni taille neufs (`md:col-span-1` sur la tuile, lien d'en-tête masqué `md:hidden lg:...` à ajuster). Ferait 10 sur UX5.

---

## Liste numérotée des fautes dures
1. Mes questions, compte abonné (en-cours), 1280/1456/1920 : la tuile `ReponseNonLue` déborde de 44 px sur le titre « Mes envois » et son compteur (recouvrement mesuré -17 px au lieu de +24 px) ; ajouter `lg:h-auto lg:self-start` ligne 42 de `apps/web/src/components/espace/questions/mes-questions.tsx` (cause : `h-full` de `CARTE_ACTION`, `apps/web/src/components/espace/aujourdhui/tableau.tsx` ligne 27, combiné à `lg:mt-11`).

NOTE GLOBALE Mes questions : 5/10
NOTE GLOBALE Mes répliques : 9/10
