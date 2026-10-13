# C10 LinkedIn bureau : résultat de la relecture à l'aveugle (11/10/2026)

> 8 textes (6 candidats neufs, 2 ancres), 2 relecteurs indépendants (`aveugle-c10-linkedin-relecteur-1.md`, `-2.md`), clé `aveugle-c10-linkedin-CLE-ne-pas-ouvrir.json`. Règle : au niveau = 8,5 et plus chez les 2 ; gagnant = meilleure somme.

| N° | Origine | R1 | R2 | Au niveau |
|---|---|---|---|---|
| 6 | C10-seminaire-DRH | 9 | 8,5 | **oui (17,5)** |
| 1 | C10-photo-equipe | 8,5 | 8,5 | **oui (17)** |
| 4 | C10-collegue-silencieux | 8 | 8,5 | non |
| 7 | C10-chef-de-projet-retard | 9 | 8 | non |
| 3 | C10-formation-stress | 8 | 8 | non |
| 8 | C10-ambitions-a-confirmer | 8 | 7,5 (« connue ») | non |
| 5 | ANCRE T20 (8,5 / 8,5 au cycle 8) | 8 | 8 | non (dans ce tour) |
| 2 | ANCRE V107, LinkedIn du 20/10 en place | 7,5 | 7,5 (« connue ») | **non : sous la barre** |

## Décisions

- **20/10 LinkedIn** : V107 (« Ma mère me demande encore des nouvelles de mon ex. ») sort, notée 7,5 / 7,5 (règle d'or : rien sous la barre). **Remplacée par le n°6**, mot pour mot :
  « Au séminaire, il fallait dire un fait surprenant sur soi. J'ai dit que j'étais là depuis neuf ans. »
  « Le DRH m'a demandé ce que je faisais chez nous. »
  Marqueur conservé : `[variante:image]` (carte 4:5 = la chute ; texte envoyé = l'amorce seule, 98 caractères, sous 140).
- **27/10 LinkedIn** : T20 n'est plus au niveau dans ce tour (8 / 8) : il n'est pas placé. **Le n°1 remplace la tondeuse** (vanne familiale, hors bureau), mot pour mot :
  « La photo d'équipe de notre site date de 2021. Sur les huit personnes, il en reste deux. »
  « Les six autres sourient toujours pour nous, gratuitement. »
  Marqueur conservé : `[variante:texte]`. « gratuitement » est le ressort de la vanne (photo non payée), ni prix ni offre : conforme à la règle « jamais de prix ni d'abonnement dans le social » (`founder-preferences.md`, 05/10).
- V107 et la tondeuse retournent au pool ; V107 notée 7,5 / 7,5 ne doit plus être tirée sur LinkedIn sans nouvelle relecture.

## Application

Le lot 1b est validé tel quel (@reviewer GO révision 8) et s'insère le 13/10 06:30 UTC sans modification. **Échange en base après l'insertion** (programmé le 13/10 07:30 UTC, @fullstack) : les 2 vannes neuves entrent au catalogue, les 2 posts LinkedIn du 20/10 et du 27/10 reçoivent le texte et les `threadParts` [amorce, chute] ci-dessus (UPDATE ciblé id + texte exact), marqueurs et heures inchangés, registre des 90 jours mis à jour ; carte du 20/10 rendue et relue (`/api/social/image?postId=…&slide=0`). Butoir : 19/10 18:00 Paris.

## Révision du 12/10 (départage à l'aveugle, `docs/social/vague-v1/departage-linkedin*`)

Au tour 1 de la vague V1 (12/10), les 2 vannes C10 retombent à 8 / 8 (n°6) et 8,5 / 8 (n°1). Départage neuf à l'aveugle (2 relecteurs + Alexa) entre C10 n°6, C10 n°1 et les 4 vannes bureau au niveau de V1 :

| Texte | A | B | Au niveau |
|---|---|---|---|
| V1-1-05 réunion de direction / agence de Lyon | 9 | 9 | **oui (18)** |
| C10 n°1 photo d'équipe | 8,5 | 8,5 | oui (17) |
| V1-2-09 mail à Fabrice | 8,5 | 8,5 | oui (17) |
| V1-1-23 champ libre / virgules | 8 | 8,5 | non |
| C10 n°6 séminaire DRH | 8,5 | 8 | non |
| V1-2-12 pot de départ de Didier | 8 | 7,5 (« connue » chez les 2) | non, retirée de la vague |
| Alexa (ancre) | 8,5 | 8,5 | |

3e relecteur (égalité C10 n°1 / V1-2-09) : C10 n°1 8,5, V1-2-09 8 : **C10 n°1**.

**Décisions finales** :
- **20/10 LinkedIn** (`[variante:image]`) : **V1-1-05**, mot pour mot : « Pendant la réunion de direction, j'ai hoché la tête dix minutes sans rien comprendre. » / « J'ouvre l'agence de Lyon lundi. » (amorce de 85 caractères). Remplace V107, et non plus le n°6.
- **27/10 LinkedIn** (`[variante:texte]`) : **C10 n°1** (photo d'équipe), inchangé.
- C10 n°6 n'entre pas au catalogue ; V1-2-09 reste au pool de la vague V1 (au niveau dans ses 2 tours).

**Appliqué le 13/10** (@fullstack, `REPLIT_ACTIONS.md`) : V1-1-05 `cv1105a3e91c7d42b8f06d5e1` et C10 n°1 `cc10n1b7d24e8a59f3c61047a` au catalogue (BOULOT, GARDER, décryptage à fournir) ; posts `c9892ac953d655704e63e7fb1` (20/10) et `cd9b63b6e046d4e8b536d59b9` (27/10) échangés ; V107 (V035 au pool strict, `cs14jk90226d6abb90287724`) et la tondeuse sans aucun post en base, de nouveau tirables ; note V107 portée dans `src/config/social-pool.ts` (non bloquante pour le script de lot).
