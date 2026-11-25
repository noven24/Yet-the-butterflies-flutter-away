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

    // Make container visible and activate pointer events
    this.container.style.pointerEvents = 'auto';
    this.container.style.opacity = '1';
    this.container.style.backgroundColor = '#030712'; // Deepest midnight black

    // Play subtle brooch shimmer or chime
    if (this.callbacks.onPlayChime) {
      try {
        this.callbacks.onPlayChime();
      } catch (e) {}
    }

    // Allow user to click to skip immediately
    const skipPromise = new Promise(resolve => {
      this.skipResolve = resolve;
      const skipHandler = (e) => {
        e.stopPropagation();
        this.container.removeEventListener('click', skipHandler);
        resolve();
      };
      this.container.addEventListener('click', skipHandler, { once: true });
    });

    // Fade to black completes at ~450ms -> Call onMidpoint to swap scene graphics
    await this._waitOrSkip(450, skipPromise);
    if (onMidpoint) {
      try {
        onMidpoint();
      } catch (err) {
        console.error('Midpoint callback error:', err);
      }
    }

    // Keep title displayed on black screen so player can absorb the new act
    await this._waitOrSkip(1300, skipPromise);

    // Fade out to reveal new scene
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';

    await this._waitOrSkip(500, skipPromise);
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
