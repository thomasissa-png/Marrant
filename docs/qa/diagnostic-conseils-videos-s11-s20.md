# Diagnostic : conseils et vidéos du seed contre la refonte s11 (s20)

> @fullstack, 12/10/2026. **Lecture seule** : base Neon de prod (API SQL HTTPS, transaction `read-only`, SELECT uniquement), base Replit d'origine (même méthode), une fiche vidéo servie (`curl`), fichiers du dépôt et historique git. Aucune écriture en base, aucun déploiement, aucun code ni fichier de `docs/content/` modifié, pas de commit.
> Suite de `diagnostic-base-vs-s11-s20.md` §2.4 et `diagnostic-vannes-s11-s20.md` §3.2. Même cause : la copie Replit → Neon du 30/09 a remis `Tip` et `Video` à leur état Replit sans vider `DataPatch` (marqueur `catalogue-content:v1` du 29/09 20:26:41 : « conseils 65 mis à jour, vidéos 89 mis à jour »).

## 0. Résumé

- **Conseils (69 du seed actuel)** : **0 au texte s11**. 31 à l'ancien texte (= Replit = seed d'avant s11), **tous inactifs**. 38 actifs, **tous réécrits après s11** à partir de l'ancien texte (s14 le 30/09, s17, s18, s19) et validés à l'aveugle depuis. Les « 40 différents du seed » = ces 31 inactifs + 9 actifs pour lesquels le seed n'a pas suivi la base.
- **Vidéos (89 du seed)** : **89 sur 89 à l'ancien texte** (description, enseignements, exercice ; le champ `technique` est identique dans les deux versions), **toutes actives**, 0 au texte s11. **Aucune relecture des fiches depuis s11** : ni à l'aveugle ni par audit. Les 3 fiches corrigées en s19 n'ont changé que de titre et de durée.
- **Les deux cas ne se ressemblent pas** :
  - pour les conseils, comme pour les vannes, la base est la version validée : rien à réappliquer, seulement sécuriser ;
  - pour les vidéos, la base est l'ancien texte, jamais revalidé, avec des défauts mesurés que s11 corrigeait (formule « Regarde pour apprendre la TECHNIQUE… » en tête de 30 descriptions publiques, 170 « — » dans 52 fiches, 31 prénoms en minuscule). Le texte s11, lui, n'a jamais été en ligne ni relu à l'aveugle.
- **Recommandation** :
  - conseils : (c), ne rien réappliquer et aligner le seed sur la base ;
  - vidéos : ne pas réappliquer s11 d'un bloc ; sécuriser comme pour les conseils, retirer tout de suite les tirets cadratins (précédent du blog), puis faire **arbitrer base contre s11 par une relecture à l'aveugle** avant toute réécriture (décision de Thomas).

## 1. Méthode

- Correspondance comme la tâche `catalogue-content` : conseils par titre exact (`generatedByAI = false`, alias `previousTitle`), 69 sur 69 trouvés, 1 ligne chacun ; vidéos par `youtubeId`, 89 sur 89 trouvées.
- Versions comparées champ par champ (égalité exacte) :
  - **s11** = seed au commit `3126fb2d` (création de la tâche, 29/09 16:13) ;
  - **ancien** = seed d'avant s11 (`a025ed2a~1`) et ligne Replit de même id ;
  - **seed actuel** = `HEAD` (`f7403339`), pas l'arbre de travail, modifié en parallèle par un autre agent.
