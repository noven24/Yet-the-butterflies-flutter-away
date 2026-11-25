/**
 * DDLC Save / Load Slot Modal
 * Manages 6 persistent game save slots + quicksave with metadata, thumbnails, and timestamps.
 */

import { cleanSceneTitle } from '../utils/textCleaner.js';

export class SaveLoadModal {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onSave: callbacks.onSave || (() => {}),
      onLoad: callbacks.onLoad || (() => {}),
      onClose: callbacks.onClose || (() => {}),
      onPlayClick: callbacks.onPlayClick || (() => {})
    };
    this.mode = 'load'; // 'save' | 'load'
    this.isVisible = false;
    this.totalSlots = 6;
  }

  show(mode = 'load', currentState = null, currentScene = null, currentDialogue = null) {
    this.mode = mode;
    this.currentState = currentState;
    this.currentScene = currentScene;
    this.currentDialogue = currentDialogue;
    this.isVisible = true;

    this._render();
  }

  _render() {
    const isSave = this.mode === 'save';
    const title = isSave ? 'Save Story Progress' : 'Load Story Progress';
    const subtitle = isSave
      ? 'Select a slot to record your current journey and psychological state'
      : 'Select a saved timeline or resume from Auto-Save';

    const autoSave = this._getAutoSaveData();
    let autoSaveHtml = '';

    if (!isSave && autoSave && autoSave.state) {
      const paranoia = autoSave.state.paranoiaLevel ?? 10;
      const sceneTitle = cleanSceneTitle(autoSave.sceneTitle || 'Prologue');
      const savedAt = autoSave.dateFormatted || 'Recently';

      autoSaveHtml = `
        <div data-action="load_autosave" class="save-slot-card group relative p-4 rounded-xl border border-cyan-400/60 hover:border-cyan-300 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 hover:from-cyan-900/80 hover:to-cyan-900/80 cursor-pointer transition-all duration-200 shadow-lg flex flex-col justify-between col-span-1 sm:col-span-2 mb-1">
          <div class="flex items-center justify-between text-xs font-cinzel font-bold text-cyan-300">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span class="tracking-wider uppercase">Continue (Latest Auto-Save)</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono">
              Paranoia: ${paranoia}%
            </span>
          </div>
          <div class="my-2 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <h4 class="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 truncate">
                ${sceneTitle}
              </h4>
              <p class="text-[11px] text-cyan-200/70 truncate italic mt-0.5">
                Resume General Joan's story from the latest automatic checkpoint
              </p>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="text-[10px] text-cyan-300/60 font-mono block">${savedAt}</span>
              <span class="text-xs text-cyan-300 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-0.5">
                Continue ➔
              </span>
            </div>
          </div>
        </div>
      `;
    }

    const slotsData = this._getSlotsData();

    const slotsHtml = slotsData.map((slot, index) => {
      const slotNum = index + 1;
      if (slot.isEmpty) {
        return `
          <div data-slot="slot_${slotNum}" class="save-slot-card group relative p-4 rounded-xl border border-dashed border-pink-400/30 hover:border-pink-400 bg-slate-900/60 hover:bg-pink-950/20 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[95px]">
            <div class="flex items-center justify-between text-xs text-slate-400 group-hover:text-pink-300 font-cinzel font-semibold">
              <span>SLOT ${slotNum}</span>
              <span class="text-[11px] text-slate-500 uppercase">Empty</span>
            </div>
            <div class="my-auto text-center py-2 text-slate-500 group-hover:text-pink-200 text-sm font-medium">
              ${isSave ? '+ Click to Save' : '[ No Data ]'}
            </div>
            <div class="text-[10px] text-slate-600 font-mono">---</div>
          </div>
        `;
      }

      // Occupied slot
      return `
        <div data-slot="slot_${slotNum}" class="save-slot-card group relative p-4 rounded-xl border border-pink-500/40 hover:border-pink-400 bg-slate-900/90 hover:bg-slate-800/90 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between min-h-[95px]">
          <div class="flex items-center justify-between text-xs font-cinzel font-bold text-pink-300">
            <span>SLOT ${slotNum}</span>
            <span class="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px]">
              Paranoia: ${slot.data.paranoiaLevel}%
            </span>
          </div>
          <div class="my-1.5">
            <h4 class="font-cinzel text-xs md:text-sm font-bold text-slate-100 truncate group-hover:text-pink-200">
              ${cleanSceneTitle(slot.data.sceneTitle || 'Unknown Chapter')}
            </h4>
            <p class="text-[11px] text-slate-400 truncate italic">
              "${slot.data.snippet || '...'}"
            </p>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
            <span>${slot.data.savedAt || 'Unknown Date'}</span>
            <span class="text-pink-400 group-hover:translate-x-0.5 transition-transform font-bold font-sans">
              ${isSave ? 'Overwrite ➔' : 'Load ➔'}
            </span>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div id="saveLoadOverlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
        <div class="w-full max-w-2xl rounded-2xl p-5 md:p-7 relative border-2 border-pink-400/60 shadow-2xl bg-gradient-to-b from-slate-900/95 via-purple-950/90 to-slate-900/95 text-slate-100 max-h-[90dvh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between pb-3.5 border-b border-pink-500/25 mb-4 flex-shrink-0">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <h2 class="font-cinzel text-lg md:text-xl font-bold text-pink-200 tracking-wider">${title}</h2>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">${subtitle}</p>
            </div>
            <button id="btnCloseSaveLoad" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>

          <!-- Slots Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar p-1 flex-1">
            ${autoSaveHtml}
            ${slotsHtml}
          </div>

          <!-- Bottom Footer -->
          <div class="mt-4 pt-3 border-t border-pink-500/20 flex justify-between items-center flex-shrink-0">
            <span class="text-xs text-slate-400">Autosave slot available in Quick Load</span>
            <button id="btnCancelSaveLoad" class="px-5 py-2 rounded-xl ddlc-choice-button font-cinzel font-bold text-xs shadow-md">
              Back
            </button>
          </div>
        </div>
      </div>
    `;

    // Events
    const overlay = this.container.querySelector('#saveLoadOverlay');
    const btnClose = this.container.querySelector('#btnCloseSaveLoad');
    const btnCancel = this.container.querySelector('#btnCancelSaveLoad');

    const dismiss = () => {
      this.hide();
      this.callbacks.onClose();
    };

    btnClose.addEventListener('click', dismiss);
    btnCancel.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss();
    });

    const autoSaveCard = this.container.querySelector('[data-action="load_autosave"]');
    if (autoSaveCard) {
      autoSaveCard.addEventListener('click', () => {
        this.callbacks.onPlayClick();
        const autoSaveData = this._getAutoSaveData();
        if (autoSaveData && autoSaveData.state) {
          this.hide();
          this.callbacks.onLoad(autoSaveData.state, 'Auto-Save');
        }
      });
    }

    const slotCards = this.container.querySelectorAll('.save-slot-card[data-slot]');
    slotCards.forEach(card => {
      card.addEventListener('click', () => {
        const slotKey = card.getAttribute('data-slot');
        this.callbacks.onPlayClick();
        if (isSave) {
          this._handleSaveToSlot(slotKey);
        } else {
          this._handleLoadFromSlot(slotKey);
        }
      });
    });
  }

  _getAutoSaveData() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('butterflies_autosave');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  _getSlotsData() {
    const list = [];
    for (let i = 1; i <= this.totalSlots; i++) {
      const key = `butterflies_save_slot_${i}`;
      let data = null;
      try {
        const item = localStorage.getItem(key);
        if (item) data = JSON.parse(item);
      } catch (e) {}

      list.push({
        slotKey: `slot_${i}`,
        isEmpty: !data,
        data: data
      });
    }
    return list;
  }

  _handleSaveToSlot(slotKey) {
    if (!this.currentState) {
      alert('No active story session to save.');
      return;
    }

    const payload = {
      ...this.currentState,
      savedAt: new Date().toLocaleString(),
      sceneTitle: cleanSceneTitle((this.currentScene && this.currentScene.title) || 'Unknown Chapter'),
      snippet: (this.currentDialogue && this.currentDialogue.text) || ''
    };

    try {
      localStorage.setItem(`butterflies_save_${slotKey}`, JSON.stringify(payload));
      this.callbacks.onSave(slotKey);
      this._render(); // Re-render to show updated slot
    } catch (e) {
      console.error('Failed to save to slot:', e);
    }
  }

  _handleLoadFromSlot(slotKey) {
    const key = `butterflies_save_${slotKey}`;
    try {
      const payload = localStorage.getItem(key);
      if (!payload) {
        return; // Empty slot
      }
      const data = JSON.parse(payload);
      this.hide();
      this.callbacks.onLoad(data, slotKey);
    } catch (e) {
      console.error('Failed to load slot:', e);
    }
  }

  hide() {
    this.isVisible = false;
    this.container.innerHTML = '';
  }
}

export default SaveLoadModal;
