/**
 * Test d'inertie de l'espace client (s24, lot D0, plan §2 règle 2), relancé à chaque lot.
 *
 * Interrupteur `ESPACE_CLIENT_PUBLIE` fermé, le HTML de ce qu'un lot de l'espace va toucher
 * reste celui de la production : en-tête (HTML serveur ; menu mobile ouvert sur /profil,
 * /parcours, /favoris ; menu de compte ouvert) pour visiteur, compte FREE et abonné sur les 10 pages publiques du plan ; pied
 * de page ; pages /profil et /favoris. Référence prise sur `main` avant le premier lot
 * (`__snapshots__/inertie-espace.test.tsx.snap`). Un écart = un changement visible flag
 * fermé : corriger le code, JAMAIS mettre la référence à jour (`-u` interdit ici).
 *
 * Plus un garde-fou de construction : aucun fichier hors du périmètre de l'espace n'importe
 * l'interrupteur ou `lib/espace/*`, sauf la liste blanche (complétée lot par lot, dans le
 * même commit que la retouche, chaque retouche étant sous garde de l'interrupteur).
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { TextEncoder } from "util";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountMenu } from "@/components/layout/account-menu";
import ProfilPage from "@/app/(dashboard)/profil/page";
import FavorisPage from "@/app/(dashboard)/favoris/page";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));

// jsdom n'expose pas TextEncoder, requis par le rendu serveur de React.
Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };

const PAGES = [
  "/profil",
  "/parcours",
  "/parcours/repartie",
  "/favoris",
  "/vannes",
  "/conseils",
  "/videos",
  "/carnet",
  "/abonnement",
  "/abonnement/success",
];
const ETATS = {
  visiteur: { data: null, status: "unauthenticated" },
  gratuit: { data: { user: { id: "u1", name: "Yanis", email: "y@x.fr", plan: "FREE" } }, status: "authenticated" },
  abonne: { data: { user: { id: "u2", name: "Sophie", email: "s@x.fr", plan: "PREMIUM" } }, status: "authenticated" },
} as const;

beforeEach(() => {
  usePathname.mockReturnValue("/");
  useSession.mockReturnValue(ETATS.visiteur);
});

it("l'interrupteur est fermé (référence prise flag fermé)", () => {
  expect(ESPACE_CLIENT_PUBLIE).toBe(false);
});

/** Identifiants générés par React (`useId`, Radix) : dépendent de l'ordre des rendus, pas du code. */
const stable = (html: string) => html.replace(/:r[0-9a-z]+:/g, ":r:");
/** Pages où le menu mobile ouvert est aussi figé (celles que l'espace touche). */
const PAGES_MENU_MOBILE = new Set(["/profil", "/parcours", "/favoris"]);

