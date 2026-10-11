# Prompts générateurs : remise à niveau des exemples (s11, 29/09/2026)

> Agent : @ia. Périmètre : `apps/web/src/lib/ai/agents/*.ts`. Seules des chaînes de prompt ont été modifiées : aucune logique, `client.ts` intact, aucun gate modifié (G-J10, G-J11, G-T6, G-S2, G-S16, G-S19, G-S21 inchangés).
> Références : charte `docs/copy/charte-refonte-copy-s11.md` (étalons A-E) et `docs/founder-preferences.md` (29/09 : une blague déjà connue ailleurs est faible).
> Non commité.

## 1. Inventaire des exemples de vannes et répliques

| Fichier | Exemples trouvés | Verdict |
|---|---|---|
| joke-agent.ts (JOKE_STABLE) | Étalons A et B, 4 étalons « maison », étalon C, 3 mauvais | A et B gardés. 4 étalons remplacés (3 connus ailleurs, 1 avec une chute plus longue que le setup). Étalon C réparé. |
| joke-agent.ts (MODÈLE décryptage, ×2) | « premier… dernier… seul » | Remplacé : blague d'Internet connue |
| standup-director-agent.ts (validateJoke) | 2 ✅ et 2 ❌ | Les 2 ✅ remplacés (bus qui accélère = classique connu, « Mon karma non » = twist flou) |
| copy-review-agent.ts | 3 étalons, dont « mystérieux » | « mystérieux » remplacé (format meme connu, chute plus longue que le setup) |
| social-media-agent.ts | 10 exemples canoniques (brief + fiches format + thème IG) | 3 gardés (yaourt, 17h57, « on en reparle »), 7 remplacés |
| tip-agent.ts | BON EXEMPLE sans dialogue | Remplacé par un exemple avec dialogue et réplique originale (cohérent avec G-T4) |
| seo-blog-agent.ts | Exemples de format GEO (définition, liste) | Gardés : ce sont des phrases de format, pas des vannes |
| ceo-agent.ts, marketing-agent.ts, video-*.ts | Aucune vanne en exemple (CEO : vannes uniquement tirées du catalogue) | Consignes ajoutées seulement (§3) |

## 2. Avant / après

| Fichier | Avant | Après |
|---|---|---|
| joke-agent | « En soirée je parle pas… mystérieux… trois ans que j'attends. » | « J'ai dit à un vieux pote "faut qu'on se fasse un resto un de ces jours". Il m'a rappelé six ans après. Il avait réservé. » (premier degré) |
| joke-agent | « Ma collègue gère son stress par la respiration. Moi… "oui carrément"… » | retiré (chute plus longue que le setup) ; l'étalon « euphémisme » ci-dessous prend le registre boulot |
| joke-agent | « Quelqu'un a commenté "premier"… le dernier. Et le seul. » | « Pour mon anniversaire, j'ai reçu trois messages. Ma mère. Ma banque. Et ma mère, depuis le portable de mon père. » (triple chute) |
| joke-agent | « salaire compétitif. Compétitif avec le SMIC » | « Mon chef dit que je suis "l'homme de la situation". Surtout quand personne veut la situation. » (euphémisme démasqué) |
| joke-agent | Étalon C rattaché à la mauvaise vanne (« T'as pas eu le temps ? ») : le décryptage parlait d'un jeu et d'une mère absents de la vanne | Étalon C rattaché à sa vraie vanne (« inventaire / bouton trier / ma mère », audit §7) ; sert de MODÈLE de décryptage dans les deux prompts |
| joke-agent (MODÈLE ×2) | premier/dernier/seul + howToApply « 12 likes » | Étalon C complet + howToApply validé (« Dans le jeu je gère un empire… ») + consigne « ne pas réutiliser » |
| joke-agent (🔴) | 3 mauvais exemples | +2 : calembour « temps de chien → temps de chat », blague connue « le bus m'a vu et il a accéléré » |
| director validateJoke | ✅ « Le bus m'a vu et il a accéléré » | ❌ DÉJÀ CONNUE ; ✅ « …Quand il est arrivé, je suis pas monté. Il fallait qu'il comprenne. » |
| director validateJoke | ❌ parapluie / ✅ « Mon karma non. » | ❌ « agenda jamais ouvert » (constat) ; ✅ « Première chose notée dedans : "penser à ouvrir l'agenda". » |
| copy-review | étalon « mystérieux » | « Mon chef dit que je suis "l'homme de la situation"… » + consigne « ne pas réutiliser » |
| social Twitter | « Ce graphique, même Excel l'a abandonné. » (format « même X l'a abandonné » très répandu) | « Une vanne à recracher quand un collègue promet "je t'envoie ça dans cinq minutes" : "Parfait, je le note pour jeudi." Cadeau. » |
| social Twitter | « Premier date… "voyager". Tu hoches la tête comme si t'avais compris la réponse. » (twist flou) | « Premier date depuis des années. On te demande ce que tu aimes dans la vie, et tu réalises que la dernière fois qu'on t'a posé la question, t'as répondu "les dinosaures". » |
| social LinkedIn | Ex + Netflix (vie privée sur LinkedIn, chute confuse) | « Le manager qui dit "ma porte est toujours ouverte". C'est vrai, elle l'est. Lui, il est en réunion jusqu'en mars. » |
| social LinkedIn | « Une équipe saine, c'est… Plus que n'importe quel team-building. » (ton leçon) | « Le séminaire sur "la communication fluide", organisé en quarante mails et trois sondages pour choisir la salle. » |
| social Instagram | « En soirée, t'es le plat froid. » / « micro-ondes social » (6 mots, donc rejeté par G-S2) | « Ta playlist sport, écoutée assis. » / « Une heure pour la composer. C'était ça, la séance. » |
| social Instagram | « Réunion à 17h59 : nouveau sport olympique. » (format recyclé) | « Le chef passe. Tu accélères. » / « Et lui ralentit pour avoir l'air de surveiller. Deux acteurs, zéro public. » |
| social Instagram | « Les apéros à 34 ans : sport extrême. » / foie (cliché) | « Tu répètes ton salut, seul. » / « Dans l'ascenseur, la voisine le dit en premier. Toute cette préparation perdue. » |
| tip-agent | « Tu places une vanne → les gens rient → TU NE DIS RIEN… » (sans dialogue) | « Au dîner, on te demande : "Tu cuisines, toi ?" Tu réponds : "Oui. Enfin, je réchauffe avec conviction." Les gens rient → TU NE DIS RIEN… » |

