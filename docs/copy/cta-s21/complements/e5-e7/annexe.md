# E5 à E7 : annexe (jamais transmise aux relecteurs)

Critère unique : l'envie de payer (Thomas, 18/10). Rien de faux, aucune promesse de résultat, pas de mention juridique (ce que dit déjà la ligne de rassurance validée, « 14 jours pour te faire rembourser ton premier paiement », est de la rassurance marketing déjà en ligne sur l'accueil et le carnet, pas une mention juridique).

Code lu : worktree `agent-a6072b0ac19da7774/apps/web/src`. Aucune ligne de code modifiée.

## Constat qui change le brief

`AuthCta` n'est utilisé qu'à **un seul endroit** : `a-propos/page.tsx` l.214, avec le libellé passé explicitement. Le libellé par défaut de `auth-cta.tsx` l.28 (« Accéder aux parcours complets ») **ne s'affiche donc nulle part** aujourd'hui. E6 et E7 sont le même bouton visible. Il n'y a que **deux éléments à relire à l'aveugle** (pack : élément 1 = E5, élément 2 = E6). E7 est un alignement de code, sans relecture (aucun visiteur ne le voit).

Correspondance pack / annexe : élément 1 = E5 glossaire ; élément 2 = E6 à-propos ; E7 = hors pack.

---

## E5, glossaire : bloc de fin de page

**Emplacement** : `app/(dashboard)/glossaire/page.tsx` l.130-143 (bouton l.140-142).

**Qui le voit** : tout le monde, sans condition : visiteur (cas dominant : trafic SEO sur « définition répartie », « glossaire humour », donc froid, il vient chercher un mot), compte sans abonnement, et aussi l'abonné (le bloc n'est pas masqué).

**Ce qui l'entoure** : H1 « Glossaire humour : les termes à connaître pour devenir drôle », index collant, les définitions du glossaire (dont « Callback », vérifié dans `lib/glossary.ts` l.63), chacune avec un lien vers la page liée, puis trois cartes « Passe de la théorie à la pratique » (vannes, conseils, à propos), puis le bloc.

**Où mène le bouton** : `<Link href="/abonnement">`, sans paramètre `src`. Visiteur : page /abonnement version visiteur (H1 par défaut Répartie, bouton « Ouvrir les 5 parcours · 2,99 €/mois », ligne « Deux étapes : ton compte, puis le paiement sécurisé par Stripe. »), puis /register, puis paiement. Compte sans abonnement : page /abonnement version E3 (bouton qui ouvre le paiement). Abonné : le middleware le renvoie vers /vannes (`middleware.ts` l.36).

**Texte actuel complet**
- Titre : « Le vocabulaire, c'est fait. Place aux rires. »
- Paragraphe : « Des exercices concrets, des parcours étape par étape et tes XP pour voir le chemin parcouru. Connaître le mot « callback », c'est bien ; en placer un au dîner de samedi, c'est mieux. »
- Bouton : « Commencer à 2,99 €/mois » (`PREMIUM_PRICE_LABEL` = `2,99 €/mois`)
- Rien sous le bouton.

