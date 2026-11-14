# Relecture à l'aveugle, tour 5 : `docs/ux/navigation-universelle-s24.md` v5 (@reviewer, 14/11)

**Note : 10/10.** Aucune faute dure. J'ai relu les 172 lignes en entier.

**T1 (tour 4) : CORRIGÉE.** La l.52 reprend mot pour mot la règle demandée : sur une rubrique de l'index (pages B, S'entraîner, `/favoris`, `/carnet`), sa propre ligne s'allume ; sur une page A, la ligne du parent ; « Mon espace » seulement sur Aujourd'hui. Les critères 8 (l.124) et 13 (l.129) disent la même chose, et le §4.3 (l.109, Carnet pour `/carnet/[mois]`) concorde.

**Contradictions cherchées, aucune trouvée :**
- intitulé de 768 à 1023 px : l.37, l.96 et le critère 8 concordent ;
- hauteur du menu : 65 + 16 + 52 + 44 + 352 + 1 = 530 px, soit 137 px libres à 667 et 38 px à 568, comme l'écrit le critère 5 ;
- repères : §3 l.77, §4.3 l.107-109 et critères 4 et 13 concordent ;
- interrupteur (§0) et liste des écarts (§6) concordent avec le §1 ;
- les titres des sections et la ligne des sources sont à jour (v5, tours 1 à 4).

## Piste (ne bloque pas)

- P1. La l.97 dit « Le parent règle aussi l'allumage : dans le menu mobile, sa ligne ». Lue seule, elle allumerait « Mon espace » sur une page B, puisque leur parent est Mon espace (l.107). La l.52 et le critère 13 tranchent dans l'autre sens, sans ambiguïté. Pour fermer toute mauvaise lecture par @fullstack, écrire : « dans le menu mobile, sa ligne pour une page A ; pour une rubrique de l'index, sa propre ligne (§1) ».
