# Contrôle ciblé : étalons onboarding s23, pack v2 (reviewer v2, 06/11/2026)

Périmètre : statut de O1 à O10 (`reviewer-v1.md`), écart signalé sur l'étalon 2 C, relecture à l'aveugle des textes nouveaux (1 A hybride, 3 A scène neutre, étalon 5). Mêmes 6 critères, barre 9/10.
Sources revérifiées : `paiement.ts:276-293`, cadre légal B (D5, D6, E1 à E4, F6), founder-preferences 07/10 (remboursement « seulement premier ») et 06/11, `lib/carnet.ts:40` et `carnet-fiche-card.tsx:42` (bloc « Pourquoi ça marche »), `entrees-parcours.ts:38`.

## Statut O1 à O10

| # | Statut | Évidence (pack v2) |
|---|---|---|
| O1 lettre | PASS | l. 38, 47, 58, 64 : mot pour mot |
| O2 carnet conditionné | PASS (voir O11) | l. 24, 38, 63, 76 : mot pour mot |
| O3 favoris | PASS | l. 57 |
| O4 exercices | PASS | l. 55 |
| O5 option 2 C | PASS avec écart accepté (voir O12) | l. 63-68 ; reco l. 68 corrigée (« Pour commencer ») |
| O6 variantes E1 | PASS (voir O11) | l. 76, 84, 92, 100 : mot pour mot |
| O7 `replyTo` | PASS | l. 8 |
| O8 règle d'envoi | PASS | l. 7, 111 ; plus aucune mention « vendredi » ni « jamais un jeudi » isolée (Grep) |
| O9 objet E0 | PASS | l. 15 (sens repris, note interne), objets l. 18, 22, 27 et question l. 32 conformes |
| O10 1 C | PASS | l. 28 |

**Écart 2 C (rappel de parcours retiré du bloc « Ensuite ») : accepté.** Rien de faux, le rappel reste dans A et B et dans le profil, l'écart est dit à Thomas (l. 67). Deux réserves : le motif « tenir l'écran mobile » n'est pas mesuré (E0 dépasse de toute façon un écran, bloc contractuel et formulaire compris ; le vrai motif est la concision vue par Sophie) ; et le retrait a cassé la jointure de la phrase (O12).

## Textes nouveaux, relus à l'aveugle

**1 A hybride : 9, PASS.** Objet : le signal « confirmé » arrive en premier, il survit à la troncature mobile ; « sers-toi » donne le ton complice sans air promotionnel (D6). Phrase fluide, ne redit pas la liste (S1). Hypothèse du panel bien marquée. Souhaitable S11 ci-dessous.

**3 A scène neutre : 9, PASS sur le texte.** « Quelqu'un te balance une remarque devant tout le monde, et rien ne te vient » : scène vraie, sans lieu, sans école. « Une situation, la réplique qui sauve la mise, pourquoi elle marche » : exact, chaque fiche a le bloc « Pourquoi ça marche » (`carnet-fiche-card.tsx:42`). La mécanique de variante autour de cette scène est en revanche fausse (O11).

**Étalon 5 « rien ne presse » : emplacement PASS, A et B PASS, C FAIL.**
- Emplacement : lignes 285 et 287 de `paiement.ts` vérifiées ; rien n'est retiré ni déplacé, la phrase n'est pas une incitation commerciale (E2, E4, B6) : conforme.
- Exactitude : aucune des trois ne parle de remboursement, donc aucune ne contredit « remboursement sous 14 jours sur le premier paiement seulement » (07/10). Le motif de la reco B est juste.
- Effet : la peur du persona, c'est d'oublier. « Tu gardes tout jusqu'à la fin de la période payée » ne répond pas à l'oubli : c'est justement ce qui rend la résiliation immédiate gratuite. A le dit (formulation de Thomas, on la garde), B le compense par la date. **C dit « même résilié, ton Premium reste ouvert » : c'est l'argument du réflexe lui-même**, l'option travaille contre son but (critère 6) : O13.

## Corrections OBLIGATOIRES restantes (texte exact)

