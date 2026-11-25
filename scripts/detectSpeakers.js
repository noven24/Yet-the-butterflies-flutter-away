const fs = require('fs');

const content = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');
const lines = content.split(/\r?\n/);

const speakers = new Set();
lines.forEach(l => {
  const trimmed = l.trim();
  const m = trimmed.match(/^([A-Za-z\s]+):\s*[“"]/);
  if (m) {
    speakers.add(m[1].trim());
  }
});
console.log('Detected Speakers:', Array.from(speakers));
