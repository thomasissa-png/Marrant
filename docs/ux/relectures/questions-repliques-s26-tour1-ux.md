# Relecture UX à l'aveugle, tour 1 (s26) : Mes questions et Mes répliques

Sources : brief v7, spec UX s26 (§1, §2), captures `docs/captures/s26/lot2-tour-1/{questions,repliques}/`. Ouvertes : questions visiteur 375/1280/1920, gratuit 1280, en-cours 375/768/1280/1920, nouvel 375/1280 ; répliques visiteur 375/1280/1920, gratuit 1280, en-cours 375/1280/1920, nouvel 375/1280/1920. Le code n'a pas été lu : les cibles 44 px et les chemins de fichiers sont à vérifier par @fullstack. Non notés (décisions prises) : titre blanc, grille 8/4, verrouillage réel, textes validés.

## Gate typographique mesurée (TAILLES-mon-espace_*.md, citée)

| Page / compte | Tailles distinctes | Combinaisons | Verdict |
|---|---|---|---|
| Questions visiteur, gratuit (375, 768, 1280, 1920) | 4 (24 ou 30, 20, 16, 14) | 6 | PASS (à la limite) |
| Questions en-cours 375/768 | 4 | 5 | PASS |
| Questions en-cours 1280/1920 | 4 (30, 20, 16, 14) | 6 | PASS (à la limite) |
| Questions nouvel 375/768 | 4 | 5 | PASS |
| Questions nouvel 1280/1920 | 4 | 6 | PASS (à la limite) |
| Répliques visiteur, gratuit | 4 | 6 | PASS (à la limite) |
| Répliques en-cours | 4 | 4 | PASS |
| Répliques nouvel | 3 (24 ou 30, 16, 14) | 4 | PASS |

