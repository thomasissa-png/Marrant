# Étalons du premier écran de /abonnement (3 angles, à calibrer avec Thomas)

> Auteur : @copywriter. Date : 19/10/2026. Statut : PROPOSITION, rien n'est branché (règle P0 s8 : étalons d'abord, puis duel de trajet, grille `docs/ux/trajet-conversion-s21.md` §11).
> Correction de cap de Thomas (19/10) : Premium = TOUT Deviens Marrant ouvert (vannes, conseils, vidéos, 5 parcours, carnet mensuel, favoris). Les parcours ne sont plus le héros : ils sont un élément parmi d'autres.
> Zéro tiret cadratin. Tutoiement. Aucune promesse de résultat. « 1 500+ » et prix intacts (la ligne « 1 500+ inscrits bossent leur humour. » reste sous le sous-titre, hors étalons).

## 0. Faits utilisés et leurs sources

| Fait | Source |
|---|---|
| Gratuit, listes : 10 vannes, 3 conseils, 3 vidéos (les fiches restent lisibles en accès direct) | `FREE_JOKE_LIMIT`, `FREE_TIP_LIMIT`, `FREE_VIDEO_LIMIT`, `config/premium.ts` |
| Gratuit : étape 1 de chaque parcours, 1 situation offerte du carnet par mois, la lettre une fois par mois | brief de Thomas, `ficheOfferte`, `CARNET_FREE_FICHES` |
| Premium : tout le catalogue, les 5 parcours en entier (Machine à Café, Répartie, Confiance, Storytelling, Boulot), un nouveau carnet par mois, favoris, **la lettre chaque semaine** | brief ; `PREMIUM_PARCOURS`, `BOULOT_PUBLIE` et `STORYTELLING_PUBLIE` à `true` (project-context, s18/s19) |
| **Lettre** : gratuite une fois par mois pour tous, hebdomadaire (jeudi) pour les abonnés Premium (décision de Thomas du 17/10, `docs/founder-preferences.md`, rappelée le 19/10 : « Merci de ne pas oublier »). Facultative pour l'abonné, jamais d'offre commerciale (avis @legal L2, `docs/legal/lettre-et-questions-s21.md`). | message du coordinateur du 19/10, recoupé dans les deux documents |
| **CONDITION DE MISE EN LIGNE** : l'envoi hebdomadaire n'est pas encore construit. Les lignes « lettre » ci-dessous ne vont en production QU'AVEC l'envoi réel. Pas de contenu de la lettre promis au-delà de « une lettre chaque semaine ». Ne jamais écrire « automatique ». « Jeudi » et « 4 par mois » sont volontairement absents (un mois compte 4 ou 5 jeudis). | consigne du coordinateur |
| Arrondi : dizaine inférieure + « + » (`roundDownMarketing`, `formatCount`, `lib/marketing-round.ts`) | code |

**Chiffres de catalogue : NON relus aujourd'hui** `[À LIRE : /api/content-stats]`. Je n'ai ni shell ni accès réseau à la production. Dernière mesure en prod (29/09, project-context) : ~602 vannes, 400 conseils, 89 vidéos, soit **600+ / 400+ / 80+** après arrondi. Le catalogue ne fait que grandir, donc ces planchers restent vrais, mais le site doit afficher la valeur du jour via `formatCount`, jamais un nombre en dur. Les étalons ci-dessous n'utilisent le nombre de catalogue que dans une variante marquée `{N}`. « 5 » (parcours) = `PARCOURS_COUNT`, « dixième » = `FREE_JOKE_LIMIT`, « 10, 3 et 3 » = les trois constantes.

## 1. Étalon A : « Tout est ouvert » (exhaustivité)

[Framework : PAS inversé, nommer le tout puis lever la limite] [Conscience : Problem-Aware, le visiteur vient de buter sur un mur ou un cadenas]

