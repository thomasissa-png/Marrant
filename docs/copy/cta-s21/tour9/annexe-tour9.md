# Annexe du tour 9 (s21) : ce qui change, pourquoi, et ce qui reste à mesurer

> Document interne (hors relecture à l'aveugle). Les blocs validés B1, B2, B6, B7, B15, B17 sont recopiés tels quels dans `textes-finaux.md`. Onze blocs sont retravaillés ; le pack de relecture est `pack-tour9.md` (sans aucune indication d'origine).

## 1. Fil rouge appliqué

Les trois relecteurs du tour 8 citaient le même manque : l'argument le plus fort (avec Premium, tout est ouvert d'un coup, les 5 parcours pour un seul prix) restait sous-dit, et « une étape par semaine » sonnait comme un compte-gouttes. Règle appliquée partout :

- l'argument de vente est « les 5 parcours en entier » (B4+B5, B8, B9, B10, B11, B12, B14) ;
- le rythme conseillé n'est dit que là où il rassure (B13, B14) : jamais en fin de phrase, jamais comme une limite. B13 le met entre parenthèses au milieu d'une phrase et l'accompagne de « on te conseille » ; B14 garde « mais rien ne t'y oblige » et finit sur « les 4 autres parcours en entier » ;
- B12 abandonne le rythme (le visiteur est en mode jeu) au profit de « toutes ouvertes d'un coup avec Premium ».

Rien de faux : toutes les étapes sont ouvertes avec Premium (décision du 07/10, D2). À vérifier une fois dans le code par @fullstack (point déjà noté dans `textes-finaux.md`).

## 2. Bloc par bloc : retouches et arbitrages

