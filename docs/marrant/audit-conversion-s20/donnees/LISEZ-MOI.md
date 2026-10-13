# Dossier de preuves, audit conversion s20 (13/10/2026)

Extraits par la session principale le 13/10/2026, en lecture seule. Aucune donnée inventée.

## Fichiers

- `umami-28j.json` : Umami du 15/09 au 12/10/2026 (28 jours, heure de Paris) ; stats + 28 jours précédents, pages, pages d'entrée, pages de sortie, sources, événements, appareils, pays.
- `base-conversion.json` : base de prod (comptes par mois, abonnements sans e-mail, progression des parcours).
- `texte-<page>.txt` : texte visible des 11 pages clés en mobile (375 px), relevé sur la prod.
- Captures réelles de la prod (375×812 et 1280×800) : `/tmp/claude-0/-home-user-Marrant/90079057-8e81-5537-b214-35701865fe07/scratchpad/captures-conversion/`
  - `<page>-mobile-ecran1.png` / `<page>-desktop-ecran1.png` : premier écran ;
  - `<page>-mobile-trancheNN.png` : page mobile entière, par tranches de 1 600 px ;
  - `<page>-desktop-pleine.png` : page ordinateur entière.
  - Pages : accueil, article-blagues-2026, article-phrases-droles, blog, vannes, conseils, videos, video-fiche (Haroun), parcours, abonnement, register.

## Chiffres clés (28 jours)

| Indicateur | Valeur | 28 j précédents |
|---|---|---|
| Visiteurs | 683 | 574 |
| Visites | 803 | 666 |
| Pages vues | 1 166 | 799 |
| Visites à une seule page (rebond) | 597 sur 803 (74 %) | 607 sur 666 (91 %) |
| Appareils | mobile 455, laptop 210, tablette 13, desktop 5 | |

- **Entrées** : `/blog/meilleures-blagues-droles-2026` 397 (≈ 58 % des entrées identifiées), `/blog/phrases-droles-conversations` 51, `/` 40, `/vannes` 29, `/blog/exercices-developper-humour` 19, `/abonnement` 9.
- **Sources** : google.com 402, bing.com 50, duckduckgo 13, ecosia 12, chatgpt.com 3 ; réseaux sociaux ≈ 0 (t.co 1).
- **Événements du funnel** : `mur-vu` 16, `abonnement-vu` 6, `abonnement-clic` 5, `inscription-envoi` 3, `inscription-reussie` 2, `inscription-echec` 1, `abonnement-reussi` 1, `quiz-termine` 1 ; blog : `blog-scroll` 201, `blog-sortie-clic` 10, `blog-ancre-clic` 4.
- **Base** : 14 comptes au total depuis mars 2026 (5 créés sur les 28 derniers jours) ; abonnés Premium actifs : 2 (abonnés de lancement à 0,99 €/mois) ; 1 paiement à 2,99 € le 07/10, résilié depuis ; revenu mensuel récurrent 1,98 €.
- **Rapport du lundi 12/10** (semaine du 05/10 au 11/10) : 223 visiteurs, 15 vues de `/abonnement`, 5 clics vers le paiement, 1 paiement.

## Repères

- Audit précédent : `docs/marrant/audit-note-s15.md` (CONVERTIR 2,8/10 le 05/10) et `docs/growth/audit-note-s15.md`. Depuis : tunnel visiteur → Premium refait (s15-s16), parcours d'apprentissage (s17-s19), maillage SEO (s20).
- Offre : pas de compte gratuit (visiteur → Premium direct) ; Premium 2,99 €/mois ou 24,99 €/an ; 5 parcours (première étape gratuite).
