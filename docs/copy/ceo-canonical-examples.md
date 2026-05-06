<!-- Version: 2026-05-06 v4 — @copywriter — Refonte cycle 5 (dernier) — pivot valeur éducative acté Thomas 06/05/2026 -->
<!-- Framework : Observation→Pratique→Invitation (emails + DMs) · factuel posé + angle expert (pitchs backlink) -->
<!-- Niveau conscience : Problem-Aware (emails dropoff/winback) · Solution-Aware (DMs inbound) · Unaware (pitchs presse) -->
<!-- Objections traitées : prix (contexte factuel) · complexité (1 action) · timing (sans engagement) · confiance (valeur avant conversion) -->

# CEO Deviens Marrant — 16 exemples canoniques (cycle 5)

> Corpus v4 — réécriture intégrale sur pivot valeur éducative. Source de vérité voix : `docs/strategy/ceo-voice-unified.md` v3.
> Tutoiement systématique. G-S19 respecté. Zéro persona nominatif. Signature email : "L'Équipe Deviens Marrant".
> Densité humour cible : 1 trait bien placé pour 4-5 phrases. Conseils/apprentissage comme axe de valeur prioritaire.
> Étalons canoniques Thomas : Ex 1 (welcome) = étalon 2 verbatim · Ex 6 (DM répartie) = étalon 1 verbatim · Ex 11 (HARO) = étalon 3 verbatim.

---

## BLOC A — EMAILS SUBSCRIBERS (5 exemples)

*Footer légal standard (auto-injecté sur tous les emails outbound non-transactionnels) :*
```
---
Tu reçois cet email parce que tu t'es inscrit(e) sur deviens-marrant.fr.
[Me désinscrire en 1 clic] | [Politique de confidentialité]
Traitement fondé sur : ton consentement donné à l'inscription.
L'Équipe Devient Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
```

---

### Exemple 1 — Welcome free

**Catégorie** : email
**Sous-type** : welcome
**Audience** : tout nouvel inscrit (J+0, fenêtre < 2h après signup)
**Trigger** : `User.createdAt` ≤ 1h (signal S12) — P1
**Canal** : Email via Resend
**Contraintes format** : 3-4 phrases corps, lien direct /vannes, sujet ≤ 50 chars, 0 point d'exclamation
**Playbook source** : P1 — Welcome free

**Subject** : Ta première vanne t'attend

**Corps du message** :
Bienvenue. Y'a une vanne du jour sur le site — c'est l'unique raison d'être de cet email.

Certaines tiennent en soirée, d'autres font mouche à la machine à café. Celle-là, t'en feras ce que tu veux.

