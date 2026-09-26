/**
 * Options for client-side image optimization
 */
export interface ImageOptimizationOptions {
  /**
   * Maximum allowed width in pixels.
   * Scaled down while preserving aspect ratio.
   * @default 2560
   */
  maxWidth?: number;

  /**
   * Maximum allowed height in pixels.
   * Scaled down while preserving aspect ratio.
   * @default 2560
   */
  maxHeight?: number;

  /**
   * Output WebP quality between 0.0 and 1.0.
   * 0.85 offers a sweet spot between indistinguishable visual fidelity and small file size.
   * @default 0.85
   */
  quality?: number;

  /**
   * Optional folder destination to adjust optimization rules
   * (e.g. skipping favicons or using custom constraints).
   */
  folder?: string;
}

export interface OptimizationResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  converted: boolean;
}

/**
 * Formats a file size in bytes to a human-readable string (e.g., "120 KB", "1.4 MB").
 */
export function formatFileSize(bytes?: number): string | null {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return kb >= 100 ? `${Math.round(kb)} KB` : `${kb.toFixed(1)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

/**
 * Checks if the file is eligible for WebP raster conversion.
 * Vector graphics (SVG), animated formats (GIF), and icon files (.ico) should NOT be converted.
 */
export function isOptimizableImage(file: File, folder?: string): boolean {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  // Exclude vector graphics
  if (mime === 'image/svg+xml' || name.endsWith('.svg')) {
    return false;
  }

  // Exclude animated GIFs
  if (mime === 'image/gif' || name.endsWith('.gif')) {
    return false;
  }

  // Exclude ICO favicon files
  if (
    mime === 'image/x-icon' ||
    mime === 'image/vnd.microsoft.icon' ||
    name.endsWith('.ico')
  ) {
    return false;
  }

  // If in a favicon folder and already a small icon, avoid modifying format
  if (folder?.includes('favicon') && name.endsWith('.ico')) {
    return false;
  }

  // Must be an image
  return mime.startsWith('image/') || /\.(jpe?g|png|webp|avif|bmp|tiff)$/i.test(name);
}

/**
 * Optimizes an image client-side before upload:
 * - Downscales large images to max dimensions while preserving aspect ratio.
 * - Converts to efficient WebP format at target quality.
 * - Falls back gracefully to original file on any decoding or canvas error.
 */
export async function optimizeImageToWebP(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizationResult> {
  const originalSize = file.size;

  if (typeof window === 'undefined' || !isOptimizableImage(file, options.folder)) {
    return { file, originalSize, optimizedSize: originalSize, converted: false };
  }

  const {
    maxWidth = 2560,
    maxHeight = 2560,
    quality = 0.85,
  } = options;

  try {
    let sourceWidth = 0;
    let sourceHeight = 0;
    let sourceElement: ImageBitmap | HTMLImageElement;

    // Use createImageBitmap if available (runs decoding off main thread)
    if ('createImageBitmap' in window) {
      try {
        const bitmap = await createImageBitmap(file);
        sourceWidth = bitmap.width;
        sourceHeight = bitmap.height;
        sourceElement = bitmap;
      } catch {
        // Fallback to Image element if createImageBitmap fails for the given format
        const img = await loadImageElement(file);
        sourceWidth = img.naturalWidth || img.width;
        sourceHeight = img.naturalHeight || img.height;
        sourceElement = img;
      }
    } else {
      const img = await loadImageElement(file);
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
      sourceElement = img;
    }

    if (!sourceWidth || !sourceHeight) {
      return { file, originalSize, optimizedSize: originalSize, converted: false };
    }

    // Calculate dimensions maintaining aspect ratio
    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    if (targetWidth > maxWidth || targetHeight > maxHeight) {
      const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, originalSize, optimizedSize: originalSize, converted: false };
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceElement, 0, 0, targetWidth, targetHeight);

    // Close bitmap if applicable
    if ('close' in sourceElement && typeof (sourceElement as ImageBitmap).close === 'function') {
      (sourceElement as ImageBitmap).close();
    }

    // Convert canvas to WebP Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        'image/webp',
        quality
      );
    });

    if (!blob) {
      return { file, originalSize, optimizedSize: originalSize, converted: false };
    }

    // Generate output file name with .webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const webpFileName = `${baseName}.webp`;

    const optimizedFile = new File([blob], webpFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      originalSize,
      optimizedSize: optimizedFile.size,
      converted: true,
    };
  } catch (err) {
    console.warn('Image optimization skipped due to error, proceeding with original file:', err);
    return { file, originalSize, optimizedSize: originalSize, converted: false };
  }
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
