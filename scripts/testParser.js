const fs = require('fs');

const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('Testing line parsing...');

let sceneCount = 0;
let dialogueCount = 0;
let narrationCount = 0;
let choiceCount = 0;
let optionCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  if (line.startsWith('YET THE BUTTERFLIES') || line.startsWith('Genre:') || line.startsWith('Setting:') || line.startsWith('Main Characters:')) {
    continue;
  }

  if (/^(PROLOGUE:|SCENE\s+[0-9A-Z]+:|ENDING\s+[A-E]:|EPILOGUE:)/.test(line)) {
    // Avoid the ending tagline like "ENDING A: THE TRUTH EXPOSED — A CHANCE TO BEGIN AGAIN."
    if (line.includes('—')) {
      narrationCount++;
      // It's a concluding narration line
    } else {
      sceneCount++;
    }
    continue;
  }

  if (/^CHOICE\s+[0-9A-Z]+:/.test(line)) {
    choiceCount++;
    continue;
  }

  if (/^[A-D]\.\s+/.test(line)) {
    optionCount++;
    continue;
  }

  const diagMatch = line.match(/^([A-Za-z\s]+):\s*[“"](.*)[”"]$/);
  if (diagMatch) {
    dialogueCount++;
  } else {
    narrationCount++;
  }
}

console.log({ sceneCount, dialogueCount, narrationCount, choiceCount, optionCount });
