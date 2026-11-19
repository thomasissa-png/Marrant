# Relecture UX à l'aveugle : Mes questions et Mes répliques (s26, tour 2)

Périmètre : `/mon-espace/questions` et `/mon-espace/repliques`, 4 comptes (visiteur, gratuit, en-cours, nouvel). Captures ouvertes : 375, 1280 et 1920 des 4 comptes pour les deux pages (24 captures) et `gratuit` 1280 ; 768 et 1456 non ouvertes, lues via la gate. Aucune relecture existante lue. Code lu : `components/espace/repliques/liste-repliques.tsx`, `components/espace/carte/styles.ts`.
Décisions de Thomas non notées : titre blanc, grille 8/4, verrouillage réel, textes du 19/11.

## Gate typographique mesurée (citée, `TAILLES-mon-espace_*.md`, premier écran)

| Page | Compte | Tailles | Combinaisons | Verdict |
|---|---|---|---|---|
| Questions | visiteur / gratuit / en-cours (375, 768, 1280, 1920) | 4 (24 ou 30, 20, 16, 14) | 6 | PASS (au plafond) |
| Questions | nouvel 375 / 768 | 4 | 5 | PASS |
| Questions | nouvel 1280 / 1920 | 4 | 6 | PASS (au plafond) |
| Répliques | visiteur / gratuit | 4 | 6 | PASS (au plafond) |
| Répliques | en-cours | 4 | 4 | PASS |
| Répliques | nouvel | 3 | 4 | PASS |

Aucune taille hors des 4 de l'échelle. Les aperçus visiteur et les formulaires Questions sont à 6 combinaisons sur 6 : toute correction qui ajouterait une combinaison serait refusée.
Aplats violets : un seul par écran sur toutes les captures. Le bouton de fin des aperçus (« La suite est dans Premium ») est à y = 1175 (Questions) et y = 1163 (Répliques) à 1280, donc jamais dans le même écran que le bouton du haut (y = 203). Cibles : `min-h-11` (44 px) sur `LIEN_NEUTRE`, `BOUTON_SECONDAIRE`, `BOUTON_PRINCIPAL`, `SOMMAIRE_REPLIABLE` (`carte/styles.ts`), vérifié au code.

---

## 1. Mes questions

### Ce que je vois
- **Visiteur / gratuit** (375, 1280, 1920) : hero 8/4, bouton d'offre en haut (y = 203 à 1280, ~325 à 375), une seule offre, puce « Premium » verrouillée, 3 types en pastilles, « 1 500+ inscrits ». Dessous : « Mes envois » en clair (exemples validés, délai de réponse) à gauche, historique fermé à droite (verrou + barres, aucune donnée d'abonné), seconde rangée fermée sous un fondu, puis rappel d'offre centré. Se lit FERMÉ au premier coup d'œil : les trois tuiles de droite portent chacune un verrou en coin.
- **En-cours** : à 375, la tuile « réponse non lue » est la première chose sous le titre, bouton violet seul aplat ; à 1280/1920 : formulaire 4 col à gauche, tuile de réponse puis « Mes envois 1 / 1 » à droite. Envoi du formulaire en contour tant qu'une réponse attend.
- **Nouvel** : formulaire en tête, bouton d'envoi plein (seul aplat), « Mes envois » rempli par l'état vide existant (exemples par type). Jamais une page morte.

### Grille UX
| Critère | Note | Évidence |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Offre en haut (y 203), promesse lisible, extrait fermé, une offre. Seule réserve : la tuile « Mes envois » est EN CLAIR et plus haute que sa voisine, le bas de tuile laisse 96 px vides à 1280 (fin de tuile, permis). |
| 2 Abonné, clarté | 9 | Une action pleine par écran, la réponse non lue passe avant le formulaire à 375. Le bouton « L'équipe t'a répondu » est un libellé d'état dans un bouton : on devine qu'il ouvre la réponse. |
| 3 Abonné, envie de continuer | 8 | Compteur « 1 / 1 » nu à droite de « Mes envois », sans mot : ambiguë (répondues sur envoyées ?). À 1280/1920, 344 px vides sous l'historique (668 à 1012), permis mais rien ne dit quoi faire ensuite. |
| 4 Nouvel abonné | 9 | Formulaire actif + exemples, aucune page morte. À 1280 la tuile de droite fait 273 px pour 750 px de formulaire à gauche (vide de fin de colonne, permis). |
| 5 Accessibilité, cohérence | 9 | Cibles 44 px au code, radios en cartes entières, focus visible, hiérarchie identique aux 4 comptes. Contrastes AA des gris sur fond sombre non mesurés au pixel (lecture visuelle seule). |

### Faute dure
Aucune : gate PASS, un seul aplat, aucun vide > 32 px au milieu d'un bloc relevé.

### Pistes (3 max)
1. Compteur « 1 / 1 » : le rendre lisible demande un mot. **Texte à valider par Thomas** (pas de libellé ajouté ici). Ferait passer le critère 3 à 9.
2. Libellé du bouton de la tuile de réponse : « L'équipe t'a répondu » est un état. Vérifier avec le spec UX (§1.2 prévoit « Lire » existant) ; si changement, **texte à valider par Thomas**.
3. Vide de fin de colonne droite à 1280/1920 (344 px) : rendre le formulaire gauche `xl:sticky xl:top-24` (`formulaire.tsx` ou son conteneur dans `mes-questions.tsx`) pour qu'il reste à l'écran pendant la lecture de l'historique. Aucune taille ni texte ajouté.