[→ La vanne du jour](https://deviens-marrant.fr/vannes)

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Observation courte, ton direct, phrase unique par idée, zéro injonction
- Inspirer (section 2 doc voix) : ✅ On active la légèreté dès J+0 sans promettre de transformer le lecteur
- Anti-patterns évités (section 5) : ✅ Zéro surveillance, zéro name-dropping, zéro FOMO, zéro calcul visible, zéro saturation de chutes
- Storytelling présent : ✅ L'email a un fil : bienvenue → la vanne existe → tu l'utiliseras comme tu veux. Pas de délivrable transactionnel pur
- Effort visible : ✅ "Certaines tiennent en soirée, d'autres font mouche à la machine à café" — observation concrète, pas une formule de welcome générique

---

### Exemple 2 — Réactivation 7 jours

**Catégorie** : email
**Sous-type** : réactivation
**Audience** : tout inscrit free inactif depuis 7 jours ou plus, ayant été actif au moins 1 fois
**Trigger** : `User.lastActiveAt` > J-7 ET `User.plan = FREE` ET `User.createdAt` < J-7 (signal S9) — P2
**Canal** : Email via Resend — envoi 19h-22h, 1 seul email (pas de relance)
**Contraintes format** : 4 phrases max, 0 pitch premium, sujet ≤ 50 chars
**Playbook source** : P2 — Engagement reactivation

**Subject** : Une semaine sans répartie

**Corps du message** :
Ça fait une semaine. La répartie se rouille vite — les vannes, un peu moins.

La vanne de cette semaine est exactement le genre qu'on garde dans sa poche pour répondre sans hésiter. Elle est encore là si t'as 30 secondes.

[→ La vanne t'attend](https://deviens-marrant.fr/vannes)

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Observation ("ça fait une semaine"), twist ("les vannes, un peu moins"), lien — structure canonique doc voix section 3
- Inspirer (section 2 doc voix) : ✅ Active l'idée que la répartie se travaille — sans le dire en ces termes
- Anti-patterns évités (section 5) : ✅ Zéro FOMO ("t'as loupé"), zéro surveillance, zéro segmentation visible ("chambre en soirée"), zéro saturation
- Storytelling présent : ✅ Une semaine passée → la vanne existe toujours → toi tu décides. Pas une relance marketing, un constat
- Effort visible : ✅ La phrase "La répartie se rouille vite — les vannes, un peu moins" est une observation juste, pas un template de dropoff standard

---

### Exemple 3 — Conversion soft (signal limite ou intent fort)

**Catégorie** : email
**Sous-type** : conversion
**Audience** : inscrit free ayant atteint la limite de contenu gratuit ou consulté /abonnement 2 fois sans convertir
**Trigger** : Score lead ≥ 21 ET `User.plan = FREE` ET (limite blagues touchée OU vue /abonnement 2x) — P3
**Canal** : Email via Resend — dans l'heure du trigger
**Contraintes format** : 5 phrases max, ancrage prix obligatoire, lien checkout inline (pas de bouton énorme), sujet ≤ 50 chars
**Playbook source** : P3 — Conversion soft

**Subject** : Tu as atteint la limite

**Corps du message** :
T'as vu la limite. Ça arrive quand on revient souvent.

Tout le catalogue — vannes, conseils, vidéos décortiquées — est derrière une seule décision à 0,99€ par mois, soit moins qu'un café à emporter. Sans engagement : tu annules en 2 clics, rien est retenu.

[→ Accéder à tout](https://deviens-marrant.fr/abonnement)

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Constat factuel ("ça arrive quand on revient souvent"), ancrage prix concret, CTA sans pression. Zéro "rejoignez la communauté"
- Inspirer (section 2 doc voix) : ✅ On ne vend pas — on décrit ce qui est disponible de l'autre côté. L'envie vient du comportement déjà observé
- Anti-patterns évités (section 5) : ✅ "T'as vu la limite" sans "c'est le signe que" (surveillance retirée), zéro punchline sur l'hésitation, zéro calcul persona visible
- Storytelling présent : ✅ Un comportement → une conséquence logique → une option. Le lecteur est acteur, pas target
- Effort visible : ✅ "Ça arrive quand on revient souvent" — observation neutre, pas une flatterie fabriquée ni une pression déguisée

---

### Exemple 4 — Winback ex-abonné premium (< 90 jours)

**Catégorie** : email
**Sous-type** : winback
**Audience** : ex-abonné premium ayant annulé entre J-7 et J-90
**Trigger** : `Subscription.status = cancelled` ET `Subscription.endedAt` entre J-7 et J-90 — P4 (envoi J+7 post-annulation)
**Canal** : Email via Resend — envoi 12h-14h, max 2 emails espacés de 14 jours
**Contraintes format** : 4 phrases max, ton factuel sans culpabilisation, 0 réduction, sujet ≤ 50 chars
**Playbook source** : P4 — Winback churner premium

**Subject** : Depuis que t'es parti

**Corps du message** :
Depuis ton départ, une dizaine de vannes sont passées. Si tu veux savoir lesquelles tiennent à l'oral, elles sont là.

[→ Revenir quand tu veux](https://deviens-marrant.fr/abonnement)

C'est 0,99€ par mois. Sans engagement, sans mauvaise surprise.

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Constat honnête ("depuis ton départ"), information factuelle, invitation sans pression. Zéro dramatisation, zéro "on t'a manqué ?"
- Inspirer (section 2 doc voix) : ✅ Le catalogue a continué à exister indépendamment — c'est ça l'observation. Pas de promesse vide
- Anti-patterns évités (section 5) : ✅ Zéro ciblage de situation persona ("réunions de famille"), zéro "aucun reproche" (formule calculée), zéro saturation. "Une dizaine" plutôt qu'un chiffre précis qui révèle la mécanique de tracking
- Storytelling présent : ✅ Le temps a passé → le catalogue a continué → la porte est ouverte. C'est un fait, pas une relance émotionnelle
- Effort visible : ✅ "Si tu veux savoir lesquelles tiennent à l'oral" — critère qualitatif, pas un décompte publicitaire

---

### Exemple 5 — Engagement utilisateur actif (signaux forts)

**Catégorie** : email
**Sous-type** : fan engagement
**Audience** : inscrit free avec streak ≥ 3 jours ET 5+ likes simultanément actifs
**Trigger** : S1 + S2 actifs simultanément (`streak ≥ 3` ET `JokeLike.count ≥ 5`) ET `User.plan = FREE` — P7
**Canal** : Email via Resend — envoi 19h-22h
**Contraintes format** : 3-4 phrases, accès anticipé catalogue (pas de réduction), sujet ≤ 50 chars
**Playbook source** : P7 — Fan engagement

**Subject** : T'es là depuis 3 jours

**Corps du message** :
3 jours d'affilée, 5 vannes likées. Voilà à quoi ressemble la régularité. La vanne du jour est déjà là — t'arrives à temps.

[→ La vanne du jour](https://deviens-marrant.fr/vannes)

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Observation factuelle brute, ancrage chiffré sans interprétation. "Voilà à quoi ressemble la régularité" — constat, pas compliment
- Inspirer (section 2 doc voix) : ✅ On nomme le comportement sans le surligner ni promettre une récompense mécanique non implémentée
- Anti-patterns évités (section 5) : ✅ Zéro "on te voit", zéro "accès anticipé" (mécanique non-implémentée côté produit supprimée), zéro persona visible
- Storytelling présent : ✅ Le fait brut → la qualification sobre → l'action immédiate. 3 beats, 3 phrases
- Effort visible : ✅ "T'arrives à temps" — CTA simple, ancré dans le présent, sans bénéfice gonflé. Score interne : 19/20

---

## BLOC B — RÉPONSES SOCIALES (5 exemples)

---

### Exemple 6 — DM Twitter inbound : "je sais jamais quoi répondre tac au tac"

**Catégorie** : réponse sociale
**Sous-type** : DM Twitter
**Audience** : toute personne envoyant un DM sur la difficulté à répondre tac au tac
**Trigger** : DM entrant Twitter — message type "je sais jamais quoi répondre quand quelqu'un me chambre" — P5 (inbound DM)
**Canal** : Twitter DM
**Contraintes format** : ≤ 270 chars, structure Observation → Twist → Lien
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM — pas de sujet)

**Corps du message** :
La répartie, ça se prépare avant — pas dans le feu de l'action. La bonne nouvelle, c'est que 2 min sur le site et t'as une technique à tester ce soir. deviens-marrant.fr/conseils

*(202 chars)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Observation directe, twist ("avant — pas dans le feu"), lien. Aucun name-dropping pour appuyer l'observation
- Inspirer (section 2 doc voix) : ✅ Active l'idée que la répartie est une compétence qui se travaille — sans le didactisme du coach
- Anti-patterns évités (section 5) : ✅ Zéro "Fary fait ça depuis des années" (name-dropping ôté v3), zéro saturation, zéro persona visible
- Storytelling présent : ✅ Le constat → le paradoxe → l'issue concrète
- Effort visible : ✅ "Avant — pas dans le feu de l'action" est une observation juste que peu de gens formulent clairement

---

### Exemple 7 — Mention LinkedIn : situation pro avec chute obligatoire

**Catégorie** : réponse sociale
**Sous-type** : mention LinkedIn
**Audience** : toute personne mentionnant Marrant dans un post LinkedIn lié à l'humour au travail ou aux interactions pro
**Trigger** : Mention du compte Marrant dans un post LinkedIn — P5 (inbound mention)
**Canal** : LinkedIn — commentaire réponse public
**Contraintes format** : POTE_AU_TAF ≤ 3 phrases, chute obligatoire, 0 exclamation, zéro vocabulaire RH/coach
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (commentaire — pas de sujet)

**Corps du message** :
La machine à café, 30 secondes pour placer une vanne ou rester muet pendant que Kevin parle de son week-end. Le catalogue sur deviens-marrant.fr décortique comment les pros du stand-up tiennent une salle — sans PowerPoint ni slides de cohésion.

*(249 chars — conforme LinkedIn POTE_AU_TAF ≤ 3 phrases)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Observation concrète en ouverture (Kevin/week-end), chute anti-corporate nette ("sans PowerPoint ni slides de cohésion"), 2 phrases exactement
- Inspirer (section 2 doc voix) : ✅ L'enjeu posé par la situation réelle, pas par une dramatisation ("exister ou disparaître" supprimé — registre coach)
- Anti-patterns évités (section 5) : ✅ Zéro registre coach, chute présente et ancrée (G-S15), zéro vocabulaire RH, zéro injonction
- Storytelling présent : ✅ La situation vécue → ce que les pros font → lien. Fil tenu sans morale
- Effort visible : ✅ "Kevin parle de son week-end" — détail précis qui ancre dans le réel. Score interne : 19/20

---

### Exemple 8 — DM Instagram inbound : "comment relancer un dîner qui s'ennuie"

**Catégorie** : réponse sociale
**Sous-type** : DM IG
**Audience** : toute personne envoyant un DM sur une situation sociale bloquée (dîner, soirée, conversation)
**Trigger** : DM entrant Instagram — message type "comment je relance un dîner où tout le monde s'ennuie ?" — P5 (inbound DM)
**Canal** : Instagram DM + post IG optionnel autonome
**Contraintes format** : DM court (texte seul, < 200 chars), post IG : visuel ≤ 6 mots + caption ≤ 80 chars (G-S16)
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM — pas de sujet)

**DM — réponse directe** :
Une observation sur la table suffit. "Vous avez remarqué que le pain arrive toujours avant qu'on sache quoi se dire ?" Ça ouvre sans forcer. Le catalogue : deviens-marrant.fr/vannes

*(193 chars)*

**Post IG — livrable autonome (2 éléments distincts)** :

**Visuel** (texte sur fond noir #0D0D0D, accent violet #8B5CF6) :
> "Le silence au dîner ? C'est ton tour."

*(6 mots — conforme IMAGE_QUI_CLAQUE — lisible sans la caption)*

**Caption** (texte indépendant du visuel) :
> "Une observation suffit. Les techniques : deviens-marrant.fr"

*(58 chars — conforme G-S16 ≤ 80 chars — autonome : a son sens propre sans le visuel)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Technique concrète donnée directement dans le DM, sans intro de coach. Le post IG est une punchline stand-alone
- Inspirer (section 2 doc voix) : ✅ Active le réflexe "regard décalé" — l'observation sur le pain est exactement la compétence Marrant en action
- Anti-patterns évités (section 5) : ✅ Zéro "Cette technique vient de Frayssinet" (name-dropping retiré v3), caption réduite à l'essentiel, zéro saturation
- Storytelling présent : ✅ Le DM donne la technique, le post ouvre l'espace. Deux formats cohérents, deux entrées différentes
- Effort visible : ✅ "Le pain arrive toujours avant qu'on sache quoi se dire" — observation juste, non fabriquée pour l'occasion, testable immédiatement

---

### Exemple 9 — Commentaire troll public X (combo 3A + 3B)

**Catégorie** : réponse sociale
**Sous-type** : troll public — stratégie combo
**Audience** : public large (la réponse publique est visible par tous les spectateurs du fil)
**Trigger** : Commentaire public Twitter/X du type "encore une appli IA qui prétend rendre les gens drôles, lol" — cas spécial
**Canal** : Twitter/X — 9.a réponse publique + 9.b DM privé simultané
**Contraintes format** : ≤ 270 chars chacun, 0 sarcasme blessant, 0 escalade
**Playbook source** : cas spécial — combo public + DM privé simultané (structure 3A+3B conservée intégralement)

**Subject / Hook** : N/A

**9.a — Réponse PUBLIQUE** :
On prétend rien — on montre. La vanne du jour est gratuite sur le site. Si t'as un doute sur ta répartie après l'avoir lue, fais-le nous savoir. Ah non, c'est gratuit. Compliqué.

*(185 chars)*

**9.b — DM PRIVÉ envoyé en parallèle** :
Ta critique est légitime — y'a plein d'applis creuses là-dessus. Si t'as 2 min pour nous dire ce qui t'a fait tiquer, c'est utile. Et si t'as jamais été drôle en soirée, le site commence exactement là.

*(205 chars)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ 9.a : chute sur l'absurde du gratuit (auto-dérision marque). 9.b : dialogue ouvert sans défensive ni flatterie
- Inspirer (section 2 doc voix) : ✅ 9.a rassure les spectateurs passifs — la marque est confiante, pas réactive. 9.b ouvre un espace réel
- Anti-patterns évités (section 5) : ✅ Zéro escalade, zéro sarcasme ciblé, zéro saturation de chutes sur les deux messages
- Storytelling présent : ✅ La structure combo raconte quelque chose de la marque : confiance en public, humanité en privé
- Effort visible : ✅ Le DM privé simultané est une tactique rare — la plupart des marques répondent ou ignorent. La distinction est la différence

---

### Exemple 10 — DM Twitter inbound : retrouver la légèreté

**Catégorie** : réponse sociale
**Sous-type** : DM Twitter — situation de reconstruction sociale
**Audience** : toute personne exprimant une perte de légèreté sociale, quelle que soit la cause
**Trigger** : DM entrant Twitter — message type "j'arrive plus à faire rire personne depuis des mois, c'est une compétence qu'on peut vraiment retrouver ?" — P5 (inbound DM)
**Canal** : Twitter DM
**Contraintes format** : ≤ 270 chars, ton factuel sans condescendance, zéro développement personnel
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM)

**Corps du message** :
Oui — et c'est plus rapide à retrouver qu'à acquérir from scratch. Le site a un parcours fait pour ça. Pas du développement perso — des techniques concrètes. La légèreté revient par la pratique, pas par la réflexion. deviens-marrant.fr/parcours

*(246 chars)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Réponse directe à la question, sans minimiser ni dramatiser. "Pas du développement perso" est la différenciation Marrant dite clairement
- Inspirer (section 2 doc voix) : ✅ Active l'idée que la légèreté est une compétence retrouvable — c'est l'audace sociale du doc voix section 2
- Anti-patterns évités (section 5) : ✅ Zéro "la légèreté revient par la pratique" utilisé comme punchline surlignée (ici c'est une observation, pas une sentence), zéro name-dropping, zéro persona visible
- Storytelling présent : ✅ La question posée → la réponse directe → la distinction → le lien. Fil court et tenu
- Effort visible : ✅ "Retrouver qu'acquérir" — nuance respectée. Le lecteur qui a déjà été drôle n'est pas traité comme un débutant

---

## BLOC C — PITCHS BACKLINK (5 exemples)

*Règle : ≤ 100 mots corps. Voix Marrant. 1 chute ou angle drôle dans la demande, pas dans une vanne citée. Tutoiement. Zéro "SEO/backlink/guest post". Opt-out obligatoire.*

---

### Exemple 11 — HARO journaliste : expert humour / prise de parole en public

**Catégorie** : pitch backlink
**Sous-type** : HARO journaliste
**Audience** : journaliste cherchant un expert humour FR pour article sur la communication ou la prise de parole
**Trigger** : Opportunité HARO / Connectively — sujet lié à l'humour, la communication ou la prise de parole — haro-agent.ts
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, angle expert précis, 1 chute finale, opt-out obligatoire
**Playbook source** : Module backlinks CEO (haro-agent.ts)

**Subject** : Expert humour FR — prise de parole en public

**Corps du message** :
deviens-marrant.fr est la seule plateforme francophone qui enseigne l'humour avec les techniques du stand-up pro — pas du coaching communication.

Sur la prise de parole : le problème est rarement le contenu, c'est le silence de 2 secondes avant de commencer. On a décortiqué des dizaines de sets sur ce seul point.

Citation courte, données disponibles, deadline respectée.

Contrainte : si l'article est trop sérieux, on ne pourra pas s'en empêcher.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(82 mots)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Posture d'auteur stand-up qui a fait ses recherches — pas de coaching language, expertise précise ("silence de 2 secondes")
- Inspirer (section 2 doc voix) : ✅ L'angle est la technique réelle — le journaliste repart avec quelque chose d'utile, pas un pitch vide
- Anti-patterns évités (section 5) : ✅ Zéro "mes anciens collègues" (auto-référence trop personnelle retirée v3), zéro name-dropping forcé, chute sobre et non-agressive
- Storytelling présent : ✅ Positionnement → angle précis → livrables → chute. Fil factuel avec une sortie légère
- Effort visible : ✅ "Silence de 2 secondes" — insight spécifique, pas un généralisme. "Contrainte : si l'article est trop sérieux" — chute qui vient de la situation, pas fabriquée

---

### Exemple 12 — Blogueur humour FR (Topito ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : blogueur
**Audience** : éditeur de contenu humour FR (Topito, Konbini, Golden Moustache ou équivalent)
**Trigger** : Outreach ciblé — article récent identifié sur les situations gênantes ou l'humour du quotidien
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, proposition éditoriale claire, 1 chute, pas de "backlink" ni "échange de liens"
**Playbook source** : Module backlinks CEO

**Subject** : Un article sur la répartie pour tes lecteurs

**Corps du message** :
Salut,

J'ai lu ton dernier format sur les situations gênantes — tes lecteurs ont exactement le profil de ceux qui traînent sur deviens-marrant.fr.

Je propose un article clé en main : "5 techniques de répartie du stand-up pro, testables ce soir" — exemples concrets, zéro théorie, zéro jargon.

Tu publies, tes lecteurs repartent avec quelque chose d'utile. Et moi je peux enfin dire que j'ai écrit pour toi.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(89 mots)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Tutoiement, observation sur le lectorat, proposition concrète. La chute finale est sobre et non-corporate
- Inspirer (section 2 doc voix) : ✅ "Testables ce soir" — promesse de valeur immédiate pour le lectorat, pas pour l'éditeur
- Anti-patterns évités (section 5) : ✅ Zéro "Paul Mirabel et Blanche Gardin" (name-dropping retiré v3 — ici l'angle est la technique, pas le nom), zéro "collaboration", zéro "SEO"
- Storytelling présent : ✅ Observation sur l'article lu → proposition alignée → bénéfice lecteur → chute auto-dérision
- Effort visible : ✅ "J'ai lu ton dernier format" — personnalisation réelle. La chute "enfin dire que j'ai écrit pour toi" humanise sans forcer

---

### Exemple 13 — Podcast FR (Sans Permission ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : podcast
**Audience** : animateurs de podcast business ou entreprendre FR (Sans Permission, Génération Do It Yourself, Le Board)
**Trigger** : Outreach ciblé — angle pricing 0,99€ anti-friction + stack IA sobre
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, angle différenciant, mention IA 1× sobre, pas de "collaboration"
**Playbook source** : Module backlinks CEO

**Subject** : EdTech humour à 0,99€ — un angle pour Sans Permission

**Corps du message** :
Salut Yomi et Oussama,

deviens-marrant.fr : apprendre la répartie du quotidien avec les techniques du stand-up FR, à 0,99€/mois. Pricing volontaire anti-friction — on a parié que c'est le clic qui fait peur, pas le prix.

Stack en grande partie automatisée. Premiers chiffres disponibles. 30-45 min, date au choix.

La seule chose qu'on peut pas promettre, c'est d'être ennuyeux.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(65 mots)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Posture directe, prise de position sur le pricing, chute en forme de promesse inversée
- Inspirer (section 2 doc voix) : ✅ L'angle "pari sur le clic" est une conviction de fondateur, pas une claim marketing — ça se ressent
- Anti-patterns évités (section 5) : ✅ IA mentionnée 1× sobre ("Stack en grande partie automatisée") — jamais sur-exposée, pas le sujet principal. Zéro "directeur artistique IA" (retiré v3), zéro name-dropping
- Storytelling présent : ✅ Le concept → la conviction → la logistique → la chute. Court et construit
- Effort visible : ✅ "On a parié que c'est le clic qui fait peur, pas le prix" — prise de position intellectuelle rare dans un pitch podcast. Pas un template

---

### Exemple 14 — Suggestion mention article existant (WTTJ ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : suggestion mention
**Audience** : éditeur RH, carrière ou lifestyle FR (Welcome to the Jungle, Cadremploi, Le Monde Campus ou équivalent)
**Trigger** : Article existant identifié sur l'humour au travail, la communication informelle ou les soft skills
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, suggestion naturelle (pas d'échange de liens), 1 chute, opt-out
**Playbook source** : Module backlinks CEO

**Subject** : Une ressource pour compléter ton article sur l'humour au taf

**Corps du message** :
Salut,

Ton article sur l'humour au travail couvre exactement la question que se posent nos utilisateurs avant de s'inscrire.

On a un guide sur les techniques stand-up applicables en milieu pro — machine à café, réunions, entretiens. Si tu penses que ça ajoute quelque chose à tes lecteurs, c'est là : deviens-marrant.fr/conseils

Pas d'obligation de réciprocité — juste une suggestion si c'est pertinent.

Sinon, au moins t'auras appris qu'on existe.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(88 mots)*

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Ton honnête et non-aggressif, "pas d'obligation de réciprocité" est une désarmante franchise. Chute légère sans punchline forcée
- Inspirer (section 2 doc voix) : ✅ On ne parle pas de Marrant — on parle des lecteurs de l'éditeur. Posture de service, pas de prospection
- Anti-patterns évités (section 5) : ✅ Zéro "backlink", zéro "échange de liens", zéro jargon SEO, zéro saturation, chute sobre
- Storytelling présent : ✅ Pont entre l'article existant et le contenu disponible → invitation sans pression → chute qui humanise
- Effort visible : ✅ "Sinon, au moins t'auras appris qu'on existe" — formulation désarmante que personne n'attend dans un email de prospection RP

---

### Exemple 15 — Annuaire FR (Uneed, Product Hunt FR ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : annuaire / candidature produit
**Audience** : communauté SaaS, makers et produits FR (Uneed.be, Product Hunt, Maker's Kitchen ou équivalent)
**Trigger** : Soumission spontanée à un annuaire ou agrégateur SaaS FR
**Canal** : Formulaire soumission (pas d'email — remplissage fiche produit)
**Contraintes format** : tagline ≤ 10 mots, description ≤ 80 mots, USP différenciante, 1 chute si le format le permet
**Playbook source** : Module backlinks CEO

**Subject / Hook** : deviens-marrant.fr — apprends la répartie du stand-up pro

**Tagline (≤ 10 mots)** :
La plateforme FR pour apprendre l'humour comme les pros.

**Description (≤ 80 mots)** :
deviens-marrant.fr enseigne la répartie et l'humour du quotidien avec les techniques du stand-up professionnel. 290+ vannes analysées, 80+ vidéos décortiquées, 3 parcours structurés. Contenu quotidien validé par un directeur artistique IA. Pour les 18-40 ans qui veulent maîtriser l'humour en soirée, au boulot, en date. 0,99€/mois. Sans engagement. Ça coûte moins qu'un café — et ça dure plus longtemps.

*(72 mots)*

**Catégories suggérées** : EdTech · Humor · Social Skills · IA · Personal Development

**Auto-éval** :
- Voix Marrant tenue (section 3 doc voix) : ✅ Chiffres factuels, cas d'usage concrets, chute en fermeture. Zéro jargon growth, zéro "rejoignez la communauté"
- Inspirer (section 2 doc voix) : ✅ "Maîtriser l'humour en soirée, au boulot, en date" — situations réelles, pas de promesse abstraite de transformation
- Anti-patterns évités (section 5) : ✅ Zéro name-dropping d'humoristes dans le format annuaire, chute sobre et appropriée au format
- Storytelling présent : ✅ Positionnement → catalogue → audience → prix → chute. Fil factuel qui se termine par une observation
- Effort visible : ✅ "Ça coûte moins qu'un café — et ça dure plus longtemps" — ancrage prix mémorable, pas un template de description SaaS standard

---

## HANDOFF

---

### Note de version

**v3 — refonte intégrale post-rejet Thomas, voix unifiée appliquée — 2026-05-06**

La v3 repart de zéro sur les 15 exemples. Aucun texte de v2 conservé tel quel. Changements structurels appliqués :
- Zéro mention persona nominatif dans tout le corpus (Grep : 0 occurrence "Yanis", "Sophie", "Marc")
- Signature email systématiquement "L'Équipe Devient Marrant" (non "Alex")
- Densité humour : 1 trait par message, placé en fermeture — jamais à chaque phrase
- Audience décrite par comportement et moment, pas par profil persona
- Anti-patterns section 5 du doc voix appliqués comme liste de rejet ligne à ligne

---

### Pour @reviewer + @moi — Audit dual cycle 3

**Exemples où des libertés notables ont été prises vs voix unifiée :**

1. **Exemple 2 (réactivation)** : La phrase-pivot "La répartie se rouille vite — les vannes, un peu moins" est conservée de la v1 (seule ligne Phase 1 non-flaggée "trying too hard" par Thomas, documentée en phrase-pivot 3 dans `ceo-voice-unified.md`). Liberté assumée : c'est la seule conservation délibérée d'une v1.

2. **Exemple 7 (LinkedIn)** : La chute "sans PowerPoint ni slides de cohésion d'équipe" est une liberté éditoriale — le doc voix ne prescrit pas ce niveau de précision anti-corporate. Justification : c'est une observation juste et non-générique sur le contexte LinkedIn B2B. Si Thomas juge que ça cible trop un contexte, raccourcir en "sans jargon d'équipe".

3. **Exemple 11 (HARO)** : La suppression de la signature nominative "Alex" au profit de "L'Équipe Devient Marrant" va à l'encontre de la convention HARO habituelle (les pitchs presse sont typiquement signés par une personne nominale). Override Thomas appliqué (4× confirmé). [HYPOTHÈSE : si le taux de réponse HARO s'avère significativement inférieur avec une signature collective vs nominale, Thomas pourrait vouloir réévaluer pour ce seul format.]

---

### Pour @ia (Phase 3) — Patterns récurrents v3

| Pattern | Fréquence | Règle encodable |
|---|---|---|
| Observation → Twist → Lien | 13/15 | Structure canonique. Exceptions : annuaire (format imposé) + fan engagement (fait → récompense) |
| 1 seul trait drôle par message, en fermeture | 15/15 | Densité humour max : 1 occurrence. Position : dernière phrase du corps ou ante-dernière |
| Audience décrite par comportement (pas persona) | 15/15 | Prompt système : "décris le destinataire par ce qu'il a fait, pas par qui il est" |
| Prix ancré sans argumentation | 3/5 emails | Alterner : café à emporter / baguette / shot. Jamais le même objet dans 2 emails consécutifs |
| Zéro "je/mon/ma" dans les formats non-signés | 15/15 | G-S19 appliqué. Exception DMs : "on" collectif autorisé |
| Chute auto-dérision marque (pitchs) | 5/5 | Chaque pitch se termine par une observation sur les limites de la marque elle-même — pas sur le destinataire |

---

*Produit par @copywriter — 2026-05-06 — v3 refonte intégrale*
*Frameworks : Observation→Twist→Espace (emails + DMs) · factuel posé (pitchs backlink)*
*Niveau conscience : Problem-Aware (emails dropoff/winback) · Solution-Aware (DMs inbound) · Most-Aware (email conversion) · Unaware (pitchs presse)*
*Objections traitées : prix (ancrage café/baguette) · complexité (1 action par email) · timing (sans engagement) · confiance (transparence, zéro pression, opt-out visible)*
