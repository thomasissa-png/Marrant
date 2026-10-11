# Notation relance cycle 6 (@design, 05/10/2026) : K3, K4, défauts du cycle 4, images X et LinkedIn

Base : `founder-preferences.md`, `strategie-relance-v5.md` §7-8, mes notes et celles de @reviewer (cycle 4), `v4/index.md`, `mesure.md`, le code (`cartes-piste-a.tsx`, `carrousel-piste-a.ts`, `generate-post-image.ts`, `publish-social/route.ts`, `buffer-client.ts`, `/api/social/image`). **PNG ouverts : 10 de `v4/` (ig1-1/-2, ig2-mimes-1, ig3-1/-3/-4, halloween-1/-2, relais-2, couverture LinkedIn) + 2 de `charge/`** ; non rouverts : ig2-mimes-2, ig3-2, relais-1, `charge/ig-conseil-*`. Positions estimées à l'oeil (± 3 px). Branche déployée non vérifiée (pas d'accès git ici).

## 1. Notes sur l'état réel

| Critère | Note | Preuve |
|---|---|---|
| **K3 Visuels** | **10** (cycle 4 : 9,9 / reviewer 9) | Colonne de texte à x ≈ 146 sur toutes les cartes vanne ouvertes, amorce comme chute ; cartes 3-4 à 97 ; espaces « Au jeu », « trois jours », « quiz est » ouverts ; « sans moi » sur une ligne. Mes conditions du cycle 4 (D1, D2) sont remplies, V3 et V4 passent à 10. |
| **K4 Formats** | **9** (cycle 4 : IG 9 / reviewer 8) | Instagram 9 : carrousels 2 et 4 images acceptés en brouillon Buffer (05/10, ids dans `index.md`), mais avec des PNG hébergés sur GitHub, **pas via `/api/social/image?postId=…&slide=N`** : temps de rendu `next/og` à froid, réponse vue par Buffer et existence du post en base de prod non prouvés. LinkedIn 10 en texte seul. |

K3 vaut pour les 13 cartes rendues. Si X et LinkedIn passent en images (§3), K3 redescend à 9 et K4 reste à 9 tant que le §5 n'est pas fait.

## 2. Défauts du cycle 4 : appliqué ou non

| Défaut | Statut | Preuve |
|---|---|---|
| D1 colonne fixe (123/131/143 contre 96) | **Appliqué** | `COLONNE_CITATION = 144` (code) ; rendu : texte à 146 sur ig1-1/-2, ig2-1, ig3-1, relais-2, halloween-1/-2. Plus de saut entre cartes 1 et 2. |
| D2 espaces entre mots | **Appliqué** | `ESPACE_MOTS` (+0,06 em) dans `APPROCHE` ; rendu lisible à 1080 px. Contrôle au zoom 390 px non fait (voir §6). |
| Coupe `ig3-1` (« sans / moi ») | **Appliqué autrement** | Lignes imposées, rendu à 72 px (la coupe à 88 px du reviewer ne tient pas) : « un groupe sans moi. » entière. |
| Alignement cartes 1-2 | **Appliqué** | Même x = 146 (tuteur, relais, Halloween, ig3). |
| Halloween 30/10 | **Appliqué** | `ig-halloween-date-1/-2.png` rendus, légende 60 car. |
| Test Buffer carrousels (D3) | **Fait, incomplet** | 2 et 4 images en brouillon ; voir K4. |
| Légende du relais (D4) | **Appliqué** | 75 car., dans `index.md`. |
| Document : §8 « IG2 retenu : C » | **Non appliqué** | `strategie-relance-v5.md` l.163 donne encore le texte du chat ; les duels retiennent A (mimes). @fullstack qui lit §8 publierait la mauvaise vanne. |

Goût, non bloquant : « mon rapport / de stage » coupe le groupe nominal ; amorce de `ig3-1` à 72 px contre 88 ailleurs.

## 3. Images sur X et LinkedIn : recommandation

