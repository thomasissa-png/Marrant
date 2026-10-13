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

**U5 : 6/10.**
- Points forts : bascule Mensuel/Annuel sur la même carte, prix TTC, « sans engagement, annulable à tout moment », « remboursé sous 14 jours », « Paiement sécurisé par Stripe », bloc « Pas encore sûr ? Lis d'abord une étape » avec 5 liens (`abonnement-mobile-tranche01`), « Tu annules quand tu veux » (`tranche02`). `/register` : « Étape 1 sur 2 », « Étape 2 : le paiement sécurisé, juste après », rappel du prix, mot de passe avec oeil, lien Connecte-toi (`register-mobile-pleine`). Aucun champ superflu (3 champs).
- Faiblesses : (1) bouton principal à 1,3 écran, sans barre collante ; (2) première puce de 8 lignes qui liste 5 parcours avec leurs durées, avant le carnet, les favoris et les listes : dense pour un écran de 375 px ; (3) sur `/register`, « S'inscrire avec Google » est sous le formulaire e-mail, alors qu'un étudiant sur mobile choisira le plus court ; (4) seule sortie : « Retour à l'accueil », qui fait perdre le contexte de l'abonnement ; page pleine sans en-tête ni pied, contraire à la préférence UX fondateur « auth en modal fermable, repères visibles » ; (5) les 5 liens « Étape 1 du parcours … » sont mis au même niveau, Répartie n'est pas mise en avant pour Yanis.
- Non évalué faute de capture : page Stripe, erreurs (carte refusée, e-mail déjà utilisé), tarif annuel dans le rappel de `/register`, page de succès. Effectifs trop faibles pour conclure sur les pertes entre étapes (5 clics, 3 envois, 2 réussites, 1 paiement).

**U6 : 5/10.**
- Points forts : en-tête identique sur toutes les pages (logo, compte, recherche, burger), fil d'Ariane (`article-blagues-2026-mobile-ecran1`, `vannes-mobile-ecran1`), pied de page complet avec « Nos offres » et « Résilier ton contrat » (transparence, `article-blagues-2026-mobile-tranche10`), bouton de partage flottant sur l'article.
- Faiblesses : aucun CTA ni lien « Parcours » dans l'en-tête mobile ; l'icône compte est la seule entrée « utilisateur » alors qu'il n'y a plus de compte gratuit (pour un visiteur, elle ne mène qu'à la connexion, destination non capturée) ; menu burger ouvert non capturé donc non évalué ; pas de barre d'action collante sur l'article ; `/register` sans repères.

## Audit heuristique Nielsen sur le flux article → paiement

| H | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | PASS | « Étape 1 sur 2 », « Étape 2 : le paiement juste après » (`register-mobile-pleine`) |
| H2 Vocabulaire du persona | PASS | « Tu restes muet quand on te chambre ? » (`accueil-mobile-ecran1`) |
| H3 Contrôle et annulation | FAIL | `/register` : seule sortie « Retour à l'accueil », contexte perdu |
| H4 Cohérence | FAIL | 6 libellés d'achat différents (voir U4), 2 ordres de blocs de fin d'article |
| H5 Prévention d'erreurs | PASS partiel | mur annoncé avant atteinte (« 10 vannes accessibles »), formule et prix rappelés avant paiement ; erreurs Stripe non vues |
| H6 Reconnaissance plutôt que rappel | PASS | pastilles de situation, quiz intégré, prix répété à chaque étape |
| H7 Raccourcis experts | FAIL | pas de CTA dans l'en-tête mobile, pas de barre collante, Google en second sur `/register` |
| H8 Minimalisme | FAIL | 1re puce de `/abonnement` de 8 lignes ; 6 sorties en fin d'article |
| H9 Messages d'erreur | Non évalué | aucune capture d'erreur |
| H10 Aide dans le flux | PASS | « Pas encore sûr ? », FAQ sur `/abonnement`, mentions de rétractation |

## Cognitive walkthrough : frictions

- `[FRICTION H4]` : à l'étape 0, le first-time user lit 3 paragraphes avant la première vanne et ne voit aucun signal de produit. Solution : action 7 (/vannes) pour le même défaut côté catalogue, action 2 (repère dans l'en-tête).
- `[FRICTION H7]` : à l'étape 2, il aurait voulu « essayer le produit » dès qu'il a aimé la section Soirée (écran 4), mais le seul lien produit est 10 écrans plus bas. Solution : action 1.
- `[FRICTION H8]` : à l'étape 2, six liens concurrents en deux écrans, aucun ne nomme le parcours qui répond à « je reste muet ». Solution : action 3.
- `[FRICTION H7]` : à l'étape 3, il ne voit pas le bouton de paiement dans le premier écran, il doit scroller après une puce de 8 lignes. Solution : action 4.
- `[FRICTION H3]` : à l'étape 4, s'il hésite, la seule sortie est « Retour à l'accueil » ; il perd la formule choisie et le lien avec l'article. Solution : action 5.
- `[FRICTION H4]` : au mur des vannes, il comprend « 134 vannes de plus » mais pas ce que Premium change pour lui, et le seul bouton est « Voir l'offre ». Solution : action 6.

