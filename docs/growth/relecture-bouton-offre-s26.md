# Relecture à l'aveugle : bouton d'offre de l'en-tête (s26), @growth

Cadre : prix fixe 1,99 €/mois, pas de budget acquisition (clic organique seulement), clic vers `/abonnement` (titre « Premium ouvre tout Deviens Marrant »), « débloquer » réservé aux paliers. Notes /10, jugement a priori : aucune donnée de clic n'existe, tout reste `[HYPOTHÈSE]` jusqu'au test.
Critères : (a) clic probable, (b) clarté de ce qu'on obtient, (c) honnêteté vs page et paliers, (d) cohérence avec un clic vers une page de prix.

## Notes

| # | Libellé | a | b | c | d | Total /40 |
|---|---|---|---|---|---|---|
| 1 | Premium (actuel) | 4 | 4 | 9 | 8 | 25 |
| 2 | Tout ouvrir | 7 | 7 | 8 | 9 | 31 |
| 3 | Bosser ta répartie | 7 | 5 | 6 | 5 | 23 |
| 4 | Mieux répondre | 6 | 4 | 5 | 5 | 20 |
| 5 | Je m'abonne | 4 | 6 | 8 | 5 | 23 |
| V1 | Ouvre tout | 7 | 7 | 8 | 9 | 31 |
| V2 | Sans limite | 6 | 7 | 6 | 8 | 27 |

## Une ligne par candidat

1. Premium : honnête et cohérent, mais c'est un nom de palier, pas un bénéfice : personne ne sait ce que ça ouvre, clic faible.
2. Tout ouvrir : bénéfice + verbe d'action, fait écho exact au titre d'arrivée et à la « porte générique » déjà prévue dans `ACCROCHES`. « Tout » est un peu large face aux bonus par paliers, mais le titre de la page dit déjà « ouvre tout » et un abonné a tout dès J1 : écart tenable (8).
3. Bosser ta répartie : le plus désirable (parle du résultat de Yanis), mais la page d'arrivée parle d'accès, pas de travail, rupture de message ; « bosser » se fait aussi en gratuit. Déborde à 768 px.
4. Mieux répondre : promesse de résultat vague et non garantie (surpromesse), flou sur ce qu'on achète. Déborde.
5. Je m'abonne : clair sur l'action, mais l'engagement avant d'avoir vu l'offre fait fuir, et le clic ne mène pas à un paiement mais à une page de vente (promesse trompeuse sur l'étape suivante).
V1. Ouvre tout : même force que 2, reprend le verbe du titre ; impératif ambigu (qui ouvre quoi ?) et moins naturel pour un bouton.
V2. Sans limite : dit ce qu'on retire (les plafonds gratuits), clair ; mais « sans limite » se heurte aux paliers de bonus (honnêteté 6) et ne rappelle pas le titre.

## À écarter d'office

- **3 et 4** : débordent à 768 px, et repousser le repli « Premium » à ~800 px change la mise en page pour tous : le test serait pollué (libellé + layout). À écarter du test ; 3 reste une piste pour un bandeau ou une carte, pas pour l'en-tête collant.
- **5** : à écarter pour un clic qui mène à une page de prix (le verbe d'achat reste pour le bouton de la page, `libelleSabonner`).

## Variantes proposées (≤ 11 caractères avant « · 1,99 €/mois »)

- V1 « Ouvre tout » (10 car.), V2 « Sans limite » (11 car.). Largeur non mesurée : à vérifier en situation à 768 px avant mise en test (« Tout ouvrir » = 188 px est déjà à la limite ; « Sans limite » devrait être plus étroit, à confirmer).

## Classement

1. Tout ouvrir (31, ex aequo avec V1, préféré : vocabulaire déjà dans le code et la page)
2. Ouvre tout (31)
3. Sans limite (27)
4. Premium (25)
5. Je m'abonne (23, écarté)
5. Bosser ta répartie (23, écarté)
7. Mieux répondre (20, écarté)

## Test A/B recommandé

**« Tout ouvrir · 1,99 €/mois » contre « Premium · 1,99 €/mois »** : un seul changement (le libellé), même largeur à 13 px près, même page d'arrivée. Mesure : clics sur le bouton / sessions (Umami), puis taux d'abonnement à 30 jours pour vérifier qu'on ne gagne pas des clics sans achat. Trafic faible (organique, 0 € de budget) : décider sur le ratio clic > 30 jours, pas sur un seuil de significativité, et ne pas lancer un deuxième test en parallèle. Garde-fou honnêteté : si la page d'arrivée ne confirme pas « tout » dans les 5 premières secondes, le titre actuel suffit ; sinon rebasculer sur « Premium ».
