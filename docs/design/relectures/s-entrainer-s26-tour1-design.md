# Relecture DESIGN à l'aveugle : « S'entraîner », s26 tour 1

Relu : captures `docs/captures/s26/rubriques-tour-1/s-entrainer/` (visiteur, gratuit, en-cours, nouvel : 375, 1280, 1920 ouverts ; 768 et 1456 non rouverts, mêmes gabarits que 375 et 1280 d'après l'INDEX), `TAILLES.md`, spec design `rubriques-abonne-s26.md`, brief v7. Code regardé pour les classes : `s-entrainer/page.tsx`, `apercu/apercu-s-entrainer.tsx`, `apercu/offre-apercu.tsx`, `carte/compte-a-rebours.tsx`.

## Gate typographique (TAILLES.md, citée)
- Aperçu (visiteur et gratuit) : 375 et 768 = 4 tailles (24, 20, 16, 14), 6 combinaisons ; 1280 et 1920 = 4 tailles (30, 20, 16, 14), 6 combinaisons. PASS.
- En-cours : 4 tailles, 6 combinaisons à 375 / 768 / 1280 / 1920. PASS.
- Nouvel : 4 tailles ; 5 combinaisons à 375 (pas de 16/600 : aucun bouton « Ta réponse d'abord » sous le pli du premier écran), 6 aux autres largeurs. PASS.
- Aucune 5e taille, graisses {400, 600} seulement. Conforme à l'échelle s25. Pas de faute dure typographique.

## Constat par compte

**Aperçu (visiteur, gratuit)** : se lit FERMÉ au premier regard (verrous, barres grises à la place de « Ce qu'on aurait pu dire », marches 2 à 5 verrouillées). Offre en haut (1280 : carte à droite, y 153 à 377 ; 375 : bouton plein à y ~345, sous 812). Une seule offre, un seul aplat par premier écran (le second, « La suite est dans Premium », est sous le pli à 900 et 812). Largeur utilisée : hero 2 zones, 7/5, puis 6/6 dès 1280 : bien, plus de bloc centré. Cohérence visiteur/gratuit : même gabarit, la carte d'offre fait la même hauteur (224 px) avec 2 ou 3 paragraphes. Cibles : « Connexion » `inline-flex min-h-11 min-w-11` (`offre-apercu.tsx`), bouton `h-12` : OK.
Défauts relevés :
- 1280 et 1920 : la tuile « Mission » est étirée à la hauteur de la tuile jeu (493 px) : la liste des marches s'arrête à y ~795, la tuile continue jusqu'à y 962 : ~170 px de vide en fin de carte (35 % de la tuile). Permis par la règle (fin de carte), mais c'est la « tuile creuse » du critère 3.
- 375 (visiteur et gratuit) : sous « Quand ça tombe à plat », un bord de carte arrondi d'une vingtaine de pixels apparaît juste au-dessus de « La suite est dans Premium » (la carte « Raconte-nous » est coupée par le fondu `SuiteCoupee`). Lu à la capture, pas mesuré au pixel : à vérifier en DevTools. Si ce n'est pas voulu, c'est une carte tronquée, donc un défaut de finition. Absent à 1280/1920 (2 cartes côte à côte, entières, sans fondu visible).
- Pastilles du hero (« Si tu as 5 minutes », « Mission »...) : même gabarit que des filtres, mais non cliquables. Piste, pas faute.

**En-cours (abonné avancé)** : en-tête aligné à gauche, grille 7/5 réelle, carte du jour dépliée dans la zone tintée, 2e carte repliée avec chevron, échelle des marches en liste (marche 1 « Fait » avec coche verte, marche 2 en cours sur fond élevé, aucun violet), mission dessous. À 375 : segments, carte, échelle en puces qui passent à la ligne, mission : aucun débordement. Réponses « Oui / À moitié / Rien » : hauteur ~44 px (y 808-852), trois colonnes égales. Pas de vide > 32 px au milieu d'un bloc (le plus grand : 34 px entre la pastille « 10 secondes » et « Prends ton temps », entre deux sous-blocs, ligne de texte comprise).

**Nouvel** : même page, 1 seul segment, marche 1 en cours, mission servie : jamais une page morte. À 1280/1920 la colonne de gauche s'arrête à y 916 et celle de droite à y 1056 : 140 px sous la carte du jour, en fin de colonne (permis). Le trou se voit parce que la carte du jour est seule.

## Question posée : pas de bouton plein tant qu'une carte reste à faire
Ce n'est pas une faute dure. Raisons : (1) la règle « un seul aplat par écran » est un plafond, et la gate 1 à 4 est tenue ; (2) la carte du jour reste la zone dominante par sa teinte, sa bordure, son titre 20/600 et sa surface (3 à 4 fois la tuile mission) : en plissant les yeux, carte du jour, échelle, mission s'identifient dans cet ordre ; (3) « Oui / À moitié / Rien » est un auto-report : un plein sur « Oui » biaiserait la réponse, et rien ne justifie un autre plein (le seul autre bouton actif, « 10 secondes pour répondre », est une puce facultative `aria-pressed` dans `compte-a-rebours.tsx`, à garder secondaire). C'est un défaut de hiérarchie (pas de point d'entrée violet), pas de conformité : critère 2 plafonné à 8.
Correction codable si l'on veut un point focal sans fausser la réponse : l'étape qui suit la réponse (révélation de « Ce qu'on aurait pu dire » / suite de la carte, dans `carte/carte-registre.tsx` et `carte-et-toi.tsx`) porte le `buttonVariants({ size: "lg" })` ; avant la réponse, rien. À vérifier dans le code que c'est déjà le cas : sinon c'est la correction. Et amender la gate 3 de `rubriques-abonne-s26.md` en « au plus un aplat » (elle dit « un » alors que la spec §2.3 prévoit des écrans sans aplat). Ce qui ferait 10 : un point focal visible dès l'arrivée sans texte neuf, ce qui n'existe pas ici sans changer le principe des 3 réponses de même poids : on le laisse à 8.

## Notes par critère (Design)
1. Élégance et fidélité à l'accueil : 8. Retenue, mêmes rayons, aucune ombre, un seul accent. Retire un point : aperçu 1280, tuile Mission à moitié vide ; abonné, page très sobre sans signe de progression chiffré (segments sans texte, tous gris pour un début).
2. Hiérarchie : 8. Aperçu : bouton plein en haut, dominant, un seul : 9-10. Abonné : zone dominante claire mais aucun point d'entrée plein (voir ci-dessus).
3. Largeur aux 5 largeurs : 8. Pas de débordement, pas de bloc centré. Retire : ~170 px de vide en fin de tuile Mission (aperçu 1280/1920) ; ~140 px sous la carte du jour (nouvel 1280/1920). Fins de colonne, donc pas de faute dure.
4. Cohérence entre comptes : 9. Visiteur et gratuit identiques ; en-cours et nouvel identiques sauf contenu. Écart assumé aperçu/abonné (titre dégradé : décision déjà prise, non notée).
5. Finition au pixel : 8. Cibles 44 px et `h-12` OK, contrastes OK, aucun tiret cadratin vu. Retire : (a) abonné 1280/1920 les cartes du haut ne s'alignent pas : la tuile Mission commence à y 277, la carte du jour à y 309, car les segments (8 px + gap-6) occupent la colonne de gauche seulement : 32 px de décalage entre les bords hauts des deux colonnes ; (b) aperçu 375, bord de carte coupé (à vérifier).

## Corrections codables (ordre de gain)
1. Aperçu 1280+ : `apercu-s-entrainer.tsx`, rangée 1. Mettre « Quand ça tombe à plat » sous « Mission » dans la colonne de droite (`lg:col-span-5`, `flex flex-col gap-6`) : 325 + 24 + 125 = ~474 px contre 493 pour le jeu, plus de tuile creuse. « Raconte-nous ce qui s'est passé » prend la rangée 2 en `lg:col-span-12`, sous le fondu. Aucune taille ni texte ajoutés. (Alternative minimale : `lg:items-start` sur la rangée 1, mais la rangée devient bancale de 168 px.)
2. Abonné : `s-entrainer/page.tsx` ligne 96 à 102 : sortir les segments de la colonne de gauche et les mettre dans le `header` sous l'accroche (`mt-6`) ou pleine largeur au-dessus de la grille (`lg:col-span-12` dans la grille) : les deux colonnes partent alors à la même ligne (échelle et carte du jour alignées).
3. Aperçu 375 : `extrait-coupe.tsx` (`SuiteCoupee`) : vérifier que la carte coupée ne montre pas son bord arrondi sous 768 px ; sinon masquer la seconde carte (`max-md:hidden` sur la 2e `TuileFermee` de la rangée 2), c'est ce que fait déjà la rangée à 375 pour les pastilles.

## Pistes (aucune n'est une faute dure)
- Échelle 1280 : `justify-between` entre « Marche 1 · À voix haute, sans public » et « Fait » laisse ~160 px de vide au milieu de la ligne ; c'est un tableau libellé/état aligné au bord, prévu par la spec §2.3, donc pas retenu comme faute. Si on veut le serrer : `justify-start gap-4` avec « Fait » collé au libellé.
- Segments de rafale sans texte (spec : « aucun libellé existant ») : un lecteur ne sait pas ce que « 2 barres grises » veut dire ; `aria-hidden` est posé, donc invisible en lecteur d'écran. Si un libellé « n sur 3 » existe côté Thomas, le brancher.
- Pastilles du hero de l'aperçu : retirer leur aspect de filtre (`bg-background-elevated` plein → texte `META` séparé par des points) pour ne pas suggérer un clic.

NOTE GLOBALE : 8/10

Fautes dures (aucune CHIFFRABLE) :
1. Aucune. Sous la barre 9/10 pour cause de notes 8 (critères 1, 2, 3, 5), pas de faute dure ; gate typographique PASS ; un seul accent fort tenu.
