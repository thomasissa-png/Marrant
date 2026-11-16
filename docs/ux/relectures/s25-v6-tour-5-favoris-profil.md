# Relecture à l'aveugle s25 v6, tour 5, groupe « favoris-profil »

Périmètre : `/favoris` (visiteur, gratuit, en-cours, nouvel) et `/profil` (gratuit, en-cours, nouvel). Captures `docs/captures/s25/v6-tour-5/{favoris,profil}/`, 375, 1280, 1920 de chaque compte, plus 768 et 1456 non ouvertes (aucun doute de mise en page, 1280/1456/1920 partagent la coque `max-w-7xl`). Étalon : accueil. Lecture du code pour les cibles tactiles : `button.tsx` (`sm` = `h-8 max-md:h-11`, donc 44 px sous 768, et `md:h-11` ou `min-h-11` ajoutés ouvrent 44 px dès 768), `favoris-list.tsx`, `profil-dashboard.tsx`, `abonnement-card.tsx`, `supprimer-compte-card.tsx`, `prenom-card.tsx`, `apercu-rubrique.tsx`, `carte/styles.ts`.

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 9 |
| Design 2 hiérarchie et lisibilité | 9 |
| Design 3 mise en page 5 largeurs | 9 |
| Design 4 cohérence avec l'espace | 9 |
| Design 5 finition (alignements, AA, 44 px) | 8 |
| UX 1 compréhension | 9 |
| UX 2 action principale | 9 |
| UX 3 états vides et nouvel abonné | 10 |
| UX 4 aperçu Premium | 9 |
| UX 5 accessibilité et cohérence entre comptes | 8 |
| **Globale (minimum)** | **8/10** |

Barre de 9 non atteinte : une faute dure (cible sous 44 px, vérifiée dans le code).

## Faute dure

**F1. « Renoncer au contrat ici » : lien isolé de 12 px de haut** (`en-cours-profil-1280.png`, `nouvel-profil-375.png`, carte Abonnement, comptes abonnés). Code : `apps/web/src/components/profil/abonnement-card.tsx` l. 153-157, `<p className="mt-4 text-xs"><Link ... className="text-text-muted underline underline-offset-2 ...">`. Aucune classe `min-h-11` ni `inline-flex` : la cible fait la hauteur d'une ligne `text-xs` (environ 16 px), seule sur sa ligne, donc pas l'exception « lien dans une phrase ». Le critère 6 de la spec v6 et toutes les autres liens isolés de l'espace (`LIEN` = `min-h-11`) exigent 44 px ; c'est de plus le lien de rétractation légal, qui doit être facile à toucher. Correction : ouvert seulement (`ESPACE_CLIENT_PUBLIE`, fermé = classes d'avant), classes du lien `inline-flex min-h-11 items-center` (retirer le `text-xs` du `<p>` ou le garder sur le lien). Ferait 10 : cible 44 px, texte et soulignement inchangés.

## Pistes (ne retiennent pas la note)

- **P1. Aperçu Favoris : rien ne dit « favori »** (`visiteur-favoris-1280.png`, `gratuit-favoris-375.png`). Une vanne et un conseil, avec leurs seules pastilles « Vanne » / « Conseil », sous le titre « Favoris » et le sous-titre validé. Rien ne montre le geste (étoile, « Retirer »), alors que le commentaire de `apercu-rubrique.tsx` annonce « présentés comme des favoris ». Idée : une étoile pleine (icône, `aria-hidden`) à la place du bouton « Retirer » dans `components/espace/apercu/exemple.tsx` (`ExempleFavoris`). Aucun texte nouveau. Aurait fait 10 en UX 4.
- **P2. Cartes de favoris sans rôle ni état** : `favoris-list.tsx` l. 308-314 et 391-397, `<Card tabIndex={0} onClick>` sans `role="button"` ni `aria-expanded` (la chute ou l'exemple se déplie sans que le lecteur d'écran l'annonce). Atteignable au clavier, donc piste ; à ajouter avec le prochain passage (`role="button" aria-expanded={isRevealed}`). Si Thomas veut une barre stricte sur 4.1.2, elle passe en faute dure.
- **P3. « Retirer » sans retour** : un toucher retire le favori sans annulation visible (`en-cours-favoris-375.png`). Réversible depuis le catalogue ; un « Annuler » transitoire (toast) serait un texte nouveau, à valider par Thomas.
- **P4. État vide de Favoris** : les 4 onglets (Tout, Vannes, Conseils, Vidéos) restent affichés sur une liste vide (`nouvel-favoris-1280.png`). Inoffensif, la carte vide porte une seule action « Explorer les vannes ». Les emojis des états vides (`favoris-list.tsx` l. 70-97) vont contre « zéro emoji » de la spec pour les nouveaux libellés ; non nouveaux ici, donc non retenu.
- **P5. Profil, carte « Supprimer mon compte » à 1280 et 1920** : texte à gauche (`max-w-prose`), bouton à l'extrémité droite, 380 px de vide entre les deux (`gratuit-profil-1920.png`). Choix du tour 4 (point 5) et plus sûr pour une action destructive : conforme, non retenu.
- **P6. Profil gratuit** : le sous-titre « Ta progression, tes stats, ton parcours vers la légende » promet ce que la page ne montre pas (rien de progression ni de stats, `gratuit-profil-1280.png`). Texte validé, signalé seulement. « Prochaine étape » propose trois liens de même poids ; l'offre est dans la carte Abonnement (un seul bouton plein de page, plus celui de l'en-tête).
- **P7. Textes `text-xs` en `text-muted`** (étiquettes de statistiques, note de la lettre, 11-12 px) : contraste AA vérifié (`#9A9A9A` sur `#1F1F1F`, environ 6:1) mais lecture pénible à 375 (`en-cours-profil-375.png`).

## Ce qui est conforme (vérifié)

- Favoris abonné : grille 3 colonnes à 1280 et plus, 1 colonne à 375, onglets qui défilent avec indice de suite, « Retirer » et onglets en `min-h-11`, états vides par onglet avec une action.
- Profil : colonne 2 cartes dès `lg`, hauteurs égales, aucun vide à droite ni colonne collée à gauche, aucun débordement à 375. Nouvel abonné : « Prochaine étape » en tête, « Mes parcours » vide avec « Découvrir les parcours », jamais de page morte.
- Cibles : « S'abonner », « Enregistrer », « Voir tout », « Supprimer mon compte », « Mes questions » et « Connexion » (aperçu) sont à 44 px (`min-h-11`, `max-md:h-11` + `md:h-11`).
- Aperçu : même gabarit pour visiteur et gratuit, un seul bouton plein, « Connexion » seulement pour le visiteur, pas de mur ni de redirection.

## Cohérence entre comptes

Bande identique aux 4 comptes, cadenas aux visiteur et gratuit seulement, chip « Favoris » allumé sur `/favoris`. Sur `/profil` aucun chip allumé, icône du compte allumée (spec §4).
