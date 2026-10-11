# Audit noté s15 : attirer et convertir (05/10/2026)

> Consolidation par la session principale des 3 audits : `docs/growth/audit-note-s15.md`, `docs/seo/audit-note-s15.md`, `docs/geo/audit-note-s15.md`. Données : `docs/analytics/snapshot-trafic-2026-10-05.md` (Umami, Search Console, Bing, extraites le 05/10). Barème commun : 10 = référence pour un site de cette taille, 7 = bon, 5 = freine, 3 = bloque, 1 = absent.

## 1. Notes par sujet

| # | Sujet | Growth | SEO | GEO | **Moyenne** | Impact |
|---|---|---|---|---|---|---|
| S1 | Article n°1 « 50 blagues drôles 2026 » | 6 | 7 | 6 | **6,3** | Attirer fort, convertir faible |
| S5 | SEO technique et indexation | 5 | 7 | 5 | **5,7** | Attirer |
| S2 | Blog éditorial (36 en ligne + 11 programmés) | 5 | 5 | 4 | **4,7** | Attirer |
| S6 | Snippets et CTR | 5 | 5 | 4 | **4,7** | Attirer |
| S8 | Visibilité dans les IA | 5 | 5 | 4 | **4,7** | Attirer |
| S12 | Rétention et réactivation | 4 | 4 | 3 | **3,7** | Convertir |
| S4 | Catalogue (vannes, conseils, vidéos) | 3 | 3 | 3 | **3,0** | Attirer |
| S11 | Mesure et pilotage | 3 | 2 | 4 | **3,0** | Les deux |
| S3 | Pages piliers (devenir drôle, être drôle, répartie) | 2 | 3 | 3 | **2,7** | Attirer |
| S9 | Passage blog vers produit | 3 | 3 | 2 | **2,7** | Convertir |
| S10 | Funnel inscription vers Premium | 3 | 2 | 2 | **2,3** | Convertir |
| S7 | Présence hors site (liens, mentions, marque) | 2 | 2 | 2 | **2,0** | Attirer |

| Note globale | Growth | SEO | GEO | **Moyenne** |
|---|---|---|---|---|
| **ATTIRER** | 4,7 | 4,3 | 3,7 | **4,2 / 10** |
| **CONVERTIR** | 3,2 | 2,6 | 2,5 | **2,8 / 10** |

Écart maximal entre agents : 2 points (S5). Les trois convergent sur le diagnostic.

## 2. Les faits qui portent les notes

- **Un seul article fait le site** : 78 % des clics Google, 51 % des entrées, 92 % de rebond, 28 s par visite. Ses requêtes sont datées « 2026 » (bascule 2027 actée : 15-20/12, slug conservé).
- **Les requêtes de la mission ne rapportent rien** : « comment devenir drôle » position 33, « comment être drôle » 44, « avoir de la répartie » 14,6. Requête de marque « deviens marrant » : 0 impression en 90 j.
- **La moitié du blog est muette** : 16 articles sur 36 sans aucune impression en 90 j ; pages techniquement saines (200, index, canonical, sitemap : vérifié par @seo sur 8 articles). Causes : cannibalisation (3 articles « répartie », 5 « raconter une blague »), titles génériques.
- **Le catalogue n'attire pas** : 19 fiches conseils = 2 clics en 90 j ; fiches vannes et vidéos ≈ 0.
- **Autorité nulle** : 0 lien entrant mesuré (Bing), 63 pages indexées par Bing sur 384, réseaux sociaux 1 visite en 28 j.
- **Le chemin vers l'abonnement est vide** : 0 vue de `/onboarding` et `/register` en 180 j, `/abonnement` 12 vues, 1 `/abonnement/success`, 3 échecs de connexion Google (`OAuthCallback`) pour 4 vues de `/login`.
- **Mesure** : aucun événement d'inscription, d'onboarding ni de paiement. Les événements blog (`blog-scroll`, `blog-cta-clic`…) viennent d'être mis en ligne : **les 11 reçus datent tous des dernières 24 h** ; leur faible nombre n'indique PAS un tracking cassé (correction de la session sur les rapports @seo et @growth), il faut 2 à 4 semaines de recul.

## 3. Corrections de la session sur les rapports

- « 0 `blog-cta-clic` en 180 j » (@growth, @geo) et « tracking cassé » (@seo) : faux, événements en ligne depuis moins de 24 h.
- « 6 slugs de `blog-clusters.ts` en 404 » (@seo) : à nuancer, une partie correspond aux articles forte frappe programmés (Noël, Saint-Valentin, rentrée) ; d'autres (ex. `devenir-drole-30-jours`, pilier `techniques-standup-vie-sociale`) sont réellement absents. À vérifier : ces liens sont-ils rendus au visiteur ?
- `comment-devenir-drole` : aucun défaut technique (301 www vers apex, canonical, index, sitemap). Les impressions sous `www.` relèvent de la consolidation Google (inspection d'URL à faire par Thomas).

## 4. Priorités consolidées (les 3 agents convergent)

1. **Convertir l'article n°1 (S1, S9)** : offrir de la valeur dès le haut de page (quiz « profil humour » ou première étape d'un parcours, sans compte), lien vers le pilier « devenir drôle ». Exécution : @ux + @copywriter + @fullstack. Succès : `blog-cta-clic` ≥ 3 % des entrées de l'article à J+28.
2. **Réparer et mesurer le tunnel (S10, S11)** : comprendre pourquoi personne n'atteint `/onboarding` ni `/register`, corriger `OAuthCallback`, poser les événements inscription / onboarding / checkout / abonnement. Exécution : @fullstack + @qa + @data-analyst. Succès : 0 `OAuthCallback` sur 14 j, funnel complet lisible dans Umami.
3. **Gagner les requêtes cœur (S3, S2)** : pilier « comment devenir drôle » lié depuis l'accueil et l'article n°1, fin de la cannibalisation avec `exercices-developper-humour`, réponse directe en tête. Sans changer d'URL. Exécution : @seo + @copywriter + @fullstack. Succès : position < 20 à J+45.
4. **Autorité (S7, S5, S8)** : IndexNow en lot des 384 URL + soumission Bing 100/j ; 5 à 15 liens ou mentions réels (dossier `docs/growth/soumissions-backlinks-s11.md`). Exécution : @seo + @growth, soumissions par Thomas. Succès : Bing ≥ 200 pages à J+30, ≥ 5 domaines référents à J+60.

## 5. Manques de données (à fournir par Thomas)

Inscrits réels et abonnés actifs (base / Stripe), MRR, inspection d'URL GSC du pilier, baseline des 10 prompts IA (`docs/geo/avis-donnees-reelles-s15.md`).
