# Mes questions, Mes répliques, La lettre, Profil : spec UX s26

Spec @ux pour @fullstack (et @design là où c'est dit). Espace ouvert seulement (`ESPACE_CLIENT_PUBLIE = true`), site actuel identique. Sources : `reprise-s26.md` §2, §4, §5 ; `founder-preferences.md` 14/11 au 19/11 ; modèle `rubriques-premium-s26.md` ; code des pages. Captures s25 non rouvertes pour cette spec (lecture du code seul) : les critères mesurés ci-dessous se vérifient sur les nouvelles captures 375/768/1280.
Règles communes : échelle `typo.ts` (4 tailles, 600 et 400, aucune capitale), un seul aplat violet par écran, aucun vide > 32 px au milieu d'un bloc, 12 colonnes (aperçus 8/4 comme Aujourd'hui), titre BLANC aligné à gauche (plus de `EN_TETE_CENTRE` ni de H1 centré), aucun texte neuf hors `[TEXTE À VALIDER]`, zéro tiret cadratin, cibles >= 44 px, aucun émoji. Aucune donnée d'abonné simulée.
Comptes : visiteur, inscrit gratuit (même aperçu, le visiteur a en plus « Connexion »), abonné avancé (historique, cap > 1), nouvel abonné (rien encore écrit ni envoyé). Ancien abonné : inchangé (`/abonnement`, lecture seule dans Profil).

## 1. Mes questions (`/mon-espace/questions`, fil `/mon-espace/questions/[id]`)

