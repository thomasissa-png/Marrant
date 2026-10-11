# Itération 3, relecture UX des étalons du Parcours Boulot (angle : la lectrice avant de payer, puis Thomas qui décide)

Fichier noté : `docs/copy/etalons-parcours-boulot-s19.md` (non modifié, numéros de lignes = ce fichier, 413 lignes).
Lu : ce fichier en entier, ma notation d'itération 2, le modèle `etalons-parcours-storytelling-s18.md`, la spec s17 (§1, §3), `founder-preferences.md` (07/10 et 08/10, plus la ligne 06/10 sur la barre des vannes).
Lu aussi, parce que le projet existe déjà (audit du rendu actuel) : `apps/web/src/config/textes/parcours.ts`, `components/parcours/parcours-step-card.tsx`, `components/parcours/step-blocks.tsx`. Cela change trois jugements (voir « Ce que le rendu actuel fait déjà »).
Hors note, comme demandé : le texte des 6 conseils (§1). Recomptés et exacts : `moduleDetail` 99 mots, titres 60 / 56 / 57 caractères, longueurs des réponses de quiz (12-11-9-10 / 12-13-11-12 / 12-11-11-13, la bonne jamais seule la plus longue ni la plus courte), vannes 12 en ligne + 18 neuves = 30 (3, 2, 3, 3, 2, 5), ordre de grandeur de 1 050 mots pour l'étape 1. Vidéos non visionnées (jugées sur les fiches).

## Note

| Critère de la grille | Note | Pourquoi, en une ligne |
|---|---|---|
| Vitrine (étape 1) | 9 | Sans parole, sans envoi, sans collègue, replis nommés (visio, pas de salle), scène lisible, exemple drôle (le carton). Reste : aucun pont explicite vers l'étape 2 (il tient aux titres 2 à 6, encore provisoires), durée par défaut mal décrite dans le document. |
| Peur « me griller » | 9 | Test de l'équipe entière, tableau §7 avec un repli par étape, demi-phrase du repli dans le `moduleDetail` des étapes 2 à 6 (seul texte que le visiteur voit en aperçu). Reste : le titre provisoire de l'étape 6 (« officiel ») rappelle la peur au lieu de la désamorcer. |
| Progression d'exposition lisible | 9 | Le tableau §7 donne qui l'entend et le repli, avec les titres vus par la visiteuse. Reste : ces titres sont provisoires alors qu'ils sont à l'écran pour tout visiteur. |
| Fiche et titre | 9 | Trois champs, trois idées ; titre A de 60 caractères sans « drôle / bureau / humour » ; « première étape gratuite » respecté ; description sans promesse « en réunion ». Reste : le « si » du témoignage B. |
| Quiz | 10 | Positions B, D, A ; longueurs tenues ; aucun mot repris de la question ; Q1 devenue juste (trois consignes du conseil, un seul vrai rival, expliqué) ; explications affichées quelle que soit la réponse. Rien à corriger. |
| Vidéos | 8 | VDB (obligatoire) et Vérino (durée réelle) sont tenables, Fary est écartée proprement. Reste : trois remplaçantes jugées sur fiches, une porte laissée ouverte à l'étape 6, vocabulaire « obligatoire / facultative » qui n'existe pas à l'écran. |
| Décision pour Thomas | 8 | « Cinq textes » est exact, colonne « effet » claire. Reste : « Je suis tes recos » décrit mal la reco vidéos, trois « si » sortent de la bouche de Thomas, le choix 8 est devenu sans objet. |
| Traces caduques | 8 | Le texte vivant est propre (plus de « en relecture », de Roumanoff, de « 90 mots »). Reste : 55 lignes d'historique à codes R/U en fin de document, titre « après l'itération 2 », une ligne qui renvoie à un choix qui ne la contient pas. |

