/**
 * Visual Novel Engine Orchestrator
 * Connects Main Menu, StoryStateMachine, Audio, Particle System, and DDLC UI Components.
 */

import { StoryStateMachine } from './logic/stateMachine.js';
import { ButterflyParticleSystem } from './logic/particleSystem.js';
import { AudioManager } from './logic/audioManager.js';
import { BackgroundRenderer } from './ui/backgroundRenderer.js';
import { CharacterRenderer } from './ui/characterRenderer.js';
import { DialogueBox } from './ui/dialogueBox.js';
import { ChoiceMenu } from './ui/choiceMenu.js';
import { ItemModal } from './ui/itemModal.js';
import { HistoryModal } from './ui/historyModal.js';
import { OptionsModal } from './ui/optionsModal.js';
import { SaveLoadModal } from './ui/saveLoadModal.js';
import { MainMenu } from './ui/mainMenu.js';
import { ToastNotification } from './ui/toast.js';
import { RouteIndicator } from './ui/routeIndicator.js';
import { EndingScreen } from './ui/endingScreen.js';
import { EndingsGalleryModal } from './ui/endingsGalleryModal.js';
import { SceneTransition } from './ui/sceneTransition.js';
import { CreditScene } from './ui/creditScene.js';

class VisualNovelApp {
  constructor() {
    this.stateMachine = new StoryStateMachine();
    this.audioManager = new AudioManager();
    this.toast = new ToastNotification();

    this.isInMainMenu = true;
    this.hasGameStarted = false;
    this.glitchEnabled = true;
    this.lastParanoiaLevel = 10;
    this.currentSceneId = null;

    this.autoTimer = null;
    this.isAutoMode = false;
    this.skipTimer = null;
    this.isSkipMode = false;
    this.dialogueHistory = [];
    this.shownItems = new Set();
    this.glitchTimer = null;

    this._initDOMElements();
    this._initEngine();
    this._subscribeState();
    this._initMainMenu();
  }

  _initDOMElements() {
    this.appContainer = document.getElementById('app');
    this.bgContainer = document.getElementById('backgroundContainer');
    this.vignetteEl = document.getElementById('paranoiaVignette');
    this.particleCanvas = document.getElementById('particleCanvas');
    this.charContainer = document.getElementById('characterContainer');
    this.dialogueContainer = document.getElementById('dialogueContainer');
    this.choiceContainer = document.getElementById('choiceContainer');
    this.hudContainer = document.getElementById('hudContainer');
    this.itemModalContainer = document.getElementById('itemModalContainer');
    this.historyModalContainer = document.getElementById('historyModalContainer');
    this.saveLoadModalContainer = document.getElementById('saveLoadModalContainer');
    this.optionsModalContainer = document.getElementById('optionsModalContainer');
    this.endingModalContainer = document.getElementById('endingModalContainer');
    this.endingsGalleryModalContainer = document.getElementById('endingsGalleryModalContainer');
    this.creditsModalContainer = document.getElementById('creditsModalContainer');
    this.sceneTransitionOverlay = document.getElementById('sceneTransitionOverlay');
    this.mainMenuContainer = document.getElementById('mainMenuContainer');
  }

