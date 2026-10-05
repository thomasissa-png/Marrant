# Notation : /blog/premier-message-drole-appli-de-rencontre (A3, itération 2, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md` (numéros de ligne de ce fichier, version à 18 entrées), `config/blog-cta.ts` l.37-43, `config/blog-forte-frappe.ts` l.19 et l.41, `config/blog-tracking.ts` l.11, `markdown-renderer.tsx` (`headingId` l.180), test `blog-article-parcours-maillage.test.tsx` l.50.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`. Itération précédente : `notation-A3-iter1.md` (8,4/10).
> Faits acquis (fournis par la demande, non revérifiés) : import en base, programmation au 29/10, `--update`, FAQ convertie en `faqs` + JSON-LD, meta issue de `metaDescription`, conversion des « » imbriqués en “…”, gabarit commun à 10/10.
> Intouchables respectés par tous les correctifs : texte des 20 messages (18 numérotés + 2 vannes hors numéro), zéro tiret cadratin, aucun humoriste, aucune marque d'appli (Grep `—|–|Tinder|Bumble|Hinge|Happn|Meetic|Fruitz|OkCupid|Adopte|Badoo|Grindr` : vide).
> Limites : aucun rendu réel vu (pas de capture), tests non exécutés, pas de git.

## 1. Correctifs de l'itération 1 : tous appliqués

| # | Correctif iter1 | Statut | Preuve |
|---|---|---|---|
| C1 | Sommaire sous l'« En bref », périmètre après les règles | Appliqué | l.43 (sommaire en 2e bloc), l.59 (périmètre avant le 1er H2) |
| C2 | Encart parcours Confiance | Appliqué (autre mécanisme) | `blog-forte-frappe.ts` l.41 `"confiance"`, test l.50 |
| C3 | Sortie animal vers `phrases-droles-conversations` | Appliqué | l.167 |
| C4 | Sortie relance : 2 liens, « au même rythme » | Appliqué | l.203 |
| C5 | Blague du jour « pour demain », 2 lignes retirées | Appliqué | l.230, bloc l.230-242 |
| C6 | CTA dédié après le corps | Appliqué | `blog-cta.ts` l.38-43, textes identiques à l'en-tête l.7-10 |
| C7 | Guillemets imbriqués | Appliqué (variante citation `>`) | messages en `>` sans guillemets extérieurs, un seul niveau de « » (l.75, l.81, l.145, l.187, l.193) |
| C8 | Référent clair, formule non répétée | Appliqué | l.71, l.97 |
| C9 | Fin copié-collé différente de la FAQ | Appliqué | l.216 |
| C10 | Règle 2 « aux dépens de » | Appliqué | l.53 |
| C11 | Situation 18 conditionnée à une excuse | Appliqué (autre forme) | condition dans l'indication l.201, titre l.197 inchangé (voir C2 ci-dessous) |

Ancres du sommaire recalculées avec `headingId` (minuscules, accents retirés, non-alphanumérique en `-`) : les 4 correspondent aux H2 l.63, l.89, l.121, l.171.

## 2. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **10/10** | « En bref » qui donne la recette, sommaire des 4 situations en 2e bloc, périmètre placé juste avant le 1er H2. |
| 2 | Sorties vers une 2e page | **10/10** | Une sortie ciblée par fin de section (dating, autodérision, conversation, Répartie/Confiance), encart Confiance, 17 pages liées sans doublon de promesse. |
| 3 | CTA d'inscription | **10/10** | CTA dédié juste après le corps, promesse tournée vers l'écrit, note qui rassure (« restent en accès libre »), même structure que l'étalon. |
| 4 | Lisibilité mobile et structure | **9/10** | Format titre/message/indication régulier, mais le bouton « Envoyer le message n°N » envoie le texte tel quel alors que l.209 dit « des moules, pas des scripts » sans le relier au bouton, et le titre n°18 ne dit pas la condition d'usage (elle n'arrive qu'en fin d'indication). |
| 5 | Ton Marrant des textes affichés | **8/10** | « Le gag est sur » ouvre 3 indications d'affilée (n°8, 9, 10) et 5 en tout ; « (son nom, son caractère) » est répété (l.129, l.141) ; la n°16 redit la n°15 ; la n°17 redit l.175 ; la FAQ 2 dit deux fois « X vaut mieux que Y » ; la n°2 est le seul premier message sans porte ouverte (règle 3). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, humoriste, marque ; durées reprises de l'étalon et de S9. Un écart de respect : l.173 « jamais le message de l'autre » réintroduit, dans la section même où la n°17 reprend « Plus tard », la contradiction que C10 a corrigée pour la règle 2. |
| 7 | Sécurité SEO | **10/10** | Title 54 car. avec la requête exacte, meta 154 car., 6 H2 sur 6 en question, FAQ en dernière H2 sans markdown dans les réponses, ancres exactes, cannibalisation traitée. |
| 8 | Mesure | **10/10** | Gabarit commun ; slug dans `blog-tracking.ts` l.11 et vérifié par `weekly-blog-report.test.ts` l.66 ; bouton Partager en mode `text-only`. |

