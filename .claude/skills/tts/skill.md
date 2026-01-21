# TTS Skill - Text-to-Speech using OpenAI

Generate voiceover audio from text using OpenAI's TTS API.

## API Key

```
OPENAI_API_KEY=<OPENAI_API_KEY>
```

## Usage

```
/tts "Your script text here" [options]
```

## Options

- `--voice` - Voice to use: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer` (default: `alloy`)
- `--model` - Model: `tts-1` (faster) or `tts-1-hd` (higher quality) (default: `tts-1-hd`)
- `--output` - Output file path (default: `./public/voiceover.mp3`)
- `--speed` - Speed 0.25-4.0 (default: 1.0)

## Examples

```bash
# Basic usage
/tts "Welcome to Rebyte, the future of AI-powered development."

# With options
/tts "Welcome to Rebyte" --voice nova --output ./public/intro.mp3

# HD quality with slower speed
/tts "Every task is a software task" --model tts-1-hd --speed 0.9
```

## Voice Descriptions

- **alloy** - Neutral, balanced (good default)
- **echo** - Warm, conversational
- **fable** - British, narrative style
- **onyx** - Deep, authoritative
- **nova** - Friendly, upbeat (female)
- **shimmer** - Soft, gentle (female)

## Script File Mode

For longer scripts, create a script file and reference it:

```bash
/tts --file ./scripts/voiceover.txt --output ./public/voiceover.mp3
```

## Environment

Requires `OPENAI_API_KEY` environment variable to be set.
