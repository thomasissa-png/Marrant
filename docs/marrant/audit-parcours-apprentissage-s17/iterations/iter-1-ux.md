# Itération 1, notation UX sur captures (@ux, s17, 07/10/2026)

Brief compris : noter /10 le rendu réel des parcours (captures `docs/qa/captures-parcours-apprentissage-s17/apres/`, 375 / 768 / 1280) et vérifier que UX-01 à UX-11 sont réglés. Textes validés (étalons) et `[CHOIX UTILISATEUR]` non re-questionnés. Aucun fichier touché hors ce rapport.

Captures lues : v-375 accueil, arrivée accueil / blog / fiche vanne, liste, quiz, fin de quiz, aperçu étape 2 ; p-375 avant et après validation (étapes 1 à 4, vues et pages), fin et rechargement, profils vérifié et non vérifié ; p-1280 étape 3 et fin Confiance ; v-1280 fin de quiz. Les pages entières à 375 sont réduites par l'outil de lecture (texte fin illisible) : j'ai jugé sur les « vues » (fenêtre visible).

## 1. Note globale : 7,0 / 10 (audit initial : 4,2)

| Critère | Note | Justification courte |
|---|---|---|
| Compréhension immédiate | 8 | Accueil clair (bouton, prix, lien « Lire la première étape gratuite », pastilles) ; étape 1 ouverte ; aperçu étape 2 lisible. Retirent 2 points : « Continuer » ambigu en fin de quiz, arrivée sans nom de parcours |
| Continuité du chemin | 7 | Plus d'impasse visiteur, carte de fin sans rechargement, « Reprendre l'étape 3 » au profil. Restent : invitation au rappel qui mène à rien (compte non vérifié), parcours terminé rouvert sur l'étape 1 avec la suite enterrée |
| Retour d'action | 6 | Bug 1 toujours là : « +75 XP gagnés ! » et la date conseillée sont cachés sous l'en-tête dès l'étape 2 (375) et 3 (1280). Fin de parcours très bonne |
| Motivation à revenir | 6,5 | La date conseillée existe mais on ne la voit pas ; rappel e-mail relégué sous « Supprimer mon compte » ; bilan « 3 défis essayés, dont 1 qui a marché » efficace |
| Mobile 375 | 7,5 | Pas de débordement, cibles correctes, lettres A-D lisibles. Défilement qui glisse sous l'en-tête collant ; page très longue |
| Accessibilité perçue | 7 | Correction du quiz par coche + texte + lettre (réglé). Série « 1 jour » à 2,2:1, titre « Streak » en anglais, focus clavier non prouvé par une capture, lien secondaire de l'accueil trop petit |
| Cohérence promesse / écran | 8,5 | « Un conseil, un défi, 5 vannes, 2 vidéos, un petit quiz » et « Environ 15 min, hors vidéos » sont vrais à l'écran ; « Parcours terminé » n'apparaît qu'à la fin ; 475 XP bonus compris. Reste « Petit quiz avant de valider » pour un visiteur qui ne peut pas valider |

Pour le 10, il manque 5 écarts bloquants (UXV-1-01 à 05) et 1 lot de preuves (UXV-1-10).

## 2. Vérification des constats UX-01 à UX-11 sur écrans

| ID | État | Preuve / reste |
|---|---|---|
| UX-01 mur étape 2 | RÉGLÉ | `v-375-repartie-apercu-etape2` : badge « Fait partie de Premium », « Ce que tu vas apprendre », format, bouton. Résidu : UXV-1-04, UXV-1-07 |
| UX-02 carte de fin | RÉGLÉ | `p-375-repartie-fin-bilan`, `etape4-apres-validation-vue` : carte + bilan sans rechargement |
| UX-03 rythme et retour | PARTIEL | Date conseillée présente (`p-375-repartie-etape1-apres-validation`) mais cachée (UXV-1-01) ; « Reprendre » profil OK ; rappel e-mail : UXV-1-02. Accueil abonné « Reprendre » : non capturé |
| UX-04 série | PARTIEL | Texte juste (« 1 jour de suite »), mais défaut d'affichage UXV-1-09 ; règle de comptage non vérifiable sur capture |
| UX-05 récompenses | PARTIEL | (b) faux « terminé » réglé, (c) 475 XP bonus compris réglé ; (a) message visible : NON (UXV-1-01) ; (d) focus après validation : non prouvé |
| UX-06 suite de fin | RÉGLÉ (vu) | Répartie terminé propose Confiance (premier non terminé). Cas « 3 parcours finis + carnet » non capturé (UXV-1-10) |
| UX-07 contenu d'étape | RÉGLÉ | 5 vannes listées avec « Voir la fiche », durée, vidéos « facultatif », « Alors, ce défi ? » en 3 boutons avec réponse « Ça arrive, et c'est utile à savoir » |
| UX-08 entrées | PARTIEL | Accueil et fiche vanne OK (« Dans un parcours »). Blog : UXV-1-05 |
| UX-09 accessibilité | PARTIEL | Quiz réglé (coche, « Bonne réponse. », lettres). Focus d'en-tête et annonce XP non prouvés (UXV-1-10) |
| UX-10 orientation et niveaux | RÉGLÉ (vu) | `v-375-parcours-liste` : quiz 1/2 en tête, niveaux Débutant / Débutant → Intermédiaire distincts |
| UX-11 états | NON PROUVÉ | Chargement bloqué, saut à la reprise, « Terminé » sur la carte de liste (liste vue en visiteur seulement) |

