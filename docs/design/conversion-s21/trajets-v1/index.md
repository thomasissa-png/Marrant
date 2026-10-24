# Trajets de conversion s21, v1 : captures du trajet enchaîné

Branche `claude/marrant-conversion`, build de production local (base jetable), 375 × 812 sauf mention contraire. Grille de relecture : `docs/ux/trajet-conversion-s21.md` §11. Textes : `docs/copy/conversion-s21/textes-trajet-v1.md` (arbitrages du 19/10). Promesse de la lettre hebdomadaire à `false` : aucune ligne « lettre » à l'écran.

Stripe n'est pas capturable : le dernier écran de chaque trajet est celui qui s'affiche juste avant le départ vers Stripe (page d'attente « Te voilà connecté. » pour un visiteur qui vient de créer son compte, bouton « On t'emmène au paiement… » pour un compte déjà connecté). Pour chaque trajet, le script vérifie aussi que la source du clic d'entrée arrive jusqu'à l'événement `checkout-ouvert`.

Régénérer : `CAPTURES_TRAJETS=1 npm run test:e2e:local -- captures-trajets` (dans `apps/web`, serveur local et base jetable ; script `playwright/tests/local/captures-trajets-conversion-s21.spec.ts`).

| Dossier | Trajet | Écrans, dans l'ordre | Source mesurée jusqu'au paiement |
|---|---|---|---|
| `T1-en-tete/` | T1 En-tête (visiteur) : bouton « Premium » de l’en-tête à 375 px (repli : « Premium · 2,99 € » ne tient pas sous 640 px), depuis /conseils | 01 clic d'entrée · 02 /abonnement premier écran · 03 /abonnement complète · 04 /register · 05 avant Stripe | `header` |
| `T2-mur-vannes/` | T2 Mur de liste (visiteur) : « Voir la suite des vannes · 2,99 €/mois » sur /vannes | 01 · 02 (accroche « Pour la suite des vannes », ligne « Listes » mise en avant) · 03 · 04 · 05 | `mur-vannes` |
| `T3-fin-etape-1/` | T3 Fin d'étape 1 (visiteur) : « Passer à l'étape 2 · 2,99 €/mois » de Répartie | 01 · 04 /register (« Après le paiement, l'étape 2 de Répartie s'ouvre. ») · 05 | `parcours-etape` |
| `T4-fenetre-premium/` | T4 Fenêtre Premium (visiteur) : cœur d'une vanne de /vannes | 01 · 02 fenêtre · 04 /register · 05 | `modale-favoris` |
| `T5-fin-article/` | T5 Fin d'article (visiteur) : « Tout ouvrir · 2,99 €/mois » à la fin de l'article n°1 | 01 · 02 (accroche « Pour tout ouvrir ») · 03 · 04 · 05 | `blog-meilleures-blagues-droles-2026` |
| `C1-connecte-en-tete/` | Compte sans abonnement, en-tête | 01 · 02 · 03 (sans « Déjà un compte ? » ni « Pas encore sûr ? ») · 04 avant Stripe | `header` |
| `C2-connecte-mur-vannes/` | Compte sans abonnement, mur /vannes | 01 · 02 · 03 · 04 avant Stripe | `mur-vannes` |
| `desktop-1280/` | /abonnement à 1 280 px (visiteur, depuis l'en-tête) | premier écran · page complète | sans objet |

T3 et T4 vont directement à /register, sans passer par /abonnement : c'est le trajet prévu par la grille (2 écrans avant Stripe).
