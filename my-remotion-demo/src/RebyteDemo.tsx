import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
  Sequence,
} from "remotion";
import { Audio } from "@remotion/media";

// Audio URLs
const BG_MUSIC_URL = "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3";
const WHOOSH_URL = "https://cdn.freesound.org/previews/521/521973_10624938-lq.mp3";
const CLICK_URL = "https://cdn.freesound.org/previews/566/566388_11943129-lq.mp3";

export const RebyteDemo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timings
  const scenes = {
    s1: { start: 0, end: fps * 3 },                    // Homepage
    s2: { start: fps * 2.7, end: fps * 5.5 },          // Skills page
    s3: { start: fps * 5.2, end: fps * 8 },            // Prompt filled
    s4: { start: fps * 7.7, end: fps * 11 },           // Agent streaming
    s5: { start: fps * 10.7, end: fps * 14 },          // Result in chat
    s6: { start: fps * 13.7, end: fps * 17 },          // Full spreadsheet
    s7: { start: fps * 16.7, end: durationInFrames },  // Collaborative view
  };

  return (
    <AbsoluteFill style={{ background: "#f5f5f7" }}>
      {/* Background music */}
      <Audio
        src={BG_MUSIC_URL}
        volume={(f) =>
          interpolate(f, [0, fps, durationInFrames - fps * 2, durationInFrames], [0, 0.12, 0.12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* Sound effects */}
      <SoundEffects fps={fps} scenes={scenes} />

      {/* Background */}
      <GradientBackground frame={frame} />

      {/* Scene 1: Homepage */}
      <SceneWrapper start={scenes.s1.start} end={scenes.s1.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-homepage.png"
          frame={frame}
          fps={fps}
          sceneStart={scenes.s1.start}
          sceneEnd={scenes.s1.end}
          cursor={{ startX: 70, startY: 25, endX: 38, endY: 57, clickAt: fps * 2.3 }}
          highlight={{ top: "56%", left: "32.5%", width: "10%", height: "4.5%" }}
        />
      </SceneWrapper>

      {/* Scene 2: Skills page */}
      <SceneWrapper start={scenes.s2.start} end={scenes.s2.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-page2.png"
          frame={frame - scenes.s2.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s2.end - scenes.s2.start}
          cursor={{ startX: 65, startY: 30, endX: 35, endY: 55, clickAt: fps * 2 }}
          highlight={{ top: "54%", left: "24%", width: "15%", height: "6%" }}
        />
      </SceneWrapper>

      {/* Scene 3: Prompt filled */}
      <SceneWrapper start={scenes.s3.start} end={scenes.s3.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-prompt-filled.png"
          frame={frame - scenes.s3.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s3.end - scenes.s3.start}
          cursor={{ startX: 85, startY: 70, endX: 85, endY: 70, clickAt: fps * 2 }}
          highlight={{ top: "78%", left: "90%", width: "6%", height: "12%" }}
        />
      </SceneWrapper>

      {/* Scene 4: Agent streaming */}
      <SceneWrapper start={scenes.s4.start} end={scenes.s4.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-streaming.png"
          frame={frame - scenes.s4.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s4.end - scenes.s4.start}
          streamingEffect
        />
      </SceneWrapper>

      {/* Scene 5: Result embedded in chat */}
      <SceneWrapper start={scenes.s5.start} end={scenes.s5.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-result-embed.png"
          frame={frame - scenes.s5.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s5.end - scenes.s5.start}
        />
      </SceneWrapper>

      {/* Scene 6: Full spreadsheet */}
      <SceneWrapper start={scenes.s6.start} end={scenes.s6.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-spreadsheet-full.png"
          frame={frame - scenes.s6.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s6.end - scenes.s6.start}
        />
      </SceneWrapper>

      {/* Scene 7: Collaborative spreadsheet */}
      <SceneWrapper start={scenes.s7.start} end={scenes.s7.end} fps={fps}>
        <ScreenshotScene
          src="rebyte-spreadsheet-collab.png"
          frame={frame - scenes.s7.start}
          fps={fps}
          sceneStart={0}
          sceneEnd={scenes.s7.end - scenes.s7.start}
          isLastScene
        />
      </SceneWrapper>

      {/* Tagline */}
      <Tagline frame={frame} fps={fps} durationInFrames={durationInFrames} />

      {/* Progress indicator */}
      <ProgressBar frame={frame} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
};

// ============ SOUND EFFECTS ============
const SoundEffects = ({ fps, scenes }: { fps: number; scenes: Record<string, { start: number; end: number }> }) => (
  <>
    {/* Entrance whoosh */}
    <Sequence from={0} durationInFrames={fps * 2}>
      <Audio src={WHOOSH_URL} volume={0.2} />
    </Sequence>
    {/* Clicks for each scene transition */}
    {[fps * 2.3, scenes.s2.start + fps * 2, scenes.s3.start + fps * 2].map((time, i) => (
      <Sequence key={i} from={Math.round(time)} durationInFrames={fps}>
        <Audio src={CLICK_URL} volume={0.25} />
      </Sequence>
    ))}
    {/* Transition whooshes */}
    {[scenes.s4.start, scenes.s5.start, scenes.s6.start, scenes.s7.start].map((time, i) => (
      <Sequence key={`w${i}`} from={Math.round(time)} durationInFrames={fps}>
        <Audio src={WHOOSH_URL} volume={0.15} />
      </Sequence>
    ))}
  </>
);

// ============ SCENE WRAPPER ============
const SceneWrapper = ({
  start,
  end,
  fps,
  children,
}: {
  start: number;
  end: number;
  fps: number;
  children: React.ReactNode;
}) => (
  <Sequence from={Math.round(start)} durationInFrames={Math.round(end - start + fps * 0.5)}>
    {children}
  </Sequence>
);

// ============ SCREENSHOT SCENE ============
const ScreenshotScene = ({
  src,
  frame,
  fps,
  sceneStart,
  sceneEnd,
  cursor,
  highlight,
  streamingEffect,
  isLastScene,
}: {
  src: string;
  frame: number;
  fps: number;
  sceneStart: number;
  sceneEnd: number;
  cursor?: { startX: number; startY: number; endX: number; endY: number; clickAt: number };
  highlight?: { top: string; left: string; width: string; height: string };
  streamingEffect?: boolean;
  isLastScene?: boolean;
}) => {
  const localFrame = frame;
  const duration = sceneEnd - sceneStart;

  // Entrance animation
  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Exit animation (not for last scene)
  const exitStart = duration - fps * 0.4;
  const exitProgress = isLastScene
    ? 0
    : interpolate(localFrame, [exitStart, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const scale = interpolate(entrance, [0, 1], [0.94, 1]) * interpolate(exitProgress, [0, 1], [1, 0.97]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]) * interpolate(exitProgress, [0, 0.7, 1], [1, 1, 0]);
  const y = interpolate(entrance, [0, 1], [20, 0]);

  // Cursor animation
  let cursorX = 0, cursorY = 0, isClicking = false, showCursor = false;
  if (cursor) {
    const cursorProgress = interpolate(localFrame, [fps * 0.5, fps * 1.2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
    cursorX = interpolate(cursorProgress, [0, 1], [cursor.startX, cursor.endX]);
    cursorY = interpolate(cursorProgress, [0, 1], [cursor.startY, cursor.endY]);
    isClicking = localFrame >= cursor.clickAt && localFrame < cursor.clickAt + 8;
    showCursor = localFrame > fps * 0.5;
  }

  // Highlight glow
  const highlightGlow = highlight
    ? interpolate(localFrame, [fps * 1.2, fps * 1.5, cursor?.clickAt || fps * 2, (cursor?.clickAt || fps * 2) + 5], [0, 0.7, 0.7, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Streaming shimmer effect
  const shimmerX = streamingEffect ? (localFrame * 4) % 150 - 25 : 0;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale}) translateY(${y}px)`,
          width: "94%",
          maxWidth: 1200,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />

        {/* Highlight overlay */}
        {highlight && (
          <div
            style={{
              position: "absolute",
              top: highlight.top,
              left: highlight.left,
              width: highlight.width,
              height: highlight.height,
              borderRadius: 25,
              border: `2px solid rgba(59, 130, 246, ${highlightGlow * 0.9})`,
              boxShadow: `0 0 ${25 * highlightGlow}px rgba(59, 130, 246, ${highlightGlow * 0.5})`,
              backgroundColor: isClicking ? "rgba(59, 130, 246, 0.1)" : "transparent",
              transform: isClicking ? "scale(0.96)" : "scale(1)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Streaming shimmer */}
        {streamingEffect && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent ${shimmerX}%, rgba(255,255,255,0.08) ${shimmerX + 10}%, transparent ${shimmerX + 20}%)`,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Cursor */}
        {showCursor && cursor && (
          <div
            style={{
              position: "absolute",
              left: `${cursorX}%`,
              top: `${cursorY}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                transform: isClicking ? "scale(0.85)" : "scale(1)",
              }}
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
                fill="#fff"
                stroke="#000"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

        {/* Click ripple */}
        {isClicking && cursor && (
          <div
            style={{
              position: "absolute",
              left: `${cursorX}%`,
              top: `${cursorY}%`,
              transform: "translate(-50%, -50%)",
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "2px solid rgba(59, 130, 246, 0.6)",
              opacity: interpolate(localFrame - cursor.clickAt, [0, 10], [1, 0]),
              scale: interpolate(localFrame - cursor.clickAt, [0, 10], [0.5, 1.5]),
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============ BACKGROUND ============
const GradientBackground = ({ frame }: { frame: number }) => {
  const hue = interpolate(frame, [0, 600], [220, 260], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, hsl(${hue}, 30%, 97%) 0%, hsl(${hue + 20}, 25%, 94%) 50%, hsl(${hue + 40}, 30%, 96%) 100%)`,
      }}
    />
  );
};

// ============ TAGLINE ============
const Tagline = ({ frame, fps, durationInFrames }: { frame: number; fps: number; durationInFrames: number }) => {
  const showTime = durationInFrames - fps * 2.5;

  const opacity = interpolate(frame, [showTime, showTime + fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(frame, [showTime, showTime + fps * 0.5], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  if (frame < showTime) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 35,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          background: "rgba(15, 15, 20, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "14px 32px",
          borderRadius: 50,
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <span style={{ fontFamily: "system-ui", fontSize: 20, fontWeight: 600, color: "white" }}>
          Human + AI collaboration
        </span>
        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>→</span>
        <span style={{ fontFamily: "system-ui", fontSize: 20, fontWeight: 700, color: "#60a5fa" }}>
          rebyte.ai
        </span>
      </div>
    </div>
  );
};

// ============ PROGRESS BAR ============
const ProgressBar = ({ frame, durationInFrames }: { frame: number; durationInFrames: number }) => {
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
        }}
      />
    </div>
  );
};