  _initEngine() {
    // 1. Butterfly Particles
    this.particleSystem = new ButterflyParticleSystem(this.particleCanvas);
    this.particleSystem.start();

    // 2. Background Renderer
    this.bgRenderer = new BackgroundRenderer(this.bgContainer, this.vignetteEl);

    // 3. Character Renderer
    this.charRenderer = new CharacterRenderer(this.charContainer);

    // 4. Modals
    this.itemModal = new ItemModal(
      this.itemModalContainer,
      () => this.audioManager.playBroochChime(),
      () => this.audioManager.playPageFlip()
    );

    this.historyModal = new HistoryModal(this.historyModalContainer);

    // Dramatic Ending Screen Component
    this.endingScreen = new EndingScreen(this.endingModalContainer, {
      onHover: () => this.audioManager.playHover(),
      onPlayClick: () => this.audioManager.playClick()
    });

    // Endings Gallery Modal
    this.endingsGalleryModal = new EndingsGalleryModal(this.endingsGalleryModalContainer, {
      onPlayClick: () => this.audioManager.playClick()
    });

    // Cinematic Scene Transition Interstitial
    this.sceneTransition = new SceneTransition(this.sceneTransitionOverlay, {
      onPlayChime: () => this.audioManager.playBroochChime()
    });

    // Cinematic Credits Scene Component (10-Person Production Team)
    this.creditsScene = new CreditScene(this.creditsModalContainer, {
      onHover: () => this.audioManager.playHover(),
      onPlayClick: () => this.audioManager.playClick()
    });

    // Save & Load Modal
    this.saveLoadModal = new SaveLoadModal(this.saveLoadModalContainer, {
      onSave: (slotKey) => {
        this.audioManager.playBroochChime();
        this.toast.show(`Saved to ${slotKey.replace('_', ' ').toUpperCase()}`);
      },
      onLoad: (loadedState, slotKey) => {
        this.audioManager.playClick();
        this.toast.show(`Loaded ${slotKey.replace('_', ' ').toUpperCase()}`);
        this.loadGameState(loadedState);
      },
      onPlayClick: () => this.audioManager.playClick(),
      onClose: () => {}
    });

    // Options Modal
    this.optionsModal = new OptionsModal(this.optionsModalContainer, {
      onMasterVolume: (vol) => this.audioManager.setVolume(vol),
      onBgmVolume: (vol) => this.audioManager.setBgmVolume(vol),
      onSfxVolume: (vol) => this.audioManager.setSfxVolume(vol),
      onTextSpeed: (speed) => {
        this.dialogueBox.typingSpeed = speed;
      },
      onToggleGlitch: (enabled) => {
        this.glitchEnabled = enabled;
      },
      onRestart: () => this.restartGame(),
      onPlayClick: () => this.audioManager.playClick(),
      onClose: () => {}
    });

    // 5. Choice Menu
    this.choiceMenu = new ChoiceMenu(
      this.choiceContainer,
      (optionKey) => {
        this.audioManager.playClick();
        this.clearGlitchEffects();
        this.choiceContainer.classList.add('hidden');
        this.stateMachine.selectChoice(optionKey);
      },
      () => {
        this.audioManager.playHover();
      }
    );

    // 6. Dialogue Box (Authentic DDLC Textbox & Quick Menu)
    this.dialogueBox = new DialogueBox(this.dialogueContainer, {
      onAdvance: () => this.handleAdvance(),
      onPlayClick: () => this.audioManager.playClick(),
      onCharTyped: () => this.audioManager.playTextBlip(),
      onQuickAction: (action) => this.handleQuickAction(action)
    });

    // 7. Route & HUD Navigation
    this.routeIndicator = new RouteIndicator(this.hudContainer, {
      onToggleAuto: (isActive) => this.toggleAutoPlay(isActive),
      onOpenHistory: () => this.historyModal.show(this.dialogueHistory),
      onOpenItem: () => this.inspectCurrentItem(),
      onToggleAudio: () => {
        const isMuted = this.audioManager.toggleMute();
        this.mainMenu.updateAudioStatus(isMuted);
        this.toast.show(isMuted ? 'Audio Muted' : 'Audio Enabled');
        return isMuted;
      },
      onRestart: () => this.restartGame(),
      onOpenMenu: () => this.returnToMainMenu()
    });

    // 8. Main Menu Controller
    this.mainMenu = new MainMenu(this.mainMenuContainer, {
      onNewGame: () => this.startNewGame(),
      onContinue: () => this.continueGame(),
      onOpenGallery: () => this.openEndingsGallery(),
      onLoadGame: () => this.openLoadMenu(),
      onSaveGame: () => this.openSaveMenu(),
      onOptions: () => this.openOptionsMenu(),
      onExit: () => this.handleExitGame(),
      onToggleAudio: (forcedMuteState) => {
        let isMuted;
        if (typeof forcedMuteState === 'boolean') {
          this.audioManager.isMuted = forcedMuteState;
          if (this.audioManager.masterGain && this.audioManager.ctx) {
            const now = this.audioManager.ctx.currentTime;
            this.audioManager.masterGain.gain.setValueAtTime(forcedMuteState ? 0 : this.audioManager.volume, now);
          }
          isMuted = forcedMuteState;
        } else {
          isMuted = this.audioManager.toggleMute();
        }
        this.routeIndicator.syncAudio(isMuted);
        this.toast.show(isMuted ? 'Audio Muted' : 'Audio Enabled');
        return isMuted;
      },
      onHover: () => this.audioManager.playHover(),
      onPlayClick: () => this.audioManager.playClick()
    });

    // Window resize handler for mobile/desktop layout
    window.addEventListener('resize', () => {
      if (!this.isInMainMenu) {
        const currentDialogue = this.stateMachine.getCurrentDialogue();
        const currentScene = this.stateMachine.getCurrentScene();
        this.charRenderer.render(currentDialogue, currentScene, this.stateMachine.state.isGlitching);
      }
    });
  }

