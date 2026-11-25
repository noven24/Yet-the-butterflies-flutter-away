const fs = require('fs');

const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('Total lines in raw script:', lines.length);

// Let's inspect sections
let currentSection = null;
const sections = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Check section headers
  if (line.startsWith('PROLOGUE:') || line.startsWith('SCENE ') || line.startsWith('ENDING ') || line.startsWith('EPILOGUE:')) {
    currentSection = line;
    sections[currentSection] = [];
    continue;
  }
  
  if (currentSection) {
    sections[currentSection].push({ lineNo: i + 1, text: line });
  }
}

console.log('Detected sections:');
Object.keys(sections).forEach(s => {
  console.log(`- ${s} (${sections[s].length} lines)`);
});
