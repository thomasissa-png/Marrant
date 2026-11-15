# Relecture design à l'aveugle, s25 v6, groupe Parcours

Périmètre : `/parcours` et `/parcours/repartie`, comptes visiteur, gratuit, en-cours, nouvel, 375 / 768 / 1280 / 1456 / 1920 (captures `docs/captures/s25/v6-tour-1/parcours/`). Étalon : `visiteur-accueil-1280.png`. Code relu : `apps/web/src/app/(dashboard)/parcours/(liste)/page.tsx`, `components/parcours/parcours-content.tsx`, `parcours-detail.tsx`, `components/espace/parcours/{parcours-espace,sommaire-parcours,lignes-fiches}.tsx`, `components/ui/card.tsx`, `tailwind.config.ts` (rounded-lg = 12 px, rounded-md = 8 px ; rounded-xl non surchargé, valeur par défaut 12 px, identique à rounded-lg).

Limite honnête : les pleines pages sont réduites à la lecture (1280 x 5292 affichée à 484 px de large). Les mesures fines (px) viennent du code ; les constats visuels viennent des captures.

## Notes

| Critère | Note |
|---|---|
| D1 Fidélité à l'accueil | **7** |
| D2 Hiérarchie et lisibilité | 9 |
| D3 Mise en page aux 5 largeurs | **8** |
| D4 Cohérence avec le reste de l'espace | 9 |
| D5 Finition au pixel | 9 |
| U1 Compréhension | 9 |
| U2 Action principale unique | 9 |
| U3 États vides, nouvel abonné | 9 |
| U4 Aperçu Premium non abonné | 9 |
| U5 Accessibilité et cohérence entre comptes | 9 |

**Globale = minimum = 7/10** (barre de 9 non atteinte : 2 fautes dures).

## Ce qui est conforme (vérifié)

