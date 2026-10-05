# Notation : /blog/voeux-drole-nouvelle-annee (A2, itération 1, 05/10/2026)

> Revue @reviewer. Base : brouillon `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (version finale, 27 messages), gabarit à HEAD (`blog/[slug]/page.tsx`, `components/ui/markdown-renderer.tsx`, `components/blog/blog-vanne-share.tsx`, `components/ui/share-button.tsx`, `components/blog/article-cta.tsx`, `config/blog-cta.ts`, `config/blog-tracking.ts`, `lib/blog-faq.ts`, `lib/seo-meta.ts`), étalon `meilleures-blagues-droles-2026` (`blog-articles.ts` l.1370 et suivantes, notation iter4), S11 et S13 (`docs/copy/articles-q4/`).
> Grille de 8 critères identique à `notation-article-blagues-2026-iter1.md`.
> Intouchables : le texte des 27 messages, zéro tiret cadratin, zéro humoriste, zéro promesse fausse, « 1 500+ » (absent de l'article, non ajouté).
> Limites : article non importé, donc pas de rendu ni de capture (à faire après le dry-run d'import). Tests non exécutés. Pas de git (consigne).

## 1. Grille et notes

| # | Critère | Note | Justification (1 ligne) |
|---|---|---|---|
| 1 | Réponse immédiate à l'intention | **8/10** | Sommaire en 4e bloc (après environ 155 mots, dont une phrase de l'intro qui répète l'En bref), 1er message après environ 400 mots, et « nouvelle année » absent de l'En bref et de l'intro. |
| 2 | Sorties vers une 2e page | **9/10** | Couverture comparable à l'étalon, mais le lien vers `phrases-droles-conversations` est placé dans l'intro de la section WhatsApp, avant les messages 20 à 24 : il fait sortir le lecteur avant le contenu. |
| 3 | CTA d'inscription | **6/10** | A2 n'a pas d'entrée dans `config/blog-cta.ts` : CTA par défaut, en bas de page après la FAQ, le cluster, les cartes et l'encart parcours, et avec un titre (« Maintenant, reste à le dire à voix haute ») qui ne colle pas à un message écrit. Même défaut que l'étalon à l'itération 1. |
| 4 | Lisibilité mobile et structure | **8/10** | L'usage n°1 (envoyer le message) n'a aucun bouton : A2 n'est pas dans `SHARE_JOKES_SLUGS`, et même ajouté, `JOKE_RE` exige « … », absents des 27 messages. Sur mobile, un appui long sélectionne aussi le « 1. » en gras. |
| 5 | Ton Marrant des textes ajoutés | **8/10** | La règle « deux phrases » (En bref, intro, À retenir) est contredite par 26 messages sur 27 : seule la n°1 tient en deux phrases, et les n°3, 14, 18, 19, 21, 22, 24 et 25 en comptent 4 ou 5. « Le rire tombe sur toi » est répété 7 fois. On lit « C'est ce qui rend le message à toi » (tournure fautive), la n°3 répète mot pour mot la règle 3, la n°6 se contredit, et on parle de « timing avant l'envoi » pour un texte écrit. |
| 6 | Conformité | **9/10** | Zéro tiret cadratin (Grep : 0), zéro humoriste, durées des parcours et quiz conformes au [CHOIX UTILISATEUR] du 29/09, « jusqu'à fin janvier » vérifié. Seul écart : l'indication de la n°10 l'envoie à « la direction » en carte formelle alors que la chute vise le destinataire, ce qui contredit la promesse du H2 (« qui ne vexent personne »). |
| 7 | Sécurité SEO | **9/10** | Title de 53 car. avec la requête (rendu en `absolute`, le suffixe ferait 74), meta de 144 car. (champ `metaDescription`, ≤ 155), 7 H2 en question, FAQ compatible `splitTrailingFaq`, ancres du sommaire conformes à `headingId`, pas de cannibalisation. Écart : la requête n'apparaît ni dans l'En bref ni dans l'intro (« nouvelle année » n'y figure pas). |
| 8 | Mesure | **9/10** | Le slug est dans `TRACKED_ARTICLES`. Scroll, sorties, ancres et `src=blog-<slug>` sont gérés par le gabarit. Il manque le signal de valeur propre à A2 (`blog-vanne-partage`) : aucun emplacement de partage n'est rendu. |

**Note globale : 8,3/10** (66/80).
**Après les 11 correctifs ci-dessous : 10/10 sur les 8 critères.**

Les correctifs ne touchent ni le texte des 27 messages, ni le slug, le title, la meta ou les 7 H2 et les 4 questions de la FAQ. Aucun pop-up.

## 2. Top 3 (impact le plus fort)

1. **D10 (CTA dédié)** : c'est le critère le plus bas (6/10). Une entrée de config de 6 lignes remonte le CTA juste après le corps et lui donne un texte qui parle d'un message écrit.
2. **D11 (Envoyer le message, texte seul)** : c'est l'usage réel du persona. Pour un vœu au patron, le bouton Partager actuel ajouterait l'URL de deviens-marrant.fr au message, ce qui grille l'expéditeur. Il faut un envoi du texte seul.
3. **D1 + D2 (intro)** : la requête doit apparaître dans la première phrase, le sommaire doit suivre l'En bref, et la règle « deux phrases » doit cesser d'être démentie par les messages eux-mêmes.

## 3. Correctifs exacts

Fichier article : `docs/copy/articles-forte-frappe/A2-voeux-drole-nouvelle-annee.md` (les numéros de ligne sont ceux du brouillon ; le même texte part dans `content` à l'import).

### D1. En bref : requête dans la 1re phrase, règle des « deux phrases » corrigée (critères 1, 5, 7)

**Avant** (l.32) :
```md
> **En bref :** Un vœu drôle tient en deux phrases et se règle sur le destinataire : le rire tombe sur toi ou sur la situation, jamais sur la personne qui reçoit le message. Voici des messages à copier, classés par destinataire (collègues, patron ou client, famille, groupe WhatsApp, ex), chacun avec le moment et le ton pour l'envoyer.
```
**Après** :
```md
> **En bref :** Un vœu drôle de nouvelle année tient en quelques lignes et se règle sur le destinataire : le rire tombe sur toi ou sur la situation, jamais sur la personne qui reçoit le message. Voici des messages à copier, classés par destinataire (collègues, patron ou client, famille, groupe WhatsApp, ex), chacun avec le moment et le ton pour l'envoyer.
```
Pourquoi : « nouvelle année » est absent des 4 premiers blocs, alors que c'est le cœur de la requête. « Deux phrases » est démenti par 26 messages sur 27 (seule la n°1 en a deux ; la n°24 en a cinq). Les messages sont intouchables, c'est donc la règle qu'on corrige. « Quelques lignes » reste vrai pour les 27.

### D2. Sommaire juste après l'En bref, intro sans doublon (critères 1 et 5)

**Avant** (l.34 à l.38, trois blocs dans cet ordre) :
```md
Chaque fin d'année, ton téléphone reçoit les mêmes phrases : « bonne année, bonne santé », avec un feu d'artifice en pièce jointe. Tu les renvoies, parce qu'à minuit personne n'a le temps d'en inventer d'autres.

