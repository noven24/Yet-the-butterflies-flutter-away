/**
 * Dramatic Ending Screen Component (DDLC Psychological Narrative Theme)
 * Displays a cinematic revelation screen for Endings A, B, C, D, and E
 * with fullscreen video background from Backgrounds/ folder (Ending A.mp4, Ending B.mp4, etc.),
 * dramatic typography, reflective outcome notes, sound toggle, and a grand transition button:
 * "Continue to Epilogue: What the Tragedy Could Have Taught Him".
 */

export class EndingScreen {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onProceedToEpilogue: callbacks.onProceedToEpilogue || (() => {}),
      onHover: callbacks.onHover || (() => {}),
      onPlayClick: callbacks.onPlayClick || (() => {})
    };
    this.isVisible = false;
    this.isMuted = false;
    this._cardRevealed = false;
    this._fallbackTimer = null;
  }

  show(endingScene, onProceed) {
    if (onProceed) {
      this.callbacks.onProceedToEpilogue = onProceed;
    }
    if (this._fallbackTimer) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = null;
    }
    this._cardRevealed = false;
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this._render(endingScene);
  }

  hide() {
    if (this._fallbackTimer) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = null;
    }
    this.isVisible = false;
    const videoEl = this.container.querySelector('#endingVideoBg');
    if (videoEl) {
      try {
        videoEl.pause();
        videoEl.muted = true;
      } catch (err) {}
    }
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  _getEndingTheme(sceneId) {
    switch (sceneId) {
      case 'ending_a':
        return {
          code: 'ENDING A',
          title: 'THE TRUTH EXPOSED',
          subtitle: 'A Chance to Begin Again',
          badgeColor: 'border-pink-400 text-pink-300 bg-pink-950/60',
          glowColor: 'text-pink-200',
          accentBorder: 'border-pink-500/50',
          butterflyFilter: 'drop-shadow(0 0 25px rgba(236,72,153,0.9))',
          reflection: 'Joan placed his trust in evidence and the woman he loved. By refusing to let suspicion dictate reality, he unmasked Laqquo and gave their marriage a second chance.',
          videoSrc: 'Backgrounds/Ending A.mp4',
          videoFallbackSrc: 'asset/background/Ending A.mp4'
        };
      case 'ending_b':
        return {
          code: 'ENDING B',
          title: 'A FRAGILE PEACE',
          subtitle: 'The Lie Survives in Silence',
          badgeColor: 'border-amber-400 text-amber-300 bg-amber-950/60',
          glowColor: 'text-amber-200',
          accentBorder: 'border-amber-500/50',
          butterflyFilter: 'drop-shadow(0 0 20px rgba(245,158,11,0.7)) sepia(0.5)',
          reflection: 'Joan chose peace without addressing the manipulation that threatened it. The accusations were silenced, but the poison remained unspoken between them.',
          videoSrc: 'Backgrounds/Ending B.mp4',
          videoFallbackSrc: 'asset/background/Ending B.mp4'
        };
      case 'ending_c':
        return {
          code: 'ENDING C',
          title: 'THE MARRIAGE DESTROYED',
          subtitle: 'Jealousy Wins Without a Sword',
          badgeColor: 'border-red-500 text-red-300 bg-red-950/80',
          glowColor: 'text-red-200',
          accentBorder: 'border-red-600/70',
          butterflyFilter: 'drop-shadow(0 0 30px rgba(220,38,38,0.95)) hue-rotate(300deg)',
          reflection: 'Consumed by unfounded terror, Joan attacked the loyalty of an innocent woman. He did not lose Aflania to another man—he drove her away with his own hands.',
          videoSrc: 'Backgrounds/Ending C.mp4',
          videoFallbackSrc: 'asset/background/Ending C.mp4'
        };
      case 'ending_d':
        return {
          code: 'ENDING D',
          title: 'THE PRICE OF FORGIVENESS',
          subtitle: 'Love Does Not Guarantee Reconciliation',
          badgeColor: 'border-indigo-400 text-indigo-300 bg-indigo-950/60',
          glowColor: 'text-indigo-200',
          accentBorder: 'border-indigo-500/50',
          butterflyFilter: 'drop-shadow(0 0 20px rgba(99,102,241,0.8)) hue-rotate(220deg)',
          reflection: 'Truth came at last, but the wound was already deep. Aflania chose her own dignity over a love tainted by fear. Joan accepted that some departures are necessary.',
          videoSrc: 'Backgrounds/Ending D.mp4',
          videoFallbackSrc: 'asset/background/Ending D.mp4'
        };
      case 'ending_e':
        return {
          code: 'ENDING E',
          title: 'THE UNFINISHED APOLOGY',
          subtitle: 'Silence is Not the Same as Healing',
          badgeColor: 'border-slate-400 text-slate-300 bg-slate-950/70',
          glowColor: 'text-slate-200',
          accentBorder: 'border-slate-500/50',
          butterflyFilter: 'drop-shadow(0 0 15px rgba(148,163,184,0.6)) grayscale(0.8)',
          reflection: 'Joan mistook the absence of conflict for healing. By withholding the apology that was owed, he allowed distance to settle permanently into silence.',
          videoSrc: 'Backgrounds/Ending E.mp4',
          videoFallbackSrc: 'asset/background/Ending E.mp4'
        };
      default:
        return {
          code: 'ENDING REACHED',
          title: 'THE DESTINY RESOLVED',
          subtitle: 'Yet the Butterflies Flutter Away',
          badgeColor: 'border-pink-400 text-pink-300 bg-pink-950/60',
          glowColor: 'text-pink-200',
          accentBorder: 'border-pink-500/50',
          butterflyFilter: 'drop-shadow(0 0 20px rgba(236,72,153,0.8))',
          reflection: 'The tragic arc of General Joan and Lady Aflania has concluded.',
          videoSrc: 'Backgrounds/Ending A.mp4',
          videoFallbackSrc: 'asset/background/Ending A.mp4'
        };
    }
  }

  _render(scene) {
    const sceneId = scene ? scene.id : 'ending_a';
    const theme = this._getEndingTheme(sceneId);

    this.container.innerHTML = `
      <div id="endingBackdrop" class="ending-screen-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none overflow-hidden bg-slate-950 cursor-pointer">
        <!-- 1. Authentic Fullscreen Ending Video from Backgrounds/ (Plays once without loop) -->
        <video id="endingVideoBg" autoplay playsinline preload="auto" class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none">
          <source src="${theme.videoSrc}" type="video/mp4">
          <source src="${theme.videoFallbackSrc}" type="video/mp4">
        </video>

        <!-- 2. Subtle Cinematic Top & Bottom Edge Vignettes (Keeps controls legible while preserving video clarity) -->
        <div class="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none z-[4]"></div>
        <div class="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none z-[4]"></div>

        <!-- 3. Dark Atmospheric Glass Overlay (Smoothly fades in when video finishes to spotlight the outcome card) -->
        <div id="endingDarkOverlay" class="absolute inset-0 z-[5] bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/85 pointer-events-none opacity-0 transition-opacity duration-700"></div>

        <!-- 4. Top Left Skip Video Button -->
        <div class="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pt-safe pl-safe">
          <button id="btnSkipEndingVideo" class="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 backdrop-blur-md text-slate-300 hover:text-white flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-lg hover:shadow-slate-500/20 cursor-pointer" title="Skip Video to Ending Outcome">
            <span>Skip Video</span>
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <!-- 5. Top Right Audio Mute/Unmute Toggle -->
        <div class="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 pt-safe pr-safe">
          <button id="btnEndingSoundToggle" class="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 border border-pink-400/50 backdrop-blur-md text-pink-200 hover:text-white flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-lg hover:shadow-pink-500/20 cursor-pointer" title="Toggle Sound">
            <svg id="endingAudioIconOn" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
            <svg id="endingAudioIconOff" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
            <span id="endingAudioText" class="hidden sm:inline font-mono">Sound: ON</span>
          </button>
        </div>

        <!-- 6. Bottom Video Hint (Fades out when ending video finishes) -->
        <div id="endingVideoHint" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[11px] text-slate-400/80 tracking-widest uppercase font-mono pointer-events-none transition-opacity duration-500">
          Watching Ending &bull; Click screen to skip
        </div>

        <!-- 7. Center Cinematic Outcome Card (Initially hidden until video ends) -->
        <div id="endingCardContainer" class="hidden opacity-0 relative z-10 w-full max-w-2xl max-h-[92dvh] overflow-y-auto custom-scrollbar bg-slate-950/85 border ${theme.accentBorder} rounded-3xl p-4 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-xl flex flex-col items-center text-center cursor-default pointer-events-none my-auto">
          
          <!-- Decorative Top Light Beam -->
          <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-pink-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none"></div>

          <!-- Silver Butterfly Emblem -->
          <div class="relative mb-3 sm:mb-5">
            <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-slate-900/80 border ${theme.accentBorder} flex items-center justify-center shadow-xl">
              <img src="asset/items/butterfly_brooch.png" alt="Butterfly Brooch" class="w-8 h-8 sm:w-12 sm:h-12 object-contain animate-pulse" style="filter: ${theme.butterflyFilter};" />
            </div>
          </div>

          <!-- Ending Code Pill -->
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full border text-xs sm:text-sm font-cinzel font-bold tracking-widest uppercase mb-2 sm:mb-3 ${theme.badgeColor}">
            <span>${theme.code}</span>
          </div>

          <!-- Dramatic Title -->
          <h2 class="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-pink-200 ending-title-cinematic mb-1.5 sm:mb-2 leading-tight">
            ${theme.title}
          </h2>

          <!-- Dramatic Tagline -->
          <p class="font-playfair italic text-xs sm:text-base md:text-lg text-pink-300/90 ending-tagline-glow mb-4 sm:mb-6">
            "${theme.subtitle}"
          </p>

          <!-- Reflection Text Box -->
          <div class="w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 sm:p-5 mb-5 sm:mb-8 text-left shadow-inner">
            <p class="text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed text-center sm:text-left">
              ${theme.reflection}
            </p>
          </div>

          <!-- Grand Continue to Epilogue Button -->
          <button id="btnDramaticProceed" class="ending-continue-btn w-full min-h-[48px] sm:min-h-[56px] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-cinzel font-bold text-xs sm:text-base md:text-lg text-white flex items-center justify-center gap-2 sm:gap-3 group tracking-wider shadow-2xl cursor-pointer pointer-events-auto">
            <span>Continue to Epilogue: What the Tragedy Could Have Taught Him</span>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-pink-300 group-hover:translate-x-1.5 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Backdrop click: clicking anywhere while watching video reveals the card immediately
    const backdrop = this.container.querySelector('#endingBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target.closest('#btnEndingSoundToggle') || e.target.closest('#btnSkipEndingVideo') || e.target.closest('#endingCardContainer')) {
          return;
        }
        if (!this._cardRevealed) {
          this._revealCard();
        }
      });
    }

    // Skip video button
    const skipBtn = this.container.querySelector('#btnSkipEndingVideo');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this._revealCard();
      });
    }

    // Video audio playback, completion handler, and browser autoplay handling
    const videoEl = this.container.querySelector('#endingVideoBg');
    if (videoEl) {
      videoEl.muted = this.isMuted;
      videoEl.volume = 0.85;

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this._updateAudioStatus(videoEl.muted);
        }).catch(() => {
          // Autoplay policy fallback: start muted, unlock on interaction
          videoEl.muted = true;
          this._updateAudioStatus(true);
          videoEl.play().catch(() => {
            // If video playback fails, reveal card directly
            this._revealCard();
          });
        });
      }

      // When the ending video finishes playing (no loop), reveal the continue prompt & card!
      videoEl.addEventListener('ended', () => {
        this._revealCard();
      });

      // Video load error fallback
      videoEl.addEventListener('error', () => {
        this._revealCard();
      });

      // Fallback safety timeout (25 seconds) to ensure player never gets stuck
      this._fallbackTimer = setTimeout(() => {
        this._revealCard();
      }, 25000);
    } else {
      this._revealCard();
    }

    // Sound toggle event
    const soundBtn = this.container.querySelector('#btnEndingSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.isMuted = !this.isMuted;
        if (videoEl) {
          videoEl.muted = this.isMuted;
          if (!this.isMuted && videoEl.paused && !this._cardRevealed) {
            videoEl.play().catch(() => {});
          }
        }
        this._updateAudioStatus(this.isMuted);
      });
    }

    // Proceed to Epilogue event
    const proceedBtn = this.container.querySelector('#btnDramaticProceed');
    if (proceedBtn) {
      proceedBtn.addEventListener('mouseenter', () => this.callbacks.onHover());
      proceedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.hide();
        this.callbacks.onProceedToEpilogue();
      });
    }
  }

  _revealCard() {
    if (this._cardRevealed) return;
    this._cardRevealed = true;

    if (this._fallbackTimer) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = null;
    }

    const backdrop = this.container.querySelector('#endingBackdrop');
    if (backdrop) {
      backdrop.classList.remove('cursor-pointer');
      backdrop.classList.add('cursor-default');
    }

    const hint = this.container.querySelector('#endingVideoHint');
    if (hint) {
      hint.classList.add('opacity-0');
      setTimeout(() => hint.remove(), 500);
    }

    const skipBtn = this.container.querySelector('#btnSkipEndingVideo');
    if (skipBtn) {
      skipBtn.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => skipBtn.remove(), 400);
    }

    const overlay = this.container.querySelector('#endingDarkOverlay');
    if (overlay) {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    }

    const card = this.container.querySelector('#endingCardContainer');
    if (card) {
      card.classList.remove('hidden', 'pointer-events-none');
      card.classList.add('pointer-events-auto');
      requestAnimationFrame(() => {
        card.classList.remove('opacity-0');
        card.classList.add('ending-card-reveal');
      });
    }
  }

  _updateAudioStatus(isMuted) {
    const iconOn = this.container.querySelector('#endingAudioIconOn');
    const iconOff = this.container.querySelector('#endingAudioIconOff');
    const text = this.container.querySelector('#endingAudioText');
    if (iconOn && iconOff) {
      if (isMuted) {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
        if (text) text.textContent = 'Sound: OFF';
      } else {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
        if (text) text.textContent = 'Sound: ON';
      }
    }
  }
}

export default EndingScreen;