**Réponse : oui pour LinkedIn (carte unique, avec test) ; X en test limité, pas en bascule.** Thomas a validé « X en texte seul » (préférences, ligne 56) : toute variante exige son go sur 3 exemples.

**Sources (WebSearch du 05/10/2026, résumés de recherche : pages non rouvertes, chiffres à recouper avant de les citer à l'extérieur) :**

| Source (date) | Ce qu'elle dit | Fiabilité |
|---|---|---|
| [Buffer, engagement 2026](https://buffer.com/resources/state-of-social-media-engagement-2026/) (données 2025, 18,8 M de posts X) | X : le texte seul bat images, vidéos et liens en médiane ; Premium ~0,9 % contre 0,4-0,5 % pour l'image ; comptes gratuits ~0 % début 2025 | Haute (jeu de données propre), chiffres Premium relayés par résumé |
| [Socialinsider LinkedIn 2026](https://www.socialinsider.io/social-media-benchmarks/linkedin) (T2 2026) | Document 7,00 %, multi-images 6,90 %, image 5,20 %, texte 3,95 % | Haute, pages d'entreprise |
| [AuthoredUp](https://authoredup.com/blog/best-performing-content-on-linkedin) (3 M de posts, mars 2025 à fév. 2026) | Image : portée x1,20, engagement x1,33 ; texte : x1,07 et x0,78 ; document x1,39 | Haute, **profils personnels** |
| [relais de R. van der Blom](https://upgrowth.in/linkedin-algorithm-2026-360brew-update/) | Image unique sous le texte de 30 % (inversion vs 2024) | **Moyenne, source secondaire, contredit les deux ci-dessus** |
| Blog du Modérateur 2025 / Run The Com (FR) | X : texte 3,56 %, image 3,40 % | Moyenne, attribution exacte entre les deux pages non vérifiée |

Écartés : « +150 % de retweets avec image », repris par des blogs sans source primaire. **Humour en français, image contre texte : aucune donnée chiffrée trouvée.** Je ne fais donc aucune promesse sur ce point : c'est ce que le test du §4 doit mesurer.

**Lecture.** LinkedIn : deux jeux de données solides donnent l'avantage à l'image sur le texte, un relais isolé dit l'inverse : on adopte l'image mais on le vérifie. X : la meilleure source donne l'avantage au texte, et notre compte démarre à 0 abonné (non Premium, `mesure.md` §2) : l'image sert l'identité de marque (même carte violette que Instagram), pas une portée prouvée. D'où test, pas bascule. Document PDF LinkedIn : exclu (Buffer : web, offres payantes, [source](https://buffer.com/resources/linkedin-carousels/) ; offre gratuite chez nous ; non testable par API).

**Format exact.**
- **LinkedIn : 1 carte unique 4:5, 1080x1350** (portrait, place maximale dans le fil mobile ; [Buffer, tailles](https://buffer.com/resources/social-media-image-sizes/)). Pas 2 cartes : LinkedIn affiche plusieurs images en mosaïque (v5 §8), la révélation amorce puis chute y serait perdue.
- **X : 1 carte unique 16:9, 1600x900** (X affiche entre 16:9 et 1:1 sans recadrage ; format `x` déjà défini dans `FORMATS`).
- **Gabarit** : `VanneChute` existant (aplat violet, chute seule, « » lilas R6, pied), sans nouveau design ; LinkedIn réutilise exactement la carte Instagram 4:5. Aucun « Glisse », aucune pagination.
- **Partage amorce / chute** (c'est `carteVanneUnique` + `texteAccompagnement`, déjà codés) : le texte du post porte l'amorce mot pour mot, la carte porte la chute seule, rien n'est répété. Exemple X1 : texte « J'ai dit à Alexa de me raconter une blague. » (entre « », R6) ; carte « Elle m'a lu mon historique de recherches. ». Aucune flèche, aucun « voir l'image ».
- **LinkedIn : seulement si l'amorce tient en 140 caractères** (avant « voir plus », constante `LINKEDIN_AVANT_VOIR_PLUS`). L1 canapé (88 car.) : éligible. L2 (amorce ≈ 190 car.) et L3 (relais avec lien) : restent en texte seul. Je ne retiens pas le repli `carteVanneRepli` : il répète l'amorce.
- **Texte alternatif** : amorce + chute, avec « » si R6 (déjà produit par `texteAlternatifDuPost` et `altVanne`).
- **Textes variantes de X1 et L1 à valider par Thomas** (avec une 3e vanne X) avant tout envoi : le texte validé contient la blague entière.

## 4. Test alternance texte / image (à ajouter à `mesure.md`, §3 et §4)

- **Plan** : par réseau, les vannes éligibles (X : vannes sans lien ; LinkedIn : amorce ≤ 140) alternent texte / image, paires appariées par note de duel, créneau comparable. Marqueur `[variante:texte]` ou `[variante:image]` dans `directorNote` (même mécanisme que `[article:…]`). Colonne « Variante » ajoutée au relevé du lundi.
- **Mesures** : X = impressions et (réponses + citations) / impressions ; LinkedIn = impressions et (réactions + commentaires) / impressions. Médiane par variante, lue à J+28 et J+56 avec les jalons existants.
- **Règle** : l'image est adoptée si médiane d'impressions ≥ +30 % ET taux d'engagement non inférieur ; texte conservé si l'image est à -30 % ou moins ; entre les deux, on garde le défaut. **Défaut si non concluant : LinkedIn image, X texte** (poids des sources).
- **Limite écrite** : à 0 abonné, les volumes sont faibles ; sous 6 posts par variante au jalon, verdict « non concluant », jamais de conclusion. `[HYPOTHÈSE : seuils ±30 %, aucun benchmark interne]`.

## 5. Ce que @fullstack doit coder

1. **Brouillons Buffer** : image unique sur X et sur LinkedIn (assets `image.url` + `altText`, sans métadonnée Instagram), via l'URL réelle `/api/social/image` ; supprimer les brouillons ; consigner dans `REPLIT_ACTIONS.md`. **Refaire aussi les brouillons Instagram 2 et 4 images par l'URL réelle** (K4).
2. `PostData` reçoit `platform` ; `slidesDuPost` renvoie `[carteVanneUnique(x|linkedin)]` pour un post TWITTER ou LINKEDIN portant `[variante:image]` et `threadParts = [amorce, chute]` ; sans repli LinkedIn ; amorce > 140 refusée en LinkedIn.
3. `publish-social/route.ts` : la branche texte seul (l.328-332) appelle `createBufferImagePost` pour ces posts ; le contrôle `longueurX` s'applique au texte seul (amorce), pas à l'image ; la gate G-S14 (X texte seul) accepte la variante image.
4. Rendre `v5-xli/` : 3 PNG (X1 en 16:9, L1 en 4:5, une vanne R6 à 5 lignes en 16:9) que je relis ; ajouter le test de composition (aucun mot seul, aucune ligne < 40 %).

## 6. Pour 10/10

- **K4 → 10** : brouillons Buffer par l'URL réelle (2 et 4 images) prouvés ; brouillon X et LinkedIn en image unique prouvés ; temps de réponse de `/api/social/image` relevé.
- **K3 → 10 en scope image** : les 3 PNG X/LinkedIn rendus et relus ; contrôle de `ig2-mimes-1`, `ig3-1`, `ig3-4` au zoom 390 px (D2).
- **Document** : corriger `strategie-relance-v5.md` §8 l.163 et §9 (IG2 = A mimes).
- **Décision Thomas** : go sur les textes variantes X1 et L1 ; sinon X et LinkedIn restent en texte seul et K3, K4 gardent leurs notes (10 et 9 à la preuve Buffer près).
- **Hors design** : @social compte les posts éligibles par réseau (le test exige ≥ 6 par variante) .

Handoff -> @orchestrator : fichier `docs/social/notation-relance-cycle6-design.md` ; décision attendue : go de Thomas sur le test image X et LinkedIn ; dépendances : @fullstack §5, @social §6.
