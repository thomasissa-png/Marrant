/**
 * Test d'inertie de l'espace client (s24, lot D0, plan §2 règle 2), relancé à chaque lot.
 *
 * Interrupteur `ESPACE_CLIENT_PUBLIE` fermé, le HTML de ce qu'un lot de l'espace va toucher
 * reste celui de la production : en-tête (HTML serveur ; menu mobile ouvert sur /profil,
 * /parcours, /favoris ; menu de compte ouvert) pour visiteur, compte FREE et abonné sur les 10 pages publiques du plan ; pied
 * de page ; pages /profil et /favoris. Référence prise sur `main` avant le premier lot
 * (`__snapshots__/inertie-espace.test.tsx.snap`). Un écart = un changement visible flag
 * fermé : corriger le code, JAMAIS mettre la référence à jour (`-u` interdit ici).
 *
 * Plus un garde-fou de construction : aucun fichier hors du périmètre de l'espace n'importe
 * l'interrupteur ou `lib/espace/*`, sauf la liste blanche (complétée lot par lot, dans le
 * même commit que la retouche, chaque retouche étant sous garde de l'interrupteur).
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { TextEncoder } from "util";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountMenu } from "@/components/layout/account-menu";
import ProfilPage from "@/app/(dashboard)/profil/page";
import FavorisPage from "@/app/(dashboard)/favoris/page";
import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));

// jsdom n'expose pas TextEncoder, requis par le rendu serveur de React.
Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };

const PAGES = [
  "/profil",
  "/parcours",
  "/parcours/repartie",
  "/favoris",
  "/vannes",
  "/conseils",
  "/videos",
  "/carnet",
  "/abonnement",
  "/abonnement/success",
];
const ETATS = {
  visiteur: { data: null, status: "unauthenticated" },
  gratuit: { data: { user: { id: "u1", name: "Yanis", email: "y@x.fr", plan: "FREE" } }, status: "authenticated" },
  abonne: { data: { user: { id: "u2", name: "Sophie", email: "s@x.fr", plan: "PREMIUM" } }, status: "authenticated" },
} as const;

beforeEach(() => {
  usePathname.mockReturnValue("/");
  useSession.mockReturnValue(ETATS.visiteur);
});

it("l'interrupteur est fermé (référence prise flag fermé)", () => {
  expect(ESPACE_CLIENT_PUBLIE).toBe(false);
});

/** Identifiants générés par React (`useId`, Radix) : dépendent de l'ordre des rendus, pas du code. */
const stable = (html: string) => html.replace(/:r[0-9a-z]+:/g, ":r:");
/** Pages où le menu mobile ouvert est aussi figé (celles que l'espace touche). */
const PAGES_MENU_MOBILE = new Set(["/profil", "/parcours", "/favoris"]);

