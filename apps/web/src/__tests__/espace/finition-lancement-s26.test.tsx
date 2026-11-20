/**
 * s26 finition avant lancement (décision de Thomas du 20/11, une passe, espace ouvert seulement, 4 points) :
 * 1. « Si tu as 5 minutes » : les cartes du jour en liste verticale pleine largeur (plus de grille à 3 colonnes) ;
 * 2. un émoji par rubrique, le même partout : table unique `components/espace/emojis.ts`, branchée partout ;
 * 3. page d'un parcours : corps de l'étape en `TEXTE` (16/24), invitation au rappel sous la méta, carte d'en-tête neutre ;
 * 4. bandeau (filet) violet seulement sur la carte principale de chaque écran.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { render, screen } from "@testing-library/react";
import { EMOJIS_RUBRIQUES, EMOJIS_PARCOURS, emojiParcours } from "@/components/espace/emojis";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import { MissionLien } from "@/components/espace/aujourdhui/mission-lien";
import { EnTeteCarte } from "@/components/espace/carte/en-tete-carte";
import { CADRE_CARTE, CADRE_CARTE_ENTRAINER, CADRE_CARTE_NEUTRE, CADRE_CARTE_PRINCIPALE, CARTE, CARTE_PRINCIPALE, FILET_CARTE } from "@/components/espace/carte/styles";
import { TEXTE } from "@/components/espace/typo";

const SRC = join(__dirname, "..", "..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");

/** Fichiers .ts/.tsx d'un dossier, récursivement. */
function fichiers(dossier: string): string[] {
  const abs = join(SRC, dossier);
  return readdirSync(abs).flatMap((n) => {
    const p = join(abs, n);
    if (statSync(p).isDirectory()) return fichiers(relative(SRC, p));
    return /\.tsx?$/.test(n) ? [relative(SRC, p)] : [];
  });
}

/** Code sans commentaires (`/* … *\/`, `{/* … *\/}`, `// …` hors adresses). */
const sansCommentaires = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

/** Les écrans de l'espace ouvert. */
const ESPACE = ["components/espace", "app/(dashboard)/mon-espace", "app/(dashboard)/carnet", "app/(dashboard)/favoris"];
const EMOJIS = /⚡|🎯|💡|📒|😂|🎬/u;

