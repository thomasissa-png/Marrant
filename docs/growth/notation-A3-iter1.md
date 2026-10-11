# Notation : /blog/premier-message-drole-appli-de-rencontre (A3, itération 1, 05/10/2026)

> Revue @reviewer. Base : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md` (FINAL du 05/10, numéros de ligne de ce fichier), gabarit à HEAD (`blog/[slug]/page.tsx`, `markdown-renderer.tsx`, `lib/blog-faq.ts`, `lib/blog-clusters.ts`, `config/blog-cta.ts`, `components/blog/article-cta.tsx`, `components/blog/blog-article-parcours-maillage.tsx`, `config/premium.ts`, `lib/seo-meta.ts`), étalon `meilleures-blagues-droles-2026` et notations iter1 et iter4.
> Grille : les 8 critères de `notation-article-blagues-2026-iter1.md`, repris tels quels.
> Intouchables : texte des 17 messages validés à l'aveugle et des 3 vannes du catalogue, zéro tiret cadratin, zéro humoriste ni marque d'appli, aucune promesse fausse, « 1 500+ membres ».
> Limites : article pas encore importé, donc aucun rendu réel ni capture ; rendu déduit du code du renderer. Tests non exécutés, pas de git.

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | L'« En bref » répond tout de suite, mais le sommaire n'arrive qu'au 6e bloc (environ 270 mots, 3e écran mobile), après un paragraphe qui envoie vers 4 autres articles avant le moindre exemple. |
| 2 | Sorties vers une 2e page | **7/10** | L'encart parcours automatique sera Machine à Café (bureau, 15 min) sur un article de drague par écrit ; `/vannes/theme/dating` est lié 3 fois, Confiance 2 fois dans le corps, la blague du jour 2 fois avec la même promesse, et le lien « soirées » de la l.146 ne mène pas à la suite d'une conversation. |
| 3 | CTA d'inscription | **6/10** | Slug absent de `config/blog-cta.ts` : CTA par défaut placé après la FAQ, les cartes et l'encart parcours (environ 4 écrans après le corps), avec le titre « Maintenant, reste à le dire à voix haute » sur un article consacré à l'écrit. |
| 4 | Lisibilité mobile et structure | **9/10** | Bonne structure (situation en gras, message, indication en italique), mais 5 messages imbriquent des « » dans des « » : la n°13 commence par « « Plus tard », et la n°2 finit par « ». » ; le lecteur croit que le message s'arrête trop tôt. |
| 5 | Ton Marrant des textes affichés | **8/10** | Voix juste et tutoiement tenu, mais « et le tien ? » (l.62) n'a pas de référent clair, « Pour une réponse facile, termine par » revient 2 fois (l.62, l.88), « ont leur étagère » 2 fois (l.104, l.178), « 20 minutes par semaine » 2 fois dans la même phrase (l.178), et la l.191 recopie mot pour mot la réponse de la FAQ 2 (l.231). |
| 6 | Conformité | **9/10** | Zéro tiret cadratin, zéro humoriste, zéro marque, durées vraies (`premium.ts` l.66-67 : 20 min/semaine). Deux écarts de respect : la règle 2 (« jamais sur ce qu'elle a écrit », l.46) contredit la section bio, et la situation 14 fait dire « Aucune excuse nécessaire » à quelqu'un qui ne s'est peut-être pas excusé, ce qui sonne comme un reproche. |
| 7 | Sécurité SEO | **10/10** | Title de 54 caractères contenant la requête exacte, meta de 154 caractères, 6 H2 sur 6 en question, intention servie dans l'« En bref », FAQ extraite par `splitTrailingFaq` (dernière H2, aucune syntaxe markdown dans les réponses) donc rendue avec son JSON-LD FAQPage, 4 ancres du sommaire identiques à `headingId`, aucune cannibalisation (§4). |
| 8 | Mesure | **10/10** | `BlogArticleTracking` commun (scroll en 4 paliers, sortie et ancre séparées, CTA marqué, `?src=blog-<slug>`), slug déjà dans `config/blog-tracking.ts` l.11 (rapport hebdomadaire). |

**Note globale : 8,4/10** (67/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

## 2. Top 3 (impact le plus fort)

1. **C6 (CTA)** : critère le plus bas. Une entrée dans `config/blog-cta.ts` place le CTA juste après le corps, avec une promesse qui parle d'écrire et non de parler à voix haute.
2. **C2 (encart parcours)** : l'encart Machine à Café (« Sois drôle au bureau », 15 min) sous un article de drague par écrit est la sortie la plus visible et la plus mal ciblée. Confiance est le parcours que l'article cite.
3. **C1 (sommaire en 2e bloc)** : le lecteur qui arrive avec « quoi écrire » doit voir sa situation dans le premier ou le deuxième écran, pas après des liens vers d'autres articles.

## 3. Correctifs exacts

Fichier article (sauf mention contraire) : `docs/copy/articles-forte-frappe/A3-premier-message-appli-rencontre.md`, à corriger AVANT l'import en base.

### C1. Sommaire juste sous l'« En bref », paragraphe de périmètre après les règles (critère 1)

Aucun mot ne change : seuls deux paragraphes changent de place.

**Avant** (ordre des blocs, l.32 à l.52) : En bref (l.32) · « Tu as ouvert la conversation… » (l.34) · vanne catalogue IA (l.36) · « Un premier message drôle n'est pas un numéro de scène… » (l.38) · « Cet article traite d'un seul cas… Ici, on reste sur l'écran. » (l.40) · « Va direct à ta situation… » (l.42) · les quatre règles (l.44-48) · « Un test avant d'envoyer… » (l.50) · `---` (l.52).

**Après** : En bref (l.32) · **« Va direct à ta situation… » (ancienne l.42)** · « Tu as ouvert la conversation… » (l.34) · vanne catalogue IA (l.36) · « Un premier message drôle n'est pas un numéro de scène… » (l.38) · les quatre règles (l.44-48) · « Un test avant d'envoyer… » (l.50) · **« Cet article traite d'un seul cas… Ici, on reste sur l'écran. » (ancienne l.40)** · `---`.

Pourquoi : l'« En bref » donne la méthode, le sommaire en est la suite logique et passe d'environ 270 à 75 mots (fin du 1er écran mobile, comme l'étalon après son C1). Le paragraphe de périmètre envoie vers 4 articles : placé avant le premier exemple, il fait sortir le lecteur avant qu'il ait reçu quoi que ce soit ; placé après les règles, il garde son rôle anti-cannibalisation et sa dernière phrase (« Ici, on reste sur l'écran. ») devient la transition vers la première section.

### C2. Encart parcours : Confiance au lieu de Machine à Café (critère 2)

Fichier : `apps/web/src/components/blog/blog-article-parcours-maillage.tsx`. A3 est en `CATALOGUE`, donc rattaché par défaut au cluster `fort-volume` (`blog-clusters.ts` l.89), qui affiche Machine à Café (l.115-126 : « Des blagues toutes faites à ta propre voix », « 15 min/semaine »).

**Avant** (l.141) :
```ts
const DEFAULT_HINT = PARCOURS_BY_CLUSTER["techniques-repartie"];
```
**Après** :
```ts
const DEFAULT_HINT = PARCOURS_BY_CLUSTER["techniques-repartie"];

