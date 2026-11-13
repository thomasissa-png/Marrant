import type { Metadata } from "next";
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
import { TEXTES_BIBLIOTHEQUE as T } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { BlocBibliotheque, BlocVannes } from "@/components/espace/bloc-bibliotheque";
import { CoinHumourNoir } from "@/components/espace/coin-humour-noir";
import { ListeFiches } from "@/components/espace/liste-fiches";

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
  const lignes = (type: keyof typeof T.prefixes) => parType[type].filter((x) => visibles.has(x.id)).map((x) => ligneDeFiche(x, faits, T.prefixes[type]));
  const marque = (b: (typeof bonus)[number]) => ligneDeBonus(b, faits, TEXTES_CAPS.bonus.marque(b.cap));
  const entre = coinEntre(cookies().get(COOKIE_COIN)?.value);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{T.titre}</h1>
      <div className="grid max-w-3xl grid-cols-1 gap-6">
        <BlocVannes ecouter={[...lignes("ecouter"), ...bonus.filter((b) => b.cap < 5).map(marque)]} />
        <BlocBibliotheque id="bloc-techniques" titre={T.blocTechniques}>
          <ListeFiches
            lignes={[...lignes("construction"), ...lignes("vocabulaire"), ...lignes("formule"), ...bonus.filter((b) => b.cap === 5).map(marque)]}
            labelledBy="bloc-techniques"
          />
        </BlocBibliotheque>
        {coin.length > 0 && <CoinHumourNoir lignesInitiales={entre ? coin.map((x) => ligneDeFiche(x, faits)) : null} />}
      </div>
    </div>
  );
}
