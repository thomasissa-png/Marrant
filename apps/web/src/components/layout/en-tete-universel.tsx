"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { IconeProfil, IconeRecherche } from "@/components/layout/header-icons";
import { MenuMobileUniversel } from "@/components/layout/menu-mobile-universel";
import { CHAMP } from "@/components/layout/panneau-eleve";
import { BandeRubriques } from "@/components/layout/bande-rubriques";
import { rubriqueAllumee, sousAdresse, type EtatLecteur } from "@/components/espace/rubriques";
import { ESPACE_ACCUEIL } from "@/config/espace-client";
import { TEXTES_CONNEXION } from "@/config/textes/compte";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { cn } from "@/lib/utils";

/**
 * En-tête unique du site, interrupteur `ESPACE_CLIENT_PUBLIE` ouvert (`docs/ux/navigation-universelle-s24.md`
 * v5 §1) : le même pour visiteur, compte gratuit et abonné, sur toutes les pages qui ont un en-tête. Fermé,
 * `header.tsx` rend l'en-tête d'aujourd'hui et ce module n'est jamais chargé.
 * HTML serveur : celui du visiteur (la session n'est connue que dans le navigateur). Parties de l'abonné
 * (cloche) chargées à la demande.
 * s25, navigation v6 (`docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le 15/11) : rangée de 65 px
 * (logo, recherche, Connexion, bouton d'offre, cloche, compte, Menu) puis, dans le même bloc collant, la bande des
 * rubriques (`bande-rubriques.tsx`) ; les liens du site et « Mon espace » quittent la rangée.
 * Largeurs : loupe de 440 à 767, champ de 176 px dès 768 ; « Connexion » dès 520 ; cloche à toutes les largeurs ;
 * compte dès 768 ; bouton d'offre « Premium » sous 640, libellé complet dès 640 ; Menu sous 768 (visiteur : sous
 * 520, au-delà il ne contiendrait que le bouton d'offre déjà en rangée). Icônes de droite et « … » sur la même
 * grille : zones de 44 px, 4 px avant le bord de la bande (`mr-1` ici, `px-1` de la bande), centres alignés.
 * Budget vérifié par `playwright/tests/local/header-budget.spec.ts` (3 états, 320 à 1920 px).
 */
const AccountMenu = dynamic(() => import("@/components/layout/account-menu").then((m) => m.AccountMenu), {
  ssr: false,
  loading: () => (
    <span aria-hidden="true" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-11 w-11 shrink-0 px-0")}>
      <IconeProfil />
    </span>
  ),
});

const Cloche = dynamic(() => import("@/components/espace/cloche").then((m) => m.ClocheEspace), {
  ssr: false,
  loading: () => <span aria-hidden="true" className="h-11 w-11 shrink-0" />,
});

/**
 * Menu (bouton, voile, panneau) : sous 768 px (visiteur : sous 520), et à toutes les largeurs quand la fenêtre fait
 * moins de 500 px de haut (arbitrage du 15/11 : la bande y est masquée, ses rubriques passent dans le menu).
 */
const SANS_MENU = "[@media(min-width:768px)_and_(min-height:500px)]:hidden";

const ICONE =
  "h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";

