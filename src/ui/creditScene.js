/**
 * Theatrical Film Credits Scene Component
 * Displays a clean, cinematic movie-style end credit roll after the Epilogue concludes.
 * Features elegant typography, seamless vertical scroll, cast & characters,
 * production team credits, and smooth return to the Homescreen (Main Menu).
 */

import { creditsData } from '../data/creditsData.js';

export class CreditScene {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onComplete: callbacks.onComplete || (() => {}),
      onHover: callbacks.onHover || (() => {}),
      onPlayClick: callbacks.onPlayClick || (() => {})
    };

    this.isVisible = false;
    this.normalSpeed = 0.95; // gentle cinematic movie roll
    this.fastSpeed = 3.2;
    this.scrollSpeed = this.normalSpeed;
    this.animationFrameId = null;
    this.userInteractingTimer = null;
    this.isUserInteracting = false;
    this.countdownTimer = null;
    this.countdownSeconds = 4;
    this.isFinished = false;
  }

  show(onComplete) {
    if (onComplete) {
      this.callbacks.onComplete = onComplete;
    }

    this.isVisible = true;
    this.isFinished = false;
    this.scrollSpeed = this.normalSpeed;
    this.container.classList.remove('hidden');
    this._render();
    this._initEvents();
    this._startAutoScroll();
  }

  hide() {
    this.isVisible = false;
    this._stopAutoScroll();
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.userInteractingTimer) {
      clearTimeout(this.userInteractingTimer);
      this.userInteractingTimer = null;
    }
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  _render() {
    const { gameTitle, subtitle, tagline, team, specialThanks, closingQuote } = creditsData;

    this.container.innerHTML = `
      <div id="creditsOverlay" class="fixed inset-0 z-[65] flex flex-col items-center justify-between select-none overflow-hidden bg-black text-slate-100 transition-opacity duration-1000 opacity-0">
        
        <!-- 1. Pure Theatrical Deep Black Background with faint starry vignette -->
        <div class="absolute inset-0 z-0 bg-black pointer-events-none"></div>

        <!-- 2. Minimalist Film HUD (Top Bar) -->
        <header class="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-8 py-3 sm:py-4 pt-safe flex items-center justify-between pointer-events-auto opacity-70 hover:opacity-100 transition-opacity duration-300">
          <div class="flex items-center gap-2">
            <img src="asset/items/butterfly_brooch.png" alt="Emblem" class="w-5 h-5 object-contain opacity-80" />
            <span class="text-[11px] font-cinzel font-medium tracking-[0.25em] text-slate-400 uppercase hidden sm:inline">Theatrical Credits</span>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <button id="btnToggleFastForward" class="px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/40 text-slate-400 hover:text-slate-200 text-xs font-mono tracking-wider transition-all cursor-pointer" title="Toggle 3x Scroll Speed">
              <span id="fastForwardText">Speed: 1x</span>
            </button>

            <button id="btnSkipCredits" class="px-3.5 sm:px-4 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/40 hover:border-pink-400/50 text-slate-300 hover:text-white text-xs font-cinzel font-semibold tracking-widest uppercase transition-all cursor-pointer flex items-center gap-1.5" title="Skip to Homescreen">
              <span>Skip</span>
              <span class="text-[10px]">&rsaquo;&rsaquo;</span>
            </button>
          </div>
        </header>

        <!-- 3. Top & Bottom Cinematic Feather Masks (Smooth edge fade) -->
        <div class="pointer-events-none absolute top-0 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-black via-black/85 to-transparent z-20"></div>
        <div class="pointer-events-none absolute bottom-0 inset-x-0 h-32 md:h-44 bg-gradient-to-t from-black via-black/85 to-transparent z-20"></div>

        <!-- 4. Clean Film Scrollable Track (No cards, no boxes, pure typography) -->
        <main id="creditsScrollContainer" class="film-credits-scroll relative z-10 w-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none px-4 sm:px-8">
          <div id="creditsTrack" class="w-full max-w-2xl mx-auto flex flex-col items-center text-center pt-32 pb-44 space-y-24">
            
            <!-- Opening Title Card -->
            <section class="space-y-4 pt-12 flex flex-col items-center">
              <div class="w-16 h-16 rounded-full bg-slate-950/80 border border-pink-400/30 flex items-center justify-center shadow-[0_0_35px_rgba(244,114,182,0.3)] mb-4">
                <img src="asset/items/butterfly_brooch.png" alt="Silver Butterfly" class="w-10 h-10 object-contain filter drop-shadow-[0_0_12px_rgba(244,114,182,0.8)] animate-pulse" />
              </div>
              <h1 class="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[0.2em] uppercase leading-tight">
                ${gameTitle}
              </h1>
              <p class="font-playfair italic text-sm sm:text-base text-pink-300/80 tracking-widest">
                &ldquo;${tagline}&rdquo;
              </p>
              <p class="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-slate-500 uppercase pt-2">
                ${subtitle}
              </p>
            </section>

            <!-- Production Team List (Clean Movie Credits Typography) -->
            <section class="w-full space-y-14 sm:space-y-16">
              ${team.map((member) => `
                <div class="flex flex-col items-center">
                  <span class="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-pink-300/80 uppercase mb-2">
                    ${member.role}
                  </span>
                  <span class="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-white tracking-wider">
                    ${member.name}
                  </span>
                </div>
              `).join('')}
            </section>

            <!-- Dramatis Personae / Cast -->
            <section class="pt-8 w-full max-w-lg mx-auto space-y-6">
              <div class="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-pink-300/80 uppercase mb-4">
                DRAMATIS PERSONAE
              </div>
              <div class="grid grid-cols-2 gap-y-3 text-sm sm:text-base font-cinzel">
                <div class="text-right pr-4 text-slate-400 tracking-wider">General Joan</div>
                <div class="text-left pl-4 text-white font-medium">The Protagonist</div>
                <div class="text-right pr-4 text-slate-400 tracking-wider">Lady Aflania</div>
                <div class="text-left pl-4 text-white font-medium">The Innocent Wife</div>
                <div class="text-right pr-4 text-slate-400 tracking-wider">Lieutenant Laqquo</div>
                <div class="text-left pl-4 text-white font-medium">The Deceiver</div>
                <div class="text-right pr-4 text-slate-400 tracking-wider">Captain Cassian</div>
                <div class="text-left pl-4 text-white font-medium">The Loyal Comrade</div>
                <div class="text-right pr-4 text-slate-400 tracking-wider">Emilia</div>
                <div class="text-left pl-4 text-white font-medium">The Truthkeeper</div>
              </div>
            </section>

            <!-- Literary Inspiration & Special Recognition -->
            <section class="pt-8 space-y-4 max-w-lg mx-auto">
              <div class="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-pink-300/80 uppercase mb-2">
                SPECIAL RECOGNITION
              </div>
              <div class="space-y-2 font-cinzel">
                ${specialThanks.map((thanks) => `
                  <p class="text-sm sm:text-base text-slate-300 tracking-wider">
                    ${thanks}
                  </p>
                `).join('')}
              </div>
            </section>

            <!-- Epilogue Closing Quote -->
            <section class="pt-6 max-w-xl mx-auto px-4">
              <div class="w-16 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mx-auto mb-6"></div>
              <blockquote class="font-playfair italic text-base sm:text-lg text-slate-300 leading-relaxed">
                &ldquo;${closingQuote}&rdquo;
              </blockquote>
            </section>

            <!-- Final Movie Card: Thank You & Return to Homescreen -->
            <section id="creditsEndCard" class="pt-20 pb-16 flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
              <div class="w-16 h-16 rounded-full bg-slate-950/80 border border-pink-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(244,114,182,0.3)]">
                <img src="asset/items/butterfly_brooch.png" alt="Silver Butterfly" class="w-9 h-9 object-contain filter drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
              </div>
              
              <div class="space-y-2">
                <h2 class="font-cinzel text-2xl sm:text-3xl font-black text-white tracking-[0.25em] uppercase">
                  THANK YOU FOR PLAYING
                </h2>
                <p id="creditsCountdownNotice" class="text-xs font-mono text-slate-400 tracking-wider">
                  Returning to Homescreen in ${this.countdownSeconds}s...
                </p>
              </div>

              <!-- Instant Return Button -->
              <button id="btnReturnToTitleFromCredits" class="px-8 py-3 rounded-full font-cinzel font-bold text-xs sm:text-sm text-white tracking-widest uppercase bg-slate-900/80 hover:bg-slate-800 border border-pink-400/40 hover:border-pink-300 shadow-lg hover:shadow-pink-500/20 transition-all cursor-pointer flex items-center gap-2">
                <span>Return to Homescreen</span>
                <svg class="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </section>

          </div>
        </main>
      </div>
    `;

    // Smooth entry fade
    requestAnimationFrame(() => {
      const overlay = this.container.querySelector('#creditsOverlay');
      if (overlay) {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
      }
    });
  }

  _initEvents() {
    // Skip Credits button
    const skipBtn = this.container.querySelector('#btnSkipCredits');
    if (skipBtn) {
      skipBtn.addEventListener('mouseenter', () => this.callbacks.onHover());
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.finish();
      });
    }

    // Return to Title button on final card
    const returnBtn = this.container.querySelector('#btnReturnToTitleFromCredits');
    if (returnBtn) {
      returnBtn.addEventListener('mouseenter', () => this.callbacks.onHover());
      returnBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.finish();
      });
    }

    // Toggle Fast Forward button
    const ffBtn = this.container.querySelector('#btnToggleFastForward');
    if (ffBtn) {
      ffBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.isFastForward = !this.isFastForward;
        this.scrollSpeed = this.isFastForward ? this.fastSpeed : this.normalSpeed;
        const text = this.container.querySelector('#fastForwardText');
        if (text) text.textContent = this.isFastForward ? 'Speed: 3x' : 'Speed: 1x';
        if (this.isFastForward) {
          ffBtn.classList.add('bg-pink-950/60', 'border-pink-400/50', 'text-pink-200');
        } else {
          ffBtn.classList.remove('bg-pink-950/60', 'border-pink-400/50', 'text-pink-200');
        }
      });
    }

    // User manual scroll detection: pause auto-scroll temporarily, resume after 2.5s idle
    const scrollContainer = this.container.querySelector('#creditsScrollContainer');
    if (scrollContainer) {
      const handleUserScroll = () => {
        this.isUserInteracting = true;
        if (this.userInteractingTimer) clearTimeout(this.userInteractingTimer);
        this.userInteractingTimer = setTimeout(() => {
          this.isUserInteracting = false;
        }, 2500);

        // Check if user scrolled to bottom manually
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 30) {
          this._startCountdownNotice();
        }
      };

      scrollContainer.addEventListener('wheel', handleUserScroll, { passive: true });
      scrollContainer.addEventListener('touchmove', handleUserScroll, { passive: true });
    }

    // Keyboard ESC or Space handling
    this._keyHandler = (e) => {
      if (!this.isVisible) return;
      if (e.key === 'Escape') {
        this.finish();
      } else if (e.code === 'Space') {
        this.isFastForward = !this.isFastForward;
        this.scrollSpeed = this.isFastForward ? this.fastSpeed : this.normalSpeed;
        const ffBtn = this.container.querySelector('#btnToggleFastForward');
        const text = this.container.querySelector('#fastForwardText');
        if (text) text.textContent = this.isFastForward ? 'Speed: 3x' : 'Speed: 1x';
        if (ffBtn) {
          if (this.isFastForward) {
            ffBtn.classList.add('bg-pink-950/60', 'border-pink-400/50', 'text-pink-200');
          } else {
            ffBtn.classList.remove('bg-pink-950/60', 'border-pink-400/50', 'text-pink-200');
          }
        }
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  _startAutoScroll() {
    const scrollContainer = this.container.querySelector('#creditsScrollContainer');
    if (!scrollContainer) return;

    scrollContainer.scrollTop = 0;

    const step = () => {
      if (!this.isVisible || this.isFinished) return;

      if (!this.isUserInteracting) {
        scrollContainer.scrollTop += this.scrollSpeed;
      }

      // Check if reached the bottom of the credits
      if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 20) {
        this._startCountdownNotice();
        return;
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  _stopAutoScroll() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  _startCountdownNotice() {
    if (this.countdownTimer) return;

    this.countdownSeconds = 4;
    const notice = this.container.querySelector('#creditsCountdownNotice');
    if (notice) {
      notice.textContent = `Returning to Homescreen in ${this.countdownSeconds}s...`;
    }

    this.countdownTimer = setInterval(() => {
      this.countdownSeconds -= 1;
      if (notice) {
        notice.textContent = `Returning to Homescreen in ${this.countdownSeconds}s...`;
      }
      if (this.countdownSeconds <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.finish();
      }
    }, 1000);
  }

  finish() {
    if (this.isFinished) return;
    this.isFinished = true;
    this._stopAutoScroll();

    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    const overlay = this.container.querySelector('#creditsOverlay');
    if (overlay) {
      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');
    }

    setTimeout(() => {
      this.hide();
      this.callbacks.onComplete();
    }, 700);
  }
}

export default CreditScene;
