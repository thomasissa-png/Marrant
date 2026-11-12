# Tour 1, relecteur @ux (à l'aveugle) : architecture de contenu de l'espace Premium s24

> Documents notés : `inventaire-cartographie-s24.md` (PM) et `architecture-pedagogique-s24.md` (creative-strategy). Références lues : capture, `founder-preferences.md` (l. 1-82 et 140-163), brief s24 §0 à §4. Angle demandé : parcours de l'abonné (premier jour, retour à J7, habitude) et navigation.
> Limite de ma relecture : aucun outil de recherche dans le code ; je n'ai pas pu vérifier `parcours-seed.json` (vidéo Paul Séré, `difficulty`), ni `personas.md`, ni les lignes 83 à 139 de `founder-preferences.md` (décisions du 19/10 au 24/10 citées par l'architecture). Ces points sont marqués [NON VÉRIFIÉ].

## 1. Notes

| Critère | Note /10 | Justification courte |
|---|---|---|
| C1 Valeur réelle Yanis, Sophie, Marc | 7 | Situation, Grammaire, Exercice ont une valeur claire par persona ; Atelier, Expressions, Guides moins défendus ; Marc affaibli par l'exclusion « rupture » (Q6 B) |
| C2 Respect des décisions | 6 | Plusieurs options de questions contredisent une décision sans être marquées ; l'étape est allongée au-delà de « 15 à 20 min/semaine » sans question |
| C3 Zéro donnée inventée | 6 | « 290+ vannes », « 60+ conseils » faux (149 et 120) ; volumes V1 non marqués [HYPOTHÈSE] ; « 22 situations » dans les lettres surestimé |
| C4 Rubriques claires en 3 secondes | 6 | « Les bases » ambigu, « Bibliothèque » et « Les bases » se ressemblent ; Carnet et Situations en double ; Articles, Quiz, Glossaire sans place |
| C5 Ambition | 8 | 220 fiches neuves, 9 types, V1 complète : à la hauteur ; il manque la vie après la V1 (J7, habitude) |
| C6 Cohérence entre documents et code | 5 | Ateliers « sans objet » contre 8 ateliers ; 6 fiches contre 7 ; numérotation Q1 à Q8 qui entre en collision avec Q1 à Q12 du brief ; chiffres de la section 6 non reportés dans le corps |
| C7 Faisabilité de production | 6 | Aucun rendement de la barre Alexa chiffré (2 sur 360 au pilote P0) ; vérification des citations sans méthode ni responsable ; charge de Thomas non chiffrée |
| C8 Qualité des questions | 6 | 3 options et recos présentes, mais options qui contredisent une décision non marquées, numérotation ambiguë, options de §2.5 et de Q2 qui divergent |
| C9 Exemples au ton maison | 6 | Ton juste, zéro tiret cadratin, zéro émoji (lus), mais gradation de la Situation non tenue, exemple Expression contredit sa règle, corrigé d'exercice sans réponse |
| C10 Progression pédagogique | 5 | Aucune échelle du premier pas de 5 minutes à l'avancé ; « niveau = étiquette » ; pas de fil entre parcours ; aucune fiche d'entrée désignée par persona |

**Note globale : 6,1 / 10** (61 sur 100 : 7+6+6+6+8+5+6+6+6+5).

## 2. Corrections exigées (numérotées)

### Bloquantes