describe.each(Object.entries(ETATS))("en-tête, %s", (_etat, session) => {
  it.each(PAGES)("%s : HTML serveur", async (page) => {
    usePathname.mockReturnValue(page);
    useSession.mockReturnValue(session);
    expect(stable(renderToStaticMarkup(<Header />))).toMatchSnapshot("serveur");
    if (!PAGES_MENU_MOBILE.has(page)) return;
    const { container, unmount } = render(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(stable(container.innerHTML)).toMatchSnapshot("menu mobile ouvert");
    unmount();
  });
});

it("menu de compte ouvert (compte connecté)", async () => {
  useSession.mockReturnValue(ETATS.abonne);
  render(<AccountMenu />);
  await userEvent.click(screen.getByRole("button", { name: "Mon compte" }));
  expect(stable(document.body.innerHTML)).toMatchSnapshot();
});

it("pied de page", () => {
  expect(stable(renderToStaticMarkup(<Footer />))).toMatchSnapshot();
});

describe.each(Object.entries(ETATS))("pages /profil et /favoris, %s", (_etat, session) => {
  it("HTML serveur", () => {
    useSession.mockReturnValue(session);
    expect(stable(renderToStaticMarkup(<ProfilPage searchParams={{}} />))).toMatchSnapshot("profil");
    expect(stable(renderToStaticMarkup(<FavorisPage />))).toMatchSnapshot("favoris");
  });
});

describe("garde-fou de construction", () => {
  const SRC = join(__dirname, "../..");
  /**
   * Fichiers hors périmètre autorisés à importer l'espace (vide au lot D0).
   * D2 : l'en-tête monte l'en-tête abonné et la barre, sous garde de l'interrupteur.
   * D3 : la page de succès et la connexion calculent l'arrivée, sous garde de l'interrupteur.
   * D4 : parcours, profil, bulle d'XP et seuils (détail ci-dessous), sous garde de l'interrupteur.
   */
  const LISTE_BLANCHE: string[] = [
    // D11b, touché de nouveau : repère de chargement de l'en-tête abonné à 65 px (rendu ouvert et Premium seulement).
    "components/layout/header.tsx",
    // D10b : condition de la puce des bonus de l'e-mail E0 (`bonusTousPublies`, lecture de fichier seule) ; la
    // puce n'est écrite qu'interrupteur ouvert (`paiement.ts`), fermé l'e-mail reste identique (hachage, D10).
    "lib/emails/paiement-notifications.ts",
    // D10b : purge de `UsageEvent` programmée sur le planificateur existant, inerte interrupteur fermé
    // (import dynamique de l'interrupteur, testé dans `purge-usage-d10b-s24.test.ts`).
    "lib/scheduler/jobs.ts",
    // D3 : arrivées après paiement et après connexion, sous garde de l'interrupteur.
    "app/(dashboard)/abonnement/success/page.tsx",
    "app/(auth)/login/page.tsx",
    // D3 : /mon-espace/** réécrit vers la 404 naturelle interrupteur fermé.
    // D11b (Q-1), touché de nouveau : ouvert seulement, l'adresse demandée sous /mon-espace est transmise au
    // layout (en-tête `EN_TETE_CHEMIN_ESPACE`) ; fermé, la réécriture vers la 404 passe avant (testé).
    "middleware.ts",
    // D4 : en-tête de l'abonné sur /parcours (4 premières semaines, « Ton cap »), monté seulement ouvert.
    "app/(dashboard)/parcours/(liste)/page.tsx",
    // D4 : liste /parcours, abonné, ouvert seulement : pas de second « Reprendre », quiz d'orientation sous la liste.
    "components/parcours/parcours-content.tsx",
    // D4 : page d'un parcours enrichie pour l'abonné (sommaire, annonce de cap), ouvert seulement.
    "components/parcours/parcours-detail.tsx",
    // D4 : fiches de l'étape et ancres `#fiche-N-M`, avec la prop `ancresFiches` (vraie ouvert seulement).
    "components/parcours/parcours-step-card.tsx",
    // D4 : carte « Ton cap » à la place de « Progression » sur /profil, ouvert seulement.
    "components/profil/profil-dashboard.tsx",
    // D4 : bulle « +X XP » sans emoji et 5 s au moins, ouvert seulement.
    "components/ui/xp-notification.tsx",
    // D4 : seuils des caps (0, 100, 300, 700, 2 300) appliqués ouvert ; fermé, l'ancienne table.
    "lib/progression.ts",
    // D4 (@legal G9) : trois lignes de la confidentialité sur la question C9, rendues ouvert seulement.
    "app/(dashboard)/confidentialite/page.tsx",
    // D4, touchés sans import de l'espace (aucun effet fermé) : `lib/utils.ts` et `config/textes/parcours.ts`
    // (marques A_SUPPRIMER_APRES_OUVERTURE en commentaire), `lib/account.ts` (export des données :
    // `EspaceCompte` et `CapAnnonce`, tables vides fermé, demande @legal G9).
    "lib/utils.ts",
    "config/textes/parcours.ts",
    "lib/account.ts",
    // D5, déjà listés, touchés de nouveau :
    // - `app/(dashboard)/parcours/(liste)/page.tsx` (arbitrage @ux D4 n°1) : fil d'Ariane et introduction
    //   publique dans `MasqueSiPremium` seulement ouvert ; fermé, mêmes éléments (fragment), HTML identique ;
    // - `components/profil/profil-dashboard.tsx` (arbitrage @ux D4 n°2) : carte « Série » rendue fermé
    //   seulement, « Ton cap » en `md:col-span-2` ouvert ;
    // - `lib/account.ts` : export et suppression du compte avec `CarteSuivi`, `CarteReponse`, `FicheFait`,
    //   `MissionRetour`, `UserReplique` (tables vides fermé ; la suppression du compte emporte tout).
    // D6 (architecture 3.12) : un abonné dont le navigateur n'est pas « entré » dans le coin « Humour noir,
    // fait bien » ne trouve aucune vanne repérée dans la recherche ni dans ses favoris. Sous garde de
    // l'interrupteur dans `filtreHumourNoir` : fermé, filtre vide, témoin non lu, réponses identiques.
    "app/api/search/route.ts",
    "app/api/favorites/route.ts",
    // D5b (@legal, cookie du coin « Humour noir », poste partagé) : à la déconnexion et à la suppression du
    // compte, le témoin du coin est retiré. Sous garde de l'interrupteur dans `effacerTemoinCoin` : fermé,
    // aucun en-tête ajouté, réponses identiques (test `d5b-temoin-coin-s24`).
    "app/api/auth/[...nextauth]/route.ts",
    "app/api/user/route.ts",
    // D7 (« Mes questions ») : l'outil de l'équipe, sous l'auth admin existante (`refusAdmin`), et sa page.
    // Fermé : la route répond 404 avant toute lecture et la page est la 404 (middleware + `notFound()`).
    // `middleware.ts` (déjà listé) réécrit aussi `/admin/questions` vers la 404 naturelle, fermé seulement ;
    // `lib/account.ts` (déjà listé, sans import de l'espace) exporte et supprime les fils avec le compte.
    "app/api/admin/questions-equipe/route.ts",
    "app/(dashboard)/admin/questions/page.tsx",
    // D9 (mesure d'usage de l'espace) : `lib/mesure/evenements-espace.ts` lit l'interrupteur pour n'écrire
    // AUCUN événement fermé (seconde barrière après la garde des routes) ; la lecture admin
    // `api/admin/espace-lecture` répond 404 fermé avant toute lecture, puis l'auth admin existante.
    "lib/mesure/evenements-espace.ts",
    "app/api/admin/espace-lecture/route.ts",
    // D10 (« Mon profil », pages d'abonnement, textes en ligne du plan §6 ; go de Thomas ligne par ligne) :
    // - `profil/page.tsx` : historique en lecture seule de l'ancien abonné, composant monté ouvert seulement
    //   (lecture chargée à la demande) ; fermé, page synchrone identique (snapshot) ;
    // - `abonnement/page.tsx` : ligne des bonus (T1) et lignes de l'ancien abonné (T11), passées à la vue
    //   ouvert seulement ; fermé, `lignesAncienAbonne` rend [] sans lire session ni base, props absentes ;
    // - `cgu/page.tsx` : article 10 retouché (T7) ouvert seulement ; D11b : dernier alinéa de l'article 3 (bonus),
    //   ouvert ET 4 bonus publiés seulement (`bonusTousPublies`, lecture de fichier), fermé rien ; date de mise à jour avec
    //   `ESPACE_DATE_TEXTES` (vide d'ici l'ouverture, donc inchangée) ;
    // - `config/textes/paiement.ts` : puce des bonus de l'e-mail E0 (T3) ouvert seulement ; E0 fermé
    //   identique (test par hachage) ;
    // - `lib/analytics/espace-lecture.ts` : lecture des compteurs anonymes (règles @legal D9 point 6),
    //   appelée seulement par la route admin, 404 fermé.
    "app/(dashboard)/profil/page.tsx",
    "app/(dashboard)/abonnement/page.tsx",
    "app/(dashboard)/cgu/page.tsx",
    "config/textes/paiement.ts",
    "lib/analytics/espace-lecture.ts",
  ];
  const PERIMETRE = [
    /^app\/\(dashboard\)\/mon-espace\//,
    /^app\/api\/espace\//,
    /^lib\/espace\//,
    /^components\/espace\//,
    /^config\/espace-client\.ts$/,
    /^config\/textes\/espace-[^/]+\.ts$/,
    /^__tests__\//,
  ];

  function sources(dossier: string): string[] {
    return readdirSync(dossier).flatMap((entree) => {
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) return entree === "node_modules" ? [] : sources(chemin);
      return /\.(ts|tsx)$/.test(entree) ? [chemin] : [];
    });
  }

  it("aucun import de l'espace hors périmètre et liste blanche", () => {
    const fautifs = sources(SRC)
      .map((f) => relative(SRC, f).split("\\").join("/"))
      .filter((f) => !PERIMETRE.some((p) => p.test(f)) && !LISTE_BLANCHE.includes(f))
      .filter((f) => /["']@\/(config\/espace-client|lib\/espace\/|components\/espace\/)/.test(readFileSync(join(SRC, f), "utf8")));
    expect(fautifs).toEqual([]);
  });
});
