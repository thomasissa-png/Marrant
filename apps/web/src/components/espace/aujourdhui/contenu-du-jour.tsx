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
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";
import { TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { PastillesDa } from "@/components/espace/da-espace";
import { EMOJIS_RUBRIQUES } from "@/components/espace/emojis";

/**
 * s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11) : les trois cartes reprennent « Ton contenu du
 * jour » de l'accueil, émoji et titre en pastille violette ; liens violets. s26 finition avant lancement (point 4) : plus
 * de bandeau (réservé à la carte principale d'Aujourd'hui, l'action du jour) ; émojis de la table unique (point 2).
 */
const EMOJI_CARTES = { vanne: EMOJIS_RUBRIQUES.vanne, conseil: EMOJIS_RUBRIQUES.conseil, video: EMOJIS_RUBRIQUES.video } as const;

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

// v6 tour 1 (arbitrage 1) : le gabarit des cartes de l'accueil (`home/daily-content.tsx`) ; 24 px de marge à toutes les
// largeurs. v7 tour 7 (décision de Thomas du 16/11) : sans le filet violet (`CADRE_CARTE_NEUTRE`), un seul accent violet
// par écran, le bouton plein.
const CARTE = `${CADRE_CARTE_NEUTRE} p-6`;

/**
 * v6 tour 1 (point 4), lecteur partagé (`ui/youtube-player`, hors de ce lot) réglé depuis sa carte : bouton de
 * lecture aux couleurs du thème (fond sombre et filet clair, plus le rouge vif qui concurrençait le bouton plein
 * de l'action du jour) ; titre incrusté de repli masqué (le titre est déjà le lien sous la vignette : une fois).
 * v7 tour 7 (un seul accent violet par écran) : fond de repli de la vignette (miniature indisponible) sans le dégradé
 * violet du lecteur partagé, le fond élevé neutre du bouton reste dessous.
 */
const LECTEUR = "[&_button>div]:bg-background/80 [&_button>div]:ring-1 [&_button>div]:ring-white/40 [&_button_span_span]:hidden [&_button>span]:bg-none";

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
 * v7 tour 11 (3 x 4 de la spec UX, rangée symétrique de celle du dessus) : remesuré à 1280 avec la vignette, trois
 * colonnes creusent la vanne de 111 px et le conseil de 127 px entre leur corps et leur pied (seuil : 32) ; on garde
 * les deux colonnes.
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
  lien: "md:max-lg:col-start-2 md:max-lg:row-start-3 md:max-lg:mb-0 md:max-lg:mt-4 md:max-lg:font-display md:max-lg:text-xl",
} as const;
/** Sans vignette (chargement, repli, vidéo sans `youtubeId`) : trois cartes courtes côte à côte dès 1024, comme avant. */
const TROISIEME = "md:col-span-2 lg:col-span-1";
/**
 * s26 contrôle d'ensemble, abonné (C5 : 81 px vides sous le titre de la vidéo à 1280, carte étirée à la hauteur de la
 * colonne de gauche) : dès 1024, la vignette prend la hauteur restante de la carte (miniature en `object-cover`) au lieu
 * du 16:9, sans `min-h` : le titre de la vidéo reste son pied, aucun vide dans la carte. Corps de la carte vidéo
 * souple (plus de `pile`).
 */
const VIGNETTE_REMPLIT = "lg:aspect-auto lg:flex-1";

