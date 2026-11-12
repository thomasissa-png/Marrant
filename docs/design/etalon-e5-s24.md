# Étalon E5 : rendu de l'espace Premium (s24)

> Auteur : @design, 12/11/2026. Trois maquettes HTML locales, jamais déployées, rien dans `apps/web` : `docs/espace-client/etalons/e5/aujourdhui.html`, `carte-rafale.html`, `mes-questions.html`. CSS inline, aucune ressource externe sauf Inter et Plus Jakarta Sans (déjà celles du site). Thème sombre natif (le site est 100 % sombre).
> **v2 (architecture v20 fait foi)** : quatre maquettes (`parcours.html` ajoutée). Corrections de la v1 : « Ton cap » quitte l'accueil pour « Parcours » ; la série et le cap ne vivent dans « Aujourd'hui » que dans « Ton mois » ; la note « ma réplique à moi » quitte la carte du premier pas et se rend sous le geste d'une fiche, puis dans la révision après la réponse ; le premier écran d'Aujourd'hui à 375 px est allégé (test N4).
> **Captures v1 lues par @design** (`docs/captures/s24-e5/`, `aujourdhui-375.png` et `carte-rafale-375.png`) : pas de débordement horizontal visible, indice de suite de la barre lisible à 375 (« Bib » coupé + chevron), boutons Oui / À moitié / Rien lisibles et égaux. Les autres captures n'ont pas été relues et les 10 critères ne sont pas scorés. Les mesures de v2 (N2, N4) sont **estimées, à vérifier sur les nouvelles captures**.
> Sources : architecture v19 (2.2, 2.6, 2.9, 4.4, 6.1 à 6.3, 9 E5), `niveaux-xp-s24.md` 3.0, `etalons-barre-espace-s24.md`, `etalons-espace-s24.md` E1.1, `founder-preferences.md` l. 161 à 171.

