import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Universal Brand Asset Generator
 * 
 * Takes a master logo (JPEG, JPG, PNG, WEBP, or SVG) and derives all required website & PWA icons:
 * - Master Logos:
 *   - /public/brand/logos/logo.png (Transparent master PNG with dark text for light headers / Navbar)
 *   - /public/brand/logos/logo.svg (SVG vector wrapper for light logo)
 *   - /public/brand/logos/logo-white.png & logo-dark.png (Transparent master PNG with white text for dark footers / dark mode)
 *   - /public/brand/logos/logo-white.svg & logo-dark.svg (SVG vector wrappers for dark logo)
 * 
 * - Favicons & PWA Icons (ISOLATED SYMBOL ONLY - Wing Mark):
 *   - /public/brand/favicons/apple-touch-icon.png (180x180)
 *   - /public/brand/favicons/favicon.png (64x64)
 *   - /public/brand/icon.png (512x512)
 *   - /public/favicon.ico & /public/brand/favicons/favicon.ico (Multi-res 16, 32, 48)
 *   - /public/icons/pwa/icon-192.png & icon-192-maskable.png
 *   - /public/icons/pwa/icon-512.png & icon-512-maskable.png
 * 
 * Features:
 * - Studio-grade super-sampled anti-aliasing with Lanczos3 interpolation (zero noise/pixelation)
 * - Pure isolated brand symbol extraction for ultra-sharp, recognizable browser tabs & app icons
 * - Light (black text) and Dark (white text) full logo generation
 * - Auto-trimming of dead margins
 * 
 * Usage:
 *   npx tsx scripts/process-brand-assets.ts [optional-path-to-image] [--keep-bg]
 */
