# Étalons du chemin visiteur vers Premium (s15, 05/10/2026)

> **Statut : à valider par Thomas AVANT toute réécriture du reste** (P0 s8). Rien n'a été modifié dans `src/`.
> Cadre : `docs/product/suppression-compte-gratuit-s15.md` §2 et §3.3 ; charte `docs/copy/charte-refonte-copy-s11.md` ; prix `docs/founder-preferences.md` (2,99 €/mois, 24,99 €/an, TTC). Aucun chiffre nouveau : les prix viennent de `config/premium.ts` (dynamiques dans le code).
> Garde-fous appliqués à toutes les propositions : tutoiement, zéro tiret cadratin, zéro mention IA, zéro concurrent, aucun mot « gratuit » ni « essai » pour décrire un compte ou un accès (il n'existe plus de palier ni d'essai), aucune promesse de ce qui est déjà public (« réservé », « débloquer le contenu du jour », « 10 vannes » comme avantage), aucune fonction qui n'existe pas. « Gratuit » n'est conservé que là où il est vrai : « Voir les vannes gratuites » (hero `:77`) et la lecture libre.
> Le texte « 1 500+ membres bossent leur humour. Rejoins-les. » (hero `:43`) et les prix ne sont pas touchés.

---

## Étalon 1 : CTA d'entrée (hero et bloc d'accueil)

**Textes actuels**
- Hero : `hero-section.tsx:70` bouton « Créer mon compte gratuit » ; `:72` note « Puis 2,99 €/mois pour tout débloquer, sans engagement » ; `:77` lien « Voir les vannes gratuites » (vrai, inchangé).
- Accueil : `home-cta.tsx:36` bouton « Créer mon compte gratuit » ; `:38` note identique (colonne étroite `max-w-[16rem]`, 3 lignes max) ; titre `:24` et paragraphe `:27` (déjà au prix) inchangés.
- Contexte : bouton `primary lg` pleine largeur en mobile, note `text-sm` grise juste dessous, lien discret ensuite. Le bouton mène à `/register` (« étape 1 sur 2 », étalon 2), puis Stripe s'ouvre. La formule annuelle n'est pas citée ici : elle n'apparaît que si `annualAvailable` côté serveur.

**Propositions** (bouton ≤ 8 mots ; note hero / note accueil courte)

| | Angle | Bouton | Note hero | Note accueil (≤ 45 car.) |
|---|---|---|---|---|
| 1.1 | Le prix d'abord | Commencer à 2,99 €/mois | Compte puis paiement sécurisé, sans engagement. | Sans engagement, annulable à tout moment. |
| 1.2 | La valeur d'abord | Accéder aux parcours complets | 2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre. | 2,99 €/mois, sans engagement. |
| 1.3 | Le geste, à la première personne | Je passe à l'accès complet | 2,99 €/mois, sans engagement. Tu crées ton compte, puis tu paies, c'est tout. | 2,99 €/mois, annulable à tout moment. |

Vérités : parcours complets, listes entières, favoris et carnet mensuel sont bien dans Premium (`premium-benefits.tsx:34-58`) ; « première étape reste libre » est vrai (lecture publique, spec §1) et formulé comme un fait, pas comme un cadeau lié au compte ; « annulable à tout moment » est déjà affiché sur `/abonnement`.

**Recommandation : 1.2.** Le bouton nomme ce que Thomas veut vendre (le parcours, pas un compte), le prix reste visible juste dessous comme avant, et la note rappelle que la lecture libre existe : cohérent avec « produit qui s'apprend, pas qui se vend ». Risque à connaître : 1.1 est le plus littéral (même libellé que `/abonnement`), à préférer si Thomas veut zéro surprise au clic.

---

## Étalon 2 : `/register` devenu « étape 1 sur 2 : ton compte »

