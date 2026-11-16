# Relecture DESIGN à l'aveugle, s25 navigation v6, tour 4, groupe « favoris-profil »

Périmètre : `/favoris` (gratuit = aperçu, en-cours, nouvel) et `/profil` (gratuit, en-cours, nouvel). Captures lues : `docs/captures/s25/v6-tour-4/{favoris,profil}/` en 375, 1280 et 1920 pour chaque compte, plus l'étalon `etalon-accueil/visiteur-accueil-1280.png`. Code lu pour vérifier : `components/favoris/favoris-list.tsx`, `components/profil/profil-dashboard.tsx`, `components/espace/profil/ligne-mes-questions.tsx`, `components/profil/supprimer-compte-card.tsx`, `components/ui/button.tsx`. Vignettes vidéo : sans objet (aucune vidéo en favoris dans les captures).

## Notes

| Critère | Note | Raison courte |
|---|---|---|
| Design 1 Fidélité à l'accueil | 9 | Titres centrés, cartes `rounded-xl` à filet violet, pastilles, rythme aéré : la langue de l'accueil est là. |
| Design 2 Hiérarchie, lisibilité | 9 | Un titre, une action, des cartes lisibles. Texte 12 px en `text-text-muted` (stats, « 2/3 étapes », mention lettre) à la limite. |
| Design 3 Mise en page aux 5 largeurs | 7 | Deux vides à 1280+ (fautes 1 et 2). Pas de débordement, pas de colonne collée à gauche. |
| Design 4 Cohérence avec l'espace | 8 | Une carte sans titre parmi des cartes titrées, « Prénom » centré seul (pistes). |
| Design 5 Finition | 7 | Boutons `size="sm"` à 32 px dès 768 (faute 3). |
| UX 1 Compréhension | 9 | Titre + sous-titre clairs partout. |
| UX 2 Action principale | 9 | Aperçu : un seul bouton plein dans la page. Profil gratuit : « S'abonner » ; en-cours : « Reprendre l'étape 3 ». |
| UX 3 États vides, nouvel abonné | 9 | Favoris vide : explication + « Explorer les vannes ». Profil nouvel : « Découvrir les parcours », cap à 0 lisible. |
| UX 4 Aperçu Premium | 9 | Vraie vanne et vrai conseil lisibles, sous-titre validé, une offre, pas de mur. |
| UX 5 Accessibilité, cohérence | 9 | Onglets et « Retirer » à 44 px (`min-h-11`), chip Favoris allumé avec soulignement, icône du compte allumée sur le profil. |

**NOTE GLOBALE : 7/10** (minimum). Sous la barre de 9 : 3 fautes dures.

## Fautes dures

### 1. Carte « Ta question à l'équipe » : une ligne de texte dans une carte haute et vide
- Captures : `profil/en-cours-profil-1280.png`, `en-cours-profil-1920.png`, `nouvel-profil-1280.png`, `nouvel-profil-1920.png`. À gauche de « La lettre de la semaine », une carte de 165 px de haut ne contient qu'une ligne vers le milieu, sans titre, avec filet violet : un grand trou, et la seule carte du profil sans titre.
- Cause : `LigneMesQuestions` est étirée à la hauteur de sa voisine (`GROUPE_COURT` en `items-stretch`, `h-full`), et son contenu est un `<p>` seul (`py-3`).
- Correction codable : dans `profil-dashboard.tsx`, sortir la ligne du `GroupeCourt` (pleine largeur `md:col-span-2`, hauteur naturelle, une seule ligne) ou l'aligner en haut avec `self-start` ; ou lui donner un `CardHeader`/`CardTitle` avec le libellé déjà validé de « Mes questions » (aucun texte nouveau). Alors « Rappel » + « Abonnement » + « Lettre » + « Prénom » restent en 2 colonnes (`lg:grid-cols-2`) sans orpheline étirée.
- Ce qui ferait 10 : plus aucun bloc vide dans le groupe court, à 1280 et 1920.

