# Annexe du tour 12 : retouches, mesure du diff, vérifications

Périmètre : 7 blocs à reprendre (B3, B4+B5, B8, B9, B10, B12, B13). Les 10 blocs validés (B1, B2, B6, B7, B11, B14, B15, B16, B17, B18) sont recopiés sans une virgule de changement dans `textes-finaux.md`. Critère unique : l'envie de payer.

## 1. Retouches, bloc par bloc

| Bloc | Notes du tour précédent | Passage retouché (et lui seul) | Raison |
|---|---|---|---|
| B12 | 9, 9, 9 | Ligne Premium : l'étape payante citée dépend du profil (table ci-dessous) ; la ligne est coupée en deux phrases (désir, puis prix). Phrase d'intro, bouton et lien inchangés. | Les trois relecteurs voulaient une étape qui parle au profil ; r1 voulait la ligne coupée. |
| B8 | 9, 10, 9 | Fin de `[S15]` : « L'exercice … t'y aide » devient « C'est le rôle de l'exercice … » ; « Cet exercice est dans Premium » devient « Tu le trouves dans Premium » ; « (pour garder cette vanne) » devient « pour garder celle-ci ». | r1 et r3 : fin en ton de notice, « exercice » dit deux fois. « t'y aide » supprimé. |
| B10 | 9, 10, 9 | `[S15]` : « l'abonnement » devient « l'abonnement du site » ; « Premium ouvre aussi les 5 parcours … avec un défi à chaque fois » devient « Avec, en plus, les 5 parcours … et un défi à chaque fois ». | r1 et r3 : apposition en suspens, « Premium » répété. Piste r3. |
| B3 | 9, 10, 9 | `[S20]` seule, réécrite : dit ce qu'est un parcours (« l'un des 5 parcours ») et ce qu'est « la suite » (les 4 autres parcours, avec Premium). Bouton et lien intacts. | r1 et r3. Limite portée à 190 caractères. |
| B4+B5 | 9, 10, 10 | Une phrase : « Un seul prix ouvre les 5 parcours, et l'étape 1 de chacun se lit gratuitement : » remplace « Un seul prix ouvre les 5 parcours. Tu commences par celui qui te ressemble : ». | Le texte invitait à choisir son parcours alors que le bouton contour mène à Répartie. Vrai pour les 5 parcours. |
| B9 | 9, 10, 10 | Une phrase : « Mieux vaut tester ce conseil à froid qu'en pleine soirée » remplace « Ce conseil se teste mieux ici qu'en direct ». | « ici » désignait un exercice que le visiteur ne voit pas encore. |
| B13 | 10, 10, 9 | Bouton seul : « Ouvrir {P} en entier · 2,99 €/mois » remplace « Suivre {P} en entier · 2,99 €/mois ». | « Suivre » évoquait des semaines d'effort. Même libellé que le lien de B12. |

## 2. B12 : table profil → parcours → étape payante citée

Sources : profils et `recommendedParcours` dans `apps/web/src/components/quiz/quiz-data.ts` (5 profils : OBSERVATEUR, STORYTELLER, ABSURDE, PUNCHLINEUR, TAQUIN ; `STORYTELLING_PUBLIE = true` dans `apps/web/src/config/parcours-publication.ts`) ; titres dans `moduleTitle` de `docs/content/parcours-reecriture-s17.json` (Machine à Café, Répartie, Confiance) et `parcours-storytelling-s18.json`.

| Profil | Parcours | Étape citée | Pourquoi elle colle (descriptions du site) |
|---|---|---|---|
| L'Observateur | Confiance | étape 3, « L'œil de l'observateur » | Le profil est « observation précise » : « Tu remarques ce que tout le monde a sous les yeux ». Même mot. |
| Le Storyteller | Storytelling | étape 4, « Une chute qui se lit de deux façons » | Le conseil du profil finit sur « une chute que personne n'a vue venir ». |
| Le Storyteller (si Storytelling dépublié, le code renvoie Machine à Café) | Machine à Café | étape 3, « Raconter une anecdote qu'on écoute jusqu'au bout » | Le profil raconte des anecdotes et « les autres attendent la suite ». |
| L'Absurde | Machine à Café | aucune ne colle : repli étape 2, « Sentir le bon moment » | Machine à Café propose vannes courtes, bon moment, anecdote : rien sur l'absurde. Repli `{TITRE2}`, comme demandé. |
| Le Punchlineur | Répartie | étape 2, « Le rythme et les silences » | « Tu sais te servir d'un silence » ; profil « mot juste et silences ». |
| Le Taquin | Répartie | étape 3, « Retourner les piques avec le sourire » | « Tu chambres sans jamais viser en dessous de la ceinture » ; profil « répartie complice ». |

Aucun profil n'envoie vers Boulot. Choix éditorial à surveiller : Storyteller (étape 4 plutôt que 2 ou 5) et Taquin (étape 3 plutôt que 4 « Improviser sur l'inattendu »). Les titres cités sont ceux de la donnée, mot pour mot.

## 3. Mesure du diff réel (règle P0 s11)

