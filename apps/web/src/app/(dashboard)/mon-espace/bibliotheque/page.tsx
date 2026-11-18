import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
import { lireLecteurApercu } from "@/components/espace/apercu/acces";
import { metadonneesApercu } from "@/components/espace/apercu/apercu-rubrique";
import { ApercuBibliotheque } from "@/components/espace/apercu/apercu-bibliotheque";
import { chargeursFiches } from "@/lib/espace/fiches";
import { bonusOuverts } from "@/lib/espace/bonus";
import { lireCapDeblocage } from "@/lib/espace/caps-serveur";
import { COOKIE_COIN, coinEntre } from "@/lib/espace/humour-noir";
import { envoyeesSiBesoin, fichesVisibles } from "@/lib/espace/lettres";
import { idsFaits, ligneDeBonus, ligneDeFiche } from "@/lib/espace/lignes-fiches";
import type { Fiche } from "@/lib/espace/fiches-schema";
import { TEXTES_BIBLIOTHEQUE } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CAPS as TEXTES_CAPS_BRUT } from "@/config/textes/espace-caps";
import { BlocBibliotheque, BlocVannes } from "@/components/espace/bloc-bibliotheque";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { ListeFiches, compteFaits } from "@/components/espace/liste-fiches";
import { TITRE_PAGE } from "@/components/espace/typo";
import { frEspaceProfond } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_BIBLIOTHEQUE);
const TEXTES_CAPS = frEspaceProfond(TEXTES_CAPS_BRUT);

/**
 * Bibliothèque (s24, lot D6 ; architecture v20 6.2, 6.3, 3.12, 3.13 ; maquette `bibliotheque.html`) : trois
 * blocs, « Vannes, conseils, vidéos » (thèmes publics, « Écouter, repérer », bonus des caps 2 à 4 ouverts),
 * « Vocabulaire et techniques » (bonus du cap 5 ouvert) et le coin « Humour noir, fait bien », rendu
 * seulement quand son lot existe (fichier vide aujourd'hui : coin absent). Rendu : SSR dynamique (cap,
 * « Fait » et témoin du coin propres à l'abonné, jamais en cache). Garde EN PREMIER.
 */
export const dynamic = "force-dynamic";

/**
 * s26 tour 3 (B2) : place de chaque bloc dès 1024, en trois colonnes, mesurée au plus petit vide de fin de colonne
 * (1280 et 1920, en-cours et nouvel ; hauteurs : construction 854, formules 856, vocabulaire 598, vannes 294, coin
 * fermé 202). Colonne 1 « Comment c'est construit » puis le coin, colonne 2 « Vannes, conseils, vidéos » puis
 * « Vocabulaire », colonne 3 « Formules à détourner » : vides de fin 0, 164 et 224 px (288, 0 et 286 avant, coin en
 * colonne 2). Rangées `auto auto 1fr` : la construction couvre les rangées 1 et 2, le coin la 3 ; « Vocabulaire »
 * couvre la 2 et la 3 : la rangée 1 garde la hauteur des vannes, aucun air entre deux blocs d'une même colonne. Sans
 * coin : `auto 1fr`, la disposition du tour 2.
 */
const PLACE_LG = (coin: boolean) => ({
  vannes: "lg:col-start-2 lg:row-start-1",
  coin: "lg:col-start-1 lg:row-start-3",
  construction: "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  vocabulaire: cn("lg:col-start-2 lg:row-start-2", coin && "lg:row-span-2"),
  formule: cn("lg:col-start-3 lg:row-start-1", coin ? "lg:row-span-3" : "lg:row-span-2"),
});

export async function generateMetadata(): Promise<Metadata> {
  if (!ESPACE_CLIENT_PUBLIE) return METADONNEES_404;
  // Nav v6 (lot B) : visiteur et inscrit gratuit, l'aperçu (`noindex, follow`) ; sinon la tête d'avant.
  return (await lireLecteurApercu()) ? metadonneesApercu("bibliotheque") : { title: T.titre };
}

