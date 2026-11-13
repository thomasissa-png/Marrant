# Suites génériques des missions, s24

Statut : **à relire à l'aveugle**. Barre : mission complète de `libelles-espace-e5-s24.md` section 4. Sources : 2.4 (architecture-contenu-v20 l. 271 à 280), `missions.ts` (`suites.marche`, `suites.bof` : un texte, `.strict()` ; les boutons et liens sont de l'interface, pas des champs).
Titres des marches (2.4 et libellés E5 l. 48) : 1 « À voix haute, sans public » · 2 « À un proche, par message » · 3 « À un pote, en face » · 4 « Dans un petit groupe » · 5 « Avec quelqu'un que tu connais peu ». Bouton : « Voir la marche n » ; repère : « Marche n : titre ».

## 1. Essayé, ça a marché (champ `suites.marche`)

Forme : « Bien joué : {constat sobre}. Marche suivante : {titre}. » Aucun défi cité. Trois formes candidates (A, B, C), puis le texte par marche.
- A : « Bien joué : {constat}. Marche suivante : {titre en minuscule}. »
- B : « {Constat}. Tu peux monter d'une marche : {titre}. »
- C : « Bravo. Prochaine étape : {titre}. »
Reco : **A** (c'est la forme du modèle ; B ajoute « tu peux », un permis inutile ; C est générique, « bravo » seul sonne scolaire).

| Marche | Texte recommandé (A) | Bouton |
|---|---|---|
| 1 | Bien joué : dit à voix haute, c'est déjà dit pour de bon. Marche suivante : un proche, par message. | Voir la marche 2 |
| 2 | Bien joué : le message est parti, et c'est le plus dur. Marche suivante : un pote, en face. | Voir la marche 3 |
| 3 | Bien joué : en face, rien à relire ni à effacer. Marche suivante : un petit groupe. | Voir la marche 4 |
| 4 | Bien joué : à plusieurs, ça se joue en direct. Marche suivante : quelqu'un que tu connais peu. | Voir la marche 5 |
| 5 | Bien joué : tu es en haut des marches. Ensuite : une mission libre, ou une nouvelle situation à la même marche. | Une mission libre · Une autre situation, même marche |

## 2. Essayé, bof (champ `suites.bof`)

Une phrase qui dédramatise, sans moyenne, sans vanne, sans question à soi (les questions du modèle étaient propres à son défi). Trois candidates de forme :
- A : « {Ce type d'essai} qui ne prend pas, ça arrive. » (calque exact du modèle)
- B : « Ça ne prend pas toujours du premier coup. C'est normal. »
- C : « Ce n'est pas passé cette fois : l'essai compte quand même. »
Reco : **A**, déclinée par marche (B et C valent pour toute marche en repli ; C, « compte quand même », rappelle un score alors que rien ne compte).

| Marche | Texte recommandé (A) |
|---|---|
| 1 | Une phrase qui sonne faux à voix haute, ça arrive. |
| 2 | Un message qui ne prend pas, ça arrive. |
| 3 | Un échange en face qui ne prend pas, ça arrive. |
| 4 | Un groupe qui ne rebondit pas, ça arrive. |
| 5 | Un échange avec quelqu'un que tu connais peu qui ne prend pas, ça arrive. |

Liens, identiques à toutes les marches (modèle section 4) : « Une autre situation, même marche » · « Quand ça tombe à plat » · « Raconte-nous ce qui s'est passé » (Mes questions, « Situation à gérer »).

## 3. Pas essayé (aucun champ de texte)

- Une fois : aucun texte, la mission reste là.
- Deux fois de suite (`pas2`) : aucun commentaire, un seul bouton « Voir la marche n-1 » (marche 2 : « Voir la marche 1 », etc.).
- Marche 1, deux fois de suite : une autre situation, jamais un message (bouton « Une autre situation, même marche »).

## Contrôles
Tutoiement, zéro tiret cadratin, zéro emoji, aucun accord genré (relu : « dit », « parti », « passé » sont des participes sans marque de genre sur le sujet ; « en haut des marches » évite « arrivé »), rien de culpabilisant, rien de compté. Cinq textes `marche` et cinq `bof` pour 111 défis : à vérifier par relecture à l'aveugle avant tout seed.
