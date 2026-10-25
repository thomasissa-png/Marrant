# Relecture à l'aveugle : lettre de la semaine W45 (N°1 décalé) et W46 (nouveau numéro), s22

> Date : 25/10/2026 · Relecteur : @reviewer · Mode : aveugle (aucun fichier de `docs/reviews/` lu).
> Sources lues : `scratchpad/lettre-hebdo-w45/propositions.md` (propositions), `apps/web/src/data/lettre/hebdo-premium.json` (8 numéros existants), `apps/web/src/data/carnet/2026-11.json` (fiches 02, 09, 12, 19, 22, 26), `docs/copy/ton-alex.md`, `apps/web/src/config/textes/lettre-hebdo-s21.ts`, `apps/web/src/config/question-equipe.ts`, `docs/product/ta-question-a-l-equipe-s21.md`.

## Résumé exécutif
Le contenu éditorial est au niveau : le N°1 décalé au jeudi 05/11 ne change pas, et la nouvelle scène du 12/11 (« Le renfort du samedi ») a une réplique qui fait sourire et un exercice faisable chez soi. Un seul vrai problème : l'e-mail d'invitation et la ligne « Ta question à l'équipe » annoncent une fonction **qui ne sera pas ouverte** au moment de l'envoi (interrupteur fermé, mise en ligne prévue après ~10/11). Tant que ce paragraphe reste par défaut, on promet une chose fausse. Correction simple : version par défaut sans ce paragraphe, ajouté seulement le jour où la fonction est ouverte en production.

## Notes par texte

| # | Texte | Note /10 | Verdict | Bloquant |
|---|---|---|---|---|
| T1 | N°1 décalé en W45 (05/11), texte inchangé, `utm_content` corrigé | 9,5 | **GO** | Aucun (à condition que la ligne « Ta question » soit absente le 05/11, voir T4) |
| T2 | Nouveau numéro W46 (12/11), fiche 2026-11-09 + accroche **B** | 9 | **GO** (avec B) | Aucun |
| T2-A | Accroche A | 8 | sous la barre | Non |
| T2-B | Accroche B | 9 | **retenue** | Non |
| T2-C | Accroche C | 6 | rejetée | Non (fait de saison non sourcé) |
| T3-A | Objet A « Le renfort du samedi » | 9 | **retenu** | Non |
| T3-B | Objet B « Samedi, tu es libre ? » | 6 | rejeté | Non (piège à clic léger) |
| T3-C | Objet C « Un canapé au troisième » | 8 | non retenu | Non |
| T4 | Ligne « Ta question à l'équipe » (retouche « te laisse sans réplique ») | 9 (texte) | Texte GO, **publication NO-GO tant que l'interrupteur est fermé** | **Oui, si publiée avant ouverture** |
| T5 | E-mail d'invitation tel que proposé | 7,5 | **NO-GO** | **Oui** (promesse fausse, voir B1) |
| T5' | E-mail d'invitation corrigé (ci-dessous) | 9 | GO après corrections | Aucun |

## Bloquants

