# Relecture à l'aveugle s25 v6 : Quoi répondre (liste, filtres, aperçu, fiches situation et à plat)

Périmètre : captures `quoi-repondre/` (4 comptes x 5 largeurs), `fiches/*fiche-situation*` et `*fiche-a-plat*` (en-cours, nouvel), code `quoi-repondre/page.tsx`, `liste-fiches.tsx`, `filtres-situations.tsx`, `apercu/apercu-rubrique.tsx`, `carte/styles.ts`. Captures lues en entier : en-cours 375/768/1280, nouvel 375, gratuit 375/1280, visiteur 1920, fiches en-cours 1280 (situation et à plat), fiche nouvel 375. Les autres largeurs sont de même gabarit (hauteurs identiques à 1280, 1456, 1920 dans l'INDEX) : non rouvertes une à une, notes données sur ce qui est vu.

## Notes

| Critère | Note | Résumé |
|---|---|---|
| D1 Fidélité à l'accueil | 8 | Fiche et aperçu parlent la langue (cartes `rounded-xl`, filet dégradé en haut de l'aperçu, pastilles). Liste : titre à gauche, cartes de ligne `rounded-md` sans filet. |
| D2 Hiérarchie, lisibilité | 8 | Titre, filtres, 12 groupes numérotés : lisible. Aucun point d'entrée dans 60 lignes. |
| D3 Mise en page 5 largeurs | **5** | Aperçu : carte `max-w-3xl` collée à gauche, vide à droite à 1280, 1456, 1920. |
| D4 Cohérence espace | 8 | Fiche en colonne centrée de 768 px, aperçu et liste en colonne collée à gauche : deux logiques. |
| D5 Finition | 8 | Cibles 44 px et focus OK ; boutons Oui / À moitié / Rien de l'aperçu à l'aspect éteint. |
| U1 Compréhension | 8 | Titre clair, aucune phrase d'accroche sous « Quoi répondre » ; « Le carnet du mois » seul, sans contexte. |
| U2 Action principale unique | 8 | Liste : pas de première fiche suggérée (voir piste). Aperçu : un seul bouton plein, OK. Fiche : OK. |
| U3 États vides, nouvel abonné | 9 | Nouvel abonné = liste complète, jamais morte. État filtré vide vu au code seulement (texte + lien « Raconte-la »), non capturé. |
| U4 Aperçu Premium | 8 | Vraie fiche, un bouton, lien Connexion pour le visiteur seul, pas de mur. Zone de réponse inerte sans le dire. |
| U5 Accessibilité, cohérence | 8 | `aria-current` + coche, cibles 44 px. Bande : « Carnet » coupé même à 1920 (hors périmètre, signalé). |

**NOTE GLOBALE : 5/10** (minimum, tenu par D3).

## Faute dure

**FD1 : aperçu Premium, vide à droite à 1280 et plus** (`visiteur-quoi-repondre-1920.png`, `gratuit-quoi-repondre-1280.png`). Le titre, le sous-titre et la carte (`max-w-3xl` = 768 px) sont collés au bord gauche de la coque ; à 1280 il reste environ 450 px vides à droite du contenu, à 1920 environ 450 px aussi à côté d'une coque de 1216. Contraire au critère « aucun vide à droite, aucune colonne collée à gauche ».
- Code : `apps/web/src/components/espace/apercu/apercu-rubrique.tsx` : `<header>` en `text-center`, `<p>` avec `mx-auto`, `<article>` avec `mx-auto` (en gardant `max-w-3xl`). La carte devient une colonne centrée de 768 px, identique à celle de la fiche réelle (x 256 à 1024 à 1280), et le titre centré rejoint l'étalon (titres de section centrés). Le texte à l'intérieur de la carte reste aligné à gauche (lecture).
- Ce qui ferait 10 : aperçu centré à toutes les largeurs, vérifié à 375 (inchangé : pleine largeur moins 16 px) et à 1920.

## Pistes (ne retiennent pas la note)

1. **Liste, rythme et fidélité** (`en-cours-quoi-repondre-1280.png`) : titre H1 à gauche, 12 groupes à la suite. Pour rapprocher de l'étalon : cartes de ligne `rounded-xl` au lieu de `rounded-md` (`liste-fiches.tsx` ligne du `Link`), titres de groupe `font-display` déjà bons. Valeur seule : à confirmer par Thomas, la page B pleine coque est la décision v5.
2. **Cases vides en bout de grille** : groupes de 3 ou 5 fiches = une cellule vide en bas à droite (Amis, Famille, Couple, Boulot, Études, Prise de parole, Commerces). Correction possible : `grid-flow-col` avec `md:grid-rows-[repeat(3,auto)]` serait fragile ; plus simple : accepter (c'est une grille standard).
3. **Aucune entrée** pour le nouvel abonné : `nouvel-quoi-repondre-375.png` est identique à `en-cours` sauf la pastille « Fait ». Proposition (à valider par Thomas, texte nouveau) : une ligne sous le titre indiquant par où commencer, ou mise en avant d'une fiche. Non retenue dans la note.
4. **« Le carnet du mois »** au-dessus des filtres : bouton secondaire isolé sans phrase, avant le vrai contenu. À rapprocher des filtres ou à placer en fin de liste (`page.tsx`, ordre des blocs dans le `flex flex-col gap-6`).
5. **Aperçu, zone Oui / À moitié / Rien** (`gratuit-quoi-repondre-1280.png`) : boutons au texte gris sur fond sombre, d'aspect désactivé, sans mention que c'est un exemple non interactif. Le sous-titre validé le dit en haut ; ajouter un `aria-disabled` explicite et `cursor-default` dans `exemple.tsx` si ce n'est pas fait (non vérifié : fichier non lu).
6. **Bande, hors périmètre** : « Carnet » coupé par le fondu et « … » collé à droite aux largeurs 1280 à 1920 (visiteur et gratuit, avec cadenas). Le budget de la v6 annonçait 105 px libres ; la capture montre un dépassement. À traiter par le groupe de la bande.
7. **Fiche à plat** : sous-titre « QUAND ÇA TOMBE À PLAT · 5 min » conforme ; « Fait » apparaît à la fois en pastille de liste et dans le bloc « À TOI » : cohérent.

## Points conformes (pas de défaut)

- Filtres : liens serveur, coche + contour 2 px + `aria-current`, `min-h-11`, repliés dans un `details` « Filtrer les cartes » sous 640 px (`nouvel-quoi-repondre-375.png`).
- Aperçu : un seul bouton plein, prix lu dans la config, aucun mur ni redirection, `noindex, follow`.
- Fiches : « Retour : Quoi répondre », colonne centrée de 768 px à 1280, formulaire « Ma réplique à moi » avec compteur 200 caractères, aucun débordement à 375.
- Cohérence entre comptes : en-cours et nouvel partagent le même gabarit, seul l'état « Fait » change.