/**
 * Encart choisi par slug, prioritaire sur le cluster, quand le sujet de l'article
 * ne correspond pas au parcours de son cluster. A3 (premier message sur appli) est
 * en CATALOGUE (cluster fort-volume, Machine à Café) mais parle d'oser écrire et
 * d'accepter un silence : parcours Confiance.
 */
const PARCOURS_BY_SLUG: Record<string, ParcoursHint> = {
  "premier-message-drole-appli-de-rencontre": PARCOURS_BY_CLUSTER["douleurs-personas"],
};
```
**Avant** (l.151) :
```ts
  const hint = (cluster && PARCOURS_BY_CLUSTER[cluster.id]) || DEFAULT_HINT;
```
**Après** :
```ts
  const hint = PARCOURS_BY_SLUG[articleSlug] ?? ((cluster && PARCOURS_BY_CLUSTER[cluster.id]) || DEFAULT_HINT);
```
Pourquoi : « Reprends confiance, une conversation à la fois » est exactement la promesse de l'article (oser envoyer, relancer une fois, accepter un silence). Le texte de l'encart Confiance existe déjà et sert ailleurs : aucune nouvelle copie. Aucun autre article ne change de parcours (un seul slug dans la table). Le gabarit `page.tsx` et le renderer ne sont pas touchés.

### C3. Sortie de fin de section « animal » : vers la conversation, pas vers les soirées (critères 2 et 5)

**Avant** (l.146) :
```md
Pour la suite de la conversation, [les vannes de soirées](/vannes/theme/soirees) rangent des lignes pour lancer un échange sans forcer.
```
**Après** :
```md
Pour garder le ton une fois l'échange lancé, [les phrases drôles pour la conversation](/blog/phrases-droles-conversations) prennent le relais, par message comme en face.
```
Pourquoi : le thème Soirées porte sur la fête, pas sur un échange écrit à deux. `phrases-droles-conversations` contient les sections « Phrases drôles pour un date » (`blog-articles.ts` l.1235) et « par WhatsApp et SMS » (l.1278) : c'est la suite exacte. Soirées reste lié dans la liste de fin (l.211).

### C4. Paragraphe de sortie de la section relance : 2 liens au lieu de 3, sans répétition (critères 2 et 5)

**Avant** (l.178) :
```md
Pour d'autres lignes sur le silence après « on se rappelle », [les vannes de dating](/vannes/theme/dating) ont leur étagère. Pour répondre du tac au tac sans y penser trois heures, le [parcours Répartie](/parcours/repartie) demande 20 minutes par semaine. Relancer une fois puis lâcher prise, accepter un silence sans le prendre pour un verdict : ça s'entraîne aussi, avec le [parcours Confiance](/parcours/confiance), 20 minutes par semaine.
```
**Après** :
```md
Pour répondre du tac au tac sans y penser trois heures, le [parcours Répartie](/parcours/repartie) demande 20 minutes par semaine. Relancer une fois puis lâcher prise, accepter un silence sans le prendre pour un verdict : ça s'entraîne aussi, au même rythme, avec le [parcours Confiance](/parcours/confiance).
```
Pourquoi : `/vannes/theme/dating` est déjà lié l.76 et l.208 (3e occurrence retirée) ; « ont leur étagère » est déjà employé l.104 ; « 20 minutes par semaine » apparaissait 2 fois dans la même phrase. Durée vraie (`premium.ts` l.66-67).

### C5. Bloc de fin : une seule promesse « blague du jour », pas de doublon avec les cartes et l'encart (critère 2)

**Avant** (l.205) :
```md
**Tu as fait le tour ?** Une nouvelle vanne arrive chaque jour : [la blague du jour](/blague-du-jour), avec sa chute et son décryptage.
```
**Après** :
```md
**Tu as fait le tour ?** [La blague du jour](/blague-du-jour) t'en garde une neuve pour demain, avec sa chute et son décryptage.
```
**Avant** (l.217 et l.221, avec la ligne vide qui précède chacune) :
```md
→ **[Phrases drôles pour la conversation](/blog/phrases-droles-conversations)** : de quoi continuer l'échange par WhatsApp ou SMS.

