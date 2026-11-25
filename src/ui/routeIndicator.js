/**
 * Top Navigation & Route Indicator HUD
 * Shows Paranoia Level meter, active investigation flags, and control buttons (Auto, Log, Audio, Restart).
 */

import { cleanSceneTitle } from '../utils/textCleaner.js';

export class RouteIndicator {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onToggleAuto: callbacks.onToggleAuto || (() => {}),
      onOpenHistory: callbacks.onOpenHistory || (() => {}),
      onOpenItem: callbacks.onOpenItem || (() => {}),
      onToggleAudio: callbacks.onToggleAudio || (() => {}),
      onRestart: callbacks.onRestart || (() => {}),
      onOpenMenu: callbacks.onOpenMenu || (() => {})
    };
    this.isAutoActive = false;

    this._renderBaseLayout();
  }

  _renderBaseLayout() {
    this.container.innerHTML = `
      <div class="w-full px-2 sm:px-3 md:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto">
        <!-- Left: Scene Title & Paranoia Meter -->
        <div class="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-1 min-w-0">
          <!-- Scene Name Pill -->
          <div class="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl glass-panel text-xs text-slate-200 border border-slate-700/60 max-w-[220px] md:max-w-[340px]">
            <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse flex-shrink-0"></span>
            <span id="hudSceneTitle" class="truncate font-cinzel font-semibold">Prologue</span>
          </div>

          <!-- Paranoia Gauge -->
          <div class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl glass-panel border border-slate-700/60 flex-shrink-0">
            <div class="flex items-center gap-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300">
              <svg class="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              <span class="hidden md:inline">Paranoia:</span>
              <span id="paranoiaPercent" class="text-purple-300 font-bold">10%</span>
            </div>
            <!-- Progress Bar -->
            <div class="w-12 sm:w-16 md:w-24 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
              <div id="paranoiaBar" class="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-500" style="width: 10%"></div>
            </div>
          </div>

          <!-- Item Quick Badge (if active item present) -->
          <button id="btnInspectItemBadge" class="hidden items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl glass-panel text-[11px] sm:text-xs font-medium text-amber-300 border border-amber-500/40 hover:bg-amber-950/40 transition-colors">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span class="hidden sm:inline">Inspect Item</span>
          </button>
        </div>

        <!-- Right: Action Buttons (Auto, History, Audio, Restart) -->
        <div class="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
          <!-- Auto Play Toggle -->
          <button id="btnToggleAuto" class="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-xl glass-panel hover:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-1 sm:gap-1.5 transition-all">
            <span class="w-2 h-2 rounded-full bg-slate-500" id="autoStatusDot"></span>
            <span>Auto</span>
          </button>

          <!-- History Log Button -->
          <button id="btnOpenHistory" class="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-xl glass-panel hover:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 flex items-center gap-1 sm:gap-1.5 transition-all">
            <svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Log</span>
          </button>

          <!-- Main Menu Button -->
          <button id="btnOpenTitleMenu" class="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-xl glass-panel hover:bg-slate-800 text-[11px] sm:text-xs font-medium text-pink-300 hover:text-white border border-pink-500/40 flex items-center gap-1 sm:gap-1.5 transition-all" title="Return to Title Menu">
            <svg class="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="hidden sm:inline">Menu</span>
          </button>

          <!-- Audio Toggle -->
          <button id="btnToggleAudio" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl glass-panel hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center transition-all" title="Toggle Sound">
            <svg id="iconAudioOn" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
            <svg id="iconAudioOff" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            </svg>
          </button>

          <!-- Restart Button -->
          <button id="btnRestart" class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl glass-panel hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700/60 hover:border-red-500/40 flex items-center justify-center transition-all" title="Restart Story">
            <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.sceneTitle = this.container.querySelector('#hudSceneTitle');
    this.paranoiaPercent = this.container.querySelector('#paranoiaPercent');
    this.paranoiaBar = this.container.querySelector('#paranoiaBar');
    this.inspectBtn = this.container.querySelector('#btnInspectItemBadge');
    this.autoDot = this.container.querySelector('#autoStatusDot');
    this.iconAudioOn = this.container.querySelector('#iconAudioOn');
    this.iconAudioOff = this.container.querySelector('#iconAudioOff');

    // Events
    this.container.querySelector('#btnOpenTitleMenu').addEventListener('click', () => {
      this.callbacks.onOpenMenu();
    });

    // Events
    this.container.querySelector('#btnToggleAuto').addEventListener('click', () => {
      this.isAutoActive = !this.isAutoActive;
      this.updateAutoStatus(this.isAutoActive);
      this.callbacks.onToggleAuto(this.isAutoActive);
    });

    this.container.querySelector('#btnOpenHistory').addEventListener('click', () => {
      this.callbacks.onOpenHistory();
    });

    this.inspectBtn.addEventListener('click', () => {
      this.callbacks.onOpenItem();
    });

    this.container.querySelector('#btnToggleAudio').addEventListener('click', () => {
      const isMuted = this.callbacks.onToggleAudio();
      this.syncAudio(isMuted);
    });

    this.container.querySelector('#btnRestart').addEventListener('click', () => {
      if (confirm('Restart "Yet the Butterflies Flutter Away" from the Prologue?')) {
        this.callbacks.onRestart();
      }
    });
  }

  update(state, sceneData) {
    if (sceneData) {
      this.sceneTitle.textContent = cleanSceneTitle(sceneData.title);
    }

    const paranoia = Math.round(state.paranoiaLevel);
    this.paranoiaPercent.textContent = `${paranoia}%`;
    this.paranoiaBar.style.width = `${paranoia}%`;

    // Item badge visibility
    if (state.activeItem || (state.hasBrooch && state.currentScene.startsWith('scene_3'))) {
      this.inspectBtn.classList.remove('hidden');
      this.inspectBtn.classList.add('flex');
    } else {
      this.inspectBtn.classList.add('hidden');
      this.inspectBtn.classList.remove('flex');
    }
  }

  updateAutoStatus(isActive) {
    this.isAutoActive = isActive;
    if (isActive) {
      this.autoDot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-ping";
    } else {
      this.autoDot.className = "w-2 h-2 rounded-full bg-slate-500";
    }
  }

  syncAudio(isMuted) {
    if (this.iconAudioOn && this.iconAudioOff) {
      if (isMuted) {
        this.iconAudioOn.classList.add('hidden');
        this.iconAudioOff.classList.remove('hidden');
      } else {
        this.iconAudioOn.classList.remove('hidden');
        this.iconAudioOff.classList.add('hidden');
      }
    }
  }
}

export default RouteIndicator;
