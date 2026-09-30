# Production du contenu à l'avance (trimestre + complément mensuel)

Décision Thomas du 30/09/2026 (`docs/founder-preferences.md`) : le contenu est préparé en session avec les agents, validé, puis programmé en base. La génération IA automatique quotidienne est coupée (`CONTENT_GENERATION_ENABLED` ≠ "true") ; si une date manque, le site prend un contenu du stock validé, sans IA.

## Barres de qualité (non négociables)

- **Vannes** : étalons E1 à E4 (`docs/founder-preferences.md`, `apps/web/src/lib/ai/joke-quality-bar.ts`). Rien en dessous. En base : seules les vannes `isActive` + `copyVerdict = 'GARDER'` + décryptage peuvent être vanne du jour.
- **Conseils** : étalons choisis par Thomas parmi ceux proposés dans `docs/copy/audit-conseils-s14.md` (à reporter ici une fois choisis).
- **Articles** : l'article étalon validé par Thomas (voir `docs/seo/calendrier-editorial-q4-2026.md`).
- Règles transverses : tutoiement, zéro tiret cadratin, zéro gros mot, zéro concurrent nommé, zéro chiffre inventé ou retiré sans GO, l'IA comme sujet autorisée, le site ne dit jamais être écrit par une IA.

## Cycle mensuel (le 20 de chaque mois, préparer le mois M+1)

1. **État du stock** (lecture Neon via `scripts/infra/copie-replit-neon.py`, fonction `q`) : dates de M+1 sans `DailyContent`, vannes GARDER jamais utilisées, conseils validés jamais utilisés, articles planifiés de M+1.
2. **Vannes** : si le stock GARDER non utilisé couvre moins de 60 jours, @copywriter écrit ~60 vannes neuves (dont l'actualité du mois), sans complaisance ; un 2e @copywriter les note contre les étalons ; on ne garde que celles au niveau ; Thomas valide un échantillon de 10.
3. **Conseils** : même principe avec les étalons de conseils.
4. **Articles** : @copywriter rédige les articles de M+1 du calendrier @seo ; contrôle @seo (title, meta, maillage, FAQ) ; insertion en base avec `publishedAt` à la date prévue.
5. **Programmation** : une ligne `DailyContent` par date de M+1 (vanne GARDER jamais utilisée, conseil validé, vidéo active), variété de catégories d'un jour à l'autre, saisonnalité respectée.
6. **Contrôles** : aucune date vide sur M+1, zéro tiret cadratin et zéro gros mot dans ce qui est programmé, coûts IA du mois (`LlmUsageLog`) sous le plafond.
7. **Traçabilité** : commit des fichiers produits sur la branche de travail, entrée dans `REPLIT_ACTIONS.md` si du code change, compte rendu court à Thomas avec ce qui attend sa validation.

## Premier trimestre (octobre à décembre 2026)

- **01/10 au 31/12 programmés le 30/09** (92 `DailyContent`) : vannes GARDER jamais utilisées, hors saison exclues (été, plage, festivals, Pâques, Saint-Valentin), pas deux catégories identiques d'affilée ; conseils = rotation des 26 conseils GARDER de l'audit (`conseils-garder-ids.txt`) en attendant les conseils neufs (à reprogrammer quand ils existent) ; vidéos actives en rotation. Réserve : 100 vannes GARDER hors saison non utilisées + les vannes saisonnières (été) pour 2027.
- Stock vannes au 30/09 : 333 actives, toutes GARDER. Stock conseils : 26 GARDER sur 438 (audit `docs/copy/audit-conseils-s14.md`), décisions Thomas en attente (étalons, nettoyage, compteur).
- Articles : calendrier `docs/seo/calendrier-editorial-q4-2026.md` (13 lundis du 05/10 au 28/12).
