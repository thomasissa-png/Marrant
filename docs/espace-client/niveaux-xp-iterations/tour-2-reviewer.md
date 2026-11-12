# Tour 2, relecture à l'aveugle @reviewer : niveaux et XP (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/niveaux-xp-s24.md` v2 (NX2). Même grille qu'au tour 1. Faits contrôlés dans le code.

## 1. Statut de mes corrections du tour 1

| T1 | Objet | Statut | Commentaire |
|---|---|---|---|
| 1 | Sources d'XP fausses (bloquant) | ok | Tableau §1.1 complet. Vérifié : les seuls crédits côté serveur sont `parcours/[id]/progress/route.ts` l. 180 et `user/xp/route.ts` l. 51 ; le seul appelant de la route est `conseils-list.tsx` l. 177. |
| 2 | Question des 10 XP (bloquant) | ok | Q1, trois options réelles, reco argumentée. Une conséquence de B manque (Z1). |
| 3 | Q4 reposait C4 (bloquant) | ok | Supprimée, rangée dans « Déjà décidé, non reposé ». |
| 4 | Somme des seeds | ok | 3 100 confirmé ; variantes sans Storytelling (2 300) et sans Boulot (2 400) justes. |
| 5 | FAQ « 50 XP » | ok | Intacte, jamais utilisée comme donnée, go requis pour toute retouche. |
| 6 | Collision « niveau » | ok | « Cap » proposé et soumis (Q3). Vérifié : aucun texte de `config/`, `components/` ni des pages n'emploie « cap ». |
| 7 | Noms de scène | ok | N2 supprimé, principe « aucun mot de scène » écrit. |
| 8 | Place dans « Parcours » | ok, avec réserve | Après étapes et série, pas dans « Aujourd'hui » (écart assumé). Le [À VÉRIFIER dans le brief §3.2 bloc 4] se lève en une lecture (Z3). |
| 9 | Option de remplissage | ok | Q5 B est une vraie option. |
| 10 | Erreur portée par l'architecture | ok | Annexe B, cinq points précis. |

**Bilan : 9 ok, 1 ok avec réserve.**

## 2. Faits contrôlés

| Fait de NX2 | Verdict | Source |
|---|---|---|
| 4 sources d'XP, montants, anti-doublons | juste | `progression.ts` l. 35 (`PATH_COMPLETION_BONUS_XP = 100`) ; `progress/route.ts` l. 180 ; `conseils-list.tsx` l. 111 et 175 à 178 ; `user/xp/route.ts` l. 12, 26, 51 ; `user-store.ts` l. 52 à 61 |
| 3 100 (étapes + bonus), 4 300 avec 120 conseils payés une fois | juste (1 200 / 3 100 = 39 %) | seeds (lus au tour 1) ; 120 conseils actifs : INV §6 |
| Seuils de Q1 A : 3 000 sur 4 300 = 70 % | juste | calcul |
| « Conseils terminés » reste si Q1 = B | juste : ce compteur vient des étapes, pas des conseils ouverts | `api/user/route.ts` l. 52 (`tipsCompleted` calculé sur `pathProgress`) |
| FAQ « 50 XP par semaine » | juste, intacte | `lib/faqs.ts` l. 21 |
| §1.4 « Pas de recherche plein texte possible » | **faisable et faite ici** | « XP » apparaît dans 32 fichiers de `apps/web/src` ; les textes publics sont listés en Z1 |
| E-mails, lettres, app | levable | Aucun « XP » ni nom de niveau dans `onboarding-premium-s23-emails.md`, ni dans `apps/web/src/data` (lettres, carnet), ni dans `apps/mobile`. Mais l'écran d'accueil mobile de `apps/web/src/components/mobile/OnboardingFlow.tsx` (l. 216 à 218) dit « Garde tes XP et ton parcours ». |

## 3. Notes

