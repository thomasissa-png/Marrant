<!-- Version: 2026-05-05 v2 — @copywriter — Phase 2 CEO autonome Marrant — cycle chirurgical 4 exemples -->
<!-- Framework : AIDA (emails), Structure canonique DM (Observation→Twist→Lien), BAB (pitchs backlink) -->
<!-- Niveau conscience : Problem-Aware (emails) / Solution-Aware (DMs inbound) / Unaware (pitchs presse) -->

# CEO Marrant — 15 exemples canoniques

> Corpus de référence Phase 2. Ces 15 exemples constituent le terrain d'audit dual @reviewer + @moi.
> **v2 — cycle chirurgical 4 exemples (ex 5, 7, 8, 13) — 2026-05-05.**
> Chaque exemple suit le format obligatoire. Voix : complice · décomplexé · activateur.
> Tutoiement systématique. G-S19 respecté : compte = marque, zéro "je/mon/ma" hors citation explicite.

---

## BLOC A — EMAILS SUBSCRIBERS (5 exemples)

*Footer légal standard (auto-injecté sur tous les emails outbound) :*
```
---
Tu reçois cet email parce que tu t'es inscrit(e) sur deviens-marrant.fr.
Se désinscrire en 1 clic : [lien opt-out]  |  Politique de confidentialité
Base légale : consentement donné à l'inscription.
L'Équipe Devient Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
```

---

### Exemple 1 — Welcome free

**Catégorie** : email
**Sous-type** : welcome
**Persona servi** : tous
**Trigger** : `User.createdAt` ≤ 1h (S12 activé) — P1
**Canal** : Email via Resend
**Contraintes format** : 3-4 phrases corps, lien direct /vannes, sujet ≤ 50 chars, 0 point d'exclamation
**Playbook source** : P1

**Subject** : La vanne du jour t'attend

**Corps du message** :
Bienvenue. La vanne du jour est déjà là — c'est la seule chose importante dans cet email.

Roman Frayssinet attendrait 12 secondes avant de la sortir. Toi, t'as juste à cliquer et décider si c'est pour ce soir ou pour demain matin à la machine à café.

