# Annexe du tour 13 : preuve de la formule de résiliation, diff mesuré, décisions

Les 10 blocs validés (B1, B2, B6, B7, B11, B14, B15, B16, B17, B18) sont recopiés sans une retouche dans `textes-finaux.md`. Seuls les 7 autres changent.

## 1. Preuve dans le code : « en un clic » est faux, « depuis ton profil » est vrai

Question posée : la résiliation tient-elle en un clic depuis le profil, ou en deux écrans (profil, puis portail Stripe) ?

**Chemin réel, lu dans `apps/web/src` :**

1. **Le bouton est dans le profil.** `components/profil/abonnement-card.tsx` : `{bouton("resilier", T.resilier)}` (l. 128) dans la carte « Abonnement » du profil, pour les états `actif` et `premium-sans-resume` ; le même bouton reste visible en cas d'impayé (l. 94). Libellé : `resilier: "Résilier ton contrat"` (`config/textes/compte.ts` l. 85), avec la mention « Si tu résilies, tu gardes Premium jusqu'au {date}, sans nouveau prélèvement » (l. 86). Le commentaire du composant (l. 126) le désigne comme « Bouton légal de résiliation en ligne (L.215-1-1) ».
2. **Le pied de page y mène directement.** `components/layout/footer.tsx` l. 26 : lien `/profil#abonnement` avec le libellé `TEXTES_ABONNEMENT.resilier` (« Résilier ton contrat »). La carte défile jusqu'à elle (abonnement-card.tsx l. 60-62).
3. **Le clic ne résilie pas : il ouvre le portail Stripe.** `hooks/use-subscription-summary.ts` l. 36-46 : `openPortal("resilier")` appelle `POST /api/user/subscription/portal` avec `{ parcours: "resilier" }`, puis redirige vers l'URL renvoyée.
4. **Le portail s'ouvre directement sur le parcours d'annulation.** `app/api/user/subscription/portal/route.ts` l. 14-22 : `flowData("resilier", …)` renvoie `{ type: "subscription_cancel", subscription_cancel: { subscription }, after_completion }` ; l. 56-61 : `getStripe().billingPortal.sessions.create({ customer, return_url, flow_data })`.
5. **Repli.** Même route l. 62-66 : si Stripe refuse le parcours ciblé, la route renvoie le portail simple (`createPortalSession`, `lib/stripe.ts` l. 247-253). Dans ce cas, la personne arrive sur l'accueil du portail et doit y chercher l'annulation.
6. **La résiliation est effective dans Stripe, pas sur le site.** L'écran de confirmation est hébergé par Stripe (le flux `subscription_cancel` affiche une page de confirmation avant d'annuler). Cet écran n'est pas dans le code du dépôt : seul un test réel en mode test Stripe le prouve. Ce qui est prouvé par le code : il y a au minimum un clic sur le site (« Résilier ton contrat »), puis une page Stripe qui n'appartient pas au profil.

**Conclusion.**

- « Résiliable en un clic depuis ton profil » : **faux ou, au mieux, non démontrable** (au moins deux écrans, dont un hébergé par Stripe, et un repli qui en ajoute un troisième). Écarté.
- **« Résiliable depuis ton profil » : vrai**, dans les conditions suivantes : la personne est connectée, son abonnement passe par Stripe (état `actif`, `premium-sans-resume` ou impayé avec portail), le bouton « Résilier ton contrat » est dans la carte « Abonnement » du profil (et accessible par le lien du pied de page). « Quand tu veux » reste vrai : aucune durée minimale ni préavis dans le code ; Premium est conservé jusqu'à la fin de la période payée.
- Cas non couvert : un Premium sans client Stripe (`premium-hors-stripe`, par exemple un accès accordé ou un achat mobile géré par RevenueCat, `app/api/iap/revenuecat-webhook/route.ts`) n'a pas de bouton. Les blocs s'adressent à des visiteurs qui vont payer par Stripe : la formule reste vraie pour eux.

