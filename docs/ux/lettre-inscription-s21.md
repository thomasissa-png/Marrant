# Lettre par e-mail : spécification UX du point d'inscription (s21, 17/10/2026)

> Statut : PRÉPARATION. Rien n'est codé ni déployé. Mise en ligne après le bilan du lot 1 (~10/11), et après les prérequis du §7.1.
> Sources lues : `docs/marrant/audit-conversion-s20.md` (lot 4, goulot d'exposition), `docs/copy/ton-alex.md`, `docs/founder-preferences.md`, code `api/newsletter/{route,confirm,unsubscribe}`, `lib/newsletter.ts`, migration `9_add_newsletter_subscriber`, `components/blog/{article-cta,blog-article-tracking}.tsx`, `components/quiz/viral-quiz.tsx`, `components/layout/footer.tsx`, `lib/{umami,umami-before-send}.ts`, `config/blog-cta.ts`.
> Décision de Thomas (17/10) : lettre GRATUITE mensuelle, adresse e-mail seule, sans compte ; lettre HEBDOMADAIRE pour les abonnés payants (format à définir plus tard).
> Cohérence avec les [CHOIX UTILISATEUR] : pas de compte gratuit (05/10) respecté (la lettre n'ouvre aucun compte) ; promesse d'une newsletter retirée le 01/10 « en attendant une newsletter mensuelle préparée » : on ne rouvre pas avant le premier numéro prêt ; contenu préparé à l'avance, jamais généré au fil de l'eau (01/10) ; « 1 500+ » intouché ; aucun compteur d'inscrits affiché.

## 0. Synthèse (à lire en 30 secondes)

| Sujet | Décision |
|---|---|
| Emplacements | **A. fin de chaque article** (sous le bloc de fin, jamais avant le bouton Premium) · **B. résultat du quiz d'humour** (sous la carte) · **C. pied de page : un lien « La lettre » vers une page `/lettre`** (pas de formulaire sitewide) |
| Écartés | Pop-up, bandeau collant, accueil, /abonnement, murs, en-tête mobile, fin d'étape 1 (reportée, voir §1.4) |
| Composant | `LettreInscription` : étiquette + champ + case de consentement + bouton secondaire, 1 ligne dès 640 px, empilé en dessous, 7 états |
| Libellé recommandé | **« Une vanne décryptée par mois »**, bouton **« Recevoir la lettre »** |
| Mesure | `lettre-vu`, `lettre-envoi`, `lettre-echec`, `lettre-confirmee` (+ la base reste la référence pour « confirmé ») |
| Prérequis bloquants | Premier numéro validé à l'aveugle + tâche d'envoi testée AVANT d'ouvrir le formulaire (promesse « une fois par mois » tenable) |

## 1. Emplacements (3 au total)

### 1.1 Les données qui décident (audit s20, 28 jours)

- Article « meilleures blagues drôles 2026 » : 397 entrées sur 683 visiteurs (58 %), 97 % de sorties, 0 clic sur l'appel de fin. Le visiteur trouve ses vannes puis repart : **la lettre est la seule sortie utile pour celui qui ne veut pas acheter maintenant**. 1 visiteur sur 6 qui arrive sur `/abonnement` clique vers le paiement : l'offre n'est pas le problème, l'exposition l'est.
- 66 % du trafic est mobile. Conséquence : spécification mobile d'abord (375 px).
- Aucun moyen de recontacter un non-acheteur (growth 1,5/10) : c'est le lot 4.
- Les parcours reçoivent environ 1 visite humaine par semaine (audit s17 : 23 visites en 90 jours) : mettre la lettre en fin d'étape 1 ne toucherait presque personne aujourd'hui.
- Volume faible (683 visiteurs/28 j) : mesure en avant/après sur 4 semaines, pas d'A/B.

### 1.2 Emplacement A : fin d'article (le gros volume)

- **Position exacte** : dans `blog/[slug]`, **immédiatement après** le bloc de fin unique (`aside[data-blog-bloc-fin]`, composant `ArticleCta`), jamais avant, jamais dans l'encart. Séparation : `mt-4`, filet `border-t border-border`, `pt-4`, **sans carte ni fond** (le bloc de fin est la carte ; la lettre est une ligne en dessous). Largeur = colonne de l'article.
- **Où dans la page selon l'article** : `BLOG_CTA_BY_SLUG` place le bloc de fin juste après le corps pour les 12 articles à forte frappe, en bas sinon. La lettre suit le bloc de fin où qu'il soit. Une seule occurrence par page. [À VÉRIFIER par @fullstack : ordre exact corps / bloc de fin / FAQ / articles liés dans `blog/[slug]/page.tsx`.]
- **Pourquoi** : c'est l'endroit où 97 % des visiteurs de l'article n°1 sortent, et l'ordre « étape 1 gratuite (contour) puis Premium (plein) puis lettre (discrète) » classe les trois actions par engagement décroissant. Qui ne veut pas acheter maintenant a une sortie utile au lieu de fermer l'onglet.
- **Public** : visiteur anonyme et compte FREE (e-mail pré-rempli depuis la session, modifiable). **Abonné Premium : le composant ne s'affiche pas** (il aura la hebdomadaire ; voir §6).
- **Ce qu'on NE fait pas** :
  - aucune lettre au milieu de l'article (les encarts `milieu-1` / `milieu-2` restent 100 % dédiés à Premium et aux parcours) ;
  - pas de pop-up, d'exit-intent, de bandeau collant, de volet qui glisse ;
  - pas de bouton violet plein (réservé à Premium) : bouton `secondary` neutre ;
  - pas de contenu de l'article masqué contre une adresse (les vannes restent en accès libre, ce que dit déjà la note du bloc de fin) ;
  - pas de texte qui oppose la lettre à Premium (« pas prêt ? ») : la lettre se présente seule, par sa valeur.
- **Isolation de la mesure du lot 1** : le bloc ne porte NI `data-blog-cta` NI `data-blog-cta-position` (sinon il fausserait `blog-cta-vu` / `blog-cta-clic`, dénominateurs du seuil « ≥ 3 % » du bilan du 10/11). Il porte `data-blog-zone="lettre"` pour que le lien « Confidentialité » ne soit pas compté comme une sortie ordinaire dans `blog-sortie-clic`.

### 1.3 Emplacement B : résultat du quiz d'humour

- **Position exacte** : `/quiz-humour`, composant `ViralQuiz`, **sous la `Card` du résultat** (hors carte), `mt-6`, largeur `max-w-lg` identique à la carte. Affiché aussi pour le visiteur qui revient (cas `showRetake`), placé entre la carte et le bouton « Refaire le quiz ».
- **Pourquoi** : le visiteur vient de répondre à 12 questions et de recevoir un profil (« Style Paul Mirabel » etc.) : intention la plus haute de tout le site hors paiement, et le partage du résultat est déjà une action sociale. La lettre prolonge la relation sans lui demander d'acheter.
- **Charge cognitive** : la carte contient déjà 3 actions principales (parcours conseillé, « Accéder aux parcours complets », partage). La lettre est donc placée **hors de la carte** et en 4e position visuelle, sans bordure d'accent, pour que le choix reste à 3. Aucune ligne dans la carte elle-même.
- **Ce qu'on NE fait pas** : pas de « débloque ton profil complet contre ton e-mail » (le résultat reste affiché sans condition, comme aujourd'hui) ; pas de formulaire AVANT le résultat (rupture de la promesse du quiz) ; pas de lettre pendant les 12 questions.
- **Volume** : nombre de `quiz-termine` sur 28 jours non lu dans les données que j'ai ouvertes. [À MESURER par @data-analyst avant d'attendre un volume.]

