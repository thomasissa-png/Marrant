# Aujourd'hui, refonte s25 : aperçu verrouillé et tableau de bord abonné

Spec @ux pour @design puis @fullstack. Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE = true`) : la page répond 404 fermée, le site fermé ne change pas (47 snapshots intacts). Source de vérité de la structure ; @design règle proportions, couleurs, rayons sans toucher l'ordre ni le contenu des zones.

## 0. Principe directeur de Thomas (16/11), appliqué à chaque zone

> Chaque section : pour les prospects, doit donner super envie de joindre et de s'inscrire ; pour les autres, doit être claire et donner envie de continuer.

Chaque zone ci-dessous porte une étiquette de fonction :
- **[ENVIE]** : sert le prospect (visiteur, inscrit gratuit) : désir, valeur visible, preuve, CTA, réassurance.
- **[CLARTÉ]** : sert l'abonné : clarté immédiate, progression visible, prochaine action évidente.
- **[ENVIE+]** : sert l'abonné pour qu'il continue : récompense, série, cap, ce qui vient.

Aperçu = page de conversion (tout [ENVIE]). Abonné = tableau de bord (tout [CLARTÉ] ou [ENVIE+]).

## 1. Diagnostic (retour de Thomas, 16/11, et captures `v6-tour-5/aujourdhui/`)

| Constat de Thomas | Cause dans le code | Correction de cette spec |
|---|---|---|
| « On voit des cadenas, mais quand on clique on a l'impression d'accéder à quelque chose » | `ApercuRubrique` montre une fiche ENTIÈRE, lisible, interactive en apparence, dans une colonne `max-w-3xl` ; le cadenas n'est que dans la bande (icône seule, sans mot) | Extrait coupé par un fondu, inerte, avec pastille « Premium » (verrou + mot) sur chaque bloc fermé ; plus de fiche entière |
| « Pas clair que c'est censé être privé » | sous-titre « Voici un exemple… » sous un H1 centré, rien ne dit ce que c'est | Pastille « Premium » au-dessus du H1, légende « Voici un exemple… » collée à l'extrait |
| « Le CTA pour payer devrait être en haut » | bouton après toute la fiche (y = 970 à 1280) | CTA dans le hero (premier écran), second CTA à la fin de l'extrait |
| « Aujourd'hui est l'aire n°1 : on dirait un vieux texte » | aperçu = une fiche situation ; abonné = H1 centré + colonne | Aperçu = tableau de bord verrouillé ; abonné = grille de zones |
| « Chaque section : gros bloc de texte centré, espace inutilisé » | `max-w-3xl mx-auto text-center`, `space-y-12` | Grille 12 colonnes dans la coque `max-w-7xl`, titre aligné à gauche côté abonné |

Largeur : la coque reste `max-w-7xl` (1216 px utiles) à 1280, 1456 et 1920, comme la bande des rubriques et la page d'accueil (étalon : mêmes 1216 px sur `visiteur-accueil-1280.png`). Élargir le contenu seul à 1920 désalignerait la bande ; à 1920 le gain d'espace vient de la grille, pas de la largeur. [ARBITRAGE : si Thomas veut plus large à 1920, élargir bande, en-tête et pied ensemble, hors périmètre de cette page.]

## 2. Motif réutilisable : « Aperçu verrouillé » (toutes les rubriques Premium)

Un composant unique `ApercuVerrouille` remplace `ApercuRubrique` ; il reçoit une configuration par rubrique (§2.4). Rendu serveur statique, aucun appel à l'espace (nav v6 §2 point 5). Une seule action principale : l'offre.

### 2.1 Anatomie (ordre du DOM = ordre de lecture)

| # | Zone | Contenu | Fonction | Constant ou variable |
|---|---|---|---|---|
| A | **Hero** (carte `rounded-xl`, filet dégradé violet, `p-6 md:p-8`) | pastille « Premium » avec verrou ; H1 = nom de la rubrique ; promesse d'une phrase ; rangée de pastilles « ce qu'il y a dedans » | [ENVIE] ce qu'on gagne | pastille, H1 constants ; promesse et pastilles variables |
| B | **Bloc offre** (dans le hero) | bouton plein `EN_TETE.bouton` (prix lu en config) ; réassurance `REASS` ; preuve sociale ; lien « Connexion » (visiteur seulement) | [ENVIE] CTA en haut, réassurance, preuve | constant (source du clic = `sourceApercu(rubrique)` avec position `haut`) |
| C | **Extrait coupé** (cadre carte, hauteur plafonnée, fondu en bas) | la structure réelle de la rubrique, blocs visibles mais fermés | [ENVIE] preuve par un vrai extrait | variable |
| D | **Fin d'extrait** (centré, sur le fondu) | pastille « Premium » + phrase « La suite est dans Premium » + second bouton, même libellé, même lien, position `fin` | [ENVIE] CTA en fin d'extrait | constant |
| E | **Légende** (sous l'extrait, `text-sm text-text-secondary`) | `TEXTES_APERCU.sousTitre` (validé 15/11), repris tel quel | [ENVIE] dit que c'est un exemple et que c'est réservé | constant |

### 2.2 Règles de l'extrait (anti « j'ai l'impression d'être dedans »)

1. **Visiblement coupé** : hauteur plafonnée (375 : 320 px ; 768 : 400 px ; 1280 et plus : 440 px) ; fondu `mask-image: linear-gradient(to bottom, black 55%, transparent 100%)` sur les 45 % du bas. Le fondu va vers la couleur de fond de la page, jamais vers un voile gris. Pas de flou décoratif (nav v6 §2 : « pas de flou décoratif ») : seul le fondu coupe.
2. **Inerte** : l'extrait porte `aria-hidden="true"`, `pointer-events-none`, `select-none`, aucun lien, aucun bouton focusable (`tabIndex={-1}` si un composant en rend un ; `inert` si le typage React 18.3 le permet, sinon attribut posé par ref). Les boutons y sont dessinés atténués (`opacity-60`) et ne répondent pas. Un clic dans l'extrait ne fait rien, et c'est lisible : curseur par défaut, aucune ombre au survol.
3. **Chaque bloc fermé porte sa pastille « Premium »** (verrou 14 px + le mot, `rounded-full`, bord violet) en haut à droite du bloc. Le verrou ne vit jamais seul dans la page (le verrou seul est ce qui a perturbé Thomas).
4. **Rien d'inventé** : textes et libellés repris des composants réels (états zéro, scène par défaut, noms de marches). Aucune donnée d'abonné simulée, aucun faux pourcentage, aucun faux prénom.
5. **Accessibilité** : l'extrait étant masqué aux lecteurs d'écran, la promesse et la rangée de pastilles (zone A) portent le contenu. Une phrase `sr-only` après le H1 : « Rubrique Premium. Exemple ci-dessous, non cliquable. » [texte neuf, §6]. Le fondu ne porte aucune information (décoratif).

### 2.3 Comportement par état et par largeur

| | Visiteur | Inscrit gratuit |
|---|---|---|
| Bouton (haut et fin) | `EN_TETE.bouton` | `EN_TETE.bouton` (même libellé que son en-tête) |
| Lien secondaire | « Connexion » (`TEXTES_APERCU.connexion`), un seul, dans le bloc offre, pas en fin d'extrait | aucun |
| Phrase d'objet | aucune | `PHRASE_OBJET_CONNECTE` sous le bouton (il paie sans avoir lu l'offre) |
| Réassurance, preuve | oui | oui |

Mise en page (le hero reste hors de la rangée des 3 chips : aucune colonne vide) :
- **< 768 (375)** : une colonne : A, B, C, D, E. Bouton pleine largeur, `min-h-11`. Premier écran 375 x 667 (553 px utiles sous les 114 px collants) : pastille, H1, promesse (3 lignes), bouton, réassurance, pastilles, début de l'extrait : tout A et B tiennent en environ 400 px, l'extrait en montre 150 px.
- **768 à 1023** : une colonne, hero en 2 sous-colonnes 60/40 (texte et pastilles à gauche, bloc offre à droite) dès 768 ; extrait pleine largeur, grille 2 colonnes.
- **>= 1024 (1280, 1456, 1920)** : hero en 2 colonnes `grid-cols-12` : texte et pastilles `col-span-7`, bloc offre `col-span-5` aligné au centre vertical. L'extrait dessous, pleine largeur de la coque (1216 px). Premier écran 1280 x 800 (686 utiles) : le hero (environ 300 px) et le haut de l'extrait (environ 330 px) sont visibles sans défiler.
- Le second bouton (D) est sous le fondu, centré. Deux boutons identiques pour la même action ne sont pas deux actions principales ; ils ne sont jamais visibles ensemble à 1280 (hero en haut, D à y > 800 si l'extrait fait 440 px).

### 2.4 Ce qui varie d'une rubrique à l'autre

| Rubrique | Promesse (une phrase) | Pastilles du hero | Extrait (réel) | Particularité |
|---|---|---|---|---|
| **Aujourd'hui** | voir §3 | libellés existants (§3.1) | le tableau de bord fermé, grille de l'abonné en état « nouvel abonné » | seule rubrique dont l'extrait est une page entière |
| **Parcours** | aucune : la page publique `/parcours` EST l'aperçu, inchangée (nav v6 §2 point 4) | | | hors motif |
| **Quoi répondre** | [à valider, voir §6] | les catégories existantes (`categoriesQuoiRepondre()`, « Coloc (4) »…), 4 premières + « … » | la fiche `coloc-la-poele` coupée après « La sûre » (scène + première réplique visibles, « La joueuse » et « La risquée » sous le fondu) | le catalogue en lecture seule actuel passe dans les pastilles |
| **Bibliothèque** | [à valider] | les 3 portes « Vannes, Conseils, Vidéos » plus types de fiches existants | la fiche `le-faux-secret` coupée après son premier tiers | |
| **S'entraîner** | [à valider] | « Si tu as 5 minutes », « Mission », « Facultative » (libellés existants) | la carte de rafale (titre, sous-titre, ligne de cartes) et la fiche jeu `quelle-replique-1` coupée | |
| **Mes répliques, Mes questions, Favoris** | hors périmètre du tour (déjà des cartes ou états vides) ; le même squelette A, B, D s'applique, l'extrait reste l'état vide existant | | | à traiter après Aujourd'hui |

Les fiches d'extrait restent les identifiants figés de `FICHES_APERCU` (confirmés par Thomas le 15/11). Seule la COUPE est nouvelle : la fiche n'est plus rendue entière.

## 3. Aperçu d'Aujourd'hui : le tableau de bord verrouillé

### 3.1 Hero (zone A et B)

| Élément | Texte | Clé ou source |
|---|---|---|
| Pastille | « Premium » + verrou | `OFFRE_NOM` (`config/textes/offre.ts`) |
| H1 | « Aujourd’hui » | `TEXTES_AUJOURDHUI.titre` |
| Promesse | « Ton tableau de bord : chaque jour, ton action, ta progression et ta série. » | NEUF (§6, T1) |
| Pastilles « dedans » (6) | « Ton premier pas », « Ton cap », « Série », « Étape en cours », « Mission », « Contenu du jour » | `TEXTES_AUJOURDHUI.premierPas.eyebrow`, `TEXTES_CAPS.titre`, `SERIE.titre`, `TEXTES_AUJOURDHUI.etape.enCours`, `TEXTES_MISSION.titre`, `TEXTES_AUJOURDHUI.jour.titre` |
| Bouton | « Premium · 1,99 €/mois » (prix lu en config) | `EN_TETE.bouton` |
| Réassurance | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | `REASS` de `config/textes/offre.ts` (déjà sous le bouton de l'accueil) [clé exacte à confirmer par @fullstack ; texte identique à l'accueil] |
| Preuve | « 1 500+ inscrits bossent leur humour. » | `ABONNEMENT_HAUT.preuve` |
| Lien (visiteur) | « Connexion » | `TEXTES_APERCU.connexion` |
| Phrase d'objet (gratuit) | « Premium ouvre tout : le catalogue, les N parcours, un carnet de répartie par mois. » | `PHRASE_OBJET_CONNECTE` |

Fonction : tout [ENVIE]. La promesse dit ce qu'on gagne ; les pastilles listent ce qui est dedans avec les mots exacts de l'abonné (le prospect reconnaîtra les mots en entrant) ; le bouton porte le prix ; la réassurance lève la peur de payer.

### 3.2 Extrait : les blocs du tableau de bord, visibles mais fermés (zone C)

Même grille que l'abonné « nouvel abonné » (§4.3), pour que le prospect voie le produit qu'il achète. Contenu réel, mêmes composants en mode `apercu` (props `fige`), sans appel réseau :

| Bloc | Contenu montré | Source | Fonction |
|---|---|---|---|
| Premier pas (dominant) | « Ton premier pas », la scène par défaut « Quelqu'un te lance « Tiens, tu as changé quelque chose, non ? » », « 5 min », bouton « Commencer » atténué et inerte | `premierPas.eyebrow`, `premierPas.sceneParDefaut`, `premierPas.duree`, `premierPas.bouton` | [ENVIE] voir la première action concrète |
| Ton cap | « Ton cap », « Tu t’échauffes · cap 1 sur 5 », les 5 pastilles du cap, « Ta série démarre à ta prochaine pratique. » | `TEXTES_CAPS.titre`, `capVisible(1)`, `serieZero` | [ENVIE] voir qu'il y a une progression gamifiée |
| Étape conseillée | « Étape conseillée », nom du parcours par défaut (Répartie), « Étape 1 », fiche de l'étape 1 | `etape.conseillee`, `PARCOURS_NOMS`, titre de l'étape 1 (`config/parcours-etapes.ts`) | [ENVIE] voir un parcours |
| Mission | « Mission · Marche 1 », titre de la marche 1, « Facultative » | `TEXTES_MISSION.titre`, `marche(1)`, `titresMarches[1]`, `facultative` | [ENVIE] |
| Contenu du jour | « Contenu du jour » puis les 3 titres « Vanne du jour », « Conseil du jour », « Vidéo du jour » ; sous le fondu, pas de contenu (le fondu coupe avant) | `jour.titre`, `jour.vanne`, `jour.conseil`, `jour.video` | [ENVIE] |

Chaque bloc a sa pastille « Premium » (§2.2 règle 3). Le bloc « Premier pas » est le plus grand et le plus haut : le prospect lit « voici ta première action » avant tout.

Le contenu du jour de l'accueil étant déjà gratuit, on n'y montre pas de vanne réelle ici (l'aperçu doit rester statique et sans appel à `/api/daily`).

### 3.3 Fin d'extrait (zone D) et légende (zone E)

Sous le fondu : pastille « Premium », phrase « La suite est dans Premium » (NEUF, T2), bouton `EN_TETE.bouton`. Dessous, la légende `TEXTES_APERCU.sousTitre`. Après : le pied de page, sans intercalaire.

### 3.4 Wireframes de l'aperçu (visiteur ; l'inscrit gratuit est identique sans « Connexion » et avec la phrase d'objet sous le bouton)

**375 px** (bande des rubriques collante au-dessus, 114 px, non dessinée)

```
+---------------------------------------+
| [Premium (verrou)]                    |   pastille
| Aujourd'hui                           |   H1 gauche, 32 px
| Ton tableau de bord : chaque jour,    |
| ton action, ta progression et ta      |
| série.                                |
| (Ton premier pas)(Ton cap)(Série)     |   pastilles dedans,
| (Étape en cours)(Mission)             |   retour à la ligne
| (Contenu du jour)                     |
| [ Premium · 1,99 €/mois ]  44 px      |   CTA 1, pleine largeur
| Premium : premier paiement            |
| remboursable sous 14 jours...         |
| 1 500+ inscrits bossent leur humour.  |
| Connexion                       44 px |
+---------------------------------------+   ~ 400 px : fin du hero
| +-----------------------------------+ |
| | Ton premier pas        [Premium]  | |   extrait, inerte
| | Quelqu'un te lance « Tiens, tu... | |
| | 5 min          [Commencer] (gris) | |
| +-----------------------------------+ |
| | Ton cap                [Premium]  | |
| | Tu t'échauffes · cap 1 sur 5      | |
| | o o o o o                         | |
| | Ta série démarre à ...   (fondu)  | |   max 320 px, fondu
| ......................................|
|  [Premium] La suite est dans Premium  |
|  [ Premium · 1,99 €/mois ]     CTA 2  |
| Voici un exemple de cette rubrique.   |   légende
| Elle est ouverte avec Premium.        |
+---------------------------------------+
```

**1280 px** (coque 1216 px)

```
+--------------------------------------------------------------------------+
| (filet violet)                                                           |
| [Premium (verrou)]                         |  [ Premium · 1,99 €/mois ]  |
| Aujourd'hui                                |  Premium : premier paiement |
| Ton tableau de bord : chaque jour, ton     |  remboursable sous 14 jours |
| action, ta progression et ta série.        |  1 500+ inscrits bossent... |
| (Ton premier pas)(Ton cap)(Série)          |  Connexion                  |
| (Étape en cours)(Mission)(Contenu du jour) |                             |
+--------------------------------------------------------------------------+  hero ~300 px, col 7 / col 5
+------------------------------------------------------------+ +-----------+
| Ton premier pas                            [Premium]       | | Ton cap   |
| Quelqu'un te lance « Tiens, tu as changé... »  5 min       | | [Premium] |
|                                      [Commencer] (atténué) | | Tu t'écha |
+------------------------------------------------------------+ +-----------+
| Étape conseillée [Premium] | Mission [Premium] | Contenu du jour [Premium] |
| ...........................(fondu sur 45 % du bas, 440 px max)............ |
|        [Premium] La suite est dans Premium   [ Premium · 1,99 €/mois ]   |
+--------------------------------------------------------------------------+
  Voici un exemple de cette rubrique. Elle est ouverte avec Premium.
