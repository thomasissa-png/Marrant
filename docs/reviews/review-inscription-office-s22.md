# Relecture à l'aveugle : lettre de la semaine incluse d'office (s22)

Date : 25/10/2026 · Relecteur : @reviewer (aveugle, `docs/reviews/` non lu)
Règle de référence (décision de Thomas, hors périmètre) : incluse d'office pour tout Premium payant ; arrêt en un clic dans chaque lettre et depuis le profil ; un arrêt explicite reste valable après réabonnement ; aucune offre ; pas de nouvelle mention juridique au-delà de la cohérence.
Code de vérité : `lib/lettre/hebdo.ts` (`recoitHebdo` l.85, `arretExplicite` l.68) : reçoit = Premium + pas d'opposition globale (`emailOptOut`) + pas d'arrêt explicite ; `fin-premium` n'est pas un arrêt explicite, donc un réabonné repart d'office, sauf arrêt explicite antérieur.

## Verdict

**NO-GO : 6/10, 5 bloquants.** Le pied, la page d'arrêt et l'article 10 sont justes sur le fond. Mais quatre textes disent quelque chose de faux dans un cas réel (lettre arrêtée, réabonné qui avait arrêté, compte en opposition, fin de Premium), et la confidentialité parle encore de « l'ancienne case ». Les corrections sont courtes : une phrase ou une condition chacune, sans nouvelle mention juridique.

| Critère | Note | Commentaire |
|---|---|---|
| Vérité | 4/10 | 4 phrases fausses dans un état réel (B1, B2, B3, B5) |
| Cohérence profil / paiement / pied / CGU / confidentialité | 6/10 | CGU et confidentialité se contredisent sur le réabonnement (B3) ; reste « case » (B4) |
| Clarté et ton | 7/10 | Tutoiement tenu, phrases nettes ; ligne du profil trop dense, « la lettre » ambiguë dans la confidentialité |
| Forme des captures | 7/10 | Rendu propre, mais seul l'état par défaut est capturé |
| Tirets cadratin / demi-cadratin | 10/10 | Aucun (Grep `[—–]` vide sur les textes et les 3 pages) |
| Mention IA | 10/10 | Aucune |

## Bloquants

