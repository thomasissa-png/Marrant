# Niveaux et XP, tour 8, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v8)

> Relu en entier ; attention portée à 3.0, 3.6, 4, 5 (5.1 à 5.6), 6, annexes A quinquies et B. Références : mon tour 7, mon tour 16 (carte du cap après l'étape en cours), `founder-preferences.md` l. 161 (Q3 = A) et l. 168.
> Limite : je compare à la v7 lue au tour 7 ; je n'ai pas de diff mécanique.

## 1. Statut de mes corrections du tour 7

| # | Sujet | Statut | Preuve dans la v8 |
|---|---|---|---|
| B1 (bloquant) | « à mesure que tu pratiques » | **OK** | Q8 A : « Premium ouvre tout Deviens Marrant. Et à chaque cap franchi dans les parcours, un bonus en plus. » ; 5.2 : « On n'écrit jamais “à mesure que tu pratiques” » ; 5.3 : « récompense la pratique » supprimé ; résumé et 5.1 : la rafale et les jeux n'ouvrent aucun bonus. Bonne surprise : « franchir un cap » est une tournure idiomatique, donc la phrase de l'offre se lit sans explication |
| B2 (bloquant) | Rubrique vide et phrase d'attente | **OK** | 5.4 : « La rubrique “Tes bonus” n'existe pas tant qu'aucun bonus n'est ouvert » ; phrase d'attente supprimée ; critère 14 |
| N3 | Place des bonus | **OK, avec une porte à préciser** | Bonus rangé dans « S'entraîner », « Tes bonus » en raccourci dans « Parcours », rien dans « Aujourd'hui », compté dans « Ton mois » comme une séance ; voir R2 et R4 |
| N4 | Phrase de passage | **OK, une incohérence de durée** | « dans S'entraîner », visible 10 secondes au moins ou jusqu'à fermeture, lien « Ouvrir » qui reste (5.4, critère 17) ; mais 3.0 point 3 et critère 7 disent encore 5 secondes (R3) |
| N5 | Cloche | **OK** | 5.4 : jamais de bonus dans la cloche, pas de pastille, pas d'e-mail ; critère 15 |
| N6 | Chiffres périmés | **OK** | 163 fiches, « architecture courante (v15, puis v16) » |
| N7 | Critères de la section 5 | **OK** | Critères 13 à 18 écrits (aucun « verrouillé », « cadenas », « débloquer » ; pas de rubrique avant le premier bonus ; cloche ; compte gonflé ; phrase de passage ; quatre bonus produits avant l'ouverture) |
| N8 | Cap qui peut baisser | **OK** | Q10 C : cap affiché sur le total (jamais de baisse), déblocage sur étapes et bonus ; critère 3 reformulé ; phrase d'explication « Ton cap compte tous les points gagnés depuis ton arrivée… ». Le nouveau barème n'est jamais sous l'ancien, donc le cap affiché ne recule pour personne |
| N9 | Calendrier de production | **OK** | Les quatre bonus produits avant l'ouverture (5.3, critère 18) ; plus de calendrier échelonné |
| N10 | Durée et C2 | **OK** | 5.3 : durée affichée, facultatif, hors promesse « 15 à 20 minutes par semaine » |
| N11 | Résumé | **OK** | Puce 4 du résumé : les bonus suivent les étapes de parcours, pas la rafale ni les jeux ; un abonné qui ne fait que la rafale ne voit jamais « Tes bonus » |

## 2. La barre à 375 px (note de la session)

La décision de Thomas (l. 161, Q3 = A) : barre de rubriques sous l'en-tête, **défilement au doigt sur téléphone**, 6 entrées au plus. C'est un [CHOIX UTILISATEUR] : **je retire mon option 3 du tour 16** ; ma recommandation d'un menu ne tient plus. Ce qui reste utile, à reporter dans l'architecture à l'étalon E5 : (a) un indice visible qu'il y a une suite (l'entrée suivante coupée d'environ 16 à 24 px, avec un léger fondu au bord) ; (b) l'entrée active ramenée dans la zone visible au chargement et à chaque changement de page ; (c) les six liens restent dans l'ordre de tabulation, le focus clavier fait défiler la rangée jusqu'à l'entrée, `aria-current="page"` sur l'entrée courante, nom de la région « Mon espace » ; (d) libellés entiers, jamais coupés, y compris à 200 % de texte, cibles de 44 px de haut ; (e) pas de défilement animé si l'abonné demande moins de mouvement. **Conséquence pour ce document** : sur un téléphone, « Plus » (qui porte « S'entraîner » et donc les bonus) est la sixième entrée, hors écran au premier affichage : les bonus doivent avoir d'autres chemins, et ils en ont deux (le lien « Ouvrir » de la phrase de passage, le raccourci « Tes bonus » dans « Parcours ») ; c'est une raison de plus de garder le lien « Ouvrir » jusqu'à fermeture (critère 17).

## 3. Notes (même grille)

| Critère | T5 | T6 | T7 | T8 | Justification courte |
|---|---|---|---|---|---|
| Lisibilité (3 secondes) | 9 | 9 | 9 | 9 | Phrase de l'offre claire, section 5 lisible, reco D et A en langage simple |
| Motivation sans pression | 9 | 9 | 8 | 9 | Plus de rubrique vide ni d'attente, plus de « pratiques » ; la reco D est la plus désirable ; reste le message faux des deux caps (R1) |
| Affichage dans l'espace | 9 | 9 | 8 | 8 | Place du cap dans « Parcours » non mise à jour (R2) ; « Aujourd'hui » contre « Ton mois » (R2) ; porte des bonus (R4) |
| Noms au ton maison | 9 | 9 | 9 | 9 | Inchangés ; « Bonus du cap 3 · Tu avances bien » et « coulisses de la maison » au cap 5 (« Tu connais la maison ») se répondent |
| Accessibilité | 9 | 10 | 9 | 9 | Pas de cadenas ; 5 secondes contre 10 (R3) ; transcription du passage de la reco D (R5) |
| Cohérence avec l'architecture et les décisions | 9 | 9 | 8 | 8 | Les cinq points du tour 7 sont levés ; restent trois renvois périmés et une porte divergente (R2, R4, R7) |
| Qualité des questions | 9 | 9 | 9 | 9 | Q7 à Q10 : quatre options pour Q7, Q10 C expliquée sans accuser |

**Note globale : 8,7 / 10** (61 sur 70). T7 : 8,6.

## 4. Corrections nouvelles

### Bloquante

**R1. [BLOQUANT] La phrase de passage dit « Un bonus s'ouvre » alors que, avec deux caps, un bonus peut ne pas s'ouvrir, ou s'ouvrir sans nouveau cap.**
Passages : 3.0 « Phrase de passage, une seule fois : “Nouveau cap : {nom}. Un bonus s'ouvre dans S'entraîner : {titre}.” » ; 5.4 « Au passage d'un cap » ; 5.5 et Q10 C (cap AFFICHÉ sur le total d'XP, DÉBLOCAGE sur les étapes et bonus de fin).
Problème : pour un compte ancien (XP gagné avant la correction), le cap affiché peut franchir un seuil alors que le cap de déblocage reste en dessous : la phrase annoncerait un bonus qui ne s'ouvre pas, ce que la règle « offre vraie » interdit. Dans l'autre sens, le déblocage peut franchir un seuil quand le cap affiché est déjà plus haut : un bonus s'ouvre sans qu'aucune phrase ne le dise. La phrase est écrite pour un seul cap.
Correction : deux événements indépendants. (a) Le cap affiché change : « Nouveau cap : {nom}. » (sans bonus). (b) Un bonus s'ouvre (cap de déblocage) : « Un bonus s'ouvre dans S'entraîner : {titre}. » ; si les deux arrivent ensemble (le cas courant), une seule annonce, les deux phrases à la suite. Même spécification d'accessibilité (poli, 10 secondes ou jusqu'à fermeture, lien « Ouvrir » qui reste). Test : un compte à cap affiché supérieur au déblocage ne reçoit jamais « Un bonus s'ouvre » sans bonus effectivement rangé dans « S'entraîner ».

### Non bloquantes

**R2. Place du cap dans « Parcours », « Aujourd'hui » et « Ton mois ».**
(a) 3.0 (« Place dans l'espace ») dit encore « dans « Parcours », après les étapes faites (jamais en tête… ) » et 5.4 « Tes bonus… après les étapes faites et le cap ». L'arbitrage de @ux du tour 16, adopté par la session : le cap et la série sur **une carte compacte placée après l'étape en cours, jamais en tête**. Écrire : « dans « Parcours », sur une carte compacte (série, nom du cap, cinq repères, empilés à 375 px) placée **après l'étape en cours** ; jamais en tête (l'action de la page est l'étape à reprendre) ; « Tes bonus » en raccourci juste après la carte ».
(b) **Voisinage** : la carte étant maintenant près de « Étape 3 sur 6 », la règle 6 de 3.0 (« jamais de compteur d'étapes à côté ») ne peut plus se tenir par la seule place. Écrire : la carte porte son propre intitulé de niveau 2 (« Ton cap »), est séparée du bloc de l'étape par un espace d'au moins 24 px et ne partage pas sa carte ; le texte lu est « Ton cap : Tu avances bien, cap 3 sur 5 » (le mot « étape » n'y figure pas) ; test E5 au lecteur d'écran : « Étape 3 sur 6 » puis « Ton cap… » ne se prennent pas pour deux comptes du même objet.
(c) « Rien dans « Aujourd'hui » (le cap n'y est pas, 3.0) » : l'architecture (v16 4.4) place « Ton mois » dans la page « Aujourd'hui » à partir de J25 et y met la série et le cap. Écrire : « le cap n'est pas dans l'accueil d'« Aujourd'hui » ; il figure dans « Ton mois », qui s'affiche à partir de J25 dans cette page ».
(d) La carte « S'entraîner » d'« Aujourd'hui » est un lien vers « S'entraîner » : écrire qu'elle ne liste pas les bonus (sinon « rien dans Aujourd'hui » est faux).

**R3. Durée d'annonce : 5 secondes contre 10.** 3.0 point 3 (« au moins 5 secondes ») et critère 7 (« 5 secondes au moins ») contredisent 5.4 et critère 17 (10 secondes ou jusqu'à fermeture, avec lien). Écrire : phrase de passage 10 secondes au moins ou jusqu'à fermeture ; bulle « +X XP » 5 secondes au moins ; mettre à jour le critère 7.

**R4. Porte des bonus.** 5.4 range les bonus dans « S'entraîner » « avec les 6 séances et les passages « Écouter, repérer » » ; l'architecture (v16 6.3) donne à « Écouter, repérer » la porte « Bibliothèque », et à « S'entraîner » les jeux, séances et missions. Deux portes pour une même fiche. Écrire : les bonus (y compris les trois passages de la reco D) ont **une seule** porte, « S'entraîner », marqués « Bonus du cap N · {nom} » ; ils ne sont pas les 12 « Écouter, repérer » de la Bibliothèque, qui gardent leur porte ; le reporter dans l'Annexe B (architecture 6.2 et 6.3, ligne « S'entraîner »).

