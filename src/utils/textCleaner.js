/**
 * Text Cleaner Utilities
 * Strips technical development labels like "Scene 1A:", "1b", "2b", "Choice 2B:", etc.
 * ensuring an authentic, immersive visual novel presentation.
 */

export function cleanSceneTitle(title) {
  if (!title) return '';
  return title
    .replace(/^SCENE\s+\d+[A-Z]?\s*[:\-–—]\s*/i, '')
    .replace(/^PROLOGUE\s*[:\-–—]\s*/i, 'PROLOGUE: ')
    .replace(/^EPILOGUE\s*[:\-–—]\s*/i, 'EPILOGUE: ')
    .replace(/^ENDING\s+[A-Z]\s*[:\-–—]\s*/i, '')
    .trim();
}

export function cleanChoicePrompt(prompt) {
  if (!prompt) return 'HOW WILL JOAN RESPOND?';
  return prompt
    .replace(/^CHOICE\s+\d+[A-Z]?\s*[:\-–—]\s*/i, '')
    .trim();
}

export function cleanOptionText(text) {
  if (!text) return '';
  return text
    .replace(/\.?\s*(Return to|Go to|Continue with)\s+Scene\s+\w+.*$/i, '')
    .replace(/\.?\s*(Return to|Go to)\s+Ending\s+\w+.*$/i, '')
    .replace(/\s*Go to (Scene|Ending).*$/i, '')
    .trim();
}

