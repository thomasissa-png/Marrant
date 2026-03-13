"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores/favorites-store";
import Link from "next/link";

type TabFilter = "ALL" | "JOKE" | "TIP" | "VIDEO";

const TABS: { value: TabFilter; label: string }[] = [
  { value: "ALL", label: "Tout" },
  { value: "JOKE", label: "Vannes" },
  { value: "TIP", label: "Conseils" },
  { value: "VIDEO", label: "Vidéos" },
];

export function FavorisList() {
  const { status } = useSession();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, fetchFavorites]);

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl" role="img" aria-label="cadenas">
            🔒
          </span>
          <p className="mt-4 text-lg font-medium text-text-primary">
            Connecte-toi pour retrouver tes p&#233;pites
          </p>
          <Link href="/login" className="mt-4">
            <Button variant="primary" size="sm">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const filtered =
    activeTab === "ALL"
      ? favorites
      : favorites.filter((f) => f.contentType === activeTab);

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-4 w-1/3 rounded bg-background-elevated" />
                <div className="mt-3 h-4 w-2/3 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <span className="text-4xl" role="img" aria-label="favoris">
              ⭐
            </span>
            <p className="mt-4 text-lg font-medium text-text-primary">
              Ton coffre-fort à vannes est vide
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Mets des vannes, conseils ou vidéos de côté, tu nous remercieras en soirée.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((fav) => (
            <Card key={fav.id}>
              <CardContent className="flex items-start justify-between pt-4">
                <div className="flex-1">
                  <Badge
                    variant={
                      fav.contentType === "JOKE"
                        ? "primary"
                        : fav.contentType === "TIP"
                        ? "secondary"
                        : "default"
                    }
                    className="mb-2"
                  >
                    {fav.contentType === "JOKE"
                      ? "Vanne"
                      : fav.contentType === "TIP"
                      ? "Conseil"
                      : "Vidéo"}
                  </Badge>
                  {fav.joke && (
                    <p className="text-text-primary">
                      {(fav.joke as { content: string }).content}
                    </p>
                  )}
                  {fav.tip && (
                    <p className="font-medium text-text-primary">
                      {(fav.tip as { title: string }).title}
                    </p>
                  )}
                  {fav.video && (
                    <p className="font-medium text-text-primary">
                      {(fav.video as { title: string }).title}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(fav.id)}
                  aria-label="Retirer des favoris"
                >
                  Retirer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
