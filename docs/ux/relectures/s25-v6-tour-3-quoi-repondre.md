# Relecture UX à l'aveugle, tour 3 : Quoi répondre + fiche situation (navigation v6)

Périmètre : `docs/captures/s25/v6-tour-3/quoi-repondre/` (visiteur, gratuit, en-cours, nouvel, 5 largeurs, toutes ouvertes) et `v6-tour-3/fiches/*-fiche-situation-*.png` (en-cours, nouvel, 5 largeurs, toutes ouvertes). Lues contre : étalon accueil 1280, navigation v6, brief. Aucun texte validé n'est réécrit ; tout texte proposé est « à valider par Thomas » et ne retient pas la note.

## Constat par écran

- **Aperçu Premium (visiteur, gratuit)** : H1 centré « Quoi répondre » + sous-titre validé, une carte `rounded-xl` à filet violet contenant la fiche « Coloc : la poêle » (scène, « Ta réponse d'abord », Oui / À moitié / Rien), puis un bloc offre à filet violet : bouton Premium + lien Connexion (visiteur) ou bouton seul (gratuit). Chip « Quoi répondre » allumé avec cadenas. Colonne de 768 px centrée à 1280, 1456 et 1920, sans vide à droite ni débordement ; à 375 la carte tient en pleine largeur. Cohérent entre visiteur et gratuit (seul le lien Connexion diffère, logique).
- **Liste abonné (en-cours, nouvel)** : H1 aligné à gauche, bouton « Le carnet du mois », deux rangées de pastilles de filtre (« Où et avec qui », « Pour quoi faire »), puis 11 sections (Coloc 4 ... Rattraper un faux pas 10) en grille 2 colonnes (1 colonne à 375), lignes de 55 px environ avec chevron. Le badge « Fait » apparaît sur « La poêle » pour l'abonné avancé. À 375 les filtres sont repliés dans « Filtrer les cartes ».
- **Fiche situation** : retour « Retour : Quoi répondre », H1 à gauche, deux cartes à filet violet (« La scène » puis « À toi »), colonne de 768 px centrée à 1280+. État avancé : badge « Fait », « Essayé, ça a marché » coché, réplique enregistrée avec Enregistrer / Supprimer. État nouvel : champ vide avec placeholder, Enregistrer désactivé, compteur 0 / 200.

## Grille

### Design

| Critère | Note | Défaut / évidence | Correction codable | Ce qui ferait 10 |
|---|---|---|---|---|
| 1 Fidélité à l'accueil | 10 | Filet dégradé violet, `rounded-xl`, titre centré dans l'aperçu : conforme | - | - |
| 2 Hiérarchie, lisibilité | 9 | Liste abonné : 60 lignes de même poids visuel, rien ne distingue une entrée prioritaire (`en-cours-quoi-repondre-1280.png`). Lignes plates sans filet, plus sobres que les cartes de l'accueil | Piste : titres de section en `text-lg` déjà bons ; ajouter `border-t-2` du filet seulement aux sections, pas aux lignes | Un point d'entrée visuel unique (voir UX 3) |
| 3 Mise en page 5 largeurs | 9 | Les sections à effectif impair (Amis 5, Famille 5, Couple 5...) laissent une case vide à droite en 2 colonnes (`nouvel-quoi-repondre-1280.png`, `-1920.png`, `-768.png`). Pas de débordement ni de colonne collée | `grid grid-cols-1 md:grid-cols-2` : remplir par colonnes (`columns-2` avec `break-inside-avoid`) ou laisser tel quel (piste, non bloquant) | Sections équilibrées |
| 4 Cohérence avec l'espace | 9 | H1 centré dans l'aperçu, aligné à gauche dans la liste abonné et la fiche : écart assumé entre gabarits mais visible quand on passe de gratuit à abonné | Piste : aligner le H1 de la liste sur le gabarit de l'aperçu ou l'inverse (fichier de la page quoi-repondre) | H1 identique pour tous les comptes |
| 5 Finition | 9 | Pastilles de filtre de 37 px de haut environ (`nouvel-quoi-repondre-1280.png`), sous les 44 px du brief ; boutons Oui/À moitié/Rien et lignes de liste : 44 px et plus | `min-h-[44px]` sur les pastilles de filtre | Cibles 44 px partout |

### UX

| Critère | Note | Défaut / évidence | Correction codable | Ce qui ferait 10 |
|---|---|---|---|---|
| 1 Compréhension | 9 | Aperçu : le sous-titre dit « exemple de cette rubrique » mais seul un extrait de fiche apparaît ; le visiteur ne voit pas que la rubrique est un catalogue de situations classées (`visiteur-quoi-repondre-1280.png`) | Voir faute dure 1 | Rubrique lisible en 3 s |
| 2 Action principale unique | 9 | Aperçu : un seul bouton plein dans le bloc offre (le bouton d'en-tête existe déjà, conforme à la spec). Liste : « Le carnet du mois » est le seul bouton isolé en tête, au libellé peu explicite sans contexte | Piste : rien à coder | - |
| 3 États vides, nouvel abonné | 9 | `nouvel` = page identique à `en-cours` sans badge « Fait » : jamais morte (liste complète, fiche avec champ prêt), mais aucune entrée suggérée pour un premier choix parmi 60 situations (`nouvel-quoi-repondre-1456.png`) | Piste : mettre en avant la 1re situation du catalogue (déjà « La poêle ») avec le filet violet existant ; tout libellé « Commence ici » est à valider par Thomas | Premier pas suggéré |
| 4 Aperçu Premium | 8 | Valeur incomplète : l'extrait s'arrête à « Tu avais une réponse ? », sans la suite ni le bloc « À toi » (présents pour l'abonné) ; aucune trace du catalogue (11 catégories, une soixantaine de situations). Les trois boutons Oui / À moitié / Rien ressemblent à des commandes actives : l'aperçu montre un écran interactif sans retour visible. L'offre est unique et sans mur : conforme | Faute dure 1 | Valeur du catalogue visible, boutons non trompeurs |
| 5 Accessibilité, cohérence | 9 | Focus et contrastes non démontrables sur capture ; le texte secondaire « Prends ton temps » et la ligne d'aide sont en gris moyen sur `bg-background-elevated`, à vérifier AA. Cohérence visiteur / gratuit / abonné correcte sur la bande et les cadenas | Vérifier `text-text-secondary` sur fond élevé ≥ 4,5:1 | - |

## Fautes dures

1. **Aperçu Premium sans valeur de rubrique** (`visiteur-` et `gratuit-quoi-repondre-*.png`) : l'extrait est tronqué avant la suite et ne montre ni le catalogue (catégories et effectifs) ni de bloc « À toi » ; les boutons de réponse paraissent actifs sans effet visible. Correction : dans la page d'aperçu, afficher en lecture seule la liste réelle des catégories avec leur effectif (données du catalogue, aucun texte inventé), rendre les trois boutons inertes (`disabled` / `aria-disabled`, visuellement neutres) ou rendre l'extrait lisible en entier avec « À toi » comme le prévoit la spec (1 élément lisible en entier). Fichier : page d'aperçu de `quoi-repondre` (route `apps/web/src/app/mon-espace/quoi-repondre/page.tsx` et son composant d'aperçu).

## Pistes (ne retiennent pas la note)

- Cases vides à droite des sections impaires (2 colonnes).
- H1 centré (aperçu) vs à gauche (liste abonné et fiche).
- Pastilles de filtre à 37 px au lieu de 44 px.
- Nouvel abonné : suggérer un premier pas (libellé à valider par Thomas).
- Texte à signaler, non réécrit : « Avant de lire la suite » (fiche) alors que la fiche n'a pas de « suite » visible après les boutons de réponse ; seul « À toi » suit. Les captures n'ont pas d'état après clic : retour de Oui / À moitié / Rien non vérifiable.

## Notes

Design : minimum 9. UX : minimum 8 (critère 4). Globale : minimum = 8.
