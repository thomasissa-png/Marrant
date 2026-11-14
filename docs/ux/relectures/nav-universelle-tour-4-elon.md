# Relecture à l'aveugle, tour 4 (elon) : `docs/ux/navigation-universelle-s24.md` v4

AVIS CONSULTATIF : validation requise avant exécution.

## Note : 10 / 10 (le 10 du tour 3 est confirmé)

**Pistes du tour 3, toutes intégrées :**
- P9 : `/carnet/[mois]` est traité (l. 46, 52, 109) et la refonte de `rubriques.ts` est inscrite au lot @fullstack (l. 111).
- P10 : la hauteur est recalculée en fenêtre CSS, marges comprises (l. 38, 529 px, 39 px libres à 568 px), et le critère 5 est précisé.
- P11 : le bilan renvoie à `/parcours/[slug]` (l. 104).
- P12 : le critère 14 vérifie la hiérarchie d'Aujourd'hui à 768 px.

**Pas de régression, pas de contradiction :**
- Barre et menu mobile allument chacun le bon élément : « Mon espace » dans la barre sur tout `/mon-espace/*`, la ligne parente dans le menu (l. 46 et 52, critère 13).
- `/favoris` et `/carnet` gardent leurs repères publics ; rien n'est ajouté au site public (l. 109, critère 4).
- S'entraîner renvoie à « Mon espace » de la même façon au §3 et au §4.3.
- Le bilan allume Parcours et renvoie à son parcours : le parent est le même dans les deux cas.

## Fautes dures

Aucune.

## Pistes (ne bloquent pas le 10)

- P13. L. 1 et 3 : le titre dit « v3 » et les sources citent les « tours 1 et 2 ». Passer à « v4 » et « tours 1 à 3 ».
- P14. De 768 à 1023 px, la ligne « Mon espace » du menu est masquée (l. 37) : le bloc des 8 entrées, décalé à gauche (`ml-3 border-l`), reste suspendu sous un titre absent. Sur cette plage, retirer le décalage (`md:ml-0 md:border-l-0 md:pl-4`) ou garder un intitulé « Mon espace » qui ne soit pas un lien.

Prochaine action : présenter à Thomas les 10 écarts du §6 en un seul message, avec un oui ou non par ligne, puis lancer le lot @fullstack.
