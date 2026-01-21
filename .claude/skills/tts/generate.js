#!/usr/bin/env node

/**
 * OpenAI TTS Generator
 * Usage: node generate.js "text" [options]
 *
 * Options:
 *   --voice <voice>   Voice: alloy, echo, fable, onyx, nova, shimmer (default: alloy)
 *   --model <model>   Model: tts-1, tts-1-hd (default: tts-1-hd)
 *   --output <path>   Output file path (default: ./voiceover.mp3)
 *   --speed <speed>   Speed 0.25-4.0 (default: 1.0)
 *   --file <path>     Read text from file instead of argument
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse arguments
const args = process.argv.slice(2);
let text = '';
let voice = 'alloy';
let model = 'tts-1-hd';
let output = './voiceover.mp3';
let speed = 1.0;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--voice' && args[i + 1]) {
    voice = args[++i];
  } else if (arg === '--model' && args[i + 1]) {
    model = args[++i];
  } else if (arg === '--output' && args[i + 1]) {
    output = args[++i];
  } else if (arg === '--speed' && args[i + 1]) {
    speed = parseFloat(args[++i]);
  } else if (arg === '--file' && args[i + 1]) {
    const filePath = args[++i];
    text = fs.readFileSync(filePath, 'utf-8').trim();
  } else if (!arg.startsWith('--')) {
    text = arg;
  }
}

if (!text) {
  console.error('Error: No text provided');
  console.error('Usage: node generate.js "Your text here" [--voice alloy] [--output ./output.mp3]');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY environment variable not set');
  process.exit(1);
}

// Validate voice
const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
if (!validVoices.includes(voice)) {
  console.error(`Error: Invalid voice "${voice}". Valid voices: ${validVoices.join(', ')}`);
  process.exit(1);
}

// Validate model
const validModels = ['tts-1', 'tts-1-hd'];
if (!validModels.includes(model)) {
  console.error(`Error: Invalid model "${model}". Valid models: ${validModels.join(', ')}`);
  process.exit(1);
}

// Validate speed
if (speed < 0.25 || speed > 4.0) {
  console.error('Error: Speed must be between 0.25 and 4.0');
  process.exit(1);
}

console.log(`Generating TTS audio...`);
console.log(`  Voice: ${voice}`);
console.log(`  Model: ${model}`);
console.log(`  Speed: ${speed}`);
console.log(`  Output: ${output}`);
console.log(`  Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

const requestBody = JSON.stringify({
  model: model,
  input: text,
  voice: voice,
  speed: speed,
  response_format: 'mp3'
});

const options = {
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/audio/speech',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody)
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    let errorData = '';
    res.on('data', chunk => errorData += chunk);
    res.on('end', () => {
      console.error(`Error: API returned status ${res.statusCode}`);
      try {
        const error = JSON.parse(errorData);
        console.error(error.error?.message || errorData);
      } catch {
        console.error(errorData);
      }
      process.exit(1);
    });
    return;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(output);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileStream = fs.createWriteStream(output);
  res.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    const stats = fs.statSync(output);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`\n✓ Audio saved to ${output} (${sizeKB} KB)`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.write(requestBody);
req.end();
