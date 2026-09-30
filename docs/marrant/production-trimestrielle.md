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
4. **Articles** : @copywriter rédige les articles de M+1 du calendrier @seo ; contrôle @seo (title, meta, maillage, FAQ) ; insertion en base avec `isPublished = false` et `publishedAt` à la date prévue (le site filtre sur `isPublished` ; le job weekly-seo publie l'article planifié de la semaine, interrupteur contenu préparé, cf. `docs/infra/diagnostic-crons-s14.md`). Outil : `npx tsx scripts/content/import-article.ts <brouillon.md>` depuis `apps/web` (dry-run par défaut, `--write` pour insérer ; publication le lundi 05:00 UTC, refus si slug pris, tiret cadratin ou lien interne mort).
5. **Programmation** : une ligne `DailyContent` par date de M+1 (vanne GARDER jamais utilisée, conseil validé, vidéo active), variété de catégories d'un jour à l'autre, saisonnalité respectée.
6. **Contrôles** : aucune date vide sur M+1, zéro tiret cadratin et zéro gros mot dans ce qui est programmé, coûts IA du mois (`LlmUsageLog`) sous le plafond.
7. **Traçabilité** : commit des fichiers produits sur la branche de travail, entrée dans `REPLIT_ACTIONS.md` si du code change, compte rendu court à Thomas avec ce qui attend sa validation.

## Premier trimestre (octobre à décembre 2026)

- **Catalogue vannes (30/09, validé par Thomas)** : 125 vannes, toutes relues à l'aveugle (2 avis sur 3 : 2 relecteurs + départage orchestrateur), 30 anciennes + 95 neuves (497 candidates écrites). 303 retirées (soft delete, sauvegarde `docs/copy/audit-vannes-s14/sauvegarde-vannes-avant-bascule.json`). 5 anciennes sans décryptage (hors vivier vanne du jour tant que non écrit).
- **Catalogue conseils** : 88 validés à l'aveugle (73 neufs + 15 réécrits) + 21 conseils de parcours réécrits et validés (3 tours de relecture à l'aveugle). Les 5 étapes restées sous la barre (confiance 1, repartie 1 et 2, maitre-storytelling 5 et roi-repartie 2, ces deux parcours étant inactifs) pointent depuis le 30/09 vers un conseil validé de même compétence (option A, Thomas) ; les 5 anciens conseils sont retirés (sauvegardes `docs/copy/audit-vannes-s14/sauvegarde-etapes-option-a.json` et `sauvegarde-conseils-option-a.json`). 109 conseils actifs, tous au niveau. Le seed `prisma/seed-data.ts` relie par titre des conseils créés en s14 qui n'existent qu'en base : ne jamais relancer `prisma db seed` en prod.
- **Calendrier 01/10 au 31/12** : 92 vannes distinctes (Halloween le 31/10, Noël autour du 24/12, zéro vanne d'été, jamais deux catégories identiques d'affilée), 88 conseils validés en rotation, vidéos actives. Réserve : 26 vannes validées non programmées.
- **Rendement mesuré** : ~6 % du stock historique au niveau ; ~19 % des vannes neuves écrites pour la barre. Pour 30 vannes neuves validées, prévoir ~160 candidates.
- Articles : calendrier `docs/seo/calendrier-editorial-q4-2026.md` (13 lundis du 05/10 au 28/12) ; S1 (Halloween) validé par Thomas le 30/09 et programmé (publication lundi 05/10 05:00 UTC) : ses 8 vannes ont passé la relecture à l'aveugle (3 sur 21 dans la 1re version). S8 (étalon, 23/11) : réparties en cours (relecture à l'aveugle, `docs/copy/audit-vannes-s14/articles-departage-orchestrateur.md`).