**1. [BLOQUANT] Le découpage exemple perd du contenu validé et allonge l'étape (C2, C6, C7).**
Passage : architecture §2.2, tableau Machine à Café étape 1 (1.1 à 1.6) et « les éléments validés deviennent des fiches, mot pour mot » ; inventaire §1.2 et §3.1 (étape = conseil, défi, 5 vannes, 2 vidéos, quiz).
Problème : l'exemple ne reprend qu'UNE vidéo et AUCUN défi, tout en ajoutant deux fiches neuves (1.2 Grammaire, 1.5 Situation). L'étape passe de 6 blocs à 6 fiches dont 2 neuves, donc des blocs validés disparaissent en silence, et la durée monte (6 fiches de 5 min = 30 min) contre « 15 à 20 min/semaine » ([CHOIX UTILISATEUR] 29/09 et 07/10, Machine à Café 15 min). L'inventaire §3.1 chiffre déjà 24 à 25 min et pose la question, l'architecture l'ignore.
Correction : refaire l'exemple en listant les 6 blocs existants (conseil, défi, 5 vannes, vidéo 1, vidéo 2, quiz) avec leur sort, puis les fiches neuves AJOUTÉES, et afficher la durée totale par étape. Poser à Thomas la vraie question : garder « 15 à 20 min » (vidéo 2 facultative, fiches neuves en option « pour aller plus loin ») ou corriger la promesse (décision de chiffre : jamais sans son GO).

**2. [BLOQUANT] Aucun parcours de l'abonné dans le temps : premier jour, J7, habitude (C10, C1, C5).**
Passage : architecture, tout le document ; seule mention « La réplique du jour » (§1.4, « seuil du 24/10 ») sans rubrique ni écran.
Problème : l'espace est décrit comme un stock de 220 fiches, pas comme un chemin. Rien ne dit : quelle fiche un abonné ouvre à la minute 1 (Yanis, Sophie, Marc), ce qu'il trouve quand il revient à J7 (rythme doux = +7 jours, `NEXT_STEP_DELAY_DAYS`), ce qui l'accroche en semaines 2 à 4, ce qui est nouveau chaque semaine. Devant 90 situations avec 3 filtres, Yanis (introverti) fait face à un mur de choix.
Correction : ajouter une section « Parcours de l'abonné » avec, par persona : fiche d'entrée de 5 minutes nommée (ex. une Situation d'entrée), J1 (premier pas), J7 (ce qui l'attend : étape conseillée, nouvelle fiche, lettre du jeudi), semaines 2 à 4 (cadence de nouveauté : par ex. une Situation de la semaine, à décider), et la vie après la V1 (qui ajoute quoi, à quel rythme, en lien avec la règle « chaque mois en session » du 25/10). Désigner une « Situation du jour » ou « de la semaine » dans « Aujourd'hui ».

**3. [BLOQUANT] Aucune échelle de progression « premier pas de 5 minutes à l'avancé » (C10).**
Passage : architecture §2.1 option A (« Pas de fil progression de A à Z entre parcours »), §2.3 (« Niveau : étiquette… aucune règle de déverrouillage »).
Problème : la reco A accepte explicitement l'absence de fil. Il n'existe nulle part un contenu « avancé » (les 9 types sont tous de niveau indifférencié), ni un ordre de lecture des rubriques transversales (faut-il lire Les bases avant Situations ?). Le sens de l'ensemble, critère C10, n'est pas montré.
Correction : définir 3 paliers de LECTURE sans inventer de niveaux d'accès (déjà permis : étiquette, ordre conseillé) : « Premier pas (5 min) », « Prendre le pli (semaines 1 à 4) », « Aller plus loin (écouter, ateliers, parcours Storytelling et Boulot) », et affecter chaque type de fiche à un palier. Ajouter un schéma « ordre conseillé » (Aujourd'hui, première Situation, première fiche de Grammaire, Machine à Café 1, etc.) et dire où vit le contenu avancé. Les valeurs `difficulty` des 5 parcours doivent être lues, pas supposées [NON VÉRIFIÉ chez moi].