export function EnTeteUniversel() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const connecte = status === "authenticated";
  const premium = (session?.user as { plan?: string } | undefined)?.plan === "PREMIUM";
  const etat: EtatLecteur = !connecte ? "visiteur" : premium ? "abonne" : "gratuit";
  const allume = rubriqueAllumee(pathname);

  useEffect(() => {
    if (rechercheOuverte) document.querySelector<HTMLInputElement>("#mobile-search input")?.focus();
  }, [rechercheOuverte]);

  const fermerMenu = (rendreFocus: boolean) => {
    setMenuOuvert(false);
    if (rendreFocus) boutonMenu.current?.focus();
  };

  // Échap ferme le menu et rend le focus au bouton « Menu » (une touche déjà traitée ne ferme rien).
  useEffect(() => {
    if (!menuOuvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      setMenuOuvert(false);
      boutonMenu.current?.focus();
    };
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [menuOuvert]);

  useEffect(() => {
    setRechercheOuverte(false);
    setMenuOuvert(false);
  }, [pathname]);

  // s25 (relecture ux tour 6, critère 7 piste 3 ; tour 7, critère 7) : menu ouvert sous un voile, le focus reste dans
  // l'en-tête, contrôles restés visibles au-dessus du voile compris (logo, cloche, compte, croix), dans l'ordre du DOM.
  // Tab sur le dernier élément visible (dernière ligne du menu) revient au logo, Maj+Tab sur le logo va au dernier ;
  // Maj+Tab depuis la première ligne du menu tombe naturellement sur la croix. Éléments relevés à chaque touche
  // (suggestions de recherche ouvertes comprises), visibles et tabulables seulement. Échap : effet ci-dessus.
  const enfermerFocus = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" || e.defaultPrevented) return;
    const elements = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]")).filter(
      (el) => el.tabIndex >= 0 && el.getClientRects().length > 0,
    );
    const premier = elements[0];
    const dernier = elements[elements.length - 1];
    if (!premier || !dernier) return;
    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  };

  // Mêmes liens que l'en-tête d'aujourd'hui : retour sur la page courante, bouton masqué sur les pages chaudes.
  const prixHref = buildAbonnementUrl(pathname && pathname !== "/" ? pathname : null, "monthly", "header");
  const loginHref = buildLoginUrl({ callbackUrl: pathname });
  const pageChaude = sousAdresse(pathname, "/abonnement") || sousAdresse(pathname, "/register");
  // Arbitrage du 15/11 (intégration s25) : pas de bande sur /abonnement et ses sous-adresses (/abonnement/success…),
  // comme le bouton d'offre : la page de conversion validée en s21 garde son pli. La rangée du haut reste.
  const sansBande = sousAdresse(pathname, "/abonnement");
  const ouvrirRecherche = () => {
    setRechercheOuverte(!rechercheOuverte);
    setMenuOuvert(false);
  };

  return (
    <>
      {/* v6 critère 3 : ancres et focus jamais cachés sous le bloc collant (rangée et bande, 121 px au plus).
          Arbitrage du 15/11 : fenêtre de moins de 500 px de haut (200 % de texte sur téléphone, paysage), le bloc
          défile avec la page (`relative` : hors du flux collant, mais le menu mobile reste ancré sous lui) ; plus rien ne couvre le haut, donc plus de réserve.
          Sans bande (/abonnement) : aucune réserve posée, la page de conversion se comporte comme aujourd'hui (même en-tête
          de 65 px que le site fermé ; mesuré : sinon la FAQ prix arrive 64 px plus bas au clic, `conversion-v3-s21` M3). */}
      {!sansBande && <style>{"html{scroll-padding-top:8rem}@media (max-height:499px){html{scroll-padding-top:0}}"}</style>}
      {menuOuvert && <div aria-hidden="true" className={cn("fixed inset-0 z-40 bg-black/60", SANS_MENU)} onClick={() => fermerMenu(true)} />}
      <header
        className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md [@media(max-height:499px)]:relative"
        data-en-tete-universel={etat}
        onKeyDown={menuOuvert ? enfermerFocus : undefined}
      >
        {/* s25 (relecture design F1) : barre ancrée à gauche, le premier lien au même x pour les 3 états à chaque
            largeur ; le vide se loge entre les liens et la recherche (ou les actions sous 1280 px). Tour 3 (design,
            faute dure) : 16 px dès 320 px, le logo sur la verticale de la recherche et des lignes du menu (`px-4`). */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-start gap-2 px-4 sm:gap-4 md:px-6 xl:px-8">
          {/* §6 (ROUVRE) : le logo de l'abonné mène à « Aujourd'hui ». s25 (relecture tour 2, design F5, ux 7) : même
              anneau violet arrondi que les autres contrôles ; `-mx-1 px-1` donne 4 px d'air à l'anneau sans
              déplacer le texte d'un pixel. */}
          <Link
            href={etat === "abonne" ? ESPACE_ACCUEIL : "/"}
            className="-mx-1 flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
          >
            <span className="whitespace-nowrap font-display text-sm font-bold text-gradient min-[360px]:text-base min-[400px]:text-lg sm:text-xl">
              deviens-marrant.fr
            </span>
          </Link>

          {/* s25 tour 4 bis : recherche de 176 px (spec v5 §1). La CI (Chrome 145) rend les graisses 500 à 700 des
              polices variables 1 à 8 px plus larges qu'en local : une zone d'actions de largeur fixe (même x de la
              recherche pour les 3 comptes, piste design tour 2) ne tient plus dans la coque (1216 px utiles de 1280 à
              1920 px) avec la recherche à 176 px. La zone prend donc la largeur de son contenu, 16 px après la
              recherche (`xl:ml-0`) : la recherche change de x selon le compte, la rangée tient avec marge.
              s25 tour 8 (ux critère 7) : champ à 44 px de haut ici et dans `#mobile-search` (`Input` : `h-10` dès 768 px).
              v6 : les liens du site quittent la rangée, le champ s'affiche dès 768 px (maquette D), juste avant les
              actions. */}
          <SearchBar className={cn("hidden w-44 shrink-0 md:ml-auto md:block [&_input]:h-11", CHAMP)} onNavigate={() => setRechercheOuverte(false)} enTete />

          <div className="ml-auto mr-1 flex shrink-0 items-center gap-1 md:ml-0 md:gap-3">
            <button
              type="button"
              className={cn(ICONE, "hidden min-[440px]:flex md:hidden")}
              onClick={ouvrirRecherche}
              aria-label="Rechercher"
              aria-expanded={rechercheOuverte}
              aria-controls="mobile-search"
            >
              <IconeRecherche />
            </button>
            {etat === "visiteur" && (
              <Link
                href={loginHref}
                className="hidden h-11 min-w-[44px] items-center justify-center rounded-lg px-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link min-[520px]:flex"
              >
                {TEXTES_CONNEXION.lienConnexionMobile}
              </Link>
            )}
            {etat !== "abonne" && !pageChaude && (
              <Link
                href={prixHref}
                aria-label={EN_TETE.nomAccessible}
                data-en-tete-prix
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "inline-flex h-11 shrink-0 whitespace-nowrap px-2 text-xs min-[360px]:px-3 min-[360px]:text-sm",
                  // Menu ouvert : retiré du flux (relecture design s25 F4), plus de vide qui isole la loupe.
                  menuOuvert && "hidden md:inline-flex",
                )}
              >
                <span className="sm:hidden">{EN_TETE.boutonCourt}</span>
                <span className="hidden sm:inline">{EN_TETE.bouton}</span>
              </Link>
            )}
            {etat === "abonne" && <Cloche pathname={pathname} />}
            {etat !== "visiteur" && (
              <div className="hidden md:block">
                <AccountMenu universel={{ sansFavoris: true, actif: allume === "compte", courant: allume === "compte" ? pathname : null }} />
              </div>
            )}
            <button
              ref={boutonMenu}
              type="button"
              className={cn(ICONE, "flex", SANS_MENU, etat === "visiteur" && "[@media(min-width:520px)_and_(min-height:500px)]:hidden")}
              onClick={() => {
                setMenuOuvert(!menuOuvert);
                setRechercheOuverte(false);
              }}
              aria-label="Menu"
              aria-expanded={menuOuvert}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOuvert ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* v6 : menu juste après la rangée dans le DOM (Tab depuis « Menu » entre dans le menu, pas dans la bande),
            posé en surimpression sous tout le bloc collant (`menu-mobile-universel.tsx`, `absolute top-full`). */}
        {menuOuvert && (
          <MenuMobileUniversel
            etat={etat}
            pathname={pathname}
            hrefs={{ prix: prixHref, login: loginHref }}
            masquerPlein={pageChaude}
            onClose={() => fermerMenu(false)}
          />
        )}

        {!sansBande && <BandeRubriques etat={etat} pathname={pathname} />}

        {rechercheOuverte && (
          <div id="mobile-search" className="border-t border-border bg-background px-4 py-3 md:hidden animate-slide-up">
            <SearchBar className={cn("w-full [&_input]:h-11", CHAMP)} onNavigate={() => setRechercheOuverte(false)} enTete />
          </div>
        )}
      </header>
    </>
  );
}