### 2. Carte « Supprimer mon compte » : moitié droite vide à 1280 et 1920
- Captures : tous les profils 1280 et 1920 (`gratuit-profil-1280.png` : texte sur 640 px de large, 560 px vides à droite ; à 1920 : 560 px de texte sur 1216).
- Cause : `CardContent` en `max-w-prose` dans une carte pleine largeur (`supprimer-compte-card.tsx` ligne 92).
- Correction codable : dès `lg`, deux colonnes `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8` : intro et mention à gauche, encadré d'avertissement et bouton à droite ; ou carte qui prend la largeur d'une demi-ligne (`lg:col-span-1 lg:max-w-[calc(50%-0.75rem)]`). Le brief exclut explicitement un vide à droite à 1280+.
- Ce qui ferait 10 : carte sans espace mort, texte toujours à la mesure de lecture.

### 3. Boutons `size="sm"` à 32 px dès 768 px
- Vérifié dans `button.tsx` : `sm` = `h-8 px-3 text-sm max-md:h-11`, soit 32 px à partir de 768 (44 px seulement en dessous). Captures : « Explorer les vannes » (`nouvel-favoris-1280.png`, 32 px de haut), « Découvrir les parcours » et « Voir tout » (`nouvel-profil-1280.png`), « Supprimer mon compte » et « Enregistrer » (tous profils 1280). Le tour 2 avait fixé 44 px à toutes les largeurs pour les onglets et « Retirer » (`CIBLE_44`) : les autres cibles de ces deux pages restent à 32 px.
- Correction codable : `favoris-list.tsx` ligne 262 (CTA vide), `profil-dashboard.tsx` lignes 356 et 369 (« Voir tout », « Découvrir les parcours »), `supprimer-compte-card.tsx` lignes 98, 123, 126, `prenom-card.tsx` (Enregistrer) : ajouter `min-h-11` (ou `ESPACE_CLIENT_PUBLIE ? "min-h-11" : ""` pour ne pas toucher à l'interrupteur fermé).
- Ce qui ferait 10 : toutes les cibles de ces pages à 44 px aux 5 largeurs.

## Pistes (ne retiennent pas la note)

- Favoris en-cours 1280/1920 : cartes de même hauteur (`items-stretch`, décision v6 tour 1 pt 14), donc 200 px vides sous les deux vannes à côté du conseil. Une `grid` en `items-start` ferait un rythme moins creux ; décision à confirmer par Thomas.
- Profil en-cours/nouvel 1280+ : la carte « Ton prénom » centrée seule à demi-largeur (`lg:[&>:last-child:nth-child(odd)]`) est isolée entre deux lignes pleines ; la faute 1 la replacerait naturellement en 2 colonnes avec une voisine.
- Aperçu favoris (`gratuit-favoris-1280.png`) : l'espace titre-sous-titre fait environ 46 px contre 39 px dans la vraie page (« Mes favoris ») ; aligner le `gap` de l'en-tête des deux versions.
- Textes en `text-xs text-text-muted` (mention de la lettre, « 2/3 étapes », libellés de stats) : lisibles mais petits ; vérifier le contraste du token en dark (non mesurable sur capture).
- Alerte : « Reprendre ton parcours » (filet absent, fond violet) est un bandeau différent des cartes à filet ; voulu pour l'action principale, conforme.

## Conforme, vérifié

- Aperçu gratuit : H1 « Favoris », sous-titre validé, vraie vanne et vrai conseil complets, un seul bouton plein, aucun texte inventé.
- Chip Favoris allumé avec cadenas pour le gratuit (`gratuit-favoris-*`), sans cadenas pour l'abonné ; icône du compte allumée sur `/profil`.
- 375 : aucun débordement horizontal, onglets défilants avec indice de suite (« Vic > »), cartes empilées, boutons 44 px.
- 1920 : coque 1216 centrée comme l'accueil, aucune dérive de largeur.
- Zéro tiret cadratin visible dans les captures.