**4. [BLOQUANT] Faits faux ou périmés dans l'architecture, non réconciliés avec la section 6 de l'inventaire (C3, C6).**
Passages : architecture §1.4 Grammaire « les 290+ vannes du catalogue » ; §1.4 Guide « les conseils du catalogue (60+) » ; §1.4 Vocabulaire « glossaire existant (contenu exact [À VÉRIFIER]) » ; Annexe (6 points « à confirmer ») ; inventaire §1.1 (vannes « 132 actives », « 708 lignes », carnet « ≈ 15 / ≈ 30 », « 97 conseils ») et §4.2 T1 (« 132 vannes actives »), §5 questions 5 et 6 (« non lu »).
Problème : la production donne 149 vannes, 120 conseils, 89 vidéos (§6, 12/11) ; l'architecture dit 290+ et 60+. Le corps de l'inventaire contredit sa propre section 6 (132 contre 149, ≈ 38 contre 38 exact) et la section 6 est posée APRÈS le commentaire « Fin du document » : un relecteur du corps lit des chiffres périmés. La section 6 cite `joke-decryptages.json` (264 décryptages) alors que l'architecture cite `blagues-decryptage.json` ; 264 décryptages pour 149 vannes actives n'est pas expliqué.
Correction : reporter les chiffres de la section 6 dans §1.1 et §4.2, supprimer les « ≈ » levés, déplacer la section 6 avant la clôture ; corriger « 290+ » en 149 et « 60+ » en 120 ; fermer l'Annexe de l'architecture avec les réponses (glossaire = 12 termes, carnet = 15 + 30, lettres = 6 + 16) ; nommer le bon fichier de décryptages et dire pourquoi 264 > 149.

