# Trajets de conversion s21, v2 : captures du trajet enchaîné

Branche `claude/marrant-conversion`, build de production local (base jetable, variables factices de la CI, aucune clé Stripe). Chaque trajet est capturé **en 375 × 700 et en 320 × 640** (un sous-dossier par taille), comme l'exige la grille `docs/ux/trajet-conversion-s21.md` §11 : la note se donne sur le plus étroit. Textes : `docs/copy/conversion-s21/textes-trajet-v2.md` et ses arbitrages du tour 2. Promesse de la lettre hebdomadaire à `false` : aucune ligne « lettre » à l'écran.

**Ce qui change par rapport à la v1 dans le déroulé**
- Inscription par e-mail : **plus de page d'attente**. Après « Créer mon compte et passer au paiement », le bouton passe à « On t'emmène au paiement… » (roue de chargement) et Stripe s'ouvre depuis /register. L'écran « 05-avant-stripe » est donc /register avec ce bouton.
- Retour de Google ou connexion (« Déjà un compte ? ») : attente brève sous l'en-tête, sans pied de page (`T1-annuel/*/05b-page-attente-connexion.png`).
- Stripe n'est pas capturable : l'appel au paiement est intercepté et retenu le temps de la capture. Pour T1 et T4, le paiement est ensuite simulé comme dans `playwright/tests/local/conversion-v2-s21.spec.ts` : plan Premium écrit en base (ce que fait le webhook), puis la `success_url` de Stripe ; la page de retour vérifie le plan sur le vrai serveur et la capture « 06-retour-bienvenue » est l'écran réel d'arrivée.
- Chaque trajet vérifie aussi que la source du clic d'entrée arrive jusqu'à l'événement `checkout-ouvert`, avec la formule.

Régénérer : `CAPTURES_TRAJETS=1 npm run test:e2e:local -- captures-trajets` (dans `apps/web`, serveur local et base jetable ; script `playwright/tests/local/captures-trajets-conversion-s21.spec.ts`).

| Dossier | Trajet | Écrans, dans l'ordre (dans `375x700/` et `320x640/`) | Source mesurée jusqu'au paiement |
|---|---|---|---|
| `T1-en-tete/` | T1 En-tête (visiteur) : « Premium » de l'en-tête, depuis /conseils | 01 clic d'entrée · 02 /abonnement premier écran · 03 /abonnement complète · 04 /register · 05 avant Stripe (attente dans le bouton) · **06 retour de paiement réussi (bienvenue)** | `header`, mensuel |
| `T1-annuel/` | T1 avec « Annuel » choisi | 02 premier écran, annuel coché, ligne « Renouvelé chaque année, sauf résiliation. » · 03 page complète · 04 /register (« Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. ») · 05 avant Stripe · 05b page d'attente brève (connexion), « Premium, 24,99 €/an, renouvelé chaque année. » | `header`, annuel |
| `T2-mur-vannes/` | T2 Mur de liste (visiteur) : « Ouvrir la suite des vannes · 2,99 €/mois » sur /vannes | 01 · 02 (accroche « Pour la suite des vannes » en 16 px) · 03 · 04 (« Après le paiement, la suite des vannes s'ouvre. », plus de lien gratuit) · 05 | `mur-vannes` |
| `T3-fin-etape-1/` | T3 Fin d'étape 1 (visiteur, quiz de l'étape 1 fait) : « Passer à l'étape 2 · 2,99 €/mois » de Répartie | **01a carte « Étape 2 sur 4 »** · 01 clic d'entrée · 04 /register (« … l'étape 2 de Répartie s'ouvre : Le rythme et les silences. ») · 05 | `parcours-etape` |
| `T4-fenetre-premium/` | T4 Fenêtre Premium (visiteur) : étoile d'une vanne de /vannes | 01 · 02 fenêtre (« Garde-la avec Premium », rappel de la vanne, ligne Premium, prix, ligne compte) · 04 /register (« Après le paiement, ta vanne est dans tes favoris. ») · 05 · **06 retour de paiement (bienvenue)** · **07 étoile pleine : la vanne est dans les favoris** | `modale-favoris` |
| `T5-fin-article/` | T5 Fin d'article (visiteur) : « Tout ouvrir · 2,99 €/mois » en plein, à la fin de l'article n°1 | 01 · 02 (sans accroche : le titre fait l'écho) · 03 · 04 · 05 | `blog-meilleures-blagues-droles-2026` |
| `C1-connecte-en-tete/` | Compte sans abonnement, en-tête | 01 · 02 · 03 (ni « Déjà un compte ? » ni « Pas encore sûr ? ») · 04 avant Stripe (bouton en chargement, roue) | `header` |
| `C2-connecte-mur-vannes/` | Compte sans abonnement, mur /vannes | 01 · 02 · 03 · 04 avant Stripe | `mur-vannes` |
| `FAQ-prix/` | /abonnement, FAQ ouverte sur la question prix | réponse avec « Les 14 jours courent dès ton abonnement. Un renouvellement n'ouvre pas de nouveau délai. » (annuel disponible : « …, annuel compris. ») | sans objet |
| `desktop-1280/` | /abonnement à 1 280 px (visiteur, depuis l'en-tête) | premier écran (carte limitée à 560 px) · page complète | sans objet |

T3 et T4 vont directement à /register, sans passer par /abonnement : c'est le trajet prévu par la grille (2 écrans avant Stripe).

**Mesures du premier écran** (Playwright, `conversion-v2-s21.spec.ts`) : à 320 × 640, bas du bouton « S'abonner · 2,99 €/mois » à 585 px depuis l'en-tête et à 613 px depuis le mur des vannes (accroche en plus) ; compte connecté, même contrôle. Avec « Annuel » coché, le bouton reste dans le premier écran (capture `T1-annuel/320x640/02`).
