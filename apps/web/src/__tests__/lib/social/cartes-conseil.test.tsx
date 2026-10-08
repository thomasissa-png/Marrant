/** @jest-environment node */
/**
 * Tests — gabarit de carte Instagram « conseil » (s15, docs/social/visuels-s15/gabarit-carte-conseil.md) :
 * sélection par type de post (3 parties = conseil, 2 = vanne), réduction 72 → 56 par pas de 4, erreur
 * (jamais de rognage) si rien ne tient, couleurs, pied identique à la vanne, vannes inchangées à l'octet.
 * Vrais rendus PNG (satori + resvg, polices de public/fonts) : la mesure des glyphes en dépend.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { renderToStaticMarkup } from "react-dom/server";
import { generatePostImage, nombreDeSlides, slidesDuPost, texteAlternatifDuPost } from "@/lib/social/generate-post-image";
import { VanneAmorce, VanneChute } from "@/lib/social/templates/cartes-piste-a";
import {
  CONSEIL, ConseilCarte1, ConseilCarte2, compositionConseilCarte1, compositionConseilCarte2, corpsConsigne, decouperCarte2,
  interligneConseil, verifierSurtitre,
} from "@/lib/social/templates/cartes-conseil";
import { lireTextesFormats } from "../../../../scripts/content/social-lot-v5-mix";

const FICHIER = path.resolve(__dirname, "../../../../../../docs/social/preparation/textes-formats-valides.json");
const conseils = lireTextesFormats(fs.readFileSync(FICHIER, "utf-8"), FICHIER).textes.filter((t) => t.format === "conseil" && t.reseau === "INSTAGRAM");
const K27 = conseils.find((t) => t.surtitre === "L'anecdote qui déraille")!;
const K26 = conseils.find((t) => t.surtitre === "Consoler en exagérant")!;

const post = (threadParts: string[]) => ({ format: "IMAGE_QUI_CLAQUE", hook: "", content: "", targetPersona: "YANIS", threadParts, platform: "INSTAGRAM" });
const conseil = (t: typeof K27) => post([t.surtitre!, ...t.cartes!]);
const sha = (b: Buffer) => createHash("sha256").update(b).digest("hex");

// Vanne et décryptage du lot 1a (lot-relance-s15.json), PNG figés AVANT le gabarit conseil (08/10).
const MIMES = ["Au jeu de mimes, ma carte disait « la timidité ».", "J'avais à peine bougé qu'ils avaient trouvé."];
const DECRYPTAGE = ["J'ai découvert que\nmes potes avaient\nun groupe sans moi.\nJ'ai boudé trois jours.", "Il s'appelait “Anniv de Léa”. Léa, c'est moi.",
  "Pourquoi ça fait rire : celui qui boude trois jours est l'invité d'honneur, et la preuve se trouvait dans le titre du groupe.",
  "À toi de jouer : repense à un moment où tu t'es cru mis de côté, puis cherche le détail qui prouvait le contraire.", "Le quiz est dans le lien de la bio."];

beforeAll(async () => {
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  // Charge les polices (mesure réelle des glyphes) : la composition des tests en dépend.
  await generatePostImage(conseil(K26), 0);
}, 60_000);

describe("sélection du gabarit par type de post", () => {
  it("conseil : 3 parties = 2 cartes conseil ; vanne : 2 parties = amorce et chute ; décryptage : 4 cartes", () => {
    const c = slidesDuPost(conseil(K27))!;
    expect(c.map((s) => s.element.type)).toEqual([ConseilCarte1, ConseilCarte2]);
    expect(nombreDeSlides(conseil(K27))).toBe(2);
    expect(slidesDuPost(post(MIMES))!.map((s) => s.element.type)).toEqual([VanneAmorce, VanneChute]);
    expect(nombreDeSlides(post(DECRYPTAGE))).toBe(4);
  });

  it("textes intacts : surtitre à part (plus de « Technique : »), alt « surtitre : situation » puis carte 2", () => {
    const [c1, c2] = slidesDuPost(conseil(K27))!;
    expect(c1.element.props).toMatchObject({ surtitre: K27.surtitre, situation: K27.cartes![0], indice: "Glisse →" });
    expect(c2.element.props).toEqual({ texte: K27.cartes![1] });
    expect(c1.alt).toBe(`${K27.surtitre} : ${K27.cartes![0]}`);
    expect(texteAlternatifDuPost(conseil(K27))).toBe(`${K27.surtitre} : ${K27.cartes![0]} ${K27.cartes![1]}`);
  });
});

describe("réduction automatique du corps (72 → 56, pas de 4)", () => {
  it("paliers, interlignes et consigne du tableau §6", () => {
    expect([72, 68, 64, 60, 56].map(interligneConseil)).toEqual([92, 84, 80, 76, 72]);
    expect([72, 68, 64, 60, 56].map(corpsConsigne)).toEqual([56, 56, 52, 48, 44]);
  });

  it("les 10 cartes du lot 1b tiennent dans 1022 px, corps entre 56 et 72", () => {
    for (const t of conseils) {
      const d = decouperCarte2(t.cartes![1]);
      for (const c of [compositionConseilCarte1(t.surtitre!, t.cartes![0]), compositionConseilCarte2(d.replique, d.consigne)]) {
        expect(c.hauteur).toBeLessThanOrEqual(CONSEIL.hauteurZone);
        expect([72, 68, 64, 60, 56]).toContain(c.corps);
      }
    }
  });

  it("texte trop long à 72 : premier palier inférieur qui tient, jamais au-dessus de 72", () => {
    const replique = "« " + "Tu vois cette réunion qui devait durer dix minutes et qui a fini par déborder sur la pause déjeuner, ".repeat(2).trim() + " »";
    const c = compositionConseilCarte2(replique, "À toi de jouer : repère la réunion la plus longue de ta semaine et raconte-la comme un film d'aventure.");
    expect(c.corps).toBeLessThan(72);
    expect(c.corps).toBeGreaterThanOrEqual(56);
    expect(c.corps % 4).toBe(0);
    expect(c.hauteur).toBeLessThanOrEqual(CONSEIL.hauteurZone);
    expect(c.paragraphes[1].corps).toBe(corpsConsigne(c.corps));
    expect(compositionConseilCarte1(K26.surtitre!, K26.cartes![0]).corps).toBe(72);
  });
});

describe("erreur si rien ne tient (jamais de rognage)", () => {
  const long = "« " + "Une phrase de réplique beaucoup trop longue pour tenir sur une seule carte, ".repeat(6).trim() + " » À toi de jouer : essaie.";

  it("composition : erreur explicite au plancher de 56 px", () => {
    const d = decouperCarte2(long);
    expect(() => compositionConseilCarte2(d.replique, d.consigne)).toThrow(/trop longue.*plancher 56 px.*Rien n'est rogné/);
  });

  it("rendu : aucun PNG, la promesse est rejetée", async () => {
    await expect(generatePostImage(post(["La fausse naïveté", "Situation courte.", long]), 1)).rejects.toThrow(/trop longue/);
  });

  it("surtitre de 5 mots, carte 2 sans « À toi de jouer : » : erreur", () => {
    expect(() => verifierSurtitre("Une technique beaucoup trop longue")).toThrow(/5 mots/);
    expect(() => decouperCarte2("« Réplique sans consigne. »")).toThrow(/À toi de jouer/);
  });
});

describe("couleurs et pied", () => {
  it("carte 1 : surtitre #A78BFA, « » du texte blancs ; carte 2 : « » et « À toi de jouer : » en #DDD6FE, jamais #A78BFA", () => {
    const m1 = renderToStaticMarkup(<ConseilCarte1 surtitre={K27.surtitre!} situation={K27.cartes![0]} indice="Glisse →" />);
    expect(m1).toMatch(/color:#A78BFA[^>]*>L’anecdote qui déraille</);
    expect(m1).not.toMatch(/#DDD6FE/);
    const m2 = renderToStaticMarkup(<ConseilCarte2 texte={K26.cartes![1]} />);
    expect((m2.match(/color:#DDD6FE[^>]*>[«»]</g) ?? []).length).toBe(4);
    expect(m2).toMatch(/color:#DDD6FE[^>]*>À</);
    expect(m2).not.toMatch(/#A78BFA/i);
  });

  it("pied au même pixel que la vanne (monogramme, URL, « Glisse → » en carte 1 seulement)", async () => {
    const pied = (png: Buffer) => sharp(png).extract({ left: 0, top: 1150, width: 1080, height: 200 }).raw().toBuffer();
    const vanne = await Promise.all([0, 1].map((i) => generatePostImage(post(MIMES), i)));
    const cartes = await Promise.all([0, 1].map((i) => generatePostImage(conseil(K27), i)));
    expect((await pied(cartes[0])).equals(await pied(vanne[0]))).toBe(true);
    expect((await pied(cartes[1])).equals(await pied(vanne[1]))).toBe(true);
  }, 60_000);
});

describe("vannes inchangées (non-régression à l'octet)", () => {
  it("amorce, chute et cartes 3-4 du décryptage : PNG identiques à ceux d'avant le gabarit conseil", async () => {
    const hashes = [
      sha(await generatePostImage(post(MIMES), 0)), sha(await generatePostImage(post(MIMES), 1)),
      sha(await generatePostImage(post(DECRYPTAGE), 2)), sha(await generatePostImage(post(DECRYPTAGE), 3)),
    ];
    expect(hashes).toEqual([
      "1eeee9f6b617da0f96e3c5b5a88aa044364a634a6d1fcec0b62e9a4a10b21a4b",
      "e3b844dd62bdd22899ea32355437d1ca8e6c6f7a496c72c3a040aa8dbfa74bd0",
      "a140ff66293e4848ccf3d635e3293888a93af2e0b578e6686f2d884aa450c4fd",
      "d64142484f35693eae7d504c4adb5fe9f30104415264f0abd1234895bb21c65e",
    ]);
  }, 60_000);
});
