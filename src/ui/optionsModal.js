/**
 * DDLC Options / Settings Modal Component
 * Comprehensive visual novel options: Master, BGM, SFX volume, Text Speed, Auto Delay, Glitch FX.
 */

export class OptionsModal {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onMasterVolume: callbacks.onMasterVolume || (() => {}),
      onBgmVolume: callbacks.onBgmVolume || (() => {}),
      onSfxVolume: callbacks.onSfxVolume || (() => {}),
      onTextSpeed: callbacks.onTextSpeed || (() => {}),
      onAutoDelay: callbacks.onAutoDelay || (() => {}),
      onToggleGlitch: callbacks.onToggleGlitch || (() => {}),
      onRestart: callbacks.onRestart || (() => {}),
      onClose: callbacks.onClose || (() => {}),
      onPlayClick: callbacks.onPlayClick || (() => {})
    };
    this.isVisible = false;
  }

  show(settings = {}) {
    this.isVisible = true;

    const master = Math.round((settings.masterVolume ?? 0.6) * 100);
    const bgm = Math.round((settings.bgmVolume ?? 0.7) * 100);
    const sfx = Math.round((settings.sfxVolume ?? 0.8) * 100);
    const speed = settings.textSpeed ?? 20;
    const glitchEnabled = settings.glitchEnabled ?? true;

    this.container.innerHTML = `
      <div id="optionsOverlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
        <div class="w-full max-w-lg rounded-2xl p-6 md:p-8 relative border-2 border-pink-400/60 shadow-2xl bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-900/95 text-slate-100 max-h-[90dvh] overflow-y-auto custom-scrollbar">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-pink-500/25 mb-5">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-pink-500"></span>
              <h2 class="font-cinzel text-xl md:text-2xl font-bold text-pink-200 tracking-wider">Settings & Options</h2>
            </div>
            <button id="btnCloseOptions" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>

          <!-- Settings Sections -->
          <div class="flex flex-col gap-5 text-sm">
            <!-- 1. Audio Volumes -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col gap-3.5">
              <h3 class="font-cinzel text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                <svg class="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                </svg>
                Audio Levels
              </h3>

              <!-- Master Volume -->
              <div>
                <div class="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
                  <span>Master Volume</span>
                  <span id="txtMasterVol" class="text-pink-300 font-bold">${master}%</span>
                </div>
                <input type="range" id="sliderMaster" min="0" max="100" value="${master}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>

              <!-- BGM Volume -->
              <div>
                <div class="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
                  <span>Music (BGM) Volume</span>
                  <span id="txtBgmVol" class="text-pink-300 font-bold">${bgm}%</span>
                </div>
                <input type="range" id="sliderBgm" min="0" max="100" value="${bgm}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>

              <!-- SFX Volume -->
              <div>
                <div class="flex justify-between items-center mb-1 text-xs font-semibold text-slate-300">
                  <span>Sound Effects (SFX) Volume</span>
                  <span id="txtSfxVol" class="text-pink-300 font-bold">${sfx}%</span>
                </div>
                <input type="range" id="sliderSfx" min="0" max="100" value="${sfx}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>
            </div>

            <!-- 2. Text Speed -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col gap-2.5">
              <h3 class="font-cinzel text-xs font-bold text-pink-300 uppercase tracking-widest">Text Typing Speed</h3>
              <div class="grid grid-cols-3 gap-2 pt-1">
                <button class="opt-speed-btn px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${speed > 20 ? 'bg-pink-600 text-white border-pink-400 font-bold shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'}" data-speed="35">Normal</button>
                <button class="opt-speed-btn px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${speed <= 20 && speed > 5 ? 'bg-pink-600 text-white border-pink-400 font-bold shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'}" data-speed="18">Fast</button>
                <button class="opt-speed-btn px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${speed <= 5 ? 'bg-pink-600 text-white border-pink-400 font-bold shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'}" data-speed="0">Instant</button>
              </div>
            </div>

            <!-- 3. Psychological Horror Effects Toggle -->
            <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 class="font-semibold text-slate-200">DDLC Glitch & Jumpscares</h4>
                <p class="text-xs text-slate-400">Dynamic zoom, chromatic aberration, and screen shake</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="chkGlitch" class="sr-only peer" ${glitchEnabled ? 'checked' : ''} />
                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
              </label>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="mt-6 pt-4 border-t border-pink-500/25 flex justify-end">
            <button id="btnSaveCloseOptions" class="px-6 py-2.5 rounded-xl ddlc-choice-button font-cinzel font-bold text-sm shadow-xl">
              OK
            </button>
          </div>
        </div>
      </div>
    `;

    // Events
    const overlay = this.container.querySelector('#optionsOverlay');
    const btnClose = this.container.querySelector('#btnCloseOptions');
    const btnSaveClose = this.container.querySelector('#btnSaveCloseOptions');

    const sliderMaster = this.container.querySelector('#sliderMaster');
    const txtMasterVol = this.container.querySelector('#txtMasterVol');
    const sliderBgm = this.container.querySelector('#sliderBgm');
    const txtBgmVol = this.container.querySelector('#txtBgmVol');
    const sliderSfx = this.container.querySelector('#sliderSfx');
    const txtSfxVol = this.container.querySelector('#txtSfxVol');

    const speedBtns = this.container.querySelectorAll('.opt-speed-btn');
    const chkGlitch = this.container.querySelector('#chkGlitch');

    const dismiss = () => {
      this.callbacks.onPlayClick();
      this.hide();
      this.callbacks.onClose();
    };

    btnClose.addEventListener('click', dismiss);
    btnSaveClose.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });

    sliderMaster.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      txtMasterVol.textContent = `${v}%`;
      this.callbacks.onMasterVolume(v / 100);
    });

    sliderBgm.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      txtBgmVol.textContent = `${v}%`;
      this.callbacks.onBgmVolume(v / 100);
    });

    sliderSfx.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      txtSfxVol.textContent = `${v}%`;
      this.callbacks.onSfxVolume(v / 100);
    });

    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.callbacks.onPlayClick();
        speedBtns.forEach(b => {
          b.className = 'opt-speed-btn px-3 py-2 rounded-xl text-xs font-semibold border transition-all bg-slate-800 text-slate-300 border-slate-700';
        });
        btn.className = 'opt-speed-btn px-3 py-2 rounded-xl text-xs font-semibold border transition-all bg-pink-600 text-white border-pink-400 font-bold shadow-md';
        const s = parseInt(btn.getAttribute('data-speed'), 10);
        this.callbacks.onTextSpeed(s);
      });
    });

    chkGlitch.addEventListener('change', (e) => {
      this.callbacks.onPlayClick();
      this.callbacks.onToggleGlitch(e.target.checked);
    });
  }

  hide() {
    this.isVisible = false;
    this.container.innerHTML = '';
  }
}

export default OptionsModal;
