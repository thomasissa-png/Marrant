# Annexe : boutons restants et carnet de novembre (hors relecture : ne pas transmettre aux relecteurs aveugles)

Fichiers : `pack-boutons-restants.md` + `cles-boutons-restants.md` (livrable 1), `pack-carnet-novembre.md` + `carnet-2026-11.json` (livrable 2). Décision de Thomas du 18/10 : « Ok pour tes reco, faisons propre » (`docs/founder-preferences.md`, dernières lignes). Critère : l'envie de payer, sans rien de faux, sans promesse de résultat chiffrée ni garantie. Zéro tiret cadratin (vérifié par recherche sur le dossier : 0 occurrence), pas de commit, rien placé dans `apps/`.

## 0. Statut honnête

- **Aucun relecteur aveugle n'a été lancé** par moi : je n'ai pas d'outil de sous-agent dans cette session. Les deux packs sont prêts à être envoyés ; **rien de ce dossier n'est validé à 10/10**. Règle d'or P0 s18 : rien ne se branche tant que la relecture n'a pas eu lieu et que le niveau n'est pas atteint.
- Les 15 fiches de novembre sont une **première passe de ma main**, sans la boucle d'octobre (≈ 180 candidates, 2 critiques à l'aveugle, départage). Je les estime inégales (voir §7). Le pack de 4 fiches sert de sondage : **si 2 fiches sur 4 ou plus passent sous 9 à l'un des deux critères, relancer la boucle complète sur les 15** (réserves au §8).
- Mesures manuelles (pas de shell) : longueurs de boutons comptées à la main ; longueur de l'`accroche` contrôlée par recherche (73 caractères comptés, motif à 74 caractères sans correspondance).

## 1. Livrable 1 : ce qui change, ce qui reste

| Élément | Avant | Après (A, ma reco) | Intouchables |
|---|---|---|---|
| 1 Carnet, bas de page | Titre « Débloque tout le carnet » ; « La première situation est offerte. Les autres, et un nouveau carnet chaque mois, se débloquent avec l'abonnement à 2,99 €/mois, résiliable en ligne. » ; bouton « Commencer à 2,99 €/mois » | Titre « Et si tu avais la réplique avant la pique ? » ; paragraphe de la méthode ; bouton « Voir les autres répliques · 2,99 €/mois » ; ligne de prix et garantie | prix, 4 avantages (composant commun), 14 jours sur le premier paiement, mois du carnet lu dans la donnée |
| 2 Accueil, compte connecté | Bouton « Active mon accès · 2,99 €/mois » | Ligne « Ton compte est prêt : il ne reste que le paiement. » + « Ouvrir les 5 parcours · 2,99 €/mois » | tout le reste de la carte validée (B4+B5), « On t'emmène au paiement… » |
| 3 /abonnement, compte connecté | H1 « Active ton accès pour commencer » ; « Ton compte est prêt. Encore un clic et les 5 parcours sont à toi en entier, … » ; bouton « Active mon accès · {prix} » | H1 « Ton compte est prêt. Les 5 parcours aussi. » ; « Il ne reste que le paiement. Ensuite, tout est ouvert … » ; bouton « Ouvrir les 5 parcours · {prix} » | pastille « Plus qu'une étape », carte de l'offre, réassurance, « Paiement sécurisé par Stripe », avantages |

