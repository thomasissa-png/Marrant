# Notation : B6 /blog/blagues-vacances-ete-entre-amis (itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/B6-blagues-vacances-entre-amis.md` (numéros de ligne ci-dessous = ce fichier), `config/blog-cta.ts` l.93-99, `config/blog-forte-frappe.ts` l.27 et l.39-55, `config/blog-tracking.ts` l.20, `components/blog/blog-article-parcours-maillage.tsx`, `components/ui/markdown-renderer.tsx` (`JOKE_RE` l.35, `headingId` l.180), A4 (gabarit) et sa notation, notations B4 et B5 (même série).
> Rendu : captures de l'aperçu admin (sans JS) lues : m00, m02 (mobile 390 px), d-bas (desktop).
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, inchangés.
> Intouchables respectés : texte des 20 vannes (0 caractère modifié), slug, title, H2, pages thèmes. Grep U+2014 : 0 dans B6, 0 dans les textes proposés. Zéro humoriste, zéro concurrent, zéro marque (ni location, ni messagerie, ni appli de comptes nommée).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **9/10** | Sommaire juste sous l'« En bref » (m00), le meilleur départ de la série ; mais le paragraphe suivant (l.46) retarde la n°1 sans rien apporter, et dit « les meilleures blagues de vacances ne s'apprennent pas » en tête d'une page qui en donne 20. |
| 2 | Sorties vers une 2e page | **8/10** | Autodérision 2 fois dans le corps (l.68, l.116), et sous la section location, où elle ne répond à rien ; 2 paragraphes de sortie empilés après la route (l.91, l.93) ; encart Machine à Café (capture d-bas) alors que le CTA nomme Confiance. |
| 3 | CTA d'inscription | **9/10** | Titre juste (« Reste à oser les sortir »), parcours nommé, note vraie ; mais « sans la relire dix fois » parle d'un texte écrit pour une vanne dite devant le groupe, et répète mot pour mot la l.138, lue juste avant. |
| 4 | Lisibilité mobile et structure | **10/10** | Vannes entre guillemets captées par `JOKE_RE` (1re alternative, gourmande : les « » imbriqués de 9 vannes, n°2, 10 à 12 et 14 à 18, partent entiers), `with-url` ancré `#vanne-N`, H2 longs mais au format A4 validé, FAQ hors du corps. |
| 5 | Ton Marrant des textes affichés | **7/10** | l.46 : « Personne n'a choisi de faire tout ça ensemble avec autant de sérieux » ne se comprend pas, et 6 personnes dans « une voiture » ; indication n°14 « Garde-la pour toi » (= ne la dis pas) sous « À dire ou à envoyer » ; indication n°4 qui fait viser celui qu'on croise ; « valeur sûre » 2 fois (l.116, l.160) ; quiz « quel type d'humour es-tu ? » vendu pour « ton groupe » ; test de la FAQ 3 bancal. |
| 6 | Conformité | **9/10** | Rien sur le physique ni sur l'argent de quelqu'un, 20 min et 2 min vrais, zéro chiffre inventé. Seul écart : « Pour oser envoyer ce genre de message [...], le parcours Confiance » (l.138), même promesse hors objet que celle corrigée sur A1 et B3. |
| 7 | Sécurité SEO | **8/10** | Title 53 car., 6 H2 en question, 6 ancres justes ; mais la meta (145 car.) n'a ni « entre amis » ni « été », « été » n'apparaît nulle part dans le corps (mot-clé secondaire « blagues d'été »), et « Mis à jour le 5 octobre 2026 » sous « 3 juin 2027 » (m00). |
| 8 | Mesure | **10/10** | Slug dans `TRACKED_ARTICLES` (l.20, test hebdo l.67), partage `with-url` mesuré et ancré, paliers de scroll, ancres séparées, `src=blog-<slug>` via l'entrée CTA. |

**Note globale : 8,8/10** (70/80).
**Après les 11 correctifs ci-dessous et G1 (notation B4) : 10/10 sur les 8 critères.** Aucun ne touche le texte d'une des 20 vannes.

## 2. Top 3 (impact le plus fort)

1. **C6 (n°14) + C5 (n°4)** : deux indications qui, suivies à la lettre, font l'inverse de ce qu'il faut (ne pas dire la n°14 ; viser celui qui s'est levé tôt). Ce sont les seuls endroits où la page peut froisser quelqu'un du groupe.
2. **C1 + C9 (intro, meta, « été »)** : l'article vise l'été mais ne le dit qu'au title ; la meta oublie « entre amis ». C'est ce que lit Google et le lecteur avant de cliquer.
3. **C10 + C4 + C11 (Confiance cohérent)** : CTA, l.138 et encart parcours doivent promettre la même chose (« trouver ta place dans un groupe qui rit »), pas « relire dix fois » ni la pause café.

## 3. Correctifs exacts

Fichier : `docs/copy/articles-forte-frappe/B6-blagues-vacances-entre-amis.md`, à reporter en base par l'import, sauf C10 (config), C11 (config, notation B4 C12) et G1 (code, notation B4).

### C1. Intro : du concret, et l'été (critères 1, 5 et 7)

**Avant** (l.46) :
```md
Des vacances entre amis, c'est six personnes, une maison, une voiture et une cagnotte. Personne n'a choisi de faire tout ça ensemble avec autant de sérieux, et c'est exactement ce qui fait rire : les petites décisions collectives qui prennent une heure. Les meilleures blagues de vacances ne s'apprennent pas, elles se glissent là où le groupe se reconnaît.
```
**Après** :
```md
Des vacances d'été entre amis, c'est six personnes, une maison, un coffre trop petit et une cagnotte. Ce qui fait rire, ce sont les petites décisions collectives qui prennent une heure : qui dort où, qui paie le dentifrice, qui ose lancer le lave-vaisselle. Les vannes ci-dessous viennent de là, et chacune a son moment.
```
Pourquoi : 3 exemples tirés des n°3, 10 et 1 au lieu d'une phrase abstraite ; « une voiture » pour six adultes ne tient pas (la n°7 les met à six sur l'aire de repos) ; « ne s'apprennent pas, elles se glissent » est le moule « X ne se fait pas, il se... » (charte s11) et contredit la page. « Vacances d'été » met le mot-clé secondaire dans le corps. Même longueur, la n°1 ne descend pas.

### C2. Une sortie par section, à sa place (critère 2)

| Ligne | Avant | Après |
|---|---|---|
| l.68 | `Pour d'autres lignes, avec leur chute et leur décryptage : [les blagues d'autodérision](/vannes/theme/autoderision).` | `Le premier soir à la location, [les blagues de soirée](/vannes/theme/soirees) prennent le relais entre potes.` |
| l.91 (+ ligne vide l.92) | `Une fois la voiture garée, [les blagues de soirée](/vannes/theme/soirees) prennent le relais entre potes.` | (supprimée) |

Pourquoi : autodérision sous la location ne répond à rien (les n°1 à 4 rient du groupe, pas de soi) et revient l.116, où elle sert (l'argent). La sortie soirées monte d'une section, là où le soir arrive vraiment (n°2) ; la route garde une seule sortie, Répartie (l.93), qui répond à la banquette arrière. Soirées reste une sortie, jamais un angle du corps : règle de cannibalisation l.33 respectée.

### C3. « Valeur sûre » une seule fois (critère 5)

**Avant** (l.116) : `Pour rire de toi d'abord, ce qui reste la valeur sûre dès qu'on parle d'argent : [les vannes d'autodérision](/vannes/theme/autoderision).`
**Après** : `Dès qu'on parle d'argent, commence par rire de toi : [les vannes d'autodérision](/vannes/theme/autoderision) t'entraînent à le faire sans te rabaisser.`
Pourquoi : « L'autodérision est la valeur sûre » revient l.160, 44 lignes plus bas ; la phrase actuelle se lit aussi mal (« ce qui reste »).

### C4. Confiance : la promesse de l'encart, pas « oser envoyer » (critères 2 et 6)

**Avant** (l.138) : `Pour oser envoyer ce genre de message sans le relire dix fois, le [parcours Confiance](/parcours/confiance) demande 20 minutes par semaine.`
**Après** : `Si tu restes plutôt en lecture dans le groupe, le [parcours Confiance](/parcours/confiance) t'aide à trouver ta place dans un groupe qui rit : 20 minutes par semaine.`
Pourquoi : l'encart Confiance promet mot pour mot « trouver ta place dans un groupe qui rit » : c'est exactement le lecteur de B6 qui n'ose pas écrire dans le groupe des vacances. « Oser envoyer » est l'objet retiré d'A1 et de B3. « Sans le relire dix fois » part dans le CTA (C10), où il ne sera plus dit.

### C5. N°4 : l'indication ne fait plus viser personne (critère 5)

**Avant** (l.66) : `*→ À dire au deuxième ou troisième matin, en croisant quelqu'un déjà douché. Le planning, c'est vous tous : personne n'est visé.*`
**Après** : `*→ À dire au deuxième ou troisième matin, au petit-déjeuner, quand le planning affiché ne sert plus à rien. Si c'est toi qui te lèves à 6 h 30, dis-le en levant la main : le rire tombe sur toi.*`
Pourquoi : la ligne dit « quelqu'un se lève à 6 h 30 pour gagner » ; la dire « en croisant quelqu'un déjà douché », c'est le désigner, l'inverse du « Test » (l.48). La nouvelle indication garde le moment et met le rire sur le groupe ou sur soi.

### C6. N°14 : « Garde-la pour toi » disait de ne pas la dire (critère 5)

**Avant** (l.114) : `*→ À dire ou à envoyer en fin de séjour, quand les remboursements tombent. Garde-la pour toi : c'est toi qui dois.*`
**Après** : `*→ À dire ou à envoyer en fin de séjour, quand les remboursements tombent. Seulement si c'est toi qui dois : la ligne parle de ta dette, pas de celle d'un autre.*`
Pourquoi : « garde-la pour toi » se lit « ne la dis pas », juste après « à dire ou à envoyer ». L'intention (la réserver à celui qui doit) est gardée, et elle protège la règle « jamais sur l'argent de quelqu'un ».

### C7. Le quiz vendu pour ce qu'il fait (critère 5)

**Avant** (l.180) : `Pas sûr du type d'humour de ton groupe ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) prend environ 2 minutes, sans inscription.`
**Après** : `Tu ne sais pas encore quel genre de drôle tu es dans le groupe ? [Le quiz « quel type d'humour es-tu ? »](/quiz-humour) te le dit en environ 2 minutes, sans inscription.`
Pourquoi : le quiz porte sur une personne (« es-tu »), pas sur un groupe. La nouvelle accroche reste dans l'angle de l'article.

### C8. FAQ 3 : un test qui se lit d'une traite (critère 5)

**Avant** (l.198, dernière phrase) : `Un test : la dirais-tu en riant devant celui qui doit le plus d'argent au groupe sans qu'il se raidisse ?`
**Après** : `Un test : si celui qui doit le plus au groupe l'entendait, rirait-il avec vous ? Dans le doute, garde-la pour un autre jour.`
Pourquoi : « en riant [...] sans qu'il se raidisse » mélange deux sujets dans une question ; la réponse FAQPage doit se comprendre seule, en texte simple. Questions de FAQ inchangées.

### C9. Meta : « entre amis » et « l'été » (critère 7)

**Avant** (l.26, 145 car.) : `20 blagues de vacances pour la location, la route, la cagnotte, le groupe de discussion et les photos, chacune avec le bon moment pour la sortir.`
**Après** (146 car., compté) : `20 blagues de vacances entre amis pour l'été : location, route, cagnotte, groupe de discussion, photos. Chacune avec le bon moment pour la sortir.`
Pourquoi : le snippet reprend enfin les deux mots du title après la requête (« entre amis », « l'été ») ; Google met en gras ce qui correspond à « blagues de vacances entre amis » et « blagues d'été ». Le « 20 » reste le nombre de vannes. « Entre amis » toujours accolé à « vacances » : règle de cannibalisation l.33 respectée.

### C10. CTA : oser devant le groupe, pas « relire » (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`, entrée `"blagues-vacances-ete-entre-amis"` (et l.18 du fichier B6, à garder synchrone).

**Avant** (l.96) : `text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance : de quoi sortir ta vanne devant tout le groupe sans la relire dix fois.",`
**Après** : `text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance : de quoi sortir ta vanne devant tout le groupe, même si tu n'es pas le drôle de la bande.",`
Pourquoi : on ne relit pas une vanne dite à voix haute ; la fin traite l'objection que les métadonnées (l.35) attribuent à Confiance (« je ne suis pas le drôle du groupe ») et qu'aucun texte de la page ne traitait. Title, primaryLabel et note inchangés.

### C11. Parcours recommandé : Confiance (critère 2)

Entrée `"blagues-vacances-ete-entre-amis": "confiance"` dans `FORTE_FRAPPE_PARCOURS` : code exact dans `notation-B4-iter1.md`, C12 (une seule modification pour B4, B5, B6). **Le parcours déduit du cluster n'est pas le bon** : CATALOGUE → `fort-volume` → Machine à Café, encart « Des blagues toutes faites à ta propre voix [...] l'équivalent d'une pause café » (capture d-bas), humour de bureau à la fin d'un article de vacances. Confiance : nommé par le CTA, cité l.138, et son encart dit « trouver ta place dans un groupe qui rit », la situation exacte du lecteur. Répartie (l.93) reste lié dans le corps, pour celui qui veut renvoyer la balle.

### Récapitulatif

| # | Critère(s) | Lignes / fichier | Test |
|---|---|---|---|
| C1 | 1, 5, 7 | B6 l.46 | aucun |
| C2 | 2 | B6 l.68, l.91-92 | aucun |
| C3 | 5 | B6 l.116 | aucun |
| C4 | 2, 6 | B6 l.138 | aucun |
| C5 | 5 | B6 l.66 | aucun |
| C6 | 5 | B6 l.114 | aucun |
| C7 | 5 | B6 l.180 | aucun |
| C8 | 5 | B6 l.198 (FAQ) | aucun |
| C9 | 7 | B6 l.26 (metaDescription) | meta ≤ 155 car. |
| C10 | 3 | blog-cta.ts l.96 (+ B6 l.18) | test CTA s'il fige les textes |
| C11 | 2 | blog-forte-frappe.ts (notation B4, C12) | voir B4 |
| G1 | 7 | blog-article-page.ts (notation B4) | voir B4 |

Diff réel attendu (P0 s11) : 10 lignes de contenu touchées sur environ 200 (dont 1 supprimée), plus 1 ligne CTA du fichier et 1 de config ; 0 caractère dans les 20 vannes, le slug, le title, les H2, les ancres et les questions de FAQ. Ne pas l'annoncer comme une réécriture. Notes projetées : 10 sur les 8 critères.

## 4. Vérifications

### Répétitions inter-articles

Aucune phrase d'A1, B3, B4 ou B5 recopiée (gabarit différent : A4). Échos internes traités : « valeur sûre » (C3), « sans le relire dix fois » l.138 / CTA (C4, C10). Pied « Tu as fait le tour ? » commun à A2, A4, B2 : gabarit, gardé. Liste d'exclusion A4 (l.9) : respectée, à une nuance près. La n°20 (« quarante photos de la même mer ») frôle « les 200 photos » d'A4 : même décor (trop de photos), chute différente (la mer n'a pas bougé). Vanne validée, couple contre groupe : pas de retrait, voir §5.

### SEO

| Point | État | Après correctifs |
|---|---|---|
| Title ≤ 60 car. avec la requête | PASS : 53 car., « Blagues de vacances » en tête | inchangé |
| Meta ≤ 155 car. | 145 car., sans « entre amis » ni « été » | PASS (C9, 146 car.) |
| H2 en question | 6 sur 6 (format A4 : question + parenthèse) | inchangés |
| Ancres du sommaire | PASS : 6/6 = `headingId` (recalculées, parenthèses et apostrophes comprises) | inchangées |
| « été » dans le corps | absent | présent (C1) |
| dateModified | FAIL : 2026-10-05 < 2027-06-03 | PASS (G1) |

### Partage `with-url`

Le bon mode : des vannes à raconter, pas des messages à un proche ; le lien `#vanne-N` ramène l'ami du groupe sur la vanne exacte. Les vannes sont toutes entre « » (1re alternative de `JOKE_RE`, gourmande jusqu'au dernier « » de la ligne) : le texte partagé est complet même avec les guillemets imbriqués.

## 5. Ne comptent pas contre le 10

- **Ordre des sections** (location avant route, alors que la route vient d'abord dans un séjour) : changer l'ordre déplacerait 9 vannes, sans gain de lecture démontré ; l'« En bref » annonce cet ordre.
- **« 3,40 € » (n°11) et « 3,20 euros » (n°14)** : deux graphies dans les vannes, intouchables.
- **N°20 et « les 200 photos » d'A4** : décor voisin, chute et public différents (groupe / couple) ; une justification de retrait ne serait pas assez forte.
- **« À lire ensuite » avec « Comment faire rire une fille »** (capture d-bas) : gabarit commun, voir notation B4 §5.

## 6. Points d'attention (hors note)

- Handoff du fichier B6 (l.10, points 1 et 6) toujours ouvert : volumes Search Console de « blagues de vacances » / « blagues d'été », et comparaison automatique des 20 vannes avec la base avant import.
- Relecture @copywriter des textes ajoutés contre `docs/copy/charte-refonte-copy-s11.md`, puis import. Captures avec JS à reprendre après import (boutons Partager).

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-B6-iter1.md
- Décisions prises : note globale 8,8/10 (70/80) ; 11 correctifs exacts (C1 à C11) + G1 commun (notation B4) pour 10/10, sans toucher aux 20 vannes, au slug, au title, aux H2 ni aux questions de FAQ ; parcours Confiance au lieu de Machine à Café ; partage `with-url` confirmé.
- Points d'attention : @copywriter applique C1 à C9 dans le fichier B6 puis import ; @fullstack applique C10, C11 et G1 avec ceux de B4 et B5.
---
