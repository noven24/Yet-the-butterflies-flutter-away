
/**
 * First-Person POV Character Sprite Renderer
 * General Joan is the camera / viewpoint; interlocutors stand centered facing the player,
 * exactly like the dialogue perspective in classic visual novels (e.g. Cinders).
 * Features DDLC composite layering, subtle idle breathing animation,
 * mouse parallax, and persistence through narration and choice prompts.
 */

import { assetMap } from '../data/assetMap.js';

export class CharacterRenderer {
  constructor(containerElement) {
    this.container = containerElement;
    this.assetMap = assetMap;
    this.parallaxX = 0;
    this.parallaxY = 0;
    this.currentSceneId = null;
    this.activeInterlocutor = null;
    this.activeExpression = 'peaceful';

    this._initParallax();
  }

  _initParallax() {
    window.addEventListener('mousemove', (e) => {
      // Only apply parallax on desktop/tablet screens
      if (window.innerWidth >= 768) {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        this.parallaxX = normX * 16;
        this.parallaxY = normY * 10;
        this._applyParallax();
      }
    });
  }

  _applyParallax() {
    const centerChar = this.container.querySelector('.char-parallax');

    if (centerChar && window.innerWidth >= 768) {
      centerChar.style.transform = `translate(${this.parallaxX * 0.5}px, ${this.parallaxY * 0.3}px)`;
    }
  }

  /**
   * Render active characters based on current dialogue line and scene context.
   * General Joan is the first-person POV viewpoint/camera. Joan is NEVER shown as a sprite.
   * Only other characters facing Joan (interlocutors) are rendered in front of the camera.
   */
  render(currentDialogue, currentScene, isGlitching) {
    const sceneId = currentScene ? currentScene.id : '';
    const speaker = (currentDialogue ? currentDialogue.speaker : '') || '';
    const rawExpr = (currentDialogue && currentDialogue.expression) || 'peaceful';

    // Track scene transitions
    if (this.currentSceneId !== sceneId) {
      this.currentSceneId = sceneId;
      this.activeInterlocutor = null;
      this.activeExpression = 'peaceful';
    }

    // Determine interlocutor facing Joan
    let charName = null;

    if (speaker && speaker !== 'Narrator' && speaker.toLowerCase() !== 'joan') {
      // 1. Another character is speaking directly to Joan
      charName = speaker;
      this.activeInterlocutor = speaker;
      this.activeExpression = rawExpr;
    } else {
      // 2. Joan is speaking, Narrator is narrating, or awaiting player choice:
      // General Joan looks out through his own eyes at the conversational partner present
      const scenePartner = this._getSceneDefaultInterlocutor(sceneId, currentDialogue);

      if (scenePartner && scenePartner.toLowerCase() !== 'joan') {
        charName = scenePartner;
        this.activeInterlocutor = scenePartner;
      } else if (this.activeInterlocutor && this.activeInterlocutor.toLowerCase() !== 'joan') {
        charName = this.activeInterlocutor;
      } else {
        // Joan is alone (monologue, reflection, terrace observation)
        charName = null;
        this.activeInterlocutor = null;
      }
    }

    // Strict POV Guard: General Joan is ALWAYS the first-person camera, never render Joan
    if (!charName || charName.toLowerCase() === 'joan') {
      this.container.innerHTML = '';
      return;
    }

    const isSpeaker = speaker === charName;
    const expressionToUse = isSpeaker ? rawExpr : (this.activeExpression || 'peaceful');
    const spriteContent = this._renderSpriteContent(
      charName,
      expressionToUse,
      isGlitching && charName === 'Laqquo'
    );

    this.container.innerHTML = `
      <div class="char-positioner absolute bottom-0 inset-x-0 flex items-end justify-center pointer-events-none overflow-hidden h-full">
        <div class="char-parallax relative flex items-end justify-center h-full pointer-events-none transition-transform duration-100 ease-out">
          <div class="char-center ddlc-breathe relative flex justify-center items-end w-auto max-w-[125vw] sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[50vw] pointer-events-none transition-all duration-300 ${isSpeaker ? 'sprite-speaker' : 'sprite-listener'}" style="filter: drop-shadow(0 20px 45px rgba(0,0,0,0.85));">
            ${spriteContent}
          </div>
        </div>
      </div>
    `;
    this._applyParallax();
  }

