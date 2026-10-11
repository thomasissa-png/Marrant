# Inventaire des e-mails automatiques vers l'admin (s15, 06/10/2026)

Demande de Thomas (06/10) : « Je veux moins d'emails deviens marrant dans ma boîte. J'en ai reçu 3 cette nuit. »
Règle (`docs/founder-preferences.md`, 06/10) : **au plus UN e-mail par jour vers l'admin, et seulement quand Thomas a quelque chose à faire.**

Destinataire : `ADMIN_EMAIL` = `alex@deviens-marrant.fr` (`apps/web/src/lib/email.ts`), expéditeur `noreply@deviens-marrant.fr`.

## Cause des 3 e-mails de la nuit du 05 au 06/10

`lib/social/couverture.ts` (job `runCouvertureSocialeJob`, toutes les heures de 5 h à 21 h UTC) envoyait un e-mail **par réseau et par type**, avec un verrou par jour UTC : « File X basse » le 05/10 à 20:00 UTC, puis « File Instagram basse » et « File LinkedIn basse » le 06/10 à 05:01 UTC (nouveau jour UTC, donc nouveaux verrous). Rien à faire pour Thomas : la file se remplit en session.

## Inventaire avant correction

| # | Alerte (objet) | Fichier | Déclencheur | Fréquence max avant | Classe | Après correction |
|---|---|---|---|---|---|---|
| 1 | File {réseau} basse : N jour(s) de posts devant | `lib/social/couverture.ts` | file APPROVED < 10 jours | 1/jour/réseau (3/jour) | B | enregistrée, lue par la session |
| 2 | Tranche {id} {réseau} en retard | `lib/social/couverture.ts` | tranche J-14 incomplète | 1/jour/réseau | B | idem |
| 3 | Stock de vannes {réseau} bas | `lib/social/couverture.ts` | pool éligible < 14 | 1/jour/réseau | B | idem |
| 4 | Lancement de la tranche sociale | `lib/social/couverture.ts` | date de lancement | 1/jour | B | idem |
| 5 | Vague {id} : démarrage / livraison | `lib/social/couverture.ts` | calendrier des vagues | 1/jour | B | idem |
| 6 | Jalon J+N demain : fiche de décision | `lib/social/couverture.ts` | veille de jalon | 1/jour | B | idem |
| 7 | {Réseau} mis en pause : échecs consécutifs | `lib/social/platform-switch.ts` | 2 FAILED consécutifs | 1 par pause | B | idem (clé `social-auto-pause-echecs-*`) |
| 8 | {Réseau} mis en pause : reconnecter le canal Buffer | `lib/social/platform-switch.ts` (via publish-social et buffer-status-check) | canal déconnecté ou autorisation perdue | 1 par pause | **A** | digest du matin (clé `social-auto-pause-canal-*`) |
| 9 | Token Buffer expiré | `app/api/cron/publish-social/route.ts` | 401/403 Buffer | 1/jour | **A** | digest du matin (clé `social-token-buffer`) |
| 10 | Publication {réseau} : échec Buffer | `app/api/cron/publish-social/route.ts` | post FAILED | 1/jour/réseau | B | enregistrée |
| 11 | Publication {réseau} : 429, réseau bloqué 24 h | idem | 429 Buffer | 1/jour/réseau | B | enregistrée |
| 12 | Relais {réseau} : article non publié | idem | article invisible à l'heure | 1/jour/réseau | B | enregistrée |
| 13 | LinkedIn : carte non envoyée, texte seul | idem | rendu image KO | 1/jour | B | enregistrée |
| 14 | Publication social : erreur critique | idem | exception du cron | 1/jour | B | enregistrée |
| 15 | Publication {réseau} non confirmée chez Buffer | `lib/social/buffer-status-check.ts` | erreur, introuvable, bloqué | 1/jour/réseau | B | enregistrée |
| 16 | Panne LLM : crédit, clé, permission | `lib/ai/failure-alert.ts` | erreur Anthropic structurelle | 1/24 h/type | **A** | digest du matin (`llm-alert-credit/authentication/permission`) |
| 17 | Panne LLM : modèle introuvable, requête refusée | `lib/ai/failure-alert.ts` | idem | 1/24 h/type | B | enregistrée |
| 18 | Coupe-circuit LLM déclenché | `lib/ai/budget-guard.ts` | seuil 24 h ou mois atteint | 1/jour | **A** | digest du matin (`llm-budget`) |
| 19 | Contrôle qualité du jour : N point(s) | `lib/ai/quality-watch.ts` | vanne/conseil remplacé ou défaut | 1/jour | B | enregistrée (`qualite-matin`) |
| 20 | Rapport hebdomadaire des visites | `lib/analytics/weekly-visits-job.ts` | lundi 07:00 Paris | 1/semaine | C | **gardé** ; le lundi il embarque le digest (1 seul e-mail ce jour-là) |
| 21 | [CEO Hebdo] Semaine du … | `lib/ai/agents/ceo-agent.ts` (`runWeeklyReport`) | tâche WEEKLY_REPORT | 1/semaine | C | **dormant** (agent CEO désactivé, `enabled:false`) ; non modifié, à repasser par le digest si l'agent est réactivé |

Hors périmètre (pas vers l'admin) : réinitialisation de mot de passe, rappel légal de reconduction de l'annuel (abonnés), e-mails sortants de l'agent CEO (prospects, dormant).

Aucune alerte Stripe ni sécurité n'existait : les préfixes de clé `stripe-`, `paiement-`, `securite-` sont réservés en classe A pour la suite.

## Après correction

- Plus aucun envoi direct : `sendAdminAlert` est supprimé de `lib/email.ts`. Toutes les alertes passent par `recordAdminAlert` (`lib/admin-alerts.ts`), stockées dans `CeoMemory` (namespace `admin_alert`, une ligne par clé et par jour de Paris, répétitions comptées, conservées 30 jours, aucune migration).
- **Classe A** : digest quotidien unique (`lib/admin-digest.ts`), 07:30 heure de Paris (retentes jusqu'à 09:59 si Resend refuse), objet « [Marrant] N action(s) pour toi (JJ/MM/AAAA) », rien si aucune action.
- **Classe B** : `GET /api/admin/alertes` (Bearer `ADMIN_PASSWORD`), lue chaque matin par les routines de la session ; chaque lecture est datée (`?apercu=1` pour lire sans dater).
- **Filet 48 h** : sans lecture de la route depuis 48 h (ou jamais, compté depuis la plus ancienne alerte B en attente), les alertes B en attente s'ajoutent au digest du jour.
- **Lundi** : le rapport des visites (07:00) embarque le digest ; le digest de 07:30 ne part pas ce jour-là.
- Effet sur la nuit du 05 au 06/10 : **0 e-mail** (3 alertes B, lues par la session).
- Délai accepté : une alerte A arrivée après le digest attend le lendemain matin (au plus ~24 h).
