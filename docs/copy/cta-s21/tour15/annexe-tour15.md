# Annexe du tour 15 : méthode, vérifications, libellés partagés

## 1. Pourquoi un vote

Depuis le tour 12, B3, B10 et B12 oscillent entre 8 et 10 et chaque relecteur propose une version différente. Au tour 14 : B3 9, 8, 9 ; B10 9, 8, 9 ; B12 9, 9, 9 (aucune alerte). Plutôt qu'une 16e réécriture, le tour 15 soumet à l'aveugle les versions déjà produites (actuelle, r1, r2, r3, plus B10 du tour 13) et laisse les relecteurs classer. Les 14 autres blocs ne sont pas touchés (B1, B2, B4+B5, B6, B7, B8, B9, B11, B13 à B18 : `tour14/textes-finaux.md` reste la référence).

## 2. Candidats par bloc

- **B3** : 5 candidats (actuel, r1, r2, r3, une synthèse de ma main).
- **B10** : 5 candidats (actuel, tour 13, r1, r2, r3). Pas de synthèse : la limite de 5 est atteinte, et aucune combinaison ne m'a paru nettement meilleure.
- **B12** : 4 candidats (actuel, r1, r2, r3). Pas de synthèse : je n'en vois pas de nettement meilleure. Les trois relecteurs ne proposent que la phrase de profil de L'Absurde, et aucune autre version de profil n'a été contestée (les quatre autres sont notées « au niveau » par les trois).

La synthèse de B3 (candidat B) n'invente rien : lien de r1 + note de r3. Elle répond aux deux critiques les plus fréquentes (lien « 5 parcours » abstrait pour un visiteur qui ne connaît pas le mot, titre d'étape payante noyé dans une incise). Je ne la présente pas comme meilleure que les autres, seulement comme la seule combinaison que les verdicts suggèrent ensemble.

## 3. Présentation compacte de B12

Les trois relecteurs ont laissé inchangées les versions de L'Observateur, du Storyteller, du Punchlineur et du Taquin. Dans le pack, ces quatre versions sont donc données **une seule fois** (« partie commune »), et chaque candidat donne **en entier** sa version L'Absurde (phrase, bouton, lien, ligne Premium). Chaque candidat reste complet (partie commune + sa version), la consigne le dit en toutes lettres. Si tu préfères cinq versions développées par candidat (4 fois les mêmes quatre profils), c'est un copier-coller sans risque, mais le pack passerait d'environ 260 à environ 400 lignes et les relecteurs compareraient quatre fois du texte identique.

## 4. Vérifications de faits et de forme

- **Tiret cadratin** : Grep sur `tour15/` (« — ») : aucun. Les candidats ne contiennent aucun tiret cadratin.
- **Note `[S20]` de B3 (limite 190, espaces compris, guillemets « » et apostrophes comptés comme un caractère)**. Comptage fait par expression régulière exacte (`^.{N}$`) sur un fichier de travail, pas à la main :

| Candidat | Origine | Caractères | Verdict |
|---|---|---|---|
| A et B | note de r3 | **183** | OK (r3 annonçait 184 : écart d'un caractère, sans conséquence) |
| C et E | note actuelle (tour 14) | **186** | OK |
| D | note de r2 | **189** | OK, à un caractère de la limite (r2 annonçait 189, exact) |

  Le comptage est fait avec des espaces simples ; en rendu, les espaces insécables U+00A0 (avant « : », « € ») valent aussi un caractère, donc le compte ne change pas.
- **Erreurs de fait ou de limite dans les versions des relecteurs : aucune trouvée, donc aucune correction.** Détail des points contrôlés :
  - r1, B3 : « de la coloc à l'afterwork » vient des cartes (Répartie : « en coloc » ; Machine à Café : « à l'afterwork »). Vrai pour la gamme des 5 parcours.
  - r1, B10 : « Premium ... ouvre les 5 parcours en entier, 15 à 20 minutes par étape, un défi à chaque fois » et « les points clés de cette vidéo et son exercice » sont dans les faits vrais.
  - r2, B3 : « avec un conseil, un défi, 5 vannes et 2 vidéos » est le contenu de l'étape 1 (le quiz est omis, rien de faux). Le mot « parcours » n'est plus dans la note (le lien le porte).
  - r2, B10 : « ouvre les 5 parcours en entier, 15 à 20 minutes par étape, et tes favoris » : les favoris font bien partie de Premium. La phrase est un peu dense mais exacte.
  - r3, B10 : « cette vidéo a ses points clés et son exercice » dans Premium : conforme au fait précis, sans rien dire du contenu de l'analyse.
  - r1, r2, r3, B12 : « t'apprend à repérer où il y a de la place pour toi / pour elles » reprend la présentation publique de l'étape 2 (« où il y a de la place pour toi »). Étape 2 de Machine à Café, 15 minutes, 3 étapes : exact.
