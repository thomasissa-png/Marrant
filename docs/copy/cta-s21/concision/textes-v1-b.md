# Textes v1 (concision), partie B : murs, fiches, fenêtre, quiz, parcours

> Conventions (comptage, hors bouton, REASS, OUVRIR, LIEN_ETAPE1) : voir `textes-v1-a.md` §0. Chemins : `apps/web/src/config/textes/`. REASS = « Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil. » (11 mots, sous tout bouton plein qui porte un prix).

## 1. B7 : murs de liste (/vannes, /conseils, /videos) : titre + 1 ligne + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `MUR_LISTE[liste]`.

| Clé | /vannes | /conseils | /videos |
|---|---|---|---|
| `titre` | Et si la prochaine bonne vanne était la tienne ? (9) | La bonne réplique, pas trois heures après (7) | Tu regardes pour rire. Et pour faire rire ? (8) |
| `limite` (la ligne unique, 10 mots ; nombres = `FREE_*_LIMIT`) | Voilà les 10 premières vannes, la suite est dans Premium. | Voilà les 3 premiers conseils, la suite est dans Premium. | Voilà les 3 premières vidéos, la suite est dans Premium. |
| `bouton` (plein) | Voir la suite des vannes · 2,99 €/mois | Voir la suite des conseils · 2,99 €/mois | Voir la suite des vidéos · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (devient lien) | LIEN_ETAPE1 | LIEN_ETAPE1 | LIEN_ETAPE1 |
| **Hors bouton** | **19** | **17** | **18** |

