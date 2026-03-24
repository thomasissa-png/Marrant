# Revue croisee — Fixes publication social media — 2026-03-24

## Resume executif (non-technique)

Deux erreurs de publication ont ete corrigees ce soir : un tweet trop long rejete par Twitter, et un post Instagram sans type de publication rejete par Buffer. Les corrections dans le pipeline principal (publish-social cron + social-media-agent) sont correctes et bien testees. **Mais il existe un chemin de publication parallele dans `instrumentation.ts` qui n'a recu aucune des deux corrections** -- c'est un risque de regression reel. De plus, la validation de longueur tweet contient une double verification a 280 ET 270 caracteres, ce qui cree de la confusion sans danger fonctionnel mais revele un manque de nettoyage. Le CAROUSEL persiste comme format fantome dans 5 fichiers malgre son retrait du type principal.

## Resume technique

- **Fixes principaux** : corrects et suffisants dans le pipeline cron `publish-social/route.ts` + `social-media-agent.ts` + `buffer-client.ts`
- **Contradiction BLOQUANTE** : `instrumentation.ts` (lignes 198-315) contient un doublon du pipeline publish-social qui ne beneficie d'aucun des deux fixes (pas de safety net 270 chars, pas de `subprofile.type` Instagram, pas de gestion `approvedBy` admin)
- **Recommandation** : **GO avec reserves** -- le cron HTTP est le chemin principal, mais `instrumentation.ts` peut publier des posts en parallele et reproduire les deux erreurs

## Contradictions detectees

| Livrable A | Livrable B | Contradiction | Criticite | Resolution proposee |
|---|---|---|---|---|
| `publish-social/route.ts` (L212) | `instrumentation.ts` (L243-264) | Le cron a un safety net tweet >270 chars avec auto-split en thread. Le scheduler dans instrumentation.ts n'a ni ce safety net ni la logique splitIntoTweetThread. Un tweet >270 chars publie via instrumentation.ts echouera chez Twitter. | **BLOQUANT** | Aligner instrumentation.ts : ajouter le safety net 270 chars + splitIntoTweetThread, OU supprimer le doublon et ne garder que le cron HTTP comme unique chemin de publication. |
| `buffer-client.ts` (L302-304) | `instrumentation.ts` (L253-261) | buffer-client.ts ajoute `subprofile: { type: "post" }` pour Instagram via createBufferImagePost. instrumentation.ts appelle correctement createBufferImagePost. **Pas de contradiction ici** -- le fix Instagram est dans buffer-client.ts qui est utilise par les deux chemins. | MINEUR | Aucune action -- le fix est dans la couche partagee. |
| `instrumentation.ts` (L219-220) | `publish-social/route.ts` (L133-144) | Le cron gere les posts approuves manuellement (approvedBy != null) meme sans score >=9. instrumentation.ts ne gere PAS approvedBy -- il filtre strictement sur directorScore >= 9. Un post approuve manuellement par l'admin ne sera JAMAIS publie par instrumentation.ts, mais le cron le publiera. | MAJEUR | Aligner la query dans instrumentation.ts pour inclure les posts approuves par l'admin (OR condition sur approvedBy). |
| `social-media-agent.ts` (L338) | `social-media-agent.ts` (L438) | Double verification de longueur tweet : check #2 rejette >280, check #9 rejette >270. Un tweet de 275 chars declenchera check #9 (issue "max 270") mais pas check #2 (ok car <=280). Un tweet de 285 chars declenchera les DEUX. Fonctionnellement inoffensif (le plus strict gagne) mais source de confusion dans les messages d'erreur. | MINEUR | Supprimer le check #2 (ligne 338, seuil 280) qui est rendu obsolete par le check #9 (seuil 270). Ou aligner les deux au meme seuil de 270. |
| `social-media-agent.ts` type SocialFormat (L53-59) | `generate-post-image.ts` (L54) + `admin/social/page.tsx` (L44) + prompt CAROUSEL (L1007-1014) | CAROUSEL a ete retire du type SocialFormat mais persiste comme case dans generate-post-image.ts, dans le mapping d'affichage admin, dans le prompt de format, et dans marketing-agent.ts. Code mort qui pourrait etre atteint si un ancien post CAROUSEL existe en base. | MINEUR | Nettoyer les references CAROUSEL dans generate-post-image.ts (default case suffit), admin/social/page.tsx, et le prompt. Conserver la validation rejet dans validatePostConstraints comme garde-fou. |

