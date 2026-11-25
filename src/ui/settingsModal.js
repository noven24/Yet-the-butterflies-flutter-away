/**
 * DDLC Settings Modal Component
 * Audio volume controls, text speed, auto delay, and game restart.
 */

export class SettingsModal {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onVolumeChange: callbacks.onVolumeChange || (() => {}),
      onSpeedChange: callbacks.onSpeedChange || (() => {}),
      onAutoDelayChange: callbacks.onAutoDelayChange || (() => {}),
      onRestart: callbacks.onRestart || (() => {}),
      onClose: callbacks.onClose || (() => {})
    };
    this.isVisible = false;
  }

  show(currentSettings = {}) {
    this.isVisible = true;
    const vol = Math.round((currentSettings.volume ?? 0.5) * 100);
    const speed = currentSettings.speed ?? 20;

    this.container.innerHTML = `
      <div id="settingsOverlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div class="w-full max-w-md rounded-2xl p-6 relative border-2 border-pink-400/60 shadow-2xl bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-900/95 text-slate-100">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-pink-500/20 mb-5">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-pink-500"></span>
              <h2 class="font-cinzel text-lg md:text-xl font-bold text-pink-200 tracking-wider">Game Settings</h2>
            </div>
            <button id="btnCloseSettings" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>

          <!-- Controls -->
          <div class="flex flex-col gap-5 text-sm">
            <!-- Master Volume -->
            <div>
              <div class="flex justify-between items-center mb-1.5 font-semibold text-slate-300">
                <span>Master Volume</span>
                <span id="volValue" class="text-pink-300 font-bold">${vol}%</span>
              </div>
              <input type="range" id="volSlider" min="0" max="100" value="${vol}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>

            <!-- Text Typing Speed -->
            <div>
              <div class="flex justify-between items-center mb-1.5 font-semibold text-slate-300">
                <span>Text Speed</span>
                <span id="speedValue" class="text-pink-300 font-bold">${speed <= 5 ? 'Instant' : speed <= 20 ? 'Fast' : 'Normal'}</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button class="speed-btn px-3 py-1.5 rounded-lg border border-slate-700 hover:border-pink-500 ${speed > 20 ? 'bg-pink-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}" data-speed="35">Normal</button>
                <button class="speed-btn px-3 py-1.5 rounded-lg border border-slate-700 hover:border-pink-500 ${speed <= 20 && speed > 5 ? 'bg-pink-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}" data-speed="18">Fast</button>
                <button class="speed-btn px-3 py-1.5 rounded-lg border border-slate-700 hover:border-pink-500 ${speed <= 5 ? 'bg-pink-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}" data-speed="1">Instant</button>
              </div>
            </div>

            <!-- Restart / Reset Game -->
            <div class="pt-3 border-t border-slate-800 flex justify-between items-center">
              <div>
                <p class="font-semibold text-slate-300">Reset Narrative</p>
                <p class="text-xs text-slate-400">Restart from the Prologue</p>
              </div>
              <button id="btnRestartSettings" class="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-bold transition-all">
                Restart
              </button>
            </div>
          </div>

          <!-- Bottom Close -->
          <div class="mt-6 pt-4 border-t border-pink-500/20 flex justify-end">
            <button id="btnConfirmClose" class="px-5 py-2 rounded-xl ddlc-choice-button font-cinzel font-bold text-sm shadow-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const overlay = this.container.querySelector('#settingsOverlay');
    const btnClose = this.container.querySelector('#btnCloseSettings');
    const btnConfirm = this.container.querySelector('#btnConfirmClose');
    const volSlider = this.container.querySelector('#volSlider');
    const volValue = this.container.querySelector('#volValue');
    const speedBtns = this.container.querySelectorAll('.speed-btn');
    const btnRestart = this.container.querySelector('#btnRestartSettings');

    const close = () => {
      this.hide();
      this.callbacks.onClose();
    };

    btnClose.addEventListener('click', close);
    btnConfirm.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    volSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      volValue.textContent = `${val}%`;
      this.callbacks.onVolumeChange(val / 100);
    });

    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => {
          b.className = 'speed-btn px-3 py-1.5 rounded-lg border border-slate-700 hover:border-pink-500 bg-slate-800 text-slate-300';
        });
        btn.className = 'speed-btn px-3 py-1.5 rounded-lg border border-pink-500 bg-pink-600 text-white font-bold';
        const s = parseInt(btn.getAttribute('data-speed'), 10);
        this.callbacks.onSpeedChange(s);
      });
    });

    btnRestart.addEventListener('click', () => {
      if (confirm('Are you sure you want to restart the story from the beginning?')) {
        close();
        this.callbacks.onRestart();
      }
    });
  }

  hide() {
    this.isVisible = false;
    this.container.innerHTML = '';
  }
}

export default SettingsModal;
