# Relecture à l'aveugle : description de la lettre du mois (s22, 25/10/2026)

Source relue : colonne « Après » de `docs/copy/description-lettre-du-mois-s22.md`, ligne 6 selon l'arbitrage de l'orchestrateur (« et une mention de Premium »). Comparée au fait de référence (situation, trois répliques de la plus sûre à la plus risquée, comment choisir, erreur, exercice, article en lecture libre, encart Premium pour les inscrits par adresse), à `lettres-du-mois-s22-a-lire.md` (n°1 à 6) et à `ton-alex.md`.

**Note : 8/10. Verdict : NO-GO**, à cause de 2 bloquants courts (retouches mot pour mot ci-dessous). Une fois ces deux retouches faites, c'est GO sans nouvelle passe sur les 7 autres textes.

## Résumé exécutif

Le nouveau vocabulaire (« une situation, trois répliques ») est vrai pour les six numéros, concret, et il est le même partout. Il donne une meilleure idée du contenu que « une vanne décryptée », qui ne décrivait plus la lettre. Il reste deux problèmes. D'abord, la case de consentement a une phrase bancale (deux « et » de suite) : la corriger maintenant ne coûte rien, la corriger après coup obligerait à créer une v4. Ensuite, sur la page « C'est confirmé », le seul lien affiché ramène à l'ancien format.

## Contrôle d'entrée (diff réel)

Les 9 textes « Avant » sont bien présents mot pour mot aux lignes indiquées (`lettre-s21.ts` l. 56, 67, 108, 114, 115, 135, 198 ; `cta-articles-accueil.ts` l. 116 ; `cta-pages.ts` l. 232). Les chiffres du tableau sont justes : la meta « Après » fait 122 caractères. Aucun tiret cadratin dans les 9 « Après ».

## Gates ad hoc (définies avant la relecture) par texte

V = vrai · C = clair au premier coup d'œil · E = donne envie · F = garde sa fonction · T = zéro tiret cadratin · H = cohérent avec les autres

| # | Texte | V | C | E | F | T | H | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | H1 `/lettre` | PASS | PASS | PASS | PASS (43 car.) | PASS | PASS | OK |
| 2 | H2 accueil | PASS | PASS | PASS | PASS | PASS | PASS | OK |
| 3 | `<title>` | PASS | PASS (limite) | PASS | PASS (61 car. avec suffixe) | PASS | PASS | OK, remarque R1 |
| 4 | Meta description | PASS | PASS | PASS | PASS (122 ≤ 155) | PASS | PASS | OK |
| 5 | Page « confirmé » | PASS | PASS | PASS | PASS | PASS | **FAIL** (voisin l. 137) | Bloquant B2 |
| 6 | Case de consentement | PASS | **FAIL** | PASS | PASS | PASS | PASS | Bloquant B1 |
| 7 | E-mail de confirmation | PASS | PASS | PASS | PASS | PASS | PASS | OK |
| 8 | Titre bas d'article | PASS | PASS | PASS | PASS | PASS | PASS | OK |
| 9 | Ligne fin d'étape 1 | PASS | PASS (limite) | PASS | PASS | PASS | PASS (limite) | OK, remarque R2 |

## Bloquants (retouche mot pour mot)

### B1. Case de consentement (ligne 6, `lettre-s21.ts` l. 67) : deux « et » de suite

« une situation, trois répliques et un exercice, et une mention de Premium » : à la première lecture, on bute sur la seconde coordination. On ne sait plus si la mention de Premium fait partie du contenu ou s'il s'agit d'autre chose. Or c'est le texte stocké comme preuve : le reformuler après la mise en ligne obligerait à passer en v4. C'est donc à corriger avant la v3.

- Après proposé : `Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une situation, trois répliques et un exercice, et une mention de Premium. Je peux me désinscrire en un clic, à tout moment.`
- **Retouche** : `Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une situation, trois répliques, un exercice et une mention de Premium. Je peux me désinscrire en un clic, à tout moment.`

Ce qui ne change pas : l'arbitrage (« parfois » retiré, « une mention de Premium » gardé), la fréquence, la désinscription. Rien de juridique en plus. La mécanique v3 et l'archive v2 restent celles décrites dans le livrable.

