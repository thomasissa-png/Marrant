# Revue @reviewer v2 : page de résiliation s23 (interrupteur fermé)

Date : 06/11/2026. Commits revus : `c260215`, `6d521de` (corrections des 4 revues v1). Base : `reviewer-v1.md` (8,5/10, O1 à O3).
Choix de Thomas du 06/11 (raison demandée AVANT, écran maison, question facultative) : appliqué, non re-questionné (P0 s8).
Sources : code `apps/web/src`, REPLIT_ACTIONS.md « À DÉPLOYER » l.11, revues ux-v1 / legal-v1, `docs/copy/ton-alex.md`, 6 captures lues (confirmée mobile, sans client Stripe PC, hors ligne mobile, App Store mobile, erreur Stripe mobile, confidentialité ancre PC).

## Résumé exécutif

Les trois corrections obligatoires de la v1 sont faites et verrouillées par des tests. Les textes ajoutés sont propres : zéro tiret cadratin, tutoiement, aucune culpabilisation. Il reste une promesse fausse, pour un cas rare (accès Premium offert) : l'écran dit « Ça n'a pas marché » alors que rien n'a échoué, et l'e-mail parle de « période payée » à quelqu'un qui n'a rien payé. S'y ajoutent deux incohérences visibles : un bandeau « Tu n'as rien à refaire » posé au-dessus d'un gros bouton « Réessayer », et « Aucun nouveau prélèvement. » sur la page finale contre « … après. » partout ailleurs. Avec l'interrupteur fermé, on peut déployer : rien ne change à l'écran. Deux requêtes nouvelles tournent en production, sans effet, et elles sont testées.

## Vérification O1 à O3 (v1)

| # | Verdict | Preuve |
|---|---|---|
| O1 (503 sans promesse fausse) | **FAIT** | `route.ts:79-95` : e-mail équipe cause `serveur`, 503 seulement si parti, sinon 500 ; accusé de demande à l'adresse de session (legal O4) ; `resiliation-emails.ts:128-137` textes « Stripe n'a pas été appelé » et variante « aucun e-mail ». Tests `resiliation-s23.test.ts:377, 391, 398` |
| O2 (webhook à l'heure de l'événement) | **FAIT** | `webhook/route.ts:179` paramètre `evenementLe`, l.217 garde, l.434 `event.created * 1000`. Tests `stripe-webhook-s16.test.ts:355, 363, 375` |
| O3 (tests) | **FAIT** | Webhook fermé/ouvert (ci-dessus) ; 503/500 ; portail fermé `resiliation-s23.test.ts:361` ; `admin-resiliations-s23.test.ts` (401, table absente, purge) ; login `auth/login-resiliation-s23.test.tsx` ; confidentialité fermée `ui/confidentialite-resiliation-s23.test.tsx:33` |
| S3 v1 (`deja_resilie`) | FAIT | `resiliation-formulaire.tsx:133-135`, test `resiliation-page-s23.test.tsx:102` |
| S7 v1 (constante morte) | FAIT | absente de `config/resiliation.ts` |
| S1 v1 (« après ») | **PARTIEL** | écran principal OK (`resiliation.ts:28`), page finale non (`resiliation.ts:71-72`) : voir R2 |
| S2 v1 (accès offert) | **PARTIEL** | récap corrigé (UX O7, `recap-contrat.tsx:66, 72`), bandeau et e-mail non : voir R1 |

## Textes ajoutés depuis v1