  closeAllModals() {
    if (this.optionsModal) this.optionsModal.hide();
    if (this.endingsGalleryModal) this.endingsGalleryModal.hide();
    if (this.saveLoadModal) this.saveLoadModal.hide();
    if (this.historyModal) this.historyModal.hide();
    if (this.itemModal) this.itemModal.hide();
    if (this.endingScreen) this.endingScreen.hide();
    if (this.creditsScene) this.creditsScene.hide();
  }

  _initMainMenu() {
    this.isInMainMenu = true;
    this.currentSceneId = null;
    this.closeAllModals();
    const autoSaveData = this.stateMachine.getAutoSaveData();
    const unlockedEndings = this.stateMachine.state.unlockedEndings || [];
    this.mainMenu.show(autoSaveData, unlockedEndings);
    this.hudContainer.classList.add('hidden');
    this.dialogueContainer.classList.add('hidden');
    this.choiceContainer.classList.add('hidden');
    if (this.charRenderer) this.charRenderer.clear();
    if (this.charContainer) {
      this.charContainer.classList.add('hidden');
      this.charContainer.innerHTML = '';
    }
    if (this.bgRenderer) this.bgRenderer.updateParanoiaVignette(10, false);
    // Stop story synth BGM so audio comes directly from the homescreen video
    this.audioManager.stopBgm();
  }

  startNewGame() {
    // Ensure Web Audio context is initialized upon "Begin Story" (satisfying mobile/desktop autoplay policies)
    this.audioManager.ensureContext();

    this.isInMainMenu = false;
    this.hasGameStarted = true;
    this.currentSceneId = null;
    this.closeAllModals();
    this.mainMenu.hide();
    this.hudContainer.classList.remove('hidden');
    if (this.charContainer) {
      this.charContainer.classList.remove('hidden');
    }

    this.stopAutoPlay();
    this.stopSkipMode();
    this.dialogueHistory = [];
    this.shownItems.clear();
    this.lastParanoiaLevel = 10;
    this.stateMachine.resetGame();

    this.renderCurrentState(this.stateMachine.getState());
  }

  continueGame() {
    const loaded = this.stateMachine.loadAutoSave();
    if (loaded) {
      this.audioManager.ensureContext();
      this.toast.show('Progress restored from Auto-Save');
      this.loadGameState(this.stateMachine.getState());
    } else {
      this.toast.show('No saved progress found');
    }
  }

  openEndingsGallery() {
    this.audioManager.playClick();
    const unlockedEndings = this.stateMachine.state.unlockedEndings || [];
    this.endingsGalleryModal.show(unlockedEndings);
  }

  openLoadMenu() {
    const currentState = this.stateMachine.getState();
    const currentScene = this.stateMachine.getCurrentScene();
    const currentDialogue = this.stateMachine.getCurrentDialogue();
    this.saveLoadModal.show('load', currentState, currentScene, currentDialogue);
  }

  openSaveMenu() {
    if (!this.hasGameStarted) {
      this.toast.show('Start a New Game or Load a Save first');
      return;
    }
    const currentState = this.stateMachine.getState();
    const currentScene = this.stateMachine.getCurrentScene();
    const currentDialogue = this.stateMachine.getCurrentDialogue();
    this.saveLoadModal.show('save', currentState, currentScene, currentDialogue);
  }

  openOptionsMenu() {
    this.optionsModal.show({
      masterVolume: this.audioManager.volume,
      bgmVolume: this.audioManager.bgmVolume,
      sfxVolume: this.audioManager.sfxVolume,
      textSpeed: this.dialogueBox.typingSpeed,
      glitchEnabled: this.glitchEnabled
    });
  }

  handleExitGame() {
    if (confirm('Are you sure you want to quit the game?')) {
      this.returnToMainMenu();
      this.toast.show('Thank you for playing Yet the Butterflies Flutter Away');
    }
  }

  returnToMainMenu() {
    this.stopAutoPlay();
    this.stopSkipMode();
    this.clearGlitchEffects();
    this.closeAllModals();
    this.isInMainMenu = true;
    this.currentSceneId = null;

    this.hudContainer.classList.add('hidden');
    this.dialogueContainer.classList.add('hidden');
    this.choiceContainer.classList.add('hidden');

    if (this.charRenderer) this.charRenderer.clear();
    if (this.charContainer) {
      this.charContainer.classList.add('hidden');
      this.charContainer.innerHTML = '';
    }
    if (this.bgRenderer) this.bgRenderer.updateParanoiaVignette(10, false);

    const autoSaveData = this.stateMachine.getAutoSaveData();
    const unlockedEndings = this.stateMachine.state.unlockedEndings || [];
    this.mainMenu.show(autoSaveData, unlockedEndings);
    // Stop story synth BGM so audio comes directly from the homescreen video
    this.audioManager.stopBgm();
  }

