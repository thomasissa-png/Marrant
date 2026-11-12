# Niveaux et XP, tour 5, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v5)

> Relu en entier (résumé, 1 à 5, annexes A, A bis, B). Références : mon tour 4.
> Limites : je n'ai pas relu le code ni les seeds. Les calculs sont refaits à partir des totaux du document. Le recompte « 18 étapes au minimum » (3.1) est celui de @reviewer : j'ai refait l'arithmétique (800 + 800 + 475 = 2 075 en 16 étapes, plus 150 = 2 225), pas la recherche exhaustive sur les 25 `moduleXp` [NON VÉRIFIÉ par moi, voir M4 et le test demandé].

## 1. Statut de mes corrections du tour 4

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| N1 | Noms au masculin (bloquant) | **OK** | E1 « Tu avances bien », E2 « Tu es en bonne voie » ; test (5) étendu (« aucun accord de genre ni de nombre sur l'abonné ») et appliqué à tous les noms et libellés de chaque jeu ; « Tu es bien parti » en témoin non retenu. Les autres noms n'ont aucun participe accordé |
| N2 | Identifiant du conseil, unicité en base (bloquant) | **OK** | 2.5 points 2 à 4 : identifiant d'un conseil actif exigé, contrainte d'unicité en base, requêtes simultanées, plafond 10 × conseils actifs « pas ce qui a été lu » ; critère 1 avec test à 130 identifiants dont 10 invalides. Une précision : M6 |
| N3 | « Anti-doublon voulu » non sourcé | OK | [HYPOTHÈSE] dans 2.5 et dans le résumé, et dit à Thomas que l'unicité ne lui a pas été soumise |
| N4 | « Prouvé » trop fort | OK | « Indice, pas preuve » en 2.6 et Q6 ; anciens barèmes cités (+2 blague, +5 connexion, `joke_read` dans les tests, `moduleXp = 20`) ; vérification de l'historique avant toute liste. La rangée de l'annexe A du tour 3 garde « triche prouvée » : c'est la trace de la v4, acceptable |
| N5 | « 18 étapes » non établi | **OK** | Preuve en 3.1 (17 étapes plafonnent à 2 225), test sur les seeds demandé à @fullstack, E1 cap 5 réécrit (« au moins 18 étapes sur 25, quel que soit l'ordre »). Réserve : M4 |
| N6 | « Cap » libre, option sans mot | OK | Fait vérifié mot entier (seulement « frequency cap », « hard cap » en interne) ; Q3 C sans mot. Précision : M5 |
| N7 | Phrase fausse de la v13 | OK | Annexe B point 1 cite la ligne 146 de la v13, donne le texte de remplacement ; à porter dans la v14 (la v13 la contient encore) |
| N8 | Option « palier pour la règle C » | OK | Retirée ; la règle C dit « marche » |
| N9 | Q4 C contre le critère 2 | OK | « Fait échouer le test de 80 % » écrit dans l'option |

## 2. Notes (même grille)

| Critère | T1 | T2 | T3 | T4 | T5 | Justification courte |
|---|---|---|---|---|---|---|
| Lisibilité (3 secondes) | 7 | 8 | 9 | 9 | 9 | Nom d'abord, « sur 5 », cinq repères sur leur propre ligne ; trois options de mot clairement comparées |
| Motivation sans pression | 7 | 8 | 9 | 9 | 9 | Noms de chemin sans accord, rien d'affiché tant qu'aucun geste, jamais de baisse pour un abonné |
| Affichage dans l'espace | 6 | 8 | 8 | 8 | 9 | Place dite, voisinage traité, série signalée à l'architecture ; l'option sans mot a son défaut de voisinage dit (M5) |
| Noms au ton maison | 6 | 7 | 8 | 8 | 9 | Sans accord de genre, test de vérité établi par un recompte ; reste un « presque tout » de 72 % (M7) |
| Accessibilité | 5 | 9 | 9 | 9 | 9 | Inchangée, solide ; le texte lu pour l'option sans mot est à écrire (M5) |
| Cohérence avec l'architecture et les décisions | 6 | 9 | 7 | 8 | 9 | Les deux contradictions du tour 4 sont levées ; restent une référence sans définition (M2) et un état local à nommer (M1) |
| Qualité des questions | 7 | 8 | 8 | 9 | 9 | Q6 recentrée sur les comptes de test, trois options de mot, seuils de chaque option |

**Note globale : 9,0 / 10** (63 sur 70). T1 : 6,3 ; T2 : 8,1 ; T3 : 8,3 ; T4 : 8,6.

## 3. Corrections nouvelles

**Aucune bloquante.** Sept non bloquantes, dont M1 à M4 sont à traiter avant de montrer le document à Thomas.

**M1. Q6 B : « remettre à zéro » les comptes de test contredit les étapes validées qu'ils gardent.**
Passages : 2.6 « Seule remise à zéro proposée : les 3 comptes de test » ; Q6 B ; critère 3 ; la v4 disait « ramener l'XP à ce que les étapes et bonus justifient ».
Problème : mettre l'XP à 0 sans toucher aux validations d'étape (en base, une par étape et par abonné) laisse un compte au cap 1 avec des parcours terminés. Thomas, qui s'en sert pour tester, verrait un cap faux, et la ligne « dont X sur tes étapes et bonus » (3.0) serait absurde. « Zéro » n'est vrai que si le compte n'a aucune étape validée.
Correction : « ramener l'XP à la somme des étapes validées et des bonus de fin acquis » (zéro seulement s'il n'y en a aucune), pour les 3 comptes de test, avec l'accord de Thomas. Le critère 3 reprend la même formule.

**M2. « Écart nul » dans la phrase d'XP n'est plus défini.**
Passage : 3.0 « Le détail “dont X sur tes étapes et bonus de parcours” n'apparaît que pour un compte dont l'écart est nul ». La notion d'écart vivait dans l'audit de la v4, supprimé en v5 (2.6 ne la définit plus).
Correction : supprimer ce détail (recommandé : une ligne de moins, un calcul de moins à l'affichage, et « gagnés depuis ton arrivée » reste vrai pour tous) ou définir l'écart (XP actuel moins somme des validations et bonus) et dire où il se calcule. Alléger aussi le critère 11.

**M3. Recalcul unique des caps : premier affichage silencieux, et noms vrais pour qui ?**
Passages : 3.0 « Caps existants : recalculés une fois… vers le haut seulement » ; « Phrase de passage, une seule fois » ; critère 10 « événement cap atteint » ; 3.4 test (4).
Problème : le nouveau barème est toujours au moins égal à l'ancien (0/100/300/700/2 300 contre 0/100/500/1 500/5 000), donc le recalcul ne baisse personne, bien. Mais rien ne dit ce qu'il déclenche : « Nouveau cap : … » pour chaque abonné qui monte d'un coup, et un événement « cap atteint » pour chacun, qui fausserait la mesure de l'effectif de départ. Et pour un compte gonflé par l'API, le nom (« Tu connais la maison ») ne passe pas le test de vérité : le document l'accepte (2.6, « ne trompe que son propre écran ») sans le dire en 3.4.
Correction : une phrase en 3.0 : « le recalcul est silencieux : ni phrase de passage ni événement ; le premier affichage montre simplement le cap » ; et en 3.4 : « le test de vérité vaut pour un compte qui progresse par les étapes ; il ne vaut pas pour les comptes gonflés avant la correction, décision assumée (2.6) ».

**M4. Le seuil de 2 300 dépend de la publication de Storytelling, et le recompte est à consigner.**
Passages : 1.1 « Sans Storytelling (non publié) : 2 300 » ; 3.0 garde-fou ; 3.1 ; Q4 A ; section 5.
Problème : si Storytelling n'est pas publié à l'ouverture, 2 300 est 100 % du total (19 étapes) : la reco échoue au critère 2 et « 18 étapes sur 25 (72 %) » est faux. Le document le sait (le test échoue si un parcours est dépublié) mais laisse la reco sans variante, et l'état des interrupteurs reste à lire par @fullstack.
Correction : lire l'interrupteur avant de montrer le document à Thomas ; si Storytelling est dépublié, écrire la variante en une ligne (avec 2 300 XP en tout, un dernier seuil à 70 % donne 1 600) et dire que le « 18 au minimum » ne vaut que si les cinq parcours sont publiés. Sur le recompte : j'ai refait la somme de 17 étapes (2 225) et, à la main, deux autres sélections ; l'une dépend de deux étapes de Répartie et de Boulot à plus de 375 XP à deux. Seule la recherche exhaustive sur les 25 valeurs tranche ; le test sur les seeds demandé en 3.1 est donc le vrai garde-fou, à livrer avec la correction.

**M5. Option « sans mot » : texte lu et voisinage.**
Passages : 3.4 « Troisième option » ; Q3 C ; critère 7 (« cap 3 sur 5 »).
Problème : le critère 7 et `aria-valuetext` ne parlent que de « cap n sur 5 » ; sans nom commun, « 3 sur 5 » lu seul par un lecteur d'écran ne veut rien dire, et il se trouve près de « étape n sur 6 », risque de synonymes plus fort que pour « Ton cap » (3.0 point 6).
Correction : écrire pour l'option C : texte lu « Où tu en es : Tu avances bien, 3 sur 5 » ; intitulé « Où tu en es » toujours au-dessus, jamais adjacent à « étape n sur 6 » ; critères 6 et 7 écrits « {mot} n sur 5 (ou « n sur 5 » seul si l'option C) ».

**M6. Correction 2.5 : deux précisions.**
(a) « Rien n'est livré aujourd'hui, au développement avant l'ouverture » : la correction est une fermeture de route, sans lien avec l'ouverture de l'espace. Dire si elle peut être livrée seule et la première (recommandé : chaque semaine d'attente laisse la boucle ouverte aux abonnés actuels, peu nombreux mais réels). (b) Critère 1 : ajouter à l'essai le rejeu du même identifiant (même requête répétée) en plus des requêtes simultanées. Le résumé dit « refusera tout conseil qui n'existe pas » : écrire « qui n'est pas au catalogue », cohérent avec « conseil actif » en 2.5.

**M7. E2 cap 5 : « Tu as presque tout fait » à 72 %.**
Passages : 3.4 (E2 cap 5, « vrai si Q1 = B », 74 % du total, 72 % des étapes). Un quart reste à faire : « presque tout » dépasse le fait, c'est la faute que le test de vérité chasse. Remplacer par « Tu as fait la plus grande part » (vrai à 72 %), ou retirer E2 si Thomas n'en veut pas ; le dire en Q3 B.

## 4. Ce qui reste solide

- 1.1 : quatre sources, conseil du jour et conseil d'étape exclus, plafond 10 × conseils actifs, totaux 3 100 et 4 300, vitesses.
- 2.5 : serveur fixe le gain, identifiant actif exigé, unicité en base, hypothèse dite à Thomas.
- 2.6 : base qui ne garde que le total, indice et non preuve, aucun abonné touché par défaut.
- Noms sans accord, test de vérité (4) sourcé par un recompte, cap libre vérifié mot entier, trois options de mot honnêtes.
- Spécification d'accessibilité (3.0 et critère 7), critère 1 testable, Annexe B qui cite la ligne à corriger dans la v13.

## 5. Verdict

**Prêt à présenter après quatre précisions courtes** : l'état local des comptes de test (M1), la référence « écart » sans définition (M2), le premier affichage du recalcul (M3) et l'interrupteur de Storytelling (M4). Aucun bloquant : ma note passe de 8,6 à 9,0. M5 à M7 sont de la précision.