**Note globale : 9/10** (moyenne 8,75). Aucun défaut ne touche la promesse centrale « sans te griller » ni l'étape 1.
**2 corrections bloquantes, 8 non bloquantes.** Les 2 bloquants traités : 9,5 (le document ne peut plus faire valider autre chose que ce qui part en ligne). Les 8 autres en plus : 10.

## Ce que le rendu actuel fait déjà (code lu, à garder en tête pour les choix 5 et 8)

1. **Toutes les vidéos d'une étape sont rangées sous un seul titre « Pour aller plus loin, facultatif »** (`parcours.ts` l.51-55, marqué PROVISOIRE ; `parcours-step-card.tsx` l.338-348). La lectrice ne voit ni « obligatoire » ni « facultative » : c'est un vocabulaire de fabrication. Le bloc **disparaît seul** quand l'étape n'a aucune vidéo (condition `videos.length > 0`) : pas de titre vide, la validation ne dépend pas d'une vidéo.
2. **La durée affichée par défaut est « Environ 15 min, hors vidéos »** (`dureeEtapeTexte`, `parcours.ts` l.40-44, utilisée si `dureeTexte` est vide) ; sans vidéo, elle devient « Environ 15 min » tout court.
3. **Le visiteur ne lit pas les vannes de l'étape 1, il en voit le nombre** (`step-blocks.tsx` l.119-149) ; les membres lisent le texte de la vanne et un lien « Voir la fiche » (l'explication est sur la fiche, pas dans l'étape). L'aperçu d'une étape 2+ montre « Ce que tu vas apprendre » (= `moduleDetail`), le format et le bouton Premium : ni durée, ni exercice, ni vannes (l.28-56).

## Parcours de la lectrice (cognitive walkthrough, 26 ans, CDI, peur de se griller)

| Étape | Sait-elle quoi faire ? Voit-elle l'action ? Le but est-il lié à l'action ? Feedback ? |
|---|---|
| Fiche du parcours | Oui : « une vanne que tu as gardée pour toi » et « le lundi à 9 h, un ton de compte rendu » la nomment. Le bouton « première étape gratuite » est le seul appel. |
| Titre de l'étape 1 | Oui : « sans un mot » répond à la peur avant le premier paragraphe. |
| Scène d'Anouk puis conseil et défi | Oui : trois traces notées, deux phrases, rien à dire. Le repli visio est dans le défi. |
| Quiz | Oui : explication affichée même sans faute ; Q3 traite son cas (agenda en visio). |
| Mur de validation | Hors périmètre du document (blocage s16 inchangé). |

`[FRICTION H4]` : à l'étape 6 d'un membre, le bloc « Pour aller plus loin, facultatif » n'existe plus et le texte d'accueil du verrou (« Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium », `parcours.ts` l.19) cite des vidéos que cette étape n'a pas. Solution : phrase du verrou rendue conditionnelle à la présence de vidéos (note @fullstack, correction 10).
`[FRICTION H2]` : à l'étape 6, la première-fois user lit environ 1 300 mots (conseil + exemple + défi = 590 mots, quiz de 4 questions, vannes) avant d'écrire un toast de 100 à 125 mots plus une vanne de rechange. `[ESTIMATION UX, mots comptés à l'œil]` Sans vidéo, la page affichera « Environ 15 min » sans réserve : c'est l'affirmation la plus exposée du parcours. Solution : correction 4.
Pas d'autre friction : le premier résultat concret (trois traces notées) arrive en 2 pas (fiche, étape 1), sous la limite de 3.

## Audit Nielsen (flow : visiteuse, fiche, étape 1, quiz)