Estimation en mots, sur le texte exact des blocs retouchés (les intouchables ne bougent pas : slugs, prix, durées, nombre de parcours, garanties, liens, boutons non cités ci-dessus).

| Bloc | Mots changés / total du bloc texte | Taux | Intouchables |
|---|---|---|---|
| B3 | `[S20]` : environ 22 / 28 (la liste « conseil, défi, 5 vannes, 2 vidéos, quiz » est conservée) ; 22 / 70 sur la zone d'action | environ 30 % de la zone, 80 % de la note | bouton, lien, titre, paragraphe inchangés |
| B4+B5 | 9 / 125 | environ 7 % | titre, liste, prix, boutons, garantie inchangés |
| B8 | 9 / 120 (S15 + libellés) | environ 8 % | titre, boutons, `[S16]`, `[S25]` inchangés |
| B9 | 9 / 110 | environ 8 % | titre, boutons, `[S16]`, `[S25]` inchangés |
| B10 | 9 / 125 | environ 7 % | titre, boutons, `[S16]`, `[S25]` inchangés |
| B12 | 3 à 5 mots par profil + une ponctuation (« : » devenu « . ») / 110 | environ 4 % | phrase, bouton, lien, prix, garantie inchangés |
| B13 | 1 mot (« Suivre » devenu « Ouvrir ») par bouton / 100 | environ 1 % | 3 paragraphes, garantie, prix inchangés |

Ces retouches sont voulues chirurgicales : trois relecteurs sur dix-sept blocs n'ont critiqué que ces passages. Une réécriture large aurait risqué de perdre les 10 déjà acquis.

## 4. Vérifications faites

- **Zéro tiret cadratin** : Grep du tiret cadratin sur les trois fichiers : aucune occurrence.
- **Rien de faux** : la première étape de chaque parcours est en lecture libre (faits du pack). « La suite » de B3 = étapes 2 et suivantes de Répartie, dans Premium. « Avec, en plus, les 5 parcours » (B10) : Premium ouvre les 5 parcours. « Un défi à chaque fois » : chaque étape a un défi. B12 : « les 6 étapes de Confiance », « 3 étapes de Machine à Café », « 4 de Répartie », « 6 de Storytelling » et les durées 20/15/20/20 minutes sont celles des faits. B4+B5 : « l'étape 1 de chacun se lit gratuitement » est vrai pour les 5.
- **Aucune promesse de résultat chiffrée ni garantie** : seul le remboursement du premier paiement sous 14 jours est dit (fait existant). « Résiliable en ligne » est un fait.
- **Longueur de B3 `[S20]`** : 190 caractères, comptés un par un (espaces compris). Exactement à la limite : ne pas rallonger. À vérifier par @fullstack à 360 px. La demande de « quand tu veux » en fin de note a dû être sacrifiée pour tenir (la formule complète fait 204).
- **Anti-signature IA** : relu à voix haute les 7 blocs. Pas de tiret cadratin, pas de triplet rhétorique ajouté, pas de « non seulement / mais aussi ». Seul point : « Avec, en plus, les 5 parcours » (B10) est une phrase sans verbe, piste r3 conservée telle quelle ; elle est volontaire (relance orale).

## 5. Risques restants

1. **B3, bouton** : au tour précédent, r1 et r3 trouvaient aussi que « , gratuit » en fin de bouton se lit comme une étiquette collée (ils proposaient « , c'est gratuit »). Le bouton est resté intact sur consigne, et il est le même que dans B2 (validé) et B4+B5 : le modifier ici obligerait à le modifier partout. Si B3 reste à 9, c'est la première piste.
2. **B3, note** : à 190 caractères, elle est plus dense que l'ancienne (159). Si elle déborde à 360 px, retirer « , l'un des 5 parcours » plutôt que la mention de Premium.
3. **B12, L'Absurde** : aucune étape de Machine à Café ne lui parle. Le repli est honnête mais c'est le profil où le gain de la retouche est nul. Pas d'invention d'étape.
4. **B12, Storyteller et Taquin** : choix de l'étape à faire valider par un relecteur (voir §2).
5. **B8** : « Tu le trouves » a pour antécédent « l'exercice » (masculin), mais « un exemple » (masculin aussi) le précède de près. Le sens reste le même (l'exemple fait partie de l'exercice).
6. **B13** : « Ouvrir {P} en entier » est maintenant identique au lien de B12. Voulu.

## 6. Handoff

- Fichiers : `/home/user/Marrant/docs/copy/cta-s21/tour12/pack-tour12.md` (7 blocs à relire, sans indication d'origine), `/home/user/Marrant/docs/copy/cta-s21/tour12/textes-finaux.md` (17 blocs, table `{ETAPE_PROFIL}`), cette annexe.
- Frameworks et niveaux de conscience inchangés : B3 AIDA, Problem-Aware ; B4+B5 PAS, Solution-Aware ; B8, B9, B10 AIDA, Solution-Aware ; B12 AIDA, Product-Aware ; B13 PAS, Most-Aware.
- Statut : rien n'est à brancher avant la relecture à l'aveugle du tour 12 (règle d'or P0 s18). Pas de commit.
