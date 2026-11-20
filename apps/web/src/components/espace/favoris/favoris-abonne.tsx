"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reassurance } from "@/components/ui/reassurance";
import { IconeFavoris } from "@/components/layout/header-icons";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useEstPremium } from "@/hooks/use-est-premium";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { CADRE_CARTE_NEUTRE } from "@/components/espace/carte/styles";
import { TEXTE, TEXTE_FORT } from "@/components/espace/typo";
import { Bandeau } from "@/components/espace/da-espace";
import { LienRetour } from "@/components/espace/lien-retour";
import { CELLULE_LISTE_COLLANTE, GRILLE_LISTE_DETAIL } from "@/components/espace/liste-detail/styles";
import { DetailFavori } from "@/components/espace/favoris/detail-favori";
import { ListeFavoris, grouperFavoris } from "@/components/espace/favoris/liste-favoris";
import { TABS } from "@/components/favoris/libelles";

const BOUTON = cn(buttonVariants({ size: "lg" }), "mt-6 h-auto min-h-11 whitespace-normal");
/** Position de la page liste (< 1024) gardée au clic sur un favori, rendue au retour. */
const CLE_POSITION = "favoris-liste-position";
const LARGE = "(min-width: 1024px)";

const lire = (cle: string) => {
  try {
    return window.sessionStorage.getItem(cle);
  } catch {
    return null;
  }
};
const ecrire = (cle: string, valeur: string | null) => {
  try {
    if (valeur === null) window.sessionStorage.removeItem(cle);
    else window.sessionStorage.setItem(cle, valeur);
  } catch {
    // Stockage refusé (navigation privée stricte) : la position n'est simplement pas gardée.
  }
};

/**
 * Carte d'état (vide, mur) : cadre neutre, étoile de la bande (aucun émoji), titre, phrase, un seul bouton plein.
 * s26 contrôle d'ensemble, aperçus (DA de l'accueil) : le bandeau violet de l'accueil en haut de la carte (hors du flux).
 */
function CarteEtat({ titre, texte, children }: { titre: string; texte?: string; children: React.ReactNode }) {
  return (
    <div className={cn(CADRE_CARTE_NEUTRE, "max-w-2xl p-6")} data-favoris-etat>
      {/* s26 finition avant lancement (point 4) : seule carte de l'écran (aucun favori, échec), elle en est la principale. */}
      <Bandeau />
      <IconeFavoris className="h-6 w-6 text-text-secondary" />
      <p className={cn("mt-4", TEXTE_FORT)}>{titre}</p>
      {texte && <p className={cn("mt-2", TEXTE)}>{texte}</p>}
      {children}
    </div>
  );
}

/**
 * Favoris, vue de l'abonné, espace OUVERT seulement. s26 DA, s'entraîner et favoris (décisions de Thomas du 19/11,
 * « pourquoi on ne garde pas le menu à gauche ? », et du 20/11, DA de l'accueil) : LISTE ET DÉTAIL comme Quoi répondre.
 * Dès 1024, la liste des favoris (groupés par type) collante à gauche, le favori ouvert à droite (le plus récent
 * d'office) ; un clic change le détail sans quitter la page ni démonter la liste. Sous 1024, la liste OU le favori,
 * avec « Retour : Mes favoris » (retour navigateur quand on vient de la liste) et la position de la liste rendue.
 * Adresse d'un favori : `/favoris?favori=<id>`. Mêmes données et mêmes actions que `FavorisList` (store des favoris) ;
 * fermé : `FavorisList`, au caractère près (inertie `favoris`). Le seul bouton plein est celui de l'état vide ou du mur.
 */