- **Titre** (5 mots) : Premium ouvre tout Deviens Marrant
- **Sous-titre** (14 mots) : Les listes ne s'arrêtent plus à la dixième vanne, les parcours vont au bout.
- **Avantages** (4 lignes, l'exhaustivité justifie la quatrième) :
  1. Tout le catalogue : vannes, conseils, vidéos
  2. Les 5 parcours, de la première à la dernière étape
  3. Un nouveau carnet de répartie chaque mois
  4. Une lettre chaque semaine, au lieu d'une par mois
  - Les favoris sortent des 4 lignes (avantage le plus mineur) et vivent dans le tableau : `Favoris | Non | Oui`.
  - Variante ligne 1 chiffrée `{N}` : « Tout le catalogue : 600+ vannes, 400+ conseils, 80+ vidéos » (valeurs du jour à lire dans l'API).
- **Bouton** (3 mots + prix) : S'abonner · 2,99 €/mois (annuel : S'abonner · 24,99 €/an)
  - Duel possible : « S'abonner et tout ouvrir · 2,99 €/mois » (38 caractères, ligne unique à 375 px `[À MESURER]`). Je ne le recommande pas ici : le titre dit déjà « tout ouvre ».
- **Ligne de tableau la plus forte** : `Vannes, conseils, vidéos | Gratuit : 10, 3 et 3 | Premium : Tout le catalogue`, légende sous le tableau : « Dans les listes. »
- **Ligne lettre** (à ajouter au tableau dans les trois étalons) : `La lettre | 1 par mois | Chaque semaine`
- **Pourquoi ça marche** : l'écho du clic (« Premium ») est dans le titre, le verbe « ouvre » reprend celui des portes (« Ouvrir… »), et le sous-titre rend le « tout » concret avec l'obstacle que le visiteur vient de toucher (la 11e vanne). Aucun élément n'est promu au-dessus des autres.
- **Risque** : « tout » reste un mot abstrait sans la liste. La liste est dans les avantages, juste dessous, au premier écran.

## 2. Étalon B : le bénéfice vécu (la réplique, la soirée), offre explicite

[Framework : AIDA, attention par la scène, désir par les outils, offre nommée dans le sous-titre] [Conscience : Problem-Aware, persona Yanis et Sophie]

- **Kicker** : Premium
- **Titre** (8 mots) : Arrive en soirée les poches pleines de répliques
- **Sous-titre** (13 mots) : Avec Premium, tout le catalogue, les 5 parcours et le carnet sont ouverts.
- **Avantages** (3 lignes) :
  1. Vannes à ressortir, conseils à tester, vidéos à décrypter
  2. 5 parcours pour t'entraîner avant la soirée
  3. Un carnet neuf chaque mois, une lettre chaque semaine
  - La ligne 3 fait 52 caractères : une ligne à 375 px `[À MESURER]`. Si Thomas veut les favoris en avantage : 4e ligne « Tes favoris sous la main ».
  - La ligne 1 reprend les verbes déjà en ligne sur les fiches (« Essayer ce conseil », « Décrypter cette vidéo »). Elle fait 58 caractères : retour à la ligne probable à 375 px `[À MESURER]`.
- **Bouton** : S'abonner · 2,99 €/mois
- **Ligne de tableau la plus forte** : `Carnet de répartie | Gratuit : 1 situation offerte | Premium : Toutes, et un carnet neuf chaque mois` (cellule Premium à resserrer en « Toutes, un neuf par mois »). Ligne lettre ajoutée : `La lettre | 1 par mois | Chaque semaine`.
- **Pourquoi ça marche** : seule version qui part du moment vécu (la soirée) avant de décrire. « Les poches pleines » est une image, pas une promesse : on y met du matériel, on ne promet pas l'effet. Le sous-titre rend l'offre explicite sans retomber dans les parcours.
- **Risque** : le titre seul ne dit pas l'objet (d'où le kicker « Premium » et le sous-titre qui nomme tout). Image un peu plus audacieuse que les deux autres : à passer à l'aveugle avec les verdicts instables connus sur l'humour (relecture dans le trajet, pas isolée).

## 3. Étalon C : la comparaison Gratuit / Premium

