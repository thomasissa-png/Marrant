# Relecture à l'aveugle, tour 1, @reviewer : libellés de l'espace E5 (exactitude, cohérence)

> 12/11/2026. Relu : `libelles-espace-e5-s24.md` (« l. » = ses lignes). Vérifié mot pour mot : étalon E5 §0.4 et v4 à v6, architecture v20 (2.2, 2.4, 2.6 à 2.9, 3.10, 4.1, 4.4), E1.1, E1.2, E2.1, `parcours-seed.json`, les 6 fichiers de code cités. Exacts : l. 640, 641, 643 du seed, `abonnement-vente.ts` l. 171 à 173, `question-equipe-s22.ts` l. 37 à 39, `layout.tsx` l. 15, `header.tsx` l. 168, `entrees-parcours.ts` l. 20, `resiliation.ts` l. 116, architecture l. 217, 294, 299, 320, 704. Zéro tiret cadratin, zéro émoji, ni IA ni concurrent, accords neutres, longueurs max tenues (recomptées : écart de 1 au plus, toujours sous le max).

## Notes : libellés 7, accroches 9, mission 7, bilan 7. Verdict : pas au niveau, tour 2 nécessaire.

## Libellés, 7/10
1. **l. 13 (ligne 3)** : « première phrase seulement, comme demandé en T1 » est faux. L'étalon v6 T1 (l. 16) **supprime le libellé 3** et affiche `BIENVENUE_PREMIUM.favori` en entier. Couper un texte validé du code revient à le modifier. Réécriture : « Supprimé (étalon v6 T1) : texte réel complet, `abonnement-vente.ts` l. 171 à 173. »
2. **l. 14 (ligne 4)** : la source « architecture 2.2 (chiffres réels affichés, jamais « jusqu'à ») » n'existe pas. La l. 210 dit « jusqu'à 2 cartes à revoir ». Réécriture de la source : « 2.2 l. 210 ; afficher le nombre réel est un choix neuf ». Ajouter aussi le cas manquant « 1 carte à revoir » (sans nouvelle).
3. **l. 38** : « Parcours : facultatif. » se lit comme une vérité de toujours. La v5 de l'étalon (l. 28) et 4.1 (« aucun (facultatif) ») parlent de cette semaine-là. Réécriture : « Semaine 1 : le faux secret, une mission à voix haute. Parcours : facultatif cette semaine. » (89/90)
4. **l. 42** : « il n'existe qu'à Machine à Café » est faux. 3.10 dit « 5, un par parcours », et 4.1 le limite à Machine à Café **dans les 4 semaines** seulement. La phrase contredit en plus la section 4 (bilan de Confiance). Réécriture : « Le bilan n'est pas cité : dans ces 4 semaines, il n'arrive que pour Machine à Café (3 étapes, 4.1). »
5. **l. 33 (ligne 23)** : supprimer « comprendre » change le sens (on demanderait « une technique »). Réécriture : « Tout le reste : comprendre une technique, un contenu, l'offre. » (62/80)
6. **l. 104** : « 24 libellés couverts » est incomplet. Manquent les ajouts 28 et 29 de l'étalon (l. 50 : « Tes répliques sont gardées… », « Tes répliques à toi pour {catégorie} », « 5 min » ou « Moins de 5 minutes ») et ceux de la v6 (l. 21 : « Mon profil », ligne d'adresse de l'équipe, placeholder « Rechercher »). Il faut les écrire ou les déclarer hors périmètre.

**Choix de l'auteur, tranchés**
- **Ligne 20, « Écrire à l'équipe » : validé.** La source est exacte (2.6 l. 294, « libellé déjà validé »). Le libellé couvre les 3 types, alors qu'on ne « pose pas une question » pour un problème de paiement, et il évite le doublon avec « Une question ». Le double « à l'équipe » avec le bouton est accepté, puisque le bouton est un texte du code.
- **Ligne 7, « Jouer les cartes » sous « Si tu as 5 minutes » : validé, avec une condition.** En 2.2 (l. 210) et 4.4 (l. 703), « Si tu as 5 minutes » est le libellé de l'action, choisi pour qu'elle ne soit jamais une obligation. Le garder en titre, collé au bouton, préserve cette intention. Le bouton, lui, doit dire un geste distinct de « Commencer » (§0.4, faute 5). Condition : le titre reste visible directement au-dessus du bouton, sans bloc entre les deux, et 2.2 et 4.4 sont notés comme écart à acter.

## Accroches, 9/10 : A donne le plus envie de jouer
A met un nom sur une frustration intime. Le lecteur se dit « ah, ça porte un nom », ce qui est une vraie observation, et la définition qui suit n'exclut personne. B ouvre sur « tout le monde connaît », formule plate qu'on lit partout, sans surprise. Seule réserve, d'exactitude : l'expression vient de Diderot et désigne la réplique trouvée une fois en bas de l'escalier. « Trois jours » est donc une hyperbole présentée comme une définition (reprise de 2.2, [PISTE]). Ça passe parce que l'exagération se voit. Variante si le jury bute : « L'esprit de l'escalier : la bonne réponse qui arrive une fois la porte refermée. Ici, tu t'entraînes à l'avoir à temps. » (119/120)

## Mission, 7/10 (énoncé fidèle à E2.1 l. 154, 171, 174 ; format et suites conformes à 2.4)
1. **l. 57 et 70** : « Marche 2 sur 5 » et « Marche 1 sur 5 » contredisent la v4 de l'étalon (l. 20 e, l. 21 : « Marche n », sans total, pour ne pas se confondre avec « cap n sur 5 »). Réécriture : « Marche 2 · À un proche, par message » ; « Voir la marche 1 » (« Marche 1 : seul, à voix haute »).
2. **l. 61** : « Provocable cette semaine » est le critère d'écriture interne de 2.4. Ce jargon ne doit pas apparaître à l'écran. Réécriture : « Un message, une personne, dix secondes. »
3. **l. 69** : « la grille » annonce 3 questions mais n'en donne que 2, et « la fin » prend une minuscule après le « ? ». Réécriture : « Relis ton aveu : il tient en une phrase ? La fin surprend ? » (la question 2 ne sert à rien pour un aveu sur soi).

## Bilan, 7/10 (une seule bonne réponse : oui, B ; vannes du seed exactes ; retour au format 3.10 l. 539 et 543)
1. **l. 81** : la scène enfreint la règle de 3.10 (« ne reprend aucun mot de la bonne réponse »). « On se refait ça » reprend « on se » et le verbe « faire » de B (« qu'on se fasse »), et « des » s'y trouve aussi. Le choix devient une simple reconnaissance de mots, alors que 3.10 demande « choisir et dire ». Réécriture : « Fin de soirée chez une amie. Tout le monde cherche son manteau, chacun promet de remettre ça bientôt. Personne ne sort son agenda pour fixer une date. » (aucun mot de B)
2. **l. 84** : « le groupe. Ils rient » met le singulier et le pluriel en conflit. Réécriture : « Tu connais bien la bande : elle rit volontiers de ses propres habitudes. » (aucun mot de B)

## Top 3 avant le tour 2
1. Retirer « sur 5 » de la mission (décision v4 de l'étalon).
2. Refaire la scène du bilan sans « on se » ni « faire ».
3. Corriger les sources fausses : l. 13 (T1), l. 14 (« jamais jusqu'à »), l. 42 (bilan).
