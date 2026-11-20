/**
 * s26 carnet liste et détail (`docs/ux/carnet-audit-s26.md` §3, DA de l'accueil du 20/11) : en-tête avec mois et année,
 * liste + fiche de l'abonné (filtre par `contexte`, une ligne active, « Situation n sur N », « Situation suivante »),
 * aperçu du visiteur. Espace OUVERT seulement ; le rendu fermé est verrouillé par `carnet-page` et l'inertie.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen, within } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return true;
  },
}));
const navigation = { segments: [] as string[], query: "" };
jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn(), replace: jest.fn(), push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(navigation.query),
  useSelectedLayoutSegments: () => navigation.segments,
  usePathname: () => "/carnet",
}));

import { CarnetListeDetail } from "@/components/espace/carnet/carnet-liste-detail";
import { PanneauCarnet } from "@/components/espace/carnet/panneau-carnet";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, formatCarnetMonth, parseCarnets, type Carnet } from "@/lib/carnet";
import { contextesDe, filtrerLignes, hrefFicheCarnet, hrefListeCarnet, numeroDe, suivanteDe, type CarnetListe } from "@/lib/espace/carnet-liste";
import { TEXTES_CARNET_LISTE } from "@/config/textes/carnet-liste-s26";

const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
const [octobre, novembre] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
const liste = (c: Carnet): CarnetListe => ({
  mois: c.mois,
  libelle: formatCarnetMonth(c.mois),
  titre: c.titre,
  intro: c.intro,
  lignes: c.fiches.map((f, i) => ({ id: f.id, numero: i + 1, titre: f.titre, contexte: f.contexte })),
});
const CARNETS = [liste(novembre), liste(octobre)];
const LIGNES = CARNETS[0].lignes;

const monter = (segments: string[], query = "") => {
  navigation.segments = segments;
  navigation.query = query;
  return render(
    <CarnetListeDetail carnets={CARNETS}>
      <div data-enfant />
    </CarnetListeDetail>,
  );
};
const classes = (el: Element | null) => (el?.getAttribute("class") ?? "").split(" ");

describe("s26 carnet liste et détail : données de la liste", () => {
  it("contextes dans l'ordre d'apparition avec leur effectif, 30 au total", () => {
    const c = contextesDe(LIGNES);
    expect(c.reduce((s, x) => s + x.nombre, 0)).toBe(30);
    expect(c.map((x) => x.cle)).toEqual(Array.from(new Set(LIGNES.map((l) => l.contexte))));
    expect(c).toContainEqual({ cle: "boulot", nombre: LIGNES.filter((l) => l.contexte === "boulot").length });
  });

  it("adresses, numéros et suivante du filtre", () => {
    expect(hrefListeCarnet("2026-11", true)).toBe("/carnet");
    expect(hrefListeCarnet("2026-10", false, "amis")).toBe("/carnet/2026-10?contexte=amis");
    expect(hrefFicheCarnet("2026-11", 7, "soirée")).toBe("/carnet/2026-11/7?contexte=soir%C3%A9e");
    expect([numeroDe("1", 30), numeroDe("30", 30), numeroDe("31", 30), numeroDe("0", 30), numeroDe("07", 30), numeroDe("x", 30)]).toEqual([1, 30, null, null, null, null]);
    const boulot = filtrerLignes(LIGNES, "boulot");
    expect(suivanteDe(boulot, boulot[0].numero)?.numero).toBe(boulot[1].numero);
    expect(suivanteDe(boulot, boulot[boulot.length - 1].numero)).toBeNull();
  });
});

describe("s26 carnet liste et détail : abonné", () => {
  it("en-tête : grand titre, ligne d'usage, mois ET année", () => {
    const { container } = monter([]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Carnet de novembre");
    expect(container.querySelector("[data-carnet-usage]")).toHaveTextContent(TEXTES_CARNET_LISTE.usage.slice(0, 20));
    const time = container.querySelector("time[data-carnet-mois-annee]");
    expect(time).toHaveTextContent("novembre 2026");
    expect(time).toHaveAttribute("dateTime", "2026-11");
  });

  it("/carnet : 30 lignes, « Toutes 30 » et 7 contextes avec effectif, n° 1 actif dès 1024 seulement, mois en pied", () => {
    const { container } = monter([]);
    const filtres = container.querySelectorAll("[data-filtre-contexte]");
    expect(filtres).toHaveLength(1 + contextesDe(LIGNES).length);
    expect(filtres[0]).toHaveTextContent(`${TEXTES_CARNET_LISTE.toutes}30`);
    expect(filtres[0]).toHaveAttribute("aria-current", "true");
    expect(container.querySelectorAll("a[data-ligne]")).toHaveLength(30);
    const actifs = container.querySelectorAll("[data-actif]");
    expect(actifs).toHaveLength(1);
    expect(actifs[0]).toHaveAttribute("data-ligne", "1");
    expect(actifs[0]).not.toHaveAttribute("aria-current");
    expect(classes(actifs[0])).toEqual(expect.arrayContaining(["lg:bg-background-elevated", "lg:before:bg-accent-primary"]));
    expect(container.querySelectorAll("[data-mois]")).toHaveLength(2);
    expect(container.querySelector('[data-mois="2026-11"]')).toHaveAttribute("aria-current", "true");
    // Page liste sous 1024 : la fiche (panneau) masquée, la liste visible ; aucun filet sans sens (plus de tuile blanche).
    expect(classes(container.querySelector("[data-zone='panneau']"))).toContain("max-lg:hidden");
    expect(classes(container.querySelector("[data-zone='liste']"))).not.toContain("max-lg:hidden");
    expect(container.innerHTML).not.toContain("border-l-text-primary");
  });

  it("fiche 7 filtrée : lignes du contexte seulement, une seule ligne `aria-current`, « Retour » sous 1024", () => {
    const ctx = LIGNES[6].contexte;
    const { container } = monter(["2026-11", "7"], `contexte=${encodeURIComponent(ctx)}`);
    const lignes = container.querySelectorAll("a[data-ligne]");
    expect(lignes).toHaveLength(LIGNES.filter((l) => l.contexte === ctx).length);
    for (const l of lignes) expect(l.getAttribute("href")).toMatch(new RegExp(`^/carnet/2026-11/\\d+\\?contexte=`));
    const courante = container.querySelectorAll('[aria-current="page"]');
    expect(courante).toHaveLength(1);
    expect(courante[0]).toHaveAttribute("data-ligne", "7");
    expect(classes(courante[0])).toEqual(expect.arrayContaining(["bg-background-elevated", "before:bg-accent-primary"]));
    expect(classes(container.querySelector("[data-zone='liste']"))).toContain("max-lg:hidden");
    expect(classes(container.querySelector("[data-carnet-en-tete]"))).toContain("max-lg:hidden");
    expect(screen.getByRole("link", { name: /^Retour\s?:\s?Carnet$/ })).toHaveAttribute("href", `/carnet?contexte=${encodeURIComponent(ctx)}`);
    // Autre contexte : la fiche 7 n'y est pas, la pastille mène à la liste filtrée ; « Toutes » la garde ouverte.
    const autre = contextesDe(LIGNES).find((c) => c.cle !== ctx)!.cle;
    expect(container.querySelector(`[data-filtre-contexte="${autre}"]`)).toHaveAttribute("href", `/carnet?contexte=${encodeURIComponent(autre)}`);
    expect(container.querySelector('[data-filtre-contexte=""]')).toHaveAttribute("href", "/carnet/2026-11/7");
  });

  it("mois ou numéro inconnu : la page seule (sa 404), sans liste ni en-tête", () => {
    for (const s of [["2099-01"], ["2026-11", "31"]]) {
      const { container, unmount } = monter(s);
      expect(container.querySelector("[data-enfant]")).not.toBeNull();
      expect(container.querySelector("[data-carnet-liste]")).toBeNull();
      unmount();
    }
  });

  it("panneau : « Situation n sur 30 », DA de l'accueil (bandeau, pastille violette « Carnet », pastille du contexte)", () => {
    const ctx = LIGNES[6].contexte;
    const ordre = filtrerLignes(LIGNES, ctx);
    const { container } = render(<PanneauCarnet mois="2026-11" courant fiches={novembre.fiches} numero={7} contexteBrut={ctx} />);
    expect(container.querySelector("[data-carnet-numero]")).toHaveTextContent("Situation 7 sur 30");
    const fiche = container.querySelector("[data-carnet-fiche]");
    expect(classes(fiche)).toEqual(expect.arrayContaining(["before:bg-gradient-to-r", "before:from-accent-primary"]));
    const pastilles = within(container.querySelector("[data-carnet-pastilles]") as HTMLElement);
    expect(classes(pastilles.getByText("Carnet"))).toContain("text-accent-link");
    expect(pastilles.getByText(ctx)).toBeTruthy();
    const suivante = suivanteDe(ordre, 7);
    const lien = container.querySelector("[data-situation-suivante]");
    if (suivante) expect(lien).toHaveAttribute("href", `/carnet/2026-11/${suivante.numero}?contexte=${encodeURIComponent(ctx)}`);
    else expect(lien).toBeNull();
    for (const el of container.querySelectorAll("a")) expect(classes(el)).not.toContain("bg-accent-primary");
    expect(container.textContent).not.toContain("—");
  });
});

describe("s26 carnet liste et détail : visiteur", () => {
  it("en-tête avec mois et année, fiche offerte « sur 30 », titres fermés, offre ; pas de liste + détail", () => {
    const { container } = render(<CarnetPage view={carnetViewForPlan(novembre, null)} months={["2026-11", "2026-10"]} returnTo="/carnet" src="carnet" visiteur />);
    expect(container.querySelector("time[data-carnet-mois-annee]")).toHaveTextContent("novembre 2026");
    expect(container.querySelector("[data-carnet-usage]")).not.toBeNull();
    expect(screen.getByText("Situation 10 sur 30, offerte")).toBeTruthy();
    expect(container.querySelectorAll("[data-carnet-fiche]")).toHaveLength(1);
    expect(container.querySelector("[data-carnet-programme]")).not.toBeNull();
    expect(container.querySelector("[data-carnet-liste]")).toBeNull();
    expect(screen.getByTestId("carnet-paywall-bouton")).toHaveAttribute("href", "/abonnement?returnTo=%2Fcarnet&src=carnet");
  });
});

describe("s26 carnet liste et détail : textes et fichiers", () => {
  const racine = join(__dirname, "..", "..");
  const fichiers = [
    "config/textes/carnet-liste-s26.ts",
    "lib/espace/carnet-liste.ts",
    "components/espace/liste-detail/styles.ts",
    "components/espace/liste-detail/colonne-collante.tsx",
    "components/espace/carnet/carnet-liste-detail.tsx",
    "components/espace/carnet/liste-carnet.tsx",
    "components/espace/carnet/panneau-carnet.tsx",
    "components/espace/carnet/en-tete-carnet.tsx",
    "components/espace/carnet/fiche-carnet.tsx",
    "components/espace/carnet/carnet-ouvert.tsx",
    "app/(dashboard)/carnet/layout.tsx",
    "app/(dashboard)/carnet/[mois]/[n]/page.tsx",
  ];
  it("libellés neufs marqués À VALIDER (s26), zéro tiret cadratin, aucun module client n'importe `lib/carnet`", () => {
    expect(readFileSync(join(racine, fichiers[0]), "utf8")).toContain("À VALIDER (s26)");
    for (const f of fichiers) {
      const code = readFileSync(join(racine, f), "utf8");
      expect([f, code.includes("—")]).toEqual([f, false]);
      if (code.startsWith('"use client"')) expect([f, /from "@\/lib\/carnet"/.test(code)]).toEqual([f, false]);
    }
  });
});
