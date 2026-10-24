# Prix 1,99 € (s22) : inventaire hors code

> @fullstack, 24/10/2026. Décision Thomas (`docs/founder-preferences.md`, 24/10) : Premium passe de 2,99 € à 1,99 € par mois et de 24,99 € à 16,99 € par an. Le code (`apps/web/src`) est traité à part (voir `REPLIT_ACTIONS.md`, entrée « s22 Prix 1,99 € »). Ici : ce qui cite encore l'ancien prix HORS du code. **Inventaire seulement : rien n'a été modifié, rien n'a été écrit en base.**
>
> Motif cherché partout : `2,99`, `2.99`, `24,99`, `24.99` et les chiffres dérivés `2,08` (prix par mois de l'annuel), `10,89` (économie annuelle), `35,88` (12 mensualités). Nouvelles valeurs : 1,99 € ; 16,99 € ; 1,42 € par mois (16,99 / 12 = 1,4158, arrondi au centime supérieur) ; 6,89 € économisés par an (23,88 − 16,99) ; « plus de 3 mois offerts » inchangé (6,89 / 1,99 = 3,46).

## (a) Contenus en base

Script en lecture seule : `apps/web/scripts/prix-s22/inventaire-prix-base.ts` (pilote Neon HTTPS, transactions `READ ONLY`, URL jamais affichée). Lancé le 24/10/2026 sur la base de production : **189 colonnes texte balayées** (toutes les tables du schéma public, hors tables d'authentification et de données personnelles : `User`, `Account`, `Session`, `Subscription`, `NewsletterSubscriber`, `WebhookEvent`, etc.), **3 occurrences**, aucune dans les journaux techniques.

| Table | id | Champ | Contexte | Extrait | Action proposée | Qui |
|---|---|---|---|---|---|---|
| BlogArticle | `cmmsvw1o9002ws60y7rtqjm8g` | content | publié le 16/03/2026, slug `comment-raconter-une-blague` (article en base, servi sur `/blog/comment-raconter-une-blague` et dans `llms-full.txt`) | « …de livraison te donnent des techniques à essayer en situation. **2,99 €/mois** : beaucoup moins cher que le silence après une blague massacrée. » | Remplacer `**2,99 €/mois**` par `**1,99 €/mois**` (seul changement, rien d'autre dans l'article) par une écriture ciblée et idempotente (marqueur `DataPatch` dédié, par exemple `prix-199-s22:comment-raconter-une-blague`), au même déploiement que le code. **Ne pas** bumper `_meta.version` de `src/data/blog-article-rewrites.json` : cela réappliquerait toutes les réécritures s11 et écraserait les articles. Le JSON est déjà corrigé dans le code (source cohérente) mais n'a aucun effet en base sans patch. | La session (go de Thomas pour l'écriture en base), patch écrit par @fullstack |
| DataPatch | `cmv532zlc0005ux1g4jqhx6cw` | note | journal des patchs déjà appliqués | « …mises en situation. **2,99 € par mois**, sans engagement. » | Rien : historique d'un patch passé, jamais affiché. | Personne |
| DataPatch | `cmv54grzw000ezh1gpff8c3yk` | note | journal des patchs déjà appliqués | « …beaucoup moins cher que le silence après une blague massacrée. » (version « 2,99 EUR/mois ») | Rien : historique, jamais affiché. | Personne |

Aucune occurrence dans : `SocialPost` (posts APPROVED à venir compris), `Tip`, `Joke`, `Video`, `LearningPath`, `LearningPathStep`, `DailyContent`, `NewsletterIssue`, `CeoOutboundMessage`, `CeoMemory`, `SeoCalendar`.

## (b) Docs qui seront publiés ou envoyés

| Élément | Où | Ancien prix cité | Action proposée | Qui |
|---|---|---|---|---|
| Lettre mensuelle (numéros 1 à 6, neutre, place sur le site) | `docs/copy/lettre-mensuelle-s21/` | aucun | Rien. | |
| Lettre hebdo Premium (numéros) | branche `claude/marrant-lettre-hebdo` (`cd1e9bef`, 19/10), `apps/web/src/data/lettre/hebdo-premium.json` et `config/textes/lettre-hebdo-s21.ts` | aucun dans les numéros | Rien dans les numéros. **À la fusion** : la branche modifie aussi `apps/web/src/app/(dashboard)/cgu/page.tsx`, où le prix est encore en dur à 2,99 € et 24,99 € : garder la version de ce lot (prix lus dans `config/premium.ts`). Le garde-fou `prix-199-s22.test.ts` échouera si un ancien montant revient. Un test de la branche (`lettre-hebdo-numeros-s21.test.ts`, accroche factice « Seulement 2,99 €. ») est une donnée de test, sans effet. | @fullstack à la fusion |
| Carnets (octobre, novembre) | `apps/web/src/data/carnet/` | aucun (couvert par le garde-fou) | Rien. Les packs de relecture du carnet de novembre (`docs/copy/carnet/novembre/`, `docs/copy/cta-s21/complements/pack-carnet-novembre.md`) citent « 2,99 € » dans la consigne aux relecteurs : documents internes, à mettre à jour seulement si une nouvelle relecture est lancée. | @copywriter si relecture |
| Articles invités BRH et L'Épopée Ludique | `docs/growth/article-invite-brh/`, `docs/growth/article-invite-epopee-ludique/` | aucun | Rien. | |
| Kit de soumission aux annuaires | `docs/growth/kit-soumissions-s15.md` (textes courts et longs FR/EN : « Premium €2.99/month », « Premium at €2.99/month ») | oui | Mettre à jour les textes du kit à 1,99 € / €1.99 avant toute nouvelle soumission. | @growth |
| Brouillon d'e-mail aux 11 comptes | `docs/copy/brouillon-email-11-comptes-s15.md` (« 2,99 € par mois ou 24,99 € par an ») | oui | S'il n'est pas encore envoyé : passer à « 1,99 € par mois ou 16,99 € par an ». | @copywriter, envoi par Thomas |
| Aperçus des e-mails transactionnels | `docs/copy/apercus-emails-s16/*.html` (8 fichiers) | oui | Documents de relecture figés : les vrais e-mails lisent le montant de Stripe (corrects d'office). Régénérer seulement si Thomas veut de nouveaux aperçus. | @fullstack si demandé |
| Plans et analyses (unit economics, LTV) | `docs/growth/widget-replique-du-jour-s22-growth.md`, `docs/growth/avis-reseaux-sociaux-s15.md`, `docs/product/ta-question-a-l-equipe-s21.md` | oui (calculs à 2,99 €) | Non publiés. Recalculer LTV et seuil de 1 000 € de MRR (≈ 503 abonnés à 1,99 € au lieu de 335) au prochain bilan. | @data-analyst (bilan du 10/11) |
| Specs Playwright | `playwright/tests/**` | corrigés dans ce lot | Les smoke tests de production (`smoke/offre-abonnement`, `smoke/murs-premium`, `achat/achat-stripe`) attendent désormais 1,99 € : ils échoueront tant que le code n'est pas déployé, c'est normal. | La session, après déploiement |
| Historique (audits, verdicts, REPLIT_ACTIONS, project-context) | `docs/**`, `REPLIT_ACTIONS.md` | oui | Rien : trace historique, jamais publiée. | |

## (c) Hors de portée du dépôt

| Élément | Action proposée | Qui |
|---|---|---|
| Fiches d'annuaires déjà soumises (kit s15, cibles 1 à 15) | Relire les fiches publiées et demander la mise à jour du prix là où il apparaît. | Thomas (comptes annuaires), textes par @growth |
| Résultats Google (extraits, données structurées Product et Offer en cache) | Rien à faire côté site : le JSON-LD passe à 1.99 / 16.99 au déploiement. Demander une nouvelle indexation de `/abonnement`, `/` et des pages parcours dans la Search Console pour accélérer. | Thomas (Search Console) ou @seo |
| Réponses des moteurs IA (llms.txt déjà lus) | `llms.txt` et `llms-full.txt` sont générés depuis `config/premium.ts` (corrects au déploiement), sauf l'article en base ci-dessus (a). Rien d'autre. | @geo au prochain contrôle |
| Posts déjà publiés sur les réseaux, commentaires de forum, messages privés passés | Aucune occurrence en base ; ne pas modifier les publications passées. | |
| Stripe | Anciens prix `price_1UMUmURqTNSm2ji544PLYGuZ` (2,99 €/mois) et `price_1UN4pdRqTNSm2ji5hM2fWxbY` (24,99 €/an) actifs, nouveaux `price_1UU9MGRqTNSm2ji509NaUQB8` (1,99 €/mois) et `price_1UU9MGRqTNSm2ji5sxkVttM7` (16,99 €/an) actifs, même produit `prod_UAgblG2OlSdd4d` (lu en GET le 24/10). Garder les anciens actifs jusqu'à la fin de la fenêtre de retour arrière ; les archiver ensuite seulement si aucun abonné n'y est rattaché. | La session |
| Secret Worker `STRIPE_PREMIUM_PRICE_CENTS` | Sert au MRR admin des abonnements pas encore resynchronisés. Défaut du code désormais = prix affiché (199). S'il est défini sur le Worker à 299 : le passer à 199 ou le supprimer. | La session |
