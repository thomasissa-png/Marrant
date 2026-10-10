# Critique à l'aveugle A : lot conseils s19, tour 5 (10/10/2026)

Fichiers lus, et seulement eux : `lot-aveugle-conseils-s19-tour5.md`, `docs/copy/audit-conseils-s14.md` §1-§2 (étalons E2, E3, E4, E6, E7), `docs/copy/charte-refonte-copy-s11.md`. Aucune autre critique ni aucune correspondance n'ont été consultées.

Règle de notation (protocole s14) : on met « = » seulement si les 5 critères sont vrais (1 technique, 2 chute, 3 défi, 4 charte, 5 pas de doublon). Au moindre doute, on met « < ».

## Contrôles mécaniques

| Contrôle | Résultat |
|---|---|
| Grep tiret cadratin `—` (et demi-cadratin `–`) | 0 occurrence |
| Grep vouvoiement `vous / votre / vos` | 0 occurrence |
| Grep « blague » | 0 occurrence |
| Grep guillemets droits `"` | 0 occurrence (guillemets français partout) |
| Q2, bloc sincère annoncé à 83 mots | 83 (élisions comptées comme un mot : m'a, c'était, n'ai, c'est, j'appelle) |
| Q2, bloc humour annoncé à 10 mots | 10 |
| Q2, fermeture annoncée à 8 mots | 8 |
| Q2, total annoncé à 101 mots / 50,5 s | 101 ; 0,5 s/mot (120 mots/min) : 41,5 + 5 + 4 = 50,5 s. Le calcul tient |
| Q1, chiffres annoncés | pas de décompte de mots ; « deux phrases courtes » respecté dans l'exemple |

## Verdicts

| id | note | motif court |
|---|---|---|
| Q1 | = | 1 : le geste est réel (constat en deux temps, la seconde phrase déduit un chiffre ou une durée sur le même ton sérieux) et l'exemple le montre. 2 : « seules les piles disparaissent » se lit comme une vraie chute, au niveau de E2 (« Les Pépito aussi apparemment »), et rien ne l'explique. 3 : faisable aujourd'hui, critères observables (3 traces, présent testé par « En ce moment, », un chiffre ou une durée, aucune personne), repli prévu pour la visio ou en l'absence de réunion. 4 : charte respectée. 5 : pas de doublon avec Q2 |
| Q2 | < | 3 : le critère de réussite contredit le contenu sur la cible. Le contenu dit « Tu es la seule cible », alors que le défi valide une vanne retournée « contre toi (ou contre ce détail […]) ». Une vanne que le contenu interdit peut donc réussir le défi. 1 (secondaire) : la règle dit « la première dit ce qui t'arrive ce soir » mais l'exemple ouvre sur « Cet après-midi, j'ai perdu mon discours », donc l'exemple ne suit pas sa règle à la lettre. Les critères 2, 4 et 5 sont OK |

## Correction minimale pour Q2

1. Pour aligner la cible, choisir **une** des deux options :
   - option a (contenu) : remplacer « Tu es la seule cible. » par « La cible, c'est toi (ou le détail lui-même). » ;
   - option b (défi) : supprimer la parenthèse « (ou contre ce détail, jamais contre la personne qui l'a dit ou donné) ».
   Ma préférence va à l'option a : le protocole considère que viser un objet est voulu, et la parenthèse du défi protège déjà la personne.
2. Pour aligner le moment : dans le contenu, remplacer « la première dit ce qui t'arrive ce soir » par « la première dit ce qui t'arrive aujourd'hui ». Le défi (« ce qui t'arrive ») et l'exemple restent tels quels.

Aucune autre retouche n'est nécessaire pour passer à « = ». Ces deux corrections ne touchent pas la vanne de l'exemple.

## Signalements non bloquants

- **Q1, libellé de l'exemple** : « Phrase écrite pour la prochaine fois : » annonce une phrase alors qu'il en suit deux, ce qui jure avec la règle des deux phrases. Suggestion : « Phrases écrites pour la prochaine fois : ».
- **Q1, test « En ce moment, »** : appliqué à la seconde phrase de l'exemple, il donne « En ce moment, depuis deux ans, seules les piles disparaissent ». La phrase reste juste, mais le cumul de deux marqueurs de temps est lourd. Le test fonctionne, il est juste un peu maladroit quand la phrase commence par « Depuis ».
- **Q1, personne implicite** : « seules les piles disparaissent » suppose quelqu'un qui prend les piles. Ce voleur reste anonyme et collectif, donc la vanne vise la situation et pas une personne. Ce n'est pas une faute, mais ce point est à surveiller dans les variantes.
- **Q1, « Fais-le sur la première pièce où tu passes »** : la phrase est correcte si on lit « faire l'exercice sur (à propos de) ». « Fais-le dans la première pièce où tu passes » serait plus naturel.
- **Q2, chiffres** : au rythme du lot lui-même (0,5 s/mot, appliqué précisément dans l'exemple), 125 mots donnent 62,5 s, soit plus que les « soixante secondes » du titre, alors que la fourchette est présentée comme « c'est ta minute ». Le « environ 120 mots » du contenu couvre cet écart, donc ce n'est pas bloquant. Une borne à 120 mots supprimerait l'ambiguïté (chiffre à valider par Thomas).
- **Q2, chute** : la vanne de rappel arrive juste après la phrase qu'elle rappelle (« c'est elle que j'appelle »). Une partie de la salle peut donc l'anticiper dès « j'ai perdu mon discours ». Le « J'ai failli » et le prénom placé en dernier mot (Claire est dans la salle, et c'est son départ) apportent assez de décalage pour que je compte la chute comme OK. Un écart d'une phrase entre le détail et son rappel la renforcerait.
- **Q2, antécédent** : dans « Pas besoin de chrono : compte tes mots. C'est réussi s'il fait entre 100 et 125 mots », le « il » renvoie grammaticalement à « chrono ». Suggestion : « C'est réussi si ton toast fait… ».
- **Q2, portée** : le contenu cite aussi la « présentation d'équipe », mais le bloc 3 sert à « lever le verre » et le défi parle de « personne honorée ». Le cas de la présentation d'équipe n'est pas couvert jusqu'au bout. Une précision, ou le retrait de ce cas, serait plus net.
- **Q2, longueur du défi** : avec environ 230 mots et cinq conditions de réussite dans une seule phrase, il est nettement plus lourd que les défis des étalons (E2, E7 : 2 à 3 phrases). Le ton reste celui d'un pote et pas d'un coach, mais une découpe en deux phrases aiderait la lecture.

## Verdict du lot

Q1 = · Q2 < (critère 3 : cible du contenu contre cible du défi ; critère 1 en secondaire : « ce soir » contre « Cet après-midi »). Les corrections minimales tiennent en deux remplacements de quelques mots.
