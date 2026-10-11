# Notation K7 « Fiabilité de la chaîne de publication sociale » : cycle 1 (@qa, notateur indépendant)

> s15, 05/10/2026. Plan : `docs/social/plan-relance-s15.md` (K7 = statut réel Buffer, alerte, LinkedIn débloqué, tests, prévu = publié). Objet : commit local `0c13c5f` (non déployé) + état de la chaîne pour X, Instagram, LinkedIn. Aucun code modifié.

## Note K7 : 3/10

| Sous-critère K7 | Poids | Obtenu | Preuve |
|---|---|---|---|
| Statut réel Buffer relu | 2,5 | 1,5 | Logique saine dans `0c13c5f`, mais non déployée (prod inchangée : le post IG du 02/10 est toujours PUBLISHED) et 3 trous silencieux (D2, D3, D4) |
| Alerte d'échec | 1,5 | 0,5 | Limitée 1/jour/plateforme, mais perte définitive possible (D1) ; aucune mise en pause automatique d'un canal cassé (les 33 posts IG partiraient en échec un par un) |
| LinkedIn débloqué | 2 | 0 | `PAUSED_PLATFORMS = ["LINKEDIN"]` (`publish-social/route.ts:68`) ; `social-month-plan.ts:48-58,142,175` ne connaît que TWITTER et INSTAGRAM ; `UTM_SOURCE` sans LinkedIn |
| Tests | 2 | 1 | 10 tests unitaires PASS (mocks) ; aucun test de contrat sur la requête GraphQL réelle (`filter: { status: [sent, error] }` non vérifié chez Buffer), aucun E2E de la chaîne |
| Prévu = publié | 2 | 0 | Aucun rapport « prévu contre publié » ; le constat de l'audit §4 a été fait à la main |

Note sur le rendu réel : la prod ne bénéficie encore d'aucun correctif. Même déployé tel quel, `0c13c5f` porterait K7 à 4,5/10 environ.

## Exécution

- [STATIQUE] `npx jest` (tests du commit) : 2 suites, 10/10 PASS.
- [STATIQUE] `cd apps/web && npx jest` : 191 suites PASS (1 ignorée), 2836 tests PASS (2 ignorés), 21,6 s.
- [STATIQUE] `npx tsc --noEmit -p tsconfig.build.json` : 0 erreur.
- [STATIQUE UNIQUEMENT : aucun appel Buffer réel depuis cet environnement, commit non déployé] La syntaxe de la requête `posts` (filtre `[sent, error]`, tri `dueAt`) n'est validée que par mock.

## Défauts trouvés dans `0c13c5f`

| # | Fichier:ligne | Gravité | Défaut |
|---|---|---|---|
| D1 | `lib/social/publish-failure.ts:44-53` + `lib/email.ts:42-44` | **Haute** | Le verrou d'alerte est pris AVANT l'envoi et `sendAdminAlert` avale toute erreur (et sort sans erreur si `RESEND_API_KEY` manque) : `sendAlert` renvoie `true` même si aucun e-mail ne part. Les posts étant déjà FAILED, ils ne sont plus candidats : **l'alerte est perdue pour toujours**, exactement le mode silencieux visé. |
| D2 | `lib/social/buffer-status-check.ts:99,135` | **Haute** | Post supprimé chez Buffer, `sending` ou `scheduled` durable, ou hors des 100 derniers : compté `unchanged` sans fin, puis sort de la fenêtre de 7 jours et reste PUBLISHED non confirmé **sans aucune alerte**. Il faut un seuil (ex. non confirmé 6 h après la remise = alerte « non confirmé ») et une relecture par identifiant. |
| D3 | `lib/social/buffer-client.ts:459` (`return firstId`) | Moyenne | Threads X (et tweets > 270 car. auto-découpés, `route.ts:277-283`) : seul l'ID de la 1re partie est stocké ; l'échec des parties 2..n est invisible. |
| D4 | `lib/social/buffer-client.ts:538,547` | Moyenne | Une seule page de 100 posts `sent|error` pour toute l'organisation, sans pagination : suffisant aujourd'hui, insuffisant à 3 réseaux + threads + reprise de file (rattrapage du boot compris). |
| D5 | `lib/social/buffer-status-check.ts:130` | Basse | Le passage en FAILED écrase `directorNote` (la note du directeur est perdue) ; la confirmation, elle, concatène. Incohérent. |
| D6 | `lib/social/buffer-status-check.ts:121` | Basse | `sentAt` non parsable donne une `Invalid Date` : Prisma lève et le reste du lot n'est pas traité (attrapé, mais arrêt de toute la passe). |
| D7 | `lib/social/buffer-status-check.ts:79-90` | Basse | L'alerte n'affiche ni la date ni le lien des posts en échec, seulement le 1er message ; `supportUrl` est échappé mais son schéma (`https:`) n'est pas contrôlé. |

