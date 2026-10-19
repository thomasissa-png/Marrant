# Chiffres réels des appels à l'action, lot 1 (s21, 18/10/2026)

> Extraction en lecture seule le 18/10/2026 vers 05:05 (heure de Paris) : API Umami Cloud (site « Deviens Marrant », id `5dcbf24f-f37e-413f-9ad3-736b33f94c1d`, filtre `hostname=deviens-marrant.fr`) et API d'admin de la base (`/api/admin/db?action=count|query`, sans aucune donnée personnelle lue). Aucun chiffre estimé : une donnée absente est écrite « absente ».

## Périodes

| | Après lot 1 (A) | Avant (B, 4 semaines) |
|---|---|---|
| Fenêtre (heure de Paris) | 14/10 00:00 au 18/10 05:05 | 16/09 00:00 au 13/10 23:59 |
| Durée réelle | **4,2 jours** (le 18/10 ne compte que 5 h) | 28 jours |
| Pages vues | 189 (44,9 / jour) | 1 183 (42,3 / jour) |
| Visiteurs / visites | 116 / 129 | 687 / 808 |
| Mobile / ordinateur portable | 62 / 53 visiteurs | 457 / 212 visiteurs |

Le lot 0-1 est déployé le 13/10 (`REPLIT_ACTIONS.md`, version `b5c6ce51`) : la journée du 13/10, comptée dans B, est déjà « après » pour les encarts (les 10 `blog-cta-vu` de B datent tous du 13/10). Trafic stable : +6 % de pages vues par jour, sources inchangées (google.com 56 visiteurs en A).

## 1. Pages d'entrée (top 15)

| # | Page d'entrée | A (4,2 j) | B (28 j) |
|---|---|---|---|
| 1 | /blog/meilleures-blagues-droles-2026 | 55 | 406 |
| 2 | / | 15 | 41 |
| 3 | /blog/phrases-droles-conversations | 12 | 62 |
| 4 | /blog/exercices-developper-humour | 6 | 20 |
| 5 | /blog/citation-drole | 3 | 9 |
| 6 | /abonnement | 3 | 10 |
| 7 | /vannes | 3 | 28 |
| 8 | /blog/conversation-machine-a-cafe | 2 | 7 |
| 9 | /blog/repondre-moqueries-avec-humour | 2 | 11 |
| 10 | /conseils | 2 | hors top 15 |
| 11 | /blog/storytelling-drole-5-structures | 1 | 7 |
| 12 | /videos/fadily-camara-jamel-comedy-club-saison-8-… | 1 | hors top 15 |
| 13 | /videos | 1 | hors top 15 |
| 14 | /vannes/premier-cours-de-salsa-… | 1 | hors top 15 |
| 15 | /blog/techniques-humoristes-pros | 1 | 9 |

Hors top 15 de A mais dans celui de B : /blog/comment-faire-rire-une-fille 8, /parcours 8, /blog/comment-avoir-de-la-repartie 7, /blog/autoderision-interactions 7. L'article n°1 fait 43 % des entrées en A (55 sur 129 visites) et 50 % en B (406 sur 808).

## 2. Blocs d'appel à l'action des articles

`blog-cta-vu` : encart visible à 50 %, une fois par encart et par vue de page. `blog-cta-clic` : clic sur un bouton `data-blog-cta`.

**Par emplacement, tous articles (A)**

| Emplacement | Vues | Clics | Taux de clic |
|---|---|---|---|
| milieu-1 | 50 | 0 | 0 % |
| milieu-2 | 9 | 0 | 0 % |
| fin (bloc de fin) | 10 | 0 | 0 % |
| **Total** | **69** | **0** | **0 %** |

**Par article et emplacement (A)**

| Article | Pages vues | milieu-1 | milieu-2 | fin | Clics |
|---|---|---|---|---|---|
| meilleures-blagues-droles-2026 | 55 | 31 (56 % des vues) | 9 (16 %) | 3 (5 %) | 0 |
| phrases-droles-conversations | 12 | 7 | sans objet | 3 | 0 |
| exercices-developper-humour | 6 | 5 | sans objet | 1 | 0 |
| 6 autres articles | absent (sous le top 30) | 7 | 0 | 3 | 0 |

**Par parcours visé (A)** : Répartie 53 vues, Boulot 9, Confiance 7 ; 0 clic sur chacun. Pages vues de `/parcours/repartie`, `/parcours/boulot`, `/parcours/confiance` en A : **0** (le 0 clic n'est donc pas un trou de mesure).

**Comparaison B** : `blog-cta-vu` n'existait pas avant le 13/10 (vues d'encart : absentes) ; `blog-cta-clic` : 0 sur 28 jours.

