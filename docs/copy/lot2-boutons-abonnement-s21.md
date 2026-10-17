# Lot 2 : cohérence des boutons et de /abonnement (s21, 17/10/2026)

> Préparation texte seul, rien déployé, aucun fichier de `apps/web/src` touché. Le lot 1 « montrer l'offre » est en ligne et en mesure jusqu'au ~10/11 : ce lot attend le bilan.
> Sources lues : `CLAUDE.md`, `project-context.md` (mémo s20), `docs/founder-preferences.md`, `docs/copy/ton-alex.md`, `docs/copy/charte-refonte-copy-s11.md`, `docs/marrant/audit-conversion-s20.md` (§4 lot 2, §5), rapports `copywriter.md`, `design.md`, `ux.md`, `growth.md`, `docs/copy/etalons-chemin-premium-s15.md`, et le code (Grep dans `apps/web/src`).
> Framework : [Framework : PAS pour le premier écran, règle d'usage pour les libellés] [Conscience : Problem-Aware (visiteur venu d'un article ou de l'accueil), Product-Aware sur /abonnement].

## 0. Statut honnête de cette livraison (à lire en premier)

| Élément demandé | Statut |
|---|---|
| Inventaire des libellés | **Fait** (§2), lu dans le code, lignes citées |
| Libellés unifiés, 3 variantes, reco | **Fait** (§4) |
| Premier écran de /abonnement, économie annuelle, ligne « muet », extrait de carnet | **Fait** (§5), prix lus dans `config/premium.ts` |
| 3 relectures à l'aveugle par sous-agents @reviewer | **Tour 1 et tour 2 joués** (3 verdicts chacun, §6.4). Tour 3 (haut de /abonnement, une ligne corrigée) : **dossier prêt** (`docs/copy/lot2-s21/pack-relecture-tour3.md`, clé au §6.2 ter, prompt au §6.3), **à lancer par la session principale** (cet agent n'a ni Task ni shell). Aucun résultat du tour 3 n'est inventé. |
| `git add` / commit / pull / push | **PAS FAIT**, pas de shell. Commande et message prêts au §8. |