Taux de changement : les libellés visés sont remplacés à 100 % par construction (c'est la demande) ; le reste des blocs n'est pas touché. Sur l'élément 3, j'ai ajouté le H1 et la phrase d'appui au périmètre, parce que « Encore un clic » est **inexact** (clic, puis page Stripe et saisie de la carte) et que le H1 faisait écho à l'ancien bouton. Ils se retirent indépendamment du bouton si Thomas veut le strict minimum.

**Point que Thomas peut trancher** (qa-cta-s21 m1) : un compte connecté doit-il voir les mêmes mots que le visiteur ? Mon A le dit oui (« Ouvrir les 5 parcours »), avec une ligne qui explique que le paiement est direct.

## 2. Mapping fichier → texte à remplacer (pour @fullstack, après validation)

| Fichier (worktree `apps/web/src/`) | Lignes | À remplacer |
|---|---|---|
| `components/carnet/carnet-page.tsx` | 98-109 (`CarnetPaywall`) | `<h3>`, `<p>` et libellé du `<Link>` ; passer le mois (`deMoisSeul(view.mois)`) en prop ; classes du bouton : ajouter `h-auto min-h-12 whitespace-normal px-4 py-2 text-center [text-wrap:balance]` ; ajouter la ligne de prix sous le bouton |
| `components/home/premium-cta.tsx` | 113-122 | libellé du `Button` connecté ; ajouter la ligne au-dessus ; texte à ranger dans `config/textes/cta-articles-accueil.ts` (constante), pas en dur |
| `components/premium/abonnement-view.tsx` | 161-166 (`pageTitle`, `pageSubtitle`) et 287-297 (bouton) | H1, phrase, libellé ; `Button` : classes de retour à la ligne si B gagne |
| `components/profil/abonnement-card.tsx` | 135-149 | **Hors demande, même libellé** : voir §3 |
| `config/textes/` | nouveaux exports | un seul endroit pour les 3 libellés, comme `cta-pages.ts` |

Tests qui citent les anciennes chaînes (grep du 18/10, à mettre à jour avec les nouvelles) : `__tests__/feature/carnet-page.test.tsx:54` ; `__tests__/feature/abonnement-page.test.tsx` (l.168, 203, 209, 236, 245, 260, 275, 325, 368) ; `__tests__/feature/abonnement-auto-checkout-s15.test.tsx` (84, 107) ; `__tests__/feature/corrections-s16-lot-f.test.tsx` (90, 100) ; `__tests__/feature/checkout-conflit-s16-lot-d.test.tsx` (58, 65) ; `__tests__/lib/checkout-mesure-s21.test.tsx:65` ; `__tests__/lib/checkout-mesure-fusion-s21.test.tsx` (62, 76) ; `__tests__/dashboard/profil-dashboard.test.tsx` (146, 154) ; `__tests__/lib/lot2-libelles-s21.test.ts:104-107` (test qui lit le code source et exige « Commencer à {PREMIUM_PRICE_LABEL} » et la chaîne du profil). Grep après branchement : `Débloque tout le carnet`, `Commencer à {PREMIUM_PRICE_LABEL}`, `Encore un clic et les`, `Active ton accès pour commencer`, `Active mon accès` ne doivent plus rester (sauf décision contraire pour le profil).

## 3. Troisième emplacement trouvé, hors demande

`components/profil/abonnement-card.tsx:147` affiche aussi « Active mon accès · 2,99 €/mois » (état « aucun », bouton secondaire) et la ligne l.138 « Passe Premium pour **débloquer** tout le catalogue, les filtres et les parcours complets. » : « Débloquer » est banni des libellés d'appel (`textes-finaux-valides.md`). Proposition **non relue à l'aveugle** : bouton = élément 2 A (« Ouvrir les 5 parcours · 2,99 €/mois ») ; ligne l.138 = « Ton compte est prêt : il ne reste que le paiement. Premium ouvre les 5 parcours en entier, le carnet du mois, tes favoris et les listes complètes. » (reprend les 4 avantages). À passer dans un tour de relecture avant de toucher le profil.

## 4. Faits à surveiller (conditions de vérité)

- « Un nouveau carnet arrive / s'ouvre chaque mois » : vrai tant qu'un JSON est déposé avant le 1er de chaque mois. **Seuls octobre et novembre existent.** [HYPOTHÈSE : décembre prêt avant le 01/12] : à lancer début novembre. Cette promesse figure déjà sur le site (avantage 2, encart B1).
- « Les 14 autres » vient de `view.apercus.length` ; mon A n'écrit pas ce chiffre dans le bouton (collision visuelle avec « 14 jours »).
- « Chaque fiche tient en une minute » reprend l'introduction du carnet.
- « Ouvrir le carnet d'octobre en entier » (B) : le mois vient de `deMoisSeul`. Si on affiche un carnet d'archive (`/carnet/2026-10` au mois de novembre), le texte doit nommer ce mois-là, pas le courant.
- Les comptes connectés sans abonnement : le bouton ouvre le paiement directement (`/api/stripe/checkout`). « Il ne reste que le paiement » est donc exact.
- Quirk existant, non touché : la fiche offerte s'affiche « Situation 1 · offerte » pour le visiteur, mais porte son rang réel pour l'abonné (le 15 en octobre, le 9 en novembre).

## 5. Livrable 2 : conformité au format de `2026-10.json`

| Contrôle | Résultat |
|---|---|
| Fichier | `docs/copy/cta-s21/complements/carnet-2026-11.json` (brouillon, hors `apps/`) ; cible après validation : `apps/web/src/data/carnet/2026-11.json` |
| Champs d'en-tête | `mois` « 2026-11 » (motif du schéma), `titre` « Carnet de novembre », `intro` identique à celle d'octobre, `fiches` |
| Nombre de fiches | 15 (comme octobre), ids `2026-11-01` à `2026-11-15` |
| Champs par fiche | `id`, `titre`, `contexte`, `situation`, `onTeDit`, `reponse`, `pourquoi`, `siTendu`, `exercice` ; la fiche offerte ajoute `offerte` et `accroche` (même ordre de clés qu'en octobre) |
| Fiches `offerte: true` | 1 (la 09), vérifié par recherche (17 occurrences = 15 `id` + `offerte` + `accroche`) |
| `accroche` | « Dîner entre amis, chez toi. Tu poses un plat fumant au milieu de la table » : 73 caractères (limite 110, `CARNET_ACCROCHE_MAX`). Encart rendu : « … au milieu de la table, et on te lance : « Attends, c'est toi qui as cuisiné ? » » |
| Chambrage | `onTeDit` « Attends, c'est toi qui as cuisiné ? » : taquinerie adressée au lecteur, contexte « amis » (règle de l'annexe du tour 4 §5) |
| Contextes | quotidien 1, soirée 2, famille 3, boulot 3, couple 2, amis 4 (octobre : mêmes six étiquettes) |
| Ordre | de la moins tendue (01, un inconnu à l'arrêt de bus) à la plus tendue (15, l'histoire coupée devant la table) |
| Dates citées | « Dimanche de Toussaint » : le 1er novembre 2026 est un dimanche ; « Fin novembre » ; « semaine de promotions » (27/11) ; aucune date en dur dans les répliques |
| Tirets cadratins, émojis | 0 |
| Humoristes cités, citations | 0 (rien à vérifier) |

Règles d'octobre, fiche par fiche : le rire tombe sur le lecteur dans les 15 (écharpe, pâtes, horaires, panier, groupe, sondage, grippe, histoire racontée…) ou sur la situation ; aucune réplique ne vise la personne en face, aucune remarque physique, aucune vanne blessante ; chaque `siTendu` est une sortie polie sans trait d'esprit ; chaque `exercice` est une consigne à voix haute sans réplique à compléter.

## 6. Tirage (fiche offerte et pack de relecture)

- **Choix de la fiche offerte** : la 09 « Le plat fait maison » (chambrage, contexte amis). Candidate écartée : la 15 « Celle que tu racontes toujours » (plus tendue, réplique plus fragile, 7 sur mon échelle). Position 09 parce que la taquinerie est de tension moyenne : ranger l'offerte en fin de carnet comme en octobre contredirait l'introduction (« de la moins tendue à la plus tendue »).
- **Les 3 autres fiches « au hasard »** : pas de générateur. Règle fixée **avant** de finir les textes : les 14 fiches non offertes, dans l'ordre des ids (indices 0 à 13) ; indice = code ASCII mod 14 des caractères 9, 10, 11 de l'identifiant de session (`c`=99→1, `j`=106→8, `6`=54→12). Fiches tirées : indice 1 = **02**, indice 8 = **10**, indice 12 = **14**. (Les fiches 02 et 04 ont été réécrites après ce tirage pour cause de redite, voir §9 : le tirage porte sur la position, pas sur le texte.)
- **Ordre de lecture dans le pack** : classement croissant du code ASCII des caractères 15 à 18 (`w`=119, `L`=76, `3`=51, `T`=84), attribués à : offerte (w), 02 (L), 10 (3), 14 (T). Résultat : fiche 1 = 10, fiche 2 = 02, fiche 3 = 14, fiche 4 = 09 (offerte). Les relecteurs ne savent pas laquelle est l'offerte avant la partie B.

## 7. Mon estimation par fiche (sur mon échelle, avant tout relecteur)

| Fiche | Mécanisme | Cible du rire | Mon estimation / risque |
|---|---|---|---|
| 01 soleil, horaires | personnification (le soleil obtient ses horaires) | toi, tes horaires | 7. Sujet « soleil » déjà en octobre (01) : angle différent |
| 02 au revoir | chiffre précis qui corrige « déjà » | toi | 8. Observation vraie |
| 03 écharpe | l'objet mieux traité que toi | toi | 7,5 |
| 04 mail | le mail devient un passant pressé, « retenu » à double sens | toi | 7,5 |
| 05 trois ans | « par quel chemin » | toi | 6,5. Proche d'une formule connue (« j'ai dit que je viendrais, pas quand ») |
| 06 thermostat | deux versions de toi (19 et 22 degrés) | toi | 7. Thème « thermostat » fréquent, réplique nouvelle |
| 07 Beaujolais | pas de vocabulaire, du courage | toi | 6,5. La plus faible avec 05 et 08 |
| 08 pâtes | fidélité aux pâtes | toi | 6,5 |
| 09 plat (offerte) | le talent comme rumeur | toi | 8 |
| 10 panier | les économies dans le panier | toi | 7. « Panier » déjà dans une vanne d'article (autre angle) |
| 11 objectifs | tiroir des résolutions de janvier | toi | 6,5 à 7. Réplique « risquée » devant un manager (la sortie polie la rattrape) |
| 12 groupe | réseau mauvais entre la tête et le pouce | toi | 7 |
| 13 sondage | délai crédible de la vie de bureau | toi, le sondage | 7 |
| 14 Noël | la grippe qu'on déplace | toi | 7 |
| 15 sixième tentative | l'histoire est un test | toi | 7 |

