# Libellés de l'espace Premium, étalon E5 (s24), tour 2

> Auteur : @copywriter, 12/11/2026. **Tour 2**, après les relectures à l'aveugle du tour 1 (`libelles-espace-e5-relectures/tour-1-*.md`, notes 5 à 9). Sources : `docs/design/etalon-e5-s24.md` (§0 v6 et v6.1, §0.4 et ses libellés ajoutés 25 à 29) ; `architecture-contenu-v20.md` (2.2, 2.4, 2.6 à 2.9, 3.10, 4.1, 4.4) ; barre : `etalons-espace-s24.md` ; ton : `ton-alex.md`. Aucun HTML modifié.
> Règles tenues : tutoiement, zéro tiret cadratin, zéro émoji, aucune mention d'IA ni de concurrent, aucun accord au masculin ou au féminin pour l'abonné, guillemets « » avec “ ” à l'intérieur, aucun prix, aucune donnée inventée. `n` = longueur comptée à la main, espaces compris.
> `[Framework : démonstration puis geste]` `[Conscience : Solution-Aware]`. **Statut : non relu à l'aveugle sur cette version** (règle d'or P0 s18).

## 1. Libellés de §0.4 (lignes 1 à 24)

| # | Texte proposé | n / max | Source |
|---|---|---|---|
| 1 | « Ton premier pas » | 15 / 24 | architecture 4.4 (« le premier pas »), étiquette neuve |
| 2 | « Commencer » | 9 / 16 | architecture 4.4 l. 704 (« Commencer l'étape 1 ») |
| 3 | **Supprimé** (étalon v6, T1) : la maquette affiche le texte réel complet de `BIENVENUE_PREMIUM.favori` (« Ta vanne est dans tes favoris. Le reste est ouvert aussi : les listes, les parcours, les carnets. », variantes conseil et vidéo) | n/a | `abonnement-vente.ts` l. 171 à 173, repris sans coupure |
| 4 | « 1 situation nouvelle, 2 cartes à revoir » ; singulier : « 1 situation nouvelle, 1 carte à revoir » ; sans nouvelle : « 2 cartes à revoir » ou « 1 carte à revoir » ; sans révision : « 1 situation nouvelle » | 39 / 50 | architecture 2.2 l. 210 (« jusqu'à 2 cartes à revoir ») ; afficher le nombre réel est un choix neuf |
| 5 | « Nouvelle » ; « À revoir » | 8 / 12 | « À revoir » : 2.2 ; « Nouvelle » neuf |
| 6 | « Soirée : le “et toi ?” » ; « Amis : le “quoi de neuf ?” » | 24 et 27 / 40 | modèle « Coloc : la poêle » (E1.1) ; univers de E1.2 entrées 1 et 2 ; guillemets intérieurs “ ” |
| 7 | Bouton : « Première carte ». Titre collé au bouton : « Si tu as 5 minutes » | 14 / 20 | titre : 2.2 l. 210 et 4.4 l. 703. Choix : « Première carte » dit le petit geste d'un mardi soir et évite « jouer ses cartes » (stratégie) ; il reste distinct de « Commencer ». Condition du reviewer : le titre reste visible juste au-dessus du bouton, sans bloc entre les deux |
| 8 | « À toi : ressors-la à voix haute ce soir. » (conservé) | 41 / 50 | texte de la maquette ; geste de E1 |
| 9 | « Étape en cours » ; « Étape conseillée » | 15 et 17 / 24 | 4.1, 4.4 ; `entrees-parcours.ts` l. 20 |
| 10 | « Notifications » | 13 / 20 | 2.9 (nom accessible) |
| 11 | Groupe : « Nouveau ce mois-ci ». Lignes : « Le carnet du mois », « De nouvelles situations », « La lettre du jeudi 12 novembre ». Réponse : « L'équipe t'a répondu » | 18 à 33 / 40 | 2.9 ; 2.8 (« La lettre du jeudi 12 novembre ») |
| 12 | « Vanne affichée : {catégorie} » ; « Vanne du jour affichée » ; « Une autre vanne affichée ». « Aller au contenu principal » ; « Rechercher » ; « Menu du compte » ; « Plus de rubriques » | 24 à 30 / 40 | `(dashboard)/layout.tsx` l. 15 ; `header.tsx` l. 168 ; le reste neuf |
| 13 | 4 lignes ci-dessous | 80 à 90 / 90 | tableau 4.1 |
| 14 | « Les parcours » | 13 / 30 | `resiliation.ts` l. 116 (même mot) |
| 15 | Section 2 | | neuf |
| 16 | « Ici, tu sors laquelle ? » | 23 / 40 | réécriture d'@elon (la consigne d'école disparaît) ; « sortir » est le verbe de 2.2 (« à sortir quand le groupe a déjà ri ») |
| 17 | « Cette carte reviendra dans 7 jours. » ; « Cette carte reviendra dans 2 jours. » ; modèle « … dans {n} jours. » (21 jours : même phrase). Aucune ligne pour « Oui » | 36 / 40 | règle de révision, 2.2 |
| 18 | « Ton retour » | 11 / 20 | `mission.html`, 2.4 |
| 19 | « Supprimer cette réplique ? » ; « Supprimer » ; « Annuler » ; « Supprimée » ; échec : « L'enregistrement n'a pas abouti. Ton texte est toujours là. » (59) ; compteur : « 1 caractère », « {n} caractères » (ou « {n} / {max} caractères » une fois le plafond fixé) | 27 / 30 ; 59 / 60 | texte de la maquette ; compteur : `question-equipe-s22.ts` l. 38 ; « Enregistrée », « Réessayer » : 2.7 |
| 20 | Titre : « Écrire à l'équipe » (validé). « C'est à propos de quoi ? ». « Ton message ». « Envoyer à l'équipe » | 17 ; 24 ; 12 ; 19 / 30 | « Écrire à l'équipe » : 2.6 l. 294 ; « Envoyer à l'équipe » : `question-equipe-s22.ts` l. 39 ; « C'est à propos de quoi ? » : @elon (« De quoi s'agit-il ? » vouvoyait en douce) |
| 21 | « Envoyé le {date} » ; « Répondu le {date} » ; « Réponse de l'équipe, le {date} » ; « Par exemple, pour “Une question” : » | 34 / 40 | 2.6 (états Envoyé, Répondu) ; guillemets intérieurs “ ” |
| 22 | « Retirer de mon historique » | 25 / 30 | 2.6, C10 a |
| 23 | Exemple : « Est-ce que cette blague est lourde ? Voici la scène… » (conservé, [PISTE]). Description : « Tout le reste : comprendre une technique d'humour, un contenu, l'offre. » | 54 ; 71 / 80 | 2.6 l. 299 et 320 ; « comprendre » rétabli (reviewer), « d'humour » levant « panne technique » (@elon) |
| 24 | « Un problème » : « Mon paiement est passé, mais je n'ai pas accès aux parcours. » ; « Une situation à gérer » : « Un collègue me chambre devant tout le monde, je n'ai rien trouvé à répondre. » | 59 ; 77 / 80 | le second : `question-equipe-s22.ts` l. 37 à la première personne |

### Ligne 13, calendrier (un ordre conseillé, jamais un verrou)
- « Semaine 1 : le faux secret, une mission à voix haute. Parcours : facultatif cette semaine. » (89)
- « Semaine 2 : une étape, un mot de vocabulaire, une mission à envoyer par message. » (80)
- « Semaine 3 : l'étape suivante, une séance de 20 minutes, une mission en face. » (76)
- « Semaine 4 : l'étape suivante, un exercice “Écouter, repérer”, une mission en face. » (83)

« Séance » : mot de l'architecture (3.11, « Séance de 20 minutes », ligne « S'entraîner » de « Plus »), absent des textes du site ; la durée suffit à l'expliquer, repli « un entraînement de 20 minutes ». Le bilan n'est pas cité : dans ces 4 semaines il n'arrive que pour Machine à Café (3 étapes, 4.1) ; il existe un bilan par parcours (3.10).

## 2. Libellés ajoutés 25 à 29 et v6

| # | Texte | Source |
|---|---|---|
| 25 | Repère : « Marche 2 » (sans total, 3.0 pt 6). Titres : « À voix haute, seul » ; « À un pote, par message » ; « À un pote, en face » ; « Devant un petit groupe » ; « Avec quelqu'un que tu connais peu ». « Facultative ». « Ton retour » | 2.4 (les 5 marches) ; « pote » partout, « proche » supprimé |
| 26 | « Marche suivante : à un pote, en face. » ; « Voir la marche 3 » ; « Une autre situation, même marche » | 2.4 |
| 27 | « Bilan du parcours » ; « Refais une situation » | 3.10 |
| 28 | « Modifier » ; « Annuler » ; « Tes répliques sont gardées. Tu peux les relire et les supprimer. » ; « Tes répliques à toi pour {catégorie} » (catégorie en minuscule : « soirée », « boulot », « famille », « rencard ») | 2.6 l. 326, 2.7 |
| 29 | « 5 min » (cohérent avec « Si tu as 5 minutes » ; « Moins de 5 minutes » écarté, plus long) | 4.2, 4.4 |
| v6 | Repère : « Mon profil ». Adresse de l'équipe : « Un problème de paiement ou d'accès ? Écris à contact@deviens-marrant.fr. ». Placeholder : « Rechercher » | 2.6 l. 326 ; `CONTACT` (`question-equipe-s22.ts` l. 22) ; `header.tsx` l. 168 |

## 3. Accroche de la rafale (max 120), test à l'aveugle (tour 2)

Même promesse : s'entraîner à trouver sa réponse à temps. Affichée au-dessus de « Si tu as 5 minutes ».
- **A** (l'image d'abord, le nom ensuite, sans « trois jours », alignée sur E3 « en quittant la pièce ») : « La bonne réponse qui arrive dans l'escalier, en partant : ça s'appelle l'esprit de l'escalier. Ici, tu l'as à temps. » (117)
- **B** (sans le mot, corrigée par la critique) : « La bonne réponse qui arrive trois jours trop tard, tout le monde connaît. Ici, tu t'entraînes à la trouver à temps. » (115)

Note : B garde « trois jours » (2.2) alors que E3 dit « en quittant la pièce » ; si le test donne B, aligner la première phrase (« … qui arrive en quittant la pièce, tout le monde connaît », 114) avant mise en ligne.

## 4. Mission complète : Confiance, marche 2

Parcours Confiance : autodérision et trac avant (architecture 0). Mécanisme appris en semaine 1, « Le faux secret » (E2.1).

**Marche 2** · **À un pote, par message** · Facultative

**Énoncé**
Ce soir, dans une conversation déjà ouverte avec un pote, glisse ton faux secret : “Ça reste entre nous :” puis un aveu minuscule sur toi, avec un détail que tout le monde reconnaît. Envoie. Pose le téléphone. Surtout pas de “non mais je rigole”.
Un message, une personne, dix secondes.

**Ton retour** : « Pas essayé » · « Essayé, bof » · « Essayé, ça a marché »
- **Essayé, ça a marché** : « Bien joué : un aveu, zéro “je rigole”. Marche suivante : à un pote, en face. » Bouton : « Voir la marche 3 ».
- **Essayé, bof** : « Un message qui ne prend pas, ça arrive. Relis ton aveu : il tient en une phrase ? La fin surprend ? » Liens : « Une autre situation, même marche » ; « Quand ça tombe à plat » ; « Raconte-nous ce qui s'est passé » (Mes questions, « Situation à gérer »). Pas de vanne ici : plutôt rien qu'une moyenne.
- **Pas essayé** : aucun texte, la mission reste là. **Deux fois de suite** : sans commentaire, « Voir la marche 1 » (« Marche 1 : seul, à voix haute »).

Sources : format et suites 2.4 ; question 2 de la grille retirée (elle ne sert pas pour un aveu sur soi, reviewer).

## 5. Question de bilan complète : Confiance, étape 1

Format 3.10 : « Laquelle ressortir ici ? », trois vannes de l'étape 1 (« Énoncer la règle non écrite », `docs/content/parcours-seed.json` l. 640 à 644), contexte et retour neufs, ni la scène ni le contexte ne reprennent un mot de la bonne réponse (ni « on se », ni « faire »). Pas de note, pas de seuil.

**Bilan du parcours** · **Refais une situation**

**La scène**
Fin de soirée chez une amie. Tout le monde cherche son manteau, chacun promet de remettre ça bientôt. Personne ne sort son agenda pour fixer une date.

**Le contexte**
Tu connais bien la bande : elle rit volontiers de ses propres habitudes. La pièce se vide, l'ambiance est joyeuse.

**Question** : Laquelle ressortir ici ?
- A. « Mon père dit “je vais chercher du pain” dès qu'il y a trop de monde à la maison. » (seed l. 644)
- B. « Mon meilleur pote et moi, on se dit “il faudrait qu'on se fasse un truc” depuis des années. » (l. 641)
- C. « Dans le train, la place à côté de moi était réservée. Personne n'est venu. » (l. 642)

**Retour** (une seule bonne : B)
« B. Elle dit tout haut ce que chacun fait semblant de ne pas voir, avec toi dedans, sans viser personne. A parle de fuir la foule : ici, la pièce se vide. C est une jolie observation, mais sa place vide jure avec une ambiance joyeuse. »
Si A ou C : « Pas celle-là cette fois. L'étape “Énoncer la règle non écrite” est là si tu veux la refaire. » (lien vers la fiche)

Les trois vannes sont du même seed, du même registre (observation) : A et C sont plausibles, c'est le contexte qui tranche (foule qui part, ambiance joyeuse). [HYPOTHÈSE : B reste la bonne à l'aveugle sans être trouvée avant le contexte ; à vérifier.] « Tu avais une réponse ? » avant la question : flux du design (v6 h), non touché ici.