| Texte | Ton d'Alex | Cadratin | Promesse | Verdict |
|---|---|---|---|---|
| Bandeau fusionné `erreurStripe` (`resiliation.ts:53`) | OK, simple, rassurant | 0 | Vraie pour erreur Stripe et 503 ; **fausse pour l'accès offert** (« Ça n'a pas marché », « on résilie ») | R1 |
| Bandeau + bouton « Réessayer » (`resiliation-formulaire.tsx:166`) | « Tu n'as rien à refaire. » puis bouton principal « Réessayer » : on dit une chose et on montre l'inverse (capture `resiliation-erreur-stripe-mobile-390.png`) | 0 | Incohérent | R3 |
| `refus` (`resiliation.ts:51`) | OK | 0 | Aucune promesse (rien n'est parti) | PASS |
| `horsLigne` (l.49) | OK | 0 | PASS | PASS |
| Accès offert, récap (`recapFinInconnueOffert` l.22) | OK | 0 | Vrai, sans ligne de prélèvement (capture sans client Stripe PC) | PASS |
| App Store (`appStore` l.63, carte seule) | Neutre, factuel | 0 | Vrai ; plus de bouton qui boucle (capture App Store mobile) | PASS |
| Mention sous le champ libre (`resiliation.ts:39-40`, `question-motif.tsx:77-86`) | Correct, un peu administratif (texte @legal mot pour mot, donc accepté) ; « facultative » répète le badge et « (facultatif) » | 0 | « effacée après 24 mois » tenu par la purge (`resiliation-conservation.ts:12-22`) ; « rattachée à ton compte » exact | PASS |
| Confidentialité (`resiliation.ts:125-131`, page l.95, 113, 160, 192) | OK | 0 (testé l.60) | « mot libre effacé » à la suppression tenu (`account.ts:145`, test `user-account-s16.test.ts:179`) | PASS |
| Accusé de demande (`resiliation-emails.ts:101-104`) | La date de la demande est écrite deux fois (l.101 et l.104) : lourd | 0 | « jusqu'à la fin de la période payée » **faux pour l'accès offert** | R1, R4 |
| E-mail équipe 503 (`resiliation-emails.ts:137`) | interne | 0 | « L'abonné a reçu » écrit avant l'envoi de l'accusé (route l.87 puis l.93) | S-v2-1 |

## Interrupteur fermé = production inchangée

Écran : **PASS**. Pages et API en 404 (`page.tsx:28`, `confirmee/page.tsx:29`, `route.ts:42`, test `resiliation-s23.test.ts:170`) ; pied de page et carte sur le parcours actuel (test `resiliation-page-s23.test.tsx:290`, constante à `false` l.287) ; portail (`resiliation-s23.test.ts:361`) ; webhook sans marqueur (`stripe-webhook-s16.test.ts:355`) ; confidentialité sans ajout ni nouvelle date (`confidentialite-resiliation-s23.test.tsx:33`) ; login (`login-resiliation-s23.test.tsx`). Écart déjà annoncé : la section admin.

Serveur : **2 requêtes nouvelles tournent fermé**, sans effet, et elles sont testées :
- `lib/account.ts:145` : à la suppression d'un compte, `effacerMotsLibresDuCompte` interroge une table absente, l'erreur P2021 est avalée (test `user-account-s16.test.ts:192`). Une autre erreur base fait échouer la suppression APRÈS la résiliation Stripe immédiate (l.137, test l.199). Ce n'est pas un risque nouveau : la transaction qui suit échouait déjà de la même façon en cas de panne base.
- `lib/scheduler/jobs.ts:889-898` : purge quotidienne à 4 h, table absente = 0 (test `admin-resiliations-s23.test.ts:68`).
REPLIT_ACTIONS l.11 les mentionne ; la ligne l.8 (« Fermé = comportement actuel inchangé ») ne les mentionne pas : S-v2-3.

## Captures (6 nouvelles ou modifiées lues)

Les 10 critères Thomas sont PASS sur les 6 captures, avec deux exceptions. HIÉRARCHIE et CONVERSION sont en défaut sur `resiliation-erreur-stripe-mobile-390.png` : le bouton principal « Réessayer » contredit le bandeau (R3). BRAND-ALIGNED est en défaut sur `resiliation-sans-client-stripe-pc-1440.png` : le bandeau parle d'un échec qui n'a pas eu lieu (R1). Le reste tient : App Store en carte seule et propre ; hors ligne avec « Confirmer la résiliation » au premier écran ; page finale sans aide ni merci (UX O1), montrée en 390 ; ancre de la confidentialité qui tombe sur la partie 2 en 1440. Non ouvertes : les variantes PC/tablette des mêmes états (33 captures).

## Mesure du diff réel (P0 s11)

**Pas de shell dans cette session** (aucun outil Bash disponible). Je n'ai donc pas pu lancer `git diff --stat ef35651..6d521de -- apps/web/src` ni `git diff b27a6d7^..6d521de --stat`. À lancer par @fullstack, chiffres à coller ici. J'ai mesuré à la place par lecture, et par recherche des marqueurs `s23` et `O1`…`O8` dans les fichiers existants :

| Fichier existant (touché depuis v1) | Changement | Inerte fermé ? |
|---|---|---|
| `app/api/stripe/webhook/route.ts` | paramètre `evenementLe` (l.179, 217, 434) | Oui (court-circuit `&&`) |
| `lib/account.ts` | l.10 import, l.143-145 effacement du mot libre | Requête en plus, sans effet (voir ci-dessus) |
| `lib/scheduler/jobs.ts` | l.886-898 purge | Requête en plus, sans effet |
| `app/(dashboard)/confidentialite/page.tsx` | l.67-68, 94-99, 113, 159-164, 192 | Oui (test l.33) |
| `lib/same-site.ts` | constante déplacée vers `config/appli-mobile.ts` (neuf), ré-exportée l.22-24, mêmes 2 origines | Oui (`same-site-lot-h.test.ts`) |
| Tests existants : `user-account-s16.test.ts`, `stripe-webhook-s16.test.ts` | ajouts s23 | n/a |

Taux de changement des textes et intouchables (prix, slugs, liens) : aucun prix ni lien existant modifié. Les prix viennent toujours de `config/premium.ts` (`resiliation-emails.ts:7`).

## Note

**9,3/10** (v1 : 8,5). Déploiement fermé : **GO**. Ouverture : **NO-GO** tant que R1 à R3 ne sont pas faits ; ces trois corrections ne demandent que du texte et un peu de branchement.

## Corrections restantes pour 10/10 (texte exact)

**R1. Accès offert : bandeau et e-mail faux (promesse).** @fullstack, texte @copywriter.
- `config/textes/resiliation.ts`, après l.53 : ``transmisOffert: `Ta demande est bien enregistrée : on s’occupe de ta résiliation ${RESILIATION_DELAI_EQUIPE} et on te confirme par e-mail. Tu n’as rien à refaire.`,``
- `app/(dashboard)/resiliation/page.tsx:56`, ajouter : `offert={donnees.sansAbonnementStripe ?? false}`. `resiliation-formulaire.tsx` : prop `offert?: boolean` (l.40-45, l.52) ; l.160 : `{erreur === "stripe" && offert ? T.transmisOffert : MESSAGES[erreur]}` ; l.166 : `reessayer={erreur === "stripe" && !offert}`. Pour l'accès offert, ne pas rendre `BarreConfirmation` après `transmis` : la remplacer par `<Link href="/" className={CLASSE_BOUTON_SECONDAIRE}>{T.retourAccueil}</Link>`. Réessayer ne sert à rien ici (dédoublonnage 24 h, `lib/resiliation.ts:225-236`).
- `resiliation-emails.ts:91` : ajouter `offert?: boolean` aux variables ; l.104, remplacer `"jusqu’à la fin de la période payée"` par `v.offert ? "jusqu’à la fin de ton accès Premium" : "jusqu’à la fin de la période payée"`. `lib/resiliation.ts:258` : `emailDemandeResiliationRecue({ prenom: v.prenom, dateFin: v.dateFin, demandeLe: v.now, offert: v.cause === "sans-client-stripe" })`.
- Test : 202 sans client Stripe → bandeau `transmisOffert`, aucun « Réessayer », e-mail sans « période payée ».

**R2. « Aucun nouveau prélèvement » sans « après » sur la page finale.** `config/textes/resiliation.ts:71` : `` `Tu gardes Premium jusqu’au ${date}. Aucun nouveau prélèvement après.` `` ; l.72 : `"Tu gardes Premium jusqu’à la fin de la période déjà payée. Aucun nouveau prélèvement après."`. Les mêmes mots qu'à l'écran (l.28) et que dans l'e-mail (`resiliation-emails.ts:72`), et la phrase reste vraie en cas d'impayé.

**R3. Bandeau « Tu n'as rien à refaire » au-dessus du bouton « Réessayer ».** UX O8 garde les deux. Pour concilier le texte et le bouton sans rien retirer, `config/textes/resiliation.ts:53`, fin de phrase : remplacer `Tu n’as rien à refaire.` par `Tu n’as rien à refaire, mais tu peux réessayer tout de suite.` Avis @ux à demander ; le texte est provisoire et doit être validé par Thomas.

**R4. Date écrite deux fois dans l'accusé de demande.** `resiliation-emails.ts:101` : `"Ta demande de résiliation est bien reçue."` La date reste à la l.104, dans la phrase de @legal (« c'est cette date qui compte »). @copywriter.

