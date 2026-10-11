# Relecture visuelle des 4 Open Graph (@design, cycle 9, 11/10/2026)

Objet : implémentation `4e75c61` (`cartes-og.tsx`, `polices.ts`, 4 `opengraph-image.tsx`) relue contre `corrections-cycle8-design.md` §1, critères §1.9.
Preuves lues (outil Read, images) : 12 PNG pleine taille, 12 `-x358.png`, `mesures.json`, `build-accueil.png`, `build-quiz.png`, `build-article-pilier.png`, plus le code de `cartes-og.tsx` et des routes `vannes/[slug]` et `blog/[slug]`.
Dossier des rendus (session) : `/tmp/claude-0/-home-user-Marrant/06843e1a-847e-5cbf-86fa-c026d396135c/scratchpad/og/`. Le dossier `docs/social/visuels-s15/og/` est vide dans le dépôt : les PNG de preuve ne sont pas commités (voir C4).

## Verdict global : GO déploiement

Aucun FAIL bloquant. Les 12 cas passent les 8 critères §1.9. Un défaut mineur de repli (vanne introuvable) est à corriger avant de déployer si possible (3 lignes), il ne bloque pas. Sous réserve des 4 vérifications post-déploiement du §4, dont la 1re protège le relais du 13/10.

## 1. Verdict par cas et par critère §1.9

Critères : A fond uni #0D0D0D ; B Plus Jakarta visible ; C aucun mot seul, dernière ligne >= 40 % ; D >= 64 px entre bloc et pied ; E 0 encre dans x 0-360 / y 550-630 ; F pied à droite, bord droit x 1120 ; G étiquette et URL lisibles sur le x358 ; H lilas seulement aux endroits prévus.

Valeurs chiffrées = `mesures.json` (écart au pied, bord droit 1118, fond uni, encre bas gauche 0). Pourcentages de lignes = estimés à l'oeil sur le PNG (le JSON ne donne pas les largeurs).

| Cas | A | B | C | D (px) | E | F | G | H | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| accueil | PASS | PASS | PASS (2 lignes, ~80 %) | PASS 90 | PASS | PASS 1118 | PASS | PASS « plus drôle. » | PASS |
| quiz | PASS | PASS | PASS (« Quel type » ~59 % de la 2e) | PASS 80 | PASS | PASS | PASS | PASS « es-tu ? » | PASS |
| article-se-presenter | PASS | PASS | PASS (~88 %) | PASS 127 | PASS | PASS | PASS | PASS « 5 » seul | PASS |
| article-halloween | PASS | PASS | PASS (~75 %) | PASS 125 | PASS | PASS | PASS | PASS « 8 » | PASS |
| article-pilier | PASS | PASS | PASS (~83 %) | PASS 125 | PASS | PASS | PASS | PASS « 5 », « 30 » | PASS |
| article-100-car | PASS | PASS | PASS (3 lignes, > 90 %) | PASS 103 | PASS | PASS | PASS | PASS « 12 » | PASS (corps 56, rien coupé) |
| article-repli | PASS | PASS | PASS (1 ligne, 4 mots) | PASS 187 | PASS | PASS | PASS | PASS (aucun accent) | PASS |
| vanne-courte-1re-personne | PASS | PASS | PASS (1 ligne par bloc) | PASS 133 | PASS | PASS | PASS | PASS chute + « » | PASS |
| vanne-3e-personne | PASS | PASS | PASS (3 + 1 lignes) | PASS 78 | PASS | PASS | PASS | PASS chute seule | PASS |
| vanne-longue | PASS | PASS | PASS (3 + 2 lignes) | PASS 73 | PASS | PASS | PASS (40 px = 11,9 pt, lisible) | PASS | PASS |
| vanne-400-car-repli-marque | PASS | PASS | PASS | PASS 90 | PASS | PASS | PASS | PASS | PASS (rend la carte de marque) |
| vanne-repli | PASS | PASS | PASS | PASS 183 | PASS | PASS | PASS | PASS | PASS au §1.9, **défaut de fond voir §2.4** |

