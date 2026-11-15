# Relecture UX à l'aveugle, tour 3 : favoris + profil (navigation v6)

Captures : `docs/captures/s25/v6-tour-3/favoris/` et `profil/`. Vues examinées : gratuit 375/768/1280, en-cours 375/1280, nouvel 1280 (favoris et profil selon les comptes disponibles). Les largeurs 1456 et 1920 partagent la coque `max-w-7xl` du 1280 (hauteurs identiques dans l'INDEX), je n'y ai pas relevé d'écart propre.
Contexte connu non relevé : carte Abonnement sans bouton chez les comptes de test.

## Notes

| Critère | Note |
|---|---|
| D1 Fidélité accueil | 9 |
| D2 Hiérarchie / lisibilité | 8 |
| D3 Mise en page 5 largeurs | 7 |
| D4 Cohérence espace | 9 |
| D5 Finition pixel | 8 |
| U1 Compréhension | 9 |
| U2 Action principale | 9 |
| U3 États vides / nouvel abonné | 9 |
| U4 Aperçu Premium | 8 |
| U5 Accessibilité / cohérence comptes | 8 |
| **Globale (minimum)** | **7** |

## Fautes dures

1. **Aperçu Favoris (gratuit), colonne déséquilibrée : grand vide sous la vanne.** `gratuit-favoris-1280.png` : la carte vanne fait ~170 px, la carte conseil ~1080 px, soit un trou noir d'environ 900 px sous la vanne, à gauche. Même défaut à 768 (`gratuit-favoris-768.png`). Correction : dans `components/espace/apercu/favoris-ouvert.tsx` (ou `favoris-lecture.tsx`), empiler en une colonne `max-w-3xl mx-auto` (vanne puis conseil), ou limiter l'extrait du conseil (`line-clamp`) pour équilibrer. Ce qui ferait 10 : deux cartes de hauteur voisine ou une colonne unique centrée.
2. **Profil abonné (en-cours, nouvel) à 1280+, cartes pleines largeur avec le contenu collé à gauche et la moitié droite vide.** `en-cours-profil-1280.png` : « Ton cap », « Rappel de parcours », « Abonnement », « La lettre de la semaine », « Ta question à l'équipe » n'ont que quelques mots à gauche sur ~1216 px ; les barres de « Mes parcours » font ~1100 px. Même chose dans `nouvel-profil-1280.png`. Critère D3 explicite (aucun vide à droite à 1280+). Correction : dans `components/profil/profil-dashboard.tsx`, passer en grille `lg:grid-cols-2 gap-6` pour les cartes courtes (Cap + Statistiques ; Rappel + Lettre ; Abonnement + Question à l'équipe), garder en pleine largeur Reprendre, Mes parcours, Supprimer. Ce qui ferait 10 : plus aucune carte avec plus de 50 % de vide.
3. **Cibles tactiles sous 44 px sur les cartes de favoris.** `en-cours-favoris-1280.png` et `-375.png` : le bouton Partager est un rond d'environ 32 px, « Retirer » est un texte nu d'environ 20 px de haut. Correction : dans `components/favoris/favoris-list.tsx`, `min-h-11 min-w-11` (44 px) sur les deux, `inline-flex items-center justify-center`, zone cliquable sans agrandir le visuel. Ce qui ferait 10 : 44 px mesurés.

## Pistes (ne retiennent pas la note)

- Aperçu Favoris : le bloc offre est une carte avec un bouton seul (`gratuit-favoris-1280.png`), sans phrase de valeur. Une ligne serait un texte nouveau, **à valider par Thomas**. Les exemples (vanne roulette, toast) ne disent pas qu'on les « garde » en favoris ; le sous-titre validé reste inchangé.
- Aperçu centré (« Favoris », 768 px de large) face à la page abonné alignée à gauche en pleine coque (« Mes favoris ») : saut de gabarit entre comptes, conforme à la spec d'aperçu mais visible.
- Favoris en-cours : cartes de même hauteur (`items-stretch`) laissent du vide sous les vannes courtes ; `items-start` ou masonry serait plus propre.
- Profil : la carte « Ta question à l'équipe » est la seule sans titre (`en-cours-profil-1280.png`), hiérarchie rompue ; un `h2` aiderait (texte à valider).
- Profil : texte légal de la lettre et lien « Renoncer au contrat ici » ~11-12 px en gris, à vérifier au contraste AA mesuré.
- Profil nouvel : deux appels à l'action voisins (« Prochaine étape » et « Découvrir les parcours »), et « Rappel de parcours » proposé avant tout parcours.
- Profil : titre « Mon profil » aligné à gauche, l'accueil centre ses titres ; cohérent avec les autres pages de l'espace d'après les captures vues, donc non retenu.

## Points validés

- Nouvel favoris : état vide complet (icône, phrase, un seul bouton « Explorer les vannes »), jamais une page morte.
- Gratuit profil : Abonnement en 2e position avec un seul bouton plein, rubriques absentes masquées (pas de mur), propre.
- Bande des rubriques : Favoris allumé avec cadenas pour le gratuit, sans cadenas pour l'abonné ; mobile 375 défile avec l'actif visible.
- Filet violet, `rounded-xl`, rythme aéré : fidèles à l'accueil.
