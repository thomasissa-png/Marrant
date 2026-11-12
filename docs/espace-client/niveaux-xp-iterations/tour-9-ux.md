# Niveaux et XP, tour 9 (confirmation), relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v9)

> Relu : résumé, 3.0, 3.6, 4, section 5 en entier (5.1 à 5.6), 6, annexes A quinquies, A sexies et B ; les sections 1, 2, 3.1 à 3.5 comparées à la v8 lue au tour 8 (identiques). Pas de diff mécanique : comparaison section par section.
> Références : mon tour 8 (R1 à R7), `architecture-contenu-v16.md` l. 828 (porte d'« Écouter, repérer »).

## 1. Statut de mes corrections du tour 8

| # | Sujet | Statut | Preuve dans la v9 |
|---|---|---|---|
| R1 (bloquant) | Phrase de passage et deux caps | **OK** | 3.0, 5.4 et critère 17 : deux annonces indépendantes. « Nouveau cap : {nom}. » quand le cap affiché (total d'XP) monte ; « Un bonus s'ouvre dans la Bibliothèque : {titre}. » quand le déblocage atteint un seuil ; ensemble, une seule annonce avec les deux phrases ; un test par cas (cap affiché supérieur au déblocage : jamais de « bonus » sans bonus ; bonus sans nouveau cap : annoncé sans « Nouveau cap ») |
| R2 | Place du cap, « Aujourd'hui », voisinage | **OK** | 3.0 : carte compacte (série, nom du cap, cinq repères, empilés à 375 px) après l'étape en cours, jamais en tête ; « Tes bonus » juste après la carte, seulement quand un bonus est ouvert ; point 6 : intitulé de niveau 2 « Ton cap », 24 px d'espace, texte lu « Ton cap : Tu avances bien, cap 3 sur 5 » sans le mot « étape », test E5 au lecteur d'écran ; « Ton mois » est un bloc d'« Aujourd'hui » et y montre le cap ; carte « S'entraîner » d'« Aujourd'hui » = lien qui ne liste pas les bonus |
| R3 | 5 s contre 10 s | **OK** | 3.0 point 3 et critère 7 : phrases de cap et de bonus 10 secondes au moins ou jusqu'à fermeture, lien « Ouvrir » qui reste, bulle « +X XP » 5 secondes |
| R4 | Porte des bonus | **OK, un cas à écrire** | 5.4 : une seule porte par bonus ; pour la reco D, la Bibliothèque (avec « Écouter, repérer », architecture v16 l. 828) ; Q7 = B : « S'entraîner » ; Q7 = C : « Quoi répondre ». Reste : ce que la porte « Bibliothèque » exige (S1) |
| R5 | Transcription, mot « exclusif » | **OK** | 5.3 : sous-titres et transcription du passage cité, grille en texte, conditions de production ; critère 13 interdit « exclusif » et « réservé » en texte client |
| R6 | Barre à 375 px | **OK** | Annexe B point 9 : les cinq règles du défilement (indice de suite, entrée active visible, clavier et `aria-current`, libellés entiers à 200 %, mouvement réduit) à l'étalon E5 ; 5.4 note que « Plus » est hors écran |
| R7 | Annexe B, renvois | **OK** | Titre de l'annexe B, points 6, 7 et 9 mis à jour (v16, v17 en cours) |

## 2. Rien d'autre n'a bougé à tort ?

**Oui : rien n'a bougé à tort.** Tout écart de la v9 avec la v8 que j'ai relevé est annoncé dans l'annexe A sexies (R1 à R7, G1 à G6, BB1 et BB2) : annonces de 3.0 et 5.4, point 6 de 3.0, critères 7, 13 et 17, 5.3 (paragraphe « Limite de D », transcription, E4 clarifié), 5.4 (porte, deux annonces), Q7 (« quatre options »), Q8 A (sous-titre validé), @fullstack en section 6, annexe B. Les sections 1, 2, 3.1 à 3.5, 4 (décisions de Thomas), Q9 et Q10 sont identiques à la v8. Aucun seuil, nom, reco ni décision de Thomas n'a changé.

## 3. Notes (même grille)

| Critère | T6 | T7 | T8 | T9 | Justification courte |
|---|---|---|---|---|---|
| Lisibilité (3 secondes) | 9 | 9 | 9 | 9 | Inchangé ; « Ton cap : Tu avances bien, cap 3 sur 5 » se lit sans ambiguïté |
| Motivation sans pression | 9 | 8 | 9 | 9 | Annonces honnêtes (jamais « bonus » sans bonus), rien d'écrit avant le premier bonus |
| Affichage dans l'espace | 9 | 8 | 8 | 8 | Place du cap résolue ; mais la porte « Bibliothèque » n'a pas encore sa règle d'invisibilité avant ouverture (S1) |
| Noms au ton maison | 9 | 9 | 9 | 9 | Inchangé |
| Accessibilité | 10 | 9 | 9 | 10 | 10 secondes ou fermeture, transcription et sous-titres, voisinage testé au lecteur d'écran, règles du défilement |
| Cohérence avec l'architecture et les décisions | 9 | 8 | 8 | 9 | Renvois à jour (v16, v17 en cours) ; restent deux phrases à aligner (S2, S4) |
| Qualité des questions | 9 | 9 | 9 | 9 | Q7 avec la limite de D dite, Q8 A qui s'ajoute au sous-titre validé |

**Note globale : 9,0 / 10** (63 sur 70). T8 : 8,7.

## 4. Corrections nouvelles

### Bloquante (courte)

**S1. [BLOQUANT] Un bonus rangé dans la Bibliothèque ne doit être ni listé, ni cherchable, ni atteignable avant son ouverture ; le cap 5 n'a pas de porte écrite.**
Passages : 5.4 (« les décorticages sont rangés dans la Bibliothèque, avec “Écouter, repérer” ») ; 5.5 (« le bonus d'un cap ne s'ouvre que côté serveur ») ; 5.4 (« L'espace ne reparle pas de ce qui n'est pas ouvert ») ; Annexe B point 7.
Problème : la Bibliothèque est une liste de contenus en accès libre (décision de Thomas du 12/11). Si les bonus y sont ajoutés comme des fiches, ils apparaissent dans les listes, la recherche de l'en-tête et les favoris proposés pour tout le monde, y compris le cap 1 : soit ils sont lisibles (le déblocage n'existe plus), soit ils sont marqués fermés (cadenas ou « s'ouvre au cap N », ce que 5.4 interdit), soit leurs titres se voient à l'avance (Q9 A, surprise, contredite). 5.5 dit que l'ouverture est côté serveur mais ne dit rien des listes, de la recherche ni de l'adresse directe. Même cas que le repérage de l'humour noir (architecture v16, 3.12). Et la « coulisses de la maison » du cap 5 (fiche A) n'est pas un « Écouter, repérer » : 5.4 ne dit pas dans quel bloc elle se range.
Correction : (a) un bonus non ouvert pour cet abonné est **absent** de la liste de la Bibliothèque, de la recherche, des favoris proposés, de la rafale et de toute suggestion (rien d'écrit, pas de ligne grisée) ; (b) son adresse directe, ouverte par un abonné qui n'a pas atteint le cap, renvoie une page neutre « Cette page n'est pas disponible » (même réponse que pour une adresse inexistante), jamais « s'ouvre au cap N » ; (c) le bonus ouvert reste marqué « Bonus du cap N · {nom} » dans la liste, pour ne pas se confondre avec les 12 fiches V1 ; (d) la fiche « coulisses de la maison » (cap 5) a sa porte écrite : Bibliothèque, bloc « Vocabulaire et techniques » (même famille que « Comment c'est construit »), et les trois passages dans le bloc où vit « Écouter, repérer » ; (e) un test : un compte au cap 1 ne trouve aucun bonus dans la liste, la recherche ni les favoris, et une adresse directe renvoie la page neutre ; ajouter ce test aux critères 13 à 17 (critère 19) et à la liste @fullstack de la section 6.

### Non bloquantes (pour 10/10)

**S2. Section 6, @copywriter : « E4 en premier pour le passage du cap 2 ».** Contredit 5.3 (« l'E4 de l'architecture est l'une des 12 fiches V1, ce passage est en plus des 12 »). Écrire : « le passage du cap 2, en plus des 12, sert d'étalon à son tour et passe d'abord ».

**S3. « Plus » n'est pas la seule entrée hors écran.** 5.4 : « Plus (sixième entrée) est hors écran au premier affichage ». À 375 px, à 90 à 110 px par entrée, la quatrième entrée, « Bibliothèque », est elle aussi à la limite de l'écran (coupée par l'indice de suite). Écrire « Plus, et probablement la Bibliothèque » : les deux chemins hors barre (lien « Ouvrir », raccourci « Tes bonus » dans « Parcours », qui est la deuxième entrée, visible) restent donc indispensables ; c'est un argument de plus pour S1 (a).

**S4. Renvois résiduels à la v15.** 5.1 (« aucune des 163 fiches neuves de l'architecture (v15) »), 5.3 (« architecture v15 ») : la version courante est la v16 (v17 en cours). Mettre « v16 ». La rangée E9 de l'annexe A quinquies (« bonus dans “S'entraîner” ») est une trace historique corrigée par G1 de l'annexe A sexies : acceptable, la note de renvoi suffit.

**S5. Q8 A : sous-titre validé cité.** « …sous le sous-titre validé (“Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout.”), qui reste ». Je ne peux pas relire `abonnement-vente.ts` (l. 67 à 69) : [NON VÉRIFIÉ]. À contrôler avant de montrer la phrase à Thomas, car une citation inexacte d'un texte validé serait une invention.

## 5. Cap 1, une dernière fois

Parcours simulé de l'abonné qui stagne, avec la v9 : l'offre dit « à chaque cap franchi dans les parcours, un bonus en plus » (vrai) ; « Parcours » montre une carte « Ton cap : Tu t'échauffes, cap 1 sur 5 » après l'étape en cours, sans rubrique « Tes bonus » ni phrase d'attente ; la Bibliothèque ne lui montre aucun bonus (à condition de S1) ; la cloche, « Aujourd'hui » et « Ton mois » ne disent rien de ce qu'il n'a pas. Aucune privation vécue ; ce qu'il sait (quatre repères vides, un bonus par cap) est dit honnêtement.

## 6. Verdict

**Presque prêt : un bloquant court (S1), le reste de la précision.** R1 à R7 sont tous traités et rien n'a bougé à tort : la v9 est la v8 corrigée à l'endroit demandé. Avec S1 (ce que la porte « Bibliothèque » exige : bonus absents avant ouverture, page neutre, porte du cap 5, test) et S2 à S5 en une passe, la section 5 est **prête à être montrée à Thomas**.
