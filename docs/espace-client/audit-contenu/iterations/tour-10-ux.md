# Tour 10, relecteur @ux (à l'aveugle) : `architecture-contenu-v10.md`

> Relu : en-tête, section 0 à 0 bis, 1.1 (faits de code), 3.3 (exemples), 4.1 à 4.5 en entier, 6.2, 7.3 à 7.6, section 8 (C13, C14, et les renvois des autres), section 9, annexes A à C ; le reste par passages (inchangé depuis la v9). Fait donné par la session : les vannes « inédites » sont des vannes actives jamais servies au contenu du jour, visibles dans le catalogue public. Références : mon tour 9.
> Limite : je n'ai relu ni `blog-clusters.ts`, ni `blog-encarts.ts`, ni `premium-return.ts`, ni `weekly-stock.ts` ; je m'appuie sur les faits donnés et sur ce que la v10 en cite.

## 1. Notes

| Critère | T8 | T9 | T10 | Justification courte |
|---|---|---|---|---|
| C1 Valeur Yanis, Sophie, Marc | 9 | 9 | 9 | Chemin complet du premier pas à l'habitude ; scènes d'entrée, rafale, missions, questions, vanne du jour : rien de nouveau à redire |
| C2 Décisions de Thomas | 9 | 9 | 10 | Chaque réouverture est marquée (A de C1, B et C de C3, C4 B et C, C8, C10, C12 C) ; pivot du 06/05 cité en C13 ; Q8 du brief posée comme telle (C14) ; aucune reco ne va contre un `[CHOIX UTILISATEUR]` |
| C3 Zéro donnée inventée | 8 | 8 | 9 | Faits de code exacts en tête (clusters, `src` relayé jusqu'à `/register`, jamais transmis à Stripe, inédits visibles dans le catalogue) ; seuil de vannes « à lire en base », jamais inventé ; une formule présuppose un résultat d'essai (W4) |
| C4 Rubriques claires, 6 entrées au plus | 9 | 9 | 9 | B recommandée, 6 entrées réelles, bloc unique du contenu du jour, toucher en puces accessibles |
| C5 Ambition | 9 | 9 | 10 | V1 complète, section 0, capteurs, règle de décision à J60, hors V1 posé par une règle écrite |
| C6 Cohérence | 8 | 8 | 9 | Ordres 1 et 2, 4.1, C9, C11, C14, E1 et E5 s'alignent ; totaux justes (155, 285, 100, 54, 60 = 30 + 30) ; deux petites dépendances implicites (W2, W5) |
| C7 Faisabilité | 9 | 9 | 9 | Chantier compté, développements conditionnels hors V1, lecture en base avant E5, essai réel au lot 0 |
| C8 Questions à Thomas | 9 | 9 | 9 | C13 et C14 sont nettes, marquées, avec reco ; une formule « boutons discrets » contredit les 44 px (W6) |
| C9 Exemples au ton maison | 8 | 9 | 9 | Rencontre : la risquée porte maintenant un trait (« Je te promets un menu à deux plats »), garde-fou dit ; prise de parole, poêle, frigo, faux secret, bilan : cohérents avec les règles |
| C10 Progression pédagogique | 9 | 9 | 9 | Calendrier, ordres de signaux, marches, bandeau « Ton premier pas » |
| **C11 Pertinence pour l'audience réelle** | 8 | 9 | **9** | Règle à deux niveaux appliquée à l'écriture, à l'écran et à la barre ; l'entrée par article est hors V1 et déclenchée par une mesure ; le chemin ne promet que ce que le code livre |

**Note globale C1 à C10 : 9,2 / 10** (92 sur 100). **Avec C11 : 9,2 / 10** (101 sur 110). T8 8,7 ; T9 8,8. **Aucune correction bloquante.** Cinq réglages non bloquants, tous courts ; les trois premiers (W1 à W3) sont à faire avant de montrer le document à Thomas si l'on vise 10/10.

## 2. Statut de mes 6 corrections du tour 9

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| V1 | « Catégorie d'article dérivée du cluster », « aucune seconde table » | OK | Le fait est écrit (un cluster donne un parcours ; `fort-volume` regroupe blagues, phrases drôles, « faire rire » ; humour noir dans `types-humour` ; aucun cluster storytelling ni autodérision ; les deux articles « faire rire » renvoyés à confiance par slug) ; « aucune seconde table » retiré ; table d'article **hors V1**, conditionnelle à une mesure (7.7 point 3), construite seulement comme petite correspondance par article assumée (au plus une douzaine de lignes) |
| V2 | Taille du lot de « une autre vanne », restriction « pas d'inédits » | OK | Restriction levée (inédites déjà visibles dans le catalogue public) ; ordre de tirage (d'abord les vannes de la catégorie déjà servies au contenu du jour, puis les autres actives) ; seuil minimal par catégorie lu en base avant E5 (7.5 f, ordre 0 bis) ; épuisement visible (« Tu as fait le tour de celles-ci », lien vers la Bibliothèque) ; stock d'inédits de l'alerte non consommé |
| V3 | C14 : le premier pas doit se voir ; page de succès | OK | Bandeau unique « Ton premier pas : … » la première fois sur un `returnTo` précis ; page de succès avec « Renoncer au contrat ici » et e-mail E0 inchangés ; connexion = « Aujourd'hui ». Une précision de forme (W1) |
| V4 | Reco de C1 et mesure de visiteurs ; +2 de la soirée | OK | 6.2 : « elle ne s'appuie sur aucune mesure de visiteurs » ; la règle 2 de 0.1 couvre « barre en 6.2 et C1 » ; soirée dite « indirect » (0.2, 3.3, 7.4) |
| V5 | Spécifier le toucher | OK | Rangée de puces d'au moins 44 px, deux lignes à 375 px, sélection marquée autrement que par la couleur, `aria-pressed`, annonce `aria-live` polie, focus conservé, « Peu importe » par défaut ; rendu avec lecteur d'écran à E5. Un cas limite (W3) |
| V6 | Risquée de la rencontre | OK | « Si on se revoit, c'est moi qui réserve. Je te promets un menu à deux plats. » : le trait taquine l'indécision, le garde-fou reste |