[Framework : contraste avant / après, Hormozi allégé] [Conscience : Solution-Aware, le visiteur sait que Premium existe et se demande ce qu'il y gagne]

- **Titre** (7 mots) : Gratuit pour goûter, Premium pour tout ouvrir
- **Sous-titre** (11 mots) : Tu goûtes d'abord sans payer, et Premium ouvre tout le reste.
- **Avantages** (4 lignes, chacune dit « au-delà du gratuit » ; la quatrième est indispensable, c'est le contraste le plus chiffrable) :
  1. Vannes, conseils, vidéos : la liste complète
  2. Les parcours après l'étape 1, jusqu'au bout
  3. Le carnet entier, et un nouveau chaque mois
  4. Une lettre chaque semaine, contre une par mois
- **Bouton** (3 mots + prix) : S'abonner à Premium · 2,99 €/mois (annuel : S'abonner à Premium · 24,99 €/an)
  - Meilleur que « Passer Premium » (jargon, jugé par @ux) : même verbe d'achat que Stripe, et l'objet est nommé en écho du titre.
- **Ligne de tableau la plus forte** : `La lettre | Gratuit : 1 par mois | Premium : Chaque semaine`. Le contraste se lit en un coup d'œil, sans mot abstrait, et il est vrai dès que l'envoi hebdomadaire existe. Seconde ligne : `Parcours | Étape 1 de chacun | Les 5, en entier`.
- **Rappel d'honnêteté** : la ligne lettre ne dit rien du contenu (pas de « exclusivités », pas de « conseils en avant-première », rien d'inventé) et ne sort qu'avec l'envoi réel.
- **Pourquoi ça marche** : le visiteur qui arrive d'un mur (10 vannes vues) comprend en 3 secondes ce qui est ouvert et ce qui ne l'est pas, ce qui répond au critère 1 de la grille (« ce qui est bloqué en gratuit »). Le gratuit est positionné comme une vraie découverte, utile pour un persona au budget serré (Yanis).
- **Risque** : le tableau juste dessous répète la même opposition (règle « un fait, une fois par page » assouplie à deux fois par la trajet-conversion §9). Si C gagne, le H2 du tableau doit changer de forme pour ne pas répéter le titre.

## 4. Récapitulatif

| | A : tout est ouvert | B : la soirée | C : gratuit / Premium |
|---|---|---|---|
| Titre | Premium ouvre tout Deviens Marrant | Arrive en soirée les poches pleines de répliques | Gratuit pour goûter, Premium pour tout ouvrir |
| Mots du titre | 5 | 8 | 7 |
| Sous-titre | 14 mots | 13 mots | 11 mots |
| Bouton | S'abonner · 2,99 €/mois | S'abonner · 2,99 €/mois | S'abonner à Premium · 2,99 €/mois |
| Dit « Premium » dans le titre | oui | non (kicker) | oui |
| Dit ce qui est bloqué | par le sous-titre | non | oui, dans le titre |
| Lettre hebdo | ligne 4 des avantages | fin de la ligne 3 | ligne 4 + ligne de tableau la plus forte |
| Part de la scène vécue | non | oui | non |

## 5. Relecture phrase par phrase contre les faits

| Phrase | Fait | Verdict |
|---|---|---|
| « Premium ouvre tout Deviens Marrant » | Premium = tout ouvert (brief de Thomas) | Vrai. « Ta question à l'équipe » reste fermé et n'est cité nulle part ; la lettre hebdomadaire est citée et conditionnée à son envoi réel |
| « Les listes ne s'arrêtent plus à la dixième vanne » | `FREE_JOKE_LIMIT = 10`, liste défilante | Vrai pour les listes. Les fiches en accès direct restent lisibles : on ne dit pas « bloquées » |
| « …les parcours vont au bout » | Étape 1 gratuite, 5 parcours en entier en Premium | Vrai |
| « Les 5 parcours, de la première à la dernière étape » | idem, `PARCOURS_COUNT` = 5 | Vrai ; valeur dynamique |
| « Un nouveau carnet de répartie chaque mois » | Premium : nouveau carnet mensuel | Vrai |
| « Tes favoris sous la main » | Favoris Premium | Vrai |
| « Arrive en soirée les poches pleines de répliques » | Image sur le matériel (vannes, conseils, carnet) | Aucune promesse de résultat. Vrai au sens littéral : on repart avec du matériel |
| « Vannes à ressortir, conseils à tester, vidéos à décrypter » | Catalogue Premium complet | Vrai |
| « 5 parcours pour t'entraîner avant la soirée » | 5 parcours Premium | Vrai ; « avant la soirée » est un usage, pas un résultat |
| « Gratuit pour goûter, Premium pour tout ouvrir » | Gratuit : 10, 3, 3, étape 1, 1 situation, lettre | Vrai |
| « Tu goûtes d'abord sans payer » | Étape 1 sans compte, listes partielles | Vrai |
| « Les parcours après l'étape 1, jusqu'au bout » | `LAST_FREE_PARCOURS_STEP = 1` | Vrai |
| « Le carnet entier, et un nouveau chaque mois » | 1 situation offerte par mois, le reste Premium | Vrai |
| « 10, 3 et 3 » (tableau) | Trois constantes | Vrai pour les listes ; légende « Dans les listes » obligatoire |
| « Une lettre chaque semaine, au lieu d'une par mois » / « La lettre : 1 par mois, chaque semaine » | Décision du 17/10 : 1 par mois en gratuit, hebdomadaire en Premium | Vrai SEULEMENT quand l'envoi hebdomadaire est construit : la page ne sort qu'avec lui. Ni « automatique », ni jour, ni contenu promis |
| « Un carnet neuf chaque mois, une lettre chaque semaine » | idem | idem |
| Boutons « S'abonner » | Verbe de Stripe, aucune mention légale dans le bouton | Conforme |