| Bloc | Ce qui change | Arbitrage |
|---|---|---|
| B18 lettre | « démontée, comme celle-ci » retiré. Ligne 1 : « on t'explique pourquoi elle marche », puis la vanne présentée comme un échantillon (« Du genre de celle-ci »). Ligne 2 : on finit sur « trois étapes pour fabriquer la tienne, exemple à l'appui » (l'élément le plus fort, qui reprend le titre), la lecture à suivre passe avant, et Premium devient une phrase à part, « En fin de message », qui est sa vraie place. | Ne pas montrer de faux démontage : on n'a pas le « pourquoi ça marche » de cette vanne dans les faits, donc rien d'inventé. La promesse « on t'explique » est tenue par le contenu réel de chaque numéro. |
| B3 haut d'accueil | « Dedans : » retiré. Le mot « parcours » est posé, avec la vraie ligne de la carte Répartie (« pour toi si on te chambre en soirée, en coloc ou en TD et que tu cherches encore quoi répondre »). La note finit sur « Répartie en entier et les 4 autres parcours ». | Les noms des 4 autres parcours ne sont pas listés (la note est en petit, les pastilles les portent déjà). La ligne de carte est reprise mot pour mot, variable `{LIGNE_CARTE}` pour les autres parcours. |
| B4+B5 carte | « Choisis ton parcours » devient « Choisis par où tu commences, les 5 parcours sont compris ». Fin de `[S11]` : « Une fois abonné, tout est ouvert d'un coup : 15 à 20 minutes par étape, avec un défi à tenter, dans la vie ou à l'écrit. » | « 5 » en chiffre (comme dans le bouton et le code, `{PARCOURS_COUNT}`) plutôt que « cinq ». Le rythme conseillé disparaît de la carte : l'info utile (durée d'une étape, défi) reste. |
| B8 fiche vanne | Phrase centrale coupée en deux, plus de mode d'emploi : « te donne la consigne et un exemple pour l'écrire avec la même technique ». Fin : « qui ouvre aussi les 5 parcours en entier ». | « à réutiliser » retiré de la fiche vanne (la formule exacte du fait reste vraie, mais alourdissait). Plus aucun rythme. |
| B9 fiche conseil | « un exemple à réutiliser » rattaché au titre : « …pour t'y mettre et un exemple à réutiliser le soir venu ». La phrase sur les parcours est ramenée à une demi-ligne : « qui ouvre aussi les 5 parcours en entier ». | Défi et durée retirés de cette fiche : ils sont dans le bouton contour (« un conseil et un défi »). |
| B10 fiche vidéo | « ça s'entraîne » une seule fois, devenu « Et ça s'entraîne, à petite dose » (le « ça » renvoie au titre : faire rire une table). « Les 5 parcours sont faits pour ça » supprimé. Fin : « Premium ouvre aussi les 5 parcours en entier, de 15 à 20 minutes par étape, avec un défi à chaque fois. » | Aucun extrait de l'analyse, rien d'inventé. |
| B11 fenêtre | Vote : titre « Pour voter, il ne te manque que Premium ». Favori : bouton « Je m'abonne et je la garde » (vanne, vidéo) ou « je le garde » (conseil). `[S27]` : « les 5 parcours en entier » en favori et en vote, et les trois `[S27]` de carte floutée resserrés (100 caractères au plus, voir §4). | « toute la liste » est gardé dans chaque carte floutée (c'est ce que le visiteur vient de toucher). « l'exercice de chaque vanne » devient « un exercice par vanne » pour tenir dans la limite. Pour les conseils et les vidéos, « les filtres » reste volontairement générique (les noms exacts des deux filtres dépasseraient 100 caractères) : c'est vrai et c'est dit en toutes lettres dans B7. |
| B12 quiz d'humour | Titre de l'étape 1 cité (« Redécouvrir ce qui te fait rire » pour Confiance), vérifié dans les JSON pour les cinq parcours (voir `{TITRE1}`). Dernière phrase : « toutes ouvertes d'un coup avec Premium » au lieu du rythme. Lien : « Ouvrir {P} en entier · 2,99 €/mois ». Ligne Premium : « Premium : {P} en entier et les 4 autres parcours, pour 2,99 € TTC… » (évite le doublon « ouvre / ouvertes »). | Le lien ouvre toujours la page d'abonnement ; son libellé donne le prix mensuel, la formule annuelle se choisit sur la page. |
| B13 quiz d'orientation | Passé de 8 phrases à 4 : résultat + ligne de carte en une phrase, programme (l'étape 1 « offerte » est fondue dans la phrase), accès et prix en une phrase, « Ton compte est prêt : il ne reste que le paiement. » en dernier. Aucun fait perdu : ligne de carte, étape 1 offerte, titres d'étapes, étapes ouvertes tout de suite, 20 (ou 15) minutes, une par semaine conseillée, 2,99 €, 5 parcours, compte prêt. | « rythme » n'apparaît plus que dans le titre d'étape « le rythme et les silences » (Répartie). Le rythme conseillé est dit par « on te conseille une par semaine », entre parenthèses. |
| B14 fin d'étape 1 | « tu la valides et tu enchaînes » ouvre la phrase (ordre du geste du visiteur). La phrase finit sur « les 4 autres parcours en entier ». | Le reste est inchangé (carte, bouton, `[S16]`, `[S30]`). |
| B16 page d'abonnement | Bouton nomme le parcours d'origine : « Ouvrir {P} et les 4 autres · 2,99 €/mois » (annuel : « · 24,99 €/an »). Adresse directe : bouton générique inchangé. Titre Confiance changé. | Voir le §3. |

## 3. Arbitrage du titre Confiance (B16)

Deux positions s'opposaient : le titre actuel (« Retrouver ta légèreté, 20 minutes par semaine, sans te forcer », noté 10 par un relecteur, qui y voyait la douceur voulue pour un visiteur fragile) et la proposition « De nouveau rire à table, 20 minutes par semaine, sans te forcer » (qui ajoute une image).

Choix : **« Retrouver le rire à table, 20 minutes par semaine, sans te forcer »**.

