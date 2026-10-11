# Étalons Parcours Boulot : itération 4, note @reviewer (s19, 10/10/2026)

Document noté : `docs/copy/etalons-parcours-boulot-s19.md` (377 lignes). Relus : ma note d'itération 3, les sources des conseils (`conseils-boulot-s19-v1.md`, `-v2.md`, `-v5.md` P2-bis, `-v6.md` T-b), `conseil-ps-boulot-s19-v2.md` et `-v3.md`, la spec s17 §1 (RC1 à RC12) et §3, `boulot-base-s19.json` (fiches et durées des vidéos citées), `parcours-reecriture-s17.json`, `parcours-seed.json` et `parcours-storytelling-s18.json` (réutilisations par `youtubeId`), `founder-preferences.md` (07/10 et 08/10), et le code de l'étape (`apps/web/src/config/textes/parcours.ts`, `parcours-step-card.tsx`). Comme demandé, je ne note ni le texte des 5 conseils validés ni l'emplacement `[EN COURS…]` du PS.

## Note : 9/10

**Résumé.** Les 10 corrections de l'itération 3 sont appliquées. Hamzawi est à l'étape 6 sans condition, partout (tableau, réponse type, §6, bilan, handoff). Le témoignage B est réécrit sans vanne citée. La date d'export, les comptes de phrases du quiz, la légende de VDB, le repli de l'étape 6, l'estimation de 1 000 mots et le « rien à décider » sont corrigés. L'historique est sorti du document. Le tableau des choix et « Je suis tes recos » sont alignés point par point (1 à 8, mêmes options, mêmes vidéos nommées), et la réponse type ne contient plus aucune condition.

J'ai recompté : `moduleDetail` 99 mots, longueurs et positions du quiz (B, D, A), titre A de 60 caractères, 8 + 4 = 12 vannes en ligne et 18 neuves (3, 2, 3, 3, 2, 5), soit 30. Faits vidéo conformes à la base : VDB 4 min 30 ; Croce « avion » 2 min 30, fiche « 10 vannes en 5 minutes » ; Guiz « fast-food » 4 min 30, jamais utilisée ; Rollman « relations sociales » 5 min 20, fiche « politesse, conventions, small talk » ; Hamzawi 4 min, fiche « lucidité et auto-dérision », titre « chronique France Inter » ; Vérino `PT7M30S` ; Fary `PT5M00S` avec « 8 minutes » dans la fiche. Réutilisations confirmées par `youtubeId`. L'affirmation « le bloc vidéo disparaît seul quand l'étape n'en a aucune » est vraie (`parcours-step-card.tsx` l. 338). « Anouk » n'apparaît dans aucun autre fichier du site. Côté charte, je n'ai trouvé aucun tiret cadratin ; « blague », « carnet » et « cours gratuit » n'apparaissent que dans des consignes internes.

Le 10 bloque sur un point : **le document désigne encore la v2 du PS comme le texte en relecture.** Or elle a échoué au tour 8, et le handoff s'appuie dessus pour l'import. Le reste relève de la justesse : une justification fausse au choix 8, une option 8b incomplète, la formule « B sauf étape 6 » qui a deux sens, et une explication du quiz qui contredit la scène.

**1 correction bloquante (1), 7 non bloquantes (2 à 8).**

## Vérification des 5 conseils (copie à l'identique)

| Étape | Source | Titre, catégorie, difficulté | contenu | exemple | exercice |
|---|---|---|---|---|---|
| 1 | v5, P2-bis (l. 30-41) | identiques | identique | identique, 2 lignes | identique (DÉFI TRACE) |
| 3 | v2 (l. 48-58) | identiques (« (conservé) » retiré) | identique | identique | identique (DÉFI CROISEMENT) |
| 4 | v1 (l. 48-58) | identiques | identique | identique | identique (DÉFI TRENTE SECONDES) |
| 5 | v1 (l. 66-77) | identiques | identique | identique, 2 lignes | identique (DÉFI DEUX PHRASES) |
| 6 | v6, T-b (l. 28-41) | identiques | identique | identique (humour 16 mots, total 107) | identique (DÉFI SOIXANTE SECONDES) |

Le DÉFI TRACE du §3 (l. 162) est mot pour mot celui du §1 (l. 70). Aucun écart.

---

## Correction bloquante

**1. Le PS de l'étape 2 renvoie à la v2, qui a échoué à l'aveugle, et le handoff dit d'importer depuis ce fichier.**