## 6. Tour 2 : retouche → ligne

| Retouche (source) | Ligne changée |
|---|---|
| A gagne, image avant le nom, sans « trois jours » (arbitrage, @elon, E3) | Accroche A réécrite ; B garde la critique (« la trouver à temps ») ; note sur « trois jours » dans B |
| Source fausse : « première phrase seulement » (reviewer) | Ligne 3 supprimée (étalon v6 T1), texte réel complet |
| Source fausse : « jamais jusqu'à » (reviewer) | Ligne 4 : source 2.2 l. 210, nombre réel = choix neuf ; cas « 1 carte à revoir » ajouté |
| Source fausse : bilan « seulement Machine à Café » (reviewer) | Ligne 13 : un bilan par parcours (3.10), 4 semaines seulement pour Machine à Café (4.1) |
| « Parcours : facultatif » vrai de toujours (reviewer) ; « mission par message » ; « Écouter, repérer » inconnu (@elon, critique) | Ligne 13 : « cette semaine », « à envoyer par message », « exercice “Écouter, repérer” » ; « séance » vérifié (architecture, pas dans le code), conservé |
| L7 : « Jouer les cartes » ou « Première carte » (@elon, reviewer) | « Première carte » choisi sous « Si tu as 5 minutes » collé, une ligne de justification |
| L16 consigne d'école (@elon) ; L20 vouvoiement (@elon) ; L23 « technique » flou, « comprendre » supprimé (reviewer, @elon, critique) | L16 « Ici, tu sors laquelle ? » ; L20 « C'est à propos de quoi ? » ; L23 « comprendre une technique d'humour » |
| Guillemets intérieurs (@elon, critique) | Lignes 6, 21, mission, bilan B : “ ” |
| « Marche n sur 5 » (reviewer, critique, v4 et v6) | « Marche 2 », « Marche 1 : seul, à voix haute » |
| « Provocable » interne ; pas de déclencheur ; « proche » et « pote » (reviewer, @elon, critique) | Énoncé : « Ce soir, dans une conversation déjà ouverte… », « pote » partout, retombée « zéro “je rigole” » ; « Un message, une personne, dix secondes. » |
| Grille à 2 questions sur 3 (reviewer, critique) | Retour « bof » : « il tient en une phrase ? La fin surprend ? » |
| Scène du bilan reprend « on se », « faire » ; B trouvée en 2 secondes ; « A et C sont bonnes » faux ; verdict sans pourquoi (reviewer, critique, @elon) | Scène et contexte sans mot de B ; A = seed l. 644 (fuir la foule), C = l. 642 ; retour qui explique A puis C |
| « 24 libellés » incomplet (reviewer) | Section 2 : libellés 25 à 29 et v6 écrits |

## Handoff
- Fichier : `/home/user/Marrant/docs/copy/libelles-espace-e5-s24.md`, ni commit ni HTML touchés.
- Choix : accroche A (117) contre B (115) à l'aveugle ; « Première carte » collé à « Si tu as 5 minutes » ; « Écrire à l'équipe » ; « pote » partout ; ligne 3 supprimée.
- Réutilisés : lignes 2, 8 à 12, 14, 17, 22, 24, mission et bilan sur 2.4 et 3.10 ; neufs : 1, 4 à 7, 16, 20, 21, accroches, énoncé, scène et contexte du bilan.
- À faire passer à l'aveugle (tour 2) : accroches A/B, énoncé, bilan (A et C plausibles ? B non trouvée avant le contexte ?), lignes 6, 13, 16, 20.
- Longueurs comptées à la main, à recompter à l'intégration ; « 5 min » et « Mon profil » restent des choix de ce tour, à confirmer.
