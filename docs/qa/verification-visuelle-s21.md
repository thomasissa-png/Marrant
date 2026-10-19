# Vérification visuelle réelle s21 (local, deux branches non déployées)

> @qa, session 21, 17/10/2026. Local uniquement : aucune requête vers la production, aucune base de production, aucun déploiement.
> Captures : `docs/qa/captures-s21/` (PNG palette 256 couleurs, échelle 1). Toutes les observations ci-dessous sont **[LIVE]** (Chromium réel sur l'app construite en local, `next build` + `next start`, captures relues une à une), sauf mention contraire.

## Conditions du test

- Lettre : `claude/marrant-s21-lettre` @ `09f6e35`, worktree existant. Lot 2 : `claude/marrant-s21-lot2-boutons` @ `a1f08e2`, worktree temporaire `qa-lot2` (supprimé à la fin).
- Base PostgreSQL 16 jetable (`/var/lib/postgresql/qa-jetable`, port 5499), schéma poussé + seed du dépôt, **supprimée** à la fin.
- Serveurs lancés avec un environnement vide (`env -i`) : aucun secret réel chargé (ni Stripe, ni Resend, ni Anthropic). Secret NextAuth factice local.
- Interrupteur lettre : `LETTRE_OUVERTE = true` modifié localement le temps du test, puis `git checkout` (vérifié : `false`, worktree propre). Rien de commité.
- Lot 2 : `STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_qa_local_fictif` (valeur factice) pour que `/abonnement` affiche la formule annuelle. Aucun paiement tenté.
- Le mode `next dev` est inutilisable pour ce test : la CSP refuse `unsafe-eval`, React ne s'hydrate pas et le formulaire part en POST natif. D'où le build de production local.
- État « succès » de `/lettre` : l'API locale répond 500 (pas de service d'e-mail, alerte admin `email-envoi-lettre-confirmation` journalisée localement, rien envoyé). Réponse 200 **simulée** par Playwright pour afficher l'état. L'enregistrement réel avec envoi reste à tester : **[STATIQUE UNIQUEMENT pour l'envoi : pas de clé Resend en local, volontairement]**.

## 1. Branche `claude/marrant-s21-lettre`

### 1.1 Réserve @legal R2 (case et mention visibles ensemble sur mobile) : CONFORME

Mesures à 375×812 (bounding boxes réelles) :

| Emplacement | Haut de la case | Bas de la mention | Écart | Tient dans 812 px |
|---|---|---|---|---|
| Fin d'article | 276,6 | 540,6 | 264 px | oui, avec le titre du bloc et le bouton |
| `/lettre` | 425,8 | 689,8 | 264 px | oui, sans défilement depuis l'arrivée sur la page |

À 1280×800 : 88 px (article), 120 px (page). Case, bouton et mention sont toujours dans le même écran.

### 1.2 Captures

**`lettre-375-article-bloc-fin-et-lettre.png`, `lettre-375-article-fin-viewport.png`** (fin d'article `comment-devenir-drole`)
- Conforme : le bloc lettre est placé sous la carte Premium et séparé par un filet, sans carte ni fond. Le bouton « Accéder aux parcours complets » reste le **seul bouton violet plein** de la zone. Le bouton lettre (contour gris neutre) ne le concurrence pas. Le texte de la case est lisible et la case fait 24 px dans une zone tactile de 44 px.
- Non conforme (typo, bloquant à corriger avant ouverture) : la mention se termine par « Détails et droits » puis un retour à la ligne, et **« : Confidentialité » commence la ligne suivante**. L'espace avant les deux-points est sécable. Le lien en `inline-flex min-h-11` ajoute en plus une ligne haute de 44 px qui décolle « : Confidentialité » du reste de la mention.
  - Correction proposée : espace insécable (U+00A0, ou U+202F fine) avant « : » dans `TEXTES_LETTRE.formulaire.mention`, et plus généralement avant chaque « : ? ! » des textes de la lettre (`erreurs.email`, « Mauvaise adresse ? », « Rien au bout de quelques minutes ? »). Sur mobile, mettre le lien en `inline-block` avec padding vertical plutôt qu'en `inline-flex min-h-11`, ou bien faire précéder le lien d'une espace insécable pour garder « droits : Confidentialité » ensemble.
- Observation (non bloquante) : sur mobile, le bloc lettre (450 px) est presque aussi haut que la carte Premium (430 px). Le champ blanc et la case blanche sont les éléments les plus clairs de l'écran. Ça reste lisible comme un « en plus », mais si la mesure du lot 1 montre une baisse des clics Premium après l'ouverture, réduire ce bloc en priorité (texte de la case replié sous un « détails », par exemple, après accord @legal).

**`lettre-1280-article-bloc-fin-et-lettre.png`, `lettre-1280-article-fin-viewport.png`**
- Conforme : carte Premium intacte au-dessus, bloc lettre sous le filet, mention sur une seule ligne avec « Détails et droits : Confidentialité » ensemble.
- Non conforme (UX et accessibilité, à corriger) : sur desktop, le bouton « Envoie-moi la lettre » est placé **à droite du champ, au-dessus de la case**. L'ordre visuel est donc champ, bouton, case, alors que l'ordre du clavier est champ, case, bouton (WCAG 2.4.3). On clique sur le bouton avant d'avoir vu la case, et on tombe sur l'erreur « Coche la case ».
  - Correction proposée : en `sm:`, garder une seule colonne (champ, case, bouton) ou mettre le bouton sur la ligne 3, alignée à droite sous la case (`sm:row-start-3`).
- Observation : le bouton lettre a la même taille et la même graisse que « Étape 1 gratuite : Répartie », ce qui fait 3 boutons dans 250 px. Le violet plein de Premium reste dominant. Acceptable.

**`lettre-375-page-vide.png`, `lettre-375-page-vide-pleine.png`, `lettre-1280-page-vide.png`, `lettre-1280-page-vide-pleine.png`** (`/lettre`, état vide)
- Conforme : H1 unique, phrase d'accroche, champ, case, bouton, réassurance « Gratuit, sans compte. » et mention. Tout l'écran tient sans défilement à 375 et à 1280. « Détails et droits : Confidentialité » reste groupé sur `/lettre` (largeur différente), mais le défaut d'espace sécable du §1.2 est le même.
- Observation à vérifier sur appareil réel : à 375 px, le H1 affiche « décryptée , » avec un espace apparent avant la virgule. Le HTML est correct (`décryptée, chaque mois`), et ce n'est pas visible à 1280. C'est probablement une approche de la police d'affichage. Pas de correction de code proposée tant que ce n'est pas confirmé sur iPhone.

**`lettre-375-page-erreur-adresse.png`, `lettre-1280-page-erreur-adresse.png`** (saisie `yanis@gmail`)
- Conforme : le champ passe en contour violet (focus), le message rouge « ! Cette adresse n'a pas l'air complète. Un exemple : toi@exemple.fr » s'affiche sous le champ avec `role="alert"`, rien n'est envoyé, la case et la mention restent visibles.
- Non conforme (typo) : à 1280, le message est contraint à la colonne du champ et casse en « Un exemple / : toi@exemple.fr », avec les deux-points en début de ligne. Correction : même espace insécable que ci-dessus dans `erreurs.email`.

**`lettre-375-page-succes.png`, `lettre-1280-page-succes.png`** (état « Regarde ta boîte mail. », réponse API simulée)
- Conforme : titre, consigne avec le nom exact du bouton (« Confirmer mon adresse »), rappel spams, compte à rebours « Renvoyer l'e-mail dans 60 s » grisé, lien « Mauvaise adresse ? La corriger ». La hauteur du bloc est conservée (pas de saut de mise en page).
- Observation : la hauteur conservée laisse environ 200 px de vide sous le message avant le pied de page. C'est voulu (spec), et c'est acceptable.

**`lettre-375-pied-de-page.png`, `lettre-1280-pied-de-page.png`**
- Conforme : « La lettre du mois » est présent, juste après « Quiz humour » dans l'ordre du DOM (colonne 1 visuellement, entre « Glossaire » et « Nos offres »). Le style est identique aux autres liens.

## 2. Branche `claude/marrant-s21-lot2-boutons` (375×812)

**`lot2-375-abonnement-mensuel.png`, `lot2-375-abonnement-mensuel-pleine.png`**
- Conforme : surtitre « C'est pour toi si tu restes muet quand on te chambre. », H1, prix « 2,99 € TTC / mois », ligne « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an. », réassurance unique sous le bouton, extrait du carnet avant « Pas encore sûr ? ». « plus de 3 mois offerts » apparaît **1 fois** (comptage du texte rendu). « Sans engagement » n'apparaît plus sur la page.
- Non conforme (bloquant, sens trompeur) : à 375 px, la pastille « plus de 3 mois offerts » **passe à la ligne et se retrouve sous « Mensuel »**, qui est sélectionné (violet plein). On peut comprendre que le mensuel donne 3 mois offerts. Le commentaire du code dit « sur la pastille Annuel », mais le rendu mobile ne le fait pas.
  - Correction proposée : intégrer le badge DANS le libellé de l'option Annuel (« Annuel » + petite pastille accolée, `whitespace-nowrap`), ou le positionner en exergue au-dessus du bord de la pastille Annuel (badge en `absolute -top-2 right-0`). Il faudra vérifier qu'il reste attaché à « Annuel » à 320, 375 et 1280.

**`lot2-375-abonnement-annuel.png`, `lot2-375-abonnement-annuel-pleine.png`** (cas non relu à l'aveugle)
- Conforme : « plus de 3 mois offerts » apparaît **une seule fois** (la pastille disparaît, la ligne sous le prix le dit : « soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an »). Prix « 24,99 € TTC / an », « Payé en une fois, renouvelé chaque année, résiliable depuis ton profil », bouton « Commencer à 24,99 €/an », même réassurance qu'en mensuel.
- Observation : la ligne violette sous le prix enchaîne trois chiffres (2,08 €, 3 mois, 10,89 €) sur deux lignes, ce qui fait dense mais lisible. Pas de correction exigée. C'est à soumettre à la relecture à l'aveugle annuelle qui manque encore.

**`lot2-375-video-verrouillee.png`** (fiche `roman-frayssinet-lintelligence-des-animaux`, visiteur)
- Conforme : encart « Analyse pédagogique complète », bouton violet plein « Voir ce que contient Premium » (forme longue du mur), lien secondaire « Voir toutes les vidéos ». Le bloc « Dans un parcours » au-dessus utilise un bouton contour.
- Observation (cohérence) : le bouton du bloc parcours dit « Lire la première étape gratuite **du parcours** Confiance », alors que les encarts d'article disent « Lire la première étape gratuite **de** Répartie ». Ce sont deux formes pour le même bouton. Correction proposée : passer `FicheParcoursLien` par `etape1GratuiteBouton()` (ou faire l'inverse, au choix de @copywriter).

**`lot2-375-article-encart-milieu.png`, `lot2-375-article-bloc-fin.png`** (`repondre-moqueries-avec-humour`)
- Conforme : nouveau libellé « Lire la première étape gratuite de Répartie » dans l'encart du milieu et dans le bloc de fin. Le bouton Premium reste le seul violet plein.
- Non conforme (mineur) : sur 375 px, le libellé casse en « Lire la première étape gratuite de / Répartie », avec le nom du parcours isolé sur sa ligne. Correction proposée : `text-wrap: balance` (`[text-wrap:balance]`) sur ces boutons, pour obtenir « Lire la première étape / gratuite de Répartie ».
- Observation (hors périmètre lot 2) : la note du bloc de fin dit « 2,99 €/mois, sans engagement » (sans « TTC »), alors que `/abonnement` dit maintenant « 2,99 € TTC / mois ». À aligner dans un lot suivant si @legal le demande.

## Synthèse

| Branche | Verdict visuel | À corriger avant ouverture / déploiement |
|---|---|---|
| Lettre | R2 **PASS** ; aucune concurrence avec le bouton Premium | 1. « : Confidentialité » et « : toi@exemple.fr » en début de ligne : espaces insécables dans `TEXTES_LETTRE`. 2. Desktop : bouton placé avant la case (ordre visuel différent de l'ordre clavier). |
| Lot 2 | « plus de 3 mois offerts » une seule fois en mensuel ET en annuel : **PASS** | 1. Pastille « plus de 3 mois offerts » sous « Mensuel » à 375 px (sens trompeur, bloquant). 2. Libellé bouton avec « Répartie » orphelin (mineur). 3. « du parcours » / « de » incohérents (mineur). |

Aucune correction codée ici (consigne). Corrections à confier à @fullstack ; les textes modifiés (espaces insécables mis à part) repassent par @copywriter.
