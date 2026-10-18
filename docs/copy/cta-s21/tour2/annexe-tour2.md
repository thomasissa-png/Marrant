# Annexe tour 2, packs 1 et 2 (hors relecture : ne pas transmettre aux relecteurs aveugles)

Packs : `pack-1-tour2.md` (B1, B2, B18) et `pack-2-tour2.md` (B3, B4 + B5, B6). Positions A/B et sources des faits : `cles-tour2.md`. Pas de nouvelle recherche de marché : tour de correction ciblé sur les verdicts du tour 1 (6 relectures). Mesure du diff : comptage manuel de mots entre le gagnant du tour 1 et A, marge d'erreur de quelques points.

## 1. Ce qui a changé et pourquoi (A = gagnant corrigé, B = challenger)

### B1, encart au milieu de l'article (gagnant du tour 1 : le carnet)
- **A** : `[S1]` « Carnet d'octobre · Situation 1, offerte » devient « Une situation de répartie, à lire en entier » (jargon et mois en dur supprimés, « offerte » sonnait vente). Le bouton « Lire la fiche en entier » devient « Voir la sortie polie et l'exercice » (il dit ce qu'on gagne au clic). `[S7]` : « Gratuit, sans compte. » ajouté, et « Premium » est expliqué une fois (« l'abonnement du site »). Diff : 27 % du texte final est neuf (vanne, réplique et « Pourquoi ça marche » intacts).
- **B** : angle « énigme » : la situation et ce qu'on te dit, la réplique est cachée (« Tu réponds quoi ? »), bouton « Voir la réplique ». Même destination. Le clic rapporte quelque chose de visible, la carte est plus courte (≈ 310 px estimés). Risque à lire dans les verdicts : effet « teaser » perçu comme racoleur.
- **Framework** : démonstration d'abord puis un seul pas. **Conscience** : Problem-Aware faible. **Objections** : « ça va me coûter ? » (« Gratuit, sans compte »), « Premium, c'est quoi ? » (expliqué).
- **Pont avec l'article** (remarque r3) : non traité par le texte, à traiter par le choix de la fiche affichée.

### B2, bloc de fin d'article (gagnant : le programme sans vanne)
- **A** : tout ce qui n'était pas dans les faits est retiré (« exercices progressifs », « pensés pour les timides », liste « chambrage, TD, raté »). Le titre ne promet plus de résultat (« Quand on te chambre et que rien ne sort »). Le paragraphe décrit le vrai contenu : une étape par semaine, 20 minutes, un conseil, un défi, des vannes, des vidéos, un quiz, puis les 4 thèmes réels (ironie bienveillante, rythme et silences, méthode en trois temps, rattraper une vanne qui tombe à plat). Sources dans `cles-tour2.md`. `[S9]` : prix mensuel et annuel, phrase de garantie reprise mot pour mot, et la ligne dit que « Les parcours complets sont dans Premium », donc la destination du lien est claire. Diff : environ 85 % du texte hors boutons réécrit ; surtitre, bouton et lien « Accéder aux parcours complets » intacts.
- **Nota** : la description du parcours Répartie dans le seed contient elle-même « exercices progressifs pensés pour les timides » et « juste de ne plus rester muet » (`parcours-seed.json` l. 263). Ces phrases existent donc déjà sur le site. Je ne les reprends pas (promesse de résultat). À traiter avec Thomas si on veut les corriger à la source.
- **B** : angle « preuve par la technique » : vanne décryptée (phrases 1 seulement du décryptage, pour tenir 560 px) puis une ligne de format du parcours. Titre « Après les blagues à raconter, la répartie pour répondre » (corrige « techniques » et « parcours guidé »).
- **Framework** : A preuve par le programme, B preuve par la technique. **Conscience** : Problem-Aware vers Solution-Aware. **Objections** : « c'est quoi exactement ? » (contenu réel), « ça coûte combien, et si ça ne me va pas ? » (`[S9]`).

