"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { buildTipSlug, buildVideoSlug } from "@/lib/catalogue-slug";
import type { CategorieToucher } from "@/lib/espace/vanne";
import { VanneToucher, type VanneAffichee } from "@/components/espace/aujourdhui/vanne-toucher";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";
import { contenuAffiche } from "@/lib/tip-prose";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { CADRE_CARTE } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Contenu du jour » de « Aujourd'hui » (décision C13, architecture 4.4) : vanne, conseil et vidéo
 * du jour au même poids, trois cartes empilées ; la vanne porte le toucher. Données : `/api/daily`
 * (la même source que l'accueil, réponse en liste fermée de champs), lue côté navigateur avec un
 * délai de 5 s. États : chargement (cartes vides de même gabarit), erreur ou rien à montrer (les
 * portes du catalogue, jamais un message technique), succès.
 */
type Daily = {
  joke: VanneAffichee | null;
  tip: { id: string; title: string; content?: string | null } | null;
  video: { id: string; title: string; youtubeId?: string | null } | null;
};
type Etat = { statut: "chargement" } | { statut: "erreur" } | { statut: "ok"; donnees: Daily };

// v6 tour 1 (arbitrage 1) : les cartes de l'accueil (`home/daily-content.tsx`), filet compris.
const CARTE = `${CADRE_CARTE} p-4 md:p-6`;

/**
 * v6 tour 1 (point 4), lecteur partagé (`ui/youtube-player`, hors de ce lot) réglé depuis sa carte : bouton de
 * lecture aux couleurs du thème (fond sombre et filet clair, plus le rouge vif qui concurrençait le bouton plein
 * de l'action du jour) ; titre incrusté de repli masqué (le titre est déjà le lien sous la vignette : une fois).
 */
const LECTEUR = "[&_button>div]:bg-background/80 [&_button>div]:ring-1 [&_button>div]:ring-white/40 [&_button_span_span]:hidden";

/**
 * Début du conseil, coupé à la fin d'une phrase (tour 2, reviewer P6 : plus de mot coupé par `line-clamp`) : les
 * phrases entières tant qu'on reste sous 220 caractères, au moins la première.
 */
function extrait(texte: string): string {
  const phrases = texte.replace(/\s+/g, " ").trim().match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) ?? [texte];
  let sortie = "";
  for (const p of phrases) {
    if (sortie && (sortie + p).length > 220) break;
    sortie += p;
  }
  return sortie.trim();
}
/**
 * v7 tour 2 (faute 3, 130 px de creux dans la vanne et le conseil à 1280 et 1920) : dès 1024 px, deux colonnes ; la
 * vanne puis le conseil empilés à gauche, la vidéo à droite sur les deux rangées (vignette plus grande : sa hauteur
 * rejoint celle des deux cartes de texte). Les bas restent alignés (`items-stretch`), le pied de chaque carte (lien,
 * « Une autre ») en `mt-auto`. À 768, inchangé : vanne et conseil côte à côte, la vidéo sur la ligne entière.
 */
const VIDEO_A_DROITE = "md:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1";
/**
 * v7 tour 3 (piste 768) : de 768 à 1023 px, la carte vidéo garde la ligne entière mais n'est plus une dalle.
 * v7 tour 4 (faute 2, environ 350 x 125 px vides à droite de la vignette) : la carte devient une ligne de média.
 * Vignette à gauche (17rem, 272 x 153 px), en face le titre de la carte puis celui de la vidéo (20 px), centrés en
 * hauteur sur la vignette par deux rangées souples (`1fr`) : le bloc de texte occupe la colonne, sans quart vide
 * (mesuré à 768 : 31 px au-dessus et au-dessous du texte pour un titre sur deux lignes). Ordre du DOM
 * inchangé (titre de la carte, vignette, lien), placement par la grille seulement.
 */
const VIDEO_768 = {
  carte: "md:max-lg:grid md:max-lg:grid-cols-[17rem_1fr] md:max-lg:grid-rows-[1fr_auto_auto_1fr] md:max-lg:gap-x-6",
  titre: "md:max-lg:col-start-2 md:max-lg:row-start-2",
  corps: "md:max-lg:contents",
  vignette: "md:max-lg:col-start-1 md:max-lg:row-span-4 md:max-lg:row-start-1 md:max-lg:mb-0",
  lien: "md:max-lg:col-start-2 md:max-lg:row-start-3 md:max-lg:mb-0 md:max-lg:mt-4 md:max-lg:text-xl md:max-lg:font-semibold",
} as const;
/** Sans vignette (chargement, repli, vidéo sans `youtubeId`) : trois cartes courtes côte à côte dès 1024, comme avant. */
const TROISIEME = "md:col-span-2 lg:col-span-1";

function Carte({
  id,
  titre,
  children,
  className,
  media,
}: {
  id: string;
  titre: string;
  children: React.ReactNode;
  className?: string;
  /** Ligne de média de 768 à 1023 px (carte vidéo avec vignette, `VIDEO_768`). */
  media?: boolean;
}) {
  return (
    <article className={cn(CARTE, "flex flex-col", media && VIDEO_768.carte, className)} aria-labelledby={id}>
      <h3 id={id} className={cn("text-base font-semibold text-text-primary", media && VIDEO_768.titre)}>
        {titre}
      </h3>
      <div className={cn("mt-3 flex flex-1 flex-col", media && VIDEO_768.corps)}>{children}</div>
    </article>
  );
}

