# Revue UX v2 : page de résiliation s23 (placement et parcours), 06/11/2026

Périmètre : code corrigé (`c260215`, `6d521de`), synthèse `REPLIT_ACTIONS.md`, captures `docs/captures/s23-resiliation/` (39 PNG ; vues : hors-ligne PC, app-store mobile, tablette 768 vide et confirmée, premier écran PC 1440, profil carte abonnement, connexion PC). Aucun code modifié, aucune commande exécutée (la preuve 200/404 de fullstack n'est pas rejouée par moi, voir O6).

**Note globale : 9 / 10** (placement 9,5, parcours 9). v1 : 7,5. Les deux pages et tous les états rares sont maintenant cohérents ; il reste 4 corrections courtes pour atteindre 10.

## Vérification O1 à O9

| # | Verdict | Preuve |
|---|---|---|
| O1 | PASS | `confirmee/page.tsx` l.38-55 : plus d'aide ni « Merci d'avoir répondu » ; `AIDES_APRES_RESILIATION` (`textes/resiliation.ts` l.88-119) et `merci` l.75 restent en code mort, non rendus, documentés l.80-87. Capture `confirmee-tablette-768` : titre, date, effets, reçu, e-mail, « Retour à l'accueil » + « Changer d'avis ? » : conforme à la spec §2. |
| O2 | PASS | `resiliation-connexion-pc-1440` : plus de « Pas encore abonné ? » ni « Créer mon compte », seulement « Retour à l'accueil ». |
| O3 | PASS | `saisie-session.ts` : écriture avant `/login` (formulaire l.118), relecture puis effacement au montage (l.68-72), liste filtrée sur les codes connus, 500 caractères max, échec de stockage silencieux. |
| O4 | PASS | formulaire l.139-144 : 202/503 = `stripe`, autre refus = `refus` (`textes/resiliation.ts` l.51), `catch` seul = `hors-ligne`. Capture `hors-ligne-pc-1440` : bandeau « Pas de connexion. Rien n'est perdu, réessaie. », case cochée conservée, bouton « Confirmer la résiliation » (et non « Réessayer », correct), barre collée visible en 1440x900. |
| O5 | PASS partiel | `carte-app-store.tsx` + formulaire l.149 : carte seule, sans bouton « Confirmer » (capture `app-store-mobile-390` : texte Apple + « Retour à l'accueil », propre). Reste un défaut (C2 ci-dessous) : la détection se fait après montage, donc le formulaire s'affiche un instant. |
| O6 | Refus accepté pour la livraison fermée, alternative obligatoire avant ouverture | voir section dédiée. |
| O7 | PASS | `recapFinInconnueOffert` l.22, `offert` passé à `RecapContrat` (`recap-props.ts` l.24). |
| O8 | PASS | `erreurStripe` l.53 contient « Tu n'as rien à refaire. » ; « Réessayer » seulement si `erreur === "stripe"` (formulaire l.166). |
| O9 | PARTIEL | Livrées : hors-ligne, app-store (PC + mobile), 768 (vide + confirmée), PC viewport 1440x900 avec barre collée (`vide-premier-ecran-pc-1440` : bouton et « Garder » visibles, case 7 coupée sous la barre, normal), profil. Manquent : mobile 390 avec clavier ouvert dans « Un mot de plus ? ». « Chargement » : sans objet tant que O6 n'est pas traité. |

Souhaitables v1 : appliqués = date de fin en grand, « Aucun nouveau prélèvement après. » et « Rien à résilier ici. » en texte principal. Non appliqués = date « 1 décembre » du profil (devient C1), connexion en fenêtre (dépend du point avocat n°2, reste hors périmètre), « Toujours en cours » qui agrandit la barre, mention distinguant « Renoncer au contrat ici ».

## O6 : le refus est-il acceptable ?

Oui pour ce qui est livré. Un 200 à la place du 404 interrupteur fermé est pire que l'absence de squelette (piège s17, page « cachée » visible et indexable en statut), et la preuve est chiffrée (curl 200 avec le fichier). La cause connue : `loading.tsx` enveloppe `page.tsx` dans un Suspense, le flux démarre (statut 200) avant que `notFound()` de la page ne s'exécute. Le manque de retour sur connexion lente (heuristique 1) n'existe que quand la page est ouverte, donc il ne gêne personne aujourd'hui.

Mais ce n'est pas un refus définitif : avant l'ouverture, appliquer l'alternative qui garde le 404, en sortant le test d'interrupteur de la page vers un `layout.tsx` du même segment. Un layout est rendu AU-DESSUS de la frontière de `loading.tsx` du même dossier : son `notFound()` part avant tout flux, donc statut 404 fermé.

1. Créer `apps/web/src/app/(dashboard)/resiliation/layout.tsx` :
```tsx
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";

export default function ResiliationLayout({ children }: { children: ReactNode }) {
  if (!RESILIATION_PAGE_OUVERTE) notFound();
  return children;
}
```
2. Créer `.../resiliation/loading.tsx` (H1 « Résilier ton contrat », carte squelette ~270 px, 3 lignes, aucun bouton ; mêmes classes `mx-auto max-w-xl` que `page.tsx` l.50).
3. Garder `page.tsx` l.28 et `confirmee/page.tsx` l.29 (double sécurité, ils couvrent le cas où le layout serait contourné).
4. Remplacer le test qui interdit `loading.tsx` (`__tests__/feature/resiliation-pages-serveur-s23.test.ts`) par : le layout existe et appelle `notFound()` quand l'interrupteur est faux ; build fermé, `curl -s -o /dev/null -w '%{http_code}'` sur `/resiliation` ET `/resiliation/confirmee` = 404. Si un seul des deux donne 200, retirer `loading.tsx` : le 404 prime.
Limite honnête : je n'ai pas exécuté ce build ; la preuve par curl est à refaire par @fullstack. Autre voie si le layout échoue : renvoyer 404 dans le proxy/middleware tant que l'interrupteur est fermé (hors page, donc hors Suspense).

## Corrections OBLIGATOIRES restantes (4)

**C1. Date du profil différente de la page.** Capture `apres-profil-carte-abonnement-pc-1440` : « jusqu'au 1 décembre 2026 » et « Prochain prélèvement le 1 décembre 2026 », alors que la page dit « 1er décembre 2026 ». C'est la même date légale écrite de deux façons. `components/profil/abonnement-card.tsx` : l.13 retirer `dateLongue,` de l'import ; ajouter après l.16 `import { dateFinLisible } from "@/components/resiliation/recap-props";` ; l.68 remplacer par `const fin = dateFinLisible(summary?.currentPeriodEnd ?? null);`. Mettre à jour `compte-s16.test.tsx` si une assertion contient « 1 décembre ».

**C2. Éclair du formulaire pour l'abonné App Store.** `components/resiliation/resiliation-formulaire.tsx` : l.59 ajouter `const [verifie, setVerifie] = useState(!appStorePossible);` ; dans l'effet l.62-74 ajouter `setVerifie(true);` après la ligne 66 ; avant le `return` l.151, ajouter `if (!verifie) return <div className="min-h-64" aria-hidden="true" />;`. Le bouton « Confirmer la résiliation » ne s'affiche ainsi jamais avant le verdict (seuls les comptes sans client Stripe sont concernés).

**C3. Capture manquante : clavier ouvert.** Produire `resiliation-clavier-mobile-390` (viewport réduit à ~390x420, focus dans « Un mot de plus ? ») montrant que « Confirmer la résiliation » reste atteignable. Sans elle la spec §5 Design 10 n'est pas close.

**C4. O6 alternative avant ouverture** (section ci-dessus) : à faire dans la liste « Avant l'ouverture » de `REPLIT_ACTIONS.md` l.18, pas avant le déploiement fermé.

## Souhaitables (une ligne)

- `resiliation-formulaire.tsx` l.124 : `CLE_REPONSE_SESSION` écrit pour une ligne d'aide qui n'est plus affichée ; retirer l'écriture tant que l'aide est coupée.
- `textes/resiliation.ts` l.75 et l.80-119 : code mort avec chiffres non validés ; archiver dans `docs/copy/` pour éviter un rebranchement accidentel.
- `barre-confirmation.tsx` l.36-38 : mettre « Toujours en cours » au-dessus de la barre pour qu'elle ne grossisse pas.
- Connexion : fenêtre par-dessus la page (préférence fondateur), après réponse de l'avocat (point n°2).
- Profil : une demi-phrase sous « Renoncer au contrat ici » (« dans les 14 jours après achat »), après validation @legal.

## Auto-évaluation

Cognitive walkthrough Yanis (mobile) : sait quoi faire (oui), action visible (oui, barre collée), lien but-action (oui), feedback (oui en envoi et en erreur ; chargement lent = C4, pas de risque tant que fermé). Dark pattern : aucun. Nielsen : H1 et H9 corrigés (O4, O8), H5 corrigé (O5 hors C2), H4 à corriger (C1). HEART Task success inchangé (`resiliation-ecran-vu` / `resiliation-confirmee`, cible >= 90 %). 10/10 attendu après C1 à C3 sur nouvelles captures, C4 avant ouverture.
