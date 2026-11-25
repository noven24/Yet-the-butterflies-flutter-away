/**
 * Cinematic Scene Transition Component
 * Renders dramatic fade-to-black interstitials displaying the chapter/scene title
 * from the original script (e.g. "PROLOGUE: A WHISPER IN THE DARK", "SCENE 1A: THE FIRST CONVERSATION",
 * through "EPILOGUE: WHAT THE TRAGEDY COULD HAVE TAUGHT HIM").
 */

export class SceneTransition {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onPlayChime: callbacks.onPlayChime || (() => {})
    };
    this.isTransitioning = false;
    this.skipResolve = null;
  }

  /**
   * Play cinematic chapter title transition
   * @param {string} sceneTitle - The exact title from script object
   * @param {Function} onMidpoint - Called when screen is completely black to update state & visual layers
   * @param {Function} onComplete - Called when fade out finishes
   */
  async play(sceneTitle, onMidpoint = () => {}, onComplete = () => {}) {
    if (!this.container) {
      onMidpoint();
      onComplete();
      return;
    }

    this.isTransitioning = true;

    // Split title into Roman/Prefix and Name if applicable (e.g., "SCENE 1A: THE FIRST CONVERSATION")
    let actLabel = 'YET THE BUTTERFLIES FLUTTER AWAY';
    let mainTitle = sceneTitle || 'NEXT CHAPTER';

    if (sceneTitle.includes(':')) {
      const parts = sceneTitle.split(':');
      actLabel = parts[0].trim();
      mainTitle = parts.slice(1).join(':').trim();
    } else if (sceneTitle.startsWith('ENDING')) {
      actLabel = 'TRAGEDY CONCLUDED';
      mainTitle = sceneTitle;
    }

    // Render Title Screen Content
    this.container.innerHTML = `
      <div id="transitionContent" class="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer">
        <!-- Floating Silver Butterfly Icon -->
        <div class="mb-5 transition-all duration-700 transform scale-95 hover:scale-105">
          <img src="asset/items/butterfly_brooch.png" alt="Silver Butterfly" class="w-12 h-12 md:w-16 md:h-16 object-contain filter drop-shadow-[0_0_20px_rgba(244,114,182,0.8)] animate-pulse" />
        </div>

        <!-- Act Label / Category -->
        <div class="mb-3">
          <span class="inline-block px-4 py-1 rounded-full bg-pink-950/70 border border-pink-400/40 text-[11px] md:text-xs font-cinzel font-bold text-pink-300 tracking-[0.25em] uppercase shadow-md">
            ${actLabel}
          </span>
        </div>

        <!-- Glowing Chapter Title -->
        <h2 class="font-cinzel text-2xl sm:text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 drop-shadow-[0_4px_16px_rgba(74,21,75,0.95)] tracking-wider max-w-3xl leading-tight mb-4">
          ${mainTitle}
        </h2>

        <!-- Decorative Divider -->
        <div class="w-24 md:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-pink-400/80 to-transparent my-2 shadow-[0_0_10px_#f472b6]"></div>

        <p class="text-[11px] font-mono text-pink-200/50 tracking-widest uppercase mt-4">
          Tap anywhere to continue
        </p>
      </div>
    `;

    // Make container visible and activate pointer events with smooth fade-in
    this.container.style.transition = 'opacity 0.4s ease-in-out';
    this.container.style.pointerEvents = 'auto';
    this.container.style.opacity = '1';
    this.container.style.backgroundColor = '#030712'; // Deepest midnight black

    // Play subtle brooch shimmer or chime
    if (this.callbacks.onPlayChime) {
      try {
        this.callbacks.onPlayChime();
      } catch (e) {}
    }

    // Step 1: Smooth fade to black (400ms) - graphics are swapped in pure black to prevent visual glitches
    await new Promise(resolve => setTimeout(resolve, 400));

    // Midpoint: Swap scene components while screen is fully black
    if (onMidpoint) {
      try {
        onMidpoint();
      } catch (err) {
        console.error('Midpoint callback error:', err);
      }
    }

    // Step 2: Display chapter title on black screen (1200ms max, with tap-to-skip)
    // Attach click listener ONLY AFTER midpoint so choice button clicks never bleed through
    await new Promise(resolve => {
      let timer = null;
      const skipHandler = (e) => {
        if (e) e.stopPropagation();
        if (timer) clearTimeout(timer);
        this.container.removeEventListener('click', skipHandler);
        resolve();
      };

      timer = setTimeout(() => {
        this.container.removeEventListener('click', skipHandler);
        resolve();
      }, 1200);

      // 100ms debounce before attaching listener to guarantee pointerup/click isolation
      setTimeout(() => {
        this.container.addEventListener('click', skipHandler, { once: true });
      }, 100);
    });

    // Step 3: Smooth fade out to reveal new scene (400ms)
    this.container.style.transition = 'opacity 0.4s ease-out';
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';

    await new Promise(resolve => setTimeout(resolve, 400));

    this.isTransitioning = false;
    this.container.innerHTML = '';
    if (onComplete) {
      onComplete();
    }
  }

  _waitOrSkip(ms, skipPromise) {
    return Promise.race([
      new Promise(resolve => setTimeout(resolve, ms)),
      skipPromise
    ]);
  }
}

export default SceneTransition;
