import type { Metadata } from "next";
import Link from "next/link";
import { ESPACE_CLIENT_PUBLIE, ESPACE_ACCUEIL } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { envoyeesSiBesoin, fichesVisibles } from "@/lib/espace/lettres";
import { idsFaits, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { filtrerSituations, lireFiltres } from "@/lib/espace/quoi-repondre";
import { TEXTES_QUOI_REPONDRE as T } from "@/config/textes/espace-bibliotheque";
import { FiltresSituations } from "@/components/espace/filtres-situations";
import { ListeFiches } from "@/components/espace/liste-fiches";
import { BOUTON_SECONDAIRE, CARTE, LIEN } from "@/components/espace/carte/styles";

/**
 * « Quoi répondre » (s24, lot D6 ; architecture v20 3.3, 3.8, 6.2, 6.3) : les situations et « Quand ça
 * tombe à plat », filtrées par « Où et avec qui ? » et « Pour quoi faire ? » (adresse `?ou=&pour=`), puis
 * le carnet du mois, qui garde son adresse publique `/carnet` (aucune copie). Une reprise de lettre n'est
 * listée qu'après l'envoi de sa lettre. États : liste, filtrée, vide (« Raconte-la à l'équipe », vers
 * « Mes questions »), chargement (`loading.tsx`), erreur (`error.tsx`). Rendu : SSR dynamique (« Fait »
 * de l'abonné, jamais en cache). Garde EN PREMIER : 404 interrupteur fermé.
 */
export const dynamic = "force-dynamic";

const BASE = `${ESPACE_ACCUEIL}/quoi-repondre`;

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: T.titre } : METADONNEES_404;
}

export default async function QuoiRepondrePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { userId } = await garderEspace(BASE);
  const acces = { acces: "ouvert" as const, userId };
  const toutes = [...chargeursFiches.listerFiches("situation", acces), ...chargeursFiches.listerFiches("a-plat", acces)];
  const filtres = lireFiltres(searchParams);
  const servies = fichesVisibles(toutes, await envoyeesSiBesoin(prisma, toutes));
  const retenues = filtrerSituations(servies, filtres);
  const faits = await idsFaits(userId, retenues.map((f) => f.id));

  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{T.titre}</h1>
      <Link href="/carnet" className={`${BOUTON_SECONDAIRE} self-start`}>
        {T.carnet}
      </Link>
      <FiltresSituations base={BASE} filtres={filtres} />
      <section aria-label={T.titre} aria-live="polite" data-etat={retenues.length > 0 ? "liste" : "vide"}>
        {retenues.length > 0 ? (
          <ListeFiches lignes={retenues.map((f) => ligneDeFiche(f, faits))} avecDuree />
        ) : (
          <div className={CARTE} data-testid="quoi-repondre-vide">
            <p className="text-base text-text-primary">{T.vide}</p>
            <Link href={`${ESPACE_ACCUEIL}/questions`} className={LIEN}>
              {T.raconte}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
