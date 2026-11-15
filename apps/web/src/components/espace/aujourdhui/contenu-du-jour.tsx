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
const TROISIEME = "md:col-span-2 xl:col-span-1";

function Carte({ id, titre, children, className }: { id: string; titre: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={className ? `${CARTE} ${className}` : CARTE} aria-labelledby={id}>
      <h3 id={id} className="text-base font-semibold text-text-primary">
        {titre}
      </h3>
      <div className="mt-3">{children}</div>
    </article>
  );
}

// Lot D11c (revue d'harmonie, défaut 13) : cible de 44 px gardée, mais ses 10 px sous le texte rentrent dans la
// marge de la carte (sinon ~34 px de vide sous le lien contre 24 au-dessus du titre).
const lienCarte = "-mb-2.5 inline-flex min-h-11 items-center text-accent-link underline underline-offset-2 hover:text-text-primary";

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

  return (
    <section aria-labelledby="jour-titre" className="flex flex-col gap-4" data-etat={etat.statut} data-contenu-du-jour>
      <h2 id="jour-titre" className="font-display text-xl font-bold text-text-primary">
        {T.jour.titre}
      </h2>
      {/* v5 §3 : 1 colonne, 2 dès 768 px, 3 dès 1280 px ; la 3e carte prend la ligne entière à 768.
          v6 tour 1 (point 4) : cartes de même hauteur sur une rangée (`items-stretch`, plus de bas en escalier). */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          <Carte id="jour-video" titre={T.jour.video} className={TROISIEME}>
            {etat.donnees.video ? (
              <>
                {/* Vignette de la vidéo, le même lecteur que l'accueil du site. */}
                {etat.donnees.video.youtubeId && (
                  // v6 tour 1 (point 4) : vignette sur toute la largeur de sa carte (à 768 px aussi, plus de vide à droite).
                  <div className={`relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated ${LECTEUR}`}>
                    <YouTubePlayer youtubeId={etat.donnees.video.youtubeId} title={etat.donnees.video.title} />
                  </div>
                )}
                <Link href={`/videos/${buildVideoSlug(etat.donnees.video)}`} className={lienCarte}>{frEspace(etat.donnees.video.title)}</Link>
              </>
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
