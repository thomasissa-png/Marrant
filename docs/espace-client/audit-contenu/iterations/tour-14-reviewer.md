# Tour 14, relecture à l'aveugle @reviewer : architecture du contenu (s24)

> Relecteur : @reviewer, 12/11/2026. Document noté : `docs/espace-client/audit-contenu/architecture-contenu-v14.md` (v14). Même grille qu'aux tours 1 à 13.

## 1. Statut de mes corrections du tour 13

| T13 | Objet | Statut | Évidence |
|---|---|---|---|
| B1 (bloquant) | XP attribués au conseil du jour et au conseil d'étape | **Levée en 1.1** | l. 147 : « seuls les conseils ouverts depuis la liste du catalogue (`/conseils`) rapportent 10 XP ; le conseil du jour et le conseil d'une étape n'en rapportent pas », sources exactes (`conseils-list.tsx` l. 175 à 178, `conseils/page.tsx` l. 7 et 126, `user-store.ts` l. 57). 0 bis point 1 et annexe A le tracent, avec l'origine de l'erreur (mon tour 12). 4.4 et 5.2 : voir section 2. |
| B2 | [À VÉRIFIER : versions de la lettre] | **Levée** | 1.1 l. 151 : bloc `[[invitation-premium]]` seulement, jamais dans les versions abonnés et comptes gratuits, FP l. 143 (25/10) ; la version montrée est la version abonnés. |
| B3 | Lettres absentes du résumé | **Levée** | Résumé l. 38, en tête de « Ce qui reste à trancher » : « C5 : la proposition des lettres (archive complète pour tous les abonnés, reprise tout de suite, telles que tu les as approuvées) est à relire avec toi (2.8) ». Rappelée en annexe B l. 1042. |

## 2. Passages modifiés

- **1.1** : ligne XP juste et sourcée (voir B1) ; ligne Lettres levée (B2). 14 catégories de `JokeCategory` : exact (`schema.prisma` l. 163 à 178).
- **2.2** : la note « ma réplique à moi » ne s'affiche qu'à l'étape 4, APRÈS « Tu avais une réponse ? », sur les deux sortes de cartes (l. 208, 211, 213, 228), avec la raison (« Oui » deviendrait vrai par simple lecture). Au niveau.
- **2.7** : écran « Mes répliques » complet (état vide sans reproche, ordre, modifier et supprimer, 44 px, lecture seule avec suppression possible) ; rattachement à l'univers par une table de correspondance, honnêtement [À VÉRIFIER]. Au niveau.
- **2.9** : singulier et pluriel, test sur le nombre de réponses non lues et pas sur les lignes, pas d'annonce en direct, ligne qui disparaît à l'ouverture du fil, nouveautés sans état « lu ». Au niveau.
- **3.12** : règle unique à deux cas, sans troisième ; promesse non écrite sans repérage. Au niveau, et le [À VÉRIFIER] du repérage se lève en partie (D3).
- **4.4, série** : bien placée et sans règle nouvelle, mais l'état à 0 remplace un texte validé sans le dire (D2).
- **5.2** (l. 735) : « Le conseil d'une étape ne rapporte pas les 10 XP de la liste du catalogue » : exact. B1 entièrement levée (1.1, 4.4, 5.2).
- **7.3** : série, toucher, repérage, C14, note, lettres, cloche : tout au chantier ; totaux inchangés (1 150 + 45 = 1 195, soit environ 1 200 ; 3 750 + 180 = 3 930). Exact.
- **7.5** : (e) les deux effets de code de C14, (f) la lecture en base, (h) et (i) en [À VÉRIFIER] avec @fullstack. Au niveau.
- **Section 8 et E5, E6** : rien de rouvert ; la ligne « Ce qui reste à trancher » de la section 8 (l. 984) reprend la proposition des lettres et le repérage.

## 3. « Connexion en fenêtre » (4.2)

**La préférence n'est pas dans `founder-preferences.md`** : ni « fenêtre », ni « modale », ni « par-dessus » à propos de la connexion (seuls résultats : l. 61, fenêtre horaire ; l. 117, « fenêtre Premium »). Rien non plus dans le playbook, les lessons ou l'historique des audits. Elle n'apparaît que dans les documents UX de la résiliation s23, sous la forme « Préférence fondateur : connexion en fenêtre par-dessus la page » (`docs/ux/page-resiliation-s23-spec.md` l. 11, `revues-resiliation/ux-v1.md` l. 52, `ux-v2.md` l. 60), sans date ni citation de Thomas, et liée au point avocat n°2. **Le [À VÉRIFIER] ne se lève donc pas par la préférence** : aucune source datée du fondateur.

