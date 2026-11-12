# Libellés de l'espace Premium, étalon E5 (s24)

> Auteur : @copywriter, 12/11/2026. Source : `docs/design/etalon-e5-s24.md` §0.4 ; `architecture-contenu-v20.md` (2.2, 2.4, 2.6, 2.7, 2.9, 3.10, 4.1, 4.4) ; barre : `etalons-espace-s24.md` ; ton : `ton-alex.md`. Aucun HTML modifié.
> Règles tenues : tutoiement, zéro tiret cadratin, zéro émoji, aucune mention d'IA ni de concurrent, aucun accord au masculin ou au féminin pour l'abonné (formes neutres), « » partout, aucun prix, aucune donnée inventée. `Max` = caractères, espaces compris ; `n` = longueur du texte proposé.
> `[Framework : démonstration puis geste]` `[Conscience : Solution-Aware]` (il est abonné). **Statut : non relu à l'aveugle** (règle d'or P0 s18 : les textes neufs, l'accroche, la mission et le bilan passent la relecture avant mise en ligne).

## 1. Les 24 libellés de §0.4

| # | Texte proposé | n / max | Source |
|---|---|---|---|
| 1 | « Ton premier pas » | 15 / 24 | architecture 4.4 (« le premier pas »), étiquette neuve |
| 2 | « Commencer » | 9 / 16 | architecture 4.4 l. 704 (« Commencer l'étape 1 ») |
| 3 | Vanne : « Ta vanne est dans tes favoris. » Conseil : « Ton conseil est dans tes favoris. » Vidéo : « Ta vidéo est dans tes favoris. » | 31 à 32 / 40 | `abonnement-vente.ts` l. 171 à 173 (première phrase seulement, comme demandé en T1) |
| 4 | « 1 situation nouvelle, 2 cartes à revoir ». Singulier : « 1 situation nouvelle, 1 carte à revoir ». Sans nouvelle : « 2 cartes à revoir ». Sans révision : « 1 situation nouvelle » | 39 / 50 | architecture 2.2 (chiffres réels affichés, jamais « jusqu'à ») ; neuf |
| 5 | « Nouvelle » et « À revoir » | 8 / 12 | « À revoir » : architecture 2.2 ; « Nouvelle » : neuf |
| 6 | Entrée 1 : « Soirée : le « et toi ? » ». Entrée 2 : « Amis : le « quoi de neuf ? » » | 26 et 29 / 40 | modèle « Coloc : la poêle » (`etalons-espace-s24.md` E1.1) ; univers de E1.2 entrées 1 et 2 ; neuf |
| 7 | « Jouer les cartes » (bouton). En titre de la carte : « Si tu as 5 minutes » | 16 / 20 | « Si tu as 5 minutes » : architecture 2.2 (libellé de l'action) ; bouton neuf, distinct de « Commencer » |
| 8 | « À toi : ressors-la à voix haute ce soir. » (conservé) | 41 / 50 | texte de la maquette, rien à gagner à le changer ; geste de E1 (« dis-la à voix haute ») |
| 9 | « Étape en cours » ; « Étape conseillée » | 15 et 17 / 24 | architecture 4.1 (« parcours conseillé »), 4.4 ; `entrees-parcours.ts` l. 20 (« Reprendre ton parcours ») |
| 10 | « Notifications » | 13 / 20 | architecture 2.9 (nom accessible) |
| 11 | Titre de groupe : « Nouveau ce mois-ci ». Lignes : « Le carnet du mois », « De nouvelles situations », « La lettre du jeudi 12 novembre ». Réponse : « L'équipe t'a répondu » | 18 à 33 / 40 | architecture 2.9 (groupes) et 2.8 (« La lettre du jeudi 12 novembre ») |
| 12 | « Vanne affichée : {catégorie} », « Vanne du jour affichée », « Une autre vanne affichée ». « Aller au contenu principal », « Rechercher », « Menu du compte », « Plus de rubriques » | 24 à 30 / 40 | « Aller au contenu principal » : `(dashboard)/layout.tsx` l. 15 ; « Rechercher » : `header.tsx` l. 168 ; le reste neuf |
| 13 | Voir ci-dessous (4 lignes) | 76 à 83 / 90 | tableau d'architecture 4.1 |
| 14 | « Les parcours » | 13 / 30 | `resiliation.ts` l. 116 (même mot) ; titre de page existant |
| 15 | Voir section 2 | voir 2 | neuf |
| 16 | « Laquelle convient au contexte ? » | 32 / 40 | architecture 2.2 l. 217 (« la réplique qui convient au contexte ») |
| 17 | « Cette carte reviendra dans 7 jours. » ; « Cette carte reviendra dans 2 jours. » ; modèle : « Cette carte reviendra dans {n} jours. » (21 jours : même phrase) | 36 / 40 | règle de révision, architecture 2.2 (J+2, J+7, J+21). Pas de ligne pour « Oui » (aucun retour prévu) |
| 18 | « Ton retour » | 11 / 20 | `mission.html` (même légende), architecture 2.4 |
| 19 | « Supprimer cette réplique ? » ; « Supprimer » (confirmation) ; « Annuler » ; « Supprimée » ; échec : « L'enregistrement n'a pas abouti. Ton texte est toujours là. » (59/60) ; compteur : « 1 caractère », « {n} caractères » (ou « {n} / {max} caractères » quand @fullstack fixe le plafond) | 27 / 30 ; 59 / 60 | texte de la maquette conservé ; compteur : `question-equipe-s22.ts` l. 38 ; « Enregistrée », « Réessayer » : architecture 2.7 |
| 20 | Titre de la page : « Écrire à l'équipe » (évite le doublon avec le type « Une question »). « De quoi s'agit-il ? » (au lieu de « Type de message »). « Ton message ». « Envoyer à l'équipe » | 17 / 30 ; 19 ; 12 ; 19 | « Écrire à l'équipe » : libellé validé, architecture 2.6 l. 294 ; « Envoyer à l'équipe » : `question-equipe-s22.ts` l. 39 ; le reste neuf |
| 21 | « Envoyé le {date} » ; « Répondu le {date} » ; « Réponse de l'équipe, le {date} » ; « Par exemple, pour « Une question » : » | 36 / 40 | architecture 2.6 (états Envoyé et Répondu) ; neuf |
| 22 | « Retirer de mon historique » | 25 / 30 | architecture 2.6 (« retiré de ton historique »), décision C10 a |
| 23 | Exemple : « Est-ce que cette blague est lourde ? Voici la scène… » (conservé [PISTE]). Description de « Une question » : « Tout le reste : une technique, un contenu, l'offre. » | 54 et 51 / 80 | architecture 2.6 l. 299 et 320 ; description reprise sans la parenthèse |
| 24 | « Un problème » : « Mon paiement est passé, mais je n'ai pas accès aux parcours. » (59). « Une situation à gérer » : « Un collègue me chambre devant tout le monde, je n'ai rien trouvé à répondre. » (77) | 59 et 77 / 80 | le second : `question-equipe-s22.ts` l. 37 passé à la première personne ; le premier neuf |

### Ligne 13, calendrier (jamais un verrou)
Intro : « Un ordre conseillé, jamais un verrou. » (architecture 4.1)
- « Semaine 1 : le faux secret, une mission à voix haute. Parcours : facultatif. » (76)
- « Semaine 2 : une étape de parcours, un mot de vocabulaire, une mission par message. » (82)
- « Semaine 3 : l'étape suivante, une séance de 20 minutes, une mission en face. » (76)
- « Semaine 4 : l'étape suivante, un premier « Écouter, repérer », une mission en face. » (83)
Source : tableau 4.1 (marche 1, 2, 3, 3). La rafale quotidienne est dite une fois en tête de page, pas répétée. Le bilan n'est pas cité (il n'existe qu'à Machine à Café, 3 étapes).

## 2. Accroche de la rafale (max 120), test à l'aveugle

Même promesse dans les deux : s'entraîner à trouver sa réponse sur le moment. Affichée au-dessus de « Si tu as 5 minutes ».

- **A (avec le mot)** : « L'esprit de l'escalier, c'est la bonne réponse trois jours trop tard. Ici, tu t'entraînes à l'avoir à temps. » (108)
- **B (sans le mot)** : « La bonne réponse qui arrive trois jours trop tard, tout le monde connaît. Ici, tu t'entraînes à l'avoir à temps. » (112)

À juger : A nomme et définit le phénomène, B le décrit sans nom (même seconde phrase). Les variantes de « esprit de l'escalier » dans E3 donnent « dix minutes plus tard, dans la rue » : l'accroche suit l'architecture (« trois jours »). Verdict à consigner dans `etalon-e5-s24.md` après relecture à l'aveugle (T5).

## 3. Mission complète : Confiance, marche 2 (à un proche, par message)

Le parcours Confiance couvre l'autodérision et le trac avant (architecture 0). La mission reprend le mécanisme déjà appris en semaine 1, « Le faux secret » (`etalons-espace-s24.md` E2.1). [Framework : démonstration puis geste]

**Marche 2 sur 5** · **À un proche, par message**

**Énoncé**
Envoie ton faux secret à quelqu'un de proche, par message. Une seule phrase : « Ça reste entre nous : » puis un aveu minuscule, sur toi, avec un détail que tout le monde reconnaît. Rien après le dernier mot, pas de « non mais je rigole ».
(Provocable cette semaine : un message, une personne, dix secondes.)

**Facultative.** Jamais comptée contre toi.

**Ton retour** : « Pas essayé » · « Essayé, bof » · « Essayé, ça a marché »

**Ce qui suit chaque retour (selon le retour, jamais selon la date)**
- **Essayé, ça a marché** : « Marche suivante : le dire à un pote, en face. » Bouton : « Voir la marche 3 ».
- **Essayé, bof** : « Un message qui ne prend pas, ça arrive. Relis ton aveu avec la grille : une phrase ? la fin surprend ? » Liens : « Une autre situation, même marche » ; « Quand ça tombe à plat » ; « Raconte-nous ce qui s'est passé » (vers Mes questions, type « Situation à gérer »).
- **Pas essayé** : aucun texte, la mission reste là. **Deux fois de suite** : sans commentaire, le bouton « Voir la marche 1 » (« Marche 1 sur 5 : seul, à voix haute »).

Sources : format et suites : architecture 2.4 ; grille : 2.4 et E2.1 ; liens : `mission.html`. Texte neuf : l'énoncé et les deux phrases de retour.

## 4. Question de bilan complète : Confiance, étape 1

Format de l'architecture 3.10 : « Laquelle ressortir ici ? », trois vannes **du parcours** (étape 1, « Énoncer la règle non écrite », `docs/content/parcours-seed.json` l. 640, 641 et 643), seuls le contexte et le retour sont neufs, le contexte ne reprend aucun mot de la bonne réponse, pas de note ni de seuil. [Framework : démonstration puis geste]

**Bilan du parcours** · **Refais une situation**

**La scène**
Fin de soirée chez des amis. Tout le monde cherche son manteau et les promesses fusent : « On se refait ça très vite ! » Personne ne sort son téléphone pour fixer une date.

**Le contexte**
Tu connais bien le groupe. Ils rient volontiers de leurs propres habitudes.

**Ta réponse d'abord** (texte de la maquette, inchangé) puis « Tu avais une réponse ? » : Oui, À moitié, Rien.

**Question** : Laquelle ressortir ici ?
- A. « En France, la pause déjeuner est sacrée. Dis à un collègue que t'as sauté le tien. »
- B. « Mon meilleur pote et moi, on se dit « il faudrait qu'on se fasse un truc » depuis des années. »
- C. « Quand quelqu'un commence par « à la base », il faut être patient. »

**Retour** (une seule bonne réponse : B)
« B. Elle dit tout haut la règle non écrite de cette fin de soirée, avec toi dedans, sans viser personne. A et C sont bonnes, pour un autre moment. »
Si A ou C : « Pas celle-là cette fois. L'étape « Énoncer la règle non écrite » mérite un deuxième tour. » (lien vers la fiche)

Pourquoi une seule bonne : A parle de midi et du travail, C vise ceux qui parlent plutôt que l'ambiance, B prolonge ce que le groupe vit déjà. [HYPOTHÈSE : B est bien la bonne à l'oreille d'un relecteur à l'aveugle ; à vérifier.]

## Handoff
- Fichier : `/home/user/Marrant/docs/copy/libelles-espace-e5-s24.md` ; aucun autre fichier modifié, aucun commit.
- Réutilisé : lignes 3, 14, 16, 17, 19, 20 (partiel), 22, 24 (partiel), mission et bilan sur 2.4, 3.10 et `parcours-seed.json` ; neufs : 1, 4, 5, 6, 7 (bouton), 9, 12 (partiel), 21, accroches, énoncé, contexte du bilan.
- À trancher : ligne 20, « Écrire à l'équipe » remplace « Poser une question » (doublon avec le type) ; ligne 7, bouton « Jouer les cartes » plus titre « Si tu as 5 minutes ».
- À faire passer à l'aveugle : accroches A/B, énoncé de mission, question de bilan (B bonne), lignes 6 et 24 ; les vannes du bilan viennent du seed Confiance.
- Mesure : 24 libellés couverts, longueurs maxi tenues (n relevé à la main, à recompter par @fullstack à l'intégration).