```

Grille de l'extrait à 768 : mêmes blocs que §4 à 768, hero en deux sous-colonnes.

### 3.5 Nielsen sur l'aperçu (PASS/FAIL après correction)

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 Visibilité de l'état | PASS | pastille « Premium » avec le mot, extrait coupé, légende « exemple » |
| H2 Vocabulaire du persona | PASS | libellés de l'abonné repris, tutoiement |
| H3 Contrôle | PASS | aucun piège : l'extrait est inerte, « Connexion » visible, bande des rubriques intacte |
| H4 Cohérence | PASS | même carte que l'accueil, même bouton que l'en-tête |
| H5 Prévention d'erreurs | PASS | on ne peut pas cliquer un faux bouton (inerte, atténué) |
| H6 Reconnaissance | PASS | les pastilles reprennent les titres vus dans l'extrait |
| H7 Raccourcis | PASS | CTA haut et fin, bande pour partir |
| H8 Minimalisme | PASS | un H1, une promesse, un bouton plein |
| H9 Erreurs | sans objet | aucune saisie ; échec de paiement géré par `/abonnement` |
| H10 Aide | PASS | réassurance remboursement et résiliation à côté du prix |

Cognitive walkthrough du visiteur (Yanis, 375 px, arrive par la bande) : sait-il que c'est réservé ? oui (pastille « Premium » et H1 dans le même écran) ; sait-il ce qu'il y a dedans ? oui (promesse et pastilles) ; voit-il le prix et le bouton ? oui (sans défiler) ; croit-il être dedans ? non (extrait inerte et coupé, atténué). Aucune friction restante. [FRICTION H1 évitée] : à l'étape « je clique sur l'extrait », il ne se passe rien ; le fondu et la phrase « La suite est dans Premium » lui disent pourquoi.

## 4. Aujourd'hui abonné : page n°1, tableau de bord

### 4.1 Ce qui existe déjà dans les données (vérifié dans le code)

| Donnée | Disponible | Où | Aujourd'hui affichée ? |
|---|---|---|---|
| Premier pas fait | oui | `premierPasFait(userId)` | oui (état 1) |
| Action du jour : premier pas, rafale, étape à reprendre | oui | `PremierPas`, `lireRafale`, `lireEtapeAReprendre` (parcours, `ordre`, `total`, `enCours`, `href`) | oui |
| Rafale : cartes, nouvelles, à revoir, fini, `cetteSemaine` | oui | `lireRafale` | oui (repère en tête, carte) |
| Série (`streak`) | oui | `lireMois` | seulement dans « Ton mois » à partir de J25 |
| Cap (1 à 5) | oui | `lireMois` (`capDepuisXp`) | idem |
| XP | oui en base (`user.xp`, lu dans `lireMois` mais non renvoyé) | phrase existante `TEXTES_CAPS.xpDepuisArrivee(xp)` | non |
| Parcours en cours, étape n sur N | oui | `lireEtapeAReprendre`, `TEXTES_PARCOURS_ESPACE.etapeSurTotal` | oui, mais seulement une fois la rafale faite |
| Mission ouverte (marche) | oui, après le premier pas | `missionOuverte`, `TEXTES_MISSION` | oui (carte lien) |
| Contenu du jour (vanne, conseil, vidéo) | oui | `/api/daily`, `ContenuDuJour` | oui |
| Question C9 | oui, une fois | `QuestionAise` | oui |
| Lettre du mois | pas de lecture dans cette page | `/lettre` existe (rubrique) | non ; **non ajoutée** (aucune donnée chargée ici, zéro invention) |
| Pourcentage, « XP restants » | interdits | tests des caps (`espace-caps.ts` en-tête) | non, la progression se montre par pastilles de cap, XP gagnés, et « Étape n sur N » |

### 4.2 Zones, ordre, poids

L'ordre du DOM est l'ordre de priorité (lecteur d'écran, tabulation, mobile). Une seule action principale (bouton plein) : Z1. Tout le reste est lien ou bouton secondaire.

| Zone | Contenu | Poids | Fonction |
|---|---|---|---|
| **En-tête de page** | H1 « Aujourd’hui » aligné à gauche (plus centré) ; à droite dès 768, la ligne `repère` « {n} cartes cette semaine » quand n > 0 ; ligne de date (NEUF, T3) | léger, 1 ligne | [CLARTÉ] où suis-je |
| **Z1 Action du jour** | premier pas, OU « Étape en cours » (Reprendre), OU « Si tu as 5 minutes » (Les cartes du jour) selon l'état existant ; unique bouton plein 44 px | **dominant** : plus grand, première position, carte `p-6 md:p-8`, titre `text-2xl md:text-3xl` | [CLARTÉ] prochaine action évidente |
| **Z2 Ton cap** (remplace « Ton mois ») | « Ton cap », nom et `cap n sur 5`, 5 pastilles, XP gagnés (si > 0), série avec flamme, aide de la série | fort, colonne latérale à 1280 | [ENVIE+] récompense, série, progression visible |
| **Z3 Parcours en cours** | titre du parcours, « Étape n sur N », barre de progression (étapes validées sur total, sans pourcentage affiché), titre de l'étape, lien « Reprendre » (secondaire) | moyen | [CLARTÉ] où j'en suis ; [ENVIE+] reste à faire |
| **Z4 Mission** | « Mission · Marche n », titre de la marche (ligne entière cliquable, chevron), « Facultative » | moyen | [ENVIE+] défi optionnel |
| **Z5 Cartes du jour** | « Si tu as 5 minutes » en carte secondaire quand Z1 est l'étape ; « C'est tout pour aujourd'hui » avec coche quand la rafale est faite | moyen | [ENVIE+] récompense du jour fait |
| **Z6 Contenu du jour** | 3 cartes : Vanne (avec « Une autre », toucher), Conseil, Vidéo | rangée entière, poids égal | [ENVIE+] raison de revenir chaque jour |
| **Z7 Question C9** | une fois après le premier pas, 4 puces | léger, rangée entière, disparaît une fois répondue | [CLARTÉ] |

Changements de règle par rapport à l'architecture v17 (série « jamais en tête », « Ton mois » dès J25) : Z2 est affichée dès le premier jour, en haut à droite. Motif : le retour de Thomas du 16/11 fait foi, et le principe « progression visible, récompense ou série » l'impose ; l'état zéro existant (« Ta série démarre à ta prochaine pratique. ») ne culpabilise pas. [À MENTIONNER à Thomas : cette décision déplace la série d'« Ton mois » vers le haut de la page.] « Ton mois » disparaît comme titre (titre de Z2 : « Ton cap »), sa donnée (série, cap) vit dans Z2.

### 4.3 Grille par largeur

Coque `max-w-7xl` (1216 px), gouttière 24 px, espacement vertical 24 px entre rangées (plus de `space-y-12` : les rangées se touchent à 24 px, le « Contenu du jour » garde son H2 et 32 px au-dessus).

| Largeur | Grille | Rangée 1 | Rangée 2 | Rangée 3 | Rangée 4 |
|---|---|---|---|---|---|
| **375** | 1 colonne | Z1 | Z2 (compacte : cap et série côte à côte en 2 colonnes internes, pastilles dessous) | Z3, Z4, Z5 empilées | Z6 : 3 cartes empilées (vanne, conseil, vidéo), puis Z7 |
| **768** | 2 colonnes (`md:grid-cols-2`) | Z1 pleine largeur (bandeau : titre à gauche, durée et bouton à droite) | Z2 pleine largeur en bandeau (cap, XP et série en ligne) | Z3 \| Z4 ; Z5 pleine largeur si Z4 absente | Z6 : vanne \| conseil, vidéo pleine largeur ; Z7 pleine largeur |
| **1280, 1456, 1920** | 12 colonnes | Z1 `col-span-8` \| Z2 `col-span-4`, même hauteur (`items-stretch`) | Z3, Z4, Z5 : chacune `col-span-4`, ou `col-span-6` chacune si une manque (jamais une cellule vide) | Z6 : 3 cartes `col-span-4` | Z7 `col-span-12` |

Règles : (a) aucune rangée ne reste à moitié vide : le nombre de zones présentes se partage 12 colonnes (3 x 4, 2 x 6, 1 x 12) ; (b) à 1280 et plus, Z1 et Z2 sont toujours dans la même rangée et à hauteur égale ; (c) 1456 et 1920 : même rendu que 1280 (coque plafonnée), la marge latérale grandit seule ; (d) Z1 ne dépasse jamais 66 % de la rangée ; (e) `min-w-0` sur chaque cellule et `[overflow-wrap:anywhere]` (déjà en place). Cibles : tout lien et bouton `min-h-11`, lignes cliquables entières.

Premier écran à 1280 x 800 (686 px utiles) : en-tête 56 px, rangée 1 d'environ 240 px, rangée 2 d'environ 190 px, début de « Contenu du jour » : l'abonné voit action, cap, série, parcours et mission sans défiler. À 375 x 667 (553 utiles) : Z1 en entier (bouton compris) et le haut de Z2.

### 4.4 État A : nouvel abonné (premier jour, rien de fait)

| Zone | Rendu |
|---|---|
| Z1 | « Ton premier pas » : scène, durée, « Commencer » (existant, inchangé) |
| Z2 | « Ton cap », « Tu t’échauffes · cap 1 sur 5 », 5 pastilles vides sauf la première, « Ta série démarre à ta prochaine pratique. » ; pas de ligne XP tant que XP = 0 (« 0 XP gagnés » décourage) |
| Z3 | « Étape conseillée » : le parcours et son étape 1, lien secondaire « Commencer l'étape 1 ». CHANGEMENT : `lireEtapeAReprendre` est aujourd'hui appelé seulement quand la rafale est faite ; l'appeler aussi quand `!fait`, rendu en lien (jamais bouton plein) |
| Z4 | absente (la mission s'ouvre après le premier pas) ; remplacée par « Tes 4 premières semaines » avec ses quatre lignes (libellés des lignes 13 et 14 de `docs/copy/libelles-espace-e5-s24.md`, déjà dans `espace-caps.ts`) : la feuille de route donne envie de continuer [ENVIE+] [clé exacte à confirmer] |
| Z5 | absente (rafale non servie avant le premier pas) |
| Z6 | présent (3 cartes) |
| Z7 | absente (posée après le premier pas) |
| Rangée 2 à 1280 | Z3 `col-span-5` \| « 4 premières semaines » `col-span-7` |

[FRICTION H6 corrigée] avant : le nouvel abonné voyait un bandeau et 3 cartes, sans trace de sa progression ni de ce qui vient. Maintenant : cap 1, série à démarrer, parcours conseillé, feuille de route de 4 semaines.

### 4.5 État B : abonné avancé (J30, série en cours, mission ouverte)

| Zone | Rendu |
|---|---|
| Z1 | selon l'état existant : rafale pas faite : « Si tu as 5 minutes » + « Les cartes du jour » ; rafale faite : « Étape en cours », parcours, « Étape n sur N », titre de l'étape, « Reprendre » |
| Z2 | « Ton cap » : nom et cap réels, pastilles remplies jusqu'au cap, « {xp} XP gagnés depuis ton arrivée », « {n} jours de pratique d’affilée », aide de la série ; `ecart` jamais ici (reste sur la page Parcours) |
| Z3 | si Z1 est la rafale : Parcours en cours avec barre « Étape n sur N » ; si Z1 est déjà l'étape : Z3 absente (pas de doublon), Z5 en prend la place |
| Z4 | « Mission · Marche n », lien |
| Z5 | rafale faite : « C'est tout pour aujourd'hui » avec coche ; sinon « Si tu as 5 minutes » en carte secondaire quand Z1 est l'étape |
| Z6, Z7 | Z6 présent ; Z7 absent une fois répondue |
| Annonces de cap ou de bonus | inchangées, en bandeau au-dessus de la grille (ligne `role="status"`) |

Cas « abonné revenant après 30 jours » : série à zéro, texte `serieZero` sans reproche ; Z1 propose le plus utile (rafale ou étape) ; aucun message de retard.

### 4.6 Wireframes de l'abonné

**Nouvel abonné, 375 px**

```
+---------------------------------------+
| Aujourd'hui                           |
| lundi 16 novembre                     |
+---------------------------------------+
| (filet)                               |
| Ton premier pas            5 min      |
| Quelqu'un te lance « Tiens, tu as     |
| changé quelque chose, non ? »         |
| [        Commencer         ] 44 px    |   Z1 dominante
+---------------------------------------+
| Ton cap                               |
| Tu t'échauffes · cap 1 sur 5          |
| (o)(o)(o)(o)(o)                       |
| Ta série démarre à ta prochaine       |
| pratique.                             |   Z2
+---------------------------------------+
| Étape conseillée                      |
| Répartie                              |
| Commencer l'étape 1  >                |   Z3, ligne 44 px
+---------------------------------------+
| Tes 4 premières semaines              |
| (4 lignes)                            |
+---------------------------------------+
| Contenu du jour                       |
| [Vanne du jour]                       |
| [Conseil du jour]                     |
| [Vidéo du jour]                       |   Z6 empilées
+---------------------------------------+
```

**Nouvel abonné, 1280 px**

```
Aujourd'hui                                              lundi 16 novembre
+------------------------------------------------+ +-----------------------+
| Ton premier pas                      5 min     | | Ton cap               |
| Quelqu'un te lance « Tiens, tu as changé       | | Tu t'échauffes        |
| quelque chose, non ? »    [  Commencer  ]      | | cap 1 sur 5  (o)(o)...|
|                                                | | Ta série démarre à... |
+------------------------------------------------+ +-----------------------+   col 8 | col 4
+-----------------------------+ +----------------------------------------+
| Étape conseillée            | | Tes 4 premières semaines               |
| Répartie                    | | Semaine 1 ... Semaine 2 ... (4 lignes) |
| Commencer l'étape 1  >      | |                                        |
+-----------------------------+ +----------------------------------------+   col 5 | col 7
Contenu du jour
+------------------+ +------------------+ +------------------+
| Vanne du jour    | | Conseil du jour  | | Vidéo du jour    |
| ... [Une autre]  | | ...              | | vignette         |
+------------------+ +------------------+ +------------------+                 3 x col 4
```

**Abonné avancé, 375 px**

```
+---------------------------------------+
| Aujourd'hui              12 cartes    |
| lundi 16 novembre   cette semaine     |
+---------------------------------------+
| Étape en cours                        |
| Parcours Répartie                     |
| Étape 4 sur 12                        |
| [Titre de l'étape]                    |
| [        Reprendre         ] 44 px    |   Z1
+---------------------------------------+
| Ton cap                               |
| Tu avances bien · cap 3 sur 5         |
| (o)(o)(o)( )( )                       |
| 420 XP gagnés depuis ton arrivée      |
| (flamme) 9 jours de pratique d'affilée|   Z2
+---------------------------------------+
| (coche) C'est tout pour aujourd'hui   |   Z5
+---------------------------------------+
| Mission · Marche 2                    |
| Titre de la marche              >     |
| Facultative                           |   Z4
+---------------------------------------+
| Contenu du jour : 3 cartes empilées   |
+---------------------------------------+
```

**Abonné avancé, 1280 px**

```
Aujourd'hui                                  12 cartes cette semaine
lundi 16 novembre
+------------------------------------------------+ +-----------------------+
| Étape en cours                                 | | Ton cap               |
| Parcours Répartie        Étape 4 sur 12        | | Tu avances bien       |
| ====----------  (barre d'étapes)               | | cap 3 sur 5 (o)(o)(o) |
| [Titre de l'étape]        [   Reprendre   ]    | | 420 XP gagnés ...     |
|                                                | | 9 jours d'affilée     |
+------------------------------------------------+ +-----------------------+
+----------------------+ +----------------------+ +----------------------+
| (coche) C'est tout   | | Mission · Marche 2   | | Ton parcours         |
| pour aujourd'hui     | | Titre de la marche > | | (si Z1 est la rafale)|
+----------------------+ +----------------------+ +----------------------+  3 x col 4
Contenu du jour
+------------------+ +------------------+ +------------------+
| Vanne du jour    | | Conseil du jour  | | Vidéo du jour    |
+------------------+ +------------------+ +------------------+
```

Quand Z1 est déjà l'étape (cas ci-dessus), la troisième cellule de la rangée 2 est absente : Z5 et Z4 prennent `col-span-6` chacune.

### 4.7 Nielsen sur l'abonné

| Heuristique | Verdict | Évidence |
|---|---|---|
| H1 État | PASS | cap, XP, série, étape n sur N toujours visibles dès le premier jour |
| H2 Vocabulaire | PASS | « Ton cap », « Étape en cours », « Si tu as 5 minutes » : textes validés |
| H3 Contrôle | PASS | la mission est « Facultative », la question C9 se pose une fois |
| H4 Cohérence | PASS | cartes de l'accueil (`rounded-xl`, filet), mêmes chips que la bande |
| H5 Prévention | PASS | un seul bouton plein par écran |
| H6 Reconnaissance | PASS | chaque zone a un titre lisible, pas de rappel mémoire |
| H7 Raccourcis | PASS | lignes entières cliquables, logo mène à Aujourd'hui |
| H8 Minimalisme | PASS sous réserve | 7 zones maximum, jamais toutes ensemble ; 3 actions principales au plus visibles (action du jour, parcours, mission) |
| H9 Erreurs | PASS | échec du contenu du jour = portes du catalogue (`jour.repli`), échec C9 = `aise.echec` |
| H10 Aide | PASS | aide de la série, information sous C9 |

## 5. Edge cases et accessibilité

| Cas | Comportement |
|---|---|
| Chargement du contenu du jour | cartes vides de même gabarit (existant) ; pas de saut de mise en page |
| Connexion lente | Z1 à Z5 rendues par le serveur ; seul Z6 est lu côté navigateur (délai 5 s existant) |
| Parcours tous finis, rafale faite | Z1 = « C'est tout pour aujourd'hui » (état existant) ; Z3 absente |
| Abonné non connecté sur l'aperçu | lien « Connexion » (visiteur) ; il garde le même aperçu |
| Mouvement réduit | aucune animation de barre ni de fondu |
| Clavier | ordre = ordre du DOM : Z1, Z2 (aucun focusable), Z3, Z4, Z5, Z6, Z7 ; aperçu : bouton du hero, lien « Connexion », bouton de fin ; l'extrait est hors de la tabulation |
| Contrastes | pastille « Premium » : bord et texte AA sur `background-card` ; bouton atténué de l'extrait exempté (inerte, aria-hidden) mais jamais sous 3:1 pour le texte lisible |
| Zoom 200 % ou fenêtre basse (< 500 px de haut) | une colonne, hero non collant, aucun contenu masqué |
| WCAG 2.2 AA | cibles 44 px, focus visible (anneau existant), `aria-labelledby` par zone, H2 par zone, un seul H1 |

## 6. Textes

### 6.1 Réutilisés (aucune modification)

| Usage | Texte | Clé |
|---|---|---|
| H1 | Aujourd’hui | `TEXTES_AUJOURDHUI.titre` |
| Premier pas | Ton premier pas, Commencer, scène par défaut, durée | `premierPas.eyebrow`, `.bouton`, `.sceneParDefaut`, `.duree` |
| Rafale | Si tu as 5 minutes, Les cartes du jour, Nouvelle, À revoir, C'est tout pour aujourd'hui | `rafale.titre`, `.bouton`, `.nouvelle`, `.aRevoir`, `.fini` |
| Étape | Étape en cours, Étape conseillée, Reprendre, Commencer l'étape 1 | `etape.enCours`, `.conseillee`, `.reprendre`, `.commencerEtape1` |
| Repère | {n} cartes cette semaine | `repere` |
| Contenu du jour | titre, Vanne, Conseil, Vidéo du jour, Ce soir c'est plutôt ?, Une autre | `jour.*` |
| Cap | Ton cap, noms, « {nom} · cap n sur 5 », XP gagnés depuis ton arrivée, série zéro | `TEXTES_CAPS.titre`, `.noms`, `.capVisible`, `.capLu`, `.xpDepuisArrivee`, `.serieZero` |
| Série | {n} jours de pratique d’affilée, aide, titre Série | `SERIE.jours`, `.aide`, `.titre` (`parcours.ts`) |
| Étape n sur N | Étape n sur N | `TEXTES_PARCOURS_ESPACE.etapeSurTotal` |
| Mission | Mission, Marche n, titres, Facultative | `TEXTES_MISSION.titre`, `.marche`, `.titresMarches`, `.facultative` |
| C9 | question, 4 réponses, échec, information | `aise.*` |
| Aperçu | légende « Voici un exemple de cette rubrique. Elle est ouverte avec Premium. » | `TEXTES_APERCU.sousTitre` |
| Aperçu | Connexion | `TEXTES_APERCU.connexion` |
| CTA | Premium · 1,99 €/mois ; nom accessible | `EN_TETE.bouton`, `.nomAccessible` |
| Pastille | Premium | `OFFRE_NOM` |
| Réassurance | « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » | `REASS` (`offre.ts`) [clé à confirmer] |
| Preuve | 1 500+ inscrits bossent leur humour. | `ABONNEMENT_HAUT.preuve` |
| Phrase d'objet (gratuit) | Premium ouvre tout : le catalogue, les N parcours, un carnet de répartie par mois. | `PHRASE_OBJET_CONNECTE` |
| 4 premières semaines | titre et 4 lignes | `espace-caps.ts` (libellés lignes 13 et 14) [clé à confirmer] |

### 6.2 Textes à valider par Thomas

Aucun tiret cadratin. Tutoiement. Chaque proposition est la reco ; une alternative est donnée quand le choix est réel.

| N° | Où | Proposition | Alternative |
|---|---|---|---|
| T1 | Promesse du hero d'Aujourd'hui (aperçu) | « Ton tableau de bord : chaque jour, ton action, ta progression et ta série. » | « Chaque jour, une action, ton cap et ta série, tout au même endroit. » |
| T2 | Fin d'extrait, toutes rubriques | « La suite est dans Premium » | « Le reste t'attend avec Premium » |
| T3 | Date sous le H1 abonné | jour de la semaine et date en français : « lundi 16 novembre » (mise en forme automatique, pas de phrase) | pas de date |
| T4 | Texte lu seulement, après le H1 de l'aperçu | « Rubrique Premium. Exemple ci-dessous, non cliquable. » | |
| T5 | Promesse Quoi répondre | « Des situations de la vie courante, avec trois répliques pour chacune. » | |
| T6 | Promesse Bibliothèque | « Comment c'est construit, vocabulaire et techniques : la mécanique d'une bonne réplique. » | |
| T7 | Promesse S'entraîner | « Des cartes et des jeux pour dire la bonne réponse à temps. » (reprend l'idée de `rafale.accroche`) | reprendre `rafale.accroche` telle quelle |

T5 à T7 ne bloquent pas la page Aujourd'hui (les autres aperçus passent après). Si Thomas ne répond pas à T1 : l'alternative n'est PAS posée seule, @fullstack n'écrit aucun texte provisoire visible.

## 7. Mesure (HEART) et tests

| Flow | Dimension | Signal | Cible | Méthode |
|---|---|---|---|---|
| Aperçu | Adoption / Task success | clics offre depuis aperçu, par position `haut` ou `fin`, sur vues aperçu | cible fixée après 28 jours de mesure (aucune base : 5 clics abonnement en 28 jours au 11/10) | événements nav v6 §2, propriété `position` ajoutée ; @data-analyst |
| Aperçu | Engagement | profondeur de défilement jusqu'au CTA de fin | à observer | Umami |
| Abonné | Task success | part des visites avec clic sur Z1 | >= 60 % (défaut d'activation) | événement `clic action du jour` |
| Abonné | Retention | retour J+7 | à observer | back-office |
| Abonné | Happiness | CSAT de la page | >= 8/10 | question ponctuelle |

Tests de ce livrable :
- Parcours persona sans aide : walkthrough fait (§3.5), frictions corrigées.
- Charge cognitive : <= 3 actions principales visibles par écran (hero : 1 bouton + 1 lien ; abonné : Z1, Z3, Z4).
- Time-to-value : inscription au premier résultat concret : paiement, puis Z1 « Commencer » : 2 étapes.
- Edge cases : §5. Accessibilité : §5.
- Preuve visuelle à fournir par @fullstack : captures 375, 768, 1280, 1920 des 3 états (visiteur, gratuit, nouvel abonné, abonné avancé) avant la revue @ux (`ux-review.md`).

## 8. Application (pour @design puis @fullstack)

@design : tokens et proportions des zones, pastille « Premium » (verrou + mot), fondu, états atténués ; conserve l'ordre, la grille et les zones de §3 et §4 ; tout conflit est arbitré par @ux.

@fullstack (périmètre, espace ouvert seulement) :
- `apercu/apercu-rubrique.tsx` devient `ApercuVerrouille` (zones A à E) ; configuration par rubrique dans `apercu/exemples.ts` ; nouveau `apercu/tableau-verrouille.tsx` pour l'extrait d'Aujourd'hui, qui réutilise `PremierPas`, `TonCap`, `EtapeEnCours`, `MissionLien`, `ContenuDuJour` en mode figé sans réseau (props `fige`) ; l'extrait des autres rubriques utilise `ExempleFiche` rendu dans un conteneur coupé.
- `mon-espace/page.tsx` : grille de §4.3 (remplacer `space-y-12`, `data-aujourdhui-grille`, le bloc `md:grid-cols-2`) ; en-tête de page aligné à gauche (`EN_TETE_CENTRE` retiré pour cette page) ; appeler `lireEtapeAReprendre` aussi quand `!fait` ; afficher Z2 dès J1.
- `ton-mois.tsx` devient `ton-cap.tsx` (titre « Ton cap », XP, série) ; `lireMois` renvoie aussi `xp` et ne dépend plus de `JOUR_TON_MOIS` pour l'affichage.
- Mettre à jour `docs/ux` et les tests (`aujourdhui-s24.test.tsx`, `apercu-rubriques.test.ts`, e2e visuels) ; mesure : propriété `position`.
- Le site fermé ne change pas : aucun fichier hors espace n'est modifié ; consigner dans `REPLIT_ACTIONS.md`.

Agents spécialisés recommandés : aucun nouveau. Après l'implémentation : @ux (revue `ux-review.md` sur captures) et @reviewer.

---
**Handoff → @design**
- Fichier produit : `/home/user/Marrant/docs/ux/aujourdhui-refonte-s25.md`
- Décisions : aperçu = hero de conversion + extrait inerte coupé par un fondu + CTA haut et fin ; abonné = grille 12 colonnes (Z1 dominante 8/12 + Z2 cap 4/12) ; série et cap visibles dès J1.
- Points d'attention : textes T1 à T7 à valider par Thomas ; décision « série en haut dès J1 » à lui signaler ; clés `REASS` et « 4 premières semaines » à confirmer dans le code ; coque plafonnée à 1216 px.
---
