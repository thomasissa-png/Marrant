# Retours framework (projet Marrant → Agent-Team)

> Recommandations valables pour tous les projets, à intégrer côté Agent-Team via le prompt « Intégrer des learnings d'un autre projet ». Source : `docs/lessons-learned.md`.

## Clôture s14 (05/10/2026)

1. **[P0] Mémo contre choix fondateur.** Une ligne de mémo ou d'historique ne vaut jamais contre un `[CHOIX UTILISATEUR]` postérieur. En clôture, l'orchestrateur annote toute ligne de mémo contredite par un choix. Un « go » global ne lève jamais un choix écrit ; aucun chiffre retiré sans GO explicite.
2. **[P1] Noter le rendu, pas la source.** Toute notation d'un contenu publié (article, page) se fait sur le rendu réel : captures de l'aperçu de production et HTML servi (JSON-LD compris). Le brouillon markdown cache les défauts de gabarit (dates, guillemets, commentaires HTML).
3. **[P1] Boucle 10/10 : passe de contrôle obligatoire.** Les correctifs prescrits par le relecteur peuvent créer de nouveaux défauts (échos, chute éventée). Après chaque application, une passe de contrôle courte. Toute contradiction entre deux notations est tranchée une fois (règle de référence, ex. typographie) et inscrite en `[CHOIX]`.
4. **[P1] API de paiement.** Après une montée de version d'API (Stripe), rejouer un événement réel et surveiller le taux d'échec des webhooks : un champ déplacé a mis les webhooks en 500 pendant 4 jours sans alerte.
