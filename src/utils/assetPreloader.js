/**
 * Asset Preloader & In-Memory Decode Cache
 * Asynchronously preloads and decodes high-resolution visual novel backgrounds
 * and character sprites off the main thread (using img.decode()) so transitions
 * happen in 0ms with zero stutter or network latency on Vercel.
 */

const imageCache = new Map();

/**
 * Preload and decode a single image file
 * @param {string} src - Path to the image
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(src) {
  if (!src) return Promise.resolve(null);
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(null);
  }
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }

  const promise = new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const img = new Image();
    img.src = src;

    // Use modern asynchronous image decoding API
    if ('decode' in img) {
      img.decode()
        .then(() => resolve(img))
        .catch(() => {
          // If decode fails or is interrupted, fallback to onload
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
    } else {
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    }
  });

  imageCache.set(src, promise);
  return promise;
}

/**
 * Check if an image is already preloaded in memory
 * @param {string} src
 * @returns {boolean}
 */
export function isImagePreloaded(src) {
  return imageCache.has(src);
}

/**
 * High-priority prologue assets (Preloaded immediately on page load)
 */
export const PROLOGUE_ASSETS = [
  'Backgrounds/Balcony.jpg',
  'asset/character_Laqquo/Laqquo_happy.png',
  'asset/character_alfania/Alfania_happy.png',
  'asset/items/butterfly_brooch.png',
  'asset/GUI/textbox.png',
  'asset/GUI/namebox.png',
  'asset/GUI/ctc.png'
];

/**
 * Subsequent scene & ending assets (Preloaded in idle queue)
 */
export const SUBSEQUENT_ASSETS = [
  'Backgrounds/Field.jpg',
  'Backgrounds/Room.jpg',
  'asset/character_alfania/Alfania_sad.png',
  'asset/character_Laqquo/Laqquo_sad.png',
  'asset/character_cassian/cassian_happy.png',
  'asset/character_cassian/cassian_sad.png',
  'asset/character_emilia/Emilia_happy.png',
  'asset/character_emilia/Emilia_sad.png',
  'asset/GUI/textbox_monika.png',
  'asset/items/aflania_letter.png'
];

/**
 * Start staggered preloading of all game visual assets
 */
export function startAssetPreloading() {
  if (typeof window === 'undefined') return;

  // 1. Immediately preload prologue assets
  PROLOGUE_ASSETS.forEach(src => preloadImage(src));

  // 2. Queue remaining assets during browser idle time to avoid contention with title screen video
  const queueRemaining = () => {
    SUBSEQUENT_ASSETS.forEach((src, idx) => {
      setTimeout(() => {
        preloadImage(src);
      }, idx * 150);
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => queueRemaining(), { timeout: 2500 });
  } else {
    setTimeout(queueRemaining, 1000);
  }
}
