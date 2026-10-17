# Plan d'intégration s21 : lettre, offre et pages, en une seule mise à jour du site

Décision de Thomas (17/10) : tout intégrer proprement, inscriptions à la lettre ouvertes dès la mise en ligne, premier envoi la semaine du 2 novembre, itérer jusqu'à 10/10 avec les meilleurs agents, sans rien casser.

## Ce qui part ensemble
1. **Boutons et page d'abonnement** (branche `claude/marrant-s21-lot2-boutons`) : textes validés à l'aveugle, titre « Ta réplique pendant la soirée, pas dans le bus du retour », bouton d'achat visible sans défiler sur téléphone.
2. **Lettre gratuite du mois** (branche `claude/marrant-s21-lettre`) : formulaire (fin d'article, résultat du quiz, pied de page), page `/lettre`, e-mails, 6 numéros validés. Inscriptions ouvertes à la mise en ligne.
3. **Place de la lettre sur le site** : lien dans le pied de page (déjà prévu), entrée dans le menu, un bloc discret sur l'accueil (texte à écrire puis relire à l'aveugle). Le bouton Premium reste l'action principale partout.
4. **Mentions** : section « La lettre » de la politique de confidentialité et ajout aux CGU (textes @legal, `docs/legal/lettre-et-questions-s21.md`), publiées le même jour (bloquant B7).

## Calendrier des envois
- Numéro 1 : **jeudi 5 novembre, 8 h**. Il renvoie à l'article « Soirée de Noël au boulot », prévu le 16/11 : on avance cet article au **lundi 2 novembre** et on recule « Humour en visio » au 16/11 (échange de deux dates, aucun texte touché).
- Numéros 2 à 6 : premier jeudi de décembre à avril, 8 h.

## Ce qui suit, sans bloquer la mise en ligne
5. **« Ta question à l'équipe » et lettre de la semaine pour les abonnés** : construits derrière un interrupteur fermé ; l'offre Premium ne les annonce qu'à leur ouverture (on n'annonce rien qui n'existe pas). Réponse visée : moins de 48 h. Ouverture sur décision de Thomas (réponse envoyée avec ou sans sa relecture).

## Garde-fous « sans casser »
- Une seule branche d'intégration (`claude/marrant-s21-integration`), contrôles complets (types, lint, build, tous les tests), CI GitHub verte.
- Vérification visuelle sur téléphone et ordinateur de chaque page touchée, avant et après.
- Mise en ligne avec relevé de la version précédente et retour arrière en une commande ; contrôle du site réel juste après.
- Tout texte nouveau passe la relecture à l'aveugle (règle d'or) ; note globale visée 10/10 par @reviewer, itérations jusque-là.

## Ordre et agents
| Étape | Agent | Dépend de |
|---|---|---|
| A. Textes nouveaux (menu, bloc d'accueil) + relecture à l'aveugle | @copywriter puis 3 @reviewer | rien |
| B. Fusion des deux branches, date du numéro 1, mentions juridiques, menu et bloc d'accueil | @fullstack | branches terminées, A |
| C. Contrôle complet : tests de bout en bout, captures téléphone et ordinateur | @qa | B |
| D. Revue d'ensemble notée sur 10, corrections, nouvelle revue jusqu'à 10/10 | @reviewer, @ux, @design, puis @fullstack | C |
| E. Mise en ligne, échange des dates d'articles, contrôle du site réel | @infrastructure | D, feu vert de Thomas |
| F. « Ta question à l'équipe » et lettre de la semaine (interrupteur fermé) | @fullstack, @copywriter | en parallèle |
