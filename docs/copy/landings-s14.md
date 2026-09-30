# Textes des nouvelles pages d'atterrissage vannes (S3, session 14)

**À valider par Thomas** avant toute intégration. Rédaction uniquement : aucune page n'est codée.

> Agent @copywriter, 30/09/2026. Sources : `docs/seo/audit-post-bascule-s14.md` (P1-6, Q3), `docs/copy/brand-voice.md`, `docs/copy/charte-refonte-copy-s11.md`, `docs/seo/keywords.md`, filtres de `components/vannes/vannes-list.tsx`.
> Registre : tutoiement, voix « le pote drôle et bienveillant », « vanne » partout sauf dans les title et H1 (SEO : « blague »). Zéro mention d'IA, zéro concurrent, zéro tiret cadratin, zéro chiffre inventé (seul « 550+ » est repris, compteur validé le 29/09).
> [Framework : PAS allégé (situation reconnue, promesse de vanne prête à sortir) · Conscience : Problem-Aware, la personne cherche « blagues de X » et veut de la matière à ressortir.]

## Contraintes techniques à respecter à l'intégration

- **Longueur des title** : le layout ajoute le suffixe `| deviens-marrant.fr` (21 caractères avec l'espace et la barre). Chaque title ci-dessous fait donc **≤ 40 caractères** pour que le title rendu reste **≤ 60**. Ne pas ajouter le suffixe à la main.
- **Meta description** : toutes ≤ 155 caractères (comptées à la main, marge 15 minimum, à recompter par le code avant mise en ligne).
- **Slugs** : `/vannes/theme/<slug>` comme demandé. L'audit SEO parlait de `/vannes/categorie/...` : le nom « theme » est retenu ici (consigne de Thomas). La route `/vannes/[slug]` (fiches) reste à un seul segment, pas de collision, mais @fullstack vérifie qu'aucune vanne n'a le slug « theme ».
- **Volumes de recherche** : aucune donnée de volume disponible (l'audit SEO le dit : niche, intentions qualitatives). Priorité = [HYPOTHÈSE : intention de recherche la plus courante en français pour « blagues de … », non mesurée, à confirmer dans Search Console après 30 jours]. Ordre de priorité ci-dessous, du plus probable au moins probable.
- **Éléments à ne pas afficher tant qu'ils ne sont pas vrais** : « la blague change chaque jour » suppose que le contenu quotidien tourne (il reprend le 01/10 d'après l'audit GEO). À vérifier par @fullstack avant mise en ligne.

---

## (a) `/blague-du-jour`

**Mot-clé principal** : blague du jour (secondaire : vanne du jour, blague drôle).

- **Title** (38 car., 59 rendu) : `Blague du jour : une vanne à ressortir`
- **Meta description** (142 car.) : `La blague du jour, avec sa chute et son décryptage pour comprendre pourquoi elle marche. Une vanne à ressortir ce soir ou à la machine à café.`
- **H1** : `La blague du jour`
- **Intro** :
  Une vanne, sa chute, et l'explication de ce qui la fait marcher. Tu la lis, tu la retiens, tu la ressors ce soir au bon moment. Demain, une autre prend sa place.

**FAQ (3 questions courtes)**

1. **C'est quoi la blague du jour ?**
   Une vanne choisie pour la journée, avec sa chute et son décryptage. Elle change au fil des jours, et les précédentes se retrouvent dans le catalogue des vannes.
2. **Comment la ressortir sans avoir l'air de la réciter ?**
   Raconte-la avec tes mots, pas mot pour mot. Garde la chute pour la fin, marque une courte pause juste avant, et attends le bon moment de la conversation. Le décryptage te dit pourquoi elle marche : tu peux l'adapter à ta situation.
3. **Où trouver d'autres vannes que celle du jour ?**
   Dans le catalogue, classé par situation : boulot, couple, soirée, école. Il y en a 550+, chacune avec sa chute.

Liens internes suggérés (existants) : `/vannes`, `/blog/timing-humour`, `/blog/erreurs-blagues`, et les 8 pages thème ci-dessous une fois en ligne. Compteur « 550+ » : utiliser le compteur dynamique déjà en place, pas une valeur figée.

---

## (b) Pages thème de vannes (8 pages, par ordre de priorité)

Chaque page : catégories couvertes (enum de la base), title, meta, H1, intro. Les vannes affichées viennent du catalogue filtré (aucun texte de vanne à écrire ici).

### 1. `/vannes/theme/boulot` (catégorie BOULOT)

- **Title** (36 car.) : `Blagues de boulot à sortir au bureau`
- **Meta** (134 car.) : `Blagues de boulot pour la machine à café, la réunion et l'afterwork. Chaque vanne a sa chute et son décryptage. On rit de la situation.`
- **H1** : `Blagues de boulot pour sourire entre deux réunions`
- **Intro** : Le mail « Suite à notre échange », la réunion qui déborde, le pot de départ où tout le monde parle boulot : le bureau fournit la matière. Ici, chaque vanne est prête à sortir à la machine à café, avec sa chute et ce qui la fait marcher. Choisis-en une, teste-la demain matin.
- Liens suggérés : `/blog/blagues-travail-faire-rire-pro`, `/blog/timing-humour`.

### 2. `/vannes/theme/couple` (catégorie COUPLE)

- **Title** (34 car.) : `Blagues de couple pour rire à deux`
- **Meta** (118 car.) : `Des blagues de couple sur les courses, le canapé et le « on mange quoi ? ». Chaque vanne a sa chute et son décryptage.`
- **H1** : `Blagues de couple : la vie à deux, version drôle`
- **Intro** : La vie à deux, c'est le thermostat, la vaisselle et la télécommande qui change de main. Ces vannes rient de la situation, jamais de l'autre. Envoie-en une à ton partenaire et regarde qui sourit en premier.
- Liens suggérés : `/vannes/theme/dating`, `/blog/comment-devenir-drole`.

### 3. `/vannes/theme/dating` (catégorie DATING)

- **Title** (37 car.) : `Blagues de dating : rencards et applis`
- **Meta** (139 car.) : `Des blagues de dating sur les applis, le premier rencard et le silence après « on se rappelle ». Chaque vanne a sa chute et son décryptage.`
- **H1** : `Blagues de dating pour survivre au premier rencard`
- **Intro** : Une appli, un premier rencard, un silence de trop : le dating fournit la matière à volonté. Ces vannes rient de la situation, pas de la personne en face. Garde-en une sous le coude, elle détend mieux qu'un « et sinon, tu fais quoi dans la vie ? ».
- Liens suggérés : `/vannes/theme/couple`, `/blog/repartie-soiree-anti-malaise`.

### 4. `/vannes/theme/soirees` (catégorie SOIREES)

- **Title** (37 car.) : `Blagues de soirée pour animer l'apéro`
- **Meta** (137 car.) : `Des blagues de soirée et d'apéro à sortir entre potes, avec leur chute et leur décryptage. De quoi lancer la conversation sans forcer.`
- **H1** : `Blagues de soirée à sortir entre potes`
- **Intro** : Dans une soirée, tout le monde attend que quelqu'un lance quelque chose, et personne ne veut être ce quelqu'un. Ces vannes sont faites pour ça : courtes, faciles à replacer, avec une chute qui tombe au bon moment. Lis-en une dans le trajet, tu arrives avec quelque chose à dire.
- Liens suggérés : `/blog/repartie-soiree-anti-malaise`, `/blog/erreurs-blagues`.

### 5. `/vannes/theme/ecole` (catégorie ECOLE, « École & Études »)

- **Title** (25 car.) : `Blagues d'école et de fac`
- **Meta** (129 car.) : `Des blagues d'école et de fac sur les partiels, les exposés et les groupes de travail. Chaque vanne a sa chute et son décryptage.`
- **H1** : `Blagues d'école et de fac pour rire des partiels`
- **Intro** : Partiels, exposés, groupe de travail où une seule personne bosse : la fac est un terrain de jeu. Ces vannes se replacent au bar, à la cafétéria ou dans le groupe WhatsApp de la promo. Chacune vient avec sa chute et son décryptage.
- Liens suggérés : `/blog/comment-avoir-de-la-repartie`.

### 6. `/vannes/theme/famille` (catégorie PARENTS, « Famille »)

- **Title** (32 car.) : `Blagues de famille : parents et enfants`
- **Meta** (130 car.) : `Des blagues de famille sur les parents face au téléphone, les enfants qui ont réponse à tout et le groupe WhatsApp familial. Avec chute et décryptage.`
- **H1** : `Blagues de famille : parents, enfants et technologie`
- **Intro** : La famille, c'est le seul public qui a déjà tout entendu et qui rit quand même. Ces vannes partent des parents qui découvrent leur téléphone et des enfants qui ont réponse à tout, sans viser personne en particulier. Teste-en une au prochain appel en famille.
- Point à vérifier par @fullstack : que les vannes PARENTS parlent bien de ces situations (parents, repas de famille). Sinon adapter la meta et l'intro.

### 7. `/vannes/theme/gaming` (catégorie GAMING)

- **Title** (33 car.) : `Blagues de gamer et de jeux vidéo`
- **Meta** (127 car.) : `Des blagues de gamer sur les lags, les parties du soir et le « juste une dernière ». Chaque vanne a sa chute et son décryptage.`
- **H1** : `Blagues de gamer : la partie du soir qui finit à l'aube`
- **Intro** : Le « juste une dernière partie » qui finit à l'aube, le lag qui frappe au pire moment, le coéquipier qui joue en solo : les gamers ont leur propre folklore. Ces vannes en font des chutes, chacune avec son décryptage. Envoie-en une à ta team.
- Note : la catégorie RESEAUX_SOCIAUX (groupée avec GAMING dans le filtre « Digital & Gaming ») pourrait avoir sa propre page ensuite (`/vannes/theme/reseaux-sociaux`), à décider selon les premières données Search Console.

### 8. `/vannes/theme/autoderision` (catégorie AUTODERISION, « Auto-dérision »)

- **Title** (37 car.) : `Blagues d'autodérision : rire de soi`
- **Meta** (128 car.) : `Des blagues d'autodérision pour rire de toi sans te rabaisser. Chaque vanne a sa chute et son décryptage. Douce, jamais cruelle.`
- **H1** : `Blagues d'autodérision : rire de soi, sans se rabaisser`
- **Intro** : Rire de toi avant que quelqu'un d'autre s'en charge, ça détend une pièce. Ces vannes vont dans ce sens : le raté du quotidien devient la chute, jamais une raison de te sentir nul. Chacune vient avec son décryptage, pour que tu saches la refaire avec tes propres histoires.
- Liens suggérés : `/blog/autoderision-interactions`.
- Remarque : le libellé du site est « Auto-dérision » (avec tiret) dans les filtres ; le title et le H1 utilisent « autodérision » (graphie la plus recherchée, alignée sur le slug du blog).

---

## Objections traitées

| Objection du visiteur | Où c'est traité |
|---|---|
| « Ce sera des blagues de tonton ou vulgaires » | Métas et intros : « on rit de la situation, pas de la personne », chute + décryptage sur chaque vanne |
| « Je vais avoir l'air de réciter » | FAQ 2 de `/blague-du-jour` (avec tes mots, pause avant la chute) |
| « Je n'ai pas le temps » | Intros courtes, vannes prêtes à sortir, aucun prérequis |

## Points d'attention pour l'intégration

- Chaque meta et chaque intro est unique (aucune formule répétée à l'identique entre pages, sauf la phrase de fin « Chaque vanne a sa chute et son décryptage », volontairement stable ; @seo peut la varier si Search Console montre des méta jugées dupliquées).
- Aucun texte de ces pages ne cite de chiffre propre à la catégorie (les compteurs par thème ne sont pas validés). Si Thomas veut un compteur par thème, il faut le mesurer sur la base (avec dédoublonnage `jokes-dedupe`).
- Après GO de Thomas : @fullstack code les pages ; @seo ajoute les URL au sitemap et à `llms.txt`.

---
**Handoff → @orchestrator (puis @fullstack et @seo après GO de Thomas)**
- Fichier produit : `docs/copy/landings-s14.md`.
- Décisions : 1 page `/blague-du-jour` + 8 pages thème ; title ≤ 40 car. hors suffixe ; « vanne » dans le corps, « blague » dans title et H1 ; aucun chiffre nouveau.
- Points d'attention : volumes de recherche non mesurés [HYPOTHÈSE] ; contenu quotidien à confirmer actif ; vannes PARENTS à vérifier pour la page famille.
