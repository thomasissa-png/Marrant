# Libellés du compte à rebours facultatif, rafale « Quoi répondre » (s24)

> @copywriter, 13/11/2026. **Statut : à relire à l'aveugle puis à soumettre à Thomas.** `[Framework : geste simple]` `[Conscience : Solution-Aware]`. Sources : architecture 2.2 (10 s, désactivé la première fois, jamais de raccourcissement automatique, refus sans conséquence), `carte-rafale.html` (« Prends ton temps », 3 s, boutons en attente). `{n}` = durée en cours (10, 7, 5). Règles tenues : tutoiement, zéro tiret cadratin, zéro émoji, aucun accord genré, pas de « défi ».
> « Chrono » écarté : il évoque la performance mesurée, la carte dit « Rien n'est noté ». « Compte à rebours » reste le seul mot de l'architecture.

## 1. Activation (interrupteur sous « Ta réponse d'abord » ; sans lui, « Prends ton temps » reste inchangé)
| | Libellé (constant) | État actif (affiché, à côté) |
|---|---|---|
| A | « Compte à rebours » | « {n} secondes » puis le décompte |
| B | « Me laisser {n} secondes » | « Il reste {k} secondes » |
| **C, reco** | **« Répondre en {n} secondes »** | **« Il reste {k} secondes »** |
C : verbe d'action, la durée est dans le libellé, 24 caractères, rien de scolaire. Le libellé ne change pas à l'activation (l'état passe par `aria-pressed` et par une bordure, comme les autres boutons de la maquette). Un second toucher l'arrête.

## 2. Raccourcir après une série réussie (deux boutons : accepter, garder)
| | Proposition à 7 s | Proposition à 5 s |
|---|---|---|
| A | « Essayer avec 7 secondes ? » | « Essayer avec 5 secondes ? » |
| **B, reco** | **« Cette semaine, tu avais souvent une réponse. On essaie 7 secondes ? »** | **« Tu avais encore souvent une réponse. On essaie 5 secondes ? »** |
| C | « Ça roule : 7 secondes, ça te dit ? » | « Toujours là : 5 secondes, ça te dit ? » |
B dit pourquoi la proposition arrive et reste vrai avec une auto-déclaration (elle ne parle ni de vitesse ni de réussite). Boutons : « Essayer {n} secondes » et « Garder {m} secondes » (m = durée actuelle), aucun message après le refus. C écarté : « Ça roule » flatte.

## 3. Temps écoulé (les trois boutons s'affichent, rien ne se bloque)
| | Texte |
|---|---|
| **1, reco** | **« Voilà les {n} secondes. »** (puis « Tu avais une réponse ? », déjà affiché) |
| 2 | « Les {n} secondes sont passées. Rien n'est noté. » |
| 3 | « C'est le moment de la question. » |
1 constate sans juger, et ne répète pas « Rien n'est noté » (déjà dans la carte).

## 4. Nom accessible
| | Nom (rôle : bouton à bascule, `aria-pressed`) |
|---|---|
| A | « Compte à rebours, {n} secondes » |
| **B, reco** | **« Répondre en {n} secondes, compte à rebours »** |
| C | « Activer le compte à rebours de {n} secondes » (change de sens selon l'état : écarté) |
B commence par le libellé visible (WCAG 2.5.3). Décompte : `role="timer"` nommé « Temps restant », sans annonce seconde par seconde ; une seule annonce, en `role="status"`, à la fin : « Voilà les {n} secondes. »