async function generateAllAssetsFromLogo() {
  const rootDir = process.cwd();
  const args = process.argv.slice(2);
  
  const keepBg = args.includes('--keep-bg');
  const customPathArg = args.find((a) => !a.startsWith('--'));

  const logosDir = path.join(rootDir, 'public', 'brand', 'logos');
  const faviconsDir = path.join(rootDir, 'public', 'brand', 'favicons');
  const pwaDir = path.join(rootDir, 'public', 'icons', 'pwa');
  const brandDir = path.join(rootDir, 'public', 'brand');

  fs.mkdirSync(logosDir, { recursive: true });
  fs.mkdirSync(faviconsDir, { recursive: true });
  fs.mkdirSync(pwaDir, { recursive: true });
  fs.mkdirSync(brandDir, { recursive: true });

  // 1. Determine input logo path
  let inputLogoPath: string | null = null;

  if (customPathArg) {
    inputLogoPath = path.resolve(rootDir, customPathArg);
  } else {
    // Look for master raw source files first (jpeg, jpg, png, webp) before svg wrapper
    const candidateExtensions = ['jpeg', 'jpg', 'png', 'webp', 'svg'];
    let latestTime = 0;

    for (const ext of candidateExtensions) {
      const candidate = path.join(logosDir, `logo.${ext}`);
      if (fs.existsSync(candidate)) {
        const stats = fs.statSync(candidate);
        // Prioritize non-svg source files if modified within a reasonable window
        const score = stats.mtimeMs + (ext !== 'svg' && ext !== 'png' ? 1000000000 : 0);
        if (score > latestTime) {
          latestTime = score;
          inputLogoPath = candidate;
        }
      }
    }
  }

  if (!inputLogoPath || !fs.existsSync(inputLogoPath)) {
    console.error(`Error: Source logo not found${inputLogoPath ? ` at ${inputLogoPath}` : ''}`);
    console.error(`Please place your master logo at public/brand/logos/logo.jpeg (or .png / .jpg / .webp) or pass the path as an argument:`);
    console.error(`  npx tsx scripts/process-brand-assets.ts path/to/image.jpeg`);
    process.exit(1);
  }

  console.log(`Using source logo: ${inputLogoPath}`);

  const rawBuffer = fs.readFileSync(inputLogoPath);
  let processedLightBuffer: Buffer;
  let processedDarkBuffer: Buffer;
  let isolatedSymbolBuffer: Buffer;

  // 2. Intelligent Background Removal & Smooth Anti-Aliasing
  if (!keepBg) {
    console.log('⚡ Processing image: super-sampling and generating smooth light & dark logo variants...');

    // Upscale to 1500x1500 with Lanczos3 for subpixel edge fidelity and noise elimination
    const upscaled = await sharp(rawBuffer)
      .resize(1500, 1500, { fit: 'inside', kernel: 'lanczos3' })
      .toBuffer();

    const { data, info } = await sharp(upscaled)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;
    const scale = width / 500; // Reference scale relative to 500x500 master canvas

    const lightData = Buffer.alloc(width * height * 4);
    const darkData = Buffer.alloc(width * height * 4);
    const symbolData = Buffer.alloc(width * height * 4);

    for (let y = 0; y < height; y++) {
      const origY = y / scale;
      for (let x = 0; x < width; x++) {
        const origX = x / scale;
        const i = (y * width + x) * 4;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Color detection for vibrant brand wing elements
        const isGreen = (g > 75 && g > r * 1.15 && g > b * 1.15) || (g > 95 && g > r && g > b + 20);
        const isRed = (r > 75 && r > g * 1.25 && r > b * 1.25) || (r > 95 && r > g + 20 && r > b + 20);

        // Check if pixel belongs to the bottom curved wing feathers
        const isBottomFeather = (
          (origY >= 295 && origY <= 306 && origX >= 85 && origX <= 118) ||
          (origY >= 306 && origY <= 316 && origX >= 110 && origX <= 132) ||
          (origY >= 316 && origY <= 326 && origX >= 130 && origX <= 145) ||
          (origY >= 326 && origY <= 336 && origX >= 142 && origX <= 156)
        );

        // Check if pixel belongs to the symbol (isolated wing mark)
        const isPartOfSymbol = ((isGreen || isRed) && origX < 140 && origY < 310) || isBottomFeather;

        if (isGreen || isRed) {
          let alpha = 255;
          if (lum > 175) {
            const t = Math.max(0, Math.min(1, (246 - lum) / (246 - 175)));
            alpha = Math.round(t * t * (3 - 2 * t) * 255);
          }
          lightData[i] = r; lightData[i+1] = g; lightData[i+2] = b; lightData[i+3] = alpha;
          darkData[i] = r;  darkData[i+1] = g;  darkData[i+2] = b;  darkData[i+3] = alpha;

          if (isPartOfSymbol) {
            symbolData[i] = r; symbolData[i+1] = g; symbolData[i+2] = b; symbolData[i+3] = alpha;
          }
        } else {
          // Text & dark details (TWINBIRD, TRAVEL AGENCY, slogan, lower dark feathers)
          let alpha = 0;
          if (lum < 238) {
            const normalized = Math.max(0, Math.min(1, (238 - lum) / (238 - 45)));
            const smooth = normalized * normalized * (3 - 2 * normalized);
            alpha = Math.round(smooth * 255);
          }

          // Light variant (Black text for light backgrounds)
          lightData[i] = 0;
          lightData[i + 1] = 0;
          lightData[i + 2] = 0;
          lightData[i + 3] = alpha;

          // Dark variant (White text for dark backgrounds)
          darkData[i] = 255;
          darkData[i + 1] = 255;
          darkData[i + 2] = 255;
          darkData[i + 3] = alpha;

          if (isPartOfSymbol) {
            symbolData[i] = 20;
            symbolData[i + 1] = 20;
            symbolData[i + 2] = 20;
            symbolData[i + 3] = alpha;
          }
        }
      }
    }

    processedLightBuffer = await sharp(lightData, { raw: { width, height, channels: 4 } })
      .trim()
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    processedDarkBuffer = await sharp(darkData, { raw: { width, height, channels: 4 } })
      .trim()
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    isolatedSymbolBuffer = await sharp(symbolData, { raw: { width, height, channels: 4 } })
      .trim()
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    console.log('✓ Generated smooth anti-aliased light logo, dark logo, and isolated symbol buffers');
  } else {
    processedLightBuffer = await sharp(rawBuffer).trim().png().toBuffer();
    processedDarkBuffer = processedLightBuffer;
    isolatedSymbolBuffer = processedLightBuffer;
  }

  // 3. Save Master Logos (Light & Dark Variants)
  fs.writeFileSync(path.join(logosDir, 'logo.png'), processedLightBuffer);
  console.log('✓ Updated light master logo: public/brand/logos/logo.png');

  fs.writeFileSync(path.join(logosDir, 'logo-white.png'), processedDarkBuffer);
  fs.writeFileSync(path.join(logosDir, 'logo-dark.png'), processedDarkBuffer);
  console.log('✓ Updated dark master logo: public/brand/logos/logo-white.png & logo-dark.png');

  // Generate SVG Wrappers
  const lightMeta = await sharp(processedLightBuffer).metadata();
  const lWidth = lightMeta.width || 500;
  const lHeight = lightMeta.height || 500;
  const lBase64 = processedLightBuffer.toString('base64');
  const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lWidth} ${lHeight}" width="100%" height="100%">
  <image href="data:image/png;base64,${lBase64}" width="${lWidth}" height="${lHeight}" />