*Le constat.* `conseil-ps-boulot-s19-v3.md`, l. 3 : « Après le tour 8 (v2 « < » chez A et B : chute « CDI du ficus » trop proche de E3 et prévisible…) ». La v2 a donc été jugée sous la barre au tour 8. C'est une v3 (ou une version suivante) qui repasse l'aveugle. Le document, lui, dit encore :
- l. 57 et l. 103 : « `[EN COURS : relecture à l'aveugle, tour 8]` » et « source `docs/copy/conseil-ps-boulot-s19-v2.md` » ;
- l. 366, handoff à @fullstack, point (2) : « remplacer le conseil de l'étape 2 […] par la version corrigée (texte du §1, source `conseil-ps-boulot-s19-v2.md`) » ;
- l. 368 : « `conseil-ps-boulot-s19-v2.md` (version corrigée du PS, en relecture à l'aveugle au tour 8) ».

*Pourquoi c'est bloquant.* Je ne pénalise pas l'emplacement `[EN COURS…]`. Le problème, c'est une consigne d'import qui pointe vers un texte jugé sous la barre. C'est exactement le cas que vise la règle d'or (P0 s18 : « jamais remettre en ligne un contenu sous la barre »). Le handoff dit aussi « texte du §1 », mais deux sources contradictoires dans une consigne d'import font courir ce risque, et la correction coûte trois mots.

*Correction.*
- l. 57 : « `[EN COURS : relecture à l'aveugle de la version qui suit l'échec de la v2 au tour 8]` ».
- l. 103 : remplacer « source `docs/copy/conseil-ps-boulot-s19-v2.md` » par « source : le fichier de la version qui passe, renseigné par la session avec le texte (la v2 a échoué au tour 8) », et mettre le même `[EN COURS…]` qu'à la l. 57.
- l. 366, point (2) : « (texte du §1, inséré après le passage à l'aveugle ; jamais depuis `conseil-ps-boulot-s19-v2.md`, jugée sous la barre au tour 8) ».
- l. 368 : « `conseil-ps-boulot-s19-v2.md` (jugée sous la barre au tour 8) et `-v3.md` (en relecture) ».

---

## Corrections non bloquantes (nécessaires pour le 10)

**2. Liste des dépendances au texte du PS incomplète (l. 105).** Le document ne demande de re-contrôler que deux endroits : la ligne 2 du §7 et la phrase de la description B. Or le ressort du PS change en ce moment, et sept autres passages s'appuient sur le texte actuel :
- l. 20 (choix 7, « Ce que ça change ») : « écrite pour qu'elle puisse s'exercer sans rien envoyer » ;
- l. 117 (description B) : « dans un mail » ; l. 119 et l. 122 (témoignage A) : « un PS d'une ligne dans un mail » ;
- l. 270 (brief des vannes neuves de l'étape 2) : « un message beaucoup trop sérieux pour son sujet (ressort du PS) » ;
- l. 288 (§6, étape 2) : Croce justifié par « le même ressort qu'un PS » ;
- l. 327 et l. 338 (garde-fou) : « règle de la capture d'écran, du conseil de l'étape 2 » ;
- l. 336 : « aucun envoi exigé à l'étape 2 ».

Ces passages tiennent avec la v3 (sérieux de compte rendu, capture d'écran, PS gardé en brouillon). Rien ne garantit qu'ils tiendront avec la version qui passera. Correction : à la l. 105, remplacer « Deux dépendances à re-contrôler » par la liste des neuf emplacements ci-dessus (les deux déjà cités plus ces sept). La session les relit en insérant le texte.

**3. Choix 8, l. 301 : la justification est fausse.** « La promesse de 15 minutes compte la lecture, la vidéo obligatoire et le quiz (signalement 7) ». Le signalement 7 ne compte aucune vidéo (« 10 à 12 minutes hors vidéos »). Le code non plus : `parcours.ts` l. 52 dit « la promesse « 15 à 20 min/semaine » vaut sans les vidéos », et l. 43 affiche « Environ 15 min, hors vidéos ». Correction : « La durée affichée (« Environ 15 min, hors vidéos ») ne compte aucune vidéo, ni la première ni la seconde (signalement 7) : un plafond ne change rien à la promesse. » Cela renforce la reco a. La raison de l'écart pour Rollman (l. 291 et l. 34) devient alors : « la durée affichée ne compte pas les vidéos ». C'est plus solide que « un plafond que la lectrice ne voit pas ».

**4. Option 8b incomplète, et 5A avec 8a contradictoires.**
- l. 21 et l. 301 : l'option b plafonne « les facultatives » et annonce « 5 extraits ». Elle ne dit pas ce que devient Rollman (première vidéo de l'étape 5, 5 min 20), alors que la spec RC4 plafonne justement la vidéo obligatoire. Correction : « b : plafond de 5 min pour toutes les vidéos, donc 6 extraits à découper (les 5 facultatives et Rollman à l'étape 5) ». Ou bien, si Rollman reste entière en b, le dire.
- La colonne A du §6 garde deux extraits `[À MINUTER]` (Haroun, Rollman « enterrements »). Or 8a dit « aucune vidéo découpée ». Correction, l. 34 : « 8. **Le plafond des vidéos** : a, aucune vidéo découpée (avec 5B ; avec 5A, les deux extraits de la spec restent à minuter) ».

**5. « B sauf étape X » a deux sens à l'étape 6, et la règle de sortie peut produire ce que le document déconseille.**
- l. 31 : « B sauf étape X » veut dire « la vidéo de la spec à l'étape X ». À l'étape 6, c'est donc Rollman « Les enterrements de vie » (6 min 40, extrait à minuter, en conflit avec 8a). Mais l. 294 donne la même formule pour « étape 6 sans vidéo ». Thomas ne peut pas savoir ce qu'il obtient. Correction, l. 294 : « Tu peux la choisir avec « B, étape 6 sans vidéo ». « B sauf étape 6 » veut dire Rollman, comme dans la spec. »
- l. 7 (règle de sortie) : si Hamzawi ne tient pas au visionnage, l'étape 6 se retrouve sans vidéo. Si Croce, Guiz ou Rollman ne tiennent pas, l'étape 2, 4 ou 5 ne garde que sa vidéo de plus de 5 minutes. Le document refuse le premier cas au nom de RC4 (l. 294) mais l'accepte en silence ici. Correction, l. 7 : ajouter « Si c'est la seule vidéo de l'étape 6, l'étape reste sans vidéo (le bloc disparaît, vérifié dans le code) ; si c'est la première vidéo d'une autre étape, la vidéo de la spec (§6, colonne A) reprend sa place. » Thomas sait alors ce que donne le pire cas.

**6. Quiz, question 1 : l'explication pose une règle que la scène enfreint.** L. 175 : « Elle dit ce que tu vois, mot pour mot, et garde le chiffre pour la seconde phrase. » Or la première phrase de la scène (l. 151) contient un chiffre : « Un carton plié en quatre cale un pied de la table. » Et le conseil ne réserve pas les chiffres à la seconde phrase : il y réserve « le détail que cette trace laisse supposer ». Une lectrice attentive voit la contradiction dans la vitrine. Correction : « …et garde pour la seconde ce que la trace laisse supposer. » Cela reste 2 phrases après « La B. », sans aucun mot de la liste interdite. L'explication de la D (« saute tout de suite à la durée ») reste juste : « depuis des mois » est supposé, pas vu.

**7. Choix 7 : l'option « Ne pas la valider » n'a pas de conséquence écrite (l. 20, l. 105).** Le choix utilisateur du 08/10 (« tout ce qui est sous la barre est corrigé jusqu'à passer ») exclut de garder le PS en ligne. Il exclut aussi de laisser l'étape 2 sans conseil. Correction, colonne Options : « Valider la version corrigée / Ne pas la valider : tu dis ce qui ne va pas, le texte repart en réécriture puis à l'aveugle, et l'étape 2 attend ».

**8. Précisions et traces.**
- l. 362 : « (itération 3) » est un numéro de travail. Remplacer par « (version remise à Thomas) ».
- l. 283 : « Trois remplaçantes reposent sur une fiche (Croce, Guiz, Rollman), plus Hamzawi ». En réalité, les cinq sont jugées sur leur fiche. Correction : « Les cinq remplaçantes sont jugées sur leur fiche ; pour Vérino, la durée a aussi été relue sur YouTube, pour Hamzawi l'existence et l'intégration. »
- l. 261 : « (Storytelling) » sans numéro, alors que toutes les autres vannes portent leur étape. La vanne « Nicolas » est à l'étape 6 (`parcours-storytelling-s18.json` l. 519) : écrire « (Storytelling 6) ».
- l. 374-377 : supprimer les lignes vides de fin de fichier.

---

## Ce qui a été vérifié et est exact

- Les 5 conseils sont identiques à leurs sources (tableau ci-dessus).
- Étape 1 : `moduleDetail` 99 mots (recompté un à un) ; la scène suit le défi (trois traces, deux phrases au présent, une durée, aucune personne). Quiz : positions B, D, A ; longueurs Q1 12/11/9/10, Q2 12/13/11/12, Q3 12/11/11/13 ; la bonne réponse n'est jamais la plus longue ni la plus courte ; aucun mot plein de la question n'est repris ; le nombre de phrases annoncé pour chaque explication (2, 3, 2) est exact.
- Spec : XP, `dayNumber` 3, 3 questions (4 à la dernière), RC8 (aperçu visiteur), RC9 (« Imagine… », tutoiement, « vanne ») ; les écarts (Rollman à 5 min 20 en 8a, doublons de vannes et de vidéos) sont signalés et justifiés.
- Décisions acquises (l. 4) : aucune n'est re-proposée. Les choix utilisateur du 07/10 et du 08/10 sont respectés (relecture à l'aveugle pour tout texte neuf, règle d'or), à la correction 1 près.
- Charte : aucun tiret cadratin, aucun prénom de persona affiché (« Sophie » ne figure que dans le champ interne `persona`), aucune cible humaine dans les textes du site, « tes notes » partout.

## Pour l'itération 5

Appliquer la correction 1 (trois mots, mais P0), puis les corrections 2 à 8. Toutes sont des retouches locales : aucune ne change une reco, et aucune ne touche un texte validé à l'aveugle. Avec ces corrections, le document est à 10. Une fois le PS validé, la session n'a plus qu'à insérer son texte et à relire les neuf emplacements de la correction 2.
