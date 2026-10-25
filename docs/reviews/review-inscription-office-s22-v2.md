# Contre-relecture à l'aveugle : inscription d'office à la lettre de la semaine (s22, v2)

Date : 25/10/2026. Périmètre : `config/textes/lettre-hebdo-s21.ts`, `lib/lettre/hebdo.ts` (`recoitHebdo`, `arretExplicite`), `lib/lettre/etat-info-paiement.ts`, `components/lettre/lettre-hebdo-reglage.tsx`, `components/lettre/arret-lettre-hebdo.tsx`, `api/lettre-premium/preference/route.ts`, CGU art. 10, confidentialité parties 7 et 8, captures `v5-*-390.png` (17/17 lues). Règle d'inscription d'office prise comme acquise.

## Vérité par état

| État | Profil | Retour de paiement | Arrêt / pied | Verdict |
|---|---|---|---|---|
| Reçoit (office, sans ligne ou ligne active) | interrupteur activé, ligne vraie | `recoit` vrai | pied « incluse dans ton abonnement » vrai | OK |
| Arrêtée (profil, lien, admin) | interrupteur désactivé, ligne conditionnelle (« tant que ce réglage est activé ») vraie | `arretee` vrai | `dejaArretee` vrai | OK |
| Opposition (`emailOptOut`) | texte `opposition` | `opposition` | n/a | **FAUX dans un cas (B1)** |
| Fin prévue | ligne + « Elle s'arrêtera avec ton accès Premium le … » | n/a | n/a | OK |
| Réabonné après `fin-premium` | activé (`arretExplicite` faux) | `recoit` vrai | CGU « elle reprend » vrai | OK |
| Réabonné après arrêt explicite | désactivé | `arretee` vrai | CGU « ton arrêt reste valable » vrai | OK |

Cohérence profil / paiement / page d'arrêt / pied / CGU / confidentialité : alignée (incluse, sans rien faire, un clic, sans résilier, l'arrêt survit au réabonnement, la mensuelle en pause puis reprend). Plus de case à cocher ni d'adresse à vérifier côté hebdo (la « case à cocher » de la confidentialité concerne la lettre du mois, et c'est exact). Aucun tiret cadratin ni demi-cadratin (Grep sur les 9 fichiers concernés), aucune mention d'IA. Tutoiement tenu, phrases simples. Éditeur « deviens-marrant SAS » identique au pied (`LETTRE_MENTION_EDITEUR_NUMERO`).

## Bloquant

**B1. Le texte d'opposition est faux pour une adresse en rebond définitif.** `lib/delivrabilite/rebonds.ts:96-98` pose `emailOptOut = true` sur un rebond définitif, et `hebdo.ts:15-18` en fait LE filet qui remplace la vérification d'adresse (supprimée en s22). Ce compte voit alors au profil (`lettre-hebdo-reglage.tsx:113`) et au retour de paiement (`etat-info-paiement.ts:13`) : « Tu nous as demandé de ne plus recevoir nos e-mails, hors ceux de ton compte et de ton abonnement ». Il n'a rien demandé, et les e-mails de son compte ne lui arrivent pas non plus. Comme les adresses ne sont jamais vérifiées, une faute de frappe à l'inscription mène tout droit à cet état.
- Actuel (`LETTRE_HEBDO_INFO_PAIEMENT.opposition`, repris par `LETTRE_HEBDO_UI.opposition`) : « Tu nous as demandé de ne plus recevoir nos e-mails, hors ceux de ton compte et de ton abonnement : la lettre de la semaine ne t'est donc pas envoyée. Pour la recevoir, écris-nous à contact@deviens-marrant.fr. »
- Proposé (vrai dans les deux cas, aucune mention juridique nouvelle) : « La lettre de la semaine ne t'est pas envoyée : tu nous as demandé de ne plus recevoir nos e-mails, ou ils n'arrivaient plus à ton adresse. Pour la recevoir, écris-nous à contact@deviens-marrant.fr. »
- Autre option : exposer le motif dans `GET /preference` et prévoir deux variantes. Le texte retouché repasse l'aveugle (règle d'or).

## Mineurs (non bloquants, à grouper avec B1)

- **M1** Ligne du profil : « Si tu reçois aussi la lettre du mois, elle est en pause » se contredit (en pause, on ne la reçoit pas) et diffère des autres surfaces. Proposé : « Si tu es inscrit à la lettre du mois, elle est en pause pendant ce temps, puis reprend quand tu arrêtes celle-ci ou à la fin de ton accès Premium. » (la fin de Premium manque aussi, alors que la CGU la cite).
- **M2** Page d'arrêt : le titre « Arrêter la lettre de la semaine ? » reste une question en état succès et en état déjà arrêtée (captures `v5-arret-succes`, `v5-arret-deja-arretee`).
- **M3** Retour de paiement `arretee`, « comme tu l'avais demandé » : faux pour une ligne arrêtée par `rebond` dont l'opposition aurait été levée ensuite par l'équipe. C'est un cas limite, qui se règle avec la variante de motif de B1.
- **M4** Confidentialité, données : la liste des façons d'arrêter (« lien, profil, demande ») ne cite pas l'origine `rebond` / `plainte`, qui est pourtant enregistrée. Information à confirmer par @legal, sans nouvelle mention si @legal la juge couverte par la partie rebonds.
- **M5** Pied « Arrêter cette lettre en un clic » : le lien ouvre une page avec un bouton, ce qui fait deux clics (l'un-clic réel passe par l'en-tête `List-Unsubscribe`). Le choix est déjà validé en s21 (protection contre les scanners de liens), je le signale sans le rouvrir.

## Note et verdict

**8/10, NO-GO** (1 bloquant : B1). Le reste tient dans tous les états. Une fois B1 corrigé et repassé à l'aveugle (M1 de préférence dans la même passe), le niveau attendu est ≥ 9.

---
**Handoff → @orchestrator**
- Fichier produit : `/home/user/Marrant/docs/reviews/review-inscription-office-s22-v2.md`
- Décisions : NO-GO 8/10. B1 : texte d'opposition faux en cas de rebond définitif (correction proposée ci-dessus).
- Points d'attention : le texte corrigé repasse l'aveugle. Agents : @copywriter pour B1 et M1, @fullstack si on choisit la variante par motif.
---
