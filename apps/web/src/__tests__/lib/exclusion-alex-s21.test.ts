/**
 * @jest-environment node
 *
 * s21 (19/10, feu vert de Thomas) : alex@deviens-marrant.fr est toujours exclue
 * des chiffres (mesure=1, rapports, alertes), en plus du secret
 * ANALYTICS_EMAILS_EXCLUS, jamais à sa place (le secret n'est pas écrasé).
 */
import { emailsExclus, EMAILS_INTERNES_EXCLUS, ENV_EMAILS_EXCLUS } from "@/lib/analytics/comptes-test";

const ALEX = "alex@deviens-marrant.fr";

describe("exclusion de l'adresse interne d'Alex", () => {
  it("figure dans la liste interne", () => {
    expect(EMAILS_INTERNES_EXCLUS).toContain(ALEX);
  });

  it("est exclue même sans variable ou avec une variable vide", () => {
    expect(emailsExclus({})).toContain(ALEX);
    expect(emailsExclus({ [ENV_EMAILS_EXCLUS]: "" })).toContain(ALEX);
    expect(emailsExclus({ [ENV_EMAILS_EXCLUS]: "   " })).toContain(ALEX);
  });

  it("fusionne avec la variable sans perdre aucune adresse existante", () => {
    const liste = emailsExclus({ [ENV_EMAILS_EXCLUS]: "t1@exemple.fr, T2@Exemple.fr\nt3@exemple.fr" });
    expect(liste).toEqual(expect.arrayContaining(["t1@exemple.fr", "t2@exemple.fr", "t3@exemple.fr", ALEX]));
    expect(liste).toHaveLength(4);
  });

  it("n'apparaît qu'une fois si la variable la contient déjà (casse ignorée)", () => {
    const liste = emailsExclus({ [ENV_EMAILS_EXCLUS]: "Alex@Deviens-Marrant.fr;t1@exemple.fr" });
    expect(liste.filter((e) => e === ALEX)).toHaveLength(1);
    expect(liste).toHaveLength(2);
  });

  it("la comparaison de la confirmation de la lettre (minuscules) la reconnaît", () => {
    expect(emailsExclus({}).includes("ALEX@deviens-marrant.fr".toLowerCase())).toBe(true);
  });

  it("aucune autre adresse du domaine n'est exclue d'office", () => {
    expect(emailsExclus({})).toEqual([ALEX]);
  });
});
