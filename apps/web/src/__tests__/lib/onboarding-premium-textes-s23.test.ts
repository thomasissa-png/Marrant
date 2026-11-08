/**
 * @jest-environment node
 *
 * s23 onboarding Premium : rendu de chaque version d'E0, E1, E1b et E2 comparé MOT POUR MOT au fichier
 * approuvé par Thomas (`docs/copy/onboarding-premium-s23-emails.md` v4.2, commit ad24ba7 ; E1b, section
 * « E1b : J12 », approuvé le 08/11/2026, commit 3586113).
 * Chaque ligne rendue doit correspondre, dans l'ordre, à une ligne du fichier (champs `{…}` variables,
 * lignes `[si …]` présentes seulement si leur condition est vraie).
 */
import { readFileSync } from "fs";
import path from "path";
import { emailBienvenuePremium, emailConfirmationAbonnement, listeParcoursNoms } from "@/config/textes/paiement";
import { emailOnboardingE1, emailOnboardingE1b, emailOnboardingE2, ligneEtape, type E1Vars } from "@/config/textes/onboarding-premium";
import { PARCOURS_COUNT, PREMIUM_PARCOURS } from "@/config/premium";
import { problemesDeRendu } from "@/lib/emails/garde-fou-rendu";

const FICHIER = readFileSync(path.resolve(__dirname, "../../../../../docs/copy/onboarding-premium-s23-emails.md"), "utf8");
const BLOCS = [...FICHIER.matchAll(/```\n([\s\S]*?)```/g)].map((m) => m[1].split("\n"));
const [E0_DOC, E1_GENERALE_DOC, E1_PARCOURS_DOC, PIED_DOC, E2_DOC, E1B_DOC] = BLOCS;
const SECTION_E1B = FICHIER.slice(FICHIER.indexOf("## E1b : J12, pose-nous ta question"));
const LISTE_E1 = E1_GENERALE_DOC.filter((l) => l.startsWith("- ") || l.startsWith("[si carnet] - ") || l.startsWith("Et dans ton profil"));

interface LigneDoc { re: RegExp; conditionnelle: boolean; source: string }

function lignesDoc(bloc: string[]): LigneDoc[] {
  return bloc
    .flatMap((l) => (l.startsWith("[liste identique") ? ["", ...LISTE_E1] : [l]))
    .filter((l) => l.trim() !== "" && !l.startsWith("====") && !l.startsWith("{formulaireTypeRetractation"))
    .map((l) => {
      const conditionnelle = /^\[si [^\]]+\] /.test(l);
      const texte = l.replace(/^\[si [^\]]+\] /, "");
      // « Salut {prénom}, » : prénom absent → « Salut, » (convention de rendu du fichier).
      const source = `^${texte.split(/\{[^}]*\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".+?")}$`.replace(/^\^Salut \.\+\?,/, "^Salut(?: .+?)?,");
      const re = new RegExp(source);
      return { re, conditionnelle, source: l };
    });
}

/** Lignes rendues (sans le formulaire légal) confrontées, dans l'ordre, aux lignes du fichier approuvé. */
function verifierContreFichier(rendu: string, bloc: string[]): void {
  const doc = lignesDoc(bloc);
  const lignes = rendu.split("\n============================================\n")[0].split("\n").filter((l) => l.trim() !== "");
  let i = 0;
  for (const ligne of lignes) {
    while (i < doc.length && !doc[i].re.test(ligne) && doc[i].conditionnelle) i++;
    if (i >= doc.length || !doc[i].re.test(ligne)) throw new Error(`Ligne absente du fichier approuvé : « ${ligne} » (attendu : « ${doc[i]?.source} »)`);
    i++;
  }
  const restantes = doc.slice(i).filter((d) => !d.conditionnelle);
  expect(restantes.map((d) => d.source)).toEqual([]);
}

function propre(t: { subject: string; text: string }) {
  expect(problemesDeRendu(`${t.subject}\n${t.text}`)).toEqual([]);
  expect(t.text).not.toMatch(/—|\\u00/);
}

const MENSUEL = { prenom: "Yanis", interval: "month", montantCents: 199, dateSouscription: new Date("2026-11-09T09:00:00Z"), prochainRenouvellement: new Date("2026-12-09T09:00:00Z") };
const ANNUEL = { ...MENSUEL, interval: "year", montantCents: 1999, prochainRenouvellement: new Date("2027-11-09T09:00:00Z") };
const TOUT = { carnet: true, lettre: true, question: true };
const RIEN = { carnet: false, lettre: false, question: false };

