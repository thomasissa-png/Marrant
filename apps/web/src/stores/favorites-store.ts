"use client";

import { create } from "zustand";

interface Favorite {
  id: string;
  contentType: "JOKE" | "TIP" | "VIDEO";
  jokeId: string | null;
  tipId: string | null;
  videoId: string | null;
  createdAt: string;
  joke?: Record<string, unknown> | null;
  tip?: Record<string, unknown> | null;
  video?: Record<string, unknown> | null;
}

/** Issue d'un ajout ou d'un retrait : `erreur` est le message à afficher (texte de l'API, sinon texte existant). */
export type ResultatFavori = { ok: true } | { ok: false; erreur: string };

/** Textes existants du site (réaction, vote, paiement), réutilisés tels quels : aucun texte neuf. */
export const ERREUR_FAVORI_CONNEXION = "Connexion perdue, réessaie";
export const ERREUR_FAVORI_SERVEUR = "Pas de réponse du serveur : réessaie.";

interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  /** s27 D1 : favoris lus au moins une fois depuis le chargement de la page. */
  charges: boolean;
  fetchFavorites: () => Promise<void>;
  /**
   * s27 D1 : lecture UNE fois par chargement de page (appels simultanés partagés), demandée par chaque étoile d'un
   * abonné. Avant, seules /favoris et l'espace lisaient les favoris : sur /vannes, une vanne gardée avait l'étoile vide.
   */
  chargerUneFois: () => Promise<void>;
  addFavorite: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => Promise<ResultatFavori>;
  removeFavorite: (id: string) => Promise<boolean>;
  /** s27 D1 : retrait depuis une étoile, avec le message d'échec à afficher. */
  retirerFavori: (id: string) => Promise<ResultatFavori>;
  isFavorite: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => boolean;
  getFavoriteId: (contentType: "JOKE" | "TIP" | "VIDEO", contentId: string) => string | null;
}

/** Lecture en cours (partagée entre les étoiles d'une même page). */
let lectureEnCours: Promise<void> | null = null;

async function messageErreur(res: Response): Promise<string> {
  let data: { error?: unknown } | null = null;
  try {
    data = (await res.json()) as { error?: unknown } | null;
  } catch {
    // Corps illisible : texte existant.
  }
  // 4xx : le message de l'API est écrit pour l'abonné (« Les favoris sont réservés aux membres Premium »…) ;
  // 5xx : « Erreur serveur » est technique, texte existant du site à la place.
  return res.status < 500 && typeof data?.error === "string" ? data.error : ERREUR_FAVORI_SERVEUR;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  charges: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        set({ favorites: data.favorites, isLoading: false, charges: true });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  chargerUneFois: () => {
    if (get().charges) return Promise.resolve();
    if (!lectureEnCours) {
      lectureEnCours = get()
        .fetchFavorites()
        .finally(() => {
          lectureEnCours = null;
        });
    }
    return lectureEnCours;
  },

  addFavorite: async (contentType, contentId) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      });
      if (res.ok) {
        const data = await res.json();
        // s27 D1 : l'API renvoie le favori existant (200) s'il l'était déjà : jamais deux fois dans la liste.
        set((state) => ({
          favorites: [data.favorite, ...state.favorites.filter((f) => f.id !== data.favorite.id)],
        }));
        return { ok: true };
      }
      return { ok: false, erreur: await messageErreur(res) };
    } catch {
      return { ok: false, erreur: ERREUR_FAVORI_CONNEXION };
    }
  },

  removeFavorite: async (id) => (await get().retirerFavori(id)).ok,

  retirerFavori: async (id) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      // s27 D1 : 404, déjà retiré (autre onglet) : l'étoile suit la vérité du serveur.
      if (res.ok || res.status === 404) {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
        return { ok: true };
      }
      return { ok: false, erreur: await messageErreur(res) };
    } catch {
      return { ok: false, erreur: ERREUR_FAVORI_CONNEXION };
    }
  },

  isFavorite: (contentType, contentId) => {
    const { favorites } = get();
    return favorites.some((f) => {
      if (f.contentType !== contentType) return false;
      if (contentType === "JOKE") return f.jokeId === contentId;
      if (contentType === "TIP") return f.tipId === contentId;
      if (contentType === "VIDEO") return f.videoId === contentId;
      return false;
    });
  },

  getFavoriteId: (contentType, contentId) => {
    const { favorites } = get();
    const fav = favorites.find((f) => {
      if (f.contentType !== contentType) return false;
      if (contentType === "JOKE") return f.jokeId === contentId;
      if (contentType === "TIP") return f.tipId === contentId;
      if (contentType === "VIDEO") return f.videoId === contentId;
      return false;
    });
    return fav?.id ?? null;
  },
}));
