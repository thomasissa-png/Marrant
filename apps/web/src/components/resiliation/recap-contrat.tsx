import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TEXTES_RESILIATION as T } from "@/config/textes/resiliation";

export interface RecapContratProps {
  /** « Prénom, e-mail » ou e-mail seul. */
  compte: string;
  /** « Premium mensuel » / « Premium annuel » / « Premium ». */
  formule: string;
  /** « 1,99 € TTC par mois » (null : ligne omise). */
  prix: string | null;
  /** Date longue (« 24 novembre 2026 »), null si inconnue. */
  dateFin: string | null;
  /** Annuel : « Le renouvellement de … n'aura pas lieu. » */
  renouvellement: string | null;
  /** `formule` = écran à résilier ; `enregistree` = déjà résilié ou page finale (badge succès). */
  badge: "formule" | "enregistree";
  /** Lignes d'effet (« Jusqu'au…, tu gardes tout ton Premium. », « Aucun nouveau prélèvement après. »). */
  effets?: boolean;
  className?: string;
}

/**
 * Récapitulatif du contrat (D215-2, A8) : compte, formule, prix TTC, date de fin, effets. Tout est
 * pré-rempli, rien à retaper. Partagé par /resiliation (à résilier, déjà résilié) et la page finale.
 * Carte non cliquable : pas d'effet de survol (spec design §3). Montants et dates alignés à droite.
 */
export function RecapContrat({ compte, formule, prix, dateFin, renouvellement, badge, effets = true, className }: RecapContratProps) {
  return (
    <Card className={cn("p-5 hover:border-border md:p-6", className)}>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        {/* Mêmes classes que `CardTitle`, en h2 (le H1 de la page est au-dessus). */}
        <h2 className="font-display text-lg font-bold text-text-primary">{T.recapTitre}</h2>
        {badge === "formule" ? (
          // « Premium », comme la carte abonnement du profil : la formule est dite une seule fois, dans la ligne.
          <Badge variant="primary">{T.formuleInconnue}</Badge>
        ) : (
          <Badge variant="success">{T.badgeEnregistree}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <dl className="divide-y divide-border text-sm">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="shrink-0 text-text-secondary">{T.recapCompte}</dt>
            <dd className="min-w-0 break-words text-right font-medium text-text-primary">{compte}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="shrink-0 text-text-secondary">{T.recapFormule}</dt>
            <dd className="min-w-0 break-words text-right font-medium text-text-primary">
              {prix ? (
                <>
                  {formule}, <span className="whitespace-nowrap">{prix}</span>
                </>
              ) : (
                formule
              )}
            </dd>
          </div>
        </dl>
        <div className="mt-4 rounded-md bg-background-elevated px-4 py-3">
          <p className="text-xs text-text-secondary">{T.recapFinLibelle}</p>
          <p className={cn("font-display font-bold text-text-primary", dateFin ? "text-xl" : "text-lg")}>
            {dateFin ?? T.recapFinInconnue}
          </p>
        </div>
        {effets && (
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-text-primary">{dateFin ? T.garderJusquau(dateFin) : T.garderSansDate}</p>
            <p className="text-text-secondary">{T.aucunPrelevement}</p>
            {renouvellement && <p className="text-text-secondary">{renouvellement}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
