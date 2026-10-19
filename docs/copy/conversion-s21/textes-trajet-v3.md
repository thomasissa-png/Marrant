# Textes du trajet de conversion s21 (v3) : uniquement les changements par rapport à la v2

> Auteur : @copywriter. Date : 19/10/2026. Statut : PROPOSITION, rien n'est branché, rien n'est commité. Cette v3 répond aux trois verdicts à l'aveugle du tour 2 (`docs/design/conversion-s21/verdicts-v2/` : pressé 9,3 ; sceptique 9,1 ; neutre 9,6) et aux arbitrages du tour 3. Tout ce qui n'est pas dans le §2 reste **mot pour mot** la v2 (`textes-trajet-v2.md`), qui reste elle-même la v1 hors de ses changements.
> Chaque texte repasse la relecture à l'aveugle **dans le trajet** (règle d'or P0 s18) avant toute mise en ligne.
> Contraintes tenues : tutoiement, zéro tiret cadratin, aucune promesse de résultat, « 1 500+ » et prix intacts, réassurance unique mot pour mot, aucune mention légale dans un bouton, aucun concurrent nommé, aucun témoignage.

## 0. À lire en premier

**Non traités volontairement** : (1) **« TTC »** n'est PAS remis sur /register ni dans la fenêtre : choix de Thomas du 19/10 (tous les prix client sont TTC, on n'alourdit pas). Les trois relecteurs le réclament ; ce n'est pas un défaut, rien à faire. (2) **Le titre de /abonnement reste celui de l'étalon A** pour toutes les origines ; ni titre dédié au mur (« La suite des vannes, et tout le reste »), ni accroche fondue dans le titre. L'accroche d'origine (16 px, texte plein) continue de porter le contexte.

**Codes des défauts** : `P`, `S`, `N` = pressé, sceptique, neutre ; suivi du trajet et du critère (ex. `P T1 envie` = pressé, T1, envie 8). `Top5-n` = rang dans le top 5 restant du relecteur.

**Convention de comptage** : celle de la v2 (jeton avec une lettre ou un chiffre ; « · », « / », « : » ne comptent pas ; « 1 500+ » = 1 mot). La lettre hebdomadaire est à `false` (`config/lettre-hebdo-promesse-temporaire.ts`) : **la page part en V0 (sans lettre)**. Le texte de la fiche du carnet (titre, bulles) est une donnée, hors budget comme en v1 et v2.

## 1. Faits vérifiés dans le code (rien d'inventé)

