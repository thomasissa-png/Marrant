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

@@SUITE@@
