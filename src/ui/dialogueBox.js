/**
 * Authentic DDLC Dialogue Box Component
 * Displays the iconic DDLC polka-dot textbox, character nameplate, embedded quick menu,
 * bouncing CTC indicator, and typewriter sound blips.
 */

import { assetMap } from '../data/assetMap.js';

export class DialogueBox {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.onAdvance = options.onAdvance || (() => {});
    this.onPlayClick = options.onPlayClick || (() => {});
    this.onCharTyped = options.onCharTyped || (() => {});
    this.onQuickAction = options.onQuickAction || (() => {});
    this.assetMap = assetMap;

    this.isTyping = false;
    this.currentFullText = '';
    this.typewriterTimer = null;
    this.typingSpeed = 20; // ms per char
    this.isAutoActive = false;
    this.isSkipActive = false;

    this._renderBaseLayout();
    this._initEvents();
  }

  _renderBaseLayout() {
    this.container.innerHTML = `
      <div id="dialogueCardWrapper" class="w-full max-w-4xl mx-auto relative select-none">
        <!-- Cinders-style Namebox Indicator with Butterfly Emblem -->
        <div id="nameboxContainer" class="absolute -top-6 sm:-top-7 left-3 sm:left-6 md:left-8 z-30 flex items-center transition-all duration-200">
          <div id="nameboxBadge" class="ddlc-namebox text-xs sm:text-sm md:text-base font-bold shadow-lg flex items-center gap-1.5 sm:gap-2">
            <img src="asset/items/butterfly_brooch.png" alt="icon" class="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain filter drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]" />
            <span id="speakerName">Narrator</span>
          </div>
        </div>

        <!-- DDLC Main Textbox -->
        <div id="dialogueCard" class="ddlc-textbox w-full min-h-[115px] sm:min-h-[130px] md:min-h-[140px] pt-4 sm:pt-5 md:pt-6 px-4 sm:px-6 md:px-10 pb-7 sm:pb-8 md:pb-9 cursor-pointer relative transition-all duration-300">
          <!-- Text Body Container -->
          <div class="min-h-[44px] sm:min-h-[50px] md:min-h-[60px] flex items-start">
            <p id="dialogueText" class="text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed tracking-normal text-slate-100 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"></p>
          </div>

          <!-- Bottom DDLC Quick Action Menu Bar -->
          <div id="quickMenuBar" class="absolute bottom-1.5 sm:bottom-2 left-3 sm:left-6 md:left-12 flex items-center gap-0.5 sm:gap-1.5 md:gap-2 z-20">
            <button class="ddlc-quick-btn" data-action="history">History</button>
            <button class="ddlc-quick-btn" data-action="skip" id="btnQuickSkip">Skip</button>
            <button class="ddlc-quick-btn" data-action="auto" id="btnQuickAuto">Auto</button>
            <button class="ddlc-quick-btn" data-action="save">Save</button>
            <button class="ddlc-quick-btn" data-action="load">Load</button>
            <button class="ddlc-quick-btn" data-action="settings">Settings</button>
          </div>

          <!-- DDLC CTC (Click to Continue) Indicator -->
          <div id="ctcIndicator" class="absolute bottom-1.5 sm:bottom-2.5 right-3 sm:right-6 md:right-10 flex items-center gap-1 opacity-0 transition-opacity duration-200 ctc-indicator pointer-events-none">
            <img src="asset/GUI/ctc.png" alt="Next" class="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      </div>
    `;

    this.dialogueCard = this.container.querySelector('#dialogueCard');
    this.nameboxContainer = this.container.querySelector('#nameboxContainer');
    this.nameboxBadge = this.container.querySelector('#nameboxBadge');
    this.speakerName = this.container.querySelector('#speakerName');
    this.dialogueText = this.container.querySelector('#dialogueText');
    this.ctcIndicator = this.container.querySelector('#ctcIndicator');
    this.btnQuickAuto = this.container.querySelector('#btnQuickAuto');
    this.btnQuickSkip = this.container.querySelector('#btnQuickSkip');
  }

  _initEvents() {
    // Tap / Click on dialogue card
    this.dialogueCard.addEventListener('click', (e) => {
      // Ignore if clicking on quick menu buttons
      if (e.target.closest('#quickMenuBar')) return;
      e.stopPropagation();
      this.handleUserInteraction();
    });

    // Quick Menu Buttons
    const quickBtns = this.container.querySelectorAll('.ddlc-quick-btn');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        this.onPlayClick();
        this.onQuickAction(action);
      });
    });

    // Keyboard controls (Space / Enter / ArrowRight)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
        e.preventDefault();
        this.handleUserInteraction();
      }
    });
  }

  handleUserInteraction() {
    if (this.isChoiceActive) {
      return; // Player must select an option from the choice menu
    }
    if (this.isTyping) {
      this.completeTyping();
    } else {
      this.onPlayClick();
      this.onAdvance();
    }
  }

  setDialogue(dialogueObj, isGlitching, isChoiceActive = false) {
    if (!dialogueObj) return;
    this.isChoiceActive = isChoiceActive;

    // Reset previous typing
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }

    const speaker = dialogueObj.speaker || 'Narrator';
    const charMeta = this.assetMap.characters[speaker] || this.assetMap.characters.Narrator;

    // Update Nameplate
    if (speaker === 'Narrator') {
      if (isChoiceActive) {
        this.nameboxContainer.style.display = 'flex';
        this.speakerName.textContent = "Joan (Inner Reflection)";
        this.speakerName.style.color = '#fce7f3';
      } else {
        this.nameboxContainer.style.display = 'none';
        this.speakerName.textContent = '';
      }
    } else {
      this.nameboxContainer.style.display = 'flex';
      this.speakerName.textContent = speaker;
      this.speakerName.style.color = '#ffffff';
    }

    // Toggle Glitch Textbox (Monika Corrupted style)
    if (isGlitching) {
      this.dialogueCard.classList.add('glitch-textbox');
      this.dialogueText.classList.add('text-glitch');
      this.dialogueText.setAttribute('data-text', dialogueObj.text);
    } else {
      this.dialogueCard.classList.remove('glitch-textbox');
      this.dialogueText.classList.remove('text-glitch');
      this.dialogueText.removeAttribute('data-text');
    }

    // Format Letter differently if applicable
    if (dialogueObj.isLetter) {
      this.dialogueText.className = "text-sm md:text-base font-playfair italic leading-relaxed text-amber-100/95 whitespace-pre-line";
    } else {
      this.dialogueText.className = "text-base md:text-lg lg:text-xl font-medium leading-relaxed text-slate-100";
    }

    this.currentFullText = dialogueObj.text;
    this.ctcIndicator.style.opacity = '0';

    if (isChoiceActive) {
      // During active choice decision: switch to sleek compact Cinders glass card
      this.dialogueCard.classList.add('choice-mode-card');
      this.isTyping = false;
      this.dialogueText.textContent = dialogueObj.text;
      this.dialogueText.setAttribute('data-text', dialogueObj.text);
    } else {
      this.dialogueCard.classList.remove('choice-mode-card');
      this.startTypewriter(dialogueObj.text);
    }
  }

  startTypewriter(text) {
    this.isTyping = true;
    this.dialogueText.textContent = '';
    this.dialogueText.setAttribute('data-text', '');
    let charIndex = 0;

    this.typewriterTimer = setInterval(() => {
      if (charIndex < text.length) {
        const char = text.charAt(charIndex);
        this.dialogueText.textContent += char;
        this.dialogueText.setAttribute('data-text', this.dialogueText.textContent);

        // Play gentle blip on characters
        if (charIndex % 2 === 0 && char !== ' ') {
          this.onCharTyped();
        }

        charIndex++;
      } else {
        this.completeTyping();
      }
    }, this.typingSpeed);
  }

  completeTyping() {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isTyping = false;
    this.dialogueText.textContent = this.currentFullText;
    this.dialogueText.setAttribute('data-text', this.currentFullText);
    this.ctcIndicator.style.opacity = '1';
  }

  setAutoStatus(active) {
    this.isAutoActive = active;
    if (this.btnQuickAuto) {
      if (active) {
        this.btnQuickAuto.classList.add('active');
      } else {
        this.btnQuickAuto.classList.remove('active');
      }
    }
  }

  setSkipStatus(active) {
    this.isSkipActive = active;
    if (this.btnQuickSkip) {
      if (active) {
        this.btnQuickSkip.classList.add('active');
      } else {
        this.btnQuickSkip.classList.remove('active');
      }
    }
  }
}

export default DialogueBox;
