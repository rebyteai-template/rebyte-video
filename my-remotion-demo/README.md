# Rebyte Remotion Videos

This project is for new Rebyte/Kami-style product videos only. Old explainer,
browser demo, section audio, and legacy logo assets were removed so future videos
do not accidentally reuse outdated material.

## Source Of Truth

Use the current product repo before creating or updating a video:

- Logo: `/Users/homo/src/cc/cctools/frontend/src/assets/rebyte-mark.png`
- Logo component: `/Users/homo/src/cc/cctools/frontend/src/components/icons/RebyteLogo.tsx`
- Kami design context: `/Users/homo/src/cc/cctools/.impeccable.md`
- Kami tokens: `/Users/homo/src/cc/cctools/frontend/src/styles/kami-tokens.css`
- Product UI references:
  - `/Users/homo/src/cc/cctools/frontend/src/components/agent-computer/AgentComputerTaskTab.tsx`
  - `/Users/homo/src/cc/cctools/frontend/src/components/agent-computer/AgentComputerConfigTab.tsx`
  - `/Users/homo/src/cc/cctools/frontend/src/components/agent-computer/AgentComputerSkillsTab.tsx`
  - `/Users/homo/src/cc/cctools/frontend/src/components/agent-computer/AgentComputerTerminalTab.tsx`
  - `/Users/homo/src/cc/cctools/frontend/src/components/agent-computer/WorkspaceChatComposer.tsx`
  - `/Users/homo/src/cc/cctools/frontend/src/components/AgentToolsBadge.tsx`

Local vendored assets should stay minimal:

- `public/rebyte-mark.png`
- `public/fonts/*.woff2`

Do not reintroduce legacy paths such as `public/explainer`,
`public/sections`, `public/sections-ja`, `public/browser-demo`,
`public/eiffel`, or `public/explainer/logos/rebyte.png`.

## Refresh Current Assets

Run these from `my-remotion-demo` when the product repo changes:

```bash
cp /Users/homo/src/cc/cctools/frontend/src/assets/rebyte-mark.png public/rebyte-mark.png
cp /Users/homo/src/cc/cctools/frontend/src/fonts/Newsreader.woff2 public/fonts/Newsreader.woff2
cp /Users/homo/src/cc/cctools/frontend/src/fonts/TsangerJinKai02-Latin.woff2 public/fonts/TsangerJinKai02-Latin.woff2
cp /Users/homo/src/cc/cctools/landing/public/fonts/Inter-400.woff2 public/fonts/Inter-400.woff2
cp /Users/homo/src/cc/cctools/landing/public/fonts/Inter-500.woff2 public/fonts/Inter-500.woff2
cp /Users/homo/src/cc/cctools/landing/public/fonts/Inter-600.woff2 public/fonts/Inter-600.woff2
cp /Users/homo/src/cc/cctools/landing/public/fonts/JetBrainsMono.woff2 public/fonts/JetBrainsMono.woff2
```

## Make The Next Video

Prerequisites: run `npm install` and make sure `ffmpeg` is available on PATH.

1. Read the Kami files and the relevant product UI components in `cctools`.
2. Build a new Remotion component under `src/`.
3. Use `staticFile("rebyte-mark.png")` for the logo.
4. Register only active compositions in `src/Root.tsx`.
5. Check code with `npm run check`.
6. Render stills at representative frames and inspect them visually.
7. Render the video with `npm run build`. This renders a temporary raw MP4,
   strips the audio track with `ffmpeg -an`, and keeps
   `out/user-scenario-task-assignment.mp4`.
8. Do not automatically open videos or browser windows for review. Use stills,
   probes, and local file paths unless CJ explicitly asks to bring a window
   forward.

Useful commands:

```bash
npm run check
npx remotion still UserScenarioTaskAssignment out/check.png --frame=900 --overwrite
npm run build
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,nb_frames -show_entries format=duration,size -of default=noprint_wrappers=1 out/user-scenario-task-assignment.mp4
npx remotion still SitesLifecycle out/sites-lifecycle-check-210.png --frame=210 --overwrite
npm run build:sites
ffprobe -v error -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,duration,nb_frames -show_entries format=duration,size -of default=noprint_wrappers=1 out/sites-lifecycle.mp4
```
