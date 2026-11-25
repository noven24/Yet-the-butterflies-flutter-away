/**
 * Conversation History / Log Modal Component
 * Displays full dialogue transcripts from the current playthrough.
 */

import { assetMap } from '../data/assetMap.js';

export class HistoryModal {
  constructor(containerElement) {
    this.container = containerElement;
    this.assetMap = assetMap;
    this.isOpen = false;

    this._renderBaseLayout();
  }

  _renderBaseLayout() {
    this.container.innerHTML = `
      <div id="historyBackdrop" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md hidden flex items-center justify-center p-3 md:p-6 transition-all duration-300">
        <div id="historyCard" class="relative w-full max-w-2xl h-[80dvh] glass-panel-heavy rounded-3xl p-5 md:p-7 border border-slate-700/80 shadow-2xl flex flex-col transform scale-95 opacity-0 transition-all duration-300">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h2 class="font-cinzel text-lg md:text-xl font-bold text-slate-100">Dialogue History Log</h2>
            </div>
            <button id="btnCloseHistory" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Log Content List -->
          <div id="historyLogList" class="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3.5">
            <!-- Items injected dynamically -->
          </div>

          <!-- Footer -->
          <div class="pt-3 border-t border-slate-700/60 mt-3 text-right">
            <span class="text-xs text-slate-500">Scroll to view earlier conversation records</span>
          </div>
        </div>
      </div>
    `;

    this.backdrop = this.container.querySelector('#historyBackdrop');
    this.card = this.container.querySelector('#historyCard');
    this.list = this.container.querySelector('#historyLogList');

    const closeBtn = this.container.querySelector('#btnCloseHistory');
    const close = () => this.hide();
    closeBtn.addEventListener('click', close);
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) close();
    });
  }

  show(dialogueHistory) {
    if (!dialogueHistory || dialogueHistory.length === 0) {
      this.list.innerHTML = `<div class="text-center py-12 text-slate-500 italic">No dialogue history recorded yet.</div>`;
    } else {
      this.list.innerHTML = dialogueHistory.map(entry => {
        const isNarrator = entry.speaker === 'Narrator';
        const charMeta = this.assetMap.characters[entry.speaker] || this.assetMap.characters.Narrator;
        const color = charMeta.themeColor || '#cbd5e1';

        return `
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
            ${!isNarrator ? `
              <span class="font-cinzel text-xs font-bold tracking-wider" style="color: ${color}">
                ${entry.speaker}
              </span>
            ` : `
              <span class="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Chronicle
              </span>
            `}
            <p class="text-sm leading-relaxed ${isNarrator ? 'text-slate-300 italic' : 'text-slate-100'}">
              ${entry.text}
            </p>
          </div>
        `;
      }).join('');
    }

    this.backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.card.classList.remove('scale-95', 'opacity-0');
      this.card.classList.add('scale-100', 'opacity-100');
      // Scroll to bottom
      this.list.scrollTop = this.list.scrollHeight;
    });
    this.isOpen = true;
  }

  hide() {
    this.card.classList.remove('scale-100', 'opacity-100');
    this.card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      this.backdrop.classList.add('hidden');
      this.isOpen = false;
    }, 250);
  }
}

export default HistoryModal;
