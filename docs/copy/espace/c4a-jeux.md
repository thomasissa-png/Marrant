# C4a : « Jeux », lot 1 (10 jeux), tour 3

> Auteur : @copywriter, 12/11/2026. Lot C4a du plan s24 §5 (l. 196 : 30 jeux en 3 lots de 10) ; type « jeu » : `architecture-contenu-v20.md` §3.9 (l. 528 à 534) : un défi de 3 à 5 minutes avec « ce qu'on aurait pu dire ». Schéma `apps/web/src/lib/espace/fiches-schema.ts` l. 264 à 288 `[PROVISOIRE]` : `famille`, `consigne`, `matiere`, `situationsReprises`, `ceQuOnAuraitPuDire`, `explication`. Chaque jeu ci-dessous suit ces champs : famille, consigne, matière, situation reprise, ce qu'on aurait pu dire, retour court.
> **Lot de 10, 5 familles sur 6** (« Les pires réponses » est pour C4b ou C4c) : 3 « Quelle réplique ? », 2 « Finis la phrase », 2 « Trouve l'angle », 2 « Change de registre », 1 « Choisis la chute » (jeu de choix ; « Remets la chute » reste le jeu d'écriture de l'architecture l. 933, pour C4b).
> « Quelle réplique ? » reprend les situations validées par leur identifiant : les trois répliques sont **reprises mot pour mot** de `qr1-situations.md` (A5), `qr2-situations.md` (S5), `qr3-situations.md` (M2), seul le contexte est neuf ; une seule bonne réponse par contexte.
> « Choisis la chute » reprend une vanne réelle du site (`docs/content/vannes-actives-s19.json` l. 677-678, mot pour mot, lecture seule).
> `[Framework : démonstration puis geste]` `[Conscience : Product-Aware]`. Retour de chaque jeu : `[Retour : Pas essayé / Essayé, bof / Essayé, ça a marché]` `[Ma réplique à moi : une phrase, facultative]` (écrans de l'application, pas du texte à écrire). Chaque jeu commence par : « Dis ta réponse avant de lire la suite. Rien n'est noté. »
> Règles tenues (`checklist-fautes-recurrentes.md` relue) : tutoiement ; aucun accord au masculin ou au féminin pour l'utilisateur ni pour la personne d'en face (« la personne », « quelqu'un », relu ligne à ligne) ; zéro tiret cadratin, zéro émoji, ni IA ni concurrent, aucune marque ; guillemets « » et “ ” ; aucune note interne dans le texte affiché ; une seule bonne réponse par jeu à choix ; aucune réplique déjà utilisée dans C1a, C1b, C6a ni C6c ; aucun humoriste cité.

---

## Jeu 1. Quelle réplique ? (situation reprise : QR1 A5, « Amis : “Tu as changé quelque chose, non ?” »)

**Consigne.** Pause de midi. Quelqu'un qui te lance un défi chaque lundi, et en perd la moitié, te détaille de haut en bas : « Tiens, tu as changé quelque chose, non ? » Rien n'a changé. Laquelle dis-tu ?

**Matière.**
A. « Peut-être. Je te préviens si je le découvre avant toi. »
B. « J'ai changé de dentifrice. Tu as l'œil. »
C. « Trois essais. Si tu ne trouves pas, c'est toi qui offres le café. »

**Ce qu'on aurait pu dire.** C.
**Retour.** La personne aime les défis : un nouveau pari lui répond en face, truqué en toute franchise. B s'arrêterait un cran trop bas ; A ne relèverait pas son jeu.

---

## Jeu 2. Quelle réplique ? (situation reprise : QR2 S5, « Soirée : “Tu pars déjà ?” »)

**Consigne.** Fin de soirée. Au vestiaire, quelqu'un que tu viens de rencontrer te lance, sans sourire : « Tu pars déjà ? » Laquelle dis-tu ?

**Matière.**
A. « Je file pendant que tout le monde m'aime encore. »
B. « À minuit, mon énergie a fini son service. La relève ne viendra pas. »
C. « Mon carrosse est un taxi, et le compteur tourne. »

**Ce qu'on aurait pu dire.** A.
**Retour.** Pas de sourire, et quelqu'un que tu connais à peine : A part sur une bonne impression, en une phrase, sans rien à justifier ni rien demander à l'autre. B parle de ta fatigue en deux phrases : il faut déjà de la complicité pour que ça passe. C répondrait à une image que personne n'a lancée.

---

## Jeu 3. Quelle réplique ? (situation reprise : QR3 M2, « Amis : “Eh, tu n'as pas ri à ma blague !” »)

**Consigne.** Dîner à quatre. Quelqu'un vient de raconter une blague ; tu n'as pas ri, tu cherchais ton verre. La personne te lance : « Eh, tu n'as pas ri ! » Puis, en souriant : « Remarque, la prochaine est bien meilleure, je la gardais pour le dessert. » Laquelle dis-tu ?

**Matière.**
A. « Si, en différé. Le signal arrive jeudi. »
B. « J'ai ri à l'intérieur. Les murs sont épais. »
C. « Vas-y, raconte la suivante. Cette fois, je pose mon verre. »

**Ce qu'on aurait pu dire.** C.
**Retour.** La personne a elle-même annoncé une meilleure blague : tu lui tends la perche, et tu avoues la vraie cause, ton verre. A fermerait ce qu'elle vient d'ouvrir ; B laisserait passer son jeu.

---

## Jeu 4. Finis la phrase (règle de trois)

**Consigne.** Finis en une phrase, d'un souffle : deux éléments attendus, puis un troisième qui déraille.

**Matière.** « Pour bien commencer la journée, il me faut : un café, une douche, et… »

**Ce qu'on aurait pu dire.**
- « …dix minutes pour faire semblant d'avoir envie. »
- « …une excuse prête pour 9 h 05. »

**Retour.** Les deux premiers sont attendus ; le troisième garde la même tournure et change de camp. Un quatrième élément aurait dilué la chute (fiche « La règle de trois »).

---

## Jeu 5. Finis la phrase (détail trop précis)

**Consigne.** Finis par un seul détail, plus exact que ce qu'on retiendrait, en dernier.

**Matière.** « Mon “je m'y mets demain” pour ranger le garage date d'exactement… »

**Ce qu'on aurait pu dire.**
- « …quatre cent douze jours. »
- « …huit cent six jours. »

**Retour.** Un seul détail, le chiffre exact, dit sans sourire : personne ne compte les jours d'un “demain”. Un second détail l'aurait dilué (fiche « Le détail trop précis »).

---

## Jeu 6. Trouve l'angle

**Consigne.** Objet : la salle d'attente du dentiste. Note trois choses vraies sur elle, pas des blagues.

**Ce qu'on aurait pu relever.**
1. Une affiche qui explique comment se brosser les dents.
2. Une plante en plastique, toujours parfaitement verte.
3. Tout le monde fait semblant de lire en écoutant la porte.

**Retour.** L'angle qui travaille le mieux est le troisième : un non-dit que tout le monde partage. Les deux premiers sont des détails isolés. La blague vient ensuite, de ce que tu fais de lui. Par exemple : « Chez le dentiste, tout le monde relit l'affiche sur le brossage, comme si c'était le dernier moment pour réviser. »

---

## Jeu 7. Trouve l'angle

**Consigne.** Objet : l'ascenseur du bureau. Note trois choses vraies sur lui, pas des blagues.

**Ce qu'on aurait pu relever.**
1. Une plaque « charge maximale » que personne ne lit.
2. Chacun sort son badge deux étages avant le sien.
3. Une affiche de la fête de l'entreprise, datée de l'an dernier.

**Retour.** Le deuxième travaille le mieux : un geste que tout le monde fait ensemble, et dont personne ne parle. Les deux autres sont des détails. Par exemple : « Dans l'ascenseur, chacun sort son badge deux étages trop tôt, comme à la douane de son propre palier. »

---

## Jeu 8. Change de registre

**Consigne.** Dis « Je n'ai pas fait les courses. » comme un communiqué officiel, en une phrase.

**Matière.** « Je n'ai pas fait les courses. »

**Ce qu'on aurait pu dire.** « Communiqué : les courses n'ont pas eu lieu, la population est invitée à rester calme. »

**Retour.** Le fait reste le même et vrai ; seule la voix change : un mot de communiqué en ouverture, une consigne solennelle en fermeture. Rien de nouveau n'est inventé sur quelqu'un.

---

## Jeu 9. Change de registre

**Consigne.** Dis « Je suis en retard. » comme un bulletin météo, en une phrase.

**Matière.** « Je suis en retard. »

**Ce qu'on aurait pu dire.** « Prévisions : retard persistant, éclaircies vers 19 h. »

**Retour.** Le fait est gardé (le retard) ; la voix est celle de la météo : un mot du métier (« prévisions », « éclaircies ») et une heure exacte. Une phrase, et tu t'arrêtes.

---

## Jeu 10. Choisis la chute (vanne du site, `vannes-actives-s19.json` l. 677-678)

**Consigne.** Voici le début d'une vanne : « J'ai laissé un avis cinq étoiles à ma boulangerie. La boulangère m'a répondu “à demain !”. » Laquelle est la vraie chute ?

**Matière.**
A. « Depuis, je lui laisse un avis sur ses baguettes. »
B. « Depuis, je passe par l'autre rue. »
C. « Depuis, je prends deux croissants. »

**Ce qu'on aurait pu dire.** B : « Depuis, je passe par l'autre rue. »
**Retour.** La vraie chute retourne l'effet attendu : le compliment devient une obligation, et tu évites la boulangerie. A et C prolongent le geste sans rien retourner.

---

## Annexe : recherche web (idée et phrase), notes internes

**Méthode.** Pour chaque texte drôle neuf des jeux 4, 5, 8 et 9, une recherche avec la phrase exacte et son idée. Résultat : **0 occurrence** de la phrase ; aucune blague connue sur la même idée dans les résultats (preuve partielle). Les jeux 1 à 3 reprennent des répliques déjà validées (contextes neufs, aucun texte drôle neuf). Les jeux 6 et 7 sont des observations, pas des blagues. Les options fausses du jeu 10 sont volontairement plates (non cherchées).

| Jeu | Phrase cherchée | Résultat |
|---|---|---|
| 4 | « …un café, une douche, et dix minutes pour faire semblant d'avoir envie. » ; « …une excuse prête pour 9 h 05. » (tour 3) | 0 (idée : les routines du matin existent ; l'excuse prête pour l'arrivée au bureau, non trouvée) |
| 5 | « Mon “je m'y mets demain” pour ranger le garage date d'exactement… quatre cent douze jours. » ; « …huit cent six jours. » (tour 3) | 0 (l'idée de la procrastination est générale ; le chiffre exact des jours pour ranger le garage, non trouvé) |
| 6 | Item : « Une affiche qui explique comment se brosser les dents. » ; exemple : « Chez le dentiste, tout le monde relit l'affiche sur le brossage, comme si c'était le dernier moment pour réviser. » (tour 3) | 0 |
| 7 | Observation : « Chacun sort son badge deux étages avant le sien. » ; exemple : « …chacun sort son badge deux étages trop tôt, comme à la douane de son propre palier. » (tour 3) | 0 (idée : le malaise d'ascenseur est étudié, le badge sorti trop tôt non trouvé) |
| 8 | « Communiqué : les courses n'ont pas eu lieu, la population est invitée à rester calme. » | 0 |
| 9 | « Prévisions : retard persistant, éclaircies vers 19 h. » | 0 (la météo comme registre existe en général, pas cette phrase) |

## Tour 2 : retouche → ligne

| Retouche (source) | Ligne changée |
|---|---|
| Jeu 1 : le contexte recopie presque la rafale 2 de A5 ; « café » souffle la réponse (reviewer, elon, critique) | Contexte neuf et court : « Pause de midi. Quelqu'un qui te lance un défi chaque lundi, et en perd la moitié, te détaille de haut en bas : … » (reviewer) ; plus de pari payé en café ; retour : « La personne aime les défis : un nouveau pari lui répond en face, truqué en toute franchise. » |
| Jeu 2 : deux réponses défendables (« Il n'est que minuit ! » appelle le carrosse ; les assiettes) (reviewer, elon) | Contexte reformulé, répliques S5 inchangées : « Fin de soirée, minuit passé. Au vestiaire, quelqu'un que tu viens de rencontrer te lance, sans sourire : « Tu pars déjà ? » » ; retour : « B demande un sourire pour passer ; C répondrait à une image que personne n'a lancée. » |
| Jeu 3 : « je pose mon verre » absent du contexte ; retour « vraie cause » sans objet (reviewer, critique) | Contexte : « tu n'as pas ri, tu cherchais ton verre » ; retour : « …tu avoues la vraie cause, ton verre. » |
| Jeu 4 : 2e chute calcul (critique) | « …le courage d'ouvrir mes messages. » Recherche : 0. |
| Jeu 5 : deux détails par réponse ; guillemets imbriqués (les trois) | « …vingt-trois minutes et quarante secondes. » et « …onze minutes et douze secondes. » ; “j'arrive dans cinq minutes” ; retour : « Un seul détail, le chiffre exact… ». Recherche : 0. |
| Jeu 6 : la plante est aussi un non-dit partagé ; rien de drôle (reviewer, critique, elon) | Item 2 : « Une plante en plastique, toujours parfaitement verte. » (détail isolé) ; exemple ajouté au retour : « En salle d'attente, on tourne les pages au rythme de la porte. » (elon). Recherche : 0. |
| Jeu 7 : deux non-dits ; « les aider à monter » est déjà une blague (les trois) | Item 2 : « Chacun appuie sur le bouton déjà allumé, au cas où. » (critique) ; item 3 : « Une affiche de la fête de l'entreprise, datée de l'an dernier. » (reviewer) ; retour : « Le deuxième travaille le mieux… Les deux autres sont des détails. » avec exemple. Recherche : 0. |
| Jeu 10 : A « six étoiles » défendable ; guillemets imbriqués ; nom du jeu (reviewer, elon, critique, session) | A : « Depuis, je lui laisse un avis sur ses baguettes. » ; “à demain !” ; jeu renommé « Choisis la chute ». |
| Titres des jeux 1 à 3 (elon) | Guillemets intérieurs en “ ”. |
| Non changé | Jeux 8 et 9 (10 chez deux relecteurs sur trois ; le communiqué de la critique est une proposition non retenue), répliques A5, S5, M2 et vanne l. 677-678 mot pour mot. |

## Tour 3 : retouche → ligne

Recherche web (phrase et idée) de chaque texte neuf : **0 occurrence** de la phrase ; aucune blague connue sur la même idée dans les résultats.

| Retouche (source) | Ligne changée |
|---|---|
| Jeu 2 : « minuit passé » pousse vers B et C ; la raison qui écarte B est affirmée, pas montrée ; A peut passer pour de la vanité (elon, critique) | Scène sans « minuit » : « Fin de soirée. Au vestiaire, quelqu'un que tu viens de rencontrer te lance, sans sourire : « Tu pars déjà ? » » (elon). Retour : A part sur une bonne impression, en une phrase, sans rien demander à l'autre ; B parle de ta fatigue en deux phrases (« il faut déjà de la complicité pour que ça passe ») ; C répondrait à une image que personne n'a lancée. Répliques S5 inchangées. |
| Jeu 4 : « le courage d'ouvrir mes messages » est une idée courante (critique) | « …une excuse prête pour 9 h 05. » (critique). Recherche : 0. |
| Jeu 5 : « j'arrive dans cinq minutes » est un gabarit connu et double le retard du jeu 9 (reviewer, critique) | Nouvelle matière (reviewer) : « Mon “je m'y mets demain” pour ranger le garage date d'exactement… » ; réponses : « …quatre cent douze jours. » et « …huit cent six jours. » (un seul détail chacune) ; retour : « personne ne compte les jours d'un “demain” ». Recherche : 0. |
| Jeu 6 : « que personne ne rapporte » ; item 1 usé ; exemple qui ne fait pas rire (reviewer, critique) | Item 1 : « Une affiche qui explique comment se brosser les dents. » (détail isolé, sans « que tout le monde lit », pour ne pas rejouer le non-dit de l'item 3) ; exemple du retour : « Chez le dentiste, tout le monde relit l'affiche sur le brossage, comme si c'était le dernier moment pour réviser. » Recherche : 0. |
| Jeu 7 : le bouton déjà allumé est un classique, les numéros d'étage sont déjà connus ; exemple sans blague (les trois) | Aucune des deux idées. Item 2 : « Chacun sort son badge deux étages avant le sien. » (reviewer) ; exemple : « Dans l'ascenseur, chacun sort son badge deux étages trop tôt, comme à la douane de son propre palier. » Retour inchangé. Recherche : 0. |
| Jeu 8 : option de la critique (« Le dîner est reporté à une date ultérieure ») | Non retenue : deux phrases pour une consigne « en une phrase », et le jeu est à 10 chez deux relecteurs sur trois. |
| Non changé | Jeux 1, 3, 9, 10 (10 chez les trois) ; répliques A5, S5, M2 et vanne l. 677-678 mot pour mot. |

## Points de vigilance pour la relecture (note interne)

- Jeux 1 à 3 : les contextes sont neufs, différents des deux contextes de rafale de chaque situation source ; vérifier qu'une seule réponse est défendable.
- Jeux 4, 5 : deux « ce qu'on aurait pu dire » chacun ; la seconde n'est pas une réponse « correcte » mais une autre version possible.
- Jeu 10 : la vanne est du catalogue du site (lecture seule) ; à vérifier active en base avant import.
- Reste à écrire : C4b, C4c (« Les pires réponses » et le jeu d'écriture « Remets la chute »).
- Le jeu 10 est un jeu de choix : le schéma `[PROVISOIRE]` n'a pas de famille « choisis-la-chute » (l'énumération contient « remets-la-chute » pour le jeu d'écriture) ; à ajouter ou à ranger sous « quelle-replique ».
- Schéma `[PROVISOIRE]` : `situationsReprises` attend des identifiants de fiche, pas encore posés ; les situations sont citées ici par leur titre et leur numéro de lot.

## Handoff

- Fichier : `/home/user/Marrant/docs/copy/espace/c4a-jeux.md` (10 jeux, 5 familles sur 6, tour 1, à relire à l'aveugle, P0 s18).
- Reprises : 3 situations (QR1 A5, QR2 S5, QR3 M2) avec leurs répliques mot pour mot et un contexte neuf ; 1 vanne du site (l. 677-678).
- Textes drôles neufs : 4 (jeux 4, 5, 8, 9), recherche web de la phrase et de l'idée : 0 occurrence.
- Longueur : chaque jeu tient en 3 à 5 minutes, retour de 2 phrases.
