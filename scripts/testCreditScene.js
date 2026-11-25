import { creditsData } from '../src/data/creditsData.js';
import { StoryStateMachine } from '../src/logic/stateMachine.js';
import storyData from '../src/data/storyData.js';

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    passed++;
    console.log(`[PASS] ${msg}`);
  } else {
    console.error(`[FAIL] ${msg}`);
    process.exit(1);
  }
}

console.log('=== VERIFYING CREDITS DATA & PRODUCTION TEAM STRUCTURE ===');
assert(creditsData !== null && typeof creditsData === 'object', 'creditsData is exported object');
assert(creditsData.team && Array.isArray(creditsData.team), 'creditsData has team array');
assert(creditsData.team.length === 11, `Total production team is exactly 11 members (got: ${creditsData.team.length})`);

// Verify all 11 members have required attributes
creditsData.team.forEach((member, i) => {
  assert(member.id === i + 1, `Member ${i + 1} has valid id`);
  assert(typeof member.role === 'string' && member.role.length > 0, `Member ${i + 1} has role: ${member.role}`);
  assert(typeof member.department === 'string' && member.department.length > 0, `Member ${i + 1} has department: ${member.department}`);
  assert(typeof member.name === 'string' && member.name.length > 0, `Member ${i + 1} has name: ${member.name}`);
  assert(typeof member.description === 'string' && member.description.length > 0, `Member ${i + 1} has description`);
});

// Verify specific departments requested by user: game development, creative design, character & background
const hasGameDev = creditsData.team.some(m => m.department.includes('GAME DEVELOPMENT'));
const hasCreativeDesign = creditsData.team.some(m => m.department.includes('CREATIVE DESIGN'));
const hasAnisah = creditsData.team.some(m => m.name === 'Anisah Pulungan');
assert(hasGameDev, 'Includes Game Development department ("yang membuat game")');
assert(hasCreativeDesign, 'Includes Creative Design department ("creative design")');
assert(hasAnisah, 'Includes Anisah Pulungan for character & background design');

console.log('\n=== VERIFYING EPILOGUE END DETECTION IN STATEMACHINE ===');
const sm = new StoryStateMachine();
sm.goToScene('epilogue', 0);
assert(sm.state.currentScene === 'epilogue', 'Current scene is epilogue');
assert(!sm.isAtSceneEnd(), 'Not at scene end initially');

// Step through to the last dialogue of epilogue
const epilogueLen = storyData.epilogue.dialogues.length;
for (let i = 0; i < epilogueLen - 1; i++) {
  sm.next();
}

assert(sm.state.dialogueIndex === epilogueLen - 1, `Reached final dialogue (index: ${sm.state.dialogueIndex})`);
assert(sm.isAtSceneEnd(), 'isAtSceneEnd() returns true on final epilogue dialogue');
const lastDiag = sm.getCurrentDialogue();
assert(lastDiag.text.includes('another choice had been possible'), 'Last dialogue is the reflection quote');

console.log(`\nResults: ${passed}/${total} tests passed.`);
console.log('ALL CREDITS & EPILOGUE INTEGRATION VERIFIED SUCCESSFULLY!');