- Colonne centrée `max-w-3xl` (768 px) à 1280, 1456 et 1920 : pas de colonne collée à gauche, pas de débordement. Décision D11c, conforme.
- FAQ prix (« 1,99 €/mois, c'est vraiment tout ? ») bien masquée pour l'abonné (8 questions en en-cours et nouvel, 9 chez visiteur et gratuit). Décision du 14/11 respectée.
- Fil d'Ariane absent sur `/parcours` (premier niveau), présent sur `/parcours/repartie` (détail) : conforme v6.
- Abonné : liste « Voir / Fait » (`sommaire-parcours.tsx`) : un seul bouton plein (Reprendre ou Commencer), « Fait » en texte plus coche (pas la couleur seule), boutons `min-h-11`. Fiches 3.1 à 3.5 : lien « Voir » `min-h-11`, anneau de focus.
- Nouvel abonné : jamais de page morte (« Étape conseillée : Répartie, Commencer l'étape 1 », « Ton cap, cap 1 sur 5 », série « démarre à ta prochaine pratique »).
- Non abonné : `/parcours` EST l'aperçu, inchangé ; un seul bouton d'offre en haut (en-tête), dans les pages une phrase « Sans compte. La suite : Premium. » ; chip Parcours allumé avec cadenas. Bas de `/parcours/repartie` : un bouton d'offre unique avec réassurance.

## Fautes dures

### FD1. Les cartes de parcours n'ont pas la langue de l'accueil (filet dégradé violet absent) : D1 = 7
- Constat : sur l'accueil (`visiteur-accueil-1280.png`) chaque carte porte un filet dégradé violet en haut. Sur `en-cours-parcours-1280.png`, `nouvel-parcours-1280.png`, `gratuit-parcours-1280.png` (cartes des 5 parcours, carte « Tes 4 premières semaines », « Ton cap », quiz d'orientation, cartes « Explore aussi »), les cartes sont des aplats gris à simple bordure : l'espace ressemble au « tableau de bord gris » que Thomas refuse. `components/ui/card.tsx` : `rounded-lg border border-border bg-background-card`, aucun filet.
- Correction codable : dans `parcours-content.tsx` (`<Card key={p.title} className="p-4 sm:p-6" ...>`) ajouter `relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-secondary before:to-accent-primary` ; même classe sur les trois cartes de `espace/quatre-semaines`, `espace/ton-cap` et sur les liens « Explore aussi » de `page.tsx`. Mieux : une variante `filet` dans `card.tsx` pour que toute l'espace la reprenne (vérifier que les autres groupes ne le font pas déjà autrement, pour rester cohérent).
- Ce qui ferait 10 : filet sur toutes les cartes de la page, titre de page au rythme de l'accueil (voir piste P1).

### FD2. « Explore aussi » : grille à 3 colonnes avec 2 cartes pour l'abonné, vide à droite : D3 = 8
- Constat : `en-cours-parcours-1280.png`, `-1456.png`, `-1920.png`, `nouvel-parcours-*` : deux cartes (Conseils de répartie, Glossaire humour) occupent les 2 premiers tiers, le troisième est vide. La carte Abonnement est masquée pour l'abonné (`MasqueSiPremium`) mais la grille reste `sm:grid-cols-3`. Le même vide existe à 768 (sm:grid-cols-3 dès 640).
- Correction codable : `page.tsx`, bloc « Explore aussi » : remplacer `grid gap-4 sm:grid-cols-3` par une grille qui suit le nombre de cartes, par exemple `grid gap-4 sm:grid-cols-2 [&:has(>:nth-child(3))]:sm:grid-cols-3` (ou, plus simple, `sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]`), de sorte que deux cartes se partagent la largeur de la colonne. Le HTML visiteur (3 cartes) ne change pas.
- Ce qui ferait 10 : 2 cartes pleine largeur à deux colonnes pour l'abonné, 3 pour les autres, aucun vide.

## Pistes (ne retiennent pas la note)

- P1. Titre de page : `/parcours` n'a ni hero ni titre centré comme l'accueil ; H1 aligné à gauche dans la colonne, comme les autres rubriques de l'espace (cohérent avec la nav v6). À arbitrer avec le groupe qui tient le gabarit B ; pas de défaut propre à cette page.
- P2. Deux chemins vers la même étape sur `/parcours/repartie` (en-cours, date passée) : le bouton plein « Reprendre » du sommaire et, dessous, le lien « La prochaine étape t'attend. Étape 3 · Retourner les piques… » (`parcours-detail.tsx`, bloc `showRythme && !nextDate && etapeAFaire`). Texte validé, donc pas de réécriture ; proposition : ne pas rendre ce lien quand `espaceOuvert` (le sommaire porte déjà le bouton), en gardant la phrase en texte simple.
- P3. Sur `/parcours` pour l'abonné, 5 boutons pleins « Continuer / Commencer ce parcours » plus « Reprendre » : l'œil n'a pas UNE cible dominante. Décision s21 (« un plein par carte ») : conforme, donc piste. Piste codable : `parcours-content.tsx`, `variant="outline"` pour les cartes autres que celle de `reprise` quand `enteteEspace`.
- P4. Le quiz « Quel parcours est fait pour toi ? » reste affiché pour un abonné qui a déjà deux parcours en cours (en-cours-*) ; en bas de page, donc sans gêne, mais peu utile à ce stade (`parcours-content.tsx`, `parcoursEntame`).
- P5. À signaler au groupe de la bande (hors périmètre) : visiteur et gratuit à 1280 (`visiteur-parcours-1280.png`, `gratuit-parcours-repartie-1280.png`), la rangée de chips est coupée à droite (« Carne » tronqué, « … » collé) avec les cadenas ; l'abonné (sans cadenas) tient en entier. Contredit le critère « rien de tronqué » de la spec §1 à 1280 (le budget prévoyait 105 px libres).
- P6. Contrastes et cibles : texte `text-muted #9A9A9A` et `accent-link #A78BFA` sur `#1F1F1F` conformes au thème ; non mesuré au pixel sur capture (réduction de l'image).

## Récapitulatif par compte

- Visiteur, gratuit : propres, aperçu clair, un seul appel d'offre. Aucune faute propre (hors FD1 commune et P5).
- En-cours : sommaire, étape ouverte, quiz, vidéos lisibles aux 5 largeurs ; FD1, FD2, P2, P3.
- Nouvel : états vides corrects ; FD1, FD2.
- 375 : colonne unique, pas de débordement horizontal, annonce de cap avec bouton « Fermer » en tête (en-cours), boutons à 44 px.

NOTE GLOBALE : 7/10