## 3. Le chemin de l'abonné, de bout en bout

| Étape | Ce que dit la v10 | Cohérent ? |
|---|---|---|
| Entrée (article, fiche, étape, parcours, rien) | `returnTo` honoré pour le parcours associé ; `src` perdu au paiement ; presque tout article vaut repartie (signal nul) ; signal informatif seulement pour confiance, boulot, machine-a-cafe, ou une étape ou fiche d'origine (4.2) | Oui |
| Paiement, page de succès, arrivée | Succès avec « Renoncer au contrat ici » et E0 inchangé ; `returnTo` précis honoré avec bandeau, sinon « Aujourd'hui » avec le premier pas ; connexion = « Aujourd'hui » (C14, 4.2) | Oui, une précision à écrire (W1) |
| Jour 1 | Premier pas de moins de 5 minutes selon l'ordre 1 (fiche ou étape d'origine, quiz même appareil, parcours d'origine hors repartie, scène par défaut) ; geste « Où veux-tu être plus à l'aise ? » une seule fois (C9 B) | Oui |
| Chaque jour | « Aujourd'hui » : une action principale, contenu du jour (vanne avec son toucher, conseil, vidéo, même poids), rafale « Si tu as 5 minutes » | Oui |
| Semaine 2 | Ordre 2 : réponse explicite, étape d'origine, quiz, parcours d'origine, défaut (C11) ; étape 2 si l'abonné vient de l'étape 1 gratuite | Oui (W2, W5) |
| Semaines 3 et 4 | Date conseillée à 7 jours, séance, écoute, bilan seulement pour Machine à Café, temps maximum par semaine posé en C2 | Oui |
| Au-delà | Carnet mensuel, situations, capteurs (7.7), règle de décision à J60 avec effectif minimal | Oui |

## 4. Réglages restants (non bloquants)

**W1. Page de succès : redirection automatique ou bouton ? (C10, C8).** C14 : la page de succès garde « Renoncer au contrat ici » « avant toute redirection ». Dire si la page reste affichée avec un bouton « Continuer » (recommandé : aucun défilement automatique qui ferait disparaître le lien et le message de bienvenue), ou si elle redirige au bout d'un délai. Le pied de page affiche déjà le lien en permanence (brief §2.2), ce qui sécurise l'obligation, mais le choix de l'abonné doit être écrit.

**W2. `/parcours/repartie` sans étape = « pas de signal » dépend de C11 (C6).** 4.2 : la règle repose sur le fait que le produit ne distingue pas « repartie par cluster » de « repartie par défaut ». Elle est sans effet si C11 = A (défaut Répartie). Si Thomas choisit C11 B (Machine à Café) ou C, un abonné qui avait vraiment choisi la page Répartie reçoit un autre parcours. Écrire cette dépendance dans la règle (une phrase) : sous C11 A, aucun écart ; sous B ou C, le coût est accepté (le geste de C9 B et le quiz corrigent) ou une marque d'origine est ajoutée à la page de parcours.

**W3. Toucher : moins de deux catégories qualifiées (C4).** 4.4 : une catégorie sous le seuil est absente. Si toutes sont sous le seuil, il ne reste que « Peu importe » : dire que la rangée disparaît et que seul « Une autre » est affiché.

**W4. Une formule présuppose le résultat de l'essai (C3).** 7.5 (e) : « il confirme que le `src` n'atteint pas l'espace » ; le code lu dit déjà que non, mais l'essai est un contrôle : écrire « il vérifie si le `src` atteint l'espace ».

**W5. Fiche d'origine liée à un parcours (C6).** L'ordre 2 cite l'étape d'origine ; un conseil ou une vidéo ouvert avant l'abonnement est parfois rattaché à une étape de parcours (donnée existante). Dire si, dans ce cas, le parcours de cette étape compte comme « étape d'origine » pour la semaine 2.

**W6. « Boutons discrets » en C13 B (C8).** « La vanne du jour porte le toucher et “une autre”, en boutons discrets sous elle » : les puces font 44 px au moins (4.4). Remplacer « discrets » par « compacts » pour ne pas contredire la spécification.

## 5. Avis

Document prêt à être présenté à Thomas : plus de bloquant, chemin complet et cohérent, chaque promesse tenue par un fait de code vérifié ou rendue conditionnelle. Pour viser 10/10 sur tous les critères, W1 à W3 sont à écrire (trois phrases) ; W4 à W6 sont des retouches de formulation.

## 6. Points acquis (à ne pas perdre)

- Règle de priorité à deux niveaux (0.1), [OBSERVÉ] redéfini, plan des 60 et des 30 premières, exemples rencontre et prise de parole.
- 4.2 (ordres 1 et 2, principe commun, parcours sans étape, repli quand la source est perdue, entrée par article hors V1), 4.4 (bloc unique, toucher en composant accessible, ordre de tirage, seuil lu en base), C13, C14.
- 7.5 (e) et (f), 7.7 (capteurs sans identité), 7.6 (effectif minimal), C9 corrigée.
- Totaux : 155 fiches neuves, 285 distinctes, 100 hors parcours, 54 lues, 1 150 à 3 750 candidates.
