#!/bin/bash
set -e
# Synchronise le schéma AVANT le seed. Sinon le seed écrit des colonnes
# (ex Joke.comedyTechnique, ajoutée s10) absentes de la DB → P2022 au build.
npx prisma db push --skip-generate
npx esbuild prisma/seed-data.ts --bundle --platform=node --outfile=.seed-compiled.js --external:@prisma/client
node .seed-compiled.js
rm -f .seed-compiled.js
