# Question de motif de résiliation : spec UX (s23, v2 après cadre @legal, 06/11/2026)

Sources : demande de Thomas (06/11), `docs/analytics/resiliations-s23-analyse.md` (H1 à H4, §4, §5), `docs/legal/resiliation-onboarding-cadre-s23.md` (partie A : A5, A6, A7, B1 à B5, C1 à C3), personas, code lu (`footer.tsx`, `abonnement-card.tsx`, `use-subscription-summary.ts`, `api/user/subscription/portal/route.ts`). Le cadre @legal est une base de prudence, à valider par un avocat (sources secondes). **Changement v2** : la v1 insérait une page AVANT Stripe ; le cadre l'interdit (3 clics max, Stripe = la confirmation unique, motif jamais sur un écran à part avant). La page est donc déplacée APRÈS la résiliation.
Audience : Yanis (introverti, mobile le soir), Sophie (mobile, trajet), Marc (sobre, veut du concret). Ton : `docs/copy/ton-alex.md` (tu, pote bienveillant, pas de vanne : une vanne moyenne vaut moins que pas de vanne). Textes PROVISOIRES, à valider par Thomas (étalons, P0 s8).

## 1. Comparaison des deux placements conformes

| Critère | Option 1 : après, sur la page de retour de Stripe | Option 2 : sur notre propre confirmation (portail remplacé) |
|---|---|---|
| Clics depuis le pied de page | 3 (pied, « Résilier ton contrat », confirmation Stripe) : inchangé, A6 respecté | 3 (pied, profil, « Confirmer la résiliation ») : idem |
| Écran en plus avant la résiliation | Aucun (A5, A7, B2 respectés) | Aucun, mais notre écran devient LE récapitulatif D215-2/3 (identité, référence du contrat, contact : à construire et à faire valider) |
| Taux de réponse attendu | [HYPOTHÈSE] moyen : la personne a fini, certaines partent | [HYPOTHÈSE] plus haut : question à côté du bouton, mais cochée en passant, qualité plus faible |
| Risque légal | Le plus bas : la question n'influence pas l'acte (B2 : « elle suit la confirmation ») | Plus haut : on remplace un parcours qui marche, on doit prouver A7/A8/C1, risque de motif perçu comme condition |
| Travail | Faible : une page + une route + changer `after_completion` du flux Stripe | Fort : annulation en fin de période côté serveur, écran récapitulatif, accusé, états d'erreur, tests, perte du filet Stripe |
| Dark pattern possible | Aucun (la résiliation est déjà faite) | À surveiller (case à côté du bouton) |
| Données d'abandon | Résiliations sans réponse = pas de ligne, comptées via `cancel_scheduled` | Idem |

**Recommandation : option 1.** Zéro étape ajoutée, zéro risque sur la confirmation unique, l'existant (`subscription_cancel` + e-mail « C'est noté ») est conservé et le travail est minimal. L'option 2 reste une évolution possible si le taux de réponse est trop bas après 4 semaines de mesure ; elle exigerait un nouvel avis @legal.

## 2. Placement (option 1)

- **Entrées de résiliation inchangées** : pied de page -> `/profil#abonnement` -> « Résilier ton contrat » -> portail Stripe sur l'écran de confirmation. Aucune page insérée (A5). Le libellé, le comportement et le nombre de clics restent ceux d'aujourd'hui (3).
- **Changement unique côté code** : dans `flowData(...)`, pour `resilier`, `after_completion.redirect.return_url` = `/resiliation/merci` (au lieu de `/profil`). Le `return_url` général du portail (lien « retour ») reste `/profil`. Si Stripe refuse le flux ciblé (repli portail simple), le motif n'est pas demandé sur cette voie.
- **URL** : `/resiliation/merci`. `noindex`, hors sitemap, en-tête et pied de page visibles, pas de modal. Jamais d'ID ni de donnée perso dans l'URL.
- **Autres entrées vers la même page** : (a) l'e-mail existant « C'est noté : ton Premium s'arrête le … » reçoit un lien discret « Nous dire pourquoi (facultatif) » vers `/resiliation/merci` (cela couvre aussi la résiliation faite depuis « Gérer mon abonnement » dans Stripe) ; (b) la carte abonnement du profil, en état « résilié » et sans réponse enregistrée, affiche une ligne : « Une question facultative : qu'est-ce qui n'a pas collé ? » (lien vers la page). Pas de pop-up, pas de bannière.
- **Sans session** : le middleware renvoie vers `/login?callbackUrl=/resiliation/merci`, puis retour. Aucune obligation : l'utilisateur peut ignorer la page à tout moment. (La connexion avant résiliation est le comportement actuel, point 2 de la liste avocat.)
- **Mobile d'abord** : 375 px, une colonne, rien de sticky nécessaire (aucune action n'est vitale).
- **Accusé de réception (C1, C2)** : le support durable est l'e-mail « C'est noté ». Il doit contenir la date de fin du contrat et les effets (accès gardé jusqu'à {date}, aucun nouveau prélèvement). Vérifier le contenu du gabarit existant ; la page web le répète mais ne le remplace pas. Un échec d'envoi n'annule rien : la page affiche déjà date et effets.
- **Délai du webhook** : à l'arrivée sur la page, la base peut ne pas encore refléter la résiliation. @fullstack lit l'état chez Stripe si la base n'est pas à jour, sinon la page affiche l'état « en cours d'enregistrement » (§5).
- **Option 2, si adoptée plus tard** : même contenu de question, placé sous le bouton « Confirmer la résiliation », plus bas dans la hiérarchie et sans aucune réponse requise.

## 3. Fond

**H1** : « C'est noté. » Sous-titre (rappel factuel, calculé, jamais écrit en dur) :
- mensuel : « Tu gardes Premium jusqu'au {date}. Aucun nouveau prélèvement. »
- annuel : « Tu gardes Premium jusqu'au {date}. Le renouvellement de {prix} n'aura pas lieu. » ([À CONFIRMER avocat : mention du prorata])
- date inconnue : « Tu gardes Premium jusqu'à la fin de la période déjà payée. »
Ligne d'accusé : « Un e-mail de confirmation arrive à ton adresse. » (seulement si l'envoi est réservé par le webhook).

