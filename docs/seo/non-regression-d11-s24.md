# Non-régression SEO D11 (s24) : lecture du code + build local

Base : `52ad00df^` (début s24) à HEAD `e5213713`. Build vide (`env -i` + variables factices e2e-local), exit 0.

| # | Point | Verdict | Preuve |
|---|---|---|---|
| 1 | Pages publiques, espace fermé | PASS | `metadata`, canonical, JSON-LD, liens : aucun diff sur `/conseils`, `/parcours`, `/carnet`, `/cgu`, `/confidentialite`, `/abonnement`, `/profil`, `/login`. Seuls changements visibles : 2 phrases XP (ci-dessous). Test d'inertie annoncé dans `config/espace-client.ts` |
| 1a | Phrase des conseils | PASS | `conseils/page.tsx` : « …exercices concrets et des XP. » devient « …exercices concrets. ». Aucun titre ni ancre touchés. `conseils-list.tsx` : retrait du gain d'XP (client, pas de HTML) |
| 1b | Phrase liste des parcours | PASS | `parcours/(liste)/page.tsx` : « et des XP à gagner » retiré. H1, fil d'Ariane, `<ul class="sr-only">` des 8 liens `/parcours/{slug}` (h2), BreadcrumbList et ItemList JSON-LD : identiques, juste déplacés dans `introduction`. Le masque (`MasqueSiPremium`) est côté navigateur et sans effet sur le HTML serveur des robots |
| 1c | Vidéo 39 | PASS | `video-defi-39-s24.ts` : un seul champ `exercise` (tiret retiré), en base via DataPatch. Titre, slug, JSON-LD vidéo non touchés |
| 1d | Carnet corrigé | PASS | `data/carnet/2026-10|11.json` : textes seuls. Un `titre` change (« Le premier arrivé au pot » devient « En avance au pot »), `id` (`2026-11-21`) stable donc aucune ancre ni URL cassée. Aucune reprise ailleurs du titre (grep) |
| 1e | Textes D10 (ouvert seulement) | PASS | `cgu`, `confidentialite`, `abonnement`, `profil` : ajouts sous `ESPACE_CLIENT_PUBLIE`, jamais dans H1/H2/title/description. `abonnement` : lignes ancien abonné seulement si connecté. `parcours-content` (en-tête espace) et `header` (barre de l'espace) : ouvert + abonné, chargés côté navigateur (`ssr:false`) : HTML robot inchangé. Seule retouche fermée assumée : phrase mesure d'usage de la confidentialité (légal) |
| 2a | `robots.txt` | PASS | `robots.ts` : `/mon-espace` dans `disallowedPrivate`, répété sur les 18 groupes (build : `Disallow: /mon-espace` x18) |
| 2b | Sitemap | PASS | `sitemap.ts` sans `espace` ; `.next/server/app/sitemap.xml.body` : 0 occurrence |
| 2c | `noindex` | PASS | Layout `mon-espace` : `NOINDEX_ROBOTS` ouvert ; aucun `robots` surchargé dans les 11 pages enfants (héritage Next). Fermé : 404 par réécriture middleware `/_espace-ferme` (noindex de la 404). Les 11 routes en `ƒ` au build, 0 dans `prerender-manifest.json` |
| 2d | Cache | PASS | Layout `force-dynamic` + `revalidate = 0` (Next : `private, no-store`) ; `(dashboard)/layout.tsx` déjà `force-dynamic`. 18 routes `api/espace` via `jsonEspace` (`private, no-store`) ou `garde.ts` ; 404 interrupteur idem. Non testé en HTTP réel (pas de serveur lancé) |
| 3 | `llms.txt`, `llms-full.txt` | PASS | Grep `mon-espace`, `espace`, `bonus` : 0 dans `llms.txt/route.ts`, `llms-full.txt/route.ts`, `llms-content.ts`, `llms-parcours.ts` ; corps du build : 0 |

## Points d'attention (non bloquants)
- `Disallow` + `noindex` : un robot ne lit pas le `noindex` d'une URL bloquée. Sans effet ici (espace jamais lié publiquement, fermé = 404, ouvert = derrière connexion). Garder le `Disallow`.
- `llms-content.ts` l. 83 annonce encore « XP à chaque étape validée » avec Premium : à aligner avec @geo selon que l'XP existe encore côté parcours après ouverture (niveaux-xp-s24.md).
- Reste à vérifier en recette D12 sur le déploiement : en-têtes HTTP réels (`curl -I /mon-espace`, `/api/espace/…`) et 404 fermée.

Aucun code modifié, aucun commit.
