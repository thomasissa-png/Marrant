# Audit qualité du texte des pages du site (hors articles et fiches) : s20

> Auteur : @reviewer, 13/10/2026. Lecture du code (`apps/web/src`), aucun fichier modifié.
> Barre : règle d'or P0 s18. Types de défaut : (1) fait / chiffre / citation non sourcé ou faux ; (2) promesse inexacte (prix, Premium, compteurs) ; (3) langue et typographie ; (4) ton Marrant ; (5) cohérence entre pages ; (6) légal flagrant (prix, éditeur, contact).
> Les [CHOIX UTILISATEUR] de `docs/founder-preferences.md` ne sont pas re-questionnés (1 500+ membres, 8 semaines, 50 XP, introvertis, études non sourcées gardées, humoristes cités).

> Méthode : lecture des routes de `apps/web/src/app` et des textes qu'elles affichent (composants, `src/config/textes`, `src/lib`, `docs/content/parcours-seed.json`). Contenus servis par la base (vanne, conseil et vidéo du jour, listes) hors périmètre (déjà audités). Les commentaires de code ne comptent pas. Les chemins `src/` sont relatifs à `apps/web/`.

## 1. Accueil

**URL** : `/` · **Sources** : `src/app/(dashboard)/page.tsx`, `src/components/home/*.tsx`, `src/lib/faqs.ts`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| A1 | « Des parcours plus poussés sur la répartie et le storytelling, pour le jour où les bases ne te suffiront plus. » (bloc Prochainement) | `src/components/home/upcoming-features.tsx:42` | 2, 5 | Le parcours Storytelling est en ligne depuis s18 : écrire « Des parcours plus poussés, sur la répartie d'abord, pour le jour où les bases ne te suffiront plus. » (6e parcours Répartie à la roadmap). |
| A2 | « Le Parcours Machine à Café dure 3 semaines, le Parcours Répartie 4 semaines, et le Parcours Confiance 6 semaines. » (FAQ, aussi sur `/parcours` et `/abonnement`) | `src/lib/faqs.ts:26` | 5 | Le site compte 5 parcours : générer la phrase depuis `PREMIUM_PARCOURS` (Storytelling 6, Boulot 6) au lieu des 3 slugs en dur. |
| A3 | « Nos membres gagnent en moyenne 50 XP par semaine et voient une vraie différence en quelques jours. » contre « tu peux voir une vraie différence en 2 à 4 semaines » trois questions plus bas | `src/lib/faqs.ts:15` et `:26` | 5 | « 50 XP » est un [CHOIX] intouchable ; seul « en quelques jours » contredit « 2 à 4 semaines » : proposer « et sentent la différence au fil des semaines » (à trancher par Thomas, voir §Points). |
| A4 | « des techniques comme l'autodérision ou le redirect absurde » | `src/lib/faqs.ts:36` | 3, 5 | Anglicisme isolé, et `/conseils` dit la même chose autrement (`conseils/page.tsx:62`) : « le détour par l'absurde », comme sur `/conseils`. |
| A5 | « (timing, autodérision, observation...) » | `src/lib/faqs.ts:48` | 3 | Trois points tapés : « observation…) » (caractère U+2026). |
| A6 | « autodérision » (FAQ) contre « auto-dérision » (cartes, badges du contenu du jour, pages catégories) | `src/lib/faqs.ts:20,36,48` ; `src/components/home/feature-cards.tsx:26` ; `src/components/home/daily-content.tsx:55,73` | 3, 5 | Les deux graphies existent : en choisir une pour tout le site (« autodérision », graphie des dictionnaires, recommandée). |
| A7 | « {N}+ vannes, {N}+ conseils de pros et {N}+ vidéos analysées » | `src/components/home/home-cta.tsx:29` | 1 | « de pros » n'est étayé nulle part (et les conseils ne sont pas signés) : « {N}+ conseils concrets ». |
| A8 | « On te donne des vannes courtes à ressortir sur le moment, et un streak pour garder le rythme. » ; « avec tes XP et ton streak » | `src/app/(dashboard)/page.tsx:113,146` | 5 | Le libellé validé en s17 est « Série » (étalon 3.8, profil, FAQ) : « et une série de jours de pratique pour garder le rythme » ; « avec tes XP et ta série ». |
| A9 | « Un appel de 45 min avec un professionnel de l'humour » (Coaching individuel, 99 €) | `src/components/home/premium-cta.tsx:133` | 1, 2 | Promesse invérifiable dans le dépôt (qui anime l'appel ?) : à confirmer par Thomas, sinon « Un appel de 45 min pour travailler ton humour en direct » (voir §Points). |
| A10 | « Diagnostic personnalisé de tes points forts / faiblesses » ; « Suivi post-appel par email » | `src/components/home/premium-cta.tsx:143,155` | 3 | « de tes points forts et de tes points faibles » ; « par e-mail » (graphie du reste du site). |
| A11 | « Les meilleurs extraits d'humoristes français » | `src/components/home/feature-cards.tsx:45` | 1 | Le catalogue compte des humoristes belges et suisses (ex. Marina Rollman, parcours Répartie) : « d'humoristes francophones ». |

