/**
 * @jest-environment node
 *
 * Lot 1a (dry-run du 07/10) : deux correctifs du script de lot, sans base.
 *  1. Tout relais Instagram (sans lien) porte `[article:<slug>]`, que lit la garde du Worker
 *     (`articleSlugDuPost`, publish-social) : fixes (IG2 12/10, 26/10) et générés.
 *  2. `--insert` n'insère que le dry-run de la même commande (`ecartsFichierLot`) : l'ancien
 *     `lot-relance-s15.json` (autres bornes) est refusé.
 */
import { buildLotV5 } from "../../../scripts/content/social-lot-v5";
import { fichierLot } from "../../../scripts/content/social-lot-v5-export";
import { ecartsFichierLot } from "../../../scripts/content/social-lot-v5-insert";
import { articleSlugDuPost, estDateOuRelais, repliDuPost } from "@/lib/social/garde-article";
import { ARTICLES, catalogue } from "../helpers/lot-v5-fixtures";

const PROGRAMMES = ARTICLES.map((a) => ({ ...a, aGarder: true }));
const lot = (debut: string, fin: string) =>
  buildLotV5({ pool: catalogue(), articles: PROGRAMMES, recents: [], seed: "relance-s15", lot: "relance-s15", debut, fin });

describe("relais Instagram : marqueur [article:] lu par la garde du Worker", () => {
  const l = lot("2026-10-12", "2026-11-15");
  const f = fichierLot(l.posts, "relance-s15", { lot: "relance-s15", debut: "2026-10-12", fin: "2026-11-15" }, l.replis);
  const relaisIg = l.posts.filter((p) => p.platform === "INSTAGRAM" && p.type === "RELAIS");

  it("aucune erreur ; chaque relais Instagram (fixe ou généré) a un article", () => {
    expect(l.errors).toEqual([]);
    expect(relaisIg.length).toBeGreaterThanOrEqual(3);
    for (const p of relaisIg) expect(p.article).toBeTruthy();
  });

  it("IG2 du 12/10 et le relais IG du 26/10 : la garde lit le slug sans lien dans le texte", () => {
    const attendus: Record<string, string> = { IG2: "se-presenter-avec-humour", "relais-ig-26-10": "blagues-sur-l-ia-assistants-vocaux" };
    for (const [cle, slug] of Object.entries(attendus)) {
      const p = l.posts.find((x) => x.cle === cle)!;
      const ligne = f.posts.find((x) => x.id === p.id)!;
      expect(ligne.content).not.toMatch(/\/blog\//);
      expect(ligne.directorNote).toContain(`[article:${slug}]`);
      expect(articleSlugDuPost({ content: ligne.content, cta: ligne.cta ?? null, directorNote: ligne.directorNote })).toBe(slug);
      expect(estDateOuRelais({ content: ligne.content, cta: ligne.cta ?? null, directorNote: ligne.directorNote })).toBe(true);
      // Article programmé : repli Instagram en réserve, même créneau.
      const repliId = repliDuPost(ligne.directorNote);
      const repli = f.replis!.find((x) => x.id === repliId)!;
      expect(repli).toMatchObject({ platform: "INSTAGRAM", scheduledAt: ligne.scheduledAt, status: "REJECTED" });
    }
  });
});

describe("--insert : le JSON doit être le dry-run de la même commande", () => {
  const meta1a = { lot: "relance-s15", debut: "2026-10-12", fin: "2026-10-18" };
  const l1a = lot(meta1a.debut, meta1a.fin);
  const attendu = fichierLot(l1a.posts, "relance-s15", meta1a, l1a.replis);
  // Relu depuis le disque : JSON, clés dans un autre ordre.
  const inverse = <T extends object>(o: T): T => Object.fromEntries(Object.entries(o).reverse()) as T;
  const relu = () => JSON.parse(JSON.stringify(inverse({ ...attendu, posts: attendu.posts.map(inverse), replis: attendu.replis!.map(inverse) })));

  it("même lot (relu du disque) : aucun écart", () => {
    expect(ecartsFichierLot(attendu, JSON.parse(JSON.stringify(attendu)))).toEqual([]);
    expect(ecartsFichierLot(attendu, relu())).toEqual([]);
  });

  it("ancien lot-relance-s15.json (bornes par défaut 12/10 au 03/01) : refusé", () => {
    const ancien = lot("2026-10-12", "2027-01-03");
    const f = fichierLot(ancien.posts, "relance-s15", { lot: "relance-s15", debut: "2026-10-12", fin: "2027-01-03" }, ancien.replis);
    const e = ecartsFichierLot(attendu, f);
    expect(e).toEqual(expect.arrayContaining([
      "fin : fichier « 2027-01-03 », commande « 2026-10-18 »",
      `total : fichier « ${f.total} », commande « 12 »`,
      expect.stringMatching(/^posts du fichier hors commande : /),
    ]));
  });

  it("post modifié, repli retiré ou autre graine : refusé", () => {
    const modifie = JSON.parse(JSON.stringify(attendu));
    modifie.posts[3].content += " !";
    expect(ecartsFichierLot(attendu, modifie)).toEqual([`posts modifiés depuis le dry-run : ${attendu.posts[3].id}`]);
    const sansRepli = { ...attendu, replis: attendu.replis!.slice(1) };
    expect(ecartsFichierLot(attendu, sansRepli)).toEqual([`replis absents du fichier : ${attendu.replis![0].id}`]);
    expect(ecartsFichierLot(attendu, { ...attendu, graine: "autre" })).toEqual(["graine : fichier « autre », commande « relance-s15 »"]);
  });
});
