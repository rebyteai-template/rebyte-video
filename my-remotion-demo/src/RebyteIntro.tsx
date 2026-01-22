import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

// ============ LOGOS ============
const RebyteLogo = ({ size = 80, color = "currentColor", innerColor = "#ffffff" }: { size?: number; color?: string; innerColor?: string }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-label="Rebyte">
    <circle cx="8" cy="16" r="8" fill={color} />
    <path d="M19 8 H24 C28.418 8 32 11.582 32 16 C32 20.418 28.418 24 24 24 H19 V8 Z" fill={color} />
    <rect x="4" y="14.5" width="12" height="3" fill={innerColor} />
    <rect x="19" y="14.5" width="10" height="3" fill={innerColor} />
  </svg>
);

const ClaudeLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#D97706">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
  </svg>
);

const GeminiLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <defs>
      <linearGradient id="g-g0" x1="7" x2="11" y1="15.5" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#08B962" /><stop offset="1" stopColor="#08B962" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-g1" x1="8" x2="11.5" y1="5.5" y2="11" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F94543" /><stop offset="1" stopColor="#F94543" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-g2" x1="3.5" x2="17.5" y1="13.5" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FABC12" /><stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#g-g0)" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#g-g1)" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#g-g2)" />
  </svg>
);

const OpenAILogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#10A37F">
    <path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z" />
  </svg>
);

// Cursor logo - stylized cursor/pointer
const CursorLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#000000"/>
    <path d="M7 5L17 12L12 13L14 19L11 20L9 14L7 17V5Z" fill="white"/>
  </svg>
);

// GitHub Copilot logo
const CopilotLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#000000"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
  </svg>
);

// Windsurf/Codeium logo
const WindsurfLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#09B6A2"/>
    <path d="M6 18L12 6L18 18H14L12 14L10 18H6Z" fill="white"/>
  </svg>
);

// OpenCode logo (terminal style)
const OpenCodeLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#1a1a2e"/>
    <text x="12" y="16" textAnchor="middle" fill="#00ff88" fontSize="10" fontFamily="monospace" fontWeight="bold">&gt;_</text>
  </svg>
);

const ClineLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#2563eb"/>
    <circle cx="12" cy="12" r="7.5" fill="#1e40af"/>
    <text x="12" y="15" textAnchor="middle" fill="white" fontSize="12" fontFamily="system-ui" fontWeight="700">C</text>
  </svg>
);

const DroidLogo = ({ size = 48 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <rect width="24" height="24" rx="6" fill="#16a34a"/>
    <rect x="6" y="7" width="12" height="10" rx="3" fill="#052e16"/>
    <circle cx="10" cy="12" r="1.5" fill="#4ade80"/>
    <circle cx="14" cy="12" r="1.5" fill="#4ade80"/>
    <rect x="9" y="18" width="6" height="1.5" rx="0.75" fill="#14532d"/>
  </svg>
);

// ============ TRADITIONAL SOFTWARE LOGOS ============
const MicrosoftLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const SalesforceLogo = () => (
  <svg width="48" height="40" viewBox="0 0 48 32">
    <ellipse cx="24" cy="16" rx="22" ry="14" fill="#00A1E0"/>
    <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">SF</text>
  </svg>
);

const SAPLogo = () => (
  <svg width="48" height="40" viewBox="0 0 48 32">
    <rect width="48" height="32" rx="4" fill="#0FAAFF"/>
    <text x="24" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">SAP</text>
  </svg>
);

const OracleLogo = () => (
  <svg width="48" height="40" viewBox="0 0 48 32">
    <rect width="48" height="32" rx="4" fill="#C74634"/>
    <text x="24" y="21" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">ORACLE</text>
  </svg>
);

const AdobeLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="4" fill="#FF0000"/>
    <text x="12" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">A</text>
  </svg>
);

const SlackLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <circle cx="6" cy="6" r="3" fill="#E01E5A"/>
    <circle cx="18" cy="6" r="3" fill="#36C5F0"/>
    <circle cx="6" cy="18" r="3" fill="#2EB67D"/>
    <circle cx="18" cy="18" r="3" fill="#ECB22E"/>
    <rect x="10" y="4" width="4" height="16" rx="2" fill="#E01E5A"/>
    <rect x="4" y="10" width="16" height="4" rx="2" fill="#36C5F0"/>
  </svg>
);

const NotionLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="4" fill="#000000"/>
    <text x="12" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="serif">N</text>
  </svg>
);

const GoogleLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#4285F4"/>
    <path d="M12 6 L18 12 L12 18 L6 12 Z" fill="#34A853"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>
);

const DropboxLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <path d="M6 2 L12 6 L6 10 L0 6 Z" fill="#0061FF"/>
    <path d="M18 2 L24 6 L18 10 L12 6 Z" fill="#0061FF"/>
    <path d="M6 10 L12 14 L6 18 L0 14 Z" fill="#0061FF"/>
    <path d="M18 10 L24 14 L18 18 L12 14 Z" fill="#0061FF"/>
    <path d="M6 18 L12 22 L18 18 L12 14 Z" fill="#0061FF"/>
  </svg>
);

const AirtableLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="4" fill="#18BFFF"/>
    <rect x="6" y="8" width="12" height="3" fill="white"/>
    <rect x="6" y="13" width="12" height="3" fill="white" opacity="0.7"/>
  </svg>
);

