# Relecture critique GEO — deviens-marrant.fr — s11 — 2026-09-29

> Agent @geo. Relecture des changements GEO de la session 11 (audit `docs/geo/audit-global-s11.md` et corrections qui ont suivi).
> Worktree : `/home/user/wt-rev-geo`. Aucun commit. tsc/jest à lancer par l'orchestrateur.
> Contraintes fondateur respectées : aucune URL, aucun slug ni titre positionné modifié ; aucun chiffre ni étude retiré ; zéro mention d'IA dans le contenu ; juridique non touché ; `lib/faqs.ts` non modifié.

## 1. Score GEO estimé : 68/100 (après corrections de cette relecture)

Même grille à 7 dimensions que l'audit s11 (54/100), pour que les deux scores soient comparables.

| Dimension | Audit s11 | Maintenant | Justification |
|---|---|---|---|
| Accès bots IA (robots) | 10/10 | 10/10 | Tout était déjà autorisé via `*`. Les bots de recherche IA sont désormais nommés explicitement |
| Données structurées | 14/20 | 16/20 | dateModified réel, graphe d'entités par `@id`. Restent : sameAs absent, HowTo généré automatiquement de faible qualité |
| llms.txt / llms-full.txt | 5/15 | 13/15 | Fichiers dynamiques et exhaustifs, pages ressources présentes. Format et filtres corrigés ici |
| Citabilité des piliers | 17/20 | 17/20 | Réponse directe en tête des piliers. Restent des chiffres contradictoires sur le timing (à arbitrer par Thomas) |
| Confiance entité | 3/15 | 4/15 | `@id` et alternateName ajoutés. Toujours ni sameAs, ni Wikidata ; l'auteur est un nom de plume |
| Fraîcheur | 4/10 | 7/10 | updatedAt 2026-09-29 dans le JSON-LD et le sitemap, et désormais affiché sur la page |
| Off-site / communauté | 1/10 | 1/10 | Inchangé, hors code |

**Baseline des citations LLM : [À MESURER].** Je n'ai accès ni à ChatGPT, ni à Perplexity, ni à Gemini. Les prompts de test sont en section 4. Le score ci-dessus mesure la préparation technique et éditoriale, pas les citations réelles.

## 2. Constats

