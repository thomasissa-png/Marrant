# Annexe, pack 3 (B7 à B17) : ce qui a changé, libellé E1, points pour @fullstack

> Hors relecture : ne pas transmettre aux relecteurs aveugles. Positions dans `cles-pack3-tour2.md`. Cadre : Texte A = gagnant corrigé avec les « manque pour 10 » des 3 verdicts ; Texte B = challenger d'un autre angle, avec les mêmes corrections.

## 1. Trouvaille qui corrige les verdicts : les filtres existent aussi sur /conseils et /videos

Les 3 relecteurs ont écrit que « le filtre par catégorie n'existe que pour les vannes » (c'était la liste de faits du premier pack). **C'est faux dans le code** :
- `/vannes` : un filtre par catégorie, Premium (`apps/web/src/components/vannes/vannes-list.tsx`, lignes 231-239 : « Filtres par catégorie disponibles avec l'abonnement Premium »).
- `/conseils` : filtre par niveau **et** filtre par catégorie, Premium (`conseils-list.tsx`, lignes 192-201).
- `/videos` : idem (`videos-grid.tsx`, lignes 195-204).

Conséquence : « les filtres » au pluriel est **juste** sur conseils et vidéos et **faux** sur vannes. Chaque variante est écrite en entier avec le bon singulier ou pluriel (B7, B11). Le fait est corrigé dans les faits vrais du pack. Le pack du premier passage disait « pas de ligne sur le filtre » pour conseils et vidéos : le code en affiche une sur les trois listes, `[S22]` est donc écrit pour les trois.

## 2. Bloquants traités

| # | Bloquant | Traitement |
|---|---|---|
| 1 | Variantes /conseils et /videos de B7 et B11 | Chaque liste a sa version complète, dans les deux textes : chiffres (10 / 3 / 3), filtre ou filtres, titre `[S23]` sans verbe qui ne va pas (vanne : « ressortir » ; conseil : « appliquer » ; vidéo : « les points clés »), `[S24]` avec « l'exercice de chaque vidéo » pour les vidéos. B11 : carte floutée écrite pour /vannes d'un côté, /conseils et /videos de l'autre. |
| 2 | Promesses de résultat | Supprimées : « une vanne que tu sais sortir », « t'apprend à la sortir », « retrouver ta légèreté », « œil de pro », « à ton rythme ». Remplacés par du contenu réel (consigne + exemple, 20 minutes, 6 étapes). |
| 3 | Affirmations hors faits | « en une phrase » supprimé (rien ne le prouve : le schéma dit « 1 consigne + 1 exemple »). « Sécurisé par Stripe » **prouvé** (section 3), utilisé dans B16 B seulement. « Pour te dire bonjour » remplacé par « pour nos e-mails » (prouvé, section 3), en B17 B seulement. « Suivre ton parcours » : « en entier » (B13 A) ou « étapes 2 à 4 » (B13 B). « Sans engagement » : zéro occurrence dans le pack, remplacé par « résiliable en ligne » + TTC. |
| 4 | Intro de B11 | Présente dans les 8 variantes des deux textes (3 gestes, dont la carte en 2 versions). |
| 5 | Tics | « Pas sûr ? » : zéro occurrence. Un seul tour de question dans tout le pack : « Tu préfères lire avant ? » (B17 B). « Ton style, tu l'as. Reste à l'entraîner » : supprimé. B16 : plus de surtitre qui pointe un défaut (« muet », « personne ») ni de promesse. |
| 6 | Manques récurrents | « Résiliable en ligne » et TTC dans **toutes** les lignes de prix (B7 à B14) ; « sans compte » dans tous les liens de sortie (B11 `[S28]`, B14 `[S30]`, B17 `[S35]`) et dans B12, B15 ; « en entier » / « 5 parcours » là où ils clarifient (B7, B9, B10, B11, B12, B13). |

Intouchables vérifiés : « Tout débloquer » (B7, les deux textes), « Accéder aux parcours complets » (B12, les deux textes, libellé intact), « Valider l'étape fait partie de Premium. » (B14), « Créer mon compte et m'abonner » et « 2,99 € TTC / mois » (B11), « Voir ce que contient Premium » (B8 à B10, B14), « Active mon accès · 2,99 €/mois » (B13), « Commencer à 2,99 €/mois » (B16, non modifié), « Créer mon compte » (non touché). « 1 500+ » : non repris.

## 3. Faits prouvés dans le code (ajoutés aux faits vrais du pack)

| Fait | Preuve |
|---|---|
| Paiement sécurisé par Stripe | `apps/web/src/lib/faqs.ts` lignes 43 et 60 (« Paiement sécurisé par Stripe », FAQ de la page d'abonnement) ; `confidentialite/page.tsx` ligne 22 (Stripe, prestataire de paiement) |
| Annulation en un clic depuis le profil | `faqs.ts` lignes 43 et 60 |
| Le prénom sert à saluer dans les e-mails (« Salut Marie, » ; sans prénom « Salut, ») | `lib/emails/annual-renewal-reminder.ts` lignes 67-83 (`firstNameFrom`, `salutation`) ; réutilisé par `lib/email.ts` ligne 91 (mot de passe oublié), `lib/emails/paiement-notifications.ts` (confirmation, paiement refusé, résiliation), `lib/rappels/rappel-parcours.ts` ligne 210 |
| L'exercice vanne = une consigne + un exemple (rien sur la longueur) | `apps/web/prisma/schema.prisma` ligne 131 (« 1 consigne + 1 exemple ») |
| Exercice d'un conseil et points clés + exercice d'une vidéo dans Premium | `conseils/[slug]/page.tsx` lignes 213-217 ; `videos/[slug]/page.tsx` lignes 214-221 |
| Favoris Premium sur les 3 contenus | `components/ui/favorite-button.tsx` lignes 24-33 |
| Trois cas de modale existants (favoris, vote, défaut), intro absente pour vote et défaut | `components/premium/premium-modal.tsx` lignes 22-30 |
| Taglines de parcours réelles (base des surtitres B16) | `docs/content/parcours-seed.json` lignes 13 (Machine à Café), 271 (Répartie), 618 (Confiance) ; `parcours-boulot-s19.json` ligne 312 ; `parcours-storytelling-s18.json` ligne 99 |

Non prouvé et donc absent des textes : « Pourquoi ça fait rire » pour l'analyse d'une vidéo (suggéré par un relecteur) ; la nature des « points clés » (pas de « à repérer »).

## 4. Ce qui a changé, bloc par bloc

- **B7** : A = ancien « usage » (liste, favoris, exercice, 5 parcours) avec titre complété (« de quoi ressortir chaque vanne »), prix annuel gardé, phrase « fiches en accès libre » retirée du bloc, « Premium » ramené à une mention de moins. B = angle parcours (« 5 parcours pour t'entraîner », carnet, 15 à 20 minutes), sans l'antithèse ni « t'apprend à la sortir ».
- **B8** : A = « Maintenant, la tienne » (titre le plus aimé des relecteurs) + contenu réel de l'exercice ; B = « Et ta version ? », vanne et mécanique déjà reçues. « Pas sûr ? » et « une vanne que tu sais sortir » supprimés.
- **B9** : A = « À ton tour de l'appliquer » (le titre « À toi de jouer » n'est plus partagé avec B8), « cas concret » pour ne pas répéter « exemple », 5 parcours cités ; B = passerelle conseil vers parcours (contenu d'une étape).
- **B10** : A = « Les points clés de cette vidéo », factuel ; B = « Après le rire, l'analyse ». Aucun teaser, « à repérer » absent, « œil de pro » absent.
- **B11** : A = titres qui répondent au geste, intro courte ; B = titres « … c'est dans Premium », intro qui rassure (fenêtre fermable) puis deux étapes, parcours en tête de `[S27]`. Titre du favori neutre en genre (vanne, conseil, vidéo).
- **B12** : le plein est l'étape 1 gratuite dans les deux textes (accord des 3 relecteurs). A = phrase de lien avec le profil, « avec son petit quiz » (lève « quiz compris ») ; B = angle format (6 étapes, 20 minutes). La ligne de prix voisine dit la destination payante de E1.
- **B13** : A = parcours nommé + « en entier » ; B = frontière précise (étape 1 libre, étapes 2 à N payantes). Garantie raccourcie, TTC ajouté.
- **B14** : les deux textes ont « Étape 2 sur N », la ligne de format et l'aperçu réel. Surtitre « à ton rythme » supprimé. Liens de lettre raccourcis, avec « sans compte ». Lettre : toujours le nouvel emplacement qui demande l'accord de Thomas.
- **B15** : « sans compte » dans la ligne ; « gratuite » dans le bouton des deux textes ; « offerte » supprimé.
- **B16** : surtitres ancrés dans les taglines réelles de `/parcours`, 80 caractères maximum (le plus long : 79). `[S32]` : « Au clic : » (A) ou « Deux étapes : » (B).
- **B17** : A = « Prénom (facultatif) » + lien nommant le parcours et « sans compte » ; B = libellé avec la raison (e-mails, prouvée) + lien en question.

## 5. Libellé de remplacement proposé pour E1 (pour Thomas)

Le libellé « Accéder aux parcours complets » (CHOIX UTILISATEUR du 06/10) est **intact** dans le pack, avec la ligne de prix voisine qui dit la destination payante. Les 3 relecteurs ont tout de même relevé qu'il ne dit pas qu'il mène à une page de prix. Question à poser à Thomas, avec ma recommandation :

- **Recommandé : « Voir les parcours complets avec Premium »** (38 caractères). Garde « parcours complets », ajoute « Premium » (la destination) et remplace « Accéder » (promesse d'accès immédiat) par « Voir » (ce qui se passe vraiment au clic : la page d'offre).
- Autres options : « Voir Premium : les parcours en entier » ; « Passer aux parcours complets (Premium) ».
- Si Thomas garde l'actuel : la ligne voisine (« Avec Premium : les 6 étapes de Confiance, 2,99 € TTC par mois… ») suffit à lever l'ambiguïté, c'est ce que les deux textes de B12 font.

## 6. Points pour @fullstack

1. **« 5 parcours » est dynamique** : `PARCOURS_COUNT` (`config/premium.ts` ligne 85) vaut 5 seulement quand Storytelling et Boulot sont publiés (`BOULOT_PUBLIE`, `STORYTELLING_PUBLIE`). Tous les textes doivent lire ce nombre, jamais un « 5 » en dur. Idem « les 6 étapes de Confiance », « étapes 2 à N », « Étape 2 sur N », « 20 minutes » : `PREMIUM_PARCOURS` (weeks, timePerWeek).
2. **B8, exercice** : `vannes/[slug]/page.tsx` ligne 242 n'affiche la porte « À toi de jouer » que si `joke.howToApply` existe. Le bloc B8 ne doit s'afficher que dans ce cas ; sinon il parle d'un exercice absent. Même vérification pour conseils (`exercise`).
3. **`[S22]` sur les trois listes** : le code a déjà la ligne de filtres sur vannes, conseils et vidéos (singulier sur vannes, « niveau et catégorie » sur les deux autres). Textes à brancher par liste.
4. **Fenêtre Premium** (`premium-modal.tsx`, `COPY`) : ajouter une variante de la carte floutée selon la liste (vannes / conseils et vidéos) ; l'intro est présente pour les trois raisons (aujourd'hui seule « favoris » en a une, `vote` et `defaut` ont `intro: null`).
5. **B13, B12** : le nom du parcours vient du résultat (`RecommendedParcours`) ; le nombre d'étapes vient de la config. B13 : « Répartie » et « étapes 2 à 4 » sont des exemples.
6. **B14** : « Étape 2 sur N », format de l'étape et aperçu viennent des données ; à confirmer contre l'aperçu réellement affiché. L'aperçu fait 4 à 5 lignes sur mobile (Texte B) : à vérifier par @design.
7. **B15** : le bouton du Texte A (43 caractères) peut passer sur deux lignes dans une carte étroite ; celui du Texte B en fait 35.
8. **B16** : `[S33b]` sert Machine à Café et Boulot, `[S33a]` sert aussi Storytelling (persona différente). Option, **à passer par la relecture à l'aveugle avant usage** : `[S33d]` Storytelling, tagline réelle « Pour toi si tu as de quoi tenir une table, mais que ta chute arrive quand tout le monde est passé au dessert » (trop long : à raccourcir sous 80 caractères). **Attention** : la carte de `/parcours` pour Confiance affiche encore « retrouver ta légèreté » (tagline dans `parcours-seed.json` ligne 618), expression que ce pack retire de B16 : à arbitrer par Thomas.
9. **B17** : le prénom est aujourd'hui **obligatoire** (`register/page.tsx` lignes 240-249, `required`, placeholder « Ton prénom »). Le rendre facultatif demande la validation côté API, un `name` vide ou null en base, et le repli « Salut, » déjà prévu côté e-mails. Le lien `[S35]` nomme le parcours d'où vient le visiteur (Répartie par défaut).
10. **« Sans engagement » est partout dans le code**, alors que la consigne le bannit : `config/blog-cta.ts` (toutes les notes), `lib/llms-content.ts` lignes 78, 125, 154, `lib/blog-articles.ts` (lignes 113, 2497, 2705 et deux autres), `lib/ai/agents/marketing-agent.ts` ligne 151. Hors périmètre de ce pack ; à remplacer par « résiliable en ligne » avec TTC.
11. Tests Jest : tout test qui fige les anciens textes de ces blocs sera à mettre à jour avec les textes retenus.
