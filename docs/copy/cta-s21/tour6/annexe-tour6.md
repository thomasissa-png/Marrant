# Annexe du tour 6 : ce qui a été repris, d'où, et le taux de changement par bloc

> Interne, jamais transmis aux relecteurs. Les relecteurs sont r1, r2, r3 (verdicts du tour 5 : `tour5/verdicts/verdict-r{1,2,3}.md`). Point de départ de chaque bloc : le gagnant du tour 5 (`tour5/resultats-tour5.md`, clés dans `cles-pack12-tour5.md` et `cles-pack3-tour5.md`). Règle d'intégration : retouche citée par au moins deux relecteurs, ou par un relecteur qui a mis 10 (ou 9 pour les blocs « autres »), ou demandée par Thomas.

## Mesure du taux de changement (P0 s11)

Pas d'outil de diff disponible dans cette session (aucun Bash) : mesure faite à la main, mot à mot, sur le texte complet de chaque bloc tel que montré aux relecteurs (boutons, liens, lignes de prix compris). Formule : `(mots supprimés + mots ajoutés) / (mots avant + mots après)`, avec l'ordre des mots pris en compte (un passage déplacé compte comme supprimé puis ajouté). Les données publiques (S17/S18 de B14, hero de B3, 4 avantages de B4+B5) sont exclues du comptage. Précision : ± 2 mots par bloc.