→ **[Le parcours Confiance](/parcours/confiance)** : 20 minutes par semaine pour oser écrire le premier message.
```
**Après** : les deux lignes sont supprimées (et leurs lignes vides). Le bloc de fin garde la blague du jour, les 4 thèmes, le quiz, l'étalon (l.215) et conseils/vidéos (l.219).

Pourquoi : l.42 dit déjà « qui change chaque jour » ; la nouvelle phrase dit autre chose (« pour demain »). `phrases-droles-conversations` est désormais lié au bon endroit (C3) et fait partie des cartes « À lire ensuite » du cluster `fort-volume`. Confiance est lié l.178 (C4) et devient l'encart parcours (C2) : une 3e mention serait de trop. Le nombre de pages liées reste 17.

### C6. CTA dédié : juste après le corps, promesse tournée vers l'écrit (critère 3)

Fichier : `apps/web/src/config/blog-cta.ts`. Une entrée dans la table suffit : `page.tsx` l.183 et l.267 placent alors le CTA juste après le corps, avant la FAQ et le maillage, comme pour l'étalon.

**Avant** (l.22-23) :
```ts
  },
};
```
**Après** :
```ts
  },
  // Notation A3 iter1 (C6) : lecteur venu chercher quoi écrire sur une appli, pas un programme.
  "premier-message-drole-appli-de-rencontre": {
    title: "Ton premier message est prêt. La suite s'entraîne.",
    text: "Le compte gratuit t'ouvre ton contenu quotidien et la première étape de chaque parcours, dont Confiance et Répartie : de quoi oser envoyer, puis tenir la conversation qui suit.",
    primaryLabel: "Créer mon compte gratuit",
    note: "Gratuit, sans carte. Les messages de cette page restent en accès libre, compte ou pas.",
  },
};
```
Pourquoi : le titre par défaut (« Maintenant, reste à le dire à voix haute », `article-cta.tsx` l.25) parle d'oral à un lecteur venu pour un message écrit, et le CTA par défaut arrive après FAQ, cartes et encart. Promesses vraies : « ton contenu quotidien et la première étape de chaque parcours » est la formulation du [CHOIX UTILISATEUR] du 04/10 déjà en ligne sur l'étalon ; l'article ne bloque rien, donc « en accès libre » est vrai. Bouton Premium inchangé (non surchargeable). À relire par @copywriter contre la charte s11. Vérifier que `blog-article-cta-position.test.tsx` n'énumère pas les clés de la table.

### C7. Guillemets imbriqués : 2e niveau en “…”, convention de l'étalon (critère 4)

Les mots des 5 messages ne changent pas : seuls les guillemets intérieurs passent de « » à des guillemets droits, que `frenchQuotes` (`markdown-renderer.tsx` l.108-114) rend en “…” quand ils sont déjà entre « ». C'est la façon dont l'étalon stocke sa n°24 (`blog-articles.ts` l.1466 : `« Le "on se fait un truc ce week-end ?" des applis… »`), rendue « Le “on se fait un truc ce week-end ?” … » (iter4, capture m03).

| Ligne | Avant | Après |
|---|---|---|
| l.66 | `« Ma dernière blague en réunion a reçu un « merci pour l'info ». »` | `« Ma dernière blague en réunion a reçu un "merci pour l'info". »` |
| l.72 | `« Le hachis parmentier. J'avais écrit « soupe », puis j'ai effacé : ça fait trop « je me couche à vingt et une heures ». Je me couche à vingt et une heures. »` | `« Le hachis parmentier. J'avais écrit "soupe", puis j'ai effacé : ça fait trop "je me couche à vingt et une heures". Je me couche à vingt et une heures. »` |
| l.124 | `« Je n'ai pas de chien, mais j'ai déjà dit « assis » à un inconnu dans le tram, par réflexe. Il s'est assis. »` | `« Je n'ai pas de chien, mais j'ai déjà dit "assis" à un inconnu dans le tram, par réflexe. Il s'est assis. »` |
| l.162 | `« Ce week-end, j'aide un ami à déménager. On m'a confié le carton « fragile ». Il contient un coussin. On me connaît. »` | `« Ce week-end, j'aide un ami à déménager. On m'a confié le carton "fragile". Il contient un coussin. On me connaît. »` |
| l.168 | `« « Plus tard », j'ai dit ça à ma vaisselle il y a une semaine. Prends ton temps. »` | `« "Plus tard", j'ai dit ça à ma vaisselle il y a une semaine. Prends ton temps. »` |