**Note globale : 9,5/10** (76/80), contre 8,4 à l'itération 1.
**Après les 8 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 3. Top 3

1. **C8 (l.173, respect)** : la seule phrase qui contredit une règle de l'article. Un mot à changer.
2. **C3 (indications n°8 à 10)** : trois ouvertures identiques d'affilée, c'est le gabarit que la charte anti-IA vise.
3. **C1 (bouton et copié-collé)** : relie la nouvelle fonction à la méthode de l'article, sinon le bouton pousse à envoyer un message que l'article demande d'adapter.

## 4. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, puis réimport avec `--update`. Aucun mot des messages en `>` ne change. Aucun code touché.

### C1. Relier le bouton à la méthode « moules, pas scripts » (critère 4)

**Avant** (l.209) :
```md
Les messages ci-dessus sont des moules, pas des scripts. Pour qu'ils sonnent comme toi :
```
**Après** :
```md
Les messages ci-dessus sont des moules, pas des scripts : le bouton sous chacun te le donne tel quel, à toi d'y mettre ton détail avant de l'envoyer. Pour qu'ils sonnent comme toi :
```
Pourquoi : le mode `text-only` (`blog-forte-frappe.ts` l.8-10) affiche « Envoyer le message n°N » sous 18 messages. Sans cette phrase, le bouton invite à envoyer verbatim ce que le point 1 de la liste (« Change le détail ») demande de modifier.

### C2. La condition de la n°18 dans le titre, pas en fin d'indication (critère 4)

**Avant** (l.197) :
```md
**18. La conversation reprend après un long silence de la personne.**
```
**Après** :
```md
**18. La personne revient après un long silence et s'excuse du retard.**
```
**Avant** (l.201) :
```md
*→ À n'envoyer que si la personne s'est excusée de son retard : sinon, « aucune excuse nécessaire » laisse entendre qu'une excuse était due. Aucun reproche, même drôle. Le rire tombe sur toi ou sur la situation, jamais sur le retard de l'autre.*
```
**Après** :
```md
*→ Sans excuse de sa part, garde-la pour une autre fois : « aucune excuse nécessaire » laisserait entendre qu'une excuse était due. Aucun reproche, même drôle : le rire porte sur ta propre ponctualité, jamais sur son retard.*
```
Pourquoi : le titre sert à choisir la situation (le sommaire dit « Va direct à ta situation »). Un lecteur qui survole prend aujourd'hui la n°18 pour tout retour après un silence et peut envoyer le message avant de lire l'indication.

### C3. Indications n°8, 9, 10 : trois ouvertures différentes (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.129 | `*→ Le gag est sur toi et ta politesse envers un chat, pas sur celui de la personne. Ajoute une question concrète sur son chat (son nom, son caractère).*` | `*→ Tu ris de ta politesse envers un chat, pas du sien. Ajoute une question concrète : son nom, ou qui a le dernier mot à la maison.*` |
| l.135 | `*→ Le gag est sur ton cadeau raté, pas sur le chat de la personne. Termine par une question sur ses jeux préférés : « et le tien, il joue avec quoi ? ».*` | `*→ C'est ton cadeau raté qui fait rire, son chat n'y est pour rien. Finis sur le sien : « et le tien, il joue avec quoi ? ».*` |
| l.141 | `*→ Le gag est sur toi, qui ne te crois pas visé par l'attention d'un chat. Termine par une question concrète sur le sien (son nom, son caractère).*` | `*→ La chute est sur toi, étonné qu'un chat t'ait choisi. Demande ensuite si le sien vient vers les gens ou les ignore.*` |

Pourquoi : trois indications consécutives ouvraient sur « Le gag est sur », et deux finissaient sur « (son nom, son caractère) ». Chaque question proposée prolonge maintenant son propre message.

### C4. N°16 : ne pas redire la n°15 (critère 5)

**Avant** (l.189) :
```md
*→ À envoyer seulement si ton week-end ressemble à ça : sinon, réponds par ce que tu fais vraiment. Aucun engagement sur un rendez-vous, puis renvoie la question.*
```
**Après** :
```md
*→ À envoyer seulement si un ami déménage vraiment ce week-end. Sinon, reprends la forme de la n°15 avec ton vrai programme.*
```
Pourquoi : « ce que tu fais vraiment », « sans engagement sur un rendez-vous » et « renvoie la question » sont déjà dans l'indication l.183, six lignes plus haut.

### C5. N°17 : ne pas redire le paragraphe l.175 (critère 5)