### B1. Retour de paiement : faux pour un réabonné qui avait arrêté la lettre (et pour un compte en opposition)
`lettre-hebdo-s21.ts:35`, affiché sans condition (`abonnement/success/page.tsx:155-159`, capture `v4-retour-paiement-390.png`).
- Actuel : « Chaque jeudi, la lettre de la semaine arrive dans ta boîte. Tu peux l'arrêter en un clic. »
- Problème : la règle dit justement qu'un arrêt explicite survit au réabonnement. Ce réabonné lit « arrive dans ta boîte » et ne reçoit rien. C'est la même chose pour un compte `emailOptOut`.
- Proposé (recommandé) : afficher la ligne selon l'état renvoyé par `GET /api/lettre-premium/preference` :
  - reçoit (`enabled` et pas d'opposition) : « Chaque jeudi, la lettre de la semaine arrive dans ta boîte : elle est incluse dans ton abonnement. Tu peux l'arrêter en un clic, depuis chaque lettre ou ton profil. »
  - arrêt explicite : « Ta lettre de la semaine reste arrêtée, comme tu l'avais demandé. Tu peux la reprendre depuis ton profil. »
  - opposition : pas de ligne.
- Solution de repli si on ne veut pas de condition (vraie pour tous) : « Ton abonnement comprend la lettre de la semaine, envoyée chaque jeudi. Tu la règles depuis ton profil. »

### B2. Ligne du profil : « arrive à » reste affiché quand l'interrupteur est coupé
`lettre-hebdo-s21.ts:40`, rendue sans condition sur `pref.enabled` (`lettre-hebdo-reglage.tsx:138-144`).
- Actuel : « La lettre de la semaine arrive à {email}. Si tu reçois déjà la lettre du mois, elle est mise en pause tant que tu reçois celle de la semaine, puis reprend quand tu arrêtes. deviens-marrant SAS, l'éditeur du site, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : Confidentialité. »
- Problème : si la lettre est arrêtée, la phrase « arrive à » est fausse. La phrase est aussi trop dense (7 lignes en 390 px) et commence par une minuscule.
- Proposé (vrai dans les deux états) : « Incluse dans ton abonnement, elle part chaque jeudi à {email} tant que ce réglage est activé. Si tu reçois aussi la lettre du mois, elle est en pause pendant ce temps, puis reprend quand tu arrêtes celle-ci. L'éditeur du site, deviens-marrant SAS, est responsable de l'usage de ton adresse pour cette lettre. Détails et droits : Confidentialité. »

### B3. Confidentialité, durée : contredit le réabonnement d'office (CGU art. 10, `hebdo.ts:18-19`)
`lettre-hebdo-s21.ts:153`, capture `v4-confidentialite-section-lettre-390.png`.
- Actuel : « Si tu l'arrêtes ou si ton abonnement prend fin, on garde la date et la façon dont elle s'est arrêtée, pour respecter ton choix et ne pas t'écrire de nouveau sans que tu le demandes. »
- Problème : après une fin de Premium, un réabonné la reçoit de nouveau sans rien demander (CGU : « Si tu te réabonnes, elle reprend »). En plus, une fin de Premium n'est pas un « choix ».
- Proposé : « Si tu l'arrêtes, on garde la date et la façon dont tu l'as fait, pour respecter ton arrêt, même si tu te réabonnes plus tard. Si ton abonnement prend fin, on garde la date de fin : si tu te réabonnes, la lettre reprend. »

### B4. Confidentialité, données : il reste une mention de « l'ancienne case »
`lettre-hebdo-s21.ts:147`.
- Actuel : « Si tu l'avais activée avec l'ancienne case, on garde aussi la date, la version du texte accepté et l'endroit où tu l'as fait. »
- Problème : c'est une trace de la case à cocher. Si la case n'a jamais été visible en production (les inscriptions sont fermées jusqu'à s22, `config/lettre.ts:148`), la phrase décrit des données qui n'existent pas.
- Proposé : compter en production les lignes `PremiumLetterPreference` enregistrées sous `lettre-hebdo-premium-v1`. S'il n'y en a aucune, supprimer la phrase. S'il y en a, la remplacer par : « Si tu l'avais activée toi-même avant le 25 octobre 2026, on garde aussi la date, la version du texte affiché et l'endroit où tu l'as fait. »

### B5. CGU art. 10 : « sans rien faire » ne prévoit pas les comptes en opposition
`lettre-hebdo-s21.ts:139`, capture `v4-cgu-article-10-390.png`.
- Actuel : « La lettre de la semaine est incluse dans l'abonnement Premium : tu la reçois sans rien faire, et tu peux l'arrêter en un clic [...]. Elle est envoyée chaque semaine, le jeudi, à l'adresse e-mail de ton compte, tant que ton accès Premium est actif. »
- Problème : `recoitHebdo` exclut `emailOptOut` sans exception. Pour ces comptes, l'affirmation est fausse, et le profil leur dit l'inverse (`UI.opposition`).
- Proposé (ajout de cohérence, pas une nouvelle mention) : « [...] tu la reçois sans rien faire, sauf si tu nous as demandé de ne plus recevoir nos e-mails, et tu peux l'arrêter en un clic, dans chaque lettre ou depuis ton profil, sans résilier. [...] »

Condition liée : la vérité de B5 et de la CGU (« sans rien faire ») dépend de la suppression de l'exigence « adresse vérifiée ». Ce qui reste dans `hebdo.ts` : la condition l.87, le commentaire l.12-13 et le champ `emailVerified` l.44. Le composant n'a déjà plus cette branche : il a changé pendant la relecture, la version lue en dernier est retenue. Ce qui reste dans les textes et les tests : `LETTRE_HEBDO_UI.adresseNonVerifiee` (l.58, sans point final, plus affiché) et le test `lettre-hebdo-ui-s21.test.tsx:141-146`, qui l'attend encore. Le GO exige que ces trois points soient supprimés ensemble.

## Ce qui est juste (à ne pas toucher)

- Pied de chaque lettre (`l.102-104`) : « Tu reçois cette lettre parce qu'elle est incluse dans ton abonnement Premium. » et « Arrêter cette lettre en un clic (cela ne change rien à ton abonnement) ». Les deux phrases sont vraies, et aucune offre n'y figure.
- CGU art. 10, phrase du réabonnement : « Si tu te réabonnes, elle reprend, sauf si tu l'avais arrêtée : ton arrêt reste valable, et tu peux la reprendre depuis ton profil. » Elle correspond exactement à `arretExplicite` et à `finPremiumLettreHebdo`.
- CGU : « ne contient aucune offre commerciale ». La confidentialité, finalité : « exécution du contrat ». La page d'arrêt : juste et sans culpabilisation.
- `succesArret` : « C'est arrêté. Ton abonnement continue. » Court, rassurant, dans le ton.

## Corrections non bloquantes (actuel → proposé)

| # | Où | Actuel | Proposé | Raison |
|---|---|---|---|---|
| M1 | Confidentialité, partie 7 (droits) et partie 8 (puce 1, paragraphe durée) | « la lettre » / « Lettre par e-mail » / « Lettre : tu restes inscrit » | « la lettre du mois » / « Lettre du mois par e-mail » / « Lettre du mois : tu restes inscrit » | Avec deux lettres, un abonné Premium peut croire que « retirer ton consentement à la lettre » vise l'hebdo. La CGU dit déjà « lettre du mois » |
| M2 | Confidentialité, droits (`l.155`) | « Ce qui t'a été envoyé avant reste valable. » | « Les numéros déjà reçus restent dans ta boîte. » | La formule vient du retrait d'un consentement ; elle ne veut rien dire pour un envoi prévu par le contrat. La reprise vient de la CGU |
| M3 | Confidentialité, finalité (`l.149`) | « Tu peux l'arrêter en un clic à tout moment : on s'arrête alors. » | « Tu peux l'arrêter en un clic à tout moment : plus aucun numéro ne t'est envoyé. » | « on s'arrête » est flou (on arrête quoi ?) |
| M4 | Confidentialité, données (`l.147`) | « Aucune adresse IP n'est gardée pour ce choix. » | « Aucune adresse IP n'est gardée pour cette lettre. » | Avec l'inscription d'office, il n'y a plus de « choix » à l'entrée |
| M5 | Profil, opposition (`l.57`) | « Tu nous as demandé de ne plus t'écrire : la lettre de la semaine ne t'est pas envoyée. Pour la recevoir de nouveau, écris-nous à contact@deviens-marrant.fr. » | « Tu nous as demandé de ne plus recevoir nos e-mails, hors ceux de ton compte et de ton abonnement : la lettre de la semaine ne t'est donc pas envoyée. Pour la recevoir, écris-nous à contact@deviens-marrant.fr. » | Les factures et les e-mails de sécurité partent toujours (page d'arrêt : « ils sont obligatoires ») ; « de nouveau » est faux pour qui ne l'a jamais reçue |
| M6 | Profil, libellé (`l.34`) | « Je reçois la lettre de la semaine » (juste sous le titre « La lettre de la semaine ») | « Je la reçois chaque jeudi » | Le titre de la carte est répété mot pour mot ; le jour apparaît là où on regarde |
| M7 | Profil, `succesActivation` (`l.50`) | « [...] Tu peux l'arrêter à tout moment depuis ton profil. » | « [...] Tu peux l'arrêter ici ou depuis chaque lettre, en un clic. » | Le message s'affiche déjà sur le profil ; il manque l'arrêt depuis la lettre |
| M8 | Profil, `succesArret` (`l.51`) | « C'est arrêté. Ton abonnement continue. » | « C'est arrêté. Ton abonnement continue, et tu peux reprendre la lettre ici quand tu veux. » | Facultatif : dit que l'arrêt est réversible et qu'il tient dans la durée |
| M9 | Pied et page d'arrêt | lien → page → bouton « Arrêter la lettre » | inchangé | Point d'attention seulement : par le lien, il faut deux gestes (ouvrir la page, appuyer sur le bouton) ; l'en-tête un clic (`arret-un-clic`) existe. C'est l'usage courant (pas de connexion, un seul bouton, la page protégée contre les scanners). « En un clic » reste défendable |
| M10 | `PROPOSITION_LETTRE_HEBDO` (`l.169-193`) | « Tant que tu ne coches pas la case, rien ne change pour toi. » | supprimer le texte et `proposerLettreHebdo`, ou les marquer « archive » | Ce n'est pas visible (fermé par `LETTRE_HEBDO_PROPOSITION_OUVERTE`), mais si quelqu'un rouvre l'interrupteur, un texte faux part |
| M11 | Confidentialité, données | « la façon dont tu l'as fait (lien dans l'e-mail, profil, ou demande à contact@...) » | « la façon dont elle a été arrêtée (lien dans l'e-mail, profil, demande à contact@..., ou adresse qui ne reçoit plus) » | Le code enregistre aussi `rebond`, `plainte` et `admin`, qui ne sont pas des gestes de l'abonné. C'est une mise en cohérence, à faire seulement si Thomas l'accepte, puisqu'il a demandé d'arrêter le juridique |

## Captures (v4, 8 fichiers lus)

- `v4-reglage-hebdo-profil-390/1440` : le rendu est propre, l'interrupteur est activé par défaut et la zone cliquable fait au moins 44 px. La ligne d'information prend 7 lignes en `text-xs` grisé sur mobile, ce qui est difficile à lire (B2 la raccourcit). En 1440, la ligne dépasse 180 caractères : la limiter à `max-w-prose`.
- `v4-profil-premium-390/1440` : sur la même page, l'interrupteur « Rappel de parcours » est à gauche du texte, et celui de la lettre est à droite. L'identité n'est pas la même : aligner les deux.
- `v4-retour-paiement-390` : la ligne est lisible et bien placée sous « Ton accès s'active… ». Le fond est faux (B1).
- `v4-cgu-article-10-390`, `v4-confidentialite-section-lettre-390`, `v4-confidentialite-droits-lettre-390` : la hiérarchie est claire, les paragraphes sont aérés. La capture de la section 8 s'arrête au milieu du paragraphe sur la durée (« Quand tu supprimes ton »). Il faut la refaire en entier.
- Captures manquantes pour valider : la lettre arrêtée (là où B2 se voit), l'opposition, les deux messages de succès, `finPrevue`, et la page d'arrêt (quatre états). Il manque aussi le retour de paiement, la CGU et la confidentialité en 1440, et le retour de paiement d'un réabonné qui avait arrêté la lettre (B1).

## Top 3

1. **B3 + B5 (CGU et confidentialité)** : ce sont les deux pages contractuelles. Aujourd'hui elles se contredisent sur le réabonnement (B3), et la CGU promet « sans rien faire » à des comptes exclus (B5). Une phrase chacune.
2. **B1 (retour de paiement)** : c'est le premier endroit où l'abonné découvre la lettre, et le texte ment exactement dans le cas que la règle de Thomas protège (arrêt qui survit au réabonnement). Afficher la ligne selon l'état.
3. **B2 (profil)** : « arrive à » s'affiche à côté d'un interrupteur coupé. Le texte proposé est vrai dans les deux états, et il corrige au passage la densité et la minuscule en début de phrase.

## Décisions à confirmer par Thomas

- B4 : la case a-t-elle été visible en production avant le 25/10 (lignes `lettre-hebdo-premium-v1` en base) ? Si non, on supprime la phrase.
- B1 : retour de paiement selon l'état (recommandé), ou phrase neutre de repli ?
- M11 : l'accepter comme mise en cohérence, ou la laisser de côté (pas de nouvelle mention juridique).

## Re-vérification

Une fois les corrections faites, chaque phrase retouchée repasse à l'aveugle (règle d'or s18). Il faudra aussi : 1) relancer les tests de textes « mot pour mot » (`lettre-hebdo-interrupteurs-s21.test.ts:94-97` vérifie que les textes figurent dans l'avis @legal : il faut mettre à jour l'avis ou le test pour les phrases retouchées) ; 2) refaire les captures ; 3) faire un Grep `case` dans les textes de la lettre de la semaine visibles par le public (il doit rester seulement la lettre du mois).

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-inscription-office-s22.md`
- Décision : NO-GO, 6/10, 5 bloquants (B1 retour de paiement, B2 ligne du profil quand la lettre est arrêtée, B3 confidentialité contre CGU sur le réabonnement, B4 reste « ancienne case », B5 CGU sans l'exception de l'opposition) ; plus une condition : supprimer `emailVerified` dans `hebdo.ts:87`, `adresseNonVerifiee` et son test.
- Agents à relancer : @copywriter (B2, B3, B5, M1 à M8) ; @fullstack (condition d'affichage B1, suppression de l'adresse vérifiée, M10, captures complètes) ; Thomas (B4, choix B1, M11).
---