**Question (une seule)** : « Si tu veux bien, qu'est-ce qui n'a pas collé ? » avec « Facultatif » en tête, pas de pré-cochage, ordre fixe, cases à cocher (plusieurs possibles) :
1. Je voulais juste essayer (H1, H3) 2. Je n'ai pas trouvé ce que je cherchais (H4) 3. Je ne savais pas par où commencer (H2) 4. C'est trop cher pour moi 5. Je n'ai pas le temps 6. Le contenu ne me correspond pas 7. Autre.
**Champ libre** : « Un mot de plus ? (facultatif) », 500 caractères, jamais requis, même pour « Autre ».
**Boutons** : « Envoyer ma réponse » (principal, actif seulement si une case ou un texte existe) ; « Ça ira, merci » (lien texte, retour au profil) ; « Changer d'avis ? Gérer mon abonnement » (lien discret, bonne pratique C5, aucun poids visuel supérieur). Ne rien faire et quitter la page est toujours valable.
**Après envoi** : « Merci, c'est lu. » + main tendue d'une ligne, NON bloquante, qui n'est pas de la rétention (la résiliation est faite, c'est un conseil d'usage pendant l'accès restant) :
- pas trouvé : « Tu as encore Premium jusqu'au {date}. Si ça te dit : {Vannes} · {Conseils} · {Parcours}. » (liens `/vannes`, `/conseils`, `/parcours`)
- par où commencer : « Si ça te dit, la première étape d'un parcours se fait en quelques minutes : {voir les parcours}. »
- pas le temps : « Les parcours se font en 15 à 20 min par semaine, à ton rythme. »
- les autres : aucune main tendue.
**Interdits** : écran de rétention séparé, pop-up, compte à rebours, double confirmation, remise, culpabilisation (« tu vas nous manquer »), case pré-cochée, réponse obligatoire, relance e-mail automatique à cause du motif, tiret cadratin, concurrent nommé, chiffre inventé.

## 4. Données

Table dédiée `CancellationFeedback` : `id`, `userId` (nullable, `onDelete: SetNull`), `reasons` (`String[]` : `essai`, `introuvable`, `depart`, `prix`, `temps`, `inadapte`, `autre`), `comment` (≤ 500, nullable), `formule` (`monthly|annual`), `tenureDays` (jours entre `Subscription.createdAt` et la résiliation), `createdAt`. Une ligne par résiliation (upsert sur `userId` + fin de période). **Ligne écrite uniquement si l'utilisateur envoie** : pas de ligne « passée ». Aucun e-mail, IP, user-agent, prix. Durée de conservation et mention dans la confidentialité : à fixer (liste avocat n°9 ; B7).
- Écriture : `POST /api/user/subscription/resiliation-motif`, session obligatoire, `refuserSiAutreSite`, zod, limite de débit. La page ne bloque jamais sur cet appel ; en cas d'erreur, message en ligne et saisie conservée.
- Comptage des non-réponses : `cancel_scheduled` (webhook, analyse §4) donne le dénominateur ; taux de réponse = lignes / résiliations.
- Lecture par Thomas : carte « Résiliations » dans `/admin` (total, répartition par raison, mensuel/annuel, ancienneté médiane, 50 dernières réponses libres brutes) ; bloc « Résiliations de la semaine » dans le rapport du lundi (emplacement à localiser par @fullstack) : nombre, taux de réponse, top 3 raisons, 3 citations brutes, délai achat-résiliation. Jamais d'alerte e-mail dédiée.
- Stripe : ne PAS activer les motifs du portail (une seule question). Umami complète (`resiliation-merci-vue`, `resiliation-motif-envoye`) mais est aveugle à certains acheteurs : la base fait foi.

## 5. Wireframes et états

