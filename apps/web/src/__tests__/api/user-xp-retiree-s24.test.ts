/**
 * @jest-environment node
 *
 * Retrait de `POST /api/user/xp` (s24, `docs/espace-client/niveaux-xp-s24.md`
 * §2.5 point 5, décision Q1 « retirer ») : la route acceptait un montant d'XP
 * choisi par le navigateur (1 à 500, 30 appels par minute). L'action
 * « conseil lu » sort du barème ; les XP déjà acquis ne sont pas retirés.
 *
 * Preuves :
 * - aucun fichier de route sous `app/api/user/xp` et aucune route attrape-tout
 *   sous `app/api` ou `app/api/user` qui pourrait répondre à sa place : Next
 *   renvoie donc 404 (vérifié en réel par `playwright/tests/local/user-xp-retiree-s24.spec.ts`) ;
 * - aucun code du site ni de l'app mobile n'appelle `/api/user/xp` ;
 * - le store utilisateur n'expose plus `addXp`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { useUserStore } from "@/stores/user-store";

const WEB = path.resolve(__dirname, "..", "..", "..");
const SRC = path.join(WEB, "src");
const MOBILE_SRC = path.resolve(WEB, "..", "mobile");
const API = path.join(SRC, "app", "api");

function fichiersCode(dossier: string): string[] {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier).flatMap((nom) => {
    if (nom === "node_modules" || nom === "__tests__" || nom.startsWith(".")) return [];
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return fichiersCode(chemin);
    return /\.(ts|tsx|js|jsx|mjs)$/.test(nom) ? [chemin] : [];
  });
}

describe("POST /api/user/xp retirée (s24, Q1)", () => {
  it("aucun fichier de route sous app/api/user/xp", () => {
    expect(existsSync(path.join(API, "user", "xp"))).toBe(false);
  });

  it("aucune route attrape-tout sous app/api ni app/api/user (sinon elle répondrait à la place du 404)", () => {
    const attrapeTout = (dossier: string) =>
      readdirSync(dossier).filter((nom) => nom.startsWith("[...") || nom.startsWith("[[..."));
    expect(attrapeTout(API)).toEqual([]);
    expect(attrapeTout(path.join(API, "user"))).toEqual([]);
  });

  it("aucun composant, store ou client (site et app mobile) n'appelle /api/user/xp", () => {
    const fichiers = [...fichiersCode(SRC), ...fichiersCode(MOBILE_SRC)];
    expect(fichiers.length).toBeGreaterThan(100);
    const appelants = fichiers.filter((f) => /api\/user\/xp\b/.test(readFileSync(f, "utf8")));
    expect(appelants.map((f) => path.relative(WEB, f))).toEqual([]);
  });

  it("plus aucun gain « conseil lu » dans le code (addXp, tip_read)", () => {
    const appelants = fichiersCode(SRC).filter((f) => /\baddXp\b|\btip_read\b/.test(readFileSync(f, "utf8")));
    expect(appelants.map((f) => path.relative(WEB, f))).toEqual([]);
  });

  it("le store utilisateur n'expose plus addXp", () => {
    expect("addXp" in useUserStore.getState()).toBe(false);
  });
});
