import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { chargeursFiches } from "@/lib/espace/fiches";
import { envoyeesSiBesoin, fichesVisibles, lettresEnvoyees } from "@/lib/espace/lettres";
import { idsFaits } from "@/lib/espace/lignes-fiches";
import { lireRetour } from "@/lib/espace/fiche-fait";
import { lireReplique } from "@/lib/espace/repliques";
import { filtrerSituations, lireFiltres, ordreParLieu, type FicheQuoiRepondre, type FiltresSituations } from "@/lib/espace/quoi-repondre";
import { ADRESSE_LISTE_QUOI_REPONDRE, hrefFicheListe, prochaineNonFaite, queryFiltres } from "@/lib/espace/quoi-repondre-liste";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { TEXTES_LETTRES as TEXTES_LETTRES_BRUT, TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { FicheVuePanneau } from "@/components/espace/fiche";
import { hrefLettre } from "@/components/espace/archive-lettres";
import { OuvertureFiche, SituationSuivante } from "@/components/espace/quoi-repondre/navigation";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);
const TEXTES_LETTRES = frEspaceProfond(TEXTES_LETTRES_BRUT);

/**
 * s26 liste et détail : la liste filtrée côté serveur (mêmes fiches, même ordre que la colonne de liste du layout),
 * pour la fiche ouverte d'office, « Situation suivante » et la page liste sous 1024.
 */
export async function chargerListeQuoiRepondre(userId: string, searchParams: Record<string, string | string[] | undefined>) {
  const acces = { acces: "ouvert" as const, userId };
  const toutes = [...chargeursFiches.listerFiches("situation", acces), ...chargeursFiches.listerFiches("a-plat", acces)];
  const filtres = lireFiltres(searchParams);
  const servies = fichesVisibles(toutes, await envoyeesSiBesoin(prisma, toutes));
  const ordre: FicheQuoiRepondre[] = ordreParLieu(filtrerSituations(servies, filtres));
  const faits = await idsFaits(userId, ordre.map((f) => f.id));
  return { filtres, ordre, faits };
}

/** Lettre d'origine d'une reprise (« Vu dans la lettre du … ») ; `undefined` : lettre pas encore envoyée (fiche cachée). */
export async function lettreDeFiche(fiche: FicheQuoiRepondre): Promise<{ titre: string; href: string } | null | undefined> {
  if (!fiche.repriseDeLettre) return null;
  const titre = (await lettresEnvoyees(prisma)).get(fiche.repriseDeLettre);
  return titre ? { titre: TEXTES_LETTRES.vuDans(titre), href: hrefLettre(fiche.repriseDeLettre) } : undefined;
}

/**
 * Le panneau d'une fiche (spec design §3) : la fiche, puis « Situation suivante » dans l'ordre de la liste filtrée
 * (traverse les lieux ; tour 4 : la prochaine non faite, `prochaineNonFaite`). Dernière du filtre : dès 1024 rien (la liste est à gauche), sous 1024 le lien vers la liste
 * avec ses filtres (libellé existant « Retour : Quoi répondre »).
 */
export async function donneesPanneau({
  userId,
  fiche,
  lettre,
  ordre,
  filtres,
  faits,
}: {
  userId: string;
  fiche: FicheQuoiRepondre;
  lettre: { titre: string; href: string } | null;
  ordre: readonly FicheQuoiRepondre[];
  filtres: FiltresSituations;
  faits: ReadonlySet<string>;
}) {
  const [retour, replique] = fiche.geste ? await Promise.all([lireRetour(userId, fiche.id), lireReplique(userId, fiche.id)]) : [null, null];
  // s26 liste et détail, tour 4 : la prochaine NON FAITE du filtre (`faits` couvre toute la liste filtrée).
  const suivante = prochaineNonFaite(ordre, fiche.id, faits);
  return { fiche, lettre, filtres, retour, replique, fait: faits.has(fiche.id), hrefSuivante: suivante ? hrefFicheListe(suivante.id, filtres) : null };
}

/** Rendu du panneau (synchrone : données lues par `donneesPanneau`). */
export function PanneauFiche({ fiche, lettre, filtres, retour, replique, fait, hrefSuivante }: Awaited<ReturnType<typeof donneesPanneau>>) {
  const apres = hrefSuivante ? (
    <SituationSuivante ficheId={fiche.id} href={hrefSuivante} faitInitial={fait} />
  ) : (
    <Link href={`${ADRESSE_LISTE_QUOI_REPONDRE}${queryFiltres(filtres)}`} className={cn(BOUTON_SECONDAIRE, "min-h-12 w-full sm:w-auto sm:self-start lg:hidden")} data-fin-de-filtre>
      {frEspace(N.retour(T.titre))}
    </Link>
  );
  return (
    <>
      <OuvertureFiche />
      {/* Lot D11c : typographie de l'espace sur le contenu de la fiche, à l'affichage seulement (JSON intact). */}
      <FicheVuePanneau fiche={frEspaceProfond(fiche)} retour={retour} replique={replique} lettre={lettre} apres={apres} />
    </>
  );
}
