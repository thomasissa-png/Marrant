import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'apps', 'web', 'public');

async function generate() {
  // LinkedIn company banner: 1128x191
  const bannerSvg = readFileSync(join(publicDir, 'linkedin-banner.svg'));
  await sharp(bannerSvg)
    .resize(1128, 191)
    .png({ quality: 95 })
    .toFile(join(publicDir, 'linkedin-banner.png'));
  console.log('✓ linkedin-banner.png (1128x191)');
}

generate().catch(console.error);
