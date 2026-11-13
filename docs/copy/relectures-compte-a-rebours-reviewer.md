# Libellés du compte à rebours (rafale), relecture à l'aveugle tour 1 : @reviewer, 13/11/2026

Contrôles : tiret cadratin 0, emoji 0, accord genré 0. « Chrono » est écarté à juste titre. Le motif bouton à bascule + `aria-pressed` + libellé constant est le même que les puces de la maquette (`carte-rafale.html` l. 116, 224).

| # | Libellé retenu | Note | Faute et réécriture |
|---|---|---|---|
| 1 | « Répondre en {n} secondes » / « Il reste {k} secondes » | 9 | Faute (accord) : à k = 1, on lit « Il reste 1 secondes ». Réécriture : singulier prévu pour k = 1 (« Il reste 1 seconde »). À préciser : quand le compte tourne, « Prends ton temps » (l. 194 de la maquette) est remplacé par le décompte, sinon les deux consignes se contredisent à l'écran. |
| 2 | « Cette semaine, tu avais souvent une réponse. On essaie 7 secondes ? » (puis 5) | 7 | Faute (cohérence avec « Rien n'est noté », affiché sur la même carte) : la phrase révèle qu'on compte les « Oui » de la semaine et en fait une performance, ce qui peut culpabiliser la semaine suivante. Réécriture : « Envie d'essayer avec 7 secondes ? Tu peux revenir à 10 quand tu veux. » (et « Envie d'essayer avec 5 secondes ? Tu peux revenir à 7 quand tu veux. »). Boutons « Essayer {n} secondes » / « Garder {m} secondes » : 10. |
| 3 | « Voilà les {n} secondes. » | 8 | Faute (clarté) : « voilà » présente une chose ; on ne comprend pas que le temps est écoulé, ni à l'écran ni à l'annonce `role="status"`. Réécriture : « Les {n} secondes sont passées. » (sans redire « Rien n'est noté », déjà sur la carte). |
| 4 | Nom « Répondre en {n} secondes, compte à rebours » ; `role="timer"` « Temps restant » ; annonce de fin en `role="status"` | 10 | Le nom commence par le libellé visible (WCAG 2.5.3), il ne change pas avec l'état, et il n'y a pas d'annonce seconde par seconde. L'annonce de fin reprend le texte retenu au n° 3. |

Verdict : NO-GO pour les n° 1 à 3, à réécrire puis tour 2 avant soumission à Thomas. Le n° 4 est en GO.
