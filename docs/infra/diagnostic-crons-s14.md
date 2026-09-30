# Diagnostic crons Cloudflare, s14 (30/09/2026)

> Auteur : @infrastructure. Périmètre : Worker `marrant` (OpenNext 1.15.1), cron `*/15` → `/api/cron/scheduler-tick`.
> Symptôme : depuis la prod CF (08:31 UTC), weekly-seo et daily-content font leurs appels LLM puis n'écrivent ni `BlogArticle` ni `DailyContent`, et relancent à chaque tick.

## 1. Verdict en une phrase

**Ce n'est PAS une limite des Cron Triggers.** Aucune invocation n'est tuée. Trois bugs déterministes, rendus perpétuels par le **cache `fetch` de Next 14 qui met en cache (1 an, dans R2) les réponses `POST api.anthropic.com/v1/messages`** : chaque tick rejoue la même réponse défaillante, échoue au même endroit, relâche le verrou, et recommence 15 min plus tard.

## 2. Preuves (collectées le 30/09 entre 10:28 et 10:45 UTC)

_(section en cours de rédaction)_

## 3. Causes

_(section en cours de rédaction)_

## 4. Correctifs (commits)

_(section en cours de rédaction)_

## 5. Garde-fous anti-fuite de tokens

_(section en cours de rédaction)_

## 6. Plan de vérification demain 01/10 05:00 UTC

_(section en cours de rédaction)_