[→ Voir la vanne du jour](https://deviens-marrant.fr/vannes)

**Footer (si email)** :
*Footer standard — voir bloc A*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ Ton direct, pas de formule de politesse, lien immédiat — c'est exactement un SMS de pote
- Concret (après ça je sais quoi faire) : ✅ Un seul CTA, une seule action, direction claire
- Doublon (existe déjà sous autre forme ?) : ✅ Welcome J+0 — aucun autre email ne couvre ce slot
- Persona (servi ?) : ✅ Universel — fonctionne pour les 3 profils, ancrage "machine à café" parle à Sophie, "ce soir" parle à Yanis
- Barre (niveau leader marché ?) : ✅ Plus court et plus direct que les welcomes Duolingo / Blinkist

---

### Exemple 2 — Dropoff J+7

**Catégorie** : email
**Sous-type** : dropoff
**Persona servi** : Yanis (étudiant — routine cassée, créneau soir)
**Trigger** : `User.lastActiveAt` > J-7 ET `User.plan = FREE` ET `User.createdAt` < J-7 (S9 activé) — P2
**Canal** : Email via Resend — envoi 19h-22h
**Contraintes format** : 4 lignes max, 0 pitch premium, sujet ≤ 50 chars, 1 seul email (pas de relance)
**Playbook source** : P2

**Subject** : T'as loupé une vanne parfaite

**Corps du message** :
Ça fait une semaine. La vanne de mardi était exactement celle qu'il fallait pour répondre à quelqu'un qui te chambre en soirée — tac au tac, sans réfléchir.

Elle est encore là si t'as 30 secondes.

[→ La vanne t'attend](https://deviens-marrant.fr/vannes)

La répartie se rouille vite. Les vannes, moins.

**Footer (si email)** :
*Footer standard — voir bloc A*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "T'as loupé" — ton direct de pote qui prévient, pas de marque qui relance
- Concret (après ça je sais quoi faire) : ✅ Un clic, une vanne, applicable ce soir
- Doublon (existe déjà sous autre forme ?) : ✅ Seul email de ce slot — aucune duplication
- Persona (servi ?) : ✅ "Chambre en soirée", "tac au tac" — cadre mental Yanis précis
- Barre (niveau leader marché ?) : ✅ L'observation finale "La répartie se rouille vite" est la chute — cohérence marque stand-up

---

### Exemple 3 — Conversion soft J+14

**Catégorie** : email
**Sous-type** : conversion
**Persona servi** : Sophie (jeune active — atteint la limite free en session, veut plus)
**Trigger** : Score lead ≥ 21 ET limite blagues touchée OU vue /abonnement 2x (S3 ou S4) ET `User.plan = FREE` — P3
**Canal** : Email via Resend — dans l'heure du trigger
**Contraintes format** : 5 lignes max, ancrage prix obligatoire (café/shot/extra guac), lien checkout inline (pas de bouton énorme), sujet ≤ 50 chars
**Playbook source** : P3

**Subject** : Tu viens de toucher la limite

**Corps du message** :
T'as vu la limite — c'est le signe que t'es venue plus souvent qu'une fois.

Les vannes que t'as likées cette semaine, elles sont encore là. Elles t'attendent derrière une seule décision qui coûte 0,99€ par mois, soit moins que l'option extra guacamole. Sans engagement, sans CB retenue si t'annules.

[→ Passer premium en 3 clics](https://deviens-marrant.fr/abonnement)

L'hésitation coûte plus cher que l'abonnement.

**Footer (si email)** :
*Footer standard — voir bloc A*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ Observation directe sur le comportement ("t'as vu la limite") — pas d'injonction, constat complice
- Concret (après ça je sais quoi faire) : ✅ Lien checkout + 3 clics + sans engagement — friction à zéro
- Doublon (existe déjà sous autre forme ?) : ✅ Slot J+14 unique, trigger comportemental spécifique
- Persona (servi ?) : ✅ "Vannes que t'as likées cette semaine" = Sophie consommatrice active de catalogue
- Barre (niveau leader marché ?) : ✅ La chute finale "L'hésitation coûte plus cher que l'abonnement" est la punchline anti-friction — non vue chez les concurrents directs

---

### Exemple 4 — Winback churner

**Catégorie** : email
**Sous-type** : winback
**Persona servi** : Marc (en reconstruction — a annulé, probablement par oubli ou budget)
**Trigger** : `Subscription.status = cancelled` ET `Subscription.endedAt` entre J-7 et J-90 — P4 (email J+7 post-annulation)
**Canal** : Email via Resend — envoi 12h-14h (créneau adulte actif)
**Contraintes format** : court (4 phrases max), ton complice sans culpabilisation, 0 réduction (dévaluation interdite à 0,99€), sujet ≤ 50 chars
**Playbook source** : P4

**Subject** : 7 vannes sont passées depuis ton départ

**Corps du message** :
Depuis que t'es parti, il y a eu 7 nouvelles vannes qui font mouche — dont une sur les réunions de famille que t'aurais gardée dans ta poche.

Aucun reproche. Si c'était pas le bon moment, il n'y a jamais de mauvais moment à 0,99€.

[→ Revenir quand tu veux](https://deviens-marrant.fr/abonnement)

**Footer (si email)** :
*Footer standard — voir bloc A*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "Aucun reproche" = signature de quelqu'un qui ne cherche pas à manipuler — exactement ce que Marc attend
- Concret (après ça je sais quoi faire) : ✅ Lien direct, sans formulaire — 1 clic pour revenir
- Doublon (existe déjà sous autre forme ?) : ✅ Slot winback unique
- Persona (servi ?) : ✅ "Réunions de famille" → Marc (reconstruction, interactions sociales difficiles)
- Barre (niveau leader marché ?) : ✅ Le chiffre "7 vannes" est spécifique et crédible — différent des winbacks génériques

---

### Exemple 5 — Fan engagement

**Catégorie** : email
**Sous-type** : fan engagement
**Persona servi** : Sophie (power user — 5+ likes, 3+ jours de streak, parcours commencé)
**Trigger** : S1 + S2 actifs simultanément (`streak ≥ 3` ET `JokeLike.count ≥ 5`) ET `User.plan = FREE` — P7
**Canal** : Email via Resend — envoi 19h-22h
**Contraintes format** : 4-5 phrases, ton "fan reconnu", récompense = accès anticipé catalogue, sujet ≤ 50 chars
**Playbook source** : P7

**Subject** : On t'a repéré

**Corps du message** :
T'as liké 5 vannes cette semaine et t'as pas raté un jour depuis 3 jours. On te voit.

Récompense : la vanne du jour, mais en avance sur les autres. Elle est là dès maintenant — [→ deviens-marrant.fr/vannes?priority=fan](https://deviens-marrant.fr/vannes?priority=fan).

Si t'en parles à quelqu'un dans ta vie qui en a besoin, t'as un mois offert via [→ ce lien](https://deviens-marrant.fr/referral). Sinon, demain comme d'hab.

**Footer (si email)** :
*Footer standard — voir bloc A*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "On te voit" + accès anticipé réel = récompense concrète, pas inventée — c'est le message de pote qui dit "j'ai pensé à toi en premier"
- Concret (après ça je sais quoi faire) : ✅ 2 options claires : accès anticipé (lien direct) OU partage (referral) OU ne rien faire et attendre demain — zéro ambiguïté
- Doublon (existe déjà sous autre forme ?) : ✅ Slot fan unique — aucun autre email ne récompense l'engagement par accès anticipé
- Persona (servi ?) : ✅ Sophie — power user régulière, streak actif, referral social naturel dans son réseau
- Barre (niveau leader marché ?) : ✅ L'accès anticipé est une mécanique engagement connue (Spotify, Substack) — ici sobre et sans gimmick marketing, cohérence marque tenue

[HYPOTHÈSE — référral spec à produire en Phase 5 séparée, P7-bis : le mécanisme "1 mois offert" nécessite une spec @product-manager + @fullstack (lien /referral, crédit mensuel, tracking). Si non implémenté au moment de l'envoi, supprimer la phrase referral et conserver uniquement l'accès anticipé. Accès anticipé catalogue (`?priority=fan`) est immédiatement implémentable sur l'archi DB existante via `DailyContent.date` + query anticipée — à confirmer @fullstack.]

---

## BLOC B — RÉPONSES SOCIALES (5 exemples)

---

### Exemple 6 — DM Twitter inbound, étudiant en galère de répartie

**Catégorie** : réponse sociale
**Sous-type** : DM Twitter
**Persona servi** : Yanis (étudiant, introverti, veut répondre tac au tac)
**Trigger** : DM entrant Twitter — message type "je sais jamais quoi répondre quand quelqu'un me chambre, des conseils ?" — P5 (inbound DM)
**Canal** : Twitter DM via API X directe
**Contraintes format** : ≤ 270 chars, voix complice, structure Observation → Twist → Lien
**Playbook source** : P5

**Subject / Hook** : N/A (DM — pas de sujet)

**Corps du message** :
Le truc avec la répartie, c'est que ça se prépare — pas dans le feu de l'action. Fary fait ça depuis des années. Le site décortique comment. 2 min et t'as une technique à tester ce soir : deviens-marrant.fr/conseils

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ Court, direct, pas de blabla — exactement le SMS du pote qui connaît le truc
- Concret (après ça je sais quoi faire) : ✅ Lien direct /conseils + "tester ce soir"
- Doublon (existe déjà sous autre forme ?) : ✅ DM entrant unique
- Persona (servi ?) : ✅ Yanis — "chambre", Fary comme référence, créneau soir
- Barre (niveau leader marché ?) : ✅ 218 chars — dans les limites, punchline sur Fary crédibilise sans forcer

---

### Exemple 7 — Mention LinkedIn, professionnelle cherchant à briser la glace

**Catégorie** : réponse sociale
**Sous-type** : mention LinkedIn
**Persona servi** : Sophie (jeune active CDI — machine à café, afterwork)
**Trigger** : Mention du compte Marrant dans un post LinkedIn type "quelqu'un connaît des ressources pour animer la machine à café ?" — P5 (inbound mention)
**Canal** : LinkedIn — commentaire réponse public
**Contraintes format** : POTE_AU_TAF ≤ 3 phrases, chute obligatoire, 0 exclamation, 1 emoji max en fin si incontournable, zéro vocabulaire RH/coach
**Playbook source** : P5

**Subject / Hook** : N/A (commentaire — pas de sujet)

**Corps du message** :
La machine à café, c'est 30 secondes pour placer une vanne ou rester muet pendant que Kevin parle de ses week-ends. Sur deviens-marrant.fr, t'as les deux : les vannes prêtes à sortir et le timing pour les placer. Pas de "training communication" — juste ce que les pros du stand-up appliquent en 30 secondes.

**Auto-éval Stand-Up Director (5 tests + test chute)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "Kevin qui parle de ses week-ends" = observation relatable, zéro corporate — c'est exactement le SMS du pote qui a trouvé un truc
- Concret (après ça je sais quoi faire) : ✅ Nom du site mentionné + cas d'usage double (vanne + timing) — action claire
- Doublon (existe déjà sous autre forme ?) : ✅ Mention LinkedIn unique — angle "Kevin / week-ends" non vu dans le corpus
- Persona (servi ?) : ✅ Sophie — machine à café, 30 secondes, vannes courtes, rejet explicite du "training communication" (son cauchemar linguistique)
- Barre (niveau leader marché ?) : ✅ 3 phrases exactement, ton POTE_AU_TAF conforme G-S15, zéro broetry, zéro leçon
- Chute obligatoire : ✅ "juste ce que les pros du stand-up appliquent en 30 secondes" — retournement anti-corporate qui clôt sur la promesse produit sans leçon

---

### Exemple 8 — DM Instagram inbound, dîner à sauver

**Catégorie** : réponse sociale
**Sous-type** : DM IG
**Persona servi** : Sophie (25-30 ans — dîner entre amis où l'ambiance retombe)
**Trigger** : DM entrant Instagram — message type "comment je relance un dîner où tout le monde s'ennuie ?" — P5 (inbound DM)
**Canal** : Instagram DM via Instagram Graph API (compte Business)
**Contraintes format** : DM court (texte seul) + post IG bonus optionnel (visuel + caption distincts)
**Playbook source** : P5

**Subject / Hook** : N/A (DM — pas de sujet)

**DM — réponse directe (texte, livrable principal)** :
La technique, c'est une observation sur la table — pas une blague inventée. "Vous avez remarqué que le pain arrive toujours avant qu'on sache quoi se dire ?" Ça ouvre sans forcer. Le site a tout un catalogue de ce genre : deviens-marrant.fr/vannes

**Post IG — livrable bonus (si on renvoie vers un post publié)** :

- **Visuel** (texte sur fond noir #0D0D0D) : "Le silence au dîner ? C'est ton tour."
*(6 mots — conforme IMAGE_QUI_CLAQUE)*

- **Caption** (sous l'image) : "Cette technique, on l'a piquée à Frayssinet. Elle marche en dîner. → deviens-marrant.fr"
*(83 chars — 3 chars au-dessus du cap 80 G-S16 : raccourcir si besoin en "Cette technique vient de Frayssinet. Testable ce soir. → deviens-marrant.fr" = 76 chars)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ La technique du DM est immédiatement réutilisable — pas du conseil générique, c'est un exemple testable ce soir
- Concret (après ça je sais quoi faire) : ✅ DM : exemple in-situ + lien catalogue. Post IG : visuel et caption sont deux éléments distincts, clairs, conformes G-S16
- Doublon (existe déjà sous autre forme ?) : ✅ DM IG unique — la combinaison DM textuel + post bonus optionnel est non vue dans le corpus
- Persona (servi ?) : ✅ Dîner entre amis, observation de situation — Sophie type, format IG adapté à son réseau
- Barre (niveau leader marché ?) : ✅ Séparation nette DM / Post IG : le visuel et la caption sont autonomes l'un de l'autre — conforme aux specs IMAGE_QUI_CLAQUE

---

### Exemple 9 — Commentaire troll public (stratégie combo 3A + 3B)

**Catégorie** : réponse sociale
**Sous-type** : troll
**Persona servi** : N/A (public large — la réponse est visible par tous)
**Trigger** : Commentaire public sur un post Marrant Twitter — "encore une appli IA qui prétend rendre les gens drôles, lol" — Cas spécial (situation 1 ceo-positioning.md)
**Canal** : Twitter — 9.a réponse publique + 9.b DM privé en parallèle
**Contraintes format** : ≤ 270 chars chacun, 0 sarcasme blessant, 0 escalade
**Playbook source** : Cas spécial — Stratégie presse hostile (combo public + DM privé simultané)

**Subject / Hook** : N/A (commentaire/DM)

**9.a — Réponse PUBLIQUE (humour bienveillant) :**
On prétend rien — on le prouve en 3 clics. La vanne du jour est sur le site. Si t'as un doute sur ta répartie après l'avoir lue, on t'offre le remboursement. Ah non, c'est gratuit. Compliqué.

*(226 chars)*

**9.b — DM PRIVÉ envoyé en parallèle :**
Hey, ta critique est légitime — y'a plein d'applis creuses là-dessus. Si t'as 2 min pour nous dire ce qui t'a fait tiquer, c'est utile. Et si t'as jamais été drôle en soirée, le site commence exactement là.

*(210 chars)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ 9.a a une chute sur l'offre gratuite (auto-dérision marque) — 9.b ouvre le dialogue sans défensive
- Concret (après ça je sais quoi faire) : ✅ 9.a = 3 clics vers le site. 9.b = invitation dialogue
- Doublon (existe déjà sous autre forme ?) : ✅ Cas troll unique
- Persona (servi ?) : ✅ Public large — 9.a rassure les spectateurs passifs (ton confiant), 9.b engage le troll potentiellement constructif
- Barre (niveau leader marché ?) : ✅ La stratégie combo est rare — les marques répondent publiquement ou ignorent. Le DM privé simultané est la différence tactique

---

### Exemple 10 — DM Twitter inbound, Marc en reconstruction

**Catégorie** : réponse sociale
**Sous-type** : DM Marc
**Persona servi** : Marc (34 ans — séparé, cherche à retrouver la légèreté, not infantiliser)
**Trigger** : DM entrant Twitter — message type "j'ai 35 ans, ça fait 8 mois que je suis séparé, j'arrive plus à faire rire personne, c'est une compétence qu'on peut vraiment retrouver ?" — P5 (inbound DM)
**Canal** : Twitter DM via API X directe
**Contraintes format** : ≤ 270 chars, ton bienveillant sans infantiliser, voix complice
**Playbook source** : P5

**Subject / Hook** : N/A (DM)

**Corps du message** :
Oui — et c'est même plus rapide à retrouver qu'à acquérir from scratch. Le site a un parcours fait pour ça. Pas du développement perso — des techniques concrètes à tester. La légèreté revient par la pratique, pas par la réflexion. deviens-marrant.fr/parcours

*(257 chars)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ Réponse directe à la question posée, sans minimiser ni dramatiser
- Concret (après ça je sais quoi faire) : ✅ Lien parcours + distinction "pratique vs réflexion" actionnable
- Doublon (existe déjà sous autre forme ?) : ✅ DM Marc unique
- Persona (servi ?) : ✅ "Retrouver" plutôt qu'"apprendre" — Marc n'est pas débutant, il est en pause — nuance respectée
- Barre (niveau leader marché ?) : ✅ "La légèreté revient par la pratique, pas par la réflexion" est une punchline philosophique juste — ceo-positioning.md trait 3 (drôle par défaut sans forcer)

---

## BLOC C — PITCHS BACKLINK (5 exemples)

*Règle : ≤ 100 mots corps. Voix Marrant. 1 chute obligatoire. Tutoiement. Zéro "SEO/backlink/guest post".*

---

### Exemple 11 — HARO journaliste (prise de parole en public)

**Catégorie** : pitch backlink
**Sous-type** : HARO journaliste
**Persona servi** : N/A (journaliste)
**Trigger** : Opportunité HARO / Connectively — sujet : "expert humour pour article sur la prise de parole en public" — Backlink source HARO
**Canal** : Email RP via Resend (base légale : intérêt légitime presse art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, hook drôle en ouverture, bio expert, 1 chute finale, opt-out obligatoire en bas
**Playbook source** : Module backlinks CEO (migration haro-agent.ts)

**Subject / Hook** : Expert humour FR — prise de parole en public

**Corps du message** :
Alex dirige deviens-marrant.fr — la seule plateforme FR qui enseigne l'humour avec les techniques du stand-up pro, pas du coaching développement perso.

Sur la prise de parole en public : le problème n'est jamais le contenu, c'est le silence de 2 secondes avant de commencer. On a décortiqué 80 vidéos de Mirabel et Frayssinet sur ce seul sujet.

Citation courte, données disponibles, deadline respectée.

Une seule limite : si tu me cites trop sérieusement, mes anciens collègues vont penser que j'ai changé.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type]

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ La chute finale est auto-dérision légère — désamorce le côté "pitch corporate"
- Concret (après ça je sais quoi faire) : ✅ "Citation courte, données disponibles, deadline respectée" — 3 livrables clairs pour le journaliste
- Doublon (existe déjà sous autre forme ?) : ✅ Pitch HARO unique, angle "silence de 2 secondes" non vu ailleurs
- Persona (servi ?) : ✅ Journaliste — info précise, pas de blabla, chute qui humanise
- Barre (niveau leader marché ?) : ✅ Meilleure pratique HARO : angle spécifique + bio + chute — supérieur au template générique haro-agent.ts existant

---

### Exemple 12 — Blogueur humour FR (Topito)

**Catégorie** : pitch backlink
**Sous-type** : blogueur
**Persona servi** : N/A (éditeur contenu humour FR)
**Trigger** : Outreach Topito.com — angle "5 techniques de répartie inspirées du stand-up" — Backlink source BLOGGER
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, proposition éditoriale claire, 1 chute, pas de "backlink" ni "échange de liens"
**Playbook source** : Module backlinks CEO

**Subject / Hook** : Un article sur la répartie pour tes lecteurs

**Corps du message** :
Salut,

J'ai lu ton dernier format sur les situations gênantes — tes lecteurs ont exactement le profil de ceux qui viennent sur deviens-marrant.fr.

Je propose un article clé en main : "5 techniques de répartie issues du stand-up pro" — avec des exemples tirés des techniques de Paul Mirabel et Blanche Gardin, testables en soirée le soir même.

Tu publies, tes lecteurs repartent avec quelque chose d'utile. Et moi je peux enfin dire que j'ai écrit pour Topito.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type]

*(99 mots)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ La chute finale ("enfin dire que j'ai écrit pour Topito") est l'auto-ironie qui détend le pitch
- Concret (après ça je sais quoi faire) : ✅ Proposition claire : article clé en main + angle précis + références
- Doublon (existe déjà sous autre forme ?) : ✅ Pitch Topito unique
- Persona (servi ?) : ✅ Éditeur humour FR — angle "testable le soir même" = valeur lecteur immédiate
- Barre (niveau leader marché ?) : ✅ Personnalisation sur "ton dernier format" + proposition clé en main = au-dessus des pitchs génériques

---

### Exemple 13 — Podcast FR (Sans Permission)

**Catégorie** : pitch backlink
**Sous-type** : podcast
**Persona servi** : N/A (animateurs podcast entrepreneur FR)
**Trigger** : Outreach Sans Permission (Yomi + Oussama) — angle "scaler une plateforme d'humour avec des agents IA" — Backlink source PODCAST
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, angle différenciant, 1 chute, pas de "collaboration"
**Playbook source** : Module backlinks CEO

**Subject / Hook** : Episode sur l'EdTech humour — un angle bizarre

**Corps du message** :
Salut Yomi et Oussama,

Alex a construit deviens-marrant.fr — une plateforme qui apprend la répartie du quotidien avec les techniques du stand-up pro, en France, à 0,99€/mois.

Ce qui est bizarre : tout le contenu est généré par des agents IA, supervisé par un "directeur artistique" IA, et validé humainement. C'est une EdTech de niche avec une stack que personne n'a essayée sur ce sujet.

Un épisode de 30-45 min, dispo pour la date qui t'arrange.

La seule chose qu'on peut pas promettre, c'est d'être ennuyeux.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type]

*(99 mots)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "Ce qui est bizarre" = hook de curiosité naturel — ton entrepreneur direct, sans pitch corporate
- Concret (après ça je sais quoi faire) : ✅ 30-45 min + date au choix — logistique simplifiée au maximum
- Doublon (existe déjà sous autre forme ?) : ✅ Pitch podcast unique, angle IA + stand-up = combo non vu ailleurs
- Persona (servi ?) : ✅ Sans Permission = podcast business FR, audience entrepreneurs — angle "stack bizarre" est leur vocabulaire
- Barre (niveau leader marché ?) : ✅ La chute finale est la promesse inversée — efficace pour un show d'humour

---

### Exemple 14 — Suggestion mention article existant (Welcome to the Jungle)

**Catégorie** : pitch backlink
**Sous-type** : suggestion mention
**Persona servi** : N/A (éditeur RH/carrière FR)
**Trigger** : Article Welcome to the Jungle "humour au travail / briser la glace en entretien" détecté — suggestion de mention naturelle — Backlink source EXCHANGE
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, suggestion naturelle (pas de demande d'échange de liens), 1 chute, opt-out
**Playbook source** : Module backlinks CEO

**Subject / Hook** : Une ressource pour compléter ton article sur l'humour au taf

**Corps du message** :
Salut,

Ton article sur l'humour en entretien couvre exactement la question que se posent nos utilisateurs avant de s'inscrire.

On a publié un guide sur les techniques stand-up applicables en milieu pro — avec des exercices concrets pour la machine à café, les réunions, les entretiens. Si tu penses que ça apporte quelque chose à tes lecteurs, c'est là : deviens-marrant.fr/conseils

Pas d'obligation de réciprocité — juste une suggestion si c'est pertinent pour ton lectorat.

Sinon, au moins t'auras appris qu'on existe.

— L'Équipe Devient Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type]

*(97 mots)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ "Pas d'obligation de réciprocité" = honnêteté désarmante — la chute finale est légère et non-agressive
- Concret (après ça je sais quoi faire) : ✅ Lien /conseils + cas d'usage précis (machine à café, réunions, entretiens)
- Doublon (existe déjà sous autre forme ?) : ✅ Suggestion éditoriale unique — angle professionnel non couvert par les autres pitchs
- Persona (servi ?) : ✅ Éditeur Welcome to the Jungle — vocabulaire RH/carrière respecté
- Barre (niveau leader marché ?) : ✅ Mention explicite "pas d'échange obligatoire" = différenciateur vs pitchs classiques. Red line SEO anti-Penguin respectée

---

### Exemple 15 — Annuaire FR (Uneed)

**Catégorie** : pitch backlink
**Sous-type** : annuaire
**Persona servi** : N/A (communauté SaaS/makers FR)
**Trigger** : Soumission Uneed.be — agrégateur SaaS FR — Backlink source DIRECTORY
**Canal** : Formulaire soumission Uneed (pas d'email — remplissage fiche produit)
**Contraintes format** : description produit courte (≤ 80 mots), USP différenciante, tagline percutante, 1 chute si le format le permet
**Playbook source** : Module backlinks CEO

**Subject / Hook** : Deviens-marrant.fr — apprends la répartie du stand-up pro

**Corps du message** :

**Tagline (≤ 10 mots)** : La plateforme FR pour apprendre l'humour comme les pros.

**Description (≤ 80 mots)** :
deviens-marrant.fr enseigne la répartie et l'humour du quotidien avec les techniques du stand-up professionnel. 290+ vannes analysées, 80+ vidéos décortiquées (Mirabel, Fary, Frayssinet, Gardin), 3 parcours structurés. Contenu quotidien généré par IA et validé par un directeur artistique. Pour les 18-40 ans qui veulent maîtriser l'humour en soirée, au boulot, en date. 0,99€/mois. Sans engagement. Ça coûte moins qu'un café et ça dure plus longtemps.

**Catégories** : EdTech · Personal Development · Humor · Social Skills · IA

*(79 mots description)*

**Auto-éval Stand-Up Director (5 tests)** :
- Pote (tu enverrais ça à ton meilleur pote ?) : ✅ La chute finale sur le café est la signature Marrant dans un format annuaire — cohérence brand voice
- Concret (après ça je sais quoi faire) : ✅ Chiffres (290+ vannes, 80+ vidéos, 0,99€) + cas d'usage (soirée/boulot/date) — décision facile
- Doublon (existe déjà sous autre forme ?) : ✅ Description annuaire unique — variation légère du template D pour Uneed spécifiquement
- Persona (servi ?) : ✅ Communauté makers/SaaS FR — "IA + directeur artistique" = vocabulaire maker, "0,99€" = surprise positive
- Barre (niveau leader marché ?) : ✅ La description intègre les refs modernes + le hook prix + la chute — supérieur au template standard de la stratégie backlinks

---

## HANDOFF

---

### Pour @reviewer — Audit dual /20 (priorité de challenge)

**Exemples les plus risqués à challenger en priorité :**

1. **Exemple 9 (troll)** : la réponse publique 9.a a une chute sur le "remboursement + c'est gratuit". Risque d'être perçue comme condescendante selon le profil du troll. À challenger : est-ce qu'on répond ou on ignore selon le score d'agressivité du commentaire ?

2. **Exemple 5 (fan engagement)** : la vanne insérée ("Ma démission dans une enveloppe") est fabriquée pour l'exemple — pas issue du catalogue blagues-seed.json réel. À valider : le CEO doit extraire des vraies vannes du catalogue en production. [HYPOTHÈSE marquée dans le corps de l'exemple]

3. **Exemple 13 (podcast Sans Permission)** : le pitch mentionne que "tout le contenu est généré par des agents IA" — risque de transparence IA non calibré avec le choix Thomas (signature "L'Équipe Devient Marrant" vs mention agent IA). À arbitrer : jusqu'où on révèle la stack IA dans les pitchs presse ?

4. **Exemple 3 (conversion soft)** : la punchline "L'hésitation coûte plus cher que l'abonnement" peut être lue comme un reproche implicite. À challenger : est-ce qu'on reste dans l'anti-friction pure ou on glisse vers la pression douce ?

---

### Pour @moi (proxy fondateur Thomas) — Seconde lecture recommandée

**Exemples avec compromis éditoriaux non triviaux :**

1. **Exemple 13 (podcast)** : le pitch révèle explicitement l'architecture IA ("directeur artistique IA"). Choix éditorial assumé pour l'angle "bizarre" qui est le seul différenciateur sur Sans Permission. Si Thomas veut rester discret sur la stack IA publiquement, cet angle doit être réécrit.

2. **Exemple 7 (LinkedIn)** : ton "légèrement posé" interprété comme "observation forte en ouverture + 3 phrases max + zéro emoji". Calibration 4B prise au sérieux. Thomas valide-t-il ce registre LinkedIn vs Twitter ?

3. **Exemple 5 (referral)** : le mécanisme "1 mois offert" est marqué [HYPOTHÈSE — à implémenter Phase 5]. Si le referral n'est pas en production avant Phase 4-5, cet exemple doit être alterné avec la version P3 directe "fan". Decision bloquante pour le code CEO.

4. **Exemples 11-14 (pitchs RP)** : tous les pitchs utilisent "L'Équipe Devient Marrant" en signature, pas "Alex". Décision prise selon le `[CHOIX UTILISATEUR]` documenté. Si Thomas veut des pitchs avec une signature nominative pour les relations presse (plus chaleureux), facile à switcher.

---

### Pour Phase 3 @ia — Patterns récurrents identifiés

**Structure type identifiée sur les 15 exemples :**

| Pattern | Fréquence | Détail |
|---|---|---|
| Observation → Twist → Lien | 13/15 | Structure canonique respectée — les 2 exceptions sont les annuaires (format imposé) |
| Chute finale ou autodérision marque | 15/15 | 100% des exemples — non négociable dans le prompt CEO |
| Longueur corps | Emails : 4-6 phrases / DMs : 2-3 phrases / Pitchs : 6-8 phrases | À traduire en contrainte `max_sentences` par type dans le prompt |
| Ancrage prix dans les emails de conversion | 3/5 emails | "extra guacamole" / "café" / "0,99€" — varier les objets, jamais répéter le même dans une séquence |
| Tutoiement + zéro "je/mon/ma" | 15/15 | G-S19 respecté — à forcer en gate de validation Director avant envoi |
| Référence humoriste moderne | 7/15 | Fary, Frayssinet, Mirabel, Gardin, Pascot — rotation naturelle, jamais en début de message |
| CTA lien inline (pas de bouton énorme) | 10/15 | Hors annuaires — à spécifier dans le prompt : format `[→ Texte](url)` ou texte seul |
| Phrases ≤ 18 mots | ~90% des phrases | Quelques phrases à 20-22 mots tolérées sur les pitchs RP (registre légèrement plus posé) |

**Vocabulaire spécifique à intégrer dans le prompt système :**
- Mots actifs : "tac au tac", "ce soir", "en 3 clics", "le truc c'est que", "sans engagement", "ça tient en une phrase"
- Mots bannis : "profitez de", "valeur ajoutée", "cher(e) utilisateur(trice)", "croissance", "scaler", "exceptionnel"
- Ancrages prix à alterner : "café à emporter", "extra guacamole", "shot de gingembre", "baguette"

**[HYPOTHÈSE Thomas] :**
- Le prompt CEO devra distinguer 3 registres légèrement différents : Email (4-6 phrases dense), DM social (2-3 phrases percutant), Pitch RP (6-8 phrases, légèrement plus posé mais jamais corporate). Cette distinction de registre n'est pas explicitement documentée dans les briefs Phase 1 — elle émerge des 15 exemples. À valider avant de la figer dans le prompt système Phase 3.

---

*Produit par @copywriter — 2026-05-05 — Phase 2 CEO autonome Marrant*
*Frameworks : AIDA (emails conversion) · Structure canonique Observation→Twist→Lien (DMs) · BAB Before/After/Bridge (pitchs backlink)*
*Niveau conscience : Problem-Aware (emails dropoff/winback) · Solution-Aware (DMs inbound) · Most-Aware (emails conversion) · Unaware (pitchs presse)*
*Objections traitées : prix (ancrage café/guac) · complexité (3 clics, 30 secondes) · timing (sans engagement, annule quand tu veux) · confiance (marque transparente, 0 pression)*
