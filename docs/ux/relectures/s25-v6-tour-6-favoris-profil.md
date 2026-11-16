# Relecture à l'aveugle s25 v6, tour 6 : favoris et profil

Périmètre : `favoris/` (visiteur, gratuit, en-cours, nouvel) et `profil/` (gratuit, en-cours, nouvel). Captures `docs/captures/s25/v6-tour-6/`, ouvertes : 375, 768 (favoris en-cours, profil en-cours), 1280, 1920 de chaque compte, 1456 non ouvert (même coque `max-w-7xl` que 1280 et 1920, aucun doute). Code lu : `favoris-list.tsx`, `profil-dashboard.tsx`, `abonnement-card.tsx`, `supprimer-compte-card.tsx`, `prenom-card.tsx`, `ligne-mes-questions.tsx`, `rappel-parcours-toggle.tsx`, `share-button.tsx`, `button.tsx`, `tailwind.config.ts`.

Les boutons du portail d'abonnement (Gérer, Changer de formule, Résilier) sont jugés au code : `size="sm"` donne 44 px sous 768 (`max-md:h-11`) et `md:h-11` les garde à 44 px dès 768 quand l'espace est ouvert. Le lien « Renoncer au contrat ici » est en `min-h-11`. Conformes.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 9 |
| Design 2 hiérarchie et lisibilité | 9 |
| Design 3 mise en page 5 largeurs | 9 |
| Design 4 cohérence avec l'espace | 9 |
| Design 5 finition | 9 |
| UX 1 compréhension | 9 |
| UX 2 action principale unique | 9 |
| UX 3 états vides et nouvel abonné | 10 |
| UX 4 aperçu Premium | 9 |
| UX 5 accessibilité et cohérence entre comptes | 9 |
| **Globale (minimum)** | **9/10** |

Fautes dures : aucune. Barre de validation (9/10 sans faute dure) atteinte. Toutes les remarques ci-dessous sont des pistes.

## Ce qui est conforme (vérifié)

- Favoris abonné 1280 et 1920 : 3 cartes `rounded-xl` à filet violet, colonnes égales, de même hauteur, coque pleine, aucun vide à droite. 768 : 2 colonnes, carte impaire en pleine rangée. 375 : pile, onglets qui défilent avec indice de suite.
- Favoris nouvel : état vide complet (étoile, titre, phrase, un seul bouton plein « Explorer les vannes »), onglets présents, jamais une page morte.
- Aperçu Favoris (visiteur, gratuit) : H1, sous-titre validé, une fiche lisible en entier, un seul bouton plein, « Connexion » seulement pour le visiteur, colonne centrée de 768 px dans la coque à 1280 et 1920 (centrée, pas collée à gauche).
- Cibles : onglets et « Retirer » `min-h-11`, Partager `h-11 w-11` (pastille 32 px dans une cible de 44), boutons `sm` du profil 44 px (`CIBLE_44_MD` + `max-md:h-11`), interrupteur et liste déroulante du rappel `min-h-[44px]`, bouton Enregistrer `min-h-11 md:h-11`.
- Profil en-cours : « Reprendre l'étape 3 » est l'unique action pleine du haut de page (10 sur ce critère pour ce compte). Profil nouvel : « Prochaine étape » en tête, état vide de « Mes parcours » avec « Découvrir les parcours ». Profil gratuit : un seul bouton plein dans la page (« S'abonner · 1,99 €/mois »).
- Contrastes lus au thème : `text-muted` #9A9A9A, `text-secondary` #B3B3B3 sur #1F1F1F (AA), `error-text` #F87171 sur carte (AA), bordure de champ `border-input` #707070.

## Pistes (aucune ne bloque ; la correction est codable)

1. **Ligne « Ta question à l'équipe » (profil en-cours et nouvel, 1280 à 1920)** : une carte de 1216 px pour une phrase de 250 px, sans titre, seule de son espèce parmi des cartes titrées ; vide à droite visible. Correction : fusionner la phrase dans la carte « Rappel de parcours » ou en pied de « Ton prénom », ou lui donner un titre et un bouton `outline-accent` à droite (texte à valider par Thomas). Fichiers : `components/profil/profil-dashboard.tsx` (bloc `data-profil-questions-cadre`), `components/espace/profil/ligne-mes-questions.tsx`. Ferait 10 au design 3 et 4.
2. **Nouvel abonné et inscrit gratuit : trois tuiles « Prochaine étape » de même poids, aucune action pleine en tête** : la première tuile devrait porter l'action (violet plein ou badge « Commence ici »). Fichier : `profil-dashboard.tsx` (const `prochaineEtape`). Ferait 10 à UX 2.
3. **Onglets des favoris : `role="tab"` sans `role="tabpanel"`, sans `aria-controls`, sans flèches clavier** (`favoris-list.tsx`, `RangeeFavoris` et `components/espace/rangee-onglets.tsx`). Soit le motif complet (tabindex itinérant, panneau étiqueté), soit des boutons `aria-pressed` sans rôle `tab`. Ferait 10 à UX 5.
4. **Cartes vanne et conseil cliquables : `div` avec `tabIndex=0`, `onClick`, sans `role="button"` ni `aria-expanded`** (`favoris-list.tsx`, `<Card ... tabIndex={0}>` des cas JOKE et TIP). Ajouter `role="button"` et `aria-expanded={isRevealed}` ou `{isExpanded}`. Même fichier, même note.
5. **« Retirer » sans retour possible** : un toucher supprime le favori, sans annulation (Nielsen 3). Piste : toast « Retiré. Annuler » (texte à valider par Thomas). Fichier : `favoris-list.tsx`, `stores/favorites-store.ts`.
6. **Bouton `outline` (Enregistrer, 375 et 1280) à bordure `border-border` #2A2A2A** sur carte #1F1F1F, environ 1,2:1 : l'étiquette suffit à l'identifier, mais le contour disparaît. Piste : `border-border-input` sur ce bouton (`components/profil/prenom-card.tsx`). Piste voisine : piste de l'interrupteur éteint du rappel en `border-border-hover` (`app/(dashboard)/profil/rappel-parcours-toggle.tsx`), la pastille blanche porte l'état.
7. **Décalage de 4 px** entre le premier texte d'une vanne (y 412) et le titre d'un conseil (y 408) dans la même rangée (1280 et 1920), parce que la vanne est en `CardContent` et le conseil en `CardHeader`. Aligner les deux gabarits (`favoris-list.tsx`).
8. **Aperçu Favoris** : il montre une vanne et un conseil, sans rien qui dise « ce sont tes favoris » (pas de tuile « Retirer » ni d'onglets factices). Le sous-titre validé suffit à la spec ; une légende serait à valider par Thomas.
9. **Cadenas du chip Favoris** (visiteur et gratuit) alors que la spec v6 §2 dit « groupes 2 et 3 ouverts » : cohérent avec le produit (favoris Premium), mais la spec est à mettre à jour. Hors périmètre (bande).
10. **Profil abonné en état `premium-hors-stripe`** (celui de la préversion) : ni « Gérer » ni « Résilier » dans `abonnement-card.tsx`, c'est la logique voulue (aucun portail possible) ; à surveiller côté juridique si un compte réel tombe dans cet état.

NOTE GLOBALE : 9/10
