import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

// ============ LOGOS ============
const RebyteLogo = ({ size = 80, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-label="Rebyte">
    <circle cx="8" cy="16" r="8" fill={color} />
    <path d="M19 8 H24 C28.418 8 32 11.582 32 16 C32 20.418 28.418 24 24 24 H19 V8 Z" fill={color} />
    <rect x="4" y="14.5" width="12" height="3" fill="#f8f8f7" />
    <rect x="19" y="14.5" width="10" height="3" fill="#f8f8f7" />
  </svg>
);

const ClaudeLogo = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#D97706">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
  </svg>
);

const GeminiLogo = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <defs>
      <linearGradient id="gemini-g0" x1="7" x2="11" y1="15.5" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#08B962" />
        <stop offset="1" stopColor="#08B962" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gemini-g1" x1="8" x2="11.5" y1="5.5" y2="11" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F94543" />
        <stop offset="1" stopColor="#F94543" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gemini-g2" x1="3.5" x2="17.5" y1="13.5" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FABC12" />
        <stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-g0)" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-g1)" />
    <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#gemini-g2)" />
  </svg>
);

const OpenAILogo = ({ size = 40 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#10A37F">
    <path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z" />
  </svg>
);

// ============ ICONS ============
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CloudIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const LockIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const RocketIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const TableIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
  </svg>
);

const SearchIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CodeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DatabaseIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

// ============ MAIN COMPONENT ============
export const RebyteIntro = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timings (30 seconds total = 900 frames at 30fps)
  const scenes = {
    opening: { start: 0, end: fps * 3 },           // 0-3s
    everyTask: { start: fps * 3, end: fps * 7 },   // 3-7s
    genericAgent: { start: fps * 7, end: fps * 11 }, // 7-11s
    codeAgents: { start: fps * 11, end: fps * 16 }, // 11-16s
    longHorizon: { start: fps * 16, end: fps * 19 }, // 16-19s
    cloudNative: { start: fps * 19, end: fps * 24 }, // 19-24s
    concurrent: { start: fps * 24, end: fps * 27 }, // 24-27s
    cta: { start: fps * 27, end: durationInFrames }, // 27-30s
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#f8f8f7" }}>
      {/* Voiceover */}
      <Audio src={staticFile("voiceover.mp3")} volume={1} />

      {/* Scene 1: Opening - Logo reveal */}
      <Sequence from={scenes.opening.start} durationInFrames={fps * 4}>
        <OpeningScene frame={frame} fps={fps} />
      </Sequence>

      {/* Scene 2: Every Task is Software */}
      <Sequence from={scenes.everyTask.start} durationInFrames={fps * 5}>
        <EveryTaskScene frame={frame - scenes.everyTask.start} fps={fps} />
      </Sequence>

      {/* Scene 3: Generic Agent */}
      <Sequence from={scenes.genericAgent.start} durationInFrames={fps * 5}>
        <GenericAgentScene frame={frame - scenes.genericAgent.start} fps={fps} />
      </Sequence>

      {/* Scene 4: Code Agents Showcase */}
      <Sequence from={scenes.codeAgents.start} durationInFrames={fps * 6}>
        <CodeAgentsScene frame={frame - scenes.codeAgents.start} fps={fps} />
      </Sequence>

      {/* Scene 5: Long-Horizon Tasks */}
      <Sequence from={scenes.longHorizon.start} durationInFrames={fps * 4}>
        <LongHorizonScene frame={frame - scenes.longHorizon.start} fps={fps} />
      </Sequence>

      {/* Scene 6: Cloud Native */}
      <Sequence from={scenes.cloudNative.start} durationInFrames={fps * 6}>
        <CloudNativeScene frame={frame - scenes.cloudNative.start} fps={fps} />
      </Sequence>

      {/* Scene 7: Concurrent Tasks */}
      <Sequence from={scenes.concurrent.start} durationInFrames={fps * 4}>
        <ConcurrentScene frame={frame - scenes.concurrent.start} fps={fps} />
      </Sequence>

      {/* Scene 8: CTA */}
      <Sequence from={scenes.cta.start} durationInFrames={fps * 4}>
        <CTAScene frame={frame - scenes.cta.start} fps={fps} />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar frame={frame} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};