## 3. Écarts qui empêchent le 10

### UXV-1-01 [BLOQUANT] Le gain d'XP et la date conseillée sont toujours cachés après validation
- Captures : `p-375-repartie-etape2-apres-validation-vue` (« +75 XP gagnés ! » coupé par l'en-tête), `p-375-repartie-etape3-apres-validation-vue` (rien du message), `p-1280-repartie-etape3-apres-validation-vue` (« +100 XP gagnés ! » derrière la navigation), `p-375-repartie-etape1-apres-validation` (date en haut de page, hors vue). Seule l'étape 1 montre le message.
- Problème : le message vit au-dessus de « Le programme », la page défile vers l'étape suivante, l'en-tête collant le recouvre, puis il s'efface en 6 s (bug 1 QA, non corrigé).
- Effet : Yanis valide, voit l'étape suivante s'ouvrir, aucune preuve que c'est enregistré, aucune date de retour. C'est la récompense et le rendez-vous, les deux moteurs de la persona.
- On fait : (1) afficher le résultat DANS la carte qui vient d'être validée, repliée, sous le titre : « +75 XP gagnés · Prochaine étape conseillée le mercredi 14 octobre », texte persistant (pas de minuterie, ce qui règle aussi le bug 3) ; (2) garder une zone `aria-live` permanente pour le lecteur d'écran ; (3) le défilement cible l'étape suivante avec `scroll-margin-top` = hauteur de l'en-tête + 16 px. Fichier probable : `parcours-detail.tsx` (`:240` défilement, `:300` minuterie, `:450` message), `parcours-step-card.tsx`. Texte : étalon 9 (« Prochaine étape conseillée le … ») inchangé.
- Preuve de sortie : capture `etape2-apres-validation-vue` à 375 montrant gain et date sans défiler.

### UXV-1-02 [BLOQUANT] Invitation au rappel sans interrupteur derrière, et interrupteur enterré
- Captures : `p-375-repartie-etape1-apres-validation` (« Envie d'un rappel par e-mail ... ? Règle-le dans ton profil ») puis `p-375-profil-non-verifie` (aucun rappel) ; `p-375-profil-verifie` (bloc « Rappel de parcours » tout en bas, après « Supprimer mon compte »).
- Effet : un abonné non vérifié clique, atterrit sur un profil sans la commande promise (message contradictoire, impasse). Pour l'abonné vérifié, la commande est à 3 700 px, sous une zone destructive : personne ne la trouve, donc le seul levier de retour s'éteint.
- On fait : (1) afficher l'invitation seulement si l'e-mail est vérifié ; sinon une ligne « Vérifie ton e-mail pour recevoir un rappel » avec le lien d'action de vérification (texte à fournir par @copywriter, brouillon) ; (2) le lien pointe `/profil#rappel-parcours` ; (3) déplacer « Rappel de parcours » juste sous « Mes parcours » (avant « Prochaine étape »), jamais après « Supprimer mon compte » ; focus sur la case à l'arrivée. Fichiers : `profil-dashboard.tsx`, bloc de progression de `parcours-detail.tsx`.

### UXV-1-03 [BLOQUANT] Parcours terminé, retour plus tard : on retombe sur l'étape 1 dépliée, la suite est à 3 000 px
- Captures : `p-375-repartie-termine-apres-rechargement` (étape 1 ouverte avec vannes et vidéos, carte « Parcours Répartie terminé » tout en bas, après trois étapes repliées).
- Effet : Marc revient finir sa semaine, ne voit ni félicitation ni « Passer au parcours Confiance » sans défiler ; la fin vue juste après validation (bonne) ne se retrouve plus.
- On fait : quand `completedAt` est présent, toutes les étapes repliées par défaut et la carte de fin + bilan placés juste sous la barre « Parcours terminé ! », avant « Le programme » ; les étapes restent dépliables. Fichier probable : `parcours-detail.tsx` (état d'ouverture initial, ordre des blocs).

### UXV-1-04 [BLOQUANT] Fin de quiz visiteur : deux boutons pleins et « Continuer » dont l'effet n'est pas lisible
- Captures : `v-375-repartie-quiz-fin-visiteur`, `v-1280-repartie-quiz-fin-visiteur`.
- Problème : « 2 sur 4. Les explications sont là pour ça. » + bouton violet « Continuer », puis « Valider l'étape fait partie de Premium. » + bouton violet « Voir l'offre Premium ». Deux actions de même poids au moment de la décision, et l'on ne sait pas où mène « Continuer » (le quiz est fini, la page ne bouge pas à l'écran). [À VÉRIFIER @fullstack : action réelle de « Continuer ».]
- Effet : Yanis hésite, ou clique « Continuer » en croyant avancer. Le titre « Petit quiz avant de valider » lui parle d'un « valider » qu'il ne peut pas faire.
- On fait : retirer « Continuer » s'il ne fait que fermer le résultat ; sinon le passer en bouton discret (secondaire) avec un libellé qui dit son effet (« Revoir les explications » / « Refaire le quiz »). Un seul bouton plein : « Voir l'offre Premium ». Titre du quiz pour un visiteur : « Petit quiz » (texte à valider avec Thomas, titre hors étalons). Fichier probable : `parcours-detail.tsx` (`StepQuiz`, bloc « Valider fait partie de Premium »).

### UXV-1-05 [BLOQUANT] Le lien d'entrée du blog n'annonce pas la gratuité et pèse moins que « Passer à Premium »
- Capture : `v-375-entree-blog` : « Commencer le parcours Confiance » en bouton sombre à contour, juste au-dessus d'un bloc « Passer à Premium » en violet plein. La fiche vanne, elle, dit « Lire la première étape gratuite du parcours Répartie » (`v-375-entree-fiche-vanne`).
- Effet : le visiteur du blog voit « parcours » + un bouton plein « Premium » et conclut que tout est payant ; la porte d'entrée gratuite (levier de conversion et choix fondateur) est invisible. Incohérence de libellé entre blog, fiche et accueil.
- On fait : libellé unique « Lire la première étape gratuite » (étalon 15, option A) sur le bouton du blog, et lui donner le style principal ; « Passer à Premium » en secondaire dans ce bloc. Fichier probable : `article-cta.tsx`.

### UXV-1-06 [FINITION] L'arrivée sur #etape-1 se cale sous l'en-tête et ne dit pas dans quel parcours on est
- Captures : `v-375-accueil-vers-etape1`, `v-375-entree-blog-arrivee` (le titre « Le programme » et sa phrase sont coupés par l'en-tête ; aucun nom de parcours ni « étape 1 sur 3 » à l'écran).
- On fait : même `scroll-margin-top` qu'en UXV-1-01 ; ajouter dans la carte d'étape 1, au-dessus du titre, une ligne « Parcours Répartie · 4 semaines » (donnée existante).

### UXV-1-07 [FINITION] Aucun repère de prix ni « sans engagement » au moment de décider
- Captures : `v-375-repartie-quiz-fin-visiteur`, `v-375-repartie-apercu-etape2` (bouton « Voir l'offre Premium » seul).
- On fait : sous le bouton, une ligne issue de `config/premium.ts` (jamais écrite en dur) : « 2,99 €/mois, sans engagement » (déjà validée en accueil). À confirmer par Thomas : le texte du mur reste intact, seule une ligne de réassurance s'ajoute (réassurance près du bouton, vue en s16).

### UXV-1-08 [FINITION] Accueil : le lien « Lire la première étape gratuite » est petit et en retrait
- Capture : `v-375-accueil` : lien souligné de 14 px sans zone de toucher, plus discret que les pastilles dessous.
- On fait : `min-h-11` + padding (cible 44 px), contraste texte principal, conserver l'étalon 1.2 du bouton (non re-questionnable).

### UXV-1-09 [FINITION] Profil : série, titres et textes de progression
- Captures : `p-375-profil-non-verifie`, `p-375-profil-verifie`.
- Problèmes : « Streak » en anglais, « 1 jour de suite » orange sur sombre à 2,2:1 (défaut antérieur, QA bug 4), « Premiers XP au compteur : le reste vient en pratiquant » affiché à 600 XP, trois cartes « Prochaine étape » génériques sous « Reprendre ton parcours » (redondant quand un parcours est en cours).
- On fait : « Série » (étalon 14), contraste ≥ 4,5:1 (@design), phrase de progression selon le niveau réel, ne garder qu'une carte « Prochaine étape » quand un parcours est en cours. Fichiers : `profil-dashboard.tsx:179`, `streak-counter.tsx:26`.

### UXV-1-10 [PREUVE MANQUANTE, bloque la validation du 10] Écrans non capturés
Sans ces captures je ne peux pas noter au-dessus des chiffres ci-dessus :
1. Parcours Premium Machine à Café en 375 (Sophie) : étapes 1 à 3, fin, texte d'étape 1 « Léa ».
2. Quiz : une mauvaise réponse (coche remplacée par quoi ? ton « Pas tout à fait »).
3. Focus clavier visible : Tab sur l'en-tête d'étape, sur « Valider cette étape », sur « Question suivante » (375 ou 1280).
4. Arrivée par « Reprendre l'étape 3 » depuis le profil : à quelle étape la page s'ouvre, sans saut.
5. Accueil abonné avec « Reprendre » ; liste `/parcours` en Premium (état « Terminé » ou « Reprendre ») ; fin des trois parcours (carnet).
6. Persona Marc : Confiance étapes 3 à 5 en 375 (message de fin absent, ton).
7. États : chargement lent de l'étape 2+, échec avec « Réessayer ».
À ajouter à `refaire-captures.sh` avec des noms stables.

### UXV-1-11 [FINITION] La liste `/parcours` répète encore les trois parcours
- Capture : `v-375-parcours-liste` : trois encadrés de présentation puis le quiz puis trois cartes. Page de 5 600 px avant la FAQ, deux passages sur les mêmes titres.
- On fait : fusionner (le quiz en tête, puis les 3 cartes avec leur phrase) ; garder les liens robots hors écran. Faible priorité.

## 4. Passage par persona (375 px, d'après les captures)

- **Yanis visiteur** : accueil, lien gratuit, étape 1, quiz avec explication nette (« La D : ... »), aperçu de l'étape 2 : compris sans aide, pas de contradiction. Frein : UXV-1-04 et prix absent (UXV-1-07).
- **Yanis Premium** : valide, mais ne voit la récompense qu'à l'étape 1 (UXV-1-01) ; fin de Répartie très réussie ; reprise plus tard : UXV-1-03.
- **Sophie** : entrée accueil, « Environ 15 min, hors vidéos » rassure ; Premium non capturé (UXV-1-10).
- **Marc** : profil « Reprendre ton parcours / Parcours Confiance, étape 3 sur 6 », bilan de fin sobre et juste (« Le plus dur, maintenant, c'est de ne pas le raconter à tout le monde »). Le rappel qui lui servirait le plus est le moins accessible (UXV-1-02).

## 5. Ordre de correction conseillé

UXV-1-01 + 06 (même défilement), UXV-1-02, UXV-1-03, UXV-1-04, UXV-1-05, puis finitions 07 à 11, puis captures UXV-1-10 pour le tour 2. Aucun de ces points ne touche un étalon validé ni un `[CHOIX UTILISATEUR]`, sauf UXV-1-07 et le titre de quiz d'UXV-1-04 qui demandent un feu vert de Thomas.

## 6. Vérifié / Non vérifié

Vérifié : les écrans cités (lus un par un). Non vérifié : tout ce qui est listé en UXV-1-10, le contraste des couleurs mesuré à l'écran, l'action du bouton « Continuer ». Lecture des pages entières à 375 limitée par la réduction d'image.

Handoff : @fullstack (UXV-1-01 à 06, 08, 09 code), @design (UXV-1-04 hiérarchie des boutons, 05, 09 contrastes), @copywriter (ligne de vérification d'e-mail, titre du quiz visiteur), @qa (captures UXV-1-10).