Contrôle d'originalité : les nouvelles vannes ont été cherchées dans `blagues-seed.json` et dans `blog-articles.ts`. Aucune n'y figure, et aucune n'a été reprise du catalogue, pour que le générateur ne recopie rien de publié. Chaque bloc d'exemples porte la mention « calibre le NIVEAU, ne pas réutiliser ».

## 3. Consignes transverses

| Consigne | Où elle est désormais explicite |
|---|---|
| Pas de blague déjà connue ailleurs | TONALITY_BRIEF.doNot (injecté dans joke, tip, social, director), joke-agent (critère renforcé + auto-contrôle final), director (validateJoke plafonné à 5, social en rejet auto, tip plafonné à 6), copy-review, social règle 12, seo-blog, CEO règle 12 |
| Retournement d'idée + économie de mots | TONALITY_BRIEF.principles (nouveau), director rewrite, social règle 12, tip, seo-blog |
| Pas de calembour phonétique | déjà dans TONALITY_BRIEF ; ajouté dans director (joke, tip, social), tip, social, seo-blog, exemple 🔴 dans joke-agent |
| Rien qui se moque d'un groupe | TONALITY_BRIEF.doNot (nouveau, liste explicite), joke-agent « CIBLE = UN GROUPE », director (REJECTED), tip, social, seo-blog, CEO |
| Zéro mention d'IA | déjà présent partout sauf dans le prompt système CEO, qui a maintenant une règle 11 explicite |
| Tutoiement de la marque | déjà présent partout (joke, tip, social, seo-blog, copy-review, CEO) ; rappelé dans les réécritures du director |

Cohérences corrigées au passage :
- Director validateJoke : « faire RIRE (pas sourire) » et « APPROVED = RIRE à voix haute » remplacés par « sourire net + envie de la ressortir » (charte §3, pivot s10), comme le joke-agent l'était déjà.
- Social : visuel Instagram passé de « ≤ 6 mots » à « ≤ 5 mots » dans les prompts (brief, fiche format, thèmes, director). Les gates G-S2 et `validatePostConstraints` rejetaient déjà tout hook de plus de 5 mots, y compris sur Instagram.

## 4. Vérifications

- `npx tsc --noEmit -p tsconfig.build.json` : OK (0 erreur).
- `npx jest src/__tests__` : 1 793 passés, 2 ignorés, 5 échecs. Les 5 échecs sont tous dans `feature/parcours-list.test.tsx` (textes « Idéal si tu travailles en équipe », « muette à la machine à café »…). Ils viennent de `docs/content/parcours-seed.json`, modifié dans le working tree par un autre agent (refonte copy des parcours), pas de ces prompts. Les tests des gates vannes, conseils et social passent tous.
- Les 7 nouveaux exemples social ont été passés dans `runSocialGates` et `checkAntiStaccato` : 0 échec (G-S2 hook ≤ 5, G-S15 ≤ 3 phrases, G-S16 caption ≤ 80 caractères, G-S19 pas de première personne, G-S21 anti-staccato). Les 5 nouvelles vannes du director et du joke-agent ont été passées dans `runJokeGates` : 0 échec.

## 5. Signalements (non modifiés, à arbitrer)

1. **copy-review, raisons de RETIRER** : la liste fermée est une constante de code (l.52). « Blague connue » n'y figure pas. Le prompt demande donc REECRIRE avec une vanne originale sur la même situation, ce qui respecte « remplacer, pas amputer ». Ajouter une raison dédiée demanderait un changement de code (@fullstack).
2. **Affirmations sur des humoristes réels** : le hook exemple « Waly Dia parle PLUS FORT quand personne écoute » (social + director) et les exemples de pitch dans `ceo-backlinks.ts` (« Paul Mirabel le fait quasi systématiquement », « la règle "punch yourself first" de Blanche Gardin ») ne sont pas sourcés. Ce ne sont pas des vannes, donc hors périmètre, mais il y a un risque que le modèle invente des faits sur des humoristes.
3. **Director social, critère 3** : « Phrases courtes. Ruptures de ton. » contredit la doctrine anti-staccato (G-S21, préférence fondateur 06/05). À aligner lors d'une prochaine passe.
4. **Vocabulaire du décryptage** : « Le faux-ami » figure dans la liste des techniques proposées. Il peut pousser vers des jeux de mots. Je l'ai gardé, à surveiller dans les évals.
5. Les commentaires de code parlent encore de « ≤ 6 mots » pour Instagram (social l.94, 814, 852). Ce sont des commentaires, pas des prompts, donc ils n'ont pas été modifiés.
