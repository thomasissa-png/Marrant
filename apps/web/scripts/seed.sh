#!/bin/bash
set -e
npx esbuild prisma/seed.ts --bundle --platform=node --outfile=.seed-compiled.js --external:@prisma/client
node .seed-compiled.js
rm -f .seed-compiled.js