const SoftwareLogoItem = ({
  Logo,
  name,
  delay,
  index
}: {
  Logo: React.FC;
  name: string;
  delay: number;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - fps * delay,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  const opacity = interpolate(entrance, [0, 1], [0, 0.7]);
  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const y = interpolate(entrance, [0, 1], [20, 0]);

  // Position logos around the edges (5 on top, 5 on bottom)
  const positions = [
    // Top row (5 logos)
    { x: 80, y: 60 },
    { x: 280, y: 40 },
    { x: 480, y: 55 },
    { x: 680, y: 35 },
    { x: 880, y: 50 },
    // Bottom row (5 logos)
    { x: 100, y: 480 },
    { x: 300, y: 500 },
    { x: 500, y: 485 },
    { x: 700, y: 510 },
    { x: 900, y: 490 },
  ];

  const pos = positions[index] || { x: 100, y: 100 };

  return (
    <div style={{
      position: "absolute",
      left: pos.x,
      top: pos.y,
      opacity,
      transform: `scale(${scale}) translateY(${y}px)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}>
      <div style={{
        padding: 14,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}>
        <Logo />
      </div>
      <span style={{
        fontFamily: "system-ui",
        fontSize: 11,
        color: "#6b7280",
        fontWeight: 500,
      }}>
        {name}
      </span>
    </div>
  );
};

// ============ MAIN COMPONENT ============
export const RebyteIntro = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timings based on actual audio durations (at 30fps)
  // Total: ~110 seconds
  const sections = {
    intro:        { start: 0,    duration: 294 },   // 9.8s - "Previously, only programmers..."
    change:       { start: 294,  duration: 201 },   // 6.7s - "Everything changed with code agents..."
    rebyte:       { start: 495,  duration: 437 },   // 14.6s - "Rebyte was born to bridge the gap..."
    surveyIntro:  { start: 932,  duration: 200 },   // 6.7s - "Let me show you..."
    oldWay:       { start: 1132, duration: 219 },   // 7.3s - "The old way?..."
    newWay:       { start: 1351, duration: 764 },   // 25.5s - "The new way?..."
    spreadsheet:  { start: 2115, duration: 503 },   // 16.75s - "Say you need a spreadsheet..."
    coding:       { start: 2618, duration: 516 },   // 17.2s - "Back to coding..."
    outro:        { start: 3134, duration: 214 },   // 7.1s - "These are just the beginning..."
    tagline:      { start: 3348, duration: 87 },    // 2.9s - "Rebyte. Vibe working..."
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc" }}>
      {/* Background music bed */}
      <Audio src={staticFile("audio/bg.mp3")} volume={0.06} />
      {/* Per-section audio files */}
      <Sequence from={sections.intro.start}><Audio src={staticFile("sections/01-intro/audio.mp3")} /></Sequence>
      <Sequence from={sections.change.start}><Audio src={staticFile("sections/02-change/audio.mp3")} /></Sequence>
      <Sequence from={sections.rebyte.start}><Audio src={staticFile("sections/03-rebyte/audio.mp3")} /></Sequence>
      <Sequence from={sections.surveyIntro.start}><Audio src={staticFile("sections/04-survey-intro/audio.mp3")} /></Sequence>
      <Sequence from={sections.oldWay.start}><Audio src={staticFile("sections/05-old-way/audio.mp3")} /></Sequence>
      <Sequence from={sections.newWay.start}><Audio src={staticFile("sections/06-new-way/audio.mp3")} /></Sequence>
      <Sequence from={sections.spreadsheet.start}><Audio src={staticFile("sections/07-spreadsheet/audio.mp3")} /></Sequence>
      <Sequence from={sections.coding.start}><Audio src={staticFile("sections/08-coding/audio.mp3")} /></Sequence>
      <Sequence from={sections.outro.start}><Audio src={staticFile("sections/09-outro/audio.mp3")} /></Sequence>
      <Sequence from={sections.tagline.start}><Audio src={staticFile("sections/10-tagline/audio.mp3")} /></Sequence>

      {/* Scene 1: The Problem */}
      <Sequence from={sections.intro.start} durationInFrames={sections.intro.duration}>
        <ProblemScene frame={frame - sections.intro.start} fps={fps} sceneDuration={sections.intro.duration} />
      </Sequence>

      {/* Scene 2: Code Agents Changed Everything */}
      <Sequence from={sections.change.start} durationInFrames={sections.change.duration}>
        <ChangeScene frame={frame - sections.change.start} fps={fps} sceneDuration={sections.change.duration} />
      </Sequence>

      {/* Scene 3: Rebyte Mission */}
      <Sequence from={sections.rebyte.start} durationInFrames={sections.rebyte.duration}>
        <RebyteMissionScene frame={frame - sections.rebyte.start} fps={fps} sceneDuration={sections.rebyte.duration} />
      </Sequence>

      {/* Scene 4: Survey Intro */}
      <Sequence from={sections.surveyIntro.start} durationInFrames={sections.surveyIntro.duration}>
        <SurveyIntroScene frame={frame - sections.surveyIntro.start} fps={fps} sceneDuration={sections.surveyIntro.duration} />
      </Sequence>

      {/* Scene 5: Survey Old Way */}
      <Sequence from={sections.oldWay.start} durationInFrames={sections.oldWay.duration}>
        <SurveyOldWayScene frame={frame - sections.oldWay.start} fps={fps} sceneDuration={sections.oldWay.duration} />
      </Sequence>

      {/* Scene 6: Survey New Way */}
      <Sequence from={sections.newWay.start} durationInFrames={sections.newWay.duration}>
        <SurveyNewWayScene frame={frame - sections.newWay.start} fps={fps} sceneDuration={sections.newWay.duration} />
      </Sequence>

      {/* Scene 7: Spreadsheet Builder */}
      <Sequence from={sections.spreadsheet.start} durationInFrames={sections.spreadsheet.duration}>
        <SpreadsheetScene frame={frame - sections.spreadsheet.start} fps={fps} sceneDuration={sections.spreadsheet.duration} />
      </Sequence>

      {/* Scene 8: Coding Capabilities */}
      <Sequence from={sections.coding.start} durationInFrames={sections.coding.duration}>
        <CodingScene frame={frame - sections.coding.start} fps={fps} sceneDuration={sections.coding.duration} />
      </Sequence>

      {/* Scene 9: Outro */}
      <Sequence from={sections.outro.start} durationInFrames={sections.outro.duration}>
        <OutroScene frame={frame - sections.outro.start} fps={fps} />
      </Sequence>

      {/* Scene 10: Tagline */}
      <Sequence from={sections.tagline.start} durationInFrames={sections.tagline.duration}>
        <TaglineScene frame={frame - sections.tagline.start} fps={fps} sceneDuration={sections.tagline.duration} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar frame={frame} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};

// ============ SCENE 1: THE PROBLEM (0-10s) ============
// Script: "Previously, only programmers could code. Everyone else had to use predefined software
// or, if you really needed customized software, ask a programmer for help."
const ProblemScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const textOpacity = interpolate(frame, [fps * 0.3, fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Traditional software logos appearing one by one (~4s into scene)
  const softwareLogos = [
    { Logo: MicrosoftLogo, name: "Microsoft", delay: 4.0 },
    { Logo: SalesforceLogo, name: "Salesforce", delay: 4.15 },
    { Logo: SAPLogo, name: "SAP", delay: 4.3 },
    { Logo: OracleLogo, name: "Oracle", delay: 4.45 },
    { Logo: AdobeLogo, name: "Adobe", delay: 4.6 },
    { Logo: SlackLogo, name: "Slack", delay: 4.75 },
    { Logo: NotionLogo, name: "Notion", delay: 4.9 },
    { Logo: GoogleLogo, name: "Google", delay: 5.05 },
    { Logo: DropboxLogo, name: "Dropbox", delay: 5.2 },
    { Logo: AirtableLogo, name: "Airtable", delay: 5.35 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* Traditional software logos appearing one by one */}
      {softwareLogos.map((logo, index) => (
        <SoftwareLogoItem
          key={logo.name}
          Logo={logo.Logo}
          name={logo.name}
          delay={logo.delay}
          index={index}
        />
      ))}

      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: textOpacity,
        zIndex: 10,
      }}>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 44,
          fontWeight: 600,
          color: "#6b7280",
          margin: 0,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.4,
        }}>
          Previously, only <span style={{ color: "#1f2937" }}>programmers</span> could code.
        </h1>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 24,
          color: "#9ca3af",
          marginTop: 24,
          textAlign: "center",
          maxWidth: 600,
          opacity: interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Everyone else had to use predefined software<br />or ask a programmer friend for help.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 2: THE CHANGE (10-17s) ============
// Script: "Everything changed with code agents. Initially, it sounds like it's for programmers,
// but it's actually for everyone."
const ChangeScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logos = [
    { Logo: ClaudeLogo, name: "Claude Code", delay: 0.3 },
    { Logo: GeminiLogo, name: "Gemini CLI", delay: 0.5 },
    { Logo: OpenAILogo, name: "OpenAI Codex", delay: 0.7 },
    { Logo: CursorLogo, name: "Cursor", delay: 0.9 },
    { Logo: CopilotLogo, name: "GitHub Copilot", delay: 1.1 },
    { Logo: WindsurfLogo, name: "Windsurf", delay: 1.3 },
    { Logo: OpenCodeLogo, name: "OpenCode", delay: 1.5 },
    { Logo: ClineLogo, name: "Cline", delay: 1.7 },
    { Logo: DroidLogo, name: "Droid", delay: 1.9 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
      }}>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 48,
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
          textAlign: "center",
          opacity: interpolate(entrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
        }}>
          Everything changed with <span style={{ color: "#374151" }}>Code Agents</span>
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, marginTop: 20, maxWidth: 850 }}>
          {logos.map(({ Logo, name, delay }) => {
            const logoEntrance = spring({ frame: frame - fps * delay, fps, config: { damping: 12 } });
            return (
              <div
                key={name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  width: 100,
                  opacity: interpolate(logoEntrance, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(logoEntrance, [0, 1], [0.5, 1])})`,
                }}
              >
                <Logo size={44} />
                <span style={{ fontFamily: "system-ui", fontSize: 12, color: "#6b7280", textAlign: "center" }}>{name}</span>
              </div>
            );
          })}
        </div>

        {/* "Actually for everyone" message */}
        <p style={{
          fontFamily: "system-ui",
          fontSize: 24,
          color: "#6b7280",
          marginTop: 30,
          textAlign: "center",
          opacity: interpolate(frame, [fps * 3, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Initially for programmers—but actually for <span style={{ color: "#374151", fontWeight: 600 }}>everyone</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 3: REBYTE MISSION (17-30s) ============
// Script: "Rebyte was born to bridge the gap. We took those state-of-the-art code agents
// and run them in the cloud, equipped those agents with highly specialized skills.
// Those code agents actually become generic problem solvers for every task."
  const RebyteMissionScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
    const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const animFrame = frame * 0.5;

  const leftEnter = spring({ frame: animFrame - fps * 1, fps, config: { damping: 12, stiffness: 90 } });
  const rightEnter = spring({ frame: animFrame - fps * 2.1, fps, config: { damping: 12, stiffness: 90 } });
  const runtimeEnter = spring({ frame: animFrame - fps * 3.2, fps, config: { damping: 12, stiffness: 90 } });
  const packProgress = interpolate(animFrame, [fps * 4.4, fps * 5.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packFade = interpolate(packProgress, [0, 1], [1, 0.35]);
  const packScale = interpolate(packProgress, [0, 1], [1, 0.7]);
  const packShift = interpolate(packProgress, [0, 1], [0, 110]);

  // Skills to show
  const skills = [
    "Create spreadsheets",
    "Create presentation",
    "Create a video",
    "Create forms",
    "Deep research",
    "Data analysis",
    "Financial analysis",
    "Image generation Pro",
  ];

  // Code agents
  const agents = [
    { Logo: ClaudeLogo, name: "Claude", color: "#D97706" },
    { Logo: GeminiLogo, name: "Gemini", color: "#3186FF" },
    { Logo: OpenAILogo, name: "Codex", color: "#10A37F" },
    { Logo: OpenCodeLogo, name: "OpenCode", color: "#00cc70" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* Title: Rebyte was born to bridge the gap */}
      <div style={{
        position: "absolute",
        top: 24,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(animFrame, [fps * 0.2, fps * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
          <RebyteLogo size={56} color="#000000" innerColor="#ffffff" />
          <span style={{ fontFamily: "system-ui", fontSize: 40, fontWeight: 700, color: "#000000" }}>Rebyte</span>
        </div>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 34,
          fontWeight: 600,
          color: "#1f2937",
          margin: 0,
        }}>
          Born to bridge the gap
        </h1>
      </div>

      {/* Main visualization: Agents + Skills + Cloud */}
      <div style={{
        position: "absolute",
        top: 170,
        left: 0,
        right: 0,
        bottom: 140,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
        padding: "0 60px",
        transform: "scale(1.08)",
        transformOrigin: "center top",
      }}>
        {/* Left: State-of-the-art code agents */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: interpolate(leftEnter, [0, 1], [0, 1]) * packFade,
          transform: `translateX(${interpolate(leftEnter, [0, 1], [-160, 0]) + packShift}px) translateY(${interpolate(leftEnter, [0, 1], [20, 0])}px) scale(${packScale})`,
        }}>
          <span style={{
            fontFamily: "system-ui",
            fontSize: 14,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            State-of-the-art Agents
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {agents.map(({ Logo, name, color }, i) => {
              const agentEntrance = spring({ frame: animFrame - fps * (1.5 + i * 0.15), fps, config: { damping: 12 } });
              return (
                <div key={name} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  opacity: interpolate(agentEntrance, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(agentEntrance, [0, 1], [0.8, 1])})`,
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    backgroundColor: "white",
                    border: `2px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 6px 16px ${color}30`,
                  }}>
                    <Logo size={28} />
                  </div>
                  <span style={{ fontFamily: "system-ui", fontSize: 11, color: "#374151", fontWeight: 500 }}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Agent runtime container */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          marginTop: 10,
          opacity: interpolate(runtimeEnter, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(runtimeEnter, [0, 1], [120, 0])}px) scale(${interpolate(runtimeEnter, [0, 1], [0.9, 1.02])})`,
          zIndex: 2,
        }}>
          <div style={{
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
          <span style={{
            fontFamily: "system-ui",
            fontSize: 14,
            color: "#374151",
            fontWeight: 600,
          }}>
            Agent Runtime
          </span>
        </div>

        {/* Right: Highly specialized skills */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: interpolate(rightEnter, [0, 1], [0, 1]) * packFade,
          transform: `translateX(${interpolate(rightEnter, [0, 1], [160, 0]) - packShift}px) translateY(${interpolate(rightEnter, [0, 1], [20, 0])}px) scale(${packScale})`,
        }}>
          <span style={{
            fontFamily: "system-ui",
            fontSize: 14,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            Specialized Skills
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 360 }}>
            {skills.map((skill, i) => {
              const skillEntrance = spring({ frame: animFrame - fps * (2.6 + i * 0.2), fps, config: { damping: 12 } });
              return (
                <div key={skill} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  backgroundColor: "#f8fafc",
                  borderRadius: 999,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  opacity: interpolate(skillEntrance, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(skillEntrance, [0, 1], [20, 0])}px)`,
                }}>
                  <span style={{ fontFamily: "system-ui", fontSize: 14, color: "#6b7280", fontWeight: 600 }}>{skill}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(animFrame, [fps * 6, fps * 6.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 22,
          color: "#1f2937",
          fontWeight: 500,
          margin: 0,
        }}>
          Code agents become <span style={{ color: "#374151", fontWeight: 700 }}>generic problem solvers</span> for every task
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ LEGACY: REBYTE'S MISSION - Each Agent Gets Its Own Runtime ============
const MissionScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 5 code agents, each gets its own isolated runtime
  const agents = [
    { Logo: ClaudeLogo, name: "Claude Code", color: "#D97706" },
    { Logo: GeminiLogo, name: "Gemini CLI", color: "#3186FF" },
    { Logo: OpenAILogo, name: "OpenAI Codex", color: "#10A37F" },
    { Logo: CursorLogo, name: "Cursor", color: "#000000" },
    { Logo: CopilotLogo, name: "Copilot", color: "#000000" },
  ];

  const containerWidth = 180;
  const gap = 30;
  const totalWidth = agents.length * containerWidth + (agents.length - 1) * gap;
  const startX = (1280 - totalWidth) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* Title */}
      <div style={{
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [fps * 0.2, fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 38,
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
        }}>
          Rebyte bridges the gap
        </h1>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 18,
          color: "#6b7280",
          marginTop: 10,
        }}>
          Running SOTA code agents on the cloud for everyone
        </p>
      </div>

      {/* Each agent with its own runtime container */}
      {agents.map(({ Logo, name, color }, index) => {
        const delay = 0.5 + index * 0.4; // Staggered timing
        const fallStart = fps * delay;
        const fallEnd = fps * (delay + 0.6);
        const landedFrame = fallEnd;

        // Runtime container appears first
        const containerEntrance = spring({
          frame: frame - fps * (0.3 + index * 0.15),
          fps,
          config: { damping: 14, stiffness: 100 }
        });

        // Agent falls from top to its container
        const agentY = interpolate(
          frame,
          [fallStart, fallEnd],
          [-100, 280],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Agent opacity during fall
        const agentOpacity = interpolate(
          frame,
          [fallStart, fallStart + fps * 0.1, fallEnd],
          [0, 1, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Agent settles into container
        const hasLanded = frame >= landedFrame;
        const settleScale = hasLanded ? 0.8 : 1;

        // Container glows when agent lands
        const glowOpacity = hasLanded
          ? interpolate(frame, [landedFrame, landedFrame + fps * 0.3], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 0;

        const xPos = startX + index * (containerWidth + gap);

        return (
          <div key={name} style={{ position: "absolute", left: xPos, top: 160 }}>
            {/* Runtime Container */}
            <div style={{
              width: containerWidth,
              height: 220,
              opacity: interpolate(containerEntrance, [0, 1], [0, 1]),
              transform: `scale(${interpolate(containerEntrance, [0, 1], [0.8, 1])})`,
            }}>
              {/* Container glow effect */}
              <div style={{
                position: "absolute",
                inset: -10,
                borderRadius: 24,
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                opacity: glowOpacity,
              }} />

              {/* Container body */}
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
                borderRadius: 16,
                border: hasLanded ? `3px solid ${color}` : "3px solid #e2e8f0",
                boxShadow: hasLanded
                  ? `0 20px 40px ${color}30`
                  : "0 10px 30px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Top bar */}
                <div style={{
                  width: "100%",
                  height: 8,
                  background: hasLanded ? color : "#e2e8f0",
                  borderRadius: "13px 13px 0 0",
                }} />

                {/* VM Icon */}
                <div style={{
                  marginTop: 16,
                  padding: 8,
                  backgroundColor: "#f8fafc",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2v12h16V6H4zm2 2h2v2H6V8zm4 0h8v2h-8V8zm-4 4h2v2H6v-2zm4 0h8v2h-8v-2z"/>
                  </svg>
                </div>

                {/* Agent landing zone */}
                <div style={{
                  marginTop: 12,
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  border: "2px dashed #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: hasLanded ? `${color}10` : "transparent",
                }}>
                  {hasLanded && <Logo size={36} />}
                </div>

                {/* Label */}
                <span style={{
                  marginTop: 12,
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "#64748b",
                  backgroundColor: "#f1f5f9",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}>
                  isolated-vm-{index + 1}
                </span>
              </div>
            </div>

            {/* Falling Agent (before landing) */}
            {!hasLanded && (
              <div style={{
                position: "absolute",
                left: containerWidth / 2 - 28,
                top: agentY,
                opacity: agentOpacity,
                transform: `scale(${settleScale})`,
              }}>
                <div style={{
                  padding: 10,
                  backgroundColor: "white",
                  borderRadius: 12,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}>
                  <Logo size={36} />
                </div>
              </div>
            )}

            {/* Agent name below container */}
            <div style={{
              textAlign: "center",
              marginTop: 12,
              opacity: interpolate(containerEntrance, [0, 1], [0, 1]),
            }}>
              <span style={{
                fontFamily: "system-ui",
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
              }}>
                {name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Bottom label */}
      <div style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [fps * 3.5, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <span style={{
          fontFamily: "system-ui",
          fontSize: 16,
          color: "#374151",
          fontWeight: 600,
        }}>
          Each agent runs in its own isolated cloud environment
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============ TASK SCENE (Reusable for screenshots) ============
const TaskScene = ({
  frame,
  fps,
  sceneDuration,
  src,
  title,
  subtitle,
  bgColor,
}: {
  frame: number;
  fps: number;
  sceneDuration: number;
  src: string;
  title: string;
  subtitle: string;
  bgColor: string;
}) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoomProgress = interpolate(frame, [0, sceneDuration], [1, 1.03], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, opacity: exitOpacity }}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `scale(${interpolate(entrance, [0, 1], [0.95, 1]) * zoomProgress})`,
      }}>
        <div style={{
          width: "88%",
          height: "82%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
          position: "relative",
        }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 30px",
            background: "linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0))",
          }}>
            <h2 style={{
              fontFamily: "system-ui",
              fontSize: 28,
              fontWeight: 700,
              color: "#1f2937",
              margin: 0,
            }}>
              {title}
            </h2>
            <p style={{
              fontFamily: "system-ui",
              fontSize: 16,
              color: "#6b7280",
              margin: "6px 0 0 0",
            }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 3: SURVEY INTRO (10-14s) ============
const SurveyIntroScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      }}>
        <div style={{
          padding: "12px 24px",
          backgroundColor: "#ecfdf5",
          borderRadius: 8,
          border: "1px solid #a7f3d0",
        }}>
          <span style={{ fontFamily: "system-ui", fontSize: 14, color: "#059669", fontWeight: 600 }}>
            Let me show you
          </span>
        </div>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 48,
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.3,
        }}>
          Say your marketing team needs<br />
          <span style={{ color: "#374151" }}>a survey form</span>
        </h1>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 22,
          color: "#6b7280",
          margin: 0,
          textAlign: "center",
          opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          How would you typically do this?
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 4: SURVEY OLD WAY (14-22s) ============
const SurveyOldWayScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const saasProducts = [
    { name: "Typeform", price: "$25/mo", color: "#262627" },
    { name: "SurveyMonkey", price: "$32/mo", color: "#00BF6F" },
    { name: "Google Forms", price: "Free*", color: "#673AB7" },
    { name: "JotForm", price: "$34/mo", color: "#FF6100" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* "The old way" title */}
      <div style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <span style={{
          fontFamily: "system-ui",
          fontSize: 16,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}>
          The Old Way
        </span>
      </div>

      {/* Google Search Box */}
      <div style={{
        position: "absolute",
        top: 100,
        left: "50%",
        transform: "translateX(-50%)",
        width: 600,
        opacity: interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {/* Google Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 400 }}>
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
          </span>
        </div>
        {/* Search Bar */}
        <div style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: "14px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #dfe1e5",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#9aa0a6">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span style={{ fontFamily: "system-ui", fontSize: 16, color: "#202124" }}>
            {"best survey builder tool".slice(0, Math.floor(interpolate(frame, [fps * 1, fps * 2.5], [0, 25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))}
            <span style={{ opacity: Math.sin(frame / 4) > 0 ? 1 : 0, color: "#202124" }}>|</span>
          </span>
        </div>
      </div>

      {/* SaaS Products Grid */}
      <div style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 24,
        opacity: interpolate(frame, [fps * 3, fps * 3.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {saasProducts.map((product, i) => {
          const productDelay = fps * 3 + i * fps * 0.3;
          const productEntrance = spring({ frame: frame - productDelay, fps, config: { damping: 12 } });
          return (
            <div key={product.name} style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              width: 180,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              opacity: interpolate(productEntrance, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(productEntrance, [0, 1], [20, 0])}px)`,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: product.color,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{product.name[0]}</span>
              </div>
              <div style={{ fontFamily: "system-ui", fontSize: 16, fontWeight: 600, color: "#1f2937", marginBottom: 8 }}>
                {product.name}
              </div>
              <div style={{
                fontFamily: "system-ui",
                fontSize: 20,
                fontWeight: 700,
                color: "#ef4444",
              }}>
                {product.price}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pain point text */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [fps * 5, fps * 5.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 20,
          color: "#6b7280",
        }}>
          Sign up, learn the tool, pay monthly fees...
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 6: SURVEY NEW WAY (43-65s) ============
// Script: "The new way? Just combine a code agent with a skill that knows how to build
// world-class interactive forms, then tell the agent what you like, then wait for the magic
// to happen. The code agent will actually do research, build, deploy, and leverage the most
// expertise—and you get exactly what you needed. If it's not, ask the code agent to fix it."
const SurveyNewWayScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  // Phase timings within the 22-second scene
  const phases = {
    transition: { start: 0, end: fps * 1.5 },            // 0-1.5s: "The new way?"
    combineSkill: { start: fps * 1.5, end: fps * 7 },    // 1.5-7s: Combine agent + skill
    tellAgent: { start: fps * 7, end: fps * 12 },        // 7-12s: Tell agent what you want
    agentWorking: { start: fps * 12, end: fps * 18 },    // 12-18s: Research, build, deploy
    formSteps: { start: fps * 18, end: fps * 23 },       // 18-23s: Show final results
  };

  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const agentActions = [
    { text: "Researching best form practices...", icon: "🔍" },
    { text: "Building form structure...", icon: "⚙️" },
    { text: "Deploying to cloud...", icon: "☁️" },
    { text: "Form is live!", icon: "✅" },
  ];

  const formSteps = [
    "sections/06-new-way/assets/live-step1-coverage.png",
    "sections/06-new-way/assets/live-step2-property.png",
    "sections/06-new-way/assets/live-step3-deductible.png",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* Transition: "The new way?" */}
      {frame < phases.combineSkill.start && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [0, fps * 0.5], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>
            <h1 style={{
              fontFamily: "system-ui",
              fontSize: 52,
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
            }}>
              The <span style={{ color: "#374151" }}>new</span> way?
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* Combine Skill Phase: "Just combine a code agent with a skill" */}
      {frame >= phases.combineSkill.start && frame < phases.tellAgent.start && (
        <AbsoluteFill>
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${interpolate(frame, [phases.combineSkill.start, phases.combineSkill.start + fps * 1.2], [1, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            transformOrigin: "center center",
          }}>
            <Img
              src={staticFile("rebyte-input-typed.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Step indicator */}
          <div style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "10px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            opacity: interpolate(frame, [phases.combineSkill.start + fps * 0.3, phases.combineSkill.start + fps * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <span style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
              Combine Agent + Skill
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Tell Agent Phase: "Tell the agent what you like" */}
      {frame >= phases.tellAgent.start && frame < phases.agentWorking.start && (
        <AbsoluteFill>
          <Img
            src={staticFile("rebyte-input-typed.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${interpolate(frame, [phases.tellAgent.start, phases.tellAgent.start + fps * 1], [1, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              transformOrigin: "center center",
            }}
          />
          {/* Step indicator */}
          <div style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "10px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            <span style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
              Tell the agent what you want
            </span>
          </div>
          <div style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 28px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}>
            <span style={{ fontFamily: "system-ui", fontSize: 16, color: "#374151" }}>
              Describe what you need in plain English...
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Agent Working Phase */}
      {frame >= phases.agentWorking.start && frame < phases.formSteps.start && (
        <AbsoluteFill>
          <Img
            src={staticFile("rebyte-input-typed.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${interpolate(frame, [phases.agentWorking.start, phases.agentWorking.start + fps * 1], [1, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              transformOrigin: "center center",
            }}
          />
          {/* Agent Working Panel */}
          <div style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            padding: 24,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontFamily: "system-ui", fontSize: 16, color: "#1f2937", marginBottom: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚙️</span>
              Agent Working...
            </div>
            {agentActions.map((action, i) => {
              const actionStart = phases.agentWorking.start + i * fps * 1;
              const isActive = frame >= actionStart;
              const actionProgress = interpolate(frame, [actionStart, actionStart + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                  opacity: isActive ? actionProgress : 0.3,
                }}>
                  <span style={{ fontSize: 18 }}>{action.icon}</span>
                  <span style={{ fontFamily: "system-ui", fontSize: 14, color: isActive ? "#1f2937" : "#9ca3af" }}>
                    {action.text}
                  </span>
                  {isActive && actionProgress >= 1 && (
                    <span style={{ color: "#10b981", marginLeft: "auto", fontSize: 16 }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* Final Results: Full-screen steps, one by one */}
      {frame >= phases.formSteps.start && (
        <AbsoluteFill style={{ backgroundColor: "#f8fafc" }}>
          {formSteps.map((step, i) => {
            const perStep = (phases.formSteps.end - phases.formSteps.start) / formSteps.length;
            const stepStart = phases.formSteps.start + i * perStep;
            const stepEnd = stepStart + perStep;
            const opacity = interpolate(frame, [stepStart, stepStart + fps * 0.2, stepEnd - fps * 0.2, stepEnd], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const scale = interpolate(frame, [stepStart, stepStart + fps * 0.75], [1.02, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <AbsoluteFill key={step} style={{ opacity, transform: `scale(${scale})` }}>
                <Img src={staticFile(step)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </AbsoluteFill>
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ SCENE 7: SPREADSHEET BUILDER (65-80s) ============
// Script: "Tired of spreadsheets? Let the code agent help you. Equip a spreadsheet builder
// skill with the code agent, let it build world-class collaborative spreadsheets for you.
// You and the agent can collaborate on the spreadsheet together to make work done much faster than ever before."
const SpreadsheetScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  // Phase timings for ~16.75 seconds
  // Script: "Tired of spreadsheets? Let the code agent help you. Equip a spreadsheet builder skill
  // with the code agent, let it build world-class collaborative spreadsheets for you. You and the
  // agent can collaborate on the spreadsheet together to make work done much faster than ever before."
  const phases = {
    prompt: { start: 0, end: fps * 4 },                   // 0-4s: Zoom to user prompt
    agentWorking: { start: fps * 4, end: fps * 11 },      // 4-11s: Pan to show execution steps
    result: { start: fps * 11, end: fps * 17 },           // 11-17s: Show final spreadsheet
  };

  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Image dimensions: 2800x1618, viewport: 1280x720
  // Using transform-origin to set focal point, then just scale
  //
  // Layout analysis (from screenshot):
  // - Prompt bubble: TOP-RIGHT area (user message with avatar on right, ~72% from left, ~4% from top)
  // - Execution steps: LEFT side (~18% from left, ~12-20% from top)
  // - Spreadsheet embed: CENTER-LEFT area (~35% from left, ~30% from top)

  // Phase 1: Zoom into prompt area (TOP-RIGHT where user message is)
  const phase1Scale = interpolate(frame, [0, fps * 0.5, fps * 3.5], [1, 1, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase1OriginX = 72; // prompt is at far right (user message bubble)
  const phase1OriginY = 4;  // prompt is at very top

  // Phase 2: Pan to execution steps (LEFT side, below prompt)
  const phase2Scale = interpolate(frame, [phases.agentWorking.start, phases.agentWorking.end], [2.5, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase2OriginX = interpolate(frame, [phases.agentWorking.start, phases.agentWorking.start + fps * 2], [72, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase2OriginY = interpolate(frame, [phases.agentWorking.start, phases.agentWorking.start + fps * 2, phases.agentWorking.end], [4, 14, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Determine current values based on phase
  let scale = phase1Scale;
  let originX = phase1OriginX;
  let originY = phase1OriginY;

  if (frame >= phases.agentWorking.start && frame < phases.result.start) {
    scale = phase2Scale;
    originX = phase2OriginX;
    originY = phase2OriginY;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* Phases 1-2: Show full Rebyte task page with zoom/pan */}
      {frame < phases.result.start && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile("sections/07-spreadsheet/assets/rebyte-task-full.png")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
              transformOrigin: `${originX}% ${originY}%`,
            }}
          />
          {/* Phase indicator overlay */}
          <div style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "10px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            opacity: interpolate(frame, [fps * 0.5, fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <span style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
              {frame < phases.agentWorking.start ? "📝 User Request" : "⚙️ Agent Working..."}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 3: Show final spreadsheet result */}
      {frame >= phases.result.start && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 30 }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%",
          }}>
            {/* Success message */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 24px",
              backgroundColor: "#ecfdf5",
              borderRadius: 999,
              border: "1px solid #a7f3d0",
              opacity: interpolate(frame, [phases.result.start, phases.result.start + fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{ fontFamily: "system-ui", fontSize: 18, fontWeight: 600, color: "#059669" }}>
                Done in seconds!
              </span>
            </div>
            {/* Full spreadsheet screenshot */}
            <div style={{
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              border: "2px solid #e5e7eb",
              maxWidth: 1100,
              opacity: interpolate(frame, [phases.result.start + fps * 0.3, phases.result.start + fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(frame, [phases.result.start + fps * 0.3, phases.result.start + fps * 0.8], [0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            }}>
              <Img
                src={staticFile("sections/07-spreadsheet/assets/spreadsheet-result.png")}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ SCENE 8: CODING CAPABILITIES (80-100s) ============
// Script: "Also, let's get back to coding itself. We run all those code agents on cloud,
// each task runs in a pure isolated environment. You can ask it to fix bugs, implement
// new features, or resolve GitHub issues. You can also assign a single coding task to
// different agents and pick whichever you think is best."
const CodingScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  // Two-part narrative: ~17.2 seconds total
  // Part 1 (0-9s): The Problem - Local machine limitations
  // Part 2 (9-17s): The Solution - Cloud isolation
  const phases = {
    // Part 1: The Problem
    intro: { start: 0, end: fps * 2 },                      // 0-2s: "Back to coding"
    localSetup: { start: fps * 2, end: fps * 5 },           // 2-5s: Show local machine with agents
    conflicts: { start: fps * 5, end: fps * 9 },            // 5-9s: Show conflicts/errors
    // Part 2: The Solution
    transition: { start: fps * 9, end: fps * 10 },          // 9-10s: Transition to cloud
    cloudIsolation: { start: fps * 10, end: fps * 17 },     // 10-17s: Show isolated VMs
  };

  const exitOpacity = interpolate(frame, [sceneDuration - fps * 0.5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Agents trying to run locally
  const localAgents = [
    { name: "Agent 1", task: "npm run dev", color: "#D97706" },
    { name: "Agent 2", task: "npm test", color: "#3186FF" },
    { name: "Agent 3", task: "npm run dev", color: "#10A37F" },
  ];

  // Conflict errors that appear
  const conflicts = [
    { error: "Error: Port 3000 already in use", icon: "🔴", delay: 0 },
    { error: "Error: Cannot acquire lock on test runner", icon: "🔴", delay: fps * 0.8 },
    { error: "Error: EADDRINUSE - address already in use", icon: "🔴", delay: fps * 1.6 },
  ];

  // Cloud VMs with different skills - code agent + skill concept
  const cloudVMs = [
    {
      name: "VM 1",
      skill: "Security Review",
      command: "Analyzing codebase...",
      status: "3 vulnerabilities found & fixed",
      icon: "🔒",
    },
    {
      name: "VM 2",
      skill: "Next.js Builder",
      command: "Building application...",
      status: "Build complete ✓",
      icon: "⚡",
    },
    {
      name: "VM 3",
      skill: "Unit Testing",
      command: "Running test suite...",
      status: "47/47 tests pass ✓",
      icon: "🧪",
    },
  ];

  // Additional skills to display
  const codingSkills = [
    { icon: "🔒", name: "Security Review" },
    { icon: "⚡", name: "Next.js Builder" },
    { icon: "🦀", name: "Rust Developer" },
    { icon: "🐛", name: "Bug Fixer" },
    { icon: "🧪", name: "Unit Testing" },
    { icon: "📊", name: "Data Pipeline" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc", opacity: exitOpacity }}>
      {/* ===== PART 1: THE PROBLEM ===== */}

      {/* Intro: "Back to coding" */}
      {frame < phases.localSetup.start && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{
            opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [0, fps * 0.5], [0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          }}>
            <h1 style={{
              fontFamily: "system-ui",
              fontSize: 56,
              fontWeight: 700,
              color: "#1f2937",
              textAlign: "center",
              margin: 0,
            }}>
              Back to coding
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {/* Local Setup: Show laptop with multiple agents */}
      {frame >= phases.localSetup.start && frame < phases.transition.start && (
        <AbsoluteFill style={{ padding: 50 }}>
          {/* Header */}
          <div style={{
            textAlign: "center",
            marginBottom: 30,
            opacity: interpolate(frame, [phases.localSetup.start, phases.localSetup.start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <h2 style={{ fontFamily: "system-ui", fontSize: 32, fontWeight: 700, color: "#1f2937", margin: 0 }}>
              On your local machine...
            </h2>
            <p style={{ fontFamily: "system-ui", fontSize: 18, color: "#6b7280", marginTop: 8 }}>
              Running multiple agents on the same repo
            </p>
          </div>

          {/* Laptop container */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 40,
          }}>
            {/* Laptop illustration */}
            <div style={{
              width: 700,
              backgroundColor: "#1e293b",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              opacity: interpolate(frame, [phases.localSetup.start, phases.localSetup.start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              {/* Terminal header */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#eab308" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e" }} />
                <span style={{ marginLeft: 12, fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>Terminal — ~/my-project</span>
              </div>

              {/* Terminal content - agents trying to run */}
              <div style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 1.8 }}>
                {localAgents.map((agent, i) => {
                  const agentDelay = phases.localSetup.start + fps * 0.3 * i;
                  const agentOpacity = interpolate(frame, [agentDelay, agentDelay + fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={agent.name} style={{ opacity: agentOpacity, marginBottom: 8 }}>
                      <span style={{ color: "#22c55e" }}>$</span>
                      <span style={{ color: "#e2e8f0", marginLeft: 8 }}>{agent.task}</span>
                      <span style={{ color: "#64748b", marginLeft: 16 }}>  # {agent.name}</span>
                    </div>
                  );
                })}

                {/* Error messages */}
                {frame >= phases.conflicts.start && conflicts.map((conflict, i) => {
                  const errorDelay = phases.conflicts.start + conflict.delay;
                  const errorOpacity = interpolate(frame, [errorDelay, errorDelay + fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const shake = frame >= errorDelay && frame < errorDelay + fps * 0.5
                    ? Math.sin((frame - errorDelay) * 0.5) * 3
                    : 0;
                  return (
                    <div key={conflict.error} style={{
                      opacity: errorOpacity,
                      marginTop: i === 0 ? 20 : 8,
                      transform: `translateX(${shake}px)`,
                      padding: "8px 12px",
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      borderRadius: 6,
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}>
                      <span style={{ color: "#ef4444" }}>{conflict.icon} {conflict.error}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side explanation */}
            {frame >= phases.conflicts.start && (
              <div style={{
                width: 320,
                opacity: interpolate(frame, [phases.conflicts.start, phases.conflicts.start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                <div style={{
                  backgroundColor: "#fef2f2",
                  borderRadius: 12,
                  padding: 24,
                  border: "2px solid #fecaca",
                }}>
                  <h3 style={{ fontFamily: "system-ui", fontSize: 18, fontWeight: 700, color: "#991b1b", margin: "0 0 16px 0" }}>
                    The Problem
                  </h3>
                  <div style={{ fontFamily: "system-ui", fontSize: 14, color: "#7f1d1d", lineHeight: 1.6 }}>
                    <p style={{ margin: "0 0 12px 0" }}>• Same port conflicts</p>
                    <p style={{ margin: "0 0 12px 0" }}>• Test runner locks</p>
                    <p style={{ margin: 0 }}>• Resource contention</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ===== PART 2: THE SOLUTION ===== */}

      {/* Cloud Isolation */}
      {frame >= phases.transition.start && (
        <AbsoluteFill style={{ padding: "30px 50px" }}>
          {/* Header */}
          <div style={{
            textAlign: "center",
            marginBottom: 24,
            opacity: interpolate(frame, [phases.transition.start, phases.transition.start + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <h2 style={{ fontFamily: "system-ui", fontSize: 32, fontWeight: 700, color: "#1f2937", margin: 0 }}>
              The new way? <span style={{ color: "#0ea5e9" }}>Cloud isolation</span>
            </h2>
            <p style={{ fontFamily: "system-ui", fontSize: 18, color: "#6b7280", marginTop: 8 }}>
              Each task runs in complete isolation — <span style={{ color: "#0ea5e9", fontWeight: 600 }}>Code Agent + Skill</span>
            </p>
          </div>

          {/* Cloud VMs with Skills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            {cloudVMs.map((vm, i) => {
              const vmDelay = phases.cloudIsolation.start + fps * 0.4 * i;
              const vmEntrance = spring({ frame: frame - vmDelay, fps, config: { damping: 12 } });
              return (
                <div key={vm.name} style={{
                  width: 320,
                  backgroundColor: "white",
                  borderRadius: 16,
                  border: "2px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                  opacity: interpolate(vmEntrance, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(vmEntrance, [0, 1], [30, 0])}px)`,
                }}>
                  {/* VM Header with Skill */}
                  <div style={{
                    backgroundColor: "#0ea5e9",
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                      </svg>
                      <span style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 600, color: "white" }}>
                        Isolated {vm.name}
                      </span>
                    </div>
                  </div>

                  {/* VM Content */}
                  <div style={{ padding: 16 }}>
                    {/* Skill badge */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                      padding: "8px 12px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: 8,
                      border: "1px solid #bae6fd",
                    }}>
                      <span style={{ fontSize: 20 }}>{vm.icon}</span>
                      <div>
                        <div style={{ fontFamily: "system-ui", fontSize: 11, color: "#0369a1", fontWeight: 500 }}>
                          Code Agent + Skill
                        </div>
                        <div style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: "#0c4a6e" }}>
                          {vm.skill}
                        </div>
                      </div>
                    </div>

                    {/* Terminal mini */}
                    <div style={{
                      backgroundColor: "#1e293b",
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 12,
                    }}>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>
                        {vm.command}
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      backgroundColor: "#ecfdf5",
                      borderRadius: 8,
                      border: "1px solid #a7f3d0",
                    }}>
                      <span style={{ fontSize: 14 }}>✅</span>
                      <span style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 500, color: "#059669" }}>
                        {vm.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skills Grid */}
          <div style={{
            marginTop: 28,
            opacity: interpolate(frame, [phases.cloudIsolation.start + fps * 1.5, phases.cloudIsolation.start + fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: 16,
            }}>
              <span style={{ fontFamily: "system-ui", fontSize: 14, color: "#6b7280" }}>
                Available coding skills:
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {codingSkills.map((skill, i) => {
                const skillDelay = phases.cloudIsolation.start + fps * 2 + i * fps * 0.15;
                const skillOpacity = interpolate(frame, [skillDelay, skillDelay + fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={skill.name} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    backgroundColor: "white",
                    borderRadius: 999,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    opacity: skillOpacity,
                  }}>
                    <span style={{ fontSize: 16 }}>{skill.icon}</span>
                    <span style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ============ SCENE 9: OUTRO (100-112s) ============
// Script: "See what's possible. Real results from real users. Rebyte. Vibe working with skilled code agents."
const OutroScene = ({ frame, fps }: { frame: number; fps: number }) => {
  // All capability chips from the Rebyte platform
  const capabilities = [
    // Row 1
    { icon: "📊", label: "Create spreadsheets" },
    { icon: "📽️", label: "Create presentation" },
    { icon: "🎬", label: "Create a video" },
    { icon: "📝", label: "Create forms" },
    // Row 2
    { icon: "🔍", label: "Deep research" },
    { icon: "📈", label: "Data analysis" },
    { icon: "📉", label: "Financial analysis" },
    { icon: "🖼️", label: "Image generation", isPro: true },
    // Row 3
    { icon: "🗄️", label: "Data collection" },
    { icon: "📄", label: "Document processing" },
    // Row 4
    { icon: "🚀", label: "Create web app" },
    { icon: "🤖", label: "Create AI agent" },
    { icon: "⚙️", label: "Create with backend" },
    { icon: "🧩", label: "Chrome extension" },
    // Row 5
    { icon: "▲", label: "Create app on Vercel" },
    { icon: "🔀", label: "Code review" },
    { icon: "🎨", label: "UI/UX design", isPro: true },
  ];

  // Chip component
  const Chip = ({ icon, label, isPro, index }: { icon: string; label: string; isPro?: boolean; index: number }) => {
    const delay = fps * 0.8 + index * fps * 0.08; // Staggered entrance
    const chipEntrance = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
    const chipOpacity = interpolate(chipEntrance, [0, 1], [0, 1]);
    const chipScale = interpolate(chipEntrance, [0, 1], [0.8, 1]);
    const chipY = interpolate(chipEntrance, [0, 1], [15, 0]);

    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        backgroundColor: "white",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        opacity: chipOpacity,
        transform: `scale(${chipScale}) translateY(${chipY}px)`,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: "system-ui", fontSize: 15, fontWeight: 500, color: "#374151" }}>
          {label}
        </span>
        {isPro && (
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "system-ui",
            fontSize: 12,
            fontWeight: 600,
            color: "#f59e0b",
          }}>
            ✨ Pro
          </span>
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        paddingTop: 50,
        opacity: interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [0, fps * 0.5], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <h1 style={{
          fontFamily: "system-ui",
          fontSize: 44,
          fontWeight: 700,
          color: "#1f2937",
          margin: 0,
        }}>
          See what's <span style={{ color: "#0ea5e9" }}>possible</span>
        </h1>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 18,
          color: "#6b7280",
          marginTop: 10,
        }}>
          Unleash your imagination with Rebyte
        </p>
      </div>

      {/* Chips Grid */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "30px 60px",
      }}>
        {/* Row 1 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {capabilities.slice(0, 4).map((cap, i) => (
            <Chip key={cap.label} {...cap} index={i} />
          ))}
        </div>
        {/* Row 2 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {capabilities.slice(4, 8).map((cap, i) => (
            <Chip key={cap.label} {...cap} index={i + 4} />
          ))}
        </div>
        {/* Row 3 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {capabilities.slice(8, 10).map((cap, i) => (
            <Chip key={cap.label} {...cap} index={i + 8} />
          ))}
        </div>
        {/* Row 4 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {capabilities.slice(10, 14).map((cap, i) => (
            <Chip key={cap.label} {...cap} index={i + 10} />
          ))}
        </div>
        {/* Row 5 */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {capabilities.slice(14, 17).map((cap, i) => (
            <Chip key={cap.label} {...cap} index={i + 14} />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [fps * 4, fps * 4.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 20,
          fontWeight: 600,
          color: "#0ea5e9",
          margin: 0,
        }}>
          Unleash the full potential of code agents
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ LEGACY: CTAScene (kept for reference, replaced by OutroScene) ============
const CTAScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [fps * 1, fps * 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ transform: `scale(${logoScale})` }}>
          <RebyteLogo size={100} color="#1f2937" innerColor="#f8fafc" />
        </div>
        <div style={{ opacity: textOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontFamily: "system-ui", fontSize: 56, fontWeight: 700, color: "#1f2937", margin: 0 }}>
            rebyte.ai
          </h1>
        </div>
        <p style={{
          fontFamily: "system-ui",
          fontSize: 24,
          color: "#6b7280",
          margin: 0,
          opacity: taglineOpacity,
        }}>
          Vibe working with skilled code agents
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 10: TAGLINE ============
// Script: "Rebyte. Vibe working with skilled code agents."
const TaglineScene = ({ frame, fps, sceneDuration }: { frame: number; fps: number; sceneDuration: number }) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const textOpacity = interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 24,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        transform: `scale(${logoScale})`,
      }}>
        <RebyteLogo size={80} color="#1f2937" innerColor="#ffffff" />
        <span style={{
          fontFamily: "system-ui",
          fontSize: 64,
          fontWeight: 700,
          color: "#1f2937",
        }}>
          Rebyte
        </span>
      </div>
      <p style={{
        fontFamily: "system-ui",
        fontSize: 28,
        color: "#6b7280",
        margin: 0,
        opacity: textOpacity,
      }}>
        Vibe working with skilled code agents
      </p>
    </AbsoluteFill>
  );
};

// ============ PROGRESS BAR ============
const ProgressBar = ({ frame, durationInFrames }: { frame: number; durationInFrames: number }) => {
  const progress = (frame / durationInFrames) * 100;

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: "rgba(0,0,0,0.08)",
    }}>
      <div style={{
        width: `${progress}%`,
        height: "100%",
        background: "linear-gradient(90deg, #374151, #374151)",
      }} />
    </div>
  );
};