Points vérifiés sans défaut : idempotence (mises à jour conditionnées à `status = PUBLISHED`, candidats excluant les confirmés) ; verrou horaire `buffer-status-check-AAAA-MM-JJ-hHH` 55 min (`jobs.ts:323-327`) ; tâche de boot sans verrou mais inoffensive (mêmes gardes, alerte dédoublonnée) ; Buffer injoignable = aucun changement (timeout 5 s) ; fuseau cohérent (tout en UTC, `toISOString`) ; aucun jeton ni secret dans les logs ou les notes (seuls `message`/`rawError` Buffer, tronqués à 900 car.) ; requête GraphQL protégée par `JSON.stringify`.

## Ce qu'il faut pour 10/10 (ordonné)

1. **Corriger D1** : prendre le verrou d'alerte APRÈS un envoi confirmé (`sendAdminAlert` doit renvoyer un booléen et lire `{ error }` de Resend) ; à défaut, relâcher le verrou sur échec. Test de non-régression « Resend en erreur = alerte retentée au passage suivant ».
2. **Corriger D2 + D3 + D4** : candidats non confirmés depuis plus de 6 h = alerte « non confirmé » ; relecture par identifiant (`post(id)`) des candidats absents de la page ; stocker tous les IDs d'un thread (ex. `threadParts` ↔ IDs dans la note) ; pagination par curseur.
3. **Interrupteur par plateforme sans déploiement** (évite de repasser 33 posts en REJECTED) : table `SocialPlatformSetting { platform @id, paused, reason, pausedUntil, updatedAt }` (1 migration) lue par `publish-social` à la place de la constante `PAUSED_PLATFORMS`, bouton Pause / Reprise dans l'admin social. Les posts restent APPROVED et repartent à la reprise (reprogrammer `scheduledAt` passés, cadence max N/jour pour ne pas tout vider d'un coup). Option sans migration : clé `JobLock` `social-pause-<plateforme>` à `expiresAt` lointaine. Variable d'env refusée : un changement de secret impose un redéploiement.
4. **Pause automatique d'un canal cassé** : erreur Buffer d'autorisation (« lost authorization », `Invalid Credentials`) au statut ou à la remise = interrupteur ON + alerte ; contrôle de santé du canal (`getBufferChannels`) avant chaque passe de publication.
5. **Débloquer LinkedIn** : retirer LinkedIn de la pause (via l'interrupteur du point 3), ajouter LINKEDIN à `social-month-plan.ts` (heure, jours, `UTM_SOURCE`, gabarit et `checkPost` LinkedIn ≤ 1300 car.), préparer et faire valider la file par Thomas, vérifier `BUFFER_CHANNEL_LINKEDIN` en prod.
6. **Carrousel Instagram** : `createBufferImagePost` (`buffer-client.ts:342,382`) n'envoie qu'UNE image (`assets: [{ image }]`). L'API Buffer accepte une liste ordonnée d'`assets` (doc Buffer, jusqu'à 10 images pour un carrousel IG) : ajouter `createBufferCarouselPost(urls[])`, un champ d'images multiples (ou URLs dérivées par index), garde 2 à 10 images et ratio 4:5 à 1,91:1. [À VÉRIFIER en [LIVE] : valeur de `metadata.instagram.type` attendue pour un carrousel.]
7. **Tests de contrat et E2E** : schéma Zod des réponses Buffer (`createPost`, `posts`) rejoué en CI ; test d'intégration de la chaîne complète (APPROVED → remis → `sent`/`error`/absent → statut + alerte) avec Buffer mocké en `route.fallback()` ; un smoke test [LIVE] avant relance (1 post réel par réseau, statut relu `sent` avec lien réel).
8. **Rapport « prévu contre publié »** : job quotidien + page admin par plateforme et par jour : prévus (plan), remis, confirmés `sent` (lien), en échec, non confirmés ; e-mail hebdo à Thomas ; écart > 0 = alerte. C'est la preuve K7 attendue à J+14.
9. **Déployer**, puis vérifier [LIVE] : le post IG du 02/10 passe en FAILED avec 1 e-mail ; après reconnexion du canal, 1 post IG de test confirmé `sent`.
