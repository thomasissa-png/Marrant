"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEXTES_EQUIPE_ETATS as E, TEXTES_EQUIPE_PAGE as T } from "@/config/textes/equipe-questions";

export default function TaQuestionError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="font-display text-xl font-bold text-text-primary">{T.titre}</h2>
          <p className="mt-2 text-sm text-text-secondary">{E.erreurServeur}</p>
          <Button className="mt-6" variant="primary" size="sm" onClick={reset}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
