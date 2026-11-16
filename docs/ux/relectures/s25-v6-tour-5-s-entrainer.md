# Relecture UX à l'aveugle, s25 navigation v6, tour 5, groupe « s-entrainer »

Périmètre : `/mon-espace/s-entrainer` (visiteur, gratuit, en-cours, nouvel) et fiches jeu, séance, bilan (en-cours, nouvel). Captures `docs/captures/s25/v6-tour-5/s-entrainer/` et `.../fiches/` : 375, 768 (en-cours et nouvel), 1280, 1456 (survol), 1920. Code vérifié : `lien-retour.tsx` (cible `min-h-11` = 44 px), `boutons-reponse.tsx` (puces 44 px), `reponse-dabord.tsx`, `bilan-parcours.tsx`, `compte-a-rebours.tsx`.

## Constats

- Aperçu visiteur et gratuit : H1 centré, sous-titre, 1 fiche réelle lisible en entier (« Quelle réplique ? », réponse dépliée), un seul bouton plein « Premium · 1,99 €/mois », « Connexion » seulement pour le visiteur. Colonne `max-w-3xl` centrée aux 5 largeurs : conforme, pas un vide. Cadenas sur les 5 rubriques, S'entraîner allumé et centré à 375.
- Abonnés : 3 cartes (2 « Si tu as 5 minutes », 1 « Marche ») à filet violet, rythme aéré, même gabarit que l'aperçu. Nouvel abonné : 2 cartes (1 séance de 5 min + « Marche 1 »), jamais une page morte.
- Écart apparent en-cours / nouvel : la puce « 10 secondes pour répondre » n'existe que chez en-cours. Ce n'est pas un défaut : `compte-a-rebours.tsx` ne rend rien « à la toute première carte » ni tant qu'aucune durée n'a été essayée.
- Fiches : gabarit lecture `max-w-3xl` centré, titre et « Retour : S'entraîner » alignés sur la colonne ; état allumé de la bande correct (S'entraîner pour jeu et séance, Parcours pour bilan). Cible du retour : `min-h-11` OK. Puces « Ton retour » et réponses : 44 px, OK. « Enregistrer » est désactivé tant que le champ est vide (exempté de contraste).
- Aucun débordement, aucune colonne collée à gauche, 375 sans défilement horizontal de page. Bande défilante à 375 et 768 (chip actif centré, chip suivante tronquée = signal de défilement voulu).

## Faute dure

**F1. Bilan (`fiche-bilan`, en-cours et nouvel, 375 à 1920) : la carte « À TOI » donne la réponse de la carte « Remets ta réponse dans l'ordre » avant que le lecteur ait répondu.** La carte « ordre » est verrouillée derrière « Ta réponse d'abord » (retour rendu seulement après le toucher, `bilan-parcours.tsx` l.109-113), mais la carte « À TOI » en bas (geste « à voix haute » repris par la fiche) est rendue d'emblée et énonce en clair la réponse entière dans le bon ordre (« Après tout le monde, oui. C'est mon rôle : … Tu me remercieras. »). Le lecteur voit donc la solution sans jouer, ce qui contredit le principe de la page (« Ta réponse d'abord », « la suite n'est rendue qu'après le toucher »). Correction codable : ne rendre la carte « À TOI » du bilan qu'après la réponse à la carte « ordre » (état levé dans `BilanParcours`, passé à `GesteFiche`), ou la placer sous le retour de cette carte. Aucun texte modifié. Fichiers : `apps/web/src/components/espace/fiche/bilan-parcours.tsx`, `apps/web/src/components/espace/carte/geste-fiche.tsx`.

## Pistes (ne retiennent pas la note)

- P1. Bilan : deux cartes consécutives au titre identique « Refais une situation » ; seul le contexte les distingue. Titre éditorial validé : à signaler, pas à réécrire.
- P2. Aperçu visiteur : le lien « Connexion » est un lien souligné de 14 px de haut à côté du bouton de 44 px ; vérifier que sa zone tactile atteint 44 px (`min-h-11`, non vérifié dans le code de l'aperçu).
- P3. Fiches : titre et retour alignés à gauche de la colonne alors que l'aperçu et la rubrique centrent leur H1 ; c'est le gabarit fiche (A) contre le gabarit rubrique (B), cohérent avec le reste de l'espace.

## Notes

| Critère | Note | Justification |
|---|---|---|
| Design 1 Fidélité accueil | 10 | Cartes `rounded-xl`, filet violet, centrage, rythme aéré |
| Design 2 Hiérarchie | 10 | H1 / titre de carte / étiquettes nets |
| Design 3 Mise en page 5 largeurs | 10 | Colonne centrée, aucun débordement |
| Design 4 Cohérence espace | 10 | Mêmes cartes, puces et retour que les autres pages |
| Design 5 Finition | 9 | P2 non vérifié ; reste conforme (44 px, focus) |
| UX 1 Compréhension | 10 | Titre, sous-titre, bande allumée |
| UX 2 Action principale | 8 | Bilan : la solution s'affiche avant la réponse (F1) |
| UX 3 États vides / nouvel | 10 | Nouvel abonné : 2 cartes utiles |
| UX 4 Aperçu Premium | 10 | Un exemple réel, un seul bouton plein, pas de mur |
| UX 5 Accessibilité, cohérence | 9 | Cibles 44 px, états cohérents entre comptes |

NOTE GLOBALE : 8/10 (minimum des critères, une faute dure)