Aucune taille hors échelle, aucune taille ajoutée. Un seul aplat violet visible par écran sur les 4 comptes (visiteur et gratuit : second bouton d'offre seulement sous le fondu, y = 1150 à 1280, hors premier écran, conforme au spec).

## MES QUESTIONS

### Constats par compte
- **Visiteur / gratuit (aperçu)** : hero 8/4, offre en haut (bouton à y = 179 à 1280, < 450 ; à 375 y ≈ 320, < 700), promesse « Décris ta scène, l'équipe t'écrit en retour. », puces des 3 types, « 1 500+ inscrits ». Rangée 1 : « Mes envois » en clair (3 exemples + délai) et « Un problème / Une situation à gérer / Une question » en barres verrouillées ; rangée 2 sous le fondu ; bouton de fin à y = 1150 (> 900) et ≈ 1818 à 375 (> 812). Se lit fermé : badge Premium, cadenas, barres, offre en haut. Gratuit ajoute une phrase de valeur dans la carte d'offre (utile). Aucune question ni réponse d'abonné visible.
- **En-cours 1280/1920** : titre, formulaire 4 col à gauche, tuile « réponse non lue » en tête de la colonne 8 avec le seul aplat (« L'équipe t'a répondu »), « Mes envois » avec compteur « 1 / 1 », carte de fil. Structure fidèle au spec.
- **Nouvel** : formulaire (seul aplat « Envoyer à l'équipe ») + « Mes envois » rempli d'exemples. Jamais une page morte.

### Défauts
- **[FAUTE DURE] Formulaire tronqué à 1280 et 1920 (en-cours et nouvel)** : la carte du formulaire s'arrête à y = 961 et coupe le bouton « Envoyer à l'équipe » (≈ 33 px visibles sur ≈ 48, soit < 44 px de cible) sans padding bas. Chez le nouvel, c'est l'aplat unique qui est rogné. Probable conteneur sticky avec `max-h` + `overflow-hidden` : à vérifier en navigateur réel (peut-être une artefact de capture pleine page, mais l'écart est mesuré sur les 2 largeurs).
- **[FAUTE DURE] Prochaine action sous le pli à 375 et 768 (en-cours)** : le spec §1.2 dit « tuile en tête ». À 1280 elle l'est (y = 221). À 768 elle passe sous le formulaire (y ≈ 971 > 900) et à 375 y ≈ 1067 > 812. L'abonné qui a une réponse non lue doit faire défiler 1 000 px pour la voir.
- Défaut (non dur) : cadenas de coin hors des sous-tuiles verrouillées : tuile droite 1195 à 1567, sous-tuiles 1220 à 1510, soit marge gauche 25 px / droite 57 px (1920). Asymétrie visible, le cadenas double celui de chaque sous-tuile.
- Défaut : au 1280 abonné, le haut de la tuile de réponse (y = 221) n'est pas aligné avec le titre « Écrire à l'équipe » (y = 235) ni avec le haut de la carte formulaire (y = 265).
- Défaut : carte de fil pleine largeur (800 px à 1280, 800 à 1920) avec 2 boutons empilés à gauche : ≈ 550 px vides à droite d'une carte d'un seul fil. Pas une faute (fin de ligne), mais largeur mal employée.
- Défaut : chez le nouvel, les 3 exemples de « Mes envois » se lisent comme de vrais envois (seul le premier porte « Par exemple, pour... »). Risque de confusion état vide / historique.
- Défaut : compteur « 1 / 1 » nu, sans libellé (conforme au spec « chiffres seuls », mais peu parlant).
- À vérifier au code : cibles 44 px des boutons « Retirer de mon historique » et du sélecteur de statut (hauteur visible ≈ 43 px).

### Notes
| Critère | Note | Raison |
|---|---|---|
| D1 Élégance, fidélité accueil | 8 | Sobre, cohérent ; cadenas doublés et asymétrie |
| D2 Hiérarchie | 8 | Un aplat par écran ; deux offres identiques sur l'aperçu (spec) |
| D3 Largeur 5 largeurs | 7 | Carte de fil à moitié vide ; formulaire tronqué |
| D4 Cohérence comptes | 8 | Visiteur et gratuit alignés |
| D5 Finition | 6 | Tronquage 33/48 px, alignements 221/235/265, marges 25/57 |
| U1 Prospect 3 s | 8 | Promesse claire, offre en haut, fermé lisible ; cadenas discrets |
| U2 Abonné clarté | 6 | Réponse non lue sous le pli à 375/768 ; bouton rogné |
| U3 Envie de continuer | 7 | Compteur 1/1 seul, pas de série ni de suite |
| U4 Nouvel abonné | 8 | Exemples et formulaire ; bouton sous le pli à 375 (y ≈ 984) |
| U5 Accessibilité / cohérence | 8 | Focus et radios nets ; cibles à vérifier |

### Pistes (3 max)
1. Retirer `overflow-hidden` / `max-h` du conteneur sticky du formulaire (`lg:sticky lg:top-24` seul, ou `max-h-[calc(100vh-7rem)] overflow-y-auto` avec padding bas) : fait disparaître la faute dure 1. Fichier : composant du formulaire d'envoi (`MesQuestions`).
2. Sous `lg`, placer la tuile « réponse non lue » avant le formulaire (`order-first lg:order-none` sur la tuile) : ferait passer U2 à 9 à 375/768.
3. Aligner la grille de l'historique : tuile de réponse et titre « Écrire à l'équipe » sur le même y (`items-start`, même `mt`), et sortir « Retirer de mon historique » à droite de la ligne de statut (`flex justify-between`) pour ne plus laisser 550 px vides.

NOTE GLOBALE Mes questions : 6/10

## MES RÉPLIQUES

### Constats par compte
- **Visiteur / gratuit (aperçu)** : hero 8/4, offre en haut, promesse « Tes mots à toi, écrits une fois, relus quand il le faut. ». Rangée 1 : fiche « Coloc : la poêle » en clair (5 min, « À toi », champ « Ma réplique à moi » inerte) et tuile « Tes répliques » en 3 lignes de barres vides ; rangée 2 « Modifier / Supprimer » verrouillée ; bouton de fin y = 1139 (> 900). Bouton d'offre à y = 179 (< 450). Aucune réplique d'abonné. Se lit assez fermé, mais le champ de saisie à gauche ressemble à un vrai champ actif (fond clair, placeholder lisible).
- **En-cours** : titre, lien souligné « Écrire ma prochaine réplique » + « 1 », puis une carte unique (« Coloc : la poêle », citation, Modifier / Supprimer). Aucun aplat, conforme au spec.
- **Nouvel** : tuile 8 col avec le bouton « Écrire ma première réplique » (aplat) et tuile 4 col avec le seul lien « Quoi répondre ».

### Défauts
- **[FAUTE DURE] Tuile creuse, nouvel (375, 1280, 1920)** : la tuile 4 col contient un seul lien 14 px 400 souligné, sans titre ni phrase (≈ 94 px de haut, 1 élément). Le rôle du lien (où écrire) n'est pas dit et il double la destination du bouton.
- Défaut : abonné avec 1 réplique, grille 3 col : la carte occupe 389 px de 1216 (1280) et de 1216 (1920) ; ≈ 830 px de vide à droite de y = 232 à 443. Pas de rail ni de tuile de suite.
- Défaut : le lien « Écrire ma prochaine réplique » (14 px, souligné, gris) est la seule prochaine action ; à 375 elle passe presque inaperçue sous le titre. Compteur « 1 » nu à côté du lien, lu comme un fragment.
- Défaut : citation limitée à ≈ 260 px dans une carte de 343 px à 375 (marge droite ≈ 70 px de plus que la gauche).
- Défaut (aperçu) : les puces du hero « Ma réplique à moi / Modifier / Supprimer » vendent mal (verbes d'interface, pas de bénéfice) ; texte validé, jugé sur sa place.
- À vérifier au code : cibles 44 px de « Modifier », « Supprimer » et du lien d'en-tête (liens soulignés de ≈ 20 px de haut visibles).

### Notes
| Critère | Note | Raison |
|---|---|---|
| D1 Élégance, fidélité accueil | 8 | Même langage que Questions |
| D2 Hiérarchie | 8 | Aplat unique ; nouvel : tuile droite sans poids |
| D3 Largeur | 6 | 2/3 vide à droite d'une carte (abonné) ; tuile creuse (nouvel) |
| D4 Cohérence comptes | 8 | |
| D5 Finition | 7 | Citation étroite, lien en 14 px, alignements corrects sinon |
| U1 Prospect 3 s | 7 | Valeur floue (puces, champ qui paraît ouvert) |
| U2 Abonné clarté | 7 | Lien discret comme seule action |
| U3 Envie de continuer | 5 | Un « 1 » nu, aucune suite, aucune série, page quasi vide |
| U4 Nouvel abonné | 6 | Bouton net, mais tuile droite creuse et inexpliquée |
| U5 Accessibilité / cohérence | 7 | Liens gris souligné 14 px, cibles à vérifier |

### Pistes (3 max)
1. Nouvel : retirer la tuile creuse et loger le lien « Quoi répondre » dans la tuile gauche, qui passe à 12 col (ou garder la tuile 4 col avec un libellé d'explication : texte neuf à valider par Thomas). Fichier : état vide de `ListeRepliques`.
2. Abonné : au lieu de `lg:grid-cols-3` avec 1 carte, carte en 8 col et rail 4 col pour « Écrire une autre réplique » en bouton contour (libellé à valider) ; compteur « 1 réplique » = texte à valider.
3. Aperçu : rendre le champ « Ma réplique à moi » visiblement inerte (opacité réduite, cadenas dans le champ) et retirer les puces « Modifier / Supprimer » du hero (aucun texte neuf).

NOTE GLOBALE Mes répliques : 5/10

## Fautes dures (liste numérotée)
1. Mes questions, 1280/1920 (en-cours, nouvel) : carte du formulaire tronquée à y = 961, bouton « Envoyer à l'équipe » visible ≈ 33 px sur ≈ 48 (< 44) ; fichier : composant formulaire d'envoi `MesQuestions` (conteneur sticky, `max-h` / `overflow-hidden`).
2. Mes questions, 375/768 (en-cours) : tuile « réponse non lue » à y ≈ 1067 (375) et ≈ 971 (768), hors du premier écran, contre « en tête » du spec §1.2 ; fichier : `MesQuestions` (ordre mobile).
3. Mes répliques, nouvel (375/1280/1920) : tuile 4 col creuse (1 lien 14 px, 0 titre, 0 phrase, ≈ 94 px) ; fichier : état vide de `ListeRepliques` / page `/mon-espace/repliques`.
