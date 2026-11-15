# Relecture DESIGN à l'aveugle, tour 2, groupe lettre-carnet (nav v6)

Captures lues : `v6-tour-2/lettre/` (visiteur 1280 et 375, gratuit 768, gratuit espace 1280, en-cours 1280 et 375, nouvel 1280, visiteur espace 1280) et `v6-tour-2/carnet/` (visiteur 1280, gratuit 375, en-cours 1280, nouvel 1920). Les autres largeurs sont déduites de l'INDEX et des largeurs voisines. Limite : les pages carnet abonné font 25 821 px (30 situations dépliées), vues seulement en miniature ; l'en-tête et l'index en tête de page n'ont pas pu être inspectés au pixel.

## Notes
| Critère | Note |
|---|---|
| 1 Fidélité à l'accueil | 8 |
| 2 Hiérarchie et lisibilité | 7 |
| 3 Mise en page aux 5 largeurs | 6 |
| 4 Cohérence avec l'espace | 8 |
| 5 Finition au pixel | 7 |
| **Globale (minimum)** | **6** |

## Ce qui est conforme
- Carnet (visiteur, gratuit) : colonne centrée ~696 px, carte `rounded-xl` à filet violet, bloc « On te dit » / « Tu réponds » lisible, offre unique « Ouvrir tout le carnet · 1,99 €/mois », liste verrouillée « Au programme » : langue de l'accueil respectée, aucun débordement (gratuit-carnet-375, visiteur-carnet-1280).
- /lettre visiteur et gratuit : carte formulaire à filet violet, H1 centré, une seule action (« Envoie-moi la lettre »), 1280 propre (visiteur-lettre-1280, gratuit-lettre-768).
- /mon-espace/lettres visiteur renvoie à la connexion proprement.

## Fautes dures
1. **Débordement horizontal à 375 sur /lettre (visiteur et gratuit)** : page rendue à 448 px de large (INDEX : « DÉBORDEMENT HORIZONTAL », visiteur-lettre-375 et gratuit-lettre-375, hauteur 5030). Cause visible : les URLs utm longues du corps de la lettre ne se coupent pas. Correction : sur le conteneur du corps d'aperçu, `break-words [overflow-wrap:anywhere] min-w-0` (et `max-w-full`). Fichier : composant de la page /lettre (aperçu « dernier numéro », apps/web/src/app/lettre/page.tsx ou son composant d'aperçu).
2. **URLs brutes avec paramètres `utm_source=lettre&utm_medium=email…` affichées en clair** dans l'aperçu (visiteur-lettre-1280, gratuit-lettre-768, trois occurrences : article, étape 3, Premium). Finition cassée : rendre ces lignes comme liens courts (« Lire l'article », « Aller à l'étape 3 », « Voir ce que Premium ouvre », libellés déjà présents dans le texte) en masquant l'URL, `text-primary underline underline-offset-2`. Même fichier que 1. Pas de nouveau texte.
3. **Archive /lettre abonné (en-cours et nouvel, 1280/1456/1920) : vide à droite** : deux cartes de ~395 px occupent la moitié gauche, le tiers droit et le bas sont vides, titre « La lettre » collé à gauche (en-cours-lettre-1280, nouvel-lettre-1280, 1920 idem par construction). Contredit le critère 3 de la grille. Correction : conteneur `mx-auto max-w-3xl`, H1 centré (`text-center`) comme l'accueil, grille `grid-cols-1 sm:grid-cols-2 gap-6` avec cartes pleine largeur de colonne, `min-h-[60vh]` pour supprimer le trou avant le footer. Fichier : composant d'archive des lettres (page /lettre, branche abonné).

## Pistes (ne retiennent pas la note)
- Aperçu de la lettre : texte plat sans hiérarchie (« La sûre », « La joueuse », « Comment choisir » au même corps que le paragraphe). Passer les intertitres en `font-semibold text-foreground` et encadrer l'aperçu dans une carte `rounded-xl border bg-card p-6` (effet « e-mail ») améliorerait le critère 2.
- Cartes d'archive : seulement titre + sous-titre, sans date en pastille ni flèche « Lire » ; la cible cliquable n'est pas évidente. Ajouter une chevron/flèche et `min-h-[44px]` garantit la cible.
- Carnet : étiquettes « amis » et « quotidien » en minuscule brute, sans pastille (visiteur-carnet-1280) ; utiliser la pastille `rounded-full bg-primary/10 text-xs` de l'accueil. Libellés non réécrits.
- Carnet abonné : 30 situations dépliées en 25 800 px sans repli ; l'index en tête aide, mais un accordéon ou des ancres « retour en haut » renforceraient la lisibilité (à valider côté UX).
- /mon-espace/lettres pour le gratuit affiche la page Premium (gratuit-lettres-espace-1280) alors que /lettre montre le formulaire : incohérence de destination entre deux URL censées converger ; à confirmer avec la spec UX.

## Ce qui ferait 10
Corriger les trois fautes dures (surtout 1, qui bloque seul à 375), traiter l'aperçu en carte avec intertitres hiérarchisés, et remplir proprement la largeur de l'archive aux grandes largeurs.