### B2. Page « C'est confirmé » (ligne 5 + `lettre-s21.ts` l. 137) : le lien ramène à l'ancien format

Ce qu'on lit : « Une lettre par mois, avec une situation et trois répliques. » puis tout de suite « Voir la vanne du jour et son décryptage ». Le libellé dit vrai sur sa destination (`/blague-du-jour` contient bien une vanne et son décryptage). Il n'est donc pas mensonger. Mais placé juste sous la description, il se lit comme un aperçu de ce qu'on vient d'accepter, et il montre exactement le format qu'on vient de retirer partout ailleurs (« décryptage »). Le lecteur peut croire que la lettre, c'est ça. Avant le premier numéro (05/11), aucune section « dernier numéro » n'apparaît en dessous (`page.tsx` l. 90 : `apercu.dernier` est vide), donc rien ne vient corriger cette impression. **Trompeur par sa position : oui.**

- **Retouche minimale** (même `lienHref`, aucun code touché) : `lien: "En attendant le prochain numéro, la vanne du jour",`
- Effet : le lien devient une suggestion pour patienter, pas un aperçu. « Décryptage » disparaît de la page de la lettre. Aucune date n'est affichée (décision de Thomas du 17/10 respectée).

## Remarques non bloquantes

- **R1. `<title>` « La lettre : trois répliques, chaque mois »** : dans un onglet ou un partage, on ne sait pas trois répliques à quoi. C'est acceptable : la page est `noindex` (`page.tsx` l. 28), le H1 et la meta disent « situation », et le suffixe du gabarit empêche une version plus longue (point d'attention 3 du livrable).
- **R2. Ligne 9 « Lettre gratuite : une situation, trois répliques par mois. »** : « trois répliques par mois » peut se lire comme un quota maigre, et c'est la seule ligne sans « chaque mois ». Option : `Lettre gratuite : une situation, trois répliques, chaque mois.` (61 car.), à prendre si la ligne tient sur mobile.
- **R3. Phrase voisine inchangée « Tu la reçois par e-mail, avec un exercice pour t’entraîner. »** (l. 57 et 109) : avant, « la » renvoyait à « une vanne ». Sous le nouveau titre, il renvoie à « une situation » ou, implicitement, à la lettre. Ça reste lisible, je ne le bloque pas. À surveiller si un relecteur bute dessus.
- **R4. « Répliques » pour les n°3 et n°5** : le n°3 propose des questions, le n°5 des phrases d'ouverture (« Pas de pique ici »). Le mot reste juste au sens large, et c'est le fait de référence, donc je ne change rien.
- **R5. « Une mention de Premium »** : l'encart est un PS de quelques lignes avec un prix et un lien. « Mention » est le terme validé par @legal en v1 et en v2, et l'arbitrage le garde. Pas de juridique en plus, donc je ne change rien.

## Cohérence d'ensemble

Le même trio de mots revient dans les 9 textes et dans `llms.txt` / `llms-content.ts`. « Exercice » apparaît dans la meta, la case, l'e-mail et les phrases voisines. Aucun texte ne promet ce que la lettre ne contient pas, et aucun ne mentionne d'encart Premium hors de la case (qui est le bon endroit). Les tests qui figent les anciens textes sont bien listés dans le livrable. Il faut y ajouter le test qui fige le libellé l. 137 si B2 est retenu.

## Recommandation

**NO-GO** jusqu'à B1 et B2. Ensuite, GO pour l'intégration par @fullstack : `REPLIT_ACTIONS.md`, tests, `lettre-mensuelle-v3` avec la case B1 et archive v2 = texte « Avant » de la ligne 6. Seuls les deux libellés retouchés repassent la relecture à l'aveugle (règle d'or s18).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-description-lettre-s22.md`
- Décisions prises : NO-GO, 8/10, 2 bloquants avec retouche mot pour mot (B1 case, B2 lien l. 137).
- Points d'attention : B1 à trancher avant de figer la v3 du consentement ; R2 optionnelle ; aucun fichier modifié hors de ce rapport, rien commité.
---
