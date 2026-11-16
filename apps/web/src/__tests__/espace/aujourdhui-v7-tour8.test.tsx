/**
 * « Aujourd'hui » s25 v7, tour 8 : décisions de l'orchestrateur après les relectures du tour 7 (design 7/10, UX 7/10).
 * 1. Z1 seule zone d'accent : teinte violette très légère et bord doux (testé dans `aujourdhui-v7-tour7.test.tsx`,
 *    décision 2 tour 8 ; au navigateur dans `espace-aujourdhui-typo-s25.spec.ts`, contraste compris).
 * 2. Proportions 7/5 dès 1024 (extrait et page abonné), bouton de Z1 à 256 px au moins dès 1024.
 * 3. Pastilles en retour à la ligne libre (testé dans `aujourdhui-v7-tour4.test.tsx`).
 * 4. Prospect à 375 : pastille « Premium » sur la ligne du H1 sous 768 (ordre du DOM gardé), offre resserrée.
 * 5. Pistes : paragraphes « Premium… » du gratuit espacés, « Semaine n : » en colonne, pieds Étape et Mission alignés.
 */
import { render } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { OffreApercu } from "@/components/espace/apercu/offre-apercu";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { PIED_TUILE, PIED_TUILE_GABARIT } from "@/components/espace/aujourdhui/tableau";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";

const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/);

describe("point 2 : Z1 en 7 colonnes, « Ton cap » en 5, dès 1024", () => {
  it("extrait de l'aperçu : rangée 1 en 7 + 5", () => {
    render(<ApercuAujourdhui visiteur />);
    const [z1, cap] = Array.from(document.querySelectorAll("[data-apercu-rangee='1'] > [data-tuile-fermee]"));
    expect(classes(z1)).toContain("lg:col-span-7");
    expect(classes(cap)).toContain("lg:col-span-5");
  });

  it("page de l'abonné : même partage (lu dans la source, page serveur)", () => {
    const page = readFileSync(join(__dirname, "../../app/(dashboard)/mon-espace/page.tsx"), "utf8");
    expect(page).toContain(`<div className="min-w-0 md:col-span-2 lg:col-span-7" data-carte-du-jour>`);
    expect(page).toContain(`principale ? "lg:col-span-5" : "lg:col-span-12"`);
    expect(page).not.toMatch(/lg:col-span-8" data-carte-du-jour/);
  });

  it("bouton de Z1 (plein ou figé) : 256 px au moins dès 1024", () => {
    const action = { href: "/x", libelle: "Commencer" };
    const { container, unmount } = render(<ActionDuJour idTitre="t" etiquette="É" titre="T" action={action} />);
    expect(classes(container.querySelector("a"))).toEqual(expect.arrayContaining(["lg:min-w-64", "md:w-auto"]));
    unmount();
    const fige = render(<ActionDuJour idTitre="t" etiquette="É" titre="T" action={action} fige />).container;
    expect(classes(fige.querySelector("[aria-disabled]"))).toContain("lg:min-w-64");
  });
});

describe("point 4 : prospect à 375, première tuile au premier écran", () => {
  it("pastille « Premium » puis H1 dans le DOM, sur une ligne sous 768 (H1 à gauche), l'une sur l'autre dès 768", () => {
    render(<ApercuAujourdhui visiteur />);
    const tete = document.querySelector("[data-apercu-tete]") as HTMLElement;
    expect(tete.children[0].hasAttribute("data-badge-premium")).toBe(true);
    expect(tete.children[1].tagName).toBe("H1");
    expect(classes(tete)).toEqual(expect.arrayContaining(["flex-row-reverse", "justify-between", "gap-4", "md:flex-col", "md:items-start"]));
    expect(classes(tete.children[1]).some((c) => /(^|:)mt-/.test(c))).toBe(false);
    const hero = document.querySelector("[data-apercu-hero]");
    expect(classes(hero)).toEqual(expect.arrayContaining(["gap-4", "md:gap-8", "lg:gap-12"]));
    const li = document.querySelector("[data-apercu-pastilles] li");
    expect(classes(li)).toEqual(expect.arrayContaining(["text-sm", "px-2", "py-0.5", "md:px-3", "md:py-1"]));
  });

  it("carte d'offre resserrée sous 768 (`p-4`, preuve à 16 px), inchangée dès 768", () => {
    const { container } = render(<OffreApercu href="/abonnement" adresse="/mon-espace" visiteur />);
    expect(classes(container.querySelector("[data-apercu-offre]"))).toEqual(expect.arrayContaining(["p-4", "md:p-6"]));
    expect(classes(container.querySelector("[data-preuve]"))).toEqual(expect.arrayContaining(["mt-4", "pt-4", "md:mt-6", "md:pt-6"]));
    expect(classes(container.querySelector("[data-reassurance]"))).toEqual(expect.arrayContaining(["mt-2", "md:mt-4"]));
  });
});

describe("point 5 : pistes", () => {
  it("gratuit : phrase d'objet à 8 px du bouton (16 dès 768), réassurance 24 px dessous", () => {
    const { container } = render(<OffreApercu href="/abonnement" adresse="/mon-espace" visiteur={false} />);
    const reassurance = container.querySelector("[data-reassurance]");
    const objet = reassurance?.previousElementSibling;
    expect(classes(objet)).toEqual(expect.arrayContaining(["mt-2", "md:mt-4"]));
    expect(classes(reassurance)).toContain("mt-6");
    expect(classes(reassurance)).not.toContain("mt-4");
  });

  it("« Semaine n : » en colonne : grille à 2 colonnes, chaque ligne en `subgrid`", () => {
    const { container } = render(<SemainesTuile ecouterPublie />);
    expect(classes(container.querySelector("ol"))).toEqual(expect.arrayContaining(["grid", "grid-cols-[max-content_1fr]", "gap-x-2"]));
    for (const li of Array.from(container.querySelectorAll("li"))) {
      expect(classes(li)).toEqual(expect.arrayContaining(["col-span-2", "grid", "grid-cols-subgrid"]));
      expect(li.children).toHaveLength(2);
    }
  });

  it("pied de la mission au gabarit du pied d'étape (filet, 48 px), « Facultative » et chevron dedans", () => {
    expect(PIED_TUILE.startsWith(PIED_TUILE_GABARIT)).toBe(true);
    expect(PIED_TUILE_GABARIT.split(" ")).toEqual(expect.arrayContaining(["min-h-12", "border-t", "-mx-6", "-mb-6", "mt-auto"]));
    const { container } = render(<MissionLien marche={2} accroche="Une phrase." />);
    const pied = container.querySelector("a > span:last-child") as HTMLElement;
    expect(classes(pied)).toEqual(expect.arrayContaining(PIED_TUILE_GABARIT.split(" ")));
    expect(pied.textContent).toBe("Facultative");
    expect(pied.querySelector("svg")).not.toBeNull();
    expect(classes(container.querySelector("[data-mission-accroche]"))).toContain("mb-4");
  });
});