**Textes actuels**
- `register/page.tsx:153` titre « Crée ton compte, ta première vanne t'attend » (faux : plus de « première vanne offerte » liée au compte) ; `:246` bouton « Créer mon compte » (état chargement « On prépare ton compte… », à garder) ; `:258` « S'inscrire avec Google » ; `:265-268` « Déjà un compte ? Connecte-toi » ; `register/layout.tsx:5-6` meta « Crée ton compte sur deviens-marrant.fr et commence à progresser en humour dès 2,99 €/mois. »
- Contexte : carte centrée `max-w-md`, logo, puis titre `text-xl`. À ajouter : une petite ligne d'étape au-dessus du titre, une ligne de rappel formule + prix sous le titre, une note `text-xs` sous les boutons. La formule vient de `?plan=` (mensuel par défaut, annuel si choisi) ; le paiement s'ouvre ensuite tout seul (`auto=1`, spec §2.3).

**Propositions** (étape / titre / rappel formule / bouton / note sous les boutons)

| | Étape | Titre | Rappel mensuel | Bouton | Note |
|---|---|---|---|---|---|
| 2.1 | Étape 1 sur 2 | Ton compte | Accès complet, 2,99 €/mois, annulable à tout moment. | Créer mon compte | Étape 2 : le paiement sécurisé, juste après. |
| 2.2 | Étape 1 sur 2 : ton compte | Crée ton compte, le paiement suit | Tu as choisi l'accès complet : 2,99 €/mois, sans engagement. | Créer mon compte, puis payer | Paiement sécurisé par Stripe. |
| 2.3 | Étape 1 sur 2 | Un compte pour suivre tes parcours | Accès complet à 2,99 €/mois, annulable quand tu veux. | Créer mon compte et continuer | Ensuite, tu règles ton abonnement en toute sécurité. |

Rappel annuel (même gabarit, si `plan=annual`) : « Accès complet, 24,99 €/an (soit 2,08 € par mois), annulable à tout moment. » (libellés de `config/premium.ts:36-38`). Meta recommandée avec la reco : « Crée ton compte pour activer l'accès complet : parcours, listes et carnet, dès 2,99 €/mois. » (meta noindex, `layout.tsx:5-6`).

Vérités : « suivre tes parcours » (2.3) est vrai pour un abonné (XP, validation, progression sont Premium, spec §1.1) ; « le paiement suit » est vrai une fois `auto=1` livré (L3), à ne mettre en ligne qu'avec lui. Si l'e-mail existe déjà (409) : « Cet e-mail a déjà un compte. Connecte-toi pour reprendre ton abonnement. » à valider avec le reste, hors étalon.

**Recommandation : 2.1.** Le plus court, il dit exactement « étape 1 sur 2 » comme dans la spec, annonce la suite sans la dramatiser et garde le bouton historique (« Créer mon compte ») que les utilisateurs et la mesure connaissent. 2.2 est plus explicite sur l'argent (bonne option si Thomas craint la surprise du paiement), 2.3 plus chaleureux mais moins littéral.

---

## Étalon 3 : CTA de fin d'article (défaut + cas dédié « couple »)

**Textes actuels**
- Défaut : `article-cta.tsx:27` titre « Maintenant, reste à le dire à voix haute » (gardé) ; `:28-29` texte « Des exercices concrets, des parcours étape par étape et des XP pour voir le chemin parcouru. Parce qu'un article lu finit par s'oublier, alors qu'un réflexe entraîné reste. » (reste vrai pour un abonné : XP et progression sont Premium, gardé) ; `:30` bouton « Essaie gratuitement » ; `:31` note « Compte gratuit : 10 vannes, 3 conseils, 3 vidéos, contenu du jour. Sans carte. » ; `:89-93` second bouton « Tout débloquer à 2,99 €/mois ».
- Cas couple : `blog-cta.ts:46` titre « Tu as les vannes. Et quand l'autre te les renvoie ? » (gardé) ; `:47` texte « Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Répartie : … » (faux, déjà public) ; `:48` bouton « Créer mon compte gratuit » ; `:49` note « Gratuit, sans carte. Les vannes de cette page restent en accès libre, compte ou pas. ».
- Contexte : bloc carte centré sous l'article, titre `text-xl`, texte, boutons empilés en mobile, note `text-xs`. Cible : un seul bouton principal vers `/abonnement` + un lien secondaire vers l'étape 1 d'un parcours (spec §2.6). Les 12 CTA de `blog-cta.ts` se déclinent ensuite sur le modèle retenu : on garde le titre propre à l'article, on change texte, bouton et note.