| # | Critère | T1 | T2 | Justification |
|---|---|---|---|---|
| 1 | Exactitude des faits | 5 | 9 | Toutes les sources et tous les totaux sont justes. Restent des [À VÉRIFIER] levables et un inventaire incomplet (Z1, Z3). |
| 2 | Valeur pour les personas (progrès réel contre activité) | 8 | 9 | « La réponse à « Tu avais une réponse ? » ne rapporte ni XP ni cap, aujourd'hui ni plus tard » est la meilleure règle du document ; la règle C est exposée honnêtement (Goodhart, retours non stockés). |
| 3 | Ton maison des noms | 7 | 9 | E1 au ton, tiré de la conversation, cap 1 non passif. « Tu tiens la conversation » et « Ta patte » sont signalés comme les plus exposés, à tester : la mise à l'étalon tranchera. |
| 4 | Respect des [CHOIX UTILISATEUR] | 6 | 10 | C4 non reposée ; règle C marquée « touche l'esprit de ta décision du 12/11 » ; FAQ intacte ; XP d'étape et bonus inchangés. |
| 5 | Qualité des questions | 7 | 9 | Q1 en premier, options réelles, recos argumentées. Mais Q4 suppose Q1 = B sans le dire (Z2). |
| 6 | Honnêteté des risques | 6 | 9 | Faille écrite au présent, correction de sécurité tranchée sans question. Mais Q1 B tait qu'un texte validé promet des XP sur la page des conseils (Z1). |
| 7 | Cohérence avec l'architecture | 7 | 10 | Placement distinct de « Tes 4 premières semaines », vocabulaire de scène retiré, annexe B précise pour v11 et v12. |

**Note globale : 9,3 / 10** (65 / 70 ; tour 1 : 6,6). Aucun bloquant.

## 4. Nouvelles corrections

1. **Z1. §1.4 (« Pas de recherche plein texte possible dans cette session ») et Q1 B (« la bulle « +10 XP » disparaît de la liste des conseils »).** Problème : la recherche est faisable ; je l'ai faite. Un texte public touché par la reco manque : `app/(dashboard)/conseils/page.tsx` l. 161, sur la page des conseils elle-même : « Progresse semaine après semaine avec des exercices concrets et des XP. » Si Q1 = B, cette phrase devient en partie fausse, et c'est un texte en ligne qui demande le go de Thomas. Les autres mentions publiques ne sont pas touchées par Q1 et peuvent être listées comme « inchangées » :
   - `page.tsx` (accueil) l. 105 et 122 ;
   - `a-propos/page.tsx` l. 135 ;
   - `parcours/(liste)/page.tsx` l. 80 ;
   - `videos/page.tsx` l. 64 ;
   - `lib/llms-content.ts` l. 83 (« XP à chaque étape validée ») ;
   - `lib/blog-articles.ts` l. 1917 ;
   - `config/textes/entrees-parcours.ts` l. 61 (FAQ : « tes XP montent à chaque étape validée ») ;
   - `confidentialite/page.tsx` l. 97 (« XP, niveau, série » : nom de donnée, inchangé même avec « cap ») ;
   - `components/mobile/OnboardingFlow.tsx` l. 216 à 218.

   Correction : compléter §1.4 avec ces lignes ; ajouter à Q1 B « la phrase de la page des conseils (« … et des XP ») serait à retoucher, avec ton go ». **Bloquant : non.**
2. **Z2. Q4 « A. Reco : environ quatre parcours (2 300 XP…) ».** Problème : 2 300 n'est le bon seuil que si Q1 = B. Avec Q1 = A, le seuil équivalent est 3 000 (§3.1). Correction : préciser en tête de Q4 « (seuils pour Q1 = B ; si tu gardes les conseils, 3 000 au lieu de 2 300) ». **Bloquant : non.**
3. **Z3. [À VÉRIFIER] levables.**
   - §3.0 « [À VÉRIFIER dans le brief §3.2 bloc 4] » : le brief dit « Progression : étapes faites et série en tête ; XP et niveau (NOVICE à LEGENDE, noms d'affichage à valider) ensuite », et c'est un bloc d'« Aujourd'hui ». L'écart « pas dans Aujourd'hui » est donc bien un écart avec le brief, à citer tel quel.
   - §3.4 « [À VÉRIFIER @ux] « cap » n'est utilisé ailleurs » : vérifié, aucun texte client ne l'emploie.
   - §1.4 e-mails et app : aucun « XP » dans les e-mails approuvés ni dans `apps/mobile` ; seul l'écran d'accueil mobile de `apps/web` le cite.

   Correction : remplacer ces trois [À VÉRIFIER] par les faits. **Bloquant : non.**
4. **Z4. §2.5 (2) « un conseil ne rapporte qu'une seule fois par compte (enregistré en base, une ligne par abonné et par conseil) ».** Problème : utile seulement si Q1 = A ou C. Avec la reco B, c'est une table à construire pour rien. Correction : « (1) tout de suite ; (2) seulement si Q1 = A ou C ; si Q1 = B, l'action « tip_read » est retirée du barème du serveur ». **Bloquant : non.**

**Conditions du 10/10** : Z1 à Z4 (compléments de libellé et d'inventaire, sans effet sur les recos), puis un tour à l'aveugle limité à ces passages.