**O11. Étalon 3, variantes : portée floue et phrase fausse sans carnet (erreur de ma v1 : O2 et O6 combinés).**
Constats : (a) sans carnet du mois, l'abonné qui n'a rien commencé reçoit « là où tu t'es arrêté » : faux ; (b) « parcours conseillé » n'existe qu'après le quiz (`entrees-parcours.ts:38`) ; (c) sans carnet et rappel actif, deux règles se contredisent (S10 dit « version carnet ») ; (d) « on remplace la phrase » : en A, la scène et l'objet « Une situation, une réplique » restent devant un lien de parcours (objet trompeur, D6) ; en C, « Les parcours viennent ensuite » contredit « ta prochaine étape ».
Remplacer, l. 76, la phrase « Sans carnet du mois publié, tout abonné reçoit la variante parcours, avec le lien de la première étape du parcours conseillé. » par :
> La variante remplace la phrase du carnet et son lien ; en A, elle remplace aussi la scène et l'objet devient « Ta prochaine étape t'attend » ; en C, elle remplace tout le premier paragraphe. Sans carnet du mois publié : l'abonné qui a un parcours en cours reçoit la variante, rappel actif ou non ; les autres reçoivent « Les {PARCOURS_COUNT} parcours sont ouverts, toutes les étapes d'un coup : choisis le tien. » + « Choisir mon parcours : {url}/parcours » (en A, objet « Les parcours sont ouverts »).

**O12. Étalon 2 C, bloc « Ensuite » : jointure cassée par le retrait du rappel.** Sans question, la phrase finit sur « les carnets passés et » ; sans carnet ni question, sur une virgule. Remplacer l. 65 par :
> **Ensuite, à ton rythme** : les {PARCOURS_COUNT} parcours en entier (toutes les étapes sont ouvertes, une par semaine reste le rythme conseillé)[si carnet], les carnets passés[si question], « Ta question à l'équipe » depuis ton profil.

avec la note : « Le dernier élément rendu prend « et » à la place de la virgule. »

**O13. Étalon 5 C : remplacer l. 143 par**
> Prends ton temps pour te faire un avis : d'ici le {date du prochain prélèvement}, tout est ouvert, et tu pourras encore résilier la veille.

(exact : résilier la veille évite le prélèvement ; `{date…}` = `dateLongue(prochain)`, déjà calculé dans le gabarit ; « encore » ne contredit pas « à tout moment ». Mettre à jour le motif de la reco : « C est la plus douce » sans « cite la résiliation comme acquise ».)

## Souhaitables

- S11. 1 A et 1 C annoncent un premier pas : avec 2 A ou 2 B, qui n'en ont pas, garder la ligne « Pour démarrer, choisis un parcours » du gabarit (`paiement.ts:293`). À dire en une ligne sous l'étalon 2.
- S12. 2 C : le rappel peut revenir sans rallonger, dans la parenthèse : « (…, une par semaine reste le rythme conseillé, avec un rappel par e-mail sur demande) ». Motif de l'écart à corriger : concision, pas écran mobile.
- S13. 5 B, moins administratif et sans l'argument du réflexe : « Rien ne presse : la date du prochain prélèvement est écrite plus haut, et tu pourras encore résilier la veille. »
- S14. Reco 5, motif de A : ajouter « et donne la raison de résilier tout de suite sans rien perdre ».

## Note globale

| Critère | v1 | v2 | Après O11-O13 |
|---|---|---|---|
| 1 Options utilisables, différentes | 8 | 8,5 (5 C contre-productive) | 9 |
| 2 Exactitude | 6 | 8,5 (« là où tu t'es arrêté » sans carnet) | 9,5 |
| 3 Ton d'Alex, zéro tiret cadratin | 8,5 | 9 | 9 |
| 4 Cadre légal B | 7,5 | 9 (objet 3 A en variante, D6) | 9,5 |
| 5 Recos, questions | 8 | 9 | 9 |
| 6 Rétention sans pression | 8,5 | 8,5 (5 C) | 9 |
| **Globale** | **7,5** | **8,5** | **9** |

**v2 : 8,5, encore sous la barre.** O1 à O10 sont faites, 9 sur 10 mot pour mot (O9 reprise sur le sens, note interne). Restent 3 obligatoires courtes à texte exact (O11, O12, O13). Une fois reprises mot pour mot, le pack passe à 9 : GO pour Thomas sans nouvelle relecture complète, vérification limitée à ces 3 lignes.
