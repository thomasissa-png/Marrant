# Notation relance, cycle 7, social : K4, K5, K2 et 3 transverses (05/10/2026)

> Note indépendante @social. Lu : ma notation du cycle 6, `corrections-cycle6-copy.md` et `-social.md`, `lot-semaine0.json`, `founder-preferences.md` (05/10), `strategie-relance-v5.md`, `mesure.md`, `horaires-sources-s15.md`, `REPLIT_ACTIONS.md`, `liens-page-content.tsx`, `social-lot-v5-config.ts`, `social-calendrier.ts`, test `publish-social-linkedin-image`, PNG `visuels-s15/v5-linkedin/`.
> **Limites** : pas de shell, ni accès à la base, à la prod ou aux applications. « En ligne » vient de `REPLIT_ACTIONS.md` (déploiement du 05/10, 22:45), « en base » du JSON du lot, les notifications de la déclaration de Thomas : rien n'est requêté par moi. Aucun post publié ; aucun chiffre externe nouveau (ceux du cycle 6 restent).
> **Règle de note** : 10 = plus aucune correction possible avant les données. Sous 10, la correction est nommée (§4). Un 10 ne prouve pas que K5 est optimal : cela se lit à J+28 et J+56.
## 1. Notes
| Critère | Cycle 6 | Cycle 7 | Raison | Pour 10 |
|---|---|---|---|---|
| **K4 Formats** | 8,0 | **9,0** | Moyenne de K4a, K4b, K4c | ci-dessous |
| K4a Instagram | 8,5 | 9,0 | IG3 écrit, test Buffer 2, 3, 4 images fait ; mer. 07/10 reste une carte vanne | S1 |
| K4b X | 8,5 | 9,5 | Texte seul confirmé, test d'image défini pour J+28 ; colonne « lien oui/non » absente de `mesure.md` | D2 |
| K4c LinkedIn | 7,0 | 8,5 | Carte unique 4:5 codée, testée, déployée, rendue ; lots non régénérés, brouillon Buffer non prouvé | S4, F2 |
| **K5 Cadence** | 8,0 | **8,2** | Moyenne de K5a, K5b, K5c | ci-dessous |
| K5a Vendredi, week-end | 7,5 | 7,5 | Rien de changé : « non tranché » (`mesure.md` §7), code limité de lundi à vendredi | T4, F1 |
| K5b Plan de test | 7,5 | 8,5 | Alternance par jour écrite (v5 §1, `mesure.md` §7) ; `horaires-sources-s15.md` §6 dit encore « par semaine », code sans heure B | F1, D1 |
| K5c Cadence | 8,5 | 8,5 | Inchangée ; stock recalculé (plan §2 : 23 vannes libres au 12/10, marge 4 à 9) ; 3e post LinkedIn décidé à J+28 | aucune avant J+28 |
| **K2 Adaptation** | 8,8 | **9,6** | Moyenne des 10 posts (§3) | S1, C3 |
| Légende IG | 6,5 | 8,5 | 4 légendes « À envoyer à... » en base ; reste le pied, les relais, la relecture | C3 |
| Appel à l'action | 7,5 | 8,0 | `/liens`, `/liens/x`, `/liens/li` en ligne ; rien n'est posé dans les bios | T1, T2, T3, C2 |
| Réponses aux commentaires | 6,0 | 7,5 | Signal immédiat actif ; banque absente ; documents sur l'ancienne règle | C1, D3 |
## 2. Ma liste « Pour 10/10 » du cycle 6, point par point
| Point | Statut | Preuve |
|---|---|---|
| Notifications des 3 comptes ; LinkedIn page ou profil | fait (déclaré) | `founder-preferences.md` 05/10 « 1. OK » ; canal = page (v5 §1, API Buffer) ; inviter ses contacts reste son choix |
| 4 légendes IG en base | fait | JSON : 38, 58, 43, 53 caractères, sans pied ni lien ; base non requêtée |
| Rendu des 8 cartes semaine 0 | partiel | `REPLIT_ACTIONS` : `slide=0/1` vérifiées en prod (statut) ; relecture visuelle R6 non consignée |
| Lien de bio IG, bios avec appel, post X épinglé | pas fait | `/liens` en ligne (code relu) mais aucun pointage dans les applications ; aucun texte de bio dans `docs/` ; épingle après publication |
| Pont du X quiz (07/10) | fait en base | JSON l.81 : 131 + 90 + 23 = 244 sur 270, « d'humour », 2 min, sans inscription ; **le générateur garde l'ancien pont** (`FORMULES.quizCourt`, `-config.ts` l.93 ; dry-run 14/10 idem) |
| `mesure.md` : A/B par jour | partiel | Fait en §7(c) ; `horaires-sources-s15.md` §6 inchangé ; code : une heure par réseau (`HEURE_PARIS`), aucune heure B |
| Vendredi contre dimanche dès J0 | pas fait | `mesure.md` §7 « non tranché » ; `JOURS_GRILLE` = 1 à 5 |
| Colonnes « lien » et « image » oui/non | partiel | « Variante / heure » en §6 ; « lien oui/non » seulement dans v5 §4 |
| Carte unique 4:5 et routage | fait | Commit `81641f8` déployé ; test Jest dédié ; 2 PNG 1080x1350 + `alt.json` (Rome vue : chute seule, « » R6, pied) |
| Brouillons Buffer avec image ; lots avec `[variante:]` | pas fait | Étape « après déploiement » (`REPLIT_ACTIONS` l.25) non consignée ; `lot-relance-s15.md` obsolète (l.8 : « à régénérer ») ; X : brouillon à J+28 |
| Carrousel IG3 ; test Buffer 2, 3, 4 images | fait | v5 §8 et dry-run 14/10 (4 cartes, en base avec le lot 1a, prêt 09/10) ; `REPLIT_ACTIONS` cycles 3 et 4, brouillons supprimés |
| Vanne du prof, 09/10 | fait | JSON : `cs14jkafa211aede70b92cc8`, IA comme sujet (R7) |
| Réponses : signal, fenêtre, banque | partiel | Notifications actives ; fenêtre : « pas de contrainte » ; banque introuvable ; v5 R8, plan §0 D4 et `mesure.md` §3 gardent « relance chaque jour, fenêtre 10 min, clé au 08/10 » |
## 3. K2 par post
- **06/10** : LinkedIn Rome 10 (je retire le 0,5 : la carte est le test du 13/10, pas un défaut du post), X Nicolas 10, IG draws 9,5. **07/10** : X quiz 10 (pont corrigé ; « sur la carte » signalé, non déduit : vanne validée), IG Robert 8,5 (légende juste, mais carte vanne et aucun renvoi).
- **08/10** : LinkedIn voisine 9 (télétravail, lu comme scène domestique), X planning 10, IG père 9,5. **09/10** : X prof 10, IG sécu 9,5. Les 9,5 IG = légende non relue à l'aveugle (plan §5).
- Moyenne : (10 + 10 + 9,5 + 10 + 8,5 + 9 + 10 + 9,5 + 10 + 9,5) / 10 = **9,6**. Légendes lues contre le modèle (copy §3) : destinataire précis, chute non devinable, 80 caractères tenus ; « ton copain » ambigu (conjoint ou pote), acceptable.
## 4. Correction exacte restante, par qui
- **S1, session, 07/10 IG avant 17:30 UTC** : la vanne est V150 (costume, `cs14jkdb222991fcbf194845`) et ses cartes 3 et 4 existent (`complements-lot-s15.md` §1, ligne 23/12). Passer le post en carrousel : `threadParts` à 5 parties, 4 URL `slide=0` à `3` ; V150 perd son créneau du 23/12, déjà à remplacer (plan §1). Carte 4 : « Le quiz est dans le lien de la bio » seulement si T1 est fait avant 19:30, sinon retirer la phrase (v5 §2). Pas de relecture à l'aveugle possible à temps : carte vanne maintenue (8,5).
- **S2, session** : ouvrir les 8 URLs de cartes de la semaine 0, vérifier R6 (« » par ligne) et la césure ; consigner dans `REPLIT_ACTIONS.md`.
- **S3, session, avant 09/10** : remplacer `FORMULES.quizCourt` par le pont du 07/10 ; si la vanne dépasse 155 caractères (270 - 2 - 113), repli court à fournir par @copywriter. Contrôle : aucun « tu es lequel des 5 profils » dans les dry-runs.
- **S4, session, avant 12/10** : régénérer les lots 1a et 1b (marqueurs `[variante:…]`, heures A/B, légendes sans pied). Premier post LinkedIn éligible : L1 du 15/10 (L3 du 13/10 porte un lien, hors test).
- **F1, @fullstack, avant 09/10** : heure B par réseau (X 09:00, IG 12:30, `horaires-sources-s15.md`) avec marqueur `[heure:B]`, alternance par jour mar. A, mer. B, jeu. A puis l'inverse ; la reprise garde l'heure du post, pas `HEURE_PARIS`. Si T4 = oui : une case dimanche (X 19:00, IG 19:30) en alternance avec le vendredi.
- **F2, @fullstack, avant 15/10** : brouillon Buffer LinkedIn d'un post `[variante:image]` réel, `curl` 200 `image/png` sur `slide=0`, suppression, consigner.
- **C1, @copywriter, avant 06/10 08:15** : banque de réponses (pattern d'invitation 06/05, troll détaché ou silence), environ 8 situations : question, compliment, « c'est qui ? », demande de l'article, blague en retour, troll, spam, tag d'un ami.
- **C2, @copywriter** : une ligne d'appel par bio (X, Instagram, page LinkedIn), sans prix, la marque offre (06/05) ; limites de caractères de chaque réseau à vérifier.
- **C3, @copywriter** : fixer le pied une fois (reco : sans pied partout, il est sur la carte et non cliquable) et l'appliquer aux 26 légendes et 8 carrousels de `complements-lot-s15.md` et à IG1, IG2, IG3 (v5 §8) ; « À envoyer à... » pour les 11 relais IG ; relecture à l'aveugle des 4 légendes de la semaine 0 (la 1re part le 06/10 à 19:30).
- **D1 et D2, @data-analyst et @growth** : `horaires-sources-s15.md` §6 aligné sur l'alternance par jour et `mesure.md` §7 ; colonne « lien oui/non » dans `mesure.md` §3 et §6.
- **D3, @growth** : v5 R8, plan §0 D4 et §10, `mesure.md` §3 alignés sur la réponse de Thomas du 05/10 (notifications = signal, aucune fenêtre imposée, réponse sous 24 h les jours ouvrés, clé Buffer « plus tard », rappel au seul relevé du lundi). Au passage : v5 §2 écrit `dynamicParams = false`, le code est à `true` + `notFound()` (correctif prod du 05/10).
- **Seul Thomas peut régler ce qui suit (aucune API ne le fait).** **T1, 5 min, avant 08:15 / 12:30 / 19:30 le 06/10** : lien de bio Instagram = `https://deviens-marrant.fr/liens`, X = `/liens/x`, page LinkedIn = `/liens/li`. Sans cela, les 10 posts de la semaine 0 (un seul porte un lien) n'ont aucune entrée vers le site : `utm_content=bio-*` reste à 0 et le contrôle J+14 devient inutilisable.
- **T2** : coller les 3 lignes de bio de C2. **T3** : épingler le post X du quiz après sa publication le 07/10 à 12:30.
- **T4, un oui ou non** : alterner ven. contre dim. (X 12:30 contre 19:00, IG 19:30 contre 19:30) dès J0, même cadence (0 post en plus). Vendredi : 2e pire jour d'après Buffer (résumé non relu à la source) ; dimanche X : +17 % (SocialBee, source secondaire) ; lisible à J+56 seulement (au plus 8 posts par bras). Sans oui : test Instagram de J+28 à J+56, K5a reste à 7,5.
- **T5, facultatif** : inviter ses contacts à suivre la page LinkedIn. À 0 abonné, les impressions restent faibles et le test texte contre carte sera probablement « non concluant » (`mesure.md` §8) ; sa décision, aucune déduction.
## 5. Chemin vers 10
K2 : S1 + C3. K4 : S1 (K4a), D2 (K4b), S4 + F2 (K4c). K5 : F1 + D1 (K5b), T4 + F1 (K5a), K5c à la décision du J+28. Légende : C3. CTA : T1, T2, T3, C2 (10 une fois les bios posées ; le funnel se lit à J+14). Réponses : C1, D3, puis taux de réponse sous 24 h relevé le lundi (10 si 100 % sur 4 semaines). **Risque hors liste** : Instagram sans Reel avec 0 abonné ; relever à J+28 la part de non-abonnés dans la couverture, test de Reel seulement si elle est basse.

---
**Handoff → @orchestrator**
- Fichier : `/home/user/Marrant/docs/social/notation-relance-cycle7-social.md` ; décisions : K4 9,0, K5 8,2, K2 9,6, légende 8,5, CTA 8,0, réponses 7,5
- Urgent : T1 avant le 06/10 08:15, S1 avant le 07/10 17:30 UTC, F1 et S3 avant le 09/10 (`HEURE_PARIS`, `FORMULES.quizCourt`)
---