| Bloc | Gagnant du tour 5 | Mots avant | Supprimés | Ajoutés | Taux |
|---|---|---|---|---|---|
| B1 | A | 59 | 4 | 5 | 7,6 % |
| B2 | A | 129 | 2 | 3 | 1,9 % |
| B18 | A | 89 | 2 | 2 | 2,2 % |
| B3 | B | 44 (zone d'action) | 4 | 14 | 18,4 % |
| B4+B5 | A | 117 | 26 | 22 | 20,9 % |
| B6 | « 2,99 €/mois » | 2 | 0 | 0 | 0 % (libellé visible) |
| B7 (3 listes) | B | 354 | 13 | 4 | 2,4 % |
| B8 | A | 110 | 1 | 1 | 0,9 % |
| B9 | B | 99 | 9 | 20 | 13,9 % |
| B10 | B | 96 | 3 | 5 | 4,1 % |
| B11 (6 gestes, 4 textes distincts) | A | 288 | 9 | 7 | 2,8 % |
| B12 | B | 75 | 0 | 9 | 5,7 % |
| B13 (Répartie + Storytelling) | A | 153 | 16 | 16 | 10,5 % |
| B14 | A | 82 | 1 | 2 | 1,8 % |
| B15 | A | 20 | 3 | 2 | 12,8 % |
| B16 | A | 110 | 5 | 7 | 5,4 % |
| B17 | texte seul | 38 | 0 | 0 | 0 % |

Ensemble des 16 blocs modifiés ou non, hors B17 : environ 6 % de mots changés. Ce n'est pas une « refonte » : c'est une passe de finition, et le rapport doit le dire. Les deux plus gros écarts (B4+B5 21 %, B3 18 %) sont chacun un passage réordonné ou ajouté sur demande explicite.

Intouchables vérifiés : aucun prix, aucun chiffre de durée, aucun nom de parcours, aucune garantie modifiés. Seuls changements de chiffre : « 20 minutes » ajouté en B3 (vrai : étape de 20 minutes pour Répartie), « 4 » dynamique en B12 (`PARCOURS_COUNT - 1`).

## Ce qui est repris, bloc par bloc

**B1** (A, 9-10-9). Repris : « Chaque mois, de nouvelles situations arrivent dans Premium » (r2 qui a mis 10 et r3 : le « Et » sans verbe flotte) ; `[S1]` « La situation offerte ce mois-ci » (r3, 9 : un intitulé de rubrique devient un fait vrai et frais). Écarté : « une sortie polie » (r1 seul, r2 et r3 préfèrent « quoi dire si ça se tend »). Risque : `[S1]` n'est vrai que si la scène montrée est la situation offerte du mois (condition déjà posée).

**B2** (A, 9-9-9). Repris : l'énumération des étapes réparée en groupes nominaux, « les piques qu'on retourne avec le sourire » (r1, r2, r3 disent tous que l'infinitif casse la liste ; r1 et r2 donnent cette forme) ; lien « Débloquer » → `Ouvrir les 5 parcours · 2,99 €/mois` (r2 et demande Thomas). Écarté : « Les 5 parcours avec Premium, 2,99 €/mois » (r2) : Thomas impose le mot de la page d'abonnement.

**B18** (A, 9-10-8). Repris : « exemple à l'appui » → « avec un exemple » (r1, r2, r3 : scolaire). Écarté : « Dessous, ce qui la fait marcher » (r3 seul, 8) : « Puis » reste.

**B3** (B, 8-8-8). Repris : la ligne sous le bouton dit ce qu'on teste (r1, r2, r3 : les trois disent que le visiteur ne sait pas ce qu'il teste) ; lien `OUVRIR`. **Écart avec la proposition de Thomas** : « C'est l'étape 1 du parcours Répartie » devient « Tester mes premières répliques, c'est l'étape 1 du parcours Répartie : 20 minutes, sans compte, quiz compris. » Raison : la ligne s'affiche sous le lien payant « Ouvrir les 5 parcours », et r3 a relevé que « Ça » juste après ce lien se lit comme désignant les parcours payants ; « C'est » seul aurait le même défaut. Répéter le libellé du bouton lève l'ambiguïté. Si Thomas préfère sa phrase telle quelle, c'est un changement d'un mot dans `[S20]`. La suite (« La suite est dans Premium ») garde la frontière gratuit/payant.

**B4+B5** (A, 8-9-8). Repris : bouton `OUVRIR` à la place de « Débloquer les 5 parcours, 2,99 €/mois » (r2 qui a mis 9 + Thomas) ; ordre scène, puis parcours, puis mécanique (r1 : le visiteur cherche d'abord « lequel est pour moi ») ; mécanique raccourcie, « Chaque parcours avance d'une étape par semaine » supprimé (r3 : formule administrative) ; « pour le travail » (r2 et r3). Écarté : « tenir une table avec une anecdote » (r2 seul : répète « table » déjà dans la première phrase) ; r3 « pour tes anecdotes » (seul). Le taux de 21 % est surtout le déplacement de la phrase de mécanique.

**B6** (« 2,99 €/mois », 8-7-8 ; tour 4 : 2 contre 1). Repris : texte tel quel. Annexe seulement : variante `Premium 2,99 €`, proposée par r2 et r3 « si ça tient dans 85 px », à mesurer à 360 px au code (pas à brancher sans mesure). **Hors texte** : le nom accessible passe de « Voir les prix de Premium » à « 2,99 € par mois : voir l'offre Premium », pour contenir le libellé visible (WCAG 2.5.3, commande vocale « clique 2,99 »). À valider par @fullstack.

**B7** (B, 8-8-8). Repris : `[S21]` « La suite est juste en dessous, dans Premium. » + `[S22]` « Le filtre par catégorie aussi. » / « Les filtres par niveau et par catégorie aussi. » (r1 qui propose exactement cette paire, r2 qui note la répétition de « Premium » entre S21 et S22, r3 qui note la même répétition) ; « pour l'essayer » sur /conseils (r1, r2 ; « pour le tester sur toi » sonnait médical). `[S24]` des trois listes gardé en liste (r1 et r2 : se survole mieux sur mobile ; r3 préférait la prose, minoritaire). « Premium » apparaît 3 fois en 5 lignes (S21, S24, bouton), pas 4 en 4. Écarté : « Les autres sont juste en dessous, avec Premium » (r2 seul) et « pour l'essayer pour de vrai » (r2 seul).

**B8** (A, 8-9-9). Repris : « L'exercice est dans Premium » à la place de « Il est dans Premium » (r2 et r3, qui ont mis 9, ont tous deux relevé le « Il » sans antécédent) ; la phrase « Celle que… » rattachée à l'exercice par une virgule (r2) comme chez r3. Un mot changé.

**B9** (B, 7-8-8 : personne n'a mis 9). Les trois relecteurs s'accordent sur trois défauts de B : « tester ce conseil sur toi » (cobaye), le contenu d'une étape non dit (r2, r3), la phrase finale encombrée de deux incises (r1, r3). Repris : « tester sur toi » → « l'essayer, tranquillement » (r1, r2, r3) ; contenu d'une étape dit « avec un conseil, des vannes, des vidéos et un quiz » (r2, r3) ; ouverture « Le conseil, tu l'as lu. Reste à l'essayer » (r1) pour partir de ce qu'il vient de faire, sans reprendre « avant d'en avoir besoin » (redit le titre). Bouton « Tester ce conseil avec Premium » gardé (r1 « juste », r3 : redondance levée puisque le texte dit maintenant « essayer »). Seul bloc où aucun relecteur n'a mis 9 : le 13,9 % est un vrai remaniement, à surveiller.

**B10** (B, 8-8-8). Repris : titre et bouton disent le même geste (Thomas, r3, r2) : « Après le rire, le décryptage » + « Décrypter cette vidéo avec Premium » (option citée par r3). « et ça s'entraîne » (r2 : « la meilleure raison de payer » ; r3 : « referme bien l'idée » ; r1 seul le juge « formule de coach ») ; « pour t'entraîner » retiré après « 5 parcours » (redondance avec « et ça s'entraîne »). Écarté : « Pourquoi la salle a ri » (r2 seul : promet un contenu d'analyse que les faits disent inconnu) ; « ton tour » (r3 seul : tire vers l'exercice).

**B11** (A, 8-9-8). Repris : titre de vote « Voter sur les nouveautés, c'est dans Premium » (demande de Thomas, soutenue par r1). **Risque assumé** : r2 le juge « panneau d'interdiction » et r3 « il ferme une porte » ; la ligne `[S27]` du vote compense en ouvrant (« Avec Premium : ton vote, tes favoris et 5 parcours… », r2 + r3 : ajouter « Avec Premium : » comme les autres gestes ; r2 : ne pas répéter « sur les nouveautés »). Titre favori vidéo « pour la retrouver » gardé (r1, r2, r3 : « soir » faux pour une vidéo).

**B12** (B, 8-8-8). Repris : « Ça se travaille » gardé (r2, r3 ; r1 seul le juge coach) ; ligne Premium « Premium ouvre {P} en entier et les {AUTRES} autres parcours » (r1, r2, r3 : elle dit ce que le prix ouvre) avec nombre dynamique (Thomas). Le lien « Voir les 5 parcours en entier avec Premium » reste, avec `{PARCOURS_COUNT}`.

**B13** (A, 9-9-9). Repris : première phrase coupée en trois (r1, r2, r3 : trop chargée) ; « tu ouvres les 5 parcours, pas seulement {P} » gardé (Thomas, r3). « pour toi si » gardé dans une phrase séparée (r3 : meilleure accroche, r1 et r2 le retiraient : conflit tranché pour r3 car il garde la ligne de carte pour Storytelling). Écarté : « Pour le même prix » (r1, r2) : le prix n'est pas encore lu avant le bouton ; « Et pour le même prix, les 4 autres parcours avec » (r2 seul, familier).

**B14** (A, 9-10-8). Repris : « à 20 minutes » → « 20 minutes par semaine » (r1, r2, r3) ; lien « par e-mail » rétabli (r1, r2, r3). Gardé : « tu la valides, tu ouvres l'étape 2, puis toute la suite » (r2, 10 : « trois gestes qui montent »), pas la forme « tu la valides et tu passes à l'étape 2 » (r1, r3).

**B15** (A, 9-10-9). Repris : bouton « Commencer Répartie, étape 1 gratuite » (déjà dans A) + deuxième phrase de `[S31]` de l'autre texte, « Les étapes 2 à 4 sont dans Premium. » (r1, r2, r3 : l'incise « La suite, étapes 2 à 4, est dans Premium » alourdit). **Écart avec la consigne** : première phrase « Sans compte ni abonnement » (r2 et r3, dans leurs versions « à 10 ») et non « Sans compte, sans abonnement » (r1). Deux relecteurs sur trois, et c'est celle d'A.