**Il se lève en revanche par le code, et la phrase doit changer** (D1) :
- **Aucune connexion en fenêtre n'existe aujourd'hui** : la modale `AuthModal` a été retirée en s15 au profit de vraies pages (`docs/qa/tunnel-inscription-s15.md` l. 4 et 10) ; aucune occurrence d'`AuthModal` dans `apps/web/src`.
- **Le bouton « Connexion » de l'en-tête porte toujours la page d'origine** : `buildLoginUrl({ callbackUrl: pathname })` (`header.tsx` l. 117, liens l. 178 et 209 ; `auth-links.ts` l. 53 à 55). Après connexion, l'abonné revient sur cette page (`login/page.tsx` l. 101 et 154) ; sans `callbackUrl` (lien direct vers `/login`), il arrive sur `/vannes` (l. 101).
- Donc « « Aujourd'hui » est l'arrivée depuis le bouton « Connexion » sans page d'origine » décrit un cas qui n'existe pas (le bouton a toujours une page d'origine). Et la recommandation « après une simple connexion : Aujourd'hui » **change le comportement actuel** (retour sur la page où l'on était), ce que Thomas doit savoir en tranchant.

## 4. Notes et verdict

| # | Critère | T13 | T14 | Justification |
|---|---|---|---|---|
| C1 | Valeur persona | 10 | 10 | Note après la réponse : la courbe reste honnête. |
| C2 | Respect des décisions | 10 | 9 | État à 0 de la série inventé à la place d'un texte validé (D2). |
| C3 | Zéro donnée inventée | 8 | 9 | B1 levée ; la phrase de 4.2 décrit une connexion en fenêtre et un bouton sans page d'origine qui n'existent pas (D1). |
| C4 | Rubriques | 10 | 10 | |
| C5 | Ambition | 10 | 10 | |
| C6 | Cohérence | 9 | 10 | Résumé, section 8 et 2.8 alignés sur les lettres (B3). |
| C7 | Faisabilité | 10 | 10 | Repérage au chantier, condition de la promesse. |
| C8 | Décisions et reste à trancher | 10 | 9 | La question de la connexion est montrée à Thomas sans dire que la règle actuelle le ramène à sa page (D1). |
| C9 | Exemples | 10 | 10 | |
| C10 | Progression | 10 | 10 | |
| C11 | Pertinence pour l'audience | 10 | 10 | |

**Note globale : 9,7 / 10** (107 / 110 ; T13 : 9,7). B1 à B3 sont levées ; trois points nouveaux, aucun bloquant.

1. **D1. 4.2, « Connexion en fenêtre : si la connexion se fait en fenêtre depuis une fiche, l'abonné reste sur la fiche et la barre apparaît ; « Aujourd'hui » est l'arrivée depuis le bouton « Connexion » sans page d'origine [À VÉRIFIER …] » ; annexe B l. 1041.** Problème : voir section 3 (aucune fenêtre dans le code, bouton toujours avec page d'origine, préférence absente de FP). Correction : « **Aujourd'hui, la connexion se fait sur une page** (`/login`, la fenêtre a été retirée en s15) **et ramène l'abonné à la page où il a cliqué** (`callbackUrl`, `header.tsx` l. 117) ; sans page d'origine, il arrive sur `/vannes`. Proposition : garder le retour à la page d'origine, la barre de l'espace y apparaissant (décision Q11) ; « Aujourd'hui » remplace seulement l'arrivée par défaut `/vannes`. À montrer à Thomas avec ce fait. Une connexion en fenêtre (citée comme préférence du fondateur dans les documents UX de s23, sans date) reste hors de ce document. » Même retouche en annexe B. **Bloquant : non.**
2. **D2. 4.4 (a), « État à 0 : la ligne ne montre que la salutation, sans « 0 jour » » ; « Ton mois » l. 699 ; 7.3 ; E5 ; 0 bis point 9.** Problème : le texte validé en s17 a déjà son état à 0, « Ta série démarre à ta prochaine étape. », son singulier (« 1 jour ») et une aide, « Un jour compte quand tu valides une étape ou que tu termines un quiz d'étape. » (`config/textes/parcours.ts` l. 82 à 84, étalon 3.8 A). Le document dit reprendre le « texte validé » mais remplace son état à 0 sans le dire. Le composant actuel affiche aussi un émoji flamme (`streak-counter.tsx` l. 26), alors que le document des niveaux interdit tout émoji dans l'affichage voisin (cap, 3.0 point 5). Correction : reprendre l'état à 0 validé (il ne culpabilise pas), ou bien soumettre sa suppression comme [RESTE À TRANCHER] ; citer l. 82 à 84 ; dire si la flamme reste sur la ligne de salutation (@design, au rendu E5). **Bloquant : non.**
3. **D3. 3.12, « [À VÉRIFIER avec @fullstack : comment ces vannes sont repérées aujourd'hui] » ; 7.5 (i).** Problème : c'est vérifiable dans le schéma. `Joke` n'a aucun repère d'humour noir : 14 catégories sans humour noir (`schema.prisma` l. 163 à 178), 7 types (l. 180 à 188), `maturityLevel` de 1 à 5 (l. 127), qui note une intensité, pas un thème. Correction : « Aujourd'hui, aucun champ ne repère les vannes d'humour noir (`schema.prisma` l. 122 à 188) : le repérage est à créer (champ additif ou liste), il est au chantier ; @fullstack dit seulement si `maturityLevel` peut aider à constituer la liste. » **Bloquant : non.**

**Conditions du 10/10** : D1, D2, D3, puis un contrôle par recherche (« fenêtre » en 4.2 et annexe B, « sans « 0 jour » », « comment ces vannes sont repérées »). **Verdict : GO pour présenter la v14 à Thomas après ces trois retouches**, qui ne prennent qu'une phrase chacune et ne touchent aucun total ni aucune décision.
