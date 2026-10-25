# Description de la lettre du mois : retouches des textes publics (s22, 25/10/2026)

Statut : PROPOSITIONS, aucun fichier de code modifié, rien commité. Elles n'ont PAS encore passé la relecture à l'aveugle (règle d'or s18 : `lettre-s21.ts` précise que toute modification des textes validés repasse la relecture). Aucune ne doit être fusionnée avant.

Format réel (n°1, `lettres-du-mois-s22-a-lire.md`) : une situation du quotidien, trois répliques (la sûre, la joueuse, la risquée), comment choisir, l'erreur à éviter, un exercice, un article en lecture libre.

Principe : un seul trio de mots partout, **« une situation, trois répliques »** (+ « un exercice » là où la liste existait). Même vocabulaire que `llms.txt` (route.ts l. 170) et `llms-content.ts` (l. 148), déjà à jour.

## Tableau avant / après

Chemins relatifs à `apps/web/src/`. Numéros de ligne relevés le 25/10/2026 sur le dépôt.

| # | Fichier : ligne | Rôle | Avant (mot pour mot) | Après (mot pour mot) |
|---|---|---|---|---|
| 1 | `config/textes/lettre-s21.ts` : 56 (`titre`) | Titre H1 de `/lettre` (32 → 43 car.) | `Une vanne décryptée, chaque mois` | `Une situation, trois répliques, chaque mois` |
| 2 | `config/textes/lettre-s21.ts` : 108 (`accueil.titre`) | Titre H2 du bloc de l'accueil, identique au 1 | `Une vanne décryptée, chaque mois` | `Une situation, trois répliques, chaque mois` |
| 3 | `config/textes/lettre-s21.ts` : 114 (`page.metaTitre`) | `<title>` de `/lettre` (44 → 40 car., 61 avec le suffixe « \| deviens-marrant.fr ») | `La lettre : une vanne décryptée, chaque mois` | `La lettre : trois répliques, chaque mois` |
| 4 | `config/textes/lettre-s21.ts` : 115 (`page.metaDescription`) | Meta description (109 → 122 car., sous 155) | `Une vanne, ce qui la fait marcher et un exercice pour t’entraîner, dans ta boîte mail. Gratuit, sans compte.` | `Une situation, trois répliques, comment choisir et un exercice pour t’entraîner, dans ta boîte mail. Gratuit, sans compte.` |
| 5 | `config/textes/lettre-s21.ts` : 135 (`statuts.confirmee.texte`) | Page « C'est bon, c'est confirmé » | `Une lettre par mois, avec une vanne décryptée.` | `Une lettre par mois, avec une situation et trois répliques.` |
| 6 | `config/textes/lettre-s21.ts` : 67 (`formulaire.case`) | Case de consentement (texte exact stocké comme preuve) | `Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une vanne décryptée et parfois une mention de Premium. Je peux me désinscrire en un clic, à tout moment.` | `Oui, je veux recevoir la lettre de Deviens Marrant une fois par mois. Elle contient une situation, trois répliques et un exercice, et une mention de Premium. Je peux me désinscrire en un clic, à tout moment.` |
| 7 | `config/textes/lettre-s21.ts` : 198 (`EMAILS_SOURCE.confirmation.corps`, 3e ligne du corps) | E-mail de confirmation | `Quelqu’un (sûrement toi) a demandé à recevoir la lettre de Deviens Marrant avec cette adresse : une vanne décryptée, une fois par mois.` | `Quelqu’un (sûrement toi) a demandé à recevoir la lettre de Deviens Marrant avec cette adresse : une situation, trois répliques et un exercice, une fois par mois.` |
| 8 | `config/textes/cta-articles-accueil.ts` : 116 (`LETTRE_ARTICLE.titre`) | Titre du formulaire en bas d'article | `Une vanne décryptée, chaque mois` | `Une situation, trois répliques, chaque mois` |
| 9 | `config/textes/cta-pages.ts` : 232 (`FIN_ETAPE_1.lettre.ligne`) | Ligne discrète sous la REASS, fin d'étape 1 (47 → 58 car.) | `Lettre gratuite : une vanne décryptée par mois.` | `Lettre gratuite : une situation, trois répliques par mois.` |

Lignes 1, 2 et 8 : même chaîne, trois endroits. Ligne 6 : seule la description du contenu change ; « une fois par mois », « parfois une mention de Premium », la désinscription en un clic et le reste de la phrase sont mot pour mot ceux d'avant.

## Conséquences obligatoires de la ligne 6 (mécanique existante, pas un changement juridique)

`lettre-s21.ts` l. 64-65 et `config/lettre.ts` l. 52-63 l'imposent : toute modification de la case = nouvelle version du consentement. Les inscriptions sont ouvertes (`LETTRE_INSCRIPTIONS_OUVERTES = true`), donc des consentements ont déjà été recueillis sous la v2.
1. `LETTRE_CONSENT_VERSION` passe de `"lettre-mensuelle-v2"` à `"lettre-mensuelle-v3"` (`config/lettre.ts` l. 63) et son commentaire (l. 57-60) ajoute la v3.
2. Le texte actuel est ajouté à `CONSENTEMENTS_LETTRE_ARCHIVES` sous la clé `"lettre-mensuelle-v2"` (`case` = texte « Avant » de la ligne 6, `mention` = la mention actuelle de la l. 74). L'entrée `"lettre-mensuelle-v1"` (l. 174-177) ne bouge pas : ne jamais supprimer.
3. Les inscrits déjà confirmés ne sont pas à re-consentir par ce seul changement de description (c'est @legal qui tranche si besoin). Aucun autre texte juridique n'est touché.

## Relevé complet, ce qui reste volontairement inchangé

| Fichier : ligne | Texte | Pourquoi on n'y touche pas |
|---|---|---|
| `lettre-s21.ts` : 57 et 109 | `Tu la reçois par e-mail, avec un exercice pour t’entraîner.` | Reste vrai. « la » renvoie à la situation / la lettre ; lecture correcte sous le nouveau titre. |
| `cta-articles-accueil.ts` : 117 | `Gratuite, par e-mail, avec un exercice.` | Vrai, accord féminin conservé. |
| `lettre-s21.ts` : 137 | lien `Voir la vanne du jour et son décryptage` (vers `/blague-du-jour`) | Ne décrit pas la lettre, mais ce lien servait d'aperçu de la lettre : il n'en montre plus le format. Voir point d'attention 2. |
| `lettre-s21.ts` : 175 | texte archivé v1 | Preuve de consentement, jamais modifié. |
| `lettre-s21.ts` : 218 | `Un numéro arrive une fois par mois.` | Vrai. |
| `app/llms.txt/route.ts` : 170, `lib/llms-content.ts` : 148 | déjà « une situation du quotidien, trois répliques et comment choisir » | Déjà à jour (modèle du vocabulaire). |
| `config/textes/offre.ts` : 71, `app/(dashboard)/cgu/page.tsx` : 109, `abonnement-vente.ts` : 129 | « la lettre du mois, une fois par mois », « 1 par mois » | Ne décrivent pas le contenu. |
| `components/mobile/OnboardingFlow.tsx` : 178, `lib/ai/agents/joke-agent.ts` : 89, `lib/social/templates/cartes-og.tsx` : 119 | « une vanne chaque matin / par jour » | Parlent de la vanne du jour, pas de la lettre. |
| `scripts/content/social-lot-v5.ts` : 431 | « vanne décryptée citée » | Commentaire de code sur les relais sociaux. |

Grep exhaustif fait dans `apps/web/src` (vanne décryptée, vanne du mois, vanne par mois, « lettre » à moins de 120 caractères de vanne / décrypt / chaque mois / par mois / mensuel / exercice, « chaque mois » et « par mois » seuls) : aucune autre phrase publique n'annonce encore l'ancien format. Les occurrences restantes dans `src/__tests__/` sont des tests, listés ci-dessous.

## Tests qui épinglent les anciens textes (à mettre à jour avec les textes validés, sinon la CI casse)

- `__tests__/lib/lettre-textes-valides-s21.test.ts` : l. 44, 59, 94, 110, 141, 210 (la l. 210 teste la case archivée v1 : à ne pas toucher)
- `__tests__/lib/lettre-insecables-s21.test.ts` : l. 70
- `__tests__/lib/concision-v5-textes.test.ts` : l. 152, 266
- `__tests__/layout/lettre-place-sur-le-site-s21.test.tsx` : l. 45, 101
- `__tests__/feature/bas-article-s21.test.tsx` : l. 61
- `__tests__/feature/cta-pages-s21.test.tsx` : l. 150
- `__tests__/ui/lettre-repliee-qa4.test.tsx` : l. 42
- `__tests__/lib/lettre-envoi-s21.test.ts` : l. 368 et `lettre-s21.test.ts` : l. 99 : simples corps de test (« La vanne du mois… »), aucun texte public, sans urgence.

## Points d'attention

1. **« parfois une mention de Premium » (ligne 6).** Conservé comme demandé. Mais dans les six numéros relus, l'encart Premium figure dans chaque lettre envoyée aux inscrits par adresse, qui sont justement ceux qui voient cette case. « Parfois » est donc probablement inexact depuis le 25/10. À trancher par Thomas ou @legal (par exemple « et une mention de Premium »), pas par le copywriter.
2. **Lien l. 137 de la page de confirmation.** Il emmène vers la vanne du jour, qui ne ressemble plus à la lettre. Si on veut un aperçu fidèle, l'option naturelle est le lien vers le dernier numéro déjà prévu par `dernierNumero` (l. 116). Non traité ici : hors périmètre « décrire », à décider.
3. **Titre H1 / titre de `<title>` volontairement différents** (lignes 1 et 3) : avec le suffixe du gabarit (`%s | deviens-marrant.fr`, `app/layout.tsx` l. 35), la version complète ferait 76 caractères (65 pour l'ancienne) et couperait le milieu de la phrase. « Situation » est dans la meta description.
4. **Humour : rien de nouveau à relire côté vanne**, ces textes ne contiennent aucune blague. La relecture à l'aveugle porte sur la justesse du libellé et sa longueur.

## Handoff

- Fichier produit : `/home/user/Marrant/docs/copy/description-lettre-du-mois-s22.md`
- Registre : ton du site (tutoiement, phrases courtes), vocabulaire « lettre », « une situation, trois répliques ». Framework : sans objet (microcopy descriptive). Conscience : Solution-Aware.
- Prochaine étape : relecture à l'aveugle des 9 libellés, puis @fullstack pour l'intégration (REPLIT_ACTIONS.md, tests, version de consentement v3 + archive v2).


> **Arbitrage de l'orchestrateur (25/10)** : ligne 6, « et parfois une mention de Premium » devient « et une mention de Premium » (l'encart figure dans chaque lettre envoyée aux inscrits par adresse ; « parfois » serait inexact). Version de consentement à passer à `lettre-mensuelle-v3` avec archive de la v2, mécanique existante.
