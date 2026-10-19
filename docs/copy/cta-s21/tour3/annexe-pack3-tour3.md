# Annexe, pack 3 (B7 à B17), tour 3 : consignes appliquées, libellés, taux de changement, points pour @fullstack

> Hors relecture : ne pas transmettre aux relecteurs aveugles. Positions dans `cles-pack3-tour3.md`.

## 1. Consignes de Thomas appliquées en cours de route

1. **Conversion d'abord, pas de juridique** : retiré du pack toute mention « droit de rétractation » et les doublons (B11 : une seule ligne de garantie au lieu de deux ; B17 : « les CGU » retiré de la description de la page). Restent les seuls garde-fous : rien de faux (prix, 14 jours sur le **premier** paiement, résiliation en ligne, contenu réel) et aucune promesse de résultat chiffrée ou garantie. Pas de passage par @legal, comme demandé.
2. **Libellés dégelés** : le texte A porte le meilleur libellé pour la conversion, le texte B garde le libellé d'avant (comparaison nouveau contre ancien à l'aveugle). Les relecteurs jugent donc aussi les boutons et les liens (consigne 7 du pack).
3. **Désir avant clarté** : A est écrit avec la scène vécue (la table qui rit, la réplique à l'heure, le « j'aurais dû dire »), au conditionnel ou en question quand c'est un souhait. La destination tient en un mot (« avec Premium », « · 2,99 €/mois »). « 1 500+ » non repris, prix intacts.

## 2. Faits prouvés dans le code

| Fait | Preuve |
|---|---|
| Public de Confiance : « Pour toi si tu sors d'une période compliquée » (ajouté aux faits vrais, sans « retrouver ta légèreté ») | `docs/content/parcours-seed.json` ligne 618 (`personaTagline`) |
| Section gratuite « Comment la ressortir » = conseil général : « Le meilleur moment ? Quand personne ne s'y attend. Retiens la structure (setup court + chute qui décale) et applique-la à ta propre situation. » + lien « parcours Premium » | `apps/web/src/app/(dashboard)/vannes/[slug]/page.tsx` lignes 261-269 |
| `howToApply` (exercice « À toi de jouer ») = « une consigne actionnable + UN exemple concret réutilisable » ; la porte Premium n'apparaît que si `howToApply` existe | `lib/ai/agents/joke-agent.ts` ligne 184 ; `copy-review-agent.ts` ligne 201 ; `vannes/[slug]/page.tsx` lignes 143-145 (`HowToApplyGate`) |
| Donc la différence payant / gratuit sur B8 : le gratuit dit « applique la structure à ta situation » (principe), le payant donne une consigne **et** un exemple prêt à réutiliser. A l'écrit ainsi (« y ajoute une consigne et un exemple à réutiliser »), sans reprendre « ta propre situation » comme valeur de l'exercice | idem |
| Stripe, annulation en un clic, prénom pour saluer dans les e-mails | voir `annexe-pack3-tour2.md`, section 3 |

Non prouvé et absent des textes : « pourquoi ça fait rire » pour une vidéo, la nature des « points clés », toute durée de l'exercice.

## 3. Libellés dégelés : meilleur remplacement (texte A) et alternative

| Libellé d'avant (texte B) | Retenu dans A | Alternative | Pourquoi |
|---|---|---|---|
| « Tout débloquer » (B7) | « Je veux toute la liste avec Premium » | « Ouvrir toute la liste avec Premium » | Désir à la première personne, « Premium » dit où ça mène, plus de vocabulaire de jeu vidéo. |
| « Accéder aux parcours complets » (B12) | « Voir les 5 parcours avec Premium » | « Voir Premium et les parcours complets » | Dit que c'est une offre sans casser l'élan. |
| « Valider l'étape fait partie de Premium. » (B14) | « Bien joué. Pour valider l'étape et ouvrir la suivante, c'est avec Premium. » | « Étape terminée ? Pour valider et ouvrir la suivante, c'est avec Premium. » | Félicite d'abord, le payant arrive comme la suite logique. |
| « Active mon accès · {prix} » (B13) | « Suivre {parcours} en entier · 2,99 €/mois » | « Activer mon accès · 2,99 €/mois » | Le bouton parle du bénéfice, le prix dit que c'est un paiement. |
| « Commencer à {prix} » (B16) | « Ouvrir les 5 parcours · 2,99 €/mois » | « M'abonner à 2,99 €/mois » | Bénéfice + prix ; la ligne dessous annonce les deux étapes. |
| « Créer mon compte » (B17) | « Créer mon compte, plus qu'une étape » | « Créer mon compte et passer au paiement » | Dit que le paiement suit, avec l'idée d'être presque au bout. |
| « Lire la première étape gratuite de {parcours} » (B7 à B10, B12, B15) | « Essayer gratuitement l'étape 1 de {parcours} » | « Lire gratuitement l'étape 1 de {parcours} » | Lève le « première de plusieurs gratuites » ; « Essayer » invite. |
| Titre /abonnement « Ta réplique pendant la soirée, pas dans le bus du retour » | « Ta réplique, tu la veux pendant la soirée, pas dans le bus du retour » | Aucune (éviter « La réplique qui arrive pendant… », qui devient une promesse) | Même scène, présentée comme un souhait et non comme un résultat. |
| « Voir ce que contient Premium » (B8, B9, B10, B14) | « Écrire la mienne avec Premium » (vanne), « Tester ce conseil avec Premium », « Décrypter cette vidéo avec Premium », « Passer à l'étape 2 avec Premium » | « Voir l'exercice avec Premium » | Un verbe de désir par fiche, « Premium » en un mot. |
| « Créer mon compte et m'abonner » (B11) | « Je m'abonne et je garde mes favoris » / « … et je vote » / « … et j'ouvre toute la liste » | Garder l'ancien | Verbe du geste ; l'intro dit déjà « deux étapes ». |