## 0. v3 (mesures de la session sur les captures v2)
- **Erreur JS de `carte-rafale.html` corrigée** : la boucle de création des cartes visait toutes les `.var`, y compris les sections ajoutées en v2 qui n'ont pas de `.slot` ; elle ne vise plus que `.var[data-v]`. Conséquence : `#etat=revision-avant` (boutons seuls, aucune note) et `#etat=revision` (« Oui » choisi, répliques révélées, « Ta réplique la dernière fois : [ta réplique enregistrée] » et étiquette « À revoir ») diffèrent maintenant. Autre défaut trouvé à la lecture : l'étiquette « À revoir » restait visible partout (règle `.tag` plus tardive que `.rev-tag`) ; corrigé.
- **Débordement de 56 px à 200 %** : cause identifiée sur la capture `parcours-375-zoom200.png` (le trait de la barre s'arrête avant le bord, l'icône du compte est coupée) : l'en-tête. Le logo (`white-space:nowrap`, environ 125 px) plus deux icônes de 44 px dépassent les 164 px utiles d'un viewport de 188 px. Sous 300 px de large le logo passe à la ligne (12 px, deux lignes, environ 62 px), les écarts de l'en-tête tombent à 0 à 4 px : environ 178 px sur 188. Appliqué aux quatre maquettes. Les boutons ont `max-width:100%` par sécurité. À vérifier sur capture.
- **N2 à 200 % (2,15 écrans, limite 2)** : sous 300 px de large, `parcours.html` se compacte sans déplacer « Ton cap » : H1 24/32, marges de page et du titre 16 px, cartes à 12 px de marge avec 8 px entre éléments, série et cap en 14/20, pastilles de 12 px avec 4 px d'écart, titre de liste et cartes de parcours resserrés. Les 24 px entre l'étape et « Ton cap » sont conservés. Gain estimé 70 à 80 px CSS ; **à mesurer** (objectif : moins de 2 écrans).
- **N4, carte du premier pas** : `min-height` supprimé. La carte garde sa hauteur naturelle ; elle est plus généreuse sous 1024 px (marge 24 px, titre 24/32, bouton pleine largeur de 48 px) et 48 px d'espace sont ajoutés sous elle (72 px avec le gap). Même résultat attendu au premier écran de 375 px sans boîte vide. À 200 % de texte, marge 16 px et titre 20/28. À vérifier sur capture ; sur un téléphone plus court que 667 px, le haut de « Contenu du jour » peut entrer dans le premier écran.
- Métadonnées des parcours de `parcours.html` : alignées par la session sur `llms.txt/route.ts` (Confiance sans niveau ; Storytelling et Boulot « débutant à intermédiaire »), non modifiées. Le §1.3 bis de la v2 qui citait « débutant » ou « intermédiaire » par parcours est remplacé par cette règle.

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
- **Étape en cours** (carte « Reprendre », principale à l'état « rafale faite ») puis **« Ton mois »** : seul endroit d'Aujourd'hui où la série et le cap figurent (4.4), empilés (série avec **flamme SVG décorative** violette `accent-primary-hover`, jamais un émoji ; « Tu avances bien · cap 3 sur 5 », lu « Tu avances bien, cap 3 sur 5 » ; cinq pastilles `aria-hidden`, pleine ou contour au même contraste 3:1). État 0 : `#serie=0`. « Ton mois » est absent tant que rien n'est fait (état arrivée). Le contenu chiffré de « Ton mois » (situations jouées, étapes validées, courbe) n'est pas rendu : aucune valeur n'existe.
- **Densité N4 (premier écran à 375 px)** : à l'arrivée (`#etat=pas` et `#etat=apres-paiement`) l'écran contient le H1, le repère « 12 cartes cette semaine » et la carte du premier pas avec son seul bouton « Commencer ». Le champ de la note est retiré. La carte du premier pas prend `min-height: calc(100svh - 300px)` sous 1024 px pour qu'aucune autre action n'entre dans le premier écran ; le contenu du jour passe avant la rafale et « Ton mois » est masqué dans cet état. La question de la décision C9 n'est pas rendue (jamais avant le premier pas fait). Estimation : le bas de la carte tombe à environ 56 px sous le bas de l'écran de 667 px ; à vérifier sur capture.
- **Juste après le paiement** (`#etat=apres-paiement`) : même écran que l'arrivée, plus une ligne de confirmation « Ton favori est ajouté. » au-dessus (sans bouton de fermeture : aucun geste de plus). Texte [HYPOTHÈSE], à écrire par @copywriter. La page de succès avec « Continuer » dominant n'est pas rendue.

### 1.3 Carte de rafale
- Carte « Coloc : la poêle » (texte de E1.1, tel quel) : scène, contexte (« La coloc rit déjà de ces dimanches, et ton colocataire range tout, toujours », contexte 1 de E1.1), « Ta réponse d'abord » (texte de E1.1), « Prends ton temps », puis « Tu avais une réponse ? » avec **trois boutons de même poids** (Oui, À moitié, Rien : aucun n'est mis en avant, aucun vert ni rouge). Un seul toucher les verrouille et révèle les répliques (la sûre, la joueuse, la risquée, textes de E1.1) ; un choix affiche « Ici : la joueuse » et l'explication de E1.1, puis la règle « Comment choisir » de E1.1. Aucun verdict en couleur (rien ne juge).
- **Révision** : `#etat=revision-avant` (avant le toucher : aucune note visible nulle part, critère d'E5) et `#etat=revision` (après le toucher : « Ta réplique la dernière fois : [ta réplique enregistrée] » apparaît dans le bloc des répliques, plus l'étiquette « À revoir »). Le contenu de la note est un crochet : c'est une donnée de l'abonné.
- **« Ma réplique à moi » sous le geste d'une fiche** : le geste est celui de E1.1 (« À toi », poêle) ; états `#note=vide|saisie|enregistree|echec|confirmer|supprimee` : vide (« Écris ta version, en une phrase »), saisie (compteur, jamais d'alerte rouge), « Enregistrée », échec sans perte (« L'enregistrement n'a pas abouti. Ton texte est toujours là. » [HYPOTHÈSE], bouton « Réessayer », texte conservé), suppression avec confirmation (« Supprimer cette réplique ? » [HYPOTHÈSE], « Supprimer » / « Annuler »), « Supprimée » [HYPOTHÈSE]. Aucune limite de caractères affichée ([RESTE À TRANCHER] de 2.7). Jamais de « Fait » ni de points.
- **Carte « Et toi ? »** : scène, « Ta réponse d'abord », trois boutons, puis les deux réponses avec leurs étiquettes « détendue » et « tendue » et « Le pourquoi » ; sans choix. Tous les contenus sont des crochets (aucune fiche du carnet n'a été lue). La carte « Quel registre ? » est la poêle elle-même. **« C'est tout pour aujourd'hui »** : carte seule sur cette page et état `#etat=reprise` de l'accueil.
- **Pas de compte à rebours** : 2.2 le désactive la première fois ; le « Prends ton temps » de 3 secondes est rendu (`#etat=sequence`, séquence rejouable), sans animation. États : `#etat=attente`, `boutons` (défaut), `reponses`, `regle`.
- Deux accroches côte à côte (dès 1024 px, sinon empilées), même carte dessous. A : avec « l'esprit de l'escalier » (trouver la bonne réponse trois jours trop tard) ; B : sans ce mot. **Les deux phrases sont des textes de maquette [HYPOTHÈSE]** : à écrire et à passer à l'aveugle par @copywriter ; je n'ai pas qualité pour trancher la formulation.
- Les boutons passent en une colonne sous 360 px (80 px de large par bouton à 320 ne tiennent pas « À moitié » avec des marges lisibles).

