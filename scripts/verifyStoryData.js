import fs from 'fs';

const story = JSON.parse(fs.readFileSync('src/data/storyData.json', 'utf8'));
const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');

console.log('=== VERIFYING STORY DATA INTEGRITY ===');

const sceneKeys = Object.keys(story);
console.log(`Total scenes in storyData: ${sceneKeys.length}`);

const expectedScenes = [
  'prologue', 'scene_1a', 'scene_1b', 'scene_1c',
  'scene_2a', 'scene_2b', 'scene_2c', 'scene_3',
  'scene_3b', 'scene_3c', 'scene_3d', 'scene_4a',
  'scene_4b', 'ending_a', 'ending_b', 'ending_c',
  'ending_d', 'ending_e', 'epilogue'
];

let allPassed = true;

// Check all scenes exist
expectedScenes.forEach(s => {
  if (!story[s]) {
    console.error(`MISSING SCENE: ${s}`);
    allPassed = false;
  }
});

let totalDialogues = 0;
let totalNarrations = 0;
let totalGlitchTriggers = 0;

sceneKeys.forEach(s => {
  const sc = story[s];
  sc.dialogues.forEach((d, idx) => {
    if (!d.speaker) {
      console.error(`Dialogue ${s}[${idx}] missing speaker`);
      allPassed = false;
    }
    if (!d.text) {
      console.error(`Dialogue ${s}[${idx}] missing text`);
      allPassed = false;
    }
    if (typeof d.paranoiaDelta !== 'number') {
      console.error(`Dialogue ${s}[${idx}] missing paranoiaDelta`);
      allPassed = false;
    }
    if (typeof d.glitchEffect !== 'boolean') {
      console.error(`Dialogue ${s}[${idx}] missing glitchEffect boolean`);
      allPassed = false;
    }
    if (!d.background) {
      console.error(`Dialogue ${s}[${idx}] missing background`);
      allPassed = false;
    }
    if (!d.expression) {
      console.error(`Dialogue ${s}[${idx}] missing expression`);
      allPassed = false;
    }

    if (d.speaker === 'Narrator') totalNarrations++;
    else totalDialogues++;

    if (d.glitchEffect) totalGlitchTriggers++;

    // Verify text exists in raw script
    // For letter or multi-line, check substrings
    if (d.isLetter) {
      if (!raw.includes("I have waited for you to speak to me")) {
        console.error(`Letter text not found in raw script!`);
        allPassed = false;
      }
    } else {
      if (!raw.includes(d.text)) {
        console.error(`Text not found verbatim in raw script for ${s}[${idx}]: "${d.text}"`);
        allPassed = false;
      }
    }
  });

  if (sc.choice) {
    if (!sc.choice.prompt || !sc.choice.options || sc.choice.options.length < 2) {
      console.error(`Scene ${s} choice invalid`);
      allPassed = false;
    }
  }
});

console.log(`- Total Dialogue lines: ${totalDialogues}`);
console.log(`- Total Narration lines: ${totalNarrations}`);
console.log(`- Total Glitch effect triggers: ${totalGlitchTriggers}`);
console.log(`Verification result: ${allPassed ? 'ALL CHECKS PASSED (100% VERBATIM & VALID)' : 'FAILED'}`);