  _getSceneDefaultInterlocutor(sceneId, dialogue) {
    if (sceneId === 'prologue') {
      const dIdx = dialogue ? parseInt(dialogue.id.split('_d')[1], 10) || 0 : 0;
      // Lines 0-3: Joan stands alone on terrace overlooking festival bells -> no sprite (first-person view)
      if (dIdx < 4) return null;
      // Lines 4-17: Lieutenant Laqquo conversing with Joan on terrace
      if (dIdx <= 17) return 'Laqquo';
      // Lines 18-19: Joan alone on rooftop, walking back to chamber -> no sprite
      if (dIdx <= 19) return null;
      // Lines 20+: Lady Aflania is waiting in the room
      return 'Aflania';
    }

    if (sceneId === 'scene_1a' || sceneId === 'scene_1b') {
      const dIdx = dialogue ? parseInt(dialogue.id.split('_d')[1], 10) || 0 : 0;
      if (dIdx >= 14) return 'Laqquo';
      return 'Aflania';
    }

    if (sceneId === 'scene_1c') {
      const dIdx = dialogue ? parseInt(dialogue.id.split('_d')[1], 10) || 0 : 0;
      if (dIdx >= 10) return 'Emilia';
      return 'Aflania';
    }

    if (sceneId === 'scene_2a') {
      const dIdx = dialogue ? parseInt(dialogue.id.split('_d')[1], 10) || 0 : 0;
      if (dIdx >= 9) return 'Servant';
      return 'Cassian';
    }

    if (sceneId === 'scene_2b') {
      return 'Emilia';
    }

    if (sceneId === 'scene_2c') {
      return 'Laqquo';
    }

    if (sceneId === 'scene_3') {
      return this.activeInterlocutor || 'Aflania';
    }

    if (sceneId === 'scene_3b') {
      return 'Aflania';
    }

    if (sceneId === 'scene_3c') {
      return 'Servant';
    }

    if (sceneId === 'scene_3d') {
      return 'Laqquo';
    }

    if (sceneId === 'scene_4a') {
      return this.activeInterlocutor || 'Emilia';
    }

    if (sceneId === 'scene_4b') {
      return 'Aflania';
    }

    if (sceneId === 'ending_a' || sceneId === 'ending_c' || sceneId === 'ending_d') {
      return 'Aflania';
    }

    if (sceneId === 'ending_b') {
      return 'Laqquo';
    }

    if (sceneId === 'ending_e') {
      // Joan alone reading letter -> no sprite
      return null;
    }

    if (sceneId === 'epilogue') {
      const dIdx = dialogue ? parseInt(dialogue.id.split('_d')[1], 10) || 0 : 0;
      // Lines 0-6: Young Officer questioning Joan at military academy
      if (dIdx <= 6) return 'Young Officer';
      // Lines 7+: Joan reflecting alone in the evening -> no sprite
      return null;
    }

    return null;
  }

  /**
   * Resolve sprite file path from asset folder based on character name and emotion
   */
  _getSpriteSrc(charName, expression = 'peaceful') {
    const name = (charName || '').toLowerCase().trim();
    const expr = (expression || '').toLowerCase().trim();

    // 1. Lady Aflania (Alfania)
    if (name === 'aflania' || name === 'alfania') {
      const isSad = ['sad', 'wounded', 'heartbroken', 'firm', 'guilty', 'hesitant'].includes(expr);
      return isSad ? 'asset/character_alfania/Alfania_sad.png' : 'asset/character_alfania/Alfania_happy.png';
    }

    // 2. Lieutenant Laqquo
    if (name === 'laqquo') {
      const isSad = ['sad', 'concerned', 'sharp', 'hostile', 'glitch_extreme', 'glitch_level1', 'glitch_level2', 'glitch_level3'].includes(expr);
      return isSad ? 'asset/character_Laqquo/Laqquo_sad.png' : 'asset/character_Laqquo/Laqquo_happy.png';
    }

    // 3. Officer Cassian & Academy Young Officer
    if (name === 'cassian' || name === 'young officer') {
      const isSad = ['sad', 'wounded', 'troubled'].includes(expr);
      return isSad ? 'asset/character_cassian/cassian_sad.png' : 'asset/character_cassian/cassian_happy.png';
    }

    // 4. Emilia & Castle Servant
    if (name === 'emilia' || name === 'servant') {
      const isSad = ['sad', 'hesitant', 'guilty', 'wounded'].includes(expr);
      return isSad ? 'asset/character_emilia/Emilia_sad.png' : 'asset/character_emilia/Emilia_happy.png';
    }

    // 5. General Joan
    if (name === 'joan') {
      if (['angry', 'hostile', 'furious', 'sharp'].includes(expr)) {
        return 'asset/Character_Joan/Joan_angry.png';
      }
      if (['sad', 'heartbroken', 'wounded', 'grief', 'melancholic'].includes(expr)) {
        return 'asset/Character_Joan/Joan_sad.png';
      }
      return 'asset/Character_Joan/Joan_happy.png';
    }

    return 'asset/character_alfania/Alfania_happy.png';
  }

  /**
   * Render individual character sprite, using authentic asset images provided in asset folder
   */
  _renderSpriteContent(charName, expression, isGlitching) {
    const src = this._getSpriteSrc(charName, expression);
    const glitchClass = isGlitching ? 'filter drop-shadow-[0_15px_35px_rgba(239,68,68,0.85)] hue-rotate-[320deg] contrast-125' : '';

    return `<img src="${src}" alt="${charName}" class="h-full w-auto object-contain object-bottom select-none pointer-events-none transition-all duration-300 ${glitchClass}" />`;
  }

  /**
   * Clear all character sprites from screen and reset active state
   */
  clear() {
    this.currentSceneId = null;
    this.activeInterlocutor = null;
    this.activeExpression = 'peaceful';
    this.container.innerHTML = '';
  }
}

export default CharacterRenderer;
