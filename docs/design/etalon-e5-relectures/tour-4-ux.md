# E5 v7, vérification finale, tour 4 : @ux

Ouvert : aujourdhui habitué / recherche ; carte-rafale 375 ; parcours 320, jour1 zoom200 ; mission 320 / 375 / 1280 / bilan / bilan choix A / bilan zoom200 ; mes-repliques 375 / zoom200 / terminé ; mes-questions zoom200 / terminé ; succes 375. **Non rouvertes : aujourdhui-768, mes-repliques `modifier`, succes `nonverifie`, carte-rafale « Ici, tu sors laquelle ? », menu Plus et menu de compte (aucune capture), 768 des nouvelles pages.** Ordre DOM et piège de focus : à confirmer au clavier (pas de source lue).

## Tour 3 : vérification
Corrigés et vus : « Plus » active et ramenée sur Mes répliques et Mission (375, 320, 1280, 200 %), chevron absent à 1280, placeholder « Rechercher », carte de succès avec marges, boutons à 200 % sans débordement (Mes questions, Mes répliques), question de bilan cachée avant le premier toucher, « Marche 2 » sans total + cinq barres, ligne de la lettre rendue, états « terminé » sans barre ni ligne `/abonnement`, calendrier du fichier de libellés, accroche unique au-dessus de « Si tu as 5 minutes » avec « Les cartes du jour » sous le titre.
Non rouverts : doublon de la citation en `modifier`, annonce de `nonverifie`.

## Notes /10
| C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|
| 9 | 10 | 9 | 10 | 9 | 10 |

## Pour chaque note < 10
**C1 (9)**
- **[Mission, `#etat=bilan` et variantes, 375 / 200 %]** la barre souligne « Plus » alors que le bilan est le dernier élément d'un parcours : sa porte est « Parcours » (6.3, ligne « Parcours, étapes, fiche 0, bilan du parcours »). Correction : `aria-current` sur « Parcours » et défilement sur lui pour le bilan ; « Plus » reste actif pour la mission seule.
- **[Mes répliques, `termine`]** la cloche est encore dans l'en-tête, alors que `mes-questions#termine` l'a retirée (T3 : « pas de cloche » dans « Mon profil »). Correction : même en-tête sur les deux (loupe et compte).
- **[Menu Plus ouvert, menu de compte]** toujours aucune capture : ce sont les portes de « Mes répliques » et de la mission. À fournir.

**C3 (9)**
- **[Mes questions et Mes répliques, `termine`]** « Mon profil » est un texte de 12/16 sans lien, et la barre n'est plus là : aucun retour visible vers « Mon profil ». Correction : lien (cible de 44 px) « Mon profil » au-dessus du H1, ordre de tabulation : lien d'évitement, en-tête, lien de retour, H1.
- **[Barre, 375, « Plus » actif]** le chevron reste affiché après « Plus » alors que la suite est l'espace vide ajouté pour caler les onglets. Correction : chevron seulement si une entrée est encore hors de la vue, l'espace final ne comptant pas.

**C5 (9)**
- **[Bilan, après A / B / C]** le toucher « Oui / À moitié / Rien », qui ouvre la question de bilan, ne montre pas lequel est choisi (coche + contour absents), alors que la carte de rafale le fait. Correction : même état verrouillé et marqué que dans la rafale (`aria-pressed`, coche, contour de 2 px), les deux autres grisés.
- **[Bilan, après A ou C]** le renvoi « L'étape « Énoncer la règle non écrite » mérite un deuxième tour. » est un lien : rien n'annonce où il mène. Correction : cible de 44 px et destination (l'étape 1 de Confiance) dans le nom accessible.

## Verdict UX
**GO pour l'étalon E5** côté UX : aucune correction ne touche une décision de la section 8 ; les trois points de C1 et C3 sont des attributs ou des lignes de CSS. Condition avant mise en code : capturer le menu Plus ouvert et le menu de compte, ou les noter « non rendus » avec la raison dans `etalon-e5-s24.md`.
