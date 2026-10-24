# Annexe : boutons restés hors chantier, tour 3 (ne jamais transmettre aux relecteurs)

> Pack : `pack-boutons-tour3.md` (4 éléments, 4 textes finaux). Critère : l'envie de payer, rien de faux. Zéro tiret cadratin. Aucun commit. Aucun code modifié. Base de comparaison : `tour2/pack-boutons-tour2.md`. Lignes de code citées : worktree `.claude/worktrees/agent-a6072b0ac19da7774/apps/web/src` (les textes du tour 2 n'y sont pas encore branchés, la colonne « avant » renvoie donc au texte du tour 2, pas au code actuel).

## 1. Ce qui change, élément par élément (texte tour 2 vers texte tour 3)

| Élément | Emplacement | Tour 2 | Tour 3 |
|---|---|---|---|
| 1 paragraphe, 1re phrase seulement | `components/carnet/carnet-page.tsx`, `CarnetPaywall` | « Boulot, soirée, famille, couple : ces situations sont rangées de la moins tendue à la plus tendue, donc tu peux commencer doux et monter d'un cran. » | « Elles vont de la moins tendue à la plus tendue, alors tu commences tranquille et tu montes d'un cran. » |
| 2 ligne | `components/home/premium-cta.tsx`, `<p>` avant le `<Button>` de la branche `authenticated` | « Ton compte est déjà fait : on passe direct au paiement, sécurisé par Stripe. » | « Tu as déjà ton compte : ce bouton t'emmène direct au paiement, sécurisé par Stripe. » |
| 3 pastille | `components/premium/abonnement-view.tsx` (`pageBadge`) | « Plus que le paiement » | « Un prix, tout ouvert » |
| 3 titre | idem (`pageTitle`, branche connectée) | « Ton compte est là. Les {PARCOURS_COUNT} parcours aussi. » | « Les {PARCOURS_COUNT} parcours en entier, d'un coup. » |
| 3 paragraphe | idem (`pageSubtitle`, branche connectée) | « Une fois abonné, tout s'ouvre d'un coup : chaque parcours en entier, et dans chaque étape un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Une étape par semaine est le rythme conseillé, mais rien n'est bloqué. » | « Chaque étape prend {DUREE_ETAPES} : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz. Une étape par semaine est le rythme conseillé, mais rien n'est bloqué. Le carnet de situations du mois est inclus, et un nouveau arrive chaque mois. » |
| 4 phrase d'offre | `components/profil/abonnement-card.tsx` (`etat === "aucun"`) | « Premium, c'est tout le catalogue au lieu de {FREE_CATALOGUE_LIMITS_LABEL}, avec tes favoris, le filtre par catégorie et les {PARCOURS_COUNT} parcours en entier. » | « Premium ouvre les {PARCOURS_COUNT} parcours en entier et le carnet du mois. Tu as aussi tes favoris et tout le catalogue, au lieu de {FREE_CATALOGUE_LIMITS_LABEL}. » |

Inchangés (identiques au tour 2) : E1 titre, bouton « Voir les {N} autres répliques · {PREMIUM_PRICE_LABEL} », 2e phrase du paragraphe et ligne de prix ; E2 bouton ; E3 bouton ; E4 ligne XP, ligne discrète « Résiliable quand tu veux, depuis ce profil » (correction orchestrateur du 18/10 conservée), bouton.

Mesure du diff (règle P0 s11) : E1 = 1 phrase sur les 3 du bloc (titre et 2e phrase identiques mot pour mot), E2 = 1 ligne sur 1, E3 = pastille, titre et paragraphe (bouton identique), E4 = 1 phrase sur 1. Rien d'autre n'a été touché : faits communs, fiches de situation et consigne identiques au tour 2 (seuls les textes à noter diffèrent).

## 2. Choix et raisons