describe.each(Object.entries(ETATS))("en-tête, %s", (_etat, session) => {
  it.each(PAGES)("%s : HTML serveur", async (page) => {
    usePathname.mockReturnValue(page);
    useSession.mockReturnValue(session);
    expect(stable(renderToStaticMarkup(<Header />))).toMatchSnapshot("serveur");
    if (!PAGES_MENU_MOBILE.has(page)) return;
    const { container, unmount } = render(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(stable(container.innerHTML)).toMatchSnapshot("menu mobile ouvert");
    unmount();
  });
});

it("menu de compte ouvert (compte connecté)", async () => {
  useSession.mockReturnValue(ETATS.abonne);
  render(<AccountMenu />);
  await userEvent.click(screen.getByRole("button", { name: "Mon compte" }));
  expect(stable(document.body.innerHTML)).toMatchSnapshot();
});

it("pied de page", () => {
  expect(stable(renderToStaticMarkup(<Footer />))).toMatchSnapshot();
});

describe.each(Object.entries(ETATS))("pages /profil et /favoris, %s", (_etat, session) => {
  it("HTML serveur", () => {
    useSession.mockReturnValue(session);
    expect(stable(renderToStaticMarkup(<ProfilPage searchParams={{}} />))).toMatchSnapshot("profil");
    expect(stable(renderToStaticMarkup(<FavorisPage />))).toMatchSnapshot("favoris");
  });
});

describe("garde-fou de construction", () => {
  const SRC = join(__dirname, "../..");
  /**
   * Fichiers hors périmètre autorisés à importer l'espace (vide au lot D0).
   * D2 : l'en-tête monte l'en-tête abonné et la barre, sous garde de l'interrupteur.
   * D3 : la page de succès et la connexion calculent l'arrivée, sous garde de l'interrupteur.
   * D4 : parcours, profil, bulle d'XP et seuils (détail ci-dessous), sous garde de l'interrupteur.
   */
  const LISTE_BLANCHE: string[] = [
    // D11b, touché de nouveau : repère de chargement de l'en-tête abonné à 65 px (rendu ouvert et Premium seulement).
    "components/layout/header.tsx",
    // D10b : condition de la puce des bonus de l'e-mail E0 (`bonusTousPublies`, lecture de fichier seule) ; la
    // puce n'est écrite qu'interrupteur ouvert (`paiement.ts`), fermé l'e-mail reste identique (hachage, D10).
    "lib/emails/paiement-notifications.ts",
    // D10b : purge de `UsageEvent` programmée sur le planificateur existant, inerte interrupteur fermé
    // (import dynamique de l'interrupteur, testé dans `purge-usage-d10b-s24.test.ts`).
    "lib/scheduler/jobs.ts",
    // D3 : arrivées après paiement et après connexion, sous garde de l'interrupteur.
    "app/(dashboard)/abonnement/success/page.tsx",
    "app/(auth)/login/page.tsx",
    // D3 : /mon-espace/** réécrit vers la 404 naturelle interrupteur fermé.
    // D11b (Q-1), touché de nouveau : ouvert seulement, l'adresse demandée sous /mon-espace est transmise au
    // layout (en-tête `EN_TETE_CHEMIN_ESPACE`) ; fermé, la réécriture vers la 404 passe avant (testé).
    // v6 tour 2 (point 10), touché de nouveau : ouvert seulement, `/mon-espace/lettres` en 308 vers `/lettre` pour
    // tous les comptes ; fermé, la réécriture vers la 404 passe avant (`v6-tour2-lot1-middleware.test.ts`).
    "middleware.ts",
    // D4 : en-tête de l'abonné sur /parcours (4 premières semaines, « Ton cap »), monté seulement ouvert.
    "app/(dashboard)/parcours/(liste)/page.tsx",
    // D4 : liste /parcours, abonné, ouvert seulement : pas de second « Reprendre », quiz d'orientation sous la liste.
    "components/parcours/parcours-content.tsx",
    // D4 : page d'un parcours enrichie pour l'abonné (sommaire, annonce de cap), ouvert seulement.
    "components/parcours/parcours-detail.tsx",
    // D4 : fiches de l'étape et ancres `#fiche-N-M`, avec la prop `ancresFiches` (vraie ouvert seulement).
    "components/parcours/parcours-step-card.tsx",
    // D4 : carte « Ton cap » à la place de « Progression » sur /profil, ouvert seulement.
    "components/profil/profil-dashboard.tsx",
    // D4 : bulle « +X XP » sans emoji et 5 s au moins, ouvert seulement.
    "components/ui/xp-notification.tsx",
    // D4 : seuils des caps (0, 100, 300, 700, 2 300) appliqués ouvert ; fermé, l'ancienne table.
    "lib/progression.ts",
    // D4 (@legal G9) : trois lignes de la confidentialité sur la question C9, rendues ouvert seulement.
    "app/(dashboard)/confidentialite/page.tsx",
    // D4, touchés sans import de l'espace (aucun effet fermé) : `lib/utils.ts` et `config/textes/parcours.ts`
    // (marques A_SUPPRIMER_APRES_OUVERTURE en commentaire), `lib/account.ts` (export des données :
    // `EspaceCompte` et `CapAnnonce`, tables vides fermé, demande @legal G9).
    "lib/utils.ts",
    "config/textes/parcours.ts",
    "lib/account.ts",
    // D5, déjà listés, touchés de nouveau :
    // - `app/(dashboard)/parcours/(liste)/page.tsx` (arbitrage @ux D4 n°1) : fil d'Ariane et introduction
    //   publique dans `MasqueSiPremium` seulement ouvert ; fermé, mêmes éléments (fragment), HTML identique ;
    // - `components/profil/profil-dashboard.tsx` (arbitrage @ux D4 n°2) : carte « Série » rendue fermé
    //   seulement, « Ton cap » en `md:col-span-2` ouvert ;
    // - `lib/account.ts` : export et suppression du compte avec `CarteSuivi`, `CarteReponse`, `FicheFait`,
    //   `MissionRetour`, `UserReplique` (tables vides fermé ; la suppression du compte emporte tout).
    // D6 (architecture 3.12) : un abonné dont le navigateur n'est pas « entré » dans le coin « Humour noir,
    // fait bien » ne trouve aucune vanne repérée dans la recherche ni dans ses favoris. Sous garde de
    // l'interrupteur dans `filtreHumourNoir` : fermé, filtre vide, témoin non lu, réponses identiques.
    "app/api/search/route.ts",
    "app/api/favorites/route.ts",
    // D5b (@legal, cookie du coin « Humour noir », poste partagé) : à la déconnexion et à la suppression du
    // compte, le témoin du coin est retiré. Sous garde de l'interrupteur dans `effacerTemoinCoin` : fermé,
    // aucun en-tête ajouté, réponses identiques (test `d5b-temoin-coin-s24`).
    "app/api/auth/[...nextauth]/route.ts",
    "app/api/user/route.ts",
    // D7 (« Mes questions ») : l'outil de l'équipe, sous l'auth admin existante (`refusAdmin`), et sa page.
    // Fermé : la route répond 404 avant toute lecture et la page est la 404 (middleware + `notFound()`).
    // `middleware.ts` (déjà listé) réécrit aussi `/admin/questions` vers la 404 naturelle, fermé seulement ;
    // `lib/account.ts` (déjà listé, sans import de l'espace) exporte et supprime les fils avec le compte.
    "app/api/admin/questions-equipe/route.ts",
    "app/(dashboard)/admin/questions/page.tsx",
    // D9 (mesure d'usage de l'espace) : `lib/mesure/evenements-espace.ts` lit l'interrupteur pour n'écrire
    // AUCUN événement fermé (seconde barrière après la garde des routes) ; la lecture admin
    // `api/admin/espace-lecture` répond 404 fermé avant toute lecture, puis l'auth admin existante.
    "lib/mesure/evenements-espace.ts",
    "app/api/admin/espace-lecture/route.ts",
    // D10 (« Mon profil », pages d'abonnement, textes en ligne du plan §6 ; go de Thomas ligne par ligne) :
    // - `profil/page.tsx` : historique en lecture seule de l'ancien abonné, composant monté ouvert seulement
    //   (lecture chargée à la demande) ; fermé, page synchrone identique (snapshot) ;
    // - `abonnement/page.tsx` : ligne des bonus (T1) et lignes de l'ancien abonné (T11), passées à la vue
    //   ouvert seulement ; fermé, `lignesAncienAbonne` rend [] sans lire session ni base, props absentes ;
    // - `cgu/page.tsx` : article 10 retouché (T7) ouvert seulement ; D11b : dernier alinéa de l'article 3 (bonus),
    //   ouvert ET 4 bonus publiés seulement (`bonusTousPublies`, lecture de fichier), fermé rien ; date de mise à jour avec
    //   `ESPACE_DATE_TEXTES` (vide d'ici l'ouverture, donc inchangée) ;
    // - `config/textes/paiement.ts` : puce des bonus de l'e-mail E0 (T3) ouvert seulement ; E0 fermé
    //   identique (test par hachage) ;
    // - `lib/analytics/espace-lecture.ts` : lecture des compteurs anonymes (règles @legal D9 point 6),
    //   appelée seulement par la route admin, 404 fermé.
    "app/(dashboard)/profil/page.tsx",
    "app/(dashboard)/abonnement/page.tsx",
    "app/(dashboard)/cgu/page.tsx",
    "config/textes/paiement.ts",
    "lib/analytics/espace-lecture.ts",
    // D11c (revue d'harmonie, défaut 3) : colonne de l'abonné sur l'axe de l'espace (`AxeEspace`), montée
    // seulement ouvert ; fermé, la même `div` centrée qu'avant (et ouvert, la même pour un visiteur, critère 11).
    // `parcours/(liste)/page.tsx` et `profil/page.tsx`, déjà listés, sont touchés de nouveau pour la même raison.
    "app/(dashboard)/parcours/[slug]/page.tsx",
    // D11c (revue d'harmonie, défaut 5) : rangée d'onglets de Favoris avec marge et indice de défilement,
    // ouvert seulement ; fermé, classes d'avant (snapshot `favoris` inchangé).
    // v6 tour 2 (point 12), touché de nouveau : onglets, « Partager » et « Retirer » en cibles de 44 px, ouvert seulement.
    "components/favoris/favoris-list.tsx",
    // Navigation universelle v5 (s24) : en-tête unique et son menu mobile, chargés par `header.tsx` (déjà
    // listé, touché de nouveau : il les monte à la place de l'ancienne barre) SEULEMENT interrupteur ouvert ;
    // fermé, jamais rendus ni téléchargés (snapshots de l'en-tête inchangés).
    "components/layout/en-tete-universel.tsx",
    "components/layout/menu-mobile-universel.tsx",
    // Relecture des captures nav s24 (ouvert seulement, rendu fermé inchangé, instantanés et hachages identiques) :
    // - `vannes/page.tsx` : phrase de vente du chapô masquée pour l'abonné (`MasqueSiPremium`) ;
    // - `components/vannes/vannes-list.tsx` : rangée des catégories à la ligne dès 1 024 px ;
    // - `components/carnet/carnet-fiche-card.tsx` : fiche du carnet moins dense ;
    // - `components/home/reprendre-parcours.tsx` : apostrophes typographiques du titre de l'étape.
    // `favoris-list.tsx` et `parcours-content.tsx`, déjà listés, sont touchés de nouveau (grille des favoris,
    // apostrophes du titre de l'étape), ouvert seulement.
    "app/(dashboard)/vannes/page.tsx",
    "components/vannes/vannes-list.tsx",
    "components/carnet/carnet-fiche-card.tsx",
    "components/home/reprendre-parcours.tsx",
    // Tour 2 des captures (ouvert seulement, fermé inchangé) : coque du site en colonne avec le pied en bas
    // (`(dashboard)/layout.tsx`) ; place du repère au-dessus du titre de /favoris ; surtitre du carnet de l'abonné
    // sous le titre (`carnet-page.tsx`) ; carte « Vanne du jour » de l'accueil (`daily-content.tsx`).
    "app/(dashboard)/layout.tsx",
    "app/(dashboard)/favoris/page.tsx",
    "components/carnet/carnet-page.tsx",
    "components/home/daily-content.tsx",
    // Touchés sans import de l'espace, rendu fermé inchangé : `account-menu.tsx` (variante `universel`, passée
    // par l'en-tête unique seulement), `header-icons.tsx` (icône de l'ancien menu de compte abonné retirée),
    // `parcours/[slug]/page.tsx`, `profil/page.tsx` (déjà listés : `AxeEspace` retiré, même colonne pour
    // tous ; `parcours/(liste)/page.tsx`, figé par hachage, garde l'import d'un `AxeEspace` devenu neutre), `tailwind.config.ts` (`maxWidth.lecture` retiré, plus aucun emploi).
    // Décisions de Thomas du 14/11 (s25, ouvert seulement, fermé inchangé, instantanés identiques) : vannes gratuites
    // réparties sur les catégories (`api/jokes/route.ts`, règle dans le code, fermé : aucune requête de plus) ;
    // « La lettre » une seule section, archive pour l'abonné (`lettre/page.tsx`, garde et archive chargées à la
    // demande, fermé : aucune lecture de session) ; question du prix de la FAQ de /parcours masquée pour l'abonné
    // (`faq-section.tsx`). Tests : `__tests__/api/decisions-14-11-s25.test.ts`, `__tests__/espace/decisions-14-11-s25.test.tsx`.
    "app/api/jokes/route.ts",
    "app/(dashboard)/lettre/page.tsx",
    "components/home/faq-section.tsx",
    // Navigation v6 (s25, lot A, maquette D validée le 15/11) : bande des rubriques, montée par l'en-tête unique
    // (ouvert seulement : `header.tsx` rend l'en-tête d'aujourd'hui fermé) ; fil d'Ariane visible retiré au premier
    // niveau ouvert seulement (fermé : le même `nav`, instantanés identiques). Tests :
    // `__tests__/layout/navigation-v6-s25.test.tsx`, `playwright/tests/local/nav-universelle-s24.spec.ts`.
    "components/layout/bande-rubriques.tsx",
    "app/(dashboard)/blog/page.tsx",
    "app/(dashboard)/conseils/page.tsx",
    "app/(dashboard)/glossaire/page.tsx",
    "app/(dashboard)/videos/page.tsx",
    // Corrections v6 tour 1 (s25, lot 2, pages publiques vues ouvertes) : chaque fichier lit l'interrupteur sous sa
    // seule garde (`filet={ESPACE_CLIENT_PUBLIE}` sur `Card`, absent = carte d'avant au caractère près ; classes et
    // filet ajoutés `ESPACE_CLIENT_PUBLIE ? … : <classe d'avant>` ; réassurance `text-left` ouvert seulement) ;
    // `lettres-abonne-cartes.tsx` lit `lib/espace` et n'est chargé qu'à la demande par `lettre/page.tsx`, sous
    // l'interrupteur et pour l'abonné actif. Fermé : instantanés identiques. Tests :
    // `__tests__/espace/publiques-v6-tour1-s25.test.tsx`, `playwright/tests/local/publiques-v6-tour1-pages.spec.ts`.
    "app/(dashboard)/profil/rappel-parcours-toggle.tsx",
    "components/lettre/lettre-hebdo-reglage.tsx",
    "components/lettre/lettre-page-inscription.tsx",
    "components/lettre/lettres-abonne-cartes.tsx",
    "components/premium/bloc-exercice.tsx",
    "components/premium/carte-floutee.tsx",
    "components/premium/mur-liste.tsx",
    "components/premium/premium-modal.tsx",
    "components/profil/abonnement-card.tsx",
    "components/profil/prenom-card.tsx",
    "components/profil/supprimer-compte-card.tsx",
    // s26 (règle de Thomas : un seul aplat violet par écran) : « Passer à l'étape 2 » de la fin d'étape 1 passe en
    // contour, ouvert seulement (`ESPACE_CLIENT_PUBLIE && CONTOUR_OFFRE` ajouté au `cn` du plein : fermé, classe d'avant
    // au caractère près, instantanés identiques).
    "components/parcours/step-blocks.tsx",
  ];
  const PERIMETRE = [
    /^app\/\(dashboard\)\/mon-espace\//,
    /^app\/api\/espace\//,
    /^lib\/espace\//,
    /^components\/espace\//,
    /^config\/espace-client\.ts$/,
    /^config\/textes\/espace-[^/]+\.ts$/,
    /^__tests__\//,
  ];

  function sources(dossier: string): string[] {
    return readdirSync(dossier).flatMap((entree) => {
      const chemin = join(dossier, entree);
      if (statSync(chemin).isDirectory()) return entree === "node_modules" ? [] : sources(chemin);
      return /\.(ts|tsx)$/.test(entree) ? [chemin] : [];
    });
  }

  it("aucun import de l'espace hors périmètre et liste blanche", () => {
    const fautifs = sources(SRC)
      .map((f) => relative(SRC, f).split("\\").join("/"))
      .filter((f) => !PERIMETRE.some((p) => p.test(f)) && !LISTE_BLANCHE.includes(f))
      .filter((f) => /["']@\/(config\/espace-client|lib\/espace\/|components\/espace\/)/.test(readFileSync(join(SRC, f), "utf8")));
    expect(fautifs).toEqual([]);
  });
});
