/**
 * DDLC Choice Menu Component
 * Renders interactive branching decision options with responsive mobile/desktop layout,
 * authentic DDLC rounded button aesthetics, hover sound effects,
 * and special psychological destructive styling for Choice 4 Option D.
 */

import { cleanChoicePrompt, cleanOptionText } from '../utils/textCleaner.js';

export class ChoiceMenu {
  constructor(containerElement, onSelectOption, onHoverOption) {
    this.container = containerElement;
    this.onSelectOption = onSelectOption || (() => {});
    this.onHoverOption = onHoverOption || (() => {});
    this.isSelecting = false;
  }

  render(choiceObj, isEndingReached, onProceedEpilogue, contextData = null) {
    this.isSelecting = false;
    if (!choiceObj && !isEndingReached) {
      this.container.classList.add('hidden');
      this.container.innerHTML = '';
      return;
    }

    this.container.classList.remove('hidden');

    // 1. If an Ending is reached and finished, show Proceed to Epilogue button
    if (isEndingReached && !choiceObj) {
      this.container.innerHTML = `
        <div class="w-full max-w-xl mx-auto flex flex-col items-center gap-4 animate-fade-in p-4">
          <div class="text-center mb-2">
            <span class="text-xs uppercase tracking-widest text-pink-300 font-bold drop-shadow">The Story Reaches Its Reflection</span>
          </div>
          <button id="btnProceedEpilogue" class="w-full min-h-[54px] px-6 py-4 rounded-2xl ddlc-choice-button font-cinzel font-bold text-base md:text-lg shadow-2xl flex items-center justify-center gap-3">
            <span>Proceed to Epilogue</span>
            <svg class="w-5 h-5 text-pink-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      `;

      const btn = this.container.querySelector('#btnProceedEpilogue');
      btn.addEventListener('mouseenter', () => this.onHoverOption());
      btn.addEventListener('click', () => {
        if (onProceedEpilogue) onProceedEpilogue();
      });
      return;
    }

    // 2. Cinders-style Question Bar + Preceding Dialogue Context + Horizontal Choice Buttons
    const prompt = cleanChoicePrompt(choiceObj.prompt);
    const optCount = choiceObj.options.length;

    let gridColsClass = 'grid-cols-1 sm:grid-cols-3';
    if (optCount === 2) {
      gridColsClass = 'grid-cols-1 sm:grid-cols-2';
    } else if (optCount === 4) {
      gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }

    // Format preceding dialogue or narration context
    let contextHtml = '';
    if (contextData) {
      const { characterLine, narratorLine } = contextData;
      let charHtml = '';
      let narrHtml = '';

      if (characterLine && characterLine.text) {
        const isAflania = (characterLine.speaker || '').toLowerCase().includes('aflania') || (characterLine.speaker || '').toLowerCase().includes('alfania');
        const badgeColor = isAflania ? 'text-pink-300' : 'text-purple-300';
        charHtml = `
          <div class="flex items-start gap-2 text-left">
            <span class="font-cinzel font-bold text-xs sm:text-sm ${badgeColor} flex-shrink-0 drop-shadow">
              ${characterLine.speaker}:
            </span>
            <span class="font-playfair italic text-xs sm:text-sm text-slate-100 leading-snug drop-shadow">
              “${characterLine.text}”
            </span>
          </div>
        `;
      }

      if (narratorLine) {
        narrHtml = `
          <div class="text-[11px] sm:text-xs text-pink-200/80 font-sans italic leading-relaxed text-left line-clamp-3 sm:line-clamp-2">
            ${narratorLine}
          </div>
        `;
      }

      if (charHtml || narrHtml) {
        contextHtml = `
          <div class="w-full pt-1.5 pb-0.5 border-t border-pink-500/20 flex flex-col gap-1 text-left mt-0.5">
            ${charHtml}
            ${narrHtml}
          </div>
        `;
      }
    }

    const optionsHtml = choiceObj.options.map(opt => {
      const isDestructive = !!opt.isDestructive;
      // Clean script branch directions (e.g. "Return to Scene 1A and continue with Scene 2B.", "Go to Scene 1A.")
      const cleanText = cleanOptionText(opt.text);

      return `
        <button data-key="${opt.key}" class="choice-btn group relative px-3 py-2 sm:py-2.5 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px] ${
          isDestructive
            ? 'destructive-choice bg-red-950/85 hover:bg-red-900 border-red-500/80 text-red-100'
            : 'cinders-choice-btn font-serif'
        }">
          <span class="font-cinzel text-xs font-bold px-1.5 py-0.5 rounded ${
            isDestructive ? 'bg-red-900/80 text-red-200' : 'bg-pink-900/50 text-pink-300 border border-pink-500/30'
          }">
            ${opt.key}
          </span>
          <span class="text-xs sm:text-sm font-medium leading-snug drop-shadow flex-1">
            ${cleanText}
          </span>
          ${isDestructive ? `
            <span class="absolute -top-2 right-2 px-1.5 py-0.5 bg-red-900 text-[9px] uppercase font-mono tracking-widest text-red-200 border border-red-400 rounded animate-pulse">
              ANGER
            </span>
          ` : ''}
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="w-full max-h-[58dvh] sm:max-h-[68dvh] overflow-y-auto custom-scrollbar flex flex-col items-center gap-2 sm:gap-2.5 animate-fade-in select-none pr-0.5">
        <!-- Cinders-style Question Bubble & Preceding Dialogue Context at Bottom -->
        <div class="cinders-prompt-bubble w-full py-2 sm:py-2.5 px-3 sm:px-6 rounded-2xl flex flex-col gap-1 sm:gap-1.5 shadow-2xl border border-pink-400/40 bg-slate-950/90 backdrop-blur-md">
          <div class="flex items-center justify-between gap-2 sm:gap-3">
            <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <img src="asset/items/butterfly_brooch.png" alt="butterfly" class="w-4 h-4 sm:w-5 sm:h-5 object-contain filter drop-shadow-[0_0_8px_rgba(244,114,182,0.9)] animate-pulse flex-shrink-0" />
              <span class="font-cinzel font-bold text-xs sm:text-sm md:text-base text-pink-200 tracking-wider uppercase drop-shadow truncate">
                ${prompt}
              </span>
            </div>
            <span class="text-[10px] sm:text-[11px] font-mono text-pink-300/60 hidden sm:inline tracking-wider flex-shrink-0">
              Choose Joan's response
            </span>
          </div>

          <!-- Preceding Context -->
          ${contextHtml}
        </div>

        <!-- Horizontal / Grid Choice Buttons Strip -->
        <div class="w-full grid ${gridColsClass} gap-2 sm:gap-2.5">
          ${optionsHtml}
        </div>
      </div>
    `;

    // Attach listeners to option buttons
    const buttons = this.container.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (!this.isSelecting) this.onHoverOption();
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isSelecting) return;
        this.isSelecting = true;

        // Immediately disable all buttons to prevent re-entrant or double clicks
        buttons.forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
          b.classList.add('opacity-75');
        });
        btn.classList.add('ring-2', 'ring-pink-400', 'scale-[0.98]');

        const key = btn.getAttribute('data-key');

        // Immediately hide container so choice buttons do not linger or interfere with scene transition
        this.container.classList.add('hidden');

        this.onSelectOption(key);
      });
    });
  }
}

export default ChoiceMenu;
