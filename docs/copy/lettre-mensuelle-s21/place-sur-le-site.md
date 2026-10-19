# Place de la lettre sur le site : entrée de menu et bloc d'accueil (s21, 17/10/2026)

> Statut : PROPOSITION. Les deux textes NOUVEAUX (libellé de menu, bloc d'accueil) doivent passer la relecture à l'aveugle (règle d'or s18) avant intégration : `pack-relecture-place-sur-le-site.md`. Tout le reste est repris mot pour mot de `apps/web/src/config/textes/lettre-s21.ts` (déjà validé, ne repasse pas).
> Cadre : `docs/marrant/plan-integration-s21.md` point 3 (décision de Thomas, 17/10) ; `docs/ux/lettre-inscription-s21.md` ; `docs/copy/ton-alex.md`.
> [Framework : sans objet pour le menu (étiquette de navigation) ; bloc d'accueil : PAS, version minimale, sans promesse au-delà du fait.] [Conscience : Problem-Aware faible, visiteur qui a fini la page sans acheter.]

## 0. Synthèse

| Sujet | Recommandation |
|---|---|
| Libellé de menu | **« La lettre du mois »** (même mot que le pied de page), lien simple, dernier de la liste, après « Blog » |
| Emplacement accueil | Section propre **entre `<PremiumCta />` (offre + FAQ) et `<UpcomingFeatures />`** |
| Forme du bloc d'accueil | **Un lien vers `/lettre`, pas de formulaire** |
| Texte du bloc | Titre validé « Une vanne décryptée, chaque mois » + phrase validée + « Gratuit, sans compte. » + lien **« Voir la lettre → »** |
| Texte nouveau réel | Le libellé de menu et le lien « Voir la lettre → » (le reste est réutilisé) |

## 1. Rappel : ce que la spec UX disait, et ce qui change

La spec UX (§1.4, §1.5) écartait l'accueil (« deux blocs Premium déjà empilés ») et l'en-tête (« le bouton Commencer vient d'y arriver »). La décision de Thomas du 17/10 (plan s21, point 3) les rouvre, avec une contrainte : **le bouton Premium reste l'action principale partout**. On garde donc les raisons de la spec comme garde-fous de conception :
- aucune entrée de la lettre ne ressemble à un bouton (pas de violet plein, pas de badge « Nouveau », pas de point de notification) ;
- aucun texte n'oppose la lettre à Premium (« pas prêt ? ») ;
- pas de champ e-mail ni de case sur l'accueil (voir §3) : l'accueil ne porte qu'un lien ;
- la lettre arrive après les blocs Premium dans l'ordre de la page (ordre d'engagement décroissant de la spec §1.2).

## 2. Libellé de l'entrée du menu

Contexte code (`components/layout/header.tsx`) : `navItems` = Accueil, Vannes, Conseils, Vidéos, Parcours, Blog (+ « Carnet » pour Premium). Le même tableau alimente la barre ordinateur (≥ 1024 px) et le menu burger mobile. Libellés d'un ou deux mots, sans article. Le pied de page dit déjà « La lettre du mois ».

| # | Libellé | Pour | Contre |
|---|---|---|---|
| **V1** | **La lettre du mois** | Identique au pied de page (un seul nom pour une seule chose). « du mois » dit le rythme sans chiffre ni date. Clair pour Yanis qui ne sait pas encore ce qu'est « la lettre ». | 17 caractères : le plus long de la barre ordinateur. |
| V2 | La lettre | Court, tient mieux dans la barre. | Nu, sans rythme : « lettre » seul peut se lire « courrier », « contact » ou « lettre de motivation » à côté de « Blog ». Diffère du pied de page. |
| V3 | La vanne du mois | Parle le langage du site. | Fausse piste : on y cherche une vanne (la page « vanne du jour » existe), alors que la page propose de recevoir un e-mail. Promet un contenu consultable que la page ne montre pas avant le premier numéro. Rejeté. |

**Recommandation : V1 « La lettre du mois ».**

Règles d'intégration (à passer à @fullstack et @design) :
1. **Position** : dernier élément de la liste, après « Blog » (barre ordinateur et menu mobile, avant le filet `<hr>` et les boutons « Commencer » / « Connexion »). Pour Premium, après « Blog » aussi (après « Carnet »). Ne déplace aucun des 6 onglets existants.
2. **Style** : exactement celui des autres onglets (`text-text-secondary`, actif en `text-accent-link` quand le chemin est `/lettre`). Pas de badge, pas de couleur d'accent.
3. **Jamais dans la barre du haut du mobile** : seulement dans le burger (la place est pour « Commencer », audit conversion s20).
4. **Largeur ordinateur : à mesurer, pas à supposer.** Mon estimation (non mesurée) : la barre à 1024 px est déjà proche de la limite avec le logo, la recherche et les deux boutons. Si l'entrée provoque un débordement ou un retour à la ligne entre 1024 et 1279 px, la solution est de **l'afficher seulement dès `xl` (1280 px) dans la barre ordinateur** (elle reste dans le burger mobile et dans le pied de page), et **pas** de raccourcir le libellé ni de déplacer « Commencer ». @design tranche sur captures.
5. **Même interrupteur que le formulaire** : entrée de menu, bloc d'accueil et lien de pied de page suivent `LETTRE_OUVERTE`. Fermé = aucun des trois ne s'affiche (on n'annonce rien qui n'existe pas).
6. **Abonné Premium connecté** : je recommande de ne pas afficher l'entrée (spec §6.3 : il aura la lettre hebdomadaire ; la mensuelle ne lui est pas envoyée en double). Décision à confirmer par @fullstack avec Thomas ; sans effet sur le texte.
7. **Mesure** (suggestion à @data-analyst, sans changer la spec) : ajouter `menu` et `accueil` comme valeurs de `emplacement` des événements `lettre-*` ; le clic sur l'entrée de menu et sur le lien de l'accueil peut être compté sous `lettre-lien-clic` (`emplacement`).

## 3. Bloc discret sur la page d'accueil

### 3.1 Où le placer

Ordre actuel de `app/(dashboard)/page.tsx` : Hero, Contenu du jour, FeatureCards, « Tu te reconnais ? » (+ AutresParcours), Derniers articles, **HomeCta** (Premium), **PremiumCta** (offre + FAQ), **UpcomingFeatures** (« Prochainement »).

**Recommandation : nouvelle section entre `PremiumCta` et `UpcomingFeatures`.**

Pourquoi :
1. **Spec UX §1.2 (ordre d'engagement décroissant)** : Premium d'abord, lettre discrète ensuite. Placée avant `HomeCta`, la lettre offrirait une sortie gratuite juste avant l'offre : c'est la fuite que la spec interdit sur les pages d'achat.
2. **Elle attrape le bon visiteur** : celui qui a lu l'offre et la FAQ et ne veut pas acheter maintenant. C'est exactement le rôle que la spec donne à la lettre (« la seule sortie utile pour celui qui ne veut pas acheter maintenant »). Les objections ont déjà été traitées par la FAQ au-dessus.
3. **Elle sépare ce qui existe de ce qui est à venir** : `UpcomingFeatures` annonce des fonctions futures (dont des messages quotidiens par WhatsApp). La lettre, elle, existe : la coller à ces promesses la rendrait floue ; la mettre avant garde la frontière nette.
4. **Aucune concurrence visuelle avec un bouton** : section sans carte, sans fond, filet en haut, titre de niveau `h2` discret (taille de « Derniers articles », pas des grands titres de l'accueil), lien texte.
5. **Cohérence avec la décision 6 de l'audit (deux blocs Premium empilés)** : on n'ajoute pas un troisième appel à l'action fort ; la lettre est un lien texte.

Écartés : après « Derniers articles » (avant les blocs Premium : concurrence), dans le hero (action principale = Premium), après `UpcomingFeatures` (collée au pied de page, qui porte déjà le lien : doublon visuel).

### 3.2 Lien ou formulaire d'une ligne

**Recommandation : un lien vers `/lettre`, pas de formulaire.**
- Le formulaire validé n'est pas « une ligne » : il porte la case de consentement (longue, texte juridique exact) et la mention sous le bouton (responsable, Confidentialité). Sur l'accueil, cela donne un bloc de 6 à 8 lignes qui n'est plus discret et qui concurrence les blocs Premium (charge cognitive, spec §9.3).
- Un seul point d'inscription à l'accueil = pas de quatrième montage à tester (`emplacement` aurait un 4e cas, états d'erreur, drapeau d'appareil, 429...). `/lettre` existe déjà, noindex, avec le formulaire et, dès l'envoi du numéro 1, le dernier numéro en aperçu.
- Coût assumé : un clic de plus. Le bénéfice de la fin d'article (97 % de sorties, volume) et du quiz (intention haute) reste porté par le formulaire direct ; l'accueil est un chemin de rattrapage.
- Si Thomas préfère le formulaire en ligne : montage `emplacement="accueil"` du composant existant avec les textes validés (aucun texte nouveau, rien à relire), au prix de la hauteur du bloc.

### 3.3 Le texte (3 variantes)

Tout est vrai du produit tel que listé : gratuit, sans compte, par e-mail, une vanne décryptée, un exercice « À toi de jouer », une fois par mois. Aucune date, aucun chiffre, aucune mention d'une autre lettre.

**V1 : RECOMMANDÉE (textes validés réutilisés)**
> **Titre (h2)** : Une vanne décryptée, chaque mois
> **Phrase** : Tu la reçois par e-mail, avec un exercice pour t'entraîner. Gratuit, sans compte.
> **Lien** : Voir la lettre →

Pourquoi : le titre et la phrase sont ceux du formulaire, validés à l'aveugle ; le visiteur retrouve exactement la même formule sur `/lettre` (H1 identique) : zéro rupture entre le clic et la page. « Gratuit, sans compte. » est la réassurance validée, elle lève d'emblée la confusion avec l'abonnement Premium. « Voir » (et non « Recevoir ») dit honnêtement qu'on arrive sur une page, pas qu'on s'inscrit au clic.

**V2 : plus explicite, un peu plus long**
> **Titre (h2)** : Une vanne décryptée, chaque mois
> **Phrase** : Chaque mois, une vanne arrive dans ta boîte mail avec ce qui la fait marcher et un exercice pour t'entraîner. Gratuit, sans compte.
> **Lien** : Recevoir la lettre →

Limites : la phrase redit « chaque mois » (déjà dans le titre) ; « Recevoir la lettre » laisse croire que le clic suffit à s'inscrire alors qu'il faut encore e-mail et case.

**V3 : entrée par le besoin, ton d'Alex**
> **Titre (h2)** : Pas le temps de passer tous les jours ?
> **Phrase** : Une fois par mois, une vanne décryptée arrive dans ta boîte mail, avec un exercice pour t'entraîner. Gratuit, sans compte.
> **Lien** : Voir la lettre →

Limites : la question parle de fréquence de visite avant de dire ce qu'on reçoit ; le titre diffère du H1 de `/lettre` ; léger risque de lire « manque de temps » comme une pression.

**Duel de relecture : V1 (reco) contre V3 (2e meilleure).** V2 est écartée (redondance, promesse de clic).

### 3.4 Intégration (pour @fullstack, sans coder ici)
- Nouveau petit composant serveur (motif de `DerniersArticles`) : `<section aria-labelledby="lettre-accueil">`, `border-t border-border`, `py-8 md:py-10`, contenu centré `max-w-xl`, `h2` à la taille de « Derniers articles » (`text-xl md:text-2xl`), phrase en `text-sm text-text-secondary`, lien en `text-accent-link` souligné au survol, cible tactile 44 px (`min-h-[44px]`), flèche `→` hors de l'ancre de lecture d'écran si besoin (`aria-hidden`).
- Textes : à ajouter dans `config/textes/lettre-s21.ts` (clé `accueil` + `menu`), mêmes règles : espaces insécables via `insecables()`, zéro tiret cadratin (test existant).
- Masqué quand `LETTRE_OUVERTE` est faux et quand l'utilisateur est Premium (comme `PremiumCta` / `HomeCta`).
- Le bloc ne porte ni `data-blog-cta` ni attribut de la mesure du lot 1.
- JSON-LD FAQ de l'accueil : intouché ; ce `h2` n'est pas une question.

## 4. Objections traitées
| Objection du visiteur | Où |
|---|---|
| « C'est un abonnement déguisé ? » | « Gratuit, sans compte. » dans le bloc ; « la lettre » jamais « abonnement » ni « newsletter » |
| « Combien de mails ? » | « chaque mois » (titre) |
| « Qu'est-ce que je reçois ? » | « une vanne décryptée » + « un exercice pour t'entraîner » |
| « Ça cache de la pub ? » | Traitée dans la case de `/lettre` (« parfois une mention de Premium »), pas promise absente ici |

## 5. Contrôles faits
- Zéro tiret cadratin dans les textes proposés.
- Zéro chiffre ni date ; aucune promesse au-delà de « une vanne décryptée par mois, gratuit, sans compte » (l'exercice est un contenu validé du numéro).
- Zéro témoignage, aucun concurrent nommé, aucune vanne nouvelle (donc rien à valider côté humour).
- Humour : aucun ajouté. « Pas de vanne plutôt qu'une vanne moyenne » (ton d'Alex).

---
**Handoff → @orchestrator (puis relecture à l'aveugle, puis @fullstack et @design)**
- Fichiers produits : `/home/user/Marrant/docs/copy/lettre-mensuelle-s21/place-sur-le-site.md`, `/home/user/Marrant/docs/copy/lettre-mensuelle-s21/pack-relecture-place-sur-le-site.md`
- Décisions : menu « La lettre du mois » (dernier onglet, mesure de largeur à 1024-1279 px par @design) ; accueil = lien (pas de formulaire) entre `PremiumCta` et `UpcomingFeatures`, textes validés réutilisés + lien « Voir la lettre → »
- Points d'attention : même interrupteur `LETTRE_OUVERTE` pour menu, accueil et pied de page ; masquer pour Premium (à confirmer) ; deux textes nouveaux seulement à faire relire
---
