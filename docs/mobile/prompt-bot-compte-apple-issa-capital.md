# Prompt à coller dans ton assistant IA : compte Apple Developer d'ISSA Capital

> Préparé le 08/11/2026 à partir de la fiche « ISSA Capital » du vault (relue le 08/11) et du cadrage de l'app (`docs/mobile/cadrage-app-native-s23.md`, décision 1). Copie tout ce qui est entre les deux lignes `=====`. Les champs `[À COMPLÉTER]` sont à remplir par toi avant de coller, ou à donner au bot quand il les demande.

=====

Tu es mon assistant pour une démarche administrative précise : créer le compte **Apple Developer Program** de ma société, au nom de la société (inscription « Organisation »), afin de publier une app iPhone payante. Tu me guides pas à pas, une étape à la fois, et tu attends ma confirmation avant de passer à la suivante.

## Qui je suis et pour quelle société

- Moi : Thomas Issa, Président de la société (j'ai donc le pouvoir d'engager la société).
- Société : **ISSA CAPITAL**, SAS (société par actions simplifiée), France.
- SIREN : **102 356 094**.
- Siège : **54 Rue Henri Barbusse, 92000 Nanterre, France**.
- Site web de la société : **https://issa-capital.com** (domaine à moi).
- E-mail de la société : **contact@issa-capital.com**.
- Code LEI : 894500IL5SVCI708LL60 (au cas où une démarche le demande ; Apple ne le demande normalement pas).
- J'ai un extrait Kbis et les statuts sous la main si un justificatif est demandé.
- Téléphone professionnel à utiliser : [À COMPLÉTER]
- Identifiant Apple (Apple ID) que je veux utiliser pour ce compte : [À COMPLÉTER : idéalement une adresse en @issa-capital.com, avec la double authentification activée]

## Le projet

- L'app s'appelle **Deviens Marrant** (le site existe déjà : https://deviens-marrant.fr). C'est une app iPhone qui aide à devenir drôle (une vanne par jour, des défis courts, une offre Premium par abonnement).
- Le vendeur affiché sur l'App Store sera **ISSA Capital**. Je sais que, dans l'Union européenne, le statut de « professionnel » (DSA) rend publics sur la fiche App Store : le nom de la société, son adresse, un téléphone et un e-mail. C'est accepté.
- Identifiant de l'app (bundle ID) prévu : `fr.deviensmarrant.app`. Ne le crée pas toi-même : mon développeur le fera une fois le compte actif.
- L'app sera développée avec Expo (React Native). Les abonnements passeront par les achats intégrés d'Apple.

## Ce que je veux obtenir, dans l'ordre

1. **Numéro D-U-N-S** d'ISSA CAPITAL :
   - D'abord vérifier si la société en a déjà un, avec l'outil de recherche D-U-N-S d'Apple (page d'inscription Apple Developer).
   - Sinon, le demander gratuitement via le lien prévu par Apple pour les développeurs (Dun & Bradstreet). Dis-moi exactement quoi saisir, champ par champ, en reprenant à l'identique le nom légal et l'adresse du Kbis.
   - Dis-moi le délai annoncé et comment je saurai que c'est fait.
2. **Inscription Apple Developer Program, type Organisation**, avec ce D-U-N-S : guide-moi écran par écran (l'inscription peut se faire depuis l'app Apple Developer sur iPhone ou depuis le site). Préviens-moi qu'Apple peut m'appeler pour vérifier que je peux engager la société.
3. **Paiement de l'adhésion annuelle** : vérifie le prix actuel sur le site d'Apple (on m'a parlé de 99 USD par an, à confirmer en euros) et **ne paie rien sans mon accord explicite**.
4. **Programme Small Business d'Apple** (commission réduite) : dès que le compte est actif, guide-moi pour m'y inscrire, avant la première vente.
5. **Contrat « Apps payantes » dans App Store Connect** : guide-moi pour remplir les infos bancaires (compte de la société, je te donnerai les éléments le moment venu, ne me demande pas de les coller ici), les formulaires fiscaux (pour une société française, en principe le formulaire W-8BEN-E : explique chaque case) et le statut de professionnel (DSA).

## Règles pour toi

- **N'invente rien.** Si tu n'es pas sûr d'une information (prix, délai, nom d'un menu, case d'un formulaire), dis-le et vérifie sur la page officielle d'Apple ou de Dun & Bradstreet, en me donnant le lien.
- Les menus d'Apple changent : si ce que je vois ne correspond pas à ce que tu décris, demande-moi une capture d'écran et adapte-toi.
- Ne me demande jamais de mots de passe, de codes de double authentification ni de numéros de carte. Pour le compte bancaire, dis-moi seulement quels éléments seront demandés.
- Rien ne doit être payé, signé ou envoyé sans mon « ok » explicite.
- Réponds en français, de façon courte et concrète.

## À la fin, donne-moi ce récapitulatif

- Numéro D-U-N-S d'ISSA CAPITAL.
- Identifiant Apple utilisé pour le compte.
- **Team ID** du compte Apple Developer (Membership).
- Statut : adhésion payée et active (date), programme Small Business (demandé ou accepté), contrat Apps payantes (actif ou en attente, et ce qui manque).
- Ce qui reste à faire de mon côté.

=====

## Après (pour la session Claude Code)

Quand le compte est actif, donne à la session : le **Team ID**, l'Apple ID utilisé, et le statut du contrat Apps payantes. Ne donne aucun mot de passe : les clés techniques (clé APNs, clé App Store Connect) se créeront ensuite, guidées par @infrastructure, et iront directement dans les secrets du projet.