// Lot D11c (revue d'harmonie, défaut 13) : cible de 44 px gardée, mais ses 10 px sous le texte rentrent dans la
// marge de la carte (sinon ~34 px de vide sous le lien contre 24 au-dessus du titre).
// v7 tour 2 (faute 3) : le lien est le pied de sa carte (`mt-auto`), à sa largeur de texte (`self-start`).
const lienCarte = "-mb-2.5 mt-auto inline-flex min-h-11 items-center self-start text-accent-link underline underline-offset-2 hover:text-text-primary";

export function ContenuDuJour({ categories }: { categories: readonly CategorieToucher[] }) {
  const [etat, setEtat] = useState<Etat>({ statut: "chargement" });

  useEffect(() => {
    const controleur = new AbortController();
    const delai = setTimeout(() => controleur.abort(), 5_000);
    fetch("/api/daily", { signal: controleur.signal })
      .then((res) => (res.ok ? (res.json() as Promise<Daily>) : null))
      .then((d) => setEtat(d && (d.joke || d.tip || d.video) ? { statut: "ok", donnees: d } : { statut: "erreur" }))
      .catch(() => setEtat({ statut: "erreur" }))
      .finally(() => clearTimeout(delai));
    return () => {
      clearTimeout(delai);
      controleur.abort();
    };
  }, []);

  const vignette = etat.statut === "ok" && Boolean(etat.donnees.video?.youtubeId);
  return (
    <section aria-labelledby="jour-titre" className="flex flex-col gap-4 md:gap-6" data-etat={etat.statut} data-contenu-du-jour>
      <h2 id="jour-titre" className="font-display text-2xl font-bold text-text-primary md:text-3xl">
        {T.jour.titre}
      </h2>
      {/* v5 §3 : 1 colonne, 2 dès 768 px ; la 3e carte prend la ligne entière à 768, et la colonne de droite sur deux
          rangées dès 1024 quand elle a sa vignette (v7 tour 2, `VIDEO_A_DROITE`). v6 tour 1 (point 4) : bas alignés (`items-stretch`, pas d'escalier). */}
      <div className={cn("grid grid-cols-1 items-stretch gap-6 md:grid-cols-2", !vignette && "lg:grid-cols-3")} data-jour-grille>
      {etat.statut === "chargement" &&
        [0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none ${i === 2 ? TROISIEME : ""}`}>
            <div className="h-5 w-32 rounded bg-background-elevated" />
            <div className="mt-3 h-4 w-3/4 rounded bg-background-elevated" />
          </div>
        ))}
      {etat.statut === "erreur" && (
        <>
          <Carte id="jour-vanne" titre={T.jour.vanne}>
            <Link href="/vannes" className={lienCarte}>{T.jour.repli.vannes}</Link>
          </Carte>
          <Carte id="jour-conseil" titre={T.jour.conseil}>
            <Link href="/conseils" className={lienCarte}>{T.jour.repli.conseils}</Link>
          </Carte>
          <Carte id="jour-video" titre={T.jour.video} className={TROISIEME}>
            <Link href="/videos" className={lienCarte}>{T.jour.repli.videos}</Link>
          </Carte>
        </>
      )}
      {etat.statut === "ok" && (
        <>
          <Carte id="jour-vanne" titre={T.jour.vanne}>
            {etat.donnees.joke ? (
              <VanneToucher vanneDuJour={etat.donnees.joke} categories={categories} />
            ) : (
              <Link href="/vannes" className={lienCarte}>{T.jour.repli.vannes}</Link>
            )}
          </Carte>
          <Carte id="jour-conseil" titre={T.jour.conseil}>
            {etat.donnees.tip ? (
              <>
                {/* Relecture des captures nav s24 (design 5, ux F6b, reviewer FD4) : le début du conseil, comme
                    l'accueil du site, au lieu d'un lien seul dans une carte vide. */}
                {etat.donnees.tip.content && (
                  <p className="mb-3 text-sm leading-relaxed text-text-secondary">{frEspace(contenuAffiche(extrait(etat.donnees.tip.content)))}</p>
                )}
                <Link href={`/conseils/${buildTipSlug(etat.donnees.tip)}`} className={lienCarte}>{frEspace(etat.donnees.tip.title)}</Link>
              </>
            ) : (
              <Link href="/conseils" className={lienCarte}>{T.jour.repli.conseils}</Link>
            )}
          </Carte>
          <Carte id="jour-video" titre={T.jour.video} className={vignette ? VIDEO_A_DROITE : TROISIEME} media={vignette}>
            {etat.donnees.video ? (
              <div className={cn("flex flex-1 flex-col", vignette && VIDEO_768.corps)}>
                {/* Vignette de la vidéo, le même lecteur que l'accueil du site. */}
                {etat.donnees.video.youtubeId && (
                  // v6 tour 1 (point 4) : vignette sur toute la largeur de sa carte (v7 tour 4 : à gauche, 17rem, à 768 px).
                  <div className={cn("relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated", VIDEO_768.vignette, LECTEUR)}>
                    <YouTubePlayer youtubeId={etat.donnees.video.youtubeId} title={etat.donnees.video.title} />
                  </div>
                )}
                <Link href={`/videos/${buildVideoSlug(etat.donnees.video)}`} className={cn(lienCarte, vignette && VIDEO_768.lien)}>
                  {frEspace(etat.donnees.video.title)}
                </Link>
              </div>
            ) : (
              <Link href="/videos" className={lienCarte}>{T.jour.repli.videos}</Link>
            )}
          </Carte>
        </>
      )}
      </div>
    </section>
  );
}
