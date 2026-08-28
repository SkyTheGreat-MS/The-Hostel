import mainMenuJpg from '@/assets/main_menu.jpg';

export const DEFAULT_BACKGROUND_JPG: string = mainMenuJpg;

/**
 * Resolves a background image URL from the assets folder.
 * Supports:
 * - Simple filenames: "main_menu.jpg", "chapter_1.jpg", "chapter_select.jpg"
 * - Asset URLs: "/assets/main_menu.jpg", "assets/chapter_1.jpg"
 * - Full URLs or data URIs
 */
export function getAssetBackground(imagePath?: string): string {
  if (!imagePath) {
    return DEFAULT_BACKGROUND_JPG;
  }

  if (
    imagePath.startsWith('data:') ||
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  const cleanName = imagePath.replace(/^\/?(assets\/)?/, '').trim();
  if (!cleanName || cleanName === 'main_menu.jpg') {
    return DEFAULT_BACKGROUND_JPG;
  }

  // Returns URL referencing the asset route
  return `/assets/${cleanName}`;
}