- **E1.** Retrait de l'inventaire de contextes et du « donc », piste r3 reprise telle quelle, avec « tranquille » (retenu par deux relecteurs, « doux » accrochait). « Elles » renvoie aux répliques du titre, juste au-dessus : pas d'ambiguïté. Effet de bord utile : la phrase ne cite plus de contexte, donc la **garde de contextes du tour 2 (§2, « Boulot, soirée, famille, couple ») tombe**. Plus rien à vérifier à la mise en ligne d'un carnet.
- **E2.** Formule r2 conservée telle quelle (r3 quasi identique) : le bouton est nommé, le « on » flou disparaît, « Tu as déjà ton compte » est vrai pour un jamais-abonné comme pour un ancien abonné.
- **E3, pastille.** « Un prix, tout ouvert » retenue. « Il ne reste que le paiement » ouvre encore la page sur le mot « paiement », ce que les trois relecteurs ont refusé, et presse un visiteur qui vient vérifier que ça vaut le prix. « Ton compte est prêt » est faux pour un ancien abonné. « Un prix, tout ouvert » est vrai pour les deux profils (un seul prix ouvre les 5 parcours, tout est ouvert d'un coup) et dit ce qu'on gagne.
- **E3, titre et paragraphe.** Titre r2. Le « d'un coup » vit dans le titre seulement, donc le paragraphe ne le répète plus (« tout s'ouvre d'un coup » retiré). « Une fois abonné » n'est plus dit dans le texte : le titre + la pastille + le bouton suffisent, et le titre ne prétend plus que les parcours sont déjà là. Durée par étape : « 15 à 20 minutes » (r1), via la même constante que la carte d'accueil. Carnet du mois ajouté en une phrase courte (r3), en fin de paragraphe pour ne pas alourdir le cœur du message.
- **E4.** Parcours en premier (le bouton dit « parcours »), carnet du mois ensuite, puis favoris et catalogue avec le contraste 10/3/3. Le filtre par catégorie est sorti de la phrase (r2 : il n'ajoute pas d'envie) ; il reste dans les 4 avantages affichés sur le site, donc rien de promis en moins, rien de faux en plus. Deux phrases courtes au lieu d'une phrase à quatre compléments. Phrase r3 en parenthèse écartée : la parenthèse alourdit une lecture mobile.
- **Libellé partagé.** Bouton « Ouvrir les 5 parcours · 2,99 €/mois » inchangé sur E2, E3, E4 : un seul mot pour un seul geste.

## 3. Variables (jamais en dur)

- **{N}** (E1, titre et bouton) : `view.apercus.length`, comme au tour 2.
- **{PARCOURS_COUNT}** (E3 titre, E4 phrase) : `config/premium.ts`. Si le compte tombe à 1 ou 0, suivre le repli de `libelleOuvrirParcours` (« tous les parcours »), ne jamais écrire « 1 parcours en entier ».
- **{DUREE_ETAPES}** (E3 paragraphe) : constante `DUREE_ETAPES` de `config/textes/cta-articles-accueil.ts` l.54 (min et max de `timePerWeek` des parcours publiés), qui rend aujourd'hui « 15 à 20 minutes ». Si les durées convergent, elle rend « 15 minutes » seulement : la phrase reste juste. L'importer plutôt que d'écrire « 15 à 20 » en dur.
- **{FREE_CATALOGUE_LIMITS_LABEL}** (E4) : `config/premium.ts`, « 10 vannes, 3 conseils, 3 vidéos ». Le pack écrit « 10 vannes, 3 conseils et 3 vidéos » : formater avec « et » avant le dernier élément, sans changer le sens.
- **« 5 vannes, 2 vidéos »** (E3) : fait vrai de l'étape, à valider avec @fullstack si une constante existe (point inchangé depuis le tour 2).
- **« le carnet du mois » / « un nouveau arrive chaque mois »** (E3, E4) : vrai tant que Premium inclut le carnet mensuel (liste des faits communs). Aucun nom de mois, rien à brancher.

## 4. Points d'attention pour @fullstack

- **Bouton du profil (E4), débordement à vérifier.** Libellé : « Ouvrir les 5 parcours · 2,99 €/mois » = 35 caractères avec l'espace et le point médian, dans le petit bouton (taille `sm`, couleur secondaire). Je n'ai pas pu le mesurer en rendu : à 375 px il tient probablement sur une ligne, à 320 px il risque de passer sur deux lignes. Le libellé étant partagé avec E2 et E3, ne pas le raccourcir sans accord. Si ça déborde : appliquer au bouton `h-auto min-h-9 whitespace-normal px-3 py-1.5 text-center [text-wrap:balance]` (deux lignes équilibrées, aucun mot coupé). Repli de dernier recours, à faire arbitrer par Thomas : « Les 5 parcours · 2,99 €/mois » (28 caractères), uniquement sur le profil. Les relecteurs du tour 2 ont proposé « Tout ouvrir » : écarté, le mot « parcours » est ce que le visiteur a lu en premier dans la phrase.
- **E3 pastille « Un prix, tout ouvert »** : texte court (21 caractères), tient sur une ligne en pastille. Elle est affichée seulement connecté (`!resiliation`), comme avant.
- **Titre E3 et paragraphe** : le titre « Les 5 parcours en entier, d'un coup. » porte la promesse, la pastille et le bouton la complètent. Ne pas rajouter « Une fois abonné » devant, le texte est volontairement allégé.
- **Tests à mettre à jour au branchement** : les assertions listées au tour 2 (carnet-page.test.tsx, lot2-libelles-s21.test.ts, tests « Active mon accès ») plus toute assertion sur « Plus que le paiement », « Ton compte est là », « Ton compte est déjà fait », « Boulot, soirée, famille, couple », « Premium, c'est tout le catalogue ». Ces chaînes n'existent pas encore dans le worktree (Grep vide) : elles apparaîtront avec le branchement du tour 2.
- **Doublon d'information (inchangé)** : `config/textes/cta-pages.ts` l.383 contient « Ton compte est prêt : il ne reste que le paiement. » (CTA d'article). Même défaut pour un ancien abonné, hors périmètre, à arbitrer par Thomas. Le tour 3 écarte « Ton compte est prêt » et « Il ne reste que le paiement » pour E3 : cohérent de s'en souvenir si ce texte est rouvert.
- **Modale `premium-modal.tsx` l.111 (« Active mon accès »)** : toujours hors pack, même libellé `libelleOuvrirParcours` à y brancher.
- **Annuel sur la carte d'accueil** : la carte affiche « Ou 24,99 €/an » mais le bouton plein ne lance que le mensuel (structure, hors texte, non traité).
- **Déploiement** : toute modification est à consigner dans `REPLIT_ACTIONS.md` ; pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, plus `npx tsc --noEmit` et Jest si des tests changent.