- Aucune promesse de résultat, aucun témoignage, aucune mention de concurrent. « Résiliable depuis ton profil » partout, jamais « en un clic ».

## 5. Libellés partagés avec des blocs déjà validés : à décider si un candidat gagne

Aucune modification n'est branchée ici. Les candidats suivants changent un libellé que d'autres blocs validés utilisent :

| Candidat | Libellé changé | Utilisé aussi par | Si ce candidat gagne |
|---|---|---|---|
| B3 D | Bouton `[S19]` « Trouver mes premières répliques, gratuit » (au lieu de « Tester mes premières répliques, gratuit ») | B2 `[S6]` (bouton plein), B4+B5 (bouton contour) : tous deux validés avec « Tester » | Soit libellé propre à B3 (deux chaînes différentes dans le code), soit rouvrir B2 et B4+B5. Décision de Thomas |
| B3 D | Lien « Ouvrir la suite et les 5 parcours · 2,99 €/mois » (au lieu de `OUVRIR`) | `OUVRIR` : B2 (lien), B4+B5 (bouton plein), B16 (bouton générique) | Même arbitrage : chaîne propre à B3, ou rouvrir les blocs validés |
| B3 B et E | Lien « Ouvrir les 5 parcours, de la coloc à l'afterwork · 2,99 €/mois » (62 caractères, il passera sur deux lignes à 360 px) | `OUVRIR` (même liste) | Même arbitrage. À vérifier au rendu à 360 px |
| B10 C | Contour `[S25]` « Gratuit : 2 vidéos et un défi, étape 1 du parcours Répartie » (au lieu de « ... étape 1 de Répartie ») | Gabarit (b) de `[S25]` commun à B8, B9, B10 | B8 et B9 (validés) gardent « étape 1 de {P} » : la fiche vidéo aurait un gabarit différent. Soit B10 seul, soit rouvrir B8 et B9 |

Les candidats A et C de B3 (bouton et lien actuels), les candidats A, B, D, E de B10 et les quatre candidats de B12 ne changent aucun libellé partagé (B12 : bouton et lien identiques dans les quatre candidats, c'est seulement la phrase de la ligne Premium de L'Absurde qui varie ; elle est propre à B12).

## 6. Ordre des lettres

Je n'ai pas d'outil de tirage aléatoire dans cet environnement (pas de shell). L'ordre a été fixé à la main, de façon arbitraire, avec trois garde-fous vérifiables dans `cles-tour15.md` : la version actuelle n'est première (A) dans aucun bloc ; aucune origine ne garde la même lettre dans les trois blocs ; l'ordre dans lequel les candidats apparaissent n'est ni celui des relecteurs (r1, r2, r3) ni chronologique. Si Thomas veut un tirage vérifiable, il suffit de permuter les blocs `Candidat X` du pack et de mettre à jour la clé.

## 7. Dépouillement conseillé

- Pour chaque bloc : compter les premières places, puis la moyenne des notes d'envie de payer. Un candidat qui est premier chez au moins deux relecteurs sur trois est le vainqueur ; sinon, départager par la moyenne, puis par le nombre de 10.
- Un vainqueur n'est en ligne que s'il a **10 chez les trois relecteurs** (règle d'or P0 s18 : rien en ligne sous la barre). Sinon, appliquer au vainqueur seulement les « manques pour 10 » cités par au moins deux relecteurs, et le repasser à l'aveugle seul. Ne pas relancer de vote à plusieurs candidats une 3e fois : les deux tours consécutifs de désaccord disent que le plafond de la méthode est atteint, et c'est alors à Thomas de trancher entre les deux premiers.
- Vérifier ensuite que le vainqueur ne casse pas les libellés partagés (section 5) et que `[S20]` reste à 190 caractères au plus.
- Les alertes d'un relecteur sur un candidat précis (fait faux, promesse, ton IA) disqualifient ce candidat tant qu'elles ne sont pas levées.

## 8. Handoff

- Fichiers produits : `/home/user/Marrant/docs/copy/cta-s21/tour15/pack-tour15.md` (à envoyer aux relecteurs), `/home/user/Marrant/docs/copy/cta-s21/tour15/cles-tour15.md` (à garder secret), `/home/user/Marrant/docs/copy/cta-s21/tour15/annexe-tour15.md`.
- Pas de commit. `tour14/textes-finaux.md` reste la référence tant que le vote n'est pas dépouillé.
- Framework et conscience : B3 [AIDA court, Problem-Aware]. B10 [PAS, Solution-Aware, venu pour la vidéo]. B12 [Bridge « résultat vers premier pas », Product-Aware]. Inchangés depuis le tour 14.
- Objections traitées : prix, résiliation, remboursement, compte, vocabulaire du site (« parcours »), preuve de valeur avant paiement (étape 1 gratuite). Aucun témoignage, aucune donnée inventée.