### 1.3 bis Parcours (`parcours.html`)
- Ordre (4.4 et 6.3) : H1, **bloc d'en-tête** (« Tes 4 premières semaines » + étape à reprendre, bouton « Reprendre » principal), **carte « Ton cap »** (niveau 2 propre, **24 px** d'écart, aucun mot « étape » ni compteur d'étapes dedans), raccourci « Tes bonus » seulement avec `#bonus`, puis la liste des 5 parcours (nom, nombre d'étapes, minutes par semaine, niveau, tirés de `config/premium.ts` et des seeds cités par l'architecture). Jamais en tête, jamais après la liste.
- Carte compacte : série sur sa ligne (flamme décorative), nom du cap et échelle, cinq pastilles ; empilée sous 768 px, série et cap sur une même ligne dès 768 px ; pas de hauteur fixe (200 % de texte). La phrase d'aide de la série n'est pas répétée ici (elle reste dans « Ton mois ») pour réduire la carte.
- **Test N2** : estimation à 375 px : H1 fini vers 111 + 24 + 60 = 195 px, bloc de l'étape environ 195 à 410, carte « Ton cap » environ 434 à 600, premier parcours vers 650 + 56 = 700 px, donc dans le deuxième écran (limite : deux écrans). Actions principales : « Reprendre », « Tes bonus » (si ouvert), un parcours : 3 au plus. À 200 % de texte l'estimation ne tient pas : à vérifier sur capture ; réduction prévue sans déplacer la carte : retirer la ligne de pastilles à 200 % ou la passer sur la ligne du nom.
- Libellé « Les parcours » (titre de la liste) : [HYPOTHÈSE], à écrire.

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