Rendu vérifié sur le code : nombre de guillemets droits pair dans chaque bloc, aucun guillemet ambigu, chaque paire précédée d'un « non fermé, donc rendue “…” (ex. l.168 : « “Plus tard”, j'ai dit ça… »).
**Décision Thomas requise** : ce correctif touche des caractères des messages validés, pas leurs mots. Si les guillemets comptent comme texte intouchable, variante sans aucun caractère modifié : retirer seulement les guillemets extérieurs de présentation des 17 messages et du n°9, et les passer en citation `>` comme les deux vannes du catalogue (l.36, l.201), par exemple l.168 → `> « Plus tard », j'ai dit ça à ma vaisselle il y a une semaine. Prends ton temps.` Plus lourde visuellement (20 encadrés colorés) ; je recommande la première.

### C8. Indications d'usage : un référent clair et une formule non répétée (critère 5)

**Avant** (l.62) :
```md
*→ Écris-le comme un constat, sans smiley pour prévenir qu'on peut rire. Si la phrase est bonne, elle n'en a pas besoin. Pour une réponse facile, termine par « et le tien ? ».*
```
**Après** :
```md
*→ Écris-le comme un constat, sans smiley pour prévenir qu'on peut rire. Si la phrase est bonne, elle n'en a pas besoin. Termine par une question sur sa cuisine, par exemple « qu'est-ce qui sort de ta cuisine ce dimanche ? ».*
```
**Avant** (l.88) :
```md
*→ Parle du sentier, pas de la personne. Pour une réponse facile, termine par une question sur la montée.*
```
**Après** :
```md
*→ Parle du sentier, pas de la personne. Pour qu'on puisse te répondre en une ligne, termine par une question sur la montée.*
```
Pourquoi : après « Le dimanche, tout est fermé… Les invités ont été très polis. », « et le tien ? » ne renvoie à rien (ton dimanche ? ton citron ?). Le second remplacement reprend la règle 3 (« répondre en une ligne ») au lieu de répéter la formule de la l.62.

