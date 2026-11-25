/**
 * DDLC Main Menu / Title Screen Component
 * Renders the authentic DDLC title screen with animated polka-dot background,
 * decorative overlay, character ensemble artwork, game logo, and title navigation buttons:
 * - New game
 * - Load game
 * - Save game
 * - Options
 * - Exit
 */

export class MainMenu {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onNewGame: callbacks.onNewGame || (() => {}),
      onContinue: callbacks.onContinue || (() => {}),
      onLoadGame: callbacks.onLoadGame || (() => {}),
      onSaveGame: callbacks.onSaveGame || (() => {}),
      onOpenGallery: callbacks.onOpenGallery || (() => {}),
      onOptions: callbacks.onOptions || (() => {}),
      onExit: callbacks.onExit || (() => {}),
      onToggleAudio: callbacks.onToggleAudio || (() => {}),
      onHover: callbacks.onHover || (() => {}),
      onPlayClick: callbacks.onPlayClick || (() => {})
    };
    this.isVisible = true;
    this.autoSaveData = null;
    this.unlockedEndings = [];
    this.isMuted = false;
    this._initParallax();
  }

  _initParallax() {
    window.addEventListener('mousemove', (e) => {
      if (this.isVisible && window.innerWidth >= 768) {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        const joanContainer = this.container.querySelector('#titleJoanContainer');
        if (joanContainer) {
          joanContainer.style.transform = `translate(${normX * 18}px, ${normY * 12}px)`;
        }
      }
    });
  }

  show(autoSaveData = null, unlockedEndings = []) {
    this.isVisible = true;
    this.autoSaveData = autoSaveData;
    this.unlockedEndings = unlockedEndings;
    this.container.classList.remove('hidden');
    this._render();
  }

  hide() {
    this.isVisible = false;
    const videoEl = this.container.querySelector('#mainMenuVideoBg');
    if (videoEl) {
      try {
        videoEl.pause();
        videoEl.muted = true;
      } catch (err) {}
    }
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  _render() {
    const unlockedCount = this.unlockedEndings ? this.unlockedEndings.length : 0;

    this.container.innerHTML = `
      <div id="mainMenuScreen" class="relative w-screen h-[100dvh] max-h-[100dvh] overflow-y-auto custom-scrollbar select-none bg-slate-950 flex flex-col justify-between p-3 sm:p-6 md:p-8 lg:p-10 pt-safe pb-safe pl-safe pr-safe">
        <!-- 1. Background Video from Backgrounds/homescreen.mp4 (Plays Video Audio on Homescreen) -->
        <video id="mainMenuVideoBg" autoplay loop playsinline class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none">
          <source src="Backgrounds/homescreen.mp4" type="video/mp4">
          <source src="asset/background/homescreen.mp4" type="video/mp4">
        </video>

        <!-- 2. Dark Atmospheric Gradient & Shading (Ensures Pristine UI Readability on Left) -->
        <div class="absolute inset-0 z-5 pointer-events-none bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent w-full md:w-[62vw]"></div>
        <div class="absolute inset-0 z-5 pointer-events-none bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40"></div>

        <!-- 3. Top Row Header (Logo, Title, and Audio Toggle) -->
        <div class="relative z-20 w-full flex items-start justify-between gap-3 sm:gap-4">
          <!-- Top-Left Branding & Title -->
          <div class="flex flex-col items-start max-w-xl select-none">
            <div class="flex items-center gap-2 sm:gap-2.5">
              <img src="asset/items/butterfly_brooch.png" alt="Silver Butterfly" class="w-7 h-7 sm:w-10 sm:h-10 object-contain filter drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] animate-pulse" />
              <div class="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-pink-950/75 border border-pink-400/40 backdrop-blur-md shadow-md">
                <span class="text-[9px] sm:text-xs font-cinzel font-bold text-pink-200 tracking-wider uppercase">Psychological Drama • Dark Fantasy</span>
              </div>
            </div>

            <h1 class="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] leading-tight tracking-wide mt-2 sm:mt-2.5">
              YET THE BUTTERFLIES<br/>FLUTTER AWAY
            </h1>
            <p class="font-playfair italic text-[11px] sm:text-xs md:text-sm text-pink-200/90 max-w-md drop-shadow mt-0.5">
              "The deeper the love, the greater the betrayal."
            </p>
          </div>

          <!-- Top Right Title Audio Mute/Unmute Button -->
          <div class="flex-shrink-0">
            <button id="btnTitleMute" class="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 border border-pink-400/50 backdrop-blur-md text-pink-200 hover:text-white flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-lg hover:shadow-pink-500/20 cursor-pointer" title="Toggle Sound">
              <svg id="titleAudioIconOn" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
              </svg>
              <svg id="titleAudioIconOff" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
              </svg>
              <span id="titleAudioText" class="hidden sm:inline font-mono">Sound: ON</span>
            </button>
          </div>
        </div>

        <!-- 4. Interactive Navigation Buttons (Flex-contained to prevent any cutoff) -->
        <div class="relative z-20 flex flex-col items-start gap-1.5 sm:gap-2 md:gap-2.5 my-auto py-1 sm:py-2">
          <!-- 1. New Game -->
          <button class="main-menu-btn ddlc-title-btn text-sm sm:text-base md:text-lg lg:text-xl" data-action="new_game">
            <span>New Game</span>
          </button>

          <!-- 2. Load Game -->
          <button class="main-menu-btn ddlc-title-btn text-sm sm:text-base md:text-lg lg:text-xl" data-action="load_game">
            <span>Load Game</span>
          </button>

          <!-- 3. Settings -->
          <button class="main-menu-btn ddlc-title-btn text-sm sm:text-base md:text-lg lg:text-xl" data-action="options">
            <span>Settings</span>
          </button>

          <!-- 4. Help / Endings Gallery -->
          <button class="main-menu-btn ddlc-title-btn text-sm sm:text-base md:text-lg lg:text-xl flex items-center" data-action="endings_gallery">
            <span>Help</span>
            <span class="ml-2 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300 shadow-sm">
              ${unlockedCount}/5 Endings
            </span>
          </button>

          <!-- 5. Quit -->
          <button class="main-menu-btn ddlc-title-btn text-sm sm:text-base md:text-lg lg:text-xl hover:!text-red-600" data-action="exit">
            <span>Quit</span>
          </button>
        </div>

        <!-- 5. Bottom Footer -->
        <div class="relative z-20 w-full flex items-center justify-between text-[10px] sm:text-[11px] text-pink-200/60 font-mono tracking-wider pointer-events-none select-none drop-shadow pt-2">
          <span>Interactive Psychological Fiction</span>
          <span>v1.0.0 • Yet the Butterflies Flutter Away</span>
        </div>
      </div>
    `;

    // Video audio playback and browser autoplay handling
    const videoEl = this.container.querySelector('#mainMenuVideoBg');
    if (videoEl) {
      videoEl.muted = this.isMuted;
      videoEl.volume = 0.85;

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.updateAudioStatus(videoEl.muted);
        }).catch(() => {
          // Browser autoplay restriction: start muted, unlock sound on first user gesture
          videoEl.muted = true;
          this.updateAudioStatus(true);
          videoEl.play().catch(() => {});

          const unlockAudio = () => {
            if (!this.isMuted && videoEl) {
              videoEl.muted = false;
              this.updateAudioStatus(false);
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('pointerdown', unlockAudio);
          };
          window.addEventListener('click', unlockAudio, { once: true });
          window.addEventListener('keydown', unlockAudio, { once: true });
          window.addEventListener('touchstart', unlockAudio, { once: true });
          window.addEventListener('pointerdown', unlockAudio, { once: true });
        });
      }
    }

    // Event listeners for buttons
    const buttons = this.container.querySelectorAll('.main-menu-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => this.callbacks.onHover());
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        if (action === 'no_save') return;

        this.callbacks.onPlayClick();
        switch (action) {
          case 'new_game':
            this.callbacks.onNewGame();
            break;
          case 'continue_game':
            this.callbacks.onContinue();
            break;
          case 'endings_gallery':
            this.callbacks.onOpenGallery();
            break;
          case 'load_game':
            this.callbacks.onLoadGame();
            break;
          case 'save_game':
            this.callbacks.onSaveGame();
            break;
          case 'options':
            this.callbacks.onOptions();
            break;
          case 'exit':
            this.callbacks.onExit();
            break;
        }
      });
    });

    // Title screen audio mute/unmute toggle (controls the video audio directly)
    const titleMuteBtn = this.container.querySelector('#btnTitleMute');
    if (titleMuteBtn) {
      titleMuteBtn.addEventListener('mouseenter', () => this.callbacks.onHover());
      titleMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isMuted = !this.isMuted;
        if (videoEl) {
          videoEl.muted = this.isMuted;
          if (!this.isMuted && videoEl.paused) {
            videoEl.play().catch(() => {});
          }
        }
        if (this.callbacks.onToggleAudio) {
          this.callbacks.onToggleAudio(this.isMuted);
        }
        this.updateAudioStatus(this.isMuted);
      });
    }
  }

  updateAudioStatus(isMuted) {
    this.isMuted = isMuted;
    const videoEl = this.container.querySelector('#mainMenuVideoBg');
    if (videoEl) {
      videoEl.muted = isMuted;
    }
    const iconOn = this.container.querySelector('#titleAudioIconOn');
    const iconOff = this.container.querySelector('#titleAudioIconOff');
    const text = this.container.querySelector('#titleAudioText');
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

export default MainMenu;