H1 visibilité de l'état PASS (« Étape 1 offerte, étapes 2 à N avec Premium », durée) · H2 vocabulaire du persona PASS (vanne, boulot, « tu fais quoi dans la vie ? ») · H3 contrôle PASS (repli solo, aperçu sans ordre imposé, « Refaire le quiz ») · **H4 cohérence FAIL léger** (« obligatoire / facultative » dans le document contre « tout est facultatif » à l'écran ; verrou qui cite des vidéos à l'étape 6) · H5 prévention d'erreurs PASS (test de l'équipe, rien à envoyer à l'étape 1) · H6 reconnaissance PASS (titres explicites, exemple concret) · H7 raccourcis PASS (aucune étape bloquée) · H8 minimalisme PASS sous surveillance (`moduleDetail` de l'étape 1 à environ 137 mots avec la phrase `[SI 6B]`, un seul paragraphe) · H9 messages « Pas tout à fait » + explication PASS · H10 aide dans le flux PASS (repli écrit dans chaque défi).

## Les deux choix nouveaux de l'itération 2

**(a) Étape 6 sans vidéo « tant qu'aucune légende n'a passé l'aveugle ».**
Effet pour la personne qui arrive à la dernière étape : **quasi nul, plutôt positif**. Le bloc vidéo (déjà « facultatif » à l'écran) n'apparaît pas, rien ne manque à la validation, et les 4 à 5 minutes qu'une vidéo aurait prises vont à l'exercice le plus long du parcours. Le « modèle à regarder » existe déjà : l'exemple du toast de Claire dans le conseil (avec ses secondes) et les 5 vannes de rappel de l'étape. C'est aussi le seul choix honnête : le document dit lui-même qu'aucune vidéo du catalogue n'est juste.
**Le défaut est la condition, pas l'absence.** Elle ouvre une porte : si une légende « passe », Hamzawi (« Les chagrins d'amour », adéquation « moyenne à faible » selon le document) entrerait avant un toast. Or la relecture à l'aveugle juge l'écriture de la légende, pas l'adéquation de la vidéo à l'étape. Et Thomas n'aurait rien validé. Correction 2 : l'étape 6 est sans vidéo, point.

**(b) Témoignage B conditionnel à la relecture à l'aveugle de sa vanne.**
Lisible : oui (la même phrase revient aux quatre endroits, l.14, 23, 108, 347). Décidable : oui, puisque le repli A est écrit et déjà lu par Thomas ; ce n'est donc plus un bloquant (c'était celui de l'itération 2). Mais Thomas porte un « si » dont il ne verra pas l'issue, et l'issue la plus probable est A : sur les pilotes réseaux du 06/10, 2 vannes sur 360 ont atteint la barre (`founder-preferences.md`, ordre de grandeur de la difficulté, pas une prévision pour le catalogue). La vanne se décode en une seconde (l'ascenseur est si lent qu'il descend à pied, puis « n'a pas relevé » lève le doute sur « Il »), c'est le bon style de témoignage.
**Solution la plus simple pour Thomas : qu'il n'ait aucun « si » à porter.** La session lance la relecture à l'aveugle (2 critiques, départage si besoin, comme aux tours 1 à 6) sur ce témoignage **avant d'envoyer le document** ; le §2 affiche alors un seul texte, B ou A, ferme. Si la relecture ne peut pas être lancée avant l'envoi : A ferme (aucune vanne publiée, tous les éléments existent dans les étapes), et B reste dans l'historique git. Correction 3.

## Corrections bloquantes