### 1.1 Aperçu : PASSE au modèle verrouillé (`apercu-questions.tsx`, `ApercuVerrouille`)
- Décisions du 15/11 : l'aperçu montre l'état « Mes envois » sans envoi, jamais une question ni une réponse d'abonné. Extrait = contenu existant seulement.
- Hero (8/4) : promesse `[TEXTE À VALIDER]` (proposition : « Pose ta question, l'équipe te répond. ») ; bouton d'offre en haut ; ajouter `mesQuestions` à `apercu/offre-en-haut.ts`.
- Rangée 1 (7/5 dès 1024). Gauche : tuile « Mes envois » EN CLAIR : `Q.envois.titre`, les exemples de message par type (un par type, `Q.types[...]`, issus de `EtatVideQuestions`, déjà validés) et le délai de réponse existant. Droite : tuile « Ton historique » fermée : trois lignes de barres verrouillées (verrou + barres, aucune chaîne de question ou de réponse), libellés des statuts existants (envoyé, répondu) en pastilles inertes `[À VÉRIFIER @fullstack : constantes de statut]`.
- Rangée 2 (sous le fondu) : une tuile fermée « fil d'une réponse » (barres seules). Aucune réponse de l'équipe n'est écrite dans l'extrait.
- 375 : hero, offre, tuile « Mes envois » (titre + 2 exemples avant y = 760), historique fermé, fondu. 768 : 3/2 puis pleine largeur. 1280 : 7/5, bouton de fin à y > 900.
- Structure : OUI par rapport à l'ancien (colonne `max-w-3xl` centrée => grille 12), mais squelette du modèle réutilisé : @fullstack direct, pas de spec @design.

### 1.2 Abonné : STRUCTURE CHANGE (=> spec @design)
- Aujourd'hui : en-tête centré, `MesQuestions` pleine coque. Retour : plus de titre centré.
- Prochaine action : une réponse non lue = tuile en tête (type, première ligne de la réponse existante, bouton « Lire » existant = seul aplat). Sinon le bouton d'envoi du formulaire est l'aplat. Aucun texte neuf.
- Progression : compteur « répondues / envoyées » en `META` (chiffres seuls) au titre de l'historique ; la cloche existante reste le seul signal de nouveauté.
- Grille 1280 : formulaire d'envoi 4 col à gauche (sticky), historique 8 col (fils par statut, lignes en 1 colonne). 768 : formulaire pleine largeur replié (« Continuer » existant), historique dessous en 2 colonnes. 375 : formulaire puis historique, 1 colonne.
- Fil ouvert (`[id]`) : colonne de lecture gardée EN 8 col (une conversation se lit en ~70 caractères), encadrée à droite par un rail 4 col : retour à Mes questions, autres fils (titres + statut), « Retirer de mon historique » existant en bas du rail. 375 : rail sous le fil, retour en haut. Justification : fini la colonne seule centrée, le rail sert à passer d'un fil à l'autre sans revenir à la liste.
- États vides : nouvel abonné = `EtatVideQuestions` existant dans la colonne 8 (formulaire à gauche inchangé) ; chargement/erreur : `loading.tsx` et `error.tsx` existants ; fil inconnu ou d'un autre compte : 404 (inchangé) ; envoi en échec : le texte saisi est conservé.

## 2. Mes répliques (`/mon-espace/repliques`)

### 2.1 Aperçu : PASSE au modèle verrouillé (`apercu-repliques.tsx`)
- Extrait (aucune réplique d'abonné) : gauche 7 col, tuile EN CLAIR de la fiche désignée (`ficheApercu("mesRepliques")`, validée le 15/11) : titre, durée, consigne « À toi » (`G.aToi`) et le champ « Ma réplique à moi » (`G.note.label`, placeholder) en lecture seule inerte. Droite 5 col : tuile « Tes répliques » fermée : trois lignes de barres verrouillées (verrou), aucun texte de réplique.
- Rangée 2 sous le fondu : tuile fermée « modifier / supprimer » (libellés existants de `TEXTES_REPLIQUES` s'ils existent, sinon barres seules).
- Promesse `[TEXTE À VALIDER]` (proposition : « Tes meilleures répliques, au même endroit, prêtes pour le jour J. »). Ajouter `mesRepliques` à `offre-en-haut.ts`. Tailles et boutons comme §1.1.
- Après migration de Mes questions, Mes répliques, Quoi répondre, Bibliothèque et S'entraîner : `apercu-rubrique.tsx` et `exemple.tsx` n'ont plus d'appelant, suppression à vérifier par `Grep` avant.

### 2.2 Abonné : STRUCTURE CHANGE légère (=> @design, 1 écran)
- Aujourd'hui : titre centré, grille pleine coque déjà posée (`ListeRepliques grille`), état vide centré. Passage : titre à gauche ; 1280 liste en 3 colonnes (4/4/4), 768 2 colonnes, 375 1 colonne ; la plus récente d'abord (inchangé).
- Prochaine action : état vide = bouton « Écrire ma première réplique » (validé 14/11) = seul aplat, posé dans une tuile 8 col avec, à droite (4 col), le rappel de l'endroit où l'on écrit (lien vers « Quoi répondre », libellé existant de la bande). Avec des répliques : lien vers Quoi répondre en contour dans l'en-tête `[TEXTE À VALIDER]` (proposition : « Écrire une autre réplique »), aucun aplat (page de référence).
- Progression : compteur du nombre de répliques en `META` (chiffres seuls) à droite du titre.
- États : « Modifier » et « Supprimer » (confirmation existante) gardés ; suppression en échec : la carte reste ; ancien abonné : lecture seule dans Profil (inchangé).

## 3. La lettre (`/lettre`, `/mon-espace/lettres` => 308 vers `/lettre`, `/mon-espace/lettres/[numero]`)
- SEO, dit explicitement : la page porte `noindex` et `referrer: same-origin` dans le code (`NOINDEX_ROBOTS`), hors sitemap ; Thomas la dit « référencée » : à confirmer. AUCUN élément SEO touché : `metadata` (title, description, robots, referrer), H1, textes `TEXTES_LETTRE`, adresses, redirection 308, `?statut=` identiques. Seule la mise en page change, derrière l'interrupteur.
- Décisions tenues : une seule section pour tous (14/11) ; corps coupé partout (`min-w-0 [overflow-wrap:anywhere]`, 16/11) ; liens du corps sans `utm_*` (16/11, déjà codé).

### 3.1 Visiteur, inscrit gratuit, ancien abonné : inscription (STRUCTURE CHANGE => @design)
- Aujourd'hui : colonne `max-w-3xl` centrée (statut, formulaire, dernier numéro). Retour : colonne centrée seule interdite.
- 1280 : bandeaux `?statut=` en pleine largeur (12 col, inchangés) ; dessous gauche 7 col = `LettrePageInscription` (présentation, formulaire : bouton = seul aplat, au-dessus de y = 450) ; droite 5 col = « Dernier numéro » (`dernierNumero`, carte à filet, objet + corps coupé) en preuve de ce qu'on reçoit. 768 : inscription pleine largeur, dernier numéro dessous. 375 : inscription d'abord (bouton avant y = 700), dernier numéro ensuite, 0 px de défilement horizontal.
- Premier écran : promesse et champ e-mail visibles, aucun second bouton plein. États : aucun numéro envoyé = la colonne droite disparaît et l'inscription prend 12 col sans vide ; erreurs (`saisie-email`, `saisie-case`, `invalide`, `erreur`) conservées avec le formulaire ; confirmée/désinscrit : statut seul (inchangé). Pas de texte neuf.
- Compte gratuit déjà inscrit d'office : mêmes états qu'aujourd'hui (aucun changement de logique).

### 3.2 Abonné actif : archive (STRUCTURE CHANGE => @design)
- Aujourd'hui : H1 centré + cartes 2 colonnes dans `COLONNE_LECTURE`. Passage : H1 à gauche ; tuile pleine largeur « dernière lettre » (titre + objet) avec bouton `Lire` existant = seul aplat (prochaine action) ; dessous les précédentes en cartes à filet 3 col (1280), 2 col (768), 1 col (375).
- Progression : compteur « n lettres » en `META` ; « lues / envoyées » seulement si un état de lecture existe `[À VÉRIFIER @fullstack]`, sinon rien.
- Nouvel abonné : même vue, `ArchiveLettres` vide existant (« Tes lettres s'affichent ici dès leur envoi. » + « Aller à Aujourd'hui », validés 13/11) en 8 col + rail 4 col (lien vers Aujourd'hui). Lettre du jour de l'envoi : la dernière tuile suffit.

### 3.3 Une lettre (`/mon-espace/lettres/[numero]`)
- Colonne de lecture GARDÉE (une lettre est un texte long, ~70 caractères par ligne) mais encadrée : 1280 corps 8 col + rail 4 col sticky (retour « La lettre », lettre précédente et suivante en titres, tailles `typo.ts`). 768 : corps pleine largeur, rail dessous. 375 : retour en haut, corps, précédente/suivante en bas (cibles 44 px). Numéro inconnu ou non envoyé : 404 identique au site (inchangé).

## 4. Profil (`/profil`)
- Pas une rubrique Premium : pas d'aperçu verrouillé. Visiteur non connecté : carte « Connecte-toi pour voir ton profil » (existante) ; son emoji 🔒 est retiré en régime ouvert (remplacé par une icône SVG, règle sans émoji), fermé inchangé.
- Aujourd'hui : H1 et sous-titre centrés, cartes courtes 2 par ligne, longues en pleine largeur (`GROUPE_COURT`). STRUCTURE CHANGE (=> @design) : H1 et sous-titre à gauche ; 1280 : colonne principale 8 col (Reprendre le parcours, cap et progression `CapProfil`, Mes parcours) + colonne 4 col (Abonnement, Ton prénom, rappel du parcours, lettre hebdomadaire, Ta question à l'équipe) ; « Supprimer mon compte » en bas, pleine largeur, discret. 768 : une colonne, cartes courtes 2 par ligne (existant). 375 : 1 colonne, ordre : prochaine action, abonnement, progression, réglages, suppression.
- Inscrit gratuit : Abonnement en tête de la colonne 4 avec le bouton d'offre (seul aplat), rien de Premium simulé ; pas de progression d'abonné. Abonné avancé : prochaine action = Reprendre le parcours (bouton existant, seul aplat) ; progression = cap + barre vers le suivant (`getXpProgress`, existants) + `StreakCounter`. Nouvel abonné : cap 1, série à zéro (texte validé « Ta série démarre à ta prochaine pratique. »), parcours vide avec son lien existant.
- États : lecture du compte en échec = `ErreurProfil` existant ; chargement : squelette existant ; `?upgrade=` toast inchangé ; ancres `#abonnement` et `#rappel-parcours` conservées (liens d'e-mails) ; ancien abonné : Mes questions et Mes répliques en lecture seule sous les cartes, inchangé.

## 5. Critères chiffrables (gate mesurée, 4 comptes, 375 et 1280)
1. Aperçus : <= 4 tailles et <= 6 combinaisons au premier écran ; 1 aplat violet ; bouton d'offre haut à y < 700 (375) et < 450 (1280) ; bouton de fin à y > 812 (375) et > 900 (1280) ; extrait `aria-hidden`, 0 élément focusable, inertie 47/47 intacte.
2. Verrouillage : 0 occurrence de toute question, réponse ou réplique d'abonné dans le HTML et le payload RSC des aperçus (2 tests Jest).
3. Largeur : à 1280 aucune colonne centrée seule ; contenu sur 12 col ; largeur utile >= 1100 px (lecture d'une lettre ou d'un fil : corps >= 600 px et <= 760 px + rail).
4. Abonné : une seule action pleine par écran ; un compteur ou une progression visible au premier écran quand la donnée existe ; chaque liste a son compteur.
5. `/lettre` : scrollWidth = largeur de fenêtre à 375, 320 et 1280 ; 0 lien `utm_` ; métadonnées, H1, 308 identiques octet pour octet (test d'inertie fermé inchangé).
6. Mesure (P0 s11) : fichiers touchés et lignes ajoutées/retirées par page dans le rapport @fullstack.
7. Événements : conserver `apercu-questions`, `apercu-repliques` (`sourceApercu`), `ouverture`/`archive-lettres` (`compterAnonyme`) ; ajouter un event par clic de bouton d'offre, d'inscription et de « Lire » via @data-analyst.

## 6. Qui fait quoi
| Page | Structure changée | Suite |
|---|---|---|
| Mes questions aperçu | Oui (grille 12 col, squelette du modèle) | @fullstack direct |
| Mes questions abonné + fil | Oui | @design puis @fullstack |
| Mes répliques aperçu | Oui (idem) | @fullstack direct |
| Mes répliques abonné | Légère | @design (1 écran) puis @fullstack |
| La lettre (3 vues) | Oui | @design puis @fullstack |
| Profil | Oui (8/4) | @design puis @fullstack |

## 7. [TEXTE À VALIDER] (une proposition chacun, ton `docs/copy/ton-alex.md`)
1. Promesse aperçu Mes questions : « Pose ta question, l'équipe te répond. »
2. Promesse aperçu Mes répliques : « Tes meilleures répliques, au même endroit, prêtes pour le jour J. »
3. Lien en tête de Mes répliques (abonné avec répliques) : « Écrire une autre réplique ».
Aussi à trancher par Thomas (aucun texte) : `/lettre` est `noindex` dans le code, la dire « référencée » est-il exact ?

Handoff -> @fullstack : aperçus Mes questions et Mes répliques (§1.1, §2.1) tout de suite, avec les 2 tests de verrouillage.
Handoff -> @design : abonné Mes questions et fil (§1.2), Mes répliques (§2.2), La lettre (§3), Profil (§4).
Handoff -> @copywriter : 3 textes du §7 (promesses), validation Thomas avant code.
