/**
 * Background Layer & Dynamic Paranoia Vignette Renderer
 * Features crossfade transitions between scene backgrounds and progressive Abyss vignette darkening.
 */

import { assetMap } from '../data/assetMap.js';

export class BackgroundRenderer {
  constructor(bgContainer, vignetteElement) {
    this.container = bgContainer;
    this.vignette = vignetteElement;
    this.currentBgKey = null;
    this.activeLayer = 1;

    // Create two layers for seamless crossfade
    this.layer1 = document.createElement('div');
    this.layer2 = document.createElement('div');

    [this.layer1, this.layer2].forEach(l => {
      l.className = 'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out pointer-events-none';
      l.style.opacity = '0';
      this.container.appendChild(l);
    });

    this.layer1.style.opacity = '1';
  }

  setBackground(bgKey) {
    if (!bgKey || this.currentBgKey === bgKey) return;
    this.currentBgKey = bgKey;

    let bgPath = assetMap.backgrounds[bgKey];
    if (!bgPath) {
      const lower = String(bgKey).toLowerCase();
      if (lower.includes('room') || lower.includes('bed') || lower.includes('office') || lower.includes('hall')) {
        bgPath = 'Backgrounds/Room.jpg';
      } else if (lower.includes('field') || lower.includes('court') || lower.includes('garden') || lower.includes('plaza') || lower.includes('boardwalk')) {
        bgPath = 'Backgrounds/Field.jpg';
      } else {
        bgPath = 'Backgrounds/Balcony.jpg';
      }
    }

    const incoming = this.activeLayer === 1 ? this.layer2 : this.layer1;
    const outgoing = this.activeLayer === 1 ? this.layer1 : this.layer2;

    incoming.style.backgroundImage = `url('${bgPath}')`;
    incoming.style.opacity = '1';
    outgoing.style.opacity = '0';

    this.activeLayer = this.activeLayer === 1 ? 2 : 1;
  }

  updateParanoiaVignette(paranoiaLevel, isGlitching) {
    const level = Math.max(0, Math.min(100, paranoiaLevel));

    // Dynamic gradient vignette based on paranoia level & glitch state
    if (isGlitching) {
      // Intense claustrophobic narrowing vignette during manipulation / glitch
      this.vignette.style.background = 'radial-gradient(circle at center, transparent 15%, rgba(38, 4, 52, 0.92) 55%, rgba(18, 0, 24, 0.99) 82%, rgba(5, 0, 8, 1) 100%)';
      this.vignette.style.opacity = '1';
    } else if (level < 25) {
      this.vignette.style.background = 'radial-gradient(circle at center, transparent 65%, rgba(3, 7, 18, 0.4) 100%)';
      this.vignette.style.opacity = '0.5';
    } else if (level < 55) {
      this.vignette.style.background = 'radial-gradient(circle at center, transparent 48%, rgba(20, 5, 35, 0.75) 100%)';
      this.vignette.style.opacity = '0.75';
    } else if (level < 80) {
      this.vignette.style.background = 'radial-gradient(circle at center, transparent 30%, rgba(36, 5, 52, 0.92) 100%)';
      this.vignette.style.opacity = '0.92';
    } else {
      // Danger / Crushing Paranoia threshold (Scene 3 / Scene 4B climax)
      this.vignette.style.background = 'radial-gradient(circle at center, rgba(20, 2, 35, 0.25) 18%, rgba(55, 3, 38, 0.96) 75%, rgba(10, 0, 15, 1) 100%)';
      this.vignette.style.opacity = '1';
    }

    // Toggle DDLC glitch screen shake
    if (isGlitching) {
      document.body.classList.add('glitch-active');
    } else {
      document.body.classList.remove('glitch-active');
    }

    // Toggle psychological visual distortion on screen according to paranoia burden
    const appEl = document.getElementById('app') || document.body;
    if (level >= 75) {
      appEl.classList.add('paranoia-extreme');
      appEl.classList.remove('paranoia-heavy');
    } else if (level >= 45) {
      appEl.classList.add('paranoia-heavy');
      appEl.classList.remove('paranoia-extreme');
    } else {
      appEl.classList.remove('paranoia-heavy', 'paranoia-extreme');
    }
  }
}

export default BackgroundRenderer;
