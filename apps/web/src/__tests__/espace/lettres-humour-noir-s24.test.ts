/**
 * @jest-environment node
 *
 * Espace client, lot D6 (s24, plan §3) : archive « Lettres » (horloge simulée : une lettre à date future
 * n'existe nulle part ; version montrée sans invitation ni prix, testé sur chaque lettre), reprises de
 * lettres, témoin du coin « Humour noir, fait bien » (recherche et favoris d'un abonné non « entré »),
 * interrupteur fermé (404, aucune lecture, réponses publiques inchangées).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { envoyeesSiBesoin, fichesVisibles, listerLettres, lireLettre, titreLettre, type DbLettres } from "@/lib/espace/lettres";
import { versionPremium } from "@/lib/lettre/invitation-premium";
import { favoriAutorise, filtreHumourNoir, PROMESSE_ECRITE } from "@/lib/espace/humour-noir";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import numeros from "@/data/lettre/numeros.json";
import hebdo from "@/data/lettre/hebdo-premium.json";

const MAINTENANT = new Date("2026-11-20T10:00:00Z");
type Issue = { periodKey: string; subject: string; bodyText: string; sends: { status: string; sentAt: Date | null }[] };
const ISSUES: Issue[] = [
  { periodKey: "2026-W46", subject: "Après l'exposé", bodyText: "Salut,\n\nTexte.", sends: [{ status: "ENVOYE", sentAt: new Date("2026-11-12T07:00:00Z") }, { status: "ENVOYE", sentAt: new Date("2026-11-12T07:03:00Z") }] },
  {
    periodKey: "2026-11",
    subject: "Alors, t'as perdu ta langue ?",
    bodyText: "Salut,\n\nCorps.\n\n[[invitation-premium]]\nPS : rejoins Premium, 7,50 € par mois.\nVoir l'offre Premium : https://deviens-marrant.fr/abonnement\n[[/invitation-premium]]\n\nÀ jeudi.",
    sends: [{ status: "ENVOYE", sentAt: new Date("2026-11-05T07:00:00Z") }],
  },
  { periodKey: "2026-W47", subject: "Futur", bodyText: "Pas encore.", sends: [{ status: "ENVOYE", sentAt: new Date("2026-11-26T07:00:00Z") }] },
  { periodKey: "2026-W48", subject: "En échec", bodyText: "Rien.", sends: [{ status: "ECHEC", sentAt: null }] },
];

/** Base simulée : applique le filtre d'envoi passé que le code demande à Prisma. */
function db(): DbLettres {
  const findMany = jest.fn(async (args: { where: { periodKey?: string; sends: { some: { sentAt: { lte: Date } } } } }) => {
    const lte = args.where.sends.some.sentAt.lte;
    const passe = (s: Issue["sends"][number]) => s.status === "ENVOYE" && s.sentAt !== null && s.sentAt <= lte;
    return ISSUES.filter((i) => (!args.where.periodKey || i.periodKey === args.where.periodKey) && i.sends.some(passe)).map((i) => ({
      ...i,
      sends: i.sends.filter(passe).sort((a, b) => a.sentAt!.getTime() - b.sentAt!.getTime()).slice(0, 1),
    }));
  });
  return { newsletterIssue: { findMany } } as unknown as DbLettres;
}

