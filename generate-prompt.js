const fs = require('fs');
const path = require('path');

const systemPrompt = fs.readFileSync(path.join(__dirname, 'prompt', 'system_prompt.md'), 'utf-8');
const personas = fs.readFileSync(path.join(__dirname, 'prompt', 'personas.json'), 'utf-8');
const framework = fs.readFileSync(path.join(__dirname, 'prompt', 'economic_framework.json'), 'utf-8');

const fullPrompt = [
  systemPrompt,
  '\n\n---\n\n## Bibliothèque des personas\n\n```json\n' + personas + '\n```',
  '\n\n---\n\n## Cadre d\'analyse économique\n\n```json\n' + framework + '\n```'
].join('');

// Escape for embedding in JS
const escaped = JSON.stringify(fullPrompt);

const output = `/* ============================================
   Et-SI — System Prompt (embedded for direct API calls)
   Auto-generated file — do not edit manually
   ============================================ */

window.ETSI = window.ETSI || {};

window.ETSI.getSystemPrompt = function() {
  return ${escaped};
};
`;

fs.writeFileSync(path.join(__dirname, 'public', 'js', 'system-prompt.js'), output, 'utf-8');
console.log('system-prompt.js generated successfully (' + output.length + ' bytes)');
