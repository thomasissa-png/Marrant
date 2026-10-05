# Données réelles réseaux sociaux : 05/10/2026 (audit s15)

> Extraites par la session principale le 05/10/2026 vers 16 h UTC : route d'admin `GET /api/admin/social` (base de prod, lecture seule) et API Umami. Aucune donnée inventée. Les abonnés et les statistiques natives des plateformes ne sont PAS accessibles depuis la session (pas d'API de métriques, choix du 01/10).

## 1. Posts en base (`SocialPost`, plateformes X, Instagram, LinkedIn)

| Plateforme | PUBLISHED | APPROVED (en file) | FAILED | REJECTED |
|---|---|---|---|---|
| X (TWITTER) | 100 (limite de lecture atteinte, il peut y en avoir plus) | 40 | 0 | 0 |
| Instagram | 1 | 33 | 0 | 0 |
| LinkedIn | 39 (tous avant le 16/06/2026, en pause depuis le 01/10) | 0 | non lu | non lu |

- Historique : export s14 de 636 posts (`docs/social/audit-s14/export-posts.json`), anciens posts conservés (choix du 03/10).
- **Publiés depuis la reprise (01/10)** : 3 posts. X le 02/10 10:30 UTC (vanne « film sur Netflix, quarante minutes de bandes-annonces ») ; Instagram le 02/10 16:30 (carte IMAGE_QUI_CLAQUE, vanne « dormi du côté gauche du lit ») ; X le 05/10 10:30 (relais de l'article « Blagues d'Halloween » avec lien UTM `utm_source=x&utm_medium=social&utm_campaign=2026-10`). Tous ont un `externalId` (publication confirmée par Buffer).
- **Prévu contre réalisé** : la préparation d'octobre démarre le ven. 02/10 (`docs/social/preparation/2026-10.md`) : 4 posts prévus jusqu'au 05/10 (X et IG le 02/10, X et IG le 05/10) ; 3 publiés à l'heure, le 4e (IG 05/10 18:30 Paris) programmé après l'extraction. Fiabilité observée : 100 % sur 4 jours.
- **File à venir (APPROVED)**, par semaine (lundi) : 05/10 : 4 X + 4 IG ; 12/10 au 23/11 : 5 X + 4 IG chaque semaine ; 30/11 : 1 + 1. **Aucun post en retard**, aucun échec. La file couvre jusqu'au début décembre.
- Exemples à venir : IG 05/10 16:30 « Blagues d'Halloween : 8 vannes pour ta soirée déguisée Lien en bio. » ; X 06/10 « J'ai dit à Alexa de me raconter une blague. Elle m'a lu mon historique de recherches. » ; IG 06/10 « L'audioguide du musée s'est éteint dans la première salle… » ; X 07/10 « Mon adresse mail pro d'alternant commence par « alternant2 »… ».
- **Métriques en base** (`impressions`, `likes`, `retweets`, `replies`, `clicks`) : **toutes à 0** sur les 140 posts publiés lus (aucune remontée automatique ; relevé manuel prévu le lundi, `docs/social/mesure.md` §2).
- Statuts `SCHEDULED` et `DRAFT` : la route renvoie 500 (statuts absents de l'enum, sans incidence).

## 2. Retour vers le site (Umami)

- Canal « organicSocial » : **1 visite en 28 j**, 13 en 90 j. Référents sociaux 90 j : facebook.com 3, l.instagram.com 2 ; `fbclid` 5. **Aucune visite `utm_source=x` ni `utm_source=instagram`** relevée à ce jour (UTM posés depuis le 01/10).
- Page `/liens` (lien de bio Instagram) : absente des 89 chemins visités en 180 j.
- Comparaison : recherche organique 455 visites / 28 j, IA 5 à 23.

## 3. Ce qui manque (à relever par Thomas, `docs/social/mesure.md` §2 et §4)

Abonnés X et Instagram, impressions natives, enregistrements et partages Instagram, clics sur le lien de bio. Comptes créés au printemps 2026, « 0 abonné » au 24/03 (project-context) ; aucun relevé depuis.