</svg>
`;
  fs.writeFileSync(path.join(logosDir, 'logo.svg'), lightSvg);

  const darkMeta = await sharp(processedDarkBuffer).metadata();
  const dWidth = darkMeta.width || 500;
  const dHeight = darkMeta.height || 500;
  const dBase64 = processedDarkBuffer.toString('base64');
  const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dWidth} ${dHeight}" width="100%" height="100%">
  <image href="data:image/png;base64,${dBase64}" width="${dWidth}" height="${dHeight}" />
</svg>
`;
  fs.writeFileSync(path.join(logosDir, 'logo-white.svg'), darkSvg);
  fs.writeFileSync(path.join(logosDir, 'logo-dark.svg'), darkSvg);
  console.log('✓ Updated master SVGs: logo.svg, logo-white.svg, logo-dark.svg');

  // Save isolated symbol master
  fs.writeFileSync(path.join(logosDir, 'symbol.png'), isolatedSymbolBuffer);
  console.log('✓ Saved isolated symbol: public/brand/logos/symbol.png');

  // 4. Helper to create padded square icon from isolated symbol
  const createPaddedSymbolIcon = async (size: number, paddingPercent: number = 0.08) => {
    const pad = Math.round(size * paddingPercent);
    const innerSize = size - pad * 2;

    return await sharp(isolatedSymbolBuffer)
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

  // 5. Generate Apple Touch Icon (180x180) & Favicon PNG (64x64) & Brand Icon (512x512)
  const appleTouchBuf = await createPaddedSymbolIcon(180, 0.08);
  fs.writeFileSync(path.join(faviconsDir, 'apple-touch-icon.png'), appleTouchBuf);
  console.log('✓ Generated apple-touch-icon.png (180x180, symbol only)');

  const favicon64Buf = await createPaddedSymbolIcon(64, 0.06);
  fs.writeFileSync(path.join(faviconsDir, 'favicon.png'), favicon64Buf);
  console.log('✓ Generated favicon.png (64x64, symbol only)');

  const icon512Buf = await createPaddedSymbolIcon(512, 0.08);
  fs.writeFileSync(path.join(brandDir, 'icon.png'), icon512Buf);
  console.log('✓ Generated brand/icon.png (512x512, symbol only)');

  // 6. Generate Multi-resolution Favicon ICO (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoPngBuffers: Buffer[] = [];
  for (const size of icoSizes) {
    const buf = await createPaddedSymbolIcon(size, 0.04);
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
  console.log('✓ Generated favicon.ico (multi-res 16, 32, 48, symbol only)');

  // 7. Generate PWA Icons (Standard Transparent & Maskable Safe-Zone)
  const pwaSizes = [192, 512];
  for (const size of pwaSizes) {
    // Standard icon
    const pwaBuf = await createPaddedSymbolIcon(size, 0.08);
    fs.writeFileSync(path.join(pwaDir, `icon-${size}.png`), pwaBuf);
    console.log(`✓ Generated icon-${size}.png (${size}x${size}, symbol only)`);

    // Maskable icon with 15% safe-zone margin
    const maskableBuf = await createPaddedSymbolIcon(size, 0.15);
    fs.writeFileSync(path.join(pwaDir, `icon-${size}-maskable.png`), maskableBuf);
    console.log(`✓ Generated icon-${size}-maskable.png (${size}x${size}, symbol only)`);
  }

  console.log('\n✨ All brand assets, light/dark master logos, SVGs, and symbol-only favicons successfully generated!');
}

generateAllAssetsFromLogo().catch((err) => {
  console.error('Failed to generate brand assets:', err);
  process.exit(1);
});