**Ce que je change et pourquoi**
1. **Titre : inchangé.** Il fait le pont exact avec ce que le visiteur vient de faire (lire du vocabulaire) et ne promet rien.
2. **Paragraphe : réécrit.** La meilleure phrase (le callback au dîner de samedi, observation vraie, contraste net) est reléguée en deuxième position derrière une liste floue (« des exercices concrets, des parcours, tes XP »). On inverse : le bénéfice vécu d'abord, puis la description concrète avec des faits vrais (5 parcours, un conseil, un défi, 5 vannes, 2 vidéos, un quiz, 15 à 20 min). « Tes XP pour voir le chemin parcouru » est retiré : c'est un détail d'outil, pas une envie. Pas de « t'entraînent à placer un callback » : rien ne garantit que les parcours enseignent le callback, donc « du mot au geste » reste général et vrai.
3. **Bouton : « Commencer à 2,99 €/mois » remplacé.** « Commencer à » se lit « à partir de » (prix plancher, avec supposition d'une formule plus chère) et ne dit pas ce qu'on obtient. Formule validée « Ouvrir les 5 parcours · 2,99 €/mois » : même contexte que le bouton visiteur de /abonnement où mène le clic, donc continuité de mots entre les deux pages (le visiteur retrouve exactement le libellé qu'il vient de cliquer).
4. **Ligne sous le bouton : ajoutée** (validée S13 de l'accueil, mot pour mot) : « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. » Raison : trafic froid qui n'a jamais vu l'offre, le clic le mène à une page de paiement ; la rassurance est la même que sur l'accueil et le carnet. Pas de « Deux étapes : ton compte… » ici : c'est dit sur la page suivante et faux pour un compte déjà connecté.

**Variantes retenues pour le vote**
- Paragraphe : P1 = réécriture ; P2 = paragraphe actuel gardé tel quel (pour vérifier que la réécriture le bat vraiment).
- Bouton : B1 = « Ouvrir les 5 parcours · 2,99 €/mois » (cohérence) ; B2 = « Passer du mot au geste · 2,99 €/mois » (prolonge le geste du lecteur, mais ne dit pas où l'on va).

**Variantes écartées** : « Voir les 5 parcours · 2,99 €/mois » (« voir » est plus faible et ne dit pas qu'on y accède) ; « Passer à la pratique · 2,99 €/mois » (proche de B2, B2 est plus imagé).

**Pour @fullstack** (après verdict)
- Texte dans `config/textes/cta-pages.ts`, bouton via `libelleOuvrirParcours()` (import depuis `cta-articles-accueil`, espace insécable avant « · » déjà géré).
- Ajouter `?src=glossaire` à l'URL /abonnement (comme les autres entrées, `buildAbonnementUrl`) : aujourd'hui ce clic est invisible dans la mesure du tunnel.
- Le bloc s'affiche aussi à l'abonné, qui est renvoyé vers /vannes : le masquer pour un compte Premium (la page est statique, il faudra un composant client léger ou `useSession`).

---

## E6, à propos : bloc de fin de page

**Emplacement** : `app/(dashboard)/a-propos/page.tsx` l.201-219 (bouton l.214, ligne l.215-217). Composant : `components/auth/auth-cta.tsx`.

**Qui le voit** : tout le monde, sans condition, y compris l'abonné. Cas dominant : visiteur qui a lu la page jusqu'en bas (méthode, équipe, FAQ, contact), donc intéressé, plus chaud que sur le glossaire.

**Ce qui l'entoure** : méthode de la plateforme, section « L'équipe » (Alex Durand), FAQ, contact, puis le bloc.

**Où mène le bouton** : `AuthCta` sans `onAuthenticatedClick`. Visiteur (et pendant le chargement de la session) : `/register?callbackUrl=/abonnement&src=a-propos` (étape 1 sur 2, puis le paiement s'ouvre tout seul). Connecté : lien vers /abonnement (page E3, pas le paiement direct). Abonné : renvoyé vers /vannes.

**Texte actuel complet**
- Titre (deux lignes) : « Tu parles et personne rit. / On va arranger ça. » (même découpe que le H1 de l'accueil)
- Paragraphe : « Rejoins les 1 500+ membres qui s'entraînent un peu chaque jour. La prochaine vanne qui fait rire la pièce ? Elle peut être la tienne. »
- Bouton : « Accéder aux parcours complets » (`src="a-propos"`)
- Ligne sous le bouton : « 2,99 €/mois, résiliable en ligne. La première étape de chaque parcours reste en lecture libre. »

**Ce que je change et pourquoi**
1. **Titre : inchangé** (H1 d'accueil validé, ancrage de marque, cohérence).
2. **Paragraphe : inchangé.** La formulation « Rejoins les 1 500+ membres qui s'entraînent un peu chaque jour. » est un [CHOIX UTILISATEUR] du 03/10 (seule sa formulation peut être retravaillée, et elle est bonne). « La prochaine vanne qui fait rire la pièce ? Elle peut être la tienne. » est une chute d'envie vraie et non une promesse (« peut »).
3. **Bouton : remplacé.** « Accéder aux parcours complets » : verbe administratif, « complets » sous-entend qu'une version incomplète existe sans dire laquelle, aucun prix, aucune quantité ; il a déjà été écarté de la page /abonnement (H1 remplacé le 17/10). Formule validée « Ouvrir les 5 parcours · 2,99 €/mois ».
4. **Ligne sous le bouton : remplacée.** « 2,99 €/mois » est désormais dans le bouton (doublon), « résiliable en ligne » est vague. On met la rassurance validée S13 (même ligne que l'accueil). « La première étape de chaque parcours reste en lecture libre » est un fait vrai qui rassure mais qui n'a pas de lien sur place : je le garde en variante L2 plutôt que de le supprimer (ne pas amputer ce qui marche) et le vote tranche.

**Variantes retenues pour le vote**
- Bouton : B1 = « Ouvrir les 5 parcours · 2,99 €/mois » (cohérence) ; B2 = « Ouvrir les 5 parcours et arranger ça · 2,99 €/mois » (reprend « On va arranger ça » du titre ; plus long, à vérifier sur mobile).
- Ligne : L1 = « Tu as 14 jours pour te faire rembourser ton premier paiement, et tu résilies depuis ton profil quand tu veux. » ; L2 = L1 + « La première étape de chaque parcours se lit sans compte. »

**Écarté** : « Deux étapes : ton compte, puis le paiement » sous le bouton : vrai pour un visiteur, faux pour un connecté (le bloc est commun). La page /register dit déjà « Créer mon compte et passer au paiement ».

**Pour @fullstack** : passer `label={libelleOuvrirParcours()}` (ou le texte retenu) ; remplacer la ligne ; plus besoin de `PREMIUM_PRICE_LABEL` si L1/L2 retenue (vérifier l'import) ; masquer le bloc à l'abonné.

---

## E7, `auth-cta.tsx` : libellé par défaut

**Emplacement** : `components/auth/auth-cta.tsx` l.28, `label = "Accéder aux parcours complets"`.

**Qui le voit** : personne aujourd'hui (seul appelant, a-propos, passe son propre libellé). Les tests (`auth-cta.test.tsx`) passent un libellé explicite ; `hero-section.test.tsx` l.91 et `abonnement-page.test.tsx` l.91 et l.145 vérifient l'**absence** de l'ancien libellé et resteront verts.

**Ce que je change** : valeur par défaut = le texte retenu pour E6 (B1/B2 selon le vote), via `libelleOuvrirParcours()`, pour qu'un futur appel sans libellé n'affiche jamais l'ancienne formule. Pas de relecture à l'aveugle (jamais affiché ; ce n'est pas un contenu, c'est une valeur par défaut alignée sur un texte déjà relu). Alternative plus propre : rendre `label` obligatoire pour qu'aucun défaut ne puisse dériver (à trancher par @fullstack).

---

## Points d'attention

- Chiffres : « 1 500+ » intact (E6), prix 2,99 € intacts, « 15 à 20 minutes » repris de E3 (validé).
- Aucun résultat promis ; « du mot au geste » décrit un passage, pas une garantie.
- Aucun tiret cadratin ; guillemets « ».
- Avant mise en ligne : verdict du pack, puis règle d'or (rien ne passe sous 10 de moyenne sans correction relue).
