# Relecture UX à l'aveugle, tour 2 : /vannes (navigation v6)

Captures lues : `docs/captures/s25/v6-tour-2/vannes/` (visiteur 375, 768, 1280, 1920 ; gratuit 1280 ; en-cours 375, 1280 ; 1456 identique à 1280 et 1920 par le plafond `max-w-7xl`). Étalon : accueil 1280. Nouvelle réponse FAQ : hors note (décidé).

## Notes

| Critère | Note |
|---|---|
| Design 1 fidélité à l'accueil | 7 |
| Design 2 hiérarchie, lisibilité | 9 |
| Design 3 mise en page 5 largeurs | 7 |
| Design 4 cohérence espace | 8 |
| Design 5 finition | 8 |
| UX 1 compréhension | 9 |
| UX 2 action principale | 8 |
| UX 3 états vides | 9 (abonné : jamais une page morte ; pas de capture « aucun résultat » du filtre, non évalué) |
| UX 4 aperçu Premium | 8 |
| UX 5 accessibilité, cohérence comptes | 9 |

Globale = minimum : 7/10. Barre de 9 non atteinte.

## Fautes dures

1. **Bloc d'offre vide à droite à 1280+** (`visiteur-vannes-1280.png`, `gratuit-vannes-1280.png`, `visiteur-vannes-1920.png`). Carte pleine coque de 1216 px, contenu empilé à gauche sur ~550 px (kicker, titre, bouton, mention, lien), ~55 % vide. L'étalon centre son bloc d'offre (« Et si ton j'aurais dû dire »). Critère « aucun vide à droite ». Correction : `text-center items-center` sur la carte, ou `max-w-3xl mx-auto` ; mention et lien centrés. Fichier : `apps/web/src/app/(dashboard)/vannes/page.tsx` (ou le composant de l'offre appelé par `vannes-list.tsx`). Ferait 10 : bloc centré, comme l'accueil.
2. **Carte « fantôme » sous l'offre** (visiteur et gratuit, tous les largeurs) : deux barres grises floutées et un cadenas, sans texte, 60 px de haut. Elle se lit comme un chargement raté ou un second mur, alors que la spec dit « une seule offre, pas de mur » et « pas de flou décoratif ». Aucun nom lisible, aucune action. Correction : la supprimer, ou la remplacer par une vraie vanne verrouillée avec texte réel et libellé accessible ; sinon `aria-hidden` et retrait. Fichier : `apps/web/src/components/vannes/vannes-list.tsx`. Ferait 10 : fin de liste = offre seule.
3. **Hero et titres de section alignés à gauche, sous-titre ~480 px** (toutes captures 1280+). L'étalon : hero et titres de section centrés. Ici H1 à gauche, sous-titre en 3 lignes étroites dont le côté droit est vide, « Questions fréquentes » et « La suite » à gauche. Correction : bloc d'en-tête `text-center`, sous-titre `max-w-2xl mx-auto`, mot clé du titre en `text-accent-link` comme l'accueil ; titres de section `text-center`. Texte inchangé. Fichier : `apps/web/src/app/(dashboard)/vannes/page.tsx`. Ferait 10 : en-tête et titres centrés comme l'accueil. À confirmer avec les autres pages de l'espace pour la cohérence (si elles sont toutes à gauche, c'est la faute de l'ensemble, pas de /vannes seul).

## Pistes (ne retiennent pas la note)

- Filtre de situations : la rangée défile, « Abs… » coupé à 1280 avec flèche (`visiteur-vannes-1280.png`). Conforme à la décision « rien de tronqué par la flèche » seulement si la flèche est évidente : elle l'est. Piste : fondu à droite plus marqué.
- Abonné « Toutes » : les 11 premières vannes sont toutes « Boulot & Collègues » (`en-cours-vannes-1280.png`), le tri par catégorie donne une impression de répétition. Piste : mélange des catégories sur la page 1 (à valider Thomas, tri = éditorial).
- Abonné : la page n'oriente pas vers la prochaine action (pas de favori mis en avant, pas de reprise). Piste « coaching » (`en-cours-vannes-1280.png`), à valider Thomas.
- Pastilles de catégorie en ~11 px, indice grisé « Clique pour la chute » : à mesurer en AA (non mesurable sur capture).
- Visiteur et gratuit identiques hors en-tête : cohérent avec la spec. Le gratuit voit encore « Connexion » absent, bouton d'offre + compte : correct.

## Points conformes

- Bande v6 identique pour les 3 comptes, « Vannes » allumée avec soulignement, cadenas présents sauf abonné, 5 gratuits sans cadenas.
- Cartes `rounded-xl` à filet violet, pastilles, rythme aéré : fidèles à l'étalon.
- Une seule offre (bouton plein) par page ; lien secondaire en texte ; aucun mur, aucune redirection.
- 375 : colonne unique, pagination abonné sur 2 rangs lisible, aucun débordement horizontal visible. 768 : 2 colonnes, pas de vide.
- 1456 et 1920 : coque plafonnée, marges symétriques.

NOTE GLOBALE : 7/10
