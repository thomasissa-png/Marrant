# Brief — refonte réelle du catalogue de vannes (s11, passe 2) — 29/09/2026

Décisions fondateur (Thomas, 29/09) : « Je suis tes recos ». Barre = étalons A/B de `docs/copy/charte-refonte-copy-s11.md` §2-§3, SANS complaisance.
**[CHOIX UTILISATEUR] Une blague déjà connue ailleurs (classique d'Internet, vanne de tonton, Carambar, « ma femme / le foot », psy/bibliothécaire/mémoire photographique…), même bonne, est FAIBLE → remplacée par une vanne originale.** Promesse du site : des vannes que tu n'as jamais entendues.
Audit précédent (trop indulgent, à dépasser) : `docs/copy/audit-independant-catalogue-s11.md`.

## Méthode
1. Note CHAQUE vanne de tes catégories : GARDER (niveau étalon ET originale) / RÉÉCRIRE.
   Motifs de réécriture : connue ailleurs, calembour phonétique, constat sans twist, chute qui s'explique ou plus longue que le setup, setup bavard, vanne de tonton / qui se moque d'un groupe (femmes, hommes, ex, maladie…), amorce saturée (max 3 vannes par amorce identique dans le catalogue : « Ma copine m'a… », « Mon chef m'a… », « J'ai essayé… »), doublon (entre elles, avec les étalons, ou avec la page n°1 `meilleures-blagues-droles-2026` dans apps/web/src/lib/blog-articles.ts), mention d'IA, formulation fautive.
2. RÉÉCRIRE = même situation/catégorie ; même idée si elle est bonne, sinon nouvelle idée. 3 variantes → garde la meilleure. Plus courte ou égale. Test : « un pote la ressortirait-il ce soir ? »
3. Pour chaque vanne réécrite, écris aussi son décryptage (charte §4, registre étalon C) : `comedyTechnique` (nom court et juste), `techniqueExplanation` (2-3 phrases, tutoiement), `howToApply` (consigne actionnable + exemple réutilisable différent de la vanne).

## Règles
- On ne supprime AUCUNE vanne (les URL /vannes/<slug> dépendent de l'id) : une vanne irrattrapable est remplacée par une nouvelle sur la même catégorie.
- `content` = setup, `punchline` = chute (même structure que le catalogue). Tutoiement de la marque, « je » dans les vannes, zéro IA, zéro vulgarité, zéro concurrent, pas de nouvelle statistique.
- Garde `id`, `category`, `type`, `maturityLevel`.

## Format de sortie (JSONL : UNE ligne JSON par vanne réécrite)
{"id": 12, "motif": "connue ailleurs", "content": "…", "punchline": "…", "comedyTechnique": "…", "techniqueExplanation": "…", "howToApply": "…"}
Écris les lignes par lots de 10-15 (Write puis Edit pour ajouter), jamais tout à la fin.
