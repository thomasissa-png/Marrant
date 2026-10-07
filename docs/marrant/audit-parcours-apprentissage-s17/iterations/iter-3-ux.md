# Itération 3, notation UX sur captures (@ux, s17, 07/10/2026)

Brief compris : noter /10 le rendu réel du tour 3 (`docs/qa/captures-parcours-apprentissage-s17/iter-3/`) et statuer sur UXV-2-01 à 06. Textes validés et `[CHOIX UTILISATEUR]` non re-questionnés. Aucun fichier touché hors ce rapport, rien de commité.

Captures lues une à une (375 en priorité) : chargement (page, carte, progression inconnue), échec (arrivée, carte, réessayer, 375 et 1280), échec de validation (375 et 1280), focus après valider, « Termine le quiz… », « On valide… », survols (valider, option du quiz, rappel), rappel (ancre, éteint, coché, clavier), accueil Premium, liste Premium (page entière et vue), MàC étape 1 recadrée, Répartie et MàC terminés rechargés, carte validée, profil non vérifié. Non lues : les 768 et les doublons 1280.

## 1. Note globale : 9,7 / 10 (tour 2 : 9,2 ; tour 1 : 7,0 ; audit initial : 4,2)

| Critère | T2 | T3 | Justification courte |
|---|---|---|---|
| Compréhension immédiate | 9,5 | 10 | Accueil Premium : un seul bouton plein « Reprendre l'étape 3 », « Explorer les vannes » en contour. Liste Premium : « Reprendre ton parcours » puis les 3 cartes, quiz d'orientation en bas. Rien à corriger |
| Continuité du chemin | 9 | 9,7 | Le chargement garde l'étape 1 cochée et les verrous cohérents (« Termine l'étape 2 pour débloquer » aux étapes 3 et 4) ; progression inconnue = neutre, sans aucun verrou. Retire 0,3 : aucune capture ne montre la barre « 1/4 » en haut de vue pendant le chargement ni l'échec, et « Ta progression est intacte » manque encore dans la carte (connu, en correction) |
| Retour d'action | 9 | 9,5 | « +50 XP gagnés ! Prochaine étape conseillée le mercredi 14 octobre… » visible avec le focus sur l'étape 2 ; « On valide… » avec indicateur ; Retire 0,5 : l'échec de la validation reste non prouvé (UXV-2-06 point 3) |
| Motivation à revenir | 9 | 10 | Date à chaque étape, rappel sous « Mes parcours », ancre avec focus, sélecteur grisé tant que l'interrupteur est éteint, « lundi » + « C'est noté. » à l'allumage |
| Mobile 375 | 9,5 | 9,8 | Aucun débordement, cartes d'échec et de chargement calées, cibles 44 px. Liste Premium longue (5 537 px) mais les cartes passent avant le quiz : acceptable |
| Accessibilité perçue | 9 | 9,6 | Focus prouvé (en-tête, réponse, Valider, interrupteur, en-tête de l'étape 2 après validation) ; annonce vocale cohérente. Retire : focus perdu après Espace sur l'interrupteur (connu, en correction), survol des options du quiz non visible sur capture (UXV-3-02) |
| Cohérence promesse / écran | 9,5 | 9,7 | Tout ce qui est annoncé est à l'écran. Reste la question de la chute de bilan de MàC (UXV-2-04, à trancher par Thomas, hors correction) |

Moyenne 9,76, arrondie à 9,7. Ce n'est pas encore 10 : pas de bloquant produit, mais trois preuves manquantes et deux corrections en cours.

## 2. Statut de UXV-2-01 à 06

| ID | Statut | Capture / preuve |
|---|---|---|
| 01 chargement et échec d'une étape Premium (bloquant) | RÉGLÉ, deux réserves | `p-375-etape-chargement-carte` : titre + « Chargement du contenu de l'étape… » + 3 lignes grises dans la carte ouverte, sans saut ; `p-375-etape-chargement` : étape 1 cochée, étapes 3 et 4 « Termine l'étape 2 pour débloquer » (progression gardée, plus de « 0/4 ») ; `p-375-etape-chargement-inconnue` : étapes 1 à 4 neutres, aucun verrou ; `p-375-etape-echec-carte` : bloc rouge dans la carte, « Le contenu de l'étape n'a pas voulu se charger. », « Réessayer » plein largeur à 44 px. Réserves : (a) « Ta progression est intacte » absent du message de la carte (connu, ne pas recompter) ; (b) la barre de progression n'est dans aucune vue de chargement ou d'échec : preuve indirecte seulement |
| 02 bouton désactivé et « On valide… » | RÉGLÉ | `p-1280-bouton-desactive-quiz-a-finir` : texte gris clair lisible sur surface, contour discret ; `p-1280-on-valide` : indicateur circulaire + texte clair sur violet ; plus de gris sur violet foncé |
| 03 rappel : sélecteur actif interrupteur éteint | RÉGLÉ | `p-375-rappel-arrivee-ancre` et `p-1280-survol-rappel` : sélecteur grisé, éteint ; `p-375-rappel-coche` : « lundi » actif + « C'est noté. ». Deux états initiaux désormais identiques |
| 04 chute de bilan identique (question à Thomas) | NON TRANCHÉ | `p-375-machine-a-cafe-termine-apres-rechargement-vue` : même phrase que Répartie. Aucune note retirée tant que Thomas n'a pas confirmé que c'est un étalon |
| 05 liste Premium : quiz avant les cartes | RÉGLÉ | `p-375-parcours-liste-premium` : « Reprendre ton parcours » puis MàC « Commencer ce parcours », Répartie « Revoir ce parcours » (Terminé 4/4), Confiance « Continuer ce parcours » (2/6) ; « Quel parcours est fait pour toi ? » vient après |
| 06 preuves manquantes | PARTIEL (2 sur 3) | (1) RÉGLÉ : `p-375-machine-a-cafe-etape1-avant-validation-vue` montre « Quiz bouclé… » et « Valider cette étape » ; chargement cadré sur la carte. (2) RÉGLÉ : `p-1280-focus-apres-valider` : carte étape 1 repliée avec « +50 XP gagnés ! Prochaine étape conseillée le mercredi 14 octobre… », anneau violet sur l'en-tête de l'étape 2, qui reste ouverte juste dessous ; l'annonce vocale relevée par @qa dit la même chose. (3) NON PROUVÉ : `p-375-validation-echec` et `p-1280-validation-echec` sont cadrées sur « Vannes à pratiquer » (375 : image coupée à 640 px, bas noir) ; ni message, ni bouton, ni quiz conservé à l'écran |

## 3. Nouveaux écarts

### UXV-3-01 [FINITION faible, à confirmer] Deux blocs d'erreur, deux « Réessayer » à l'écran
- Capture : `p-375-etape-echec-reessayer` : un « Réessayer » dans le haut de la carte de progression (texte cadré hors vue), puis un second dans la carte de l'étape 2, environ 350 px plus bas. Je n'ai pas pu lire le texte du premier bloc.
- Effet : Yanis ne sait pas lequel presser ; si les deux font la même chose, c'est du bruit, et l'annonce `role="alert"` risque d'être doublée.
- On fait : un seul bouton « Réessayer », dans la carte de l'étape (là où l'œil est). Le bloc de progression garde seulement « Ta progression est intacte » sans bouton. Si c'est déjà le cas, fournir la capture du haut de page pour le prouver.

