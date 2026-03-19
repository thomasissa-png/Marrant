import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'apps', 'web', 'public');

async function generate() {
  // Twitter banner: 1500x500
  const bannerSvg = readFileSync(join(publicDir, 'twitter-banner.svg'));
  await sharp(bannerSvg)
    .resize(1500, 500)
    .png({ quality: 95 })
    .toFile(join(publicDir, 'twitter-banner.png'));
  console.log('✓ twitter-banner.png (1500x500)');

  // Twitter profile: 400x400
  const profileSvg = readFileSync(join(publicDir, 'twitter-profile.svg'));
  await sharp(profileSvg)
    .resize(400, 400)
    .png({ quality: 95 })
    .toFile(join(publicDir, 'twitter-profile.png'));
  console.log('✓ twitter-profile.png (400x400)');
}

generate().catch(console.error);