## Souhaitables

- S-v2-1 : `resiliation-emails.ts:137`, remplacer « L’abonné a reçu » par « L’abonné reçoit » : l'e-mail à l'équipe part avant l'accusé (`route.ts:87` puis l.93).
- S-v2-2 : `jobs.ts:878`, le `return` (verrou de la lettre non obtenu) saute aussi la purge, alors que le commentaire l.886-887 la dit indépendante. Effet réel nul (l'instance qui détient le verrou a fait la purge), mais il faut corriger, au choix, le commentaire ou le code (`if (await tryAcquireLock(...)) { … }` sans `return`).
- S-v2-3 : REPLIT_ACTIONS l.8, ajouter « deux requêtes sans effet tant que la migration 17 n'est pas jouée : effacement du mot libre à la suppression d'un compte, purge de 4 h ».
- S-v2-4 : 503 avec « Réessayer » : chaque clic renvoie un e-mail à l'équipe ET un accusé à l'abonné (S8 v1, aggravé par l'accusé). Base en panne, pas de marqueur possible côté serveur : soit borner côté écran (après un 503, ne plus envoyer pendant 10 min et garder le bandeau), soit accepter le doublon. Décision @fullstack.
- S4, S5, S6, S9, S10 de la v1 : toujours ouverts, inchangés.

## Décisions à confirmer par Thomas

`RESILIATION_CONSERVATION_MOIS = 24` et `RESILIATION_DELAI_EQUIPE = "sous un jour ouvré"` (provisoires, `config/resiliation.ts:57, 63`) ; R3 (formulation) ; textes v2 à passer à l'aveugle (P0 s18) avant ouverture.

---
**Handoff → @orchestrator**
- Fichier produit : `docs/copy/revues-resiliation/reviewer-v2.md`
- Décisions : 9,3/10 ; GO déploiement fermé ; NO-GO ouverture avant R1 (promesse fausse, accès offert), R2, R3 ; R4 mineur. @fullstack (R1 code, R2, S-v2-2/3), @copywriter (R1 texte, R3, R4), @ux (avis R3).
- Points d'attention : mesure `git diff --stat` non faite (pas de shell ici), à fournir par @fullstack ; 2 requêtes nouvelles tournent fermé, sans effet, testées.
---
