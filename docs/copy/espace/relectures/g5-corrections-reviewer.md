# G5, tour 1 des corrections du carnet : relecture à l'aveugle, @reviewer, 13/11/2026

Fichier relu : `docs/copy/espace/g5-corrections-carnet.md` (46 lignes, 28 fiches). Décisions de Thomas du 13/11 (`founder-preferences.md` l. 182) appliquées. Aucun fichier modifié.
**Mot pour mot** : les 46 « textes actuels » sont exacts. Je les ai comparés aux deux JSON, lus en entier (11-21 l. 249-257 ; 11-22 l. 262-269 ; 11-27 l. 326-327 ; 11-30 l. 362-364 ; 10-09 l. 100-101 ; les autres fiches aux lignes données dans `g5-carnet-reviewer.md`).
**Où les textes s'affichent** : sur la page du carnet, `onTeDit` et `reponse` sont affichés sans « » (`carnet-fiche-card.tsx` l. 34, 39). Dans l'espace, seul `onTeDit` est mis entre « » (`carte-et-toi.tsx` l. 48) ; `reponse` ne l'est pas (l. 62).

## Notes : 19 fiches à 10, 9 sous 10
**À 10** : 11-30, 10-09 ; 11-04, 05, 08, 11, 14, 17, 18, 24 ; 10-01, 02, 03, 05, 07, 12, 13, 14, 15.

| Fiche | Note | Défaut nommé | Version proposée |
|---|---|---|---|
| **11-22** (réplique) | 8 | (1) La correction crée une faute de guillemets : « la réplique s'affiche entre « » » est faux (voir plus haut), il faut donc « à bientôt » au premier niveau, comme « drôle » en 11-30 et comme le `pourquoi` de la même fiche. (2) L'exercice copie l'ouverture de 11-19 (« Regarde l'heure sur ton téléphone ») et redit « client », déjà dans le `pourquoi` (« guichet » est aussi en 11-29). (3) La chute « J'attends que ce soit bientôt » redit le mécanisme au lieu de surprendre : elle est juste mais sous la barre. | (1) « On m'a dit « à bientôt » à l'inscription. » (2) « Assieds-toi au bord d'une chaise, les mains sur les genoux comme en salle d'attente, puis dis la réplique d'un ton tranquille, en marquant un temps avant la seconde phrase. » (3) Piste à repasser à l'aveugle : « …Je n'ai pas voulu les brusquer. » (la paresse devient de la politesse). Le `pourquoi` serait alors : « Tu prends le « à bientôt » de l'inscription pour un rendez-vous dont la salle fixe la date. Par politesse, tu ne la presses pas : ta paresse devient de la délicatesse, et tu avoues sans t'excuser. » |
| **11-21** (réplique) | 9 | La réplique et le titre sont bons. La situation crée une ambiguïté : « tu arrives en premier, juste devant le plateau » peut se lire comme « tu arrives juste avant le plateau ». | « …les gobelets sont sortis, et tu es là en premier, juste devant le plateau de gâteaux. » |
| **11-27** (réplique) | 9 | La réplique est bonne. Dans le `pourquoi`, « mis les pieds ici » : « ici » n'a pas de lieu, parce que le `pourquoi` ne se lit pas chez la grand-mère. | « …depuis quand tu n'as pas mis les pieds chez elle. » |
| 11-19 | 9 | « Pardon pour le retard » ouvre aussi le `siTendu` de 11-18 : deux fiches voisines commencent pareil. Retouche plus courte possible. | « Pardon, je suis en retard. Qu'est-ce que j'ai raté ? » (un seul mot change par rapport au texte actuel) |
| 11-29 | 8 | “oui” règle l'affichage de l'espace mais crée un “ ” au premier niveau sur la page du carnet, où `onTeDit` n'est pas mis entre « ». | Garder « oui » dans le JSON. Pour @fullstack : dans `carte-et-toi.tsx` l. 48 (et `carte-registre.tsx` l. 53), passer les « » intérieurs en “ ” au rendu |
| 10-04 | 9 | La variation crée un nouveau moule : la mise en relief « c'est X qui/que » revient 4 fois (10-03, 04, 06, 08). | « Elle reçoit un compliment sur son récit, aux dépens de ta forme. » |
| 10-06 | 9 | Même mise en relief (« C'est ton apprentissage qu'on moque »). | « Seul ton apprentissage en prend pour son grade, et ton père garde son rôle de celui qui sait. » |
| 10-08 | 9 | Même mise en relief, et « cible » revient avec 10-13 (« seules cibles »). | « …sans accuser l'autre, et ta mémoire porte seule le chapeau. » |
| 10-10 | 9 | « porte la plaisanterie » n'est pas idiomatique. | « Ta peur d'appuyer fait toute la blague, et le choix reste un sujet à deux. » |

## Idée de 11-22 : neuve, mais pas encore au niveau
- Web : aucune blague trouvée sur « à bientôt » pris au pied de la lettre à l'inscription (recherche « à bientôt » + salle de sport + « j'attends »). Ce qui en est le plus proche reste la mécanique connue « payer sans y aller ».
- Dépôt (`apps/web/src/data`) : « bientôt » n'apparaît que dans `joke-decryptages.json` l. 1002 (« bientôt arrivé », une autre idée). Aucune autre réplique sur un abonnement à la salle de sport, hors la fiche elle-même.
- L'idée est neuve, mais la chute actuelle reste sous la barre de `ton-alex.md` l. 10. Elle repasse à l'aveugle, avec la piste ci-dessus. Si elle n'atteint pas 10, la fiche sort de la rafale (P0 s18).

## Retouche minimale : un point à arbitrer (ne change pas les notes)
Hors relevé G5, la session a dégenré par le nom la personne d'en face : « un inconnu » en 10-04, « un invité » en 10-05, « un pote » et « ton ami » en 10-12, « lui »/« Il » en 10-04. La checklist (l. 7) vise les accords (« gêné », « Désolé », « crevé », « lui-même »), pas les noms. Novembre garde d'ailleurs « un ami », « un collègue », « le vendeur ». Il faut choisir : (a) la règle couvre les noms, et novembre demande la même passe (une vingtaine de fiches) ; (b) elle ne les couvre pas, et on revient au texte actuel sur ces 4 lignes, en gardant pour 10-04 « Dans le salon, un inconnu… » et « quelqu'un qui marche vraiment ». Je recommande (b), qui touche le moins de texte et reste cohérent entre les deux mois.

## Verdict
**Tour 1 : NO-GO pour 9 fiches.** 19 sont à 10 dans ma relecture (C8 demande 10 chez tous les relecteurs). Au tour 2, il faut relire les 9 fiches ci-dessus, en commençant par 11-22, puis 11-21 et 11-27. 11-29 se règle dans le code, pas dans le JSON. Ensuite, retour à Thomas.