describe("point 2 : une table unique d'émojis de rubrique", () => {
  it("la table : ⚡️ Quoi répondre, 🎯 S'entraîner, 💡 Bibliothèque, 📒 Carnet, 😂 vannes, 🎬 vidéos, 💡 conseils", () => {
    expect(EMOJIS_RUBRIQUES).toEqual({
      quoiRepondre: "⚡️",
      sEntrainer: "🎯",
      bibliotheque: "💡",
      carnet: "📒",
      vanne: "😂",
      video: "🎬",
      conseil: "💡",
    });
    // Les parcours gardent le leur (cartes « Tu te reconnais ? » de l'accueil).
    expect(EMOJIS_PARCOURS).toEqual({ "machine-a-cafe": "☕️", repartie: "⚡️", confiance: "🌱" });
    expect(emojiParcours("storytelling")).toBeNull();
  });

  it("aucun émoji de rubrique écrit en dur dans l'espace : tout passe par la table", () => {
    const fautifs = ESPACE.flatMap(fichiers)
      .filter((f) => !f.endsWith("components/espace/emojis.ts"))
      .filter((f) => EMOJIS.test(sansCommentaires(lire(f))));
    expect(fautifs).toEqual([]);
    // Plus d'ancienne table (`EMOJIS_ACCUEIL`, `EMOJI_ENTRAINER`) nulle part dans le code.
    const anciens = [...ESPACE, "components/home"].flatMap(fichiers).filter((f) => /EMOJIS_ACCUEIL|EMOJI_ENTRAINER/.test(sansCommentaires(lire(f))));
    expect(anciens).toEqual([]);
  });

  it("chaque rubrique prend SON émoji, là où elle apparaît", () => {
    const usages: [string, keyof typeof EMOJIS_RUBRIQUES][] = [
      ["components/espace/aujourdhui/cartes-du-jour.tsx", "sEntrainer"],
      ["components/espace/aujourdhui/mission-lien.tsx", "sEntrainer"],
      ["components/espace/carte/en-tete-carte.tsx", "sEntrainer"],
      ["components/espace/mission/echelle-marches.tsx", "sEntrainer"],
      ["components/espace/apercu/apercu-s-entrainer.tsx", "sEntrainer"],
      ["components/espace/fiche.tsx", "quoiRepondre"],
      ["app/(dashboard)/mon-espace/quoi-repondre/page.tsx", "quoiRepondre"],
      ["components/espace/apercu/apercu-quoi-repondre.tsx", "quoiRepondre"],
      ["components/espace/bibliotheque/panneau.tsx", "bibliotheque"],
      ["components/espace/apercu/apercu-bibliotheque.tsx", "bibliotheque"],
      ["components/espace/carnet/fiche-carnet.tsx", "carnet"],
      ["components/espace/carnet/liste-carnet.tsx", "carnet"],
      ["components/espace/carnet/carnet-ouvert.tsx", "carnet"],
      ["components/espace/favoris/detail-favori.tsx", "vanne"],
      ["components/espace/favoris/detail-favori.tsx", "conseil"],
      ["components/espace/favoris/detail-favori.tsx", "video"],
      ["components/espace/aujourdhui/contenu-du-jour.tsx", "video"],
    ];
    for (const [f, cle] of usages) expect([f, sansCommentaires(lire(f)).includes(`EMOJIS_RUBRIQUES.${cle}`)]).toEqual([f, true]);
    // La carte S'entraîner d'Aujourd'hui ne prend plus l'émoji de Quoi répondre.
    expect(lire("components/espace/aujourdhui/cartes-du-jour.tsx")).not.toContain("EMOJIS_RUBRIQUES.quoiRepondre");
  });

  it("Aujourd'hui affiche 🎯 sur la carte S'entraîner (action du jour et tuile) et sur la mission", () => {
    const cartes = [{ titre: "Coloc : la poêle", href: "/mon-espace/s-entrainer#a", nouvelle: true }];
    const { container, unmount } = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={false} />);
    expect(container.querySelector("[data-pastilles-da]")?.textContent).toContain("🎯");
    expect(container.textContent).not.toContain("⚡");
    unmount();
    const tuile = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={false} principale={false} />);
    expect(tuile.container.querySelector("[data-pastilles-da]")?.textContent).toContain("🎯");
    tuile.unmount();
    const mission = render(<MissionLien marche={3} />);
    expect(mission.container.querySelector("[data-pastilles-da]")?.textContent).toContain("🎯");
    mission.unmount();
    render(<EnTeteCarte id="t" titre="Titre" nouvelle />);
    expect(screen.getByText("🎯")).toBeTruthy();
  });
});

describe("point 1 : « Si tu as 5 minutes », les cartes en liste verticale", () => {
  it("une colonne à toutes les largeurs (plus de grille `auto-fit` à 3 colonnes), pastille à gauche, titre à droite", () => {
    const cartes = [
      { titre: "Coloc : la poêle", href: "/a", nouvelle: true },
      { titre: "Boulot : « Ça va ? »", href: "/b", nouvelle: false },
      { titre: "Amis : « Alors, quoi de neuf ? »", href: "/c", nouvelle: false },
    ];
    const { container } = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={false} />);
    const ul = container.querySelector("ul") as HTMLUListElement;
    expect(ul.className).toContain("flex-col");
    expect(ul.className).not.toMatch(/grid/);
    const liens = ul.querySelectorAll("a");
    expect(liens).toHaveLength(3);
    // Pastille d'abord, titre ensuite (texte inchangé).
    expect(liens[0].children[0].textContent).toMatch(/Nouvelle/);
    expect(liens[0].children[1].textContent).toBe("Coloc : la poêle");
  });
});

describe("point 3 : page d'un parcours", () => {
  const detail = () => lire("components/parcours/parcours-detail.tsx");
  const etape = () => lire("components/parcours/parcours-step-card.tsx");

  it("« Ce que tu vas apprendre » (et les corps de l'étape) en `TEXTE` 16/24 ouvert, le fermé inchangé", () => {
    expect(TEXTE).toBe("text-base text-text-secondary");
    expect(etape()).toContain("const corpsLecture = () => (ESPACE_CLIENT_PUBLIE ? TEXTE : CORPS_LECTURE_FERME);");
    expect(etape()).toContain('const CORPS_LECTURE_FERME = "max-w-[68ch] text-base leading-7 text-text-secondary sm:text-[15px]";');
  });

  it("l'invitation au rappel sous la méta du parcours, dans une carte d'en-tête neutre (plus de bloc sous filet)", () => {
    const d = detail();
    expect(d).toContain('{enTeteParcours(invitationRappel && <p className={cn(META, "mt-2")} data-rappel-parcours="">{invitationRappel}</p>)}');
    expect(d).toContain('<div className={cn(CADRE_CARTE_NEUTRE, "p-6 lg:col-start-2 lg:row-start-2")} data-entete-parcours="">');
    expect(d).not.toContain('mt-6 border-t border-border pt-6")}>{invitationRappel}');
    // Fermé : le bloc titre sans ligne de plus.
    expect(d).toContain("const titreParcours = enTeteParcours();");
  });
});