Contrôles : zéro tiret cadratin (relu), zéro concurrent, zéro témoignage, zéro chiffre de catalogue en dur, prix et « 1 500+ » inchangés, titres ≤ 10 mots, sous-titres ≤ 15 mots (une phrase), boutons ≤ 7 mots.

## 6. Recommandation unique : A

**Étalon A, avec le bouton « S'abonner · 2,99 €/mois ».** Raisons :
1. C'est la correction de Thomas mise en titre : « tout » est ouvert, aucun élément n'est promu au-dessus des autres, et le sous-titre rend ce « tout » concret avec l'obstacle que le visiteur vient de toucher.
2. Le tableau Gratuit / Premium (écran 2) fait déjà le travail de C. Mettre la comparaison dans le titre la ferait dire deux fois. Le titre doit apporter ce que le tableau ne dit pas : l'ensemble.
3. A passe le test d'écho (« Premium » dans le titre) pour les 10 portes vers /abonnement, y compris les murs de vannes, de conseils et de vidéos, ce que B ne fait pas sans son kicker.
4. B est le plus désirable mais le plus fragile (image, verdicts instables sur l'humour) et le moins clair sur l'objet. À garder comme **kicker contextuel** ou comme titre de l'annonce / réseaux, pas comme titre de page.

Si Thomas préfère l'envie à la clarté : B. Si le duel de trajet T2 (mur de vannes) donne C devant, c'est que le visiteur de mur veut d'abord savoir ce qui change.

## 7. Points ouverts

- **Mise en ligne conditionnée** : aucune ligne « lettre » n'est publiée avant l'envoi hebdomadaire réel. Si la page devait sortir avant, retirer l'avantage lettre (ligne 4 de A et C, fin de la ligne 3 de B) et la ligne du tableau, sans autre retouche. Prévoir que l'abonné peut se désinscrire de l'hebdo (facultatif) : ne jamais le qualifier d'« automatique ».
- Chiffres du catalogue à relire dans `/api/content-stats` avant toute variante chiffrée.
- Cellule « 10, 3 et 3 » : lisible seulement avec le libellé de ligne dans l'ordre vannes, conseils, vidéos ; sinon écrire « 10 vannes, 3 + 3 » à la main sur deux lignes `[À MESURER 375 px]`.
- Ligne 4 du tableau du plan UX (10, 3, 3) : vérifier que la légende « Dans les listes » est bien affichée (fiches lisibles en accès direct).
- Duel à jouer dans le trajet (T1 et T2), pas sur le texte isolé.

**Handoff → @orchestrator** (puis @ux, @reviewer pour le duel)
- Fichier produit : `/home/user/Marrant/.claude/worktrees/agent-a6072b0ac19da7774/docs/copy/conversion-s21/etalons-abonnement.md`.
- Décisions : 3 angles distincts, reco A + « S'abonner · 2,99 €/mois », B en kicker ou texte social, C en réserve de duel. Lettre hebdomadaire Premium intégrée aux 3 étalons (avantage + ligne de tableau), conditionnée à l'envoi réel.
- Points d'attention : chiffres de catalogue non relus (pas de shell), `docs/copy/cta-s21/concision/` absent du worktree (règles lues dans `/home/user/Marrant/docs/copy/cta-s21/concision/inventaire-et-etalons.md` §4), aucune référence marché consultée (tunnel d'abonnement déjà cadré par le plan UX).
