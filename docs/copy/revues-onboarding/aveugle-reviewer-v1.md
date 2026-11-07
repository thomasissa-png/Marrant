# Relecture à l'aveugle v1 : onboarding Premium s23 (E0, E1, E2)

Relecteur : @reviewer, 07/11/2026. Texte relu : `docs/copy/onboarding-premium-s23-emails.md` (non modifié). Revues précédentes et historique non lus. Référence ton : `docs/copy/ton-alex.md`. Faits vérifiés dans `apps/web/src`.

## Verdict

**8,75/10 : sous la barre (9/10). NO-GO en l'état**, GO probable après les 3 corrections obligatoires ci-dessous (estimation 9,2 si appliquées). Aucun fait faux trouvé dans le texte ; les écarts portent sur le cas annuel de la phrase 5C, les préheaders inexistants en texte seul et une redite objet/aperçu dans E1 PARCOURS.

## Notes

| # | Critère | Note | Preuve |
|---|---|---|---|
| 1 | Exactitude des faits | 9 | Vérifiés : `PARCOURS_COUNT` dynamique (`config/premium.ts:89`) ; carnets passés ouverts en Premium (`abonnement-vente.ts:127` « Toutes, carnets passés compris », `carnet/[mois]/page.tsx`) ; « exercices des fiches » = terme du site (`cta-pages.ts:285`) ; série et rythme « une étape par semaine » conseillé, jamais un verrou (`entrees-parcours.ts:61`, `parcours-detail.tsx:513`) ; « Ta question à l'équipe » depuis le profil, interrupteur ouvert, boîte alex@ (`question-equipe.ts:11,22`, `question-equipe-card.tsx:54`) ; lettre du jeudi incluse, arrêt depuis chaque lettre ou le profil (`lettre-hebdo-s21.ts:43`) ; bouton « Résilier ton contrat » (`compte.ts:89`) ; résiliation en fin de période (`cancel_at_period_end`, `stripe/webhook/route.ts:165`), donc « résilier la veille » évite bien le prélèvement ; rétractation 14 jours, remboursement intégral mensuel comme annuel (`paiement.ts:271,289`). Écart : E0 l.34 « La lettre de la semaine arrive chaque jeudi » tait qu'un jeudi par mois c'est la lettre du mois (`lettre-hebdo-s21.ts:43`, `:57`), ce que le site dit partout ailleurs. |
| 2 | Ton d'Alex, zéro tiret cadratin, zéro émoji, ni urgence ni culpabilisation | 9 | 0 tiret cadratin, 0 tiret demi-cadratin, 0 émoji (Grep sur le fichier). Tutoiement, « on », guillemets « ». E2 au niveau (« lever les yeux au ciel »). Seul frottement : E1 PARCOURS répète « t'attend » (objet + corps), léger effet de relance d'appli, à la limite de la pression douce. Signature « L'Équipe Deviens Marrant » alors que la réponse arrive chez alex@ : cohérent avec le « on » de la marque, pas une faute. |
| 3 | Clarté sur mobile, un seul appel (sauf E0) | 8,5 | E1 et E2 : courts, un seul lien (E1) ou une seule action « réponds » (E2). E0 : le bloc « Ensuite, à ton rythme » (l.36) fait une phrase d'environ 55 mots avec une parenthèse de 20 mots ; sur un écran de 375 px, c'est un pavé de 7 à 8 lignes (phrase d'étalon 2 C : signalé, pas corrigé). E1 PARCOURS : en texte seul, l'objet « Ta prochaine étape t'attend » puis l'aperçu « Salut X, Ta prochaine étape de parcours t'attend… » se lisent deux fois de suite dans la boîte. |
| 4 | Rétention de l'abonné qui pense résilier par précaution | 9 | La phrase 5 C (l.48) vise exactement ce réflexe, date en clair, sans pression ; E1 et E2 s'arrêtent dès qu'une résiliation est programmée (l.86), donc aucune relance de qui est parti. Le « Pour commencer » donne une première action en 1 lien. Limite : pour l'annuel, la même phrase pousse la réflexion au-delà de la fenêtre utile (voir O1). |
| 5 | Cohérence entre e-mails et variantes | 8,5 | Pas de contradiction de fond. Redites : E1 OUVERTS reprend E0 sans carnet presque à l'identique (même fait « toutes les étapes », même libellé « Choisir mon parcours : {url}/parcours ») sans la scène qui fait la force de E1 CARNET ; E1 PARCOURS : objet = première ligne. Règle de choix l.89 : abonné avec parcours en cours, rappel de parcours actif et sans carnet publié reçoit E1 PARCOURS, qui redit son rappel hebdomadaire (cas rare, le carnet étant mensuel). |
| 6 | Cadre légal | 8,5 | Bloc contractuel intact mot pour mot (comparé à `paiement.ts:279-299` : seule la ligne 293 « Tout est ouvert… » disparaît, comme annoncé). Mention d'arrêt E1/E2 présente, un clic sans connexion, `List-Unsubscribe`, calquée sur `parcours-emails.ts:75-76`. Préheaders sans promesse, mais **non rendus** : les e-mails sont en texte seul (`EmailRendu` = `subject` + `text`), donc les préheaders décrits n'existent pas pour le destinataire (O2). Phrase 5 C juste pour le mensuel ; pour l'annuel, elle est vraie mais placée juste avant la rétractation de 14 jours, elle invite à « se faire un avis » sur un an alors que seul le délai de 14 jours rembourse (O1). |

Note globale : moyenne 8,75/10.

## Corrections OBLIGATOIRES

**O1. E0, l.48 (phrase 5 C) : rendu conditionnel au mensuel.** Aucun mot changé (étalon validé), seule une condition de rendu s'ajoute :
`[si mensuel] Prends ton temps pour te faire un avis : d’ici le {dateLongue(prochain)}, tout est ouvert, et tu pourras encore résilier la veille.`
Et dans « Conditions de rendu », ajouter : `- [si mensuel] : formule mensuelle seulement. En annuel, la phrase n'est pas rendue : le paragraphe de rétractation (14 jours, remboursement intégral) est la seule fenêtre de décision qui rembourse, et un rappel part avant le renouvellement annuel.`
Motif : l'étalon 5 C (`etalons-onboarding-s23.md:144-147`) n'a été pesé que pour le premier renouvellement mensuel ; en annuel, « prends ton temps » sur douze mois, collé au délai de 14 jours, détourne de la seule fenêtre remboursée (risque de pratique trompeuse par omission). À faire confirmer par @legal ; si Thomas veut garder la phrase en annuel, c'est son choix, à consigner.

**O2. Préheaders des 5 objets (E0 l.19, E1 l.95, l.108, l.121, E2 l.159) : les marquer non rendus.** Remplacer chaque ligne `Préheader (… car.) : …` par :
`Aperçu dans la boîte (texte seul, pas de préheader) : « Salut {prénom}, » suivi de la première phrase du corps.`
Motif : la spec ne doit pas décrire un texte que personne ne verra ; un @fullstack qui l'appliquerait ajouterait une partie HTML à un e-mail contractuel. Voir avis sur le point ouvert 1.

**O3. E1 PARCOURS, l.107 : objet.** Remplacer `Ta prochaine étape t’attend` par :
`Une question sur ton parcours ?`
Motif : en texte seul, l'aperçu reprend la première ligne du corps (« Ta prochaine étape de parcours t’attend, là où tu t’es arrêté. »), l'objet actuel fait doublon et appuie deux fois sur « t'attend ». Le nouvel objet reprend le thème de l'e-mail validé par Thomas (J5 « Une question ? », 06/11) et la ligne « Une question, un doute ? » du corps. Phrase hors étalon (variante), donc modifiable.

## Corrections souhaitables

- S1. E0 l.34 : ajouter la lettre du mois pour rester exact, par exemple « …chaque jeudi (une semaine par mois, c’est la lettre du mois), incluse… » ; décision Thomas, phrase d'étalon.
- S2. E1 OUVERTS : lui donner la scène de l'étalon 3 A (« Quelqu’un te balance une remarque… ») avant la ligne parcours, pour ne pas être une copie de E0 sans carnet.
- S3. Règle l.89 : si rappel de parcours actif et pas de carnet, envoyer quand même E1 PARCOURS mais vérifier qu'il ne tombe pas la semaine du rappel (redite) ; à écrire dans la règle d'envoi.
- S4. E0 l.36 : si Thomas l'accepte, couper la parenthèse en une phrase à part (« Toutes les étapes sont ouvertes ; on conseille une par semaine, avec un rappel par e-mail sur demande. »).
- S5. @legal : dire si E0 doit annoncer en une ligne les deux e-mails d'accueil et leur arrêt (information au moment de la collecte), ou si le cadre D1 suffit.

## Avis sur les 3 points ouverts

1. **Préheaders en texte seul** : ne pas ajouter de partie HTML pour ça. Un aperçu se pilote déjà par la première phrase du corps, et ici elle est bonne partout (E0 « voici ce qui vient de s’ouvrir, et par où commencer », E1 CARNET la scène, E2 la question). Ajouter du HTML à E0 toucherait un e-mail contractuel validé mot pour mot, pour un gain nul. D'où O2 (retirer les préheaders de la spec) et O3 (le seul cas où l'aperçu fait doublon avec l'objet).
2. **Redite « confirmé » (objet) / « activé » (corps) dans E0** : à garder. La ligne « Ton abonnement Premium est activé. Bienvenue, et merci pour ta confiance. » fait la bascule entre la partie guide et la confirmation, et appartient au bloc validé (s16) ; l'écart objet/corps est léger et n'est pas une contradiction. Seul bémol, non bloquant : « Bienvenue » arrive après trois paragraphes, ce qui se lit sans gêne parce que l'ouverture accueille déjà.
3. **`BIENVENUE_PREMIUM.lettre` périmé** (`abonnement-vente.ts:175`, « s’active depuis ton profil ») : texte faux depuis l'inscription d'office, mais **invisible aujourd'hui** (rendu seulement si `LETTRE_HEBDO_PROMESSE`, à `false` dans `config/lettre.ts:152` et `config/lettre-hebdo-promesse-temporaire.ts:12`, deux constantes du même nom à unifier). Pas bloquant pour ces e-mails ; à corriger par @fullstack avant tout passage de l'interrupteur à `true`, sinon la page de retour contredirait E0 (« arrive chaque jeudi »). Le test `conversion-s21-textes.test.ts:122` fige l'ancien texte et devra suivre.

## Handoff

---
**Handoff → @orchestrator**
- Fichier produit : `docs/copy/revues-onboarding/aveugle-reviewer-v1.md`
- Décision : NO-GO à 8,75/10 ; 3 corrections obligatoires (O1 condition mensuel sur 5 C, O2 préheaders non rendus, O3 objet E1 PARCOURS), 5 souhaitables.
- Agents à relancer : @copywriter (O2, O3, S2), @legal (O1, S5), Thomas (O1 si l'annuel doit garder la phrase, S1, S4), @fullstack (point 3, hors de ces textes).
---
