import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { chargeursFiches } from "@/lib/espace/fiches";
import { bonusOuverts } from "@/lib/espace/bonus";
import { lireCapDeblocage } from "@/lib/espace/caps-serveur";
import { COOKIE_COIN, coinEntre } from "@/lib/espace/humour-noir";
import { envoyeesSiBesoin, fichesVisibles, lettresEnvoyees } from "@/lib/espace/lettres";
import { idsFaits, ligneDeBonus, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import { lireRetour } from "@/lib/espace/fiche-fait";
import { lireReplique } from "@/lib/espace/repliques";
import { prochaineNonFaite } from "@/lib/espace/quoi-repondre-liste";
import { ADRESSE_LISTE_BIBLIOTHEQUE, FAMILLES_BIBLIOTHEQUE, hrefFicheBibliotheque, type FamilleBibliotheque, type LigneBibliotheque } from "@/lib/espace/bibliotheque-liste";
import type { Fiche } from "@/lib/espace/fiches-schema";
import { TEXTES_BIBLIOTHEQUE, TEXTES_FICHE_LIGNE, TEXTES_LETTRES as TEXTES_LETTRES_BRUT } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CAPS as TEXTES_CAPS_BRUT } from "@/config/textes/espace-caps";
import { TEXTES_ESPACE_NAVIGATION as N } from "@/config/textes/espace-navigation";
import { FicheVuePanneau } from "@/components/espace/fiche";
import { hrefLettre } from "@/components/espace/archive-lettres";
import { FicheSuivante, OuvertureFicheListe } from "@/components/espace/liste-detail/navigation";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);
const L = frEspaceProfond(TEXTES_FICHE_LIGNE);
const TEXTES_CAPS = frEspaceProfond(TEXTES_CAPS_BRUT);
const TEXTES_LETTRES = frEspaceProfond(TEXTES_LETTRES_BRUT);

/**
 * s26 bibliothèque liste et détail : données de la Bibliothèque de l'abonné, lues une fois par le layout (colonne), la
 * page liste (< 1024 et fiche ouverte d'office) et la page de fiche. Mêmes règles qu'avant : reprise d'une lettre listée
 * après l'envoi de sa lettre, bonus ouverts au cap de déblocage (caps 2 à 4 avec « Écouter, repérer », cap 5 avec les
 * formules), coin servi seulement à un navigateur « entré ».
 */
export async function chargerBibliotheque(userId: string) {
  const acces = { acces: "ouvert" as const, userId };
  const f = chargeursFiches;
  const coin = f.listerFiches("humour-noir", acces);
  const brutes: Record<FamilleBibliotheque, Fiche[]> = {
    construction: f.listerFiches("construction", acces),
    vocabulaire: f.listerFiches("vocabulaire", acces),
    formule: f.listerFiches("formule", acces),
    ecouter: f.listerFiches("ecouter", acces),
  };
  const toutes = Object.values(brutes).flat();
  const [cap, envoyees] = await Promise.all([lireCapDeblocage(prisma, userId), envoyeesSiBesoin(prisma, toutes)]);
  const visibles = new Set(fichesVisibles(toutes, envoyees).map((x) => x.id));
  const parType = Object.fromEntries(FAMILLES_BIBLIOTHEQUE.map((t) => [t, brutes[t].filter((x) => visibles.has(x.id))])) as Record<FamilleBibliotheque, Fiche[]>;
  const bonus = bonusOuverts(cap, acces).sort((a, b) => a.cap - b.cap);
  const faits = await idsFaits(userId, [...toutes.map((x) => x.id), ...bonus.map((b) => b.id), ...coin.map((x) => x.id)]);
  const entre = coinEntre(cookies().get(COOKIE_COIN)?.value);
  // Ordre de la liste (et de « suivante ») : les techniques par famille ; les bonus ont leur propre porte.
  const ordre = FAMILLES_BIBLIOTHEQUE.flatMap((t) => parType[t]);
  const marque = (b: (typeof bonus)[number]) => ligneDeBonus(b, faits, TEXTES_CAPS.bonus.marque(b.cap));
  const bonusDe = (t: FamilleBibliotheque) => (t === "formule" ? bonus.filter((b) => b.cap === 5) : t === "ecouter" ? bonus.filter((b) => b.cap < 5) : []);
  const lignes: LigneBibliotheque[] = FAMILLES_BIBLIOTHEQUE.flatMap((t) => [
    ...parType[t].map((x) => ({ ...ligneDeFiche(x, faits), href: hrefFicheBibliotheque(x.id), famille: t })),
    ...bonusDe(t).map((b) => ({ ...marque(b), famille: t })),
  ]);
  return { parType, bonus, coin, faits, entre, ordre, lignes, marque };
}

/** Lettre d'origine d'une reprise ; `undefined` : lettre pas encore envoyée (fiche cachée). */
export async function lettreDeTechnique(fiche: Fiche): Promise<{ titre: string; href: string } | null | undefined> {
  if (!fiche.repriseDeLettre) return null;
  const titre = (await lettresEnvoyees(prisma)).get(fiche.repriseDeLettre);
  return titre ? { titre: TEXTES_LETTRES.vuDans(titre), href: hrefLettre(fiche.repriseDeLettre) } : undefined;
}

/** Données du panneau : la fiche, son geste, et la prochaine technique non faite après elle (traverse les familles). */
export async function donneesPanneauBibliotheque({ userId, fiche, lettre, ordre, faits }: { userId: string; fiche: Fiche; lettre: { titre: string; href: string } | null; ordre: readonly Fiche[]; faits: ReadonlySet<string> }) {
  const [retour, replique] = fiche.geste ? await Promise.all([lireRetour(userId, fiche.id), lireReplique(userId, fiche.id)]) : [null, null];
  const suivante = prochaineNonFaite(ordre, fiche.id, faits);
  return { fiche, lettre, retour, replique, fait: faits.has(fiche.id), suivante: suivante ? { href: hrefFicheBibliotheque(suivante.id), titre: suivante.titre } : null };
}

/**
 * Le panneau d'une technique : la fiche au modèle de Quoi répondre (émoji 💡 des techniques de l'accueil, pastille
 * violette « Bibliothèque », pastille neutre de la famille, sections dans les blocs de l'accueil, sans capitales), puis
 * « Voir : {technique suivante} » (libellés existants, repli de la spec du pilote). Dernière : sous 1024, retour à la liste.
 */
export function PanneauTechnique({ fiche, lettre, retour, replique, fait, suivante }: Awaited<ReturnType<typeof donneesPanneauBibliotheque>>) {
  const apres = suivante ? (
    <FicheSuivante ficheId={fiche.id} href={suivante.href} faitInitial={fait}>
      {frEspace(`${L.voir} : ${suivante.titre}`)}
    </FicheSuivante>
  ) : (
    <Link href={ADRESSE_LISTE_BIBLIOTHEQUE} className={cn(BOUTON_SECONDAIRE, "min-h-12 w-full sm:w-auto sm:self-start lg:hidden")} data-fin-de-liste>
      {frEspace(N.retour(T.titre))}
    </Link>
  );
  const famille = (T.prefixes as Record<string, string>)[fiche.type] ?? null;
  return (
    <>
      <OuvertureFicheListe />
      <FicheVuePanneau fiche={frEspaceProfond(fiche)} retour={retour} replique={replique} lettre={lettre} apres={apres} emoji={EMOJIS_RUBRIQUES.bibliotheque} rubrique={T.titre} pastille={famille} sansCapitales />
    </>
  );
}
