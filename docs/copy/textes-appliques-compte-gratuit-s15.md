# Textes appliqués : suppression du compte gratuit (s15, 06/10/2026, @fullstack)

> Pour relecture @copywriter. Source : étalons validés par Thomas le 06/10 (`docs/copy/etalons-chemin-premium-s15.md`, recos 1.2, 2.1, 3.1 + 3.2c, 4.1, 5.2) et spec `docs/product/suppression-compte-gratuit-s15.md` §3.1.
> Statut par ligne : **ÉTALON** = texte validé tel quel ; **DÉCLINÉ** = modèle de l'étalon appliqué à un autre emplacement, à relire ; **SPEC** = libellé écrit dans la spec (§2, §3.1), à relire ; **RETRAIT** = texte supprimé sans remplacement.
> Chemins relatifs à `apps/web/src/`. Lignes = état après modification. Aucun tiret cadratin ajouté (contrôle sur le diff : 0). Prix et « 1 500+ » inchangés. Slugs, H1/H2 d'articles, FAQ : non touchés.

## 1. Étalons validés appliqués

| Fichier:ligne | Avant | Après | Statut |
|---|---|---|---|
| `components/home/hero-section.tsx:70` | Créer mon compte gratuit | Accéder aux parcours complets | ÉTALON 1.2 |
| `components/home/hero-section.tsx:73` | Puis 2,99 €/mois pour tout débloquer, sans engagement | 2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre. | ÉTALON 1.2 |
| `components/home/home-cta.tsx:36` | Créer mon compte gratuit | Accéder aux parcours complets | ÉTALON 1.2 |
| `components/home/home-cta.tsx:38` | Puis 2,99 €/mois pour tout débloquer, sans engagement | 2,99 €/mois, sans engagement. | ÉTALON 1.2 |
| `app/(auth)/register/page.tsx:179` | (aucun) | Étape 1 sur 2 | ÉTALON 2.1 |
| `app/(auth)/register/page.tsx:180` (H1) | Crée ton compte, ta première vanne t'attend | Ton compte | ÉTALON 2.1 |
| `app/(auth)/register/page.tsx:37-41` (rappel, mensuel) | (aucun) | Accès complet, 2,99 €/mois, annulable à tout moment. | ÉTALON 2.1 |
| idem (rappel, `plan=annual`) | (aucun) | Accès complet, 24,99 €/an (soit 2,08 € par mois), annulable à tout moment. | ÉTALON 2.1 (gabarit annuel) |
| `app/(auth)/register/page.tsx:283` | Créer mon compte | Créer mon compte (inchangé) | ÉTALON 2.1 |
| `app/(auth)/register/page.tsx:297` | (aucun) | Étape 2 : le paiement sécurisé, juste après. | ÉTALON 2.1 |
| `app/(auth)/register/layout.tsx:6` (meta, noindex) | Crée ton compte sur deviens-marrant.fr et commence à progresser en humour dès 2,99 €/mois. | Crée ton compte pour activer l'accès complet : parcours, listes et carnet, dès 2,99 €/mois. | ÉTALON 2.1 (meta recommandée) |
| `components/blog/article-cta.tsx:35` (défaut) | Essaie gratuitement | Passer à l'accès complet | ÉTALON 3.1 |
| `components/blog/article-cta.tsx:37` (défaut) | Compte gratuit : 10 vannes, 3 conseils, 3 vidéos, contenu du jour. Sans carte. | 2,99 €/mois, sans engagement. Cet article reste en lecture libre. | ÉTALON 3.1 |
| `components/blog/article-cta.tsx:36` (défaut) | (second bouton « Tout débloquer à 2,99 €/mois ») | Lien : Lire la première étape d'un parcours (vers `/parcours`) | ÉTALON 3.1 |
| `config/blog-cta.ts:54-61` (couple) | voir §2 | texte, bouton, note, lien de 3.2c exacts | ÉTALON 3.2c |
| `components/vannes/how-to-apply-gate.tsx:37-39` | L'exercice d'application (consigne + exemple concret à réutiliser) est réservé aux membres. Crée ton compte gratuit pour le débloquer. | L'exercice (consigne + exemple à réutiliser) fait partie de l'accès complet. Voir l'accès complet | ÉTALON 4.1 |
| `app/(dashboard)/vannes/[slug]/page.tsx:282` | Créer un compte gratuit | Voir l'accès complet | ÉTALON 4.1 (bouton) |
| `app/(dashboard)/conseils/[slug]/page.tsx:200` | L'exercice complet pour appliquer cette technique dès aujourd'hui t'attend avec ton compte gratuit. | L'exercice pour appliquer cette technique fait partie de l'accès complet. | ÉTALON 4.1 |
| `app/(dashboard)/conseils/[slug]/page.tsx:207` | Créer un compte gratuit | Voir l'accès complet | ÉTALON 4.1 |
| `app/(dashboard)/videos/[slug]/page.tsx:220` | Les points clés à retenir et l'exercice pour appliquer la technique sont accessibles gratuitement quand tu crées ton compte. Tu récupères aussi ton contenu quotidien et la première étape de chaque parcours. | Les points clés et l'exercice de cette vidéo font partie de l'accès complet. | ÉTALON 4.1 |
| `app/(dashboard)/videos/[slug]/page.tsx:227` | Créer un compte gratuit | Voir l'accès complet | ÉTALON 4.1 |
| `components/parcours/parcours-detail.tsx:800` | Crée ton compte gratuit pour valider l'étape | Valider l'étape fait partie de l'accès complet. | ÉTALON 4.1 (déclinaison étape) |
| `components/parcours/parcours-detail.tsx:806` | (le bouton portait le texte) | Voir l'accès complet | ÉTALON 4.1 |
| `components/profil/profil-dashboard.tsx:399` (si `xp > 0`) | (aucun) | Les {xp} XP que tu as gagnés sont conservés et reprennent là où tu les as laissés. | ÉTALON 5.2 (phrase XP) |