Vérifications complémentaires :
- Les 3 `build-*.png` (vrai build, Node) sont identiques au rendu du script pour accueil, quiz et pilier : pas d'écart script/route.
- Plus Jakarta confirmée au « g » ouvert à une panse (« Blagues », « blog ») et au « a » à deux étages ; Inter confirmée au pied et à la sous-ligne. Aucun glyphe de repli visible (pas de tofu).
- Contrastes inchangés par rapport à la spec : #A78BFA 7,1:1, #B3B3B3 9,3:1, #D4D4D4 13,1:1 sur #0D0D0D.
- Zéro tiret cadratin, zéro « gratuit », zéro emoji, zéro dégradé sur les 12 rendus (lecture visuelle ; le test `cartes-og.test.tsx` le verrouille côté balisage).
- Critères Thomas 1 à 10 : tenus sur tous les cas (en plissant les yeux : titre, accent lilas, URL). Écart d'alignement 6 (vanne 1re personne) = 4 px de retrait du texte, voir §2.1.

## 2. Décision sur les 5 points

**2.1 « « » dans la marge (vannes à la 1re personne) : GARDER.**
Rendu : « à x 50-78, texte à x ~86, étiquette et pied sur la colonne de 80 px. C'est la suspension typographique prévue (R6, comme les cartes), les lignes suivantes s'alignent sur le texte et non sur le guillemet : lecture propre, le bloc reste calé à gauche. Sûreté : 50 px de marge ; les crops X (2:1 : 15 px en haut et en bas seulement) et LinkedIn (1,91:1) ne rognent pas à gauche ; sur le x358 le guillemet est à 15 px du bord et reste lisible, loin des coins arrondis (le bloc est à y >= 245). Écart résiduel : le texte de la 1re personne démarre 4 px plus à droite que celui de la 3e (86 contre 82) ; invisible, aucune correction. Les deux paires par vanne (une par bloc) sont bien lilas.

**2.2 Trait d'union rendu en Inter dans « es-tu » : ACCEPTER, aucune correction.**
Lecture au pixel du PNG : le trait est un peu moins épais qu'un trait Jakarta 800 (environ 9 px contre 12) mais de même hauteur et lilas, il se lit comme le trait de l'unique mot « es-tu » ; sur le x358 la différence disparaît. C'est le prix du trait insécable (U+2011 absent de Jakarta) qui empêche la coupe « es- / tu ». Option écartée : charger `Inter-ExtraBold.ttf` en 800 pour ce seul glyphe (risque sur le chargeur `polices.ts` pour un gain invisible). Réouvrir seulement si un titre d'article avec « peut-être » ou « vis-à-vis » montre un trait sensiblement plus léger (cas non rendu ici).

**2.3 Marge de jambage de 0,2 em (vanne longue 44 px vers 40 px) : ACCEPTER.**
Calcul : à 44 px, 5 lignes = 246,4 + 24 (écart) + 8,8 (jambage) = 279,2 px, soit 1,2 px au-dessus des 278 px garantis : l'encre du « p » et du « j » de la dernière ligne laisserait environ 63 px avant le pied, sous mon seuil de 64. Mon critère parle d'encre, pas de boîte : la marge est la bonne lecture. À 40 px : 73 px d'encre au pied (mesuré), 11,9 pt sur la carte mobile, au-dessus du seuil de 11 pt, lu sans effort sur le x358. Le palier intermédiaire de 42 px gagnerait 2 px de corps pour rien de visible : ne pas l'ajouter. Les jambages de « like », « p », « j » ne sont pas coupés sur le rendu.

**2.4 Repli d'une vanne introuvable (« Une vanne à ressortir ce soir », étiquette « Vanne ») : CORRIGER (non bloquant).**
Le rendu est propre mais faux : une carte étiquetée « Vanne » sans vanne, texte de 48 px blanc seul, 187 px de vide, aucune chute lilas. C'est un défaut bancal plutôt qu'un vide propre (« No Manufacturing Defaults »). Pire : si la base répond en erreur au premier passage du robot de X, cette carte reste en cache sans purge possible. La carte de marque (`OgAccueil`, déjà utilisée pour la vanne de 400 caractères) est le repli cohérent. Voir C1.

**2.5 `couperAuMot` avec « … » (jamais déclenché) : GARDER avec « … ».**
Une coupe sans points de suspension laisse une phrase qui a l'air complète et fausse (même défaut grave que la chute coupée) ; le « … » dit honnêtement que le titre est abrégé, comme une page de résultats Google. Marge réelle : un titre de 100 caractères tient à 56 px (rendu relu, rien coupé) ; par extrapolation (~0,53 em par caractère, 3 lignes de 1040 px) la capacité à 48 px est d'environ 115 caractères, donc la coupe ne joue qu'au-delà (`[À MESURER]`). Mais le « … » n'a jamais été rendu : glyphe non vérifié. Voir C3 (non bloquant).

