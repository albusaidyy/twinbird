import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Universal Brand Asset Generator
 * 
 * Takes a master logo (JPEG, JPG, PNG, WEBP, or SVG) and derives all required website & PWA icons:
 * - /public/brand/favicons/apple-touch-icon.png (180x180)
 * - /public/brand/favicons/favicon.png (64x64)
 * - /public/brand/icon.png (512x512)
 * - /public/favicon.ico & /public/brand/favicons/favicon.ico (Multi-res 16, 32, 48)
 * - /public/icons/pwa/icon-192.png & icon-192-maskable.png
 * - /public/icons/pwa/icon-512.png & icon-512-maskable.png
 * 
 * Features:
 * - Intelligent background removal (turns solid white/near-white JPEG backgrounds into clean transparent PNGs)
 * - Anti-aliased alpha edge smoothing
 * - Auto-trimming of dead margins
 * - Optimal aspect ratio scaling with transparent padding
 * 
 * Usage:
 *   npx tsx scripts/process-brand-assets.ts [optional-path-to-image] [--keep-bg] [--threshold=238]
 */
async function generateAllAssetsFromLogo() {
  const rootDir = process.cwd();
  const args = process.argv.slice(2);
  
  const keepBg = args.includes('--keep-bg');
  const customPathArg = args.find((a) => !a.startsWith('--'));

  // 1. Determine input logo path
  let inputLogoPath: string | null = null;

  if (customPathArg) {
    inputLogoPath = path.resolve(rootDir, customPathArg);
  } else {
    // Auto-detect common master logo formats
    const candidateExtensions = ['png', 'jpeg', 'jpg', 'webp', 'svg'];
    for (const ext of candidateExtensions) {
      const candidate = path.join(rootDir, 'public', 'brand', 'logos', `logo.${ext}`);
      if (fs.existsSync(candidate)) {
        inputLogoPath = candidate;
        break;
      }
    }
  }

  if (!inputLogoPath || !fs.existsSync(inputLogoPath)) {
    console.error(`Error: Source logo not found${inputLogoPath ? ` at ${inputLogoPath}` : ''}`);
    console.error(`Please place your master logo at public/brand/logos/logo.png (or .jpeg / .jpg / .webp) or pass the path as an argument:`);
    console.error(`  npx tsx scripts/process-brand-assets.ts path/to/image.jpeg`);
    process.exit(1);
  }

  console.log(`Using source logo: ${inputLogoPath}`);

  // Ensure output directories exist
  const faviconsDir = path.join(rootDir, 'public', 'brand', 'favicons');
  const pwaDir = path.join(rootDir, 'public', 'icons', 'pwa');
  const brandDir = path.join(rootDir, 'public', 'brand');

  fs.mkdirSync(faviconsDir, { recursive: true });
  fs.mkdirSync(pwaDir, { recursive: true });
  fs.mkdirSync(brandDir, { recursive: true });

  const rawBuffer = fs.readFileSync(inputLogoPath);
  let processedBuffer: Buffer = rawBuffer;

  // 2. Intelligent Background Removal & Auto-trim
  if (!keepBg) {
    console.log('⚡ Processing image: removing solid white background & trimming margins...');
    const { data, info } = await sharp(rawBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const threshold = 238; // Threshold for near-white detection

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r >= threshold && g >= threshold && b >= threshold) {
        const minVal = Math.min(r, g, b);
        if (minVal >= 248) {
          data[i + 3] = 0; // Pure transparent
        } else {
          // Anti-aliased feathering for clean borders
          data[i + 3] = Math.round((255 - minVal) * 25.5);
        }
      }
    }

    // Convert back to PNG and trim outer transparent margins
    processedBuffer = await sharp(data, { raw: { width, height, channels } })
      .png()
      .trim()
      .toBuffer();
    
    console.log('✓ Converted background to transparent with anti-aliased edge smoothing');
  } else {
    // Just trim transparent/white margins
    processedBuffer = await sharp(rawBuffer).trim().png().toBuffer();
  }

  // 3. Helper to create padded square icon
  const createPaddedIcon = async (size: number, paddingPercent: number = 0.08) => {
    const pad = Math.round(size * paddingPercent);
    const innerSize = size - pad * 2;

    return await sharp(processedBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({
        top: pad,
        bottom: pad,
        left: pad,
        right: pad,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  };

  // 4. Generate Apple Touch Icon (180x180) & Favicon PNG (64x64)
  const appleTouchBuf = await createPaddedIcon(180, 0.06);
  fs.writeFileSync(path.join(faviconsDir, 'apple-touch-icon.png'), appleTouchBuf);
  console.log('✓ Generated apple-touch-icon.png (180x180, transparent)');

  const favicon64Buf = await createPaddedIcon(64, 0.06);
  fs.writeFileSync(path.join(faviconsDir, 'favicon.png'), favicon64Buf);
  console.log('✓ Generated favicon.png (64x64, transparent)');

  const icon512Buf = await createPaddedIcon(512, 0.06);
  fs.writeFileSync(path.join(brandDir, 'icon.png'), icon512Buf);
  console.log('✓ Generated brand/icon.png (512x512, transparent)');

  // 5. Generate Multi-resolution Favicon ICO (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoPngBuffers: Buffer[] = [];
  for (const size of icoSizes) {
    const buf = await createPaddedIcon(size, 0.04);
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
  console.log('✓ Generated favicon.ico (multi-res 16, 32, 48, transparent)');

  // 6. Generate PWA Icons (Standard Transparent & Maskable Safe-Zone)
  const pwaSizes = [192, 512];
  for (const size of pwaSizes) {
    // Standard icon
    const pwaBuf = await createPaddedIcon(size, 0.08);
    fs.writeFileSync(path.join(pwaDir, `icon-${size}.png`), pwaBuf);
    console.log(`✓ Generated icon-${size}.png (${size}x${size})`);

    // Maskable icon with 15% safe-zone margin
    const maskableBuf = await createPaddedIcon(size, 0.15);
    fs.writeFileSync(path.join(pwaDir, `icon-${size}-maskable.png`), maskableBuf);
    console.log(`✓ Generated icon-${size}-maskable.png (${size}x${size})`);
  }

  console.log('\n✨ All brand assets successfully regenerated with transparent background and auto-trimming!');
}

generateAllAssetsFromLogo().catch((err) => {
  console.error('Failed to generate brand assets:', err);
  process.exit(1);
});