## 2. Les 12 CTA de `config/blog-cta.ts` (titres inchangés)

Règle appliquée : article qui nomme un parcours (Répartie, Confiance) = modèle 3.2c (texte « Le parcours X t'entraîne à …, étape après étape. », bouton « Commencer le parcours X », note 3.2c, lien « Lire l'étape 1 de X », retour après paiement sur ce parcours) ; sinon modèle 3.1 (texte « Les parcours complets : » + la fin de phrase « de quoi … » de l'article, gardée comme le prévoit l'étalon ; bouton 3.1 ; note 3.1 avec le complément « Les <objet> de cette page restent en accès libre. » de 3.1c ; lien par défaut). Avant, pour les 12 : bouton « Créer mon compte gratuit », texte « Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours[, dont X] : de quoi … », note « Gratuit, sans carte[ bancaire]. Les <objet> de cette page restent en accès libre, compte ou pas. ».

| Fichier:ligne | Slug | Modèle | Texte après | Bouton après | Note après |
|---|---|---|---|---|---|
| `config/blog-cta.ts:24-29` | meilleures-blagues-droles-2026 | 3.1 | Les parcours complets : de quoi t'entraîner à les placer au bon moment, pas juste à les connaître. | Passer à l'accès complet | 2,99 €/mois, sans engagement. Les vannes de cette page restent en accès libre. |
| `:31-36` | message-anniversaire-drole-par-situation | 3.1 | Les parcours complets : de quoi trouver la bonne phrase aussi à l'oral, pas seulement par écrit. | Passer à l'accès complet | … Les messages de cette page restent en accès libre. |
| `:38-43` | voeux-drole-nouvelle-annee | 3.1 | Les parcours complets : de quoi trouver tes propres chutes d'ici l'an prochain. | Passer à l'accès complet | … Les messages de cette page restent en accès libre. |
| `:45-52` | premier-message-drole-appli-de-rencontre | 3.2c (2 parcours) | Les parcours Confiance et Répartie t'entraînent à oser envoyer, puis à tenir la conversation qui suit, étape après étape. | Commencer le parcours Confiance | Accès complet à 2,99 €/mois, sans engagement. La première étape se lit sans compte. (lien : Lire l'étape 1 de Confiance) |
| `:54-61` | blagues-de-couple-drole | 3.2c exact | Le parcours Répartie t'entraîne à renvoyer la balle quand l'autre te répond du tac au tac, étape après étape. | Commencer le parcours Répartie | idem 3.2c (lien : Lire l'étape 1 de Répartie) |
| `:63-68` | blagues-poisson-d-avril-adultes | 3.1 | Les parcours complets : de quoi trouver la bonne réponse le jour où c'est toi la cible. | Passer à l'accès complet | … Les idées de cette page restent en accès libre. |
| `:70-77` | blagues-de-gamer-jeux-video | 3.2c | Le parcours Répartie t'entraîne à renvoyer la balle quand ta team te répond du tac au tac, étape après étape. | Commencer le parcours Répartie | idem 3.2c |
| `:79-84` | refuser-une-invitation-avec-humour | 3.1 | Les parcours complets : de quoi trouver la bonne phrase aussi à l'oral, quand on te redemande en face, pas seulement par écrit. | Passer à l'accès complet | … Les réponses de cette page restent en accès libre. |
| `:86-91` | mot-de-depart-collegue-drole | 3.1 | Les parcours complets : de quoi t'entraîner à la répartie pour le pot, pas seulement pour la carte. | Passer à l'accès complet | … Les textes de cette page restent en accès libre. |
| `:93-100` | message-drole-fete-des-meres | 3.2c | Le parcours Confiance t'entraîne, étape après étape, à trouver tes mots au téléphone ou à table aussi, quand il n'y a plus de texte à copier. | Commencer le parcours Confiance | idem 3.2c |
| `:102-107` | message-drole-fete-des-peres | 3.1 | Les parcours complets : de quoi oser la phrase à voix haute, au téléphone ou à table, pas seulement par SMS. | Passer à l'accès complet | … Les messages de cette page restent en accès libre. |
| `:109-116` | blagues-vacances-ete-entre-amis | 3.2c | Le parcours Confiance t'entraîne, étape après étape, à sortir ta vanne devant tout le groupe, même si tu n'es pas le drôle de la bande. | Commencer le parcours Confiance | idem 3.2c |

Points à trancher par @copywriter : (a) « Les parcours complets : de quoi … » se lit bien mais reste nominal (forme reprise de 3.1c) ; (b) appli de rencontre : deux parcours nommés, bouton et lien sur Confiance (premier cité dans l'ancien texte) ; (c) fête des mères et vacances : « étape après étape » déplacé en incise pour éviter une fin de phrase à rallonge.

## 3. Autres textes de l'inventaire §3.1 (déclinés ou repris de la spec)

| Fichier:ligne | Avant | Après | Statut |
|---|---|---|---|
| `components/premium/abonnement-view.tsx:113` (H1 visiteur) | Crée ton compte, deviens drôle | Accéder aux parcours complets | DÉCLINÉ 1.2 |
| `components/premium/abonnement-view.tsx:116` (sous-titre visiteur) | Compte gratuit d'abord (10 vannes, 3 conseils, 3 vidéos, la première étape de chaque parcours). Tu passes à l'accès complet quand tu veux, à 2,99 €/mois[ ou 24,99 €/an]. | 2,99 €/mois[ ou 24,99 €/an], sans engagement. La première étape de chaque parcours reste en lecture libre. | DÉCLINÉ 1.2 |
| `components/premium/abonnement-view.tsx` (ex `:134-153`) | Bloc « Compte gratuit » : « 10 vannes, 3 conseils, 3 vidéos, le contenu du jour et la première étape de chaque parcours. Sans carte. », « Crée ton compte gratuit », « Commence gratuitement, tu passes premium quand tu veux. » | (supprimé) | RETRAIT (spec §2.2) |
| `app/(dashboard)/a-propos/page.tsx:214` | Créer mon compte gratuit | Accéder aux parcours complets | DÉCLINÉ 1.2 |
| `app/(dashboard)/a-propos/page.tsx:216` | Puis 2,99 €/mois pour tout débloquer, sans engagement | 2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre. | DÉCLINÉ 1.2 |
| `components/auth/auth-cta.tsx:28` (libellé par défaut, aucun usage actuel) | Créer un compte pour commencer | Accéder aux parcours complets | DÉCLINÉ 1.2 |
| `components/quiz/viral-quiz.tsx:102` (vers `/abonnement`, retour au parcours conseillé) | Crée ton compte gratuit et commence un parcours | Accéder aux parcours complets | DÉCLINÉ 1.2 |
| `components/vannes/vannes-list.tsx:205` | Crée ton compte gratuit pour garder tes XP et commencer un parcours, ou passe à l'accès complet à 2,99 €/mois : tout le catalogue, les filtres et les favoris. | Passe à l'accès complet à 2,99 €/mois : tout le catalogue, les filtres et les favoris. | SPEC (un seul CTA) |
| `components/vannes/vannes-list.tsx` (ex `:208`) | Bouton « Créer mon compte » | (supprimé ; « Tout débloquer » devient le bouton principal, inchangé) | RETRAIT |
| `components/vannes/vannes-list.tsx:202` | Aperçu gratuit : 10 vannes accessibles sans compte. | inchangé (vrai) | |
| `components/premium/premium-benefits.tsx:56` | … 3 vidéos en compte gratuit, avec … | … 3 vidéos sans abonnement, avec … | SPEC |
| `components/profil/profil-dashboard.tsx:361` (badge) | Gratuit | Aucun abonnement | SPEC |
| `components/profil/profil-dashboard.tsx:369` (abonné) | … toutes les vidéos, les filtres avancés et les parcours complets. | … toutes les vidéos, les filtres et les parcours complets. | SPEC (« avancés » retiré) |
| `components/profil/profil-dashboard.tsx:395` (non abonné) | Passe Premium pour débloquer tout le catalogue, les filtres avancés et les parcours complets. | Passe Premium pour débloquer tout le catalogue, les filtres et les parcours complets. | SPEC |
| `lib/llms-content.ts:77` et `:155` (FAQ « Combien ça coûte ? ») | Un accès gratuit permanent (10 vannes, 3 conseils, 3 vidéos et le contenu du jour) et un accès complet à 2,99 €/mois, … | Sans abonnement et sans compte : 10 vannes, 3 conseils, 3 vidéos et le contenu du jour. L'accès complet est à 2,99 €/mois, … | SPEC |
| `lib/llms-content.ts:123` (tarifs) | Accès gratuit : 10 vannes, … | Sans abonnement et sans compte : 10 vannes, … | SPEC |
| `app/(auth)/login/page.tsx:231` | Pas encore de compte ? | Pas encore abonné ? | SPEC |
| `app/(auth)/login/page.tsx:236` | Créer un compte | Créer mon compte et m'abonner | SPEC (libellé de la modale) |
| `components/premium/premium-modal.tsx:109` | Créer un compte pour commencer | Créer mon compte et m'abonner | SPEC |
| `components/premium/premium-modal.tsx:25` (raison `vote`, nouvelle) | (aucun) | Le vote sur les nouveautés fait partie de l'accès complet | DÉCLINÉ 4.1 |
| `components/layout/header.tsx:101` et `:218` (compte non abonné) | (aucun bouton) | Activer mon accès | SPEC §2.4 |
| `app/(auth)/register/page.tsx:192-196` (e-mail déjà inscrit, 409) | Un compte avec cet email existe déjà (message API brut) | Cet e-mail a déjà un compte. Connecte-toi pour reprendre ton abonnement. (« Connecte-toi » = lien, destination gardée) | Proposition du doc d'étalons (« hors étalon ») : [À VÉRIFIER @copywriter] |
| `app/(dashboard)/cgu/page.tsx:21` | … de plus de 15 ans. Un compte gratuit donne accès à une partie du contenu ; l'accès à l'ensemble du contenu nécessite un abonnement actif. … | … de plus de 15 ans. L'accès à l'ensemble du contenu nécessite un abonnement actif. … | GO Thomas (phrase seule retirée, majuscule rétablie) |
| `components/mobile/OnboardingFlow.tsx:218-219` (composant importé nulle part, app mobile) | Crée ton compte gratuit pour garder tes XP et reprendre ton parcours là où tu l'as laissé, sur tous tes appareils. | Le suivi de tes XP et de ton parcours, sur tous tes appareils, fait partie de l'accès complet. | DÉCLINÉ 4.1 [À VÉRIFIER usage] |
| `components/parcours/parcours-detail.tsx:608`, `parcours-content.tsx:279` | Badge « Essai gratuit » | inchangé (vrai : lecture libre ; spec : à aligner seulement si @copywriter le juge utile) | |
| `components/home/hero-section.tsx:79`, `home-cta.tsx:44` | Voir les vannes gratuites | inchangé (vrai) | |

## 4. Balayage §3.4 (rapport)

Commande : `rg -i "compte gratuit|comptes? gratuits?|accès gratuit|essaie gratuitement|sans carte|réservé aux (membres|inscrits)|membres? connect|inscri|créer un compte|crée ton compte|gratuit" apps/web/src docs/content` (hors tests).
- « compte gratuit » : 0 occurrence côté utilisateur ; restent uniquement des commentaires de code qui disent « plus de compte gratuit » (garde-fou : `__tests__/feature/suppression-compte-gratuit-s15.test.ts`).
- « gratuit » restant, classé vrai : « Voir les vannes gratuites » (hero, accueil), « Aperçu gratuit : 10 vannes accessibles sans compte », badge « Essai gratuit » (étape 1), quiz « 100 % gratuit, sans inscription », « QUIZ GRATUIT » (image OG), CGU « résilier … gratuitement », admin « Plan gratuit » (back-office, nom du plan FREE en base), contenus éditoriaux (vannes, articles : « méchanceté gratuite », « matériel gratuit »…).
- Articles : `lib/blog-articles.ts`, `src/data/*.json`, `docs/content` : 0 « compte gratuit ». Base `BlogArticle.content` : requête SQL non exécutée dans cette session [À VÉRIFIER : `SELECT slug FROM "BlogArticle" WHERE content ILIKE '%compte gratuit%' OR content ILIKE '%inscription gratuite%';`].
- E-mail de bienvenue : aucun dans le code (pas d'envoi à l'inscription). `lib/emails/annual-renewal-reminder.ts:65` « ton compte repasse en gratuit » : formulation devenue imprécise (l'ex-abonné garde l'accès sans abonnement), non modifiée car e-mail légal L.215-1 et zone de l'autre agent [À VÉRIFIER @legal + @copywriter].
