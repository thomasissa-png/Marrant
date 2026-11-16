# Relecture à l'aveugle, s25 navigation v6, tour 4 : groupe « s-entrainer »

Périmètre : `s-entrainer/` (visiteur, gratuit, en-cours, nouvel) et `fiches/` jeu, seance, bilan (en-cours, nouvel).
Captures ouvertes : s-entrainer 375, 1280, 1920 pour les 4 comptes, plus 768 et 1456 en-cours ; fiches jeu, seance, bilan en-cours 375, 1280, 1920 ; nouvel jeu 375 et 1920, seance 1280, bilan 375 et 1920. Étalon : accueil 1280.
Code vérifié : `apps/web/src/app/(dashboard)/mon-espace/s-entrainer/page.tsx`, `components/espace/carte/styles.ts`, `components/espace/lien-retour.tsx`.

## Verdict : 9/10, aucune faute dure. Barre de validation atteinte.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 10 |
| Design 2 hiérarchie et lisibilité | 9 |
| Design 3 mise en page aux 5 largeurs | 9 |
| Design 4 cohérence avec l'espace | 10 |
| Design 5 finition | 10 |
| UX 1 compréhension | 10 |
| UX 2 action principale unique | 9 |
| UX 3 états vides et nouvel abonné | 10 |
| UX 4 aperçu Premium | 10 |
| UX 5 accessibilité et cohérence entre comptes | 10 |
| **Globale (minimum)** | **9** |

## Constats positifs (vérifiés)

- Titre H1 et sous-titre centrés, cartes `rounded-xl` à filet dégradé violet : même langue que l'accueil, à 375, 768, 1280, 1456, 1920.
- Aperçu visiteur et gratuit (s-entrainer-{375,1280,1920}) : une vraie fiche lisible en entier (« Quelle réplique ? »), un seul bouton plein « Premium · 1,99 €/mois », « Connexion » seulement pour le visiteur, aucun mur. Colonne centrée de 768 px à 1280 et 1920 : pas de colonne collée à gauche, pas de vide à droite.
- Chip « S'entraîner » allumé (soulignement violet) sur la rubrique et sur les fiches jeu et seance ; chip « Parcours » allumé sur le bilan, conforme à la spec §4. Cadenas présents pour visiteur et gratuit, absents pour l'abonné.
- Nouvel abonné : une carte « Nouvelle » plus la mission « Marche 1 », jamais une page morte (nouvel-s-entrainer-{375,1280,1920}). En-cours : 3 éléments, la carte seule du bas prend la ligne entière (texte à gauche, retour à droite dès `lg`).
- Cibles tactiles : `BOUTON_SECONDAIRE`, `SOMMAIRE_REPLIABLE`, `puce` et `LIEN` en `min-h-11` (44 px) ; `LienRetour` en `min-h-11`. Aucune faute de cible.
- Cohérence entre comptes : mêmes gabarits, mêmes largeurs de colonne pour en-cours et nouvel sur jeu, seance, bilan.

## Pistes (ne bloquent pas)

1. **Design 3, piste** : s-entrainer en-cours 1280, 1456, 1920, 768 (`en-cours-s-entrainer-1280.png`). Les deux cartes jumelles sont de même hauteur (`items-stretch`, texte `flex-1`, actions en bas). La carte « Amis » est deux fois plus courte que « Soirée » : un trou d'environ 150 px entre « Le contexte » et « Ta réponse d'abord ». C'est la conséquence voulue de l'arbitrage 2 (actions alignées entre jumelles), donc je ne le retiens pas. Ce qui ferait 10 : équilibrer le contenu des jumelles, ou limiter le trou en passant les actions sous `max-h`, par exemple `texteEntrainement` sans `flex-1` quand l'écart de hauteur dépasse 96 px (fichier `components/espace/carte/styles.ts`). À arbitrer par Thomas.
2. **UX 2, piste** : en-cours, trois cartes affichent chacune leurs puces « Oui / À moitié / Rien » et « Pas essayé / … » dès l'arrivée. L'ordre de lecture est clair (« Ta réponse d'abord », puis « 10 secondes », puis « Tu avais une réponse ? »), mais aucune carte n'est mise en avant comme la première à faire. Ce qui ferait 10 : mettre la carte 1 en évidence (filet plus marqué) dans `components/espace/carte/carte-registre.tsx`. Piste subjective, non retenue.
3. **Design 2, piste** : fiche séance (`en-cours-fiche-seance-1280.png`), 12 blocs dans une seule carte, titres de phase (« Échauffement · 3 min », « Observation · 5 min ») au même corps que le texte, sans séparateur. Lisible, cohérent avec les autres fiches. Ce qui ferait 10 : une marge ou un filet `border-t border-border` entre phases dans le composant de fiche séance. En-tête redondant « SÉANCE DE 20 MINUTES · 20 min » (signalé, texte validé non touché).
4. **Bilan, piste** : les trois cartes « Ta réponse d'abord » (fiche bilan) n'ont pas le bouton « 10 secondes pour répondre » de la rafale, alors que le texte « Prends ton temps » y est : léger écart de cohérence entre fiche et rafale. Non retenu.

## Signalement de contenu (non retenu, à voir avec Thomas)

- Fiche bilan en-cours et nouvel : la carte « À toi » affiche la solution complète (« Après tout le monde, oui. C'est mon rôle… Tu me remercieras ») juste sous l'exercice « Remets ta réponse dans l'ordre », sans passer par une révélation à la demande comme « Ce qu'on aurait pu dire » sur la fiche jeu. Si c'est voulu, rien à faire ; sinon, le texte d'« À toi » serait à revoir (texte validé : aucune réécriture proposée).

## Nielsen (résumé)

Visibilité de l'état : PASS (chip allumé, compteur 0 / 200 caractères). Vocabulaire du persona : PASS. Contrôle : PASS (Retour, détails repliables). Cohérence : PASS. Prévention d'erreurs : PASS (Enregistrer désactivé tant que vide). Reconnaissance : PASS. Minimalisme : PASS avec réserve sur la fiche séance. Aide dans le flow : PASS (« Rien n'est noté », « Prends ton temps »).

NOTE GLOBALE : 9/10