**NOTE GLOBALE Mes questions : 8/10**

---

## 2. Mes répliques

### Ce que je vois
- **Visiteur / gratuit** : même squelette que Questions (hero 8/4, offre y 203, extrait fermé). La fiche en clair (« Coloc : la poêle », consigne « À toi », champ « Ma réplique à moi » inerte) à gauche, tuile « Tes répliques » fermée à droite (barres seules, aucun titre ni texte d'abonné), « Modifier / Supprimer » fermés dessous. Se lit fermé.
- **En-cours** (1 réplique) : titre à gauche, à droite un lien gris souligné « Écrire ma prochaine réplique » puis un « 1 » nu. À 1280 et 1920 une carte de **389 px** sur les 1216 de la page, calée à gauche : **827 px vides** à sa droite, jusqu'au pied de page. À 375 la carte est correcte (293 px pleine largeur), mais son texte retourne à la ligne à ~262 px, laissant ~70 px à droite.
- **Nouvel** : tuile d'action pleine largeur, bouton violet seul aplat, lien « Quoi répondre » dessous. À 375 nette. À 1280/1920 la tuile fait 1216 px pour un contenu de ~460 px : la moitié droite est vide.

### Grille UX
| Critère | Note | Évidence |
|---|---|---|
| 1 Prospect, envie en 3 s | 9 | Même qualité que Questions, offre en haut (y 203), extrait fermé, fiche réelle lisible. |
| 2 Abonné, clarté | 7 | La prochaine action est un lien gris de 14 px souligné en haut à droite, au bout d'une ligne vide à 1280. La page ne dit pas « quoi faire maintenant » au premier regard (choix voulu : pas d'aplat sur une page de référence, mais l'action reste à peine visible). |
| 3 Abonné, envie de continuer | 7 | Compteur « 1 » nu, collé au lien : on ne sait pas ce qu'il compte. Carte isolée dans 32 % de la largeur à 1280/1920 : la page paraît vide au moment où l'abonné vient d'écrire sa première réplique. |
| 4 Nouvel abonné | 9 | Bouton « Écrire ma première réplique » plein, au premier écran à 375 comme à 1280 ; rappel vers Quoi répondre. Réserve : le spec UX §2.2 prévoyait 8 col + rappel 4 col, remplacé par une tuile pleine largeur à moitié vide à 1280. |
| 5 Accessibilité, cohérence | 9 | `min-h-11` sur lien, Modifier, Supprimer (`LIEN_NEUTRE`), confirmation avec focus sur « Annuler », statut annoncé (`role="status"`). |

### Fautes dures
1. **Largeur utile, abonné avec 1 réplique, 1280 et 1920** : carte 389 px sur 1216 px (32 %), 827 px vides à sa droite. Chiffrable, critère « largeur » du spec UX §5.3, et le code (`liste-repliques.tsx` l.33-34) a lui-même mesuré cette faute pour l'état vide sans la corriger pour une seule carte. C'est l'état qui suit directement l'écriture de la première réplique. Fichier : `apps/web/src/components/espace/repliques/liste-repliques.tsx` (`GRILLE_REPLIQUES` l.40, en-tête l.117-133).
   Correction codable : si `liste.length === 1`, `lg:grid-cols-12` ; carte `lg:col-span-8` ; en `lg:col-span-4` une tuile `CADRE_CARTE_NEUTRE` portant le lien « Écrire ma prochaine réplique » existant (`R.ecrireProchaine`, aucun texte neuf, aucun aplat). Ferait passer les critères 2 et 3 à 9.

### Pistes (3 max)
1. Voir faute dure 1 (grille 8/4 pour 1 réplique).
2. Lien « Écrire ma prochaine réplique » (l.124) : passer de `LIEN_NEUTRE` à `BOUTON_SECONDAIRE` (contour, déjà dans `carte/styles.ts`, 44 px, 0 aplat) pour que la prochaine action se voie ; le compteur « 1 » se lit alors comme le décompte de la liste. Libellé ou mot pour le compteur : **texte à valider par Thomas**.
3. Nouvel 1280/1920 : tuile pleine largeur à moitié vide. Revenir au spec §2.2 : tuile 8 col (texte, bouton) + tuile 4 col portant le lien « Quoi répondre » (`N.index.quoiRepondre`, libellé existant), dans `liste-repliques.tsx` l.87-113 (`CARTE_ACTION` + `lg:grid-cols-12`).

**NOTE GLOBALE Mes répliques : 7/10**

---

## Fautes dures (liste numérotée)
1. Mes répliques, abonné avec 1 réplique, 1280 et 1920 : carte de 389 px sur 1216 (32 % de la largeur, 827 px vides) : `apps/web/src/components/espace/repliques/liste-repliques.tsx` (`GRILLE_REPLIQUES` l.40, en-tête l.117-133).

Mes questions : aucune faute dure.