**PC (>= 1024)** : `main` centré, carte unique `max-w-xl` (576 px), en-tête et pied de page du site.
```
[En-tête]
   C'est noté.                                      (H1)
   Tu gardes Premium jusqu'au 24 novembre 2026. Aucun nouveau prélèvement.
   Un e-mail de confirmation arrive à ton adresse.
   ---------------------------------------------
   Si tu veux bien, qu'est-ce qui n'a pas collé ?   Facultatif
   [ ] Je voulais juste essayer
   [ ] Je n'ai pas trouvé ce que je cherchais
   [ ] Je ne savais pas par où commencer
   [ ] C'est trop cher pour moi
   [ ] Je n'ai pas le temps
   [ ] Le contenu ne me correspond pas
   [ ] Autre
   Un mot de plus ? (facultatif)  [ zone 3 lignes ]  0/500
   [ Envoyer ma réponse ]     Ça ira, merci
   Changer d'avis ? Gérer mon abonnement
[Pied de page]
```
**Mobile (< 768, référence 375)** : même ordre en une colonne, cases = lignes de 48 px (zone entière cliquable), bouton « Envoyer ma réponse » pleine largeur sous le champ, liens texte en dessous (cibles >= 44 px). Rien de sticky.

**États** :
- **Chargement** : H1 et question affichés tout de suite ; le rappel (date) en squelette puis texte. Jamais d'écran blanc.
- **En cours d'enregistrement** (webhook pas encore reçu) : « Ta résiliation s'enregistre. Tu recevras un e-mail de confirmation. » (sans date promise) ; la question reste disponible.
- **Envoi** : bouton « On envoie… », `aria-busy`, saisie conservée.
- **Erreur d'envoi** : message en ligne `role="alert"` : « Ta réponse n'est pas partie. Réessaie dans un instant, ou laisse tomber, ce n'est pas grave. » Cases et texte conservés.
- **Envoyé** : « Merci, c'est lu. » + main tendue éventuelle, formulaire remplacé, retour possible sans rechargement.
- **Déjà répondu** (ligne existante) : « Tu as déjà répondu, merci. » sans formulaire.
- **Pas résilié** (URL ouverte sans résiliation) : « Ton abonnement est toujours actif. » + « Gérer mon abonnement », pas de question.
- **Sans abonnement / sans client Stripe** : « Rien à résilier ici. » + retour accueil.
- **Retour après 30 jours** : l'état est relu ; si l'abonnement est fini, « Ton Premium est terminé » + la question reste possible une fois.
- **Accessibilité** : `fieldset`/`legend`, clavier complet, focus visible, cibles >= 44 px, contraste AA, `aria-live` sur envoi/erreur, `prefers-reduced-motion`.

## 6. Critères de notation 10/10 (relecteurs : @ux, @design, @reviewer, @legal)

1 point par ligne ; échec bloquant (note plafonnée à 5) : écran ou question AVANT la confirmation de Stripe, deuxième confirmation, réponse obligatoire, rétention séparée ou pop-up, dark pattern, tiret cadratin, donnée inventée.
**Placement (10)** : 1 aucun écran ajouté avant Stripe ; 2 pied -> confirmation en 3 clics maximum, comme aujourd'hui ; 3 Stripe = unique confirmation ; 4 `return_url` de fin de résiliation vers la page, repli propre si le flux ciblé échoue ; 5 e-mail « C'est noté » avec date de fin, effets et lien facultatif ; 6 carte profil en état résilié propose la question sans insistance ; 7 sans session : retour après connexion ; 8 webhook en retard géré ; 9 noindex et hors sitemap, pas d'ID dans l'URL ; 10 option 2 documentée comme évolution avec avis @legal requis.
**Fond (10)** : 1 une seule question ; 2 7 raisons max issues de l'analyse, ordre fixe ; 3 rien d'obligatoire, « Facultatif » visible ; 4 rappel factuel exact (date, mensuel/annuel) ; 5 accusé clair ; 6 main tendue pertinente, après envoi, non bloquante, sans offre inventée ; 7 ton Alex, aucune culpabilisation ; 8 chiffres déjà validés uniquement ; 9 données minimales, une table, lisible dans l'admin et le rapport du lundi ; 10 chaque raison débouche sur une action produit possible.
**Design (10)** : 1 hiérarchie H1, rappel, question, bouton ; 2 <= 3 actions principales ; 3 « Envoyer » jamais plus saillant que la lecture du rappel, « Gérer mon abonnement » discret ; 4 cases >= 44 px, zone entière cliquable ; 5 mobile 375 sans défilement horizontal ; 6 tous les états de §5 conçus ; 7 saisie conservée en erreur ; 8 WCAG 2.2 AA ; 9 cohérence avec les tokens et cartes du profil ; 10 captures 375 / 768 / 1280, états inclus, relues et notées.

## Handoff @design puis @fullstack
Points d'attention : recommandation option 1 à faire confirmer par Thomas ; avocat à consulter sur motif après confirmation et conservation ; contenu de l'e-mail « C'est noté » à auditer (C1, C2) ; textes PROVISOIRES ; documenter dans `REPLIT_ACTIONS.md` à l'implémentation.
