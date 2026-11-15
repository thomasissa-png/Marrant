import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { ApercuRubrique, metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { chargeursFiches } from "@/lib/espace/fiches";
import { ENTREES_QUIZ, lireOrigine, type EntreeDisponible } from "@/lib/espace/premier-pas";
import { lireMois, premierPasFait, resoudreOrigine } from "@/lib/espace/premier-pas-serveur";
import { lireAise } from "@/lib/espace/aise";
import { categoriesProposees } from "@/lib/espace/vanne";
import { lireDrapeauFavori } from "@/lib/favori-apres-paiement";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { frEspace, frEspaceProfond, frTypo } from "@/lib/fr-typo";
import { PremierPas } from "@/components/espace/aujourdhui/premier-pas";
import { ContenuDuJour } from "@/components/espace/aujourdhui/contenu-du-jour";
import { QuestionAise } from "@/components/espace/aujourdhui/question-aise";
import { TonMois } from "@/components/espace/aujourdhui/ton-mois";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { EtapeEnCours } from "@/components/espace/aujourdhui/etape-en-cours";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { lireRafale, type EtatRafale } from "@/lib/espace/cartes-serveur";
import { lireEtapeAReprendre } from "@/lib/espace/etape-serveur";
import { missionOuverte, missionsServiesValidees } from "@/lib/espace/missions";
import { lireRetoursMission } from "@/lib/espace/missions-serveur";
import type { EtapeAReprendre } from "@/lib/espace/quatre-semaines";
// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Aujourd'hui », accueil de l'espace (s24, lot D3 ; architecture v20 4.2 et 4.4, décisions C9,
 * C13, C14 ; maquette `docs/espace-client/etalons/e5/aujourdhui.html`).
 * Rendu : SSR dynamique à chaque requête (données de l'abonné ; `force-dynamic` hérité du layout,
 * jamais en cache). Garde EN PREMIER (rendu partiel de Next) : 404 interrupteur fermé ; nav v6 : aperçu
 * pour le visiteur et l'inscrit gratuit, à cette adresse (plus de connexion ni de `/abonnement`).
 * Quatre états (4.4, lot D5) : (1) aucune fiche faite : le premier pas, seule action principale ;
 * (2) rafale du jour pas faite : « Si tu as 5 minutes » ; (3) rafale faite : « Reprendre » l'étape en
 * cours (ou « Commencer l'étape 1 »), « C'est tout pour aujourd'hui » dessous ; (4) mission ouverte :
 * lien secondaire. Question C9 une fois, après le premier pas. Repère « {n} cartes cette semaine » à
 * partir d'une carte. Contenu du jour (vanne et toucher, conseil, vidéo) ; « Ton mois » à partir de J25.
 * Juste après le paiement : `?favori=JOKE|TIP|VIDEO` = la ligne de confirmation du favori (texte
 * validé `BIENVENUE_PREMIUM.favori`), sans bouton ; `?depuis=` = le lien de retour (premier pas).
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

export default async function AujourdhuiPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuRubrique rubrique="aujourdhui" visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace");
  const param = (cle: string) => (typeof searchParams[cle] === "string" ? (searchParams[cle] as string) : null);

  const acces = { acces: "ouvert" as const, userId };
  const situations = chargeursFiches.listerFiches("situation", acces);
  const idsEntrees = new Set(Object.values(ENTREES_QUIZ));
  const entrees: EntreeDisponible[] = situations
    .filter((f) => idsEntrees.has(f.id))
    .map((f) => ({ id: f.id, titre: frEspace(f.titre), minutes: f.dureeMinutes }));

  const [origine, fait, aise, categories, mois] = await Promise.all([
    resoudreOrigine(lireOrigine(param("depuis"))),
    premierPasFait(userId),
    lireAise(userId),
    categoriesProposees(),
    lireMois(userId),
  ]);
  const favori = lireDrapeauFavori(param("favori"));

  // États 2 à 4 : seulement une fois le premier pas fait (4.4).
  let rafale: EtatRafale | null = null;
  let etape: EtapeAReprendre | null = null;
  let marcheMission: 1 | 2 | 3 | 4 | 5 | null = null;
  if (fait) {
    const [r, retours] = await Promise.all([lireRafale(userId, acces), lireRetoursMission(userId)]);
    rafale = r;
    if (r.fini) etape = await lireEtapeAReprendre(userId);
    marcheMission = missionOuverte(missionsServiesValidees(), retours)?.marche ?? null;
  }
  const cartes = (rafale?.cartes ?? []).map((c, i) => ({
    titre: frEspace(rafale?.catalogue.get(c.carteId)?.titre ?? ""),
    href: `/mon-espace/s-entrainer#carte-${i + 1}`,
    nouvelle: c.nouvelle,
    autreContexte: c.autreContexte === true,
  }));

  // v6 tour 1 (point 4) : l'action du jour (premier pas ; étape à reprendre une fois la rafale faite ; sinon la
  // rafale) en pleine coque, seule carte dominante ; dessous, ce qui l'accompagne (rafale faite, mission, question
  // C9, « Ton mois ») côte à côte dès 768 px, le dernier impair sur la rangée entière (jamais une demi-rangée vide) ;
  // puis « Contenu du jour », section distincte (`space-y-12`). À 375 px, une colonne, l'action du jour d'abord.
  const etapeDominante = Boolean(rafale?.fini && etape);
  const carteRafale = rafale && (
    <CartesDuJour key="rafale" cartes={cartes} href="/mon-espace/s-entrainer" fini={rafale.fini} principale={!etapeDominante} />
  );
  const principale = !fait ? (
    <PremierPas origine={origine} entrees={entrees} avecBandeau={Boolean(favori)} />
  ) : etapeDominante && etape ? (
    <EtapeEnCours etape={etape} />
  ) : (
    carteRafale
  );
  const secondaires = [
    etapeDominante ? carteRafale : null,
    marcheMission ? <MissionLien key="mission" marche={marcheMission} /> : null,
    fait && !aise ? <QuestionAise key="aise" /> : null,
    mois.montrer ? <TonMois key="mois" serie={mois.serie} cap={mois.cap} /> : null,
  ].filter(Boolean);
  return (
    <div>
      {/* Nav v6 (lot B) : plus de place réservée au-dessus du titre (ni retour ni repère : la bande l'est). */}
      <header className="mb-8 md:mb-10">
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{T.titre}</h1>
        {rafale && rafale.cetteSemaine > 0 && <p className="mt-2 text-sm text-text-secondary">{T.repere(rafale.cetteSemaine)}</p>}
      </header>
      {favori && (
        <p role="status" className="mb-6 rounded-md border border-border bg-background-light px-4 py-3 text-sm text-text-secondary">
          {frTypo(BIENVENUE_PREMIUM.favori[favori])}
        </p>
      )}
      <div className="space-y-12">
        <div className="flex flex-col gap-6" data-aujourdhui-grille>
          <div className="min-w-0" data-carte-du-jour>
            {principale}
          </div>
          {secondaires.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:[&>:last-child:nth-child(odd)]:col-span-2" data-aujourdhui-secondaires>
              {secondaires}
            </div>
          )}
        </div>
        <ContenuDuJour categories={categories} />
      </div>
    </div>
  );
}