**Deux textes du dépôt disent « en un clic » à tort et sont à corriger par @fullstack (hors périmètre copy des 7 blocs, non modifiés ici) :**

- `apps/web/src/lib/llms-content.ts` l. 78 : « …sans engagement, résiliable en un clic depuis le profil. »
- `apps/web/src/lib/llms-content.ts` l. 154 : « …se résilient en un clic depuis le profil. »

Le pack du tour 12 contenait lui aussi ce fait (« en un clic depuis le profil »). Il est corrigé dans `pack-tour13.md` (faits vrais) : « depuis le profil », avec l'écran Stripe de confirmation signalé.

## 2. Diff réel par rapport au tour 12 (mesure, pas annonce)

| Bloc | Passage changé | Ce qui ne bouge pas |
|---|---|---|
| B3 | `[S20]` réécrite (186 caractères, limite 190) | titre, paragraphe, bouton, lien, pastilles |
| B4+B5 | `[S13]` : « en ligne » devient « depuis ton profil » (3 mots) | tout le reste, mot pour mot |
| B8 | `[S15]` : 3e phrase (« C'est le rôle de l'exercice » devient « L'exercice … est fait pour ça ») et dernière phrase (scindée en deux) ; `[S16]` : formule de résiliation | `[S14]`, 2 premières phrases, boutons, `[S25]`, lien |
| B9 | `[S15]` : 1re phrase réécrite, favoris ajoutés ; `[S16]` : formule de résiliation | `[S14]`, 2e phrase, boutons, `[S25]`, lien |
| B10 | `[S15]` : « Avec, en plus, » supprimé, phrase 3 réécrite avec un verbe, favoris dans la liste, « petites doses » ; `[S16]` : formule de résiliation | `[S14]`, « de quoi la revoir pour faire rire, plus seulement pour rire », boutons, `[S25]`, lien |
| B12 | Ligne Premium : phrase de profil en tête pour les 5 profils, clause « dont … » retirée, formule de résiliation | phrase d'intro, bouton, lien, intro, prix (identiques) |
| B13 | Ligne de garantie : « en ligne » devient « depuis ton profil » (3 mots), pour les deux résultats | tout le reste, mot pour mot |

Intouchables vérifiés : prix (2,99 € / 24,99 € / 2,08 € / 10,89 €), 14 jours, nombres d'étapes et durées, titres d'étapes, libellés de boutons et de liens, `[S14]` de B8/B9/B10, `[S25]`, slugs, chiffres. Aucun n'a bougé.

## 3. Décisions par bloc

- **B3.** Note commencée par « Sans compte » (le nom « Répartie » est inconnu du visiteur) ; « un défi à tenter » ; étape payante nommée : « Retourner les piques avec le sourire » (la 3e de Répartie), qui répond mot pour mot à « Tu restes muet quand on te chambre ? » du paragraphe ; incise « l'un des 5 parcours » retirée (le lien dit « Ouvrir les 5 parcours ») ; « les 4 autres parcours » retiré aussi pour tenir 190 ; le conseil n'est plus listé (vrai, mais la place manquait ; l'étape contient bien un conseil). Longueur : 14 + 22 + 19 + 10 + 10 + 10 + 15 + 42 + 15 + 29 = 186 caractères, comptés à la main par segments (à revérifier par `.length` au branchement).
- **B4+B5, B13.** Seul changement : la formule de résiliation.
- **B8.** « est fait pour ça » (et non « sert à ça ») pour garder la voix de pote ; la dernière phrase est scindée : Premium ouvre les 5 parcours, puis « Et tes favoris te gardent celle-ci sous la main », pour qu'un seul « avec » ne porte plus trois éléments et que les favoris soient rattachés à la vanne de la fiche.
- **B9.** La phrase d'ouverture est « À froid, rater ne coûte rien », qui reprend la meilleure idée du bloc au lieu de redire le titre. Plus de « Mieux vaut ». Favoris ajoutés (ils existent pour les conseils) dans une phrase séparée, comme B8.
- **B10.** « à petites doses » ; « Avec, en plus, » supprimé ; les favoris rejoignent « points clés » et « exercice » (ils existent pour les vidéos) ; dernière phrase : « Le même abonnement ouvre les 5 parcours en entier : 15 à 20 minutes par étape, un défi à chaque fois » (un verbe, pas de répétition de « Premium »). « De quoi la revoir pour faire rire, plus seulement pour rire » est conservé tel quel.
- **B12.** Chaque ligne Premium commence par une phrase propre au profil qui reprend un mot de sa description ou de « Ta force » (vérifiés dans `quiz-data.ts` l. 40-102) et donne le titre d'étape payante avec son rang :

| Profil | Mot repris | Étape citée |
|---|---|---|
| L'Observateur | « tu remarques » (description) | « L'œil de l'observateur », 3e de Confiance |
| Le Storyteller | « les autres attendent la suite » (description) | « Une chute qui se lit de deux façons », 4e de Storytelling |
| L'Absurde | « des idées que personne n'aurait mises… » (description) | « Sentir le bon moment », 2e étape de Machine à Café |
| Le Punchlineur | « tu sais te servir d'un silence » (description) | « Le rythme et les silences », 2e de Répartie |
| Le Taquin | « tu renvoies chaque balle » (« Ta force », exemple de la consigne) | « Retourner les piques avec le sourire », 3e de Répartie |

  **L'Absurde, le plus faible : ce qui a été fait.** Les trois étapes de Machine à Café sont (1) « Des vannes courtes, faciles à ressortir » (gratuite, donc non citable comme étape payante), (2) « Sentir le bon moment », (3) « Raconter une anecdote qu'on écoute jusqu'au bout ». Le pont est construit sur une phrase de `parcours-reecriture-s17.json` (l. 160, `moduleDetail` de l'étape 2, public sur /parcours) : « Tu arrêtes de te demander si tu es assez drôle, tu te demandes seulement si c'est le bon moment. » D'où : « Tes idées que personne n'attendait tombent mieux au bon moment : c'est le sujet de « Sentir le bon moment », la 2e étape de Machine à Café. » Aucun contenu d'étape inventé : seul le titre et le sujet public sont cités. Limite assumée : le lien entre l'absurde et le « bon moment » reste une affirmation de métier (une idée décalée tombe mieux au bon moment), pas un fait du site. L'étape 3 a été écartée : elle parle de détails précis, ce qui s'éloigne le plus du profil.
- **B12, repli.** Si la table n'a pas de ligne ou si le module est introuvable, la phrase de profil est omise, jamais remplacée par une phrase d'un autre profil (cas `STORYTELLER` avec Storytelling non publié : le code recommande Machine à Café et la phrase « ta chute a son étape » serait fausse).

## 4. Contrôles faits

- Tiret cadratin ou demi-cadratin dans `tour13/` : 0 (Grep).
- « en un clic » : absent des 7 blocs ; présent seulement dans la règle d'écriture (textes-finaux) et dans les faits vrais du pack, sous forme d'interdiction, et dans B18 pour la désinscription de la lettre (vrai, sans rapport avec Premium).
- Aucune promesse de résultat, aucune garantie ajoutée ; le remboursement du premier paiement sur demande dans les 14 jours est le fait existant.
- Favoris : vannes, conseils, vidéos, tous dans Premium (faits vrais). Le « 5 » qui compte les parcours reste `{PARCOURS_COUNT}`.
- Aucun concurrent nommé, aucun témoignage.

## 5. Décision à prendre par Thomas

Deux formules vraies coexistent désormais : « Résiliable en ligne quand tu veux » (B2, B7, B14, validés) et « Résiliable depuis ton profil quand tu veux » (les 7 blocs du tour 13). Je ne touche pas aux blocs validés. Si Thomas veut une formule unique, B2 `[S9]`, B7 `[S26]` et B14 `[S16]` repasseront par la relecture à l'aveugle avec la nouvelle formule (règle d'or P0 s18).