**B1. Promesse d'une fonction absente (invitation T5, ligne T4).**
- Preuve : `apps/web/src/config/question-equipe.ts:12` `QUESTION_EQUIPE_OUVERTE: boolean = false` ; `apps/web/src/components/profil/question-equipe-card.tsx:42` l'encadré du profil ne s'affiche pas ; `apps/web/src/app/api/question-equipe/route.ts:34` l'API renvoie 404. `docs/product/ta-question-a-l-equipe-s21.md:5` : « V1 codée, INERTE […] non déployée […] Mise en ligne après le bilan du lot 1 (~10/11), déploiement séparé ».
- Conséquence : l'invitation part **avant** le 05/11. Un abonné qui lit « Pose ta question à l'équipe depuis ton profil » ouvre son profil et ne trouve rien. Promesse fausse = bloquant.
- La proposition prévoit le cas (« si la fonction n'est pas ouverte, supprimer le paragraphe »), mais en fait la version **par défaut**, alors que le calendrier documenté dit que la fonction sera fermée. Il faut inverser : **par défaut sans le paragraphe**, ajouté seulement si l'interrupteur est ouvert **en production** au moment de l'envoi ou de l'approbation.
- Pour la lettre : la ligne est **exclue du N°1 (05/11) dans tous les cas**. Pour W46 (12/11) : seulement si la fonction est ouverte en production avant l'approbation de Thomas (le point 3 de la proposition, approbations annulées si `bodyText` change, est juste et doit être tranché par @fullstack avant).

## Corrections (actuel → proposé)

### T2 Accroche du nouveau numéro
| Actuel (préférée par l'auteur) | Proposé | Raison |
|---|---|---|
| A. « Dire oui à un ami, c'est facile. Le dire avec un peu de style, c'est l'exercice de la semaine. » | **B. « Samedi approche, et il y a toujours un ami qui a une idée de ce que tu pourrais en faire. Voici de quoi lui répondre. »** | A est juste mais plate et un peu scolaire (« c'est l'exercice de la semaine », ton-alex : « ni scolaire »). Sa première phrase contredit la scène : dire oui à un canapé au troisième sans ascenseur, justement, ce n'est pas facile. B est une observation vraie, avec un sourire discret (« une idée de ce que tu pourrais en faire »), colle à l'envoi du jeudi et suit le modèle maison des numéros existants (W48 : « On se dit toujours… Voici la scène de… » ; W51 : « Il y a ceux qui… »). Pas de spoil de la réplique. |

Option facultative (non requise pour le GO, repasse l'aveugle si retenue) : B et l'accroche du N°1 commencent sur le même moule (« Le froid s'installe, et… » / « Samedi approche, et… ») deux semaines de suite. Variante sans ce moule : « Il y a toujours un ami qui a une idée pour ton samedi. Voici de quoi lui répondre. »

Accroche C rejetée : « Mi-novembre, les week-ends se remplissent vite » est une généralité de saison que la fiche ne dit pas (elle ne parle pas de novembre), contraire à la règle que l'auteur s'est fixée (« aucun fait de saison inventé ») ; « la scène du jeudi » est inexact (l'appel a lieu « en milieu de semaine »).

### T3 Objet
**Retenu : A « Le renfort du samedi »** (titre de la fiche, convention des 8 autres numéros, pas de nouveau champ `objet`, zéro risque). B reprend mot pour mot le début de la phrase de l'ami (`onTeDit`) : dans une boîte de réception, « Samedi, tu es libre ? » envoyé par une marque se lit comme un message perso d'un proche, c'est un piège à clic léger. C est concret et donne envie, mais dévoile la situation et casse la convention ; à garder seulement pour un futur test.

### T4 Ligne « Ta question à l'équipe »
| Actuel | Proposé | Raison |
|---|---|---|
| « Une situation t'a coincé ? Pose ta question… » | « Une situation te laisse sans réplique ? Pose ta question à l'équipe depuis ton profil : en général, réponse sous 1 à 2 jours ouvrés. » (retouche de l'auteur, validée) | Accord du participe avec le COD « t' » (« coincée » pour une lectrice) : correction juste. Délai conforme au fait fourni (« en général sous 1 à 2 jours ouvrés ») et à `ta-question-a-l-equipe-s21.md:3`. |
| Ligne présente selon le drapeau | Ligne **absente du N°1** ; W46 seulement si la fonction est ouverte en production avant l'approbation | B1 |
| (rien) | À voir avec @fullstack : un lien direct vers l'encadré dans un e-mail texte (ancre à confirmer, ne pas l'inventer) | Dans un e-mail texte seul, « depuis ton profil » sans lien oblige à chercher |

### T5 E-mail d'invitation
| Actuel | Proposé | Raison |
|---|---|---|
| Paragraphe « Une situation te laisse sans réplique ? Pose ta question… 1 à 2 jours ouvrés. » présent par défaut | **Retiré par défaut** | B1 (bloquant) |
| « coche la case de ton profil ({base}/profil#lettre), sinon rien ne change » | « Elle est facultative : tant que tu ne coches pas la case, rien ne change. Pour la recevoir : {base}/profil#lettre » | Dans un e-mail texte, une adresse collée à « ), » risque d'être prise dans le lien par certaines messageries (lien cassé sur le seul bouton utile). Adresse en fin de phrase, après deux-points, comme dans le texte @legal (`lettre-hebdo-s21.ts:148`). |
| « (CGU, article 10 : {base}/cgu#lettre). » | « Les conditions sont dans l'article 10 des CGU : {base}/cgu#lettre » | Même risque ; reprend mot pour mot l'avis @legal §6.5 (`lettre-hebdo-s21.ts:150`), donc moins d'écart avec un texte « EXACT ». |
| « Pré-en-tête (optionnel) : Facultative, à activer depuis ton profil. » | Pré-en-tête **obligatoire** | Seul, l'objet « … arrive jeudi 5 novembre » peut laisser croire à un envoi automatique ; le pré-en-tête corrige ça dès la boîte de réception. |
| « 118 jetons, ~112 mots » | Mesuré : **124 jetons** (`split(/\s+/)`), **119 mots** | Compte annoncé faux (P0 s11 : pas de rapport validé sans mesure réelle). 119 mots passe de justesse la limite de 120 mots, mais 124 jetons la dépasse avec la mesure du projet. Disparaît avec la version corrigée. |

**Version corrigée par défaut (fonction « Ta question » fermée) : 106 jetons, 102 mots.**
```
Objet : La lettre de la semaine arrive jeudi 5 novembre
Pré-en-tête : Facultative, à activer depuis ton profil.

Salut,

La lettre de la semaine est dans ton abonnement Premium : chaque jeudi, une scène du carnet, la réplique et l'exercice. Le premier numéro part jeudi 5 novembre à 8 h.

Elle est facultative : tant que tu ne coches pas la case, rien ne change. Pour la recevoir : {base}/profil#lettre

Tu peux l'arrêter en un clic, sans toucher à ton abonnement. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine. Les conditions sont dans l'article 10 des CGU : {base}/cgu#lettre

Tu ne recevras pas d'autre message à ce sujet.

L'Équipe Deviens Marrant
```
Si (et seulement si) la fonction est ouverte en production au moment de l'envoi, ajouter avant « Tu ne recevras pas… » : « Une situation te laisse sans réplique ? Pose ta question à l'équipe depuis ton profil. » (15 jetons, total 121 jetons, 116 mots). Le délai est vrai mais, avec lui, le corps passe à 125 mots (au-dessus de 120) : il reste dans la lettre, pas dans l'invitation.

Condition de vérité de la date : « Le premier numéro part jeudi 5 novembre à 8 h » n'est vrai que si le N°1 est `VALIDE` et approuvé par Thomas, les interrupteurs `LETTRE_HEBDO_*` ouverts et l'article 10 des CGU publié **avant** l'envoi de l'invitation. Sinon, ne pas envoyer (point 5.1 et 5.3 de la proposition, confirmés).

## Contrôles effectués (critères du brief, binaires)

| Critère | T1 W45 | T2 W46 (accroche B) | T4 ligne | T5 invitation (proposée) | Évidence |
|---|---|---|---|---|---|
| 1. Drôle et utile | PASS | PASS | n/a | n/a (pas de vanne, voulu) | Réplique 09 : « Mon dernier effort physique, c'était ton précédent canapé » : chute sur « précédent », observation vraie ; exercice (pack d'eau, gros livre) faisable chez soi (`2026-11.json:109,112`) |
| 2. Fidélité, rien d'inventé | PASS | PASS | PASS | PASS (hors B1) | Dates : 2026 commence un jeudi, 53 semaines, jeudi W45 = 05/11, W46 = 12/11, 8 h Paris = 07:00 UTC (heure d'hiver depuis le 25/10). Fiche 02 « Un matin de novembre » (`2026-11.json:23`). Motifs d'écart vérifiés : 22 « Début novembre » (l.264), 26 « hibernation » (l.313), 12 « Dimanche » (l.144) ; contextes quotidien (l.22), amis (l.106), boulot W47 (l.227) |
| 3. Accroche/objet sans piège | PASS | PASS (B + objet A) | n/a | PASS (avec pré-en-tête) | B ne donne ni la réplique ni la phrase de l'ami ; objet B rejeté |
| 4. Invitation claire, vraie, ≤ 120 mots | n/a | n/a | **FAIL tant que fermé** | **FAIL** (B1, compte faux) | `question-equipe.ts:12`, `ta-question-a-l-equipe-s21.md:5` |
| 5. Ton maison, zéro tiret, pas d'IA | PASS | PASS | PASS | PASS | 0 tiret cadratin ou demi-cadratin dans les propositions (Grep), tutoiement, « on », signature « L'Équipe Deviens Marrant » ; aucune mention IA |

Jetons du W46 recomptés en partie : « On te dit » 20 (annoncé 21), « Tu réponds » 14 (=), « Pourquoi ça marche » 49 (annoncé 48). Écarts de ±1, total autour de 186, très en dessous de 230 : sans effet.

## Décisions à confirmer par Thomas
1. Nombre de destinataires de l'invitation : la proposition dit « 4 abonnés Premium actuels », la spec dit « les 2 abonnés existants » (`ta-question-a-l-equipe-s21.md:111`). À confirmer dans l'admin, pas à deviner.
2. Date de la lettre du mois : un test contient `2026-11-05T08:00:00+01:00` (point 5.4 de la proposition). Vérifier avec @fullstack que la règle « un envoi par destinataire et par semaine » et la pause tiennent le 05/11.
3. Ouverture de « Ta question » avant ou après l'approbation du W46 (point 3.3 de la proposition), à trancher avant d'approuver les corps.

## Recommandation
- **N°1 W45 : GO.** Seuls `semaine` et `utm_content` changent ; ligne « Ta question » absente.
- **Nouveau W46 : GO avec l'accroche B et l'objet A.** L'auteur préférait A : le choix change, il doit être reporté dans le bloc JSON.
- **Ligne « Ta question » : texte GO, publication NO-GO** tant que `QUESTION_EQUIPE_OUVERTE` est fermé en production.
- **Invitation : NO-GO en l'état** (B1) ; GO après passage à la version corrigée ci-dessus, puis validation de Thomas (brouillon, jamais d'envoi direct).
- Agent à relancer : @copywriter (accroche B dans le JSON, invitation corrigée par défaut) ; @fullstack (emplacement conditionnel de la ligne, ancre éventuelle, ordre drapeau/approbation). Re-vérification limitée aux critères 3 et 4.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/Marrant/docs/reviews/review-lettre-hebdo-w45-w46-s22.md`
- Notes : T1 W45 9,5 GO · T2 W46 9 GO (accroche B) · accroches A 8 / B 9 / C 6 · objets A 9 / B 6 / C 8 · ligne « Ta question » 9 (texte), publication NO-GO tant que fermée · invitation 7,5 NO-GO, 9 une fois corrigée.
- Bloquant : B1, l'invitation (et la ligne de pied) promet « Ta question à l'équipe » alors que la fonction est inerte (`config/question-equipe.ts:12`) et prévue après ~10/11. Version par défaut sans le paragraphe.
- Choix : **accroche B** (« Samedi approche, et il y a toujours un ami qui a une idée de ce que tu pourrais en faire. Voici de quoi lui répondre. ») ; **objet A** (« Le renfort du samedi »).
- Points d'attention : le compte annoncé pour l'invitation est faux (124 jetons et non 118) ; adresses à sortir des parenthèses ; pré-en-tête obligatoire ; 4 ou 2 destinataires à confirmer ; collision possible avec la lettre du mois le 05/11.
---