export function FavorisAbonne({ titre = "Mes favoris" }: { titre?: string }) {
  const { status } = useSession();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();
  const estPremium = useEstPremium();
  const router = useRouter();
  const parametres = useSearchParams();
  const demande = parametres?.get("favori") ?? null;
  const titreDetail = useRef<HTMLHeadingElement>(null);
  const focusDemande = useRef(false);
  const avant = useRef<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") fetchFavorites();
  }, [status, fetchFavorites]);

  const groupes = grouperFavoris(favorites);
  const ordre = groupes.flatMap((g) => g.favoris);
  const ouvert = demande ? (ordre.find((f) => f.id === demande) ?? null) : null;
  // Dès 1024 sans favori demandé : le plus récent, d'office (« la carte la plus récente en tête » d'avant).
  const plusRecent = favorites.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
  const affiche = ouvert ?? plusRecent;
  const idOuvert = ouvert?.id ?? null;

  // Sous 1024 : un favori ouvert part du haut de la page ; au retour à la liste, sa position est rendue.
  // s26 CI : défilements instantanés, comme le carnet (`html` est en `scroll-behavior: smooth` : sans `instant`, le
  // Chromium de la CI animait le retour à la position au lieu de la rendre).
  useEffect(() => {
    const precedent = avant.current;
    avant.current = idOuvert;
    if (precedent === idOuvert || typeof window === "undefined") return;
    const large = window.matchMedia?.(LARGE).matches ?? false;
    if (!large && idOuvert) window.scrollTo({ top: 0, behavior: "instant" });
    if (!large && !idOuvert && precedent) {
      const y = Number(lire(CLE_POSITION) ?? NaN);
      ecrire(CLE_POSITION, null);
      if (Number.isFinite(y)) window.requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "instant" }));
    }
    if (focusDemande.current) {
      focusDemande.current = false;
      titreDetail.current?.focus({ preventScroll: !large });
    }
  }, [idOuvert]);

  if (status === "unauthenticated") {
    return (
      <CarteEtat titre="Connecte-toi pour retrouver tes pépites">
        <Link href={buildLoginUrl({ callbackUrl: "/favoris" })} className={BOUTON}>
          Se connecter
        </Link>
      </CarteEtat>
    );
  }

  // s21 (QA M2) : plan lu dans la session, pas seulement dans le store (vide hors /profil).
  if (!estPremium) {
    return (
      <CarteEtat titre="Les favoris sont réservés aux membres Premium" texte="Passe à l’offre complète pour sauvegarder tes vannes, conseils et vidéos préférés.">
        {/* s21 (revue v2 m-1) : source `favoris`, suivie jusqu'à `checkout-ouvert` ; retour ici après paiement. */}
        <Link href={buildAbonnementUrl("/favoris", "monthly", "favoris")} className={BOUTON}>
          {libelleToutOuvrir()}
        </Link>
        <Reassurance className="text-left" />
      </CarteEtat>
    );
  }

  if (isLoading && favorites.length === 0) {
    return (
      <div className={GRILLE_LISTE_DETAIL} aria-busy="true">
        <div className="hidden h-64 animate-pulse rounded-xl bg-background-card lg:block" />
        <div className="h-64 animate-pulse rounded-xl bg-background-card" />
      </div>
    );
  }

  if (favorites.length === 0) {
    const vide = TABS[0];
    return (
      <CarteEtat titre={vide.emptyTitle} texte={vide.emptyDesc}>
        <Link href={vide.ctaHref} className={BOUTON}>
          {vide.ctaLabel}
        </Link>
      </CarteEtat>
    );
  }

  const ouvrir = () => {
    focusDemande.current = true;
    ecrire(CLE_POSITION, String(window.scrollY));
  };
  const retirer = async (id: string) => {
    const ok = await removeFavorite(id);
    if (ok && id === idOuvert) router.replace("/favoris", { scroll: false });
  };

  return (
    <div className={GRILLE_LISTE_DETAIL} data-liste-detail-favoris>
      <div className={cn(CELLULE_LISTE_COLLANTE, idOuvert ? "hidden lg:block" : "block")} data-zone="liste">
        <ListeFavoris favoris={favorites} actif={affiche?.id ?? null} titre={titre} ouvrir={ouvrir} />
      </div>
      <div className={cn("min-w-0", idOuvert ? "block" : "hidden lg:block")} data-zone="panneau">
        {idOuvert && (
          <div className="lg:hidden">
            <LienRetour
              href="/favoris"
              label={titre}
              onClick={(e) => {
                // Ouvert depuis la liste : retour navigateur (une entrée d'historique par favori), la liste retrouve sa place.
                if (lire(CLE_POSITION) === null) return;
                e.preventDefault();
                router.back();
              }}
            />
          </div>
        )}
        {affiche && <DetailFavori key={affiche.id} ref={titreDetail} fav={affiche} retirer={() => void retirer(affiche.id)} />}
      </div>
    </div>
  );
}
