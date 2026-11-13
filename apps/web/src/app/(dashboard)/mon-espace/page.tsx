import type { Metadata } from "next";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { garderEspace } from "@/lib/espace/garde";
import { chargeursFiches } from "@/lib/espace/fiches";
import { ENTREES_QUIZ, lireOrigine, type EntreeDisponible } from "@/lib/espace/premier-pas";
import { lireMois, premierPasFait, resoudreOrigine } from "@/lib/espace/premier-pas-serveur";
import { lireAise } from "@/lib/espace/aise";
import { categoriesProposees } from "@/lib/espace/vanne";
import { lireDrapeauFavori } from "@/lib/favori-apres-paiement";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";
import { TEXTES_AUJOURDHUI as T } from "@/config/textes/espace-aujourdhui";
import { frTypo } from "@/lib/fr-typo";
import { PremierPas } from "@/components/espace/aujourdhui/premier-pas";
import { ContenuDuJour } from "@/components/espace/aujourdhui/contenu-du-jour";
import { QuestionAise } from "@/components/espace/aujourdhui/question-aise";
import { TonMois } from "@/components/espace/aujourdhui/ton-mois";
import { cn } from "@/lib/utils";

/**
 * « Aujourd'hui », accueil de l'espace (s24, lot D3 ; architecture v20 4.2 et 4.4, décisions C9,
 * C13, C14 ; maquette `docs/espace-client/etalons/e5/aujourdhui.html`).
 * Rendu : SSR dynamique à chaque requête (données de l'abonné ; `force-dynamic` hérité du layout,
 * jamais en cache). Garde EN PREMIER (rendu partiel de Next) : 404 interrupteur fermé, connexion,
 * `/abonnement` sans abonnement actif.
 * État 1 (4.4) jusqu'au lot D5 : le premier pas est la seule action principale ; contenu du jour
 * (vanne et toucher, conseil, vidéo) ; « Ton mois » à partir de J25 s'il y a quelque chose à montrer.
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
  return ESPACE_CLIENT_PUBLIE ? {} : METADONNEES_404;
}

export default async function AujourdhuiPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { userId } = await garderEspace("/mon-espace");
  const param = (cle: string) => (typeof searchParams[cle] === "string" ? (searchParams[cle] as string) : null);

  const acces = { acces: "ouvert" as const, userId };
  const situations = chargeursFiches.listerFiches("situation", acces);
  const idsEntrees = new Set(Object.values(ENTREES_QUIZ));
  const entrees: EntreeDisponible[] = situations
    .filter((f) => idsEntrees.has(f.id))
    .map((f) => ({ id: f.id, titre: f.titre, minutes: f.dureeMinutes }));

  const [origine, fait, aise, categories, mois] = await Promise.all([
    resoudreOrigine(lireOrigine(param("depuis"))),
    premierPasFait(userId),
    lireAise(userId),
    categoriesProposees(),
    lireMois(userId),
  ]);
  const favori = lireDrapeauFavori(param("favori"));

  return (
    <div className="pb-12">
      <h1 className="mb-6 font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:mb-2 max-e300:text-2xl">{T.titre}</h1>
      {favori && (
        <p role="status" className="mb-6 rounded-md border border-border bg-background-light px-4 py-3 text-sm text-text-secondary">
          {frTypo(BIENVENUE_PREMIUM.favori[favori])}
        </p>
      )}
      <div className={cn("flex flex-col gap-6", mois.montrer ? "lg:grid lg:grid-cols-3 lg:items-start" : "lg:max-w-3xl")}>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <PremierPas origine={origine} entrees={entrees} avecBandeau={Boolean(favori)} />
          {fait && !aise && <QuestionAise />}
          <ContenuDuJour categories={categories} />
        </div>
        {mois.montrer && (
          <div className="flex flex-col gap-6">
            <TonMois serie={mois.serie} cap={mois.cap} />
          </div>
        )}
      </div>
    </div>
  );
}
