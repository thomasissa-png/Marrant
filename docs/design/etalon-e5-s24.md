# Étalon E5 : rendu de l'espace Premium (s24)

> Auteur : @design, 12/11/2026. Trois maquettes HTML locales, jamais déployées, rien dans `apps/web` : `docs/espace-client/etalons/e5/aujourdhui.html`, `carte-rafale.html`, `mes-questions.html`. CSS inline, aucune ressource externe sauf Inter et Plus Jakarta Sans (déjà celles du site). Thème sombre natif (le site est 100 % sombre).
> **Aucune capture n'a été vue ni aucun navigateur lancé** : les 10 critères visuels ne sont pas scorés, aucun verdict visuel n'est posé. Les largeurs ci-dessous sont des estimations à vérifier sur les captures 320, 375, 768 et 1280.
> Sources : architecture v19 (2.2, 2.6, 2.9, 4.4, 6.1 à 6.3, 9 E5), `niveaux-xp-s24.md` 3.0, `etalons-barre-espace-s24.md`, `etalons-espace-s24.md` E1.1, `founder-preferences.md` l. 161 à 171.

## 1. Choix faits

### 1.1 Socle commun (en-tête et barre)
- En-tête abonné : classes de `header.tsx` traduites en CSS (64 px, bordure, fond `#0D0D0D` à 95 %, flou). Droite : loupe (44 px, masquée sous 360 px), **cloche (44 px)**, compte (44 px). Pas de burger ni de nav desktop pour l'abonné.
- Barre sous l'en-tête, partout, abonné (Q3 = A, Q11 = A) : `sticky top-16`, 44 px + 1 px de bordure + 1 px haut, soit 111 px d'empilement avec l'en-tête (plafond 112 px). **Six entrées de la décision C1** : Aujourd'hui, Parcours, Quoi répondre, Bibliothèque, Mes questions, Plus. Elles remplacent les cinq libellés (Vannes, Conseils, Vidéos) des étalons barre s24, antérieurs à C1.
- **« Plus » défile avec les autres entrées** (il n'est plus épinglé comme dans les variantes s24) : 6.2 dit qu'il est hors écran au premier affichage sur téléphone, avec deux chemins de repli pour les bonus. Menu ancré, hors de la zone qui défile, 3 groupes (S'entraîner ; Mon contenu : Favoris, Mes répliques ; Le reste : Lettres, Articles, Quiz d'humour).
- Règles de 6.2 appliquées : `<nav aria-label="Mon espace">`, `aria-current="page"` sur l'entrée courante, entrée active ramenée dans la vue par affectation de `scrollLeft` (jamais animée, donc `prefers-reduced-motion` respecté sans condition), focus clavier ramené dans la vue, aucune pastille sur les onglets.
- **Indice de défilement** : fondu de bord 40 px à droite (opacité 0 en fin de course) avec un chevron décoratif, fondu à gauche après défilement. Les entrées ne sont pas dimensionnées pour couper la suivante de 16 à 24 px : la coupure vient du hasard des largeurs (estimation à 375 px : Aujourd'hui, Parcours, Quoi répondre entières, Bibliothèque à peine entamée). **À mesurer** ; critère de test « un lecteur voit qu'il peut défiler » à juger sur la capture 375 et à 320.

### 1.2 Aujourd'hui
- Composition : repère « 12 cartes cette semaine » sous le H1 (ni série ni points), puis une pile à 24 px d'écart. Mobile, ordre : premier pas, rafale, contenu du jour, étape en cours, Ton cap. Dès 1024 px : deux colonnes (2fr / 1fr), principal à gauche (premier pas, rafale, contenu du jour), étape en cours et Ton cap à droite, gap 24 px dans les deux sens.
- **Une seule action principale visible, quatre états de 4.4** : bouton violet plein (`accent-secondary-hover`, comme `Button` primary) seulement sur l'action de l'état courant ; les autres actions sont en contour neutre. États rendus par le hash : `#etat=pas` (arrivée, défaut : premier pas), `#etat=rafale`, `#etat=reprise` (rafale faite : « C'est tout pour aujourd'hui », « Reprendre » devient principal).
- Rafale : une carte « Si tu as 5 minutes » avec 1 ligne « Nouvelle » (Coloc : la poêle) et 2 lignes « À revoir » (deux scènes d'entrée de E1.2 / 4.2). Étiquettes en texte (« Nouvelle », « À revoir »), jamais une couleur seule.
- Contenu du jour : vanne, conseil, vidéo au même poids (trois cartes de même gabarit, empilées, pas de colonne dominante). Vanne avec « Ce soir, c'est plutôt ? » : puces de 44 px minimum, « Peu importe » actif par défaut, état marqué par contour de 2 px + coche (pas la couleur seule) + `aria-pressed`, région `aria-live` polie, focus conservé, « Une autre » de même taille. Aucune carte vanne en double. Geste : « À toi : ressors-la à voix haute ce soir. » Catégories (Soirée, Boulot, Famille, Rencard) : **le seuil lu en base n'est pas connu** (7.5 f, à vérifier avant l'étalon) : la maquette montre les quatre.
- Étape en cours puis **Ton cap** : deux cartes distinctes, intitulé de niveau 2 propre (« Ton cap »), 24 px d'écart, aucun compteur d'étapes dans la carte cap ; texte lu « Tu avances bien, cap 3 sur 5 » (le « · » visuel est masqué aux lecteurs d'écran, remplacé par une virgule), cinq pastilles décoratives `aria-hidden` (pleine ou contour, contour et plein au même contraste 3:1), série sur sa ligne au-dessus avec une **flamme SVG décorative**, violette (`accent-primary-hover`) pour rester dans la palette « 100 % violet », jamais un émoji. État 0 : `#serie=0` (« Ta série démarre à ta prochaine étape. »). « Tes bonus » : `#bonus` (n'existe qu'une fois un bonus ouvert).
- Note « Ma réplique à moi » : champ sous le geste du premier pas, états vide (« Écris ta version, en une phrase »), saisie (compteur sans alerte rouge), enregistrée (« Enregistrée »), suppression ; le texte reste dans le champ tant que l'enregistrement n'a pas réussi. Aucune limite de caractères affichée ([RESTE À TRANCHER] de 2.7).

### 1.3 Carte de rafale
- Carte « Coloc : la poêle » (texte de E1.1, tel quel) : scène, contexte (« La coloc rit déjà de ces dimanches, et ton colocataire range tout, toujours », contexte 1 de E1.1), « Ta réponse d'abord » (texte de E1.1), « Prends ton temps », puis « Tu avais une réponse ? » avec **trois boutons de même poids** (Oui, À moitié, Rien : aucun n'est mis en avant, aucun vert ni rouge). Un seul toucher les verrouille et révèle les répliques (la sûre, la joueuse, la risquée, textes de E1.1) ; un choix affiche « Ici : la joueuse » et l'explication de E1.1, puis la règle « Comment choisir » de E1.1. Aucun verdict en couleur (rien ne juge).
- Aucune note de l'abonné n'apparaît avant sa réponse (critère de test d'E5) : la carte de révision avec « ma réplique à moi » n'est pas rendue ici (voir 4).
- **Pas de compte à rebours** : 2.2 le désactive la première fois ; le « Prends ton temps » de 3 secondes est rendu (`#etat=sequence`, séquence rejouable), sans animation. États : `#etat=attente`, `boutons` (défaut), `reponses`, `regle`.
- Deux accroches côte à côte (dès 1024 px, sinon empilées), même carte dessous. A : avec « l'esprit de l'escalier » (trouver la bonne réponse trois jours trop tard) ; B : sans ce mot. **Les deux phrases sont des textes de maquette [HYPOTHÈSE]** : à écrire et à passer à l'aveugle par @copywriter ; je n'ai pas qualité pour trancher la formulation.
- Les boutons passent en une colonne sous 360 px (80 px de large par bouton à 320 ne tiennent pas « À moitié » avec des marges lisibles).

### 1.4 Mes questions
- Deux colonnes dès 1024 px (formulaire 5/12, « Mes envois » 7/12), empilé avant : on pose d'abord, on retrouve ensuite.
- Formulaire : trois types en cartes radio (Un problème, Une situation à gérer, Une question ; « Une question » présélectionné, [HYPOTHÈSE de défaut]), champ « Ton message », « Évite les noms : décris la scène. » sous le champ, phrase de délai unique pour les trois types, **un seul bouton principal « Envoyer »**. Envoi : « Envoi en cours » (bouton désactivé, texte conservé), puis « Envoyé, l'équipe répond en général sous 1 à 2 jours ouvrés ».
- Types : étiquette en texte dans chaque envoi, jamais une couleur seule.
- Historique, états (`#etat=`) : `liste` (défaut : une question en attente + une situation répondue), `retard` (« L'équipe n'a pas encore répondu, ta demande est bien là »), `vide` (un exemple, la phrase de délai, jamais un tableau vide), `fil` (fil ouvert). Réponse : datée, signée « L'Équipe Deviens Marrant », bouton « Continuer ». « Retirer de mon historique » sur chaque envoi (décision C10 a : demande explicite de l'abonné ; la confirmation n'est pas rendue).
- Lien avec la cloche : ouvrir le fil éteint la pastille (une réponse reste non lue tant que le fil n'est pas ouvert, 2.9).
- Contenu de l'historique rendu **tel que conservé en base** (C10 a), aucune mention de durée ni de suppression automatique.

### 1.5 Cloche (rendue dans `aujourdhui.html`, point seulement dans les deux autres)
- Bouton 44 x 44, nom accessible au singulier (« Notifications, 1 réponse de l'équipe non lue ») ou « Notifications, aucune réponse non lue » ; pastille = point plein de 12 px (bordure de 2 px couleur du fond), sans chiffre, sans animation ; états `#cloche=reponse|nouveautes|aucune`.
- Panneau : feuille basse sur mobile (`items-end`, `100dvh`, `safe-area-inset-bottom`), fenêtre centrée dès 768 px ; Échap, clic dehors, bouton « Fermer » ; focus piégé dans le panneau et rendu au bouton ; contenu de 2.9 (« L'équipe t'a répondu » sans pastille de ligne, « Nouveau ce mois-ci », « Nouvelle lettre », état vide « Rien de nouveau. Reviens quand tu veux. ») ; un bonus n'y figure jamais.

## 2. Habillage de la cloche : 3 options, une reco

Rendus par `aujourdhui.html#option=1|2|3&cloche=reponse` (ajouter `&ouvert` pour le panneau).

| | Option 1 | Option 2 | Option 3 |
|---|---|---|---|
| Icône | cloche en contour (comme la loupe et le compte) | idem | cloche **pleine** quand une réponse est non lue, en contour sinon |
| Pastille | point plein violet clair `#A78BFA` (`accent-link`) | point plein blanc `#FFFFFF` | point plein `#A78BFA` en plus de l'icône pleine |
| Contraste du point | 7,1:1 sur fond, 5,3:1 sur le fond de survol | 19:1 | idem option 1 |
| Signal non coloré | point (forme) | point (forme) | point + icône pleine (deux formes) |
| Pour | cohérent avec la marque et les actifs de la barre ; pas rouge, donc aucune lecture d'urgence ou de relance ; aucun nouveau token | contraste maximal, aucune confusion possible avec l'accent des actifs | redondance utile en faible vision ou à 320 px |
| Contre | la couleur seule distingue peu du soulignement actif (la forme tient la distinction) | le blanc se lit comme « en ligne » ; neutre, moins de marque | un second SVG plein hors langage d'icônes actuel, 20 px : la différence contour/plein est discrète |

**Reco : option 1.** Un seul changement visible (un point), rien qui ressemble à un compteur ni à une alerte (2.9 interdit chiffre, animation, relance), aucun token nouveau (`accent-link` existe), contraste largement au-dessus de 3:1. Bascule vers l'option 3 si la capture 375 montre que le point passe inaperçu. Rejeté : un rouge ou un orange (urgence, hors palette « 100 % violet »).

## 3. Tokens utilisés (tous existants)

| Famille | Tokens |
|---|---|
| Couleurs | `background` #0D0D0D, `background-light` #1A1A1A, `background-card` #1F1F1F, `background-elevated` #2A2A2A ; `accent-primary` #8B5CF6 (soulignement actif, pastilles, filet des citations), `accent-primary-hover` #A78BFA (flamme), `accent-secondary-hover` #7C3AED (bouton principal), `accent-secondary` #6D28D9 (survol), `accent-link` #A78BFA (focus, liens, puces actives, pastille) ; `text-primary` #FFFFFF, `text-secondary` #B3B3B3, `text-muted` #9A9A9A ; `border` #2A2A2A, `border-hover` #3A3A3A, `border-input` #707070 (puces, champs, radios) |
| Polices | Inter 400, 500, 600, 700 ; Plus Jakarta Sans 700 (H1, H2, logo) ; trois graisses de corps au plus (400, 500 à 600, 700) |
| Échelle typo | 12/16, 14/20, 16/24, 20/28, 30/36, 36/40 (toutes les hauteurs de ligne sont des multiples de 4) |
| Espacement | 4, 8, 12, 16, 24, 32, 48 px (gaps, paddings) ; voir écart ci-dessous |
| Rayons | `sm` 4, `md` 8 (lignes, citations), `lg` 12 (cartes, boutons, champs), 9999 (puces, étiquettes) |
| Durées | `fast` 150 ms uniquement (survols), rien d'animé en boucle, `prefers-reduced-motion` ramène tout à 0,01 ms |
| Empilement | en-tête z-50, barre z-40, menu Plus z-60, panneau cloche z-70 |
| Cibles | 44 px minimum partout (boutons, puces, onglets, lignes, radios) |

**Écarts à signaler (aucune valeur arbitraire cachée)** :
- **12 px** (marge mobile `px-3`, gaps, paddings internes) vient des classes réelles du site (`header.tsx`, barre s24) mais n'est pas dans l'échelle 4 / 8 / 16 / 24 du système (`sm` 8, `md` 16). À entériner ou à remplacer par 8 ou 16.
- Fondu de la barre : 40 px (le document barre disait 32 px, `w-8`) pour loger le chevron. À trancher sur capture ; sinon `w-8` sans chevron.
- Voiles : `rgba(13,13,13,.95)` (déjà `bg-background/95`) et `rgba(0,0,0,.6)` (voile du panneau, à traduire en `bg-black/60`).
- Aucune ombre : les surfaces se séparent par `border`.

## 4. Contrastes (valeurs calculées, à confirmer sur captures)
- Texte : `text-secondary` sur carte 7,9:1 ; `text-muted` sur carte 5,9:1 ; blanc sur bouton principal `#7C3AED` 5,7:1 ; `accent-link` sur carte 6,1:1.
- Non textuel (seuil 3:1) : bordure `#707070` sur carte 3,3:1 et sur `#1A1A1A` 3,5:1 ; `#8B5CF6` sur carte 3,9:1 (pastilles, pleines et contours) ; soulignement actif sur fond 4,6:1.
- Dark mode seul : le site n'a pas de mode clair, donc rien à vérifier en clair.

## 5. Points à valider par le fondateur (et trous de la maquette)

1. **Conflit avec l'architecture** : 4.4 et 6.3 placent la série et « Ton cap » dans « Parcours » (juste après l'étape à reprendre) et dans « Ton mois », **jamais dans la salutation d'Aujourd'hui**, parce que la rafale ne compte pas pour la série. La demande de cet étalon les met sur l'écran d'accueil : `aujourdhui.html` le rend pour le montrer, mais ce n'est pas la règle écrite. À trancher : garder l'architecture (cette paire va dans « Parcours », l'accueil n'a que « Ton mois ») ou l'autoriser sur l'accueil. Le voisinage « Étape n sur 6 » puis « Ton cap » (24 px, deux cartes) se juge aussi bien dans l'un que dans l'autre.
2. **Note « ma réplique à moi »** : l'architecture la place sous le geste d'une fiche. Dans la maquette elle est dans la carte du premier pas de l'accueil (la demande listait « note » parmi les éléments de l'accueil). À confirmer.
3. **Cloche** : choix de l'option (reco 1, section 2).
4. **Compte à rebours** de 10 secondes (désactivé la première fois, activable ensuite) : ni interrupteur ni minuteur rendus ; un contrôle d'activation reste à dessiner si l'architecture le garde.
5. **Barre** : « Plus » défile avec les autres entrées (pas épinglé) ; à 320 px la loupe est masquée (comme le `min-[440px]` actuel de l'en-tête). 6.2 demande la recherche en bouton icône de 44 px : où la recherche vit sous 360 px reste à décider avec @ux.
6. **Textes de maquette marqués [HYPOTHÈSE], à écrire par @copywriter** : les deux accroches de rafale ; libellés « Contenu du jour », « Ton premier pas », « Étape en cours », « Le contexte », « Laquelle convient au contexte ? », « Type de message », « Ton message », « Poser une question », « Retirer de mon historique », « Notifications » (titre du panneau), « Ton message » et « Réponse de l'équipe » dans le fil ; annonces `aria-live` (« Vanne affichée : Soirée ») ; descriptions des trois types (reprises mot pour mot de 2.6, à passer en tutoiement si besoin).
7. **Textes absents, laissés vides proprement** (jamais inventés) : la vanne, le conseil et la vidéo du jour, le titre de l'étape en cours, l'extrait et la réponse de l'équipe dans le fil, les exemples d'état vide pour « Un problème » et « Une situation à gérer » (seul « Une question » en a un dans l'architecture). Ils sont rendus entre crochets et en gris : à remplacer par du contenu réel avant toute lecture visuelle « finale ».
8. **Données d'exemple** : « 3 jours de pratique d'affilée », « cap 3 sur 5 », « Étape 3 sur 6 » (Confiance), dates d'envoi et de réponse, « La lettre du jeudi 12 novembre » sont des valeurs de démonstration, pas des données.
9. **Non rendus** (hors périmètre demandé, donc E5 n'est pas complet) : carte « Et toi ? » ; carte de révision avec la note affichée APRÈS la réponse ; « C'est tout pour aujourd'hui » est rendu, pas l'ordre de tirage ; écran après paiement et page de succès ; « Mes répliques » ; mission ; bloc « Ton mois » ; menu de compte ouvert.
10. **Pas de bonus d'humoriste affiché** : aucun bonus de cap n'est rendu, sauf le raccourci « Tes bonus » (`#bonus`).

## 6. Captures à faire (par la session principale) puis relecture @design
- `aujourdhui.html` : défaut à 320, 375, 768, 1280 ; `#etat=rafale` et `#etat=reprise` à 375 ; `#cloche=reponse&ouvert` à 375 (feuille) et 1280 (fenêtre) ; `#option=2` et `#option=3` à 375 ; `#bonus` ; `#serie=0` ; à 200 % de texte à 375.
- `carte-rafale.html` : défaut à 320, 375, 1280 (deux variantes côte à côte à 1280) ; `#etat=attente`, `#etat=reponses`, `#etat=regle` à 375.
- `mes-questions.html` : défaut à 320, 375, 768, 1280 ; `#etat=vide`, `#etat=retard`, `#etat=fil`.
- Mesures à relever : largeur de chaque libellé de la barre à 320 et 375, coupure de la 4e entrée, hauteur en-tête + barre (111 px attendus), absence de défilement horizontal de la page, cibles de 44 px.
- Au clavier : Tab dans la barre (entrée ramenée dans la vue), menu Plus (flèches, Échap, focus rendu), panneau de la cloche (focus piégé, Échap, retour au bouton). Au lecteur d'écran : « Étape 3 sur 6 » puis « Ton cap… » ne se prennent pas pour un même compte ; la vanne change sans double lecture ; le nom de la cloche n'est pas annoncé en direct.

## Handoff → @orchestrator (session principale)
- Fichiers : `docs/espace-client/etalons/e5/aujourdhui.html`, `carte-rafale.html`, `mes-questions.html` ; ce document.
- Décisions prises : barre de six entrées C1 qui défile (Plus avec les autres), une seule action principale par état, boutons Oui / À moitié / Rien de même poids, cloche option 1 (reco), flamme SVG violette, aucun nouveau token.
- Points d'attention : conflit série et Ton cap sur l'accueil contre 4.4 et 6.3 (section 5.1) ; écart 12 px ; textes de maquette en HYPOTHÈSE (section 5.6) ; aucune capture vue, 10 critères non scorés.