Un vœu drôle coûte à peine plus cher à écrire : deux phrases et une chute, et il sort de la pile. Encore faut-il qu'il tombe juste, parce que le texte qui fait rire ton groupe d'amis ne s'envoie pas à ton patron. Voici des messages classés par destinataire, prêts à copier, avec pour chacun une indication pour l'envoyer au bon moment.

Va direct à ton destinataire : [Collègues](#quel-message-drole-envoyer-a-tes-collegues) · [...] · [Ex](#que-dire-a-ton-ex-pour-la-nouvelle-annee-sans-rouvrir-le-dossier). Une fois les vœux envoyés, la [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation.
```
**Après** (le bloc « Va direct » remonte, inchangé, juste sous l'En bref ; les 2 paragraphes suivent) :
```md
Va direct à ton destinataire : [Collègues](#quel-message-drole-envoyer-a-tes-collegues) · [...] · [Ex](#que-dire-a-ton-ex-pour-la-nouvelle-annee-sans-rouvrir-le-dossier). Une fois les vœux envoyés, la [blague du jour](/blague-du-jour) change chaque jour, et le [catalogue de vannes](/vannes) range le reste par situation.

Chaque fin d'année, ton téléphone reçoit les mêmes phrases : « bonne année, bonne santé », avec un feu d'artifice en pièce jointe. Tu les renvoies, parce qu'à minuit personne n'a le temps d'en inventer d'autres.

Un vœu drôle coûte à peine plus cher à écrire : quelques lignes et une chute, et il sort de la pile. Encore faut-il qu'il tombe juste, parce que le texte qui fait rire ton groupe d'amis ne s'envoie pas à ton patron.
```
Pourquoi : l'En bref annonce les destinataires, le sommaire les donne en lien, c'est la suite logique. Il tombe alors après environ 60 mots, contre environ 155 aujourd'hui (le même seuil que l'étalon après son C1). La dernière phrase du 2e paragraphe, supprimée ici, répétait l'En bref presque mot pour mot (« classés par destinataire, prêts à copier », « le moment »). « Deux phrases » devient « quelques lignes » (voir D1). Les 5 ancres ne changent pas : elles sont vérifiées contre `headingId` (`œ` devient `oe`, les accents tombent).

### D3. Bloc « À retenir » supprimé (critères 1 et 5)

**Avant** (l.50, et la ligne vide qui le précède) :
```md
> **À retenir :** Un vœu drôle se joue en deux phrases : le vœu, puis une chute qui retombe sur toi. Adapte-le au destinataire, et si tu hésites, supprime la chute et garde le vœu.
```
**Après** : rien (la liste en 3 points est directement suivie du `---`).
Pourquoi : chacune de ses trois idées est déjà dite ailleurs : « deux phrases » (fausse, voir D1), « retombe sur toi » (En bref et règle 1) et « supprime la chute » (intro patron, l.85). L'idée « le rire tombe sur toi » revient 7 fois dans la page. Pour la reprise par les moteurs IA, l'En bref suffit (il joue le rôle du bloc Définition de l'étalon). Le 1er message arrive ainsi environ 40 mots plus tôt.

### D4. Règle 3 : tournure fautive (critère 5)

**Avant** (l.48) :
```md
3. **Un détail vrai vaut mieux qu'une formule.** Remplace un mot par quelque chose qui n'appartient qu'à vous (la galette, le plat, le nom du groupe). C'est ce qui rend le message à toi.
```
**Après** :
```md
3. **Un détail vrai vaut mieux qu'une formule.** Remplace un mot par quelque chose qui n'appartient qu'à vous (la galette, le plat, le nom du groupe). C'est ce qui en fait ton message.
```
Pourquoi : « rendre le message à toi » veut dire « te le restituer ». Ce n'est pas le sens voulu.

### D5. Indication de la n°3 : plus de reprise mot pour mot de la règle 3 (critère 5)

**Avant** (l.65) :
```md
*→ Pour le collègue du bureau d'à côté, en message direct. Remplace « fauteuil » par l'objet qui te lâche vraiment : un détail vrai fait rire plus qu'une formule.*
```
**Après** :
```md
*→ Pour le collègue du bureau d'à côté, en message direct. Remplace « fauteuil » par l'objet qui te lâche vraiment, et garde « un peu plus bas » pour la fin.*
```
Pourquoi : « un détail vrai fait rire plus qu'une formule » répète la règle 3, lue 17 lignes plus haut. La nouvelle consigne est propre à ce message : la chute reste en dernier, même si on change l'objet.

### D6. Indication de la n°6 : le moment contredisait la chute (critère 5)

**Avant** (l.74) :
```md
*→ Pour le premier jour de reprise, à l'équipe ou à voix haute au retour de congés. Envoie-le tôt dans la matinée, avant que les premiers dossiers n'arrivent.*
```
**Après** :
```md
*→ Pour le premier jour de reprise, à l'équipe ou à voix haute au retour de congés. Envoie-le en fin de matinée, quand tu as vraiment fait le tour des bureaux.*
```
Pourquoi : le message dit « J'ai déjà souhaité la bonne année trois fois à la même personne ce matin ». Envoyé « tôt », avant d'avoir croisé qui que ce soit, la chute est fausse. Les n°11, 22 et 23 posent la même condition de vérité.

### D7. Indication de la n°10 : la chute vise le destinataire, on la sort de la carte à la direction (critère 6)

**Avant** (l.94) :
```md
*→ Pour une carte ou un mail formel à la direction, au vouvoiement. Garde l'ouverture classique et glisse la phrase juste avant la signature. Remplace « mars » par le mois de son dernier mot.*
```
**Après** :
```md
*→ Pour ton manager direct, s'il plaisante déjà de ses réponses en deux lettres. Ici, la chute le vise un peu : à une direction que tu connais peu, prends plutôt la n°8 ou la n°9. Remplace « mars » par le mois de son dernier mot.*
```
Pourquoi : « J'ai gardé votre "OK" de mars. C'est mon entretien annuel. » se moque du laconisme du destinataire. C'est la seule entorse à la règle 1 (« jamais sur le destinataire »), et l'indication actuelle l'envoie au destinataire le plus risqué, en carte formelle. L'article promettait des « vœux drôles qui ne vexent personne ». La nouvelle indication garde le message et la promesse : elle nomme l'exception et oriente vers les n°8 et 9, qui portent sur l'expéditeur.

### D8. Section WhatsApp : la sortie passe après les messages (critère 2)

**Avant** (l.137, fin du paragraphe d'intro) :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger. Pour la suite de la conversation, [les phrases drôles pour une conversation](/blog/phrases-droles-conversations) prennent le relais.
```
**Après** :
```md
À minuit, le groupe reçoit beaucoup de messages identiques : le tien doit faire sourire en une ligne. Pour un ami perdu de vue, c'est l'inverse : un message privé, une fois par an, qui donne envie de répondre sans y obliger.
```
**Avant** (l.154) :
```md
Pour la soirée qui précède le message : [les vannes de soirée](/vannes/theme/soirees).
```
**Après** :
```md
S'il répond, la suite se joue ici : [les phrases drôles pour une conversation](/blog/phrases-droles-conversations). Et pour la soirée qui précède le message : [les vannes de soirée](/vannes/theme/soirees).
```
Pourquoi : la sortie la plus attirante de la section était placée avant les 5 messages et ouvrait une 2e page sans qu'ils aient été lus. En fin de section, elle répond au besoin suivant (« il m'a répondu, je dis quoi ? »), comme les sorties de l'étalon. Les cibles et le libellé du lien ne changent pas.

### D9. Fin d'article : « timing avant l'envoi » (critère 5)

**Avant** (l.203) :
```md
→ **[Nos conseils d'humour](/conseils)** : de quoi améliorer ton timing avant l'envoi.
```
**Après** :
```md
→ **[Nos conseils d'humour](/conseils)** : pour écrire tes propres chutes l'an prochain.
```
Pourquoi : un message écrit n'a pas de timing de diction. L'idée « l'an prochain, c'est toi qui écris » prépare le CTA de D10 sans promettre plus que ce que `/conseils` contient (des techniques, en libre accès).
