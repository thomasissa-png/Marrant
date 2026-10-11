# Notation : B3 /blog/mot-de-depart-collegue-drole (itération 3, contrôle, 05/10/2026)

> Revue @reviewer. Base : nouvelles captures de production après déploiement des correctifs (`snap2/mot-de-depart-collegue-drole/` : m00 à m08 en 390 px, d-haut et d-bas en 1280 px, sans JavaScript), HTML servi (`apercu-source.html`), brouillon `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md` (numéros de ligne = ce fichier).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables : texte des 22 lignes intact (contrôlé sur m00 à m04), slug, title, meta, H2 inchangés ; 0 tiret cadratin dans le HTML servi ; 0 humoriste.

## 1. Correctif iter2 : appliqué et visible

| # | Correctif | Brouillon | Rendu |
|---|---|---|---|
| C1 | « Une seule ligne » devient « Un message court » | l.75 | m01 et HTML servi : « Un message court, un ton neutre, une chute sur l'organisation du pot ou sur toi, jamais sur le partant. » ; plus de contradiction avec la n°5 (4 phrases) et la n°7 (3 phrases) |

1 sur 1.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref », « 22 mots de départ drôles » et sommaire dans le 1er écran 390 px (m00). |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie par section, sans doublon ; bloc de fin après les règles (m05). |
| 3 | CTA d'inscription | **10/10** | Après le corps, « Le mot est écrit. Reste le pot. », note vraie (m06). |
| 4 | Lisibilité mobile et structure | **10/10** | Numéro, texte, indication lisibles ; règles en gras ; puces thèmes à 44 px ; FAQ propre (m05, m06). |
| 5 | Ton Marrant des textes affichés | **10/10** | Plus aucune promesse de longueur fausse ; aucun gabarit relevé. |
| 6 | Conformité | **10/10** | Confiance décrit exactement, rien sur un licenciement, zéro tiret cadratin, zéro humoriste. |
| 7 | Sécurité SEO | **10/10** | Title, meta, H2 carte et ancres inchangés. |
| 8 | Mesure | **10/10** | Inchangé (slug suivi, partage, ancres, scroll, `src=`). |

**Note globale : 10/10** (80/80), contre 9,9 à l'iter2.
**Correctifs restants : aucun.**

## 3. Hors note (aucun effet sur le 10)

- « Mis à jour le … » n'apparaît plus sous la date (m00, d-haut) : point de l'iter2 §4 résolu.
- « À lire ensuite » (m06, m07) : cartes du cluster générique (« Comment faire rire une fille ») au lieu de la liste dédiée de `config/blog-related-cards.ts` l.39-43. Même constat que B2 iter3 §3 : déploiement à vérifier par @fullstack, sujet du gabarit.
- « 17h30 » (n°5) sans espaces : texte d'une ligne validée à l'aveugle, intouchable (position iter2 maintenue).
- Boutons « Envoyer le message n°N » non visibles (captures sans JS) : à contrôler sur une capture avec JS avant le 03/12.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B3-iter3.md
- Décisions prises : 10/10 ; C1 de l'iter2 appliqué et visible.
- Points d'attention : liste « À lire ensuite » dédiée à vérifier dans le déploiement ; capture avec JS avant publication.
---