describe("E0 bienvenue s23", () => {
  it("le fichier approuvé contient bien les 6 blocs attendus (E1b en dernier)", () => {
    expect(BLOCS).toHaveLength(6);
    expect(E1B_DOC[0]).toBe("Salut {prénom}, raconte-nous, l’équipe te répond.");
    expect(FICHIER.indexOf("```\nSalut {prénom}, raconte-nous")).toBeGreaterThan(FICHIER.indexOf("## E1b : J12"));
    expect(E0_DOC[0]).toBe("Salut {prénom}, voici tout ce que Premium t’ouvre, et par où commencer.");
  });
  it.each([
    ["mensuel, toutes les lignes", MENSUEL, TOUT, 8],
    ["annuel, aucune ligne conditionnelle", ANNUEL, RIEN, 5],
    ["mensuel sans prénom, carnet seul", { ...MENSUEL, prenom: null }, { ...RIEN, carnet: true }, 6],
  ])("%s : mot pour mot", (_nom, v, c, puces) => {
    const e = emailBienvenuePremium({ ...v, ...c });
    expect(e.subject).toBe("Ton abonnement est confirmé : Premium est ouvert, sers-toi");
    verifierContreFichier(e.text, E0_DOC);
    propre(e);
    const avant = e.text.split("\n\nPar où commencer")[0];
    expect(avant.split("\n").filter((l) => l.startsWith("- "))).toHaveLength(puces);
    expect(e.text).toContain(`Les parcours : les ${PARCOURS_COUNT}, en entier`);
    expect(e.text).toContain(`au choix parmi ${listeParcoursNoms()}. https://deviens-marrant.fr/parcours\n`);
  });
  it("phrase 5 C : mensuel seulement, collée sous « Résilier »", () => {
    const m = emailBienvenuePremium({ ...MENSUEL, ...TOUT }).text;
    expect(m).toContain("fin de la période payée.\nPrends ton temps pour te faire un avis : d’ici le 9 décembre 2026, tout est ouvert, et tu pourras encore résilier la veille.\n\nDroit de rétractation");
    expect(emailBienvenuePremium({ ...ANNUEL, ...TOUT }).text).not.toContain("Prends ton temps");
  });
  it("sans prénom : « Salut, voici tout… »", () => {
    expect(emailBienvenuePremium({ ...MENSUEL, prenom: null, ...RIEN }).text.startsWith("Salut, voici tout ce que Premium t’ouvre")).toBe(true);
  });
  it("bloc contractuel identique mot pour mot à l'e-mail actuel ; phrase « Tout est ouvert » retirée", () => {
    for (const v of [MENSUEL, ANNUEL]) {
      const actuel = emailConfirmationAbonnement(v).text;
      const bloc = actuel.slice(actuel.indexOf("Ton abonnement Premium est activé"), actuel.indexOf("\n\nTout est ouvert."));
      const nouveau = emailBienvenuePremium({ ...v, ...TOUT }).text.replace(/\nPrends ton temps[^\n]*/, "");
      expect(nouveau).toContain(bloc);
      expect(nouveau).not.toContain("Tout est ouvert. Pour démarrer");
      expect(nouveau.split("============================================")[1]).toBe(actuel.split("============================================")[1]);
    }
  });
  it("liste des parcours : noms seuls, virgules puis « et »", () => {
    expect(listeParcoursNoms(["A", "B", "C"])).toBe("A, B et C");
    expect(listeParcoursNoms()).toBe(listeParcoursNoms(PREMIUM_PARCOURS.map((p) => p.name)));
    expect(listeParcoursNoms()).not.toMatch(/min/);
  });
});

const ARRET = "https://deviens-marrant.fr/api/onboarding-premium/arret?token=abc.def";
const REPARTIE = { parcoursTitre: "Répartie", parcoursSlug: "repartie", etapeNumero: 2, etapeTitre: "Le rebond" };
const base: E1Vars = { prenom: "Yanis", finAcces: null, carnet: true, etape: null, lienArret: ARRET };

