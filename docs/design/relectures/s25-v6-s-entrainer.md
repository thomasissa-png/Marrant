# Relecture design à l'aveugle, s25 v6 tour 1 : S'entraîner et fiches (jeu, séance, bilan)

Captures lues : `docs/captures/s25/v6-tour-1/s-entrainer/` (visiteur, gratuit : 375/768/1280 ; en-cours : 375/768/1280/1920 ; nouvel : 768/1280), `fiches/` (en-cours jeu/séance/bilan 1280, jeu 375 ; nouvel séance 375, bilan 1920). Code : `s-entrainer/page.tsx`, `fiche.tsx`, `carte/*`, `apercu/apercu-rubrique.tsx`, `fiche/corps-divers.tsx`. Thème vérifié : `rounded-lg` = 12 px, `rounded-xl` = 12 px (défaut Tailwind, non surchargé) ; `text-muted` #9A9A9A, `text-secondary` #B3B3B3 sur carte #1F1F1F (AA).

## Notes

| Critère | Note | Justification |
|---|---|---|
| D1 Fidélité accueil | 8 | Rayon 12 px, aération, violet : conformes. Manque le filet dégradé violet en haut des cartes : l'aperçu l'a (`apercu-rubrique.tsx` l. 51), les cartes réelles non (`CARTE`, `carte/styles.ts` l. 11). Deux langues sur la même rubrique. |
| D2 Hiérarchie, lisibilité | 8 | Titre, accroche, cartes : clair. Mais mission pleine ligne : ~140 caractères par ligne à 1280 et 1920 (`en-cours-s-entrainer-1280.png`, paragraphe « Pense à un petit ridicule… »). « Observation » de la séance : dix phrases numérotées collées dans un paragraphe (`en-cours-fiche-seance-1280.png`, `nouvel-fiche-seance-375.png`). |
| D3 Mise en page 5 largeurs | 6 | Aperçu visiteur et gratuit : carte `max-w-3xl` collée à gauche, 480 px vides à droite à 1280 (`visiteur-s-entrainer-1280.png`, `gratuit-s-entrainer-1280.png`), ~1100 px à 1920 : faute dure du brief. Rubrique réelle : grille pleine coque, aucun débordement 375 à 1920. Fiches : colonne de lecture centrée, voulue. |
| D4 Cohérence espace | 9 | Gabarit C, titres, `gap-6`, mêmes cartes qu'Aujourd'hui. Réserve : le filet (D1). |
| D5 Finition | 8 | (a) Filet gris parasite en haut de chaque carte « À toi » des fiches (`en-cours-fiche-jeu-1280.png` y 584, idem séance, bilan, 375) : le `border-t pt-4` de `GesteFiche` n'a de sens que dans une carte de rafale. (b) « Ce qu'on aurait pu dire » : `<summary>` en gras sans chevron, lu comme un titre sans contenu (`en-cours-fiche-jeu-1280.png`, `visiteur-s-entrainer-1280.png`). Cibles 44 px, contrastes, focus : conformes (`min-h-11`, ring). |
| U1 Compréhension | 9 | H1, accroche, « Si tu as 5 minutes », « Marche n » : on sait où l'on est. |
| U2 Action principale | 8 | Une carte = un geste, bon. Mais 3 groupes de boutons Oui/À moitié/Rien + puces « Ton retour » sans priorité visuelle entre eux ; pendant les 3 s de pause ils ressemblent à des boutons éteints (`BoutonsReponse`, `aria-disabled` : bordure et texte `muted`, visibles sur toutes les captures) : l'action semble indisponible. |
| U3 États vides, nouvel | 9 | Nouvel abonné : 1 carte + Marche 1, jamais une page morte. Cas « C'est tout pour aujourd'hui » et mission absente gérés dans le code, non capturés. |
| U4 Aperçu Premium | 8 | Une fiche réelle, un seul bouton plein, « Connexion » : conforme à la spec v6. Mais le visiteur voit « Ce qu'on aurait pu dire » sans rien dessous : la valeur centrale du jeu n'est pas montrée, et le titre paraît cassé. |
| U5 Accessibilité, cohérence comptes | 9 | Focus, cibles, états en texte (coche + contour 2 px). Réserve : summary sans affordance. Bande : `Carnet` rogné par le « … » en visiteur 1280 (hors périmètre, à signaler au groupe bande). |

**NOTE GLOBALE : 6/10** (minimum = D3).

## Fautes dures

1. **Aperçu collé à gauche, vide à droite à 1280+** (D3). Fichier : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` l. 49. Correction : retirer `max-w-3xl` de l'`article` (pleine coque comme la rubrique réelle) et garder `max-w-prose`/`max-w-3xl` seulement sur le contenu interne, ou passer l'`article` en `md:grid md:grid-cols-[1fr_auto]` avec le bloc offre à droite. Fait 10 : carte pleine coque, offre alignée, plus de vide.
2. **« Ce qu'on aurait pu dire » = titre orphelin** (D5, U4, U5). Fichiers : `components/espace/fiche/corps-divers.tsx` (`CorpsJeu`, `<summary>` l. 80) et l'exemple d'aperçu (`apercu/exemple.tsx`, non lu, vérifier le même rendu). Correction : ajouter un chevron (`list-none` + icône `ChevronDown` qui pivote via `group-open:rotate-180`, `<details className="group …">`), classes `rounded-lg border border-border-input px-3` pour un vrai bouton de 44 px ; dans l'aperçu, ouvrir par défaut (`<details open>`) pour montrer la valeur au visiteur (pas de texte neuf).
3. **Filet parasite en haut de la carte « À toi »** (D5), 3 types de fiche. Fichiers : `carte/geste-fiche.tsx` l. 56 + `fiche.tsx` l. 153-164. Correction : prop `dansCarte` (défaut `true`) ; `fiche.tsx` passe `false` et `GesteFiche` n'applique alors ni `border-t` ni `pt-4`. Fait 10 : aucun trait avant « À TOI ».

## Pistes (ne retiennent pas la note)

- **Filet dégradé** sur `CARTE` (`carte/styles.ts` l. 11) : `relative overflow-hidden` + `before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-primary-hover before:to-accent-secondary-hover` pour parler la langue de l'accueil (monte D1 à 10, change toutes les cartes de l'espace : décision Thomas).
- **Longueur de ligne** de la mission : `max-w-prose` (ou `max-w-3xl`) sur le paragraphe d'énoncé dans `mission/mission-carte.tsx`.
- **Séance, « Observation »** : les dix phrases sont inline dans la consigne ; un rendu en liste serait plus lisible, mais cela touche la donnée (`CorpsSeance`, `e.consigne`) : à valider par Thomas, texte inchangé.
- **Boutons de réponse** pendant la pause : garder `border-border-input` et `text-text-secondary` (au lieu de `muted`/`border-border`) dans `BOUTON_SECONDAIRE` `aria-disabled:` pour que l'état « patiente » ne paraisse pas éteint.
- **Rafale à 2 cartes (1280)** : la carte de gauche finit 124 px plus haut que celle de droite (`items-start`) ; `items-stretch` donnerait deux cartes égales (les lignes de boutons à `mt-auto` si voulu).
- **Cohérence comptes** : « 10 secondes pour répondre » absent de la carte Soirée du compte `nouvel` alors que présent sur celle de `en-cours` (`nouvel-s-entrainer-1280.png` vs `en-cours-s-entrainer-1280.png`) ; le code ne le propose qu'à `carte-1` : à vérifier avec @fullstack, non tranché faute de preuve.
- **Bilan** : deux cartes intitulées « Refais une situation » à l'identique (contenu validé, signalé seulement).