Carte floutée : **une seule** (au lieu de 3), lien `MUR_CARTE_LIEN` « Voir Premium » (2 mots, inchangé), `CARTE_VERROUILLEE_LABEL` (aria) inchangé.
**Disparaît** : `filtres` [S22] (« Tu y trouves aussi le filtre par catégorie… »), `texte` [S24] (« Avec Premium : toute la liste, l'exercice… 5 parcours… une étape par semaine (de 15 à 20 minutes) », 30 mots), `AVEC_PREMIUM_FIN`, `lignePrixGarantie()` [S26] (31 mots : prix mensuel et annuel, résiliation, 14 jours), les contours « Étape 1 de Répartie, gratuite : 5 vannes et un défi », 2 des 3 cartes verrouillées, l'étiquette « One-liner » et le lien « Page dédiée » sur chacune des 10 cartes de liste (`vannes-list.tsx`, `conseils-list.tsx`, `videos-grid.tsx`). **Avant** : 121 à 123 / 104 à 106.

## 2. B8, B9, B10 : fiches vanne, conseil, vidéo : titre + 1 phrase + 1 plein + REASS + 1 lien

Fichier : `cta-pages.ts` → `BLOC_EXERCICE[type]`.

| Clé | Vanne (B8) | Conseil (B9) | Vidéo (B10) |
|---|---|---|---|
| `titre` | Et si demain, c'était la tienne qu'on se répétait ? (9, inchangé) | Essaie-le avant le soir où il te servira (8, inchangé) | Une salle, c'est son métier. Toi, une table te suffit (10) |
| `texte` (1 phrase) | À toi de jouer : une consigne et un exemple pour écrire ta version. (13) | À froid, rater ne coûte rien : l'exercice « À toi de jouer » est fait pour ça. (15) | Revois-la pour faire rire, plus seulement pour rire : points clés et exercice. (12) |
| `bouton` (plein) | Écrire la mienne · 2,99 €/mois | Essayer ce conseil · 2,99 €/mois | Décrypter cette vidéo · 2,99 €/mois |
| REASS | sous le plein | idem | idem |
| `contour` (devient lien) | LIEN_ETAPE1 (parcours lié à la catégorie, Répartie par défaut) | idem | idem |
| **Hors bouton** | **22** | **23** | **22** |

**Disparaît** : les paragraphes de 45 à 60 mots (« La mécanique, tu l'as… », « Il est dans Premium, l'abonnement du site, qui ouvre aussi les 5 parcours en entier. Et tes favoris te gardent… »), `lignePrixGarantie(annuel, "profil")` [S16] (31 mots), les contours « Gratuit : … étape 1 de {P} », les liens `toutVoir`/`toutVoirHref` (« Voir d'autres vannes / conseils / vidéos », déjà dans la navigation de fin de page), le lien « Lire la première étape gratuite du parcours {P} » de `FICHE_PARCOURS.lien` (`entrees-parcours.ts`), en doublon du lien du bloc (la carte « Dans un parcours » garde sa phrase `FICHE_PARCOURS.vanne/conseil/video` et son titre, sans lien : c'est la fusion des deux cartes de la fiche vidéo). **Avant** : 121 / 106, 110 / 93, 117 / 102. Abonné : `BLOC_EXERCICE_ABONNE_TITRE` « À toi de jouer » inchangé.

## 3. B11 : fenêtre Premium, chaque geste

Fichiers : `cta-pages.ts` → `FENETRE_PREMIUM[geste][type]`, `FENETRE_GARANTIE`, `fenetreLienEtape1`. Ordre : titre, intro, prix en gros (« 2,99 € TTC / mois », 3 mots, `FENETRE_PRIX`, gardé tel quel : le prix n'est pas dans le bouton ici), plein, REASS, lien.

| Geste | `titre` | `bouton` (plein, inchangé) | `intro` visiteur (12 mots) | `introCompte` (7 mots) | Hors bouton visiteur / compte |
|---|---|---|---|---|---|
| Favori, vanne | Garde-la pour le soir où tu en auras besoin | Je m'abonne et je la garde | Ton compte, puis le paiement : si tu fermes, la vanne reste là. | Si tu fermes, la vanne reste là. | 24 / 19 |
| Favori, conseil | Garde-le pour le soir où tu en auras besoin | Je m'abonne et je le garde | idem avec « le conseil reste là » | Si tu fermes, le conseil reste là. | 24 / 19 |
| Favori, vidéo | Garde-la sous le coude | Je m'abonne et je la garde | idem avec « la vidéo reste là » | Si tu fermes, la vidéo reste là. | 19 / 14 |
| Vote (3 types) | Pour voter, il ne te manque que Premium | Je m'abonne et je vote | idem avec « la page reste là » | Si tu fermes, la page reste là. | 23 / 18 |
| Carte floutée /vannes, /conseils, /videos | Le reste de la liste est juste derrière | Je m'abonne et j'ouvre toute la liste | idem avec « la liste reste là » | Si tu fermes, la liste reste là. | 23 / 18 |

Lien sous la REASS (`fenetreLienEtape1`) : LIEN_ETAPE1. Chargement du bouton (compte connecté) : « On t'emmène au paiement… » inchangé.
**Disparaît** : `avantage` [S27] des 7 gestes (« Avec Premium : tes favoris, l'exercice de chaque fiche et les 5 parcours en entier », 15 à 19 mots), « Deux étapes : … sécurisé » en phrase séparée (fondue dans l'intro), « Et » devant « si tu fermes », le lien de 12 mots « Ou lire d'abord l'étape 1 du parcours Répartie (gratuite, sans compte) », `FENETRE_GARANTIE` (« …et tu résilies en ligne quand tu veux », remplacée par REASS). **Avant** : 73 à 78 / 67 à 72.

## 4. B12 : résultat du quiz d'humour : le résultat + 1 plein gratuit + 1 lien payant

Fichiers : `entrees-parcours.ts` → `QUIZ_HUMOUR_PARCOURS` ; `cta-pages.ts` → `QUIZ_HUMOUR_CTA` ; `lib/quiz-resultat-textes.ts`.

| Clé | Texte exact | Mots |
|---|---|---|
| `intro` | Ton point de départ : | 4 |
| `titre(slug)` | Parcours {P} | 2 (4 pour Machine à Café) |
| `raison.OBSERVATEUR` | Tu vois ce que les autres ne remarquent pas : ce parcours part de là. | 14 |
| `raison.STORYTELLER` (publié) | Tu tiens une table avec tes histoires : ce parcours t'apprend à couper ce qui traîne. | 15 |
| `raison.STORYTELLER` (non publié) | Tu tiens une table avec une histoire : ce parcours t'apprend à la raconter jusqu'au bout. | 15 |
| `raison.ABSURDE` (inchangé) | Tes idées surprennent : ce parcours t'aide à les placer au bon moment, en quelques mots. | 15 |
| `raison.PUNCHLINEUR` | Tu vises le mot juste : ce parcours travaille le rythme et les silences. | 13 |
| `raison.TAQUIN` (inchangé) | Tu renvoies chaque balle : ce parcours t'apprend à retourner une pique avec le sourire. | 14 |
| nouvelle clé `sansCompte` (note sous le plein) | Sans compte. | 2 |
| `bouton(slug)` (plein, gratuit) | Commencer {P}, étape 1 gratuite | bouton (5 à 7 mots) |
| `lien(slug)` = `OUVRIR_P` (lien payant) | Ouvrir {P} en entier · 2,99 €/mois | lien |
| **Hors bouton** | | **25 au plus** (Machine à Café : 4+4+15+2) ; 23 pour Storytelling, 22 à 23 pour les autres (budget 25 OK) |

**Disparaît** : `phrase()` (« Ta force, tu viens de la lire… conseil, défi, 5 vannes, 2 vidéos et un petit quiz », 33 mots avec le nom de l'étape 1), `premium()` (ligne Premium de 55 à 70 mots : phrase de profil qui cite une étape payante, prix mensuel et annuel, durée, 14 jours, résiliation), `PHRASES_PROFIL`, `phraseProfil()` et le champ `premium` de `quiz-resultat-textes.ts`, `GARANTIE_B12`. **Avant** : 120 à 142 / 113 à 135.

## 5. B13 : résultat du quiz d'orientation (compte sans abonnement) : titre + 1 phrase + 1 plein + REASS

Fichier : `cta-pages.ts` → `QUIZ_ORIENTATION_CTA` (le gabarit `paragraphes()` devient `titre()` + `phrase()`), `humor-quiz.tsx`.

| Parcours | `titre` | `phrase` (nouvelle table `LIGNE_QUIZ`, 1 phrase) | Hors bouton |
|---|---|---|---|
| Répartie | Ton quiz te conseille Répartie | Pour toi si on te chambre et que tu cherches encore quoi répondre. | 5+13 = 18 |
| Machine à Café | Ton quiz te conseille Machine à Café | Pour toi si tu veux faire rire à la pause sans forcer. | 7+12 = 19 |
| Confiance | Ton quiz te conseille Confiance | Pour toi si tu veux retrouver ta légèreté, sans te forcer. | 5+11 = 16 |
| Storytelling | Ton quiz te conseille Storytelling | Pour toi si ta chute arrive quand tout le monde est passé au dessert. | 5+14 = 19 |
| Boulot | Ton quiz te conseille Boulot | Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu. | 5+15 = 20 |

Plein : `bouton(slug)` = `OUVRIR_P` « Ouvrir {P} en entier · 2,99 €/mois ». Sous le plein : REASS (remplace `garantie`). Lien : `refaire` « Refaire le quiz » (inchangé, 3 mots). `commencer` « Voir par où commencer » inchangé.
**Disparaît** : « L'étape 1 est offerte. Ensuite : {PROGRAMME} » (noms d'étapes), tout le paragraphe 2 (durée « 20 minutes chacune », « idéalement une par semaine », « Un seul prix… ouvre les 5 parcours, pas seulement {P} »), « Ton compte est prêt : il ne reste que le paiement. », `garantie` (« Prix TTC, paiement sécurisé par Stripe. Tu résilies depuis ton profil… », 24 mots), `PROGRAMME`, `FORMES_COURTES`, `programme()`. Les phrases `LIGNE_QUIZ` raccourcissent `ligneCarte()` (la ligne des cartes de parcours n'est pas modifiée). **Avant** : 117 / 112.

## 6. B14 : fin de l'étape 1 (visiteur) : bouton direct vers l'inscription, la lettre en dessous

Fichiers : `cta-pages.ts` → `FIN_ETAPE_1` ; `offre.ts` → `VALIDATION_ETAPE` ; `step-blocks.tsx` (`ValidationWall`). Le plein mène à `/register` (puis paiement), plus à `/abonnement` : décision du 18/10.

| Clé | Texte exact | Mots hors bouton | Budget |
|---|---|---|---|
| `titre` (nouvelle clé) | Bien joué pour l'étape 1 | 5 | |
| `phrase` | Avec Premium, tu la valides et les suivantes s'ouvrent d'un coup. | 11 | |
| `bouton` (plein) | Passer à l'étape 2 · 2,99 €/mois | bouton | |
| REASS | sous le plein | 11 (REASS) | |
| `lettre.ligne` (nouvelle clé, sous la REASS, petit texte discret) | Ou la lettre gratuite : une vanne décryptée par mois. | 9 | |
| `lettre.champ` (placeholder) | toi@exemple.fr | champ | |
| `lettre.bouton` (texte discret, pas un plein ; `lettre-s21.ts` `formulaire.bouton`) | Envoie-moi la lettre | bouton | |
| Case de consentement et mention | inchangées (`formulaire.case`, `formulaire.mention`), affichées au focus du champ (à valider @design et @legal) | hors budget | |
| **Total** | | **25** | **25 OK** |

Carte « Étape 2 » (donnée du parcours, hors budget comme la scène de B1) : surtitre `carteSurtitre()` devient « Étape 2 sur 4 » (sans la durée), titre et aperçu inchangés (données publiques).
Variante quiz en cours (`ValidationWall`, `quizPending`) : `VALIDATION_ETAPE.texte` « Valider l'étape fait partie de Premium. » (6, inchangé) ; `VALIDATION_ETAPE.bouton` (contour d'attente) « Valider l'étape · 2,99 €/mois » ; REASS dessous.
**Disparaît** : `carteFormat()` (« Dans l'étape : un conseil, un défi, 5 vannes, 2 vidéos et un petit quiz »), la durée du surtitre de carte, « Le rythme conseillé : une par semaine, mais rien ne t'y oblige. Le même abonnement ouvre aussi les 4 autres parcours en entier. », `lignePrixGarantie(annuel)` [S16] (31 mots), `FIN_ETAPE_1.lienLettre` (« Ou la lettre gratuite, sans compte : une vanne décryptée et un exercice, une fois par mois par e-mail », 19 mots) remplacé par `lettre.ligne`, `APERCU_REASSURANCE` sous ce mur. **Avant** : 99 / 93.

## 7. B15 : cartes de /parcours (visiteur)

Fichier : `cta-pages.ts` → `LISTE_PARCOURS_CTA`.

| Clé | Texte exact | Mots hors bouton |
|---|---|---|
| `bouton(slug)` (inchangé, plein) | Commencer {P}, étape 1 gratuite | bouton (5 à 7) |
| `frontiere(slug)` | Sans compte. Étapes 2 à 4 : Premium. (« Étapes 2 et 3 » pour Machine à Café) | 6 |

**Disparaît** : « ni abonnement, quiz compris ». Les cinq cartes forment un gabarit parallèle (« Sans compte » répété par construction). **Avant** : 19 / 14.

## 8. Page d'un parcours, visiteur (aperçus des étapes 2 et suivantes)

Fichiers : `parcours.ts`, `offre.ts`, `entrees-parcours.ts`, `step-blocks.tsx`.

| Clé | Texte exact | Mots |
|---|---|---|
| `progressionVisiteurTexte()` (inchangé) | Étape 1 offerte, étapes 2 à 4 avec Premium | 8 (le fait « étape 1 offerte / reste Premium » est dit ici, une fois) |
| `APERCU_INTRO` | Pour les suivantes, tu vois ici ce qu'elles contiennent. | 9 |
| `VANNES_ETAPE.apercuVisiteur(n)` | {n} vannes t'attendent dans cette étape. | 6 |
| nouvelle clé `APERCU_LIEN` (lien sous l'aperçu ouvert) | Ouvrir toutes les étapes · 2,99 €/mois | lien |
| `QUIZ_FIN_BOUTON.visiteur` (rendu en lien, plus en bouton) | Refaire le quiz | 3 |
| **Hors bouton (aperçu)** | | **15** (budget 25 OK) |

**Disparaît** : `ETAPE_APERCU_LIBELLE` « Fait partie de Premium » (badge répété 3 fois, le cadenas reste), `APERCU_BAS` (« Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium », 16 mots), `APERCU_REASSURANCE` (« 2,99 €/mois, résiliable en ligne. », sous un lien), `etapeVerrouilleeTexte()` (non utilisée dans `src/`), « La première étape est gratuite. » de `APERCU_INTRO`, `MUR_PREMIUM_BOUTON` « Voir ce que contient Premium » (décrit une page ; valeur générique remplacée par « Ouvrir Premium · 2,99 €/mois », utilisée par `favoris-list.tsx`). **Avant** : 55 hors bouton (intro 14, badges 3×4, bas 16, vannes 9, réassurance 4) + lien 5.
