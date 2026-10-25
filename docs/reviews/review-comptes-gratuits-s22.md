# Relecture à l'aveugle express : lettre du mois envoyée aux comptes (s22, 25/10/2026)

**Note : 7/10. Verdict : NO-GO**, 3 bloquants, tous corrigeables en quelques mots. Une fois corrigés : GO sans nouvelle relecture complète. Il suffira de revérifier les 3 phrases.

Périmètre lu : les 7 textes du brief ; captures `v8b-*` et `v10-*` (390 et 1440) ; `docs/qa/apercu-mensuelle-n1-s22.md` (3 versions + cas particulier) ; partie 8 et partie 7 de `apps/web/src/app/(dashboard)/confidentialite/page.tsx` (le chemin `(legal)` du brief n'existe pas), avec `config/textes/lettre-s21.ts:278` et `config/textes/lettre-hebdo-s21.ts:167-178`. J'ai aussi vérifié le code d'envoi : `lib/lettre/compte.ts`, `lib/lettre/entretien.ts`.

## Ce qui tient

- Textes 3, 4, 5, 6, 7 : vrais, clairs, en accord avec les faits. Le texte 5 (« La lettre du mois s'arrête aussi, sauf si tu t'y es inscrit séparément. ») et le texte 3 disent la même chose avec les mêmes mots. Le pied « tu as un compte » est juste.
- Tutoiement simple partout, zéro tiret cadratin dans les 7 textes et dans la partie 8 rendue.
- Rendu propre sur les captures : le profil désactivé (390), le retour de paiement (1440), la création de compte e-mail (390), Google (1440) et la partie 8 (390) ne débordent pas et n'affichent ni jeton ni texte brut.
- Aperçu : les 3 versions ne diffèrent que par le PS d'invitation et le pied. « À bientôt, » est bien en place dans les trois.

## Bloquants (retouche minimale, mot pour mot)

**B1. Texte 2 (`lettre-s21.ts:279`) : « si tu as un compte » couvre aussi les abonnés Premium, ce qui est faux.** Un abonné Premium a un compte. Lu tel quel, il recevrait la lettre du mois « d'office, intérêt légitime » même après avoir arrêté la lettre de la semaine. Ça contredit la puce juste au-dessus (exécution du contrat), le texte 3 (« plus aucun numéro ne t'est envoyé »), le texte 5 et le code (`compte.ts:37`, `plan === "PREMIUM"` exclu).
- Avant : « T'envoyer la lettre du mois si tu as un compte, sans l'invitation à t'abonner : intérêt légitime, et tu peux te désinscrire en un clic à tout moment. »
- Après : « T'envoyer la lettre du mois si tu as un compte **sans abonnement**, sans l'invitation à t'abonner : intérêt légitime, et tu peux te désinscrire en un clic à tout moment. »

**B2. Phrase existante devenue incomplète, `page.tsx:189` : « T'envoyer la lettre mensuelle : ton consentement (case à cocher puis confirmation par e-mail), que tu peux retirer en un clic ».** Cette ligne présente le consentement comme la base de la lettre, sans aucune condition. Deux lignes plus bas, la même lettre, appelée cette fois « lettre du mois », repose sur l'intérêt légitime. Le titulaire d'un compte lit deux bases pour une lettre qui porte deux noms, et il peut croire que ce sont deux lettres différentes.
- Après : « T'envoyer la lettre du mois **si tu t'y inscris par e-mail** : ton consentement (case à cocher puis confirmation par e-mail), que tu peux retirer en un clic »

**B3. Phrase existante devenue fausse pour les comptes, `page.tsx:196` : « Lettre du mois : tu restes inscrit tant que tu ne te désinscris pas. Tous les 2 ans, on te demande par e-mail si tu veux la garder ; sans clic de ta part, on te désinscrit. […] on garde 3 ans ton adresse, la date et la version de ton accord […] »** Pour un compte, rien de tout cela n'existe : pas de reconfirmation (`entretien.ts:66` ne traite que les inscrits par adresse `CONFIRMED`), pas d'« accord », pas de trace de 3 ans (l'arrêt est noté sur le compte, `compte.ts:10`). Le titre « Lettre du mois : » fait pourtant porter la phrase sur tous les destinataires. On garde la phrase et on la limite aux inscrits par adresse, sans rien ajouter de juridique.
- Avant : « Lettre du mois : tu restes inscrit… »
- Après : « **Lettre du mois par e-mail** : tu restes inscrit… » (même libellé que la puce de la ligne 184, « Lettre du mois par e-mail, si tu t'y inscris »)

## Mineurs (3 au plus, non bloquants)

1. **Partie 7, `page.tsx:171`** : « Tu peux retirer ton consentement à la lettre du mois… ». Le titulaire d'un compte n'a donné aucun consentement. Proposition : « Tu peux te désinscrire de la lettre du mois à tout moment, avec le lien en bas de chaque e-mail : ce que tu as reçu avant reste valable. »
2. **Profil et retour de paiement** (captures v8b) : « c'est la lettre du mois, envoyée à tout le monde ». C'est approximatif : elle ne part ni aux désinscrits ni aux visiteurs sans compte ni inscription. Proposition : « envoyée aussi aux inscrits et aux comptes ». Si on préfère ne pas y toucher, ce n'est pas faux au point de bloquer.
3. **Texte 1** : « la lettre du mois, une fois par mois » est redondant. Sur la capture Google 1440, « un clic. » se retrouve seul sur sa ligne. Proposition : « Tu recevras aussi la lettre du mois. Désinscription en un clic. », avec une espace insécable dans « en un clic ».

## Handoff → session principale

- Fichier produit : `docs/reviews/review-comptes-gratuits-s22.md` (rien d'autre n'a été modifié, rien n'a été commité).
- À corriger (copy) : B1 dans `apps/web/src/config/textes/lettre-s21.ts:279` ; B2 et B3 dans `apps/web/src/app/(dashboard)/confidentialite/page.tsx:189` et `:196`. Ensuite, revérifier uniquement ces 3 phrases, puis faire de nouvelles captures v10 de la confidentialité (390 et 1440).
- Les tests qui vérifient le texte exact de `CONFIDENTIALITE_LETTRE_COMPTE` ou de la partie 8 devront suivre.
