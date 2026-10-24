# Verdict à l'aveugle, trajets v2 : relecteur neutre (cohérence)

Grille : `docs/ux/trajet-conversion-s21.md` §11, la même qu'au tour 1. Matériel : `docs/design/conversion-s21/trajets-v2/`. Notes données sur le **320 × 640**, avec un contrôle en 375 × 700. Je n'ai lu ni les documents de textes ni les autres verdicts.

Arbitrages du fondateur pris en compte, et donc pas comptés comme défauts : en fin d'article, le geste principal est le payant ; l'annuel n'est volontairement pas proposé en T3 ni en T4.

Les trois réserves de protocole du tour 1 sont levées. Les captures sont aux deux formats. Le chemin « Annuel » est capturé. La carte « Étape 2 sur 4 » est visible (`T3/320x640/01a`).

## Notes par trajet (320 × 640)

| Trajet | 1. Clarté 3 s | 2. Promesse tenue | 3. Clics | 4. Envie | 5. Confiance | Moyenne |
|---|---|---|---|---|---|---|
| T1 En-tête (mensuel) | 10 | 8 | 10 | 9 | 10 | 9,4 |
| T1 variante annuelle | 10 | 10 | 10 | 9 | 10 | 9,8 |
| T2 Mur de liste | 10 | 10 | 10 | 9 | 10 | 9,8 |
| T3 Fin d'étape 1 | 10 | 10 | 10 | 9 | 9 | 9,6 |
| T4 Fenêtre Premium | 10 | 10 | 10 | 9 | 9 | 9,6 |
| T5 Fin d'article | 10 | 10 | 10 | 8 | 10 | 9,6 |
| C1 Connecté, en-tête | 10 | 10 | 10 | 9 | 10 | 9,8 |
| C2 Connecté, mur | 10 | 10 | 10 | 9 | 10 | 9,8 |

**Verdict global : 9,6/10** (tour 1 : 8/10). Il reste **2 notes sous 9**, ce qui bloque le seuil du §11 (9 minimum sur chaque critère) : T1 promesse à 8 et T5 envie à 8. Toutes les autres notes sont à 9 ou 10.

## Notes sous 10 : cause et correction

