# Remotion Video Project

## TTS (Text-to-Speech) Workflow

Generate voiceover audio using OpenAI's TTS API.

### Script Location
`.claude/skills/tts/generate.js`

### Usage
```bash
OPENAI_API_KEY=<key> node .claude/skills/tts/generate.js "Your script text" --output ./path/to/output.mp3
```

### Options
- `--voice` - Voice: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer` (default: `alloy`)
- `--model` - Model: `tts-1` (faster) or `tts-1-hd` (higher quality, default)
- `--output` - Output file path
- `--speed` - Speed 0.25-4.0 (default: 1.0)

### Voice Guide
- **alloy** - Neutral, balanced (good default)
- **echo** - Warm, conversational
- **fable** - British, narrative style
- **onyx** - Deep, authoritative
- **nova** - Friendly, upbeat (female)
- **shimmer** - Soft, gentle (female)

### Example: Generate section audio
```bash
OPENAI_API_KEY=<key> node .claude/skills/tts/generate.js "Say you need a spreadsheet to track your project timeline." --voice alloy --output ./my-remotion-demo/public/sections/07-spreadsheet/audio.mp3
```

## Postmark API Key

```
c1179392-d95b-444a-bcab-f76c3ab99eae
```
