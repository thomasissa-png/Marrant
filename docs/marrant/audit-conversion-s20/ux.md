# Audit conversion s20, angle parcours et frictions (@ux, 13/10/2026)

Base : captures réelles de la prod (375x812 mobile en priorité, 1280x800 en complément) + Umami 15/09 au 12/10. Dossier captures : `.../scratchpad/captures-conversion/` (noms cités ci-dessous). Les `[CHOIX UTILISATEUR]` de `docs/founder-preferences.md` sont respectés : pas de compte gratuit, prix 2,99 €/mois et 24,99 €/an inchangés, « 1 500+ » et chiffres du site intacts, aucun dark pattern, aucun texte nouveau sans calibrage d'étalons avec Thomas (P0 s8).

## Verdict

**CONVERSION (angle UX) : 4 / 10.** Le tunnel après le clic est propre (abonnement, étape 1 sur 2, réassurance). Le trou est AVANT : l'article n°1 reçoit 397 entrées et 385 sorties sur la même page (Umami), soit environ 12 visites sur 397 qui vont ailleurs. Le produit n'est pas visible entre l'arrivée de Yanis et l'écran 14. Rappel : audit s15 du 05/10 = 2,8/10, le tunnel refait (s15-s16) a fait progresser la partie aval, pas la partie amont.

| Critère | Note | Preuve principale |
|---|---|---|
| U1 Premier écran des pages d'entrée | 6 | accueil 8, article 5, /vannes 5, /abonnement 6 |
| U2 Chemin article → produit | 3 | 1er lien produit à l'écran 14, 97 % de sorties sur l'article |
| U3 Valeur gratuite découvrable avant le mur | 5 | atouts réels mais cachés derrière des liens discrets |
| U4 Murs Premium | 6 | honnêtes et sortables, peu orientés bénéfice |
| U5 Tunnel /abonnement → paiement | 6 | clair, mais CTA sous le pli, Stripe non capturé |
| U6 Navigation et repères mobiles | 5 | aucun CTA dans l'en-tête mobile (présent sur desktop) |

## Parcours simulé : Yanis, Google → article n°1 → paiement

Mesures prises sur les tranches (pas de 1 600 px) ; 1 écran mobile = 812 px. Les positions sont approximatives.

