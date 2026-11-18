# Relecture UX à l'aveugle, Bibliothèque, s26 tour 2

Captures lues : `docs/captures/s26/rubriques-tour-2/bibliotheque/` (375, 1280, 1920 des 4 comptes ; 768 et 1456 non ouverts). Code lu : `bibliotheque/page.tsx`, `bloc-bibliotheque.tsx`.

## Gate typographique (`TAILLES.md`)
- Aperçu (visiteur, gratuit), 375/768/1280/1920 : 4 tailles (24 ou 30, 20, 16, 14), 6 combinaisons. PASS.
- Abonné (en-cours, nouvel) : 4 tailles à toutes les largeurs ; 5 combinaisons à 375, 6 à 768, 1280 et 1920. PASS.
- Aucune taille hors échelle, graisses 400 et 600 seulement. Un seul aplat violet au premier écran (bouton d'offre du hero ; le bouton de fin d'extrait est à y = 1145 à 1280 et à 1920, 1773 à 375, donc hors premier écran). Abonné : aucun aplat violet, conforme à la spec §2.2.

## Notes par critère (UX)

| Critère | Note |
|---|---|
| 1 Prospect : envie en 3 s | 9 |
| 2 Abonné : clarté | 8 |
| 3 Abonné : envie de continuer | 9 |
| 4 Nouvel abonné | 8 |
| 5 Accessibilité et cohérence entre comptes | 9 |

### 1 Prospect, 9/10
Valeur : la page se lit FERMÉE (verrous, barres grises, fondu, « Premium » une seule fois), l'offre est en haut à droite à 1280 et à 1920 (bouton à y = 202), avant tout contenu à 375 (y = 320). Une seule offre au premier écran. Le schéma en clair (« Ça reste entre nous : » puis un aveu minuscule…) donne la valeur en une ligne. 375 : titre de la tuile à y = 600, 2 lignes du schéma à y = 670 à 718 (< 760), bouton de fin à 1773 (> 812). Critères chiffrés de la spec §4 (2) tenus. Promesse du hero : bien placée (sous le titre, avant les pastilles).
Défaut : à 1280 et à 1920 la tuile « catalogue » (colonne 5/12) n'a de contenu que sur ses 190 premiers px puis ~230 px de vide jusqu'à y = 900 (656 à 900) : la tuile paraît à moitié vide à côté de la tuile construction pleine. Permis (vide en fin de carte), donc piste, pas faute. Pour 10 : fin de carte moins visible, `self-start` sur la tuile catalogue (`apercu-bibliotheque.tsx`) pour qu'elle épouse son contenu ; l'air passe hors cadre (à arbitrer visuellement, le bord bas des deux tuiles ne s'aligne plus).

### 2 Abonné, clarté, 8/10
Bien : 1280 et 1920 : titre à gauche, trois colonnes 4/4/4, compteurs « 0/12 », « 0/8 », « 0/12 » à droite des titres, première ligne de chaque bloc en gras avec filet clair. Je sais où aller.
Défaut (375, en-cours et nouvel) : l'ordre du DOM (`page.tsx`, `BlocVannes` puis coin, puis construction) met en tête la tuile catalogue (pastilles de thèmes, 3 liens) puis « Humour noir » avec son bouton « Entrer ». Le premier écran (812) ne montre que ces deux tuiles : la première ligne à lire (« Le faux secret ») est à y = 852, sous le pli, et le seul bouton visible est « Entrer ». Le but de la page (choisir une technique) n'est pas dans le premier écran. Compteur « 0/12 » à y = 794 : visible de justesse.
Pour 10 : à moins de 768 px, mettre « Comment c'est construit » en premier, sans toucher à 768 et 1024 : conteneur `flex flex-col md:block` (`page.tsx`, ligne 95) et `max-md:order-first` sur le bloc construction (via `COLONNE_LG` ou `className`). Aucun texte neuf.

### 3 Abonné, envie de continuer, 9/10
Compteurs par bloc, première ligne sans « Fait » marquée (gras + filet), bonus de caps conservés. Reste : le marquage de la prochaine ligne est faible (filet de 2 px blanc, même poids dans les trois colonnes) et rien n'indique laquelle des trois est « la » prochaine. Pour 10 : piste, ne marquer en `TEXTE_FORT` que la prochaine ligne du premier bloc incomplet (`marquerProchaine` sur un seul `ListeFiches`) ; arbitrage Thomas (spec §2.2 demande une marque par bloc, donc non faute).

### 4 Nouvel abonné, 8/10
Jamais une page morte : tout est cliquable, chaque bloc a sa ligne marquée, compteurs à 0 lisibles. Mais la page est identique à celle de l'abonné avancé (mêmes tailles, mêmes hauteurs 4291 et 1937 px) : trois points de départ de même poids, et à 375 le seul bouton visible est « Entrer » (coin sensible, jour 1). Même correction que le critère 2 (construction d'abord à 375). Aucun texte neuf proposé.

### 5 Accessibilité, cohérence, 9/10
Code : pastilles de thèmes `min-h-11` (44 px), focus visible (`ring-2`), `section aria-labelledby`, titres h2. Les trois liens catalogue (`LIEN_NEUTRE`) : hauteur de cible NON vérifiée au code (style non lu) ; sur capture le lien fait environ 20 px de haut. À vérifier : si `LIEN_NEUTRE` n'a pas `min-h-11`, c'est une faute à 44 px (WCAG 2.2 AA 24 px passe par l'espacement). Cohérence comptes : visiteur et gratuit identiques sauf le contenu de la carte d'offre (voulu) ; en-cours et nouvel identiques. Contraste : texte `#B3B3B3` sur carte, conforme à l'échelle.

## Pistes (pas des fautes)
1. 375 abonné : construction en premier (`page.tsx`, flex et `max-md:order-first`).
2. Aperçu 1280+ : `self-start` sur la tuile catalogue (`apercu-bibliotheque.tsx`).
3. Vérifier la cible des liens `LIEN_NEUTRE` (`carte/styles.ts`) à 44 px.

NOTE GLOBALE : 8/10

Fautes dures :
Aucune (gate typographique PASS, un seul aplat violet, aucun vide > 32 px au milieu d'un bloc, aucun débordement vu). Note < 9 due aux critères 2 et 4 (piste 1), non à une faute chiffrable ; NO-GO au regard de la barre 9/10, corrigeable en 2 classes.