## Actions classées (valeur persona x impact conversion)

**1. Passerelle unique en milieu d'article vers l'étape 1 gratuite de Répartie**
- Page : `/blog/meilleures-blagues-droles-2026` (puis gabarit des autres articles à fort trafic, dont `phrases-droles-conversations`).
- Preuve : `article-blagues-2026-mobile-tranche02` (fin de la section Soirée, environ écran 4), `tranche08` (premier lien produit à l'écran 14) ; Umami : 385 sorties pour 397 entrées.
- Changement : une carte compacte après la section Soirée, un seul bouton qui mène directement à l'étape 1 de Répartie (lecture libre, aucun paiement, aucun compte), un texte dans la voix des étalons validés (calibrage avec Thomas avant rédaction, règle P0 s8), mesurée par un événement dédié. Rien d'autre n'est inséré mid-article (pas de répétition, pas de fenêtre).
- Réussite : part des visites de l'article qui changent de page de 3 % (12 sur 397) à au moins 8 % `[HYPOTHÈSE : cible à valider]` ; vues de `/parcours/repartie` depuis l'article suivies via l'événement ; observable sur 28 j.

**2. Entrée « produit » dans l'en-tête mobile des visiteurs**
- Page : en-tête global (toutes pages), mobile.
- Preuve : `article-blagues-2026-mobile-ecran1` (icônes seules) contre `article-blagues-2026-desktop-ecran1` (bouton « Commencer »).
- Changement : parité mobile du bouton déjà présent sur desktop, libellé et destination alignés sur lui ; pour un visiteur non connecté, la connexion passe dans le menu si elle n'y est pas déjà (à vérifier : capture du menu ouvert absente). Pas de bandeau collant, pas de pop-up.
- Réussite : clics en-tête mobile mesurés (événement à créer), `abonnement-vu` mobile en hausse sur 28 j.

**3. Un seul bloc de fin d'article, dans un ordre fixe**
- Page : tous les articles du blog ; preuve `article-blagues-2026-mobile-tranche08` et `tranche09`, `article-phrases-droles-mobile-tranche08` (ordre inversé).
- Changement : même ordre partout, en tête de fin d'article : le parcours correspondant à la situation de l'article (Répartie pour Yanis) avec « Lire la première étape gratuite » nommant ce parcours, puis le bloc Premium existant (texte validé conservé), puis FAQ et « À lire ensuite » après. Le lien secondaire du bloc Premium nomme un parcours au lieu de « un parcours ».
- Réussite : au plus 3 blocs d'action dans les 2 derniers écrans (aujourd'hui 6), `blog-sortie-clic` au-dessus de 10 sur 28 j.

