import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { RetourDe } from "@/components/espace/lien-retour";
import { cookies } from "next/headers";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { metadata as METADONNEES_404 } from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import { garderEspace } from "@/lib/espace/garde";
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
import { ListeFiches } from "@/components/espace/liste-fiches";
import { frEspaceProfond } from "@/lib/fr-typo";

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

export async function generateMetadata(): Promise<Metadata> {
  return ESPACE_CLIENT_PUBLIE ? { title: T.titre } : METADONNEES_404;
}

export default async function BibliothequePage() {
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

  return (
    <div>
      {/* Relecture des captures nav s24 (design 1, ux F1) : cinq cartes réparties en deux colonnes équilibrées dès
          768 px (colonnes CSS : chaque carte à la hauteur de son contenu, aucun vide sous une colonne étirée) :
          vannes, coin « Humour noir », puis une carte par groupe de techniques, titrée par le préfixe validé
          (« Comment c'est construit », « Vocabulaire », « Formules à détourner ») au lieu de le répéter à chaque ligne. */}
      <RetourDe chemin="/mon-espace/bibliotheque" />
      <PageHeader title={T.titre} />
      <div className="gap-6 md:columns-2 [&>*]:mb-6 [&>*]:break-inside-avoid">
        <BlocVannes ecouter={[...lignesSansPrefixe("ecouter"), ...bonus.filter((b) => b.cap < 5).map(marque)]} />
        {coin.length > 0 && <CoinHumourNoir lignesInitiales={entre ? coin.map((x) => ligneDeFiche(x, faits)) : null} />}
        {(["construction", "vocabulaire", "formule"] as const).map((type) => {
          const groupe = [...lignesSansPrefixe(type), ...(type === "formule" ? bonus.filter((b) => b.cap === 5).map(marque) : [])];
          if (groupe.length === 0) return null;
          return (
            <BlocBibliotheque key={type} id={`groupe-${type}`} titre={T.prefixes[type]}>
              <ListeFiches lignes={groupe} labelledBy={`groupe-${type}`} />
            </BlocBibliotheque>
          );
        })}
      </div>
    </div>
  );
}
