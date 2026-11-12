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
  /** Fichiers hors périmètre autorisés à importer l'espace (vide au lot D0). */
  const LISTE_BLANCHE: string[] = [];
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