// ============ SCENE 1: OPENING ============
const OpeningScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const textOpacity = interpolate(frame, [fps * 0.8, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(frame, [fps * 0.8, fps * 1.3], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Exit animation
  const exitOpacity = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOpacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ transform: `scale(${logoScale})` }}>
          <RebyteLogo size={120} color="#1a1a1a" />
        </div>
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          <h1 style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
            Introducing <span style={{ color: "#3b82f6" }}>Rebyte</span>
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 2: EVERY TASK IS SOFTWARE ============
const EveryTaskScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [fps * 3.5, fps * 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tasks = [
    { icon: CodeIcon, label: "Complex software", delay: 0.3 },
    { icon: RocketIcon, label: "Build websites", delay: 0.5 },
    { icon: DatabaseIcon, label: "Data cleaning", delay: 0.7 },
    { icon: SearchIcon, label: "Deep research", delay: 0.9 },
    { icon: TableIcon, label: "Spreadsheets", delay: 1.1 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOpacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{
          opacity: interpolate(entrance, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`
        }}>
          <h2 style={{ fontFamily: "system-ui", fontSize: 56, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
            Every task is a <span style={{ color: "#8b5cf6" }}>software task</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {tasks.map((task) => {
            const taskEntrance = spring({ frame: frame - fps * task.delay, fps, config: { damping: 12, stiffness: 100 } });
            const Icon = task.icon;
            return (
              <div
                key={task.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderRadius: 50,
                  backgroundColor: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  transform: `scale(${interpolate(taskEntrance, [0, 1], [0.8, 1])})`,
                  opacity: interpolate(taskEntrance, [0, 1], [0, 1]),
                }}
              >
                <Icon size={22} />
                <span style={{ fontFamily: "system-ui", fontSize: 18, fontWeight: 500, color: "#374151" }}>
                  {task.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 3: GENERIC AGENT ============
const GenericAgentScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [fps * 3.5, fps * 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOpacity }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [40, 0])}px)`
      }}>
        <h2 style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center", maxWidth: 900 }}>
          A <span style={{ color: "#3b82f6" }}>generic agent</span> that leverages
        </h2>
        <h2 style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
          code agents <span style={{ color: "#10b981" }}>in the cloud</span>
        </h2>

        {/* Cloud illustration */}
        <div style={{
          marginTop: 20,
          padding: "30px 60px",
          backgroundColor: "#E5F0E8",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}>
          <CloudIcon size={48} />
          <span style={{ fontFamily: "system-ui", fontSize: 24, fontWeight: 600, color: "#166534" }}>
            Cloud-Powered Execution
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 4: CODE AGENTS SHOWCASE ============
const CodeAgentsScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const exitOpacity = interpolate(frame, [fps * 4.5, fps * 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const agents = [
    { name: "Claude", Logo: ClaudeLogo, color: "#D97706", delay: 0.2 },
    { name: "Gemini", Logo: GeminiLogo, color: "#3186FF", delay: 0.5 },
    { name: "OpenAI Codex", Logo: OpenAILogo, color: "#10A37F", delay: 0.8 },
    { name: "Rebyte", Logo: () => <RebyteLogo size={40} color="#1a1a1a" />, color: "#1a1a1a", delay: 1.1 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: exitOpacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* Title */}
        <div style={{
          opacity: interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <h2 style={{ fontFamily: "system-ui", fontSize: 44, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
            Code Agent <span style={{ color: "#8b5cf6" }}>Agnostic</span>
          </h2>
          <p style={{ fontFamily: "system-ui", fontSize: 22, color: "#6b7280", margin: "12px 0 0 0", textAlign: "center" }}>
            Using state-of-the-art code agents
          </p>
        </div>

        {/* Agent logos */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {agents.map((agent) => {
            const agentEntrance = spring({ frame: frame - fps * agent.delay, fps, config: { damping: 12, stiffness: 100 } });
            const Logo = agent.Logo;
            return (
              <div
                key={agent.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "24px 32px",
                  backgroundColor: "white",
                  borderRadius: 20,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  transform: `scale(${interpolate(agentEntrance, [0, 1], [0.5, 1])}) translateY(${interpolate(agentEntrance, [0, 1], [20, 0])}px)`,
                  opacity: interpolate(agentEntrance, [0, 1], [0, 1]),
                }}
              >
                <Logo size={48} />
                <span style={{ fontFamily: "system-ui", fontSize: 16, fontWeight: 600, color: "#374151" }}>
                  {agent.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Checkmark badges */}
        <div style={{
          display: "flex",
          gap: 24,
          opacity: interpolate(frame, [fps * 1.5, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          {["No programming needed", "Best agent for each task"].map((text) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, color: "#059669" }}>
              <CheckIcon />
              <span style={{ fontFamily: "system-ui", fontSize: 16, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 5: LONG-HORIZON TASKS ============
const LongHorizonScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sources = [
    { name: "SEC 10-K Filing", icon: "📄", delay: 0.3 },
    { name: "Market Data API", icon: "📊", delay: 0.5 },
    { name: "Earnings Transcripts", icon: "🎙️", delay: 0.7 },
    { name: "Analyst Reports", icon: "📈", delay: 0.9 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#E8E4F0", opacity: exitOpacity }}>
      <div style={{
        display: "flex",
        gap: 80,
        alignItems: "center",
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      }}>
        {/* Left: Title */}
        <div style={{ maxWidth: 400 }}>
          <h2 style={{ fontFamily: "system-ui", fontSize: 52, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
            Long-Horizon Tasks
          </h2>
          <p style={{ fontFamily: "system-ui", fontSize: 20, color: "#6b7280", marginTop: 16 }}>
            Deep research, data collection, multi-step workflows
          </p>
        </div>

        {/* Right: Card illustration */}
        <div style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          width: 380,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#8b5cf6" }} />
            <span style={{ fontFamily: "system-ui", fontSize: 12, color: "#6b7280" }}>Deep research task</span>
          </div>
          <h4 style={{ fontFamily: "system-ui", fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>
            Analyze AAPL investment potential
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {sources.map((source) => {
              const sourceEntrance = spring({ frame: frame - fps * source.delay, fps, config: { damping: 12 } });
              return (
                <div
                  key={source.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: 8,
                    transform: `scale(${interpolate(sourceEntrance, [0, 1], [0.9, 1])})`,
                    opacity: interpolate(sourceEntrance, [0, 1], [0, 1]),
                  }}
                >
                  <span>{source.icon}</span>
                  <span style={{ fontFamily: "system-ui", fontSize: 11, color: "#374151" }}>{source.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 6: CLOUD NATIVE ============
const CloudNativeScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [fps * 4.5, fps * 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const features = [
    { icon: CloudIcon, text: "Fully in the cloud", delay: 0.3 },
    { icon: LockIcon, text: "Secure & isolated", delay: 0.6 },
    { text: "No laptop required", delay: 0.9 },
  ];

  const logs = [
    { text: "$ git clone repo...", delay: 1.2 },
    { text: "$ npm install", delay: 1.5 },
    { text: "$ claude-code start", delay: 1.8 },
    { text: "> Analyzing codebase...", delay: 2.1 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#E5F0E8", opacity: exitOpacity }}>
      <div style={{
        display: "flex",
        gap: 60,
        alignItems: "center",
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      }}>
        {/* Left: Title & features */}
        <div style={{ maxWidth: 450 }}>
          <h2 style={{ fontFamily: "system-ui", fontSize: 52, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>
            Cloud Native
          </h2>
          <p style={{ fontFamily: "system-ui", fontSize: 20, color: "#6b7280", marginTop: 16, marginBottom: 24 }}>
            Your tasks run in isolated cloud environments
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map((feature) => {
              const featureEntrance = spring({ frame: frame - fps * feature.delay, fps, config: { damping: 12 } });
              return (
                <div
                  key={feature.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: interpolate(featureEntrance, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(featureEntrance, [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#166534",
                  }}>
                    {feature.icon ? <feature.icon size={18} /> : "💻"}
                  </div>
                  <span style={{ fontFamily: "system-ui", fontSize: 18, fontWeight: 500, color: "#166534" }}>
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Terminal */}
        <div style={{
          backgroundColor: "#18181b",
          borderRadius: 16,
          padding: 20,
          width: 400,
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#eab308" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e" }} />
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 14 }}>
            {logs.map((log, i) => {
              const logOpacity = interpolate(frame, [fps * log.delay, fps * log.delay + fps * 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ color: "#4ade80", opacity: logOpacity, marginBottom: 6 }}>
                  {log.text}
                </div>
              );
            })}
            {/* Blinking cursor */}
            <span style={{
              display: "inline-block",
              width: 8,
              height: 16,
              backgroundColor: "#4ade80",
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 7: CONCURRENT TASKS ============
const ConcurrentScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const exitOpacity = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tasks = [
    { agent: "Claude", task: "Building auth API", color: "#D97706" },
    { agent: "Gemini", task: "Writing unit tests", color: "#3186FF" },
    { agent: "Codex", task: "Deploying to prod", color: "#10A37F" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#E3EDF7", opacity: exitOpacity }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
      }}>
        <div>
          <h2 style={{ fontFamily: "system-ui", fontSize: 48, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center" }}>
            Multiple <span style={{ color: "#3b82f6" }}>Concurrent</span> Requests
          </h2>
          <p style={{ fontFamily: "system-ui", fontSize: 20, color: "#6b7280", marginTop: 12, textAlign: "center" }}>
            Run tasks in parallel without interference
          </p>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {tasks.map((task, i) => {
            const taskEntrance = spring({ frame: frame - fps * (0.3 + i * 0.2), fps, config: { damping: 12 } });
            const pulse = Math.sin((frame + i * 10) * 0.15) * 0.5 + 0.5;
            return (
              <div
                key={task.agent}
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  padding: 20,
                  width: 200,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  transform: `scale(${interpolate(taskEntrance, [0, 1], [0.8, 1])})`,
                  opacity: interpolate(taskEntrance, [0, 1], [0, 1]),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: task.color,
                    opacity: 0.5 + pulse * 0.5,
                  }} />
                  <span style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: task.color }}>
                    {task.agent}
                  </span>
                </div>
                <p style={{ fontFamily: "system-ui", fontSize: 13, color: "#6b7280", margin: 0 }}>
                  {task.task}
                </p>
                {/* Progress bar */}
                <div style={{
                  marginTop: 12,
                  height: 4,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 2,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${30 + pulse * 40}%`,
                    backgroundColor: task.color,
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SCENE 8: CTA ============
const CTAScene = ({ frame, fps }: { frame: number; fps: number }) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a1a" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ transform: `scale(${logoScale})` }}>
          <RebyteLogo size={100} color="white" />
        </div>
        <div style={{ opacity: textOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontFamily: "system-ui", fontSize: 56, fontWeight: 700, color: "white", margin: 0 }}>
            rebyte.ai
          </h1>
          <p style={{ fontFamily: "system-ui", fontSize: 22, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Vibe working with skilled code agents
          </p>
        </div>
      </div>
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
      backgroundColor: "rgba(0,0,0,0.1)",
    }}>
      <div style={{
        width: `${progress}%`,
        height: "100%",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
      }} />
    </div>
  );
};