### 1.4 Emplacement C : pied de page, un LIEN vers `/lettre` (pas de formulaire)

- **Position exacte** : colonne « Produit » du pied de page, après « Quiz humour » et avant « Anatomie d'une vanne » (ordre des affinités) : libellé **« La lettre du mois »**. Cible : nouvelle page `/lettre`.
- **Pourquoi** : visible sur toutes les pages, mais ne coûte aucune ligne de formulaire ; donne un lien stable pour les bios, les e-mails et la page de confirmation. `/lettre` est aussi la page d'arrivée de la confirmation, de la désinscription et des liens invalides (remplace les redirections vers `/?newsletter=…`, dont je n'ai pas pu vérifier que l'accueil les affiche : [À VÉRIFIER]).
- **La page `/lettre`** (même composant, `emplacement="page"`) : H1 « Une vanne décryptée par mois », une phrase de valeur, le formulaire, puis le **dernier numéro envoyé en aperçu** dès qu'il existe (preuve réelle, rien d'inventé). `robots: noindex`, hors sitemap (94 pages indexées sur 414 : ne pas ajouter une page mince au crawl).
- **Pied de page** : la liste « Produit » passe de 10 à 11 liens (grille à 2 colonnes : une rangée de plus, 44 px). Cible tactile 44 px déjà en place (`min-h-[44px]`). @design vérifie l'équilibre avec la colonne « Légal ».
- **Ce qu'on NE fait pas** : pas de champ e-mail dans le pied de page (formulaire sitewide = 414 pages à tester, bruit pour presque aucun gain) ; pas de lien dans l'en-tête.

### 1.5 Écartés (avec la raison)