- Écart en mots : 1 − (mots communs dans l'ordre) / longueur moyenne.
- Validations : `docs/copy/audit-conseils-s14.md` et `docs/copy/audit-vannes-s14/conseils-*` (30/09), `docs/marrant/audit-conseils-s18/conseils-finaux-109.json` (08/10), commits datés du 30/09, `DataPatch`.

## 2. Conseils

### 2.1 Inventaire

| Groupe | Nb | Actifs | Texte en base | Seed actuel | Validation depuis s11 |
|---|---|---|---|---|---|
| A. Ancien texte | **31** | 0 | = Replit = seed d'avant s11 (écart 0 %) | texte s11 | Retirés le 30/09 par s14 : 5 « RETIRER » à 11:50 (`83006859`) ; 26 dont la version retouchée ou réécrite n'a pas passé la relecture à l'aveugle, « reste retiré » à 12:24 (`69699811`) |
| B. Réécrit après s11, seed aligné | **29** | 29 | = seed actuel ; pour les 25 qui existaient en s11 : écart 16 à 96 % avec l'ancien texte (médiane 85), 32 à 93 % avec s11 | = base | Audit à l'aveugle s18 (`conseils-finaux-109`), puis ajustements de parcours s18 et Boulot s19, eux aussi relus à l'aveugle |
| C. Réécrit après s11, seed resté en s11 | **8** | 8 | Version s14 du 30/09 : 6 conseils de parcours (13:12-13:26, `54e7f36a`, `df043258`), 2 retouchés (12:24, n° 40 et 45) ; écart avec s11 : 73 à 90 % pour les 6, 58 % (n° 40) et 25 % (n° 45) | **texte s11** | **Identiques au mot près** à la version validée de l'audit s18 (C001, C014, C020, C031, C048, C065, C083, C105, tous validés au tour 1) |
| D. Callback (n° 6) | **1** | 1 | = seed + paragraphe du défi Storytelling étape 6 (`parcours-storytelling:s18:defi:storytelling-6`) | sans ce paragraphe | Défi de parcours s18 validé à l'aveugle |

Par catégorie (A / B / C+D) : OBSERVATION 10/8/2, REPARTIE 9/3/1, TIMING 5/4/2, STORYTELLING 2/7/2, ABSURDE 2/3/1, JEUX_DE_MOTS 3/1/0, AUTODERISION 0/3/1.

- **Aucun conseil n'est au texte s11.** Pour le n° 28 (inactif), s11 ne changeait que 12 % des mots.
- 4 conseils (79 à 82) sont postérieurs à s11 (s17 à s19) et ne figurent pas dans le seed s11.

### 2.2 Les textes en base sont-ils ceux qui ont été audités ?

Oui, et c'est l'ancien texte qui a servi de point de départ :

- l'audit s14 (`audit-conseils-s14.md`, « 438 conseils actifs, export Neon prod du 30/09 ») a été fait sur la base **après** la copie, donc sur l'ancien texte ;
- les retouches et réécritures s14, l'audit à l'aveugle s18 (« 112 actifs, tous au niveau ») et les parcours s18-s19 ont tous été écrits et relus sur la base.

Le texte s11 des conseils n'a été en base que ~12 h (29/09 20:26 → 30/09 matin, Worker de test noindex). Il n'a jamais été servi au public ni relu avec la barre s14.

### 2.3 Usages des actifs (38)

- **25 sont les conseils des 25 étapes des 5 parcours en ligne** (Confiance, Storytelling, Boulot, Répartie, Machine à Café). Groupe C : la n° 18 est Storytelling étape 2. Groupe D : la n° 6 est Storytelling étape 6.
- 11 sont programmés en conseil du jour à venir, dont la n° 40 (28/10) et la n° 45 (12/11) du groupe C.
- Les 31 inactifs : 0 étape, 0 conseil du jour à venir, 0 favori, 0 post social ; 1 conseil du jour passé (n° 7). 18 « — » dans leur texte, sans effet puisqu'ils ne sont pas servis.

## 3. Vidéos

### 3.1 Inventaire

| | Nb | Actives | Texte en base | Écart base ↔ s11 |
|---|---|---|---|---|
| Vidéos du seed | **89** | **89** | Description, enseignements, exercice = Replit = seed d'avant s11 (0 % d'écart). `technique` identique dans les trois versions | 30 à 74 % des mots (médiane 53) |

- `updatedAt` : 86 au 28/05 (Replit), 3 au 11/10 (`m30qZa8p_Js`, `qdqIc-uzdbA`, `rldvVgHQSvo` : seuls le titre et la durée ont été corrigés par `parcours-boulot-sync`, « description et technique non vérifiées », code l.334).
- Par catégorie : OBSERVATION 24, ABSURDE 17, AUTODERISION 16, STORYTELLING 14, REPARTIE 8, JEUX_DE_MOTS 5, TIMING 5. Toutes à l'ancien texte.
- Les 30 autres lignes `Video` (hors seed) sont inactives.

### 3.2 Ce qui est servi

- Fiche publique (`/videos/[slug]`, 89 URL au sitemap, vérifié sur `fary-neymar-cmmp8p0bb0`, 200) : **la description en base**, aussi utilisée en méta-description, Open Graph et Twitter. Enseignements et exercice : réservés au Premium (s15 §1.1), servis eux aussi depuis la base.
- Vidéo du jour : 81 à venir pointent sur des vidéos du seed (lien par id). Parcours : 40 vidéos du seed citées, avec **leur propre légende** (`why` des JSON de parcours), indépendante de `Video.description`. Aucun texte de fiche n'est cité ailleurs. Social : 55 posts vidéo, tous publiés entre mars et mai.

