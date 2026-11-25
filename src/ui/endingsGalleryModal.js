/**
 * Endings Gallery Modal Component
 * Displays unlocked achievements and records which of the 5 tragic and redemptive
 * endings (A, B, C, D, E) the player has discovered across all playthroughs.
 */

export class EndingsGalleryModal {
  constructor(containerElement, callbacks = {}) {
    this.container = containerElement;
    this.callbacks = {
      onPlayClick: callbacks.onPlayClick || (() => {})
    };
    this.isVisible = false;
  }

  show(unlockedEndings = []) {
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this._render(unlockedEndings);
  }

  hide() {
    this.isVisible = false;
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  _getAllEndingsData() {
    return [
      {
        id: 'ending_a',
        code: 'ENDING A',
        title: 'THE TRUTH EXPOSED',
        subtitle: 'A Chance to Begin Again',
        accentColor: 'border-pink-500/60 bg-pink-950/30 text-pink-200',
        badgeBg: 'bg-pink-900/60 text-pink-200 border-pink-400',
        butterflyFilter: 'drop-shadow(0 0 15px rgba(236,72,153,0.9))',
        hint: 'Believe Aflania, listen to Emilia, and suspend Laqquo pending an investigation.',
        reflection: 'Joan placed his trust in evidence and the woman he loved. By refusing to let suspicion dictate reality, he unmasked Laqquo and preserved the bond they had built together.'
      },
      {
        id: 'ending_b',
        code: 'ENDING B',
        title: 'A FRAGILE PEACE',
        subtitle: 'The Lie Survives in Silence',
        accentColor: 'border-amber-500/60 bg-amber-950/30 text-amber-200',
        badgeBg: 'bg-amber-900/60 text-amber-200 border-amber-400',
        butterflyFilter: 'drop-shadow(0 0 12px rgba(245,158,11,0.8)) sepia(0.6)',
        hint: 'Forgive Laqquo’s suspicions but warn him never to repeat them without evidence.',
        reflection: 'Joan chose peace without addressing the manipulation that threatened it. For several weeks silence prevailed, yet the lie survived unspoken in their home.'
      },
      {
        id: 'ending_c',
        code: 'ENDING C',
        title: 'THE MARRIAGE DESTROYED',
        subtitle: 'Jealousy Wins Without a Sword',
        accentColor: 'border-red-600/70 bg-red-950/40 text-red-200',
        badgeBg: 'bg-red-900/80 text-red-100 border-red-500',
        butterflyFilter: 'drop-shadow(0 0 18px rgba(220,38,38,0.95)) hue-rotate(300deg)',
        hint: 'Allow anger to overcome reason and accuse Aflania publicly in the main hall.',
        reflection: 'Blinded by fear and manipulated by Laqquo, Joan invented a betrayal that had never existed, driving the woman he loved away forever.'
      },
      {
        id: 'ending_d',
        code: 'ENDING D',
        title: 'THE PRICE OF FORGIVENESS',
        subtitle: 'Love Does Not Guarantee Reconciliation',
        accentColor: 'border-indigo-500/60 bg-indigo-950/30 text-indigo-200',
        badgeBg: 'bg-indigo-900/60 text-indigo-200 border-indigo-400',
        butterflyFilter: 'drop-shadow(0 0 15px rgba(99,102,241,0.8)) hue-rotate(220deg)',
        hint: 'Offer Aflania the freedom to leave or tell her she must wait until you feel certain.',
        reflection: 'The truth was discovered, but regret could not undo the pain. Aflania departed for the capital to rebuild her life independently.'
      },
      {
        id: 'ending_e',
        code: 'ENDING E',
        title: 'THE UNFINISHED APOLOGY',
        subtitle: 'Silence is Not the Same as Healing',
        accentColor: 'border-slate-500/60 bg-slate-900/50 text-slate-200',
        badgeBg: 'bg-slate-800/80 text-slate-200 border-slate-400',
        butterflyFilter: 'drop-shadow(0 0 12px rgba(148,163,184,0.6)) grayscale(0.8)',
        hint: 'Focus on military duties or abandon discussion, assuming truth will repair itself.',
        reflection: 'Joan mistook the absence of conflict for healing. Leaving his remorse unvoiced, he received Aflania’s departure letter on his quiet desk.'
      }
    ];
  }

  _render(unlockedEndings = []) {
    const allEndings = this._getAllEndingsData();
    const unlockedCount = allEndings.filter(e => unlockedEndings.includes(e.id)).length;
    const progressPercent = Math.round((unlockedCount / allEndings.length) * 100);

    const cardsHtml = allEndings.map(item => {
      const isUnlocked = unlockedEndings.includes(item.id);
      return `
        <div class="rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${isUnlocked ? item.accentColor : 'border-slate-800 bg-slate-950/60 text-slate-500'}">
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex items-center gap-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-cinzel font-bold border ${isUnlocked ? item.badgeBg : 'bg-slate-900 text-slate-500 border-slate-700'}">
                ${item.code}
              </span>
              <h4 class="font-cinzel font-bold text-sm sm:text-base ${isUnlocked ? 'text-white' : 'text-slate-500'}">
                ${isUnlocked ? item.title : '??? (LOCKED)'}
              </h4>
            </div>

            <!-- Status Icon -->
            <div class="flex-shrink-0">
              ${isUnlocked ? `
                <img src="asset/items/butterfly_brooch.png" alt="Unlocked" class="w-6 h-6 object-contain" style="filter: ${item.butterflyFilter};" />
              ` : `
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              `}
            </div>
          </div>

          <!-- Subtitle / Tagline -->
          <p class="font-playfair italic text-xs sm:text-sm mb-2 ${isUnlocked ? 'text-pink-300' : 'text-slate-600'}">
            ${isUnlocked ? `"${item.subtitle}"` : 'Outcome Unknown'}
          </p>

          <!-- Reflection or Hint -->
          <p class="text-xs sm:text-sm leading-relaxed ${isUnlocked ? 'text-slate-300' : 'text-slate-500 italic'}">
            ${isUnlocked ? item.reflection : `Hint: ${item.hint}`}
          </p>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div id="galleryBackdrop" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none">
        <div class="w-full max-w-3xl max-h-[90dvh] bg-slate-950 border border-slate-700/80 rounded-3xl p-5 sm:p-8 flex flex-col shadow-2xl overflow-hidden relative">
          
          <!-- Top Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
            <div class="flex items-center gap-3">
              <img src="asset/items/butterfly_brooch.png" alt="Gallery" class="w-8 h-8 object-contain filter drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
              <div>
                <h3 class="font-cinzel font-bold text-lg sm:text-xl text-white">Endings Gallery</h3>
                <p class="text-xs text-pink-300/80 font-mono">Archive of Joan & Aflania's Fates</p>
              </div>
            </div>

            <!-- Close Button -->
            <button id="btnCloseGallery" class="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Close Gallery">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="py-4 border-b border-slate-800/80 flex items-center justify-between gap-4 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Completion:</span>
              <span class="text-sm font-cinzel font-bold text-pink-300">${unlockedCount} / 5 Endings Discovered (${progressPercent}%)</span>
            </div>
            <div class="w-32 sm:w-48 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div class="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 rounded-full transition-all duration-700" style="width: ${progressPercent}%"></div>
            </div>
          </div>

          <!-- Scrollable Endings List -->
          <div class="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 flex flex-col gap-3">
            ${cardsHtml}
          </div>

          <!-- Footer note -->
          <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono flex-shrink-0">
            <span>Progress automatically saved to browser</span>
            <span>Epilogue unlocks after every ending</span>
          </div>
        </div>
      </div>
    `;

    // Close button listener
    const closeBtn = this.container.querySelector('#btnCloseGallery');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onPlayClick();
        this.hide();
      });
    }

    const backdrop = this.container.querySelector('#galleryBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.callbacks.onPlayClick();
          this.hide();
        }
      });
    }
  }
}

export default EndingsGalleryModal;