### T1 Promesse 8 : le retour de paiement change de page
`T1/320x640/06-retour-bienvenue.png` : la personne est partie de /conseils (`01`), mais revient sur /parcours (fil d'Ariane « Accueil / Parcours »). Le bandeau dit pourtant « Reprends là où tu t'étais arrêté. ». C'est une page qui change de sujet, et le texte dit le contraire de ce qu'on voit (-2, selon la grille). T4 fait juste : retour sur /vannes, la page de départ (`T4/06`).
- Correction : faire revenir T1 sur la page d'où vient le clic, comme en T4. Si /parcours est un choix voulu, changer la dernière phrase du bandeau pour cette source, par exemple « Les 5 parcours sont ouverts, commence par celui qui te ressemble. ».

### Envie 9 sur toutes les pages /abonnement (T1, T1 annuel, T2, T5, C1, C2) : l'exemple du carnet a perdu sa scène
`T1/320x640/03`, bloc « Le carnet, en vrai » : l'exemple est bien remonté au-dessus du tableau, ce qui corrige le tour 1. Mais il ne reste que « Tu parles toujours aussi peu ? » et « Donne-moi la nuit. Demain, je t'envoie un message magnifique. ». La situation a disparu : au tour 1, on lisait « Le premier rendez-vous silencieux » et « Premier rendez-vous dans un restaurant, au dessert… ». Sans elle, on ne sait pas qui parle ni où, et la réplique perd son effet.
- Correction : remettre le titre de la situation (« Le premier rendez-vous silencieux ») comme 1re ligne du bloc, au-dessus de « On te dit ». C'est une ligne, et rien de nouveau n'est inventé.

### T3 Envie 9 : le bénéfice de l'étape est coupé au milieu d'un mot
`T3/320x640/01a` : la carte « Étape 2 sur 4 » se termine par « Ici, tu apprends à repére… » à 320 px, et par « …un instant que tout l… » à 375 px (`T3/375x700/01a`). La phrase qui donne envie est justement celle qui est coupée. Juste dessous, l'étape verrouillée répète « Le rythme et les silences, +75 XP » : le même nom apparaît deux fois à l'écran.
- Correction : afficher la description en entier (une ou deux lignes de plus). Dans la liste en dessous, masquer l'étape déjà présentée dans la carte.

### T3 et T4 Confiance 9 : « TTC » a disparu des trajets directs
`T3/320x640/01` (« 2,99 €/mois »), `T4/320x640/02` (« 2,99 € /mois ») et /register dans tous les trajets (« Premium, 2,99 €/mois. ») : le mot TTC n'apparaît plus. Au tour 1, il figurait dans la fenêtre T4 (« TTC / mois ») et sur /register (« 2,99 € TTC par mois »). T1, T2 et T5 le montrent sur /abonnement. T3 et T4 ne passent pas par cette page, donc ces deux trajets n'affichent jamais le prix TTC, alors que la grille l'exige (critère 5).
- Correction : sur /register, écrire « Premium, 2,99 € TTC/mois. » (et « 24,99 € TTC/an » pour l'annuel). Dans la fenêtre T4, remettre « TTC » à côté de « /mois ». Les boutons ne changent pas.

### T4 Envie 9 : la vanne citée est coupée juste avant la fin
`T4/320x640/02` et `T4/375x700/02` : on lit « « Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix… » ». La phrase entière, visible sur la fiche (`T4/01`), finit par « Moi, dix euros. » : on coupe à deux mots de la fin la vanne qu'on veut garder.
- Correction : citer la phrase en entier, ou couper à la fin d'une phrase.

### T5 Envie 8 : le titre du bloc parle d'autre chose que du bouton
`T5/320x640/01` : le geste payant est maintenant le bouton plein « Tout ouvrir · 2,99 €/mois », avec la garantie dessous. Le défaut du tour 1 est corrigé. Mais le titre « La vanne dans ta bouche, pas dans ton téléphone » parle de s'entraîner à voix haute, ce que fait le lien gratuit (« Tester mes premières répliques, gratuit »). Le bouton payant, lui, ouvre le catalogue et les parcours (-1). Le lien gratuit, en gras et souligné, attire encore l'œil autant que la garantie. À cela s'ajoute la scène du carnet perdue sur /abonnement (-1).
- Correction : relier le titre au geste payant sans changer le bouton. Par exemple, compléter la ligne actuelle en sous-titre : « Premium ouvre tout : le catalogue et les 5 parcours, avec leurs exercices concrets. ». La mention des exercices reprend l'intro de /parcours (`T1/06`), donc rien n'est inventé. Le lien gratuit passe en graisse normale, comme sur le mur (`T2/01`).

## Revérification du top 5 du tour 1

| # tour 1 | Défaut | Statut v2 | Preuve |
|---|---|---|---|
| 1 | /register identique quelle que soit l'entrée | **Corrigé** | « la suite des vannes s'ouvre » (`T2/04`), « l'étape 2 de Répartie s'ouvre : Le rythme et les silences » (`T3/04`), « ta vanne est dans tes favoris » (`T4/04`), « tout s'ouvre » (`T1/04`, `T5/04`). Le lien gratuit a disparu de /register. |
| 2 | Fenêtre T4 sans « Premium » ni contenu | **Corrigé** | « Garde-la avec Premium », « Il ouvre aussi tout le catalogue et les 5 parcours. », « D'abord ton compte, puis le paiement. » (`T4/02`). Régression : TTC perdu (voir plus haut). |
| 3 | Fin d'article : payant en lien texte, sans garantie | **Corrigé** | Bouton plein et garantie dessous (`T5/01`). Il reste le titre (voir plus haut). |
| 4 | Exemple du carnet après le tableau | **Corrigé** | Le bloc carnet est passé avant le tableau (`T1/03`). Nouveau défaut : la scène a disparu. |
| 5 | Page d'attente « Te voilà connecté. » | **Corrigé** | Attente dans le bouton (`T1/05`). La page brève de connexion dit « Ton compte est prêt. » et nomme Stripe (`T1-annuel/05b`). |

## Incohérences : revérification du tour 1

| # | Tour 1 | Statut v2 |
|---|---|---|
| I-V1 | « Je m'abonne et je la garde » (1re personne) | **Corrigé** : « S'abonner et la garder » (`T4/02`). |
| I-V2 | Sortie gratuite avec deux libellés | **Persiste** : « Tester l'étape 1 de Répartie, gratuite » (`T2/01`, /abonnement) contre « Tester mes premières répliques, gratuit » (`T5/01`). Choisir un seul libellé si la destination est la même. À vérifier dans le code. |
| I-V3 | « Te voilà connecté. » | **Corrigé** : « Ton compte est prêt. » (`T1-annuel/05b`). |
| I-V4 | « Connexion » contre « Connecte-toi » | Inchangé (`desktop-1280`), toujours acceptable. |
| I-L1 | « Tout le catalogue » contre « Listes » | **Corrigé** : la ligne du tableau s'appelle « Tout le catalogue », et on y lit « 10 vannes, 3 conseils, 3 vidéos dans les listes ». |
| I-L2 | « Défi » sur /conseils contre « Exercices des fiches : Non » | **Corrigé dans l'intro** : « Chaque conseil vient avec un exemple concret, à tester aujourd'hui. » (`T1/01`). Le libellé des cartes (« Clique pour l'exemple et le défi » au tour 1) n'est pas visible dans les captures v2 : à vérifier. |
| I-L3 | Cœur ou étoile | **Corrigé** : l'index parle d'étoile. |
| I-L4 | Résiliation : profil, ou lien « Résilier ton contrat » en pied de page | Inchangé. Vérifier que les deux mènent au même endroit. |
| I-P1 | Prix annuel jusqu'au bout | **Corrigé** : 24,99 € sur la case, « S'abonner · 24,99 €/an », « Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. » (/register), « Premium, 24,99 €/an, renouvelé chaque année. » (`05b`). Le prix suit sans écart. |
| I-P2 | Graphies du prix | **Partiel** : TTC a disparu de /register et de la fenêtre T4 (voir T3 et T4, Confiance). |
| I-P3 | Annuel absent de T3 et T4 | Tranché par le fondateur, n'est plus compté. |
| I-R3 | « Tout ouvrir », puis « Pour tout ouvrir », puis « Premium ouvre tout » | **Corrigé** : il n'y a plus d'accroche en T5 (`T5/02`). |
| I-R4 | Page d'attente avec deux logos et un pied de page | **Corrigé** : la page a disparu (attente dans le bouton), et `05b` n'a plus de pied de page. |

## Nouvelles incohérences et défauts de mise en page

| # | Où | Constat | Correction |
|---|---|---|---|
| N1 | `T1-annuel/05b` contre /register annuel | « renouvelé chaque année » contre « renouvelé chaque année, sauf résiliation ». C'est la même information écrite de deux façons. « Ton compte est prêt. » s'affiche aussi après « Déjà un compte ? Connecte-toi », alors que le compte existait déjà. | Reprendre la ligne exacte de /register. Pour une connexion, écrire « Te voilà connecté. ». Pour un compte créé, garder « Ton compte est prêt. ». |
| N2 | FAQ, `FAQ-prix/320x640` | La barre fixe « S'abonner · 2,99 €/mois » cache la fin de la réponse (« Un renouvellement n'ouvre pas de nouveau délai. ») à 320 px. La question titre « 2,99 €/mois, c'est vraiment tout ? » même quand l'annuel est coché, et aucune capture ne montre le prix de la barre fixe avec l'annuel coché. | Ajouter sous la FAQ une marge égale à la hauteur de la barre. Capturer la barre avec l'annuel coché : elle doit dire « 24,99 €/an ». Le titre de la question peut rester, puisque la réponse couvre l'annuel. |
| N3 | Formulations de l'étape compte | « Tu crées ton compte, puis tu paies par carte sur Stripe. » (/abonnement), « D'abord ton compte, puis le paiement. » (T3, T4), « Ton compte, puis le paiement » (titre de /register). | C'est acceptable : T3 et T4 reprennent le titre de /register, et /abonnement ajoute Stripe. Ne pas créer de 4e forme. |
| N4 | /abonnement, premier écran à 320 × 640 et 375 × 700 | Le bouton est visible : bas à environ 585 px (T1), 613 px (T2) et 633 px (annuel). Mais la ligne de garantie est coupée à mi-hauteur par le bas de l'écran (`T1/320x640/02`, `C1/320x640/02`). | Réduire de 8 à 12 px l'espace entre les puces et les formules, pour que la 1re ligne de garantie entre en entier. |
| N5 | `T1/320x640/06` | Le titre /parcours passe à la ligne avant le deux-points : « Parcours humour » puis « : deviens drôle ». | Mettre une espace insécable avant « : ». |
| N6 | `desktop-1280/abonnement-complete` | Les largeurs ne sont pas alignées : carte de 560 px, bulles du carnet plus étroites, tableau et bouton du bas plus larges. Le bloc saute d'une largeur à l'autre en défilant. | Aligner le carnet, le tableau et le bouton du bas sur les 560 px de la carte. |
| N7 | `T4/01` contre `T4/07` | Les filtres de /vannes changent après le paiement : « Boulot & Collègues, Couple, Dating » avant, « Toutes, Vie quotidienne, Boulot & … » après. Cela ne trompe pas, mais la page ne ressemble plus à celle qu'on a quittée. | À vérifier : si c'est un effet de l'état connecté, garder les mêmes filtres. |
| N8 | `T2/01` mur | La sortie gratuite « Tester l'étape 1 de Répartie, gratuite » propose un parcours à quelqu'un qui voulait des vannes. Elle a été retirée de /register, mais elle reste sur le mur. | Pas compté dans les notes, parce que c'est une alternative et pas une rupture. À garder en tête si la note d'envie de T2 doit monter à 10. |

## Top 5 des défauts restants (par coût)

1. **Retour de paiement T1 sur /parcours avec « Reprends là où tu t'étais arrêté. »** (`T1/06`). C'est le seul défaut de promesse qui reste. Correction : revenir sur la page d'origine, comme en T4.
2. **Le prix TTC n'apparaît jamais en T3 ni en T4** (fenêtre, carte, /register). Correction : remettre « TTC » sur /register et dans la fenêtre.
3. **Fin d'article : le titre parle d'entraînement à voix haute, le bouton ouvre le catalogue** (`T5/01`). Correction : un sous-titre qui fait le lien.
4. **L'exemple du carnet a perdu sa scène** (`/abonnement`, bloc « Le carnet, en vrai ») : il touche 6 trajets sur 8. Correction : remettre le titre « Le premier rendez-vous silencieux ».
5. **Textes coupés là où ils donnent envie** : « Ici, tu apprends à repére… » (`T3/01a`) et « Moi, dix… » (`T4/02`). Correction : afficher les phrases en entier.

## Garde-fous objectifs (§11)
Aucune faute objective trouvée. Aucun bouton ne promet ce que l'écran suivant ne tient pas : en T4, la vanne est bien dans les favoris après le paiement (`T4/07`, étoile pleine). Les prix sont justes (24,99 / 12 = 2,08 € ; 35,88 − 24,99 = 10,89 €, soit plus de 3 mois). « 1 500+ » est intact. La phrase de garantie est identique partout. Aucune mention légale dans un bouton. Aucun tiret cadratin vu dans les captures.
