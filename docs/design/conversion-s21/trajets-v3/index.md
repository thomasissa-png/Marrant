# Trajets de conversion s21, v3 : captures du trajet enchaîné

Branche `claude/marrant-conversion`, build de production local (base jetable, variables factices de la CI, aucune clé Stripe). Chaque trajet est capturé **en 375 × 700 et en 320 × 640** (un sous-dossier par taille), comme l'exige la grille `docs/ux/trajet-conversion-s21.md` §11 : la note se donne sur le plus étroit. Textes : `docs/copy/conversion-s21/textes-trajet-v3.md` et ses arbitrages du tour 3. Promesse de la lettre hebdomadaire à `false` : aucune ligne « lettre » à l'écran.

**Déroulé (inchangé depuis la v2)**
- Inscription par e-mail : pas de page d'attente. Après « Créer mon compte et passer au paiement », le bouton passe à « On t'emmène au paiement… » et Stripe s'ouvre depuis /register (« 05-avant-stripe »).
- Retour de Google ou connexion : attente brève, « Dernière étape. » (`T1-annuel/*/05b-page-attente-connexion.png`).
- Stripe n'est pas capturable : l'appel au paiement est intercepté et retenu le temps de la capture. Pour T1 et T4, le paiement est ensuite simulé comme dans `playwright/tests/local/conversion-v2-s21.spec.ts` et `conversion-v3-s21.spec.ts` (plan Premium en base, ce que fait le webhook, puis la `success_url` de Stripe) ; « 06-retour-bienvenue » est l'écran réel d'arrivée.
- Chaque trajet vérifie que la source du clic d'entrée arrive jusqu'à `checkout-ouvert`, avec la formule.

**Nouveau en v3** : retour sur la page d'origine après le paiement (T1 : /conseils, et non /parcours) ; bienvenue selon le cas (BV1 sans progression, BV3 favori ajouté) ; garantie juste sous le bouton, au-dessus de la flottaison à 320 × 640 ; renouvellement dans la carte Annuel ; barre fixe au prix de la formule choisie ; carte « Étape 2 sur 4 » et rappel de la vanne en phrases entières ; scène du carnet (titre de la fiche) ; « Et si j'arrête ? » dans la FAQ.

Régénérer : `CAPTURES_TRAJETS=1 npm run test:e2e:local -- captures-trajets` (dans `apps/web`, serveur local et base jetable ; script `playwright/tests/local/captures-trajets-conversion-s21.spec.ts`).

| Dossier | Trajet | Écrans, dans l'ordre (dans `375x700/` et `320x640/`) | Source mesurée jusqu'au paiement |
|---|---|---|---|
| `T1-en-tete/` | T1 En-tête (visiteur), depuis /conseils | 01 clic d'entrée · 02 /abonnement premier écran (garantie sous le bouton) · 03 page complète · 04 /register · 05 avant Stripe · **06 retour sur /conseils, bienvenue BV1 « … Sers-toi. »** | `header`, mensuel |
| `T1-annuel/` | T1 avec « Annuel » choisi | 02 premier écran, annuel coché · **02b barre fixe « S'abonner · 24,99 €/an »** · 03 page complète · 04 /register (« Premium, 24,99 €/an, renouvelé chaque année, sauf résiliation. ») · 05 avant Stripe · 05b attente brève (connexion), « Dernière étape. » et la même ligne annuelle | `header`, annuel |
| `T2-mur-vannes/` | T2 Mur de liste (visiteur) | 01 · 02 (accroche « Pour la suite des vannes ») · 03 · 04 · 05 | `mur-vannes` |
| `T3-fin-etape-1/` | T3 Fin d'étape 1 (visiteur, quiz fait) | **01a carte « Étape 2 sur 4 », « Certaines phrases ne demandent aucun talent, seulement un bon timing. »** · 01 clic d'entrée · 04 /register · 05 | `parcours-etape` |
| `T4-fenetre-premium/` | T4 Fenêtre Premium (visiteur, étoile d'une vanne) | 01 · 02 fenêtre (vanne entière, « … Moi, dix euros. ») · 04 /register · 05 · **06 retour, bienvenue BV3 « Ta vanne est dans tes favoris. … »** · 07 étoile pleine | `modale-favoris` |
| `T5-fin-article/` | T5 Fin d'article (visiteur), article n°1 | 01 (« Premium ouvre le catalogue, les parcours et leurs exercices. », lien « Tester l'étape 1 de Répartie, gratuite » en graisse normale) · 02 · 03 · 04 · 05 | `blog-meilleures-blagues-droles-2026` |
| `C1-connecte-en-tete/` | Compte sans abonnement, en-tête | 01 · 02 · 03 · 04 avant Stripe | `header` |
| `C2-connecte-mur-vannes/` | Compte sans abonnement, mur /vannes | 01 · 02 · 03 · 04 avant Stripe | `mur-vannes` |
| `FAQ-prix/` | /abonnement, FAQ prix ouverte, **barre fixe visible** | la réponse se lit en entier au-dessus de la barre (« …nouveau délai. »), puis « Et si j'arrête ? » | sans objet |
| `desktop-1280/` | /abonnement à 1 280 px | premier écran (prix alignés en haut) · page complète (carnet, tableau, bouton du bas à 560 px) | sans objet |

**Mesures** (Playwright, `conversion-v3-s21.spec.ts`) : à 320 × 640, la garantie finit à 608 px depuis l'en-tête et à 636 px depuis le mur (accroche en plus), en mensuel comme en annuel ; à 375 × 700 depuis le mur, à 647 px. Le bouton ne bouge pas à la bascule mensuel ou annuel.

**Non capturé** : bienvenue BV2 (compte avec une progression à reprendre ; couverte par le test Jest `premium/bienvenue-v3-s21.test.tsx`) ; attente au retour de Google (pas de Google en local ; même écran que la connexion).
