"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { buildTipSlug, buildVideoSlug } from "@/lib/catalogue-slug";
import type { CategorieToucher } from "@/lib/espace/vanne";
import { VanneToucher, type VanneAffichee } from "@/components/espace/aujourdhui/vanne-toucher";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

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
  tip: { id: string; title: string } | null;
  video: { id: string; title: string } | null;
};
type Etat = { statut: "chargement" } | { statut: "erreur" } | { statut: "ok"; donnees: Daily };

const CARTE = "rounded-lg border border-border bg-background-card p-4 md:p-6";

function Carte({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <article className={CARTE} aria-labelledby={id}>
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
    <section aria-labelledby="jour-titre" className="flex flex-col gap-4" data-etat={etat.statut}>
      <h2 id="jour-titre" className="font-display text-xl font-bold text-text-primary">
        {T.jour.titre}
      </h2>
      {etat.statut === "chargement" &&
        [0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className={`${CARTE} animate-pulse motion-reduce:animate-none`}>
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
          <Carte id="jour-video" titre={T.jour.video}>
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
              <Link href={`/conseils/${buildTipSlug(etat.donnees.tip)}`} className={lienCarte}>{frEspace(etat.donnees.tip.title)}</Link>
            ) : (
              <Link href="/conseils" className={lienCarte}>{T.jour.repli.conseils}</Link>
            )}
          </Carte>
          <Carte id="jour-video" titre={T.jour.video}>
            {etat.donnees.video ? (
              <Link href={`/videos/${buildVideoSlug(etat.donnees.video)}`} className={lienCarte}>{frEspace(etat.donnees.video.title)}</Link>
            ) : (
              <Link href="/videos" className={lienCarte}>{T.jour.repli.videos}</Link>
            )}
          </Carte>
        </>
      )}
    </section>
  );
}
