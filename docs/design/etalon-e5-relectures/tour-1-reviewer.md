# E5, relecture à l'aveugle, tour 1 : @reviewer (cohérence et exactitude)

> 12/11/2026. Lus : les 4 HTML de `docs/espace-client/etalons/e5/`, `docs/design/etalon-e5-s24.md`, architecture v20 (9 E5 ; 2.2, 2.6, 2.7, 2.9, 4.1, 4.4, 5.4, 6.2, 6.3), `etalons-espace-s24.md` E1.1 et E1.2, `founder-preferences.md` l. 161 à 171, `llms.txt/route.ts`, `config/premium.ts`, `parcours-etapes.ts`. Captures lues : aujourdhui 375, premier écran, après paiement, cloche ouverte, zoom 200 ; carte-rafale révision avant et après ; parcours 375 et zoom 200 ; mes-questions 375.

## Notes
| Critère | Note |
|---|---|
| Cohérence | 6/10 |
| Exactitude des textes | 8/10 |
| Fidélité aux décisions | 8/10 |
| Complétude (ligne E5) | 5/10 |

## Ce qui tient (vérifié)
- Poêle mot pour mot (E1.1 : scène, « Ta réponse d'abord », trois répliques dont « elle a pris ses marques », pourquoi du contexte 1, règle) ; barre C1 dans l'ordre sur les 4 pages ; zéro tiret cadratin, zéro émoji, zéro mention d'IA, aucun prix affiché (Grep).
- Aucune note avant la réponse : `revision-avant` n'en montre aucune, `revision` l'affiche après « Tu avais une réponse ? » (captures conformes à 2.2).
- Métadonnées de `parcours.html` l. 154-158 = `llms.txt` l. 64-88 et `premium.ts` l. 77-85 (durées, minutes, niveaux, Confiance sans niveau, ordre). « étapes » au lieu de « semaines » : équivalent (`premium.ts` l. 68).
- Textes repris exacts : série, état 0, aide de la série (4.4 l. 717), cap « Tu avances bien · cap 3 sur 5 » (fp l. 168), 3 types et délai de 2.6, états de la note 2.7, panneau et état vide de la cloche 2.9.

## Fautes et corrections
| # | Fichier / état | Faute | Correction |
|---|---|---|---|
| 1 | `aujourdhui.html` l. 192, `#etat=pas` et `apres-paiement` | « 12 cartes cette semaine » à l'arrivée : 4.4 (a) dit « affiché seulement à partir d'une carte » ; un abonné du jour 1 en a 0 | Masquer le repère dans les états d'arrivée |
| 2 | `aujourdhui.html` l. 251-256, arrivée | « Confiance, Étape 3 sur 6, Reprendre » le jour 1 : contredit 4.4 point 3 (« Commencer l'étape 1 » sans date) et 4.1 (aucun parcours la semaine 1) | À l'arrivée : carte d'étape absente ou « Commencer l'étape 1 » |
| 3 | `aujourdhui.html` l. 144, 399 ; capture après paiement | Pastille « 1 réponse de l'équipe non lue » juste après le paiement : impossible (aucun envoi) | Cloche à `aucune` par défaut en `pas` et `apres-paiement` |
| 4 | Captures `aujourdhui-375-premier-ecran` (N4) | Puces « Ce soir, c'est plutôt ? » dans le premier écran : test de 9 E5 en échec (« rien d'autre qui demande un geste ») | Ouvert, à @design (réduire la carte ou l'espace sous elle, mesurer) |
| 5 | Arrivée, l. 204 et 216 | Deux « Commencer » sur la même page (premier pas, rafale) : libellés identiques, cibles différentes | Rafale : libellé distinct [HYPOTHÈSE, @copywriter], ou rafale masquée avant le premier pas |
| 6 | `aujourdhui.html` l. 202 | « tiens, tu as changé… » : la source E1.2 l. 123 écrit « Tiens » | Majuscule, ou citer la scène telle quelle |
| 7 | `aujourdhui.html` l. 203, 210 | « Moins de 5 minutes » (4.1 dit « 5 min ») et « 1 situation nouvelle, jusqu'à 2 à revoir » : sans source, non marqués | « 5 min » ou marquer [HYPOTHÈSE] ; idem l. 210 |
| 8 | `aujourdhui.html` l. 213-214 | Titres des cartes à revoir = répliques citées de E1.2 sans titre validé | Marquer [HYPOTHÈSE] ou titre « univers : objet » sur le modèle « Coloc : la poêle » |
| 9 | `carte-rafale.html` l. 190 | Geste E1.1 tronqué (« Pour aller plus loin… dis-la en vrai. » manquant) et ligne de retour (Pas essayé / Essayé, bof / Essayé, ça a marché) absente avant la note | Geste entier puis retour, puis la note (ordre E1.1 l. 48-52) |
| 10 | `carte-rafale.html` l. 263-264 | 2.2 point 6 : « la règle, en une phrase » ; la maquette affiche la règle E1.1 en trois phrases | Garder E1.1 (validé) et noter l'écart dans `etalon-e5-s24.md`, ou faire trancher l'architecture |
| 11 | `aujourdhui.html` l. 340, 349 | Nom au pluriel (« 2 réponses de l'équipe non lues ») jamais rendu (exigé par 9 E5) ; ligne « L'équipe t'a répondu » sous le titre du même nom : doublon | État `#cloche=reponses2` ; ligne = type et date du fil |
| 12 | Captures `mes-questions-375`, `parcours-375-zoom200` | « Aujourd'hui » hors vue (« 'hui » coupé à 200 %) : 6.2 contrôle (a) le veut visible dès le premier écran | Arbitrer avec @ux : ramener l'actif sans masquer « Aujourd'hui » |
| 13 | `.ib-s` (4 HTML) sous 360 px et à 200 % | Loupe masquée : la recherche n'existe plus (6.2 : bouton icône de 44 px) | Chemin de recherche à décider (point 5.5 du doc design) |
| 14 | `mes-questions.html` l. 176, `#etat=retard` | Envoyé le 10/11, « en retard » le 12/11 : 2 jours ouvrés, 2.6 dit après 3 | Date d'envoi au 6 novembre dans l'état retard |
| 15 | `mes-questions.html` l. 167 | Exemple « Est-ce que cette blague est lourde ?… » = [PISTE] en 2.6, affiché sans marque | Marquer [PISTE] dans le doc design |
| 16 | `parcours.html` l. 130 | « Tes 4 premières semaines » réduit à une étiquette ; 5.4 veut le calendrier de 4.1 en quatre lignes | Rendre les quatre lignes |
| 17 | `aujourdhui-375-zoom200` | Lignes de rafale illisibles (un mot par ligne, chevron sur le texte) | À @design : étiquette au-dessus du titre sous 300 px |
| 18 | `aujourdhui.html` l. 165, `carte-rafale` l. 129, `mes-questions` l. 123 | Onglet « Parcours » en `href="#"` (lien mort entre maquettes) | `parcours.html` |

## Complétude : non rendu (ligne 9 E5)
Règles de « Oui », « À moitié », « Rien » et ordre de tirage ; « Et toi ? » en révision avec la note après la réponse (2.2) ; page de succès (« Continuer » dominant, renonciation) ; écran « Mes répliques » et ligne « Tes répliques à toi pour {catégorie} » ; mission et retours ; question de bilan ; états « retiré » et « abonnement terminé » de « Mes questions » ; test à l'aveugle des accroches (à faire par @copywriter). La question C9 est absente à juste titre.

## Verdict
NO-GO tour 1. Top 3 : (1) états d'arrivée incohérents, fautes 1 à 3 ; (2) N4 en échec, faute 4 ; (3) complétude de la ligne E5. Relancer @design (1 à 5, 9, 11 à 14, 16 à 18) puis @copywriter (5 à 8, accroches).