## 4. Taux de changement par bloc (estimation manuelle au mot, ±5 points, par rapport au gagnant du tour 2)

| Bloc | A (fusionné, désir) | B (corrections bloquantes) | Ce que B corrige |
|---|---|---|---|
| B7 | ~75 % | 0 % | rien de bloquant |
| B8 | ~70 % | ~9 % | « puis » retiré (ordre non prouvé) ; contour au libellé d'avant |
| B9 | ~75 % | 0 % | rien |
| B10 | ~80 % | 0 % | rien |
| B11 | ~30 % | ~2 % | « ton mot à dire » devient « ton vote » |
| B12 | ~40 % | 0 % | rien |
| B13 | ~55 % | 0 % | rien |
| B14 | ~30 % | 0 % | rien |
| B15 | ~45 % | 0 % | rien |
| B16 | ~35 % | 0 % | « période compliquée » est désormais un fait prouvé |
| B17 | ~35 % | 0 % | rien |

Intouchables de la charte (slugs, H2, FAQ, liens, chiffres, prix) : non touchés. Seuls des textes de blocs d'appel changent.

## 5. Points de vigilance sur A (à surveiller dans les verdicts)

- **Scènes et formules de désir** : « Un humour, ça se travaille » (B12), « Eux font rire une salle. Toi, une table te suffit. » (B10), « celle que tu auras envie de sortir à la prochaine soirée » (B8), « Bien joué. » (B14, dit avant de connaître le score du quiz). Aucune ne promet un résultat, mais si un relecteur les juge trop publicitaires, revenir à la phrase du texte B correspondante.
- **Contrôle des tics** (dans les textes A ; « Au menu » et « afterwork » restent volontairement dans les textes B de B14 et B16) : zéro tiret cadratin ; pas de « Au menu », « Maintenant, la tienne », « Ton profil a son parcours », énumération de trois lieux, « afterwork » ; « À ton tour » n'existe plus que dans le texte B de B9 ; un seul tour de question par titre de liste.
- **« 5 parcours »** : toujours expliqué en une demi-ligne (une étape par semaine, 15 à 20 minutes) sur B7, B9, B10, B11 (« pour t'entraîner, une étape par semaine ») et B12.
- **B8, comparaison avec la section gratuite** : A ne présente pas l'exercice comme « appliquer à ta situation » mais comme « consigne + exemple à réutiliser ».
- **Mur de B7 sur /videos** : le titre accroche par la scène, les « points clés » et l'exercice sont dans le texte.

## 6. Points pour @fullstack

1. **Libellés par contexte** : B7 (bouton par liste, même libellé), B8 à B10 et B14 (un libellé par fiche), B11 (un libellé par geste : favori, vote, carte floutée), B12 (bouton et lien), B13 (nom du parcours dynamique), B16 (bouton + titre), B17 (nouveau bouton `[S36]`). Rien à brancher tant que Thomas n'a pas arbitré le résultat du duel.
2. **Retraits « juridiques »** demandés : `components/premium/premium-modal.tsx` ligne 139 (lien « rétractation ») et `components/marketing/premium-paywall.tsx` ligne 179 (« conditions de rétractation ») : à retirer ou fondre dans la ligne de garantie unique. La page `/retractation` reste en place (obligation du site, hors blocs d'appel).
3. **Dynamique** : « 5 parcours », « étapes 2 à N », « Étape 2 sur N », « 20 minutes », « 15 à 20 minutes selon le parcours » viennent de `PARCOURS_COUNT` et `PREMIUM_PARCOURS`. La formule B13 « le parcours pour répondre du tac au tac » est propre à Répartie : prévoir une phrase par parcours (source possible : `nextParcoursReason` ou la description du seed), ou la retirer pour les autres.
4. **B8 / B9** : afficher le bloc seulement si `howToApply` (vanne) ou `exercise` (conseil) existe.
5. **B16, S33b** sert Machine à Café et Boulot, S33a sert Répartie et Storytelling ; la carte de `/parcours` pour Confiance affiche encore « retrouver ta légèreté » (seed ligne 618) : cohérent avec la tagline, non repris dans le pack.
6. **B17** : prénom aujourd'hui obligatoire (`register/page.tsx` lignes 240-249) ; le rendre facultatif demande l'API, la base et le repli « Salut, » côté e-mails.
7. Tests Jest à mettre à jour avec les textes retenus.
8. « Sans engagement » encore présent dans `config/blog-cta.ts`, `lib/llms-content.ts`, `lib/blog-articles.ts`, `marketing-agent.ts` : hors périmètre, à remplacer par « résiliable en ligne ».
