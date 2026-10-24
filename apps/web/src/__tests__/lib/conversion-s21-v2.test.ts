/**
 * Trajet de conversion s21, tour 2 (`docs/copy/conversion-s21/textes-trajet-v2.md` et ses arbitrages) :
 * table des phrases de /register par entrée (§3, G03, G04), variante du favori (§6 point 8), mémoire
 * du favori dans `returnTo`, amorces de /conseils sans « défi » (K02), champs réservés vidés.
 */
import { CONTEXTE_REGISTER, CONTEXTE_REGISTER_FAVORI_VANNE, contexteRegister, SRC_SANS_ACHAT } from "@/config/textes/cta-pages";
import { avecFavori, encoderFavori, extraireFavori, favoriDepuisCallback, lireFavori } from "@/lib/favori-apres-paiement";
import { sansExerciceConseil, sansExerciceVanne, sansExerciceVideo } from "@/lib/champs-premium";
import { getPostPaymentDestination, getPostSignupRedirect } from "@/lib/premium-return";
import { readFileSync } from "fs";
import { phrasesEntieres, TEXTE_COURT_MAX } from "@/lib/texte-court";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import { join } from "path";

describe("/register : une phrase par entrée (v2 §3), mot pour mot", () => {
  it.each([
    ["mur-vannes", "Après le paiement, la suite des vannes s’ouvre."],
    ["mur-conseils", "Après le paiement, la suite des conseils s’ouvre."],
    ["mur-videos", "Après le paiement, la suite des vidéos s’ouvre."],
    ["modale-carte", "Après le paiement, toute la liste s’ouvre."],
    ["favoris", "Après le paiement, les favoris s’ouvrent."],
    ["modale-favoris", "Après le paiement, les favoris s’ouvrent."],
    ["exercice-vanne", "Après le paiement, les exercices des fiches s’ouvrent."],
    ["exercice-conseil", "Après le paiement, les exercices des fiches s’ouvrent."],
    ["exercice-video", "Après le paiement, les exercices des fiches s’ouvrent."],
    ["carnet", "Après le paiement, tout le carnet s’ouvre."],
    ["recherche", "Après le paiement, tous les résultats s’ouvrent."],
    ["header", "Après le paiement, tout s’ouvre."],
    ["accueil-premium", "Après le paiement, tout s’ouvre."],
    ["glossaire", "Après le paiement, tout s’ouvre."],
    ["a-propos", "Après le paiement, tout s’ouvre."],
    ["quiz", "Après le paiement, tout s’ouvre."],
    ["blog-meilleures-blagues-droles-2026", "Après le paiement, tout s’ouvre."],
    ["modale-vote", "Après le paiement, tout s’ouvre."],
    ["abonnement", "Après le paiement, tout s’ouvre."],
    ["source-inconnue", "Après le paiement, tout s’ouvre."],
  ])("src=%s → « %s »", (src, phrase) => {
    expect(contexteRegister({ src })).toBe(phrase);
  });

  it("parcours connu : étape 2 avec son titre (G04), suite, quiz d'orientation", () => {
    expect(contexteRegister({ src: "parcours-etape", parcours: "repartie" })).toBe(
      "Après le paiement, l’étape 2 de Répartie s’ouvre : Le rythme et les silences.",
    );
    expect(contexteRegister({ src: "parcours-apercu", parcours: "confiance" })).toBe("Après le paiement, la suite de Confiance s’ouvre.");
    expect(contexteRegister({ src: "onboarding", parcours: "machine-a-cafe" })).toBe(
      "Après le paiement, Machine à Café s’ouvre en entier.",
    );
    // Parcours inconnu : la phrase générique, jamais un nom inventé.
    expect(contexteRegister({ src: "parcours-etape" })).toBe("Après le paiement, tout s’ouvre.");
  });

  it("retour vers /carnet sans source carnet : « tout le carnet »", () => {
    expect(contexteRegister({ src: "blog-demo-milieu-1", carnet: true })).toBe("Après le paiement, tout le carnet s’ouvre.");
  });

  it("aucune source ou /login : aucune phrase (pas de clic d'achat, G05)", () => {
    expect(contexteRegister({ src: null })).toBeNull();
    expect(contexteRegister({ src: "login" })).toBeNull();
    expect([...SRC_SANS_ACHAT]).toEqual(["login"]);
  });

  it("variante du favori (§6 point 8) : seulement pour l'étoile d'une vanne", () => {
    expect(CONTEXTE_REGISTER_FAVORI_VANNE).toBe("Après le paiement, ta vanne est dans tes favoris.");
    expect(contexteRegister({ src: "modale-favoris", favoriVanne: true })).toBe(CONTEXTE_REGISTER_FAVORI_VANNE);
    expect(contexteRegister({ src: "favoris", favoriVanne: true })).toBe(CONTEXTE_REGISTER.favoris);
  });
});