**Lecture** : aucune fiche n'est annoncée au niveau d'octobre (« Dis-moi que c'est la descente », « Certaines en recommandé »). Les plus sûres : 02, 09. À remplacer en priorité si la relecture les sanctionne : 05, 07, 08, 11.

## 8. Réserves (non relues, une par fiche, à utiliser si une fiche tombe)

01 : « Le soleil part à 17 h 30, sans pot de départ. Pour une fois, c'est lui qui s'en va avant moi. » · 02 : « Je ne pars pas, je fais mon tour d'adieux. Il dure en général plus longtemps que la soirée. » · 03 : « Si, elle est dans mon sac. Elle voyage mieux que moi. » · 04 : « Oui, et je lui réponds dès que j'ai trouvé comment dire « oui » en trois paragraphes. » · 05 : « Je suis venu avec trois ans de retard. C'est un cadeau : vous n'avez plus à m'attendre. » · 06 : « Je ne l'ai pas touché. Je l'ai encouragé. » · 07 : « Il est jeune. Il n'a pas encore d'opinion, moi non plus : on s'entend bien. » · 08, 09, 10, 12, 13, 15 : pas de réserve satisfaisante, à générer (vague 2) · 11 : « Je les ai. Ils sont dans le même dossier que ma motivation, je cherche le mot de passe. » · 14 : « Je viens. Mon urgence a accepté de passer en janvier. »

## 9. Dédoublonnage (recherche dans le dépôt le 18/10)

Recherche de chaînes caractéristiques dans `docs/`, `apps/web/src/data`, `apps/web/src/lib` (catalogue exporté, articles, parcours Boulot, social, lettre). **Retirées avant le pack** : la carte de départ avec « bonne continuation » (article « mot de départ », vannes de l'étape Boulot, plusieurs critiques à l'aveugle parlent de « décor connu » ou de « banal ») remplacée par le mail pressé ; « tu connais qui ici ? » avec le buffet (vanne SOIREES, article blog, critiques « trope introverti ») remplacée par le tour des au revoir. **Gardées avec angle différent** : panier (une vanne d'article joue sur un cadeau dans le panier), thermostat (tropes « père et thermostat », « plaid »), cuisine (« J'ai cuisiné pour dix invités. Huit sont venus. », pompiers), « il avait l'air pressé » (exemple d'un conseil, autre contexte), « Secret Santa » (écarté). **Non vérifié** : le catalogue vivant en base (je n'ai que des exports du dépôt), le planning social et les articles programmés lus en entier : `[À VÉRIFIER en base]` avant mise en ligne.

## 10. Mise en ligne et récurrent

- **Avant le 01/11 00:00 (heure de Paris)** : déposer le JSON dans `apps/web/src/data/carnet/` (chargement par `require.context`, rien à enregistrer). Sinon, dès le 1er, `getCarnetExtrait` renvoie `null` (le mois courant n'a pas de carnet) : l'encart B1 des articles et l'extrait de `/abonnement` disparaissent. Tests : `__tests__/lib/carnet*.test.ts*`, `carnet-offerte-s21.test.tsx`, `carnet-extrait-s21.test.tsx`. Documenter dans `REPLIT_ACTIONS.md` (déploiement), pas de migration.
- **Condition B1** : « La situation offerte ce mois-ci » est vraie car la scène montrée est la fiche `offerte` et un chambrage.
- **Automatisation du carnet (commandement 5)** : pipeline mensuel proposé, l'IA génère, le fondateur valide. J-21 : génération de ≈ 10 candidates par situation (schéma et règles ci-dessus, 15 situations de saison, 1 chambrage offert, contextes équilibrés) ; J-17 : dédoublonnage automatique contre catalogue, articles, planning social et mois précédents ; J-14 : 2 critiques à l'aveugle ; J-10 : départage ; J-7 : `accroche` ≤ 110 vérifiée par le schéma, pack de 4 fiches relu, validation de Thomas ; J-3 : dépôt du JSON et déploiement. Squelette de prompt : « Écris {N} situations de {mois}, de la moins tendue à la plus tendue, au format `docs/copy/cta-s21/complements/carnet-2026-11.json`. Réplique : chute qu'on ne voit pas venir, courte, observation vraie, rire sur le lecteur ou la situation, jamais sur la personne en face, aucune remarque physique, aucun humoriste cité, aucune citation inventée. `siTendu` = sortie polie sans trait d'esprit. `exercice` = consigne à voix haute, aucune réplique à compléter. Tutoiement, zéro tiret cadratin. Une fiche `offerte` : chambrage adressé au lecteur, `accroche` = « {contexte en demi-phrase}. {détail} », 110 caractères au plus. » Déclencheur : tâche planifiée le 10 de chaque mois pour le mois suivant (@fullstack), avec alerte à Thomas si le JSON n'est pas déposé à J-3.
