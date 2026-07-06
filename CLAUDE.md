# marketing

Rebyte 营销工具集 monorepo。完整结构和各子项目说明见 `README.md`，本文件只放 agent 跑任务用的工作流（TTS、邮件模板规则、API key）。

主要子项目：

- `crm/` — 自建 CRM + messaging server（Next.js + SQLite + Postmark + Clerk sync）
- `src/` + `my-remotion-demo/` — Remotion 视频工程（marketing video 编辑）
- `marketing-diagrams/` — 营销图 web app（Vite）
- `wechat/` — 公众号草稿

## TTS (Text-to-Speech) Workflow

Generate voiceover audio using OpenAI's TTS API.

### Script Location
`.claude/skills/tts/generate.js`

### Usage
```bash
node .claude/skills/tts/generate.js "Your script text" --output ./path/to/output.mp3
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
node .claude/skills/tts/generate.js "Say you need a spreadsheet to track your project timeline." --voice alloy --output ./my-remotion-demo/public/sections/07-spreadsheet/audio.mp3
```

## ElevenLabs TTS Workflow

Generate voiceover audio using ElevenLabs API.

### Script Location
`.claude/skills/elevenlabs/generate.js`

### Usage
```bash
node .claude/skills/elevenlabs/generate.js "Your script text" --output ./path/to/output.mp3
```

### Options
- `--voice` - Voice ID (default: `21m00Tcm4TlvDq8ikWAM` / Rachel)
- `--model` - Model: `eleven_multilingual_v2` (default), `eleven_monolingual_v1`
- `--output` - Output file path
- `--stability` - Voice stability 0.0-1.0 (default: 0.5)
- `--similarity` - Similarity boost 0.0-1.0 (default: 0.75)

### Common Voices
- **Rachel** (`21m00Tcm4TlvDq8ikWAM`) - Calm, narration (good default)
- **Drew** (`29vD33N1CtxCmqQRPOHJ`) - Well-rounded, news
- **Paul** (`5Q0t7uMcjvnagumLfvZi`) - Ground news, narration
- **Josh** (`TxGEqnHWrfWFTfGW9XjX`) - Deep, narration
- **Adam** (`pNInz6obpgDQGcFmaJgB`) - Deep, narration
- **Sam** (`yoZ06aMxZJJ28mfd3POQ`) - Raspy, narration

### Example
```bash
node .claude/skills/elevenlabs/generate.js "Rebyte moves your agents to the cloud." --voice 21m00Tcm4TlvDq8ikWAM --output ./my-remotion-demo/public/audio/part-02.mp3
```

## Email Templates

- **Never use emojis** in email templates. Use real logos/icons (via `<Img>` tags) instead.

## Postmark Tokens

- Token status and send/test workflow live in `crm/POSTMARK.md`.
- Do not add new plaintext Postmark tokens to this file.