  loadGameState(savedState) {
    this.audioManager.ensureContext();
    this.isInMainMenu = false;
    this.hasGameStarted = true;
    this.currentSceneId = null;
    this.closeAllModals();
    this.mainMenu.hide();
    this.hudContainer.classList.remove('hidden');
    if (this.charContainer) {
      this.charContainer.classList.remove('hidden');
    }

    this.stopAutoPlay();
    this.stopSkipMode();

    this.stateMachine.state = {
      ...this.stateMachine.state,
      ...savedState
    };
    this.stateMachine._handleSceneEntrance(this.stateMachine.state.currentScene);
    this.renderCurrentState(this.stateMachine.getState());
  }

  _subscribeState() {
    this.stateMachine.subscribe((state) => {
      if (!this.isInMainMenu) {
        this.renderCurrentState(state);
      }
    });
  }

  renderCurrentState(state) {
    if (this.isInMainMenu) return;

    const scene = this.stateMachine.getCurrentScene();
    const dialogue = this.stateMachine.getCurrentDialogue();

    if (!scene) return;

    // Check if moving to a new scene/chapter to trigger cinematic fade-to-black interstitial
    const isNewScene = this.currentSceneId !== state.currentScene;
    if (isNewScene) {
      this.currentSceneId = state.currentScene;
      this.stopAutoPlay();
      this.stopSkipMode();
      this.clearGlitchEffects();
      this.choiceContainer.classList.add('hidden');
      this.dialogueContainer.classList.add('hidden');

      this.sceneTransition.play(scene.title, () => {
        this._renderSceneComponents(state, scene, this.stateMachine.getCurrentDialogue());
      });
      return;
    }

    this._renderSceneComponents(state, scene, dialogue);
  }

  _renderSceneComponents(state, scene, dialogue) {
    // 1. Background & Paranoia Vignette
    const bgKey = (dialogue && dialogue.background) || scene.background;
    this.bgRenderer.setBackground(bgKey);
    this.bgRenderer.updateParanoiaVignette(state.paranoiaLevel, state.isGlitching);

    // Detect paranoia increase: trigger heartbeat sound, visual throb, and phone haptic vibration
    if (state.paranoiaLevel > this.lastParanoiaLevel) {
      this.audioManager.playHeartbeat();
      if (this.appContainer) {
        this.appContainer.classList.add('paranoia-spike');
        setTimeout(() => {
          if (this.appContainer) this.appContainer.classList.remove('paranoia-spike');
        }, 450);
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([50, 30, 50]);
        } catch (e) {}
      }
    }
    this.lastParanoiaLevel = state.paranoiaLevel;

    // 2. Audio Atmosphere Management
    this._updateBgm(state, scene, dialogue);

    // 3. Characters Rendering
    this.charRenderer.render(dialogue, scene, state.isGlitching);

    // 4. Record to dialogue history if dialogue is valid
    if (dialogue) {
      const last = this.dialogueHistory[this.dialogueHistory.length - 1];
      if (!last || last.id !== dialogue.id) {
        this.dialogueHistory.push({
          id: dialogue.id,
          sceneTitle: scene.title,
          speaker: dialogue.speaker,
          text: dialogue.text
        });
      }
    }

    // 5. Dialogue Box, Choice Menu, or Dramatic Ending Screen
    const isAtEnd = this.stateMachine.isAtSceneEnd();
    const choice = this.stateMachine.getCurrentChoice();

    if (choice) {
      // Waiting for Choice selection:
      // Hide dialogue container so the question bubble and answers sit cleanly at the bottom,
      // leaving the character's face completely visible in the center!
      this.stopAutoPlay();
      this.stopSkipMode();
      this.endingScreen.hide();
      this.dialogueContainer.classList.add('hidden');
      const contextData = this._getChoiceContext(scene);
      this.choiceMenu.render(choice, false, null, contextData);
    } else if (state.isEndingReached && isAtEnd && !scene.isEpilogue) {
      // Ending concluded: show Dramatic Ending Screen with authentic Ending Video from Backgrounds/ folder
      this.stopAutoPlay();
      this.stopSkipMode();
      this.choiceMenu.render(null, false);
      this.dialogueContainer.classList.add('hidden');
      this.audioManager.stopBgm();
      this.endingScreen.show(scene, () => {
        this.audioManager.playClick();
        this.stateMachine.proceedToEpilogue();
      });
    } else {
      this.choiceMenu.render(null, false);
      this.endingScreen.hide();
      this.dialogueContainer.classList.remove('hidden');
      this.dialogueBox.setDialogue(dialogue, state.isGlitching, false);
    }

