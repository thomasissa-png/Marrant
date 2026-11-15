# Relecture DESIGN à l'aveugle, tour 3, groupe quoi-repondre (s25, navigation v6)

Périmètre : `v6-tour-3/quoi-repondre/` (visiteur, gratuit = page d'aperçu ; en-cours, nouvel = liste) et `v6-tour-3/fiches/*-fiche-situation-*.png` (en-cours, nouvel). Lues : visiteur 1280, gratuit 375, en-cours 375/1280/1920, nouvel 1280, fiche en-cours 1280, fiche nouvel 375, plus l'étalon accueil 1280. Les autres largeurs d'un même compte ont la même structure (INDEX : hauteurs identiques à 1280, 1456, 1920, ce qui confirme le plafond `max-w-7xl`). Limite : captures vues réduites pour les pages longues, contrastes jugés visuellement, non mesurés.

## Notes
| Critère | Note | Justification |
|---|---|---|
| 1 Fidélité à l'accueil | 9 | Aperçu et fiche : cartes `rounded-xl` à filet violet, H1 centré sur l'aperçu, pastilles, rythme aéré (visiteur-quoi-repondre-1280). La liste (en-cours-quoi-repondre-1280/1920) est plus sobre : rangées grises sans filet, H1 aligné à gauche. Cohérent pour 60 lignes, mais moins « accueil ». |
| 2 Hiérarchie, lisibilité | 9 | H1 > filtres (2 groupes de pastilles) > H2 de groupe avec compteur gris > rangées. Le badge « Fait » sur La poêle est lisible. Aperçu : une seule action pleine (Premium · 1,99 €/mois), Connexion en lien souligné. |
| 3 Mise en page 5 largeurs | 9 | Aucun débordement ni colonne collée à gauche ; coque 1216 centrée à 1456 et 1920, aperçu et fiche en colonne centrée de 768. Défaut mineur : 8 groupes sur 12 ont un nombre impair de rangées, d'où une case vide à droite (Amis, Famille, Couple, Boulot, Réunion, Études, Prise de parole, Commerces ; en-cours-quoi-repondre-1280). |
| 4 Cohérence avec l'espace | 9 | Même bande, mêmes cartes à filet, même pied que les autres pages ; chip « Quoi répondre » allumé avec soulignement, y compris sur la fiche (fiche-situation-1280). |
| 5 Finition au pixel | 9 | Alignements propres (marges 32 px, bords de cartes alignés sur la bande), pastilles et rangées ≥ 44 px visibles, chevrons alignés à droite. Gris secondaire (« Prends ton temps », compteur 0 / 200) lisible mais à confirmer par mesure AA. Bouton « Enregistrer » grisé sur fiche-nouvel-375 : désactivé, donc exempté. |

## Constats par compte
- **visiteur / gratuit (aperçu)** : sous-titre validé affiché, vraie fiche lisible en entier, un seul bouton plein, cadenas sur les 5 chips, chip actif souligné ; à 375 la bande défile, active visible, cadenas conservés. Pas de vide : le bloc offre est centré dans sa carte à filet.
- **en-cours / nouvel (liste)** : identiques (pas d'état vide visible, les 60 situations sont listées, seul « Fait » et la cloche à pastille changent). À 375 : rangées pleine largeur, bouton « Filtrer les cartes » présent, pas de cases vides.
- **fiches** : colonne de 768 centrée, « Retour : Quoi répondre » en tête, cartes « La scène » et « À toi » à filet ; état rempli (en-cours : Fait, retour choisi avec coche, réplique, Supprimer) et état vide (nouvel : placeholder, bouton grisé) tous deux propres.

## Pistes (ne retiennent pas la note)
1. Cases vides de fin de groupe à 768+ : passer la grille de `src/` des groupes de situations en colonnes équilibrées (`md:columns-2 gap-x-3` avec `break-inside-avoid` sur chaque rangée) ou faire occuper la pleine largeur à la dernière rangée impaire (`md:last:odd:col-span-2`). Ferait 10 en critère 3.
2. Donner à la liste un en-tête plus proche de l'accueil (H1 centré ou sous-titre court) : texte nouveau, à valider par Thomas.
3. Mesurer les gris secondaires (compteurs, « Prends ton temps ») en AA ; passer en `text-text-secondary` si l'un est sous 4,5:1.

## Fautes dures
Aucune.

NOTE GLOBALE : 9/10
