# Widget « La vanne du jour » : volet SEO et technique (s22)

> @seo, 24/10/2026. SPEC, aucun code. Audit du code fait : `next.config.js` (X-Frame-Options DENY et CSP globaux, pas de `frame-ancestors`), `robots.ts` (`/api/` interdit pour tous les bots), `/api/daily` (renvoie la ligne Joke complète + tip + video), `daily-joke-pool.ts` (pool GARDER uniquement), fiche publique `/vannes/[slug]`.
> Données de volume et difficulté : indisponibles (niche, aucun outil branché). Travail en intentions qualitatives.

## 0. Cadrage : ce que le widget rapporte vraiment

- Règle Google : parmi les schémas de liens, les « liens riches en mots-clés, cachés ou de faible qualité intégrés dans des widgets distribués sur divers sites » (section Link spam) : https://developers.google.com/search/docs/essentials/spam-policies (consultée le 24/10/2026, à relire avant publication de la page programme).
- Gain attendu : notoriété, trafic référent, recherches de marque (« deviens marrant »), visibilité IA. PAS de PageRank massif. Les liens éditoriaux (articles invités, mentions presse, billets de blog sur le programme) pèsent plus : la page programme (§6) est faite pour les attirer.
- Principe de conception : tout ce qui ressemble à un schéma de liens est supprimé à la source (lien dans l'iframe, ancre de marque, un seul lien, jamais de mot-clé, aucune obligation de lien suivi).
- Nom : **« La vanne du jour »** (vocabulaire du site ; « réplique » désigne déjà le carnet mensuel). Recommandation ferme.

## 1. Format d'intégration : iframe d'abord, script chargeur facultatif qui injecte l'iframe

**Décision : l'iframe est le format canonique. Un script chargeur de moins de 2 Ko est proposé en confort, mais il ne fait que créer l'iframe : jamais de HTML ou de texte de vanne injecté dans le DOM de l'hôte.**

| Critère | Iframe (retenu) | Script qui injecte du HTML (rejeté) |
|---|---|---|
| Lien | Attribué au document de l'iframe, pas au site hôte : zéro motif « lien de widget distribué » côté hôte | Lien dans le DOM de l'hôte : exactement le schéma que Google cible |
| Duplication | Texte absent du DOM hôte : pas de contenu dupliqué sur des centaines de sites | Même vanne crawlée sur N sites |
| Perf hôte | `loading="lazy"`, hauteur réservée, aucun JS tiers dans la page hôte (snippet iframe pur) | JS tiers sur le chemin critique, risque de CLS/INP |
| Sécurité | Isolation d'origine ; `sandbox` ; l'hôte n'exécute rien de nous | Notre code s'exécute dans l'origine de l'hôte (XSS, supply chain) |
| Contrepartie | Pas de lien suivi vers nous (assumé, voir §0) ; hauteur à gérer | n/a |

Spécification :
- Snippet A (défaut, aucun JS) : `<iframe src="https://deviens-marrant.fr/embed/vanne-du-jour?theme=auto" title="La vanne du jour, Deviens Marrant" loading="lazy" width="100%" height="220" style="border:0;max-width:640px" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" referrerpolicy="strict-origin-when-cross-origin"></iframe>`. La hauteur 220 px couvre une vanne courte ; `min-height` réservé = pas de CLS.
- Snippet B (chargeur) : `<div data-vanne-du-jour></div><script async src="https://deviens-marrant.fr/embed/loader.js"></script>`. Le chargeur crée l'iframe avec les mêmes attributs et ajuste la hauteur via `postMessage` (la page embed envoie un entier ; le chargeur contrôle `event.source === iframe.contentWindow`, pas `event.origin`, car le sandbox sans `allow-same-origin` donne une origine « null »). Pas de `innerHTML`, pas de `eval`.
- Paramètres autorisés (liste blanche) : `theme` (auto|clair|sombre), `taille` (s|m). Tout autre paramètre ignoré.
- CSP de l'hôte (à documenter sur la page programme) : `frame-src https://deviens-marrant.fr` (+ `script-src https://deviens-marrant.fr` pour le snippet B uniquement).
- Accessibilité : `title` explicite sur l'iframe ; dans la page embed : `lang="fr"`, `<figure><blockquote>` pour la vanne, contraste AA clair et sombre (`prefers-color-scheme`), focus visible, lien nouvel onglet annoncé (texte masqué visuellement), `prefers-reduced-motion` respecté, aucune animation auto, texte jamais en image.
- Aucun cookie, aucun traceur Umami dans l'iframe : pas de bandeau à ajouter chez l'hôte (argument de vente et RGPD).

## 2. Règles du lien

**Décision : un seul lien de marque dans le widget, visible, ancre « Deviens Marrant », dans l'iframe. Pas de mot-clé. Un second lien facultatif « Voir pourquoi ça marche » vers la fiche de la vanne.**

- Ancre : exactement « Deviens Marrant » (marque). Interdit : « blague drôle », « apprendre l'humour », toute ancre optimisée, dans tous les gabarits et dans la doc.
- Visibilité : texte lisible (corps ≥ 12 px, contraste AA), jamais masqué, jamais réduit à 1 px ni opacité faible. « Discret » veut dire sobre, pas caché.
- `rel` : dans l'iframe, `rel="noopener"` (le lien appartient à notre document ; ce n'est pas un lien de l'hôte). **Tout lien généré dans le DOM de l'hôte** (crédit optionnel du plugin WordPress, repli `<noscript>`) porte `rel="nofollow noopener"` imposé par défaut. Pas de choix « dofollow » proposé : la page programme ne promet jamais de gain SEO ni ne demande de lien suivi.
- Cible : la page d'accueil pour le lien de marque ; la fiche `/vannes/[slug]` de la vanne affichée pour le second (fiches lisibles sans compte, choix du 04/10).
- UTM (mesure, pas SEO) : `?utm_source=widget&utm_medium=embed&utm_campaign=vanne-du-jour&utm_content=<domaine-hote>`. Domaine hôte = origine du `Referer` de la requête iframe (Referrer-Policy par défaut du navigateur), jamais le chemin complet. Absent : `utm_content=inconnu`. Umami lit déjà les UTM.
- Canonical de la page d'arrivée : inchangée, sans paramètre UTM (déjà le cas, à vérifier par @fullstack).

## 3. Indexation et données structurées

- Page embed `/embed/vanne-du-jour` : `X-Robots-Tag: noindex` (et `<meta name="robots" content="noindex">`), **sans canonical** (noindex + canonical envoie un signal contradictoire). Pas de `nofollow` : on laisse la découverte des liens possible. Elle n'a aucune valeur de recherche propre, elle ne doit jamais être indexée.
- `/embed/` ne doit PAS être ajouté aux `disallow` de `robots.ts` : un blocage robots empêcherait Google de voir le `noindex`. L'API reste sous `/api/` (déjà interdit, c'est voulu) avec `X-Robots-Tag: noindex` aussi.
- Anti-duplication : le texte n'existe que dans l'iframe (document noindex). Le texte de référence indexable reste la fiche `/vannes/[slug]` (canonical auto-référent, déjà en place). Aucun JSON-LD dans la page embed (inutile sur un document noindex).
- Données structurées utiles : sur la page programme (§6) uniquement, `WebPage` + `BreadcrumbList` ; `Organization.logo` en accueil déjà requis. Pas de `SoftwareApplication` (non éligible à un résultat enrichi, risque de promesse excessive). Validation Rich Results Test avant mise en ligne.
- Headers à poser sur `/embed/*` uniquement : supprimer `X-Frame-Options: DENY` et remplacer par `Content-Security-Policy: frame-ancestors *` (CSP de la page embed : `default-src 'none'; style-src 'unsafe-inline'; script-src` limité au script de hauteur par nonce ou hash). Le DENY global reste partout ailleurs (règle de `next.config.js` plus spécifique placée après la règle générale, comme pour `/lettre`).