### C9. Fin de la section copié-collé : ne pas recopier la FAQ (critère 5)

**Avant** (l.191) :
```md
Et si tu n'as pas envie de faire de l'humour ce jour-là, une phrase simple et chaleureuse vaut mieux qu'une blague forcée.
```
**Après** :
```md
Et si tu n'as pas envie de faire de l'humour ce jour-là, n'en fais pas : un message simple qui montre que tu as lu son profil fait très bien l'affaire.
```
Pourquoi : la FAQ 2 (l.231) dit mot pour mot « une phrase simple et chaleureuse vaut mieux qu'une blague forcée », 40 lignes plus bas. La FAQ garde sa formulation (elle alimente le JSON-LD) ; le corps dit la même idée autrement et la relie à la règle 1.

### C10. Règle 2 : ne pas interdire ce que la section bio recommande (critère 6, respect)

**Avant** (l.46) :
```md
> 2. **Le rire tombe sur toi ou sur la situation de l'appli.** Jamais sur la personne, jamais sur son physique, jamais sur ce qu'elle a écrit.
```
**Après** :
```md
> 2. **Le rire tombe sur toi ou sur la situation de l'appli.** Jamais sur la personne, jamais sur son physique, jamais aux dépens de ce qu'elle a écrit.
```
Pourquoi : la section bio demande de répondre à ce que la personne a écrit, et la n°13 reprend son « plus tard ». « Jamais sur ce qu'elle a écrit » se lit comme « n'en parle pas » ; l'interdit réel est de s'en moquer. La l.56 (« ne te moque jamais de ce qui est écrit ») dit déjà la même chose : la règle s'aligne dessus.