Conséquence : duels 1 et 2 **validés** (tour 1, 3 sur 3, au niveau). Duel 4 (fiche du carnet) **validé au tour 2** (3 sur 3, au niveau), à condition que le bloc soit renouvelé avec le carnet de chaque mois (§5.5). Duel 3 (haut de /abonnement) : gagné aux tours 1 et 2 (3 sur 3) mais pas au niveau ; une seule ligne a été corrigée au tour 3 (TTC près du prix, « premier paiement » dans la réassurance) et **n'est pas validée** tant que le tour 3 n'est pas joué (règle d'or P0 s18).

## 1. Cadre et intouchables respectés

- **[CHOIX UTILISATEUR] non touchés** : « Accéder aux parcours complets » (étalon 1.2, 06/10), « Commencer à 2,99 €/mois » (étalon 1.1), « Créer mon compte » (2.1), « Tout débloquer » sur /vannes, « Lire la première étape gratuite » (3.9 A, s17) et ses déclinaisons « du parcours X », prix 2,99 € et 24,99 € TTC, « plus de 3 mois offerts » (jamais « 4 mois »), quotas 10/3/3, « 15 à 20 min/semaine », pas de compte gratuit, pas de photo ni d'identité du fondateur, pas de barre collante ni de fenêtre surgissante sur les articles, humoristes cités conservés.
- **Contrainte de la mission** : zéro « 1 500+ » dans les nouveaux textes (le chiffre reste en l'état partout où il est déjà, décision P0 du 03/10).
- Intouchables s11 : aucun slug, H2 de contenu, question de FAQ, lien interne, chiffre ou prix existant n'est modifié. Le seul changement proposé à un titre est le **H1 de /abonnement** (§5), signalé comme à trancher.
- Voix : tutoiement, « Alex » n'est pas en jeu (textes du site, pas de « je »), zéro tiret cadratin, zéro mention d'IA, zéro concurrent.
- Références de marché : recherche web faite, **sans valeur de preuve** (guides de praticiens, aucune étude rigoureuse sur la cohérence des libellés ni sur le placement du bouton d'une page de prix). Retenu seulement : libellé spécifique plutôt que générique, un seul élément au contraste maximal par écran, le prix dans le libellé est minoritaire mais le [CHOIX] 1.1 le garde. Le fond vient de l'audit s20 (5 agents sur 5) et des étalons maison, pas du web.

## 2. Inventaire des libellés réels (code lu le 17/10/2026)

Chemins relatifs à `apps/web/src/`. « Niveau » = ce que le bouton vend réellement. « Style » = rendu actuel (primary = violet plein, outline = contour).

### 2.1 Niveau Premium (mène à /abonnement, /register ou à la modale Premium)

| # | Fichier (ligne) | Emplacement | Libellé actuel | Style |
|---|---|---|---|---|
| 1 | `components/layout/header.tsx` l.141 | En-tête ordinateur, visiteur | « Commencer » | primary sm |
| 2 | `header.tsx` l.171 | En-tête mobile (dès 360 px) | « Commencer » | primary sm |
| 3 | `header.tsx` l.285 | Menu mobile | « Commencer » (+ « Connexion » ghost) | primary sm |
| 4 | `components/home/hero-section.tsx` l.91 | Accueil, hero visiteur | « Accéder aux parcours complets » | primary lg |
| 5 | `components/home/home-cta.tsx` l.39 | Accueil, bloc « Tu crois avoir tout essayé » | « Accéder aux parcours complets » | primary lg |
| 6 | `components/home/premium-cta.tsx` l.107 | Accueil bas, carte Premium, visiteur | « Commencer à 2,99 €/mois » | primary lg |
| 7 | `premium-cta.tsx` l.95 | idem, membre connecté | « Active mon accès · 2,99 €/mois » | primary lg |
| 8 | `components/premium/abonnement-view.tsx` l.140 | /abonnement, **H1** visiteur | « Accéder aux parcours complets » | titre |
| 9 | `abonnement-view.tsx` l.267 | /abonnement, bouton visiteur | « Commencer à {prix} » (mensuel ou annuel) | primary lg |
| 10 | `abonnement-view.tsx` l.252 | /abonnement, bouton membre | « Active mon accès · {prix} » | primary lg |
| 11 | `components/premium/premium-modal.tsx` l.125 | Modale Premium (favoris, vote, défaut), visiteur | « Créer mon compte et m'abonner » | primary lg |
| 12 | `premium-modal.tsx` l.111 | idem, membre | « Active mon accès · 2,99 €/mois » | primary lg |
| 13 | `components/blog/article-cta.tsx` + `config/textes/encarts-blog-s20.ts` l.138 | Bloc de fin des articles (34) | « Accéder aux parcours complets » | primary lg |
| 14 | `app/(dashboard)/vannes/[slug]/page.tsx` l.276 | Fiche vanne | « Voir Premium » | primary (Button) |
| 15 | `app/(dashboard)/conseils/[slug]/page.tsx` l.224 | Fiche conseil | « Voir Premium » | **classes maison**, ≈ 36 px (< 44) |
| 16 | `app/(dashboard)/videos/[slug]/page.tsx` l.227 | Fiche vidéo | « Voir Premium » | **classes maison**, ≈ 36 px |
| 17 | `components/vannes/how-to-apply-gate.tsx` l.39 | Exercice d'une vanne | « Voir Premium » | lien souligné |
| 18 | `components/vannes/vannes-list.tsx` l.225 | Bandeau /vannes (visiteur) | « Tout débloquer » | primary sm |
| 19 | `vannes-list.tsx` l.438 ; `conseils/conseils-list.tsx` l.388 ; `videos/videos-grid.tsx` l.378 | Bas de liste (ouvre la modale) | « Voir l'offre » | primary sm |
| 20 | `vannes-list.tsx` l.421 ; `conseils-list.tsx` l.370 ; `videos-grid.tsx` l.360 | Cartes verrouillées | « Débloquer » (texte dans la carte) | libellé de carte |
| 21 | `config/textes/offre.ts` l.86 → `components/parcours/step-blocks.tsx` l.53 et l.88 | Aperçu d'une étape 2+ ; mur de validation de l'étape 1 | « Voir l'offre Premium » | primary sm ou outline |
| 22 | `components/favoris/favoris-list.tsx` l.196 | Favoris, visiteur | « Découvrir l'offre Premium » | primary sm |
| 23 | `components/ui/search-bar.tsx` l.255 ; `conseils-list.tsx` l.201, `vannes-list.tsx` l.239, `videos-grid.tsx` l.204 | Lien inline (résultats limités ; filtres) | « passe en Premium » ; « Premium » | lien |
| 24 | `components/quiz/viral-quiz.tsx` l.113 | Résultat du quiz viral | « Accéder aux parcours complets » | **secondary** (autre violet) |
| 25 | `components/onboarding/humor-quiz.tsx` l.217 | Résultat du quiz d'humour | « Tout débloquer à 2,99 €/mois » | lien xs gris |
| 26 | `app/(dashboard)/glossaire/page.tsx` l.141 | Fin du glossaire | « Commencer à 2,99 €/mois » | primary lg |
| 27 | `app/(dashboard)/a-propos/page.tsx` l.214 | À propos | « Accéder aux parcours complets » | AuthCta primary |
| 28 | `components/carnet/carnet-page.tsx` l.108 | Carnet, fiches verrouillées | « S'abonner · 2,99 €/mois » | primary lg |
| 29 | `components/profil/abonnement-card.tsx` l.147 | Profil, membre non abonné | « S'abonner à 2,99 €/mois » | primary |
| 30 | `app/(auth)/login/page.tsx` l.278 | Connexion | « Créer mon compte et m'abonner » | primary |
| 31 | `config/textes/paiement.ts` l.149 (`abonnement/success/page.tsx` l.141) | Page de retour de paiement | « Voir Premium » (lien) | lien |

### 2.2 Niveau gratuit (lecture libre de l'étape 1, catalogue)

| # | Fichier (ligne) | Emplacement | Libellé actuel | Style |
|---|---|---|---|---|
| G1 | `hero-section.tsx` l.102 ← `config/textes/entrees-parcours.ts` l.16 | Accueil, sous le bouton | « Lire la première étape gratuite » | lien souligné |
| G2 | `home-cta.tsx` l.47 | Accueil, bloc final | « Voir les vannes gratuites » | outline lg |
| G3 | `config/textes/encarts-blog-s20.ts` l.50 et l.121 | Encarts au fil des articles (Répartie, article n°1) | « Lire la première étape gratuite » | outline md |
| G4 | `encarts-blog-s20.ts` l.60 à l.108 | Encarts et bloc de fin (4 autres parcours) | « Étape 1 gratuite : Machine à Café / Confiance / Storytelling / Boulot / Répartie » | outline |
| G5 | `entrees-parcours.ts` l.40 | Fiches vanne, conseil, vidéo | « Lire la première étape gratuite du parcours X » | lien |
| G6 | `entrees-parcours.ts` l.66 | /abonnement, « Pas encore sûr ? » | « Étape 1 du parcours X » | lien souligné |
| G7 | `entrees-parcours.ts` l.58 | Résultat du quiz d'humour | « Lire la première étape gratuite » | bouton |
| G8 | `fiches` (vanne l.282, conseil l.230, vidéo l.233) | À côté de « Voir Premium » | « Voir toutes les vannes / tous les conseils / toutes les vidéos » | outline |
| G9 | `components/parcours/parcours-content.tsx` l.365 | Liste /parcours | « Commencer ce parcours » / « Continuer ce parcours » | bouton |

### 2.3 Hors système (laissés tels quels, avec raison)

- « Créer mon compte » (`register/page.tsx` l.323, `OnboardingFlow.tsx` l.225) : étalon 2.1 validé, étape 1 sur 2.
- « S'abonner » sur la page Stripe (`config/textes/paiement.ts` l.111, `lib/stripe.ts`) : libellé figé pour la commande avec obligation de paiement (L.221-14).
- « Continuer mon parcours » (abonné) : ne vend rien.
- **Code mort** à signaler à @fullstack : `config/blog-cta.ts` (`primaryLabel` « Passer à Premium » ×7, « Commencer le parcours X » ×4, `secondaryLabel` « Lire l'étape 1 de X » ×4) n'est lu par aucun composant (le bloc de fin impose `TEXTES_BLOC_FIN.boutonPremium`) ; `components/marketing/premium-paywall.tsx` (« S'abonner · {prix} ») n'est importé que par son test.

### 2.4 Ce que montre l'inventaire

- **15 libellés distincts** pour aller vers l'offre (l'audit en comptait 6 à 7), à quoi s'ajoutent 2 libellés morts : « Commencer », « Accéder aux parcours complets », « Commencer à {prix} », « Active mon accès · {prix} », « Créer mon compte et m'abonner », « S'abonner · {prix} », « S'abonner à {prix} », « Tout débloquer », « Tout débloquer à {prix} », « Voir l'offre », « Voir l'offre Premium », « Voir Premium », « Découvrir l'offre Premium », « Débloquer », « passe en Premium ».
- **Cinq formes** pour la même étape 1 gratuite (G1, G4, G5, G6, plus « Commencer ce parcours »).
- Le mot « Commencer » désigne trois choses (entrer dans l'offre dans l'en-tête, acheter à 2,99 € sur /abonnement, lire l'étape 1 gratuite dans /parcours).
- Niveaux visuels brouillés (déjà vus par @design, confirmés dans le code) : le quiz viral vend Premium avec la variante `secondary` ; les boutons Premium des fiches conseil et vidéo sont faits à la main (≈ 36 px, sous la cible tactile de 44 px) alors que celui de la fiche vanne est un vrai `Button`. Le lot 1 a déjà mis l'étape 1 en contour dans les blocs d'articles.

## 3. Le système proposé : deux niveaux, six emplacements, un libellé chacun

**Règles** (pour @design et @fullstack, texte et rendu vont ensemble) :
1. **Deux niveaux.** Premium = action principale, `primary` (violet plein, 44 px minimum, pleine largeur en mobile dans les blocs). Gratuit = action secondaire, `outline` (contour violet). Un seul `primary` par écran. Les sorties tertiaires (« Voir toutes les vidéos ») restent en lien.
2. **Un libellé par emplacement**, jamais par page : la phrase au-dessus du bouton porte le contexte, le bouton ne change pas.
3. **Forme longue pour les boutons, forme courte pour les liens et cartes** (même logique que « Commencer » / « Accéder aux parcours complets »).
4. **Un libellé déjà validé, réutilisé à l'identique ailleurs, ne passe pas de duel.** Seul un texte neuf y passe.
5. Bouton : 8 mots maximum, un verbe d'action. Le prix n'entre dans le libellé que quand il est le sujet de l'écran (achat).

| Emplacement | Niveau | Libellé cible | Statut |
|---|---|---|---|
| E0 En-tête (forme courte) | Premium | « Commencer » | gardé (lot 1 en mesure, ne pas bouger avant le 10/11) |
| E1 Entrée dans l'offre, prix non affiché | Premium | « Accéder aux parcours complets » | figé [CHOIX 06/10] |
| E2 Achat, visiteur, prix à l'écran | Premium | « Commencer à {prix} » | figé [CHOIX étalon 1.1] |
| E3 Achat, membre connecté | Premium | « Active mon accès · {prix} » | existant (3 endroits), étendu |
| E4 Mur (contenu verrouillé) | Premium | **à décider, duel 1** (§4.1) | neuf |
| E5 Étape 1 gratuite nommée | Gratuit | **à décider, duel 2** (§4.2) | neuf |

Exceptions motivées (gardées) : « Créer mon compte et m'abonner » (modale et login : il dit les deux gestes, compte puis paiement), « S'abonner » (Stripe, figé), « Tout débloquer » sur /vannes ([CHOIX], voir §7).

## 4. Libellés : variantes et recommandation

### 4.1 E4, le mur (aujourd'hui 6 libellés : « Voir Premium », « Voir l'offre », « Voir l'offre Premium », « Découvrir l'offre Premium », « Débloquer », « Tout débloquer »)

Le visiteur a déjà lu, juste au-dessus, ce qui est verrouillé (« Les points clés et l'exercice de cette vidéo font partie de Premium. »). Le bouton doit dire ce qui se passe au clic : il mène à une page qui explique l'offre, il ne débloque rien tout de suite (« Débloquer » promet donc trop).

| | Libellé | Mots | Pour | Contre |
|---|---|---|---|---|
| a | **Voir ce que contient Premium** | 5 | Dit la suite (une page qui détaille), répond à « pour quoi ? » que @copywriter notait manquer (« dit quoi, pas pour quoi »), vrai sur la modale comme sur /abonnement | Plus long, deux lignes possibles dans un bouton `sm` |
| b | Voir Premium | 2 | Déjà sur 4 emplacements, le plus court | Neutre : n'apprend rien au visiteur qui ne connaît pas encore « Premium » comme produit |
| c | Voir comment Premium t'entraîne | 5 | Met le verbe du produit (entraîner) | « comment » promet une démonstration que la page ne fait pas tout à fait |

**Recommandation : a**, forme courte **« Voir Premium »** pour les cartes, liens inline et la page de retour de paiement. Forme longue sur les boutons (lignes 14, 15, 16, 19, 21, 22 de l'inventaire), forme courte sur les liens, cartes et la page de retour de paiement (lignes 17, 20, 31). Duel 1.

### 4.2 E5, l'étape 1 gratuite nommée (aujourd'hui : « Étape 1 gratuite : X » dans les blocs d'articles, « Lire la première étape gratuite du parcours X » dans les fiches, « Étape 1 du parcours X » sur /abonnement)

| | Libellé (exemple Répartie) | Mots | Pour | Contre |
|---|---|---|---|---|
| a | Étape 1 gratuite : Répartie | 5 | Actuel (lot 1, validé 2 sur 3), court, s'aligne bien à côté d'un bouton plein | Forme « étiquette » qui n'est pas celle du hero et des fiches |
| b | Lire l'étape 1 gratuite de Répartie | 6 | Verbe d'action, nom du parcours | Troisième forme de plus si elle ne remplace rien |
| c | **Lire la première étape gratuite de Répartie** | 7 | Même squelette que le lien du hero, du quiz et des fiches (« Lire la première étape gratuite » + « de X »), donc un seul patron sur tout le site | Plus long : deux lignes en mobile (le bouton a déjà `whitespace-normal`) |

**Recommandation : c.** Si a gagne le duel 2, on garde a pour les boutons (G3, G4) et on laisse les liens de fiches tels quels (un lien n'est pas un bouton). « Étape 1 du parcours X » sur /abonnement (G6) est gardé : son titre « Pas encore sûr ? Lis d'abord une étape » porte déjà le mot gratuit et cinq liens longs s'empileraient mal. Duel 2.

### 4.3 E0, l'en-tête (3 variantes pour mémoire, pas de duel)

| | Libellé | Avis |
|---|---|---|
| a | **Commencer** | Recommandé : gardé. Court, mesuré dans le lot 1, mène à /register. |
| b | Voir Premium | Plus honnête sur le produit, mais le visiteur d'un article ne sait pas ce qu'est Premium. |
| c | S'entraîner | Verbe du produit, mais ne dit pas qu'un compte et un paiement suivent. |

### 4.4 Correspondance fichier → texte (pour @fullstack, après le bilan du 10/11 et la validation de Thomas)

| Inventaire | Action | Détail |
|---|---|---|
| 1 à 6, 7, 9, 10, 12, 13, 26, 27, G1, G7 | inchangé | déjà au bon libellé |
| 11, 30 | inchangé | exception motivée |
| 14, 15, 16, 19, 21, 22 | **« Voir Premium » → forme longue E4**, « Voir l'offre », « Voir l'offre Premium », « Découvrir l'offre Premium » → idem | si duel 1 gagné |
| 20 | « Débloquer » → « Voir Premium » | forme courte |
| 15, 16 | boutons faits à la main → `Button` `primary` à 44 px | rendu, pas de texte |
| 24 | variante `secondary` → `primary` | rendu |
| 25 | « Tout débloquer à {prix} » → « Accéder aux parcours complets » | E1, lien discret |
| 28 | « S'abonner · {prix} » → « Commencer à {prix} » | page avec prix visible, E2 |
| 29 | « S'abonner à {prix} » → « Active mon accès · {prix} » | membre connecté, E3 |
| G3, G4 | → forme E5 | si duel 2 gagné |
| G9 | visiteur : « Commencer ce parcours » → « Lire la première étape gratuite » ; abonné : inchangé | lève l'ambiguïté signalée par @copywriter (étape libre ou paiement ?) |
| 18 | « Tout débloquer » | **gardé, à trancher par Thomas** (§7) |
| code mort | supprimer `primaryLabel` / `secondaryLabel` de `config/blog-cta.ts` et `premium-paywall.tsx` | nettoyage |

Tests à reprendre par @fullstack (textes en dur) : 21 fichiers, 49 occurrences de ces libellés dans `src/__tests__` (dont `abonnement-page.test.tsx` 13, `premium-modal.test.tsx` 4, `abonnement-auto-checkout-s15.test.tsx` 3, `checkout-conflit-s16-lot-d.test.tsx` 3).

## 5. /abonnement : le premier écran (visiteur, 375 × 812)

### 5.1 Chiffres : l'économie annuelle, calculée sur les vrais prix du code

Source : `config/premium.ts` (prix affichés, `PREMIUM_MONTHLY_PRICE_CENTS = 299`, `PREMIUM_ANNUAL_PRICE_CENTS = 2499`), `config/textes/offre.ts` (libellés calculés), décision Thomas du 04/10 (24,99 €/an, « plus de 3 mois offerts », jamais « 4 mois »).

| Calcul | Résultat | Libellé existant dans le code |
|---|---|---|
| 2,99 € × 12 | 35,88 € | (non affiché) |
| 35,88 € − 24,99 € | **10,89 € économisés par an** | `PREMIUM_ANNUAL_SAVINGS_LABEL` |
| 24,99 € / 12 (centime inférieur) | **2,08 € par mois** | `PREMIUM_ANNUAL_EQUIVALENT_LABEL` |
| 10,89 € / 2,99 € = 3,64 mois | **« plus de 3 mois offerts »** | `ANNUEL_MOIS_OFFERTS_LABEL` |

Aujourd'hui ces trois libellés ne s'affichent qu'**après** un clic sur « Annuel » (`plan-selector.tsx`). Proposition **corrigée au tour 2** : montrer dès l'état par défaut (mensuel) « plus de 3 mois offerts » **une seule fois, sur la pastille « Annuel »**, et une ligne sous le prix, sans rien écrire en dur, par concaténation des constantes : `Ou {PREMIUM_ANNUAL_PRICE_LABEL}, {PREMIUM_ANNUAL_EQUIVALENT_LABEL} et {PREMIUM_ANNUAL_SAVINGS_LABEL}.` Rendu : « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an. » (prix lus dans `config/premium.ts`, constantes `PREMIUM_ANNUAL_PRICE_LABEL`, `PREMIUM_ANNUAL_EQUIVALENT_LABEL`, `PREMIUM_ANNUAL_SAVINGS_LABEL`). Affichée seulement si l'annuel est disponible (`annualAvailable`), sinon la page reste strictement mensuelle (comportement actuel inchangé). Version du tour 1 (abandonnée) : « …soit 2,08 € par mois : plus de 3 mois offerts, 10,89 € économisés par an. », qui disait deux fois « plus de 3 mois offerts » à deux lignes d'écart.

### 5.2 Exigence de structure (rendu, pour @design et @fullstack)

Le bouton d'achat est aujourd'hui à y ≈ 1 033 (écran de 812) parce que les avantages (dont une première puce de 8 lignes) sont **avant** lui. Ordre demandé : surtitre, H1, sous-titre, carte [Premium, sélecteur, prix, « sans engagement », ligne annuelle, **bouton**, réassurance, rétractation], **puis** les avantages. Estimation de hauteur : en-tête ≈ 64, surtitre ≈ 20, H1 sur 3 lignes ≈ 108, sous-titre sur 4 lignes ≈ 112, carte jusqu'au bas du bouton ≈ 330, marges ≈ 70, soit un bouton entre y ≈ 650 et 700 `[À MESURER sur capture réelle, estimation à l'œil]`. Alternative sans changer l'ordre : première puce en 5 lignes courtes (un parcours par ligne, durée à droite), sans retirer un mot ni un chiffre. **Pas de barre collante** dans cette proposition (voir §7 : @design et @ux en proposent une sur /abonnement, @growth rappelle le refus de barre collante).

### 5.3 Le texte complet du premier écran (version corrigée du tour 3, en attente du duel du tour 3)

Visiteur, mensuel par défaut, annuel disponible. Trois coupes par rapport au tour 1 : « plus de 3 mois offerts » une seule fois (pastille), la ligne « Sans engagement, annulable à tout moment » retirée de la carte (l'absence d'engagement n'est dite qu'une fois, dans la réassurance sous le bouton), et **(tour 3)** « TTC » déplacé à côté du gros prix, la réassurance ne redisant plus le prix et précisant « premier paiement ». Même constantes de prix ; réassurance sous le bouton remplacée par la formule @legal complétée (ci-dessous).

```
[surtitre, petite ligne violette]
C'est pour toi si tu restes muet quand on te chambre.

[H1]
Ta réplique pendant la soirée, pas dans le bus du retour

[sous-titre]
5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre.

[carte]
Premium
(Mensuel)  (Annuel) [badge : plus de 3 mois offerts]
2,99 € TTC / mois
Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an.

[bouton]  Commencer à 2,99 €/mois

Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux.
Droit de rétractation · Paiement sécurisé par Stripe
```

**Correction du tour 3 (seule ligne modifiée depuis le tour 2)** : les 3 relecteurs du tour 2 ont jugé le duel gagné mais « pas au niveau » sur une seule ligne : « 2,99 € TTC par mois. » redisait le prix 3 fois en 4 lignes (gros prix, bouton, réassurance) pour la seule information « TTC », et « 14 jours pour te faire rembourser » ne disait pas « premier paiement » (@legal l'exigeait aussi). Convergence retenue : « TTC » à côté du gros prix, réassurance réduite à une phrase. Plus court essayé et écarté : « Premier paiement remboursable 14 jours, résiliation en ligne libre. » (staccato, tournure de CGU, perd le « tu »). **Pour @fullstack** : (1) « TTC » s'affiche en petit à côté du montant dans le bloc prix, pour les deux plans (« 24,99 € TTC / an » avec « Annuel » choisi), donc `prixTtcLabel(plan)` n'est plus utilisé dans la réassurance ; (2) la réassurance devient une chaîne fixe, indépendante du plan (le premier paiement est remboursable en mensuel comme en annuel) ; (3) le bouton et la ligne annuelle ne bougent pas.

Pour @fullstack : la ligne retirée est `plan-selector.tsx` l.77 (« Sans engagement, annulable à tout moment »). Elle est aussi écrite dans `premium-modal.tsx` l.98 : **la modale reste inchangée** (elle n'a pas la ligne de réassurance du bas, c'est sa seule mention). Si `plan-selector.tsx` est utilisé ailleurs que sur /abonnement, vérifier avant de retirer la ligne partout.

**Ligne de réassurance (formulation @legal, `docs/legal/remboursement-abonnement-s21.md` §3, formule A)** : remplace « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. » (`config/textes/offre.ts` l.33-35, étalon 1.1 s16). Elle reprend la formule déjà validée de la page Stripe (`config/textes/paiement.ts` l.119), lève l'ambiguïté du « remboursé » et **fusionne** la mention d'absence d'engagement avec la résiliation : c'est elle qui permet de n'avoir qu'une seule mention. Depuis le tour 3 elle ne porte plus le prix (le « TTC » est à côté du gros prix) et dit « premier paiement » dans la phrase même, comme le demande @legal. **Réserve @legal : valable pour le premier paiement seulement.** Cette phrase reste sous le bouton d'achat, jamais répétée ailleurs (profil, e-mail de renouvellement, social, encarts d'articles) sans la précision « premier paiement » (elle l'a maintenant d'origine). Comme elle remplace un étalon validé, elle passe à l'aveugle (tour 2 : gagnée mais pas au niveau ; tour 3 : à jouer) et l'accord de Thomas est à confirmer (§7 point 6).

« 5 » est `PARCOURS_COUNT` (dynamique). Le bouton est inchangé ([CHOIX] étalon 1.1) ; avec « Annuel » choisi il devient « Commencer à 24,99 €/an » (mécanisme existant). Version membre connecté (« Active ton accès pour commencer », « Ton compte est prêt. Encore un clic et les 5 parcours sont à toi en entier, de la première à la dernière étape. », bouton « Active mon accès · {prix} ») : **inchangée**.

**Pourquoi ce choix** : le H1 actuel est le libellé du bouton E1, il ne transforme rien (@copywriter : « H1 = libellé de bouton »). Le nouveau H1 reprend l'image déjà validée des encarts d'articles (« Tu trouves la réplique dans le bus du retour ? »), donc le lecteur venu d'un article retrouve sa promesse. Il décrit l'état voulu, le sous-titre dit honnêtement ce que le site fait (« t'entraîner ») et le prix est dans la carte, à 150 px.

### 5.4 Les trois variantes de chaque pièce

**La ligne « pour toi si tu restes muet quand on te chambre »** (surtitre, au-dessus du H1) :

| | Texte | Avis |
|---|---|---|
| a | **C'est pour toi si tu restes muet quand on te chambre.** | Recommandée. Littérale, comprise en cinq secondes, reprend le mot « muet » déjà sur l'accueil. Le « si » fait un tri : Yanis se reconnaît, les autres lisent la suite. |
| b | Pour toi qui trouves la bonne réplique une fois rentré. | Plus fine (observation vraie), mais redit l'image du H1 recommandé : à réserver à un H1 sans « bus du retour ». |
| c | Si on te chambre et que tu restes muet, on a pensé à toi. | Chaleureuse, mais « on a pensé à toi » sonne slogan. |

**Le H1** : a (recommandé) « Ta réplique pendant la soirée, pas dans le bus du retour » ; b « Trouve ta réplique sur le moment, pas dans le bus du retour » (impératif, promet un peu plus) ; c « Accéder aux parcours complets » (actuel, filet de sécurité : si le duel 3 est perdu pour cause de H1, on garde c et on rejoue le reste).

**Le sous-titre** : a (recommandé) « 5 parcours pour t'entraîner, une étape par semaine, 15 à 20 minutes selon le parcours. La première étape de chacun reste en lecture libre. » ; b « Un parcours, c'est une étape par semaine et 15 à 20 minutes selon le parcours. Tu lis la première sans compte, tu décides ensuite. » ; c (actuel) « 2,99 €/mois ou 24,99 €/an, sans engagement. La première étape de chaque parcours reste en lecture libre. »

### 5.5 L'extrait réel du carnet : emplacement et texte

**Emplacement** : juste sous la carte et ses avantages, **avant** le bloc « Pas encore sûr ? Lis d'abord une étape » (le visiteur a vu le prix, il veut maintenant voir la qualité, puis l'objection « et si ça ne me va pas » est levée par l'étape 1).

**Source** : `data/carnet/2026-10.json`, fiche `2026-10-01`, « Le soleil dans l'ascenseur ». Citée mot pour mot. Choisie parce que c'est **la fiche offerte à tout le monde** (`CARNET_FREE_FICHES = 1`, déjà publique sur /carnet) : montrer cet extrait ne dévoile aucun contenu payant et ne promet rien de plus que l'offre réelle. Dynamique : première fiche du carnet du mois en cours, jamais recopiée en dur dans le composant.

```
[surtitre]  CARNET D'OCTOBRE · SITUATION 1, OFFERTE
[H2]        Le carnet, en vrai
[intro]     Les {N moins 1} autres situations du mois sont dans Premium.

[fiche]     Le soleil dans l'ascenseur
Dans l'ascenseur, un voisin que tu croises une fois par mois regarde les chiffres des étages monter, puis se tourne vers toi.
On te dit : « Ça fait du bien ce soleil, hein ? »
Tu réponds : « Vous voyez l'effet qu'il a : je parle dans un ascenseur. »
Pourquoi ça marche : Tu prends la remarque sur la météo comme une preuve : le soleil t'a rendu bavard dans un lieu où l'on se tait. Le rire tombe sur toi et sur l'ascenseur, le voisin n'a rien à défendre.

[lien, contour]  Lire la fiche en entier   (vers /carnet : la sortie polie et l'exercice y sont, en accès libre)
```

**Version corrigée au tour 2** : l'intro du tour 1 (« Voici la première situation du mois, la seule offerte. Les {N-1} autres sont dans Premium, avec un nouveau carnet chaque mois. ») répétait « offerte » (déjà dans le surtitre) et « nouveau chaque mois » (déjà dans la ligne ✓ juste au-dessus). Elle est réduite à une phrase.

**Spécification pour @fullstack (tout est calculé, rien en dur)** :
- `n = totalFiches - 1` (`totalFiches` = `carnet.fiches.length`, `lib/carnet.ts` l.153 ; octobre 2026 : 15 fiches, donc n = 14).
- `n >= 2` : « Les {n} autres situations du mois sont dans Premium. »
- `n === 1` : « L'autre situation du mois est dans Premium. » (singulier).
- `n === 0` (ou `totalFiches` absent) : **aucune phrase d'intro** ; le surtitre, le titre et la fiche restent. `totalFiches === 0` : ne pas afficher le bloc du tout.
- Surtitre : mois du carnet courant calculé, jamais « OCTOBRE » en dur. `deCarnetMonth(mois)` (`lib/carnet.ts` l.170) renvoie « d'octobre 2026 » avec l'année : prévoir un petit helper qui renvoie le nom du mois seul avec élision (« d'octobre », « de novembre ») à partir de `MOIS_FR` (l.157), puis le mettre en majuscules par le style (`uppercase`). Rendu : « CARNET D'OCTOBRE · SITUATION 1, OFFERTE ».
- Le mot « situations » reste au pluriel dans la phrase pour n >= 2 ; le chiffre s'écrit en chiffres.

`{N}` = `totalFiches` du carnet du mois (donnée du JSON, non écrite ici). Libellés « On te dit », « Tu réponds », « Pourquoi ça marche » = ceux de `carnet-fiche-card.tsx`. Environ 85 mots : à rendre avec la carte `CarnetFicheCard` existante (sans les blocs « Si ça se tend » et « À toi de jouer »), pas dans un nouveau composant.

**Option à trancher (§7)** : la fiche 3 « Le lundi à la machine à café » a une réplique plus forte (« Le samedi était excellent. Le dimanche a démissionné vers 15 h. ») mais elle est **payante**. La montrer en extrait est un choix de Thomas, pas de l'agent. Si la fiche 1 perd le duel 4 à cause de son humour, c'est la voie de repli.

### 5.6 Vérifications (rien d'inventé)

| Affirmation du texte | Source dans le repo |
|---|---|
| 5 parcours | `PARCOURS_COUNT` = longueur de `PREMIUM_PARCOURS` ; `STORYTELLING_PUBLIE` et `BOULOT_PUBLIE` = true |
| une étape par semaine | `FAQ_SERIE_XP` (« rythme conseillé : une étape par semaine »), `weeks` = nombre d'étapes |
| 15 à 20 minutes selon le parcours | [CHOIX 29/09], `timePerWeek` (15 ou 20) |
| première étape de chacun en lecture libre | sous-titre actuel, hero, `ABONNEMENT_ETAPE_1` |
| prix, équivalent mensuel, économie, « plus de 3 mois offerts » | §5.1 (calcul + constantes) |
| « Tu as 14 jours pour te faire rembourser ton premier paiement » | `docs/legal/remboursement-abonnement-s21.md` §1-§3 (droit de rétractation, premier paiement seulement, règle Thomas 07/10) ; remplace la réassurance s16 (voir §7 point 6) |
| première situation seule offerte, nouveau carnet chaque mois | `CARNET_FREE_FICHES = 1`, `PREMIUM_CARNET_BENEFIT`, `CarnetPaywall` |
| citation du carnet | `data/carnet/2026-10.json` (fiche 1), mot pour mot |

Zéro tiret cadratin, zéro « 1 500+ », zéro avis, zéro concurrent, tutoiement. SEO : seul le H1 de /abonnement change (title, meta, FAQ et JSON-LD intacts) ; information pour @seo.

## 6. Duel à l'aveugle (règle d'or P0 s18)

### 6.1 Protocole

- **4 duels**, chacun « texte actuel » contre « texte proposé », ordre A/B tiré une fois pour toutes. Dossier : `docs/copy/lot2-s21/pack-relecture-tour1.md` (faits du produit, grille de la charte s11, les 4 duels, tableau de verdict). 1 = libellé du mur (3 contextes), 2 = bouton gratuit nommé, 3 = haut de /abonnement, 4 = extrait du carnet.
- **3 relecteurs indépendants** (`subagent_type: reviewer`), chacun reçoit le même dossier et écrit `docs/copy/lot2-s21/verdict-tour1-reviewer-<N>.md`. Choix obligatoire A ou B.
- **Passage** : un texte passe s'il gagne **au moins 2 relectures sur 3**. Garde-fou du 08/10 : si l'avis contraire relève une faute objective (promesse hors des faits, chiffre inventé, tiret cadratin, contradiction interne), le texte est corrigé et rejoué quel que soit le vote. Un désaccord de goût se tranche à la majorité.
- Un texte qui perd reste le texte actuel ; on itère (variantes de réserve en §6.5) et on rejoue un tour 2 à l'aveugle.

### 6.2 Clé du tirage (NE PAS transmettre aux relecteurs)

| Duel | Version A | Version B | Version proposée |
|---|---|---|---|
| 1 Libellé du mur | « Voir ce que contient Premium » ×3 | « Voir Premium » / « Voir l'offre » / « Voir l'offre Premium » | **A** |
| 2 Bouton gratuit nommé | « Étape 1 gratuite : Répartie » | « Lire la première étape gratuite de Répartie » | **B** |
| 3 Haut de /abonnement | texte actuel | texte proposé (§5.3) | **B** |
| 4 Extrait du carnet | avec l'extrait | sans l'extrait (actuel) | **A** |

Tirage fait à la main (pas de générateur disponible dans cet environnement) en équilibrant 2 A et 2 B pour neutraliser le biais de position. Les relecteurs ne reçoivent que le chemin du dossier, jamais cette page.

### 6.2 bis Clé du tirage du tour 2 (NE PAS transmettre aux relecteurs)

Dossier : `docs/copy/lot2-s21/pack-relecture-tour2.md`. Numérotation du pack : duel 1 = ancien duel 3 (haut de /abonnement), duel 2 = ancien duel 4 (fiche du carnet). Nouveau tirage, fait à la main, **position inversée par rapport au tour 1** pour les deux duels (1 A et 1 B, aucune habitude de position à réutiliser).

| Duel du pack | Version A | Version B | Version corrigée (proposée) |
|---|---|---|---|
| 1 Haut de /abonnement (ex-duel 3) | corrigée (ligne annuelle sans « plus de 3 mois offerts », pas de « Sans engagement, annulable… », réassurance @legal « Tu as 14 jours pour te faire rembourser, et tu résilies en ligne quand tu veux. ») | actuel en ligne | **A** |
| 2 Fiche du carnet (ex-duel 4) | actuel en ligne (sans fiche) | avec fiche, intro d'une phrase « Les 14 autres situations du mois sont dans Premium. » | **B** |

Le pack ne contient ni cette clé, ni mention d'un « tour 1 », ni indice sur ce qui a été coupé. Il ajoute seulement deux faits neutres : « le carnet d'octobre compte 15 situations » (pour que « 14 autres » soit vérifiable) et « le premier paiement est remboursé sur demande dans les 14 jours » (fait validé par @legal, utile pour juger la réassurance sans le contester).

### 6.2 ter Clé du tirage du tour 3 (NE PAS transmettre aux relecteurs)

Dossier : `docs/copy/lot2-s21/pack-relecture-tour3.md`, **un seul duel** (haut de /abonnement). Nouveau tirage, fait à la main (pas de générateur), **position de la version corrigée inversée par rapport au tour 2** (elle était A). Relecteurs : 3 `reviewer` frais, ni ceux du tour 1 ni ceux du tour 2 (ils connaissent les textes). Verdicts : `verdict-tour3-reviewer-{1,2,3}.md`.

| Duel du pack | Version A | Version B | Version corrigée |
|---|---|---|---|
| 1 Haut de /abonnement | **actuel en ligne** (« Sans engagement, annulable à tout moment », ligne annuelle « …: plus de 3 mois offerts, 10,89 € économisés par an. », réassurance « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux. ») | **corrigée** (« 2,99 € TTC / mois » à côté du gros prix, ligne annuelle « …par mois et 10,89 € économisés par an. », réassurance « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. ») | **B** |

Le pack garde la grille, les faits et le format du tour 2. Un seul fait neutre ajouté : « les paiements suivants (renouvellements) ne sont pas remboursés » (fait @legal, utile pour juger « premier paiement » sans le contester). Aucun indice sur ce qui a été corrigé. Les deux versions sont les deux états complets du haut de page, pas deux micro-variantes : le relecteur juge l'ensemble, comme au tour 2.

Prompt du tour 3 : celui du §6.3, avec `pack-relecture-tour3.md`, « 1 duel » et `verdict-tour3-reviewer-N.md`.

### 6.3 Prompt à coller pour chaque relecteur (N = 1, 2, 3)

```
ANTI-TIMEOUT : écris le fichier IMMÉDIATEMENT après lecture. Write d'abord, Edit ensuite.

Brief compris : relecture à l'aveugle (règle d'or P0) de 4 duels A/B de textes de Deviens-marrant.fr.
Plan : lire le dossier, trancher chaque duel selon la grille, écrire le verdict.

Tu es le relecteur n°N, indépendant des deux autres. Lis UNIQUEMENT
/home/user/Marrant/docs/copy/lot2-s21/pack-relecture-tour1.md (faits, grille, 4 duels, format du verdict).
N'ouvre ni apps/web/src, ni git log/diff, ni les autres fichiers de docs/copy/ : tu ne dois pas savoir
quelle version est en ligne. Choix obligatoire A ou B par duel. Écris ton verdict dans
/home/user/Marrant/docs/copy/lot2-s21/verdict-tour1-reviewer-N.md, au tableau demandé.
```

**Prompt du tour 2** (même texte, deux changements : fichier `pack-relecture-tour2.md` et verdict dans `verdict-tour2-reviewer-N.md`, « 2 duels » au lieu de « 4 duels »). Lancer 3 relecteurs `reviewer` frais (pas ceux du tour 1, ils connaissent déjà les textes), en parallèle.

### 6.4 Résultats, tour par tour

Sources : `docs/copy/lot2-s21/verdict-tour1-reviewer-{1,2,3}.md`. Les trois relecteurs ont choisi la version proposée aux 4 duels (**3 sur 3**, 4 duels sur 4). « Au niveau » = « je le laisserais en ligne tel quel ».

| Tour | Duel | Relecteur 1 | Relecteur 2 | Relecteur 3 | Proposée gagnante ? | Statut |
|---|---|---|---|---|---|---|
| 1 | 1 Libellé du mur (A = « Voir ce que contient Premium » ×3) | A, au niveau | A, au niveau | A, au niveau | **oui, 3/3** | **VALIDÉ** |
| 1 | 2 Bouton gratuit nommé (B = « Lire la première étape gratuite de Répartie ») | B, au niveau | B, au niveau | B, au niveau | **oui, 3/3** | **VALIDÉ** |
| 1 | 3 Haut de /abonnement | B, pas au niveau | B, pas au niveau | B, pas au niveau | **oui, 3/3** | **GAGNE MAIS PAS AU NIVEAU : corrigé, tour 2 à jouer** |
| 1 | 4 Extrait du carnet | A, pas au niveau | A, pas au niveau | A, pas au niveau | **oui, 3/3** | **GAGNE MAIS PAS AU NIVEAU : corrigé, tour 2 à jouer** |
| 2 | Duel 1 du pack tour 2 (= ancien 3, haut de /abonnement ; A = corrigée) | A, pas au niveau | A, pas au niveau | A, pas au niveau | **oui, 3/3** | **GAGNE MAIS PAS AU NIVEAU : une seule ligne corrigée, tour 3 à jouer** |
| 2 | Duel 2 du pack tour 2 (= ancien 4, fiche du carnet ; B = avec fiche) | B, au niveau | B, au niveau | B, au niveau | **oui, 3/3** | **VALIDÉ** (condition ci-dessous) |
| 3 | Duel unique du pack tour 3 (haut de /abonnement, actuel en ligne contre corrigée) | à jouer | à jouer | à jouer | à jouer | en attente |

Sources du tour 2 : `docs/copy/lot2-s21/verdict-tour2-reviewer-{1,2,3}.md`. **Condition du duel carnet** (relecteurs 2 et 3, vue aussi par 1 sur le fond) : le bloc « Carnet d'octobre » doit être renouvelé avec le carnet de chaque mois (mois, fiche 1 et nombre d'autres situations calculés), sinon il devient faux le 1er novembre. C'est déjà la spécification du §5.5 (« tout est calculé, rien en dur »), elle devient une condition de mise en ligne. Remarque sans effet : le double deux-points du « Pourquoi ça marche » vient de la fiche source citée mot pour mot ; ne pas la retoucher ici, à reprendre si le JSON du carnet est un jour retouché (reco du relecteur 2 : « …comme une preuve que le soleil t'a rendu bavard là où tout le monde se tait »).

**Défaut convergent du tour 2, duel /abonnement (3 relecteurs sur 3)** : « 2,99 € TTC par mois. » sous le bouton redit le prix (3 fois en 4 lignes) pour la seule information « TTC » ; « Tu as 14 jours pour te faire rembourser » doit préciser « premier paiement » (relecteurs 1 et 3 le relèvent, @legal l'exige). Corrections proposées par 2 et 3, retenues : « TTC » à côté du gros prix, réassurance « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » (§5.3). Les 3 notent aussi que la version en ligne actuelle cumule deux répétitions, une formule de CGU et un « remboursé sous 14 jours » qui promet plus que le fait : la version corrigée gagne nettement. Aucune autre faute relevée (chiffres justes, aucun tiret cadratin). Règle d'or P0 s18 : la ligne corrigée repasse le duel (tour 3) avant toute mise en ligne.

**Score : 4 duels sur 4 gagnés par la proposition au tour 1 ; 2 validés (1, 2) ; 2 à rejouer (3, 4). Tour 2 : carnet (ex-4) validé 3/3 ; haut de /abonnement (ex-3) gagné 3/3 mais pas au niveau, corrigé, tour 3 à jouer.** Règle d'or P0 s18 : la version corrigée du haut de /abonnement ne va en ligne qu'après avoir gagné **et** été jugée au niveau par au moins 2 relecteurs sur 3 au tour 3.

**Défauts relevés par convergence des 3 verdicts (et correction faite)**

| Duel | Défaut convergent | Relecteurs | Correction |
|---|---|---|---|
| 3 | « plus de 3 mois offerts » dit deux fois à deux ou trois lignes d'écart (pastille et ligne annuelle) | 1, 2, 3 | Gardé sur la pastille seulement ; ligne annuelle : « Ou 24,99 €/an, soit 2,08 € par mois et 10,89 € économisés par an. » (formule proposée par 2 et 3) |
| 3 | Absence d'engagement dite 2 à 3 fois (« Sans engagement, annulable à tout moment », « résiliable en ligne quand tu veux ») | 1, 2, 3 | Ligne « Sans engagement, annulable… » retirée de la carte /abonnement (formule proposée par 2) ; la seule mention restante est « tu résilies en ligne quand tu veux », dans la réassurance @legal sous le bouton (§5.3) |
| 4 | « offerte » dit deux fois (surtitre puis « la seule offerte ») | 1, 2, 3 | Intro réduite à une phrase, « offerte » reste dans le surtitre seul |
| 4 | « nouveau carnet chaque mois » redit la ligne ✓ juste au-dessus | 1, 2, 3 | Phrase retirée |
| 4 | « [N moins 1] autres » : « Les 1 autres » / « Les 0 autres » ; mois codé en dur | 1, 2, 3 | Singulier si n = 1, rien si n = 0, mois calculé (spec §5.5) |
| 3 (hors défaut de texte) | Chiffres vérifiés justes par les 3 (35,88 ; 10,89 ; 2,08 ; 3,6 mois) | 1, 2, 3 | Rien à faire |

Désaccord résiduel : aucun sur le choix. Aucun tiret cadratin, aucun chiffre faux, aucun témoignage relevé dans les 8 versions.

### 6.5 Réserves prêtes si un duel est perdu (itération sans réécrire de zéro)

- Duel 1 : variante c (« Voir comment Premium t'entraîne »), puis variante b (« Voir Premium » généralisé aux 6 emplacements, c'est le minimum de changement).
- Duel 2 : variante b (« Lire l'étape 1 gratuite de Répartie »). Si l'actuel gagne encore, on le garde et on aligne seulement G5/G9 sur lui.
- (Réserves ci-dessous écrites avant le tour 1. Duels 1 et 2 : plus utiles, validés. Duels 3 et 4 : voir en plus le tour 2, §6.4 et §6.2 bis. Si le tour 2 échoue encore sur la répétition, couper la ligne annuelle entière avant de toucher au H1 ou à la ligne « muet » : la pastille « plus de 3 mois offerts » porte déjà l'argument.)
- Duel 3 : si la défaite vient du H1, rejouer avec le H1 actuel (variante c), la ligne a et le sous-titre a ; si elle vient de la ligne « muet », essayer la variante b ou c avec le H1 actuel. La ligne annuelle et le badge ne sont pas du texte libre (calcul du §5.1) : ils restent dans tous les cas.
- Duel 4 : retirer la phrase d'intro (garder surtitre, fiche, lien) ; sinon fiche 3 si Thomas l'autorise (§7 point 5).

### 6.6 Mes réserves avant duel (auto-contrôle, pas un duel, sans valeur de preuve)

- **Duel 3, le H1 est le point fragile** : « Ta réplique pendant la soirée » peut se lire comme un résultat garanti alors que le site promet un entraînement. Le sous-titre dit « t'entraîner » pour compenser. Si un relecteur le relève, passer à la variante b ou au H1 actuel.
- **Duel 4, l'humour de la fiche 1** : la réplique (« Vous voyez l'effet qu'il a : je parle dans un ascenseur ») est correcte et fidèle à la fiche offerte, sans la finesse de la barre Alexa. Le « pourquoi ça marche » est ce qui la porte. C'est le risque principal de ce duel.
- **Duel 2** : la variante c est la plus longue ; elle peut perdre au profit de l'actuelle sur la seule brièveté, ce qui serait un résultat acceptable (on garde a).
- **Duel 1** : A gagne probablement sur la cohérence, ce qui est le but du lot, mais les relecteurs doivent surtout juger ce que dit le libellé au clic.

### 6.7 Corrections du texte commun relevées hors duel (tour 1, s21)

Relevées par les relecteurs dans le texte identique à A et B. Vérifiées dans le code le 17/10/2026.

| # | Faute | Vérification (source) | Correction | Statut |
|---|---|---|---|---|
| a | « Accède à tout le catalogue **dès** 2,99 €/mois » : faux, l'annuel revient à 2,08 €/mois | `PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS` = 208 dans `config/premium.ts` ; texte dans `vannes-list.tsx` l.435, `conseils-list.tsx` l.384, `videos-grid.tsx` l.374 | « Accède à tout le catalogue **pour** 2,99 €/mois » (juste : c'est le prix du mensuel, le bouton dit déjà « Commencer à 2,99 €/mois ») | Texte prêt, factuel, à appliquer avec le lot 2. Même défaut dans la méta de `app/(auth)/register/layout.tsx` l.8 (« …et carnet, dès 2,99 €/mois ») : à corriger de la même façon (« pour »). Information pour @seo : c'est une meta description |
| b | « N vannes supplémentaires **avec l'abonnement** » : « abonnement » alors que partout ailleurs c'est « Premium » | `api/jokes/route.ts` l.108, `api/tips/route.ts` l.99, `api/videos/route.ts` l.120 (champ `upgradeMessage`, affiché tel quel par les 3 listes) | « N vannes supplémentaires avec **Premium** » (idem « conseils », « vidéos »). Les `upgradeMessage` « Abonne-toi pour accéder à… » (l.88, l.79, l.70) sont un autre cas, non touchés | Texte prêt, à appliquer avec le lot 2. Tests à reprendre par @fullstack s'ils figent la chaîne |
| c | Surtitre « Analyse pédagogique complète » : scolaire | `app/(dashboard)/videos/[slug]/page.tsx` l.218, placé au-dessus de « Les points clés et l'exercice de cette vidéo font partie de Premium. » | 3 variantes ci-dessous | **À REJOUER à l'aveugle** (texte réécrit, règle d'or) ; ne pas déployer sans passage |
| d | « 4 SEMAINES » et « environ 20 minutes » pour Répartie : vrais ? | **Vrai.** `PREMIUM_PARCOURS` : Répartie `weeks: 4`, `timePerWeek: "20 min/semaine"` (`config/premium.ts` l.74) ; seed `docs/content/parcours-seed.json` l.264 (« 4 semaines ») et l.265 (« 20 min/semaine ») ; test `__tests__/lib/premium-offer.test.ts` vérifie la copie contre le seed ; l'encart calcule « environ {minutes} minutes » (`encarts-blog-s20.ts` l.57) | Rien à corriger | Fait vérifié |
| e | « remboursé sous 14 jours » (ambigu, hors liste de faits) | `config/textes/offre.ts` l.34 ; avis `docs/legal/remboursement-abonnement-s21.md` : vrai, légal (droit de rétractation, CGU art. 6, aucune case de renonciation au checkout), premier paiement seulement | **Remplacé** par la formule @legal complétée au tour 3 : « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux. » (§5.3, « TTC » à côté du gros prix) | Intégré à la version corrigée du duel 3 ; tour 2 : gagnée, « premier paiement » à préciser (fait au tour 3), **à valider au tour 3**. Jamais répétée hors du bouton d'achat sans « premier paiement » |

**Surtitre de la fiche vidéo verrouillée** (3 variantes, affichage en majuscules par le style) :

| | Texte | Avis |
|---|---|---|
| a | **Après la vidéo, l'exercice** | Recommandé. Dit ce qui est derrière le mur (le travail à faire, pas un « contenu pédagogique »), 5 mots, aucun jargon. Ne répète pas la phrase d'après (« points clés et exercice ») : il annonce, elle précise. |
| b | Pour passer de la vidéo à la pratique | Clair mais plus long (7 mots) et un peu coach. |
| c | La suite de la vidéo | Très court et neutre ; ne dit pas qu'il s'agit d'un exercice. |

Sans surtitre est aussi une option valable (le texte dessous suffit) : « vide assumé > placeholder bancal ». À mettre dans le prochain pack avec a, et avec l'option « sans surtitre ».

## 7. Ce qui reste à trancher par Thomas

1. **Tours 1 et 2 joués** : duels 1 (mur), 2 (bouton gratuit nommé) et fiche du carnet **validés** ; haut de /abonnement gagné 3 sur 3 aux deux tours mais pas au niveau, une ligne corrigée (TTC près du prix, « premier paiement »), **tour 3 à lancer** (`pack-relecture-tour3.md`, un seul duel). Après le tour 3 et le bilan du lot 1 vers le 10/11 : go pour le déploiement. Rien n'est déployé ni ne doit l'être avant.
1 bis. **Fonctionnalité Premium « Ta question à l'équipe » : décidée.** Elle fera l'objet d'une **ligne d'argument séparée** (liste des avantages Premium, après vérification que la fonctionnalité est codée, règle « zéro fausse promesse »), traitée à part, avec son propre duel. **Elle ne touche pas ce lot** : aucun texte du lot 2 (premier écran, carnet, libellés) n'en parle, et elle ne doit pas y être ajoutée avant que cette ligne ait passé la relecture à l'aveugle.
2. **H1 de /abonnement** : le nouveau (§5.3) ou garder « Accéder aux parcours complets ». Ce n'est pas un [CHOIX] écrit (le [CHOIX] vise le libellé du bouton) mais le texte est le même.
3. **Bouton d'achat dans le premier écran** : ordre des blocs (bouton avant les avantages, ma proposition, sans barre collante), ou barre collante en bas de /abonnement (proposée par @design et @ux), ou puce en 5 lignes courtes. @growth rappelle que les choix fondateur excluent la barre collante sur les articles ; la question n'est pas tranchée pour /abonnement.
4. **« Tout débloquer »** : le bandeau de /vannes (l.225 de `vannes-list.tsx`) et le lien du quiz d'humour. [CHOIX] pour /vannes : on le garde (un libellé hors système) ou on l'aligne sur le mur si le duel 1 est gagné ?
5. **Extrait d'une fiche payante** : autoriser la fiche 3 (« Le lundi à la machine à café ») en repli du duel 4 ? Elle fait gagner de la force à l'extrait mais montre un contenu aujourd'hui réservé aux abonnés.
6. **Réassurance sous le bouton** : @legal confirme que la mention est vraie et légale (`docs/legal/remboursement-abonnement-s21.md`), premier paiement seulement. La formule retenue (« Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies en ligne quand tu veux », avec « TTC » à côté du gros prix) remplace l'étalon s16 « 2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux ». Accord de Thomas à confirmer (c'est un étalon validé) ; elle passe le tour 3. Elle porte « premier paiement » d'origine, donc peut être réutilisée, mais pas sans cette précision.
6 bis. **Tour 3 et surtitre vidéo** : go pour lancer les 3 relectures du tour 3 (`pack-relecture-tour3.md`, relecteurs neufs) ; surtitre « Analyse pédagogique complète » : valider la variante a « Après la vidéo, l'exercice » ou « sans surtitre » (§6.7), à rejouer à l'aveugle avant mise en ligne. Fiche du carnet : condition de mise en ligne = bloc renouvelé chaque mois (§5.5). Corrections factuelles « pour 2,99 €/mois » (3 listes + méta de `register/layout.tsx`) et « avec Premium » (3 routes `upgradeMessage`) : prêtes, à appliquer avec le lot 2.
7. **« Déjà 1 500+ inscrits, et toi ? » sous le bouton de /abonnement** : proposé par @copywriter et @design (formule validée le 03/10). Non ajouté ici (consigne « zéro chiffre non sourcé »). Oui ou non, sans changer la formule.
8. **Libellé « Commencer ce parcours » pour le visiteur** (liste /parcours) : le remplacer par « Lire la première étape gratuite » ? Mon avis : oui (lève l'ambiguïté « libre ou payant »).
9. **Nettoyage du code mort** (`primaryLabel`/`secondaryLabel` de `config/blog-cta.ts`, `premium-paywall.tsx`) : go pour @fullstack, sans effet visible.
10. **Un seul déploiement pour tout le lot 2** (recommandé : les effets se séparent déjà par le paramètre `src` d'Umami) ou libellés d'abord, /abonnement ensuite. Mesure avant / après 4 semaines, seuil à écrire avec @data-analyst avant de déployer (la mesure `abonnement-vu` était à réparer au bilan s20).

## 8. Handoff et git

**Handoff → @orchestrator (session principale)**
- Fichiers produits : `/home/user/Marrant/docs/copy/lot2-boutons-abonnement-s21.md`, `/home/user/Marrant/docs/copy/lot2-s21/pack-relecture-tour1.md`. Aucun fichier de `src/` touché.
- Décisions : système à deux niveaux (Premium plein, gratuit en contour), 6 emplacements ; libellés [CHOIX] gardés (E1, E2) ; E3 étendu ; E4 « Voir ce que contient Premium » (forme courte « Voir Premium ») ; E5 « Lire la première étape gratuite de X » ; H1 « Ta réplique pendant la soirée, pas dans le bus du retour » ; ligne « C'est pour toi si tu restes muet quand on te chambre. » ; économie annuelle visible par défaut (10,89 € économisés par an, 2,08 € par mois, plus de 3 mois offerts, calculés) ; extrait = fiche 1 du carnet (offerte, citée mot pour mot). [Framework : PAS / règle d'usage] [Conscience : Problem-Aware puis Product-Aware].
- Objections traitées : « je vais payer sans voir » (extrait réel du carnet, étape 1 en lecture libre), « abonnement piégeux » (sans engagement, annulable, prix et économie visibles), « je ne sais pas ce que je débloque » (libellé du mur), « est-ce pour moi ? » (ligne « muet »). Références de marché : recherche web faite, sans valeur de preuve (§1).
- Points d'attention : tour 3 à lancer (`pack-relecture-tour3.md`, un duel), git non fait (§0), points à trancher au §7 (dont « Ta question à l'équipe », ligne séparée hors lot). Mise à jour s21 tour 3 : carnet validé 3/3, haut de /abonnement corrigé sur une seule ligne (TTC près du prix, « premier paiement »).

**Git (à exécuter par la session principale, cet agent n'a pas de shell)**

```
git add docs/copy/lot2-boutons-abonnement-s21.md docs/copy/lot2-s21/
git commit -m "docs(copy): lot 2 boutons et /abonnement (s21), inventaire, libellés unifiés, premier écran et dossier de duel à l'aveugle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Ny4UaXcj6i1VwL3T1j7rJZ"
git pull --no-rebase origin claude/ouverture-session-nzwj0w
git push -u origin claude/ouverture-session-nzwj0w
```

Ligne à ajouter au journal `project-context.md` (règle commune 5) une fois les duels joués : « @copywriter | 17/10/2026 | Lot 2 boutons et /abonnement préparé (`docs/copy/lot2-boutons-abonnement-s21.md`) : 15 libellés vers l'offre inventoriés, système à deux niveaux, premier écran de /abonnement, dossier de duel ; duels [résultat], rien déployé avant le bilan du 10/11. »