| Étape | Écran / page | Ce que Yanis voit (capture) | Décision |
|---|---|---|---|
| 0 | Google → `/blog/meilleures-blagues-droles-2026` | `article-blagues-2026-mobile-ecran1` : titre, auteur, 3 paragraphes. Zéro vanne, zéro mention du produit. En-tête : logo, icône compte, loupe, burger | D1 : lire ou revenir à Google |
| 1 | Écrans 2 à 13 | tranches 01 à 07 : 50 vannes, liens « blagues de soirée / bureau / dating… » en fin de section, boutons partage, aucun encart produit | D2 : copier une vanne, partager, ou partir (il a ce qu'il cherchait) |
| 2 | Écran 14 (environ 11 500 px sur 14 924, soit 77 % de la page) | `article-blagues-2026-mobile-tranche08` : « Tu les as lues. Reste à les sortir pour de vrai. » + bouton « Passer à Premium » + lien « Lire la première étape d'un parcours » | D3 : cliquer ou fermer l'onglet |
| 3 | `/abonnement` | `abonnement-mobile-ecran1` : titre, prix, bascule Mensuel/Annuel, 4 bénéfices. Le bouton « Commencer à 2,99 €/mois » n'apparaît qu'à 1,3 écran (`tranche01`, y 1033) | D4 : mensuel ou annuel ; payer ou lire d'abord une étape |
| 4 | `/register` | `register-mobile-pleine` : « Étape 1 sur 2 », 3 champs + Google, rappel prix et 14 jours | D5 : e-mail ou Google, puis saisie |
| 5 | Stripe | **Non capturé** : champs carte, erreurs et 3DS non évalués | D6 : payer |

Bilan : 4 pages (article, abonnement, register, Stripe), au moins 18 écrans dont 14 de scroll avant la première proposition produit, 6 décisions, 3 clics après la lecture (Passer à Premium, Commencer, Créer mon compte) avant la page Stripe. Chemin alternatif sans payer : écran 14, puis « Lire la première étape » : le lien ne nomme pas de parcours, la destination (probablement `/parcours`, non vérifiée) impose un 5e choix à Yanis.

Entonnoir Umami (28 j, petits effectifs, à lire comme ordre de grandeur) : 683 visiteurs, mur-vu 16, abonnement-vu 6, abonnement-clic 5, inscription-envoi 3, inscription-réussie 2, abonnement-réussi 1. Le rapport du lundi donne 15 vues de `/abonnement` sur la seule semaine du 05 au 11/10 alors que l'événement `abonnement-vu` n'en compte que 6 sur 28 j : la mesure du haut de tunnel est incomplète, à corriger par @data-analyst avant de chiffrer des cibles fines.

## Notes détaillées

**U1 : 6/10.**
- Accueil (`accueil-mobile-ecran1`) : très bon, 8/10. H1 « Tu parles et personne rit. On va arranger ça. », le texte reprend la douleur exacte de Yanis (« Tu restes muet quand on te chambre ? »), bouton unique « Accéder aux parcours complets » avec prix en dessous, lien « Lire la première étape gratuite », 3 pastilles de situation. Faiblesse : les pastilles grises ressemblent à des étiquettes, elles disent pourtant le mieux ce qu'on obtient.
- Article n°1 (`article-blagues-2026-mobile-ecran1`) : 5/10. Le premier écran ne contient ni vanne ni signal produit. La première vanne n'arrive qu'à environ 1 540 px (`tranche01`), soit 2 écrans, derrière une intro, des liens d'ancres en texte courant (cibles bien inférieures à 44 px) et une boîte « Définition ».
- `/vannes` (`vannes-mobile-ecran1`) : 5/10. Titre sur 3 lignes, paragraphe, 7 pastilles sur 3 rangées, puis l'encart « Aperçu gratuit : 10 vannes… » avec « Tout débloquer ». Aucune vanne visible au premier écran : le bouton d'achat arrive avant la première blague.
- `/abonnement` (`abonnement-mobile-ecran1`) : 6/10. Promesse claire, mais aucun bouton d'action dans le premier écran.

**U2 : 3/10.**
- Aucun lien produit avant l'écran 14. Entre-temps, les liens de fin de section (« les blagues de soirée », `tranche02`) mènent au catalogue, bonne continuité d'intention mais ils ne sont pas mesurés comme tels (`blog-sortie-clic` 10 sur 28 j, `blog-ancre-clic` 4).
- Le bloc de fin (`tranche08`) est bien écrit (il prolonge l'intention : sortir les vannes pour de vrai) mais il est seul, tardif, et suivi de la FAQ, de « Suivant », « À lire ensuite » et d'un « Parcours recommandé » : 6 sorties concurrentes en 2 écrans (`tranche08` et `tranche09`).
- Le parcours recommandé est Machine à Café (`tranche09`) alors que Yanis est le profil Répartie (« Je reste muet quand on me chambre », `accueil-mobile-tranche03`). Sur `article-phrases-droles-mobile-tranche08`, l'ordre des blocs est inversé (parcours recommandé puis Premium) : le gabarit n'est pas stable.
- Mobile : aucun bouton d'action dans l'en-tête (`article-blagues-2026-mobile-ecran1`), alors que le desktop affiche « Commencer » (`article-blagues-2026-desktop-ecran1`). La partie du trafic la plus nombreuse (455 visiteurs mobile sur 683) est celle qui n'a pas ce repère.

**U3 : 5/10.**
- Atouts réels : étape 1 gratuite de chaque parcours, quiz sans inscription (`parcours-mobile-tranche01` : « Question 1/2 » intégré), 10 vannes avec « Révéler la chute » et micro-textes complices (« Attention, chute en approche », `vannes-mobile-tranche02`), fiches détail lisibles.
- Mais ils sont présentés en liens soulignés ou en second bouton. Résultat Umami : `/parcours/machine-a-cafe` 9 vues, `/parcours/confiance` 5, `/parcours/repartie` 5, `quiz-termine` 1 sur 28 j. Je n'ai pas de capture d'une étape 1 : l'expérience « vivre le produit » elle-même n'est pas évaluée ici.
- Sur l'article, la valeur gratuite offerte (50 vannes) est celle du SEO, pas celle du produit : Yanis repart comblé sans avoir touché au produit.

**U4 : 6/10.**
- Points forts : pas de pop-up ni d'interstitiel ; mur de la liste après 10 vannes consommées (`vannes-mobile-tranche03` : 4 cartes floutées « Débloquer », « 134 vannes supplémentaires avec l'abonnement », « Voir l'offre ») ; mur de fiche vidéo après la vidéo et sa description (`video-fiche-mobile-tranche01` : « Les points clés et l'exercice de cette vidéo font partie de Premium », « Voir Premium » + sortie « Voir toutes les vidéos », et au-dessus « Lire la première étape gratuite du parcours Répartie »). La limite est annoncée avant d'être atteinte : honnête.
- Faiblesses : le mur de liste vend une quantité (134) plutôt qu'un bénéfice pour Yanis, et ne propose aucune alternative gratuite à cet endroit (seulement « Voir l'offre »). Libellés d'achat dispersés : « Accéder aux parcours complets » (accueil), « Passer à Premium » (article), « Voir Premium » (fiche vidéo), « Tout débloquer » et « Débloquer » (/vannes), « Commencer à 2,99 €/mois » (/abonnement). Les étalons validés du 06/10 prévoient « Passer à l'accès complet » (3.1) et « Voir l'accès complet » (4.1) : écart prod/étalon à faire trancher par @copywriter et Thomas, pas de décision UX ici.

<!-- SUITE -->
