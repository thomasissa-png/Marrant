# Relecture à l'aveugle v4 : onboarding Premium E0 / E1 / E2 (@reviewer, 07/11/2026)

Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (v4). Référentiels : `docs/copy/ton-alex.md`, `docs/founder-preferences.md` l. 151 à 156, `docs/legal/onboarding-e1-resilies-s23.md`. Faits vérifiés dans `apps/web/src`. Revues précédentes non lues. Transparence : le journal v3.1 → v4 en fin de fichier a été parcouru dans la même lecture que le texte (fichier lu d'un bloc) ; il n'a pas servi à noter.

## Notes

| # | Critère | Note | Évidence |
|---|---|---|---|
| 1 | Demande du fondateur tenue | 9 | E0 = liste généraliste de ce que Premium ouvre (contenus, parcours, carnet, exercices, favoris, progression, lettre, question, rappel), une ligne « Par où commencer » neutre. E1 = sept portes d'entrée du site, le carnet n'en est qu'une, conditionnelle. « On fait que ça ? » ne peut plus être dit. |
| 2 | Exactitude des éléments listés | 9 | Tout existe et est bien Premium : filtres conseils/vidéos « PREMIUM uniquement » (`conseils-list.tsx:194`, `videos-grid.tsx:196`), filtres vannes (`vannes/page.tsx:59`), limites gratuites (`premium.ts:110-115`), tableau Gratuit/Premium (`abonnement-vente.ts:124-133`), rappel visible pour Premium seulement et décoché par défaut (`rappel-parcours-toggle.tsx:27,76`), lettre du jeudi et arrêt en un clic (`lettre-hebdo-s21.ts:43,67`), question à l'équipe Premium (`email.ts:45`). E1 : défi des conseils (`conseils/page.tsx:98`), stand-up français décortiqué (`videos/page.tsx:94`), glossaire avec punchline/timing/callback (`glossaire/page.tsx:28`), titre du quiz (`quiz-humour/page.tsx:33`). Aucun chiffre en dur. Retenue : « Les exercices des fiches » est un mot du site que l'abonné de J0 ne connaît pas encore. |
| 3 | Ton d'Alex, tiret cadratin, émoji | 8 | Zéro tiret cadratin ni demi-cadratin, zéro émoji (Grep). E1 et E2 sonnent juste. E0 se lit comme une fiche produit : « sans limite » trois fois, « filtres » trois fois dont deux « avec leurs filtres » (de qui ?), même moule « X : Y, sans limite, avec Z » sur trois lignes de suite. « On lit tout » en E0 puis en E1. Virgule manquante : « chaque mois des situations ». |
| 4 | Lisibilité mobile | 7 | E0 : 11 puces de 70 à 110 signes, soit 2 à 3 lignes chacune sur un écran de 375 px (environ 40 signes par ligne), plus « Par où commencer » avec `{listeParcours}` rendu avec les rythmes (5 parcours avec Storytelling et Boulot : environ 170 signes, 4 à 5 lignes). Total estimé 30 à 35 lignes avant « Ton abonnement Premium est activé » : près de deux écrans, pas « à peu près un ». La note de longueur du fichier (« une ligne ou deux ») est optimiste. Listes E1 courtes et scannables. |
| 5 | Cohérence E0/E1 sans redite lourde | 8 | E1 reprend 5 des 7 entrées d'E0 cinq jours après (vannes, conseils, vidéos, parcours, carnet) ; acceptable parce que l'angle change (ce qu'on y trouve, pas ce qui est débloqué) et qu'E1 touche aussi qui n'a pas lu E0. Défaut réel : version PARCOURS, la ligne « Ta prochaine étape » est placée « juste avant la liste », donc entre « voici ce qu’on fait sur le site : » et la première puce ; le deux-points annonce une liste et tombe sur autre chose. |
| 6 | Cadre légal | 10 | Bloc contractuel identique mot pour mot à `paiement.ts:279-291` et 295-299 (bouton « Résilier ton contrat » = `compte.ts:89`). Phrase 5 C en mensuel seulement, aucune phrase en annuel (avis @legal b). Phrases de tête E1 exactes (générale et PARCOURS). Aucun prix, lien « rester », urgence, mention de résiliation en E1 ; objet neutre ; E2 non envoyé aux résiliés ; pied d'arrêt + `List-Unsubscribe` ; `?src=` sans identifiant. Dépendances @fullstack (C8, `finAcces` avec `cancel_at`) bien listées. |

**Note globale : 8,5 / 10. Sous la barre (9). NO-GO en l'état**, mais deux corrections suffisent.

## Corrections OBLIGATOIRES (texte exact)

**O1. E0 : resserrer la liste (mobile, ton, redite).** Remplacer les lignes « Ce qui est à toi dès maintenant : » jusqu'à « - Le rappel de parcours : … » par :

```
- Vannes, conseils et vidéos : tout le catalogue, sans limite, et les filtres pour trouver vite ce qui colle à ta situation.
- Les parcours : les {N}, en entier, de la première à la dernière étape.
[si carnet] - Le carnet de répartie : chaque mois, des situations et leurs répliques, carnets passés compris.
- Les exercices sur les fiches des vannes, conseils et vidéos : de quoi t’entraîner, pas seulement lire.
- Tes favoris, ta progression et ta série : ce qui te plaît sous la main, et où tu en es.
[si état recoit] - La lettre du jeudi : chaque semaine par e-mail, un clic pour l’arrêter.
[si question] - « Ta question à l’équipe » : écris-nous depuis ton profil, on te répond.
- Le rappel de parcours : un e-mail pour ne pas perdre le fil, à activer depuis ton profil.
```

Même contenu (rien n'est retiré), 8 puces au plus au lieu de 11, « sans limite » et « filtres » une seule fois, plus de « on lit tout » en double avec E1. La première ligne « Salut {prénom}, voici tout ce que Premium t’ouvre, et par où commencer. » sert d'en-tête : la ligne « Ce qui est à toi dès maintenant : » saute. Mettre à jour la note « Longueur » (8 puces maximum, 6 sans carnet, lettre ni question) et le tableau de vérification (lignes fusionnées). Faits inchangés : mêmes sources que le tableau actuel. Si « on te répond » engage un délai que l'équipe ne veut pas porter, garder « on lit tout » ici et l'enlever d'E1 (« Réponds à cet e-mail, on lit chaque message. »).

**O2. E1 version PARCOURS : placer la ligne d'étape avant le paragraphe d'invitation, pas entre le deux-points et la liste.** Remplacer le bloc de la version PARCOURS par :

```
Salut {prénom},
[si résiliation programmée] Ton accès reste ouvert jusqu’au {dateLongue(finAcces)} : voici où tu en es.

Ta prochaine étape : « {parcoursTitre} », étape {etapeNumero} sur {weeks}, {etapeTitre}.

Une question, un doute, un truc qui manque ? Réponds à cet e-mail, on lit tout. Et si tu veux un repère, voici ce qu’on fait sur le site :
[liste identique]

Reprendre mon parcours : {lienEtape}
```

La phrase de tête « voici où tu en es » est alors suivie de l'endroit où il en est, et le deux-points d'avant la liste annonce bien la liste. La virgule devant `{etapeTitre}` évite deux deux-points dans la même phrase ; replis inchangés (sans titre d'étape, la phrase s'arrête après « sur {weeks} »).

## Corrections souhaitables (une ligne chacune)

- E0 « Par où commencer » : rendre `{listeParcours}` sans les rythmes (noms seuls), sinon la ligne fait 4 à 5 lignes sur mobile à 5 parcours.
- E0 : vérifier au rendu réel (client mail iOS/Android, 375 px) que liste + « Par où commencer » tiennent environ un écran après O1, et le noter dans le fichier.
- E1 : « Parcours : {N} parcours » répète le mot ; « Parcours : {N} au choix, une étape par semaine, pour progresser pas à pas. »
- E1 : « en accès libre » deux fois de suite (glossaire, quiz) ; une fois suffit, ou aucune (l'abonné a tout).
- E1 générale aux résiliés : « voici par où commencer. » enchaîne sur une question, pas sur un point de départ ; acceptable (texte légal figé), à surveiller si @legal rouvre la phrase.
- E0 : la lettre n'apparaît pas pour un abonné en état « arretee » ; une ligne « à activer depuis ton profil » serait vraie (`BIENVENUE_PREMIUM.lettre`), à trancher par Thomas.

## Recommandation

NO-GO à 8,5. Relancer @copywriter sur O1 et O2 seulement ; la version corrigée repasse une relecture à l'aveugle (règle P0 s18). Cadre légal et exactitude : rien à reprendre.

---

## Contrôle v4.1 (07/11/2026, @reviewer, contrôle ciblé)

Texte contrôlé : `docs/copy/onboarding-premium-s23-emails.md` v4.1 (non modifié). Code relu : `apps/web/src`. Cadre : `docs/legal/onboarding-e1-resilies-s23.md`, `docs/founder-preferences.md` l. 156.

### Gates du contrôle

| # | Point | Verdict | Évidence |
|---|---|---|---|
| 1 | O1 appliquée, écarts de mots acceptables | FAIL (un mot) | Liste de 11 à 8 puces, « sans limite » et « filtres » une fois, « on lit tout » plus en double. Écart C1 (« tout » au lieu de « tout le catalogue ») : meilleur. Écart C2 : « sur chaque vanne, conseil et vidéo » affirme plus que le code (voir 3). Le décompte « 5 sans carnet, lettre ni question » du fichier est juste (mon « 6 » de la v4 était faux). |
| 2 | O2 appliquée, écart C11 acceptable | PASS | Ligne d'étape juste après la phrase de tête, avant l'invitation ; un seul deux-points ; la phrase « voici où tu en es » est suivie de l'endroit où il en est. La tournure du panel se lit mieux que la mienne. |
| 3 | C2 dans le code | FAIL | Trois types d'exercice existent (`abonnement-accroche.ts:23-25`) et l'abonné les voit dans les listes (`conseils-list.tsx:323-327`, `videos-grid.tsx:316-323`, filtrage `champs-premium.ts`). Mais « chaque » n'est pas tenu : sur une page de vanne, le bloc n'existe que si `howToApply` est rempli (`vannes/[slug]/page.tsx:271`), et le complément IA des décryptages manquants est coupé par défaut (`startup-tasks.ts:653-657`) ; sur les pages d'un conseil et d'une vidéo, `BlocExercice` est appelé sans `exercice` (`conseils/[slug]/page.tsx:228-232`, `videos/[slug]/page.tsx:218-222`) et ne rend rien pour un abonné (`bloc-exercice.tsx:39`). Un abonné qui ouvre une vidéo après « sur chaque vidéo » n'y trouve aucun exercice. |
| 4 | C4 dans le code | PASS | `recoit` = « Premium sans arrêt explicite ni opposition » (`lettre-hebdo-s21.ts:37`), texte du retour de paiement « Chaque jeudi, la lettre de la semaine arrive dans ta boîte » (l. 43) : il la reçoit déjà, « si tu la veux » était faux. |
| 5 | C7 dans le cadre @legal | PASS | Le cadre interdit mention de résiliation, prix, remise, lien abonnement ou « rester », urgence (§ « Ton et contenu ») ; retirer « en accès libre » n'ajoute rien de cela et E1 n'affirme plus rien sur gratuit ou payant. Confirmation @legal finale déjà notée dans le fichier. |
| 6 | « on te répond » (Ta question à l'équipe) | PASS | Engagement déjà publié : « On te répond à l'adresse e-mail de ton compte, en général sous 1 à 2 jours ouvrés. » (`config/textes/question-equipe-s22.ts:48`), même délai dans la lettre (`lettre-hebdo-s21.ts:106`). E0 ne promet rien de plus (aucun délai). Le point « engagement à valider » (l. 79 et 209 du fichier) peut être fermé. |
| 7 | Longueur d'E0 avant le bloc contractuel | PASS avec réserve | Décompte à 38 signes par ligne, coupure aux mots, prénom de 6 lettres, 5 parcours publiés (`parcours-publication.ts:12,25`) : en-tête 2 lignes, puces 4+2+3+3+3+2+3+3 = 23 lignes, « Par où commencer » 5 lignes (URL comprise), 3 lignes vides : **33 lignes** dans le cas le plus long, **25 lignes** sans carnet, lettre ni question. [HYPOTHÈSE : 25 à 28 lignes visibles par écran de client mail à 375 px, non mesuré] : un écran à un écran et quart. La note « chacune sur 2 à 3 lignes » est inexacte (la première puce fait 4 lignes). |
| 8 | Zéro tiret cadratin | PASS | Grep « — » et « – » sur le fichier : 0. |
| 9 | Bloc contractuel intact | PASS | Identique mot pour mot à `config/textes/paiement.ts:279-291` et 295-299 ; phrase 5 C seulement `[si mensuel]` ; « Tout est ouvert. Pour démarrer… » (l. 293) retiré comme prévu. |
| 10 | Demande du fondateur | PASS | E0 = liste généraliste de ce que Premium ouvre (contenus, parcours, carnet, exercices, favoris, progression, lettre, question, rappel). E1 (J5) = sept portes du site + ligne profil (C6), le carnet n'en est qu'une, conditionnelle ; aucune fiche, aucun contenu unique mis en avant (`founder-preferences.md` l. 156). |

### Correction OBLIGATOIRE restante (texte exact)

**O3. E0, puce des exercices.** Remplacer :
`- Les exercices sur chaque vanne, conseil et vidéo : de quoi t’entraîner, pas seulement lire.`
par :
`- Les exercices des vannes, conseils et vidéos : de quoi t’entraîner, pas seulement lire.`
Même sens que C2 (aucun mot interne), sans « chaque » que le code ne tient pas ; la puce passe de 3 à 2 lignes. Mettre à jour la ligne du tableau (« Exercices sur chaque vanne… ») et le journal (« C2 : appliqué, “chaque” retiré après contrôle v4.1 »).

### Corrections souhaitables (documentation, pas de texte client)

- Note « Longueur » (l. 62), remplacer par : `Longueur : 8 puces maximum (5 sans carnet, lettre ni question), 2 à 4 lignes chacune à 375 px ; avant le bloc contractuel, 25 à 33 lignes rendues (décompte à 38 signes par ligne, 5 parcours publiés). [À vérifier au rendu réel iOS/Android à 375 px.]`
- Fermer le point « on te répond » (l. 79 et 209) : `« on te répond » : engagement déjà publié (question-equipe-s22.ts:48, « en général sous 1 à 2 jours ouvrés ») ; E0 n'ajoute aucun délai.`

### Hors e-mails, à signaler (@fullstack, P0 produit)

Pages d'un conseil et d'une vidéo : un abonné Premium ne voit ni l'exercice ni les points clés (`BlocExercice` sans `exercice`, `conseils/[slug]/page.tsx:228-232`, `videos/[slug]/page.tsx:218-222`, `bloc-exercice.tsx:39`). Or le bouton « Essayer ce conseil » / « Décrypter cette vidéo » fait payer puis ramène sur cette même page (`returnTo`). Avantage vendu (« Exercices des fiches », `abonnement-vente.ts:130`) absent à l'endroit où il est promis. Indépendant de la v4.1, mais à corriger avant l'envoi d'E0.

### Notes v4.1

| Critère | v4 | v4.1 |
|---|---|---|
| Demande du fondateur | 9 | 9,5 |
| Exactitude | 9 | 8 (« chaque ») |
| Ton, cadratin, émoji | 8 | 9 |
| Lisibilité mobile | 7 | 8,5 |
| Cohérence E0/E1 | 8 | 9 |
| Cadre légal | 10 | 10 |

**Note v4.1 : 8,8 / 10. NO-GO en l'état** pour présentation au fondateur, pour un seul mot. **Après O3 : 9,2 / 10, GO** pour présentation à Thomas : O3 retire un mot sans rien ajouter, son contrôle (Grep « chaque vanne » = 0 dans le fichier) vaut relecture ciblée de la ligne corrigée (règle P0 s18). Restent hors note : avis @legal final, fiche conseil/vidéo (@fullstack) avant tout envoi.