### B18, la lettre
- **A** : « pour t'entraîner » supprimé (le visiteur n'est pas prêt à s'entraîner), plus de répétition titre/sous-titre, deux éléments au lieu d'une triade. Note : « Désinscription en un clic » ajouté. Ligne repliée : « La vanne du mois, expliquée. Gratuit, par e-mail. » (49 caractères, 28 + 20) avec « gratuit » (manquait).
- **B** : angle « petit engagement » : la boîte mail et la fréquence, ce qui la fait marcher en second. Ligne repliée « Une vanne par mois, gratuite, par e-mail. » (41 caractères), bouton « Je veux la lettre » (17).
- « pour en écrire une à ta façon » est supprimé partout (finalité non sourcée). Les deux textes s'en tiennent à « un exercice en trois étapes, avec un exemple ».
- **Framework** : valeur d'abord, petit engagement. **Conscience** : Unaware à Problem-Aware. **Objection** : « encore un e-mail commercial / je ne pourrai plus me défaire » (contenu précis, désinscription).

### B3, haut de l'accueil (gagnant : étape 1 gratuite en plein)
- **A** : bouton « Lire l'étape 1 gratuite de Répartie » (35 caractères, ≈ 262 px pour ≈ 295 px disponibles à 375, contre 43 caractères avant). Le nom du parcours est gardé. Note réordonnée : « L'étape 1 se lit sans compte, quiz compris. » d'abord, puis « Les parcours complets sont dans Premium : 2,99 € TTC par mois, résiliable en ligne, premier paiement remboursable sous 14 jours. » : plus de « sans compte » collé à Premium, destination du lien E1 claire, « sans engagement » absent. Lien E1 intact. Diff : bouton 2 mots sur 7, note 100 % réécrite.
- **B** : angle « offre d'abord » (E1 en plein, intact, pour que la forme demandée par Thomas soit testée avec une note qui dit où il mène). Note juste sous le plein (prix, résiliation, garantie), lien « Lire l'étape 1 de Répartie, gratuite et sans compte » en dernier. Ce lien fait 51 caractères : il peut passer sur 2 lignes à 375, acceptable pour un lien.
- **Libellé touché** : « Lire la première étape gratuite » devient « Lire l'étape 1 gratuite » dans A, sur instruction de raccourcir. Repli si Thomas tient à « première » : « Lire la 1re étape gratuite de Répartie » (38 caractères, ≈ 285 px, trop juste) ou « Lire la première étape gratuite » sans le nom (31, ≈ 235 px).
- **Framework** : promesse puis un seul pas. **Conscience** : Problem-Aware. **Objection** : « dois-je payer pour voir ? ».

### B4 + B5, carte Premium (verdict partagé 1 contre 2, version hybride)
- **A** (hybride demandé) : titre « Après les vannes, les parcours » (référent clair : les vannes vues plus haut ; plus de « Tu crois avoir tout essayé »). Paragraphe : « Lire des vannes, c'est un début » (idée « lire ne suffit pas » sans « s'entraîner à répondre sur le moment »), 15 à 20 minutes, un défi à chaque étape, puis une seule phrase de correspondance parcours/persona (plus de série « Tu… ? Il y a X. »). `[S12]` : « Ou 24,99 € TTC par an, soit 2,08 € par mois · Droit de rétractation » (le « Ou » est rattaché au prix, plus de « Annulable »). `[S13]` : mot pour mot. La résiliation n'est dite qu'une fois (`[S13]`). Effort 15 à 20 minutes : vérifié (`cles-tour2.md`).
- **B** : angle « essaie d'abord » : titre « La première étape est gratuite, la suite est dans Premium », même `[S12]`, `[S13]`, même phrase de correspondance.
- « Droit de rétractation » est gardé comme lien (doublon autour supprimé). Fallback si le prix annuel n'est pas configuré : `[S12]` = « Droit de rétractation » seul.
- **Framework** : A [PAS léger : le début (lire), le prolongement (parcours)], B [essai sans risque puis offre]. **Conscience** : Solution-Aware vers Product-Aware. **Objections** : « pourquoi payer alors que j'ai vu du gratuit ? », « est-ce pour moi ? » (correspondance), « et si ça ne me va pas ? » (`[S13]`, contour).