| Candidat | Raison |
|---|---|
| Fin d'étape 1 gratuite | Lot 3 (une seule action Premium à cet endroit) pas encore conçu, et environ 1 visite/semaine sur les parcours. À reconsidérer au bilan du lot 3 avec le même composant (`emplacement="etape-1"`). |
| Accueil | Deux blocs Premium déjà empilés (décision 6 de l'audit en attente) : ne pas ajouter un troisième appel. |
| `/abonnement`, `/register`, paiement | Pages d'achat : toute sortie parallèle est une fuite. |
| Murs `/vannes` et fiches | Lot 3 prévoit une « sortie douce » : le lien vers `/lettre` pourra y servir plus tard. Pas de formulaire dans un mur. |
| En-tête (mobile ou ordinateur) | Le bouton « Commencer » vient d'y arriver (lot 1) ; une seconde entrée l'affaiblirait. |
| Pop-up, bandeau collant, modale d'inscription | Refus de principe : Google pénalise les interstitiels mobiles, 66 % du trafic est mobile, et le site a déjà un coût de modale (s15 : 0 vue /register car tout en modale). |

## 2. Composant `LettreInscription`

Un seul composant client, trois montages (`emplacement` = `article` | `quiz` | `page`). Rendu dans le HTML serveur (leçon s15 : tout en modale = rien de mesurable). Texte dans un fichier unique `config/textes/lettre-s21.ts` (motif des autres `config/textes/*`).

### 2.1 Wireframe mobile d'abord (375 px, colonne de 343 px)

```
─────────────────────────────────────  filet border-t, mt-4, pt-4
Une vanne décryptée par mois           titre : 16 px / 600, text-primary (<p>, pas de H2 : plan d'article intouché)
Par e-mail, une fois par mois : la     14 px, text-secondary, 2 lignes max
vanne et pourquoi elle marche.
Ton e-mail                             <label> visible, 14 px / 500
┌───────────────────────────────────┐
│ toi@exemple.fr                    │  input h-12 (48 px), w-full, texte 16 px (pas de zoom iOS)
└───────────────────────────────────┘
[ ] Oui, je veux recevoir la lettre    case 24 px, zone cliquable = toute la ligne (min 44 px)
    une fois par mois. Je me           texte 14 px ; lien « Confidentialité » souligné
    désinscris en un clic.
┌───────────────────────────────────┐
│        Recevoir la lettre         │  bouton h-12, w-full, variant secondary (jamais primary)
└───────────────────────────────────┘
Gratuit, sans compte. Pas plus d'un   12 px, text-muted
e-mail par mois.
```

- Ordre de tabulation : champ, case, lien Confidentialité, bouton. Le bouton est le DERNIER élément : valider arrive après le consentement.
- **≥ 640 px** : le titre et la phrase restent au-dessus ; la rangée devient `flex gap-3` : champ `flex-1` (h-12) + bouton `min-w-[200px]` (h-12), la case passe sous la rangée, la ligne de réassurance en dessous. Largeur max du bloc : celle de la colonne d'article (quiz : `max-w-lg`).
- **Pas de placeholder-seul** : le libellé « Ton e-mail » est visible ; le placeholder `toi@exemple.fr` n'est qu'un exemple.
- **Pas de bouton désactivé** : le bouton reste actif ; une case non cochée ou un e-mail vide produit un message clair (un bouton grisé n'explique rien et se rate au clavier).

### 2.2 Attributs du champ (mobile)

`type="email"`, `inputmode="email"`, `autocomplete="email"`, `autocapitalize="none"`, `autocorrect="off"`, `spellcheck="false"`, `enterkeyhint="send"`, `name="email"`, `required`. Champ piège anti-robot `name="site-web"` : hors écran, `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` (jamais `display:none`, qui est ignoré des robots malins ; jamais lu par un lecteur d'écran).

### 2.3 Consentement : case + `consentText`

- Le modèle `NewsletterSubscriber` impose `consentText` (NOT NULL), `consentAt`, et garde `ipAddress`/`userAgent` : le texte affiché au moment du clic est la PREUVE. Règle : **le serveur écrit sa propre constante versionnée** (jamais le texte envoyé par le navigateur) ; on stocke `lettre-mensuelle-v1 : <texte exact de la case>`. Toute modification du libellé de la case = nouvelle version.
- Texte de la case (v1, ton site, tutoiement) : **« Oui, je veux recevoir la lettre une fois par mois. Je me désinscris en un clic, quand je veux. »** + lien « Confidentialité » vers `/confidentialite`.
- L'ancien texte de consentement (celui du formulaire retiré le 01/10, qui promettait de l'hebdomadaire) n'a pas pu être relu ici (historique git hors de ma portée) : **il est abandonné, il ne doit jamais être réutilisé**. La route indique 0 inscrit à la fermeture ; à confirmer en base avant l'ouverture. [À VÉRIFIER]
- Case **jamais pré-cochée**. Alternative proposée à @legal (question 1, §8) : mention d'information accolée au bouton, sans case, ce qui économise un tap mobile ; non retenue par défaut car la consigne de Thomas parle d'une case.

### 2.4 États

| État | Ce que voit la personne | Détail |
|---|---|---|
| **Vide** | Formulaire du §2.1, champ vide (ou e-mail du compte pré-rempli s'il est connecté), case décochée | Aucun focus automatique (ne jamais voler le focus ni ouvrir le clavier au chargement). |
| **Remplissage** | Le champ et la case se valident à l'envoi, pas à chaque frappe | Message d'erreur uniquement après un envoi raté ; il disparaît dès que le champ est corrigé. |
| **Envoi** | Bouton « Envoi en cours » (`aria-busy="true"`), champ et case en lecture seule, la saisie est conservée | Un seul envoi à la fois (double clic ignoré). Après 8 s sans réponse : même état + ligne « C'est un peu long, on ne t'a pas oublié. » Après 15 s : état Erreur réseau. |
| **Succès** | Le formulaire est remplacé, **sur la même hauteur minimale** (pas de saut de page), par : « **Vérifie ta boîte.** On t'a envoyé un e-mail pour confirmer ton adresse. Tant que tu n'as pas cliqué dessus, tu ne reçois rien. » puis, en petit : « Rien reçu au bout de quelques minutes ? Regarde dans les spams ou les promotions. » + deux liens-texte : « Renvoyer l'e-mail » (inactif 60 s, compte à rebours annoncé) et « Changer d'adresse » (retour au formulaire, saisie conservée) | `role="status"`, le focus se place sur le titre du message (`tabindex="-1"`). On ne dit JAMAIS « Tu es inscrit » avant le clic de confirmation (promesse tenue : inscrit = confirmé). |
| **Erreur de saisie** | Message sous le champ concerné, en texte (pas seulement en rouge), `aria-invalid="true"`, relié par `aria-describedby`, `role="alert"`, focus sur le champ en erreur | E-mail invalide : « Il manque un morceau à cette adresse. Exemple : toi@exemple.fr ». Case non cochée : « Coche la case pour qu'on puisse t'écrire. » |
| **Erreur serveur ou réseau** | Au-dessus du bouton : « Ça n'a pas marché de notre côté. Ton adresse est gardée : réessaie dans un instant. » | La saisie et la case restent (jamais de saisie perdue) ; le bouton redevient actif. |
| **Trop d'essais (429)** | « Trop d'essais d'un coup. Réessaie dans une minute. » | Jamais de formulation accusatrice. |
| **Déjà inscrit** | **Même écran « Vérifie ta boîte »** que pour une nouvelle personne. La différence se fait par e-mail : à une adresse déjà confirmée on envoie « Tu es déjà dans la liste, rien à faire. Lien de désinscription ci-dessous. » | Choix anti-fuite : afficher « déjà inscrit » à l'écran permettrait à n'importe qui de tester si une adresse est dans la liste. Côté appareil, un drapeau `localStorage` (`dm-lettre` = date d'envoi) remplace le formulaire pendant 14 jours par une ligne « Lettre : vérifie ta boîte pour confirmer. Renvoyer l'e-mail », puis le composant se masque. |
| **Fermé** | Le composant ne s'affiche pas | Interrupteur `LETTRE_OUVERTE` à `false` tant que les prérequis §7.1 ne sont pas remplis (motif `BOULOT_PUBLIE`). |

### 2.5 Accessibilité (WCAG 2.2 AA)

- `<form>` dans une `<section aria-labelledby="lettre-titre-<emplacement>">` ; le titre est un `<p id>` (pas de H2 : on ne touche ni aux plans d'article ni aux ancres du sommaire).
- Clavier complet : Tab, Espace sur la case, Entrée pour envoyer ; focus visible 2 px minimum sur champ, case, liens, bouton (jetons de focus existants).
- Cibles ≥ 44 px (champ et bouton 48 px, ligne de la case 44 px minimum, liens-texte `min-h-11`) ; critère 2.5.8 respecté.
- Contraste : texte courant et placeholders ≥ 4,5:1 sur `bg-background` ; l'erreur ne repose pas sur la couleur seule (texte + icône `aria-hidden`).
- Annonces : succès en `role="status"`, erreurs en `role="alert"` ; compte à rebours du renvoi annoncé toutes les 15 s, pas chaque seconde.
- `prefers-reduced-motion` : pas de transition de remplacement.
- Pas de limite de temps, pas de CAPTCHA à image (critère 3.3.8 « authentification accessible » non concerné ; si un défi anti-robot devient nécessaire, uniquement invisible).

## 3. Proposition de valeur et libellé

**Promesse en une phrase (à faire confirmer par Thomas, voir ci-dessous)** : « Une fois par mois, par e-mail, une vanne décryptée : ce qui la fait marcher, et comment t'en servir. »

Elle ne promet que ce que le site sait déjà produire (décryptage « Pourquoi ça marche » et « À toi de jouer » des vannes validées) et que la règle de ton d'Alex tient : une vanne au niveau Alexa et jamais entendue ailleurs, ou pas de vanne.

| # | Titre | Phrase d'appui | Avis |
|---|---|---|---|
| **V1** | **Une vanne décryptée par mois** | Par e-mail, une fois par mois : la vanne et pourquoi elle marche. | **RECOMMANDÉE.** Concret, vérifiable (1 vanne, décryptée, 1 fois par mois), reprend la formule de Thomas, répond à « qu'est-ce que je reçois exactement ». Aucun mot de marketing. |
| V2 | La vanne du mois, démontée pièce par pièce | Une fois par mois, par e-mail. Tu vois ce qui fait rire, et pourquoi. | Plus drôle, mais « démontée pièce par pièce » promet un niveau de détail à tenir à chaque numéro. |
| V3 | Un e-mail par mois, une seule vanne | On la décrypte. Gratuit, sans compte. | Très court, mais ne dit pas « décryptée » (la différence avec « un site de blagues ») ; « une seule » se lit en négatif. |

- **Bouton** : « Recevoir la lettre » (verbe du bénéfice ; pas « S'inscrire », pas « Je m'abonne »).
- **Vocabulaire à protéger** : sur ce site, « abonnement / abonné » = Premium payant (Stripe « S'abonner »). La lettre ne s'appelle jamais « newsletter » ni « abonnement » à l'écran : « la lettre », « recevoir », « te désinscrire ». Évite de faire croire qu'on s'engage ou qu'on paie.
- **Réassurance** : « Gratuit, sans compte. Pas plus d'un e-mail par mois. » Le mot « gratuit » qualifie la lettre uniquement, pas de « compte gratuit » (décision du 05/10) ; « pas plus d'un » est une promesse que la tâche d'envoi doit garantir (journal d'envoi unique par numéro, §7).
- **Zéro promesse non tenue** : ne rien dire de la lettre hebdomadaire tant qu'elle n'existe pas ; ne pas afficher de nombre d'inscrits (0 aujourd'hui) ; ne pas annoncer de date d'envoi non fixée ; ne pas écrire « sans pub » (une lettre peut un jour mentionner Premium : si c'est le cas, le dire dans la lettre).
- **Ton** : voix du site sur les écrans (« tu », observation plutôt que leçon, pas de « je »). Les e-mails automatiques (confirmation, déjà inscrit) partent de `noreply@` et se signent « L'Équipe Deviens Marrant » ; le numéro mensuel peut se signer « Alex, Deviens Marrant » s'il part de l'adresse d'Alex (règle du 14/10). Brouillons obligatoires, validation par Thomas avant tout envoi (`ton-alex.md`).
- **Contenu du numéro** : le format exact (1 vanne décryptée ? + 1 conseil ?) n'est pas défini. [À CONFIRMER par Thomas.] Tant qu'il ne l'est pas, V1 s'en tient à « une vanne décryptée ».

## 4. Mesure (Umami)

Convention existante : nom en minuscules avec tirets, objet puis état (`blog-cta-vu`, `inscription-envoi`, `inscription-reussie`, `inscription-echec`, `mur-vu`), propriétés simples (chaînes ou nombres), **aucune donnée personnelle** (jamais d'e-mail, jamais de jeton), émission par `trackUmami` (no-op sous `/blog/apercu`, bloquée par `umami.disabled`).

| Événement | Quand | Propriétés | Équivalent existant |
|---|---|---|---|
| `lettre-vu` | Le composant est visible à 50 % ou plus, **une fois par emplacement et par vue de page** (IntersectionObserver propre au composant, seuil 0,5 comme `CTA_VU_RATIO`) | `emplacement` (`article` / `quiz` / `page`), `slug` (article) ou `profil` (quiz) | `blog-cta-vu` |
| `lettre-envoi` (= « soumis ») | Clic validé : e-mail valide ET case cochée, avant la réponse serveur | `emplacement`, `slug` ou `profil` | `inscription-envoi` |
| `lettre-echec` | Réponse en erreur ou erreur de saisie bloquante | `emplacement`, `raison` (`email` / `case` / `reseau` / `limite` / `ferme`) | `inscription-echec` |
| `lettre-confirmee` (= « confirmé ») | Arrivée sur `/lettre?statut=confirmee&mesure=1` (voir ci-dessous) | `emplacement` (relu de `source` en base, jamais de l'e-mail) | `inscription-reussie` |

Règles de cohérence :
1. **Ajouter les 4 noms à `ATTRIBUTED_EVENTS`** (`lib/umami.ts`) : ils reçoivent `origine` / `contenu` quand l'arrivée vient d'un réseau, comme le reste du tunnel.
2. **`?ne-pas-compter=1`** : tout part par `trackUmami`, donc le drapeau `umami.disabled` du navigateur de Thomas bloque `lettre-vu`, `lettre-envoi` et `lettre-echec` sans rien ajouter. Aucune modification de `umami-before-send.ts`, sauf à vérifier que ni `email` ni `token` ne figurent dans les URL d'arrivée (le filtre retire déjà `token`, `email`, `ne-pas-compter`, `compter`).
3. **La confirmation se fait dans le client mail, souvent sur un autre appareil** : le drapeau n'y est pas. Donc la route de confirmation n'ajoute `mesure=1` à la redirection que si l'adresse n'est pas dans `emailsExclus()` (liste du lot 0) ; la page `/lettre` n'émet `lettre-confirmee` que si `mesure=1`. Les tests de Thomas ne sont ainsi jamais comptés, quel que soit le navigateur.
4. **La base fait foi** pour « confirmé » (bloqueurs de pubs, mail ouvert sans JavaScript) : `NewsletterSubscriber` filtré sur `status = CONFIRMED`, groupé par `source`, moins `emailsExclus()`. L'événement Umami ne sert qu'à la ventilation par origine.
5. **Ne pas polluer le lot 1** : le bloc de la lettre n'a ni `data-blog-cta` ni `data-blog-cta-position` (§1.2). Garde-fou pour le bilan : si le ratio `blog-cta-clic / blog-cta-vu` du bloc de fin chute de plus d'un tiers par rapport à la mesure du lot 1, la lettre est retirée de l'article concerné pour comprendre. [Seuil proposé, à valider par @data-analyst.]
6. **Calendrier de déploiement** : après le bilan du lot 1 (10/11), et pas dans le même déploiement que le lot 2 (boutons), pour ne pas rendre illisible le « avant / après sur 4 semaines ».
7. **Rapport du lundi** : ajouter une section « Lettre » avec dénominateurs : vus, envois, confirmés (base), par emplacement.

Cibles (dimensions HEART, voir §9.4) : envoi / vu ≥ 2 % [HYPOTHÈSE : aucun repère interne, à recaler après 4 semaines], confirmé / envoi ≥ 60 % (défaut de la méthode), erreurs / envoi < 5 %.

## 5. Pages d'arrivée (remplacent `/?newsletter=…`)

Une seule page `/lettre`, avec un bandeau de statut en haut de contenu (`role="status"`, focus au chargement) selon `?statut=` :

| `statut` | Message | Action suivante |
|---|---|---|
| `confirmee` | **« C'est confirmé. »** « La lettre arrive une fois par mois. » + la date du prochain numéro SEULEMENT si un numéro validé est programmé en base | Un seul lien : « Lire une vanne décryptée maintenant » vers `/blague-du-jour` [À VÉRIFIER : page et contenu] |
| `desinscrit` | **« C'est fait, tu ne recevras plus la lettre. »** | Lien-texte « Mauvais bouton ? Te réinscrire » (affiche le formulaire) |
| `invalide` | « Ce lien ne fonctionne plus. » | Formulaire d'inscription affiché dessous |
| `erreur` | « Quelque chose a coincé de notre côté. Réessaie ce lien dans un moment. » | Lien de contact `contact@deviens-marrant.fr` |

Aucun message n'affiche d'adresse e-mail ni de jeton. Les liens sont ceux des routes existantes (`buildConfirmUrl`, `buildUnsubscribeUrl`).

## 6. Articulation avec la lettre hebdomadaire des abonnés payants

Format hebdomadaire hors périmètre ; ici seulement la jonction.
1. **Deux produits, une relation** : la mensuelle (adresse seule, gratuite) et la hebdomadaire (réservée au compte Premium actif). Rien à l'écran sur la hebdomadaire avant son premier numéro : pas de promesse non tenue, pas de ligne dans `/abonnement`.
2. **Pas de double envoi** : au moment d'envoyer la mensuelle, on **exclut** les adresses d'un compte Premium actif (jointure sur l'e-mail, sans changer le schéma). Si l'abonnement s'arrête, la mensuelle reprend sans nouvelle inscription (le consentement initial reste valable ; question 2 pour @legal).
3. **Affichage** : le composant ne s'affiche jamais à un Premium connecté. Un Premium qui s'était inscrit avant reste en base sans rien recevoir en double.
4. **Passage Premium** : aucune inscription automatique des 14 comptes existants ni des futurs Premium à la mensuelle (pas de consentement). L'e-mail de bienvenue Premium annoncera la hebdomadaire seulement quand elle existera.
5. **Dans la mensuelle** : au plus UNE mention Premium discrète en bas du numéro, formulée dans le ton d'Alex (propose, n'impose), jamais en haut ; à écrire avec le format du numéro.

## 7. Ce qui manque dans le code (liste pour @fullstack, sans coder)

### 7.1 Prérequis bloquants avant d'ouvrir le formulaire

1. **Aucun code d'envoi n'existe** (note de `route.ts`) : il faut la tâche mensuelle d'envoi, testée sur une liste de test, AVANT que le premier visiteur s'inscrive.
2. **Premier numéro validé** (relecture à l'aveugle de la vanne, règle d'or, puis validation de Thomas) et **stock de 6 numéros préparés** pour tenir « une vanne par mois » même si un mois n'a pas de vanne au niveau (« pas de vanne plutôt qu'une vanne moyenne »). Contenu préparé en base, jamais généré au fil de l'eau (01/10).
3. **Jour d'envoi fixé** par Thomas (aucune date n'est décidée).

### 7.2 Liste des manques

| # | Manque | Constat dans le code actuel |
|---|---|---|
| 1 | **Route `POST /api/newsletter`** réécrite | Aujourd'hui un stub qui répond 410 ; le test `newsletter-api.test.ts` l'exige (à rendre bi-état avec l'interrupteur). À faire : validation du corps, e-mail nettoyé (minuscules, espaces), `consent === true`, constante de consentement versionnée écrite côté serveur, champ piège, limite par IP et par adresse (réutiliser la limite partagée de la s16 et le contrôle d'origine), réponse identique dans tous les cas (anti-fuite). |
| 2 | **Logique par statut** | Nouveau : créer en `PENDING` avec les deux jetons (`generateOpaqueToken`). `PENDING` : renvoyer l'e-mail (avec délai minimal). `CONFIRMED` : e-mail « déjà dans la liste », ne rien changer. `UNSUBSCRIBED` : repasser en `PENDING`, nouveau `consentAt` / `consentText`, nouveau jeton de confirmation. |
| 3 | **E-mail de confirmation et e-mail « déjà inscrit »** (Resend, domaine vérifié) | Aucun gabarit. Prénom absent : repli propre. Brouillons à valider par Thomas, signature « L'Équipe Deviens Marrant ». |
| 4 | **Tâche d'envoi mensuelle** | À créer : sélection `CONFIRMED` moins Premium actifs, lots (limites Resend), table de journal d'envoi (une ligne par numéro et destinataire) pour garantir « pas plus d'un par mois » même si la tâche est relancée, en-têtes `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (la route POST de désinscription existe déjà), lien de désinscription dans le corps, traitement des rebonds et plaintes (webhook Resend). |
| 5 | **Numéros préparés en base** | Table `NewsletterIssue` (objet, pré-en-tête, corps, date d'envoi prévue, statut BROUILLON / VALIDÉ / ENVOYÉ), aperçu admin (motif `/blog/apercu`, hors Umami), validation par Thomas avant passage à VALIDÉ. |
| 6 | **Page `/lettre`** (+ lien de pied de page) | N'existe pas. Redirections de `confirm` et `unsubscribe` à changer : actuellement `/?newsletter=confirmed|unsubscribed|invalid|error` ; [À VÉRIFIER : l'accueil lit-il ces paramètres ?]. `noindex`, hors sitemap. |
| 7 | **Composant `LettreInscription`** + textes `config/textes/lettre-s21.ts` | À créer ; session : pré-remplir l'e-mail d'un compte connecté, masquer pour Premium (`isPremiumPlan`, comme `ArticleCta`) ; drapeau `localStorage` `dm-lettre` ; montage dans `ArticleCta` (après l'`aside`), `ViralQuiz` (sous la `Card`), `/lettre`, lien dans `footer.tsx`. Test de non-tiret cadratin sur les textes. |
| 8 | **Interrupteur `LETTRE_OUVERTE`** | À créer, `false` par défaut ; composant masqué et route en 410 tant que `false`. |
| 9 | **Mesure** | Ajouter les 4 événements à `ATTRIBUTED_EVENTS`, hook d'observation propre à la lettre, paramètre `mesure=1` conditionné par `emailsExclus()`, test sur le modèle de `blog-cta-mesure-s20.test.tsx`, section « Lettre » du rapport du lundi, compteurs par `source` côté admin. |
| 10 | **Confirmation et désinscription déclenchées par un simple GET** | Les scanners de liens de messagerie (clic automatique avant lecture) peuvent confirmer ou désinscrire à la place de la personne. Reco UX : le lien d'e-mail ouvre `/lettre` avec un bouton « Confirmer mon adresse » (un tap, POST) ; la désinscription par `List-Unsubscribe-Post` reste instantanée, et celle du lien du corps passe aussi par un bouton. Coût : 1 tap en plus à la confirmation. Décision à prendre avec @legal (question 5). |
| 11 | **`source`** | Colonne texte déjà indexée : valeurs `article:<slug>`, `quiz`, `page`. Pas de migration nécessaire. |
| 12 | **Page `/confidentialite`** | Ajouter la finalité « lettre », la base légale (consentement), le sous-traitant d'envoi, la durée, les droits. |
| 13 | **Purge des `PENDING`** | Tâche de nettoyage des adresses jamais confirmées (durée proposée : 30 jours [HYPOTHÈSE à valider par @legal]) ; le lien de confirmation passé ce délai affiche `statut=invalide` avec le formulaire. |
| 14 | **Tests** | Jest (route, états, anti-fuite), Playwright smoke à 375 px (saisie, case, envoi simulé), contrôle clavier. |

## 8. Questions pour @legal (propres à la lettre uniquement)

Les points juridiques secondaires reportés par Thomas (07/10 : conservation des comptes inactifs, contrat Umami, mentions D3, avocat) ne sont PAS rouverts ici.
1. **Case ou mention** : la case décochée est-elle nécessaire, ou une mention d'information accolée au bouton (consentement par l'action, double opt-in ensuite) suffit-elle pour une lettre adressée à des particuliers ? Texte de la case v1 (§2.3) à relire.
2. **Reprise de la mensuelle** après la fin d'un abonnement Premium (suspendue pendant l'abonnement, §6) : le consentement initial reste-t-il valable ? Et la hebdomadaire : prestation du contrat Premium ou communication commerciale à consentement séparé ?
3. **Identification de l'expéditeur** dans chaque numéro et dans l'e-mail de confirmation (raison sociale, adresse, contact) : quelle mention minimale ?
4. **Adresse IP et agent utilisateur** déjà prévus par le modèle : les garder comme preuve de consentement, les hacher, ou les supprimer ? Durée ? Durée de conservation des `PENDING` (proposition : 30 jours) et des désinscrits (liste de suppression à conserver pour ne pas réécrire à qui s'est désinscrit).
5. **Confirmation par GET** et scanners de liens : un clic automatique valide-t-il un double opt-in ? Faut-il une page intermédiaire avec bouton (§7.2, point 10) ?
6. **Périmètre de la désinscription** : un clic « Me désinscrire » dans la lettre ne touche que la lettre. Un désabonnement global d'un autre e-mail (`/api/unsubscribe`, `emailOptOut`, prospects CEO en `OPT_OUT`) doit-il aussi retirer l'adresse de la lettre ? Les adresses `OPT_OUT` ne doivent jamais pouvoir se réinscrire par erreur.
7. **Page `/confidentialite`** : formulation de la section lettre (finalité, base, sous-traitant d'envoi).

## 9. Tests UX (bloc obligatoire)

### 9.1 Audit heuristique de Nielsen (de la spécification ; à rejouer sur captures après codage)

| # | Heuristique | Verdict | Évidence |
|---|---|---|---|
| H1 | Visibilité de l'état | PASS | 7 états décrits, bouton « Envoi en cours », message « Vérifie ta boîte », compte à rebours du renvoi. |
| H2 | Langage du persona | PASS | « la lettre », « recevoir », « vanne décryptée » ; « abonnement » et « newsletter » proscrits à l'écran (conflit avec Premium). |
| H3 | Contrôle et annulation | PASS | Changer d'adresse, renvoi, désinscription en un clic, fermeture sans effet (pas de modale). |
| H4 | Cohérence | PASS sous réserve | Même composant partout, mêmes jetons ; violet plein réservé à Premium. Réserve : le conflit des mots « abonnement » à surveiller dans les e-mails. |
| H5 | Prévention des erreurs | PASS | `type=email`, validation à l'envoi, saisie conservée, anti-double clic, anti-fuite de liste. Risque : confirmation par GET (§7.2, 10). |
| H6 | Reconnaissance plutôt que rappel | PASS | Étiquette visible, exemple d'adresse, e-mail pré-rempli pour un compte connecté. |
| H7 | Raccourcis experts | PASS | `autocomplete=email` (remplissage en un geste), Entrée envoie. |
| H8 | Minimalisme | PASS | 1 champ + 1 case + 1 bouton ; aucune demande de prénom ni de centres d'intérêt. |
| H9 | Messages d'erreur humains | PASS | Chaque erreur dit quoi faire (« Coche la case… », « réessaie dans un instant »). |
| H10 | Aide dans le flux | PASS | Phrase de promesse + réassurance + lien Confidentialité + « Rien reçu ? Regarde dans les spams ». |

### 9.2 Cognitive walkthrough : Yanis, fin de l'article n°1, mobile

| Étape | Sait-il quoi faire ? | Action visible ? | But-action clair ? | Feedback immédiat ? |
|---|---|---|---|---|
| 1. Il a fini les vannes, descend, voit le bloc de fin puis la ligne « Une vanne décryptée par mois » | OUI | OUI (filet + titre) | OUI | n/a |
| 2. Touche le champ | OUI | OUI | OUI | OUI (clavier e-mail, focus visible) |
| 3. Remplit, ignore la case, touche le bouton | OUI | OUI | **NON** : peut ne pas voir la case entre le champ et le bouton | OUI mais tardif |
| 4. Reçoit l'erreur de case | OUI | OUI | OUI | OUI |
| 5. Succès, quitte vers sa boîte | OUI | OUI | OUI | OUI |
| 6. Ne trouve pas l'e-mail | PARTIEL | OUI (spams, renvoi) | OUI | NON si le mail tarde |

`[FRICTION H5]` : à l'étape 3, le first-time user peut valider sans remarquer la case. Solution : case entre le champ et le bouton (jamais après), message d'erreur qui ramène le focus sur la case, et mesure de `lettre-echec` `raison=case` ; si > 15 % des envois, @legal question 1 (retirer la case).
`[FRICTION H1]` : à l'étape 6, la livraison de l'e-mail peut dépasser la patience. Solution : envoi immédiat, objet reconnaissable (brouillon à valider), expéditeur stable, lien de renvoi après 60 s.
`[FRICTION H2]` : « lettre » pourrait être lu comme « abonnement payant ». Solution : « Gratuit, sans compte » visible sous le bouton et jamais « s'abonner ».

### 9.3 Edge cases et critères

| Test | Résultat attendu |
|---|---|
| Parcours persona sans aide | Yanis comprend ce qu'il reçoit, à quelle fréquence, que c'est gratuit, en < 10 s de lecture. À vérifier sur captures réelles 375 px (leçon s17 : pas d'audit UX sur le code). |
| Charge cognitive | 1 action principale par bloc (envoyer) ; dans l'article, 3 actions de conversion hiérarchisées (étape 1 contour, Premium plein, lettre discrète) ; dans le quiz, la carte garde ses 3 actions. |
| Time-to-value | Visiteur, saisie, clic de confirmation = 2 étapes, aucune création de compte. Première valeur concrète : page `/lettre` après confirmation (dernier numéro en aperçu quand il existe), la lettre elle-même arrive au prochain envoi. Justification du délai : lettre mensuelle par nature. |
| Vide / erreur / chargement | Voir §2.4. |
| Connexion lente ou coupée | Aucune saisie perdue ; relance manuelle ; pas de relance automatique (évite un double envoi). |
| Retour après 30 jours | Lien de confirmation toujours valable tant que le `PENDING` n'est pas purgé ; sinon `statut=invalide` avec formulaire. Drapeau d'appareil expiré après 14 jours : le formulaire revient. |
| JavaScript lent ou bloqué | Le formulaire est dans le HTML serveur ; sans JavaScript l'envoi échoue proprement (message) : l'inscription ne dépend pas d'un bundle tiers. |
| Compte FREE connecté | E-mail pré-rempli, modifiable ; consentement toujours demandé. |
| Premium connecté | Composant absent. |
| Accessibilité WCAG 2.2 AA | §2.5 ; à contrôler au clavier et au lecteur d'écran avant mise en ligne. |

### 9.4 Mesure HEART

| Dimension | Signal | Cible | Mesure |
|---|---|---|---|
| **Adoption** (primaire) | `lettre-envoi / lettre-vu` | ≥ 2 % [HYPOTHÈSE] | Umami, rapport du lundi |
| **Task success** | confirmés (base) / `lettre-envoi` | ≥ 60 % | Base `NewsletterSubscriber`, moins `emailsExclus()` |
| Task success (technique) | `lettre-echec / lettre-envoi` | < 5 % | Umami |
| **Retention** | Part des inscrits encore `CONFIRMED` après 3 numéros | ≥ 85 % [HYPOTHÈSE] | Base |
| **Engagement** | Ouvertures et clics des numéros | À définir avec le format du numéro | Resend |
| **Happiness** | Désinscriptions par numéro | < 2 % [HYPOTHÈSE] | Base |
| Garde-fou lot 1 | `blog-cta-clic / blog-cta-vu` du bloc de fin | pas de baisse > 1/3 | Umami |

## 10. Agents spécialisés recommandés et handoff

| Agent | Type | Rôle | Justification | Priorité |
|---|---|---|---|---|
| @copywriter | existant | Rédiger e-mails de confirmation et « déjà inscrit », trame du numéro mensuel, 3 numéros d'essai | Textes auto-envoyés, ton d'Alex, relecture à l'aveugle (règle d'or) | Haute |
| @legal | existant | Les 7 questions du §8 | Nouveau traitement de données et envoi commercial | Haute |
| @data-analyst | existant | Section « Lettre » du rapport, seuils §4 | Mesure en avant / après | Moyenne |
| Testeur-persona Yanis | à créer via @agent-factory | Parcourir le formulaire et les e-mails sur mobile, noter la compréhension de « lettre » | Le risque principal est le sens du mot et la case | Moyenne |

---
**Handoff → @orchestrator (puis @design, @copywriter, @legal, @fullstack)**
- Fichier produit : `/home/user/Marrant/docs/ux/lettre-inscription-s21.md`
- Décisions prises : 3 emplacements (fin d'article, résultat du quiz, lien de pied de page vers `/lettre`) ; libellé « Une vanne décryptée par mois » + bouton « Recevoir la lettre » ; case de consentement non pré-cochée avec constante versionnée écrite côté serveur ; réponse identique pour un déjà inscrit (anti-fuite) ; 4 événements Umami `lettre-*` isolés du lot 1.
- Points d'attention : prérequis bloquants §7.1 (aucun code d'envoi, premier numéro, jour d'envoi) ; confirmation par GET et scanners de liens ; ne pas déployer avec le lot 2 ; mots « abonnement » et « newsletter » proscrits à l'écran ; format du numéro et de la hebdomadaire à définir par Thomas.
---
