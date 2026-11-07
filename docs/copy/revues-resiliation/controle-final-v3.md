# Contrôle final v3 : page /resiliation (interrupteur fermé)

Date : 07/11/2026. Contrôleur : @reviewer. Périmètre : UNIQUEMENT les obligatoires restants des revues v2 (design O5, UX C1 à C4, legal O7, reviewer R1 à R4), plus toute régression visible sur les captures (tiret cadratin, promesse fausse). Aucun nouveau critère.

Ce que je n'ai pas pu faire : **cette session n'a pas de shell** (aucun outil Bash). Je n'ai donc lancé ni `git show 2faee5c|fc5c11c|2188707`, ni les tests ciblés sous `env -i`, ni le `curl` du 404 fermé. J'ai vérifié en lisant le code de l'arbre de travail (Read/Grep), les tests présents et 12 captures PNG. La CI verte sur `2188707` et le 404 au `curl` sont DÉCLARÉS (REPLIT_ACTIONS.md l.12) et je ne les ai pas revérifiés.

## Résumé exécutif

Sur 10 obligatoires, 9 sont appliqués au mot près dans le code et confirmés par les captures. Un seul manque, et il porte sur la preuve, pas sur le code : la capture « clavier ouvert » (UX C3) ne montre ni le champ « Un mot de plus ? » ni le focus. Elle ne prouve donc pas que la barre collée laisse voir le champ pendant la saisie. Il faut corriger le script et refaire la capture (aucun code produit à toucher). Je n'ai vu aucun tiret cadratin ni aucune promesse fausse sur les écrans contrôlés.

## Tableau des obligatoires

