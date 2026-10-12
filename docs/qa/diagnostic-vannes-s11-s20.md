# Diagnostic : vannes revenues à leur texte d'avant s11 (s20)

> @fullstack, 12/10/2026. **Lecture seule** : base Neon de prod (API SQL HTTPS, transaction `read-only`, SELECT uniquement), base Replit d'origine (6 vannes actives, même méthode), sitemap et fiches servies (`curl`), fichiers du dépôt. Aucune écriture en base, aucun déploiement, aucun code modifié, pas de commit.
> Suite du §2.4 de `docs/qa/diagnostic-base-vs-s11-s20.md`. Correspondance = texte exact `Joke.content`, comme la tâche `catalogue-content` et `resolveStepJokes`.

## 0. Résumé

- **Chiffres confirmés** : sur les 249 vannes de `blagues-seed.json` qui ont un `previousContent`, **190 portent l'ancien texte** (190 lignes, toutes `generatedByAI = false`), **0 porte le texte s11**, 59 n'existent plus en base (57 sans trace, 2 proches de l'ancien texte, inactives). **6 actives, 184 inactives.** Les 6 sont identiques à la base Replit (texte et chute), la cause est donc bien la copie du 30/09.
- **Correction du §2.4 précédent** : les « 13 au nouveau texte » sont en fait les 13 vannes du seed **sans** `previousContent` (non réécrites en s11, « 13 inchangé(s) » dans la note du marqueur). Aucune réécriture s11 de vanne n'est en base.
- **Fait décisif** : l'audit s14 (30/09, après la bascule) a relu à l'aveugle **les textes en base, donc les anciens**. Les 6 actives sont les survivantes de cet audit (au niveau à 2 sur 2, ou 1 plus départage). Trois d'entre elles sont les **étalons plancher de Thomas** (`[CHOIX UTILISATEUR]` du 30/09, `joke-quality-bar.ts`), et cinq sont désignées par leur texte exact dans des étapes de parcours relues à 10/10. Les 184 inactives ont été retirées par ce même audit.
- **Conséquence** : pour les vannes, c'est l'ancien texte qui est la version validée. Les textes s11 n'ont jamais été en ligne ni relus à l'aveugle avec la barre s14.
- **Recommandation : (c)** ne rien réappliquer, et neutraliser les deux pièges qui réécriraient ces vannes (bump de `catalogue-content`, seed de développement).

## 1. Inventaire des 190

| Groupe | Nombre | Sort à l'audit s14 du 30/09 (fichiers `docs/copy/audit-vannes-s14/`) | Usages actuels |
|---|---|---|---|
| Actives | **6** | Relues à l'aveugle (`aveugle-1/2.txt`) : 5 gardées à 2 sur 2, 1 (`…0030`, « ambition ») à 1 sur 2 puis départage. Toutes dans `references-au-niveau.txt` et `catalogue-vannes-valides.md` | Voir §2 |
| Inactives, relues à l'aveugle, non gardées | 116 | Retrait de « tout ce qui est sous la barre » (décision s14) | Aucune |
| Inactives, vague 2 « sous l'étalon » | 54 | Retrait sur échantillon validé par Thomas | Aucune |
| Inactives, vague 1 (doublons, calembours…) | 8 | Retrait | Aucune |
| Inactives, réécriture s14 tentée puis « RETIRER » | 6 | `reecritures-lot-A/B.json` | Aucune |

- **Toutes** les 190 figuraient dans `export-vannes-actives.txt` (export s14 de la base) : elles étaient actives au moment de la bascule.
- `isActive` : 6 vrai, 184 faux. `generatedByAI` : 0 vrai. `copyVerdict` : 122 « GARDER » (relecture s11 Replit), 68 vide.
- **Usages des 184 inactives** : 0 dans le sitemap (filtre `isActive`), 0 étape de parcours, 0 post social, 0 « vanne du jour » à venir, 0 article. Restes inertes : historique `DailyContent` passé pour 15 d'entre elles, 1 favori (vanne `cmmw0tpsh000pmw6260sllhy2`, inactive). Références uniquement dans des documents d'audit s11/s14.
- `cs19jkboulot%`, P0-072, P0-041 : vannes créées en s15/s19, **hors des 190** et hors du seed. Aucune collision possible avec la tâche ni le seed.
- La tâche `catalogue-content` ne touche que des lignes dont le texte est une clé ou un alias du seed : parmi les 131 actives non IA, **seules ces 6** sont concernées.

## 2. Les 6 actives

| Seed | Id | Texte en base (= Replit = validé s14) | Texte s11 attendu | Statut |
|---|---|---|---|---|
| 2 | `cmmnsqn120001th63ryms5sxv` | Mon psy m'a dit que je devais arrêter de me comparer aux autres. / J'ai vérifié, les autres n'ont pas ce problème. | J'ai arrêté de me comparer aux autres. Je me compare à moi il y a cinq ans. / Lui aussi s'en sortait mieux. | Aveugle s14 2/2 |
| 18 | `cmmnsqn12000hth63y5wqmb9d` | J'ai dit à mon chat qu'on allait chez le vétérinaire. / Depuis, il cherche « droits des animaux » sur mon ordinateur. | Mon chat m'a apporté une souris morte. J'ai dit merci, par politesse. / Le lendemain, il en a apporté deux. | Aveugle s14 2/2 |
| 80 | `cmmnsqn130027th63at2ene9i` | J'ai dit à Alexa de me raconter une blague. / Elle m'a lu mon historique de recherches. | Je cherchais quelque chose de drôle à regarder ce soir. / J'ai relu mes DMs de 2018. Ça valait tous les spectacles. | **Étalon plancher [CHOIX UTILISATEUR]**, décryptage réécrit en s14 (lot A) |
| 109 | `cmmnsqn130030th6381ol5rxt` | Mon ambition dans la vie, c'est d'être aussi confiant... / Que le mec qui répond « à peu près » quand on lui demande s'il sait nager. | Je rêve d'avoir la confiance d'un pigeon en terrasse. / Il s'approche de ma table comme s'il avait réservé. | Aveugle s14 1/2 + départage |
| 266 | `cmmnsqn15007dth63pcggw13x` | Elle m'a demandé ce que je faisais dans la vie. / J'ai dit « des erreurs, principalement ». Elle a ri. Puis elle est partie. | Elle : « Je cherche quelqu'un de drôle. » Moi : « Moi aussi. » / Long silence. On attendait tous les deux. | **Étalon plancher** |
| 323 | `cmmw0tois0002mw62b7bkcvj7` | J'ai mis mon réveil en face du lit pour être obligé de me lever. / Maintenant je dors par terre, à côté du réveil. | Pour arrêter de grignoter, j'ai caché les biscuits tout en haut du placard. / Le soir même, je les ai trouvés du premier coup. Je connais mes cachettes. | **Étalon plancher** |

Ce ne sont pas des retouches : **s11 remplace chaque vanne par une autre** (setup, chute et décryptage), sur le même identifiant. La 80 avait été remplacée en s11 au titre de la règle « pas d'IA comme sujet », abrogée par Thomas le 30/09.

### 2.1 Où elles apparaissent

| Seed | Fiche (sitemap, 200) | Étape de parcours (texte exact) | Social | Vanne du jour à venir | Articles (citation mot pour mot) |
|---|---|---|---|---|---|
| 2 | oui | **Storytelling** étape 6 (4e sur 5) | IG 17/11 rejeté ; `preparation/2026-11.md`, `file-instagram-retenue-s15.json` | 11/12 | |
| 18 | oui | **Confiance** étape 6 (2e) | | | |
| 80 | oui | (étalon : `joke-quality-bar.ts`, test `content-gates`) | **X APPROUVÉ, programmé le 13/10 10:30 UTC** (exemptée « V100 », post modèle validé) ; ~70 documents sociaux | | `blagues-sur-l-ia-assistants-vocaux` (programmé 26/10) |
| 109 | oui | **Confiance** étape 6 (1re) | X 13/11 rejeté ; `2026-11.md`, `file-x-retenue-s15.json` | 13/11 | `se-presenter-avec-humour` (**publié** 12/10), `etre-drole-sans-alcool-soiree` (programmé 21/12) |
| 266 | oui | **Boulot** étape 5 (3e) | | 09/11 | |
| 323 | oui | **Confiance** étape 2 (3e) | | | `resolution-nouvelle-annee-etre-plus-drole` (programmé 28/12) |

Toutes aussi dans `/vannes`, les pages thème de leur catégorie et `vannes-actives-s17.json` / `-s19.json`. Les liens sont par identifiant (fiche, `DailyContent`, `SocialPost.sourceId`) ; les étapes de parcours, les étalons et les articles sont **par texte**.

### 2.2 Version validée depuis s11 ?

Oui, et c'est l'ancienne : relecture à l'aveugle s14 (30/09), étalons de Thomas (30/09), choix des vannes d'étape s17 à s19 (relues 10/10 avec les parcours), stock social s15. **Aucune** relecture n'a porté sur les textes s11 de ces 6 vannes depuis l'audit indépendant s11 (29/09, avant la barre Alexa et la règle d'or P0 s18).

## 3. Risques

### 3.1 Réappliquer s11 aux 6 actives casserait

| Référence | Effet mesuré |
|---|---|
| Étapes de parcours (`jokeContents`, contrat D4) | `resolveStepJokes` ne cherche que les textes de l'étape, actives : **5 emplacements vides** (Storytelling 6, Confiance 2, Confiance 6 ×2, Boulot 5), pas de repli puisque `jokeContents` est rempli. Il faudrait réécrire les JSON de parcours et refaire valider les étapes. |
| `[CHOIX UTILISATEUR]` barre Alexa + `joke-quality-bar.ts` | Les 3 étalons du générateur, du Stand-Up Director et du contrôle du matin disparaîtraient du site. **Contraire à P0 s8** (choix documenté non re-questionnable). |
| Posts sociaux | Le X du **13/10 10:30 UTC** garde son texte (stocké dans `SocialPost.content`) mais ne correspondrait plus à la vanne du catalogue. Plan de novembre et files retenues (2, 109) désynchronisés. |
| Vannes du jour | 09/11, 13/11, 11/12 afficheraient un texte s11 jamais relu à l'aveugle (lien par id). |
| Articles | 1 publié et 3 programmés citent mot pour mot une vanne qui n'existerait plus (règle de `catalogue-vannes-valides.md`). Aucun lien vers les fiches, donc pas de lien cassé. |
| Fiches | 6 slugs changent (le slug vient du texte) : 308 automatique depuis l'ancien slug, nouveau `lastmod`, 6 URL indexées remplacées par 6 vannes différentes. |
| Décryptage | Celui de la 80, réécrit en s14 (lot A), serait remplacé par celui de s11. |
| Règle d'or P0 s18 | Remplacer une vanne validée par un texte non relu revient à mettre en ligne un contenu sous la barre tant qu'il n'a pas été relu. |
| `cs19jkboulot%`, P0-072, P0-041 | **Aucun effet** (hors des 190, hors du seed). |

### 3.2 Les 184 inactives : pas d'enjeu visible, deux pièges latents

1. **Bump de `CATALOGUE_CONTENT_PATCH_VERSION`** : réécrirait sans bruit les 190 (dont les 6 actives) et, dans le même passage, **40 conseils sur 69 et les 89 vidéos du seed** (description et exercice différents de la base, y compris les 3 fiches corrigées en s19 : `m30qZa8p_Js`, `qdqIc-uzdbA`, `rldvVgHQSvo`). Les descriptions des 3 parcours du seed sont identiques à la base. Le retour des conseils et des vidéos à l'ancien texte est hors périmètre ici, mais **aucun bump n'est sûr** tant qu'il n'a pas été diagnostiqué.
2. **Seed de développement** (`prisma/seed-data.ts`, bloqué si `NODE_ENV=production`) : sur une copie de la base (par exemple la branche Neon de test prévue en s16), il **renommerait et réactiverait les 190** au texte s11, créerait 57 vannes et **désactiverait 124 des 131 vannes actives validées** (absentes du seed). Environnement de test faux sans le voir.
3. Réactivation future : les anciens textes ont été jugés sous la barre en s14 ; les textes s11 ne l'ont jamais été avec cette barre. Ils restent disponibles dans git (`docs/copy/catalogue-s11/lot-1.jsonl`, `lot-2.jsonl`) comme candidats, sans besoin de les garder dans le seed.

## 4. Options (rien appliqué)

| | (a) s11 sur les 6 | (b) s11 sur les 190 | **(c) Rien, neutraliser** | (d) Duel à l'aveugle sur les 6 |
|---|---|---|---|---|
| Vannes changées en ligne | 6 vannes remplacées (100 % du texte) | 6 en ligne + 184 invisibles | **0** | 0 avant le verdict ; jusqu'à 3 ensuite (voir ci-dessous) |
| Geste technique | Filtre par id dans `patchCatalogueJokes` + nouveau marqueur (un bump simple toucherait 40 conseils et 89 vidéos), déploiement, appel `/api/cron/startup-tasks` | Idem sans filtre d'id, mais toujours sans conseils ni vidéos | Aligner `blagues-seed.json` sur la base pour les 6 (texte en base comme `content`, sans alias) et retirer les 184 entrées (ou leur alias) ; garde-fou sur le bump (contrôle préalable « contenu = attendu » en lecture seule). Aucune écriture en base | 3 duels au plus (2, 18, 109), 3 relecteurs, puis cascade si s11 gagne |
| Reprises en cascade | 5 étapes de parcours, 3 étalons, 4 articles, 3 vannes du jour, plan social de novembre, exports s17/s19 | Idem (a) | Aucune | Si s11 gagne : parcours (Storytelling 6, Confiance 6), 2 articles (109), novembre social, 2 vannes du jour |
| Conformité | **Viole le `[CHOIX UTILISATEUR]` barre Alexa (P0 s8)** et la règle d'or P0 s18 | Idem (a) | Conforme | Les 3 étalons (80, 266, 323) sont **exclus d'office** du duel (P0 s8) ; les 3 autres ont déjà gagné leur relecture à l'aveugle s14 |
| Risque SEO | 6 URL indexées remplacées | Idem | Nul | Faible |
| Coût | Code + tests + déploiement + revalidation de 5 étapes | (a) + rien de visible gagné | 2 fichiers + 1 garde-fou + tests, sans déploiement urgent | ~3 duels + cascade éventuelle |

**Recommandation : (c).** Pour les vannes, l'ancien texte n'est pas un retour en arrière à corriger : c'est la version que tout le travail postérieur à s11 a validée (audit s14 à l'aveugle, étalons de Thomas, parcours s17 à s19, stock social s15). Réappliquer s11 casserait ce socle pour 6 vannes déjà au niveau. Le seul travail utile est de **désamorcer les pièges** : seed aligné sur la base, entrées retirées pour les 184, aucun bump sans contrôle préalable. (d) n'a de sens que pour 2, 18 et 109, et seulement si Thomas veut rouvrir des vannes déjà validées : je ne le recommande pas.

### À traiter à part (même cause)

1. **Conseils et vidéos** : 40/69 conseils et 89/89 vidéos du seed diffèrent de la base. Diagnostic dédié (même méthode) avant toute décision et avant tout bump de `catalogue-content`.
2. Rappels du diagnostic précédent : `copie-replit-neon.py --reset` ne vide pas `DataPatch` ; les tâches à marqueur ne vérifient pas le contenu.

---

**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/qa/diagnostic-vannes-s11-s20.md`. Aucun code, aucune base, aucun déploiement touchés ; pas de commit. Exports de travail dans le scratchpad de session (hors dépôt).
- Décisions prises : aucune. Recommandation (c), soumise à Thomas.
- Points d'attention : X d'Alexa programmé le 13/10 10:30 UTC (non affecté tant que rien n'est réappliqué) ; ne lancer aucun seed de dev sur une copie de la base de prod ; diagnostic conseils et vidéos à ouvrir.
- Actions infra requises : aucune pour ce diagnostic.
- Pre-commit check : sans objet (aucun code modifié).
