const fs = require('fs');

const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.trim());

// Define the exact scene slices and choice lines
const scenesConfig = [
  {
    id: "prologue",
    header: "PROLOGUE: A WHISPER IN THE DARK",
    bgDefault: "rooftop_night",
    startLine: 5, // 1-indexed line 5
    endLine: 34
  },
  {
    id: "scene_1a",
    header: "SCENE 1A: THE FIRST CONVERSATION",
    bgDefault: "bedroom",
    startLine: 35,
    endLine: 56
  },
  {
    id: "scene_1b",
    header: "SCENE 1B: THE EVENING OF PEACE",
    bgDefault: "bedroom",
    startLine: 57,
    endLine: 76
  },
  {
    id: "scene_1c",
    header: "SCENE 1C: THE QUESTION OF LAQQUO",
    bgDefault: "bedroom",
    startLine: 77,
    endLine: 94
  },
  {
    id: "scene_2a",
    header: "SCENE 2A: CASSIAN'S ANSWER",
    bgDefault: "courtyard_day",
    startLine: 95,
    endLine: 111
  },
  {
    id: "scene_2b",
    header: "SCENE 2B: EMILIA'S SECRET",
    bgDefault: "corridor",
    startLine: 112,
    endLine: 122
  },
  {
    id: "scene_2c",
    header: "SCENE 2C: THE LIEUTENANT'S WARNING",
    bgDefault: "main_hall",
    startLine: 123,
    endLine: 138
  },
  {
    id: "scene_3",
    header: "SCENE 3: THREE PEOPLE, ONE ACCUSATION",
    bgDefault: "main_hall",
    startLine: 139,
    endLine: 159
  },
  {
    id: "scene_3b",
    header: "SCENE 3B: THE BROOCH RETURNED",
    bgDefault: "bedroom",
    startLine: 160,
    endLine: 165
  },
  {
    id: "scene_3c",
    header: "SCENE 3C: THE SERVANT'S ACCOUNT",
    bgDefault: "corridor",
    startLine: 166,
    endLine: 171
  },
  {
    id: "scene_3d",
    header: "SCENE 3D: LAQQUO'S REACTION",
    bgDefault: "main_hall",
    startLine: 172,
    endLine: 179
  },
  {
    id: "scene_4a",
    header: "SCENE 4A: THE BUTTERFLY REVEALED",
    bgDefault: "main_hall",
    startLine: 180,
    endLine: 195
  },
  {
    id: "scene_4b",
    header: "SCENE 4B: THE LAST TEST",
    bgDefault: "bedroom",
    startLine: 196,
    endLine: 209
  },
  {
    id: "ending_a",
    header: "ENDING A: THE TRUTH EXPOSED",
    bgDefault: "garden_olive_tree",
    startLine: 210,
    endLine: 220
  },
  {
    id: "ending_b",
    header: "ENDING B: A FRAGILE PEACE",
    bgDefault: "bedroom",
    startLine: 221,
    endLine: 227
  },
  {
    id: "ending_c",
    header: "ENDING C: THE MARRIAGE DESTROYED",
    bgDefault: "bedroom",
    startLine: 228,
    endLine: 235
  },
  {
    id: "ending_d",
    header: "ENDING D: THE PRICE OF FORGIVENESS",
    bgDefault: "bedroom",
    startLine: 236,
    endLine: 242
  },
  {
    id: "ending_e",
    header: "ENDING E: THE UNFINISHED APOLOGY",
    bgDefault: "office_desk",
    startLine: 243,
    endLine: 255
  },
  {
    id: "epilogue",
    header: "EPILOGUE: WHAT THE TRAGEDY COULD HAVE TAUGHT HIM",
    bgDefault: "lecture_hall",
    startLine: 256,
    endLine: 270
  }
];

console.log('Verifying scene boundaries...');
scenesConfig.forEach((cfg, idx) => {
  const lineText = lines[cfg.startLine - 1];
  console.log(`[${idx+1}] ${cfg.id}: "${lineText}" === "${cfg.header}" ? ${lineText === cfg.header}`);
});
