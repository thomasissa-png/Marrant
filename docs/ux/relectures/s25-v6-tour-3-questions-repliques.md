# Relecture UX à l'aveugle, tour 3 : Mes questions + Mes répliques (navigation v6)

Captures : `docs/captures/s25/v6-tour-3/{questions,repliques}/` (4 comptes x 5 largeurs lues en échantillon représentatif : 375, 768, 1280, 1920 ; 1456 identique à 1280 d'après les hauteurs de l'INDEX). Code : `apps/web/src/app/(dashboard)/mon-espace/questions/page.tsx`, `.../repliques/page.tsx`.

## Constat par compte
- **Visiteur / gratuit** : page d'aperçu centrée (H1 + sous-titre validé), carte à filet violet, bloc offre avec un seul bouton plein (+ lien Connexion pour le visiteur seulement : cohérent). Chip « … » allumé. Propre aux 5 largeurs.
- **Abonné avancé, Questions** : 2 colonnes à 1280+ (formulaire / Mes envois), pleine coque, une réponse repliable. Solide.
- **Abonné avancé, Répliques** : H1 aligné à gauche, une seule carte de 768 px collée à gauche.
- **Nouvel abonné, Questions** : formulaire + « Mes envois » rempli d'exemples. **Répliques** : message vide + bouton « Écrire ma première réplique » (bon).

## Grille

| Critère | Note | Défaut / évidence |
|---|---|---|
| D1 Fidélité accueil | 9 | Filet violet, `rounded-xl`, titres Plus Jakarta : conforme. Les pages abonné ont le H1 à gauche, l'accueil et les aperçus l'ont centré (piste). |
| D2 Hiérarchie | 9 | RAS. Textes d'aide ~12 px (« Évite les noms », « Envoyé le 12 novembre ») : limite, piste. |
| D3 Mise en page 5 largeurs | **6** | **FAUTE DURE** : `en-cours-repliques-1280/1456/1920.png` et `nouvel-repliques-1280/1456/1920.png` : carte `max-w` ~768 px collée à gauche, 450 px vides à droite à 1280, ~800 px à 1920. Brief : « aucun vide à droite à 1280+, aucune colonne collée à gauche ». Questions, elle, remplit la coque (incohérence entre les deux pages sœurs). |
| D4 Cohérence espace | 8 | Questions = 2 colonnes pleine coque ; Répliques = colonne étroite gauche ; aperçu centré pour les mêmes pages. Trois gabarits pour deux rubriques voisines. |
| D5 Finition | 9 | Cibles 44 px OK (Modifier, Supprimer, Envoyer), focus non visible en capture statique (non évaluable). |
| U1 Compréhension | 9 | Titre clair, sous-titre d'aperçu explicite. |
| U2 Action principale | 9 | Une action par état. Répliques abonné : lien « Coloc : la poêle » souligné + Modifier/Supprimer, correct. |
| U3 États vides | 8 | Répliques vide : parfait. Questions nouvel (`nouvel-questions-1280/768/375.png`) : « Mes envois » affiche de faux envois d'exemple sans phrase explicite « Tu n'as encore rien envoyé » ; le 1er exemple est introduit par une phrase, les 2 autres par des pastilles (traitement incohérent) ; la ligne « L'équipe répond sous 1 à 2 jours » apparaît deux fois sur la page (formulaire et exemples). Pas une page morte, donc piste forte, pas faute dure. |
| U4 Aperçu Premium | 8 | Valeur visible, un seul bouton, pas de mur. Mais Répliques montre un champ de saisie d'apparence active (`visiteur-repliques-1280.png`) : un visiteur peut croire pouvoir écrire ; Questions montre l'historique, pas le formulaire « Écrire à l'équipe » qui est la vraie valeur. Piste : champ désactivé visuellement (`aria-disabled`, `opacity`) ou rendu en texte. |
| U5 Accessibilité / cohérence comptes | 8 | Mêmes libellés entre comptes, bon. Alignement du H1 qui change selon le compte (centré/gauche) = incohérence perçue. Mobile `en-cours-questions-375.png` : la réponse de l'équipe tombe sous le formulaire (~900 px de scroll) : piste, afficher Mes envois avant le formulaire quand il y a une réponse non lue. |

**NOTE GLOBALE (minimum) : 6/10.** Barre de 9/10 non atteinte.

## Correction codable de la faute dure
- `repliques/page.tsx` : remplacer le conteneur étroit (`max-w-3xl`/équivalent, non centré) par la coque pleine de Questions. Cartes en grille `grid gap-6 md:grid-cols-2 xl:grid-cols-3` (une carte par réplique) ; état vide : carte centrée `mx-auto max-w-xl text-center` ou 2 colonnes (carte vide + courte explication de la rubrique).
- Ce qui fait 10 : même gabarit que Questions à 1280/1456/1920, aucun vide de plus de ~1 colonne, H1 aligné pareil sur les 4 comptes (soit tous centrés comme l'accueil, soit tous à gauche).

## Pistes (ne retiennent pas la note seules)
1. Questions nouvel : phrase d'état vide explicite [texte à valider par Thomas] et exemples uniformes, une seule mention du délai.
2. Aperçu Répliques : champ non interactif.
3. Mobile : Mes envois avant le formulaire si réponse disponible.
4. Texte d'aide 12 px : passer à 14 px (`text-sm`).
5. Répliques abonné : afficher la consigne et la date sous le titre de la fiche (contexte de la réplique).

## Handoff
@fullstack : `repliques/page.tsx` (faute dure), `questions/page.tsx` (pistes 1, 3). Bande et en-tête hors périmètre ; à 375 le chip « … » recouvre « Quoi répondre » tronqué sans fondu visible (à signaler au groupe bande).