**Propositions pour le défaut** (titre et texte conservés ; on change bouton, note, lien secondaire)

| | Angle | Bouton | Note | Lien secondaire |
|---|---|---|---|---|
| 3.1 | Direct | Passer à l'accès complet | 2,99 €/mois, sans engagement. Cet article reste en lecture libre. | Lire la première étape d'un parcours |
| 3.2 | Curieux, sans pression | Voir ce que contient l'accès complet | 2,99 €/mois, sans engagement, annulable à tout moment. | Lire d'abord l'étape 1 |
| 3.3 | Le geste | Je m'entraîne pour 2,99 €/mois | Sans engagement. Tu peux t'arrêter quand tu veux. | Lire la première étape d'un parcours |

**Propositions pour le cas « couple »** (titre gardé ; texte, bouton, note, lien)

| | Texte | Bouton | Note | Lien secondaire |
|---|---|---|---|---|
| 3.1c | Les parcours complets, dont Répartie : de quoi renvoyer la balle quand l'autre te répond du tac au tac. | Travailler ma répartie | 2,99 €/mois, sans engagement. Les vannes de cette page restent en accès libre. | Lire l'étape 1 de Répartie |
| 3.2c | Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape. | Commencer le parcours Répartie | Accès complet à 2,99 €/mois, sans engagement. La première étape se lit sans compte. | Lire l'étape 1 de Répartie |
| 3.3c | Une vanne se prépare, une réplique s'entraîne : le parcours Répartie est fait pour ça, étape après étape. | Entraîner ma répartie | 2,99 €/mois, annulable à tout moment. Les vannes de cette page restent en accès libre. | Lire l'étape 1 de Répartie |

Vérités : « Répartie » est un des 3 parcours de `PREMIUM_PARCOURS` ; la lecture de l'étape 1 et des vannes de l'article est publique ; aucun chiffre ajouté (les durées ne sont pas citées) ; plus aucun « gratuit », « sans carte » ni « compte ». Les autres variantes de cas (cadeau, gamer, vœux…) gardent leur fin de phrase actuelle (« de quoi … »), qui est du copy d'article et reste juste.

**Recommandation : 3.1 pour le défaut, 3.2c pour le cas dédié.** Pour le trafic froid, 3.1 dit clairement ce qui se passe au clic et rassure sur la lecture libre ; sur « couple », 3.2c nomme le parcours qui répond à la situation de l'article et donne la porte d'entrée sans payer (étape 1), ce qui est la bonne politesse pour un lecteur venu chercher une vanne.

---

## Étalon 4 : bloc « fait partie de l'accès complet » (contenu verrouillé)

**Textes actuels**
- Vanne : `how-to-apply-gate.tsx:34-39` « L'exercice d'application (consigne + exemple concret à réutiliser) est réservé aux membres. Crée ton compte gratuit pour le débloquer. » (petite boîte en pointillés, `text-sm`, une ligne de lien) ; `vannes/[slug]/page.tsx:278-283` bouton « Créer un compte gratuit ».
- Conseil : `conseils/[slug]/page.tsx:199-209` « L'exercice complet pour appliquer cette technique dès aujourd'hui t'attend avec ton compte gratuit. » + bouton « Créer un compte gratuit » (+ « Voir tous les conseils »).
- Vidéo : `videos/[slug]/page.tsx:218-230` label « Analyse pédagogique complète », « Les points clés à retenir et l'exercice pour appliquer la technique sont accessibles gratuitement quand tu crées ton compte. Tu récupères aussi ton contenu quotidien et la première étape de chaque parcours. » + « Créer un compte gratuit ».
- Étape de parcours : `parcours-detail.tsx:797-803` « Crée ton compte gratuit pour valider l'étape » (étape 1, visiteur).
- Contexte : encadré dans la fiche, après le contenu public ; bouton principal vers `/abonnement` avec `returnTo` (retour à la fiche). Interdit : « réservé », « verrouillé », « seulement » : les 10 premières vannes, 3 premiers conseils et 3 premières vidéos montrent déjà leur exercice dans la liste ; « fait partie de » reste vrai partout.

