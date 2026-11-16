import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { chargeursFiches } from "@/lib/espace/fiches";
import { ENTREES_QUIZ, lireOrigine, type EntreeDisponible } from "@/lib/espace/premier-pas";
import { lireMois, premierPasFait, resoudreOrigine } from "@/lib/espace/premier-pas-serveur";
import { lireAise } from "@/lib/espace/aise";
import { categoriesProposees } from "@/lib/espace/vanne";
import { ecouterPublie } from "@/lib/espace/ecouter-publie";
import { lireDrapeauFavori } from "@/lib/favori-apres-paiement";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { dateDuJour } from "@/config/textes/espace-apercu";
import { frEspace, frEspaceProfond, frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";
import { PremierPas } from "@/components/espace/aujourdhui/premier-pas";
import { ContenuDuJour } from "@/components/espace/aujourdhui/contenu-du-jour";
import { QuestionAise } from "@/components/espace/aujourdhui/question-aise";
import { CapDuJour } from "@/components/espace/aujourdhui/cap-du-jour";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { EtapeEnCours, ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";
import { lireRafale, type EtatRafale } from "@/lib/espace/cartes-serveur";
import { lireEtapeAReprendre } from "@/lib/espace/etape-serveur";
import { missionOuverte, missionsServiesValidees } from "@/lib/espace/missions";
import { accrocheMission } from "@/lib/espace/enonce-mission";
import { lireRetoursMission } from "@/lib/espace/missions-serveur";
import { META, META_FORT, TITRE_PAGE } from "@/components/espace/typo";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Aujourd'hui », accueil de l'espace (s24, lot D3 ; architecture v20 4.2 et 4.4, décisions C9, C13, C14).
 * Rendu : SSR dynamique à chaque requête (données de l'abonné ; `force-dynamic` hérité du layout, jamais en cache).
 * Garde EN PREMIER (rendu partiel de Next) : 404 interrupteur fermé ; nav v6 : aperçu pour le visiteur et l'inscrit
 * gratuit, à cette adresse (plus de connexion ni de `/abonnement`).
 *
 * Refonte s25 (`docs/ux/aujourdhui-refonte-s25.md`, `docs/design/aujourdhui-refonte-s25.md`, retour de Thomas du
 * 16/11) : l'aperçu est le tableau de bord VERROUILLÉ (`ApercuAujourdhui`) ; l'abonné a un tableau de bord en grille
 * 12 colonnes dans la coque, en-tête aligné à gauche (H1, date, repère à droite) :
 * - Z1 action du jour (premier pas ; rafale ; étape à reprendre une fois la rafale faite), seul bouton plein ;
 * - Z2 « Ton cap » (cap, XP, série) dès le premier jour, à droite de Z1 à 1280 ;
 * - rangée 2, partagée en 12 colonnes sans cellule vide : Z3 parcours (l'étape est lue aussi avant le premier pas),
 *   Z4 mission, Z5 rafale faite ; nouvel abonné : Z3 « Étape conseillée » et « Tes 4 premières semaines » ;
 * - Z6 contenu du jour ; Z7 question C9 (une fois, après le premier pas).
 * Échelle s25 (`docs/design/typo-harmonie-espace-s25.md`, retour de Thomas du 16/11) : tailles, graisses et casse
 * par `components/espace/typo.ts` (4 tailles, 400 et 600, aucune capitale), rythme de 8 px, rayons de 12 px.
 * Juste après le paiement : `?favori=JOKE|TIP|VIDEO` = la ligne de confirmation du favori (texte validé
 * `BIENVENUE_PREMIUM.favori`), sans bouton ; `?depuis=` = le lien de retour (premier pas).
 */
export const dynamic = "force-dynamic";

/**
 * Interrupteur fermé : les métadonnées de la vraie 404 (`app/not-found.tsx` : « Page introuvable »,
 * noindex), pour une tête identique à une adresse inexistante ; le layout rend ensuite la 404
 * (`notFound()`). Sans cela, la présence de cette page donnerait le titre par défaut du site.
 */
export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("aujourdhui") : {};
}

/**
 * Spans de la rangée 2 (spec design §5.1) : 3 cellules = 3 x 4, 2 = 2 x 6, 1 = pleine ligne ; jamais une cellule vide.
 * v7 tour 2 : 2 cellules à 768, l'une sous l'autre en pleine largeur (côte à côte, la tuile la plus courte se creusait
 * de 40 px et plus sous les lignes repliées de sa voisine).
 */
function spansRangee(n: number, i: number): string {
  if (n >= 3) return i === 2 ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4";
  if (n === 2) return "md:col-span-2 lg:col-span-6";
  return "md:col-span-2 lg:col-span-12";
}

export default async function AujourdhuiPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuAujourdhui visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace");
  const param = (cle: string) => (typeof searchParams[cle] === "string" ? (searchParams[cle] as string) : null);

  const acces = { acces: "ouvert" as const, userId };
  const situations = chargeursFiches.listerFiches("situation", acces);
  const idsEntrees = new Set(Object.values(ENTREES_QUIZ));
  const entrees: EntreeDisponible[] = situations
    .filter((f) => idsEntrees.has(f.id))
    .map((f) => ({ id: f.id, titre: frEspace(f.titre), minutes: f.dureeMinutes }));

  // Refonte s25 (spec UX §4.4) : l'étape à reprendre est lue aussi avant le premier pas (« Étape conseillée », Z3).
  const [origine, fait, aise, categories, mois, etape] = await Promise.all([
    resoudreOrigine(lireOrigine(param("depuis"))),
    premierPasFait(userId),
    lireAise(userId),
    categoriesProposees(),
    lireMois(userId),
    lireEtapeAReprendre(userId),
  ]);
  const favori = lireDrapeauFavori(param("favori"));

  // États 2 à 4 : seulement une fois le premier pas fait (4.4).
  let rafale: EtatRafale | null = null;
  let marcheMission: 1 | 2 | 3 | 4 | 5 | null = null;
  let accrocheDeMission: string | undefined;
  if (fait) {
    const [r, retours] = await Promise.all([lireRafale(userId, acces), lireRetoursMission(userId)]);
    rafale = r;
    const mission = missionOuverte(missionsServiesValidees(), retours);
    marcheMission = mission?.marche ?? null;
    // v7 tour 2 (piste Mission) : la première phrase de l'énoncé, texte existant, sous le titre de la tuile.
    accrocheDeMission = mission ? accrocheMission(mission.enonce) : undefined;
  }
  const cartes = (rafale?.cartes ?? []).map((c, i) => ({
    titre: frEspace(rafale?.catalogue.get(c.carteId)?.titre ?? ""),
    href: `/mon-espace/s-entrainer#carte-${i + 1}`,
    nouvelle: c.nouvelle,
    autreContexte: c.autreContexte === true,
  }));

  // Z1 : le premier pas ; puis la rafale ; une fois la rafale faite, l'étape à reprendre (sinon « C'est tout »).
  const etapeDominante = Boolean(rafale?.fini && etape);
  const principale = !fait ? (
    <PremierPas origine={origine} entrees={entrees} avecBandeau={Boolean(favori)} />
  ) : etapeDominante && etape ? (
    <EtapeEnCours etape={etape} />
  ) : rafale ? (
    <CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={rafale.fini} />
  ) : null;

  // Rangée 2. Nouvel abonné : Z3 « Étape conseillée » (5 colonnes) et « Tes 4 premières semaines » (7 colonnes) ;
  // v7 tour 2 (faute 2) : à 768, l'une sous l'autre en pleine largeur (côte à côte, la feuille de route passait sur
  // trois lignes par semaine et creusait la tuile voisine de 200 px).
  // Ensuite, dans l'ordre Z3, Z4, Z5 : le parcours (sauf s'il est déjà l'action du jour), la mission, la rafale faite.
  const rangee: { cle: string; noeud: React.ReactNode; span?: string }[] = !fait
    ? [
        ...(etape ? [{ cle: "parcours", noeud: <ParcoursTuile etape={etape} />, span: "md:col-span-2 lg:col-span-5" }] : []),
        { cle: "semaines", noeud: <SemainesTuile ecouterPublie={ecouterPublie()} />, span: etape ? "md:col-span-2 lg:col-span-7" : undefined },
      ]
    : [
        ...(etape && !etapeDominante ? [{ cle: "parcours", noeud: <ParcoursTuile etape={etape} /> }] : []),
        ...(marcheMission ? [{ cle: "mission", noeud: <MissionLien marche={marcheMission} accroche={accrocheDeMission} /> }] : []),
        ...(etapeDominante && rafale
          ? [{ cle: "rafale", noeud: <CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={rafale.fini} principale={false} /> }]
          : []),
      ];

  return (
    <div className="halo-page pb-16">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className={TITRE_PAGE}>{T.titre}</h1>
          <p className={cn("mt-2 max-e300:mt-0", META)} data-date-du-jour>
            {dateDuJour()}
          </p>
        </div>
        {rafale && rafale.cetteSemaine > 0 && (
          <p className={META} data-repere>
            <ReperesSemaine texte={T.repere(rafale.cetteSemaine)} />
          </p>
        )}
      </header>
      {favori && (
        <p role="status" className={cn("mt-8 rounded-xl border border-border bg-background-light px-4 py-4", META)}>
          {frTypo(BIENVENUE_PREMIUM.favori[favori])}
        </p>
      )}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12 max-e300:mt-3" data-aujourdhui-grille>
        {principale && (
          <div className="min-w-0 md:col-span-2 lg:col-span-8" data-carte-du-jour>
            {principale}
          </div>
        )}
        <div className={cn("min-w-0 md:col-span-2", principale ? "lg:col-span-4" : "lg:col-span-12")} data-zone="cap">
          <CapDuJour cap={mois.cap} xp={mois.xp} serie={mois.serie} />
        </div>
        {rangee.map((c, i) => (
          <div key={c.cle} className={cn("min-w-0", c.span ?? spansRangee(rangee.length, i))} data-zone={c.cle}>
            {c.noeud}
          </div>
        ))}
      </div>
      <div className="mt-12">
        <ContenuDuJour categories={categories} />
      </div>
      {fait && !aise && (
        <div className="mt-6 empty:hidden">
          <QuestionAise />
        </div>
      )}
    </div>
  );
}

/** Repère « {n} cartes cette semaine » : le nombre en gras (spec design §2), texte lu identique. */
function ReperesSemaine({ texte }: { texte: string }) {
  const m = /^(\d+)(\s.*)$/u.exec(texte);
  if (!m) return <>{texte}</>;
  return (
    <>
      <b className={cn("tabular-nums", META_FORT)}>{m[1]}</b>
      {m[2]}
    </>
  );
}
