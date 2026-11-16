# Relecture à l'aveugle, s25 navigation v6, tour 4, groupe « bibliotheque »

Périmètre : `bibliotheque/` (visiteur, gratuit, en-cours, nouvel) et `fiches/` construction, formule, vocabulaire, humour-noir, a-plat (en-cours, nouvel). Captures : `docs/captures/s25/v6-tour-4/`. Ouvertes : 375, 1280, 1920 de chaque compte de la bibliothèque (et 768 pour en-cours), 375, 1280 et 1920 sur les fiches (les 5 types en en-cours, les types utiles en nouvel). Aucune relecture existante, aucun commit, ni REPLIT_ACTIONS.md lus.

Vérifié dans le code : `LienRetour` (`min-h-11`), pastilles de thèmes (`min-h-11`), `LIEN` (`min-h-11`), `SOMMAIRE_REPLIABLE` (`min-h-11`), `BOUTON_SECONDAIRE` (`min-h-11`), `puce` (`min-h-11`). Toutes les cibles sont à 44 px, aucune faute dure de ce côté.

## Constat par compte

- **visiteur / gratuit** (aperçu Premium) : H1 centré, sous-titre validé, une fiche réelle lue en entier (« Le faux secret »), carte `rounded-xl` à filet violet, bloc offre avec un seul bouton plein (visiteur : + lien « Connexion », gratuit : bouton seul). Bande identique avec cadenas, « Bibliothèque » allumée. Mêmes pages aux 3 largeurs, colonne de 768 px centrée à 1280 et 1920, rien de collé à gauche, aucun débordement.
- **en-cours / nouvel** (liste) : H1 centré, deux colonnes dès 768 (vannes + humour noir + construit à gauche, vocabulaire + formules à droite), 1 colonne à 375. Les deux comptes sont identiques (seul le point de la cloche diffère) : cohérent, la bibliothèque est la même pour un nouvel abonné, jamais de page morte.
- **fiches** : gabarit A cohérent sur les 5 types : « Retour : Bibliothèque » (ou « Quoi répondre »), H1, étiquette + durée, carte de contenu, carte « À toi » (retour en pastilles, réplique, Enregistrer désactivé tant que vide). Chip de la bande allumé juste (Bibliothèque pour construction, formule, vocabulaire, humour-noir ; Quoi répondre pour a-plat). Pastilles et boutons à 44 px.

## Notes

| Critère | Note | Défaut / ce qui ferait 10 |
|---|---|---|
| D1 Fidélité à l'accueil | 9 | Cartes, filet, pastilles, titres centrés des listes conformes. Les fiches (gabarit A) ont un H1 aligné à gauche dans une colonne de 768 px, alors que les rubriques et l'aperçu sont centrés. Piste (gabarit A voulu, lecture longue) : `fiche.tsx` ligne 120 à 145, `EN_TETE_CENTRE` sur le bloc titre si Thomas veut l'unité. |
| D2 Hiérarchie et lisibilité | 10 | Titres, sections en gras, grisé pour les contre-exemples : lisible. |
| D3 Mise en page 5 largeurs | 9 | `en-cours-bibliotheque-1280.png` et `-1920.png` : colonne gauche finit à y=1408, colonne droite à y=1540 (soit ~130 px de vide sous « Comment c'est construit »). Léger, non bloquant. Piste : `bibliotheque/page.tsx` ligne 77, passer en grille deux colonnes explicites (gauche : vannes + humour noir + construit ; droite : vocabulaire + formules) ou accepter. |
| D4 Cohérence avec l'espace | 10 | Même carte, même filet, même `Retour`, mêmes pastilles que les autres rubriques. |
| D5 Finition | 10 | Cibles 44 px vérifiées au code, alignements nets, contrastes lisibles (gris « Trop flou » ≈ AA sur carte). |
| U1 Compréhension | 10 | H1 clair, bande allumée, 3 groupes titrés, retour explicite sur les fiches. |
| U2 Action principale | 9 | Liste : plusieurs entrées égales, normal pour une bibliothèque ; aucune action principale concurrente. Fiche : parcours lire, puis « À toi », clair. Piste : « Entrer » de l'humour noir et la fiche d'accueil du coin répètent le même geste en deux écrans (`coin-humour-noir.tsx`), voulu (porte d'entrée). |
| U3 États vides / nouvel abonné | 10 | Nouvel abonné : bibliothèque complète, jamais vide. Fiches du nouvel : mêmes états que l'abonné avancé, Enregistrer désactivé lisible. |
| U4 Aperçu Premium | 9 | Valeur visible (une vraie fiche en entier), un seul bouton plein de page, pas de mur. Piste : une seule fiche montrée, rien n'indique l'étendue de la bibliothèque (3 groupes, une trentaine de fiches, l'humour noir). Spec autorise 1 à 3 éléments ; ajouter 2 cartes titre + début (« Vocabulaire », « Formules à détourner ») ferait 10 : `components/espace/apercu/apercu-rubrique.tsx`, contenu à valider par Thomas. Le bouton d'en-tête et celui de la page sont deux boutons pleins identiques, accepté (en-tête existant). |
| U5 Accessibilité et cohérence | 10 | Même bande, même ordre, pastilles à 44 px, focus visible codé, retour pour les 3 états. |

## Fautes dures

Aucune.

## Pistes (ne retiennent pas la note)

1. Vide de ~130 px sous la colonne gauche de la liste à 768+ (`bibliotheque/page.tsx`).
2. H1 des fiches aligné à gauche, contre centré ailleurs (`components/espace/fiche.tsx`), à trancher par Thomas.
3. Aperçu : montrer l'étendue de la rubrique (à valider par Thomas), `components/espace/apercu/apercu-rubrique.tsx`.

NOTE GLOBALE : 9/10