### C11. Situation 14 : « Aucune excuse nécessaire » seulement si la personne s'est excusée (critère 6, respect)

**Avant** (l.172) :
```md
**14. La conversation reprend après un long silence de la personne.**
```
**Après** :
```md
**14. La personne revient après un long silence et s'excuse du retard.**
```
Pourquoi : le message (intouchable) commence par « Aucune excuse nécessaire ». Envoyé à quelqu'un qui revient sans s'excuser, il souligne qu'une excuse était due : c'est le reproche que l'indication l.176 interdit (« Aucun reproche, même drôle »). Avec la nouvelle situation, la ligne devient une manière élégante de lever la gêne, et l'indication reste vraie.

### Récapitulatif

| # | Critère(s) | Fichier | Lignes | Test à prévoir |
|---|---|---|---|---|
| C1 | 1 | A3 .md | l.40 et l.42 déplacées | aucun |
| C2 | 2 | blog-article-parcours-maillage.tsx | l.141, l.151 | rendu de l'encart pour le slug A3 = Confiance |
| C3 | 2, 5 | A3 .md | l.146 | aucun |
| C4 | 2, 5 | A3 .md | l.178 | aucun |
| C5 | 2 | A3 .md | l.205, l.217, l.221 | aucun |
| C6 | 3 | config/blog-cta.ts | l.22-23 | vérifier blog-article-cta-position.test.tsx |
| C7 | 4 | A3 .md | l.66, 72, 124, 162, 168 | après import : rendu sans « « |
| C8 | 5 | A3 .md | l.62, l.88 | aucun |
| C9 | 5 | A3 .md | l.191 | aucun |
| C10 | 6 | A3 .md | l.46 | aucun |
| C11 | 6 | A3 .md | l.172 | aucun |

Mesure du diff réel attendue (P0 s11) : 2 paragraphes déplacés, 9 lignes de contenu modifiées, 2 supprimées, sur environ 200 lignes de contenu ; 0 mot des 20 messages changé (C7 : 10 guillemets) ; 2 fichiers de code (environ 12 lignes). Ne pas l'annoncer comme une réécriture. Code : pre-commit `npx tsc --noEmit -p tsconfig.build.json && npx next lint && npm run build`, déploiement noté dans `REPLIT_ACTIONS.md`. Après C3 et C5, mettre à jour la ligne « liens internes » de l'en-tête du fichier A3 (toujours 17 pages).

Notes projetées après application : 1 = 10, 2 = 10, 3 = 10, 4 = 10, 5 = 10, 6 = 10, 7 = 10, 8 = 10.

## 4. Vérifications demandées

**SEO** (PASS)
- Title : « Premier message drôle appli de rencontre : quoi écrire » = 54 caractères (≤ 60), requête exacte en tête. Avec le suffixe ` | deviens-marrant.fr` (20 car.), 74 > 60 : `fitTitle` (`seo-meta.ts` l.52) sert le titre seul, sans troncature.
- Meta : 154 caractères (≤ 155), contient « premiers messages drôles » et « appli de rencontre », promesse tenue (bio, voyage, animal, relance, rien sur le physique).
- H2 : 6 sur 6 en question ; « ## FAQ » est sortie du corps par `splitTrailingFaq` et rendue « Questions fréquentes » avec FAQPage (conditions du parseur remplies : dernière H2, aucun texte avant la 1re question, aucune syntaxe markdown dans les 4 réponses).
- Intention : l'« En bref » (l.32) donne la recette en 2 phrases ; C1 rapproche le sommaire.