describe("archive « Lettres »", () => {
  it("titre = date du premier envoi à Paris, jamais « ancienne » ni « archive »", () => {
    expect(titreLettre(new Date("2026-11-12T07:00:00Z"))).toBe("La lettre du jeudi 12 novembre");
    expect(titreLettre(new Date("2026-10-31T23:30:00Z"))).toBe("La lettre du dimanche 1er novembre");
  });

  it("horloge simulée : lettre future et lettre jamais partie absentes ; plus récente d'abord", async () => {
    const lettres = await listerLettres(db(), MAINTENANT);
    expect(lettres.map((l) => l.numero)).toEqual(["2026-W46", "2026-11"]);
    expect(lettres.map((l) => l.titre).join(" ")).not.toMatch(/ancienne|archive/i);
    expect(await lireLettre(db(), "2026-W47", MAINTENANT)).toBeNull();
    expect(await lireLettre(db(), "2026-W47", new Date("2026-11-27T00:00:00Z"))).not.toBeNull();
    expect(await lireLettre(db(), "../profil", MAINTENANT)).toBeNull();
  });

  it("version montrée : sans le bloc d'invitation, sans prix", async () => {
    const l = await lireLettre(db(), "2026-11", MAINTENANT);
    expect(l?.corps).toContain("Corps.");
    expect(l?.corps).not.toMatch(/€|\/abonnement|\[\[|Premium/);
  });

  it.each([...numeros.map((n) => [`mensuelle ${n.periode}`, n.corps] as const), ...hebdo.map((h) => [`hebdo ${h.semaine}`, h.corps] as const)])(
    "%s : version des abonnés sans invitation ni prix",
    (_n, corps) => {
      const v = versionPremium(corps);
      expect(v).not.toBeNull();
      expect(v).not.toMatch(/€|\/abonnement|\[\[\/?invitation-premium/);
    },
  );

  it("reprise d'une lettre : absente tant que la lettre n'est pas envoyée ; aucune lecture sans reprise", async () => {
    const fiches = [{ id: "a" }, { id: "b", repriseDeLettre: "2026-W47" }, { id: "c", repriseDeLettre: "2026-W46" }];
    const envoyees = await envoyeesSiBesoin(db(), fiches, MAINTENANT);
    expect(fichesVisibles(fiches, envoyees).map((f) => f.id)).toEqual(["a", "c"]);
    const base = db();
    expect((await envoyeesSiBesoin(base, [{ repriseDeLettre: undefined }], MAINTENANT)).size).toBe(0);
    expect(base.newsletterIssue.findMany).not.toHaveBeenCalled();
  });
});

describe("coin « Humour noir, fait bien » : témoin du navigateur", () => {
  it("interrupteur fermé : aucun filtre, témoin jamais lu ; promesse non écrite (G6)", () => {
    expect(ESPACE_CLIENT_PUBLIE).toBe(false);
    const lire = jest.fn(() => undefined);
    expect(filtreHumourNoir(true, lire)).toEqual({});
    expect(lire).not.toHaveBeenCalled();
    expect(PROMESSE_ECRITE).toBe(false);
  });

  it("ouvert : abonné non entré = aucune vanne repérée ; entré ou non abonné = rien de retiré", () => {
    jest.isolateModules(() => {
      jest.doMock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
      const m = jest.requireActual<typeof import("@/lib/espace/humour-noir")>("@/lib/espace/humour-noir");
      expect(m.filtreHumourNoir(true, () => undefined)).toEqual({ humourNoir: false });
      expect(m.filtreHumourNoir(true, () => "entre")).toEqual({});
      expect(m.filtreHumourNoir(false, () => undefined)).toEqual({});
    });
    jest.dontMock("@/config/espace-client");
    expect(favoriAutorise({ humourNoir: true }, { humourNoir: false })).toBe(false);
    expect(favoriAutorise({ humourNoir: false }, { humourNoir: false })).toBe(true);
    expect(favoriAutorise(null, { humourNoir: false })).toBe(true);
    expect(favoriAutorise({ humourNoir: true }, {})).toBe(true);
  });

  it("vanne du jour, toucher, rafale : jamais une vanne repérée (sources)", () => {
    const src = (f: string) => readFileSync(join(__dirname, "../..", f), "utf8");
    expect(src("lib/espace/vanne.ts")).toMatch(/VANNE_TIRABLE = \{ isActive: true, \.\.\.HORS_HUMOUR_NOIR \}/);
    expect(src("app/api/daily/route.ts")).toMatch(/humourNoir: false/);
    expect(src("lib/espace/rafale.ts")).not.toMatch(/humour-noir/);
  });
});