### 3.3 Défauts mesurés (89 fiches)

| Défaut | Base (en ligne) | s11 (jamais en ligne) |
|---|---|---|
| « Regarde pour apprendre la TECHNIQUE … » en tête de description (formule scolaire relevée en s11) | **30 descriptions** | 0 |
| Tiret cadratin (règle commune n° 12) | **170 dans 52 fiches**, dont 24 dans 19 descriptions publiques | 4 dans 3 fiches |
| Prénom en minuscule dans les enseignements (« françois Guédon », « aymeric Lompret »…) | 31 fiches | 0 |
| « blague(s) » au lieu de « vanne » | 10 dans 8 fiches | 4 dans 3 fiches |
| Enseignements génériques interchangeables (signalement s11, vidéos 31 à 89) | présents | réécrits « sans inventer le contenu des sketchs » (`56afc42a`) |

Hors texte, à signaler : le gabarit de méta `${channelName} — ${description}` (`videos/[slug]/page.tsx` l.89) ajoute un « — » à la méta des 89 fiches, quelle que soit la version.

### 3.4 Validation depuis s11

- **Base** : **aucune relecture** des fiches depuis s11, ni à l'aveugle, ni par audit. Le visionnage des 10 vidéos Boulot par Thomas (`561112e6`) portait sur les vidéos, pas sur les fiches.
- **s11** : passes @copywriter du 29/09 seulement ; pas de relecture à l'aveugle au sens P0 s18. En ligne uniquement sur le Worker de test, ~12 h.
- Faits non vérifiés dans les deux versions :
  - `rldvVgHQSvo` (Vérino) annonce « 7 minutes » pour 5 min 51 réelles ;
  - `m30qZa8p_Js` décrit « les conventions sociales » pour une vidéo dont le vrai titre est « JCC 8è saison » ;
  - `qdqIc-uzdbA` a été retitré « Jamel Comedy Club Saison 9 » (ancien titre « L'impro et la répartie »).

## 4. Risques (même mécanisme que les vannes)

1. **Bump de `CATALOGUE_CONTENT_PATCH_VERSION`**, avec le seed actuel :
   - conseils : 8 conseils actifs validés (groupe C) passent au texte s11, jamais relu (dont Storytelling étape 2 et 2 conseils du jour programmés) ; le défi Storytelling étape 6 perd son paragraphe de parcours (n° 6) ; 31 inactifs changent sans effet visible ;
   - vidéos : les 89 fiches passent au texte s11 (descriptions publiques et métas d'un coup) ;
   - vannes : les 190 du diagnostic précédent changent en même temps.
2. **Seed de développement** (`prisma/seed-data.ts`), sur une copie de la base :
   - conseils : il réécrit et **réactive** les 69 conseils au texte du seed (les 31 retirés compris) et **désactive 77 des 115 conseils actifs non IA**, absents du seed ;
   - vidéos : il réécrit les 89 fiches.
3. **Les tâches à marqueur ne contrôlent jamais le contenu** : le même trou a laissé passer l'écart du 30/09 sans que personne ne le voie.

## 5. Options et recommandation (rien appliqué)

### 5.1 Conseils : (c) ne rien réappliquer, sécuriser

La base est la version que tout le travail postérieur à s11 a validée : audit s14, relectures à l'aveugle du 30/09, audit s18 des 112 actifs, parcours s17 à s19. Réappliquer s11 remplacerait 8 conseils actifs validés par des textes jamais relus (règle d'or P0 s18) et toucherait 2 étapes de parcours.

À faire, sans écriture en base :

- dans `conseils-seed.json`, aligner sur la base les 8 conseils du groupe C et l'exercice du n° 6 ;
- retirer les 31 inactifs du seed, ou les aligner sur la base. Les retirer est cohérent avec les vannes et évite qu'un seed de dev les réactive. Leurs textes s11 restent dans git (`3126fb2d`) comme candidats, et les anciens textes restent en base (Boulot s19 a réutilisé 4 conseils retirés le 30/09).

### 5.2 Vidéos : ne pas réappliquer d'un bloc ; arbitrer

| | (a) s11 sur les 89 | (b) Garder la base, la sécuriser | **(c) (b) + tirets maintenant + relecture à l'aveugle base contre s11** |
|---|---|---|---|
| Texte changé en ligne | 89 descriptions publiques, 89 métas, enseignements et exercices Premium (30 à 74 % des mots) | 0 | 0 tout de suite (hors tirets), puis les fiches où s11 l'emporte |
| Conformité | Règle d'or P0 s18 : texte jamais relu à l'aveugle | Défauts maintenus en ligne : formule scolaire (30), 170 « — » (règle n° 12), prénoms en minuscule | Conforme ; même chemin que le blog (tirets v2 appliqués le 12/10 sans changer un mot) |
| Cascades | Aucune (parcours et vidéo du jour par id et légendes propres ; slugs inchangés, faits du titre et de l'id) | Aucune | Aucune |
| Geste | Tâche dédiée aux vidéos (marqueur par `youtubeId`, contrôle préalable du contenu), **pas** un bump de `catalogue-content` (qui toucherait conseils et vannes) | Seed aligné sur la base (s11 gardé dans git) et garde-fou sur le bump | (b) + tâche « tirets » sur `Video` (description, enseignements, exercice) + relecture à l'aveugle des 89 fiches ou d'un échantillon par catégorie, décision de Thomas, puis application par la tâche dédiée |
| Risque SEO | 89 métas réécrites d'un coup | Nul | Étalé |

**Recommandation : (c).** Contrairement aux conseils et aux vannes, l'ancien texte des vidéos n'a été validé par personne depuis s11 et ses défauts sont objectifs. Le texte s11 les corrige, mais il n'a jamais passé la barre. La règle d'or interdit d'appliquer l'un comme l'autre sans relecture à l'aveugle.

### 5.3 Quelle que soit l'option

- **Aucun bump de `catalogue-content`** tant que le seed n'est pas aligné sur la base pour les trois tables, et sans contrôle préalable « contenu = attendu » en lecture seule.
- Aucun seed de développement sur une copie de la base de prod.
- Coordination : le seed est modifié en parallèle par un autre agent. Les chiffres ci-dessus portent sur `HEAD` (`f7403339`) : à recompter sur son résultat.
- Garde-fou en cours dans l'arbre de travail (non commité, autre agent, `startup-tasks.ts`) : une ligne ne serait réécrite que si elle porte encore le texte d'avant la refonte ; toute différence de vidéo serait refusée. Effet attendu sur ce périmètre :
  - les 89 vidéos et les 40 conseils qui diffèrent du seed seraient protégés (leur titre est déjà celui du seed) ;
  - tant que le seed n'est pas aligné, chaque démarrage après un bump journaliserait des refus, sans poser de marqueur ;
  - avec l'option (c) pour les vidéos, la tâche dédiée devra contourner ce refus volontairement, fiche par fiche.
  
  À vérifier quand il sera commité.

## 6. Décisions à soumettre à Thomas

1. **Conseils** : valider (c), seed aligné sur la base ; les 31 inactifs sont-ils retirés du seed ou alignés sur la base ?
2. **Vidéos** : (a), (b) ou (c) ? Avec (c) : relecture à l'aveugle des 89 fiches, ou d'un échantillon par catégorie, avant d'étendre ?
3. **Tirets des fiches vidéo** : retrait immédiat (170, dont 24 dans des descriptions publiques), comme pour le blog ?
4. **Gabarit de méta des fiches vidéo** (« Chaîne — description », 89 pages) : remplacer le « — » ? C'est du code, hors de ce diagnostic.
5. **3 fiches Boulot** (`m30qZa8p_Js`, `qdqIc-uzdbA`, `rldvVgHQSvo`) : Thomas a vu les vidéos. Les descriptions, fausses dans les deux versions (durée de Vérino, sujet des deux extraits JCC), sont à réécrire d'après son visionnage, puis à relire à l'aveugle.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/qa/diagnostic-conseils-videos-s11-s20.md`. Aucun code, aucune base, aucun déploiement touchés ; `docs/content/` non touché ; pas de commit. Exports de travail dans le scratchpad de session (hors dépôt).
- Décisions prises : aucune. Recommandation : (c) pour les conseils, (c) pour les vidéos ; soumises à Thomas (§6).
- Points d'attention : l'agent qui modifie le seed doit aligner les 8 conseils du groupe C et l'exercice du n° 6 (sinon le bump les écrase) ; aucun bump de `catalogue-content` avant alignement des trois tables.
- Actions infra requises : aucune pour ce diagnostic.
- Pre-commit check : sans objet (aucun code modifié).