**Respect** (PASS après C10 et C11)
- Aucun message sur le physique, le corps, l'âge, le métier ou le revenu : les 20 lignes visent l'expéditeur ou la situation. Garde-fous écrits aux bons endroits (l.82, l.96, l.110, l.126, l.144, FAQ 4).
- Rien d'insistant : relance unique, interdite si aucune réponse au premier message (l.154, FAQ 3), « un silence reste une réponse ».
- Lourdeur : aucune ligne graveleuse ni sous-entendu. Seul point à surveiller, la n°4 (« J'ai agrandi ta photo… ») : voir §6.

**Cannibalisation** (PASS)
- `comment-faire-rire-une-fille` et `comment-faire-rire-un-homme` : H2 par technique orale (autodérision, observation, chambrage, timing ; `blog-articles.ts` l.1601-1778), aucune section appli ni premier message. A3 les cite comme suite « en face à face » (l.40, l.197) : partage propre de l'intention.
- `se-presenter-avec-humour` (S2) : oral en groupe, « jamais la bio de site de rencontre » (`S2-se-presenter-avec-humour.md` l.20). A3 ne traite pas l'écriture de sa propre bio. Pas de recouvrement.
- Voisinage non demandé mais vérifié : `phrases-droles-conversations` a une section date (l.1235) et SMS (l.1278) sans angle « premier message » ; l'étalon a 5 lignes dating, aucune reprise.

**Intouchables** : les 17 messages sont identiques à `A3-candidates.md` et `A3-candidates-vague2.md` (contrôle ligne à ligne sur H2-13, H3-5, H10-4, H12-7, H16-14, H18-8) ; les 3 vannes ont des id présents dans `catalogue-final-ids.txt` ; zéro tiret cadratin, zéro humoriste, zéro marque d'appli (Grep vide) ; « 1 500+ » absent, non ajouté.

## 5. Ne comptent pas contre le 10

- **H1 un peu raide** (« … drôle appli de rencontre… », sans « sur une ») : choix de correspondance exacte avec la requête ; « sur une » ferait 62 caractères. À revoir seulement avec des données Search Console.
- **Les quatre règles** sont dans une citation : le renderer les affiche en lignes avec leur numéro en texte, pas en liste `<ol>`. Lisible, même rendu que l'« En bref ».
- **A3 hors de `BLOG_CLUSTERS`** : pas de carte Suivant/Précédent. L'ajouter dans `fort-volume` changerait les cartes « À lire ensuite » de l'étalon (10/10) et un test de `blog-article-cta-position.test.tsx` (l.94) : à décider après publication.
- **Bouton Partager** : non pertinent ici, l'article demande justement de ne pas copier-coller (l.184-189).

## 6. Décisions pour Thomas

- **C7** : guillemets intérieurs droits (recommandé, mots inchangés) ou variante en citations `>` sans aucun caractère modifié.
- **Message n°4** (« J'ai agrandi ta photo pour repérer le sentier… ») : la chute vise le sentier et l'indication l.88 cadre bien, mais « agrandir ta photo » peut se lire comme un examen de la personne par quelqu'un qui ne la connaît pas. Défaut proposé : le garder (validé à l'aveugle) ; le retirer si tu as le moindre doute, la section voyage garde alors 3 lignes.
- **Prérequis de publication** : `/blog/se-presenter-avec-humour` (S2, prévu le 12/10) doit être en ligne avant le 03/12, sinon le lien l.40 mène à une 404.

---
**Handoff → @orchestrator**
- Fichiers produits : /home/user/Marrant/docs/growth/notation-A3-iter1.md
- Décisions prises : note globale 8,4/10 (67/80) ; 11 correctifs exacts (C1 à C11) qui mènent à 10/10 sans toucher aux mots des 20 messages, au slug, au title, à la meta ni aux H2 ; C7 soumis à la décision de Thomas (guillemets).
- Points d'attention : @copywriter applique C1, C3 à C5 et C7 à C11 au fichier A3 avant import, et relit le texte du CTA C6 ; @fullstack applique C2 et C6 (2 fichiers de config/composant) avec pre-commit et `REPLIT_ACTIONS.md` ; après import à blanc, captures 375/768/1280 à prendre et à lire avant publication (aucun rendu réel vu ici) ; vérifier la mise en ligne de S2 avant le 03/12.
---