export default async function BibliothequePage() {
  // Nav v6 (lot B) : 404 interrupteur fermé (avant toute lecture) ; visiteur et inscrit gratuit, l'aperçu à cette
  // adresse, sans redirection ; sinon la garde d'avant (abonné actif : la rubrique ; ancien abonné : /abonnement).
  const lecteur = await lireLecteurApercu();
  if (lecteur) return <ApercuBibliotheque visiteur={lecteur === "visiteur"} />;
  const { userId } = await garderEspace("/mon-espace/bibliotheque");
  const acces = { acces: "ouvert" as const, userId };
  const f = chargeursFiches;
  const coin = f.listerFiches("humour-noir", acces);
  const parType: Record<keyof typeof T.prefixes, Fiche[]> = {
    ecouter: f.listerFiches("ecouter", acces),
    construction: f.listerFiches("construction", acces),
    vocabulaire: f.listerFiches("vocabulaire", acces),
    formule: f.listerFiches("formule", acces),
  };
  const brutes = Object.values(parType).flat();
  const [cap, envoyees] = await Promise.all([lireCapDeblocage(prisma, userId), envoyeesSiBesoin(prisma, brutes)]);
  const visibles = new Set(fichesVisibles(brutes, envoyees).map((x) => x.id));
  const bonus = bonusOuverts(cap, acces).sort((a, b) => a.cap - b.cap);
  const faits = await idsFaits(userId, [...brutes.map((x) => x.id), ...bonus.map((b) => b.id), ...coin.map((x) => x.id)]);
  const lignesSansPrefixe = (type: keyof typeof T.prefixes) => parType[type].filter((x) => visibles.has(x.id)).map((x) => ligneDeFiche(x, faits));
  const marque = (b: (typeof bonus)[number]) => ligneDeBonus(b, faits, TEXTES_CAPS.bonus.marque(b.cap));
  const entre = coinEntre(cookies().get(COOKIE_COIN)?.value);
  const place = PLACE_LG(coin.length > 0);

  return (
    <div className="pb-16">
      {/* s26 (spec UX §2.2) : en-tête aligné à gauche (plus de centrage), comme « Aujourd'hui ». */}
      <header>
        <h1 className={TITRE_PAGE}>{T.titre}</h1>
      </header>
      {/* Relecture des captures nav s24 (design 1, ux F1) : cartes en colonnes CSS (chaque carte à la hauteur de son
          contenu, aucun vide sous une colonne étirée) : vannes, coin « Humour noir », puis une carte par groupe de
          techniques, titrée par le préfixe validé (« Comment c'est construit », « Vocabulaire », « Formules à
          détourner ») au lieu de le répéter à chaque ligne. s26 : 1 colonne, 2 dès 768 px, 3 dès 1024 px (4/4/4) ;
          coin absent, pas de carte et pas de trou. Chaque bloc : « faits/total » et sa prochaine ligne marquée.
          s26 tour 2 (relecture design, P1) : en colonnes CSS dès 1024, 540 à 800 px restaient vides sous deux colonnes.
          Dès 1024, grille explicite à trois colonnes, ordre du DOM inchangé (375 et 768 identiques) : « Comment c'est
          construit » en colonne 1 et « Formules à détourner » en colonne 3, placées d'abord sur toutes les rangées ; les
          autres blocs (vannes, coin, vocabulaire) remplissent la colonne 2 dans l'ordre. La dernière rangée est en `1fr`
          : si une colonne latérale dépasse la colonne 2, l'air tombe en fin de colonne, jamais entre deux blocs.
          s26 tour 3 (B2) : dès 1024, répartition rééquilibrée (`PLACE_LG`). À 375, « Comment c'est construit » en premier
          (`max-md:order-first`, conteneur en colonne flexible sous 768 : `gap-6` au lieu des marges, mêmes 24 px entre
          blocs, même bas de page) ; 768 inchangé (ordre du DOM, colonnes CSS équilibrées : 78 px d'écart en bas). */}
      <div
        className={cn(
          "mt-8 gap-6 max-md:flex max-md:flex-col max-md:[&>*]:mb-0 md:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid lg:grid lg:grid-cols-3 lg:items-start lg:[&>*]:mb-0",
          coin.length > 0 ? "lg:grid-rows-[auto_auto_1fr]" : "lg:grid-rows-[auto_1fr]",
        )}
        data-bibliotheque-grille
      >
        <BlocVannes ecouter={[...lignesSansPrefixe("ecouter"), ...bonus.filter((b) => b.cap < 5).map(marque)]} className={place.vannes} />
        {coin.length > 0 && <CoinHumourNoir lignesInitiales={entre ? coin.map((x) => ligneDeFiche(x, faits)) : null} className={place.coin} />}
        {(["construction", "vocabulaire", "formule"] as const).map((type) => {
          const groupe = [...lignesSansPrefixe(type), ...(type === "formule" ? bonus.filter((b) => b.cap === 5).map(marque) : [])];
          if (groupe.length === 0) return null;
          return (
            <BlocBibliotheque key={type} id={`groupe-${type}`} titre={T.prefixes[type]} compte={compteFaits(groupe)} className={cn(place[type], type === "construction" && "max-md:order-first")}>
              <div className="mt-4">
                <ListeFiches lignes={groupe} labelledBy={`groupe-${type}`} groupe={T.prefixes[type]} marquerProchaine />
              </div>
            </BlocBibliotheque>
          );
        })}
      </div>
    </div>
  );
}
