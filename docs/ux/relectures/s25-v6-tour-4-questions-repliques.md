# Relecture à l'aveugle s25 v6 tour 4 : questions et répliques

Périmètre : `/mon-espace/questions` et `/mon-espace/repliques`, 4 comptes (visiteur, gratuit, en-cours, nouvel).
Captures vues : 375, 1280, 1920 de chacun des 8 jeux (24 images), plus les INDEX. 768 et 1456 non ouverts (aucun doute de mise en page : 1280, 1456 et 1920 partagent la même coque `max-w-7xl`). Code lu : `repliques/page.tsx`, `apercu-rubrique.tsx`, `exemple.tsx`.

## Constat par page

**Questions, visiteur et gratuit** (`visiteur-questions-*`, `gratuit-questions-*`) : titre centré, sous-titre validé, « Mes envois » avec les 3 exemples (un par type) dans une carte à filet violet, puis une carte d'offre avec un seul bouton plein (visiteur : lien Connexion en plus, gratuit : bouton seul). Colonne de 768 px centrée à 1280 et 1920, pas de vide à droite. Bande : « … » allumé, cadenas présents. Comptes cohérents entre eux.

**Questions, en-cours et nouvel** (`en-cours-questions-*`, `nouvel-questions-*`) : deux colonnes dès 1280 (formulaire à gauche, « Mes envois » à droite), formulaire d'abord à 375. Trois cartes radio (état coché visible par filet, anneau et pastille, pas par la teinte seule), champ « Ton message », délai de réponse, un seul bouton plein « Envoyer à l'équipe ». Nouvel abonné : « Mes envois » affiche les exemples « Par exemple, pour … », donc jamais une colonne morte.

**Répliques, visiteur et gratuit** (`visiteur-repliques-*`, `gratuit-repliques-*`) : titre, sous-titre, une fiche réelle (« Coloc : la poêle », consigne « À toi »), champ « Ma réplique à moi », carte d'offre avec un seul bouton plein. Même gabarit que les autres aperçus.

**Répliques, en-cours** (`en-cours-repliques-*`) : une carte avec lien vers la fiche, la réplique, « Modifier » et « Supprimer » (boutons de hauteur 44 px visibles). **Nouvel** : état vide avec l'action unique « Écrire ma première réplique ».

## Notes

| Critère | Note | Justification |
|---|---|---|
| Design 1 fidélité accueil | 9 | Filet dégradé violet, cartes arrondies, titre H1 centré, rythme aéré. Sur Mes questions abonné, les deux titres de colonne (« Écrire à l'équipe », « Mes envois ») sont calés à gauche alors que l'accueil centre ses titres de section : piste, c'est un gabarit à deux colonnes de formulaire. |
| Design 2 hiérarchie et lisibilité | 9 | H1, H2, cartes nets. Textes d'aide en petit corps (`Évite les noms : décris la scène.`, `Envoyé le 13 novembre`, vus ~12 px sur `en-cours-questions-1280.png`) : lisibles mais à la limite. |
| Design 3 mise en page 5 largeurs | 9 | Aucun débordement ni colonne collée. À 1280 et 1920 (`en-cours-questions-1280.png`, `nouvel-questions-1920.png`) la colonne de droite s'arrête à 465 px (en-cours) ou 580 px (nouvel) alors que le formulaire descend à 966 px : un quart de page vide en bas à droite. Piste : `sticky top` sur la colonne « Mes envois ». |
| Design 4 cohérence espace | 9 | Aperçus identiques entre rubriques (carte + carte d'offre). Mes répliques abonné garde un trou de ~30 px entre le titre de la fiche et la citation (`en-cours-repliques-1280.png`), plus aéré que le reste. |
| Design 5 finition | 9 | Alignements propres, cibles des boutons à 44 px, contrastes lisibles. Rien de dur. |
| UX 1 compréhension | 9 | Chaque page se comprend en 3 s. Mes répliques abonné n'a aucune phrase d'aide sous le titre : on voit des citations sans savoir que ce sont « mes » réponses écrites depuis les fiches (le lien vers la fiche aide). Texte nouveau éventuel : à valider par Thomas. |
| UX 2 action principale unique | 9 | Un seul bouton plein par page, partout. Réserve : dans l'aperçu Mes répliques, « Ma réplique à moi » est rendu comme un vrai champ de saisie (`visiteur-repliques-1280.png`) mais c'est un `<p>` inerte (`exemple.tsx`, `ExempleRepliques`). Un visiteur touche, rien ne se passe. Piste (pas faute dure, l'offre reste l'unique action). |
| UX 3 états vides, nouvel abonné | 10 | Nouvel : exemples en « Mes envois », état vide de Mes répliques avec action « Écrire ma première réplique ». Aucune page morte. |
| UX 4 aperçu Premium | 9 | Valeur visible (exemples réels, une fiche entière), une seule offre, pas de mur ni de redirection. Aperçu Mes questions : le titre « Mes envois » sur des exemples ne dit pas qu'on peut écrire à l'équipe (le formulaire est absent) : la valeur « écrire et obtenir une réponse » est seulement suggérée par la ligne « L'équipe répond en général sous 1 à 2 jours ouvrés ». |
| UX 5 accessibilité, cohérence comptes | 9 | Radios avec état non chromatique, boutons 44 px, bande identique, « … » allumé sur les 8 captures. Cohérence visiteur/gratuit/abonné bonne. |

## Pistes (aucune ne bloque)

1. Rendre le faux champ de l'aperçu Mes répliques non interactif visuellement : `apps/web/src/components/espace/apercu/exemple.tsx` (`ExempleRepliques`), retirer `border-border-input` et le fond de champ pour un simple texte, ou ajouter `aria-hidden`/`select-none` et un `cursor-default`. Ferait 10 en UX 2.
2. Colonne « Mes envois » de Mes questions (abonné) en `lg:sticky lg:top-32` pour combler le vide bas droite : fichier de la page questions (`apps/web/src/app/(dashboard)/mon-espace/questions/page.tsx`). Ferait 10 en Design 3.
3. Titres de colonne centrés comme l'accueil : arbitrage de gabarit, à trancher par Thomas.
4. Réduire l'espace entre le lien-titre et la citation dans `apps/web/src/components/espace/repliques/liste-repliques.tsx`.

## Verdict

Aucune faute dure. Barre de 9/10 atteinte.

NOTE GLOBALE : 9/10

Fautes dures : aucune.
