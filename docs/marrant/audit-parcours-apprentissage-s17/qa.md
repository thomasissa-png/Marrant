# Audit QA s17 : parcours d'apprentissage en prod (C4, C5, C6, C11)

> @qa, 07/10/2026. Prod https://deviens-marrant.fr (Cloudflare Workers, version 712ee919, code lu : 79b11f3). Visiteur anonyme, Chromium Playwright, desktop 1280 et mobile 375 (`devices['iPhone 13']`), locale fr-FR. Toute requête non-GET vers la prod était bloquée par le script, Umami intercepté localement (sauf le tout premier passage, voir §5).
> Statut : EN COURS.

## 1. TL;DR

(à remplir)

## 2. Notes par critère

| Critère | Note /10 | Preuve courte |
|---|---|---|
| C4 Parcours bout en bout | | |
| C5 Fonctionnement et bugs | | |
| C6 UX/UI | | |
| C11 Performance et technique | | |

## 3. Constats

### QA-01 (P1) Les étapes 2+ disent « Termine l'étape 1 pour débloquer », ce qui est impossible pour un visiteur
- **Problème** : sous l'étape 1, chaque étape suivante affiche un cadenas et « Termine l'étape 1 pour débloquer ». Or un visiteur ne peut pas terminer l'étape 1 : la valider est réservé à Premium (« Valider l'étape fait partie de Premium »). Cliquer sur l'étape 2 ne fait rien.
- **Effet pour l'utilisateur** : le message promet un déblocage gratuit qui n'arrive jamais. Le visiteur fait le quiz, on lui dit « Tu peux valider l'étape », il ne peut pas, et l'étape 2 reste muette. La vraie raison (Premium) n'apparaît qu'en bas de l'étape 1.
- **Ce qu'on fait** : pour un non-abonné, remplacer « Termine l'étape 1 pour débloquer » par « Réservé Premium » et laisser ouvrir l'étape pour montrer l'aperçu déjà prévu (ce qu'on y apprend, format, bouton d'abonnement).
- Détail technique : `parcours-detail.tsx:538-544` calcule `isSequentiallyLocked` avant `isPremiumLocked` ; pour un visiteur sans progression, toutes les étapes 2+ sont `canExpand=false`, donc `LockedStepPreview` (l.92-120, aperçu + CTA + événement `mur-vu`) n'est **jamais rendu** pour un visiteur. Constaté [LIVE] sur les 3 parcours × 2 tailles (clic sur l'étape 2 : texte inchangé, 0 élément `role=button`). Agent : @fullstack, effort rapide.

