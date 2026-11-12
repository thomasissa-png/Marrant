# Tour 20 (confirmation), relecture à l'aveugle @reviewer : architecture du contenu v20 (s24)

> @reviewer, 12/11/2026. Lus : `diff-v19-v20.md` (27 points), puis la v20, point par point, comparée à `etalons-espace-s24.md` (ET), `etalon-e4-mirabel-s24.md` et FP l. 171. Code vérifié : `abonnement/success/page.tsx` ; `docs/qa/tunnel-inscription-s15.md` ; `etalon-e6-humour-noir-s24.md` (existe).

## 1. Statut de R1 à R6 (tour 19)
- **R1** (FP l. 171 reportée) : **levé**. Résumé l. 46, section 8 l. 1037, section 9 l. 1044 et 1046 (« aucune version n'est à choisir » pour E1 à E4).
- **R2** (la poêle) : **levé**. 3.3 l. 459 à 468 = E1.1 mot pour mot (« elle a pris ses marques »). Rafale l. 466 : une seule bonne réponse par contexte.
- **R3** : **levé pour 3.4 (l. 481 à 487) et 3.6 (l. 504 à 507)** ; **partiel pour 3.5** (S1).
- **R4** : **levé**. Contexte 1 de la prise de parole l. 470 ; rencontre et prise de parole hors E1 l. 469, 470 et 1050 ; renvoi au point (c) de 7.3, qui existe (l. 942).
- **R5** : **levé**. 1.1, 3.7, 7.5 k, 9 E4, annexes B et C : la réécoute est faite par Thomas et c'est une condition bloquante. Il ne reste aucun « conseillée » ni « par une personne » pour E4.
- **R6** : **levé**, l. 457 et règles de 2.2.
- **N1 et N3 (faits)** : exacts. La page de succès revérifie le paiement (`verify-session` l. 87, minuterie l. 103) ; la modale a été retirée en s15 faute de mesure (tunnel s15 l. 4), et FP ne contient aucune ligne qui en fasse un [CHOIX UTILISATEUR].
- 0 tiret cadratin. Aucune décision n'est rouverte et aucun total ne change.

## 2. Notes

| Critère | Note | Motif |
|---|---|---|
| Cohérence | 9 | En-tête l. 5 périmé (S2) ; l. 495 contredit la règle de l. 492 (S1) |
| Complétude | 10 | Tous les points du tour 19 sont traités |
| Faits exacts | 9 | l. 1098 dit que l'E4 l. 4 porte encore « conseillée », ce qui est faux depuis la correction (S3) |
| Fidélité aux décisions | 9 | l. 495 marquée [ÉTALON VALIDÉ] sans reprendre le texte validé de E3 (S1) |

**Note globale : 9,25 / 10.** Il n'y a aucun bloquant : trois retouches de texte.

## 3. Corrections
**S1. 3.5 l. 495.** Faute : la ligne porte le marqueur « [ÉTALON VALIDÉ ; E3, l. 220 à 258] », mais elle garde l'ancienne définition alignée sur le glossaire (« Une formule courte, "Intéressant", "Pas faux", "Bien vu", … tu as l'air de réfléchir »). Or l. 492 dit que les définitions du glossaire ne sont pas recopiées, et la fin de l'exemple diffère aussi. Correction, à reprendre mot pour mot depuis ET l. 233 à 237 : « Accusé de réception. La petite formule que tu dis avant ta vraie réponse, pour gagner deux secondes. En deux temps : « Tu as encore oublié ton chargeur ? » Tu dis : « Pas faux. » Deux secondes. Puis : « J'en ai quatre, tous chez des gens que j'aime bien. » À ne pas confondre avec : l'excuse (« oui, pardon »), qui répond avant d'avoir pris le temps. Définition complète : `/glossaire`. »

**S2. En-tête l. 5.** Faute : « Remplace `architecture-contenu-v18.md`. La v19 n'applique QUE… » est périmé en v20. Correction : « Remplace `architecture-contenu-v19.md`. » Le reste du paragraphe passe sous une étiquette « Rappel v19 : ».

**S3. Annexe B l. 1098.** Faute : « À signaler à @copywriter, hors v20 : `etalon-e4-mirabel-s24.md` l. 4 dit encore « conseillée » » est faux : l. 4 dit maintenant « réécoute obligatoire … condition bloquante ». Correction : supprimer cette phrase.

**Optionnel** : l. 483 et 495, guillemets intérieurs droits "…" ; ET utilise “ ”.

## 4. Verdict
**Prêt après S1 à S3**, des retouches de texte sans effet sur la conception. Une v21 limitée à S1 à S3 peut être confirmée par Grep (texte de E3 identique à ET l. 233 à 237 ; 0 « Remplace `architecture-contenu-v18` » ; 0 « dit encore « conseillée » »), sans nouveau tour complet.
