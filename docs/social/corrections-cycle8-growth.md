# Corrections du cycle 8, angle @growth (s15, 07/10/2026 au soir)

> Périmètre : points « Pour 10/10 » de `notation-relance-cycle8-growth.md` (K1, K6, K8), de `-reviewer.md` (K1) et de `-social.md` (D4, D5, S8 côté stratégie). Fichiers modifiés par @growth : `mesure.md`, `strategie-relance-v5.md`, `plan-execution-s15.md`, `mix-formats-s15.md`. Aucun [CHOIX UTILISATEUR] rejoué (`founder-preferences.md`:59, :61-62, :65, :67) : pas de compte gratuit, cadence 5/5/2 par le mix, barre Alexa intacte, clé `insights:read` « plus tard », aucun réseau en pause. Aucune donnée inventée : un manque reste `[À VÉRIFIER]`.
> Limite de cette session (reprise après redémarrage du conteneur, comme la précédente) : pas de shell (Bash désactivé). `git pull --no-rebase` non exécuté, état lu sur disque ; diff mesuré à la main (section 4), à confirmer par `git diff --stat`. Les passes précédente et de reprise ont été vérifiées ligne à ligne contre les 3 notations (preuves : colonne « fichier:ligne », numéros de l'état actuel des fichiers).

## 1. Points traités

Statut : **Fait** (prouvé par la ligne citée), **Fait en reprise** (corrigé dans cette session), **Ouvert** (hors pouvoir de @growth ou calendaire, raison écrite).

| Réf. | Point | Statut | fichier:ligne |
|---|---|---|---|
| Growth K1-a' | Stock de vannes aligné sur le recompte du 07/10 (25 au 12/10, hors lot = 0, plancher et manque `[À RECOMPTER : --pool]`, plus de « environ 5 hors lot ») | **Fait** ; libellé « 32 » précisé en reprise | `mix-formats-s15.md`:9, :12, :14, :15, :17 ; `plan-execution-s15.md`:37, :45, :49, :50 |
| Social D5 (reste) | Écart 22 (script) contre 23 (plan) sur le stock éligible | **Fait en reprise** (`[À RECOMPTER @copywriter par --pool]`, non tranché : aucun chiffre inventé) | `plan-execution-s15.md`:49 |
| Growth K1-b | 3 phrases périmées de v5 : C2 sans test dans l'application du réseau, lien de bio provisoire supprimé, point 6 (test de session + preuve D8), événements de la persistance | **Fait** | `strategie-relance-v5.md`:34, :59, :67, :64 |
| Growth K1-b' | Étalons et R9 déjà signés le 06/10 : renvoi au choix, rien redemandé à Thomas | **Fait** | `mix-formats-s15.md`:29, :32-38, :64 ; `plan-execution-s15.md`:12, :80 |
| Growth K1-d | ARPU : formule annuelle 24,99 €/an = 2,08 €/mois, `[HYPOTHÈSE : mix inconnu]`, recalcul à 30 jours | **Fait** | `mesure.md`:94 |
| Reviewer K1 (1) | Critère Marc : une seule règle, celle de `mesure.md` §5 fait foi, `inscription-envoi` hors critère | **Fait** | `strategie-relance-v5.md`:19 ; `mesure.md`:88 |
| Reviewer K1 (2) | Colonne C4 LinkedIn du registre : preuve du 06/10 (`sent` 08:18, `urn:li:share:7513120421135708160`), relue contre `releves/2026-10-06.md`:7 : conforme | **Fait** | `mesure.md`:106 |
| Growth K8-c | `abonnement-*` avec `origine`/`contenu` depuis le 06/10 07:45 ; bouton `abonnement` (étape `etape-1`) ; « une fois livrée » et `[À VÉRIFIER dans le code]` retirés | **Fait** | `mesure.md`:22, :50, :93, :96 |
| Growth K8-d | Ruptures de série : fin du compte gratuit déployée le 06/10 07:45 (Worker `fd1a595d`), `origine` sur `abonnement-*`, panne Stripe du 30/09 au 07/10 ~15:15 (`712ee919`), s16 du 07/10 14:31 ; base payante : « 7 jours de checkout cassé » | **Fait** | `mesure.md`:110, :125-128, :95 |
| Growth K8-e | Relevés `releves/` reportés dans la semaine 0 (prévu/publié, avec/sans lien : X 1 / 1, Instagram 0 / 2, LinkedIn 0 / 1, « échauffement ») ; source de la colonne citée ; relu contre `releves/2026-10-06.md` et `2026-10-07.md` : conforme | **Fait** ; semaine complète à reporter le 12/10 | `mesure.md`:140-142, :148 |
| Growth K6-d | Règle de correction Google par application (`inscription-envoi methode=google` ≥ 5 et 0 compte Google en base), `[HYPOTHÈSE : seuil 5]` | **Fait** | `mesure.md`:52 |
| Social D4 | Colonne « Commentaires reçus / répondus sous 24 h » (§3 et §6), lue, jamais jugée | **Fait** | `mesure.md`:53, :132, :134 |
| Social D5 | `mesure.md` : F1 heure B fait ; fenêtre Instagram du mar. 13/10 au jeu. 05/11, 12 posts, 6 par bras | **Fait** | `mesure.md`:160, :166 |
| Social S8 (stratégie) | Garde de pose de la bio : « le quiz est dans le lien de la bio » seulement si la pose est consignée au registre la veille | **Fait** côté stratégie ; le codage de la garde reste à @fullstack | `strategie-relance-v5.md`:56 |
| Social K5 résidu | Vannes de bureau : « 0 libre au niveau au 12/10 », repli du mix, plus de `[À VÉRIFIER]` sur le compte | **Fait** | `plan-execution-s15.md`:45 ; `mix-formats-s15.md`:17 |
| Écarts relevés hors liste, alignés sur choix signés (reprise) | (a) C2 « et test dans l'application du réseau » encore dans le GO/NO-GO ; (b) date de la rupture « compte gratuit » non datée en v5 ; (c) entonnoir de v5 sans `abonnement-*` ; (d) pause automatique, 3/3/1 et réallocation SEO encore écrits aux endroits qui contredisent `founder-preferences.md`:57 (D8) et :59 (aucun réseau en pause) | **Fait en reprise** : phrases alignées sur `mesure.md`:85 et sur D8, aucun seuil ni cadence modifiés. Hors périmètre, non touchés : pause technique après 2 FAILED et retour arrière admin (fiabilité, @fullstack/@qa) | `plan-execution-s15.md`:145 (a), :108, :162, :173, :177, :203 (d) ; `strategie-relance-v5.md`:18 (b), :99 (c), :110 (d) |
| Growth K6-a / K1-c | Bios : X posé (`REPLIT_ACTIONS.md`:122), Instagram et LinkedIn non posées ; date de pose et visite Umami au registre | **Ouvert** : seul Thomas peut poser (1 min x 2) ; le registre reste `[à renseigner]` / `[À VÉRIFIER auprès de Thomas, une fois]`, aucune date présumée | `mesure.md`:116-118 |
| Growth K8-a | Preuve D8 : 1 événement Umami de test par `origine`, daté | **Ouvert** : aucune preuve consignée, aucune ne peut être inventée ; échéance dim. 11/10, sinon J0 au 19/10 | `mesure.md`:106, :108 |
| Growth K8-f | Baseline 2 du 11/10 | **Ouvert, calendaire** : non produisible avant cette date | `mesure.md`:143-146 |
| Reviewer 8 (P0 s11) | `git diff --stat` consigné | **Ouvert** : pas de shell ici ; estimation à la main en section 4 | section 4 |

## 2. Hors domaine @growth, non touché

- **K6-c** : requête SQL en lecture sur `BlogArticle.content` et `title` (« compte gratuit », « gratuitement », « Crée ton compte »), @fullstack ou @data-analyst ; 0 attendu sur les articles relayés (12/10 au 09/11).
- **K5 (a) à (e)** du reviewer : dry-run 1a relancé et recette D1a mise à jour, relecture à l'aveugle du renvoi du relais X du 12/10, CL:18 et REC:48 (V083 au 23/12), V028 et V060 exclues du tirage et test Jest, fiche IG du 21/10 : @fullstack et @copywriter.
- **Social** : S5 à S7, S10, F2, F3 (mix codé), F4 (`[jour:dimanche]`), S9 (heure d'hiver), C4 à C7 (relecture à l'aveugle, LinkedIn sans bureau, variété « copain »), T1 à T3 (Thomas).
- **K8-a** : porteur @data-analyst avec la session ; K6-a : Thomas.

## 3. À changer dans `REPLIT_ACTIONS.md` (non modifié ici)

- :176 affirme la rupture « datée du 06/10 07:45 (`mesure.md` §6) » : le fichier la porte maintenant (`mesure.md`:110, :125-126). Aucune correction à y faire.
- À consigner par la session au fil des preuves : date de pose des 3 bios (:122-124), preuve D8 par `origine`, ligne de la panne Stripe (:66) déjà citée par `mesure.md`:127.

## 4. Diff mesuré (à la main, sans shell : à confirmer par `git diff --stat`)

- **Cette session de reprise** : 11 lignes touchées (`plan-execution-s15.md` 7 sur 249, `strategie-relance-v5.md` 3 sur 207, `mix-formats-s15.md` 1 sur 73), soit 2 à 4 % par fichier ; `mesure.md` et `corrections-cycle8-growth.md` hors diff de contenu (ce dernier réécrit).
- **Passe précédente** (comptée sur les lignes citées en section 1) : `mesure.md` environ 30 lignes sur 197 (15 %, surtout ajouts de dates, de propriétés et de 3 lignes de rupture) ; `strategie-relance-v5.md` environ 6 lignes (3 %) ; `mix-formats-s15.md` environ 8 lignes (11 %) ; `plan-execution-s15.md` environ 10 lignes (4 %). Aucun rapport n'annonce « réécriture complète » (P0 s11).
- **Intouchables vérifiés par relecture** : seuils du §4 de `mesure.md`:61-78 identiques à `strategie-relance-v5.md`:103-109 et à leurs sommes de contrôle (190 / 50, 480 / 135, 50 / 10, 125 / 25) ; cadence 5/5/2, barre Alexa, R1 à R9, grille hebdomadaire, id de vannes `cs14…`, dates d'articles, prix (2,99 € / 24,99 €) et chiffres du site inchangés. Aucun slug, H2, FAQ ni lien de site concerné (documents internes).

---
**Handoff → @orchestrator**
- Fichiers : `docs/social/corrections-cycle8-growth.md`, `mesure.md`, `strategie-relance-v5.md`, `plan-execution-s15.md`, `mix-formats-s15.md` (tous dans `/home/user/Marrant/docs/social/`).
- Fait : tous les points @growth des 3 notations sont soldés ou nommés ouverts ; 11 lignes ajustées en reprise (22 contre 23, C2 du GO/NO-GO, date de rupture et entonnoir de v5, pause et 3/3/1 alignés sur `founder-preferences.md`:57 et :59).
- Ouvert, hors de mon pouvoir : bios Instagram et LinkedIn (Thomas), preuve D8 avant le 11/10, baseline 2 du 11/10, K6-c SQL, K5 (a) à (e).
- Limite : pas de shell, donc ni `git pull --no-rebase` ni `git diff --stat` ; à lancer par la session, puis `git show <branche déployée>:fichier` avant toute validation.
- Prochaine étape : @data-analyst et la session pour D8 ; renoter K1, K6, K8 après la baseline 2.
