import Link from "next/link";
import { buildLoginUrl } from "@/lib/auth-links";
import { PARCOURS_MIN_WEEKS } from "@/config/premium";
import { progressionParcoursLabel } from "@/config/textes/accessibilite";
import { buttonVariants } from "@/components/ui/button";
import { BOUTON_SECONDAIRE, CADRE_CARTE_NEUTRE, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { BarreProgression } from "@/components/espace/aujourdhui/tableau";
import { Verrou } from "@/components/espace/apercu/badge-premium";
import { META, TEXTE, TEXTE_FORT, TITRE_CARTE } from "@/components/espace/typo";
import { cn } from "@/lib/utils";

/**
 * Cartes de « Mon profil » ouvert (s26, `docs/design/questions-repliques-lettre-profil-s26.md` §7) : mêmes textes que
 * `profil-dashboard.tsx` (repris mot pour mot), cadre neutre et échelle `typo.ts`. Aucun aplat ici : le seul bouton
 * plein de l'écran est « Reprendre » (abonné), l'offre (gratuit) ou « Se connecter » (visiteur).
 */
export const CARTE_PROFIL = cn(CADRE_CARTE_NEUTRE, "min-w-0 p-6 [overflow-wrap:anywhere]");

export interface ParcoursProgress {
  slug: string;
  title: string;
  icon: string;
  completedSteps: number;
  totalSteps: number;
  completedAt: string | null;
}

/** Visiteur : la carte existante, verrou SVG de l'espace à la place du 🔒 (règle sans émoji), bouton plein. */
export function ConnexionProfil({ className }: { className?: string }) {
  return (
    <div className={cn(CARTE_PROFIL, "flex flex-col items-start", className)} data-profil-connexion>
      <Verrou className="h-6 w-6" />
      <p className={cn("mt-4", TEXTE_FORT)}>Connecte-toi pour voir ton profil</p>
      <Link href={buildLoginUrl({ callbackUrl: "/profil" })} className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full md:w-auto")}>
        Se connecter
      </Link>
    </div>
  );
}

/** Chargement : le squelette d'avant, en cartes neutres. */
export function SqueletteProfil() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2" data-profil-squelette>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={cn(CARTE_PROFIL, "animate-pulse")}>
          <div className="h-6 w-1/3 rounded bg-background-elevated" />
          <div className="mt-4 h-4 w-2/3 rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}

type Piste = { href: string; titre: string; texte: string };

/** « Prochaine étape » : les pistes d'avant, selon les mêmes seuils. */
export function ProchaineEtape({ tips, jokes, aDesParcours }: { tips: number; jokes: number; aDesParcours: boolean }) {
  const pistes: Piste[] = [];
  if (tips < 3) pistes.push({ href: "/conseils", titre: "Apprends les bases", texte: "Commence par la répartie et le timing : les deux réflexes qui changent le plus vite une conversation." });
  if (jokes < 10) pistes.push({ href: "/vannes", titre: "Enrichis ton répertoire", texte: "Pioche des vannes par situation et garde de côté celles que tu te vois déjà ressortir." });
  if (tips >= 3 && jokes >= 10 && !aDesParcours)
    pistes.push({ href: "/parcours", titre: "Lance-⁠toi dans un parcours", texte: "Tu as les bases. Un parcours te donne un fil à suivre, une étape après l’autre." });
  if (tips >= 3 && jokes >= 10 && aDesParcours)
    pistes.push({ href: "/conseils", titre: "Approfondis tes techniques", texte: "Tu as les bases : passe aux conseils avancés, ceux qui font la différence entre drôle et vraiment drôle." });
  pistes.push({ href: "/videos", titre: "Regarde les pros", texte: "Décortique les techniques des meilleurs humoristes, puis pique-⁠leur ce qui te va." });
  return (
    <section aria-labelledby="profil-prochaine" className={CARTE_PROFIL} data-profil-prochaine>
      <h2 id="profil-prochaine" className={TITRE_CARTE}>
        Prochaine étape
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pistes.map((p) => (
          <li key={p.titre} className="min-w-0">
            <Link
              href={p.href}
              className="block h-full rounded-xl border border-border p-4 transition-colors hover:border-border-hover hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            >
              <span className={cn("block", TEXTE_FORT)}>{p.titre}</span>
              <span className={cn("mt-2 block", META)}>{p.texte}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** « Statistiques » : les quatre compteurs d'avant, chiffres en `TITRE_CARTE` (plus de violet). */
export function Statistiques({ stats }: { stats: { jokesRead: number; tipsCompleted: number; totalFavorites: number; pathsCompleted: number } }) {
  const lignes: [number, string][] = [
    [stats.jokesRead, "Vannes lues"],
    [stats.tipsCompleted, "Conseils terminés"],
    [stats.totalFavorites, "Favoris sauvegardés"],
    [stats.pathsCompleted, "Parcours terminés"],
  ];
  return (
    <section aria-labelledby="profil-stats" className={CARTE_PROFIL} data-profil-stats>
      <h2 id="profil-stats" className={TITRE_CARTE}>
        Statistiques
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {lignes.map(([n, libelle]) => (
          <div key={libelle} className="flex flex-col-reverse">
            <dt className={META}>{libelle}</dt>
            <dd className={TITRE_CARTE}>{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** « Mes parcours » : vide = la phrase d'avant et son lien ; sinon une ligne par parcours, barre neutre. */
export function MesParcours({ parcours }: { parcours: readonly ParcoursProgress[] }) {
  return (
    <section aria-labelledby="profil-parcours" className={CARTE_PROFIL} data-profil-parcours>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="profil-parcours" className={TITRE_CARTE}>
          Mes parcours
        </h2>
        <Link href="/parcours" className={LIEN_NEUTRE}>
          Voir tout
        </Link>
      </div>
      {parcours.length === 0 ? (
        <div className="mt-4">
          <p className={TEXTE}>
            Tu n’as pas encore commencé de parcours. Le plus court dure {PARCOURS_MIN_WEEKS} semaines, à peine le temps de t’y habituer.
          </p>
          <Link href="/parcours" className={cn(BOUTON_SECONDAIRE, "mt-4")}>
            Découvrir les parcours
          </Link>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {parcours.map((p) => {
            const fini = p.completedAt !== null;
            return (
              <li key={p.slug}>
                <Link
                  href={`/parcours/${p.slug}`}
                  aria-label={progressionParcoursLabel(p.title, p.completedSteps, p.totalSteps)}
                  className="block rounded-xl border border-border p-4 transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                >
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                    <span className={cn("min-w-0", TEXTE_FORT)}>{p.title}</span>
                    <span className={cn("tabular-nums", META)}>{fini ? "Terminé" : `${p.completedSteps}/${p.totalSteps} étapes`}</span>
                  </span>
                  <BarreProgression faites={p.completedSteps} total={p.totalSteps} className="mt-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