## Analyse detaillee des fixes

### Fix 1 — Twitter 280 chars

**Correctif dans publish-social/route.ts** (L212-218) : si un tweet depasse 270 chars, il est auto-split en thread via `splitIntoTweetThread()`. La marge de 10 chars (270 au lieu de 280) protege contre le comptage different de Twitter pour les emojis et caracteres accentues composes. C'est la bonne approche.

**Correctif dans social-media-agent.ts** (L437-442) : check #9 rejette a la generation tout tweet single >270 chars. Le post est rejete AVANT d'atteindre la base de donnees. C'est la premiere ligne de defense.

**Pipeline bout en bout** :
1. Generation : social-media-agent rejette >270 -- OK
2. Validation directeur : re-validation via validatePostConstraints -- OK
3. Sauvegarde DB : daily-social/route.ts sauvegarde le post -- pas de check longueur ici (normal, c'est deja fait en amont)
4. Publication : publish-social/route.ts a le safety net >270 avec auto-split -- OK
5. Publication alternative : **instrumentation.ts n'a PAS le safety net** -- PROBLEME

### Fix 2 — Instagram type manquant

**Correctif dans buffer-client.ts** (L302-316) : `createBufferImagePost()` injecte `subprofile: { type: "post" }` dans la mutation GraphQL quand la plateforme est INSTAGRAM. Tous les appelants beneficient du fix car il est dans la couche partagee.

**Pipeline bout en bout** :
1. Generation : social-media-agent genere le post Instagram -- OK
2. Publication : publish-social/route.ts appelle createBufferImagePost -- OK via buffer-client
3. Publication alternative : instrumentation.ts appelle aussi createBufferImagePost -- OK via buffer-client

Ce fix est proprement place dans la couche partagee. Rien a signaler.

## Edge cases restants

### 1. Thread part >280 chars (RISQUE REEL)
`splitIntoTweetThread()` decoupe sur les paragraphes puis les phrases. Si une seule phrase depasse 280 chars (pas d'espace de coupure possible), le chunk final depassera 280 et Buffer/Twitter le rejetera. Probabilite faible (une phrase de 280 chars est exceptionnelle en francais) mais le code ne gere pas ce cas.

**Recommandation** : ajouter un dernier fallback dans splitIntoTweetThread qui coupe sur les espaces si un chunk depasse encore 280 chars apres le split par phrases.

### 2. Emojis et comptage de caracteres
Twitter compte les emojis differemment (certains emojis = 2 caracteres en comptage Twitter). La marge de 10 chars (270 vs 280) est une heuristique raisonnable mais pas une garantie. Un tweet de 275 chars avec 6+ emojis pourrait encore depasser la limite Twitter.

**Recommandation** : acceptable en l'etat. Monitorer les echecs FAILED avec le message "280 characters" pour ajuster la marge si necessaire.

### 3. Post LinkedIn sans validation longueur dans publish-social
Le cron publish-social n'a aucun safety net pour LinkedIn (max 1300 chars) ou Instagram (max 2200 chars). La seule protection est la validation en amont dans social-media-agent.ts. Si un post est cree/modifie manuellement via l'admin avec un contenu trop long, il sera publie tel quel.

**Recommandation** : risque faible (LinkedIn tronque sans erreur, Instagram aussi). Pas d'action immediate requise.

### 4. Image Instagram URL dynamique en fallback
Si l'image n'est pas pre-generee (Object Storage), publish-social utilise une URL dynamique (`/api/social/image?postId=...`). Buffer doit pouvoir atteindre cette URL pour telecharger l'image. Si le serveur Replit est en cold start ou lent, Buffer pourrait timeout.

**Recommandation** : deja signale dans le code (console.warn). Monitorer les echecs Instagram lies aux images.

### 5. instrumentation.ts utilise sourceId pour le retry tracking
Le scheduler dans instrumentation.ts (L297-311) utilise `post.sourceId` pour tracker les retries (`retry:N`), alors que publish-social/route.ts utilise `post.directorNote`. Cela signifie que si un post echoue dans un chemin et est retry dans l'autre, le compteur de retries repart a zero et le sourceId est ecrase.

**Recommandation** : aligner le mecanisme de retry entre les deux chemins, ou supprimer le doublon.

## Angles morts

1. **Pas de test d'integration E2E pour le pipeline complet** : les tests unitaires couvrent validatePostConstraints et les horaires, mais aucun test ne simule le flux daily-social -> DB -> publish-social avec mock Buffer. Un tweet de 275 chars genere par l'IA ne serait detecte qu'en production.

2. **Pas de monitoring/alerte sur les posts FAILED** : le cron envoie un email si TOUS les posts echouent, mais un echec isole (1 post sur 5) passe sous silence. Les echecs Twitter/Instagram de ce soir n'ont probablement PAS declenche d'alerte car d'autres posts ont pu reussir.

3. **Absence de test CAROUSEL dans social-media-agent.test.ts** : la validation rejet CAROUSEL (check #8) n'est pas testee unitairement. Si quelqu'un retire ce check par erreur, aucun test ne le detectera.

## Decisions a confirmer

1. **instrumentation.ts** : ce fichier contient-il un scheduler actif en production, ou est-il un vestige desactive ? Si actif, les deux corrections (safety net 270 + approvedBy admin) DOIVENT y etre portees. Si desactive, le marquer clairement avec un commentaire `// DEPRECATED`.

2. **Seuil 270 vs 280** : la double verification dans validatePostConstraints (check #2 a 280 + check #9 a 270) doit etre nettoyee. Quel seuil retenir ? 270 est plus prudent, recommande.

3. **Nettoyage CAROUSEL** : confirmer que le format CAROUSEL peut etre retire de generate-post-image.ts, admin/social/page.tsx, et du prompt dans social-media-agent.ts sans impact sur les posts existants en base.

## Recommandation

**GO avec reserves**

Les fixes dans le pipeline principal sont corrects, bien places (generation + publication), et couverts par des tests unitaires. Le pipeline daily-social -> validation -> publish-social est protege de bout en bout contre les deux erreurs.

**Reserves (a traiter avant la prochaine session de publication)** :

| Priorite | Action | Responsable |
|---|---|---|
| **P0 BLOQUANT** | Aligner instrumentation.ts avec les fixes publish-social (safety net 270 chars + approvedBy admin) OU le desactiver | @fullstack |
| P1 | Nettoyer la double verification 280/270 dans validatePostConstraints | @fullstack |
| P1 | Ajouter un fallback word-break dans splitIntoTweetThread pour les chunks >280 chars | @fullstack |
| P2 | Ajouter un test unitaire pour le rejet CAROUSEL dans social-media-agent.test.ts | @qa |
| P2 | Nettoyer les references CAROUSEL mortes (generate-post-image, admin page, prompt) | @fullstack |
| P3 | Ajouter un test d'integration simulant le flux complet generation -> publication | @qa |

---

**Handoff -> @orchestrator**
- Fichiers produits : `docs/reviews/social-publish-review.md`
- Decisions prises : GO avec reserves, 1 contradiction BLOQUANTE identifiee (instrumentation.ts non aligne)
- Points d'attention : instrumentation.ts est un doublon du pipeline publish-social qui ne beneficie pas des fixes Twitter/Instagram. A aligner ou desactiver en priorite P0 avant la prochaine publication. Nettoyage double verification 270/280 et references CAROUSEL mortes en P1/P2.
---