function Carte({
  id,
  titre,
  children,
  className,
  media,
  pile,
}: {
  id: string;
  titre: string;
  children: React.ReactNode;
  className?: string;
  /** Ligne de média de 768 à 1023 px (carte vidéo avec vignette, `VIDEO_768`). */
  media?: boolean;
  /**
   * s26 liste et détail, tour 7 (spec `espace-aujourdhui-refonte-s25` « carte du jour sans creux, 1280 px » en échec selon
   * le contenu du jour : 41 px le 19/11 dans le conseil, 143 px un autre jour dans la vidéo) : dès 1024, vidéo à droite
   * sur deux rangées (`VIDEO_A_DROITE`), la colonne la plus courte s'étire à la hauteur de l'autre et son pied en
   * `mt-auto` creusait ce surplus entre le texte et le lien. Le corps garde sa hauteur (`lg:flex-none`) : le pied suit
   * son texte, le surplus passe en fin de carte (vide de fin permis, v7 tour 6) ; cartes toujours alignées en haut et
   * en bas (`items-stretch`). Sans vignette et sous 1024 : rendu inchangé.
   */
  pile?: boolean;
}) {
  const emoji = EMOJI_CARTES[id === "jour-vanne" ? "vanne" : id === "jour-conseil" ? "conseil" : "video"];
  return (
    <article className={cn(CARTE, "flex flex-col", media && VIDEO_768.carte, className)} aria-labelledby={id}>
      <PastillesDa as="h3" id={id} emoji={emoji} pastille={titre} className={cn(media && VIDEO_768.titre)} />
      <div className={cn("mt-2 flex flex-1 flex-col", pile && "lg:flex-none", media && VIDEO_768.corps)}>{children}</div>
    </article>
  );
}

// Lot D11c (revue d'harmonie, défaut 13) : cible de 44 px gardée, mais ses 10 px sous le texte rentrent dans la
// marge de la carte (sinon ~34 px de vide sous le lien contre 24 au-dessus du titre).
// v7 tour 2 (faute 3) : le lien est le pied de sa carte (`mt-auto`), à sa largeur de texte (`self-start`).
// Échelle s25 : 16/600 blanc souligné (plus de texte violet, un seul violet par écran : le bouton plein).
// v7 tour 7 (rythme de 8 px) : `-mb-2` au lieu de `-mb-2.5` (26 px sous le texte au lieu de 24) ; toutes les cartes ont
// le même pied, les bas restent alignés.
// s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11, « liens et mots-clés violets ») : le lien du pied
// passe au violet des liens de l'accueil (`text-accent-link`), même gabarit, toujours souligné.
const lienCarte = cn("-mb-2 mt-auto inline-flex min-h-11 items-center self-start", TEXTE_FORT, "text-accent-link underline underline-offset-2 hover:no-underline");

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
    <section aria-labelledby="jour-titre" className="flex flex-col gap-6" data-etat={etat.statut} data-contenu-du-jour>
      <h2 id="jour-titre" className={TITRE_CARTE}>
        {T.jour.titre}
      </h2>
      {/* v5 §3 : 1 colonne, 2 dès 768 px ; la 3e carte prend la ligne entière à 768, et la colonne de droite sur deux
          rangées dès 1024 quand elle a sa vignette (v7 tour 2, `VIDEO_A_DROITE`). v6 tour 1 (point 4) : bas alignés (`items-stretch`, pas d'escalier). */}
      <div className={cn("grid grid-cols-1 items-stretch gap-6 md:grid-cols-2", !vignette && "lg:grid-cols-3")} data-jour-grille>
      {etat.statut === "chargement" &&
        [0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none ${i === 2 ? TROISIEME : ""}`}>
            <div className="h-5 w-32 rounded bg-background-elevated" />
            <div className="mt-4 h-4 w-3/4 rounded bg-background-elevated" />
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
          <Carte id="jour-vanne" titre={T.jour.vanne} pile={vignette}>
            {etat.donnees.joke ? (
              <VanneToucher vanneDuJour={etat.donnees.joke} categories={categories} />
            ) : (
              <Link href="/vannes" className={lienCarte}>{T.jour.repli.vannes}</Link>
            )}
          </Carte>
          <Carte id="jour-conseil" titre={T.jour.conseil} pile={vignette}>
            {etat.donnees.tip ? (
              <>
                {/* Relecture des captures nav s24 (design 5, ux F6b, reviewer FD4) : le début du conseil, comme
                    l'accueil du site, au lieu d'un lien seul dans une carte vide. */}
                {etat.donnees.tip.content && (
                  <p className={`mb-4 ${TEXTE}`}>{frEspace(contenuAffiche(extrait(etat.donnees.tip.content)))}</p>
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
                  // Échelle s25 : la vignette et son titre forment un bloc (8 px, la cible de 44 px du lien ajoute son air).
                  <div className={cn("relative mb-2 aspect-video overflow-hidden rounded-xl bg-background-elevated", VIDEO_768.vignette, VIGNETTE_REMPLIT, LECTEUR)}>
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
