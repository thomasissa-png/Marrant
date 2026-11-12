# Tour 4, relecture à l'aveugle @reviewer : étalons de l'espace (s24)

> @reviewer, 12/11/2026. Lu : `etalons-espace-s24.md` (tour 4), `etalon-e4-mirabel-s24.md` (tour 4), tours 1 à 3, `ton-alex.md`, charte s11, transcription Mirabel. Aucun autre fichier modifié.

## 1. Bloquants du tour 3 : statut

| Point (tour 3) | Statut | Évidence |
|---|---|---|
| P1 / H1 « je me suis couché » | Levé | l. 88 : « J'ai essayé un nouveau café. Je n'ai pas encore de conclusion. » |
| P1 / H2 / P3 rebond « fatigué » | Levé | l. 241 : « La fac ? J'y dormais mieux. » (rebond net sur « la fac », sans accord) |
| P2 sûre « toujours possible » | Levé | l. 54 à 56 : une seule bonne réponse par contexte, chaque exclusion justifiée |
| P4 forme de « La nuit » | Levé | l. 204 et 205 : gabarit et version gardent « La nuit … porte … » |
| P5 joueuse « préméditation » | Levé | V3 supprimée, l. 34 |
| Critique : consigne entrée 1, doublon entrée 4, E4 « impressionner », « former », en-tête | Levés | l. 66, 81, 127 ; E4 l. 1, 12, 24, 26 |

Contrôles (Grep sur les deux fichiers) : tiret cadratin et demi-cadratin 0, guillemet droit 0, émoji 0, mention d'IA 0, concurrent 0. **Accords** : toutes les phrases dites par l'utilisateur relues une à une (répliques, erreurs, essais, contre-exemples) : aucune forme accordée au genre de celui qui parle. L'en-tête l. 5 dit maintenant vrai. **Glossaire** : timing, accusé de réception, rebond sur mot-clé présents (`apps/web/src/lib/glossary.ts` l. 14, 77, 84), chambrer et esprit de l'escalier absents : conforme à la l. 222. **E4** : les quatre citations sont exactes mot pour mot (transcription l. 12 ; la 2e reprend la seconde occurrence « 1 mètre 90 pour 95 kilos, normalement… »). `t=132s` = 2:12, 2:53 − 2:12 = 41 s, 8 min 57 s conforme à la source l. 6. Originalité : non refaite de mon côté (recherche du copywriter, l. 262 à 274).

## 2. Notes

| Étalon | T3 | T4 | Raison |
|---|---|---|---|
| E1.1 La poêle | 9 | **9,5** | Tout au niveau ; une phrase de l'erreur mal construite (F1) |
| E1.2 Les entrées | 8,5 | **9** | Entrées 3 et 4 sans faute ; F2 (pronom), F3 (le pourquoi contredit la règle) |
| E2.1 Faux secret | 10 | **9,5** | Grille au pronom sans antécédent (F4) |
| E2.2 Formules | 9 | **10** | Forme gardée sur les cinq, terrains variés, contre-exemple juste |
| E3 Vocabulaire | 9 | **9,5** | Cinq exemples au niveau ; consigne finale au possessif flottant (F5) |
| E4 Mirabel | 10 | **10** | Citations exactes, exercice aligné sur l'inversion de rôle |

## 3. Fautes restantes (aucune bloquante, aucune ne touche une vanne)

**F1. E1.1, l. 46** : « Ta réplique arrive pendant que tu rangeais déjà, et les excuses transforment la poêle en procès. »
Faute : concordance (présent puis imparfait) et sens flou (« rangeais » quoi ?).
Réécriture : « Ta réplique arrive quand tout est déjà rangé, et les excuses transforment la poêle en procès. »

**F2. E1.2, entrée 1, l. 66** : « Exemple avec la logistique : remplace-la par le tien. »
Faute : « la » renvoie à la logistique (féminin), « le tien » à un métier jamais nommé.
Réécriture : « Exemple avec la logistique : mets ton métier à la place. »

**F3. E1.2, entrée 2, l. 92** : « Sûre : […] Elle se ferme toute seule. »
Faute : la règle de la même entrée (l. 98) dit « commence par la plus petite nouvelle. L'autre demandera la suite. » Le pourquoi de la sûre dit le contraire de l'effet que la règle promet.
Réécriture : « Sûre : une vraie petite nouvelle, dite avec la gravité d'un exploit. On rit, et on te demande quel tiroir. »

**F4. E2.1, l. 178 et 179** : « 1. Elle tient en une phrase ? 2. Si elle vise quelqu'un, peut-il en rire avec toi ? »
Faute : « elle » sans antécédent (« ton faux secret », « le troisième » sont masculins). E4 adapte déjà la grille (« Ta menace tient en une phrase ? »), donc l'adaptation est permise.
Réécriture : « 1. Ton faux secret tient en une phrase ? 2. S'il vise quelqu'un, cette personne peut-elle en rire avec toi ? 3. La fin surprend ? »

**F5. E3, l. 258** : « puis rebondis sur un mot de sa phrase. »
Faute : « sa » ne renvoie à aucune personne (l'antécédent est « une remarque légère »).
Réécriture : « puis rebondis sur un mot de la remarque. »

**Hors note (en-tête interne, l. 5)** : « aucune citation d'humoriste » est rangé parmi les « Règles tenues ». Écrit ainsi, c'est une règle « zéro humoriste », interdite par le P0 s15. Réécriture : « pas de citation d'humoriste dans E1 à E3 (autorisées : E4 cite Mirabel) ».

## 4. Verdict

**Aucun bloquant.** GO pour E2.2 et E4 tels quels (E4 garde sa condition écrite : réécoute de 2:12 à 2:53 avant publication). E1.1, E1.2, E2.1 et E3 passent à 10 avec F1 à F5 : ce sont cinq retouches de langue sans nouvelle réplique, donc pas besoin d'un tour 5 à l'aveugle. Un contrôle du diff suffit (seules ces cinq lignes changent, répliques intactes).