describe("point 4 : bandeau violet sur la carte principale seulement", () => {
  it("cadres : `CADRE_CARTE`, `CARTE` et `CADRE_CARTE_ENTRAINER` neutres ; le filet dans `*_PRINCIPALE` seulement", () => {
    expect(CADRE_CARTE).toBe(CADRE_CARTE_NEUTRE);
    expect(CADRE_CARTE_ENTRAINER).toBe(CADRE_CARTE_NEUTRE);
    expect(CARTE).not.toContain(FILET_CARTE);
    expect(CADRE_CARTE_PRINCIPALE).toContain(FILET_CARTE);
    expect(CARTE_PRINCIPALE).toContain(CADRE_CARTE_PRINCIPALE);
  });

  it("le bandeau `<Bandeau />` ne reste que sur les cartes principales des écrans de la passe", () => {
    const avecBandeau = ESPACE.flatMap(fichiers)
      .filter((f) => /<Bandeau\b/.test(sansCommentaires(lire(f))))
      .sort();
    expect(avecBandeau).toEqual(
      [
        // Aujourd'hui : l'action du jour (pas figée).
        "components/espace/aujourdhui/action-du-jour.tsx",
        // Aperçus : la carte d'offre.
        "components/espace/apercu/offre-apercu.tsx",
        // Favoris sans favori ou en échec : la carte d'état, seule carte de l'écran.
        "components/espace/favoris/favoris-abonne.tsx",
        // Mes questions : le fil ouvert.
        "components/espace/questions/fil.tsx",
        // Quoi répondre sous 1024 px : la carte de la prochaine situation (la fiche ouverte dès 1024).
        "app/(dashboard)/mon-espace/quoi-repondre/page.tsx",
        // Hors de la passe (Lettre, Profil, Mes répliques) : inchangés.
        "components/espace/lettre-page-ouverte.tsx",
        "components/espace/profil/profil-cartes.tsx",
        "components/espace/repliques/ecrire-replique.tsx",
        "components/espace/repliques/liste-repliques.tsx",
      ].sort(),
    );
    expect(lire("components/espace/aujourdhui/action-du-jour.tsx")).toContain("{!fige && <Bandeau />}");
    expect(lire("components/espace/questions/fil.tsx")).toContain("{ouvertAuDepart && <Bandeau />}");
  });

  it("l'action du jour porte le bandeau ; figée (extrait de l'aperçu), non", () => {
    const { container, unmount } = render(<ActionDuJour idTitre="t" etiquette="S'entraîner" titre="Si tu as 5 minutes" action={{ href: "/x", libelle: "Go" }} />);
    expect(container.querySelectorAll("[data-bandeau-da]")).toHaveLength(1);
    unmount();
    const fige = render(<ActionDuJour idTitre="t" etiquette="S'entraîner" titre="Si tu as 5 minutes" action={null} fige />);
    expect(fige.container.querySelectorAll("[data-bandeau-da]")).toHaveLength(0);
  });

  it("cartes principales à filet : fiche ouverte, étape ouverte, fiche du Carnet (pas l'offerte), situation de S'entraîner", () => {
    expect(lire("components/espace/fiche.tsx")).toContain("<div className={CARTE_PRINCIPALE}>");
    expect(lire("components/parcours/parcours-step-card.tsx")).toContain("cn(props.isExpanded ? CADRE_CARTE_PRINCIPALE : CADRE_CARTE, ");
    expect(lire("components/espace/carnet/fiche-carnet.tsx")).toContain("offerte ? CADRE_CARTE : CADRE_CARTE_PRINCIPALE");
    expect(lire("components/espace/carte/carte-registre.tsx")).toContain("cn(CADRE_CARTE_PRINCIPALE, ");
    // Listes (Carnet, Favoris, Bibliothèque) et tuiles d'aperçu : plus de filet.
    for (const f of ["components/espace/carnet/liste-carnet.tsx", "components/espace/favoris/liste-favoris.tsx", "components/espace/bibliotheque/colonne-liste.tsx", "components/espace/apercu/apercu-bibliotheque.tsx", "components/espace/apercu/apercu-quoi-repondre.tsx"]) {
      expect([f, /\bFILET_CARTE\b/.test(sansCommentaires(lire(f)))]).toEqual([f, false]);
    }
  });
});
