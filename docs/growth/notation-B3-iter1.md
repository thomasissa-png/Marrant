# Notation : B3 /blog/mot-de-depart-collegue-drole (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts` l.72-78, `config/blog-forte-frappe.ts` l.24, `config/blog-tracking.ts` l.17, `components/ui/markdown-renderer.tsx` (`JOKE_RE` l.35, `shareText` l.49, `headingId` l.180), S9 `docs/copy/articles-q4/S9-toast-drole-discours-qui-fait-rire.md`, A1 corrigé (`A1-message-anniversaire-drole.md`), notation `notation-A1-iter1.md`.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés. Faits techniques du brief pris comme acquis (import `--update`, `faqs` + JSON-LD, meta = `metaDescription`, CTA, Partager `text-only`, `frTypo`, gabarit 10/10).
> Intouchables respectés par tous les correctifs : texte des 22 lignes (0 caractère modifié), zéro tiret cadratin (Grep U+2014 : 0 dans B3, 0 dans les textes proposés ici), zéro humoriste (0 nom propre de personne dans B3), slug, title.
> Limites : pas de rendu ni de capture (article programmé au 03/12, non visible), tests non exécutés, pas de git (consigne).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | « En bref » et 1er paragraphe servent la requête, mais le sommaire arrive au 4e bloc (environ 185 mots), sous le paragraphe sur l'italique : le défaut corrigé par C1 sur A1, reconduit ici. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture complète, mais 3 doublons dans le corps : boulot (l.69 et l.135), soirées (l.89 et l.155, la 2e pour un « déjeuner »), toast S9 (l.47 et l.173, même rôle : renvoyer le discours ailleurs). |
| 3 | CTA d'inscription | **10/10** | Entrée `blog-cta.ts` présente (CTA après le corps), titre lié au pot, promesse = [CHOIX UTILISATEUR] du 04/10, note vraie ; « sans carte bancaire » au lieu de « sans carte » évite la confusion avec la carte de départ : bien vu. |
| 4 | Lisibilité mobile et structure | **10/10** | Format A1 corrigé (numéro, ligne, indication en italique), bouton « Envoyer le message n°N » en `text-only` sur les 22 lignes (aucune ne commence par « », 2e alternative de `JOKE_RE`, indication exclue par `shareText`), règles non capturées, FAQ sortie du corps. |
| 5 | Ton Marrant des textes affichés | **7/10** | Promesse fausse « une ou deux phrases » (3 endroits, 16 lignes sur 22 en font 3 ou 4), règle 1 contredite par les n°2 et n°19, « les chips » sans objet, 4 indications qui piègent le lecteur s'il les suit (n°6 à 8 postées devant le partant, n°6 « Réponds vite », n°15, n°18 envoyée aux clients), intro section 5 à double sens, et 2 phrases déjà corrigées sur A1 recopiées avant correction (l.155, l.177). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, rien de blessant, rien sur un licenciement, quiz et 20 min vrais ; seul écart client-facing : « parcours Confiance [...] pour oser envoyer le message » (l.155) prête au parcours un objet qu'il n'a pas, écart déjà corrigé sur A1 (C5, A1 l.150). |
| 7 | Sécurité SEO | **9/10** | Title 54 car. avec la requête, 6 H2 en question, ancres justes ; mais « collègue » absent de la meta (144 car.), et H2 carte quasi identique à celui d'A1 (« Quel mot drôle écrire sur la carte collective ... ») sans le mot-clé secondaire « carte de départ collègue ». |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (rapport hebdo), partage mesuré par le bouton, paliers de scroll, ancres séparées des sorties, `src=blog-<slug>` via l'entrée CTA : tout est hérité du gabarit. |