| # | Obligatoire | Verdict | Preuve |
|---|---|---|---|
| Design O5 | Pied de page en bas du viewport sur les pages courtes | **PASS** (correctif local, arbitrage de la session) | `carte-app-store.tsx:17` `HAUTEUR_MIN_PAGE` (65 + 64 + 478 = 607 ; 65 + 64 + 668 = 797), appliqué `(formulaire)/page.tsx:52`, `confirmee/page.tsx:41`, `(formulaire)/loading.tsx:14`. Captures `resiliation-sans-abonnement-pc-1440` et `resiliation-app-store-pc-1440` : le pied va jusqu'au bas (y 900), plus de bande noire |
| UX C1 | Profil : « 1er décembre » comme sur la page | **PASS** | `abonnement-card.tsx:18` import `dateFinLisible`, `:70` `const fin = dateFinLisible(...)`, `dateLongue` absent du fichier. Captures `c1-avant-…-pc-1440` (« le 1 décembre ») puis `c1-apres-…-pc-1440` et `-mobile-390` (« le 1er décembre 2026 » à deux endroits). Test `resiliation-page-s23.test.tsx:322-326` |
| UX C2 | Pas d'éclair du formulaire pour l'abonné App Store | **PASS** | `resiliation-formulaire.tsx:63` `useState(!appStorePossible)`, `:72` `setVerifie(true)`, `:156` `if (!verifie) return <div className="min-h-64" aria-hidden="true" />`. Test `resiliation-page-s23.test.tsx:216` |
| UX C3 | Capture clavier ouvert : focus dans « Un mot de plus ? », « Confirmer » atteignable | **FAIL** | `resiliation-clavier-mobile-390.png` montre le HAUT de la page (H1, carte « Ton contrat ») et la barre collée, mais **ni le champ, ni le focus, ni le texte saisi**. La vérification `captures.js:146` ne contrôle que la position du bouton, toujours vraie avec une barre collée. Le risque visé (champ caché sous la barre pendant la frappe) n'est donc pas couvert |
| UX C4 | 404 fermé gardé avec `loading.tsx` | **PASS** (code ; `curl` déclaratif) | `resiliation/layout.tsx:12` `if (!RESILIATION_PAGE_OUVERTE) notFound();`, `(formulaire)/loading.tsx` (H1, carte 270 px, aucun bouton), `page.tsx:28` et `confirmee/page.tsx:30` gardés. Test `resiliation-pages-serveur-s23.test.ts:177-206`. Captures `confirmee-*` : aucun squelette « Résilier ton contrat » |
| Legal O7 | Textes impayé + « après » sur la page finale | **PASS** (texte et code ; Stripe mode test à faire avant l'ouverture) | `lib/resiliation.ts:139` `impaye: summary?.status === "PAST_DUE"`, `:382` statut lu avant l'appel Stripe. Textes identiques mot pour mot à legal-v2 l.46-53 : `textes/resiliation.ts:31-33`, `:78-83`, `resiliation-emails.ts:73-79` ; renouvellement masqué en impayé (`:79`). Captures `resiliation-impaye-pc-1440` et `-mobile-390` conformes. Tests `resiliation-pages-serveur-s23.test.ts:145-172`, `resiliation-s23.test.ts:436, 453` |
| Reviewer R1 | Accès offert : bandeau, « Réessayer » et e-mail | **PASS** | `textes/resiliation.ts:59` = texte R1 mot pour mot ; `page.tsx:59` `offert=…` ; formulaire `:158-181` (bandeau `transmisOffert`, lien « Retour à l'accueil » à la place de la barre) ; `resiliation-emails.ts:117`, `lib/resiliation.ts:261`. Tests `resiliation-page-s23.test.tsx:158`, `resiliation-s23.test.ts:425` |
| Reviewer R2 | « Aucun nouveau prélèvement après. » sur la page finale | **PASS** | `textes/resiliation.ts:82-83`. Captures `resiliation-confirmee-pc-1440`, `-mobile-390`, `-tablette-768` |
| Reviewer R3 | « …mais tu peux réessayer tout de suite. » | **PASS** (texte provisoire, Thomas) | `textes/resiliation.ts:57`. Capture `resiliation-erreur-stripe-mobile-390` : bandeau et bouton « Réessayer » enfin cohérents |
| Reviewer R4 | Date de la demande dite une seule fois | **PASS** | `resiliation-emails.ts:114` « Ta demande de résiliation est bien reçue. », date seulement à `:117`. Test `resiliation-s23.test.ts:417` |

Régressions visibles : **aucune**. Grep `—` sur les textes, composants et pages de la résiliation et sur `abonnement-card.tsx` : 0. Sur les 12 captures lues, aucune promesse fausse.

## Correction restante (texte exact)

**C3, `scripts/qa-resiliation-s23/captures.js:143-146`** : après la l.143 (`await page.getByLabel(/Un mot de plus/).focus();`), ajouter :
```js
      const champ = page.getByLabel(/Un mot de plus/);
      await champ.evaluate((el) => el.scrollIntoView({ block: 'center' }));
```
Puis remplacer le contrôle de la l.146 par une vérification qui combine les deux conditions :
```js
      const rc = await champ.boundingBox();
      ok(`${n} clavier ouvert (390x450) : champ visible au-dessus de la barre, « Confirmer la résiliation » atteignable`, !!rb && !!rc && rc.y >= 0 && rc.y + rc.height <= rb.y && rb.y + rb.height <= 450, rb && rc ? `champ ${Math.round(rc.y)} à ${Math.round(rc.y + rc.height)}, bouton ${Math.round(rb.y)} à ${Math.round(rb.y + rb.height)} / 450` : 'absent');
```
(`rb` doit être relu APRÈS le défilement : déplacer la l.145 sous ces deux lignes.) Refaire `resiliation-clavier-mobile-390.png`. Elle doit montrer le champ avec son anneau de focus et le texte « Je reviendrai sûrement après les partiels. », puis la barre « Confirmer la résiliation » en dessous. Si le champ passe sous la barre, il faut corriger le code (et non la capture), puis repasser @ux.

## Notes par domaine

- **Design : 9,5/10.** O5 est réglé sur les deux captures PC visées et le pied est bien placé à 768. Point faible : la valeur est figée en pixels (pied 478/668 px). Si le pied gagne une ligne, la bande noire revient sans qu'aucun test le signale. Le correctif du layout partagé (design-v2 O5), déjà « à proposer à Thomas », est la vraie solution.
- **UX : 9/10.** C1, C2 et C4 sont conformes. C3 reste en FAIL de preuve, il sera clos par la capture refaite. Note : la mesure du 404 au `curl` (C4) est rapportée par @fullstack, je ne l'ai pas refaite.
- **Légal : 9,5/10.** Les textes O7 reprennent legal-v2 mot pour mot sur les 4 surfaces, avec des tests. La phrase « cette facture peut encore être prélevée » n'a pas été confrontée à Stripe en mode test (aucune clé dans la session). Il faut le faire avant l'ouverture, avec les réglages de relances de Thomas.
- **Textes et code : 10/10 sur R1 à R4.** Seulement des souhaitables, hors critère : le bandeau `transmisOffert` garde le style rouge d'erreur (`resiliation-formulaire.tsx:167`) alors que rien n'a échoué, et R1 n'a pas de capture de l'état « transmis » (couvert par le test l.158).

## Décision

**NO-GO pour présentation à Thomas, levé dès que la capture C3 refaite passe.** C'est le seul FAIL. Il se corrige dans le script (aucun code produit modifié) et ne demande pas une nouvelle revue complète : je revérifierai seulement C3 sur la nouvelle image. Tout le reste est GO. Avant l'ouverture, ces actions restent à faire, hors de ce contrôle : test Stripe impayé en mode test, O6 portail (Thomas), 24 mois et délai à confirmer, relecture à l'aveugle des textes v2/v3 (P0 s18), avis de l'avocat.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/copy/revues-resiliation/controle-final-v3.md`
- Décisions : 9 PASS sur 10 ; NO-GO uniquement sur la preuve C3 (script `captures.js:143-146` + capture à refaire) ; @fullstack à relancer pour cette seule correction.
- Points d'attention : tests ciblés, `git show` et `curl` 404 non exécutés (pas de shell) ; O5 en pixels figés, à remplacer par le correctif du layout partagé ; test Stripe impayé avant l'ouverture.
---

## C3, revérification (2026-11-07)

Périmètre limité, comme annoncé : C3 (capture, code, test), effets de bord du correctif `3390c07`, captures c1 refaites. Les autres verdicts du tableau ne changent pas.

| # | Point | Verdict | Preuve |
|---|---|---|---|
| C3 capture | Champ au focus, texte saisi, au-dessus de la barre ; « Confirmer » atteignable | **PASS** | `resiliation-clavier-mobile-390.png` lue : libellé « Un mot de plus ? (facultatif) », anneau de focus violet, texte « Je reviendrai sûrement après les partiels. Et merci. », compteur 52/500, puis la barre « Confirmer la résiliation » et « Garder mon abonnement » en dessous. Mesure sur l'image (2x) : champ ≈ 193 à 290 px, barre à 329 px, viewport 450. Le bas du champ à 290 = 450 − 160 : c'est exactement la marge `scroll-mb-40` appliquée par `scrollIntoView({ block: "nearest" })`, donc le correctif est bien ce qui place le champ (avant : 391 à 489, sous la barre). Script `captures.js:171-172` : deux contrôles distincts (bouton dans le viewport ; champ au focus ET bas du champ ≤ haut de la barre), 69 PASS rapportés |
| C3 code | Correctif ciblé, sans animation | **PASS** | `question-motif.tsx:25-27` `garderAuDessusDeLaBarre` (`scrollIntoView?.` : sans effet si l'API manque), branché `:79` `onFocus` et `:80` `onInput`, classe `scroll-mb-40` `:81`. 160 px > barre 121 px (143 px avec zone iOS). `behavior: "instant"` : aucun mouvement imposé aux personnes sensibles aux animations |
| C3 test | Le comportement est verrouillé | **PASS** | `resiliation-page-s23.test.tsx:266-282` : barre `.sticky` `bottom-0`, champ hors barre, `scroll-mb-40` présent, `scrollIntoView` appelé 2 fois (focus, frappe) avec `{ block: "nearest", behavior: "instant" }`. Limite connue : jsdom ne calcule pas la mise en page ; la preuve de position est la capture Playwright, pas ce test |
| Effet de bord, autres composants | Aucun | **PASS** | `scroll-mb` n'existe qu'à `question-motif.tsx:81` dans tout `apps/web/src`. `QuestionMotif` n'a qu'un appelant : `resiliation-formulaire.tsx:173`. Les autres `scrollIntoView` du code (parcours, vannes, profil, widget) sont antérieurs et non touchés |
| Effet de bord, interrupteur fermé | Aucun | **PASS** | Le seul composant modifié n'est rendu que sous `resiliation/layout.tsx:12` `if (!RESILIATION_PAGE_OUVERTE) notFound();` (+ gardes `(formulaire)/page.tsx:28`, `confirmee/page.tsx:30`, API `route.ts` 404). Interrupteur fermé, aucun utilisateur ne peut afficher ce champ : changement invisible en production |
| C1 captures refaites | En-tête du site retiré, « 1er » visible | **PASS** | `c1-avant-…-mobile-390` et `-pc-1440` : « le 1 décembre 2026 » (2 endroits). `c1-apres-…-mobile-390` et `-pc-1440` : « le 1er décembre 2026 » (prochain prélèvement + phrase sous « Résilier ton contrat »). Plus aucun en-tête par-dessus la carte (masquage `captures.js:43-46`, remis en place après capture) |

Réserves, non bloquantes interrupteur fermé :
- Pas de shell dans cette revue : je n'ai pas fait `git show 3390c07 --stat`. L'absence d'autre fichier modifié est déduite du Grep, pas du diff. Le résultat du script (69 PASS) et la CI verte sont rapportés par @fullstack.
- Le clavier est simulé (viewport 390x450). Le comportement réel d'iOS Safari (le clavier ne réduit pas la mise en page, la barre peut passer derrière le clavier) n'est pas prouvé. Test sur un vrai iPhone et un vrai Android à faire **avant l'ouverture**, pas avant le déploiement fermé.

**Décision : GO pour le déploiement interrupteur fermé.** C3 passe en PASS (10/10 obligatoires). Le NO-GO « présentation à Thomas » est levé. Ce qui reste avant l'ouverture ne change pas : test Stripe impayé en mode test, O6 portail (Thomas), 24 mois et délai, relecture à l'aveugle v2/v3 (P0 s18), avis de l'avocat, et en plus le test clavier sur appareil réel.
