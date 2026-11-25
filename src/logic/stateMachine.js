/**
 * State Machine Engine for "Yet the Butterflies Flutter Away"
 * Fully implements the branching narrative, psychological paranoia mechanics,
 * conditional routes, and exact state rules from agent.md.
 */

import { storyData } from '../data/storyData.js';
import { assetMap } from '../data/assetMap.js';

export const INITIAL_STATE = {
  currentScene: 'prologue',
  dialogueIndex: 0,
  knowsEmiliaSecret: false,
  returnTo2B: false,
  hasBrooch: false,
  paranoiaLevel: 10, // Clamped between 0 and 100
  history: [],
  unlockedEndings: [],
  activeItem: null,
  isGlitching: false,
  isEndingReached: false,
  isCompleted: false
};

export class StoryStateMachine {
  constructor(initialState = {}) {
    // Load persistent unlocked endings from localStorage
    let persistentEndings = [];
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('butterflies_unlocked_endings');
        if (stored) persistentEndings = JSON.parse(stored);
      } catch (e) {}
    }

    this.state = {
      ...INITIAL_STATE,
      unlockedEndings: persistentEndings,
      ...initialState
    };
    this.listeners = new Set();
    this.storyData = storyData;
    this.assetMap = assetMap;

    // Apply entrance hooks for starting scene
    this._handleSceneEntrance(this.state.currentScene);
  }

  /**
   * Subscribe to state change notifications (observer pattern)
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(currentState);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    }
  }

  getState() {
    return { ...this.state };
  }

  getCurrentScene() {
    return this.storyData[this.state.currentScene] || null;
  }

  getCurrentDialogue() {
    const scene = this.getCurrentScene();
    if (!scene || !scene.dialogues) return null;
    return scene.dialogues[this.state.dialogueIndex] || null;
  }

  isAtSceneEnd() {
    const scene = this.getCurrentScene();
    if (!scene || !scene.dialogues) return true;
    return this.state.dialogueIndex >= scene.dialogues.length - 1;
  }

  getCurrentChoice() {
    const scene = this.getCurrentScene();
    if (!scene) return null;

    // If scene has a choice and we're at or beyond dialogue end
    if (scene.choice && this.isAtSceneEnd()) {
      return scene.choice;
    }
    return null;
  }

  isWaitingForChoice() {
    return this.getCurrentChoice() !== null;
  }

  /**
   * Clamp paranoiaLevel between 0 and 100
   */
  _modifyParanoia(delta) {
    if (!delta || typeof delta !== 'number') return;
    const prev = this.state.paranoiaLevel;
    const next = Math.max(0, Math.min(100, prev + delta));
    this.state.paranoiaLevel = next;

    // If on device with vibration API and paranoia is high or spiking
    if (delta >= 10 && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch (e) {}
    }
  }

  /**
   * Scene entrance rules according to agent.md
   */
  _handleSceneEntrance(sceneId) {
    // Rule: Scene 2B: Saat pemain masuk ke adegan ini, otomatis set knowsEmiliaSecret = true
    if (sceneId === 'scene_2b') {
      this.state.knowsEmiliaSecret = true;
    }

    // Rule: Scene 2A servant gives the brooch -> hasBrooch = true
    if (sceneId === 'scene_2a') {
      this.state.hasBrooch = true;
    }

    // Ending check
    const scene = this.storyData[sceneId];
    if (scene && scene.isEnding) {
      this.state.isEndingReached = true;
      if (!this.state.unlockedEndings.includes(sceneId)) {
        this.state.unlockedEndings.push(sceneId);
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem('butterflies_unlocked_endings', JSON.stringify(this.state.unlockedEndings));
          } catch (e) {}
        }
      }
    }

    if (scene && scene.isEpilogue) {
      this.state.isCompleted = true;
    }
  }

  /**
   * Advance to next dialogue or handle automatic scene transitions
   */
  next() {
    const scene = this.getCurrentScene();
    if (!scene) return false;

    const currentDialogue = this.getCurrentDialogue();

    // 1. Check special condition: Choice 2B Option C returnTo2B logic:
    // "Set returnTo2B = true, arahkan ke Scene 1A, dan setelah dialog dengan Aflania selesai
    // ('For that evening, they were at peace.'), otomatis arahkan ke Scene 2B."
    if (this.state.currentScene === 'scene_1a' && this.state.returnTo2B) {
      if (currentDialogue && currentDialogue.text.includes('For that evening, they were at peace.')) {
        // Transition directly to scene_2b
        this.state.returnTo2B = false; // reset flag
        this.goToScene('scene_2b', 0);
        return true;
      }
    }

    // 2. Check if we are at the end of the dialogues
    if (this.isAtSceneEnd()) {
      // If there's a choice, user must select choice
      if (scene.choice) {
        return false;
      }

      // If it's a conditional transition scene (Scene 3B or Scene 3C):
      // "Periksa nilai knowsEmiliaSecret. Jika true, arahkan ke Scene 4A. Jika false, arahkan ke Scene 3."
      if (scene.transition && scene.transition.conditionalTarget) {
        const nextScene = this.state.knowsEmiliaSecret ? 'scene_4a' : 'scene_3';
        this.goToScene(nextScene, 0);
        return true;
      }

      // If it's an ending scene, user should click proceed to epilogue
      if (scene.isEnding) {
        return false;
      }

      return false;
    }

    // Normal dialogue increment
    this.state.dialogueIndex += 1;
    const newDialogue = this.getCurrentDialogue();

    if (newDialogue) {
      // Apply dialogue paranoia delta
      if (newDialogue.paranoiaDelta) {
        this._modifyParanoia(newDialogue.paranoiaDelta);
      }

      // Trigger glitch state
      this.state.isGlitching = !!newDialogue.glitchEffect;

      // Update active item if any
      this.state.activeItem = newDialogue.item || null;
    }

    this.autoSave();
    this._notify();
    return true;
  }

  /**
   * Step backward in the current scene's dialogues
   */
  previous() {
    if (this.state.dialogueIndex > 0) {
      this.state.dialogueIndex -= 1;
      const currentDialogue = this.getCurrentDialogue();
      if (currentDialogue) {
        this.state.isGlitching = !!currentDialogue.glitchEffect;
        this.state.activeItem = currentDialogue.item || null;
      }
      this._notify();
      return true;
    }
    return false;
  }

  /**
   * Handle user choice selection
   */
  selectChoice(optionKey) {
    const choice = this.getCurrentChoice();
    if (!choice) {
      console.warn('selectChoice called but no choice is active.');
      return false;
    }

    const option = choice.options.find(opt => opt.key === optionKey);
    if (!option) {
      console.error(`Invalid option key: ${optionKey}`);
      return false;
    }

    // Record in history
    this.state.history.push({
      choiceId: choice.id,
      prompt: choice.prompt,
      selectedKey: option.key,
      selectedText: option.text,
      fromScene: this.state.currentScene,
      targetScene: option.targetScene,
      paranoiaAtDecision: this.state.paranoiaLevel
    });

    // Apply option paranoia delta
    if (option.paranoiaDelta) {
      this._modifyParanoia(option.paranoiaDelta);
    }

    // Special flag: Choice 2B Option C returnTo2B
    if (option.returnTo2B) {
      this.state.returnTo2B = true;
    }

    // Transition to target scene
    this.goToScene(option.targetScene, 0);
    return true;
  }

  /**
   * Direct scene transition with entrance hooks
   */
  goToScene(sceneId, initialDialogueIndex = 0) {
    if (!this.storyData[sceneId]) {
      console.error(`Target scene "${sceneId}" does not exist in storyData.`);
      return false;
    }

    this.state.currentScene = sceneId;
    this.state.dialogueIndex = initialDialogueIndex;
    this.state.isGlitching = false;

    // Apply scene-specific entrance rules
    this._handleSceneEntrance(sceneId);

    // Initial dialogue setup
    const dialogue = this.getCurrentDialogue();
    if (dialogue) {
      if (dialogue.paranoiaDelta) {
        this._modifyParanoia(dialogue.paranoiaDelta);
      }
      this.state.isGlitching = !!dialogue.glitchEffect;
      this.state.activeItem = dialogue.item || null;
    }

    this.autoSave();
    this._notify();
    return true;
  }

  /**
   * Automatic Game Progress Saver (LocalStorage)
   * Saves currentScene, dialogueIndex, all state variables, timestamp, and scene metadata
   */
  autoSave() {
    if (typeof localStorage === 'undefined') return;
    try {
      const scene = this.getCurrentScene();
      const payload = {
        state: { ...this.state },
        timestamp: Date.now(),
        sceneTitle: scene ? scene.title : 'Prologue',
        dateFormatted: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      localStorage.setItem('butterflies_autosave', JSON.stringify(payload));
    } catch (e) {
      console.warn('AutoSave error:', e);
    }
  }

  getAutoSaveData() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('butterflies_autosave');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  loadAutoSave() {
    const autoSave = this.getAutoSaveData();
    if (!autoSave || !autoSave.state) return false;
    this.state = {
      ...INITIAL_STATE,
      ...autoSave.state
    };
    this._handleSceneEntrance(this.state.currentScene);
    this._notify();
    return true;
  }

  /**
   * Proceed from Ending to Epilogue
   */
  proceedToEpilogue() {
    return this.goToScene('epilogue', 0);
  }

  /**
   * Reset game to initial state, keeping unlocked endings
   */
  resetGame() {
    const unlocked = [...this.state.unlockedEndings];
    this.state = {
      ...INITIAL_STATE,
      unlockedEndings: unlocked
    };
    this._handleSceneEntrance(this.state.currentScene);
    this.autoSave();
    this._notify();
  }

  /**
   * LocalStorage persistence
   */
  saveToStorage(slot = 'quicksave') {
    if (typeof localStorage === 'undefined') return false;
    try {
      const payload = JSON.stringify(this.state);
      localStorage.setItem(`butterflies_save_${slot}`, payload);
      return true;
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
      return false;
    }
  }

  loadFromStorage(slot = 'quicksave') {
    if (typeof localStorage === 'undefined') return false;
    try {
      const payload = localStorage.getItem(`butterflies_save_${slot}`);
      if (!payload) return false;
      const loaded = JSON.parse(payload);
      this.state = {
        ...INITIAL_STATE,
        ...loaded
      };
      this._handleSceneEntrance(this.state.currentScene);
      this._notify();
      return true;
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
      return false;
    }
  }
}

export default StoryStateMachine;