**R5. Reco D : accessibilité du passage et mot « exclusif ».** Un bonus qui est un passage d'humoriste minuté suppose de la vidéo : sous-titres et **transcription du passage cité** (la citation courte et minutée, en texte) comme condition de production, la grille de 3 questions en texte. Et le mot « exclusif » (« décorticage exclusif ») reste interne : en texte client, un bonus est « en plus » (5.1), jamais « exclusif » ni « réservé » (il dirait que d'autres sont exclus). Ajouter à la liste du critère 13.

**R6. Barre à 375 px.** Voir section 2 : décision de Thomas acceptée ; reporter les cinq règles (indice de suite, entrée active visible, clavier, libellés entiers, mouvement réduit) dans l'architecture à l'étalon E5.

**R7. Annexe B et renvois périmés.** 3.0 : « l'architecture v14 la place (voir v14 pour son emplacement) » : la série a été déplacée en v15 et v16 (en tête de « Parcours » et dans « Ton mois », puis, selon l'arbitrage R2, sur la carte compacte) ; Annexe B point 6 (« L'architecture v14 place la série ») et l'intitulé de l'annexe (« v13 : points d'origine ; v14 : les traite ») : mettre à jour (v16 ; points 1, 5 et 6 faits, points 7 et 8 à vérifier dans la v17, point 9 à ajouter : carte compacte après l'étape en cours, voisinage, R4).

## 5. Ce qui est solide

- 5.1 : règle intangible, bonus neutre (« en plus »), cap qui ne baisse jamais, rafale et jeux n'ouvrent rien, dit en clair à Thomas.
- 5.2 : offre vraie : « Premium ouvre tout… Et à chaque cap franchi dans les parcours, un bonus en plus », avec la liste exacte des textes touchés et le go de Thomas pour chacun.
- 5.4 : rubrique absente avant le premier bonus, surprise sur le contenu et non sur l'existence, cloche exclue, phrase de passage avec le lieu, lien qui reste.
- 5.5 : déblocage sur étapes et bonus de fin, côté serveur, limite assumée (validation sur déclaration, environ 3 minutes pour les 25 étapes).
- Q7 à Q10 : options claires et recos argumentées ; Q10 C, cas limite dit honnêtement avec une phrase qui n'accuse pas.

## 6. Le cap 1, relu une dernière fois (abonné qui stagne)

Yanis valide l'étape 1 et ne fait plus que la rafale : « Parcours » montre sa carte (cap 1, un repère plein), aucune rubrique « Tes bonus », aucune phrase d'attente, aucune notification ; l'offre lue avant de payer lui a dit « dans les parcours » et non « à mesure que tu pratiques ». Il ne lui manque rien de ce que l'offre lui promet, et rien ne le lui rappelle. La seule trace des bonus qu'il voit est structurelle (quatre repères vides), et elle est déclarée honnêtement (5.4). Je ne vois plus de privation vécue.

## 7. Verdict

**Presque prêt : un bloquant de formulation (R1), le reste de la précision.** B1 et B2 sont levés, N3 à N11 aussi ; la place du cap dans « Parcours » (carte compacte après l'étape en cours) n'est pas encore écrite dans 3.0, 5.4 et l'Annexe B (R2, R7). Avec R1 corrigé et R2 à R5 passés en une relecture, la section 5 est prête à être montrée à Thomas.
