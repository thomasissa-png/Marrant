# Annexe, pack 3 (B7 à B17), tour 5 : corrections appliquées, arbitrages, taux de changement, points pour @fullstack

> Hors relecture : ne pas transmettre aux relecteurs aveugles. Positions dans `cles-pack3-tour5.md`. Texte exact à brancher : `textes-finaux-3.md`. Pas de commit. Aucun fichier `*12*` modifié.

## 1. Ce qui est repris des verdicts du tour 4, par bloc (texte A)

| Bloc | Repris | Écarté et pourquoi |
|---|---|---|
| B7 | S21 sans « dans Premium » (r3 : « dans Premium » revenait trois fois en quatre lignes, effet péage) ; S24 recomposé en phrases au lieu d'une liste à quatre éléments + parenthèse (r2 : « fiche produit ») ; « pour l'essayer » sur /conseils | « Ça se prépare. » (r1) : r3 le juge vide et r2 le préfère à « pour écrire la tienne », qui est plus concret ; non repris. Contour raccourci « Essayer l'étape 1 de Répartie, gratuite » (r2) : écarté, car r1 et r3 veulent « du parcours Répartie » pour qui découvre le mot |
| B8 | « Il te reste l'exercice » gardé ; fin plate « Il est dans Premium. » remplacée (r3) ; phrase coupée en trois pour éviter les trois compléments à la file (r2) ; les 5 parcours ajoutés (r1) | Reprise de la version de r1 avec « une étape par semaine » collée à la fin : gardée en substance (« qui ouvre aussi les 5 parcours, une étape par semaine ») |
| B9 | « tester sur toi » retiré (r2, r3 : labo, produit de beauté) ; contenu d'une étape dit : conseil, vannes, vidéos, quiz (r1, r2) ; « tranquillement » gardé | « avant le vrai soir » (r3) : répète le titre, non repris |
| B10 | Titre « Après le rire, ton tour » (r1, choix de Thomas) ; « et ça s'entraîne » (r3) relie la table à l'offre ; « avec 5 parcours : » sans « pour t'entraîner » redondant (r2) | « Tu as ri. Reste à voir comment. » (r2) : annonce l'analyse sans la dévoiler, mais déplace le centre du bloc vers le passé ; le titre « ton tour » garde le passage spectateur vers acteur |
| B11 | Lien « du parcours Répartie » (r1, r2, r3) ; titre du vote « Ton avis sur les nouveautés, tu le donnes avec Premium » (r1, r3 : « Les nouveautés, tu les votes » est fautif) ; titre favori vidéo qui ne parle plus de « soir » (r3 : on ne sort pas une vidéo en soirée) ; S27 /vannes cite l'exercice (r2) | Titre favori unique neutre : déjà perdu au tour 4. S27 /conseils et /videos laissés tels quels (r2 n'a proposé que /vannes, et ces lignes sont déjà à la limite de deux lignes) |
| B12 | « Ça se travaille » supprimé (r2, r3 ; r1 le trouve devoir à la maison) ; « avec son petit quiz » à la place de « quiz compris » (r3 : risque de « encore un ? ») ; ligne Premium qui cite le parcours conseillé (r1) | « Maintenant, tu l'entraînes » (r1) et « Maintenant, il se travaille » (r3) : deux injonctions de coach, écartées au profit de la suppression nette (r2) |
| B13 | « la suite de Répartie » (r3, Thomas) ; « Pour 2,99 € par mois, tu ouvres les 5 parcours, pas seulement Répartie. » (r1, r2, r3, Thomas) ; deux phrases et 20 minutes gardées | « Les 4 autres parcours sont compris / viennent avec » (r1, r3) : « viennent avec » fait promo ; la tournure retenue met le prix à côté de la promesse. « jusqu'au bout » (r2) : le bouton dit « en entier », on ne double pas |
| B14 | « Bien joué pour l'étape 1. » (Thomas, r1, r2) supprime la contradiction « faite / valider » ; seconde phrase au « tu » : « Avec Premium, tu la valides, tu ouvres l'étape 2, puis toute la suite, à 20 minutes par semaine. » (r3 : « c'est dans Premium » = guichet) ; lettre raccourcie, exercice gardé (r2 veut court, r1 et r3 veulent l'exercice) | « comme toute la suite (20 minutes par semaine) » avec parenthèse (r2) : parenthèse, donc écarté |
| B15 | Bouton « Commencer Répartie, étape 1 gratuite » (r3 : « gratuite » ne pend plus après la virgule, c'est l'étape qui est gratuite) ; S31 « Sans compte ni abonnement, quiz compris. » (r1) puis « La suite, étapes 2 à 4, est dans Premium. » (r2 : Premium comme continuation) | « sans abonnement » retiré (r2, redite de « gratuite ») : gardé, car r1 et r3 y voient la ligne qui lève la peur de la carte bancaire |
| B16 | Titre Confiance neuf, sans « retrouver ta légèreté » (écarté par Thomas, promesse floue) : « Le rire, 20 minutes par semaine, sans te forcer ». Reprend « sans te forcer » de la carte et ajoute le concret qui manquait (r1, r2, r3 : titre abstrait, sans scène). Surtitre et titre propres à Storytelling (r2 : « Storytelling tombe sous le surtitre Répartie, qui ne parle pas d'anecdote ») | « Une étape par semaine » dans le titre Confiance : répète le sous-titre juste dessous |
| B17 | Gardé tel quel (consigne de Thomas ; 10, 8, 9 au tour 4) | Seule retouche suggérée (r3, « à la marge ») : « pour te dire bonjour dans nos e-mails » au lieu de « te saluer ». Non appliquée. À reprendre si un relecteur la redemande |

## 2. Storytelling : la source du surtitre et du titre

Source : `docs/content/parcours-storytelling-s18.json` (bloc `parcours`) et `apps/web/src/config/premium.ts` (Storytelling, 20 min/semaine, 6 semaines, ajouté à l'offre quand `STORYTELLING_PUBLIE`).

- La ligne « Pour toi si… » **existe** : `personaTagline` = « Pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert ». Aucune ligne n'a été inventée.
- Surtitre `[S33d]` : « Pour toi si ta chute arrive quand tout le monde est passé au dessert ». C'est cette ligne, raccourcie de « tu as de quoi tenir une table, mais que » (68 caractères contre 105 pour l'originale, la contrainte étant 2 lignes mobile, environ 80 caractères).
- Titre : « Ton anecdote, coupée au plus court, jusqu'à la chute ». Vient du titre du module de l'étape 1 (« Ton anecdote, coupée au plus court ») et de la description du parcours (« une anecdote coupée au plus court, … une chute qui surprend »). Il décrit ce qu'on fait, ne promet pas ce qu'on obtient. Écartés : « …celle qu'on te redemande » (la description dit « jusqu'à ce qu'on te la redemande », mais c'est un résultat) ; « Ton anecdote, sans le « et donc ? » » (« sans » promet l'effet).
- Découverte annexe : **Boulot a aussi sa ligne** (`parcours-boulot-s19.json`, `personaTagline` : « Pour toi si tu fais rire tes amis le samedi et que, le lundi à 9 h, tu prends un ton de compte rendu »). Les « [À FOURNIR] » du tour 4 pour B13 sont donc levés pour Storytelling et Boulot (voir `textes-finaux-3.md`). Boulot reste sur `[S33b]` en B16, comme au tour 4 ; un surtitre propre à Boulot est possible si Thomas le veut (la ligne ci-dessus est exploitable).

## 3. Taux de changement par bloc (estimation manuelle au mot, ±5 points, par rapport au gagnant du tour 4)

| Bloc | A (poli) | B |
|---|---|---|
| B7 | ~30 % | 0 % |
| B8 | ~25 % | 0 % |
| B9 | ~30 % | 0 % |
| B10 | ~20 % | 0 % |
| B11 | ~15 % | 0 % |
| B12 | ~35 % | 0 % |
| B13 | ~35 % (Répartie) | 0 % |
| B14 | ~20 % | 0 % |
| B15 | ~25 % | 0 % |
| B16 | ~15 % (titre Confiance + un surtitre/titre en plus) | 0 % |
| B17 | 0 % | sans objet |

Intouchables de la charte (slugs, H2, FAQ, liens, chiffres, prix) : non touchés. Seuls des textes de blocs d'appel changent. Chiffres repris des faits : 2,99 € TTC par mois, 24,99 € TTC par an, 2,08 € par mois (24,99 / 12 = 2,0825), 14 jours sur le premier paiement. Aucune promesse de résultat ni garantie ajoutée (« et ça s'entraîne » dit qu'on peut s'entraîner, pas qu'on réussira).

## 4. Prix annuel : où il est rendu, où il ne l'est pas

- **Rendu / gardé** : B7 (3 listes), B8, B9, B10, B14 (« soit 2,08 € par mois, si tu vois loin »), B12 (version sobre), B16 (bouton qui suit la formule choisie). Dans les deux textes de chaque duel (A et B) : le prix annuel ne fait donc pas partie de ce qui départage.
- **Non ajouté** : B11 (la fiche fixe la ligne de prix « 2,99 € TTC / mois » comme identique dans les deux textes) ; B13 (le bouton ouvre directement un paiement dont on ne sait pas s'il propose les deux formules : afficher un annuel là serait peut-être faux) ; B17 (rappel du plan déjà à l'écran). **Décision pour Thomas / @fullstack** : si l'écran de paiement propose bien mensuel et annuel, ajouter la demi-ligne annuelle en B11 et B13 ; sinon, laisser tel quel.

## 5. Points pour @fullstack

1. **Rien à brancher avant l'arbitrage de Thomas sur le tour 5.** `textes-finaux-3.md` contient le texte A de chaque bloc ; si B l'emporte sur un bloc, prendre le texte B du pack 3 du tour 4 (côté gagnant).
2. **Variables** : `{P}`, `{N}`, `{D}` viennent de `PREMIUM_PARCOURS` (`apps/web/src/config/premium.ts`). Attention : le type `ParcoursSlug` de ce fichier ne liste que `"machine-a-cafe" | "repartie" | "confiance"`. Les blocs B13, B15, B16 et B17 devant couvrir Storytelling et Boulot, vérifier que les fonctions qui prennent un `ParcoursSlug` (ex. `parcoursWeeks`) acceptent aussi `storytelling` et `boulot`.
3. **B16** : quatre couples surtitre/titre (au lieu de trois) ; Storytelling n'utilise plus `[S33a]`. Le défaut (adresse directe, parcours inconnu) reste `[S33a]`. Le bouton suit la formule choisie (voir tour 4). Surtitre `[S33d]` : 68 caractères, tient sur 2 lignes.
4. **B7 / B8 / B9 / B10 / B14** : la ligne de prix LP-A n'est affichée que si l'offre annuelle est disponible ; sinon LP-M. B12 : deux variantes de la ligne Premium (avec / sans annuel).
5. **B11** : le titre « favori » dépend de l'objet (vanne, conseil, vidéo : trois titres) ; le titre du vote change ; `[S27]` : trois variantes (/vannes, /conseils et /videos, favori / vote). Vérifier que `[S27]` /vannes tient sur deux lignes (mobile : panneau du bas).
6. **B13** : cinq phrases (une par parcours) dans `textes-finaux-3.md`. La ligne « Pour toi si… » est issue de `personaTagline` (raccourcie à la main) : à coder en dur par parcours, ne pas la concaténer automatiquement (les raccourcis sont rédactionnels).
7. **B17** : le prénom est encore obligatoire dans `register/page.tsx` (lignes 240-249) alors que le libellé dit « facultatif » : le rendre réellement facultatif demande l'API, la base et le repli « Salut, » côté e-mails (point inchangé depuis le tour 4).
8. Tests Jest à mettre à jour avec les textes retenus. Déploiement à documenter dans `REPLIT_ACTIONS.md` au moment de l'intégration.

## 6. Points de vigilance sur A (à surveiller dans les verdicts)

- **B7** : la suppression de « dans Premium » dans `[S21]` peut déplaire à un relecteur qui y voyait le « ce qu'il faut pour l'avoir ». Si c'est le cas, remettre « , dans Premium » et retirer plutôt un « Premium » de `[S24]` (« Avec Premium, tu as » devient « Tu as »).
- **B10** : « et ça s'entraîne » peut se lire comme une pointe de coach ; sinon, revenir à « Toi, une table te suffit. » (texte du tour 4).
- **B12** : sans « Ça se travaille », le pont avec le parcours repose sur le résultat du quiz seul. Si le bloc paraît abrupt, essayer « Pour la suite : » plutôt que de rouvrir l'injonction.
- **B13** : la phrase est la plus longue du pack (trois propositions). Si un relecteur la juge lourde, couper la ligne de la carte, pas la phrase des 5 parcours.
- **B16** : si le titre « 20 minutes par semaine » fait doublon avec le sous-titre, le remplacer par « Le rire, une étape par semaine, sans te forcer » (même idée, ancrée sur la carte).
- **Contrôle des tics** : zéro tiret cadratin ni demi-cadratin (vérifié par recherche sur les quatre fichiers) ; pas de « retrouver ta légèreté » dans un texte écrit pour le client (seulement dans les faits, citation de la carte) ; aucun nom de concurrent.