**B16** (A, 9-9-9). Repris : plus de « à ton rythme » (absent de A). Confiance : « Le rire, 20 minutes par semaine, sans te forcer » (Thomas, r2 : « vrai et rassure »). Storytelling : titre avec une scène, « Ton histoire jusqu'à la chute, avant qu'on te dise « et donc ? » » (r2, Thomas), scène tirée de la description du parcours (« Il y a toujours quelqu'un pour dire « et donc ? » au milieu de ton histoire »). Variante de r3 écartée : « Ton anecdote jusqu'à la chute, sans « et donc ? » au milieu » (moins une scène qu'une règle). **Non repris** : r1 (9) trouve « 20 minutes par semaine » comme une ligne de planning entre « Le rire » et « sans te forcer » et propose « Ta légèreté, une étape par semaine, sans te forcer » ; il contredit la consigne de Thomas sur Confiance. Si r1 met 9 à nouveau sur ce point, c'est la piste.

**B17** (10-9-10). Tel quel. r2 (9) proposait « juste pour te dire salut dans nos e-mails » ; non repris sur consigne.

## Points d'attention pour @fullstack et Thomas

- **Grep** `Débloquer` dans `src/` après branchement : le mot ne doit rester dans aucun libellé d'appel.
- Les libellés qui comptent les parcours (« 5 », « 4 autres ») passent par `PARCOURS_COUNT` : voir `textes-finaux.md`.
- B16 : le titre Storytelling (`[S33d]`) est en place ; vérifier la coupe sur 2 lignes à 360 px (le surtitre fait 14 mots, le titre 11).
- B1 : `[S1]` dépend de la condition « situation offerte du mois ».
- B11 et B16 contiennent des guillemets français imbriqués ou en tête de phrase (« et donc ? ») : pas d'échappement HTML cassé.
- Zéro tiret cadratin dans les trois fichiers du tour 6.
