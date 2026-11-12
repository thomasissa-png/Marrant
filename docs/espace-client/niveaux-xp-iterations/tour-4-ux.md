# Niveaux et XP, tour 4, relecteur @ux (à l'aveugle) : `docs/espace-client/niveaux-xp-s24.md` (v4)

> Relu en entier (résumé, 1 à 5, annexes A et B). Références : mon tour 3, `architecture-contenu-v13.md` §1.1 l. 146 et §8 (C4, Q9).
> Limites : je n'ai pas relu le code ni les seeds (calculs refaits à partir des totaux du document) ; je n'ai pas pu relancer la recherche du mot « cap » dans `blog-articles.ts` (pas d'outil de recherche ici) : [NON VÉRIFIÉ].

## 1. Statut de mes corrections du tour 3

| # | Sujet | Statut | Commentaire |
|---|---|---|---|
| 1 | Test de vérité : cap 3 et preuve du cap 5 (bloquant) | **Traité, deux défauts neufs** | « Tu es bien parti » remplace « Tu as pris ton rythme » (témoin non retenu) ; 2 300 = trois grands parcours (800 + 800 + 700, 18 étapes), quatre parcours quelconques suffisent, « condition suffisante, pas nécessaire » ; « 19 semaines » corrigé ; cumuls revérifiés (325, 1 025 ; 475, 1 275 ; 800, 1 600 : exacts). Défauts : N1 (le nom que je proposais est au masculin) et N5 (« 2 300 XP = environ 18 étapes » n'est pas établi) |
| 2 | Phrase d'XP et critère 11 (bloquant) | OK | « 412 XP gagnés depuis ton arrivée », détail « dont X sur tes étapes et bonus » seulement à écart nul ; critère 11 limité à la liste de 2.6 ; « irrégulier » devenu « écart inhabituel » ; Q6 dit que l'écart peut venir de la règle d'hier |
| 3 | « Tout de suite » ne ferme pas la faille (bloquant) | **Traité, une faille restante** | 2.5 : gain fixé par le serveur ET un conseil une seule fois par compte, sans attendre Q1 ; résumé, 1.1 et critère 1 alignés. Reste : rien n'oblige le serveur à vérifier que l'identifiant est celui d'un conseil actif (N2) |
| 4 | [À VÉRIFIER] devenu un fait | OK, et **le fait donné au tour 3 était faux** | 1.4 : « palier » EST employé dans des textes en ligne (article sur la timidité, l. 2455 à 2529 : « Chaque palier est un niveau à débloquer ») et dans un autre sens. Mon verdict du tour 3 (« palier gagne ») reposait sur « aucun texte client n'emploie palier » : je le retire. La reco « cap » est la bonne (voir 3) |
| 5 | Q4 sans seuils | OK | Seuils de A, B (52 % du total) et C ; voir N9 pour C |
| 6 | C4 dite à Thomas en clair | OK | Phrase de tête de Q1 et du résumé |
| 7 | Série et brief | OK, reste ouvert | Écrit comme fait (brief §3.2 bloc 1, ni v11 ni v12 ne la placent) et reporté en Annexe B point 6 ; l'architecture courante est la v13, qui ne la place pas non plus (N7) |
| 8 | Contour à 3:1 | OK | 3.0 point 2 et critère 7 |

## 2. Notes (même grille)

| Critère | T1 | T2 | T3 | T4 | Justification courte |
|---|---|---|---|---|---|
| Lisibilité (3 secondes : où en suis-je ?) | 7 | 8 | 9 | 9 | Nom d'abord, « cap 3 sur 5 » toujours, cinq repères sur leur propre ligne à 375 px ; le défaut de « cap » (boussole) est traité par les deux conditions |
| Motivation sans pression | 7 | 8 | 9 | 9 | Noms de chemin, rien d'affiché tant qu'aucun geste, jamais de baisse, courbe protégée |
| Affichage dans l'espace | 6 | 8 | 8 | 8 | Place dite (Parcours, après les étapes faites), voisinage « Ton cap » sans compteur d'étapes ; série toujours sans lieu |
| Noms au ton maison | 6 | 7 | 8 | 8 | Test de vérité appliqué ; mais « Tu es bien parti » et « Tu es bien lancé » excluent Sophie (N1) ; preuve du cap 5 à recompter (N5) |
| Accessibilité | 5 | 9 | 9 | 9 | Inchangée, solide |
| Cohérence avec l'architecture et les décisions | 6 | 9 | 7 | 8 | Les trois contradictions du tour 3 sont levées ; reste le fait des 10 XP écrit autrement en v13 (N7) et « prouvée » plus fort que la preuve (N4) |
| Qualité des questions | 7 | 8 | 8 | 9 | Seuils donnés pour chaque option, phrase de tête de Q1, Q6 sans jugement ; deux détails (N8, N9) |

**Note globale : 8,6 / 10** (60 sur 70). T1 : 6,3 ; T2 : 8,1 ; T3 : 8,3.

## 3. Mot « cap » contre « palier » : mon verdict révisé

Le test des 3 secondes du tour 3 donnait « palier » gagnant pour la lecture seule, **sous la condition qu'aucun texte client ne l'emploie**. La v4 établit le contraire : l'article sur la timidité l'emploie pour l'échelle des marches de mission (« palier 1 : envoie une vanne par message à un seul ami ») et pour les parcours (« palier par palier »), et dit « Chaque palier est un niveau à débloquer », qui contredit Q5 A. Un abonné qui a lu l'article verrait « palier » à l'écran avec deux autres sens : on recrée la confusion qu'on voulait lever. **Je rejoins la reco « cap »**, aux deux conditions déjà écrites (« sur 5 » toujours ; nom en premier). Deux ajouts :
- **Troisième option sans nom commun** : l'intitulé « Où tu en es » (déjà le titre de la colonne E1), puis « Tu avances bien · 3 sur 5 ». Plus de mot à choisir ni à défendre, la phrase de passage devient « Tu enchaînes. » ou « Nouveau : tu enchaînes. » Elle n'a aucune collision, aucun contresens, et se lit en 3 secondes. À proposer à Thomas dans Q3 à côté de « cap » et « palier ».
- **Le fait « cap libre » est à confirmer** : « franchir un cap », « passer un cap » sont des tournures courantes des textes de développement personnel ; « aucune occurrence » dans un fichier d'articles de plus de 2 500 lignes surprend. Une recherche du mot entier (hors « capable », « capacité ») le tranche en une minute. Une occurrence au sens « seuil » ne ferait pas collision (même idée), mais « garder le cap » (direction) pourrait.

## 4. Corrections nouvelles

### Bloquantes

**N1. [BLOQUANT] Le nom du cap 3 est au masculin : Sophie ne s'y reconnaît pas.**
Passages : 3.4 E1 « Tu es bien parti » (cap 3), E2 « Tu es bien lancé » ; test (5) « Yanis, Sophie ou Marc s'y reconnaît » ; 3.5, Q3 A (reco).
Problème : « parti » et « lancé » portent un accord masculin. Pour Sophie (26 ans), « Tu es bien partie » est la forme attendue : le texte la traite en homme, ou oblige à choisir un accord pour tous. Les autres noms de E1 (« Tu t'échauffes », « Tu te lances », « Tu enchaînes », « Tu connais la maison ») n'ont pas d'accord. **L'erreur vient de moi** : j'avais suggéré « Tu es bien parti » au tour 3 sans passer ce test.
Correction : un nom sans participe accordé au cap 3 et à E2 : « Tu avances bien » (vrai dès les premières validations, sans promettre une durée) ou « Tu prends le pli » ; pour E2, « Tu es en bonne voie » ; ajouter au test (5) : « aucun accord au masculin ou au féminin ». Revérifier à l'aveugle que « Tu te lances » (cap 2) et « Tu avances bien » (cap 3) ne se lisent pas comme un doublon.

**N2. [BLOQUANT] La correction 2.5 ne vérifie pas que l'identifiant est celui d'un conseil actif.**
Passages : 2.5 point 2 « une ligne par abonné et par conseil (table additive) » ; 1.1 « Après la correction 2.5, plus aucun gain n'est possible en boucle : au plus 1 200 XP de conseils, une seule fois » ; critère 1.
Problème : « une fois par conseil » n'est un plafond que si le serveur refuse un identifiant qui n'est pas celui d'un conseil existant et actif. Sans cette vérification, un appel avec mille identifiants différents (30 appels par minute) crée mille lignes de 10 XP : la boucle reste ouverte, avec des identifiants inventés. La phrase « au plus 1 200 XP » est alors fausse. Deux requêtes simultanées pour le même conseil peuvent aussi payer deux fois sans contrainte d'unicité en base.
Correction : écrire en 2.5 : (a) l'action « conseil lu » est refusée si l'identifiant n'est pas celui d'un conseil actif ; (b) l'unicité (abonné, conseil) est une contrainte de la base, pas un test applicatif ; (c) critère 1 : « un compte ne peut pas gagner plus de 10 × (nombre de conseils actifs) par ce canal » (test avec 130 identifiants, dont 10 invalides). Dire dans 1.1 que le serveur ne peut pas savoir si l'abonné a réellement ouvert le conseil : le plafond est de 1 200 XP, pas « ce qui a été lu ».

### Non bloquantes (pour 10/10)

**N3. « L'anti-doublon voulu » n'est pas sourcé.** 2.5 et le résumé : « l'anti-doublon voulu existe déjà ». Que la liste évite de repayer dans la page ouverte peut être une protection de l'interface plutôt qu'une règle voulue. Ni commentaire de code ni décision citée. Écrire [HYPOTHÈSE : le dédoublonnage de la page exprime la règle voulue] ou citer la source ; et dire à Thomas, dans le résumé, qu'un conseil relu ne rapporte plus de points dès maintenant, **sans que cette règle lui ait été soumise** (ce que le document fait déjà pour le montant libre : le dire aussi pour l'unicité).

**N4. « Prouvé » est plus fort que la preuve.** 2.6 : « Un total qui n'est pas un multiple de 5 prouve l'usage de l'API » ; Q6 B : « les comptes où l'usage de l'API est prouvé » et la baisse d'XP qui en découle. La prémisse « toutes les sources honnêtes sont des multiples de 5 » vaut pour les barèmes actuels ; elle ignore les barèmes anciens (le document `progression-levels.md` parle d'un « +2 par blague » : a-t-il jamais été en production ?) et la valeur par défaut `moduleXp = 20` d'avant la réécriture des étapes. Remplacer « prouve » par « indique fortement » (2.6, résumé, Q6) et ajouter un contrôle : lire l'historique de `progression.ts` et des seeds pour les valeurs d'XP passées. Le but : ne pas baisser l'XP d'un abonné honnête d'un ancien barème.

**N5. « 2 300 XP = environ 18 étapes sur 25 » n'est pas établi (test de vérité du cap 5).** 3.1, 3.4 (E1 cap 5, « vrai ») : tout reste ouvert (18/10), l'abonné valide les étapes dans l'ordre qu'il veut ; les étapes de 200 XP d'abord, sans compléter de parcours, rapprochent 2 300 de moins de 18 étapes (le bonus de 100 exige un parcours terminé). Le document reconnaît « [à recompter sur les seeds] » en 3.1 mais écrit « vrai » en 3.4. Faire le calcul : trier les 25 XP d'étape, ajouter les bonus des seuls parcours entiers, et écrire « au moins N étapes » avec le N trouvé ; si N est nettement sous 18, dire que « Tu connais la maison » est vrai pour « une grande part des étapes », ou choisir un nom qui ne dépend pas d'un décompte (par exemple « Tu as fait le tour »).

**N6. Mot « cap » et option sans mot.** Voir section 3 : confirmer le fait « libre » par une recherche mot entier ; ajouter l'option « Où tu en es · 3 sur 5 » à Q3.

**N7. L'architecture v13 écrit encore le fait autrement.** `architecture-contenu-v13.md` §1.1, ligne « XP, niveaux, série (code) » : « le conseil du jour d'« Aujourd'hui », la fiche 1.1 de chaque étape et la Bibliothèque entrent dans ce cas » ; la v4 établit que le conseil du jour et le conseil d'une étape ne rapportent aucun XP, seule la liste du catalogue des conseils en rapporte. L'Annexe B de la v4 renvoie à « v11, puis v12 » : l'architecture courante est la v13. Reporter la phrase corrigée dans la v14 en citant la ligne à remplacer, ainsi que le point 6 (placer la série ; la v13 ne la place pas non plus).

**N8. Q3 : l'option intermédiaire contredit 3.3.** « Palier seulement pour la règle C » (3.4, Q3) alors que 3.3 écrit « marche 3 sur 5 » (le mot des missions). Choisir : « marche » (cohérent avec v11) ; retirer l'option intermédiaire de Q3.

**N9. Q4 C fait échouer le critère 2.** Seuils 0, 100, 500, 1 500, 3 100 : dernier seuil à 100 % du total, au-dessus du plafond de 80 % que le garde-fou de test impose. Écrire dans l'option : « fait échouer le test de 80 % : à n'envisager que si tu acceptes de l'assouplir ».

## 5. Ce qui reste solide

- 1.1 (quatre sources, le conseil du jour et le conseil d'étape exclus) ; totaux 3 100 et 4 300 ; vitesses ; recomptes 1 200 = 39 %, 2 300 = 74 %, 1 600 = 52 %.
- 2.6 : limite dite (la base ne garde que le total), liste jamais commitée, comptes de test à part, seule exception à « jamais de baisse » bornée.
- Spécification d'accessibilité de 3.0 (nom d'abord, « sur 5 », pastilles masquées, contour à 3:1, intitulé « Ton cap », pas de compteur d'étapes voisin) et critère 7.
- Reco « règle A, retirer les 10 XP » argumentée par C4 et non par l'adoption ; règle C gardée prête pour J60.

## 6. Verdict

Presque prêt pour Thomas. Deux bloquants courts : un nom de cap sans accord de genre (N1), et la vérification de l'identifiant du conseil dans la correction de sécurité (N2). Les sept autres points sont des précisions, dont trois à traiter avant de lui montrer le document : « prouvé » (N4), la preuve du cap 5 (N5), et la phrase de la v13 à aligner (N7).
