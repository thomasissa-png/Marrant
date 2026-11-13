/**
 * Lot D10 (s24) : « Mon profil » (réglages), pages d'abonnement, textes en ligne retouchés (plan §3 « Lot D10 »,
 * §6 lignes T1 à T13). Interrupteur simulé ouvert ou fermé ici (jamais le code livré, qui reste fermé).
 * Lignes Jest du plan : ancres de `/profil` fermé ET ouvert ; résiliation et rétractation à 1 clic, libellés du
 * pied de page inchangés ; E1, E1b, E2 inchangés (hachage) ; E0 inchangé hors la ligne des bonus ; zéro tiret
 * cadratin et zéro émoji dans les textes touchés ; confidentialité et CGU : phrases de @legal mot pour mot, plus
 * aucune phrase « la question n'est pas gardée » ouvert ; textes NON touchés du §6 identiques (hachage).
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { TextEncoder } from "util";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __D10_OUVERT__?: boolean }).__D10_OUVERT__ ?? false;
  },
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));
jest.mock("@/hooks/use-subscription-summary", () => ({
  useSubscriptionSummary: () => ({ summary: { status: "ACTIVE", hasPortal: true, hasStripeSubscription: true, cancelAtPeriodEnd: false, formule: "monthly", priceCents: 199, currentPeriodEnd: "2026-12-09T09:00:00.000Z" }, openPortal: jest.fn(), portalLoading: null }),
}));
jest.mock("@/app/(dashboard)/profil/rappel-parcours-toggle", () => ({ RappelParcoursToggle: () => <section id="rappel-parcours">rappel</section> }));
jest.mock("@/components/lettre/lettre-hebdo-reglage", () => ({ LettreHebdoReglage: () => null }));
jest.mock("@/components/espace/cap-profil", () => ({ CapProfil: () => <div>cap</div> }));
const lireAccesEspace = jest.fn();
jest.mock("@/lib/espace/garde", () => ({ lireAccesEspace: () => lireAccesEspace() }));

import { ProfilDashboard } from "@/components/profil/profil-dashboard";
import { Footer } from "@/components/layout/footer";
import { emailBienvenuePremium, emailConfirmationAbonnement, texteStripeSubmit, LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";
import { emailOnboardingE1, emailOnboardingE1b, emailOnboardingE2 } from "@/config/textes/onboarding-premium";
import { ANCIEN_ABONNE, CGU_QUESTION_EQUIPE_ESPACE, LIGNE_BONUS_OFFRE, PROFIL_LIGNE_QUESTIONS, PUCE_BONUS_E0 } from "@/config/textes/espace-textes-en-ligne";
import { CGU_QUESTION_EQUIPE, CONSERVATION_QUESTION_EQUIPE } from "@/config/textes/question-equipe-s22";
import { CONFIDENTIALITE_ESPACE } from "@/config/textes/espace-confidentialite";
import { TEXTES_ABONNEMENT } from "@/config/textes/compte";
import { QUESTION_EQUIPE_UI } from "@/config/textes/question-equipe-s22";
import { ABONNEMENT_HAUT, PHRASE_OBJET_CONNECTE } from "@/config/textes/abonnement-vente";
import { lignesDepuisComptes, lignesAncienAbonne } from "@/lib/espace/ancien-abonne";
import { enonceAffiche } from "@/lib/espace/enonce-mission";
import missions from "@/data/espace/missions.json";
import CguPage from "@/app/(dashboard)/cgu/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { frTypo } from "@/lib/fr-typo";

// jsdom n'expose pas TextEncoder, requis par le rendu serveur de React (même patron que le test d'inertie).
Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");
const etat = globalThis as { __D10_OUVERT__?: boolean };
const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { useUserStore } = jest.requireMock("@/stores/user-store") as { useUserStore: jest.Mock };
const SRC = join(__dirname, "..", "..");
const RACINE = join(SRC, "..", "..", "..");
const sha = (t: string) => createHash("sha256").update(t).digest("hex");
const html = (t: string) => frTypo(t).replace(/'/g, "&#x27;");

const USER = { id: "u1", name: "Jean", email: "j@test.fr", plan: "PREMIUM", level: "FARCEUR", xp: 750, streak: 5, lastActiveAt: null, stats: { jokesRead: 42, tipsCompleted: 15, videosWatched: 0, totalFavorites: 10, pathsCompleted: 1 } };

beforeEach(() => {
  etat.__D10_OUVERT__ = false;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ parcours: [] }) }) as unknown as typeof fetch;
  useSession.mockReturnValue({ status: "authenticated" });
  useUserStore.mockReturnValue({ user: USER, isLoading: false, fetchUser: jest.fn(async () => undefined) });
});

describe.each([["fermé", false], ["ouvert", true]])("« Mon profil », interrupteur %s", (_nom, ouvert) => {
  beforeEach(() => {
    etat.__D10_OUVERT__ = ouvert;
  });

  it("ancres `#abonnement` et `#rappel-parcours` présentes ; résiliation et rétractation à 1 clic", () => {
    const { container } = render(<ProfilDashboard />);
    expect(container.querySelector("#abonnement")).not.toBeNull();
    expect(container.querySelector("#rappel-parcours")).not.toBeNull();
    expect(screen.getByRole("button", { name: TEXTES_ABONNEMENT.resilier })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: LIBELLE_RENONCER_CONTRAT })).toHaveAttribute("href", "/retractation");
  });

  it(ouvert ? "T8 : ligne de lien vers « Mes questions » à la place de l'encadré" : "T8 : encadré « Ta question à l'équipe » d'aujourd'hui", () => {
    render(<ProfilDashboard />);
    if (ouvert) {
      expect(screen.getByRole("link", { name: PROFIL_LIGNE_QUESTIONS.lien })).toHaveAttribute("href", "/mon-espace/questions");
      expect(screen.queryByRole("button", { name: QUESTION_EQUIPE_UI.bouton })).toBeNull();
      expect(screen.getByTestId("profil-ligne-mes-questions").textContent).toContain("Ta question à l’équipe");
    } else {
      expect(screen.queryByTestId("profil-ligne-mes-questions")).toBeNull();
    }
  });

  it("pied de page : libellés de résiliation et de rétractation inchangés", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: LIBELLE_RENONCER_CONTRAT })).toHaveAttribute("href", "/retractation");
    expect(screen.getByRole("link", { name: TEXTES_ABONNEMENT.resilier })).toBeInTheDocument();
    expect([LIBELLE_RENONCER_CONTRAT, TEXTES_ABONNEMENT.resilier]).toEqual(["Renoncer au contrat ici", "Résilier ton contrat"]);
  });
});

describe("« Mon profil », état d'erreur (compte illisible)", () => {
  beforeEach(() => useUserStore.mockReturnValue({ user: null, isLoading: false, fetchUser: jest.fn(async () => undefined) }));

  it("ouvert : message validé et « Réessayer » ; fermé : squelette d'aujourd'hui", async () => {
    etat.__D10_OUVERT__ = true;
    const { unmount } = render(<ProfilDashboard />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Quelque chose a coincé de notre côté. Réessaie dans un instant.");
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
    unmount();
    etat.__D10_OUVERT__ = false;
    const { container } = render(<ProfilDashboard />);
    await waitFor(() => expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0));
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("e-mails : E1, E1b, E2 inchangés, E0 inchangé hors la ligne des bonus (T3)", () => {
  const MENSUEL = { prenom: "Yanis", interval: "month", montantCents: 199, dateSouscription: new Date("2026-11-09T09:00:00Z"), prochainRenouvellement: new Date("2026-12-09T09:00:00Z") };
  const TOUT = { carnet: true, lettre: true, question: true };
  const e1 = () => JSON.stringify([
    emailOnboardingE1({ prenom: "Yanis", finAcces: null, carnet: true, etape: null, lienArret: "https://x/arret" } as unknown as Parameters<typeof emailOnboardingE1>[0]),
    emailOnboardingE1b({ prenom: "Yanis", lienArret: "https://x/arret" }),
    emailOnboardingE2({ prenom: "Yanis", lienArret: "https://x/arret" } as unknown as Parameters<typeof emailOnboardingE2>[0]),
  ]);

  it("E1, E1b, E2 : même rendu fermé et ouvert, fichier de textes inchangé (hachage)", () => {
    const ferme = e1();
    etat.__D10_OUVERT__ = true;
    expect(e1()).toBe(ferme);
    expect(sha(readFileSync(join(SRC, "config/textes/onboarding-premium.ts"), "utf8"))).toBe(HACHAGES.onboardingPremium);
  });

  it("E0 fermé : rendu identique à la référence (hachage) ; ouvert : la seule puce des bonus en plus", () => {
    const ferme = emailBienvenuePremium({ ...MENSUEL, ...TOUT });
    expect(sha(JSON.stringify(ferme))).toBe(HACHAGES.e0Ferme);
    expect(ferme.text).not.toContain(LIGNE_BONUS_OFFRE);
    etat.__D10_OUVERT__ = true;
    const ouvert = emailBienvenuePremium({ ...MENSUEL, ...TOUT });
    expect(ouvert.subject).toBe(ferme.subject);
    expect(ouvert.text.replace(`${PUCE_BONUS_E0}\n`, "")).toBe(ferme.text);
    expect(ouvert.text).toContain(`de la première à la dernière étape.\n${PUCE_BONUS_E0}\n- Le carnet`);
  });

  it("textes NON touchés du §6 (Stripe, e-mail de confirmation, objet de l'offre) : identiques fermé et ouvert", () => {
    const lire = () => JSON.stringify([texteStripeSubmit("monthly"), emailConfirmationAbonnement(MENSUEL), PHRASE_OBJET_CONNECTE, ABONNEMENT_HAUT]);
    const ferme = lire();
    expect(sha(ferme)).toBe(HACHAGES.paiementNonTouches);
    etat.__D10_OUVERT__ = true;
    expect(lire()).toBe(ferme);
  });

  it("fichiers des textes NON touchés du §6 : inchangés (hachage)", () => {
    const fichiers = [
      "config/textes/offre.ts",
      "config/textes/parcours-emails.ts",
      "config/textes/lettre-hebdo-s21.ts",
      "lib/faqs.ts",
      "components/layout/footer.tsx",
      "lib/llms-content.ts",
      "app/(dashboard)/a-propos/page.tsx",
      "app/(dashboard)/videos/page.tsx",
      "app/(dashboard)/parcours/(liste)/page.tsx",
    ];
    expect(Object.fromEntries(fichiers.map((f) => [f, sha(readFileSync(join(SRC, f), "utf8"))]))).toEqual(HACHAGES.fichiers);
  });
});

describe("textes touchés : zéro tiret cadratin, zéro émoji", () => {
  it.each(["config/textes/espace-textes-en-ligne.ts", "config/textes/espace-confidentialite.ts", "config/textes/paiement.ts", "app/(dashboard)/cgu/page.tsx", "lib/espace/ancien-abonne.ts"])("%s", (f) => {
    const t = readFileSync(join(SRC, f), "utf8");
    expect(t).not.toContain("—");
    expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
  });
  it("valeurs proposées", () => {
    const tout = [LIGNE_BONUS_OFFRE, PUCE_BONUS_E0, CGU_QUESTION_EQUIPE_ESPACE, PROFIL_LIGNE_QUESTIONS.avant, ANCIEN_ABONNE.progression(3, 2), ANCIEN_ABONNE.historique].join("\n");
    expect(tout).not.toContain("—");
    expect(tout).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe("confidentialité et CGU (T5, T6, T7) : phrases de @legal mot pour mot", () => {
  const LEGAL = readFileSync(join(RACINE, "docs/legal/espace-client-s24-phrases.md"), "utf8");
  const D9 = readFileSync(join(RACINE, "docs/legal/espace-d9-mesure-s24.md"), "utf8");
  const D4 = readFileSync(join(RACINE, "docs/legal/espace-d4-confidentialite-s24.md"), "utf8");

  it("chaque phrase codée est dans le document de @legal, au caractère près", () => {
    for (const t of [CONFIDENTIALITE_ESPACE.mesure, CONFIDENTIALITE_ESPACE.baseMesure]) expect(D9).toContain(t);
    for (const t of [CONFIDENTIALITE_ESPACE.donneesCaps, CONFIDENTIALITE_ESPACE.baseCaps, CONFIDENTIALITE_ESPACE.dureeEtapes]) expect(D4).toContain(t);
    expect(LEGAL).toContain("« base de données (compte, progression, abonnement, tes questions et nos réponses) »");
    expect(CONFIDENTIALITE_ESPACE.conservationQuestions).toBe(
      CONSERVATION_QUESTION_EQUIPE.confidentialite.replace("Tes questions à l'équipe et nos réponses suivent leur propre durée", "Les copies par e-mail de tes questions à l'équipe et de nos réponses suivent leur propre durée"),
    );
    expect(CGU_QUESTION_EQUIPE_ESPACE).toContain("tu peux écrire à l'équipe depuis ton espace (Mes questions)");
    expect(CGU_QUESTION_EQUIPE_ESPACE).toContain("L'équipe répond par e-mail, et tu retrouves ta question et sa réponse dans ton espace, en général sous 1 à 2 jours ouvrés");
    expect(CGU_QUESTION_EQUIPE_ESPACE.length).toBe(CGU_QUESTION_EQUIPE.texte.length + "ton espace (Mes questions)".length - "ton profil".length + ", et tu retrouves ta question et sa réponse dans ton espace".length);
  });

  it("ouvert : lignes rendues, plus aucune phrase « pas gardée » ; fermé : rien de neuf", () => {
    etat.__D10_OUVERT__ = true;
    const conf = renderToStaticMarkup(<ConfidentialitePage />);
    const cgu = renderToStaticMarkup(<CguPage />);
    for (const t of [CONFIDENTIALITE_ESPACE.mesure, CONFIDENTIALITE_ESPACE.baseMesure, CONFIDENTIALITE_ESPACE.donneesCaps, CONFIDENTIALITE_ESPACE.baseCaps, CONFIDENTIALITE_ESPACE.conservationQuestions, CONFIDENTIALITE_ESPACE.neonRole]) {
      expect(conf).toContain(html(t));
    }
    expect(conf).not.toMatch(/ne les garde pas|n.est pas gard/);
    expect(conf).not.toContain(html(CONSERVATION_QUESTION_EQUIPE.confidentialite));
    expect(cgu).toContain(html(CGU_QUESTION_EQUIPE_ESPACE));
    expect(cgu).not.toContain("depuis ton profil pour décrire");
    etat.__D10_OUVERT__ = false;
    const confF = renderToStaticMarkup(<ConfidentialitePage />);
    const cguF = renderToStaticMarkup(<CguPage />);
    expect(confF).not.toContain(html(CONFIDENTIALITE_ESPACE.mesure));
    expect(confF).not.toContain("tes questions et nos réponses)");
    expect(cguF).toContain(html(CGU_QUESTION_EQUIPE.texte));
    expect(cguF).not.toContain("ton espace (Mes questions)");
  });
});

describe("T11 : lignes de l'ancien abonné sur `/abonnement`", () => {
  it("chaque ligne seulement si ses nombres sont au-dessus de 0, pluriels accordés", () => {
    expect(lignesDepuisComptes({ etapes: 0, favoris: 0, questions: 0, repliques: 0 })).toEqual([]);
    expect(lignesDepuisComptes({ etapes: 4, favoris: 0, questions: 0, repliques: 0 })).toEqual([]);
    expect(lignesDepuisComptes({ etapes: 1, favoris: 1, questions: 0, repliques: 0 })).toEqual(["Tes favoris et ta progression sont gardés : 1 étape faite, 1 favori."]);
    expect(lignesDepuisComptes({ etapes: 7, favoris: 3, questions: 0, repliques: 2 })).toEqual([
      "Tes favoris et ta progression sont gardés : 7 étapes faites, 3 favoris.",
      "Ton historique de questions et tes répliques sont gardés.",
    ]);
  });
  it("fermé : aucune ligne, sans lire ni session ni base ; abonné actif ou compte jamais abonné : aucune ligne", async () => {
    expect(await lignesAncienAbonne(false)).toEqual([]);
    expect(lireAccesEspace).not.toHaveBeenCalled();
    lireAccesEspace.mockResolvedValueOnce({ acces: "ouvert", userId: "u1" });
    expect(await lignesAncienAbonne(true)).toEqual([]);
    lireAccesEspace.mockResolvedValueOnce({ acces: "abonnement", userId: "u1", ancienAbonne: false });
    expect(await lignesAncienAbonne(true)).toEqual([]);
  });
});

describe("missions : préfixe « DÉFI XXX : » retiré à l'affichage seulement", () => {
  const liste = missions as Array<{ id: string; enonce: string[] }>;
  it("les 106 énoncés affichés commencent sans « DÉFI », par une majuscule ; la donnée garde le préfixe", () => {
    expect(liste).toHaveLength(106);
    for (const m of liste) {
      const affiche = enonceAffiche(m.enonce);
      expect(m.enonce[0].startsWith("DÉFI ")).toBe(true);
      expect(affiche[0]).not.toMatch(/^DÉFI/);
      expect(affiche[0].charAt(0)).toBe(affiche[0].charAt(0).toLocaleUpperCase("fr-FR"));
      expect(m.enonce[0].toLowerCase()).toContain(affiche[0].slice(1, 40).toLowerCase());
      expect(affiche.slice(1)).toEqual(m.enonce.slice(1));
    }
  });
  it("un texte sans préfixe passe tel quel", () => {
    expect(enonceAffiche(["Raconte ta journée.", "DÉFI X : reste"])).toEqual(["Raconte ta journée.", "DÉFI X : reste"]);
  });
});

/** Références figées (prises sur le code d'avant D10, voir REPLIT_ACTIONS « lot D10 »). Jamais régénérées pour faire passer un test. */
const HACHAGES = {
  onboardingPremium: "201a92423e3d834eba23c044850fe19805d4cca78aab547f2fc5004e48f254b7",
  e0Ferme: "3cc6a8a2ac60cbb066f505ed3e8a8bd7debaf1006acea0f990b991655f2e531d",
  paiementNonTouches: "582b4f852898171b08cad11076913e2a5cef5893617ee26ed914bbd6336252ab",
  fichiers: {
    "config/textes/offre.ts": "be6d8f1040b214af9ac5ab4631de08a6c4ef220c59380863d22d108c2e964bb3",
    "config/textes/parcours-emails.ts": "356fff7e47b215fd117c2b756bae1671faedae518bd7587798f08f0f700e0625",
    "config/textes/lettre-hebdo-s21.ts": "6f988c87929bd04bb96fe833b194105009488a27d40c410009b2a314558724a0",
    "lib/faqs.ts": "709913ccce713ab6fe3a3af7994b270a4286c5fe703e4b0a1e0306b2d890fb11",
    "components/layout/footer.tsx": "49483435a3a3d5ff80b2e33d17e6c22df5ceef6d2727d87f65f51ba97b94e319",
    "lib/llms-content.ts": "87842325825ebad22546170ad053336d839587eca10f73a69897f5f7c7c1af0a",
    "app/(dashboard)/a-propos/page.tsx": "f1f0d3e995f8fa076431317ca77ab440b04c3d59b0fea9653951ceb21662c5d4",
    "app/(dashboard)/videos/page.tsx": "72ad20b9a6c91f5c8dad1237ba7cda6b5a4d9fc970cb68cf4255861ca63d66d9",
    "app/(dashboard)/parcours/(liste)/page.tsx": "3e8bdc7487c1c1758a7cff480943f812086f39258f3777fb5c0cd4c06b4f0f2c",
  } as Record<string, string>,
};