Au niveau (aucun défaut) : H1 et sous-titre (étalon D), « 1 500+ membres bossent leur humour. Rejoins-les. » ([CHOIX]), « Trois outils pour arrêter de rire par politesse », états vides du contenu du jour, bloc « Deux autres parcours », prix et réassurance (2,99 € TTC, 14 jours) cohérents avec `config/premium.ts`.

Remarque hors affichage : `homepageFaqs` (`page.tsx:19-40`) n'est rendu nulle part ni dans le JSON-LD ; arbitrage de Thomas en attente depuis s11 (le garder hors ligne ne pose pas de problème de barre).

## 2. Page d'erreur 404 (globale)

**URL** : toute URL inconnue · **Source** : `src/app/not-found.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| E1 | « On dirait que cette page n'existe pas... Un peu comme mes talents de danse. » | `src/app/not-found.tsx:24` | 4, 3 | « je » narratif de la marque, interdit par la charte §1.3 et la préférence du 05/05 (le site parle au lecteur), plus trois points tapés : « Cette page n'existe pas, ou plus. Les vannes, elles, sont toujours là. » |
| E2 | `aria-label="confused face"` | `src/app/not-found.tsx:16` | 3 | Lu à voix haute en anglais par les lecteurs d'écran : `aria-hidden="true"` (emoji décoratif) ou « visage perplexe ». |

## 3. Pages d'état des parcours (404 et erreur)

**URL** : `/parcours/<slug inconnu>`, erreur de `/parcours` · **Sources** : `src/app/(dashboard)/parcours/[slug]/not-found.tsx`, `parcours/error.tsx`, `src/config/textes/parcours.ts:254-261`
**Verdict : au niveau.** « Les parcours ont raté leur entrée en scène » / « Le souci vient de chez nous, pas de toi. » : ton juste, tutoiement, zéro tiret.

## 4. Hub des parcours

**URL** : `/parcours` · **Sources** : `src/app/(dashboard)/parcours/(liste)/page.tsx`, `src/components/parcours/parcours-content.tsx`, `docs/content/parcours-seed.json` (+ fichiers Storytelling s18 et Boulot s19), FAQ `src/lib/faqs.ts`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| P1 | FAQ en bas de page : « Le Parcours Machine à Café dure 3 semaines, le Parcours Répartie 4 semaines, et le Parcours Confiance 6 semaines. » sous un en-tête qui annonce 5 parcours | `src/lib/faqs.ts:26` (affichée par `parcours/(liste)/page.tsx:126`) | 5 | Même correction que A2 : la FAQ suit la liste des parcours publiés. |
| P2 | « Le Parcours Répartie dure 4 semaines et te donne des exercices concrets à tester chaque jour. » (FAQ `/conseils`, citée ici pour la cohérence) | `src/app/(dashboard)/conseils/page.tsx:57` | 5 | Le rythme réel est une étape par semaine (FAQ_REGULARITE) : « et te donne un défi concret à chaque étape, une par semaine. » |

Au niveau : H1, intro (« moins qu'un épisode de série »), quiz d'orientation, cartes (accroches, témoignages présentés en « Imagine… » conformes au [CHOIX] du 29/09), états vide et erreur, « Abonnement 2,99 €/mois » juste (prix en dur, à brancher sur `PREMIUM_PRICE_LABEL` à l'occasion).

## 5. Pages des 5 parcours

**URL** : `/parcours/machine-a-cafe`, `/repartie`, `/confiance`, `/storytelling`, `/boulot` · **Sources** : `src/app/(dashboard)/parcours/[slug]/page.tsx`, `src/components/parcours/*.tsx`, `src/config/textes/parcours.ts`, seeds `docs/content/parcours-*.json`
**Verdict : au niveau, 3 retouches de typographie.** Le contenu pédagogique (étapes, quiz, défis) a été relu à l'aveugle et rendu à 10/10 en s17 à s19 : je n'en juge pas le fond (règle d'or : toute retouche de mot repasse l'aveugle). Le texte affiché vient de la base, enrichie par le seed : les citations ci-dessous sont celles du seed, `[À VÉRIFIER en base]`.

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| PC1 | « « ...et là, j'ai perdu la suite. Si quelqu'un la retrouve, elle répond au nom de « la chute ». » » (option de quiz) | `docs/content/parcours-seed.json:586` | 3 | Guillemets imbriqués : « la chute » intérieur en “la chute” ([CHOIX] du 05/10) et « … » en tête au lieu de « ... ». |
| PC2 | « Pour revenir à ce qu'on disait... » ; « ça va être long mais ça vaut le coup... » ; « aussi confiant... » | `docs/content/parcours-seed.json:159`, `:406`, `:1030` | 3 | Trois points tapés : caractère « … » (aucun mot changé). |
| PC3 | Meta Confiance : « 6 semaines pour retrouver confiance en soi grâce à l'humour » | `src/app/(dashboard)/parcours/[slug]/page.tsx:67` | 4 | Le site tutoie (pastille de l'accueil : « Reprendre confiance en toi ») : « retrouver confiance en toi ». |

## 6. Hub des vannes

**URL** : `/vannes` · **Sources** : `src/app/(dashboard)/vannes/page.tsx`, `src/components/vannes/vannes-list.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| V1 | « Aperçu gratuit : 10 vannes accessibles sans compte. » | `src/components/vannes/vannes-list.tsx:214` | 2, 5 | Il n'y a plus de compte gratuit ([CHOIX] du 05/10) et un compte non abonné a la même limite : « 10 vannes accessibles sans abonnement. » |
| V2 | « Passe par les filtres : boulot, couple, soirée, école, gaming. » ; « Mets tes préférées en favoris » ; « Tes favoris te servent de carnet » ; chapeau : « garde tes préférées sous le coude » | `src/app/(dashboard)/vannes/page.tsx:52`, `:57`, `:111` | 2 | Filtres et favoris sont réservés à Premium (bandeau juste au-dessus) : « Passe par les pages thème ou, avec Premium, par les filtres » et « avec Premium, mets tes préférées en favoris ». |
| V3 | « Boulot, couple, soirées, école, gaming : choisis ta situation » ; meta « rangées par situation : soirée, boulot, couple, école » | `src/app/(dashboard)/vannes/page.tsx:110`, `:33` | 2 | Aucune page thème « école » (`vannes-themes.ts:6` : moins de 20 vannes au 30/09, avant la réduction à 125 vannes) : vérifier le nombre de vannes ÉCOLE actives ; s'il est faible, retirer « école » des énumérations visibles. `[À VÉRIFIER en base]` |
| V4 | Trois versions du même test : « est-ce que je peux la sortir ce soir en soirée ? » (FAQ), « est-ce que je peux la sortir ce soir en soirée et faire rire ? » (bloc SEO), « est-ce que je la sors ce soir en soirée ? » (`/a-propos`) | `vannes/page.tsx:62`, `:135` ; `a-propos/page.tsx:171-172` | 5, 4 | Une seule formule partout, sans « ce soir en soirée » : « Est-ce que je peux la sortir ce soir et faire rire ? » |
| V5 | « Pas de blagues Carambar, pas d'objets qui parlent » (aussi dans la FAQ) | `vannes/page.tsx:135`, `:62` | 5 | La vanne étalon du site (Alexa) et l'exemple n° 1 de `/anatomie-vanne` (l'appli qui demande « Toujours là ? ») font parler un objet : préciser « pas de grille-pain qui parle tout seul » ou retirer ce critère (voir §Points). |
| V6 | « Au bout de 3-4 répétitions » | `vannes/page.tsx:57` | 3 | « Au bout de 3 ou 4 répétitions ». |
| V7 | « classées par situation (boulot, couple, soirée, potes) » | `vannes/page.tsx:138` | 5 | « potes » n'est pas une catégorie : reprendre la liste des filtres (« boulot, couple, soirées, famille, gaming »). |

## 7. Pages thèmes des vannes

**URL** : `/vannes/theme/boulot`, `couple`, `dating`, `soirees`, `famille`, `gaming`, `autoderision` · **Sources** : `src/app/(dashboard)/vannes/theme/[slug]/page.tsx`, `src/lib/vannes-themes.ts`
**Verdict : au niveau.** Textes validés par Thomas mot pour mot (landings s14) et non retouchables ([CHOIX], historique s14). Seul écart : le fil d'Ariane et la navigation disent « Auto-dérision » (`vannes-themes.ts:91`) quand le H1 de la même page dit « autodérision » (`:95`) ; il se règle avec la graphie unique de A6, sur le libellé de navigation seulement.

## 8. Hub des conseils

**URL** : `/conseils` · **Sources** : `src/app/(dashboard)/conseils/page.tsx`, `src/components/conseils/conseils-list.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| C1 | « te donne des exercices concrets à tester chaque jour » | `conseils/page.tsx:57` | 5 | Voir P2. |
| C2 | « Avec 5-10 minutes de pratique quotidienne » (aussi FAQ de l'accueil) | `conseils/page.tsx:57` ; `src/lib/faqs.ts:26` | 3 | « 5 à 10 minutes » (chiffres inchangés). |
| C3 | « Les conseils se font désirer... comme une bonne chute. » ; « y'a plein de techniques qui t'attendent » | `src/components/conseils/conseils-list.tsx:241`, `:261` | 3 | « … » ; « il y a plein de techniques qui t'attendent ». |
| C4 | `numberOfItems: tipCount` avec repli `50` quand la base ne répond pas | `conseils/page.tsx:76` | 1 | Chiffre de repli inventé (JSON-LD, invisible) : l'omettre comme sur `/vannes` (`vannes/page.tsx:76`). |

## 9. Hub des vidéos

**URL** : `/videos` · **Sources** : `src/app/(dashboard)/videos/page.tsx`, `src/components/videos/videos-grid.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| VI1 | « Et avec les streaks et les XP, tu tiens sur la durée » | `videos/page.tsx:58` | 5 | « Et avec ta série et tes XP » (libellé validé « Série »). |
| VI2 | « vidéos de stand-up français » ; « pros de la scène française » | `videos/page.tsx:32`, `:53`, `:87` | 1 | Même remarque que A11 : « francophone ». La meta se change sans toucher au mot-clé « stand-up français » de la liste `keywords`. |
| VI3 | « Pas de vidéo ici... même les humoristes font des pauses » ; « y'a du lourd » | `src/components/videos/videos-grid.tsx:261-262` | 3 | « … » ; « il y a du lourd ». |
| VI4 | Repli `60` pour `numberOfItems` | `videos/page.tsx:72` | 1 | Comme C4. |

## 10. Hub du blog

**URL** : `/blog` · **Sources** : `src/app/(dashboard)/blog/page.tsx`, `blog-list-client.tsx`
**Verdict : à corriger** (un seul défaut, visible dans l'onglet et dans Google)

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| B1 | `title: "Blog humour — guides et techniques"` | `src/app/(dashboard)/blog/page.tsx:17` | 3 | Tiret cadratin dans le title : « Blog humour : guides et techniques ». |

Au niveau : H1, chapeau (« Si tu lis un article et que tu ne souris pas au moins une fois, on a raté notre job »), bloc « Commence ici », état vide.

## 11. Abonnement

**URL** : `/abonnement` · **Sources** : `src/components/premium/abonnement-view.tsx`, `premium-benefits.tsx`, `plan-selector.tsx`, `src/config/textes/offre.ts`, FAQ `src/lib/faqs.ts`
**Verdict : à corriger** (seulement par la FAQ partagée ; la page elle-même est au niveau)

- Prix, équivalent mensuel, économie et réassurance justes et dérivés de `config/premium.ts` : 2,99 € TTC/mois, 24,99 €/an, 2,08 €/mois, 10,89 €, « plus de 3 mois offerts », remboursement sous 14 jours (premier paiement, cohérent avec CGU et `/retractation`).
- Avantages Premium vrais : 5 parcours listés dynamiquement avec leur rythme, carnet mensuel, favoris, listes complètes contre 10/3/3 « sans abonnement ».
- Défauts hérités de la FAQ : A2 (3 parcours sur 5), A3, A4, A5.

## 12. À propos

**URL** : `/a-propos` · **Source** : `src/app/(dashboard)/a-propos/page.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| AP1 | `title: "L'humour s'apprend — notre mission"` | `a-propos/page.tsx:15` | 3 | Tiret cadratin dans le title (onglet et Google) : « L'humour s'apprend : notre mission ». |
| AP2 | Réponse FAQ « … les jeux de mots — les mêmes techniques utilisées par les pros de la scène. » | `a-propos/page.tsx:36` | 3 | Le tiret est retiré à l'affichage (`stripEmDashes`, l. 182) mais part tel quel dans le JSON-LD FAQPage (l. 54), donc dans les extraits Google : écrire « …les jeux de mots : les mêmes techniques… » dans la source. |
| AP3 | « des parcours structurés de 3 à 6 semaines pour progresser pas à pas avec des XP et des streaks » | `a-propos/page.tsx:120` | 5 | « avec des XP et une série de jours de pratique ». |
| AP4 | « pas juste à ceux qui sont "nés drôles". » ; « passe un test simple avant d'être publié : "est-ce que je la sors ce soir en soirée ?" » | `a-propos/page.tsx:165`, `:171-172` | 3, 5 | Guillemets droits : « nés drôles » ; test aligné sur V4, entre « ». |
| AP5 | « Roder, comme en open mic : un humoriste teste son set soir après soir : ce qui fait rire reste » | `a-propos/page.tsx:151-152` | 3 | Deux deux-points dans la même phrase : « un humoriste teste son set soir après soir. Ce qui fait rire reste, ce qui fait un blanc saute. » |
| AP6 | « deviens-marrant.fr est la première plateforme francophone dédiée à l'apprentissage de l'humour » | `a-propos/page.tsx:67` | 1 | Superlatif non prouvé (le contexte projet le note `[HYPOTHÈSE]`) : gardé selon la règle « améliorer, pas amputer », à trancher par Thomas (voir §Points). |
| AP7 | « 2,99 €/mois, sans engagement. » écrit en dur | `a-propos/page.tsx:216` | 5 | Juste aujourd'hui ; brancher sur `PREMIUM_PRICE_LABEL` pour suivre un futur changement de prix (même remarque pour `/parcours` l. 110 et `/glossaire` l. 140). |

Non re-questionnés ([CHOIX]) : « 1 500+ membres » (l. 86, 208), « Alex Durand » et son portrait (l. 161-165, identité « comme avant », 29/09), étude Crawford et Caltabiano. **Vérification externe** : l'étude existe bien (Journal of Positive Psychology, 2011, vol. 6 n° 3, p. 237-252, programme de 8 semaines, gains de bien-être et baisse du stress). La phrase du site est exacte. « La majorité de nos membres n'avaient aucune expérience en humour » (l. 31) : même statut que « introvertis », gardée et signalée.

## 13. Quiz « Quel type d'humour es-tu ? »

**URL** : `/quiz-humour` · **Sources** : `src/app/(dashboard)/quiz-humour/page.tsx`, `src/components/quiz/viral-quiz.tsx`, `quiz-data.ts`, `src/config/textes/entrees-parcours.ts:45-59`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| Q1 | « "Le diable est dans les détails, et les vannes aussi" » et les 3 autres devises | `src/components/quiz/quiz-data.ts:384`, `:389`, `:394`, `:399` | 3 | Guillemets droits : « Le diable est dans les détails, et les vannes aussi ». |
| Q2 | « En soirée, t'es plutôt... », « Ta vanne idéale, c'est... » et 8 autres questions | `quiz-data.ts:106`, `131`, `156`, `181`, `206`, `231`, `256`, `331`, `356`, `381` | 3 | Trois points tapés : « … ». |
| Q3 | « Quand t'es stressé(e), tu... » suivi des réponses « Tu relativises… », « Tu racontes… » | `quiz-data.ts:281-284` | 3 | « tu » répété et seule écriture inclusive du site : « Quand la pression monte… » (les réponses commencent déjà par « Tu »). |
| Q4 | « En soirée, t'es plutôt... » suivi de « Tu observes en silence, puis tu places la vanne » | `quiz-data.ts:106-109` | 3 | La question appelle un adjectif, les réponses sont des phrases : « En soirée, tu… ». |
| Q5 | « le quiz est 100% gratuit » ; « c'est 100% toi » | `quiz-humour/page.tsx:48` ; `quiz-data.ts:73` | 3 | « 100 % » (espace insécable). |

Au niveau : profils (descriptions, forces, conseils), parcours conseillé par profil (Storytelling compris), FAQ, intro (« moins que pour choisir un film »), nombre de questions dynamique (12, conforme au contexte projet). « Style observation précise » (l. 44, affiché « Style {…} ») se lit bien ; aucun humoriste n'y est attribué, donc rien à vérifier.

Autre quiz : le quiz d'orientation de `/parcours` (`parcours-content.tsx:31-49`) est au niveau.

## 14. Anatomie d'une vanne

**URL** : `/anatomie-vanne` · **Source** : `src/app/(dashboard)/anatomie-vanne/page.tsx`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| AN1 | Encadré « Types de pivots » : « Double sens, retournement, association inattendue, exagération, sous-entendu, décalage temporel. » contre la section « Les 6 types de pivots » : Double sens, Retournement, Exagération, Décalage, Sous-entendu, Anti-chute | `anatomie-vanne/page.tsx:161-162` et `:262-298` | 5 | La même page donne deux listes de 6 : aligner l'encadré sur la section (« Double sens, retournement, exagération, décalage, sous-entendu, anti-chute. »). |
| AN2 | Pivot de l'exemple 1 : « On attend l'effort, on découvre qui a vraiment remarqué l'abandon » | `anatomie-vanne/page.tsx:64` | 4 | Phrase obscure, à la différence des deux autres pivots : « On attend l'effort, c'est l'appli qui constate l'abandon ». |
| AN3 | « Le Setup », « Le Pivot », « La Punchline » | `anatomie-vanne/page.tsx:126`, `:151`, `:176` | 3 | Majuscules à l'anglaise dans un H2 : « Le setup », « Le pivot », « La punchline ». |
| AN4 | Les 9 vannes d'exemple (3 décortiquées, 6 dans les pivots) | `anatomie-vanne/page.tsx:60-85`, `:262-298` | 1, 4 | Aucune trace de relecture à l'aveugle (barre Alexa + « jamais entendue ailleurs ») ; « Mon psy m'a dit que j'étais normal. J'ai changé de psy. » a un air de classique. À faire passer à l'aveugle avant tout jugement (voir §Points). |

Vérifié : les comptes de mots annoncés dans les analyses sont exacts (8, 9, 10 et 7 mots). Au niveau : chapeau (« sans la moindre équation »), règles d'or, « Les 5 erreurs qui tuent une vanne », FAQ, appel final.

## 15. Blague du jour

**URL** : `/blague-du-jour` · **Source** : `src/app/(dashboard)/blague-du-jour/page.tsx`
**Verdict : au niveau.** FAQ validée (landings s14), compteur dynamique, « les précédentes se retrouvent dans le catalogue » exact (stock validé). Remarque d'usage : sans vanne du jour (base indisponible), la page n'affiche rien entre le chapeau et le bouton (l. 78) ; une phrase de repli, comme sur l'accueil (« Même l'humour prend un jour off »), éviterait un trou.

## 16. Glossaire

**URL** : `/glossaire` · **Sources** : `src/app/(dashboard)/glossaire/page.tsx`, `src/lib/glossary.ts`
**Verdict : à corriger**

| # | Citation exacte | Fichier:ligne | Type | Correction proposée |
|---|---|---|---|---|
| G1 | Lien « Parcours storytelling → » vers `/parcours` | `src/lib/glossary.ts:38-39` | 5 | Le parcours existe depuis s18 : lien vers `/parcours/storytelling`, libellé « Parcours Storytelling ». |
| G2 | « pour gagner 2-3 secondes » | `src/lib/glossary.ts:79` | 3 | « 2 à 3 secondes » (chiffres inchangés). |

Au niveau : définitions, exemples (« la panique au standard »), appel final, 12 termes dynamiques dans le title et la meta.

## 17. Carnet du mois (interface)

**URL** : `/carnet` · **Sources** : `src/app/(dashboard)/carnet/page.tsx`, `src/components/carnet/*.tsx`
**Verdict : au niveau** (interface seule ; les fiches ont été relues à l'aveugle). Page en `noindex`, état « Le carnet du mois arrive » correct.

## 18. Pages légales

**URL** : `/cgu`, `/confidentialite`, `/mentions-legales`, `/retractation` · **Sources** : pages du même nom dans `src/app/(dashboard)/`, `src/config/textes/juridique.ts`
**Verdict : au niveau sur le périmètre demandé** (incohérences flagrantes uniquement ; le fond reste à @legal, juridique « laissé en l'état » par [CHOIX] du 29/09).

- Prix : 2,99 €/mois et 24,99 €/an (2,08 €/mois) TTC dans les CGU, conformes à `config/premium.ts` et à `/abonnement`.
- Éditeur et contact identiques partout : « deviens-marrant SAS », contact@deviens-marrant.fr (mentions, CGU, confidentialité, rétractation, pied de page, `/a-propos`).
- Rétractation : « premier paiement seulement » identique en CGU, `/retractation` et sous les boutons de paiement.
- **Pas de page CGV** : les conditions de vente sont dans les CGU (article 3 et suivants) ; aucun lien mort vers une CGV. Constat, pas un défaut.
- Défaut mineur (type 3) : « email » (`cgu/page.tsx:32-33,55` ; `mentions-legales/page.tsx:20` « Email : ») contre « e-mail » (confidentialité, rétractation, textes des parcours) ; choisir « e-mail » partout.
- Hors périmètre, déjà connus et reportés par Thomas le 07/10 : RCS « en cours d'immatriculation » (D3), médiateur non nommé (`cgu/page.tsx:66`).

## 19. Pied de page (toutes les pages)

**Source** : `src/components/layout/footer.tsx` · **Verdict : au niveau.** Étalon E (« Deviens drôle, un exercice à la fois. »), liens légaux et « Résilier ton contrat » permanents, contact juste.

## 20. Synthèse

| Page | Verdict | T1 fait/chiffre | T2 promesse | T3 langue/typo | T4 ton | T5 cohérence | T6 légal | Total |
|---|---|---|---|---|---|---|---|---|
| Accueil `/` | à corriger | 3 | 2 | 4 | 0 | 6 | 0 | 11 |
| 404 globale | à corriger | 0 | 0 | 2 | 1 | 0 | 0 | 2 |
| États des parcours (404, erreur) | au niveau | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Hub `/parcours` | à corriger | 0 | 0 | 0 | 0 | 2 | 0 | 2 |
| 5 pages de parcours | au niveau (3 retouches typo) | 0 | 0 | 2 | 1 | 0 | 0 | 3 |
| Hub `/vannes` | à corriger | 0 | 3 | 1 | 1 | 4 | 0 | 7 |
| Pages thèmes (7) | au niveau | 0 | 0 | 0 | 0 | 0 (renvoi A6) | 0 | 0 |
| Hub `/conseils` | à corriger | 1 | 0 | 2 | 0 | 1 | 0 | 4 |
| Hub `/videos` | à corriger | 2 | 0 | 1 | 0 | 1 | 0 | 4 |
| Hub `/blog` | à corriger | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| `/abonnement` | à corriger (FAQ partagée) | 0 | 0 | 0 | 0 | 0 (renvoi A2-A5) | 0 | 0 |
| `/a-propos` | à corriger | 1 | 0 | 4 | 0 | 3 | 0 | 7 |
| `/quiz-humour` | à corriger | 0 | 0 | 5 | 0 | 0 | 0 | 5 |
| `/anatomie-vanne` | à corriger | 1 | 0 | 1 | 2 | 1 | 0 | 4 |
| `/blague-du-jour` | au niveau | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `/glossaire` | à corriger | 0 | 0 | 1 | 0 | 1 | 0 | 2 |
| `/carnet` (interface) | au niveau | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Pages légales (4) | au niveau | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| Pied de page | au niveau | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | 12 à corriger, 7 au niveau, 0 à revoir en profondeur | **8** | **5** | **25** | **5** | **19** | **0** | **53** |

(Un défaut à double type est compté dans chaque colonne concernée ; le total de la dernière colonne compte chaque défaut une fois.)

**Top 3 des corrections les plus utiles**
1. **Le site a 5 parcours, plusieurs textes en connaissent 3** (A1, A2/P1, G1) : la FAQ affichée sur l'accueil, `/parcours` et `/abonnement` ne donne la durée que de 3 parcours, le bloc « Prochainement » promet le storytelling déjà en ligne, le glossaire n'envoie pas vers le parcours Storytelling. Une seule source (`PREMIUM_PARCOURS`) règle les trois.
2. **Promesses inexactes pour le visiteur sur `/vannes`** (V1, V2, V3) : « sans compte » alors qu'il n'y a plus de compte gratuit, filtres et favoris présentés comme accessibles alors qu'ils sont Premium, catégorie « école » peut-être vide.
3. **Tirets cadratins dans deux titles visibles dans Google** (B1 `/blog`, AP1 `/a-propos`) et dans le JSON-LD de `/a-propos` (AP2) : règle commune 12, zéro mot à changer.

Aucun tiret cadratin dans le texte visible des pages elles-mêmes (seuls les commentaires de code en contiennent). Aucun chiffre [CHOIX] touché ni proposé au retrait.

## 21. Points à trancher par Thomas

1. **Règle d'application** : je propose d'appliquer tout de suite les retouches à 0 mot changé (typographie, guillemets, « … », tirets des titles, « 100 % », liens G1) et de faire passer les retouches de mots (A1, A3, A7, A8, A11, E1, V1 à V7, P2, AP3 à AP5, AN1, AN2, Q3, Q4) par la relecture à l'aveugle 2 sur 3, comme les articles en s20. Reco : oui.
2. **A3, FAQ** : « voient une vraie différence en quelques jours » contredit « 2 à 4 semaines » trois questions plus bas. « 50 XP » reste ; seul « en quelques jours » serait reformulé (« au fil des semaines »). GO ?
3. **A9, coaching à 99 €** : l'offre est-elle toujours active, et qui est le « professionnel de l'humour » qui anime l'appel ? Sans réponse, reco : neutraliser la formule (« un appel de 45 min pour travailler ton humour en direct »).
4. **V5, « pas d'objets qui parlent »** : critère contredit par la vanne étalon (Alexa) et par l'exemple 1 de `/anatomie-vanne`. Reco : le préciser (« pas de grille-pain qui parle tout seul ») plutôt que le retirer.
5. **AP6, « la première plateforme francophone »** : garder (règle « améliorer, pas amputer ») ou passer à « une plateforme francophone dédiée à… ». Reco : garder tant que la veille ne trouve pas d'équivalent, la phrase n'avance aucun chiffre.
6. **AN4, vannes d'exemple de `/anatomie-vanne`** : les 9 exemples n'ont jamais été relus à l'aveugle contre la barre Alexa ; les y faire passer (et remplacer ceux qui échouent par des vannes du catalogue déjà validées) ? Reco : oui, c'est la page de référence sur la construction d'une vanne.
7. **V3, catégorie « école »** : compter les vannes ÉCOLE actives en base ; si elles sont moins de 10, retirer « école » des énumérations de `/vannes` (chapeau, FAQ, meta). Reco : vérifier d'abord.
8. **A6, graphie unique** : « autodérision » (dictionnaires) partout, y compris les libellés de filtres et de navigation des thèmes (les textes thèmes validés en s14 ne bougent pas). Reco : oui.
9. **Rappel s11** : `homepageFaqs` (`page.tsx:19-40`) n'est affiché nulle part ; l'afficher ou le supprimer reste à trancher (sans urgence, rien n'est en ligne).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/qa/audit-pages-site-s20.md`
- Décisions prises : 19 groupes de pages audités ; 12 « à corriger », 7 « au niveau », 0 « à revoir en profondeur » ; 53 défauts (25 de typographie, 19 de cohérence, 8 de faits ou chiffres, 5 de promesse, 5 de ton, 0 légal flagrant). Étude Crawford et Caltabiano (2011) vérifiée : exacte.
- Points d'attention : la FAQ partagée (`src/lib/faqs.ts`) porte à elle seule 5 défauts visibles sur 3 pages ; corrections de mots à faire passer à l'aveugle avant mise en ligne (règle d'or) ; textes du seed des parcours `[À VÉRIFIER en base]` avant correction ; rien n'a été modifié dans le code.
- Agents à invoquer : @copywriter (rédaction des retouches de mots, puis relecture à l'aveugle 2 sur 3) ; @fullstack (FAQ dynamique sur les parcours publiés, lien G1, tirets des titles et du JSON-LD, replis JSON-LD 50/60, prix branchés sur la config) ; @legal seulement pour « email »/« e-mail » s'il le juge utile.
---
