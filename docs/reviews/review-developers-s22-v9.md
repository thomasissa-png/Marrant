# Relecture à l'aveugle : /developers (s22, v9), 24/10/2026

Périmètre : `apps/web/src/config/textes/developers.ts` (hors TEXTE_LICENCE_*), confronté à `lib/widget/vanne-du-jour.ts`, `app/api/widget/v1/vanne-du-jour/route.ts`, au rendu de l'exemple dans `app/(dashboard)/developers/page.tsx:88` et aux faits mesurés (Cache-Control `public, max-age=300, s-maxage=3600`, pas de mise en cache par le CDN, 10 req / 10 s par IP avec blocage 10 s, 429 du CDN sans CORS).

## Bloquant (1)

**B1. TEXTE_ROTATION (developers.ts:96) : affirmation absolue démentie dans la page et par le code**

- Texte actuel : « The joke changes every day at midnight UTC and **is the same for everybody**. »
- Contradictions :
  - TEXTE_INTRO (l.28) nuance la même idée : « everyone **normally** gets the same one on a given UTC day ».
  - La dernière phrase du même paragraphe dit que la vanne peut changer avant minuit si on en retire une. Pendant ce changement, tout le monde n'a pas la même vanne.
  - Le code le confirme. La clé du cache edge est « jour UTC + empreinte de la liste blanche » (`vanne-du-jour.ts:155-157`). Si une vanne sort du pool validé en base sans changement de liste, les points de présence qui ont déjà la vanne en cache la gardent jusqu'à minuit UTC, et les autres recalculent sur le nouveau pool (`dayNumber % eligible.length` décale le rang). Au même moment, deux visiteurs peuvent donc recevoir deux vannes différentes.
- Proposé : « The joke changes every day at midnight UTC and is **normally** the same for everybody. » (le reste du paragraphe ne change pas).

## Vérifié exact (aucune correction)

- Cache-Control et plafonds avant minuit : `route.ts:58-62` + `widgetSharedMaxAge` (l.78-80). « Neither lifetime ever extends past midnight UTC » est juste, à l'arrondi `Math.ceil` près (moins d'1 s, négligeable).
- La page ne dit nulle part que le CDN met la réponse en cache. Elle parle seulement de « shared caches » en général, ce qui ne contredit pas la mesure.
- CORS : `Access-Control-Allow-Origin: *` sur 200/403/503 (BASE_HEADERS) et sur OPTIONS 204 sans corps. Pas de `Access-Control-Allow-Headers`, donc un en-tête non simple fait échouer le preflight. Le 429 du CDN n'a pas de CORS et son corps n'est pas du JSON, comme la page le dit dans CORS et dans Errors.
- utm_content : Origin d'abord, puis Referer (`route.ts:49-50`), en minuscules, sans « www. », sinon « inconnu ». Le 403 lit le même hôte. Les corps 403/503 et `Retry-After: 3600` sont conformes (`route.ts:33-46`).
- Limite : 10 req / 10 s par IP, blocage 10 s (règle relevée dans REPLIT_ACTIONS.md l.23), cohérent entre Rate limit et Errors.
- Exemple : la réponse est bien sur une ligne (NextResponse.json) et la page l'indente (`page.tsx:88`). La date 2026-10-24 et `utm_content=inconnu` correspondent à un appel curl.
- Champs : frTypo pose bien U+2060 (`fr-typo.ts:22-23`), `required: true` est une constante (`config/widget-vanne-du-jour.ts:128`), et la fiche publique contient bien « Pourquoi ça marche », donc « explains why it is funny » est exact.
- Vie privée : la route ne fait rien d'autre avec l'hôte appelant que le contrôle de blocage et le paramètre utm_content.

## Remarques non bloquantes (pas fausses, à arbitrer)

- PAGE_DESCRIPTION, « A different joke every day » : c'est vrai d'un jour à l'autre tant que le pool compte plus d'une vanne. TEXTE_ROTATION précise que les vannes reviennent, ce qui ne la contredit pas.
- La règle Cloudflare couvre aussi `/embed/vanne-du-jour` (REPLIT_ACTIONS.md l.23). Un site qui affiche l'iframe et appelle aussi l'API partage donc les 10 requêtes par IP. La page ne dit pas le contraire.

## Verdict

**NO-GO** tant que B1 n'est pas corrigé (correction d'un mot). Une fois B1 corrigé : GO, sans autre bloquant trouvé.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-developers-s22-v9.md`
- Bloquants : B1 (TEXTE_ROTATION, « is the same for everybody » → « is normally the same for everybody »)
- Verdict : NO-GO, puis GO après B1 seul (pas de nouvelle relecture complète nécessaire, seulement vérifier la ligne 96)
---
