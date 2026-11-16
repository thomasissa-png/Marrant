# Relecture UX à l'aveugle, « Aujourd'hui », s25 v7, tour 9

Relecteur : @ux. Méthode : brief v7 appliqué tel quel, specs `docs/ux/aujourdhui-refonte-s25.md` et `docs/design/typo-harmonie-espace-s25.md`, captures `docs/captures/s25/v7-aujourdhui-tour-9/aujourdhui/` (4 comptes, 375, 768, 1280, 1920 ouverts, pleine page et premier écran), mesure `TAILLES.md`, code `apercu/{hero-apercu,offre-apercu,extrait-coupe,tableau-verrouille}.tsx`. Aucune relecture antérieure lue. En-tête global et bande des rubriques hors périmètre (leur bouton violet n'est donc pas compté). Vide de fin de carte permis ; 128 px hero vers extrait dès 1024 voulu.

## 1. Gate typographique MESURÉE (bloquante)

Citation de `TAILLES.md` (sortie de `tailles-comptes.mjs`, `main`, premier écran) :

| Compte | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| visiteur | 4 tailles (24, 20, 16, 14), 6 combinaisons | 4 (24, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 | 4 (30, 20, 16, 14), 6 |
| inscrit gratuit | 4, 6 | 4, 6 | 4, 6 | 4, 6 |
| abonné avancé | 4, 6 | 4, 6 | 4, 6 | 4, 6 |
| nouvel abonné | 4, 6 | 4, 6 | 4, 6 | 4, 6 |

- Seuils : plus de 4 tailles ou plus de 6 combinaisons = faute dure. Résultat : 16 lignes sur 16 à 4 tailles et 6 combinaisons. **PASS.**
- Hors échelle : tout est dans {14, 16, 20, 24 ou 30}, graisses 400 et 600 seulement, aucune capitale (la mesure le dit : « aucune capitale »). Les 6 combinaisons sont celles de l'échelle (30 ou 24/600, 20/600, 16/400, 16/600, 14/400, 14/600). **PASS.**
- Aucune taille ajoutée ce tour (preuve du hero en 20/600 + 14/400, déjà présentes). Le code confirme : `Preuve` et `ExtraitCoupe` n'utilisent que `META` et `TITRE_CARTE`. Les capitales du pied de page (« PRODUIT », « LÉGAL ») sont hors `main`, hors périmètre.
- Remarque de méthode : la mesure ne couvre que le premier écran. Sous le pli, les captures pleine page montrent les mêmes tailles visuellement (« Semaine 1 : » en 16/600, titres 20). Rien d'étranger repéré.

## 2. Règle d'accent violet

- **Aperçu verrouillé (visiteur, gratuit)** : dans `main`, le seul aplat violet est le bouton d'offre (hero ; second bouton en fin d'extrait, jamais visible avec le premier : à 1280 et 1920 le second est à y ≈ 956, sous 900 ; à 375 il est à y ≈ 1050 sur la pleine page). Aucun filet, aucune pastille, aucune bordure, aucun texte violet. Pastille « Premium », pastilles du hero, lien « Connexion », tuiles : tout est neutre. **PASS.**
- **Abonné (en-cours, nouvel)** : un seul aplat plein par écran (« Les cartes du jour » ou « Commencer »). La carte Z1 porte une teinte et un bord violet doux, ce qui est permis. Ni le cap, ni les barres, ni la flamme, ni les pieds de tuile ne sont violets. **PASS.**
- Le point violet de la cloche et le bouton de l'en-tête sont dans l'en-tête global : non comptés.

## 3. Constat par compte

**Visiteur.** 375 : pastille « Premium » à droite du H1, promesse, 6 pastilles (3 lignes de 2), carte d'offre (bouton plein pleine largeur, réassurance, « 1 500+ », « Connexion »), puis le haut de la première tuile « Ton premier pas » avec son verrou et son bouton en contour éteint, tout dans 812 px. 1280 et 1920 : hero 2 colonnes (texte à gauche, carte d'offre à droite, bouton en haut), preuve sous les pastilles, 128 px d'air voulu, puis la rangée 1 (Z1 7 colonnes + cap 5 colonnes) et le haut de la rangée 2 fondue. Le produit est donc visible dès le premier écran à toutes les largeurs.
**Gratuit.** Identique sans « Connexion », avec la phrase d'objet (« Premium ouvre tout… ») sous le bouton, 24 px avant la réassurance. Cohérent avec le visiteur.
**Abonné en-cours.** « Si tu as 5 minutes » + « Les cartes du jour » en carte dominante (7 colonnes), « Ton cap » (cap 2 sur 5, 250 XP, 1 jour d'affilée, aide) à côté, puis « Étape en cours » (barre, « Étape 3 sur 3 », « Reprendre ») et « Mission · Marche 2 ». Rangées pleines, aucune cellule vide.
**Nouvel abonné.** « Ton premier pas » + « Commencer » (violet), « Ton cap » avec « Ta série démarre à ta prochaine pratique. », « Étape conseillée » + « Commencer l'étape 1 », « Tes 4 premières semaines », « Contenu du jour ». Jamais une page morte : l'action est en haut, la feuille de route et le contenu du jour sont dessous.

## 4. Grille

### Design

| Critère | Note | Évidence et défaut |
|---|---|---|
| 1 Élégance, fidélité à l'accueil | 9 | Une famille de cartes (`rounded-xl`, bord 1 px, `p-6`), 4 tailles, aucun effet. Défaut : à 1280 et 1920, la colonne de texte du hero est plus basse que la carte d'offre de 17 px seulement (preuve à y 365), mais le bloc « hero + 128 px d'air » se lit comme un trou franc avant l'extrait (y 380 à 505). Permis par le brief, mais l'œil le lit comme un blanc. **Pour 10 :** réduire le vide perçu sans toucher au second bouton, par exemple placer la preuve et le fondu du hero sur le même alignement que la carte (déjà fait), et ne rien changer sinon : c'est une piste, pas une faute. |
| 2 Hiérarchie, un seul accent | 9 | Aperçu : l'œil va H1 puis bouton plein (le seul aplat) puis tuiles. Abonné : Z1 teintée + bouton plein dominent. Défaut mineur : en-cours à 1280, Z1 contient trois cibles (bouton, deux lignes « Nouvelle » / « À revoir ») qui se font concurrence visuelle avec « Reprendre » plus bas. **Pour 10 :** rien de codable sans toucher la structure ; piste. |
| 3 Usage de la largeur | 9 | Rangées pleines à 5 largeurs : 7/5, puis 4/4/4 (aperçu), 5/7 (nouvel), 6/6 (en-cours). Aucun débordement, aucune tuile creuse. Vide de fin de carte seulement (Z1 nouvel sous « Commencer », Z2 en-cours sous l'aide). À 1280 le tiers droit de Z1 (nouvel, aperçu) reste vide à droite du bouton : fin de carte, permis. Contenu du jour à 1280 : 2 colonnes (vanne et conseil empilés, vidéo à droite) au lieu de 3 x 4 de la spec : mieux (pas de vide), à acter dans la spec. |
| 4 Cohérence entre comptes | 9 | Mêmes tuiles, même rythme (24 px), même Z2 aux deux états. La preuve change de place (dans la carte sous 1024, sous les pastilles dès 1024) : voulu, une seule rendue à la fois (`display: none` sur l'autre). |
| 5 Finition au pixel | 9 | « Connexion » : `min-h-11 min-w-11` (`offre-apercu.tsx` l. 87) ; bouton `size="lg"` ; pieds de tuile `min-h-12`. Contrastes : réassurance en 14/400 `text-secondary` sur carte, AA ; tuiles de l'extrait à `opacity-75` (inertes, `aria-hidden`), les étiquettes restent lisibles (environ 4,7:1). Écart de rythme non mesuré : pastilles du hero à 375 en `px-2 py-0.5` (décision du tour 8, hors pas de 8 px, mais interne à un helper et non cliquable, donc toléré). Léger défaut : « Tes 4 premières semaines » (20/600) démarre 5 px plus bas que l'étiquette de la tuile voisine « Étape conseillée », deux titres de niveaux différents sur une même rangée. **Pour 10 :** aligner le haut du titre sur la ligne d'étiquette (`semaines-tuile.tsx`, `mt-0`), piste. |

### UX

| Critère | Note | Évidence et défaut |
|---|---|---|
| 1 Prospect : envie de s'inscrire en 3 secondes | 9 | Fermé lisible : pastille « Premium » (verrou + mot) à côté du H1, bouton d'offre à 1,99 €/mois en haut à toutes les largeurs, une seule offre à l'écran, verrou nu sur chaque tuile, boutons figés en contour (pas de plein), fondu vers le fond, « La suite est dans Premium » avec son bouton plus bas. À 375 le produit apparaît dès le premier écran (tuile Z1). Défaut : le « Commencer » en contour reste lu par certains comme un bouton cliquable désactivé, et l'envie repose sur des libellés neutres (promesse T1 + pastilles) sans aucune preuve visuelle de gain. **Pour 10 :** ajouter à Z1 figée un état éteint plus net (texte `text-text-secondary` dans `action-du-jour.tsx` mode `fige`) ; piste. |
| 2 Abonné : je sais quoi faire | 9 | Nouvel : un seul plein « Commencer », visible à 375 (y 418) comme à 1280. En-cours : « Si tu as 5 minutes » puis « Les cartes du jour » plein. Défaut : sur le nouvel abonné, « Commencer » (premier pas) et « Commencer l'étape 1 » (lien dans « Étape conseillée ») portent le même verbe pour deux actions : légère ambiguïté. **Pour 10 :** laisser « Commencer l'étape 1 » (texte validé) mais le garder en lien discret (c'est déjà le cas) ; piste, aucune faute. |
| 3 Abonné : envie de continuer | 9 | Cap, série, XP, parcours et mission visibles dès le premier écran à 768, 1280, 1920. À 375, la série et les XP de l'en-cours tombent sous le pli (seul le haut de « Ton cap » apparaît à y 812) : conforme à la spec (Z1 entière puis haut de Z2) mais moins motivant sur mobile. **Pour 10 :** piste de contenu (ligne cap compacte au-dessus de Z1), pas de taille de police. |
| 4 Nouvel abonné, jamais une page morte | 10 | Action en haut, cap à 1, série à démarrer, étape conseillée, feuille de route sur 4 semaines, contenu du jour, question C9 après le premier pas. Aucun écran vide. |
| 5 Accessibilité et cohérence | 9 | Un H1, phrase `sr-only`, extrait `inert` + `aria-hidden`, un seul repère « Premium » par page, cibles 44 px au code, ordre du DOM = ordre de lecture. Réserve : la lecture lecteur d'écran porte l'offre dans le hero, alors que `Preuve` existe en deux exemplaires dans le DOM (un `display: none`, non lu, correct). Contrastes de l'extrait inerte exemptés. |

## 5. Écarts à la spec (non bloquants, à acter)

1. Spec design §2.2 : verrou nu au coin de Z1 seule, « jamais sur toutes les tuiles ». Le rendu met un verrou sur les 5 tuiles. Cela aide à la lecture « fermé » ; décision à acter par @design plutôt que corriger en silence. Faute dure ? Non : le repère « Premium » en mot reste unique et le brief de Thomas demande un aperçu fermé au premier coup d'œil.
2. Contenu du jour en 2 colonnes à 1280 (spec : 3 x col-4) : acter.
3. Gratuit : « les 5 parcours » dans la phrase d'objet (spec : « N parcours ») ; texte non réécrit, à faire vérifier par Thomas que le nombre est bien exact.
4. T1 (promesse) et T2 (« La suite est dans Premium ») : jugés sur leur place : bien placés (promesse sous le H1, T2 entre l'extrait et le second bouton).

## 6. Verdict

Aucune faute dure : gate typographique PASS sur les 16 lignes mesurées (4 tailles, 6 combinaisons, graisses 400 et 600, aucune capitale), un seul aplat violet par écran (bouton plein, teinte douce permise sur Z1 abonné), aucun vide au milieu d'un bloc, aucune page morte. Le prospect lit « fermé » à 375 comme à 1280, voit le produit verrouillé dès le premier écran et trouve l'offre en haut. L'abonné sait quoi faire en 3 secondes. Les notes de 9 portent sur des pistes (vide perçu de 128 px, série sous le pli à 375, verbe « Commencer » répété, alignement du titre des semaines), pas sur des fautes.

NOTE GLOBALE : 9/10

Fautes dures :
Aucune.
