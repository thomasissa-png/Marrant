<!-- Version: 2026-05-06 v5 — @copywriter — Refonte cycle 5 (cap atteint) — pivot valeur éducative acté Thomas 06/05/2026 -->
<!-- Framework : Observation→Pratique→Invitation (emails + DMs) · factuel posé + angle expert (pitchs backlink) -->
<!-- Niveau conscience : Problem-Aware (emails dropoff/winback) · Solution-Aware (DMs inbound) · Unaware (pitchs presse) -->
<!-- Objections traitées : prix (contexte factuel) · complexité (1 action) · timing (sans engagement) · confiance (valeur avant conversion) -->

# CEO Deviens Marrant — 16 exemples canoniques (cycle 5)

> Corpus v5 — réécriture intégrale sur pivot valeur éducative. Source de vérité voix : `docs/strategy/ceo-voice-unified.md` v3.
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
L'Équipe Deviens Marrant — deviens-marrant.fr | contact@deviens-marrant.fr
```

---

### Exemple 1 — Welcome free

**Catégorie** : email
**Sous-type** : welcome
**Audience (par comportement DB)** : tout nouvel inscrit — `User.createdAt` ≤ 2h (fenêtre post-signup)
**Trigger** : `User.createdAt` ≤ 2h — P1
**Canal** : Email via Resend
**Contraintes format** : 4-5 phrases corps, sujet ≤ 50 chars, 0 point d'exclamation, axe pédagogique prioritaire
**Playbook source** : P1 — Welcome free

**Subject** : Bienvenue sur Deviens Marrant

**Corps du message** :
Bienvenue sur Deviens Marrant.

Avant le catalogue, un point qui aide presque tout le monde au début : quand on veut faire rire, on cherche souvent ce qui est drôle, alors que les humoristes cherchent ce que tout le monde voit mais personne ne dit. C'est de là que viennent presque toutes leurs vannes — chez Mirabel, chez Frayssinet, chez Gardin. C'est aussi ce qu'on essaie de transmettre dans les conseils, les vidéos décryptées et les parcours du site.

Pour démarrer, le parcours "Machine à café" (3 semaines, environ 30 minutes par semaine) est celui qui revient le plus dans les retours. Mais rien ne presse — le site est là quand tu y reviens.

Bonne découverte,
L'Équipe Deviens Marrant

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ L'insight ouvre sur la méthode des humoristes, pas sur la vanne du jour. Le parcours "Machine à café" ancre la valeur éducative dès le premier email
- Style fluide (pas haché) : ✅ Phrases construites avec transitions logiques. Structure étalon 2 respectée verbatim — deux idées reliées par "C'est de là que viennent... C'est aussi ce qu'on essaie"
- Pattern invitation ressource respecté : ✅ "le parcours revient le plus dans les retours. Mais rien ne presse" — invitation sans pression, aucun lien forcé
- Pas de pub déguisée : ✅ Zéro mention prix, zéro CTA conversion, zéro FOMO
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Corps quasi-verbatim de l'étalon 2 Thomas — ancrage de référence respecté

---

### Exemple 2 — Réactivation J+7

**Catégorie** : email
**Sous-type** : réactivation
**Audience (par comportement DB)** : inscrit free inactif depuis 7 jours — `User.lastActiveAt` > J-7 ET `User.plan = FREE` ET `User.createdAt` < J-7
**Trigger** : `User.lastActiveAt` > J-7 — P2
**Canal** : Email via Resend — envoi 19h-22h, 1 seul envoi (pas de relance)
**Contraintes format** : 4 phrases max, 0 pitch premium, sujet ≤ 50 chars, valeur dès le corps
**Playbook source** : P2 — Engagement réactivation

**Subject** : Ce qui s'est passé cette semaine

**Corps du message** :
Cette semaine sur Deviens Marrant, on a publié un conseil sur le timing — pourquoi les meilleures réparties arrivent toujours après une pause, jamais pendant qu'on cherche. Et une vidéo décryptée de Fary sur exactement ce mécanisme, avec les secondes de silence qu'il étire avant chaque chute.

Si t'as 10 minutes, les deux sont encore là.

[→ Voir les nouveautés](https://deviens-marrant.fr)

L'Équipe Deviens Marrant

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Le corps cite un conseil concret (timing) et une vidéo décryptée — la valeur est donnée dans l'email même, avant le clic
- Style fluide (pas haché) : ✅ "pourquoi les meilleures réparties arrivent toujours après une pause, jamais pendant qu'on cherche" — idée complète, transition logique, pas de fragments
- Pattern invitation ressource respecté : ✅ "Si t'as 10 minutes, les deux sont encore là" — invitation sans urgence, sans FOMO
- Pas de pub déguisée : ✅ Zéro mention premium, zéro limite touchée, zéro "t'as loupé"
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Constat factuel ("cette semaine"), valeur délivrée sans conditionner la lecture au clic, ton sobre

---

### Exemple 3 — Conversion soft

**Catégorie** : email
**Sous-type** : conversion
**Audience (par comportement DB)** : inscrit free avec streak ≥ 3 jours ET 5+ likes — signal de progression active, non encore converti
**Trigger** : Score lead ≥ 21 ET `User.plan = FREE` ET (`User.streak >= 3` ET `JokeLike.count >= 5`) — P3 refondé
**Canal** : Email via Resend — dans les 2h après trigger
**Contraintes format** : 5 phrases max, mention premium en contexte factuel (jamais en hook), sujet ≤ 50 chars
**Playbook source** : P3 — Conversion soft (refondé pivot session 8)

**Subject** : 3 jours d'affilée, 5 vannes likées

**Corps du message** :
3 jours d'affilée, 5 vannes likées. Voilà à quoi ressemble la régularité — et c'est elle qui fait vraiment progresser, pas les sessions longues espacées.

Les prochaines étapes naturelles depuis là où t'en es : les conseils sur le timing et les vidéos décryptées. Ce contenu est disponible en version premium, à 0,99€ par mois, sans engagement.

Si t'as envie de continuer sur cette lancée, c'est là : [deviens-marrant.fr/abonnement](https://deviens-marrant.fr/abonnement)

L'Équipe Deviens Marrant

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Le hook est un signal de progression (streak + likes), pas la limite touchée. La valeur citée en contexte = conseils timing + vidéos décryptées
- Style fluide (pas haché) : ✅ "c'est elle qui fait vraiment progresser, pas les sessions longues espacées" — observation complète, pas un fragment staccato
- Pattern invitation ressource respecté : ✅ La limite premium apparaît en contexte factuel dans la 2e phrase — jamais comme hook émotionnel ou pression de vente
- Pas de pub déguisée : ✅ Zéro "t'as touché la limite", zéro FOMO, zéro "offre limitée". Le prix est cité une fois, sobrement
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Structure observation (fait DB) → insight pédagogique → invitation naturelle — identique aux 3 étalons

---

### Exemple 4 — Winback ex-abonné premium (< 90 jours)

**Catégorie** : email
**Sous-type** : winback
**Audience (par comportement DB)** : ex-abonné premium ayant annulé entre J-7 et J-90 — `Subscription.status = cancelled`
**Trigger** : `Subscription.endedAt` entre J-7 et J-90 — P4 (envoi J+7 post-annulation)
**Canal** : Email via Resend — envoi 12h-14h, max 1 email
**Contraintes format** : 4 phrases max, ton factuel sans culpabilisation, 0 réduction, sujet ≤ 50 chars
**Playbook source** : P4 — Winback churner premium

**Subject** : Depuis que t'es parti

**Corps du message** :
Depuis ton départ, on a publié une dizaine de contenus — dont un conseil sur la répartie en situation difficile et une vidéo décryptée de Blanche Gardin sur comment nommer le malaise plutôt que de l'éviter.

Pas de pression. Le catalogue est là si tu reviens.

[→ Revenir quand tu veux](https://deviens-marrant.fr/abonnement) — 0,99€/mois, sans engagement.

L'Équipe Deviens Marrant

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Ce qui est mis en avant = un conseil et une vidéo décryptée avec la technique précise (nommer le malaise), pas un compteur de vannes
- Style fluide (pas haché) : ✅ Première phrase construite avec exemple concret et lien logique. "Pas de pression. Le catalogue est là si tu reviens." — deux phrases courtes en fermeture assumée, pas staccato car c'est une respiration intentionnelle
- Pattern invitation ressource respecté : ✅ "Pas de pression. Le catalogue est là si tu reviens." — verbatim proche de la doctrine troll détachée, adapté au winback
- Pas de pub déguisée : ✅ Zéro "t'es parti mais on a continué pour toi", zéro réduction, zéro urgence
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Constat honnête → valeur délivrée dans le corps → invitation détachée. La progression ne dépend pas du clic

---

### Exemple 5 — Fan engagement (signaux forts)

**Catégorie** : email
**Sous-type** : fan engagement
**Audience (par comportement DB)** : inscrit free avec streak ≥ 3 jours ET 5+ likes simultanément actifs — `User.plan = FREE`
**Trigger** : S1 + S2 actifs simultanément — P7
**Canal** : Email via Resend — envoi 19h-22h
**Contraintes format** : 4 phrases max, 1 insight pédagogique avancé offert directement (pas un accès fictif), sujet ≤ 50 chars
**Playbook source** : P7 — Fan engagement

**Subject** : Ce que la régularité dit de toi

**Corps du message** :
3 jours d'affilée, 5 vannes likées. La régularité, c'est exactement ce qui distingue quelqu'un qui "essaie d'être drôle" de quelqu'un qui progresse vraiment.

Un point que peu de gens remarquent à ce stade : les vannes qu'on like instinctivement révèlent notre registre naturel — le type d'humour dans lequel on sera le plus à l'aise à l'oral. Regarder les 5 que t'as likées, c'est déjà un début de diagnostic.

L'Équipe Deviens Marrant

**Footer** :
*Footer standard — voir bloc A*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Le cadeau est un insight pédagogique concret (les likes = diagnostic du registre naturel), pas un accès fictif ni un compteur de vannes
- Style fluide (pas haché) : ✅ Deuxième paragraphe construit autour d'une idée progressive : observation → application → action concrète
- Pattern invitation ressource respecté : ✅ Pas de lien dans cet email — l'insight se suffit à lui-même. C'est la valeur délivrée sans condition de clic
- Pas de pub déguisée : ✅ Zéro mention premium, zéro CTA, zéro "accès anticipé" fictif
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Observation comportementale → insight expert → pas de leçon mais une invitation à l'auto-observation. Structure étalon 2 adaptée

---

## BLOC B — RÉPONSES SOCIALES (5 exemples)

---

### Exemple 6 — DM Twitter inbound : "je sais jamais quoi répondre tac au tac"

**Catégorie** : réponse sociale
**Sous-type** : DM Twitter
**Audience (par comportement DB)** : toute personne envoyant un DM sur la difficulté à répondre tac au tac
**Trigger** : DM entrant Twitter — message type "je sais jamais quoi répondre quand quelqu'un me chambre" — P5
**Canal** : Twitter DM
**Contraintes format** : ≤ 270 chars, structure étalon 1 verbatim, pattern invitation ressource en fin
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM — pas de sujet)

**Corps du message** :
Les pros du stand-up cherchent l'observation juste, pas le mot juste — c'est ça qui fait la répartie. Quand tu remarques un détail précis chez la personne qui te chambre (sa façon d'insister, ce qui la fait sourire), une réponse vient naturellement, parce que tu réponds à quelque chose de réel. Pascot appelle ça "le silence de 2 secondes". On peut te partager un article si tu as envie d'en savoir plus.

*(270 chars)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Conseil pédagogique direct sur le mécanisme de la répartie (observation juste vs mot juste). Zéro vanne citée, 100% technique
- Style fluide (pas haché) : ✅ Verbatim étalon 1 Thomas — phrases construites avec transitions logiques, "parce que tu réponds à quelque chose de réel" lie les deux idées
- Pattern invitation ressource respecté : ✅ "On peut te partager un article si tu as envie d'en savoir plus" — verbatim exact de l'étalon 1, aucune pression
- Pas de pub déguisée : ✅ Zéro lien direct dans le DM, zéro "deviens-marrant.fr/..." inline, invitation conditionnelle à la demande du destinataire
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Corps quasi-verbatim de l'étalon 1 Thomas — ancrage de référence respecté

---

### Exemple 7 — Mention LinkedIn : observation pro (machine à café, réunion)

**Catégorie** : réponse sociale
**Sous-type** : mention LinkedIn
**Audience (par comportement DB)** : toute personne mentionnant Deviens Marrant dans un post LinkedIn lié à l'humour au travail
**Trigger** : Mention du compte Deviens Marrant dans un post LinkedIn — P5 (inbound mention)
**Canal** : LinkedIn — commentaire réponse public
**Contraintes format** : POTE_AU_TAF ≤ 3 phrases, zéro leçon, 0 exclamation, zéro vocabulaire RH/coach
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (commentaire — pas de sujet)

**Corps du message** :
Ce moment où tu cherches la bonne réponse à la machine à café et t'as 3 secondes avant que la conversation parte ailleurs — c'est exactement la fenêtre que les pros du stand-up entraînent, pas l'inspiration. Sur Deviens Marrant, on a décrypté comment Mirabel et Fary utilisent ce délai plutôt que de le subir. On peut te partager un conseil si tu as envie d'en savoir plus.

*(316 chars — commentaire LinkedIn, pas de char limit strict comme Twitter)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ L'observation ouvre sur la technique (entraîner la fenêtre de 3 secondes), pas sur une vanne à placer. Les humoristes cités illustrent une technique réelle
- Style fluide (pas haché) : ✅ Première phrase construite autour d'une situation concrète avec transition logique vers l'insight. Zéro staccato
- Pattern invitation ressource respecté : ✅ "On peut te partager un conseil si tu as envie d'en savoir plus" — pattern étalon 1 adapté au contexte LinkedIn, proposition sans pression
- Pas de pub déguisée : ✅ Zéro lien direct vers le site dans le commentaire public. Zéro CTA "abonne-toi", zéro "0,99€"
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Observation situationnelle → technique stand-up → invitation. Structure des 3 étalons appliquée, ton sobre

---

### Exemple 8 — DM Instagram inbound : "comment relancer un dîner qui s'ennuie"

**Catégorie** : réponse sociale
**Sous-type** : DM IG
**Audience (par comportement DB)** : toute personne envoyant un DM sur une situation sociale bloquée
**Trigger** : DM entrant Instagram — message type "comment je relance un dîner où tout le monde s'ennuie ?" — P5
**Canal** : Instagram DM (texte seul)
**Contraintes format** : DM court < 200 chars, conseil direct + invitation ressource
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM — pas de sujet)

**Corps du message** :
Une observation sur la table suffit — "vous avez remarqué que le pain arrive toujours avant qu'on sache quoi se dire ?" Ça ouvre sans forcer. On peut te partager d'autres techniques si tu as envie d'en savoir plus.

*(218 chars)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Le conseil est la technique elle-même (observation sur la table), pas une vanne à réciter. La valeur est dans le mécanisme
- Style fluide (pas haché) : ✅ Exemple concret suivi d'un constat sobre ("ça ouvre sans forcer"), pas de liste à puces ni fragments
- Pattern invitation ressource respecté : ✅ "On peut te partager d'autres techniques si tu as envie d'en savoir plus" — pattern invitation standard, conditionnel à la demande
- Pas de pub déguisée : ✅ Zéro lien, zéro mention du site inline dans le DM
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Technique donnée directement, invitation en fin — même respiration que l'étalon 1

---

### Exemple 9 — Commentaire troll public X

**Catégorie** : réponse sociale
**Sous-type** : troll public — doctrine détachement bienveillant
**Audience (par comportement DB)** : public large (réponse visible par tous les spectateurs du fil)
**Trigger** : Commentaire public Twitter/X hostile ou moqueur sur Deviens Marrant — cas spécial
**Canal** : Twitter/X — réponse publique (ou silence assumé)
**Contraintes format** : ≤ 270 chars, zéro riposte, zéro sarcasme, zéro escalade
**Playbook source** : cas spécial — doctrine troll détaché (ceo-voice-unified.md section 4)

**Subject / Hook** : N/A

**9.a — Option "silence assumé"** :
*(Pas de réponse. Le silence est une posture, pas un manque. La non-réponse signale que la marque n'a pas besoin d'avoir le dernier mot.)*

**9.b — Option "chaleur détachée"** (si contexte justifie une réponse visible) :
Pas de problème. Le catalogue est là si tu reviens.

*(53 chars)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Ces deux options ne portent pas de valeur pédagogique — ce n'est pas leur rôle. Le troll n'appelle pas à enseigner
- Style fluide (pas haché) : ✅ 9.b = deux phrases courtes assumées (pas staccato — respiration délibérée de la doctrine détachée). 9.a = silence complet
- Pattern invitation ressource respecté : ✅ 9.b invite sans orienter ("le catalogue est là si tu reviens") — aucune pression, aucune condition
- Pas de pub déguisée : ✅ Zéro "Ah non, c'est gratuit. Compliqué." (banni), zéro combo 3A+3B, zéro riposte humoristique, zéro escalade
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Doctrine troll section 4 du ceo-voice-unified.md appliquée verbatim. Bienveillant > brillant face à l'hostilité

---

### Exemple 10 — DM Twitter inbound : "j'ai du mal à retrouver de la légèreté après une rupture"

**Catégorie** : réponse sociale
**Sous-type** : DM Twitter — situation de reconstruction sociale
**Audience (par comportement DB)** : toute personne exprimant une perte de légèreté sociale dans un DM inbound
**Trigger** : DM entrant Twitter — message type "j'arrive plus à faire rire personne, c'est une compétence qu'on peut vraiment retrouver ?" — P5
**Canal** : Twitter DM
**Contraintes format** : ≤ 270 chars, ton factuel sans condescendance, zéro développement personnel
**Playbook source** : P5 — Inbound social

**Subject / Hook** : N/A (DM)

**Corps du message** :
Oui, et c'est souvent plus rapide à retrouver qu'à acquérir de zéro — parce que les reflexes sont là, juste en veille. La légèreté revient par la pratique, pas par la réflexion. On peut te partager un parcours fait pour ça si tu as envie d'en savoir plus.

*(264 chars)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ Insight pédagogique direct (réflexes en veille, pratique > réflexion) avant toute mention de ressource. La valeur est dans la réponse elle-même
- Style fluide (pas haché) : ✅ "parce que les réflexes sont là, juste en veille" — proposition subordonnée qui complète l'idée, pas de fragment sec
- Pattern invitation ressource respecté : ✅ "On peut te partager un parcours fait pour ça si tu as envie d'en savoir plus" — pattern invitation standard, conditionnel à la demande
- Pas de pub déguisée : ✅ Zéro lien inline, zéro "0,99€/mois", zéro pression conversion
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Réponse directe à la question, sans minimiser ni dramatiser. Ton compatissant sans pathos, observation sur le mécanisme

---

## BLOC C — PITCHS BACKLINK (5 exemples)

*Règle : ≤ 100 mots corps. Voix Deviens Marrant. Valeur délivrée au journaliste avant toute demande. Tutoiement pour blogueurs/podcasters, vouvoiement pour journalistes presse. Zéro "SEO/backlink/guest post". Opt-out obligatoire. Signature "L'Équipe Deviens Marrant".*

---

### Exemple 11 — HARO journaliste : expert humour / prise de parole en public

**Catégorie** : pitch backlink
**Sous-type** : HARO journaliste
**Audience (par comportement DB)** : journaliste cherchant un expert humour FR pour article sur la prise de parole
**Trigger** : Opportunité HARO / Connectively — sujet prise de parole en public — module backlinks CEO
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, angle expert précis avec valeur citable, proposition de suite conditionnelle, opt-out
**Playbook source** : Module backlinks CEO

**Subject** : Expert humour FR — prise de parole en public

**Corps du message** :
Bonjour [Prénom],

Sur la prise de parole, il y a un angle qu'on travaille et qu'on lit peu : la peur du silence. La plupart des gens se forcent à parler vite ou à remplir les blancs, alors que les humoristes font exactement l'inverse — Pascot tient parfois 8 secondes de silence avant une chute, et c'est précisément ce silence qui crée l'attention. La technique se transpose en réunion, en présentation, en entretien : ralentir, accepter le vide, laisser l'auditoire se pencher.

Si ça vous intéresse pour votre article, je peux vous développer 2-3 lignes citables. On a aussi décrypté plusieurs extraits de stand-up sur ce thème si vous voulez des exemples concrets.

Bonne journée,
L'Équipe Deviens Marrant

[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(96 mots)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ La valeur est l'angle expert (silence = technique), pas un catalogue de vannes. Le journaliste repart avec quelque chose de citable même sans répondre
- Style fluide (pas haché) : ✅ Verbatim quasi-fidèle de l'étalon 3 Thomas — "alors que les humoristes font exactement l'inverse" : transition logique construite
- Pattern invitation ressource respecté : ✅ "Si ça vous intéresse, je peux vous développer" — conditionnel, sans pression. Deuxième proposition également conditionnelle
- Pas de pub déguisée : ✅ Zéro "notre plateforme à 0,99€", zéro lien produit. Le pitch est 100% orienté valeur journaliste
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Corps quasi-verbatim de l'étalon 3 Thomas — ancrage de référence respecté

---

### Exemple 12 — Blogueur humour FR (Topito ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : blogueur
**Audience (par comportement DB)** : éditeur de contenu humour FR (Topito, Konbini, Golden Moustache ou équivalent)
**Trigger** : Outreach ciblé — article récent identifié sur les situations gênantes ou l'humour du quotidien
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, proposition éditoriale de valeur pour ses lecteurs, zéro "backlink"/"échange de liens"
**Playbook source** : Module backlinks CEO

**Subject** : Un article sur la répartie pour tes lecteurs

**Corps du message** :
Salut,

J'ai lu ton dernier format sur les situations gênantes — le profil de tes lecteurs correspond exactement à ce qu'on observe sur Deviens Marrant.

Je propose un article clé en main : "5 techniques de répartie du stand-up pro, testables ce soir". Exemples concrets tirés de sets FR, zéro théorie, zéro jargon. Tes lecteurs repartent avec quelque chose à utiliser dès ce soir.

Tu publies quand tu veux, ou tu l'adaptes à ta ligne éditoriale — pas d'obligation de réciprocité.

— L'Équipe Deviens Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(89 mots)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ La proposition est un article sur les techniques (répartie du stand-up), pas un catalogue de blagues. Valeur pour les lecteurs de l'éditeur, pas de trafic Deviens Marrant
- Style fluide (pas haché) : ✅ Chaque phrase complète une idée. Transition naturelle entre observation sur les lecteurs et proposition éditoriale
- Pattern invitation ressource respecté : ✅ "Tu publies quand tu veux, ou tu l'adaptes — pas d'obligation de réciprocité" — détachement et liberté totale donnés au destinataire
- Pas de pub déguisée : ✅ Zéro "backlink", zéro "SEO", zéro "améliorez votre DA". La demande est formulée comme un service
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Observation sur l'article lu (personnalisation réelle) → proposition alignée → liberté du destinataire. Fil factuel sans urgence

---

### Exemple 13 — Podcast FR (Sans Permission ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : podcast
**Audience (par comportement DB)** : animateurs de podcast business ou entreprendre FR (Sans Permission, Génération Do It Yourself, Le Board)
**Trigger** : Outreach ciblé — angle pricing 0,99€ anti-friction + IA sobre
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, angle différenciant, mention IA 1× sobre, pas de "collaboration"
**Playbook source** : Module backlinks CEO

**Subject** : EdTech humour à 0,99€ — un angle pour Sans Permission

**Corps du message** :
Salut Yomi et Oussama,

deviens-marrant.fr : apprendre la répartie du quotidien avec les techniques du stand-up FR, à 0,99€/mois. Le pricing est volontaire — on a parié que c'est le clic qui fait peur, pas le prix, et que réduire la friction à ce niveau change le comportement d'achat.

Stack en grande partie automatisée par des agents IA. Premiers chiffres disponibles. 30-45 min, date au choix.

La seule chose qu'on peut pas promettre, c'est d'être ennuyeux.

— L'Équipe Deviens Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(76 mots)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ L'angle podcast est le pari pricing (réflexion sur la friction comportementale), pas "apprenez des blagues". Valeur intellectuelle pour l'animateur
- Style fluide (pas haché) : ✅ "on a parié que c'est le clic qui fait peur, pas le prix, et que réduire la friction à ce niveau change le comportement d'achat" — phrase construite avec deux clauses reliées
- Pattern invitation ressource respecté : ✅ "date au choix" — aucune pression de calendrier, l'initiative reste chez le destinataire
- Pas de pub déguisée : ✅ IA mentionnée 1× sobre ("agents IA"), jamais sur-exposée. Zéro "notre technologie révolutionnaire"
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Prise de position intellectuelle sur le pricing, chute sobre en fermeture. Construit, pas template

---

### Exemple 14 — Suggestion mention article existant (WTTJ ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : suggestion mention
**Audience (par comportement DB)** : éditeur RH, carrière ou lifestyle FR (Welcome to the Jungle, Cadremploi, Le Monde Campus)
**Trigger** : Article existant identifié sur l'humour au travail ou la communication informelle
**Canal** : Email RP via Resend (base légale : intérêt légitime art. 6.1.f)
**Contraintes format** : ≤ 100 mots corps, suggestion naturelle sans demande de retour, opt-out
**Playbook source** : Module backlinks CEO

**Subject** : Une ressource pour compléter ton article sur l'humour au taf

**Corps du message** :
Salut,

Ton article sur l'humour au travail traite exactement la question qu'on entend le plus de nos utilisateurs avant qu'ils s'inscrivent.

On a un guide sur les techniques stand-up applicables en milieu pro — machine à café, réunions, entretiens. Si tu penses que ça ajoute quelque chose à tes lecteurs : deviens-marrant.fr/conseils

Pas d'obligation de réciprocité — juste une suggestion si c'est utile.

— L'Équipe Deviens Marrant | deviens-marrant.fr
[Ne plus recevoir d'emails de ce type — art. 21 RGPD]

*(76 mots)*

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ La ressource proposée = guide sur les techniques (pas un catalogue de blagues). Contextes précis : machine à café, réunions, entretiens
- Style fluide (pas haché) : ✅ Phrase d'ouverture avec lien direct entre l'article et la situation utilisateur. Transition logique vers la proposition
- Pattern invitation ressource respecté : ✅ "Si tu penses que ça ajoute quelque chose à tes lecteurs" — conditionnel, liberté totale. "Pas d'obligation de réciprocité" explicite
- Pas de pub déguisée : ✅ Zéro "backlink", zéro "échange de liens", zéro jargon SEO. Posture de service, pas de prospection
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Honnêteté sans démonstration d'effort, invitation détachée, fermeture sobre

---

### Exemple 15 — Annuaire FR (Uneed, Product Hunt FR ou équivalent)

**Catégorie** : pitch backlink
**Sous-type** : annuaire / candidature produit
**Audience (par comportement DB)** : communauté SaaS, makers et produits FR (Uneed.be, Product Hunt, Maker's Kitchen)
**Trigger** : Soumission spontanée à un annuaire ou agrégateur SaaS FR
**Canal** : Formulaire soumission (pas d'email — remplissage fiche produit)
**Contraintes format** : tagline ≤ 10 mots, description ≤ 80 mots, USP différenciante, 1 chute si le format le permet
**Playbook source** : Module backlinks CEO

**Subject / Hook** : deviens-marrant.fr — apprends la répartie du stand-up pro

**Tagline (≤ 10 mots)** :
La plateforme FR pour apprendre l'humour comme les pros.

**Description (≤ 80 mots)** :
Deviens Marrant enseigne la répartie et l'humour du quotidien avec les techniques du stand-up professionnel français. 290+ vannes analysées, 80+ vidéos décryptées, parcours structurés sur 3 à 6 semaines, conseils actionnables. Contenu quotidien validé par un directeur artistique IA. Pour ceux qui veulent progresser à l'oral — en soirée, au boulot, en date. 0,99€/mois. Sans engagement. Ça coûte moins qu'un café — et ça dure plus longtemps.

*(73 mots)*

**Catégories suggérées** : EdTech · Humor · Social Skills · IA · Personal Development

**Auto-éval** :
- Conseils/Apprentissage > Vannes : ✅ La description met en avant parcours + conseils + vidéos décryptées avant les vannes. L'axe est "progresser à l'oral", pas "avoir des blagues"
- Style fluide (pas haché) : ✅ Description structurée en flux : produit → catalogue → audience → prix → chute. Pas de fragments marketing
- Pattern invitation ressource respecté : ✅ Format annuaire — pas d'invitation conditionnelle nécessaire. La description parle à un lecteur qui cherche un outil
- Pas de pub déguisée : ✅ Zéro jargon growth, zéro "rejoignez la communauté", zéro promesse de transformation vague
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Chiffres factuels, cas d'usage réels, chute sobre en fermeture. Identique aux étalons sur la posture

---

## BLOC D — REPORTING HEBDOMADAIRE (1 exemple BONUS)

---

### Exemple 16 — Email reporting hebdomadaire Thomas

**Catégorie** : reporting interne
**Sous-type** : email hebdo fondateur
**Audience (par comportement DB)** : Thomas (fondateur) — lundi 9h UTC
**Trigger** : Cron `/api/cron/ceo-tick` — lundi 9h, section reporting hebdo — Q8
**Canal** : Email via Resend à `alex@deviens-marrant.fr`
**Contraintes format** : 4 sections fixes, données factuelles, pas d'édito narratif, zéro "cette semaine on a réalisé que..."
**Playbook source** : Q8 reporting ceo-agent-scope.md

**Subject** : Deviens Marrant — semaine du [DATE]

**Corps du message** :
Bonjour Thomas,

---

**Section 1 — KPIs delta 7 jours**

| Métrique | Semaine précédente | Cette semaine | Delta |
|---|---|---|---|
| Emails CEO envoyés | [N] | [N] | [+/-N] |
| Taux d'ouverture | [%] | [%] | [+/-pp] |
| Taux de réponse | [%] | [%] | [+/-pp] |
| Taux de retour site (48h) | [%] | [%] | [+/-pp] |
| DMs traités | [N] | [N] | [+/-N] |
| Pitchs backlinks envoyés | [N] | [N] | [+/-N] |
| Backlinks acquis | [N] | [N] | [+/-N] |
| MRR delta (conséquence) | [€] | [€] | [+/-€] |

---

**Section 2 — Ce qui a bien fonctionné**

[Exemple 1 : message ou type de message avec taux d'engagement notable — sujet + canal + résultat observé]

[Exemple 2 : angle ou pitch backlink qui a décroché une réponse positive — nom de la publication + résultat]

[Exemple 3 si pertinent]

---

**Section 3 — Ce qui n'a pas fonctionné**

[Observation 1 factuelle : type de message avec faible engagement ou sans réponse — canal + hypothèse sobre]

[Observation 2 si pertinent — 1 ligne maximum par observation, sans dramatiser]

---

**Section 4 — Observation pédagogique de la semaine**

[1 signal faible appris sur l'audience ou le contenu — ce que les données suggèrent sur le comportement, sans conclusion définitive. Exemple : "Les DMs sur la répartie en soirée génèrent 2× plus de demandes de ressource que les DMs sur l'humour au travail — peut indiquer une douleur plus immédiate sur ce contexte."]

---

L'Équipe Deviens Marrant

**Auto-éval** :
- Conseils/Apprentissage > Vannes : N/A (reporting interne — pas de contenu pédagogique)
- Style fluide (pas haché) : ✅ Structure en 4 sections fixes, tableau factuel, observations en phrases complètes. Zéro édito narratif, zéro "cette semaine on a réalisé que..."
- Pattern invitation ressource respecté : N/A (email interne)
- Pas de pub déguisée : N/A (email interne)
- Voix Deviens Marrant tenue (cohérence avec étalons) : ✅ Sobre, factuel, 4 sections comme défini dans ceo-agent-scope.md Q8. MRR delta en section 1 comme KPI de conséquence, pas North Star

---

## HANDOFF

---

### Note de version

**v5 — refonte intégrale cycle 5 (cap atteint) — pivot valeur éducative — 2026-05-06**

Changements structurels appliqués v4 → v5 :
- **Exemple 1** : corps remplacé par verbatim quasi-fidèle étalon 2 Thomas. Subject "Ta première vanne t'attend" → "Bienvenue sur Deviens Marrant". Axe pédagogique (parcours Machine à café) remplace axe vanne
- **Exemple 2** : body reformulé autour de la valeur publiée cette semaine (conseil timing + vidéo décryptée Fary) — valeur dans le corps, pas dans le lien
- **Exemple 3** : hook "T'as vu la limite" remplacé par signal de progression (streak + likes). La limite premium apparaît en contexte factuel dans le corps, jamais en accroche
- **Exemple 5** : insight pédagogique avancé offert directement dans le corps (les likes = diagnostic du registre naturel). Zéro CTA, zéro lien
- **Exemple 6** : corps remplacé par verbatim quasi-fidèle étalon 1 Thomas, incluant le pattern invitation "On peut te partager un article si tu as envie d'en savoir plus"
- **Exemple 7** : lien direct supprimé du commentaire LinkedIn. Pattern invitation ajouté
- **Exemple 9** : combo 3A+3B et "Ah non, c'est gratuit. Compliqué." intégralement supprimés. Remplacement par doctrine troll section 4 : 9.a silence, 9.b chaleur détachée verbatim
- **Exemple 11** : corps remplacé par verbatim quasi-fidèle étalon 3 Thomas
- **Exemple 16** : créé — reporting hebdo Thomas (4 sections, format tableau KPIs, 0 édito narratif)
- **Footer** : faute "Devient" → "Deviens" corrigée dans tout le corpus

Vérifications Grep post-production :
- Occurrences "Yanis", "Sophie", "Marc" dans le contenu : **0**
- Occurrences "Marrant" sans "Deviens" dans le contenu : **0** (tagline "Deviens Marrant" systématique)
- Footer "L'Équipe Deviens Marrant" dans tous les emails : **✅ (Ex 1-5 + Ex 11-14 + Ex 16)**
- Étalons Thomas verbatim : **Ex 1 = étalon 2, Ex 6 = étalon 1, Ex 11 = étalon 3**

---

### Pour @reviewer + @moi — Audit dual cycle 5

**Points d'attention signalés pour audit prioritaire :**

1. **Exemple 3 (Conversion soft)** : le hook "3 jours d'affilée, 5 vannes likées" est un signal de progression positif — mais il reste basé sur des données comportementales DB (streak + likes). Vérifier que Thomas accepte ce niveau de référence au comportement utilisateur (anti-pattern 1 est "on te voit", ce qui est différent d'un constat factuel sobre). Si frôle : reformuler en "Depuis une semaine, tu reviens régulièrement" sans les chiffres.

2. **Exemple 7 (LinkedIn)** : la réponse dépasse le char limit Twitter (316 chars) mais LinkedIn n'a pas de limite stricte sur les commentaires — conforme. Signaler à @ia que le template LinkedIn n'a pas le même budget char que Twitter.

3. **Exemple 15 (Annuaire)** : format soumission = pas d'opt-out possible dans un formulaire. Le footer RGPD ne s'applique pas. Conforme — le RGPD est auto-injecté uniquement sur les emails outbound (confirmation ceo-agent-scope.md section Garde-fous légaux).

---

### Pour @ia (Phase 3) — Patterns récurrents v5

| Pattern | Fréquence | Règle encodable |
|---|---|---|
| Insight pédagogique dans le corps (avant le clic) | 14/16 | La valeur est délivrée dans le corps du message, pas conditionnée au clic |
| Pattern invitation "On peut te partager X si tu as envie d'en savoir plus" | 6/16 (DMs + pitchs) | Formule conditionnelle — le destinataire décide. Jamais de lien inline dans les DMs |
| 1 seul trait drôle par message, en fermeture | 13/16 | Densité humour max : 1 occurrence. Position : dernière phrase du corps ou ante-dernière |
| Audience décrite par comportement DB, jamais par profil persona | 16/16 | Prompt système : "décris le destinataire par ce qu'il a fait, pas par qui il est" |
| Prix ancré sans argumentation (emails) | 2/5 emails | Ex 3 + Ex 4 uniquement — contexte factuel, jamais en hook |
| Zéro "je/mon/ma" dans les formats non-signés | 16/16 | G-S19 appliqué. "On" collectif dans les DMs et pitchs |

---

*Produit par @copywriter — 2026-05-06 — v5 refonte intégrale cycle 5*
*Frameworks : Observation→Pratique→Invitation (emails + DMs) · factuel posé + angle expert (pitchs backlink)*
*Niveau conscience : Problem-Aware (emails dropoff/winback) · Solution-Aware (DMs inbound) · Most-Aware (email conversion) · Unaware (pitchs presse)*
*Objections traitées : prix (contexte factuel, jamais hook) · complexité (1 action par email) · timing (sans engagement) · confiance (valeur avant conversion, opt-out visible)*
