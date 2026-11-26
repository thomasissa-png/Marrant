# Ouverture de session Marrant : procédure obligatoire

Demande de Thomas du 26/11/2026 : « tout ça doit te survivre. Donc chaque ouverture de nouvelle session doit récupérer la revue hebdo et la lancer. »

À faire par TOUTE nouvelle session, juste après le « Brief compris / Plan », avant le reste du travail. Durée : quelques minutes.

## 1. Reprendre les tâches programmées

Les tâches programmées (outils `list_triggers`, `create_trigger`, `delete_trigger`, `send_later` du serveur claude-code-remote) sont rattachées à UNE session. Si elles visent une ancienne session, elles ne serviront plus quand celle-ci sera archivée.

1. `list_triggers` (avec `include_completed: false`) : chercher les tâches dont le nom commence par « Marrant ».
2. Pour chacune, si son `persistent_session_id` n'est pas la session courante (`get_session` sans argument donne l'id courant) : la recréer à l'identique (même nom, même horaire, même prompt) rattachée à la session courante (`create_trigger` sans `persistent_session_id` ni `create_new_session_on_fire`), puis supprimer l'ancienne (`delete_trigger`). Ne jamais laisser deux copies actives.
3. Tâches attendues (au 26/11/2026) :
   - « Marrant, revue du samedi (blog, SEO, réseaux) » : `CRON_TZ=Europe/Paris 5 15 * * 6`, prompt = celui de la §4 ci-dessous.
   - « Marrant J+14 : SEO lot 1 et lettre blog » : une fois, le 09/12/2026 09h10 Paris (relevés décrits dans `docs/seo/plan-pages-qui-vendent-s27.md` §4, bilan dans `docs/marrant/bilan-j14-s27.md`).
   - « Marrant J+28 : bilan SEO et lettre » : une fois, le 23/12/2026 09h10 Paris (bilan dans `docs/marrant/bilan-j28-s27.md`).
   Si une tâche attendue manque et que sa date n'est pas passée : la recréer. Si sa date est passée sans que son bilan existe dans le dépôt : faire le travail maintenant.
4. Pourquoi rattachée à une session et pas « nouvelle session à chaque fois » : l'organisation ne permet pas de donner le connecteur Google Drive à une tâche qui crée sa propre session ; or la revue lit et écrit dans le vault.

## 2. Rattraper une revue manquée

1. La revue de la semaine AAAA-Sxx (semaine ISO) laisse une trace dans le dépôt : `docs/social/revues/AAAA-Sxx.md` (voir §3).
2. Si on est samedi après 15h05, dimanche, ou en semaine, et que la trace de la dernière semaine écoulée (samedi passé) n'existe pas : lancer la revue maintenant, avec le prompt de la §4.
3. Si la session s'ouvre un samedi avant 15h05 : ne rien lancer, la tâche programmée s'en charge.

## 3. Trace de chaque revue

Chaque revue (programmée ou rattrapée) se termine par un commit de `docs/social/revues/AAAA-Sxx.md` : date et heure, ce qui a été fait (santé blog, SEO, rapport Grok lu ou absent, améliorations envoyées, prompt Grok produit), décisions demandées à Thomas. Pas de trace = revue considérée comme non faite.

## 4. Prompt de la revue hebdomadaire (référence, à garder identique dans la tâche programmée)

> C'est samedi 15h05 : lance la revue hebdomadaire de Deviens Marrant demandée par Thomas le 26/11/2026. Applique CLAUDE.md (Brief compris + Plan, délégation à @seo @geo @social, anti-timeout). git pull de la branche de travail, relis le mémo de project-context.md, `docs/social/systeme-hebdo-claude-grok-s27.md` (routine), `docs/social/grille-qualite-posts.md`, `docs/social/diagnostic-existant-grok-s27.md` et les prompts Grok les plus récents de `docs/social/`.
> 1. Santé du blog (pages et articles en 200, publications de la semaine, sitemap, /api/health).
> 2. SEO : Search Console (compte de service du vault, téléchargé dans le scratchpad, jamais affiché ni commité), Bing Webmaster (BING_WEBMASTER_API_KEY), visibilité IA selon la méthode du document ; comparaison à la semaine précédente et aux références de docs/seo/plan-pages-qui-vendent-s27.md ; recommandations seulement si pas ok.
> 3. Réseaux de la semaine passée : rapport de Grok bot dans le Drive `00. Me/02. Projets/02. Pro/Projets Web/Deviens Marrant/Social/` (rapport-grok-AAAA-Sxx.md), vidéos jugées sur fichier, clics UTM dans Umami ; si le rapport manque, le dire.
> 4. On part de l'existant de Grok et on l'améliore : 3 améliorations au plus, rien de ce qui marche ne change, pas d'autopromotion, technique gardée en court. Produire le prompt à copier pour Grok (fichier `docs/social/prompt-grok-AAAA-Sxx.md`).
> 5. Trace `docs/social/revues/AAAA-Sxx.md`, commit et push.
> 6. Résumé court à Thomas : blog, SEO, bilan réseaux, prompt Grok à copier, décisions à prendre.
> Rien en ligne sur le site, ni base, ni Stripe, ni DNS sans go explicite de Thomas.