**1. « Je suis tes recos » ne décrit pas la reco vidéos : Thomas valide plus que ce qu'il lit.**
Emplacement : l.23 (« B (vidéos : Vérino en facultative de l'étape 1, étape 6 sans vidéo) ») ; l.17 (cellule Reco) ; l.347 (« Attend Thomas »).
Problème : la reco B change quatre vidéos (Vérino à l'étape 1, Croce « avion » à l'étape 2, Guiz « fast-food » à l'étape 4, Rollman « relations sociales » à l'étape 5, §6 l.273-277), mais la phrase que Thomas va recopier n'en cite qu'une et l'étape 6. Même défaut que « quatre textes » en itération 2 : « je suis tes recos » valide un contenu non nommé. Les lettres B, A, A… ne sont pas numérotées comme le tableau.
Correction : remplacer l.23 par une réponse numérotée qui nomme tout, et sortir les « si » de la réponse :
> **« Je suis tes recos » suffit.** Réponse type : 1 oui, 2 B, 3 A, 4 A, 5 B, 6 B, 7 oui, 8 a.
> 1 : les cinq textes du §1 (étapes 1, 3, 4, 5, 6). 2 : description et accroche B, témoignage (voir ci-dessous). 3 : titre A, slug `boulot`. 4 : 12 vannes en ligne et 18 neuves relues à l'aveugle. 5 : Vérino en facultative de l'étape 1, Croce « avion » à l'étape 2, Guiz « fast-food » à l'étape 4, Rollman « relations sociales » à l'étape 5, étape 3 comme la spec, étape 6 sans vidéo (« B sauf étape X » pour en retirer une). 6 : un seul test. 7 : retouche du PS. 8 : pas de plafond.
> **Ce que je fais ensuite sans te redemander** : (i) la vanne du témoignage B n'est publiée que si elle passe l'aveugle, sinon c'est le témoignage A ; (ii) la retouche du PS repasse l'aveugle avant la base ; (iii) toute vidéo qui ne tient pas au visionnage sort (voir 7).
Même formulation dans la cellule Reco de la ligne 5 du tableau et dans « Attend Thomas ».

**2. Étape 6 : rendre l'absence de vidéo définitive.**
Emplacement : l.17 (cellule Options : « sans vidéo tant qu'aucune légende n'a passé la relecture à l'aveugle ») ; l.278 (§6, ligne 6, colonne B, avec Hamzawi « n'entre que si sa légende est jugée ») ; l.282-283 ; l.349 (« Décisions prises »).
Problème : voir (a). La condition fait dépendre une vidéo de la dernière étape d'un événement futur que Thomas ne voit pas, avec un test qui ne mesure pas l'adéquation. Sa cellule dit aussi « tant qu'aucune légende » (l.17) alors que « Je suis tes recos » dit « sans vidéo » (l.23) : deux formulations pour un seul choix.
Correction : cellule B de l'étape 6 : « **Aucune vidéo.** Le bloc vidéo disparaît seul de l'écran et la durée n'a plus de « hors vidéos ». L'exemple du toast dans le conseil et les 5 vannes de rappel servent de modèle. » Déplacer Hamzawi, Rollman « Les enterrements de vie » et Fary dans une note « Pistes écartées » d'une ligne chacune (avec la raison), sans condition d'entrée. Si Thomas veut une vidéo plus tard, c'est une nouvelle décision. Écrire pour le `moduleFormat` de l'étape 6 : « Un conseil, un défi, 5 vannes, un petit quiz. » `[PROPOSITION]`.

## Corrections non bloquantes

**3. Témoignage : un seul texte ferme au §2, plus de « si » dans la réponse de Thomas.** Emplacement : l.14, l.108, l.347, l.349. Correction : voir (b). Lancer l'aveugle avant l'envoi, écrire « Témoignage B (a passé l'aveugle) » ou « Témoignage A (B n'a pas passé) », supprimer `[À PASSER À L'AVEUGLE]` et la phrase « témoignage B si sa vanne passe, sinon A » du tableau et du handoff.

**4. Durée : décrire ce que la page affiche vraiment, et ne pas laisser l'étape 6 dire « Environ 15 min » sans l'avoir mesuré.** Emplacement : l.141 (`dureeTexte`), l.332 (signalement 7), l.119.
Problème : le document craint qu'« aucune durée ne s'affiche » tant que la mesure manque ; le rendu affiche « Environ 15 min, hors vidéos ». Pour l'étape 1 c'est vrai avec le défi (environ 1 050 mots, soit 5 à 6 minutes, plus le quiz, plus 3 à 5 minutes de défi : 11 à 13 minutes), donc la formule conditionnelle « 15 minutes, plus un défi dans ta journée » est inutile ici. Pour l'étape 6, sans vidéo, le texte par défaut deviendrait « Environ 15 min » alors que la lecture seule fait environ 7 minutes avant d'écrire le toast.
Correction : l.141 : « Par défaut la page affiche « Environ 15 min, hors vidéos » ; vrai pour l'étape 1 défi compris `[HYPOTHÈSE : à mesurer à l'import]`. » Signalement 7 : ajouter « mesurer l'étape 6 en premier ; si le toast dépasse, `dureeTexte` de l'étape 6 : « Environ 10 min de lecture et de quiz, plus le temps d'écrire ton toast » `[PROPOSITION]` ». Supprimer l'hypothèse « le défi est hors des 15 minutes » comme règle générale.

**5. « Elle s'affiche avec la vanne » est inexact, et la vitrine ne montre pas les vannes.** Emplacement : l.206 (canapé, « l'explication... s'affiche avec la vanne »), l.119 (« il lui manque 3 vannes »), l.205.
Problème : le visiteur voit « 5 vannes » sans texte ; le membre voit la vanne et un lien vers sa fiche, où se trouve l'explication. La réserve du canapé reste vraie, mais elle touche le membre, pas la vitrine. Dire à Thomas que trois vannes manquantes « à l'étape que le visiteur lit avant de payer » pèse plus qu'en réalité.
Correction : « l'explication en base, visible sur la fiche de la vanne, appelle la chute une petite critique douce de l'entreprise » ; encadré du §3 : « le visiteur voit le nombre de vannes, pas leur texte ; les 3 vannes manquantes concernent les membres ». Ne pas changer la classification « acceptable ».

**6. Vidéos : poser le vocabulaire de l'écran, retirer le seul `[À MINUTER]`.** Emplacement : l.268, l.271-278, l.282, l.285 (choix 8), tableau des choix l.20.
Problème : « obligatoire / facultative » et le plafond de 5 minutes n'ont pas de sens pour la lectrice (tout est « facultatif » à l'écran, la durée annoncée est « hors vidéos »). Ils créent le seul `[À MINUTER]` de la reco B (Rollman « Les relations sociales », 5 min 20, un extrait de 20 secondes à fixer sans avoir regardé la vidéo) et les 5 extraits du choix 8b.
Correction : une phrase en tête du §6 : « À l'écran, toutes les vidéos d'une étape sont sous « Pour aller plus loin, facultatif » ; « obligatoire » veut dire « placée en premier, sous 5 minutes ». » Étendre la reco 8a : « aucune vidéo n'est découpée, y compris l'obligatoire de l'étape 5 (5 min 20) ». Retirer le tag `[À MINUTER]` de la ligne 5. `[À VÉRIFIER @fullstack : le titre « Pour aller plus loin, facultatif » est marqué PROVISOIRE dans le code ; s'il change, ce vocabulaire suit.]`

**7. Vidéos jamais visionnées : écrire la règle de sortie.** Emplacement : l.7, l.269, l.282.
Problème : « Tu peux me demander de regarder avant de trancher » laisse Thomas décider d'un visionnage. Trois remplaçantes (Croce « avion », Guiz « fast-food », Rollman « relations sociales ») reposent sur une fiche, et la durée de Croce est contradictoire (fiche 5 min, base 2 min 30).
Correction : « Avant l'import, la session regarde chaque vidéo retenue (ou lit sa transcription) ; celle qui ne tient pas est retirée, et l'étape garde ses autres vidéos : le bloc est facultatif, il se réduit ou disparaît sans rien casser. Tu n'as rien à trancher de plus. » Cela remplace la phrase « Tu peux me demander de regarder ».

**8. Titres des étapes 2 à 6 : ils sont à l'écran pour tout visiteur, c'est eux qui donnent envie de l'étape 2.** Emplacement : l.295-302 (§7), l.141.
Problème : provisoires (titres de la spec), jamais présentés comme tels à Thomas dans le tableau des choix. Le titre de l'étape 6, « Prendre la parole quand c'est officiel », réveille la peur au lieu de la désamorcer. Le texte de l'étape 1 ne contient aucune phrase de pont : sans la phrase `[SI 6B]`, rien ne dit « et ensuite » en dehors de la liste des titres.
Correction : ajouter sous le tableau §7 : « Ces titres sont visibles de tous sur la page du parcours ; @copywriter les finalise avec chaque étape. » Proposition pour l'étape 6 `[PROPOSITION, à passer par @copywriter]` : « Un mot de départ en soixante secondes, une seule vanne » (annonce la taille et le cadre). Ne pas faire de la phrase `[SI 6B]` le seul pont vers la suite : si Thomas choisit A au choix 6, la liste des titres suffit, à condition qu'ils soient finalisés.

**9. Historique et traces dans le fichier de Thomas.** Emplacement : l.1 (« version après l'itération 2 »), l.353-410 (« Historique des corrections » : codes R1, U1, @reviewer, @ux, 30 lignes), l.350 (« notes d'itération 2 de @reviewer et @ux »), l.351 (« nombres recomptés après l'itération 2 »), l.111 (« ton choix 2 la valide », alors que le choix 2 ne contient pas cette ligne).
Correction : déplacer les lignes 353-410 dans `docs/marrant/parcours-boulot-s19/iterations/` à l'envoi (la consigne de l'itération 2 l'interdisait, celle de l'itération 3 ne l'interdit pas à la session) ; titre : « version envoyée à Thomas » ; retirer « ton choix 2 la valide » ou ajouter la ligne au tableau.

**10. Petits alignements pour @fullstack (handoff, rien à décider).** Emplacement : handoff l.348.
Ajouter : `[À VÉRIFIER @fullstack : (1) le texte du verrou « Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium » ne cite « les vidéos » que si l'étape en a ; (2) la spec RC8 et le document disent que l'aperçu d'une étape 2+ montre la durée, le code actuel (`LockedStepPreview`) n'en montre aucune : décider si on l'ajoute ou si on corrige la phrase ; (3) corriger la durée de Vérino en base avant l'import (signalement 11).]`

## Points solides à ne pas défaire

Étape 1 sans parole, sans envoi, sans collègue, avec repli visio ; tableau de différence avec Machine à Café 2 et Confiance 1 ; tableau d'exposition §7 avec un repli par étape ; test unique en dernière phrase des étapes 2 à 6 (visible en aperçu) ; « cinq textes » exact partout ; colonne « Ce que ça change pour la lectrice » ; titre A comptée à la main (60 / 56 / 57) ; description B sans promesse « en réunion » ; accroche sans accord au masculin ; Q1 à trois consignes du conseil ; vanne du mug sortie de l'étape 6 ; Fary écartée de la vitrine tant que sa durée n'est pas lue ; durée de Vérino corrigée et signalée ; refus des vannes qui visent une personne ; « tes notes » à la place de « carnet ».

## Pour l'itération 4

À re-vérifier : (1) « Je suis tes recos » numérotée, qui nomme les quatre vidéos et l'étape 6 sans vidéo, sans « si » ; (2) étape 6 sans condition, plus de Hamzawi dans une cellule « Options » ; (3) un seul témoignage ferme au §2, avec le résultat de l'aveugle écrit ; (4) durée : une phrase sur l'affichage par défaut, étape 6 à mesurer ; (5) phrase sur les vannes visibles (nombre pour le visiteur) ; (6) vocabulaire de l'écran en tête du §6, plus aucun `[À MINUTER]` dans la reco B ; (7) règle de sortie des vidéos non visionnées ; (8) titres 2 à 6 présentés comme visibles et provisoires ; (9) historique sorti du fichier. Si les 2 bloquants sont traités : 9,5. Avec les 8 autres : 10. Limite connue qui ne bloque pas le 10 si la règle de sortie (7) est écrite : aucune vidéo n'a été visionnée.