**5. [BLOQUANT] Contradictions entre les deux documents (C6).**
Passages : inventaire §2 ligne 16 « Ateliers : SANS OBJET » contre architecture type 9 « Atelier, 8 en V1 » ; inventaire §3.1 (6, 7 ou 11 fiches par étape ; total 150/175/275) contre architecture §2.2 (5 à 6 fiches, « 125 à 150 ») ; inventaire D1 / §4.3 « 22 situations avec 3 répliques » contre inventaire §1.1 (W47 = décryptage, pas une situation) ; architecture §1.3 type 8 (« à la fin d'un sous-parcours ») contre volume (« un par parcours, fin de parcours ») et §2.3 (quiz d'étape + test de parcours) ; architecture §2.5 (3 propositions : sans XP, XP par fiche, pratique élargie) contre Q2 (A sans points, B points, C rien).
Problème : un lecteur ne sait plus quelle version tient. « 22 situations » surestime la matière réutilisable (la part des lettres au format A n'est pas comptée).
Correction : trancher chaque point dans UN document de référence : (a) Ateliers : l'inventaire doit dire « SANS OBJET au sens coaching en direct, À CRÉER au sens exercice hors écran » ; (b) un seul découpage de référence et son total ; (c) compter les lettres au format A (le nombre exact, pas 22) ; (d) type 8 = test de fin de PARCOURS, le quiz d'étape reste « Test de l'étape » ; (e) aligner Q2 sur §2.5 (même 3 options).

**6. [BLOQUANT] Les rubriques ne sont pas lisibles en 3 secondes, et deux se doublonnent (C4).**
Passage : architecture §3.1 (Aujourd'hui, Parcours, Situations, Les bases, Bibliothèque, Plus).
Problèmes :
- « Les bases » promet du « niveau débutant » alors qu'elle contient Guides, Grammaire, Vocabulaire, Expressions de tous niveaux ; un abonné avancé la sautera, un débutant croira devoir la finir avant. « Les bases » désigne aussi, en Q1 option C, un sixième PARCOURS : même mot, deux sens.
- « Bibliothèque » et « Les bases » sont deux conteneurs au nom aussi générique l'un que l'autre ; où va une fiche « Écouter et décortiquer » (type 6) ? Le tableau la met dans Bibliothèque > Vidéos alors que c'est une leçon.
- Carnet (Bibliothèque) et Situations sont la même chose à une et trois répliques (D1 de l'inventaire) : deux portes pour un contenu, sans règle.
- Glossaire public `/glossaire` (12 termes) et nouveau Vocabulaire (60 mots) : où vit le mot « callback » ? Articles (blog), Quiz d'humour, Glossaire n'ont aucune place dans les 6 entrées, ni dans « Plus » (Plus ne les liste pas).
- « Écrire à l'équipe » et « Favoris » (visibles dans la capture) sont cachés dans « Plus », avec Jeux et Ateliers (48 fiches neuves, soit 22 % du neuf) : la moitié de la demande de Thomas (« exercices et jeux ») n'est pas visible au premier regard.
Correction : proposer 2 ou 3 jeux de noms testables en 3 secondes (ex. « Apprendre » pour techniques et vocabulaire, « Catalogue » pour vannes, conseils, vidéos), tracer pour CHAQUE page existante ou nouvelle (y compris Articles, Quiz, Glossaire, Lettre, Mon profil) sa porte unique, fusionner Carnet dans Situations ou dire pourquoi deux entrées, fixer que `/glossaire` devient la version publique de Vocabulaire (un seul glossaire, déjà promis en §4.4). Remplacer « Les bases » par un nom qui ne laisse pas croire à un niveau.

**7. [BLOQUANT] Questions à Thomas : options qui contredisent une décision sans être marquées, numérotation en collision (C2, C8).**
Passages : architecture §5.2.
- Q2 option C « Fait seulement à la fin de l'étape, comme aujourd'hui » : contredit la décision du 12/11 (« étapes découpées en fiches Voir / Fait »). Non marquée.
- Q4 option C « Jamais, retire le vocabulaire de la barre » : contredit la demande verbatim du 12/11 (« Le vocabulaire »). Non marquée.
- Q7 option B « score en pourcentage avec un seuil pour valider » : touche la décision du 07/10 (bilan sans certificat) et la série sur la pratique. Non marquée.
- Q1 option B « casse des étapes validées » : touche les étalons validés (s17, s18) : écrit comme un « contre », pas comme une réouverture à signer.
- Q1 à Q8 reprennent la numérotation Q1 à Q12 du brief, dont Q1, Q2, Q3, Q11 sont déjà tranchées par Thomas le 12/11 (par exemple « Q2 = Mon espace » ET « Q2. Que fait Fait »). Thomas dira « Q2 » et personne ne saura laquelle.
- Q6 option B (« sauf rupture et deuil ») : Marc est « en reconstruction » ; sans lire `personas.md` [NON VÉRIFIÉ], exclure la rupture peut retirer son besoin central. L'option n'est pas justifiée par persona.
- Jargon : « sous-parcours », « étiquette », « ISR » dans les options.
Correction : renommer en E1 à E8 (ou « Question A, B... »), marquer « contredit ta décision du 12/11, accord écrit requis » sur Q2 C, Q4 C, Q7 B, Q1 B ; remplacer les options contradictoires par de vraies alternatives défendables ; justifier Q6 par persona ; réécrire sans jargon (« une série de fiches courtes par étape », « une étiquette »).

**8. [BLOQUANT] Les exemples ne tiennent pas la barre ni leur propre règle (C9).**
- Situation (§1.4) : réplique « douce » (« Mon GPS m'a fait visiter trois fois le même rond-point ») et « moyenne » (« j'ai vu ma vie défiler : c'était surtout un rond-point ») sont la même idée reformulée ; la gradation « trois niveaux réellement différents » (grille du 25/10) n'est pas démontrée. La règle dit que la moyenne « renvoie un détail, sans viser » : l'exemple vise soi-même, comme la douce. Le motif GPS / rond-point est un lieu commun : risque contre « jamais entendue ailleurs ».
- Expression (§1.4) : la règle dit « garde la première moitié, remplace la seconde » ; l'exemple change « l'oiseau » (première moitié) en « mon salon » : l'exemple contredit sa règle, ce qui est une faute objective selon la règle du 08/10.
- Exercice (§1.4 type 7) : le format promet « un corrigé qui montre une bonne réponse », l'exemple ne donne que « la blague se cache souvent dans la troisième » : aucune réponse montrée.
- Test (type 8) : la bonne réponse B (« J'ai pris de l'avance : c'est demain que je serai à l'heure ») est logiquement bancale et peu drôle : un test dont la réponse correcte est faible sape la barre.
- Vocabulaire : « C'est pour la survie du dessert » est plat ; l'exemple de callback ne montre pas la première mention.
- Atelier : aucun exemple rédigé, seulement des titres ; Écouter : squelette seulement (acceptable pour l'anti-invention, mais le ton n'est pas démontré).
Correction : réécrire trois exemples (Situation avec trois répliques de registres vraiment distincts, Expression conforme à sa règle, Exercice avec corrigé réel), supprimer le motif GPS, donner une bonne réponse forte au test, ajouter un exemple d'Atelier (une étape de 5 minutes rédigée). Tous restent marqués [EXEMPLE NON VALIDÉ] et passent la relecture à l'aveugle avant d'être montrés comme étalons.

**9. [BLOQUANT] Faisabilité à la barre Alexa non chiffrée (C7).**
Passage : architecture §4.3 (« Faisable en V1 complète… le facteur limitant est la relecture ») et §4.4 (« 90 situations, c'est 270 répliques »).
Problème : l'historique fondateur donne 30 vannes au niveau sur 333 (30/09), puis 2 sur 360 au pilote P0 (06/10) ; le seuil « 90 validées à l'aveugle » (24/10, [NON VÉRIFIÉ]) n'est relié à aucun rendement attendu. Pas de nombre de candidats à produire, de tours de relecture, de relecteurs, de lots de Thomas (22 lots de 10 + passages Thomas non chiffrés). Les 20 fiches Écouter exigent minute exacte et citation ; l'inventaire T5 note déjà des légendes « non vérifiées » ; aucun « qui, avec quel outil » (visionner une vidéo, lire un transcript).
Correction : ajouter un tableau de capacité par type : candidats à écrire, rendement supposé [HYPOTHÈSE], nombre de relectures, passes Thomas ; ordre des lots avec un point de contrôle de rendement après le premier lot (si le rendement des répliques est de 1 sur 3, dire ce que devient la cible de 90) ; déclarer que 90 est une cible de situations VALIDÉES (pas de coupe de la V1) et préciser la règle « 2 répliques sur 3 » ; nommer le responsable et la méthode de vérification des 20 passages ; reprendre le Vérificateur de citations en prérequis, pas en recommandation.

### Non bloquantes

**10. Pas de règle d'accès aux nouvelles fiches (gratuit, visiteur, Premium) (C1, C6).** Ni l'un ni l'autre document ne dit si une fiche neuve visible dans l'étape 1 gratuite est lisible par le visiteur, ni si le Vocabulaire est public (SEO du glossaire) ou réservé. Correction : tableau « fiche / visiteur / abonné » ; règle d'exercice via `champs-premium.ts` (brief §2.5) ; pages de l'espace en noindex. Non bloquant seulement si traité avant les étalons.

**11. Numérotation des fiches et ancres (C6).** Les lettres approuvées pointent vers `#etape-N` (inventaire D6) ; l'architecture numérote `1.1, 1.2` sans dire que les ancres d'étape sont conservées. Correction : « les ancres `#etape-N` restent, les fiches s'ajoutent en `#fiche-N-M` ».

**12. Définition de la leçon contredite par le tableau (C10).** §1.1 : « sans geste, c'est un contenu de plus ». Le découpage met « 1.3 Cinq vannes courtes à ressortir (lecture) » : pas de geste. Correction : ajouter un geste à cette fiche (« choisis celle que tu dirais ») ou assumer un type « Bibliothèque » hors définition.

**13. Recouvrement Grammaire, Vocabulaire, Glossaire, `anatomie-vanne` (C4, C6).** « Callback », « règle de trois », « litote/understatement » apparaissent dans 2 ou 3 types. Correction : une seule fiche canonique par notion, les autres y renvoient (règle écrite dans §4.4 mais pas appliquée à la liste des 12 structures et des 60 mots).

**14. Volumes V1 non marqués comme propositions (C3).** 12 guides, 12 structures, 20 expressions (≈ 110), 20 écoutes, 40 jeux, 8 ateliers, « 5 mots par fiche » : aucune source de dimensionnement. Correction : marquer [HYPOTHÈSE de dimensionnement] avec la raison (par exemple 12 guides = 12 principes listés), et dire ce qui augmente la valeur (pourquoi 40 jeux et pas 20).

**15. Parcours de navigation mobile et budget (C4).** §3.1 renvoie le budget d'en-tête à @ux et @design : ok, mais le nombre d'entrées visibles par taille d'écran, « Plus » comme panneau, et le retour à « Mon profil » (garanti par le choix du 12/11) ne sont pas dessinés. Correction : une ligne de contrainte « Mon compte/Mon profil reste dans le menu de compte, hors des 6 ».

**16. Filtres de Situations « sur deux entrées » (C4).** §1.4 : « un filtre "je suis dans quelle situation" sur deux entrées » est obscur. Correction : dire en clair : par exemple deux filtres visibles (« Où ? », « Pour quoi faire ? »), l'enjeu en troisième niveau, et un chemin d'entrée « Les 5 situations pour commencer ».

**17. Rendement par rubrique à l'ouverture (C5).** « Une V1 moitié des types n'est pas recommandée » est cohérent avec la demande ; mais Q8 option B (ouvrir rubrique par rubrique) et le principe « chaque rubrique a un contenu réel » (brief §3.1) doivent être croisés : à quel volume minimum une rubrique s'ouvre-t-elle ? Correction : seuil d'ouverture par rubrique (par exemple Situations : 30 validées d'abord).

**18. Mesure de la valeur du contenu neuf (C1).** Aucun event mesurable n'est défini (T4 de l'inventaire : « lire ne laisse aucune trace »). Correction : un tableau HEART minimal : adoption (première fiche « Fait » à J1), engagement (fiches Faites par semaine), rétention (retour à J7), avec la cible à poser et la source (pas d'invention de chiffre).

## 3. Ce qui manque totalement

1. Le parcours de l'abonné (J1, J7, semaines 2 à 4, après la V1) : voir correction 2.
2. L'échelle de progression et le contenu « avancé » : voir correction 3.
3. Le tableau d'accès visiteur / abonné de chaque type et rubrique.
4. Le plan de capacité de production et le rendement attendu à la barre Alexa.
5. Une fiche d'entrée désignée par persona (5 minutes) et l'état « premier jour » de chaque rubrique (rien de vide, un seul chemin recommandé).
6. La place de chaque page existante dans la nouvelle navigation (Articles, Quiz d'humour, Glossaire, Lettre, Mon profil).
7. Un modèle de fiche rédigée de bout en bout (pas seulement des fragments) pour Atelier et pour le Test de parcours.
8. Une question à Thomas sur le rythme annoncé (« 15 à 20 min/semaine ») face à des étapes qui s'allongent ; et sur l'avenir du contenu après la V1.
9. Un tableau de réconciliation des deux documents (chiffres, découpage, ateliers) tenu à jour.

## 4. Points acquis (à ne pas perdre au tour 2)

- Définition « une leçon = une chose + un geste » et squelette commun de fiche (§1.1, §1.2) : solides.
- Type Situation comme cœur et pont vers les lettres et le carnet : bonne idée, bonne valeur persona.
- Reco A (garder les 5 parcours, étapes en sous-parcours) : cohérente avec les décisions validées.
- Respect de « 6 entrées au plus » (Plus compté) et de « Mon espace » ; honnêteté des marquages [EXEMPLE NON VALIDÉ], [HYPOTHÈSE], [À VÉRIFIER].
- Inventaire : cartographie des 23 rubriques de la capture, bilan 6 / 10 / 5 / 2 exact (recompté), doublons D1 à D6 et trous T1 à T8 utiles.
- Aucun tiret cadratin ni émoji dans les exemples lus.