1. **Résolu en v2** : « Ton cap » est dans « Parcours », la série et le cap dans « Ton mois » seulement (architecture v20).
2. **Résolu en v2** : la note est sous le geste d'une fiche et, en révision, après la réponse.
3. **Cloche** : choix de l'option (reco 1, section 2).
4. **Compte à rebours** de 10 secondes (désactivé la première fois, activable ensuite) : ni interrupteur ni minuteur rendus ; un contrôle d'activation reste à dessiner si l'architecture le garde.
5. **Barre** : « Plus » défile avec les autres entrées (pas épinglé) ; à 320 px la loupe est masquée (comme le `min-[440px]` actuel de l'en-tête). 6.2 demande la recherche en bouton icône de 44 px : où la recherche vit sous 360 px reste à décider avec @ux.
6. **Textes de maquette marqués [HYPOTHÈSE], à écrire par @copywriter** : les deux accroches de rafale ; libellés « Contenu du jour », « Ton premier pas », « Étape en cours », « Le contexte », « Laquelle convient au contexte ? », « Type de message », « Ton message », « Poser une question », « Retirer de mon historique », « Notifications » (titre du panneau), « Ton message » et « Réponse de l'équipe » dans le fil ; annonces `aria-live` (« Vanne affichée : Soirée ») ; descriptions des trois types (reprises mot pour mot de 2.6, à passer en tutoiement si besoin).
7. **Textes absents, laissés vides proprement** (jamais inventés) : la vanne, le conseil et la vidéo du jour, le titre de l'étape en cours, l'extrait et la réponse de l'équipe dans le fil, les exemples d'état vide pour « Un problème » et « Une situation à gérer » (seul « Une question » en a un dans l'architecture). Ils sont rendus entre crochets et en gris : à remplacer par du contenu réel avant toute lecture visuelle « finale ».
8. **Données d'exemple** : « 3 jours de pratique d'affilée », « cap 3 sur 5 », « Étape 3 sur 6 » (Confiance), dates d'envoi et de réponse, « La lettre du jeudi 12 novembre » sont des valeurs de démonstration, pas des données.
9. **Non rendus** (E5 reste incomplet) : ordre de tirage ; page de succès avec « Continuer » dominant et lien de renonciation ; écran « Mes répliques » ; mission et question de bilan ; contenu chiffré de « Ton mois » ; retour de la note sous « Ce soir » ; menu de compte ouvert ; la question de la décision C9.
10. **Pas de bonus d'humoriste affiché** : aucun bonus de cap n'est rendu, sauf le raccourci « Tes bonus » (`#bonus`).

## 6. Captures à faire (par la session principale) puis relecture @design
- `aujourdhui.html` : défaut (arrivée) à 320, 375, 768, 1280, **N4 : premier écran à 375** ; `#etat=apres-paiement` à 375 ; `#etat=rafale` (avec « Ton mois ») et `#etat=reprise` à 375 ; `#cloche=reponse&ouvert` à 375 (feuille) et 1280 (fenêtre) ; `#option=2` et `#option=3` à 375 ; `#serie=0` à 375 sur `#etat=rafale` ; à 200 % de texte à 375.
- `parcours.html` : défaut à 320, 375, 768, 1280 ; `#bonus` à 375 ; **N2 : à 375 et à 200 % de texte, relever où tombe le premier parcours (deux écrans au plus) et compter les actions principales (3 au plus)**.
- `carte-rafale.html` : défaut à 320, 375, 1280 (deux variantes côte à côte à 1280) ; `#etat=attente`, `#etat=reponses`, `#etat=regle` à 375 ; `#etat=revision-avant` et `#etat=revision` à 375 ; `#note=vide|saisie|enregistree|echec|confirmer|supprimee` à 375.
- `mes-questions.html` : défaut à 320, 375, 768, 1280 ; `#etat=vide`, `#etat=retard`, `#etat=fil`.
- Mesures à relever : largeur de chaque libellé de la barre à 320 et 375, coupure de la 4e entrée, hauteur en-tête + barre (111 px attendus), absence de défilement horizontal de la page, cibles de 44 px.
- Au clavier : Tab dans la barre (entrée ramenée dans la vue), menu Plus (flèches, Échap, focus rendu), panneau de la cloche (focus piégé, Échap, retour au bouton). Au lecteur d'écran : « Étape 3 sur 6 » puis « Ton cap… » ne se prennent pas pour un même compte ; la vanne change sans double lecture ; le nom de la cloche n'est pas annoncé en direct.

## Handoff → @orchestrator (session principale)
- Fichiers : `docs/espace-client/etalons/e5/aujourdhui.html`, `parcours.html`, `carte-rafale.html`, `mes-questions.html` ; ce document.
- Décisions prises : barre de six entrées C1 qui défile (Plus avec les autres), une seule action principale par état, boutons Oui / À moitié / Rien de même poids, cloche option 1 (reco), flamme SVG violette, aucun nouveau token.
- Points d'attention : tests N2 et N4 estimés, à vérifier sur les captures v2 ; écart 12 px ; textes de maquette en HYPOTHÈSE (section 5.6, plus « Ton favori est ajouté. », « Les parcours », textes d'échec et de suppression de la note) ; 10 critères non scorés.
