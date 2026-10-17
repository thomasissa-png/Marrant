/**
 * Intégration s21, bloquant @legal B7 : mentions de la lettre publiées avec les
 * inscriptions. Textes mot pour mot de `docs/legal/lettre-et-questions-s21.md`
 * (section lettre de la politique de confidentialité, ajout aux CGU), ancre
 * `#lettre` visée par le lien « Confidentialité » du formulaire, zéro tiret
 * cadratin, rien sur « Ta question à l'équipe » ni l'hebdo Premium (pas ouverts).
 */
import { render } from "@testing-library/react";
import CGUPage from "@/app/(dashboard)/cgu/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { LETTRE_CONFIDENTIALITE_ANCRE, LETTRE_CONFIDENTIALITE_HREF } from "@/config/lettre";

const texte = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("Confidentialité : section « La lettre »", () => {
  it("porte l'id visé par le lien du formulaire", () => {
    expect(LETTRE_CONFIDENTIALITE_HREF).toBe("/confidentialite#lettre");
    const { container } = render(<ConfidentialitePage />);
    const section = container.querySelector(`section#${LETTRE_CONFIDENTIALITE_ANCRE}`);
    expect(section).not.toBeNull();
    expect(section?.querySelector("h2")?.textContent).toBe("8. La lettre");
  });

  it("textes @legal mot pour mot (parties 1, 2, 3, 6) et Resend pour les lettres (partie 4)", () => {
    const { container } = render(<ConfidentialitePage />);
    const section = texte(container.querySelector("section#lettre"));
    for (const phrase of [
      "La lettre et le site s'adressent aux personnes de 15 ans et plus.",
      "Lettre par e-mail, si tu t'y inscris : ton adresse e-mail, la page où tu t'es inscrit, la date et la version du texte que tu as accepté, la date de ta confirmation et une empreinte non réversible de ton adresse IP, pour prouver ton accord et limiter les abus. Aucun compte n'est créé.",
      "T'envoyer la lettre mensuelle : ton consentement (case à cocher puis confirmation par e-mail), que tu peux retirer en un clic",
      "Respecter tes choix et prouver ton accord : intérêt légitime",
      "Lettre : tu restes inscrit tant que tu ne te désinscris pas. Tous les 2 ans, on te demande par e-mail si tu veux la garder ; sans clic de ta part, on te désinscrit. Une adresse jamais confirmée est effacée après 7 jours. Quand tu te désinscris, on efface l'empreinte de ton IP et on garde 3 ans ton adresse, la date et la version de ton accord et la date de ta désinscription : c'est la preuve de ton choix et la liste qui nous empêche de t'écrire de nouveau.",
    ]) {
      expect(section).toContain(phrase);
    }
    expect(texte(container)).toContain("Resend : envoi des e-mails liés à ton compte et à ton abonnement, et des lettres");
  });

  it("zéro tiret cadratin, rien sur les services pas encore ouverts", () => {
    const { container } = render(<ConfidentialitePage />);
    const page = texte(container);
    expect(page).not.toContain("—");
    expect(page).not.toMatch(/Ta question|lettre hebdomadaire|outils de rédaction/);
  });
});

describe("CGU : ajouts @legal", () => {
  it("lettre mensuelle (article 10, ancre #lettre) et ajout à l'article 8, mot pour mot", () => {
    const { container } = render(<CGUPage />);
    const lettre = container.querySelector("section#lettre");
    expect(lettre?.querySelector("h2")?.textContent).toBe("10. La lettre");
    expect(texte(lettre?.querySelector("p") ?? null)).toBe(
      "La lettre mensuelle gratuite est indépendante de l'abonnement : elle se fait sur inscription, confirmée par e-mail.",
    );
    expect(texte(container)).toContain(
      "Aucune clause du présent article ne limite la responsabilité de l'éditeur pour les dommages corporels, sa faute lourde ou son dol, ni ne te prive des droits que la loi te garantit.",
    );
  });

  it("numérotation existante inchangée (renvois aux articles 6 et 7), zéro tiret cadratin", () => {
    const { container } = render(<CGUPage />);
    const titres = Array.from(container.querySelectorAll("h2")).map((h) => h.textContent?.split(".")[0]);
    expect(titres).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    const page = texte(container);
    expect(page).not.toContain("—");
    expect(page).not.toMatch(/Ta question|lettre hebdomadaire/);
  });
});