**Avant** (l.195) :
```md
*→ Une relance légère est permise après quelques jours, sans reproche et sans urgence. Si rien ne vient, tu t'arrêtes là.*
```
**Après** :
```md
*→ Tu reprends ses propres mots sans les lui reprocher, et « prends ton temps » lui laisse le droit de ne pas répondre. C'est ta seule relance.*
```
Pourquoi : « une seule relance légère […] après quelques jours » (l.175) et « Si rien ne vient » (l.177) sont 20 lignes plus haut. La nouvelle indication explique pourquoi CE message est une bonne relance.

### C6. N°2 : la porte ouverte de la règle 3 (critère 5)

**Avant** (l.77) :
```md
*→ Une bio qui demande du rire met la pression. Désamorce-la en te prenant pour cible, sans rien promettre que tu ne tiendras pas.*
```
**Après** :
```md
*→ Une bio qui demande du rire met la pression. Désamorce-la en te prenant pour cible, sans rien promettre que tu ne tiendras pas, puis rends-lui la main : « et toi, qu'est-ce qui t'a fait rire cette semaine ? ».*
```
Pourquoi : le message se termine sur une chute fermée. Les autres premiers messages ont tous une question, soit dans le message, soit dans l'indication ; la n°2 était la seule exception à la règle 3 (l.54).

### C7. FAQ 2 : une seule comparaison (critère 5)

**Avant** (l.252) :
```md
Non. Si le profil est sérieux ou si la personne écrit sobrement, une phrase simple et chaleureuse vaut mieux qu'une blague forcée. L'humour marche quand il vient naturellement, une seule touche par message suffit, et un message sans humour mais précis vaut mieux qu'une plaisanterie qui sonne faux.
```
**Après** :
```md
Non. Si le profil est sérieux ou si la personne écrit sobrement, une phrase simple et chaleureuse vaut mieux qu'une blague forcée. Quand l'humour vient naturellement, une seule touche par message suffit.
```
Pourquoi : deux « vaut mieux que » pour la même idée dans une réponse de 3 phrases. Aucune syntaxe markdown : la FAQ reste extraite en `faqs` et en JSON-LD.

### C8. L.173 : même formulation que la règle 2 (critère 6, respect)

**Avant** (l.173, fin de phrase) :
```md
le trait d'humour te vise toi (ta réponse, ton week-end) ou la situation, jamais le message de l'autre.
```
**Après** :
```md
le trait d'humour te vise toi (ta réponse, ton week-end) ou la situation, jamais aux dépens du message de l'autre.
```
Pourquoi : la n°17, dans cette section, cite « Plus tard », écrit par l'autre. « Jamais le message de l'autre » l'interdirait ; l'interdit réel est de s'en moquer (C10 iter1, règle 2 l.53).

### Récapitulatif et mesure du diff (P0 s11)

| # | Critère | Lignes | Nature |
|---|---|---|---|
| C1 | 4 | l.209 | 1 phrase complétée |
| C2 | 4 | l.197, l.201 | titre + indication |
| C3 | 5 | l.129, l.135, l.141 | 3 indications |
| C4 | 5 | l.189 | 1 indication |
| C5 | 5 | l.195 | 1 indication |
| C6 | 5 | l.77 | 1 indication complétée |
| C7 | 5 | l.252 | 1 réponse FAQ raccourcie |
| C8 | 6 | l.173 | 2 mots |

11 lignes modifiées sur environ 220 lignes de contenu, 0 mot des 20 messages, 0 slug, title, meta ou H2 modifiés, 0 fichier de code. Ne pas l'annoncer comme une réécriture. Réimport `--update` puis contrôle du rendu des n°2, 17 et 18.

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 5. Hors note (en-tête interne, non rendu)

- **l.26** : « programmés avant le 03/12 » est périmé depuis l'avancée au 29/10. Remplacer par « avant le 29/10 ». S2 (`se-presenter-avec-humour`) reste au 12/10 dans `calendrier-editorial-q4-2026.md` l.17 : le lien l.59 ne mènera pas à une 404, à condition que S2 parte bien à cette date.
- **l.12** : ajouter « correctifs de `notation-A3-iter2.md` (C1 à C8) appliqués » au statut.
- **readingTime 8 min** : non recompté ici.

## 6. Décision pour Thomas (reportée de l'itération 1, sans effet sur la note)

- **Message n°4** (« J'ai agrandi ta photo pour repérer le sentier… ») : toujours ouvert. Par défaut, on le garde (validé à l'aveugle, l'indication l.97 cadre la lecture).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A3-iter2.md
- Décisions prises : 9,5/10 (76/80) ; les 11 correctifs iter1 sont appliqués (C2, C7 et C11 sous une autre forme, équivalente) ; 8 correctifs exacts (C1 à C8) mènent à 10/10, sans toucher aux messages, au slug, au title, à la meta, aux H2 ni au code.
- Points d'attention : @copywriter applique C1 à C8 et met l'en-tête à jour (§5), puis réimport `--update` ; captures 375/768/1280 à prendre et à lire après réimport (aucun rendu vu à ce stade) ; vérifier que S2 sort le 12/10.
---
