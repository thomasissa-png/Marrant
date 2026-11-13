# Libellés du compte à rebours facultatif, rafale « Quoi répondre » (s24), tour 2

> @copywriter, 13/11/2026. **Statut : tour 2 après relectures (reviewer, elon) ; à relire à l'aveugle puis à soumettre à Thomas.** `[Framework : geste simple]` `[Conscience : Solution-Aware]`. Sources : architecture 2.2, `carte-rafale.html`. `{n}` = durée en cours (10, 7, 5), `{k}` = secondes restantes. Règles : tutoiement, zéro tiret cadratin, zéro émoji, aucun accord genré, pas de « défi ». « Chrono » écarté : il évoque la performance, la carte dit « Rien n'est noté ».

## 1. Activation (interrupteur sous « Ta réponse d'abord »)
- **Libellé constant : « {n} secondes pour répondre »** (la durée d'abord, on lit un mode et non un bouton d'envoi). Actif : bordure et `aria-pressed`, comme les puces de la maquette ; un second toucher l'arrête.
- **État actif : « Il reste {k} secondes »** ; à k = 1 : « Il reste 1 seconde ».
- **Pendant le décompte, « Prends ton temps » est masqué** (le décompte le remplace, sinon deux consignes se contredisent). Sans compte à rebours, « Prends ton temps » (3 s) reste inchangé.
- Pistes écartées : « Compte à rebours » (sec), « Me laisser {n} secondes » (lourd).

## 2. Raccourcir (deux boutons : « Essayer {n} secondes » et « Garder {m} secondes », m = durée actuelle ; aucun message après le refus)
- **Reco, 7 s : « Envie d'essayer avec 7 secondes ? Tu peux revenir à 10 quand tu veux. »**
- **Reco, 5 s : « Envie d'essayer avec 5 secondes ? Tu peux revenir à 7 quand tu veux. »**
- Écartées : « Essayer avec 7 secondes ? » (sec, sans la sortie) ; « Cette semaine, tu avais souvent une réponse… » (révèle qu'on compte les « Oui », contredit « Rien n'est noté »).
- Déclencheur : hebdomadaire (2.2), mais la phrase ne le dit plus, donc aucune dépendance au calendrier.

## 3. Temps écoulé (les trois boutons s'affichent, rien ne se bloque)
- **Reco : « Les {n} secondes sont passées. »** (puis « Tu avais une réponse ? », déjà affiché ; même phrase pour l'annonce `role="status"`).
- Écartées : « Voilà les {n} secondes. » (se lit comme un départ) ; « C'est le moment de la question. » (administratif).

## 4. Nom accessible (bouton à bascule, `aria-pressed`)
- **Reco : « {n} secondes pour répondre, compte à rebours »** (commence par le libellé visible, WCAG 2.5.3 ; ne change pas avec l'état).
- Décompte : `role="timer"` nommé « Temps restant », sans annonce seconde par seconde ; une seule annonce, à la fin.

## Tour 2 : retouche → ligne
| Retouche (source) | Ligne changée |
|---|---|
| « Répondre en {n} secondes » ressemble à un envoi (elon) | §1 : « {n} secondes pour répondre » |
| « 1 secondes » (reviewer) ; « Prends ton temps » vs décompte (reviewer) | §1 : singulier à k = 1 ; « Prends ton temps » masqué pendant le décompte |
| Phrase qui révèle le comptage des « Oui » (reviewer) ; « Cette semaine » fragile (elon) | §2 : « Envie d'essayer avec 7 secondes ? Tu peux revenir à 10 quand tu veux. » ; boutons conservés |
| « Voilà les {n} secondes » lu comme un départ (reviewer, elon) | §3 : « Les {n} secondes sont passées. », annonce comprise |
| Nom aligné (elon) ; nom jugé 10 (reviewer) | §4 : « {n} secondes pour répondre, compte à rebours » |
