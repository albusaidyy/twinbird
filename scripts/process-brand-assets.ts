import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Universal Brand Asset Generator
 * 
 * Takes a single master `logo.png` and derives all required website & PWA icons:
 * - /public/brand/favicons/apple-touch-icon.png (180x180)
 * - /public/brand/favicons/favicon.png (64x64)
 * - /public/brand/icon.png (512x512)
 * - /public/favicon.ico & /public/brand/favicons/favicon.ico (Multi-res 16, 32, 48)
 * - /public/icons/pwa/icon-192.png & icon-192-maskable.png
 * - /public/icons/pwa/icon-512.png & icon-512-maskable.png
 * 
 * Usage:
 *   npx tsx scripts/process-brand-assets.ts [optional-path-to-logo.png]
 */
async function generateAllAssetsFromLogo() {
  const rootDir = process.cwd();
  
  // 1. Determine input logo path
  const customInputPath = process.argv[2];
  const inputLogoPath = customInputPath 
    ? path.resolve(rootDir, customInputPath)
    : path.join(rootDir, 'public', 'brand', 'logos', 'logo.png');

  if (!fs.existsSync(inputLogoPath)) {
    console.error(`Error: Source logo not found at ${inputLogoPath}`);
    console.error(`Please place your master logo at public/brand/logos/logo.png or pass the path as an argument.`);
    process.exit(1);
  }

  console.log(`Using source logo: ${inputLogoPath}`);

  // Ensure directories exist
  const faviconsDir = path.join(rootDir, 'public', 'brand', 'favicons');
  const pwaDir = path.join(rootDir, 'public', 'icons', 'pwa');
  const brandDir = path.join(rootDir, 'public', 'brand');

  fs.mkdirSync(faviconsDir, { recursive: true });
  fs.mkdirSync(pwaDir, { recursive: true });
  fs.mkdirSync(brandDir, { recursive: true });

  const imageBuffer = fs.readFileSync(inputLogoPath);

  // 2. Generate Apple Touch Icon & Favicon PNGs
  await sharp(imageBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(faviconsDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png (180x180)');

  await sharp(imageBuffer)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(faviconsDir, 'favicon.png'));
  console.log('✓ Generated favicon.png (64x64)');

  await sharp(imageBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(brandDir, 'icon.png'));
  console.log('✓ Generated brand/icon.png (512x512)');

  // 3. Generate Multi-resolution ICO (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoPngBuffers: Buffer[] = [];
  for (const size of icoSizes) {
    const buf = await sharp(imageBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    icoPngBuffers.push(buf);
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Image type: 1 = ICO
  icoHeader.writeUInt16LE(icoSizes.length, 4); // Number of images

  let offset = 6 + 16 * icoSizes.length;
  const directoryEntries: Buffer[] = [];

  for (let i = 0; i < icoSizes.length; i++) {
    const size = icoSizes[i];
    const pngBuf = icoPngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0); // Width
    entry.writeUInt8(size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngBuf.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset of image data
    directoryEntries.push(entry);
    offset += pngBuf.length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...directoryEntries, ...icoPngBuffers]);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(faviconsDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Generated favicon.ico (multi-res 16, 32, 48)');

  // 4. Generate PWA Icons
  const pwaSizes = [192, 512];
  for (const size of pwaSizes) {
    await sharp(imageBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(pwaDir, `icon-${size}.png`));
    console.log(`✓ Generated icon-${size}.png (${size}x${size})`);

    await sharp(imageBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(pwaDir, `icon-${size}-maskable.png`));
    console.log(`✓ Generated icon-${size}-maskable.png (${size}x${size})`);
  }

  console.log('\n✨ All brand assets successfully generated from the master logo image!');
}

generateAllAssetsFromLogo().catch((err) => {
  console.error('Failed to generate brand assets:', err);
  process.exit(1);
});