| # | Question | Constat | Source | Conséquence |
|---|---|---|---|---|
| 1 | Sortie gratuite : même destination sur /abonnement et en fin d'article ? | **Oui.** Les deux mènent à `/parcours/{slug}?src=…#etape-1`, `{slug}` = parcours d'origine, **Répartie par défaut**. Les deux libellés existent : `libelleGratuitParcours` (« Tester l'étape 1 de {Parcours}, gratuite ») et `GRATUIT_ACCUEIL` (« Tester mes premières répliques, gratuit ») | `abonnement-view.tsx` l.220 ; `article-cta.tsx` l.57 et l.98 ; `blog-cta.ts` l.79-96 ; `cta-articles-accueil.ts` l.49-52 | **Un seul libellé : « Tester l'étape 1 de {Parcours}, gratuite »** (S01). « Premières répliques » n'est vrai que pour Répartie (étape 1 : « Tes premières répliques ») ; un article rattaché à Confiance ou Boulot promettrait autre chose que la destination |
| 2 | Retour après paiement : où va-t-on ? | `returnTo` si fourni, **sinon `/parcours`** (`PREMIUM_DEFAULT_RETURN`). Le bouton « Premium » de l'en-tête appelle `buildAbonnementUrl(null, …)` : **aucun `returnTo`**. C'est la cause exacte du T1 « parti de /conseils, arrivé sur /parcours » | `lib/premium-return.ts` l.28-35 ; `layout/header.tsx` l.114 | Le texte ne peut pas réparer cela : retour sur la page d'origine à coder (§5, point 3) |
| 3 | La vanne est-elle gardée en favori après le paiement ? | **Oui, prouvé** : `/abonnement/success` ajoute le favori mémorisé dans `returnTo` (JOKE, TIP ou VIDEO), attend 5 s au plus, **redirige même si l'ajout échoue**, puis retire le paramètre de la destination. Tests : `premium-modal.test.tsx` l.87 ; Playwright `conversion-v2-s21.spec.ts` | `abonnement/success/page.tsx` l.46-129 ; `lib/favori-apres-paiement.ts` | Phrase T4 (BV3) vraie **seulement si l'ajout a réussi** (ou doublon 409) : drapeau à poser (§5, point 4). Après le retrait du paramètre, la bienvenue ne sait plus rien du favori |
| 4 | Si on résilie : accès, compte, favoris, progression ? | Accès **jusqu'à la fin de la période payée** (CGU art. 3 ; `compte.ts` l.90-91 ; `paiement.ts` l.119 et l.261). À la fin : `customer.subscription.deleted` ne fait que `plan = FREE` et `status = CANCELED`. **Aucune ligne ne supprime** `userFavorite` ni `userPathStepCompletion` (seule la suppression du compte par la personne le fait, `lib/account.ts` l.142-150). Aucun cron de purge. La page confidentialité dit qu'aucune purge automatique n'existe | `webhook/route.ts` l.209-217 ; `account.ts` ; `confidentialite/page.tsx` l.107 | Les trois faits sont vrais **dans le code**, sans test. Les favoris (middleware + API 403) et la validation d'étape restent fermés tant que le plan est FREE : « enregistrés » est exact, « accessibles » ne l'est pas. `audit-offre-premium-s14.md` l.85 laisse à Thomas de décider s'il l'affiche : `[À VALIDER Thomas]` (Q01) |
| 5 | Que voit un Premium dans le carnet ? | **Toutes les fiches de chaque carnet publié, mois passés compris** ; un gratuit : la fiche `offerte` de chaque carnet | `lib/carnet.ts` l.101-103, l.147-189 | Lève l'ambiguïté « Toutes les situations » contre « le carnet du mois » (AM1, BV1) |
| 6 | D'où vient la coupe de la carte T3 ? | `CarteEtapeSuivante` affiche tout `moduleDetail` en `line-clamp-3` : la coupe est CSS, **au milieu d'un mot**. Le texte de l'étape 2 de Répartie commence par une phrase de 70 caractères | `carte-etape-suivante.tsx` l.27 ; `docs/content/parcours-seed.json` l.366 | CT1 |
| 7 | D'où vient la coupe « Moi, dix… » en T4 ? | `apercuFenetre(texte, max = 70)` coupe à 70 caractères, au mot. La vanne entière fait 75 caractères | `premium-modal.tsx` l.48-56 | CT2 |
| 8 | La page d'attente affiche-t-elle « sauf résiliation » ? | **Non** : `ATTENTE_PAIEMENT.formule` appelle `rappelFormule(plan)` sans `saufResiliation`, contrairement à /register | `abonnement-vente.ts` l.151-155 ; `offre.ts` l.47-51 | AT3 |
| 9 | Les parcours ont-ils des exercices ? | **Oui** : chaque étape porte un `exercise` | `parcours-types.ts` l.32 | Appui de la phrase T5 (F02b) |
| 10 | Catégories du catalogue de vannes | « Boulot & Collègues », « Couple & Dating », « Vie quotidienne » ; le pot de départ est cité par la page thème Boulot | `vannes-list.tsx` l.55-56 ; `vannes-themes.ts` l.25-47 | Appui de E01 |

## 2. Les changements (v2 → v3)

### 2.1 /abonnement

| Id | Surface | Élément | v2 | v3 | Défaut corrigé |
|---|---|---|---|---|---|
| E01 | /abonnement, avantage 1 | Texte | « Tout le catalogue : vannes, conseils, vidéos » (6 mots) | **« Tout le catalogue, du boulot au rencard »** (7 mots, +1). Tient sur 2 lignes comme l'avantage 2 (≈ 40 caractères). Vrai : catégories « Boulot & Collègues » et « Couple & Dating ». Les unités (vannes, conseils, vidéos) restent dites juste dessous, ligne 1 du tableau, et par l'accroche du mur. Variante si l'orchestrateur lève 2 mots de budget : « Tout le catalogue, du pot de départ au rencard » | `P T1/T2/T5/C1/C2 envie 8` (Top5-1), `S envie 8` (Top5-1) : le premier écran décrit un catalogue, sans scène |
| E02 | /abonnement, bloc carnet | Titre de la scène (nouveau) | absent (deux bulles seules) | Le **titre de la fiche affichée** (donnée, aujourd'hui « Le premier rendez-vous silencieux »), en gras petit (`text-sm`, comme un h3 de fiche), entre le chapeau et « On te dit ». Rien à écrire en dur ; **absent si la fiche n'a pas de titre** | `N envie 9` sur 6 trajets (Top5-4) : « sans la situation, on ne sait pas qui parle ni où » |
| E03 | /abonnement, tableau, ligne carnet | Colonne Premium | « Toutes les situations » (3 mots) | **« Toutes, carnets passés compris »** (4 mots, +1). Fait 5. La colonne Gratuit « 1 situation par carnet » est inchangée | `S` « Toutes les situations : le carnet du mois ou tous ? » (ambiguïté demandée par l'orchestrateur) |
| E04 | /abonnement, bloc carnet | Ligne du reste | « Il en reste 14, toutes ouvertes avec Premium. » (8 mots) | **« Les 14 autres s'ouvrent avec Premium. »** (6 mots, −2). Même sens ; reprend le verbe « s'ouvre » du trajet (« Après le paiement, X s'ouvre »). 14 = `totalFiches − 1`. Un seul reste : « L'autre s'ouvre avec Premium. » | Contrepartie de budget de E01 et E03 (retire autant que j'ajoute) |
| E05 | /abonnement, premier écran | Ligne d'ancre « Un exemple, juste en dessous » | non écrite | **Non retenue.** Elle ajoute une ligne (≈ 20 px) au premier écran, là où la garantie passe déjà sous la flottaison à 320 × 640. La scène est portée par E01 (mots) et E02 (la scène juste en dessous, qui monte avec A05). Si E01 ne suffit pas à la relecture : lien en fin de l'avantage 3, « Un nouveau carnet de répartie chaque mois · voir un exemple » (+3 mots), sur la même ligne | Choix entre les deux options de l'orchestrateur |

### 2.2 Sortie gratuite, FAQ

| Id | Surface | Élément | v2 | v3 | Défaut corrigé |
|---|---|---|---|---|---|
| S01 | Fin d'article (T5), toutes les variantes | Lien gratuit | « Tester mes premières répliques, gratuit » (article n°1, articles sans parcours connu) ou « Tester l'étape 1 de {Parcours}, gratuite » | **Toujours « Tester l'étape 1 de {Parcours}, gratuite »**, comme sur /abonnement, le mur et /register. Parcours inconnu : Répartie (déjà la destination, fait 1). `GRATUIT_ACCUEIL` ne sert plus qu'à l'accueil (hero et carte), hors des 7 trajets : même destination (Répartie, étape 1), libellé validé par Thomas ; **à l'orchestrateur** de l'aligner ou non | `N I-V2` : deux libellés pour une même destination |
| Q01 | FAQ de vente (accueil et /abonnement, JSON-LD) | Nouvelle question, 5e, après le prix | absente | **Q : « Et si j'arrête ? »**. **R : « Si tu résilies, tu gardes Premium jusqu'à la fin de la période déjà payée. Ensuite, ton compte continue avec l'accès gratuit. Tes favoris et ta progression restent enregistrés. »** (28 mots, hors budget). Première phrase mot pour mot `TEXTES_ABONNEMENT.resilierDetailSansDate` (déjà validée). Fait 4. **Si Thomas ne veut pas s'engager sur la dernière phrase** (`[À VALIDER Thomas]`, audit s14 l.85) : garder les deux premières, la réponse reste vraie | `S Top5-5` : « aucune réponse à : si j'arrête, je garde quoi ? » (déjà relevé au tour 1) |

### 2.3 Fin d'article (T5)

| Id | Surface | Élément | v2 | v3 | Défaut corrigé |
|---|---|---|---|---|---|
| F02b | Fin d'article | Phrase sous le titre (remplace F02, une phrase par bloc) | « Premium ouvre tout : le catalogue et les 5 parcours. » (9 mots) | **« Premium ouvre le catalogue, les parcours et leurs exercices. »** (9 mots). Elle complète le titre (« La vanne dans ta bouche, pas dans ton téléphone ») : ce qui met la vanne en bouche, c'est de la travailler, d'où les exercices (fait 9). Elle garde l'objet de « Tout ouvrir » (catalogue, parcours) et le nom « Premium ». Le « 5 » sort : un mot de moins à tenir dans la limite, et le chiffre reste dit sur /abonnement | `N T5 envie 8` (Top5-3) : le titre parle d'entraînement, le bouton ouvre le catalogue |
| F02c | Fin d'article | Budget du bloc | 36 | **37** (titre 9, phrase 9, réassurance 11, lien 6, « Sans compte. » 2) : le seul +1 vient du libellé unique S01 (6 mots au lieu de 5). Dans la dérogation accordée (36 à 37) | |

### 2.4 Retour de paiement (`PremiumWelcome`)

Le titre « Bienvenue dans Premium » est inchangé. Trois textes, un seul affiché, dans cet ordre de priorité. « le carnet du mois » devient « les carnets » (fait 5).

| Id | Condition (pour @fullstack) | Texte | Défaut corrigé |
|---|---|---|---|
| BV3 | Un favori vient d'être **ajouté avec succès** (ou 409) au retour : T4 | **« Ta vanne est dans tes favoris. Le reste est ouvert aussi : les listes, les parcours, les carnets. »** (17 mots). Conseil : « Ton conseil est dans tes favoris. » Vidéo : « Ta vidéo est dans tes favoris. » Même formule que /register (« Après le paiement, ta vanne est dans tes favoris. »). **Les deux dernières variantes : vérifier que le test couvre TIP et VIDEO avant de les brancher**, sinon ne mettre que la vanne et laisser BV1 ou BV2 aux deux autres | `S T4 promesse 9`, `P T4` : « la bannière ne dit pas que la vanne est gardée » |
| BV2 | Le compte a une **progression** (`useParcoursAReprendre()` non nul) | **« Tout est ouvert : les listes, les parcours, les carnets. Reprends là où tu t'étais arrêté. »** (15 mots) | « le carnet du mois » ambigu (`S`, AM1) |
| BV1 | **Par défaut** : compte sans progression | **« Tout est ouvert : les listes, les parcours, les carnets. Sers-toi. »** (10 mots) | `P T1 promesse 9`, `N T1 promesse 8` (Top5-1), `S T1 promesse 9` : « Reprends là où tu t'étais arrêté » est faux pour qui n'a rien commencé |

### 2.5 Page d'attente (retour de Google ou connexion, `auto=1`)

| Id | Élément | v2 | v3 | Défaut corrigé |
|---|---|---|---|---|
| AT1 | Titre | « Ton compte est prêt. » | **« Dernière étape. »** (2 mots). Vaut après une création de compte et après une connexion : ne dit rien du compte | `N N1` : « Ton compte est prêt » est faux après « Déjà un compte ? Connecte-toi » |
| AT2 | Texte | « On t'emmène au paiement sécurisé par Stripe… » | Inchangé | |
| AT3 | Ligne de formule, annuel | « Premium, 24,99 €/an, renouvelé chaque année. » | **« Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. »** (ligne exacte de /register). Mensuel inchangé : « Premium, 2,99 €/mois. » | `N N1` : deux écritures du même fait |

### 2.6 Textes coupés (le texte attendu ; la règle de coupe est pour @fullstack)

| Id | Surface | v2 (rendu) | Texte attendu en v3 | Règle |
|---|---|---|---|---|
| CT1 | Carte « Étape 2 sur N » (T3) | « Certaines phrases ne demandent aucun talent, seulement un bon timing. Ici, tu apprends à repére… » (coupe CSS au milieu d'un mot) | **« Certaines phrases ne demandent aucun talent, seulement un bon timing. »** (10 mots, phrase entière, 2 lignes à 320 px). La phrase suivante (« Ici, tu apprends à repérer un instant… », environ 145 caractères à elle seule) ne tient pas en 3 lignes : elle n'est pas montrée | Phrases **entières** tant que le total tient en ≈ 110 caractères ; si la première phrase seule les dépasse, coupe **au mot** avec « … ». Remplace `line-clamp-3` |
| CT2 | Rappel de la vanne (T4) | « Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix… » | **« Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix euros. »** (75 caractères, entière) | Même règle (phrases entières jusqu'à ≈ 110 caractères, sinon coupe au mot). **Texte source = l'amorce visible de la fiche, jamais la chute** (cachée derrière « Révéler ») : à vérifier dans la donnée |

### 2.7 Relevé et laissé tel quel (raison écrite)

| Élément | Relevé par | Décision |
|---|---|---|
| Lettre gratuite sous le bouton payant en T3 | `P`, `S` | Hors de cette passe (pas dans l'arbitrage). Le déplacer sous la liste des étapes verrouillées est une mise en page, à signaler à @design |
| FAQ « YouTube » ouverte par défaut | `S Top5-1` | **Non arbitré** (option laissée depuis la v2). Ne coûte pas un mot ; à trancher par l'orchestrateur |
| Sortie gratuite sur le mur (« propose un parcours à qui voulait des vannes ») | `N N8` | Inchangé : alternative, pas une rupture (hors notes) |

## 3. Décomptes

### 3.1 /abonnement, visiteur, hors FAQ, hors texte de la fiche du carnet, hors accroche

| Changement | Écart |
|---|---|
| E01 avantage 1 (6 → 7 mots) | +1 |
| E03 cellule carnet Premium (3 → 4) | +1 |
| E04 ligne du reste (8 → 6) | **-2** |
| **Net v3 sur v2** | **0** |

| État | v2 | v3 |
|---|---|---|
| V0 (lancement, sans lettre), mensuel | ≈ 201 | **≈ 201** |
| V0, annuel (ligne de renouvellement de 5 mots) | ≈ 206 | **≈ 206** |
| V1 (avec la lettre, 12/11), mensuel | ≈ 223 | **≈ 223** |
| V1, annuel | ≈ 228 | **≈ 228** (plafond 230 tenu) |

Deux précisions pour tenir 230 dans tous les cas :
- **Renouvellement dans la carte Annuel (mise en page, M2)** : s'il est affiché en permanence (recommandé, pas de saut à la bascule), il compte aussi en mensuel : V0 ≈ 206, V1 ≈ 228. Le maximum ne change pas (228).
- **Titre de la fiche (E02), +4, donnée** : hors budget par la convention (comme les bulles), mais le visiteur le lit. En le comptant : V1 ≈ 232. **Coupe de réserve prête, non appliquée** : chapeau « La situation offerte d'octobre, et la réplique qui va avec. » (10 mots) → « La situation offerte d'octobre, et sa réplique. » (8 mots, -2), ce qui ramène à 230 pile. À prendre seulement si le test de plafond compte le titre de la fiche. Les accroches d'origine (4 à 6 mots) comptent en plus, comme en v1 et v2.
- Totaux à ±3, **à confirmer par le test de plafond** (`conversion-s21-textes.test.ts`, 230) après intégration.

### 3.2 Blocs en dérogation

| Bloc | Budget | v2 | v3 |
|---|---|---|---|
| Fin d'article (T5) | 25 | 36 | **37** (dérogation 36 à 37 tenue ; seul écart : S01) |
| Fenêtre favori, fin d'étape 1 | 25 | 33 ; 35 | **inchangés** |

## 4. Les trajets touchés, lus avec la v3 (320 × 640)

| Trajet | Ce que la personne lit de nouveau | Écho |
|---|---|---|
| **T1, T2, T5, C1, C2** : premier écran de /abonnement | « Premium ouvre tout Deviens Marrant » → 3 avantages dont **« Tout le catalogue, du boulot au rencard »** → bouton → plus bas : « Le carnet, en vrai » / chapeau / **« Le premier rendez-vous silencieux »** / « Tu parles toujours aussi peu ? » / « Donne-moi la nuit… » / **« Les 14 autres s'ouvrent avec Premium. »** | Une scène (le boulot, le rencard) dès le premier écran, la scène complète juste dessous |
| **T1** retour de paiement | Retour sur la **page d'origine** (ex. /conseils) : « Bienvenue dans Premium / Tout est ouvert : les listes, les parcours, les carnets. Sers-toi. » (avec progression : « … Reprends là où tu t'étais arrêté. ») | La bannière dit la vérité de la page où l'on se trouve |
| **T4** | … /register « Après le paiement, ta vanne est dans tes favoris. » → retour sur la vanne, étoile pleine, **« Ta vanne est dans tes favoris. Le reste est ouvert aussi : … »** | La promesse du bouton est confirmée dans les mots, pas seulement par l'étoile |
| **T3** | Carte : « Étape 2 sur 4 / Le rythme et les silences / **Certaines phrases ne demandent aucun talent, seulement un bon timing.** » | Phrase entière, aucune coupe de mot |
| **T5** | « La vanne dans ta bouche, pas dans ton téléphone » / **« Premium ouvre le catalogue, les parcours et leurs exercices. »** / « Tout ouvrir · 2,99 €/mois » / réassurance / **« Tester l'étape 1 de Répartie, gratuite »** / « Sans compte. » | Le titre se prolonge par les exercices ; même sortie gratuite que /abonnement |
| **Attente Google ou connexion** | **« Dernière étape. »** / « Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. » / « On t'emmène au paiement sécurisé par Stripe… » | Même ligne que /register ; vaut après une création comme après une connexion |

**Rien de faux** (source de chaque phrase nouvelle) : « du boulot au rencard » (catégories Boulot & Collègues, Couple & Dating) ; « Toutes, carnets passés compris » (`carnetViewForPlan`, fait 5) ; « Les 14 autres s'ouvrent avec Premium » (idem) ; « leurs exercices » (`exercise` de chaque étape) ; « Ta vanne est dans tes favoris » (success + tests, **si l'ajout a réussi**) ; « Dernière étape » (Stripe est la suivante et la dernière de notre côté) ; Q01 (webhook, `account.ts`, `compte.ts`). **Anti-signature IA** : zéro tiret cadratin, aucun « ce n'est pas X, c'est Y », aucun triplet d'adjectifs ; « Sers-toi. » relu à voix haute (ton d'Alex : le pote, sans leçon).

## 5. Pour @fullstack

Fichiers sous `apps/web/src`. Chaque modification est à consigner dans `REPLIT_ACTIONS.md`. Avant commit : `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, puis `npx tsc --noEmit` (config complète) et Jest sans secrets Stripe.

**Textes et logique**

1. **Constantes de texte.** `config/textes/abonnement-vente.ts` : `lignesTableau` (E03) ; `CARNET_VENTE.reste` (E04 : « Les {n} autres s'ouvrent avec Premium. », pour n = 1 « L'autre s'ouvre avec Premium. ») ; `ATTENTE_PAIEMENT.titre` (AT1) et `.formule` = `rappelFormule(plan, { saufResiliation: true })` (AT3) ; `BIENVENUE_PREMIUM` éclaté en base / reprise / sans progression / favori par type (BV). `config/textes/avantages-premium.ts` : `AVANTAGES_PREMIUM[0]` (E01). `lib/faqs.ts` : 5e question « Et si j'arrête ? » dans `faqs` et `QUESTIONS_VENTE` (Q01, reprendre `TEXTES_ABONNEMENT.resilierDetailSansDate` pour la 1re phrase), donc accueil, /abonnement et JSON-LD ; vérifier `lib/llms-content.ts`.
2. **Fin d'article.** `BLOC_FIN.phrase` (F02b, sans `PARCOURS_COUNT`). S01 : `BLOC_FIN.boutonSansParcours` et `parArticle[…].bouton` (`GRATUIT_ACCUEIL`) supprimés ; `boutonEtape1Article` / `boutonFinArticle` (`config/blog-cta.ts`) et `blog-article-view.tsx` l.46-48 rendent toujours `libelleGratuitParcours(parcours)` ; `ArticleCta` utilise `textes.finBoutonEtape1`. `GRATUIT_ACCUEIL` reste pour l'accueil.
3. **Retour sur la page d'origine (cause du T1 « /conseils → /parcours »).** `layout/header.tsx` l.114 (`prixHref`), `layout/mobile-nav.tsx`, `ui/search-bar.tsx` l.256 : `buildAbonnementUrl(pathname, "monthly", src)` au lieu de `null` (`sanitizeReturnTo` écarte déjà /abonnement, /login, /register, /api). Accueil (`carte-premium-achat.tsx`) : laisser `null` (retour /parcours voulu). Articles : le bloc de fin renvoie à `/parcours/{parcours}`, pas à l'article : **laissé tel quel**, la bienvenue BV1 y est juste. Test : visiteur sur /conseils, clic « Premium », inscription, paiement, retour sur /conseils avec la bannière.
4. **Drapeau « favori ajouté » et choix du texte de bienvenue.** `abonnement/success/page.tsx` : `addFavorite` doit dire s'il a réussi (succès ou 409) ; la destination reçoit alors `favori=JOKE|TIP|VIDEO` (type seulement, jamais l'id), en plus de `premium=bienvenue`. `premium-welcome.tsx` lit ce paramètre (liste blanche), puis `useParcoursAReprendre()` : BV3 si favori, sinon BV2 si progression, sinon BV1. Échec ou délai de 5 s dépassé : pas de paramètre, donc BV1 ou BV2 (jamais « ta vanne est dans tes favoris » sans l'avoir ajoutée).
5. **Règle de coupe (CT1, CT2).** Une fonction unique « phrases entières » : couper aux fins de phrase (`. ! ? …`) et garder les phrases tant que le total ≤ ≈ 110 caractères ; si la première phrase seule les dépasse, couper au mot et ajouter « … ». Elle remplace les 70 caractères de `apercuFenetre` (`premium-modal.tsx` l.48-56) et le `line-clamp-3` de `carte-etape-suivante.tsx` l.27 (garder un `line-clamp-4` de sécurité). Contrôler que le rappel T4 vient de l'amorce de la vanne, pas de la chute.
6. **Carnet (E02).** `carnet-extrait.tsx` : afficher `extrait.fiche.titre` (vérifier qu'il est dans `CarnetExtrait`) entre le chapeau et « On te dit » ; rien si le titre est vide.
7. **Tests.** `conversion-s21-textes.test.ts` (attente, plafond 230 recompté) ; `concision-v5-textes.test.ts` (FAQ, avantages) ; `faq-section.test.tsx` (5 questions) ; `lot2-libelles-s21.test.ts` l.20 (libellé gratuit unique) ; tests de `boutonFinArticle` ; `premium-modal.test.tsx` l.75-78 (nouvelle règle de coupe) ; test de la bienvenue (3 variantes) ; test de `success` (drapeau) ; **nouveau** : après `customer.subscription.deleted`, les lignes `userFavorite` et `userPathStepCompletion` existent toujours (preuve de Q01).

**Mise en page à lister (pas de texte écrit ici)**

| # | Demande | Contrôle à 320 × 640 |
|---|---|---|
| M1 | Garantie (réassurance) **juste sous le bouton**, au-dessus de la flottaison ; puis la ligne « Tu crées ton compte… sur Stripe » et « Déjà un compte ? ». Leviers relevés par les relecteurs : 8 à 12 px de moins entre les coches et les cartes ; réduire l'espace en tête de page ; option pressé : « 1 500+ inscrits… » sous le bouton (texte inchangé) | Mensuel **et annuel** : la dernière ligne de la garantie finit à ≤ 640 px |
| M2 | « Renouvelé chaque année, sauf résiliation. » **dans la carte Annuel**, sous « plus de 3 mois offerts », affichée en permanence (plus de ligne séparée entre cartes et bouton, plus de saut à la bascule) | Le bouton annuel n'est plus repoussé vers y ≈ 632 |
| M3 | Marge basse de la page égale à la **hauteur mesurée** de la barre fixe (aujourd'hui `pb-24` en dur) | La réponse de la FAQ prix se lit en entier, jusqu'à « …nouveau délai. » |
| M4 | Barre fixe : libellé annuel quand l'annuel est coché (`S'abonner · 24,99 €/an`) | Cocher Annuel, défiler : la barre change de prix |
| M5 | Lien gratuit de T5 en graisse normale (comme sur le mur) | Le lien n'attire pas plus l'œil que la réassurance |
| M6 | Espace insécable avant « : » dans le titre de /parcours (« Parcours humour : deviens drôle pas à pas ») | Plus de « : » en début de ligne |
| M7 | Ordinateur : carnet, tableau et bouton du bas à la **même largeur que la carte (560 px)** ; prix « 2,99 € » et « 24,99 € » alignés en haut à 1 280 px | Pas de saut de largeur au défilement |

**Captures à refaire avant la relecture** : 320 × 640 et 375 × 700 (mensuel et annuel) ; 1 280 ; T3 (carte) ; T4 (rappel et bienvenue BV3) ; bienvenue BV1 (retour sur /conseils sans progression) et BV2 ; attente après Google et après connexion, en annuel.

## 6. Handoff

**Handoff → @orchestrator** (puis @fullstack pour l'intégration, @reviewer pour la relecture à l'aveugle, @seo pour la 5e question de FAQ et le JSON-LD, @design pour M1 à M7)
- **Fichier produit** : `/home/user/Marrant/.claude/worktrees/conversion/docs/copy/conversion-s21/textes-trajet-v3.md`. Rien n'est branché ni commité.
- **Décisions** : registre inchangé (tutoiement, phrases courtes) ; « TTC » non remis ; titre de /abonnement inchangé ; envie du premier écran portée par l'avantage 1 (E01) et la scène du carnet (E02), pas par une ligne d'ancre (E05) ; sortie gratuite unique « Tester l'étape 1 de {Parcours}, gratuite » (destination réelle : étape 1 du parcours d'origine, Répartie par défaut) ; frameworks : E01 et E02 `[Framework : AIDA, Conscience : Solution-Aware]`, bienvenue et attente = continuité, Q01 = traitement d'objection `[Conscience : Most-Aware]`.
- **Objections traitées** : « et si j'arrête ? » (Q01) ; « j'ai déjà un compte, pourquoi "compte prêt" ? » (AT1) ; « ma vanne est-elle gardée ? » (BV3) ; « tous les carnets ou celui du mois ? » (E03, E04, BV) ; « c'est pour moi ? » (E01, E02). **Références marché** : aucune nouvelle. **Mots-clés SEO** : aucun touché hors la 5e question (@seo).
- **À trancher par l'orchestrateur** : (1) aligner ou non `GRATUIT_ACCUEIL` de l'accueil (même destination, libellé validé par Thomas) ; (2) variante « du pot de départ au rencard » (+2 mots) ; (3) coupe de réserve du chapeau (-2) si le test de plafond compte le titre de la fiche ; (4) **dernière phrase de Q01 (favoris et progression) : accord de Thomas** (audit s14 l.85) ; (5) FAQ « YouTube » ouverte par défaut (non arbitré) ; (6) BV3 pour conseil et vidéo seulement si le test les couvre ; (7) retour des articles sur `/parcours/{parcours}` et non sur l'article.
- **Relecture** : ces textes ne sont pas validés. Ils repassent la relecture à l'aveugle dans le trajet, captures conformes, seuil 9 sur chaque critère. Les trois verdicts v2 ne contestent aucun fait : la v3 ne touche ni les prix, ni « 1 500+ », ni la réassurance.

## Arbitrages de l'orchestrateur (tour 3)

1. `GRATUIT_ACCUEIL` (accueil) : inchangé, libellé validé par Thomas, destination vraie depuis l'accueil.
2. Variante « du pot de départ au rencard » : non, on tient le budget.
3. Coupe de réserve du chapeau du carnet : appliquée seulement si le test de plafond compte le titre de la fiche et dépasse 230.
4. Q01, dernière phrase (favoris et progression conservés) : **gardée**, car elle est vraie dans le code et rassure le sceptique. Elle doit être couverte par un test de conservation après résiliation, sinon elle est retirée.
5. FAQ « YouTube » ouverte par défaut : non (longueur de page).
6. Liens des articles vers `/parcours/{parcours}` : inchangés.
7. Variantes de bienvenue pour le conseil et la vidéo : seulement si un test les couvre, sinon variante par défaut.
