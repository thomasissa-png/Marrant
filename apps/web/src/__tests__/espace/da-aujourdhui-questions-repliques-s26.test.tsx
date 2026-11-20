/**
 * s26 DA, aujourd'hui questions répliques (décision de Thomas du 20/11 ; T7 et T8 de
 * `docs/ux/audit-trajets-connectes-s26.md`) : DA de l'accueil sur Aujourd'hui, Mes questions et Mes répliques (bandeau,
 * émojis de l'accueil seulement, pastilles violettes), lien vers le fil gardé après lecture (T7), liste des fils à gauche
 * dès 1024 (modèle liste + détail), champ d'écriture focalisé en 1 clic sur Mes répliques (T8). Espace ouvert seulement.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { FilEnvoi } from "@/components/espace/questions/fil";
import { RailFils } from "@/components/espace/questions/rail-fils";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { SemainesTuile } from "@/components/espace/aujourdhui/semaines-tuile";
import { ParcoursTuile } from "@/components/espace/aujourdhui/etape-en-cours";
import { EMOJIS_ACCUEIL, emojiParcours } from "@/components/espace/da-espace";
import { TEXTES_CLOCHE } from "@/config/textes/espace-cloche";
import { TEXTES_REPLIQUES } from "@/config/textes/espace-repliques";
import type { FilListe } from "@/lib/espace/questions-types";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

const SRC = join(__dirname, "..", "..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const C = frEspaceProfond(TEXTES_CLOCHE);
const R = frEspaceProfond(TEXTES_REPLIQUES);

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  window.sessionStorage.clear();
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener: () => undefined, removeEventListener: () => undefined })) as unknown as typeof window.matchMedia;
});

const lu: FilListe = {
  id: "filrepondu01",
  type: "SITUATION",
  statut: "REPONDU",
  creeLe: "2026-11-09T09:00:00Z",
  dernierMessageLe: "2026-11-11T09:00:00Z",
  enRetard: false,
  nonLu: false,
  messages: [
    { auteur: "ABONNE", corps: "La scène", creeLe: "2026-11-09T09:00:00Z" },
    { auteur: "EQUIPE", corps: "La réponse", creeLe: "2026-11-11T09:00:00Z" },
  ],
};
const attente: FilListe = { ...lu, id: "filattente01", type: "QUESTION", statut: "EN_ATTENTE", messages: [lu.messages[0]] };

describe("T7 : le fil reste accessible depuis la liste après lecture", () => {
  it("un fil répondu ET lu garde son lien vers la page du fil (libellé validé de la cloche)", () => {
    render(
      <ul>
        <FilEnvoi fil={lu} lectureSeule={false} onMaj={() => undefined} onRetire={() => undefined} />
      </ul>,
    );
    const lien = screen.getByRole("link", { name: new RegExp(C.groupes.reponses) });
    expect(lien.getAttribute("href")).toBe("/mon-espace/questions/filrepondu01");
  });

  it("pas de lien sans réponse, ni sur la page du fil elle-même", () => {
    const { container } = render(
      <ul>
        <FilEnvoi fil={attente} lectureSeule={false} onMaj={() => undefined} onRetire={() => undefined} />
        <FilEnvoi fil={{ ...lu, id: "filouvert001" }} lectureSeule={false} ouvertAuDepart onMaj={() => undefined} onRetire={() => undefined} />
      </ul>,
    );
    expect(container.querySelectorAll("[data-lien-fil]")).toHaveLength(0);
  });

  it("carte du fil : bandeau de l'accueil et type en pastille violette", () => {
    const { container } = render(
      <ul>
        <FilEnvoi fil={lu} lectureSeule={false} onMaj={() => undefined} onRetire={() => undefined} />
      </ul>,
    );
    expect(container.querySelector("[data-bandeau-da]")).not.toBeNull();
    expect(container.querySelector("[data-pastilles-da] .bg-accent-primary\\/20")).not.toBeNull();
  });
});

describe("liste + détail : la liste des fils à gauche dès 1024", () => {
  it("la page du fil pose la liste AVANT le fil, dans la grille et la cellule collante du module neutre", () => {
    const page = lire("app/(dashboard)/mon-espace/questions/[id]/page.tsx");
    expect(page).toContain("GRILLE_LISTE_DETAIL");
    expect(page).toContain('cn(CELLULE_LISTE_COLLANTE, "max-lg:hidden")');
    expect(page.indexOf("<RailFils")).toBeLessThan(page.indexOf("<FilOuvert"));
  });

  it("le rail : lignes du module (`data-ligne`), fil ouvert en `aria-current`", () => {
    render(<RailFils fils={[lu, attente]} courant={lu.id} />);
    const nav = screen.getByRole("navigation");
    const liens = within(nav).getAllByRole("link");
    expect(liens.map((l) => l.getAttribute("data-ligne"))).toEqual([lu.id, attente.id]);
    expect(liens[0].getAttribute("aria-current")).toBe("page");
    expect(liens[1].getAttribute("aria-current")).toBeNull();
  });
});

describe("T8 : « Écrire ma prochaine réplique » ouvre un champ focalisé en 1 clic", () => {
  const replique = { ficheId: "f1", texte: "Ma réplique", titre: "Titre", href: "/mon-espace/quoi-repondre/f1", modifieLe: "2026-11-15" };
  const aEcrire = [{ ficheId: "f2", titre: "La poêle", href: "/mon-espace/quoi-repondre/f2" }];

  it("un clic : champ « Ma réplique à moi » visible et focalisé, sur la fiche proposée ; enregistrer l'ajoute à la liste", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, headers: { get: () => null }, json: async () => ({ ok: true }) });
    render(<ListeRepliques initiales={[replique]} lectureSeule={false} grille aEcrire={aEcrire} />);
    const bouton = screen.getAllByRole("button", { name: R.ecrireProchaine })[0];
    await act(async () => fireEvent.click(bouton));
    const champ = screen.getByLabelText(R.label);
    expect(document.activeElement).toBe(champ);
    expect(screen.getByRole("link", { name: frEspace("La poêle") }).getAttribute("href")).toBe("/mon-espace/quoi-repondre/f2");
    fireEvent.change(champ, { target: { value: "Ça sent le génie" } });
    await act(async () => fireEvent.submit(champ.closest("form") as HTMLFormElement));
    await waitFor(() => expect(document.querySelector("[data-replique='f2']")).not.toBeNull());
    expect(screen.queryByLabelText(R.label)).toBeNull();
  });

  it("sans fiche à proposer : le lien d'avant vers Quoi répondre", () => {
    render(<ListeRepliques initiales={[replique]} lectureSeule={false} grille aEcrire={[]} />);
    expect(screen.getAllByRole("link", { name: R.ecrireProchaine })[0].getAttribute("href")).toBe("/mon-espace/quoi-repondre");
  });

  it("vide : « Écrire ma première réplique » ouvre le champ dans la tuile, un seul bouton plein à l'écran", async () => {
    render(<ListeRepliques initiales={[]} lectureSeule={false} grille aEcrire={aEcrire} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: R.ecrirePremiere })));
    expect(document.activeElement).toBe(screen.getByLabelText(R.label));
    expect(screen.queryByRole("button", { name: R.ecrirePremiere })).toBeNull();
  });
});

describe("DA d'Aujourd'hui : émojis de l'accueil, bandeau chez l'abonné, extrait de l'aperçu inchangé", () => {
  it("émojis de l'accueil seulement", () => {
    const accueil = lire("app/(dashboard)/page.tsx") + lire("components/home/daily-content.tsx");
    for (const e of [...Object.values(EMOJIS_ACCUEIL), emojiParcours("repartie"), emojiParcours("machine-a-cafe"), emojiParcours("confiance")]) {
      expect(accueil).toContain(e as string);
    }
    expect(emojiParcours("storytelling")).toBeNull();
  });

  it("abonné : bandeau et pastille ; figé : ni l'un ni l'autre", () => {
    const etape = { slug: "repartie", titreParcours: "Répartie", ordre: 1, total: 4, titreEtape: "Étape", enCours: false, href: "/parcours/repartie#etape-1" };
    const abonne = render(<ParcoursTuile etape={etape} />).container;
    expect(abonne.querySelector("[data-bandeau-da]")).not.toBeNull();
    expect(abonne.querySelector("[data-pastilles-da]")?.textContent).toContain("⚡️");
    const fige = render(<SemainesTuile ecouterPublie fige />).container;
    expect(fige.querySelector("[data-bandeau-da], [data-pastilles-da]")).toBeNull();
    const z1 = render(<ActionDuJour idTitre="t" etiquette="É" titre="T" action={{ href: "/x", libelle: "Go" }} fige />).container;
    expect(z1.querySelector("[data-bandeau-da]")).toBeNull();
  });

  it("aucun tiret cadratin dans les fichiers touchés", () => {
    for (const f of ["components/espace/da-espace.tsx", "components/espace/repliques/ecrire-replique.tsx", "components/espace/questions/rail-fils.tsx"]) {
      expect(lire(f)).not.toContain("—");
    }
  });
});