| # | Gravité | Fichier:ligne | Problème | Corrigé ? |
|---|---|---|---|---|
| 1 | P1 | `app/llms-full.txt/route.ts:37` | Le résumé du glossaire liste des termes absents de la page (tag, misdirection, deadpan, absurde) et en omet 5 réels (setup, escalade comique, accusé de réception, rebond sur mot-clé, observationnel). Un LLM qui cite ce résumé propage une info fausse | Oui : les 12 termes réels |
| 2 | P1 | `lib/blog-articles.ts:23` (pilier `comment-devenir-drole`) | Le « En bref » appelle « 3 mécanismes cognitifs » observation/surprise/timing, alors que la « Définition » du même article (l.43) nomme 3 autres mécanismes cognitifs (incongruité, résolution de tension, calibrage social). Deux passages extractibles qui se contredisent | Oui : « 3 leviers » dans le En bref (aucun chiffre touché) |
| 3 | P1 | `lib/llms-content.ts:47` | La FAQ de llms-full attribue à la même étude les mécanismes « incongruité, tension, **timing** » ; le pilier dit « **calibrage social** » | Oui : alignée sur le pilier (étude conservée) |
| 4 | P1 | `lib/blog-articles.ts:2377` (`timidite-et-humour`) | L'ancre « Roman Frayssinet » pointe vers `/blog/comment-avoir-de-la-repartie`, ce qui crée une fausse association d'entité (humoriste = URL d'un article) | Oui : le nom passe en gras, le lien est reporté sur l'ancre « 10 techniques de répartie » (même nombre de liens) |
| 5 | P1 | `app/(dashboard)/blog/[slug]/page.tsx:215` | `dateModified` = 2026-09-29 dans le JSON-LD et le sitemap, mais la page n'affiche que la date de publication. Le signal de fraîcheur n'est pas visible et le balisage ne correspond pas à ce qui est affiché | Oui : « Mis à jour le … » affiché si différent de la date de publication (même source que le JSON-LD) |
| 6 | P1 | `components/seo/json-ld.tsx` (Organization, WebSite, Person, Article) | Aucun `@id` : la marque et l'auteur apparaissent comme N objets anonymes (layout, articles, à-propos, founder, worksFor), les moteurs ne peuvent pas consolider une seule entité | Oui : `@id` stables (`/#organization`, `/#website`, `/a-propos#alex-durand`) référencés partout ; `alternateName: "Deviens Marrant"` (nom de la signature) ; Person.description reprise mot pour mot de /a-propos |
| 7 | P2 | `app/llms.txt/route.ts:75`, `app/llms-full.txt/route.ts:87` | Les articles statiques n'étaient filtrés que par `UNPUBLISHED_STATIC_SLUGS`, alors que `sitemap.ts:62` filtre aussi `REDIRECTED_BLOG_SLUGS`. Aucune fuite aujourd'hui (les 5 slugs statiques redirigés sont dans les deux listes), mais pas de garde-fou si une redirection est ajoutée sans dépublication | Oui : même filtre que le sitemap |
| 8 | P2 | `app/llms.txt/route.ts:135-153` | Liens au format `- [titre](url) : notes`. La spec llmstxt.org attend `): notes` : avec l'espace, le parseur de référence n'extrait pas la description | Oui |
| 9 | P2 | `app/llms.txt/route.ts:52-62,135-138`, `llms-full.txt/route.ts:40-42`, `lib/llms-content.ts:106-108` | Parcours sans temps hebdomadaire (chiffre fondateur : 15 min Machine à Café, 20 min Répartie/Confiance). Le catalogue était décrit par « des centaines de vannes » au lieu du chiffre 600+ | Oui : chiffres ajoutés (aucun retiré) |
| 10 | P2 | `app/robots.ts:29-45` | OAI-SearchBot, Claude-SearchBot, Claude-User et Perplexity-User n'étaient pas nommés. Ils étaient déjà autorisés via `*`, mais leur autorisation dépendait d'un groupe générique | Oui : groupes explicites, avec en commentaire la distinction bots de recherche / bots d'entraînement |
| 11 | P1 | `lib/blog-articles.ts:227,241` vs `:267` (pilier `timing-humour`) | Chiffres contradictoires dans le même article : « pause de 2 à 3 secondes avant la punchline » (En bref, À retenir) contre « micro-pause : 1-2 secondes » (structure en 4 étapes). Ailleurs sur le site : 1,5 s et « 2-3 s » | **Non** : c'est un changement de chiffre, il faut le GO de Thomas. Proposition : « 2-3 s sur scène, 1-2 s en conversation » |
| 12 | P1 | `app/(dashboard)/blog/[slug]/page.tsx:168-178` | HowTo généré à partir de TOUS les H2 des catégories GUIDE/PRATIQUE : les « étapes » sont des questions (« Pourquoi pense-t-on… ? », « À qui ça s'adresse ? ») avec `text = name`. Ce balisage ne décrit pas le contenu et peut être perçu comme du spam | **Non** : c'est une logique de code. Reco @fullstack : supprimer, ou le construire à partir de la liste numérotée « plan d'action » |
| 13 | P1 | `components/seo/json-ld.tsx` (`getSocialProfiles`) | `sameAs` n'est émis que si `NEXT_PUBLIC_SOCIAL_PROFILES` est défini. Aucun ancrage externe tant que Thomas n'a pas renseigné les URLs réelles (LinkedIn, X, Instagram) | **Non** : action Replit (variable d'environnement). On n'invente aucune URL |
| 14 | P2 | `json-ld.tsx` (`toIso8601Duration`) | `courseWorkload: "P3W"` veut dire « 3 semaines de travail », alors que la charge réelle est de 3 × 15 min | **Non** : valeur figée par `__tests__/ui/json-ld.test.tsx:146,163`. Reco : `courseSchedule { duration: "PT15M", repeatFrequency: "P1W", repeatCount: 3 }` + mise à jour du test |
| 15 | P2 | `lib/llms-content.ts:92` | « Chaque vanne est décortiquée » alors que le stock ancien reçoit encore son décryptage à 15 vannes par jour | **Non** (texte d'origine) : à vérifier via /api/content-stats, puis dire « la majorité » si le rattrapage n'est pas fini |
| 16 | P2 | `llms-full.txt/route.ts:~188` | Le texte de lien des vannes (`[content punchline]`) n'est pas nettoyé : un retour à la ligne ou un `]` casse le Markdown | **Non** : petite logique, reco @fullstack `.replace(/\s+/g," ").replace(/[[\]]/g,"")` |
| 17 | P2 | `llms*.txt/route.ts` (catch final) | En cas d'erreur, le fallback répond 200 « Contenu temporairement indisponible », qui peut être mis en cache par l'ISR et ingéré par les crawlers | **Non** : reco 503 + `Retry-After` |
| 18 | P2 | `lib/blog-articles.ts:1164-1167` | Titre « 30 phrases drôles » mais excerpt « 33 phrases » | **Non** : titre positionné, on garde. L'excerpt reste exact (33 > 30) |
| 19 | P2 | `lib/blog-articles.ts` (`comment-faire-rire-une-fille` / `-un-homme`) | Numérotation des H2 incohérente (« 2. », « 3. », « 5. » mais 1 et 4 non numérotés), ce qui gêne l'extraction des « 7 / 6 techniques » | **Non** : copy, @copywriter |
| 20 | P2 | `json-ld.tsx` (`buildProductJsonLd`) | `priceValidUntil: "2026-12-31"` expire dans 3 mois | **Non** : à prolonger avant le 31/12 |
| 21 | P2 | `/home/user/Marrant/docs/geo/audit-global-s11.md` | Score incohérent (54/100 dans le corps, 76/100 dans le handoff). Stats d'études citées sans source datée (« +28 % », « 46,7 % ») | **Non** : fichier hors worktree. Ne pas réutiliser ces chiffres |

Vérifié conforme (aucun changement nécessaire) :
- en-têtes HTTP de llms : `text/plain; charset=utf-8` et cache 1 h ;
- `public/llms*.txt` statiques supprimés ; le middleware laisse passer ;
- aucun `X-Robots-Tag` bloquant ;
- tarifs llms = site (gratuit 10/3/3, 0,99 €/mois, coaching 99 €/45 min) ;
- les 3 parcours sont en 3/4/6 semaines partout ;
- FAQ llms = FAQ du site, chiffres et étude conservés ;
- piliers avec réponse directe en tête (comment-devenir-drole, comment-avoir-de-la-repartie, timing-humour, rester-muet-en-groupe, jamais-quoi-repondre-techniques…) ;
- FAQPage uniquement sur du contenu visible ;
- DefinedTermSet des 12 termes ;
- âge du public cible llms (16-25) cohérent avec les CGU (plus de 15 ans) ;
- zéro mention d'IA dans le contenu servi.

## 3. Recommandations non appliquées (et pourquoi)

1. **Constat 11 (timing)** : un chiffre change, donc GO de Thomas obligatoire (29/09).
2. **Constats 12, 14, 16, 17** : logique de code ou tests à modifier. Hors du périmètre « chaînes et données », à passer à @fullstack.
3. **Constat 13 (sameAs)** : Thomas renseigne `NEXT_PUBLIC_SOCIAL_PROFILES` dans Replit avec les URLs réelles des comptes. Ensuite, ouvrir une fiche Wikidata pour la marque (pas pour « Alex Durand », qui est un nom de plume : lui créer des profils externes reviendrait à inventer une identité).
4. **Citations attribuées à des humoristes dans les articles statiques** (ex. « Comme le dit Paul Mirabel… »). Le gate G-B23 les rejette dans les articles générés, mais elles sont conservées dans les statiques par choix fondateur (29/09). Aucune action.
5. **Chiffres du catalogue en dynamique dans llms** (`getContentStatsRounded`, comme la home) pour conseils et vidéos. Petite logique DB, à passer à @fullstack.
6. **Off-site** (forums, presse, profils) : hors code, à confier à @growth.

## 4. Protocole baseline (à exécuter par Thomas, hebdomadaire)

Exécuter sur ChatGPT (avec recherche), Perplexity, Gemini et Claude. Pour chaque prompt, noter : cité O/N, URL citée, exactitude (prix 0,99 €, durées 3/4/6 semaines).
1. Comment devenir drôle quand on est timide ?
2. Comment avoir de la répartie quand on ne sait jamais quoi répondre ?
3. Quelles techniques de répartie apprendre quand on débute ?
4. Existe-t-il un site en français pour apprendre à être drôle ?
5. Meilleure ressource en ligne pour apprendre l'humour en français
6. C'est quoi le timing en humour ?
7. C'est quoi l'accusé de réception en répartie ?
8. Comment être drôle à la machine à café ?
9. Comment répondre aux moqueries avec humour ?
10. Pourquoi mes blagues tombent à plat ?
11. deviens-marrant.fr c'est quoi, combien ça coûte ?
12. Comment reprendre confiance grâce à l'humour après une rupture ?

Tout résultat faux (prix, durée, fondateur) déclenche le protocole de correction : documenter l'erreur, publier du contenu correctif structuré, puis surveiller pendant 30 à 60 jours.

## 5. Handoff

**Handoff → @orchestrator**
- Fichiers modifiés (worktree) :
  - `apps/web/src/app/llms.txt/route.ts`
  - `apps/web/src/app/llms-full.txt/route.ts`
  - `apps/web/src/lib/llms-content.ts`
  - `apps/web/src/app/robots.ts`
  - `apps/web/src/components/seo/json-ld.tsx`
  - `apps/web/src/app/(dashboard)/blog/[slug]/page.tsx`
  - `apps/web/src/lib/blog-articles.ts` (2 passages)
- À lancer : `npx tsc --noEmit && npx jest` (en particulier `__tests__/ui/json-ld.test.tsx`). Aucun test existant ne fige les chaînes modifiées.
- Points d'attention :
  - ne pas retoucher les « En bref » ni les définitions des piliers sans vérifier la cohérence avec llms-content.ts ;
  - monitoring hebdomadaire (section 4) ;
  - constat 11 à soumettre à Thomas ;
  - constats 12, 14, 16 et 17 pour @fullstack.

Sources (crawlers, consultées le 29/09/2026) :
- [OpenAI — Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
- [Anthropic — Does Anthropic crawl data from the web](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Search Engine Land — Anthropic clarifies Claude bots](https://searchengineland.com/anthropic-claude-bots-470171)
