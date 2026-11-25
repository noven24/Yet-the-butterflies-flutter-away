import { CharacterRenderer } from '../src/ui/characterRenderer.js';
import { storyData } from '../src/data/storyData.js';

let mockHTML = '';
const mockContainer = {
  set innerHTML(val) { mockHTML = val; },
  get innerHTML() { return mockHTML; },
  querySelector: () => null
};

globalThis.window = {
  addEventListener: () => {},
  innerWidth: 1024,
  innerHeight: 768
};

const cr = new CharacterRenderer(mockContainer);

let joanRenderedCount = 0;
let totalLinesTested = 0;

for (const [sId, scene] of Object.entries(storyData)) {
  for (const diag of scene.dialogues) {
    totalLinesTested++;
    cr.render(diag, scene, false);
    if (mockHTML.includes('Character_Joan') || mockHTML.includes('Joan_') || mockHTML.includes('alt="Joan"')) {
      console.error(`FAIL: Joan rendered in ${sId} diag: ${diag.id}`);
      joanRenderedCount++;
    }
  }
}

console.log('=== POV CHARACTER RENDERER VALIDATION ===');
console.log('Total dialogue lines tested across all scenes:', totalLinesTested);
console.log('Joan rendered count (must be 0):', joanRenderedCount);

// Test prologue d0 (alone on terrace): should be empty container
cr.render(storyData.prologue.dialogues[0], storyData.prologue, false);
console.log('[TEST] Prologue d0 (alone):', mockHTML === '' ? 'EMPTY CONTAINER (PASS)' : 'FAILED: ' + mockHTML);

// Test prologue d5 (Laqquo speaking): should render Laqquo
cr.render(storyData.prologue.dialogues[5], storyData.prologue, false);
console.log('[TEST] Prologue d5 (Laqquo speaks):', mockHTML.includes('Laqquo') ? 'LAQQUO RENDERED (PASS)' : 'FAILED');

// Test prologue d6 (Joan speaks to Laqquo): Laqquo should stay as listener
cr.render(storyData.prologue.dialogues[6], storyData.prologue, false);
console.log('[TEST] Prologue d6 (Joan speaks):', mockHTML.includes('Laqquo') && mockHTML.includes('sprite-listener') ? 'LAQQUO LISTENER (PASS)' : 'FAILED');

// Test prologue d20 (Aflania speaks): should render Aflania
cr.render(storyData.prologue.dialogues[20], storyData.prologue, false);
console.log('[TEST] Prologue d20 (Aflania speaks):', mockHTML.includes('Alfania') ? 'AFLANIA RENDERED (PASS)' : 'FAILED');

if (joanRenderedCount === 0) {
  console.log('SUCCESS: All POV tests passed! Joan is NEVER rendered during gameplay.');
} else {
  process.exit(1);
}

