# Notation : B3 /blog/mot-de-depart-collegue-drole (itération 2, 05/10/2026)

> Revue @reviewer. Base : captures de production de la page d'aperçu admin (`snap/mot-de-depart-collegue-drole/` : m00 à m08 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), brouillon `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md` (numéros de ligne = ce fichier).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : le correctif ne touche ni les 22 lignes, ni le slug, le title, la meta ou les H2 ; 0 tiret cadratin ; 0 humoriste.
> Non compté : boutons « Envoyer le message n°N » absents (sans JS).

## 1. Correctifs iter1 : appliqués et visibles

| # | Correctif | Brouillon | Capture |
|---|---|---|---|
| C1 | Sommaire en 2e bloc | l.47 | m00 : dans le 1er écran |
| C2 | Doublons de sortie | l.135, l.173 | m04, m05 |
| C3 | « Quelques phrases courtes » | l.13, 43, 49 | m00 |
| C4 | Règle 1 | l.165 | m05 |
| C5 | Cagnotte hors de la vue du partant | l.75, l.81 | m01, m02 |
| C6 | Indications n°15 et n°18 | l.124, l.133 | m03, m04 |
| C7 | Intro section 5 | l.141 | m04 |
| C8 | Promesse Confiance | l.155 | m04 |
| C9 | « Collègue » dans la meta | l.12 | non vérifiable sur l'aperçu (il sert la meta générique du site) ; brouillon conforme, à relire dans le `<head>` le 03/12 |
| C10 | H2 carte | l.53 | m00, d-haut |
| C11 | Deux phrases de gabarit | l.163, l.177 | m05 |

11 sur 11.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref », « 22 mots de départ drôles » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, plus de doublon ; le toast S9 a deux rôles distincts (intro, mail d'adieu). |
| 3 | CTA d'inscription | **10/10** | Après le corps, « Le mot est écrit. Reste le pot. », « sans carte bancaire » (m06). |
| 4 | Lisibilité mobile et structure | **10/10** | Format numéro, ligne, indication lisible en 390 px ; règles en gras ; FAQ propre (m06). |
| 5 | Ton Marrant des textes affichés | **9/10** | L'intro du canal d'équipe annonce « Une seule ligne » (l.75, m01) juste avant la n°5 (4 phrases, mail d'invitation avec date et heure) et la n°7 (3 phrases) : même promesse de longueur fausse que celle corrigée par C3. |
| 6 | Conformité | **10/10** | Confiance décrit exactement, rien sur un licenciement, zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | **10/10** | Title 54 car., meta avec « collègue », H2 carte distinct d'A1 avec « carte de départ », « pot de départ » dans le texte. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage, ancres, scroll, `src=`). |

**Note globale : 9,9/10** (79/80), contre 9,1 à l'iter1.
**Après le correctif ci-dessous : 10/10 sur les 8 critères.**

## 3. Correctif exact

### C1. « Une seule ligne » devient vrai (critère 5)

Fichier : `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md`.
**Avant** (l.75, 2e phrase) : `Une seule ligne, un ton neutre, une chute sur l'organisation du pot ou sur toi, jamais sur le partant.`
**Après** : `Un message court, un ton neutre, une chute sur l'organisation du pot ou sur toi, jamais sur le partant.`
Pourquoi : les n°5 à 8 font 2 à 4 phrases et la n°5 est un mail d'invitation ; « un message court » tient la consigne (pas de pavé dans le canal) sans contredire les lignes. Le reste du paragraphe ne change pas. Réimport `--update`.

Diff réel (P0 s11) : 3 mots sur environ 205 lignes de contenu ; 0 caractère dans les 22 lignes. Zéro code.

## 4. Ne comptent pas contre le 10

- **« Mis à jour le 5 octobre 2026 »** sous « 3 décembre 2026 » (m00, d-haut) : artefact d'aperçu, `updatedAt` reprend la date du jour à la publication (voir notation B1 iter2, §4).
- **Encart Machine à Café** (m07, d-bas) : cohérent avec un départ au bureau et avec la sortie l.89 ; le CTA parle de répartie sans nommer de parcours (décision iter1 maintenue).
- **« 17h30 »** (n°5) sans espaces : texte d'une ligne validée à l'aveugle, intouchable.
- **« À lire ensuite »** : cartes communes à tous les CATALOGUE (gabarit).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B3-iter2.md
- Décisions prises : 9,9/10 ; C1 à C11 de l'iter1 appliqués et visibles ; 1 correctif de 3 mots pour 10/10.
- Points d'attention : @copywriter applique C1 puis réimport `--update` ; nouvelle capture m01 avant le 03/12.
---