    // 6. Item Pop-up Trigger (First time discovery)
    if (dialogue && dialogue.item && !this.shownItems.has(dialogue.item)) {
      this.shownItems.add(dialogue.item);
      setTimeout(() => {
        this.itemModal.showItem(dialogue.item);
      }, 700);
    }

    // 7. Glitch Jumpscare & Camera Zoom Trigger
    if (this.glitchEnabled && dialogue && dialogue.glitchEffect) {
      this.triggerGlitchJumpscare();
    } else {
      this.clearGlitchEffects();
    }

    // 8. Update HUD & Route Indicators
    this.routeIndicator.update(state, scene);

    // 9. Auto Play Timer
    if (this.isAutoMode && !choice && (!state.isEndingReached || !isAtEnd)) {
      this._scheduleAutoNext(dialogue ? dialogue.text : '');
    }

    // 10. Skip Mode Timer
    if (this.isSkipMode && !choice && (!state.isEndingReached || !isAtEnd)) {
      this._scheduleSkipNext();
    }
  }

  triggerGlitchJumpscare() {
    this.audioManager.playGlitchJumpscare();

    if (this.appContainer) {
      this.appContainer.classList.add('glitch-active');
    }
    if (this.bgContainer) {
      this.bgContainer.classList.add('camera-zoom-glitch');
    }
    if (this.charContainer) {
      this.charContainer.classList.add('camera-zoom-glitch');
    }

    // Smartphone Haptic Vibration Feedback for Glitch Manipulation
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([50, 30, 50]);
      } catch (e) {}
    }

    // Reset temporary zoom after 650ms
    if (this.glitchTimer) clearTimeout(this.glitchTimer);
    this.glitchTimer = setTimeout(() => {
      if (!this.stateMachine.state.isGlitching) {
        this.clearGlitchEffects();
      }
    }, 650);
  }

  clearGlitchEffects() {
    if (this.appContainer) this.appContainer.classList.remove('glitch-active');
    if (this.bgContainer) this.bgContainer.classList.remove('camera-zoom-glitch');
    if (this.charContainer) this.charContainer.classList.remove('camera-zoom-glitch');
  }

  _updateBgm(state, scene, dialogue) {
    if (scene.isEnding || scene.isEpilogue) {
      this.audioManager.playBgm('truth_and_tears');
    } else if (state.paranoiaLevel >= 60 || (dialogue && dialogue.glitchEffect)) {
      this.audioManager.playBgm('rising_paranoia');
    } else if (scene.id === 'scene_1b' || (scene.id === 'scene_1a' && state.dialogueIndex < 8)) {
      this.audioManager.playBgm('peaceful_hearth');
    } else {
      this.audioManager.playBgm('abyss_whispers');
    }
  }

  _getChoiceContext(scene) {
    if (!scene || !scene.dialogues || scene.dialogues.length === 0) return null;
    const len = scene.dialogues.length;
    const lastDiag = scene.dialogues[len - 1];
    const prevDiag = len >= 2 ? scene.dialogues[len - 2] : null;

    let characterLine = null;
    let narratorLine = null;

    if (lastDiag) {
      if (lastDiag.speaker === 'Narrator') {
        narratorLine = lastDiag.text;
        if (prevDiag && prevDiag.speaker !== 'Narrator') {
          characterLine = {
            speaker: prevDiag.speaker,
            text: prevDiag.text
          };
        }
      } else {
        characterLine = {
          speaker: lastDiag.speaker,
          text: lastDiag.text
        };
        if (prevDiag && prevDiag.speaker === 'Narrator') {
          narratorLine = prevDiag.text;
        }
      }
    }

    return { characterLine, narratorLine };
  }

  startCreditsScene() {
    this.stopAutoPlay();
    this.stopSkipMode();
    this.clearGlitchEffects();
    this.closeAllModals();

    this.hudContainer.classList.add('hidden');
    this.dialogueContainer.classList.add('hidden');
    this.choiceContainer.classList.add('hidden');

    if (this.charContainer) {
      this.charContainer.classList.add('hidden');
      this.charContainer.innerHTML = '';
    }
    if (this.charRenderer) {
      this.charRenderer.clear();
    }

    // Play touching truth_and_tears BGM for credits
    this.audioManager.playBgm('truth_and_tears');

    this.creditsScene.show(() => {
      this.returnToMainMenu();
      this.toast.show('Thank you for playing Yet the Butterflies Flutter Away');
    });
  }

  handleAdvance() {
    if (this.isSkipMode) {
      this.stopSkipMode();
    }
    const scene = this.stateMachine.getCurrentScene();
    if (scene && scene.isEpilogue && this.stateMachine.isAtSceneEnd()) {
      this.startCreditsScene();
      return;
    }
    this.stateMachine.next();
  }

  handleQuickAction(action) {
    switch (action) {
      case 'history':
        this.historyModal.show(this.dialogueHistory);
        break;

      case 'skip':
        this.toggleSkipMode();
        break;

      case 'auto':
        this.toggleAutoPlay(!this.isAutoMode);
        break;

      case 'save':
        this.openSaveMenu();
        break;

      case 'load':
        this.openLoadMenu();
        break;

      case 'settings':
        this.openOptionsMenu();
        break;
    }
  }

  inspectCurrentItem() {
    const state = this.stateMachine.getState();
    if (state.activeItem) {
      this.itemModal.showItem(state.activeItem);
    } else if (state.hasBrooch) {
      this.itemModal.showItem('silver_butterfly_brooch');
    }
  }

  toggleAutoPlay(isActive) {
    this.isAutoMode = isActive;
    this.dialogueBox.setAutoStatus(this.isAutoMode);
    this.routeIndicator.updateAutoStatus(this.isAutoMode);

    if (this.isAutoMode) {
      this.stopSkipMode();
      this.toast.show('Auto Mode: On');
      const diag = this.stateMachine.getCurrentDialogue();
      this._scheduleAutoNext(diag ? diag.text : '');
    } else {
      this.toast.show('Auto Mode: Off');
      this.stopAutoPlay();
    }
  }

  _scheduleAutoNext(text = '') {
    if (this.autoTimer) clearTimeout(this.autoTimer);
    const readDelay = Math.max(2000, 1500 + text.length * 30);
    this.autoTimer = setTimeout(() => {
      if (this.isAutoMode) {
        if (!this.dialogueBox.isTyping) {
          const scene = this.stateMachine.getCurrentScene();
          if (scene && scene.isEpilogue && this.stateMachine.isAtSceneEnd()) {
            this.startCreditsScene();
          } else {
            this.stateMachine.next();
          }
        } else {
          this.dialogueBox.completeTyping();
          this._scheduleAutoNext(text);
        }
      }
    }, readDelay);
  }

  stopAutoPlay() {
    this.isAutoMode = false;
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
    this.dialogueBox.setAutoStatus(false);
    this.routeIndicator.updateAutoStatus(false);
  }

  toggleSkipMode() {
    this.isSkipMode = !this.isSkipMode;
    this.dialogueBox.setSkipStatus(this.isSkipMode);

    if (this.isSkipMode) {
      this.stopAutoPlay();
      this.toast.show('Skipping Dialogue...');
      this._scheduleSkipNext();
    } else {
      this.stopSkipMode();
    }
  }

  _scheduleSkipNext() {
    if (this.skipTimer) clearTimeout(this.skipTimer);
    this.skipTimer = setTimeout(() => {
      if (this.isSkipMode) {
        if (this.dialogueBox.isTyping) {
          this.dialogueBox.completeTyping();
        }
        const scene = this.stateMachine.getCurrentScene();
        if (scene && scene.isEpilogue && this.stateMachine.isAtSceneEnd()) {
          this.stopSkipMode();
          this.startCreditsScene();
          return;
        }
        const hasNext = this.stateMachine.next();
        if (!hasNext || this.stateMachine.isWaitingForChoice()) {
          this.stopSkipMode();
        }
      }
    }, 70);
  }

  stopSkipMode() {
    this.isSkipMode = false;
    if (this.skipTimer) {
      clearTimeout(this.skipTimer);
      this.skipTimer = null;
    }
    this.dialogueBox.setSkipStatus(false);
  }

  restartGame() {
    this.startNewGame();
    this.toast.show('Story Reset to Prologue');
  }
}

// Start visual novel application once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.vnApp = new VisualNovelApp();
});