describe("favori après paiement : mémoire dans returnTo", () => {
  it("encode, lit, refuse toute forme inattendue", () => {
    expect(encoderFavori({ contentType: "JOKE", contentId: "cm1abc" })).toBe("JOKE.cm1abc");
    expect(lireFavori("TIP.ct_7-x")).toEqual({ contentType: "TIP", contentId: "ct_7-x" });
    for (const mauvais of [null, "", "USER.1", "JOKE.", "JOKE.a/b", "JOKE.<x>", "joke.1", `JOKE.${"a".repeat(65)}`]) {
      expect(lireFavori(mauvais)).toBeNull();
    }
    expect(encoderFavori({ contentType: "JOKE", contentId: "a b" })).toBeNull();
  });

  it("ajouté à la page à retrouver, retiré de la destination finale (hash et autres paramètres gardés)", () => {
    const page = avecFavori("/vannes?page=2#haut", { contentType: "JOKE", contentId: "j1" });
    expect(page).toBe("/vannes?page=2&favori=JOKE.j1#haut");
    const destination = getPostPaymentDestination(page);
    expect(destination).toBe("/vannes?page=2&favori=JOKE.j1&premium=bienvenue#haut");
    expect(extraireFavori(destination)).toEqual({
      favori: { contentType: "JOKE", contentId: "j1" },
      chemin: "/vannes?page=2&premium=bienvenue#haut",
    });
    expect(extraireFavori("/parcours?premium=bienvenue")).toEqual({ favori: null, chemin: "/parcours?premium=bienvenue" });
    // Valeur invalide : retirée quand même, rien n'est ajouté.
    expect(extraireFavori("/vannes?favori=X.1")).toEqual({ favori: null, chemin: "/vannes" });
  });

  it("survit à l'inscription (callback → /abonnement auto=1) et se lit sur /register", () => {
    const callback = "/abonnement?returnTo=%2Fvannes%3Ffavori%3DJOKE.j1&src=modale-favoris";
    expect(favoriDepuisCallback(callback)).toEqual({ contentType: "JOKE", contentId: "j1" });
    const apres = getPostSignupRedirect(callback, "monthly", "modale-favoris");
    expect(new URLSearchParams(apres.split("?")[1]).get("returnTo")).toBe("/vannes?favori=JOKE.j1");
    expect(favoriDepuisCallback("/abonnement?src=header")).toBeNull();
  });
});

describe("champs réservés vidés (même valeurs que le HTML public)", () => {
  it("vanne, conseil, vidéo", () => {
    expect(sansExerciceVanne({ id: "1", howToApply: "x" })).toEqual({ id: "1", howToApply: null });
    expect(sansExerciceConseil({ id: "1", exercise: "x" })).toEqual({ id: "1", exercise: "" });
    expect(sansExerciceVideo({ id: "1", learnings: ["a"], exercise: "x" })).toEqual({ id: "1", learnings: [], exercise: null });
  });
});

describe("/conseils sans « défi » (v2 K01, K02)", () => {
  const racine = join(__dirname, "..", "..");
  it("chapeau et amorces des cartes", () => {
    const page = readFileSync(join(racine, "app/(dashboard)/conseils/page.tsx"), "utf-8");
    expect(page.replace(/\s+/g, " ")).toContain("Chaque conseil vient avec un exemple concret, à tester aujourd’hui.");
    const liste = readFileSync(join(racine, "components/conseils/conseils-list.tsx"), "utf-8");
    const amorces = liste.slice(liste.indexOf("const TIP_TEASERS"), liste.indexOf("];", liste.indexOf("const TIP_TEASERS")));
    expect(amorces).not.toMatch(/défi|exercice/i);
    for (const a of [
      "Clique pour l’exemple",
      "Un exemple t’attend là-dessous",
      "L’exemple est juste en dessous",
      "Ouvre, y’a un exemple pour toi",
      "L’exemple concret est caché ici",
      "Vois-le en situation",
      "Vas-y, l’exemple t’attend",
      "Un truc à tester aujourd’hui",
    ]) {
      expect(amorces).toContain(`"${a}"`);
    }
  });
});

describe("v3 CT1, CT2 : règle de coupe unique (phrases entières jusqu'à ≈ 110 caractères)", () => {
  const seed = parcoursSeed as Array<{ slug: string; steps: Array<{ week: number; moduleDetail?: string }> }>;

  it("CT1 : carte « Étape 2 sur 4 » de Répartie, la première phrase entière, jamais un mot coupé", () => {
    const detail = seed.find((p) => p.slug === "repartie")!.steps.find((s) => s.week === 2)!.moduleDetail!;
    expect(detail.length).toBeGreaterThan(TEXTE_COURT_MAX);
    expect(phrasesEntieres(detail)).toBe("Certaines phrases ne demandent aucun talent, seulement un bon timing.");
  });

  it("CT2 : la vanne de T4 (75 caractères) reste entière", () => {
    const vanne = "Pour ta valise de départ, chacun a cotisé selon ses moyens. Moi, dix euros.";
    expect(phrasesEntieres(vanne)).toBe(vanne);
  });

  it("plusieurs phrases tant que le total tient ; sinon coupe au mot avec « … »", () => {
    expect(phrasesEntieres("Un. Deux ! Trois ?", 12)).toBe("Un. Deux !");
    const longue = "mot ".repeat(40).trim();
    const coupe = phrasesEntieres(longue);
    expect(coupe.endsWith("mot…")).toBe(true);
    expect(coupe.length).toBeLessThanOrEqual(TEXTE_COURT_MAX + 1);
    expect(phrasesEntieres("")).toBe("");
    expect(phrasesEntieres(null)).toBe("");
  });
});
