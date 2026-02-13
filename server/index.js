const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Load prompt data
const systemPrompt = fs.readFileSync(
  path.join(__dirname, '..', 'prompt', 'system_prompt.md'),
  'utf-8'
);
const personas = fs.readFileSync(
  path.join(__dirname, '..', 'prompt', 'personas.json'),
  'utf-8'
);
const framework = fs.readFileSync(
  path.join(__dirname, '..', 'prompt', 'economic_framework.json'),
  'utf-8'
);

const fullSystemPrompt = [
  systemPrompt,
  '\n\n---\n\n## Bibliothèque des personas\n\n```json\n' + personas + '\n```',
  '\n\n---\n\n## Cadre d\'analyse économique\n\n```json\n' + framework + '\n```'
].join('');

// API endpoint: get personas (for frontend display)
app.get('/api/personas', (_req, res) => {
  res.json(JSON.parse(personas));
});

// API endpoint: stream chat
app.post('/api/chat', async (req, res) => {
  const { messages, apiKey } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages requis' });
  }

  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(401).json({
      error: 'Clé API Anthropic requise. Configurez-la dans les paramètres.'
    });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const client = new Anthropic({ apiKey: key });

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 12000,
      system: fullSystemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const errorMsg = err.status === 401
      ? 'Clé API invalide'
      : err.status === 429
        ? 'Trop de requêtes — réessayez dans un instant'
        : `Erreur: ${err.message}`;

    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    res.end();
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Et-SI running on http://localhost:${PORT}`);
});
