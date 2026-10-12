# Application des contenus des fiches vidéo (s20)

Décision de Thomas (12/10/2026) : appliquer en base, fiche par fiche, la version gagnante du duel (s11 corrigée, s11, ou réécrite en neutre), sans jamais changer la version de la tâche `catalogue-content`.

Statut : **non commité, non déployé**.

## 1. Mécanisme

- Données : `apps/web/src/data/video-content-s20.json` (généré par script, relu). `{ _meta: { version }, fiches: [{ seedId, youtubeId, attendu, source, cible }] }`. `cible` porte toujours `description`, `learnings` (4), `exercise`, et parfois `title`, `category`, `channelName`, `youtubeId`.
- Tâche : `applyVideoContentS20Task()` (`apps/web/src/lib/video-content-s20.ts`), branchée dans `runStartupTasks` juste après `stripVideoEmDashesTask` (les empreintes sont calculées sur le texte sans tirets).
- Par fiche :
  1. marqueur `DataPatch` `video-content-s20:v<version>:<youtubeId d'origine>` présent : fiche sautée (les marqueurs sont lus en une seule requête) ;
  2. ligne `Video` lue par l'ancien `youtubeId` (absente : ignorée, comptée « absente ») ;
  3. garde-fou (§2) ;
  4. update des seuls champs de `cible` qui diffèrent de la base, plus `updatedAt`, et création du marqueur, **dans la même transaction**.
- Résumé journalisé : `contenus vidéo s20 v1 : N fiche(s) mise(s) à jour, R refus garde-fou, S déjà faite(s)` (plus absentes ou erreurs DB s'il y en a).
- Fail-safe : une erreur DB sur une fiche est journalisée, les autres continuent ; la tâche ne lève jamais d'exception. Sans IA.

## 2. Garde-fou

- Empreinte du texte actuel : `sha256(JSON.stringify([title, description, learnings ?? null, exercise ?? null]))` en hexadécimal, 16 premiers caractères. Même calcul que le script générateur (`duel-videos/donnees.ts`, à partir de l'export SQL Neon).
- Empreinte différente de `attendu` : refus « GARDE-FOU » journalisé, aucune écriture, pas de marqueur (l'alerte revient à chaque boot).
- Forme de `learnings` : colonne `text[]`, que Prisma (moteur Node comme adaptateur `pg` sous Workers) renvoie en tableau de chaînes dans l'ordre des éléments, soit le même JSON que l'export SQL. Sur les 86 fiches en prod : 0 `learnings` NULL, 0 vide, 0 `exercise` NULL, donc aucune ambiguïté NULL / `[]`. Vérifié sur l'instantané lu en SQL, pas en exécutant Prisma contre une copie de la base.
- Autres refus : catégorie hors enum `TipCategory` ; `youtubeId` cible déjà porté par une autre ligne ; cible incomplète (description, exercice, enseignements vides).

## 3. Retour arrière

`DataPatch.note` (JSON) garde `videoId` et `before`, soit la valeur précédente de chaque champ modifié. SQL complet en commentaire de tête de `video-content-s20.ts` : il rétablit `title`, `channelName`, `youtubeId`, `category`, `description`, `learnings`, `exercise` par jointure sur `videoId` (le `youtubeId` de la fiche 68 a changé).

**Garder les marqueurs** après un retour arrière : les supprimer ferait ré-appliquer la tâche au boot suivant, puisque l'ancien texte repasse le garde-fou.

Version suivante (v2) : son `attendu` devra être l'empreinte du texte v1 en base, et non celle du 12/10.

## 4. Simulation en lecture seule sur la prod (12/10)

Lecture : API SQL HTTPS Neon, en-tête `Neon-Batch-Read-Only: true`, SELECT uniquement (119 vidéos, marqueurs `video-*` et `catalogue-content*`, index de `Video`, enum `TipCategory`). La tâche réelle a ensuite tourné sur cet instantané avec une base factice en mémoire.

| Mesure | Résultat |
|---|---|
| Fiches qui passent le garde-fou | **86 / 86** (0 refus, 0 absente, 0 inactive) |
| Résumé, 1er passage | `contenus vidéo s20 v1 : 86 fiche(s) mise(s) à jour, 0 refus garde-fou, 0 déjà faite(s)` |
| Champs écrits | description 86, learnings 86, exercise 86, channelName 22, title 8, category 6, youtubeId 1 |
| 2e passage | 0 mise à jour, 86 déjà faites |
| Tirets cadratins à retirer avant | 0 (52 marqueurs `video-em-dash:v1` déjà en prod) |

Ce résultat vaut pour le JSON lu le 12/10. Si le script régénère le fichier (relecture en cours), relancer la simulation (`scratchpad/sim-s20/lire.py` puis `sim.ts`).

## 5. Impacts

**Fiche 68 (Dany Boon, `U80fwIfPC4M` vers `JNo86HEt86w`)**
- `youtubeId` est `@unique` (index `Video_youtubeId_key`) ; aucune ligne ne porte `JNo86HEt86w` en prod. La tâche revérifie avant d'écrire, et la contrainte fait échouer la transaction en cas de collision.
- Miniature (`i.ytimg.com/vi/<id>`), lecteur intégré, JSON-LD `VideoObject` : tirés du `youtubeId` au rendu, ils basculent seuls. Le `id` de ligne ne change pas : l'URL `/videos/<slug>`, les favoris (0) et la vidéo du jour (1 `DailyContent`, liée par `videoId`) restent rattachés et affichent la version officielle.
- `video-em-dash` : le marqueur `video-em-dash:v1:U80fwIfPC4M` existe ; le nouveau texte n'a aucun tiret, donc aucun effet.
- Parcours : `parcours-seed.json` et les tâches parcours ne citent pas cet id. `boulot-base-s19.json` (export documentaire) et `videos-seed.json` gardent l'ancien id : sans effet en prod. Si `catalogue-content` était rejouée (marqueur présent, donc non), la fiche 68 compterait « absente » et les 85 autres seraient refusées par son propre garde-fou, sans écriture.
- **Durée non corrigée** : la base garde `PT7M00S`, alors que la version officielle dure 5:21 (`docs/qa/videos-officielles-faits-s20.md`). Le JSON n'a pas de champ `duration`. Décision à prendre par Thomas.

**Titres changés (8 fiches : 10, 11, 14, 15, 16, 25, 26, 27)** : le slug dérive du titre. Les anciennes URL redirigent en 308 vers la nouvelle (simulé : 8/8 vers la bonne fiche, préfixe d'id unique pour chacune). Le sitemap suit la base. Après déploiement : IndexNow sur les 8 nouvelles URL.

**Cache ISR** : les fiches vidéo se revalident toutes les 24 h. Le nouveau texte peut donc mettre jusqu'à 24 h à apparaître, sauf revalidation.

## 6. Méta des fiches vidéo

`buildVideoMetaDescription` (`lib/seo-meta.ts`) produit « Chaîne : description » en 155 caractères maximum pour la méta, Open Graph et Twitter. Il réutilise `fitDescription` : coupe en fin de phrase si cette phrase dépasse 110 caractères, sinon au dernier mot + « … ». Correctif du helper : une phrase qui finit pile au caractère limite compte désormais comme tenant.

Sur les 86 fiches : 31 coupées en fin de phrase, 25 coupées au mot (leur dernière phrase complète fait moins de 110 caractères), 30 au mot (aucune phrase ne tient). Si Thomas préfère toujours une phrase complète, même courte (16 métas feraient alors moins de 100 caractères), il suffit de retirer le seuil de 110.