## 3. Corrections

### Bloquantes : aucune.

### Non bloquantes

| # | Fichier | Valeur exacte | Priorité |
|---|---|---|---|
| C1 | `apps/web/src/app/(dashboard)/vannes/[slug]/opengraph-image.tsx` | Supprimer la constante `VANNE_REPLI` (l.12-13) et l'initialisation `content = VANNE_REPLI` (l.21-22). Poser `let joke = null` (vanne trouvée par `pickBySlug`), puis : `if (!joke) return new ImageResponse(<OgAccueil />, { ...size, fonts });` avant le rendu `OgVanne`. Importer `OgAccueil` depuis `@/lib/social/templates/cartes-og` (déjà exporté). Vérifier qu'aucun test ne cherche la chaîne « Une vanne à ressortir ce soir ». Le cas `vanne-repli` doit alors rendre l'identique de `vanne-400-car-repli-marque.png`. | Avant déploiement, 3 lignes |
| C2 | `apps/web/src/__tests__/lib/social/cartes-og.test.tsx` | Ajouter un cas : titre de 140 caractères, assertions `texte` se termine par « … », `lignes.length <= 3`, `corps >= 48`, aucune ligne à un mot. | Avant ou après déploiement |
| C3 | `apps/web/scripts/render-og.ts` | Ajouter le 10e cas `article-140-car` (+ `-x358`), le relire : le « … » doit être rendu en Plus Jakarta (pas de carré ni de glyphe Inter plus maigre). Si le « … » est absent de Jakarta 800, remplacer par `…` en Inter, ou à défaut couper sans ellipse n'est PAS acceptable : réduire d'abord à 80 caractères. | Après déploiement si manque de temps |
| C4 | `docs/social/visuels-s15/og/` | Commiter les 12 PNG + 12 `-x358.png` + `mesures.json` (preuve de rendu demandée au §1.9, dossier vide aujourd'hui). | Avant la clôture du cycle |
| C5 | `opengraph-image.tsx` (4 routes) | `alt` statiques (« Article blog | deviens-marrant.fr », « Vanne | ... ») : ne décrivent pas le contenu. Hors périmètre du cycle ; à traiter avec `generateImageMetadata` si l'accessibilité de la carte X est reprise. | Aucune urgence |

## 4. Vérifications post-déploiement (conditions du GO)

1. **Relais du 13/10 06:15 UTC (LinkedIn) et article `se-presenter-avec-humour`** : `curl -sI https://deviens-marrant.fr/blog/se-presenter-avec-humour/opengraph-image` doit renvoyer 200 `image/png`, puis relire le PNG servi. Il doit montrer le **vrai titre** et l'étiquette réelle, et non le repli « Le blog humour et répartie » (un article programmé ou introuvable renvoie ce repli par construction). Le rendu de ce cycle utilise un titre de test (50 caractères, étiquette « Pratique ») : à confirmer sur la route réelle.
2. **Échéance X** : ma spec §0 cite un relais X du 12/10 10:30Z pour ce même article ; X garde la carte en cache dès le 1er partage. `[À VÉRIFIER dans plan-execution-s15]` : si ce relais existe encore, le déploiement doit précéder le 12/10 10:30Z, pas seulement le 13/10 06:15Z. Même logique pour le post quiz du 14/10 07:00Z.
3. **LinkedIn** : si l'URL de l'article a déjà été collée ou crawlée, passer par Post Inspector avant 06:15 UTC le 13/10 (cache de LinkedIn).
4. **Chemin Workers** : les 3 polices sont lues par `ASSETS` en prod, seul le chemin `fs` (Node) est prouvé par le build. Mesurer le 1er rendu à froid (attendu < 3 s) et relire un PNG de vanne servi (route base) et un article en base publié.
Rappel : le gel de déploiement (§0 de la spec) tient tant que la migration 13 du lot s17 n'est pas jouée et vérifiée ; l'OG part avec le lot, sur le feu vert de Thomas.

## 5. Notes

K3 passe de 9,0 à 9,5 sur la preuve de rendu (12 cas, 3 builds) ; 10/10 conditionné à C1, à la lecture des PNG servis (§4) et à la pose des bannières par Thomas. Rien d'autre modifié ; l'historique de `project-context.md` est à compléter par la session.
