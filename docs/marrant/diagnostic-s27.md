# Diagnostic s27 (25/11/2026) : abonnés et délivrabilité e-mail

Données lues en lecture seule le 25/11/2026 vers 8 h UTC : Stripe (live), base Neon (transaction READ ONLY), Umami Cloud, Gmail de Thomas, `/api/health`, parcours d'achat en navigateur (sans création de compte).

## 1. « Pas de nouveaux abonnés depuis la nouvelle plateforme »

### Faits

**Souscriptions Stripe depuis le 01/10 (hors compte de Thomas)**

| Souscrite le | Prix | Résiliation demandée | Délai |
|---|---|---|---|
| 07/10 13:16 | 2,99 € | 07/10 13:20 | 4 minutes |
| 24/10 18:52 | 1,99 € | 25/10 17:49 | 23 heures |
| 25/10 07:32 | 1,99 € | 20/11 17:55 | 26 jours (avant l'ouverture du 21/11) |
| 01/11 23:09 | 1,99 € | 01/11 23:19 | 10 minutes (accès jusqu'au 01/12) |

- Seul abonnement qui se renouvelle encore : celui du 14/08 à 0,99 €. Revenu récurrent réel : environ 1 €/mois.
- Dernière session de paiement ouverte : 14/11 (annuel 16,99 €, abandonnée). Aucune depuis.
- Comptes créés : 24/10, 25/10, 01/11, 14/11, 17/11, puis aucun depuis le 21/11.

**Trafic (Umami), visiteurs par jour** : 30,7 (13-19/10) ; 28,3 ; 28,3 ; 35,9 ; 35,3 ; 34,8 (17-20/11) ; **29,4 (21-25/11)**. Stable.

**Tunnel, 41 jours avant l'ouverture (10/10 au 20/11)** : 32 vues de /abonnement, 11 clics, 7 envois d'inscription, 5 inscriptions réussies, 4 paiements ouverts, 3 abonnements. Soit environ 1 abonnement tous les 14 jours, pour environ 0,8 vue de /abonnement par jour.

**5 jours après l'ouverture (21 au 25/11)** : 4 vues de /abonnement, 1 clic, 0 inscription. Attendu au rythme d'avant : 0,4 abonnement. Zéro n'est donc pas un signal.

**Technique** : `/api/health` tout vert (base, Stripe live, prix mensuel et annuel, Resend). Accueil, /abonnement et formulaire d'inscription s'affichent sans erreur JavaScript (mobile 390 px). Le passage inscription vers paiement Stripe n'a pas été testé de bout en bout (il crée un compte et une session de paiement réels) : c'est l'achat réel à 1,99 € déjà demandé à Thomas.

### Lecture

1. La sécheresse commence le 02/11, 19 jours avant l'ouverture : la nouvelle plateforme n'en est pas la cause visible.
2. Le vrai problème est double : volume (30 visiteurs par jour, moins d'une vue de l'offre par jour) et rétention (4 abonnés récents sur 4 résilient, dont 2 dans les 10 minutes). À 1,99 €, l'offre est vécue comme un achat unique : on paie, on résilie aussitôt, on garde l'accès un mois.
3. Le blog porte presque tout le trafic : 658 vues de l'encart d'offre en fin d'article pour 36 clics (5 %).

### Pistes (à décider par Thomas, aucune lancée)

- Achat réel à 1,99 € + rétractation : seule façon d'écarter une panne entre inscription et paiement depuis l'allègement du 22/11.
- Comprendre la résiliation immédiate : ouvrir la page de résiliation maison (`RESILIATION_PAGE_OUVERTE`, question facultative déjà codée, avis d'avocat en attente) pour récolter le motif ; regarder ce que voit un abonné dans les 10 premières minutes.
- Volume : le levier est le trafic (SEO, articles invités, réseaux en pause depuis le 26/10) et le passage blog vers offre.

### Trafic, Search Console (lu le 25/11, 28 jours au 22/11)

- 468 clics, 17 546 impressions, position moyenne 9,4. Par mois : sept. 417 clics / 9 934 impressions ; oct. 396 / 9 435 ; nov. 473 / 17 835. Les impressions ont doublé, les clics non : le site apparaît plus, mais en bas de page 1.
- Une page porte le site : `/blog/meilleures-blagues-droles-2026` (250 clics, position 5,1).
- Impressions sans clics, à portée de la page 1 (titre et description à revoir) : groupe « autodérision / définition » (environ 1 250 impressions, position 10 à 11, 3 clics, page `/blog/autoderision-interactions` 2 140 impressions) ; « humour observationnel » (597 impressions, position 13,8, 0 clic) ; « comment faire rire une femme / une fille / quelqu'un » (environ 260 impressions, position 7 à 15) ; `/blog/phrases-droles-conversations` (3 024 impressions, 59 clics).
- Requêtes qui vendent, en page 2 à 5 : « comment devenir drôle » (66 impressions, position 18,5, 0 clic), « comment être drôle » (position 20 à 45), « avoir de la répartie » (position 29 à 30). Ce sont les recherches de la cible qui achète.
- Réseaux : gérés par les agents Grok de Thomas (correction du 25/11, pas en pause). Umami 30 jours : t.co 3, linkedin.com 2, m.facebook.com 2 visites. Les réseaux n'amènent presque pas de visiteurs sur le site.
- Articles invités et échanges de liens : en cours (réponses reçues les 17, 19 et 20/11).

## 2. Délivrabilité e-mail (priorité notée à la clôture s26)

### Faits

- 19 « Mail delivery failed » en 21 jours, tous émis par IONOS (`mailer-daemon@kundenserver.de`), tous pour le destinataire `thomas.issa@gmail.com`.
- Message d'origine lu dans un rebond du 24/11 : un rapport DMARC de Google adressé à alex@deviens-marrant.fr, reçu par IONOS le 20/11, redirigé vers Gmail, refusé (« multiple delivery attempts failed »). Rebond du 23/11 (adresse contact@) : Gmail répond `550 5.7.1 ... likely unsolicited mail`.
- Même phénomène sur deux autres domaines de Thomas hébergés chez IONOS (rebonds pour contact@immocrew.fr et jean-pierre@calendrier-tempo.fr).
- Rapport DMARC Google du 22/11 : 2 messages, depuis 217.72.192.74 et 212.227.126.133 (IONOS), DKIM et SPF alignés « pass ». Aucune source étrangère.

### Lecture

Une seule cause pour les deux symptômes : `rua=mailto:alex@deviens-marrant.fr` envoie les rapports dans la boîte IONOS, qui les redirige vers Gmail ; Gmail refuse une partie des messages redirigés ; IONOS renvoie alors un rebond à alex@, lui aussi redirigé. Pas d'usurpation constatée sur ce rapport. Le site (Resend) n'est pas en cause.

Risque réel : un vrai message à contact@ ou alex@ que Gmail juge douteux est renvoyé à son expéditeur et n'arrive jamais à Thomas.

### Recos (go écrit de Thomas requis : DNS et IONOS)

1. Cloudflare, Email > DMARC Management (gratuit) : les rapports partent chez Cloudflare au lieu de alex@. Fin des rapports quotidiens et de la plupart des rebonds.
2. IONOS : vérifier que la redirection de alex@ et contact@ garde une copie dans la boîte IONOS (rien n'est perdu si Gmail refuse).
3. DMARC : rester en `p=none` ; passer à `p=quarantine` après 2 à 3 semaines de rapports Cloudflare ne montrant que IONOS et Resend.

### Fait le 25/11 (go de Thomas : « je suis tes recos mais qu'on arrête de me spammer »)

- Enregistrement `_dmarc.deviens-marrant.fr` (Cloudflare, id `aa3cf767…`) : `rua=mailto:alex@deviens-marrant.fr` retiré. Nouvelle valeur : `v=DMARC1; p=none; adkim=r; aspf=r; pct=100`, vérifiée en DNS public. Retour arrière : remettre `rua=mailto:alex@deviens-marrant.fr;` après `p=none;`.
- Les rapports déjà en route peuvent encore arriver 24 à 48 h (cache DNS des expéditeurs).
- Pas d'API publique pour « DMARC Management » : l'activation (Email > DMARC Management) se fait dans le tableau de bord Cloudflare et ajoute une adresse de rapport Cloudflare, sans rien envoyer dans la boîte de Thomas.
- Reste à Thomas : copie conservée chez IONOS pour alex@ et contact@ (seule source restante de rebonds : les spams reçus sur contact@ et refusés par Gmail).