### B6, bouton d'en-tête
- **A** : « Voir l'offre », inchangé (72 px estimés). Le point à corriger relevé par les 3 relecteurs était la place, pas le mot : voir §3. Nom accessible conseillé : « Voir l'offre Premium ».
- **B** : « Voir les prix » (81 px estimés), angle transparence. Rejeté par construction : « Tout débloquer » (106 px) et « Premium 2,99 € » (109 px) dépassent la place à 360 px.

## 2. Libellé de remplacement proposé pour E1 (question à poser à Thomas)

« Accéder aux parcours complets » (choix du 06/10, laissé intact partout dans ce tour). 5 relecteurs sur 6 lui reprochent de ne pas dire qu'il mène au paiement : « accéder » promet une entrée directe, et on arrive sur une page de prix.
- **Proposition principale : « Voir les parcours complets »** (26 caractères au lieu de 29). Un seul mot change, « voir » annonce une page de présentation (c'est ce qu'est la page d'abonnement : prix, garantie, extrait du carnet), les mots « parcours complets » de Thomas sont conservés. La ligne voisine (prix et garantie) reste nécessaire.
- **Variante avec prix : « Parcours complets dès 2,99 €/mois »** (33 caractères). Dit l'argent dans le libellé, cohérent avec « Commencer à 2,99 €/mois ». Trop long pour un plein à 375 px s'il est précédé d'un verbe.
- À éviter : « Débloquer les parcours complets » (ton vente), « Voir l'offre Premium » (Premium inconnu du visiteur).

## 3. B6 : la place réelle dans l'en-tête (contradiction « une dizaine » contre 14)

Les deux chiffres sont faux : la limite est en pixels, pas en caractères. Calcul d'après `apps/web/src/components/layout/header.tsx` (l. 69-76, 148-184) et `button.tsx` (l. 22 : `px-3 text-sm`, `max-md:h-11`) :
- À **360 px** (largeur où le bouton apparaît, `min-[360px]:inline-flex`) : zone utile 360 − 2×16 = 328 px. Le logo (`shrink-0`, 16 px sous 400 px) prend environ 145 à 165 px, l'écart `gap-2` 8 px, le menu 44 px plus 4 px d'espace. Reste **≈ 107 à 122 px pour le bouton, padding de 24 px compris**, donc **≈ 83 à 98 px de texte**. Le spec design donne ≈ 107 px pour « Commencer » à 360.
- À 440 px (l'icône de recherche apparaît) et 520 px (« Connexion » apparaît) : ≈ 141 px et ≈ 131 px de bouton. La contrainte serrée est donc 360 px, puis 520 px.
- **Limite exacte retenue : le libellé ne doit pas être plus large que « Commencer » (≈ 85 px en Inter 600, 14 px, estimation par métriques de police, ±5 px), qui est le seul libellé dont le rendu à 360 est connu.** En caractères : 9 à 10 de largeur moyenne, 12 à 13 si le mot compte des lettres étroites (i, l, r, f).
- Estimations (même méthode) : « Voir l'offre » ≈ 72 px (passe, marge ≈ 13 px), « Voir les prix » ≈ 81 px (passe de justesse), « Tout débloquer » ≈ 106 px (déborde), « Premium 2,99 € » ≈ 109 px (déborde).
- **Je n'ai pas pu faire de rendu** (pas d'outil d'exécution dans cette session) : la valeur est une estimation. Le garde-fou `header-budget` ne couvre que 1024 à 1920 px (`docs/qa/captures-s21/final/header-budget-resultat.txt`) ; il faut y ajouter 360 et 375 px.
- Le menu mobile (l. 280-286) est pleine largeur : aucune contrainte.

## 4. Points à vérifier par @fullstack avant mise en ligne

1. **B1** : le mois n'apparaît plus dans le texte, donc plus de texte périmé le 1er novembre. Mais `[S2]` (« Dans l'ascenseur, un voisin te lance : … ») est écrit à la main pour la fiche d'octobre. Pour un contenu récurrent généré : ajouter un champ court `accroche` (≤ 75 caractères) au schéma de fiche (`lib/carnet.ts` l. 30-40) et au prompt de génération du carnet ; `[S5]` = première phrase de `pourquoi` (≤ 130 caractères), découpée par code. Fiche affichée : `getCurrentCarnet().fiches[0]` ; pas de carnet ouvert = pas d'encart. Vérifier que `/carnet` affiche bien la fiche gratuite en tête et que la fiche 1 donne « sortie polie » et « exercice » à un visiteur (`carnetViewForPlan`).
2. **B2** : confirmer en base que les 4 étapes de Répartie ont les titres, le format et la durée du seed (décision d'alignement du 12/10), et que la description du parcours n'est pas affichée à côté du bloc (voir Nota §1). Remplir `finTexte` (vide aujourd'hui, `encarts-blog-s20.ts` l. 55), supprimer `finPuces` pour Répartie. `[S9]` : prix par `prixTtcLabel`, annuel seulement si `isAnnualPlanAvailable()`, phrase de garantie par `REASSURANCE_PAIEMENT`. La note existante `TEXTES_BLOC_FIN.note` (l. 139 : « sans engagement ») est fausse pour l'annuel : à remplacer.
3. **B18** : « Désinscription en un clic » ajouté à la réassurance (`config/textes/lettre-s21.ts` l. 72, sur la branche d'intégration) : **accord @legal à demander** (la case de consentement le dit déjà, l. 67). Vérifier le mécanisme réel : lien du pied de message, page « Arrêter la lettre ? » avec un bouton « Me désinscrire » (l. 124-129), `List-Unsubscribe-Post` : si le lien exige un second clic, la formule reste vraie pour les clients mail qui gèrent le one-click, mais à confirmer avec @legal. **Les 4 premiers numéros de `numeros.json` contiennent « sans engagement » dans la mention Premium** (faux pour l'annuel) : à remplacer par « résiliable en ligne » ; vérifier les numéros 5 et 6.
4. **B3** : mesurer le bouton à 360, 375, 390 px (estimation 262 px sur 295 disponibles) et la hauteur du premier écran avec la note de 4 lignes à 12 px. Destination du plein E1 (texte B) : `/abonnement?src=accueil-cta` recommandée plutôt que `/register`.
5. **B4 + B5** : la phrase de correspondance doit être construite depuis `PREMIUM_PARCOURS` (Storytelling et Boulot dépendent de `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE`) ; `[S12]` dépend de `isAnnualPlanAvailable()`.
6. **B6** : changer le libellé aux trois endroits de `header.tsx` (l. 141, 171, 285), l'adresse vers `/abonnement?src=header` (aujourd'hui `registerHref`), masquer le bouton sur `/abonnement` et `/register`, mettre à jour `__tests__/layout/header.test.tsx` (l. 47-104 attendent « Commencer »), ajouter 360 et 375 px à `header-budget`.
7. **Hauteur** : B2 texte B (≈ 520 px estimés) et B3 note (4 lignes) sont les deux risques de dépassement ; B1 A ≈ 380 px estimés, proche de la limite de 400.
8. **Vérification de typographie** : zéro tiret cadratin dans les deux packs (contrôle par recherche), `joke-decryptages.json` non touché.

## 5. Intouchables conservés

« Lire la première étape gratuite de Répartie » (B2, B4 + B5), « Commencer à 2,99 €/mois », « Déjà 1 500+ inscrits, et toi ? », « 1 500+ membres », « Accéder aux parcours complets » (B2, B3 : intact), les 4 avantages, `[S13]` mot pour mot, le lien « Droit de rétractation », H1, paragraphe et pastilles de l'accueil, prix et durées. Aucune URL ni slug modifié.

## Correction de l'orchestrateur avant relecture (18/10)
- B3, texte A : bouton remis à « Lire la première étape gratuite de Répartie » (patron validé, lot 2 G9, identique à B2 et B4+B5). Le raccourci « Lire l'étape 1 gratuite » touchait un libellé [CHOIX UTILISATEUR]. Le bouton est en pleine largeur avec retour à la ligne équilibré : @fullstack mesure à 360, 375 et 390 px ; si deux lignes posent problème, la question passe à Thomas.