describe("E1 (J5)", () => {
  it.each([
    ["GÉNÉRALE", base, E1_GENERALE_DOC],
    ["GÉNÉRALE sans carnet ni prénom", { ...base, carnet: false, prenom: null }, E1_GENERALE_DOC],
    ["GÉNÉRALE résilié programmé", { ...base, finAcces: new Date("2026-12-09T09:00:00Z") }, E1_GENERALE_DOC],
    ["PARCOURS", { ...base, etape: REPARTIE }, E1_PARCOURS_DOC],
    ["PARCOURS résilié programmé", { ...base, etape: REPARTIE, finAcces: new Date("2026-12-09T09:00:00Z") }, E1_PARCOURS_DOC],
  ])("%s : mot pour mot, pied d'arrêt commun", (_nom, v, doc) => {
    const e = emailOnboardingE1(v);
    expect(e.subject).toBe("Une question ? Voilà ce qu’on fait ici");
    verifierContreFichier(e.text, [...doc, ...PIED_DOC]);
    propre(e);
    expect(e.text.trimEnd().endsWith(`Arrêter ces e-mails d’accueil (un clic, sans connexion) : ${ARRET}`)).toBe(true);
  });
  it("phrases de tête @legal exactes, juste après « Salut {prénom}, »", () => {
    const fin = new Date("2026-12-09T09:00:00Z");
    expect(emailOnboardingE1({ ...base, finAcces: fin }).text).toMatch(/^Salut Yanis,\nTon accès reste ouvert jusqu’au 9 décembre 2026 : voici par où commencer\.\n\nUne question/);
    expect(emailOnboardingE1({ ...base, finAcces: fin, etape: REPARTIE }).text).toMatch(
      /^Salut Yanis,\nTon accès reste ouvert jusqu’au 9 décembre 2026 : voici où tu en es\.\n\nTa prochaine étape dans « Répartie » : Le rebond \(étape 2 sur 4\)\.\n\nUne question/,
    );
    expect(emailOnboardingE1(base).text).toMatch(/^Salut Yanis,\n\nUne question/);
  });
  it("liens : /parcours?src=onboarding-premium (GÉNÉRALE), prochaine étape (PARCOURS)", () => {
    expect(emailOnboardingE1(base).text).toContain("Pour commencer par un parcours : https://deviens-marrant.fr/parcours?src=onboarding-premium\n");
    expect(emailOnboardingE1({ ...base, etape: REPARTIE }).text).toContain("Reprendre mon parcours : https://deviens-marrant.fr/parcours/repartie?src=onboarding-premium\n");
    expect(emailOnboardingE1(base).text).toContain(`Parcours : ${PARCOURS_COUNT} au choix`);
  });
  it("replis de la ligne d'étape", () => {
    expect(ligneEtape({ ...REPARTIE, etapeTitre: null })).toBe("Ta prochaine étape dans « Répartie » : étape 2 sur 4.");
    expect(ligneEtape({ ...REPARTIE, parcoursSlug: "inconnu" })).toBe("Ta prochaine étape dans « Répartie » : Le rebond (étape 2).");
    expect(ligneEtape({ ...REPARTIE, parcoursTitre: " " })).toBeNull();
    const sansTitre = emailOnboardingE1({ ...base, etape: { ...REPARTIE, parcoursTitre: null } }).text;
    expect(sansTitre).not.toContain("Ta prochaine étape");
    expect(sansTitre).toContain("Reprendre mon parcours : https://deviens-marrant.fr/parcours?src=onboarding-premium\n");
  });
});

describe("E2 (J21)", () => {
  it.each([["Yanis"], [null]])("prénom %s : mot pour mot", (prenom) => {
    const e = emailOnboardingE2({ prenom, lienArret: ARRET });
    expect(e.subject).toBe("Trois semaines : qu’est-ce qui manque ?");
    verifierContreFichier(e.text, E2_DOC);
    propre(e);
    expect(e.text).not.toMatch(/https?:\/\/(?!deviens-marrant\.fr\/api\/onboarding-premium\/arret)/);
  });
});

describe("E1b (J12)", () => {
  it.each([["Yanis"], [null]])("prénom %s : mot pour mot, pied d'arrêt compris", (prenom) => {
    const e = emailOnboardingE1b({ prenom, lienArret: ARRET });
    verifierContreFichier(e.text, E1B_DOC);
    propre(e);
    expect(e.text.trimEnd().endsWith(`Arrêter ces e-mails d’accueil (un clic, sans connexion) : ${ARRET}`)).toBe(true);
  });
  it("objet A du fichier approuvé, mot pour mot", () => {
    const objetA = SECTION_E1B.match(/\*\*Objet, option A \(recommandée\)\*\* : `([^`]+)`/)?.[1];
    expect(objetA).toBe("Une situation où la répartie t’a manqué ?");
    expect(emailOnboardingE1b({ prenom: "Yanis", lienArret: ARRET }).subject).toBe(objetA);
  });
  it("sans prénom : « Salut, raconte-nous… » ; lien /profil nu (ni src, ni ancre)", () => {
    const t = emailOnboardingE1b({ prenom: null, lienArret: ARRET }).text;
    expect(t.startsWith("Salut, raconte-nous, l’équipe te répond.\n\n")).toBe(true);
    expect(t).toContain("Poser ma question : https://deviens-marrant.fr/profil\n");
    expect(t).not.toMatch(/src=|#question/);
    expect(t).not.toMatch(/https?:\/\/(?!deviens-marrant\.fr\/(?:profil\n|api\/onboarding-premium\/arret))/);
  });
});