### UXV-3-02 [PREUVE, faible] Survol d'une option du quiz indiscernable
- Capture : `p-1280-survol-option-quiz` : les options A à D ont le même rendu, aucune ne se distingue. Le survol de « Valider » est lisible (violet plus foncé).
- Effet : on ne peut pas affirmer que le survol existe ; sur desktop, Yanis n'a pas de retour avant de cliquer.
- On fait : refaire la capture avec la souris réellement posée sur B, cadrée sur A à D, ou ajouter un contour `border-text-muted` au survol si absent.

(L'échec de la validation reste compté une seule fois, sous UXV-2-06 point 3.)

## 4. Passage par persona (375 px)

- **Yanis Premium** : valide au clavier ou au toucher, voit le gain et la date tout de suite, le focus tombe sur l'étape 2 ; si le réseau lâche, il garde ses étapes cochées, la carte lui propose « Réessayer ». Le seul trou de confiance : on ne lui a pas montré la validation qui échoue.
- **Sophie** : MàC, bouton « Valider » à l'écran après le quiz, fin avec bilan ; la chute du bilan reste à trancher.
- **Marc** : « Reprendre l'étape 3 » depuis accueil, liste et profil ; rappel trouvable, grisé tant qu'il n'est pas voulu, « C'est noté. » à l'allumage. Compte non vérifié : aucune invitation, aucune contradiction.
- **Yanis visiteur** : inchangé depuis le tour 2, validé.

## 5. Pour atteindre 10

1. Capture lisible de l'échec de la validation (réseau coupé au clic) : message, « Réessayer » ou équivalent, quiz conservé, cadrée sur le bas de la carte (375 et 1280).
2. Les deux corrections en cours, prouvées par capture : « Ta progression est intacte » dans la carte (`p-375-etape-echec-arrivee`) et focus qui reste sur l'interrupteur après Espace (`p-1280-rappel-clavier-coche` avec anneau).
3. Une capture de chargement et une d'échec avec la barre de progression visible en haut de vue (1/4), et la preuve qu'il n'y a qu'un « Réessayer » (UXV-3-01).
4. UXV-3-02 : capture du survol d'une option. UXV-2-04 : réponse de Thomas, sans effet sur la note si étalon confirmé.

## 6. Vérifié / Non vérifié

Vérifié : tous les écrans listés en tête, à l'œil. Non vérifié : contrastes mesurés (estimation visuelle, aucun cas à moins de 4,5:1 repéré), 768, annonce vocale (relevé @qa repris tel quel, cohérent avec le texte de la carte), texte exact des étalons de bilan.

Handoff : @qa (captures 1, 3 et 4 de la section 5, noms stables), @fullstack (UXV-3-01 si confirmé, les deux corrections en cours), Thomas (UXV-2-04).