- Il garde la douceur du verbe « retrouver » et de « sans te forcer » (pas de scène choc, pas de pression), ce que défendait le premier relecteur.
- Il ajoute l'image concrète demandée par le second (« à table »), et répond mot pour mot au surtitre (« …que le rire te manque »).
- « De nouveau rire à table » a été écarté tel quel : la tournure « de nouveau rire » se lit mal en tête de titre (« de nouveau » pris pour un nom), et elle sonne davantage comme un résultat attendu.
- Ce n'est pas une promesse : « Retrouver le rire à table » est au même niveau que « Retrouver ta légèreté » (infinitif d'intention, aucun délai ni résultat garanti). Les « 20 minutes par semaine » sont la durée réelle du parcours Confiance (`{D}`).

Si l'équipe préfère rester sur le titre d'origine, B16 redevient « Retrouver ta légèreté, 20 minutes par semaine, sans te forcer » sans autre impact.

## 4. À mesurer avant branchement (pas faisable ici)

- **Largeur du bouton B16 à 375 px** : « Ouvrir Storytelling et les 4 autres · 2,99 €/mois » fait 49 caractères, « Ouvrir Machine à Café et les 4 autres · 2,99 €/mois » 51. Le libellé générique d'aujourd'hui (35) tient sur une ligne ; ces boutons passeront sur deux lignes dans un bouton pleine largeur. Si le design refuse, repli sur le libellé générique pour ce parcours.
- **`[S27]` de B11 à 375 px** : contrôlés par recherche à 100 caractères au plus (5 textes : 66 à 96 caractères). Le rendu à 2 lignes dépend de la taille de police du panneau ; à confirmer à l'écran.
- **B3 `[S20]`** : plus long qu'au tour 8 (environ 55 mots contre 40). À vérifier à 360 px ; il reste en petit sous le lien.
- **Taux de changement par bloc** (règle P0 s11). Estimation manuelle en mots sur le texte principal de chaque bloc, faute d'outil de diff dans cet environnement : B18 environ 45 %, B3 environ 45 %, B4+B5 environ 25 % de `[S11]`, B8 environ 40 % de `[S15]`, B9 environ 40 % de `[S15]`, B10 environ 50 % de `[S15]`, B11 environ 40 % des champs du bloc (titre vote, boutons favori, cinq `[S27]`), B12 environ 30 %, B13 environ 60 %, B14 environ 15 % de la phrase de suite, B16 environ 25 % (boutons et titre Confiance). Aucun bloc n'est un simple toilettage et aucun n'est une réécriture complète. À confirmer par un vrai diff contre `tour8/textes-finaux.md` avant de valider ce rapport.
- **Intouchables vérifiés** : prix (2,99 €, 24,99 €, 2,08 €, 10,89 €), 14 jours, « 1 500+ », titres d'étapes (lus dans les JSON), lignes de cartes des parcours, boutons contour `[S25]`, liens discrets, `[S16]`, `[S28]`, `[S30]`, `[S32]`, ligne repliée de B18 : inchangés.

## 5. Contrôles faits

- Zéro tiret cadratin dans les trois fichiers du dossier `tour9/` (recherche du caractère : 0 occurrence).
- Zéro promesse de résultat chiffrée ou garantie : « 20 minutes par semaine », « 15 à 20 minutes par étape » sont des durées de parcours ; le remboursement du premier paiement est le fait vrai (14 jours).
- Zéro nom de concurrent. Zéro témoignage. Aucun mot « Débloquer ».
- Titres d'étape 1 relus dans `docs/content/parcours-*.json` (`moduleTitle`, premier module de chaque parcours) : identiques à la liste des faits.
- Le pack ne contient aucune mention de l'origine des textes ni des tours précédents.
- Pas de commit.

## 6. Objections traitées (rappel)

« Je paie pour un seul parcours ? » : B4+B5, B8, B9, B10, B13, B14, B16 (les 5 sont compris). « Je suis bloqué semaine après semaine ? » : B4+B5, B12, B13, B14. « Ça me coûte combien, ça m'engage à quoi ? » : lignes de prix, résiliation, 14 jours, conservées partout. « Je ne sais pas ce qui se passe au clic » : B11, B16 `[S32]`, B13 (« Ton compte est prêt »).
