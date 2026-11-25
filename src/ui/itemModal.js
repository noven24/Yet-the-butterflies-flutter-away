/**
 * Key Item Inspection Modal Component
 * Displays interactive detailed pop-ups for the Silver Butterfly Brooch and Aflania's Farewell Letter.
 */

import { assetMap } from '../data/assetMap.js';

export class ItemModal {
  constructor(modalContainer, onPlayChime, onPlayRustle) {
    this.container = modalContainer;
    this.assetMap = assetMap;
    this.onPlayChime = onPlayChime || (() => {});
    this.onPlayRustle = onPlayRustle || (() => {});
    this.isOpen = false;

    this._renderBaseModal();
  }

  _renderBaseModal() {
    this.container.innerHTML = `
      <div id="itemModalBackdrop" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-5 transition-all duration-300 select-none">
        <div id="itemModalCard" class="relative w-full max-w-md md:max-w-lg max-h-[90dvh] glass-panel-heavy rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-700/80 shadow-2xl flex flex-col items-center text-center transform scale-95 opacity-0 transition-all duration-300 overflow-hidden my-auto">
          
          <!-- Close Button Top Right -->
          <button id="btnCloseItemModal" class="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Close">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Scrollable Body Content -->
          <div class="w-full flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center px-1 sm:px-2 py-0.5 min-h-0">
            <!-- Item Image Container (Scales responsively on smaller/mobile heights) -->
            <div id="itemImageWrapper" class="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-2.5 sm:mb-3 rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-900/60 flex items-center justify-center relative group flex-shrink-0">
              <img id="itemModalImage" src="" alt="Item" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none"></div>
            </div>

            <!-- Item Metadata Tag -->
            <div class="flex items-center gap-2 mb-1.5 flex-shrink-0">
              <span id="itemModalCategory" class="text-[10px] sm:text-xs uppercase tracking-widest font-semibold px-3 py-0.5 sm:py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30 shadow-sm">
                Artifact
              </span>
            </div>

            <!-- Item Title & Subtitle -->
            <h3 id="itemModalTitle" class="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-slate-100 mb-1 leading-tight flex-shrink-0"></h3>
            <p id="itemModalSubtitle" class="font-playfair italic text-xs sm:text-sm text-slate-400 mb-2.5 flex-shrink-0 px-2"></p>

            <!-- Item Description Box -->
            <div id="itemModalDescription" class="w-full text-xs sm:text-sm leading-relaxed text-slate-300 text-left bg-slate-900/60 rounded-xl p-3 sm:p-3.5 border border-slate-800"></div>
          </div>

          <!-- Fixed Bottom Footer (Always visible, never cut off) -->
          <div class="w-full pt-3 sm:pt-4 flex-shrink-0 border-t border-slate-800/80 mt-2">
            <button id="btnDismissItem" class="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-900/70 to-pink-900/70 hover:from-purple-800 hover:to-pink-800 text-slate-100 hover:text-white border border-pink-500/30 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-pink-500/20 cursor-pointer">
              Close Inspection
            </button>
          </div>
        </div>
      </div>
    `;

    this.backdrop = this.container.querySelector('#itemModalBackdrop');
    this.card = this.container.querySelector('#itemModalCard');
    this.img = this.container.querySelector('#itemModalImage');
    this.category = this.container.querySelector('#itemModalCategory');
    this.title = this.container.querySelector('#itemModalTitle');
    this.subtitle = this.container.querySelector('#itemModalSubtitle');
    this.desc = this.container.querySelector('#itemModalDescription');

    const closeBtn = this.container.querySelector('#btnCloseItemModal');
    const dismissBtn = this.container.querySelector('#btnDismissItem');

    const close = () => this.hide();
    closeBtn.addEventListener('click', close);
    dismissBtn.addEventListener('click', close);
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) close();
    });
  }

  showItem(itemType) {
    if (itemType === 'silver_butterfly_brooch') {
      this.title.textContent = "Silver Butterfly Brooch";
      this.subtitle.textContent = "“The keepsake he had given Aflania on their wedding day.”";
      this.category.textContent = "Wedding Keepsake";
      this.img.src = this.assetMap.items.silver_butterfly_brooch;
      this.desc.innerHTML = `
        <p class="mb-2">An exquisitely crafted silver butterfly with delicate filigree wings, given to Aflania by Joan as a token of unyielding devotion when they overcame societal prejudice to wed.</p>
        <p class="text-purple-300 font-medium">Plot Significance:</p>
        <p class="text-xs text-slate-400">Found by a servant near the western corridor. Stolen by Laqquo via his wife Emilia to manufacture false proof of infidelity between Aflania and Cassian.</p>
      `;
      this.onPlayChime();
    } else if (itemType === 'aflania_letter') {
      this.title.textContent = "Aflania's Farewell Letter";
      this.subtitle.textContent = "“Silence is not the same as healing.”";
      this.category.textContent = "Personal Letter";
      this.img.src = this.assetMap.items.aflania_letter;
      this.desc.innerHTML = `
        <div class="font-playfair italic text-amber-100/90 whitespace-pre-line text-sm leading-relaxed">
“Joan,

I have waited for you to speak to me about what happened. I have waited for you to acknowledge that your silence hurt me almost as much as your suspicion.

I do not believe you are incapable of love. I believe you loved me sincerely. But sincerity cannot replace responsibility.

I am leaving for the capital. I hope you find peace.

Aflania.”
        </div>
      `;
      this.onPlayRustle();
    } else {
      return;
    }

    this.backdrop.classList.remove('hidden');
    // Trigger transition
    requestAnimationFrame(() => {
      this.card.classList.remove('scale-95', 'opacity-0');
      this.card.classList.add('scale-100', 'opacity-100');
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

export default ItemModal;