## 5. Défauts relevés au tour 2 et réponse

| Défaut relevé (3 relecteurs) | Réponse dans le texte final |
|---|---|
| E1 : inventaire de contextes déjà visible dans la liste ; « donc » = mode d'emploi | Inventaire et « donc » retirés, remplacés par « alors tu commences tranquille » |
| E2 : « Ton compte est déjà fait » administratif ; « on » flou | « Tu as déjà ton compte : ce bouton t'emmène direct au paiement… » |
| E3 : pastille ambiguë et pressante ; page ouverte sur « paiement » | Pastille « Un prix, tout ouvert » ; plus aucun « paiement » dans le haut de page |
| E3 : titre sur l'état du compte, pas sur ce qu'on gagne ; « les parcours sont là » alors qu'ils sont fermés | Titre « Les 5 parcours en entier, d'un coup. » |
| E3 : pas de durée, pas de carnet | « Chaque étape prend 15 à 20 minutes » et une phrase sur le carnet du mois |
| E4 : fiche technique, parcours cités en dernier, carnet absent | Parcours en premier, carnet du mois, deux phrases courtes |
| E4 : bouton long pour un petit bouton | Signalé ci-dessus (35 caractères), solution CSS prête, libellé partagé conservé |

## 6. Vérifications

- Zéro tiret cadratin dans le pack et l'annexe (le point médian « · » est celui du libellé de bouton existant).
- Aucun nom de concurrent, aucun nom de mois, aucun témoignage, aucun chiffre hors des faits vrais (15 à 20 minutes, 5 vannes, 2 vidéos, 10/3/3, 2,99 €, 14 jours).
- Aucune promesse de résultat, pas de « en un clic », pas de « sans engagement ».
- Pack sans indication d'origine : aucune mention de relecteur, de tour précédent ou de piste.