**Autres clics dans les articles (A)** : `blog-sortie-clic` 7 (dont 6 sur l'article n°1, vers /vannes/theme/famille 2, /vannes/theme/soirees, /vannes/theme/gaming, /blague-du-jour, /parcours/machine-a-cafe, /blog/comment-devenir-drole), `blog-ancre-clic` 2. En B : 12 et 5.

## 3. Entonnoir article → abonnement → paiement

| Étape | A (4,2 j) | par jour | B (28 j) | par jour |
|---|---|---|---|---|
| Vues de l'article n°1 | 55 | 13,1 | 409 | 14,6 |
| Encarts vus (`blog-cta-vu`, tous articles) | 69 | 16,4 | absent | absent |
| Clics sur encart (`blog-cta-clic`) | 0 | 0 | 0 | 0 |
| Murs Premium vus (`mur-vu`) | 20 | 4,8 | 23 | 0,8 |
| Vues de /abonnement (pages vues) | 3 | 0,7 | 22 | 0,8 |
| `abonnement-vu` | 3 (direct 2, exercice-vanne 1, blog 0) | 0,7 | 9 (direct 5, header 2, exercice-vanne 2) | 0,3 |
| Clics vers le paiement (`abonnement-clic`) | 0 | 0 | 5 | 0,2 |
| `checkout-ouvert` / `checkout-echec` | **absent : jamais codés** (reco A4 de s20 non livrée, aucun appel dans `apps/web/src`) | | absent | |
| Inscriptions (`inscription-envoi` / `-reussie` / `-echec`) | 0 / 0 / 0 | | 3 / 2 / 1 | |
| `abonnement-reussi` (retour Stripe) | 0 | | 1 | |
| Comptes créés (base, `User.createdAt`) | 0 | | 5 | |
| Abonnements créés (base, `Subscription.createdAt`) | **0** | | 1 | |
| Paiements Stripe (premiers et renouvellements) | absent (table `WebhookEvent` non lisible par l'API d'admin) | | absent | |

Base au 18/10 : 2 abonnements actifs, tous deux de lancement à 0,99 €/mois (créés le 18/03 et le 14/08), aucun en fin programmée. L'un a été mis à jour le 14/10 à 03:44 UTC, sans création : probablement un renouvellement, non confirmable sans `WebhookEvent`.

## 4. Constats (3 au plus)

1. **L'exposition à l'offre a bien eu lieu.** Sur l'article n°1, le premier encart (Répartie) est vu par 31 vues de page sur 55 (56 %), alors que le premier lien vers le produit arrivait à 77 % de la page avant le lot 1. Les 9 articles concernés totalisent 69 vues d'encart en 4,2 jours.
2. **Personne ne clique : 0 clic sur 69 vues d'encart, 0 vue des pages parcours visées.** Le seuil du lot 1 (au moins 3 % des vues de l'article n°1) n'est pas atteint (0 sur 55). Mais ce n'est pas encore un échec prouvé : avec 0 clic sur 55 vues, le vrai taux peut aller jusqu'à environ 5,5 % (règle de trois, 95 %). Pour conclure qu'il reste sous 3 %, il faut au moins 99 vues sans clic. Au rythme de 13 vues par jour, on y sera vers le 21/10.
3. **Aucun effet en aval.** /abonnement reste à 0,7 vue par jour (0,8 avant), avec 0 arrivée depuis un article. On compte 0 clic vers le paiement (5 en 28 jours avant), 0 compte et 0 abonnement créés depuis le 14/10. `abonnement-vu` semble doubler par jour (0,7 contre 0,3), mais ce n'est pas un vrai doublement : en B, l'événement était sous-compté (9 événements pour 22 pages vues, écart déjà noté en s20). Le critère « `abonnement-vu` ×2 » n'est donc pas lisible tel quel. Il vaut mieux suivre les pages vues de /abonnement.

## 5. Limites

- **Volumes très faibles** : 4,2 jours, 55 vues de l'article n°1, 3 vues de /abonnement. Aucun écart d'entonnoir n'est significatif ; seul le 0 sur 69 a une borne calculable (constat 2). La mesure prévue court sur 4 semaines (jusqu'au 10/11).
- **Trafic interne mal exclu** : 2 pages vues de `/admin` en A (6 en B), donc au moins une session de Thomas est comptée. L'exclusion `?ne-pas-compter=1` ne joue que pour les navigateurs où le lien a été ouvert, et Umami ne permet pas de la rattraper après coup. La forte hausse de `mur-vu` (4,8 par jour contre 0,8) peut en partie venir de là : non vérifiable.
- **`emailsExclus()` non appliqué** : `ANALYTICS_EMAILS_EXCLUS` est absente de cet environnement. Sans effet en A (0 compte, 0 abonnement créé) ; pour l'abonnement de B, on ne sait pas s'il s'agit d'un test (probablement le paiement à 2,99 € du 07/10, voir audit s20).
- **Deux comptages Umami divergent pour une même page** : le comptage par chemin (55 en A, 409 en B, utilisé ici) et les stats filtrées par chemin (59 et 451). L'ordre de grandeur reste le même.
- **Absents** : `checkout-ouvert` et `checkout-echec` (jamais codés), nombre de paiements Stripe (hors API d'admin), vues d'encart avant le 13/10.
