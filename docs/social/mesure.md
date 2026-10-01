# Mesure des réseaux sociaux (test de 8 semaines, à partir d'octobre 2026)

> Décision Thomas du 01/10/2026 : Instagram en priorité, X en relais, LinkedIn en pause, pas de TikTok. Aucune nouvelle API de métriques : les colonnes `impressions/likes/retweets/replies/clicks` de `SocialPost` ne sont pas remplies par le code (diagnostic s14, §2.4). La source de vérité est le relevé manuel des statistiques natives, plus Umami pour les visites.

## 1. Liens sortants : UTM partout

Tous les liens publiés vers le site portent les trois paramètres, posés par `apps/web/scripts/content/prepare-social-month.ts` :

| Paramètre | Valeur |
|---|---|
| `utm_source` | `x` ou `instagram` |
| `utm_medium` | `social` |
| `utm_campaign` | le mois, au format `AAAA-MM` (ex. `2026-10`) ; `bio` pour les liens de la page `/liens` |

Exemple : `https://deviens-marrant.fr/blog/<slug>?utm_source=instagram&utm_medium=social&utm_campaign=2026-10`.

- **X** : le lien de l'article du lundi est dans le texte du post.
- **Instagram** : les légendes ne sont pas cliquables. Le **lien de la bio** est `https://deviens-marrant.fr/liens`, à poser **une seule fois** (décision Thomas du 01/10/2026) : la page se met à jour seule (dernier article publié, vanne du jour, liens vers le parcours Répartie, les vannes et les conseils). Plus aucune mise à jour de la bio le lundi : la légende de l'article du lundi reste « Lien en bio. ». Les liens de `/liens` portent `utm_source=instagram&utm_medium=social&utm_campaign=bio` (campagne fixe `bio`, pas le mois).
- Règle : aucun lien vers le site sans UTM (y compris un lien ajouté à la main en réponse ou en message privé : reprendre la même forme, avec `utm_source` de la plateforme).

## 2. Relevé hebdomadaire du lundi (15 minutes)

Chaque lundi matin, relever les chiffres de la semaine précédente (lundi à dimanche) et les reporter dans le tableau du §4.

**X** (Analytics du compte, onglet Posts) :
- abonnés en fin de semaine ;
- pour chaque post de la semaine : impressions, interactions (j'aime, reposts, réponses), clics sur le lien (post du lundi) ;
- noter le post le plus vu et le moins vu.

**Instagram** (Statistiques professionnelles, compte professionnel requis) :
- abonnés en fin de semaine, visites du profil, clics sur le lien de la bio ;
- pour chaque post : couverture, enregistrements, partages (envois en message privé), j'aime, commentaires ;
- les **partages + enregistrements** sont l'indicateur principal : ils mesurent le « je l'envoie à un pote ».

**Fiabilité** (base, en lecture) : posts prévus contre posts publiés sur la semaine ; tout post `FAILED` porte désormais le message exact de Buffer dans `directorNote` (préfixe « Échec publication Buffer : »). Les e-mails d'échec sont limités à 1 par jour.

## 3. Umami : visites issues des réseaux

Umami (en place sur le site) lit les paramètres UTM des URL d'arrivée :
- filtrer la période sur la semaine relevée ;
- **Sources (referrers)** : `t.co` / `x.com` pour X, `instagram.com` / `l.instagram.com` pour Instagram ;
- **paramètres d'URL / rapport UTM** : visites par `utm_source` (`x`, `instagram`) et par `utm_campaign` (le mois, ou `bio` pour les clics depuis la page `/liens`) ;
- noter : visites, pages vues sur l'article du lundi, et inscriptions si l'événement d'inscription du plan de tracking est visible sur la même période.

Aucun script ni appel d'API supplémentaire : lecture manuelle du tableau de bord.

## 4. Tableau de relevé (une ligne par semaine et par plateforme)

| Semaine (lundi) | Plateforme | Abonnés | Posts prévus / publiés | Impressions ou couverture (total) | Partages + enregistrements | Interactions | Clics lien (post ou bio) | Visites Umami (utm_source) | Remarque |
|---|---|---|---|---|---|---|---|---|---|
| 05/10/2026 | X | | | | | | | | |
| 05/10/2026 | Instagram | | | | | | | | |

## 5. Lecture du test (8 semaines)

- Semaines 1 à 4 : référence, aucune décision.
- Semaine 5 : pour chaque plateforme, seuil fixé au-dessus de la médiane observée des 4 premières semaines.
- Fin de la semaine 8 : bilan avec Thomas (ratios vanne / article, créneaux 12:30 et 18:30, maintien de X). Un format dont les partages + enregistrements restent sous la médiane deux mois de suite est remplacé.
