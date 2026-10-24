# Revue croisée : widget « La vanne du jour », tour 2 (commit `6040311f`) : 24/10/2026

> @reviewer. Branche `claude/ouverture-session-nzwj0w`, non déployée, `WIDGET_VANNE_DU_JOUR_PUBLIE = false`. Références qui font foi : synthèse s22, ligne du 24/10/2026 de `docs/founder-preferences.md` ([CHOIX UTILISATEUR] : toutes les recos de la spec suivies), `docs/legal/widget-vanne-du-jour-s22.md`, `docs/growth/widget-relecture-s22/selection-finale.md`. Limite : pas de shell dans cette session, périmètre vérifié par Grep sur `apps/web/src` et lecture de chaque fichier du widget (pas de `git show --stat`). QA tour 2 (`docs/qa/qa-widget-s22-v2.md`) encore « en cours » : seul son contrôle L1 (liste blanche) est repris.

## Résumé exécutif

Les trois manques du tour 1 sont traités : les affichages sont comptés par site, une vanne retirée disparaît au déploiement, la phrase de confidentialité est prête et attend Thomas. La liste des 93 vannes est exactement celle des deux relecteurs, et aucune page existante n'a bougé. Un point neuf, à régler avant la mise en ligne (pas avant les textes) : le comptage passe par Umami depuis le serveur, et selon l'hébergeur d'Umami, Cloudflare peut lui transmettre l'adresse IP du visiteur. Tant que ce n'est pas vérifié, on ne peut pas écrire « sans donnée sur le visiteur ». On peut passer à l'étape des textes.

## Résumé technique

