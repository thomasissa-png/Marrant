# Validation UX du lot 1 « montrer l'offre » (@ux, 13/10/2026)

Base : captures finales (4 articles, mobile 375 et desktop 1280, en-tête accueil, menu ouvert), code de `blog-encart-milieu.tsx`, `article-cta.tsx`, `entrees-parcours.ts`, `blog-encarts.ts`. Textes non jugés (validés à l'aveugle). `[CHOIX UTILISATEUR]` respectés : prix, « 1 500+ », pas de compte gratuit.

## Verdict : GO, 7 / 10

Le trou identifié à l'audit (aucun produit visible avant l'écran 14, 97 % de sorties sur l'article) est comblé : un lien vers l'étape 1 gratuite apparaît à 21 % de la page, soit environ 3 écrans, contre 14 avant. Aucun défaut bloquant. Les 3 points ci-dessous sont des surveillances, pas des conditions.

| Critère | Note | Constat |
|---|---|---|
| Chemin article → étape 1 (Yanis) | 7 | Encart dans la section qui l'a fait rire, un seul bouton, 44 px, destination directe `/parcours/repartie?src=blog-milieu#etape-1`, aucun paiement ni compte. Sa douleur (« qu'on chambre ») est nommée avant le bouton. |
| Clarté du bloc de fin | 8 | Ordre fixe sur les 4 articles : surtitre parcours + durée, titre, 2 puces, bouton contour « Étape 1 gratuite : X », bouton plein « Accéder aux parcours complets », prix et « sans engagement », « l'article reste en lecture libre ». Gratuit et payant distincts d'un coup d'oeil, 2 blocs d'action au lieu de 6 sorties. Mobile : boutons empilés, gratuit au-dessus. |
| En-tête mobile | 7 | « Commencer » visible dès le premier écran (parité desktop), « Connexion » sous le bouton plein dans le menu, recherche dans le menu. Acceptable : un visiteur n'a pas de compte gratuit, il n'a aucune raison de se connecter ; l'abonné y arrive en 2 touches. |
| Absence de pression | 9 | Aucune fenêtre, aucune barre collante, aucun compteur. Encarts dans le flux, bouton gratuit en contour, rassurance explicite. Rien qui ressemble à un dark pattern. |

## Cognitive walkthrough (Yanis, mobile, Google → article n°1)

1. Il lit les vannes de la section Soirée. L'encart « Et quand c'est toi qu'on chambre ? » arrive juste après (21 %) : le lien but-action est clair, le bouton dit ce qu'il y trouvera (étape gratuite). OK.
2. Il clique : l'étape 1 s'ouvre dépliée pour un visiteur (règle documentée dans `entrees-parcours.ts`). Non vu en capture : voir surveillance S1.
3. S'il ignore l'encart, le bloc de fin (80 %) lui redonne le même choix, en plus complet. OK.
4. S'il veut payer sans lire : « Commencer » en haut, ou bouton plein du bloc de fin. 1 clic jusqu'à `/abonnement`. OK.

## Nielsen (flux ajouté)

H1 PASS (position et rôle du bouton lisibles) · H2 PASS (voix de Yanis) · H3 PASS (lecture libre, retour navigateur, rien de bloquant) · H4 PASS (même ordre et mêmes boutons sur 4 articles, fin du double gabarit relevé à l'audit) · H5 PASS (« gratuit » et prix annoncés avant le clic) · H6 PASS · H7 PASS (CTA en-tête mobile) · H8 PASS (6 sorties ramenées à 2 boutons) · H9 non concerné · H10 PASS (« sans engagement », « lecture libre »).

## Surveillances (non bloquantes)

- **S1 : arrivée sur l'étape 1 non capturée.** Je n'ai pas vu le rendu de `/parcours/repartie#etape-1` en visiteur sur mobile (pas de capture à l'audit non plus). À faire par @fullstack ou @qa après déploiement : l'ancre doit amener l'étape dépliée sous l'en-tête, sans saut ni mur à l'arrivée.
- **S2 : article n°1, deux encarts à 21 % et 32 %** (environ 1 600 px d'écart, 2 écrans), même gabarit. L'audit prévoyait un seul encart. Défendable : sections distinctes (soirée, bureau), parcours différents (Répartie, Boulot, pour Yanis et Sophie), et 3 blocs sur 15 000 px restent légers. Mais deux cartes identiques si proches risquent la cécité aux bannières. Critère de retrait via `blog-cta-vu` / `blog-cta-clic` par `data-blog-cta-position` : si `milieu-2` fait moins du tiers des clics de `milieu-1` à 28 j, le supprimer.
- **S3 : bouton contour peu contrasté.** Dans les encarts, le bouton gratuit est un contour sombre sur fond sombre (texte blanc gras, pleine largeur, 44 px) : il se lit comme un bouton mais reste discret. Choix cohérent avec « le payant n'est pas le bouton de l'encart », à ne changer que si le taux de clic `milieu-1` est sous la cible. Pas de recommandation de style pour l'instant.

Autres notes : en-tête testé à 375 px seulement (320 px et état connecté non capturés, à passer en QA) ; « Commencer » apparaît deux fois menu ouvert (en-tête et menu), sans gravité ; « Connexion » du menu est un texte gris sans cadre, cible proche de 44 px, acceptable pour une action rare.

## HEART et mesure

- Task success / Adoption : part des visites d'article qui changent de page, de 3 % à au moins 8 % `[HYPOTHÈSE : cible à valider, reprise de l'audit]`. Signal : `blog-cta-vu`, `blog-cta-clic` (position, parcours), `parcours-ouvert` avec `src=blog-milieu` / `blog`.
- Engagement : vues de `/parcours/repartie` depuis l'article, aujourd'hui 5 sur 28 j (ordre de grandeur).
- Lecture à 28 j, petits effectifs : comparer par position, pas par article.

**Handoff → @orchestrator**
- Fichier : `/home/user/Marrant/docs/marrant/audit-conversion-s20/validation-lot1-ux.md`. Verdict GO, 7/10.
- Décisions : aucune correction demandée avant mise en ligne ; critère de retrait de l'encart `milieu-2` posé (S2).
- Attention : capture de l'arrivée sur l'étape 1 en visiteur mobile (S1) et en-tête à 320 px et connecté, à valider par @qa après déploiement.