**Note globale : 9,1/10** (73/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.** Aucun ne touche le texte d'une des 22 lignes.

## 2. Top 3 (impact le plus fort)

1. **C5 + C6 (cagnotte devant le partant, auto-réponse aux clients)** : les seuls défauts qui peuvent coûter quelque chose au lecteur dans la vraie vie (surprise gâchée, blague envoyée à un client). Ce sont des indications, pas des lignes.
2. **C3 + C4 (promesse et règle 1)** : la page dit « une ou deux phrases » puis montre 4 phrases, et interdit « ce qu'il laisse derrière lui » puis propose le fauteuil et le prénom au tableau. Un lecteur attentif le voit.
3. **C9 + C10 (meta et H2 carte)** : « collègue » dans le snippet, et un H2 qui ne concurrence plus celui d'A1. C'est le trafic de la page.

## 3. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/B3-mot-de-depart-collegue.md`, à reporter en base par l'import `--update`. Aucun correctif ne touche le texte d'une des 22 lignes.

### C1. Sommaire en 2e bloc, juste sous le 1er paragraphe (critère 1)

**Avant** (l.47 puis l.49, dans cet ordre) :
```md
Chaque texte tient en une ou deux phrases. Après chacun, une ligne en italique te dit où et quand l'écrire. [...] Ici, que de l'écrit.

Va direct à ton support : [Carte collective](#quel-mot-drole-ecrire-sur-la-carte-collective-de-depart) · [Canal d'équipe](#...) · [...] · [Les 4 règles](#comment-ecrire-un-mot-de-depart-drole-qui-ne-blesse-personne). Pour d'autres phrases à ressortir dans une conversation, il y a aussi [les phrases drôles](/blog/phrases-droles-conversations).
```
**Après** (les deux paragraphes inversés ; seule l'ancre Carte change, voir C10 ; le 2e paragraphe reçoit C3) :
```md
Va direct à ton support : [Carte collective](#quel-mot-drole-ecrire-sur-la-carte-de-depart-d-un-collegue) · [Canal d'équipe](#quel-message-drole-poster-dans-le-canal-d-equipe-pour-un-depart) · [Message privé](#que-dire-de-drole-en-message-prive-a-un-collegue-qui-part) · [Mail d'adieu](#quel-mail-d-adieu-drole-ecrire-quand-c-est-toi-qui-pars) · [Après le départ](#quel-message-envoyer-a-un-ancien-collegue-apres-son-depart) · [Les 4 règles](#comment-ecrire-un-mot-de-depart-drole-qui-ne-blesse-personne). Pour d'autres phrases à ressortir dans une conversation, il y a aussi [les phrases drôles](/blog/phrases-droles-conversations).

Chaque texte tient en quelques phrases courtes. Après chacun, une ligne en italique te dit où et quand l'écrire. Il te reste à remplacer le [prénom] par celui du partant et, si tu en as un, à ajouter un détail que toi seul connais. Et si tu cherches le discours à dire à voix haute, c'est ailleurs : [la structure d'un toast drôle](/blog/toast-drole-discours-qui-fait-rire) s'en charge. Ici, que de l'écrit.
```
Pourquoi : le sommaire passe d'environ 185 à environ 105 mots du haut (« En bref » + 1er paragraphe), dans le 1er écran mobile. Même correctif que C1 d'A1, déjà appliqué sur A1. Le renvoi vers S9 reste dans le 2e bloc : le lecteur venu pour un discours le voit avant la 1re ligne.

### C2. Deux doublons de sortie remplacés par une sortie utile (critère 2)

**Avant** (l.135) :
```md
Pour le dernier jour au bureau, [les blagues de boulot](/vannes/theme/boulot) te donnent de quoi tenir jusqu'au pot.
```
**Après** :
```md
Et si on te demande un mot au pot, [le toast drôle](/blog/toast-drole-discours-qui-fait-rire) donne la structure d'un discours court, à dire à voix haute.
```
**Avant** (l.173) :
```md
Pour le discours dit à voix haute, [le toast drôle](/blog/toast-drole-discours-qui-fait-rire) donne la structure. Et si tu cherches d'autres situations que le départ, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille.
```
**Après** :
```md
Si tu cherches d'autres situations que le départ, [les 50 blagues drôles par situation](/blog/meilleures-blagues-droles-2026) couvrent la soirée, le bureau, les dates et la famille.
```
Pourquoi : boulot était proposé l.69 puis l.135, et le toast l.47 puis l.173 avec le même rôle (« le discours, c'est ailleurs »). Le lien S9 descend là où il sert vraiment : c'est celui qui part qu'on invite à dire un mot à son pot. S9 reste lié deux fois (décision des métadonnées l.20), avec deux rôles distincts. Le 2e doublon (soirées l.155) est traité en C8. Boulot, soirées et autodérision restent dans la liste de fin (l.180-182), comme sur l'étalon.

### C3. « Une ou deux phrases » devient vrai (critère 5)

16 lignes sur 22 font 3 ou 4 phrases (n°2, 5 et 15 en font 4). Trois endroits à corriger, le reste de chaque phrase inchangé :

| Ligne | Avant | Après |
|---|---|---|
| l.13 (excerpt) | `Un mot de départ drôle tient en une ou deux phrases, fait rire...` | `Un mot de départ drôle tient en quelques phrases courtes, fait rire...` |
| l.43 (En bref) | `Un mot de départ drôle tient en une ou deux phrases, fait rire...` | `Un mot de départ drôle tient en quelques phrases courtes, fait rire...` |
| l.47 | `Chaque texte tient en une ou deux phrases.` | `Chaque texte tient en quelques phrases courtes.` (déjà dans C1) |

### C4. Règle 1 alignée sur les lignes de la page (critère 5)

**Avant** (l.165) :
```md
**1. Le rire tombe sur toi ou sur le bureau, pas sur le partant.** Ton retard, ta mémoire, la salle réservée, les chips : tout est permis. Son poste, son âge, sa destination et ce qu'il laisse derrière lui, jamais.
```
**Après** :
```md
**1. Le rire tombe sur toi ou sur le bureau, pas sur le partant.** Ton retard, ta mémoire, le gâteau trop petit, l'imprimante du 2e : tout est permis. Son poste, son âge et sa destination, jamais. Ce qu'il laisse derrière lui (un fauteuil, un prénom au tableau) seulement si c'est le bureau qui en sort ridicule.
```
Pourquoi : « ce qu'il laisse derrière lui, jamais » interdit la n°2 (son fauteuil) et la n°19 (son prénom au tableau), toutes deux sur la page. Dans les deux, c'est le bureau qui est ridicule (tirage au sort, personne n'ose effacer) : la nouvelle règle les couvre et garde l'interdit. « La salle réservée » et « les chips » ne renvoient à aucune ligne ; « le gâteau trop petit » (n°5) et « l'imprimante du 2e » (n°20) si.

### C5. Cagnotte et cadeau hors de la vue du partant (critères 5 et 7)

**Avant** (l.75) :
```md
Le canal d'équipe ou le mail de groupe : tout le monde le voit, la direction aussi, et il reste. Une seule ligne, un ton neutre, une chute sur l'organisation du pot ou sur toi, jamais sur le partant. Les chiffres et les jours des lignes ci-dessous sont à remplacer par les vrais chez toi.
```
**Après** :
```md
Le canal d'équipe ou le mail de groupe : tout le monde le voit, la direction aussi, et il reste. Une seule ligne, un ton neutre, une chute sur l'organisation du pot ou sur toi, jamais sur le partant. L'invitation au pot de départ (n°5) part à toute l'équipe, partant compris ; la cagnotte et le cadeau (n°6 à 8) se gèrent dans un fil sans lui, pour qu'il découvre la surprise au pot. Les chiffres et les jours des lignes ci-dessous sont à remplacer par les vrais chez toi.
```
**Avant** (l.81) :
```md
*→ En réponse dans le fil de l'annonce, sur une ligne, et seulement si tu n'as pas encore versé. Réponds vite : une blague tardive ne fait plus rire personne.*
```
**Après** :
```md
*→ En réponse dans le fil de la cagnotte, un ou deux jours après l'annonce, et seulement si tu n'as pas encore versé. Remplace « mardi » par le vrai jour de l'annonce, puis verse : la blague ne sert qu'une fois.*
```
Pourquoi : suivies à la lettre (« canal d'équipe », « tout le monde le voit »), les n°7 et n°8 annoncent le cadeau et la collecte devant le partant. La n°6 dit « depuis mardi » : elle ne marche qu'avec quelques jours de retard, l'inverse de « Réponds vite ». Gain SEO : « pot de départ » (mot-clé secondaire « message pot de départ ») entre dans le texte.

### C6. Deux indications du mail d'adieu qui protègent celui qui part (critère 5)

| N° | Ligne | Avant | Après |
|---|---|---|---|
| 15 | l.124 | `*→ Autre ouverture, à choisir à la place de la précédente : une seule phrase drôle par mail. Réserve-la à un mail adressé à toute l'équipe.*` | `*→ Autre ouverture, à choisir à la place de la précédente : une seule phrase drôle par mail. Seulement si ce mail apprend ton départ à une partie des destinataires : si tout le monde le sait déjà, prends la n°14.*` |
| 18 | l.133 | `*→ Dans le message d'absence automatique, le dernier jour. Mets le prénom de la personne qui reprend tes dossiers, après l'avoir prévenue.*` | `*→ Dans le message d'absence réservé aux collègues, le dernier jour, si ta messagerie sépare l'interne de l'externe. Les clients et partenaires reçoivent les deux premières phrases seules. Mets le prénom de la personne qui reprend tes dossiers, après l'avoir prévenue.*` |

Pourquoi : n°15, « Je voulais vous l'annoncer » est faux si l'équipe est au courant depuis un mois (la règle de la page : la phrase doit rester vraie). n°18, une réponse automatique part à tous les expéditeurs, clients compris : une blague à un client le lendemain d'un départ est le seul vrai risque professionnel de la page.

### C7. Intro de la section 5 sans double sens (critère 5)

**Avant** (l.141, dernière phrase) : `Les deux premiers textes sont pour celui qui reste, le troisième pour celui qui est parti, le dernier pour l'un ou l'autre.`
**Après** : `Les deux premiers textes s'envoient depuis l'ancien bureau, le troisième par celui qui est parti, le dernier par l'un ou l'autre.`
Pourquoi : la phrase d'avant dit déjà « le message [...] est celui qui reste » ; « pour celui qui reste » se lit ensuite « destiné à celui qui reste », alors que la n°19 et la n°20 s'adressent au partant.

### C8. Promesse Confiance exacte, plus de « soirée » pour un déjeuner (critères 2, 5 et 6)

**Avant** (l.155) :
```md
Écrire le premier après un silence demande un peu de courage. Le [parcours Confiance](/parcours/confiance) est fait pour ça : 20 minutes par semaine pour oser envoyer le message. Et pour le déjeuner des retrouvailles : [les blagues de soirée](/vannes/theme/soirees).
```
**Après** (texte d'A1 l.150, déjà validé) :
```md
Écrire le premier après un silence demande un peu de courage. Le [parcours Confiance](/parcours/confiance) t'aide à reprendre après une pause, une conversation à la fois : 20 minutes par semaine.
```
Pourquoi : c'est mot pour mot la phrase corrigée sur A1 par C5 (le parcours sert à reprendre après une pause, pas à « oser envoyer le message »). Les « blagues de soirée » pour un déjeuner ne collent pas, et soirées est déjà proposé l.89.

### C9. « Collègue » dans la meta (critère 7)

**Avant** (l.12, 144 car.) : `22 mots de départ drôles à copier-coller : carte collective, canal d'équipe, message privé, mail d'adieu de celui qui part. Avec le bon support.`
**Après** (144 car., compté) : `22 mots de départ drôles pour un collègue, à copier-coller : carte collective, canal d'équipe, message privé, mail d'adieu. Avec le bon support.`
Pourquoi : la requête est « mot de départ collègue drôle » ; « collègue » manquait au snippet, donc pas de mise en gras par Google sur ce mot. « Mail d'adieu » se comprend seul ; le « 22 » reste lié au nombre de lignes (règle l.21).

### C10. H2 carte : mot-clé secondaire, plus de jumeau avec A1 (critère 7)

**Avant** (l.53) : `## Quel mot drôle écrire sur la carte collective de départ ?`
**Après** : `## Quel mot drôle écrire sur la carte de départ d'un collègue ?`
Pourquoi : A1 a `## Quel mot drôle écrire sur la carte collective du bureau ?` (A1 l.71) ; deux H2 de 8 mots identiques sur 9 se disputent « mot drôle carte collective ». Le nouveau H2 porte « carte de départ » + « collègue » (mot-clé secondaire l.15), et le 1er paragraphe de la section dit déjà que la carte « passe de main en main ». Ancre : `quel-mot-drole-ecrire-sur-la-carte-de-depart-d-un-collegue` (calcul `headingId`), reportée dans C1. Article non publié et aucun test ne référence l'ancre (Grep `apps/web/src` : 0) : changement sans risque.

### C11. Deux phrases de gabarit (critère 5)

| Ligne | Avant | Après |
|---|---|---|
| l.163 | `Copier un texte, c'est bien. L'adapter, c'est ce qui le rend à toi. Quatre règles, dans l'ordre :` | `Pour que le texte devienne le tien, quatre règles, dans l'ordre :` |
| l.177 | `[...] Le reste du catalogue, lui, ne change pas : [toutes les vannes](/vannes) sont rangées par situation.` | `[...] Le reste est dans [le catalogue de vannes](/vannes), rangé par situation.` (texte d'A1 après C7) |

Pourquoi : l.163, le tic « X, c'est bien. Y, c'est... » (charte copy s11) et « le rend à toi » (« rendre à » = restituer). l.177, la phrase défensive retirée d'A1 par C7, recopiée avant correction.

### Récapitulatif

| # | Critère(s) | Lignes B3 | Test |
|---|---|---|---|
| C1 | 1 | l.47-49 | aucun |
| C2 | 2 | l.135, l.173 | aucun |
| C3 | 5 | l.13, l.43, l.47 | aucun |
| C4 | 5 | l.165 | aucun |
| C5 | 5, 7 | l.75, l.81 | aucun |
| C6 | 5 | l.124, l.133 | aucun |
| C7 | 5 | l.141 | aucun |
| C8 | 2, 5, 6 | l.155 | aucun |
| C9 | 7 | l.12 (metaDescription) | meta ≤ 155 car. |
| C10 | 7 | l.53 (+ ancre en C1) | aucun |
| C11 | 5 | l.163, l.177 | aucun |

Diff réel attendu (P0 s11) : 16 lignes de contenu touchées sur environ 205 (dont 2 lignes déplacées), 0 caractère modifié dans les 22 lignes, 0 dans le slug, le title et la FAQ. Zéro code. Report en base : import `--update`. Notes projetées : 10 sur les 8 critères.

## 4. Vérifications demandées

### SEO

| Point | État actuel | Après correctifs |
|---|---|---|
| Title ≤ 60 car. avec la requête | PASS : 54 car. (compté), « Mot de départ drôle pour un collègue » en tête, nombre et promesse | inchangé |
| Meta ≤ 155 car. | 144 car., mais sans « collègue » | PASS (C9, 144 car.) |
| H2 en question | 6 sur 6 dans le corps (le `## FAQ` part dans `faqs`, fait acquis) | H2 carte réécrit (C10) |
| Intention servie dès l'intro | PASS : « En bref » + 1er paragraphe donnent la réponse et le nombre | sommaire dans le 1er écran (C1) |
| Ancres du sommaire | PASS : les 6 correspondent à `headingId` (recalculées une à une) | ancre Carte mise à jour (C1, C10) |
| Liens internes (16) | PASS : mêmes routes que A1, plus S9 (30/11, avant le 03/12) | 16 cibles, plus aucune répétée dans le corps hors S9 (2 rôles distincts) |
| Mots-clés secondaires | « mail de départ drôle » (FAQ 4) et « carte de départ » (l.55) présents ; « pot de départ » absent | « pot de départ » (C5), « carte de départ d'un collègue » en H2 (C10) |
| FAQPage | PASS (fait acquis) | inchangé |

### Cannibalisation avec `toast-drole-discours-qui-fait-rire` (S9)

Aucune. S9 vise « toast drôle », « discours drôle repas de famille », « faire un toast humoristique » : un discours dit debout, en 5 temps, illustré par un repas de Noël ; les mots « départ », « collègue » et « pot » n'y apparaissent pas (lecture complète). B3 vise « mot de départ drôle collègue » : des textes écrits, par support ; aucune structure de discours, aucune ligne reprise. Les deux liens de B3 vers S9 (l.47, et l.135 après C2) portent l'ancre « toast drôle » et renforcent sa requête. Seul écho de contenu, sans effet SEO : la n°5 (« un gâteau pour douze. On est trente-quatre ») et la vanne d'accroche de S9 (« cuisine toujours pour douze. On est trois ») partagent le même « douze » ; l'indication de la n°5 fait déjà remplacer les nombres (voir §5).

Point voisin, réglé par C10 : le H2 carte de B3 doublait presque celui d'A1 (« carte collective du bureau »).

### Rien de blessant pour le partant, rien sur un licenciement

Grep `licenci|viré|rupture|plan social|chômage|démission|retraite` : 0 dans le texte publié. « Âge » n'apparaît que dans les interdits (l.55, l.165, FAQ 1). Le départ subi est traité sans être nommé par la FAQ 3 (« si le départ n'est peut-être pas une bonne nouvelle ») : message sincère, sans blague. À garder tel quel.

| N° | Cible du rire | Verdict |
|---|---|---|
| 1, 3, 4 | Soi (relation mince, captures, raccourci retenu) | OK |
| 2 | Le bureau (tirage au sort du fauteuil) | OK, couvert par la règle 1 après C4 |
| 5 à 8 | L'organisation, soi, les retardataires de la cagnotte | OK ; hors de la vue du partant après C5 |
| 9 à 13 | Soi (dignité, dette, contact), une phrase sincère (10) | OK |
| 14 à 17 | Soi, quand c'est toi qui pars ; 15 vise les agendas de l'équipe, sans personne | OK (C6 pour la 15) |
| 18 | La personne en copie, gentiment | OK, réservée aux collègues après C6 |
| 19, 20 | Le bureau qui ne s'en sort pas sans lui | OK : ce que le partant laisse est un regret, pas une moquerie |
| 21 | Soi, à son nouveau poste ; rien sur la nouvelle équipe | OK |
| 22 | La distance | OK |

Aucune ligne sur le poste, l'âge, la destination, le salaire ou la raison du départ. Aucune à retirer : le « 22 » reste juste partout.

## 5. Ne comptent pas contre le 10

- **« douze » en écho avec S9** (n°5) : ligne validée, intouchable ; l'indication fait déjà remplacer les nombres.
- **n°19, « un point d'interrogation »** : se lit « reviendra-t-il ? » plutôt que « qui était-ce ? » ; l'indication « seulement si c'est vrai chez vous » suffit.
- **Métadonnées l.21 (interne, non publié)** : « zéro marque (WhatsApp seul toléré) » est inexact, la n°21 dit « post-it », nom déposé passé dans l'usage. Correctif de la doc seulement : `(WhatsApp toléré comme support, « post-it » toléré comme nom commun dans la n°21)`. Décision à confirmer par Thomas si la règle « zéro marque » doit aussi couvrir les noms communs déposés.
- **Encart parcours** : sans entrée dans `FORTE_FRAPPE_PARCOURS`, B3 (CATALOGUE) reçoit Machine à Café, cohérent avec un départ au bureau et avec le lien l.89. Le CTA parle de « répartie pour le pot » sans nommer de parcours : pas de contradiction.

## 6. Points d'attention (hors note)

- **B5 a les deux mêmes phrases d'avant correction** : « Le reste du catalogue, lui, ne change pas » (B5 l.152) et « parcours Confiance est fait pour ça [...] pour oser envoyer le message » (B5 l.130 ; variante B4 l.111). À corriger à leur notation avec les textes de C8 et C11 : le gabarit A1 corrigé n'a pas été repris par le lot B.
- « Une ou deux phrases » figure aussi dans B1, B4 et B5 (l.46-47) : à vérifier contre leurs lignes à leur notation.
- Relecture @copywriter des textes ajoutés par C2 à C8 et C11 contre `docs/copy/charte-refonte-copy-s11.md`, puis `--update`. Captures 375/768/1280 à prendre à la mise en ligne du 03/12 (critères 1 et 4 à confirmer au rendu).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B3-iter1.md
- Décisions prises : note globale 9,1/10 (73/80) ; 11 correctifs exacts (C1 à C11) pour 10/10, sans toucher aux 22 lignes, au slug, au title ni à la FAQ ; aucune cannibalisation avec S9 ; rien de blessant, rien sur un licenciement.
- Points d'attention : @copywriter applique C1 à C11 dans le fichier B3 puis import `--update` ; B4/B5 reprennent 2 phrases déjà corrigées sur A1 ; Thomas tranche « post-it » face à la règle « zéro marque » (doc interne seulement).
---
