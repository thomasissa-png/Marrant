# Audit CONVERSION s20, angle @growth (13/10/2026)

Périmètre : visiteur vers paiement Premium (modèle sans compte gratuit, [CHOIX UTILISATEUR] du 05/10). Sources : `donnees/umami-28j.json` (15/09 au 12/10), `donnees/base-conversion.json`, `donnees/texte-*.txt`, captures 375 px, `docs/founder-preferences.md`, `docs/marrant/audit-note-s15.md`. Persona de calibrage : Yanis (20 ans, muet quand on le chambre). Barème s15 repris : 10 = référence pour un site de cette taille, 7 = bon, 5 = freine, 3 = bloque, 1 = absent.

## 1. Verdict

- **CONVERSION globale : 4,3 / 10** (s15 : 2,8). Le gain est un gain de capacité (tunnel réparé, mesuré, offre claire), pas de résultat : **0 payant organique à 2,99 € sur 28 jours** et un MRR inchangé à 1,98 €.
- **Le goulot n'est pas la page de paiement (G4 = 7/10), c'est l'exposition** : 0,9 à 2,3 % des visiteurs voient une offre (abonnement-vu 6, mur-vu 16 pour 683 visiteurs), et rien ne rattrape les autres (G6 = 1,5/10).
- **Maillon AARRR le plus faible : Activation.** Le visiteur de l'article n°1 (≈ 58 % des entrées) lit 50 vannes gratuites, ne rencontre aucun produit avant le bas d'une page de ≈ 14 500 px mobile, puis part (385 sorties pour 404 vues, 95 %).
- Conclusion de méthode : on ne polit pas `/abonnement` (19 vues en 28 j) avant d'avoir créé les moments où un visiteur éprouve la valeur. Aucune dépense payante : conversion non prouvée, budget acquisition 0 €.

## 2. Ce que disent les chiffres

### 2.1 Entonnoir réel (Umami, 28 j)

| Étape | Volume | Lecture |
|---|---|---|
| Visiteurs / visites | 683 / 803 | US 59 + CN 53 = 112 (16 %), probablement hors cible [HYPOTHÈSE] ; FR 435 (64 %) |
| Rebond | 597 sur 803 (74 %) | 91 % sur les 28 j précédents (607 sur 666) : net progrès |
| Durée par visite | 62 s (49 649 / 803) | 32 s avant (21 026 / 666) |
| Article n°1 | 397 entrées, 404 vues, 385 sorties | 95 % des vues sont une sortie |
| Pages parcours | 35 vues sur 1 166 (3 %) | `/parcours` 16, Machine à Café 9, Confiance 5, Répartie 5 |
| `mur-vu` | 16 | 2,3 % des visiteurs ; `/vannes` = 57 vues |
| `abonnement-vu` | 6 | `/abonnement` 19 vues dont 9 entrées directes : écart non expliqué |
| `abonnement-clic` | 5 | 5 sur 6 |
| `inscription-envoi` puis `-reussie` | 3 puis 2 (1 échec) | 5 comptes créés en 28 j en base : écart 5 contre 2 non expliqué |
| `abonnement-reussi` | 1 | 3 retours depuis checkout.stripe.com pour 1 paiement |
| Payants actifs à 2,99 € | **0** | |

- **Le paiement du 07/10 est très probablement le test d'achat réel D1 de Thomas** (project-context, s16 : « achat réel D1 validé, remboursement, résiliation auto » ; abonnement 2,99 € créé et annulé le 07/10 dans `base-conversion.json`). [HYPOTHÈSE à confirmer par Thomas]. Même chose probable pour une partie des 15 vues `/abonnement` de la semaine du 05/10 (rapport du lundi) : l'exclusion des 3 comptes de Thomas des funnels n'est pas confirmée.
- Tous les taux d'étape ci-dessus reposent sur n ≤ 16 : ils indiquent l'absence de fuite visible, pas un taux.
- Le dossier ne dit pas si les événements comptent des occurrences ou des visiteurs uniques.

### 2.2 Économie unitaire (obligatoire)

- **CAC cash = 0 €** (budget acquisition 0 €, 100 % organique). LTV:CAC non défini : la contrainte n'est pas le coût, c'est le volume et l'exposition. Aucun canal n'a CAC > LTV, aucun n'est exclu ; **paiement publicitaire : NON** tant que la conversion visiteur vers payant n'est pas mesurée hors comptes de test (reprise d'évaluation à ≥ 30 clics `abonnement-clic` hors Thomas).
- **ARPU** : 2,99 € TTC/mois (≈ 2,49 € HT si TVA 20 % [HYPOTHÈSE de taux]) ; annuel 24,99 € TTC = 2,08 €/mois.
- **Churn** : aucune donnée (les 2 abonnés à 0,99 € sont actifs depuis le 18/03 et le 14/08 ; l'abonnement à 2,99 € a vécu 0 jour). **LTV = 2,99 × 1/churn** ; avec [HYPOTHÈSE sans source : churn 8 %/mois, fourchette 5 à 10 %] LTV ≈ 37 € TTC (30 à 60 €). La recherche RevenueCat 2026 n'a fourni aucun chiffre de churn pour l'éducation : à recalculer sur données réelles. Payback : immédiat (CAC cash 0).
- **Benchmark de conversion** : Piano (déc. 2024, éditeurs de presse payante) donne ≈ 0,20 % visiteur vers payant, Europe 0,15 % [HYPOTHÈSE : proxy, aucun benchmark éducation grand public trouvé]. À 683 visiteurs, ce benchmark donne ≈ 1 payant par 28 j : **le site est déjà au niveau d'un benchmark de presse, le poli de page ne suffira pas**.
- **Arithmétique de l'objectif** (1 000 € de MRR = 335 abonnés mensuels, ou 481 annuels) : à 1 % de conversion il faut ≈ 33 500 visiteurs cumulés, soit ≈ 5 600/mois sur 6 mois (×8 le trafic actuel) ; à 0,2 %, ×41. Lecture : **la conversion et le trafic doivent progresser ensemble** ; ce n'est pas un verdict GO/NO-GO (valeur persona, CLAUDE.md n°5), c'est la répartition de l'effort.

| Canal (28 j) | Visites | CAC cash | Payants attribués | Lecture |
|---|---|---|---|---|
| Google | 402 + 4 (google.fr) | 0 € | 0 prouvé | quasi tout sur l'article n°1 |
| Autres moteurs (Bing 50, DDG 13, Ecosia 12, Yahoo 6, Qwant 3) | 84 | 0 € | 0 prouvé | |
| Assistants IA (chatgpt.com) | 3 | 0 € | 0 | trop faible pour juger |
| Réseaux (t.co) | 1 | 0 € | 0 | relance J0 le 12/10 : trop tôt, indicateur avancé à 90 j |

Attribution d'un paiement à une page impossible aujourd'hui (propriétés des événements non fournies dans le dossier) : c'est l'action 7.

<!-- SUITE -->