**4. Bouton de paiement visible dès le premier écran de `/abonnement`**
- Preuve : `abonnement-mobile-ecran1` (aucun bouton), `abonnement-mobile-tranche01` (bouton à y 1033, après la puce de 8 lignes).
- Changement : barre d'action collante en bas tant que la carte Premium est à l'écran (même libellé que le bouton, même prix), et première puce resserrée en 2 lignes sans retirer d'information (détail des durées déplacé sous la puce, jamais supprimé, règle de non-suppression de Thomas).
- Réussite : rapport clics vers le paiement sur vues de `/abonnement` (semaine du 05/10 : 5 sur 15) en hausse sur 28 j, après correction de la mesure `abonnement-vu`.

**5. `/register` : sortie qui garde le contexte, Google en premier**
- Preuve : `register-mobile-pleine` (« Retour à l'accueil » seul, Google sous le formulaire).
- Changement : bouton Google au-dessus du formulaire e-mail ; lien « Retour à l'abonnement » à la place de « Retour à l'accueil » ; reprise de la formule choisie (mensuel ou annuel) dans le rappel. Option à faire évaluer par @fullstack : ouvrir le compte dans une fenêtre fermable (X, clic extérieur, Échap) avec en-tête et pied visibles, conforme à la préférence UX fondateur, si la reprise automatique du paiement le permet.
- Réussite : `inscription-envoi` sur `abonnement-clic` (aujourd'hui 3 sur 5, effectif trop faible) suivi sur 28 j ; zéro abandon dû à une impasse de navigation en test.

**6. Mur de la liste `/vannes` : une sortie douce et un bénéfice**
- Preuve : `vannes-mobile-tranche03` (« 134 vannes supplémentaires », bouton unique « Voir l'offre »).
- Changement : sous le bouton, le même lien que sur `/abonnement` (lire d'abord une étape, gratuit) et une phrase qui dit ce que Yanis gagne (parcours, exercice) en plus de la quantité ; le mur reste après les 10 vannes, sans nouvelle limite.
- Réussite : événement `mur-vu` suivi d'un clic vers une étape 1 ou vers `/abonnement` ; au moins 50 % des `mur-vu` aboutissent à un clic `[HYPOTHÈSE : cible à valider]` (6 sur 16 vont à `/abonnement` aujourd'hui).

**7. `/vannes` : une vanne visible dans le premier écran mobile**
- Preuve : `vannes-mobile-ecran1` (0 vanne ; 3 lignes de titre, paragraphe, 7 pastilles sur 3 rangées, encart d'achat).
- Changement : pastilles sur une rangée défilante, paragraphe réduit, encart « Aperçu gratuit » conservé (la limite reste annoncée) mais placé après la première vanne.
- Réussite : première vanne visible sans scroll sur 375x812 ; nouvelle capture à valider par @ux.

## Points d'attention et non retenus

- Non retenus (à cause d'un choix fondateur ou d'un dark pattern) : fenêtre de sortie, compteur d'urgence, compte gratuit, essai gratuit, réduction du prix ou de la limite 10/3/3, photo ou nom du fondateur, retrait de « 1 500+ ».
- Hors périmètre mais à noter : bloc « Prochainement / Abonnés / Je veux ça ! » (`accueil-mobile-tranche05`) présenté à des visiteurs qui ne sont pas abonnés ; la page `/parcours` met Machine à Café avant Répartie (`parcours-mobile-tranche01`) alors que le quiz intégré peut orienter.
- Manques de preuve à combler avant la prochaine passe : capture du menu burger ouvert, de l'étape 1 d'un parcours, du paiement Stripe (y compris erreurs) et du chemin annuel.

**Handoff → @orchestrator**
- Fichier : `/home/user/Marrant/docs/marrant/audit-conversion-s20/ux.md` ; verdict conversion UX 4/10, fuite principale = article n°1 (97 % de sorties sur place), pas le tunnel de paiement.
- Décisions : 7 actions classées, priorité 1 (passerelle mi-article vers l'étape 1 de Répartie), 2 (CTA en-tête mobile), 3 (bloc de fin d'article unique), aucune ne touche prix, chiffres, compte gratuit ni étalons validés.
- Attention : corriger la mesure `abonnement-vu` (@data-analyst) avant de fixer des cibles, tout texte nouveau passe par le calibrage d'étalons avec Thomas, captures Stripe/menu/étape 1 manquantes.