**Propositions** (gabarit : texte court pour la vanne / texte pour conseil et vidéo / bouton)

| | Angle | Vanne (≤ 110 car. + lien) | Conseil | Vidéo | Bouton |
|---|---|---|---|---|---|
| 4.1 | Factuel | L'exercice (consigne + exemple à réutiliser) fait partie de l'accès complet. | L'exercice pour appliquer cette technique fait partie de l'accès complet. | Les points clés et l'exercice de cette vidéo font partie de l'accès complet. | Voir l'accès complet |
| 4.2 | Prix visible | L'exercice est dans l'accès complet, à 2,99 €/mois. | L'exercice complet est dans l'accès complet : 2,99 €/mois, sans engagement. | L'analyse complète et l'exercice sont dans l'accès complet : 2,99 €/mois, sans engagement. | Débloquer l'exercice |
| 4.3 | Invitation | Envie de le travailler ? L'accès complet contient l'exercice. | Si tu veux t'entraîner sur cette technique, l'accès complet contient l'exercice. | Si tu veux t'entraîner sur cette technique, l'accès complet contient les points clés et l'exercice. | Découvrir l'accès complet |

Déclinaison étape 1 d'un parcours (visiteur) avec 4.1 : « Valider l'étape fait partie de l'accès complet. » + bouton « Voir l'accès complet ». Dans la fiche vidéo, la phrase « Tu récupères aussi ton contenu quotidien… » disparaît (déjà public). À ne pas écrire : « essaie », « gratuit », « débloque tout » sans objet.

**Recommandation : 4.1.** Court, vrai pour toutes les fiches (y compris les 10/3/3 déjà visibles en liste), neutre en prix (le prix vit sur `/abonnement`, pas dans une fiche SEO) et sans pression, ce qui colle à « on offre, on n'impose ». 4.2 convertit peut-être mieux mais fait de chaque fiche une page de vente.

---

## Étalon 5 : brouillon d'e-mail aux 11 comptes gratuits existants

**Texte actuel :** aucun envoi existant pour ce cas. Référence de voix : e-mail de bienvenue `docs/strategy/ceo-voice-unified.md` §0 (étalon 2) : phrases construites, une idée utile, « rien ne presse », signature « L'Équipe Deviens Marrant ». **Statut : BROUILLON, jamais d'envoi direct** (règle commune 10). Expéditeur et lien de connexion : [À VÉRIFIER avec @fullstack : lien `/login?callbackUrl=/abonnement` pour un compte non connecté].
Faits garantis par la spec (§1.2, défaut A) : aucun compte supprimé, XP, progression, likes et votes conservés en base ; le suivi (XP, série, étapes validées) et le vote sur les nouveautés passent côté accès complet ; la lecture libre est inchangée. Aucune promesse sur l'avenir (pas de « on ne t'écrira plus »), aucune remise inventée.

**5.1 Court et factuel.** Objet : *Ce qui change pour ton compte Deviens Marrant*

> Salut [Prénom],
>
> On arrête le compte gratuit : le site se lit désormais sans compte, comme tu le fais déjà, et le compte sert à passer à l'accès complet.
>
> Ton compte reste en place avec tout ce qu'il contient : on n'a rien supprimé et on n'a touché à aucune de tes données. La seule différence, c'est que suivre ta progression (XP, série, étapes validées) et voter pour les prochaines nouveautés font maintenant partie de l'accès complet, à 2,99 € par mois ou 24,99 € par an, sans engagement.
>
> Si ça te dit, tu peux l'activer ici : [lien]. Sinon, il n'y a rien à faire de ton côté.
>
> À bientôt,
> L'Équipe Deviens Marrant

**5.2 Chaleureux, sans urgence.** Objet : *Ton compte Deviens Marrant reste là*