## 4. API publique

**Décision : un seul point d'accès, versionné, lecture seule, qui ne sert que la vanne du jour. Aucun endpoint d'archive ou de liste.**

- `GET https://deviens-marrant.fr/api/widget/v1/vanne-du-jour` (nouveau ; on ne réutilise PAS `/api/daily`, qui renvoie la ligne Joke complète, le conseil et la vidéo).
- Réponse minimale : `date`, `slug`, `setup` (content), `punchline`, `category`, `url` (fiche, avec UTM), `attribution: { name: "Deviens Marrant", url: "https://deviens-marrant.fr/", required: true }`, `license: "https://deviens-marrant.fr/integrer-la-vanne-du-jour#licence"`. Texte brut uniquement (aucun HTML dans le JSON : le client échappe).
- Ne JAMAIS exposer : décryptage (complet ou en extrait : c'est la valeur Premium et pédagogique), `comedyTechnique`, `copyVerdict`, ids internes, `generatedByAI`, tip, video, favoris, tout contenu Premium. Aucun champ interne : liste blanche de champs côté serveur, pas de `select *`.
- Source : `pickValidatedJoke` (pool GARDER, barre Alexa). Les vannes du jour du widget peuvent différer de la vanne du jour du site si le plafond de maturité écarte celle-ci (voir §8, décision Thomas). Aucune vanne sous la barre ne sort jamais.
- Cache : `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` + `ETag`, cache edge Cloudflare (Cache API du Worker), clé = date UTC. Une requête base par jour et par POP, pas par visiteur.
- Limite : règle de rate limiting Cloudflare (WAF) par IP, 60 requêtes/min, réponse 429 + `Retry-After`. Les hits cache ne touchent pas Neon. Pas de clé d'API en V1 (friction inutile), clé facultative seulement si abus constaté.
- CORS : `Access-Control-Allow-Origin: *` sur GET et OPTIONS uniquement, aucun credentials, aucun cookie posé.
- Licence d'usage (texte à valider par @legal) : affichage non modifié de la vanne avec attribution visible « Deviens Marrant » (lien), cache côté client ≤ 24 h, interdit d'archiver, republier en masse, entraîner un modèle, ou retirer l'attribution. Usage commercial de l'affichage autorisé. Droit de révocation en cas d'abus.

## 5. Extension WordPress

- Slug `deviens-marrant-vanne-du-jour`, licence GPLv2+. Contenu : un shortcode `[vanne_du_jour theme="auto" taille="m"]` et un bloc Gutenberg `deviens-marrant/vanne-du-jour` (bloc dynamique, rendu PHP identique au shortcode, pas de HTML sauvegardé dans le contenu).
- Le rendu PHP produit uniquement l'iframe du snippet A. Le plugin n'appelle jamais l'API depuis le serveur WordPress (zéro requête sortante, zéro cache, zéro donnée personnelle côté plugin). Attributs échappés (`esc_attr`, `esc_url`), paramètres validés par liste blanche.
- Règle wordpress.org : les Plugin Guidelines (guideline 10) interdisent d'intégrer des liens externes ou crédits sur le site public sans permission explicite ; les « powered by » doivent être optionnels et désactivés par défaut, et un plugin ne peut pas exiger l'affichage d'un crédit pour fonctionner. Les services peuvent habiller leur propre sortie, tant que ce code vit dans le service et non dans le plugin. Source : https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/ (consultée le 24/10/2026 ; vérifier la page en direct avant soumission).
- Conséquence, conforme à notre design : le lien « Deviens Marrant » est rendu par notre serveur dans l'iframe (code du service, pas du plugin). Le plugin n'ajoute AUCUN lien dans le DOM de l'hôte. Une case « Afficher un lien Propulsé par Deviens Marrant sous le widget » est possible, décochée par défaut, `rel="nofollow"`. Recommandation : ne pas la livrer en V1 (zéro risque de refus).
- Exigences de relecture à anticiper : `readme.txt` avec section « External services » (service appelé : l'iframe, données transmises : IP et origine du visiteur au chargement, lien vers CGU et confidentialité de deviens-marrant.fr), Tested up to / Requires PHP à jour, noms de fonctions préfixés, pas de code obfusqué, pas de tracking sans consentement (aucun ici), assets (icône, bannière) sans mention de concurrent. Délai de relecture wordpress.org non maîtrisé : en attendant, ZIP téléchargeable depuis la page programme.

## 6. Page programme : `/integrer-la-vanne-du-jour`

**Décision : page indexable, dans le sitemap, lien dans le pied de page (« Intègre la vanne du jour »), canonical auto-référent, absolu.**

- Title (≈ 58 car.) : « Intègre la vanne du jour sur ton site | Deviens Marrant » ; H1 : « Intègre la vanne du jour sur ton site ». Premier paragraphe : « vanne du jour », « widget », « gratuit » dans les deux premières phrases (poids Bing du mot-clé exact en title/H1/P1).
- Arbitrage SEO/marque : la charte écarte « blague » dans les conseils ; ici « vanne » dans title/H1, et « blague du jour » une fois en meta description et une fois dans une question de FAQ (requête réelle des webmasters). À valider par Thomas (§8).
- Contenu (tutoiement, ton de `ton-alex.md`, zéro tiret cadratin) : aperçu réel (le widget lui-même, iframe), les 2 snippets en `<pre>` copiables, installation WordPress, CSP de l'hôte, ce que le widget affiche et ce qu'il ne fait pas (pas de cookie, pas de pub), licence (ancre `#licence`), documentation de l'API, FAQ courte (gratuit ? RGPD ? personnaliser ? vannes tout public ?), contact.
- Aimant à liens éditoriaux : la page est la ressource citable (« un widget gratuit de vanne quotidienne, sans cookie »). Cibles de pitch : blogs d'humour, newsletters, créateurs WordPress, médias web francophones (à intégrer au Canal B/C de `backlink-strategy.md`). Aucune promesse de gain SEO dans la copie (ni « booste ton référencement »).
- Technique : IndexNow à la publication, Bing Webmaster Tools (sitemap), og:image 1200x630, maillage depuis `/vannes`, `/a-propos` et le pied de page, `lastModified` réel dans le sitemap. À signaler à @geo : citation possible par les IA (page factuelle, `llms.txt` facultatif).

## 7. Mesure

- Umami : visites avec `utm_source=widget`, ventilées par `utm_content` (domaine hôte) ; conversion vers inscription Premium. Comptage des hôtes distincts : origines uniques des `Referer` sur `/embed/vanne-du-jour` (journaux Cloudflare ou Analytics Engine), sans donnée personnelle.
- Search Console : requêtes de marque, rapport Liens (domaines référents), impressions de la page programme. Hebdomadaire, lundi.
- Seuils de revue à 90 jours : [HYPOTHÈSE : ≥ 25 hôtes actifs et ≥ 1 lien éditorial obtenu ; sinon on garde le widget (coût d'entretien ~0) mais on cesse d'investir]. À confirmer par Thomas.

## 8. Handoff

**Handoff -> @fullstack (puis @orchestrator)**

Fichier produit : `/home/user/Marrant/docs/seo/widget-replique-du-jour-s22-seo.md`.

Décisions prises : iframe canonique + chargeur facultatif ; un lien de marque dans l'iframe ; `nofollow` imposé hors iframe ; embed noindex sans canonical ni blocage robots ; API v1 unique, vanne du jour seulement, sans décryptage ; plugin WordPress sans lien dans le DOM hôte ; page programme indexable.

Pour @fullstack :
1. Route `/embed/vanne-du-jour` + `/embed/loader.js` ; override de `next.config.js` pour `/embed/*` (retrait du DENY, `frame-ancestors *`, `X-Robots-Tag: noindex`, Cache-Control) ; test de non-régression de `csp-frame-src.test.ts`.
2. Endpoint `/api/widget/v1/vanne-du-jour` (liste blanche de champs, cache edge, CORS GET/OPTIONS, règle de limitation Cloudflare, `X-Robots-Tag: noindex`). Évaluer la réduction de `/api/daily` (expose aujourd'hui la ligne Joke complète) : décision à valider avec Thomas, ne rien casser pour le front.
3. Page `/integrer-la-vanne-du-jour` (metadata, JSON-LD, sitemap, IndexNow, lien pied de page).
4. Plugin WordPress (shortcode + bloc dynamique + `readme.txt`), tests PHP d'échappement.
5. Journalisation sans donnée personnelle des hôtes (origine du Referer).
6. Documenter chaque changement de config dans `REPLIT_ACTIONS.md`.

Dépend de Thomas :
- Plafond de maturité des vannes servies (`maturityLevel` 1 à 5, sens de l'échelle à vérifier dans le schéma Prisma ; proposition : niveaux les plus bas seulement, site tout public) ; accepter que la vanne du widget puisse différer de celle du site.
- Compte wordpress.org et nom d'auteur public (cohérent avec « aucune identité réelle sur le site » : utiliser un compte au nom du site).
- Arbitrage « blague » en meta/FAQ ; validation de la licence par @legal.
- Seuils de revue (§7).

Risques :
- Aucun gain de PageRank hôte par construction (assumé) : ne pas vendre le widget comme un levier de position.
- Un lien suivi demandé ou « conseillé » aux hôtes = retour dans le schéma sanctionné ; l'éviter dans toute copie.
- Iframe : hauteur et thèmes de l'hôte imparfaits, 3-5 % d'hôtes bloqueront les iframes par CSP.
- Délai de relecture wordpress.org et refus possible pour un détail de readme.
- Abus de l'API (aspiration) : atténué par l'absence d'archive, cache et limite.
- Coordination : @geo (citation IA de la page programme), @social (relais du programme, signaux Bing), @legal (licence, mention des données dans le readme).
