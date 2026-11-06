# Résiliations Premium : données extraites (s23, 06/11/2026)

Extraction par la session principale, **lecture seule** (base de production via l'API SQL de Neon, API Umami). Aucune adresse, aucun identifiant, aucune donnée personnelle : les trois clients sont nommés A, B, C dans l'ordre des souscriptions. Thomas confirme (06/11) que ce sont **de vraies personnes**, pas des comptes de test. Heures de Paris.

## 1. Les trois clients (base)

| | A | B | C |
|---|---|---|---|
| Compte créé | 07/10 11:04 | 24/10 16:51 | 01/11 22:09 |
| Abonnement souscrit | 07/10 11:16 | 24/10 16:52 | 01/11 22:09 |
| Prix | 2,99 €/mois | 1,99 €/mois | 1,99 €/mois |
| Résiliation (dernière mise à jour de l'abonnement, heure approchée ; l'heure exacte est chez Stripe, non lue) | 07/10 11:20 (**4 min**) | 25/10 16:49 (**~24 h**) | 01/11 22:19 (**10 min**) |
| Statut aujourd'hui | annulé, plan FREE | actif jusqu'au 24/11, puis s'arrête | actif jusqu'au 01/12, puis s'arrête |
| Dernière activité enregistrée | 07/10 11:04 (création du compte) | 25/10 16:49 (= la résiliation) | 01/11 22:09 (création) |
| Points (XP), série, niveau | 0, 1, débutant | 0, 0, débutant | 0, 0, débutant |
| Favoris, parcours commencés, étapes validées, avis, likes, votes | **aucun** | **aucun** | **aucun** |
| Lettre de la semaine Premium | non | activée d'office le 05/11 06:00 (après la résiliation) | activée d'office le 05/11 06:00 (après la résiliation) |
| Demande de rétractation | non | non | non |
| E-mail vérifié | non | non | non |
| Connexion par mot de passe | oui | oui | oui |

**Constat** : aucun des trois n'a utilisé un seul contenu Premium dans son compte (zéro trace d'usage) entre le paiement et la résiliation, ni depuis. A et C résilient dans les minutes qui suivent l'achat ; B le lendemain, presque à l'heure anniversaire de l'achat.

## 2. Parcours de visite (Umami)

- Fenêtres examinées : 3 h avant à 1 h après chaque souscription, et autour de la résiliation de B.
- **Aucune des trois souscriptions n'est visible dans Umami** : pas de vue de `/register`, `/abonnement`, `/abonnement/success` ni d'événement `abonnement-clic` / `checkout-ouvert` à l'heure des achats de B et C. Les acheteurs échappent à la mesure (bloqueur de publicité, protection du navigateur, ou paramètre `?ne-pas-compter`) : on ne peut pas rattacher une visite à un client.
- Le 07/10 (client A), la fenêtre contient des dizaines de sessions qui enchaînent `/register`, `/login`, `/abonnement`, `/abonnement/success` en quelques minutes : vraisemblablement des tests automatisés sur la production ce jour-là [HYPOTHÈSE], ce qui brouille la lecture.
- Faits de contexte du trafic (rapport du lundi 02/11, semaine du 26/10 au 01/11) : 205 visiteurs, temps moyen 34 s ; 38 murs Premium vus, 3 vues de `/abonnement`, 1 clic vers le paiement, 0 paiement ouvert dans Umami alors que C a payé le 01/11 (cohérent avec l'invisibilité des acheteurs) ; 4 abonnés actifs, 2 résiliations programmées.

## 3. Ce qui n'a pas pu être lu

- Les heures exactes de résiliation et le motif éventuel saisi dans le portail client Stripe (clé Stripe non disponible dans la session).
- Les e-mails reçus par ces clients après le paiement (aucune table de journal pour les e-mails transactionnels).
