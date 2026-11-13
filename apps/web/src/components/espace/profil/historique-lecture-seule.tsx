import type { FilListe } from "@/lib/espace/questions-types";
import type { RepliqueListee } from "@/lib/espace/repliques";
import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";
import { MesQuestions } from "@/components/espace/questions/mes-questions";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";

/**
 * « Mon profil » d'un ancien abonné, espace ouvert (s24, lot D10 ; architecture v20 2.6 et 2.7, décision
 * C10 a) : « Mes questions » et « Mes répliques » en LECTURE SEULE (ni envoi, ni « Continuer », ni
 * modification ; le retrait et la suppression restent possibles sur demande), chaque section seulement
 * si elle a des données. Rendu par le serveur (`profil/page.tsx`), composants des lots D5 et D7.
 */
export function HistoriqueLectureSeule({ fils, repliques }: { fils: FilListe[]; repliques: RepliqueListee[] }) {
  if (fils.length === 0 && repliques.length === 0) return null;
  return (
    <div className="mt-6 flex flex-col gap-6" data-testid="profil-historique-lecture-seule">
      {fils.length > 0 && (
        <section aria-labelledby="profil-mes-questions" className="flex flex-col gap-4">
          <h2 id="profil-mes-questions" className="font-display text-2xl font-bold text-text-primary">
            {Q.titre}
          </h2>
          <MesQuestions initiaux={fils} lectureSeule />
        </section>
      )}
      {repliques.length > 0 && (
        <section aria-labelledby="profil-mes-repliques" className="flex flex-col gap-4">
          <h2 id="profil-mes-repliques" className="font-display text-2xl font-bold text-text-primary">
            {R.titre}
          </h2>
          <ListeRepliques initiales={repliques} lectureSeule />
        </section>
      )}
    </div>
  );
}