> Salut [Prénom],
>
> Petite nouvelle, sans urgence : on ne propose plus de compte gratuit. Le site reste ouvert à tous sans inscription, et le compte sert maintenant à activer l'accès complet.
>
> Pour toi, concrètement, rien ne bouge : ton compte et tes données restent exactement où elles sont. Seuls le suivi de ta progression (XP, série, étapes validées) et le vote sur les prochaines nouveautés passent côté accès complet. [SI xp > 0 : Les {{xp}} XP que tu as gagnés sont conservés et reprennent là où tu les as laissés.]
>
> Si l'envie te reprend de travailler les parcours en entier, l'accès complet est à 2,99 € par mois ou 24,99 € par an, annulable quand tu veux : [lien]. Et si tu préfères en rester au site ouvert, c'est très bien aussi.
>
> Bonne journée,
> L'Équipe Deviens Marrant

**5.3 Invitation à reprendre (segment `xp > 0` uniquement).** Objet : *Ta progression t'attend sur Deviens Marrant*

> Salut [Prénom],
>
> Tu avais commencé à gagner des XP sur Deviens Marrant : {{xp}} aujourd'hui, et ils sont conservés tels quels. On a arrêté le compte gratuit, mais ton compte et tes données n'ont pas bougé.
>
> Si tu veux reprendre où tu en étais, l'accès complet rouvre le suivi de ta progression et les parcours en entier : 2,99 € par mois ou 24,99 € par an, sans engagement. [lien]
>
> Et sinon, le site reste lisible sans compte, comme avant.
>
> L'Équipe Deviens Marrant

Vérités : « conservés » et « reprennent là où tu les as laissés » reposent sur le défaut A (D1, GO Thomas requis) ; 5.3 n'est vrai que pour un compte avec `xp > 0` (donnée réelle, jamais en masse). Option à confirmer par Thomas, non incluse : « Pour supprimer ton compte, réponds à ce message » [À CONFIRMER : la CGU §7 promet une suppression, mais `/profil` n'en propose pas].

**Recommandation : 5.2 pour les 11, avec la phrase `xp > 0` en conditionnel.** C'est la seule qui dit « rien ne bouge » avec précision, laisse la porte ouverte dans les deux sens (« c'est très bien aussi ») et reste dans le ton du pote qui offre sans imposer ; 5.1 est plus sec, 5.3 ne couvre qu'une partie des comptes.

---

## Handoff

**Handoff → @orchestrator (puis Thomas pour validation, ensuite @copywriter pour la réécriture du reste)**
- Fichier produit : `/home/user/Marrant/docs/copy/etalons-chemin-premium-s15.md` (5 étalons, 3 propositions chacun, reco ; aucun fichier de `src/` modifié).
- Recos : 1.2 (parcours d'abord, prix en note) ; 2.1 (« Étape 1 sur 2 : Ton compte ») ; 3.1 défaut et 3.2c couple ; 4.1 (« fait partie de l'accès complet », sans prix) ; 5.2 (e-mail chaleureux, ligne XP conditionnelle).
- Décisions à trancher par Thomas : un choix par étalon (ou « je suis tes recos ») ; D1 défaut A, qui conditionne l'e-mail ; option de suppression de compte dans l'e-mail.
- Points d'attention : framework et conscience par étalon (1 : AIDA/Solution-Aware ; 2 : réassurance de tunnel/Product-Aware ; 3 : PAS court/Problem-Aware ; 4 : transparence d'offre/Solution-Aware ; 5 : annonce de changement + offre/Most-Aware). Objections traitées : « je vais payer sans voir » (étape 1 en lecture libre, vannes de l'article libres), « abonnement piégeux » (sans engagement, annulable), « on me cache le prix » (prix présent partout). Références marché : aucune recherche web (la charte et les étalons maison font foi ; aucun concurrent cité). Mots-clés SEO : `docs/seo/keyword-map.md` non consulté, aucun H1 ou H2 d'article touché. Promesses conditionnées au code à livrer : « le paiement suit » (étalon 2, `auto=1`), CTA fin d'article vers `/abonnement` (étalon 3), « ta progression conservée » (étalon 5, défaut A). Après validation : mesure du diff réel obligatoire (P0 s11), intouchables slugs, H2, FAQ, liens, chiffres, prix.