10 écarts du tour 1 corrigés sur 13, 3 ouverts (m5 documentaire, m6 d'étape copy, m7 alerte de stock). 0 bloquant, 1 majeur nouveau (N1 : IP du visiteur possiblement transmise à Umami), 7 mineurs. **GO pour l'étape textes ; mise en ligne sur go de Thomas seulement après levée de N1** (re-vérification G7, G13).

**Note : 8,5/10** (8/10 au tour 1).

## Suivi des écarts du tour 1

| # | Écart V1 | Statut | Évidence |
|---|---|---|---|
| M1 | Aucun comptage par domaine | Corrigé, avec N1 et N2 | `lib/widget/mesure.ts` : événement `widget-affichage` côté serveur, `ctx.waitUntil`, délai 5 s (l. 56-81) ; appelé seulement quand une vanne est servie (`embed/vanne-du-jour/route.ts:38`) ; exclusions `WIDGET_DOMAINES_NON_COMPTES` (`config:73-78`) et robots (`mesure.ts:26`) ; UTM de l'aperçu retirés sur le site lui-même (`embed-script.data.cjs:22`) ; baseline des recherches de marque en étape (2) (`REPLIT_ACTIONS.md:11`) |
| M2 | Vanne retirée servie jusqu'à minuit | Corrigé | Clé = jour + empreinte FNV-1a de la liste et des catégories (`vanne-du-jour.ts:87-97, 155-157`) ; test `widget-vanne-du-jour-s22.test.ts:146-149` ; procédure « Retirer une vanne déplacée » (`REPLIT_ACTIONS.md:14`), voir N5 |
| M3 | Phrase de confidentialité absente | Corrigé (choix : non posée) | Phrase @legal §4.3 mot pour mot, « À VALIDER PAR THOMAS (non posée) » (`REPLIT_ACTIONS.md:12`), étape (3) de la mise en ligne ; Grep `widget` dans `confidentialite/` : 0 |
| m1 | Repli brouillon servi non publié | Corrigé | `embed-html.ts:106-108` : titre et marque seulement ; capture `v2-repli-clair-375.png` lue |
| m2 | Retour arrière « sans redéploiement » | Corrigé | `REPLIT_ACTIONS.md:16` ; commentaire `config:15-16` |
| m3 | Consigne humoriste plus stricte que le legal | Corrigé | `exporter-candidats-widget.ts:42` : les deux options du legal, « Rien n'est retiré du site » (P0 s15 respecté) |
| m4 | Cache de l'API | Corrigé | 403 `private, no-store` (`api/.../route.ts:41`) ; « Jamais de règle de cache » étendue à `/api/widget/*` (`REPLIT_ACTIONS.md:13`) |
| m5 | Volet SEO non aligné | Ouvert | Grep `amorce`, `widget.js`, `504` dans `docs/seo/widget-replique-du-jour-s22-seo.md` : 0 |
| m6 | FAQ, signalement, lien de pied de page | Ouvert (étape copy) | Page inchangée sur ce point ; lien de pied de page absent de l'entrée REPLIT (voir N3) |
| m7 | Pas d'alerte sous 90 vannes | Ouvert | `countWidgetVannesEligibles` (`vanne-du-jour.ts:211`) appelée nulle part (Grep `apps/web` : 1 seule occurrence, la définition) |
| m8 | `LASTMOD` figé | Corrigé | Étape (1) (`REPLIT_ACTIONS.md:11`), commentaire `config:86` |
| m9 | Captures 768 px | Corrigé | `v2-hote-clair-iframe-longue-*-768.png`, `v2-programme-768.png` (lue : propre, pied ancré, lien de marque lisible) |
| m10 | Type `replique` non réservé | Corrigé | `vanne-du-jour.ts:27` |

## Points demandés

| Point | Verdict | Évidence |
|---|---|---|
| Aucune page existante touchée | PASS | Grep `widget\|WIDGET\|vanne-du-jour\|integrer-la-vanne` sur `src/` : seuls les fichiers du widget, ses tests, `sitemap.ts` (entrée conditionnée, l. 81-83) et `liens-page-content.tsx:66` (id `vanne-du-jour` antérieur) ; `confidentialite/` et pied de page intacts. `next.config.js:134` : règle générale resserrée sur `embed/vanne-du-jour$`, valeurs et ordre inchangés |
| Phrase de confidentialité non posée, « à valider par Thomas » | PASS | `REPLIT_ACTIONS.md:12` ; complément proposé « Chaque affichage est compté par site, sans donnée sur le visiteur » renvoyé à @legal : à ne pas valider avant N1 |
| Mesure conforme et sans donnée personnelle | **FAIL** | Voir N1 et N2 |
| Liste blanche = sélection finale | PASS | Grep des 93 identifiants de `config:29-54` en ligne exacte dans `selection-finale.md` : 93 ; test de longueur et d'unicité (`test:290-295`) ; les 8 désaccords absents du code ; QA L1 concordant |
| Procédures (mise en ligne, retrait, retour arrière) exécutables | PASS avec réserves | `REPLIT_ACTIONS.md:11-16` : étapes numérotées, commandes `curl` avec résultat attendu ; réserves N3, N5, N6 |
| Ce qui dépend de Thomas listé | PASS partiel | Règle Cloudflare (l. 13), quota Umami (l. 10), phrase (l. 12), textes BROUILLON (l. 11 étape 1) : listés. Lien du pied de page : absent (N3) |
| Zéro tiret cadratin client-facing | PASS | Grep U+2014 sur les fichiers du widget et `public/widget.js` : 0 |

## Gates (code tour 2 + entrée REPLIT)

| # | Gate | Verdict | Évidence |
|---|---|---|---|
| G1 | Sections complètes | PASS | Fichiers, contrôles, mesure, procédure, phrase, règle, retrait, blocage, retour arrière |
| G3 | Handoff | PASS | « NON DÉPLOYÉ (attend le go de Thomas) » (`REPLIT_ACTIONS.md:5`) |
| G5 | Persona | PASS | Tutoiement, ni prix ni pub dans le widget, lien de marque toujours présent |
| G7 | 0 contradiction amont | **FAIL** | Legal §3 (« aucun Umami dans `/embed/*` », base du « rien à consentir ») et §1 publié (« ne suit pas tes visiteurs ») non revalidés face au comptage Umami côté serveur : N1 |
| G12 | Implémentable sans question | PASS | Procédure numérotée |
| G13 | 0 donnée inventée | **FAIL** | « ni IP ni navigateur du visiteur transmis (requête partie du Worker) » (`REPLIT_ACTIONS.md:10`, `mesure.ts:7`) affirmé sans vérification, contredit par la doc Cloudflare dans un cas : N1 |
| G15 | 0 placeholder | PASS | Seuls `[À VÉRIFIER]` explicites (quota Umami, `Retry-After`) |
| G17 | Non copiable | PASS | Taillé pour ce site (93 identifiants, Cloudflare Free, Umami du site) |
| G_PROOF | Preuve reproductible | PASS partiel | Contrôles et 60 captures listés ; non rejoués ici (pas de shell) ; QA v2 en cours |

## Écarts restants

### Bloquant pour l'étape textes

Aucun.

### Majeur (avant le go de mise en ligne)

**N1. L'adresse IP du visiteur peut partir chez Umami.**
Référence : doc Cloudflare (en-têtes HTTP, cas des sous-requêtes de Workers) : vers une destination hors Cloudflare, `CF-Connecting-IP` et `x-real-ip` portent l'IP du client d'origine, et seul `x-real-ip` est modifiable ; vers une autre zone Cloudflare, l'IP est remplacée par l'adresse fixe `2a06:98c0:3600::103`. L'hébergeur de `cloud.umami.is` n'est documenté nulle part [À VÉRIFIER]. Umami lit ces en-têtes pour la géolocalisation et le calcul de session. Si l'IP passe : Umami reçoit IP + User-Agent fixe, donc une session par visiteur, ce qui contredit « ne suit pas tes visiteurs » (legal §1, publié sur la page) et la phrase proposée « sans donnée sur le visiteur » (legal §4.3 met justement en garde contre ce type de formule). Legal §3 reposait aussi sur « aucun Umami dans `/embed/*` ».
Correction (@fullstack, puis @legal) : (a) vérifier où pointe `cloud.umami.is` (`dig +short cloud.umami.is` comparé aux plages IP publiées par Cloudflare) et, sur un environnement de test, faire un affichage puis regarder dans Umami si la session porte le pays ou la ville du testeur ; (b) si l'IP passe : basculer sur le repli déjà écrit, Cloudflare Workers Analytics Engine ou les analytics du Worker (données qui restent chez le prestataire déjà en place), sinon retirer l'affirmation ; (c) @legal revalide §1, §3 et le complément de phrase sur la solution retenue. Rien de ceci ne touche un [CHOIX UTILISATEUR] : la synthèse demandait un comptage « sans cookie » sans fixer l'outil.

### Mineurs

| # | Écart | Référence | Correction |
|---|---|---|---|
| N2 | Un affichage = 3 événements facturés : FAQ Umami Cloud, « chaque propriété de données enregistrée compte comme un événement » ; `data: { domaine, theme }` (`mesure.ts:51`) en plus de l'événement. Quota partagé avec l'analytics du site entier | `mesure.ts:41-53` ; `REPLIT_ACTIONS.md:10` (quota [À VÉRIFIER par Thomas]) | Retirer `data` (le `hostname` porte déjà le domaine) ou ne garder que `domaine` ; dire à Thomas le ratio réel événements par affichage avec le quota |
| N3 | Décisions Thomas dispersées et lien « Intègre la vanne du jour » en pied de page absent de l'entrée | revue V1, décision 1 ; P0 du 21/10 (page existante = proposée, pas ajoutée d'office) | Un bloc « Ce qui dépend de Thomas » en tête de l'entrée : règle Cloudflare, quota Umami, `UMAMI_WEBSITE_ID` présent en production, phrase de confidentialité, lien de pied de page oui / non, textes BROUILLON |
| N4 | m7 non fait : stock du widget silencieux sous 90 | synthèse point 5 ; `vanne-du-jour.ts:211` non appelée | Brancher le compte dans `/api/health` ou le bloc « Widget » du rapport du lundi, alerte sous 90 |
| N5 | Contrôle de retrait fragile : `grep -c "<début de l'amorce>"` sur un JSON passé par `frTypo` (apostrophe typographique, espaces insécables) peut donner 0 à tort ; un seul point de présence testé | `REPLIT_ACTIONS.md:14`, `vanne-du-jour.ts:137` | `curl -s … \| jq -r .amorce` et comparer à un mot sans apostrophe ; noter que le contrôle vaut pour le point de présence de Thomas |
| N6 | Limite par IP étendue à `/embed/vanne-du-jour` (la synthèse point 6 la prévoit pour l'API) : derrière une IP partagée (école, entreprise), au-delà de 10 affichages par 10 s, l'iframe reçoit la page 429 de Cloudflare | `REPLIT_ACTIONS.md:13` | Garder (abus), mais l'écrire comme effet connu dans l'entrée et le surveiller au bilan J+30 |
| N7 | Statistiques du site mêlées : les événements arrivent sur le site Umami principal avec `hostname` = domaine hôte ; effet sur visiteurs, sessions et pays du tableau de bord [À VÉRIFIER] ; User-Agent qui imite Chrome : l'événement peut être écarté par le filtre robots d'Umami avec une réponse OK | `mesure.ts:19-23, 47` | Site Umami dédié au widget (identifiant à part) ; garder l'affichage de test de l'étape (7), seule preuve que l'envoi est compté |
| m5 | Volet SEO non aligné | SEO §1, §4 | @seo met son volet à jour, aucun code |
| m6 | FAQ, signalement « Une vanne déplacée ? », maillage | SEO §6, growth §2 | Étape copy (étalons Thomas puis @copywriter) |

Captures lues (repli 375, hôte 768 après révélation, aperçu sombre 375) : propres, alignées, lien de marque lisible, pied ancré, aucun décalage. Hauteur fixe de 504 px : grand vide sous une vanne courte, compromis documenté (`config:91-100`) et accepté au tour @design.

## Top 3 corrections prioritaires

1. N1 : vérifier ce que Cloudflare transmet à Umami, sinon passer au comptage chez Cloudflare ; @legal revalide.
2. N2 : un seul événement par affichage, pour ne pas épuiser le quota de l'analytics du site.
3. N3 : bloc unique des décisions de Thomas, lien de pied de page compris.

## Contradictions

| Livrable A | Livrable B | Contradiction | Criticité | Résolution |
|---|---|---|---|---|
| legal §1 et §3 | `mesure.ts`, `REPLIT_ACTIONS.md:10` | « ne suit pas tes visiteurs », « aucun Umami dans `/embed/*` » face à un envoi Umami par affichage | Majeure | N1 (@fullstack, @legal) |
| synthèse point 6 (limite sur l'API) | `REPLIT_ACTIONS.md:13` (API + iframe) | Périmètre de la limite par IP | Mineure | N6 : garder, documenter |
| SEO §4 | code | Contrat d'API | Mineure | m5 (@seo) |

## Angles morts

- Bloc « Widget » du rapport du lundi (@data-analyst) : défini dans le principe, pas encore écrit ; à faire avec la solution retenue en N1.

## Décisions à confirmer par Thomas (au moment de la mise en ligne)

1. Phrase de confidentialité (et son complément, une fois N1 levé) : oui / non ?
2. Lien « Intègre la vanne du jour » dans le pied de page : oui / non ?
3. Quota Umami : suffisant au ratio réel d'événements par affichage ?

## Recommandation

**GO pour l'étape textes** (étalons avec Thomas, @copywriter). **Mise en ligne sur go de Thomas après levée de N1** et re-vérification des seules gates G7 et G13. Agents : @fullstack (N1, N2, N4, N5, N7), @legal (N1, phrase), session principale (N3, N6 dans `REPLIT_ACTIONS.md`), @seo (m5).

Sources externes : [Cloudflare, HTTP headers (CF-Connecting-IP dans les sous-requêtes de Workers)](https://developers.cloudflare.com/fundamentals/reference/http-headers/) ; [Umami Cloud, FAQ (comptage des événements)](https://docs.umami.is/docs/cloud/faq).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/revue-widget-s22-v2.md`
- Décisions prises : GO étape textes ; mise en ligne conditionnée à N1 (IP possiblement transmise à Umami)
- Points d'attention : 10/13 écarts V1 corrigés ; QA v2 encore en cours ; `git show --stat 6040311f` à rejouer par la session principale (pas de shell ici)
---
