import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Series,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";

// Voiceover script with timing (in seconds)
// In a real project, you'd use actual voiceover audio and sync to it
const SCRIPT = [
  { start: 0, end: 3, text: "Meet FlowTask" },
  { start: 3, end: 6, text: "The smarter way to manage projects" },
  { start: 6, end: 10, text: "Drag and drop to organize your workflow" },
  { start: 10, end: 14, text: "Real-time collaboration with your team" },
  { start: 14, end: 18, text: "Track progress with beautiful dashboards" },
  { start: 18, end: 21, text: "Try FlowTask free for 14 days" },
];

// Background music (royalty-free)
const BG_MUSIC_URL = "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3";

export const ProductDemo = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a" }}>
      {/* Background music - low volume under voiceover */}
      <Audio
        src={BG_MUSIC_URL}
        volume={0.15}
      />

      {/* Scene 1: Intro/Hook */}
      <Series>
        <Series.Sequence durationInFrames={3 * fps}>
          <IntroScene />
        </Series.Sequence>

        {/* Scene 2: Tagline */}
        <Series.Sequence durationInFrames={3 * fps}>
          <TaglineScene />
        </Series.Sequence>

        {/* Scene 3: Feature 1 - Drag & Drop */}
        <Series.Sequence durationInFrames={4 * fps}>
          <FeatureScene
            title="Intuitive Drag & Drop"
            description="Organize tasks effortlessly"
            featureType="kanban"
          />
        </Series.Sequence>

        {/* Scene 4: Feature 2 - Collaboration */}
        <Series.Sequence durationInFrames={4 * fps}>
          <FeatureScene
            title="Real-time Collaboration"
            description="Work together seamlessly"
            featureType="collaboration"
          />
        </Series.Sequence>

        {/* Scene 5: Feature 3 - Analytics */}
        <Series.Sequence durationInFrames={4 * fps}>
          <FeatureScene
            title="Powerful Analytics"
            description="Track what matters"
            featureType="analytics"
          />
        </Series.Sequence>

        {/* Scene 6: CTA */}
        <Series.Sequence durationInFrames={3 * fps}>
          <CTAScene />
        </Series.Sequence>
      </Series>

      {/* Captions overlay - synced to voiceover */}
      <CaptionsOverlay script={SCRIPT} />
    </AbsoluteFill>
  );
};

// ============ SCENES ============

const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const glowOpacity = interpolate(frame, [0, fps], [0, 0.8], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 70%)",
      }}
    >
      {/* Animated background particles */}
      <BackgroundParticles frame={frame} />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 28,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 0 ${60 * glowOpacity}px rgba(102, 126, 234, ${glowOpacity})`,
          }}
        >
          <span style={{ fontSize: 60, color: "white" }}>✓</span>
        </div>
        <h1
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            margin: 0,
            letterSpacing: -2,
          }}
        >
          FlowTask
        </h1>
      </div>
    </AbsoluteFill>
  );
};

const TaglineScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["The", "smarter", "way", "to", "manage", "projects"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
      }}
    >
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
        {words.map((word, i) => {
          const delay = i * 4;
          const wordSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15 },
          });

          return (
            <span
              key={i}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: word === "smarter" ? 80 : 64,
                fontWeight: word === "smarter" ? 700 : 400,
                color: word === "smarter" ? "#667eea" : "white",
                opacity: wordSpring,
                transform: `translateY(${interpolate(wordSpring, [0, 1], [30, 0])}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FeatureScene = ({
  title,
  description,
  featureType,
}: {
  title: string;
  description: string;
  featureType: "kanban" | "collaboration" | "analytics";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mockupEntrance = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const textEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
        padding: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      {/* Mock App Screenshot */}
      <div
        style={{
          transform: `scale(${mockupEntrance}) perspective(1000px) rotateY(${interpolate(mockupEntrance, [0, 1], [-15, 5])}deg)`,
          opacity: mockupEntrance,
        }}
      >
        <MockAppUI type={featureType} frame={frame} fps={fps} />
      </div>

      {/* Text */}
      <div
        style={{
          opacity: textEntrance,
          transform: `translateX(${interpolate(textEntrance, [0, 1], [50, 0])}px)`,
          maxWidth: 400,
        }}
      >
        <h2
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            margin: 0,
            marginBottom: 16,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const buttonPulse = 1 + 0.05 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 70%)",
      }}
    >
      <div
        style={{
          transform: `scale(${entrance})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <h2
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Start your free trial
        </h2>
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px 60px",
            borderRadius: 50,
            transform: `scale(${buttonPulse})`,
            boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "white",
            }}
          >
            Try Free for 14 Days →
          </span>
        </div>
        <p
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          No credit card required
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============ MOCK UI COMPONENTS ============

const MockAppUI = ({
  type,
  frame,
  fps,
}: {
  type: "kanban" | "collaboration" | "analytics";
  frame: number;
  fps: number;
}) => {
  return (
    <div
      style={{
        width: 600,
        height: 400,
        backgroundColor: "#1e1e2e",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 36,
          backgroundColor: "#2a2a3e",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27ca40" }} />
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {type === "kanban" && <KanbanMock frame={frame} fps={fps} />}
        {type === "collaboration" && <CollaborationMock frame={frame} fps={fps} />}
        {type === "analytics" && <AnalyticsMock frame={frame} fps={fps} />}
      </div>
    </div>
  );
};

const KanbanMock = ({ frame, fps }: { frame: number; fps: number }) => {
  const dragProgress = interpolate(frame, [fps * 0.5, fps * 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const cardX = interpolate(dragProgress, [0, 1], [0, 200]);
  const cardY = interpolate(dragProgress, [0, 0.5, 1], [0, -20, 50]);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {["To Do", "In Progress", "Done"].map((col, i) => (
        <div
          key={col}
          style={{
            flex: 1,
            backgroundColor: "#2a2a3e",
            borderRadius: 8,
            padding: 12,
            minHeight: 300,
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 12 }}>{col}</div>
          {i === 0 && (
            <div
              style={{
                backgroundColor: "#667eea",
                padding: 12,
                borderRadius: 6,
                color: "white",
                fontSize: 14,
                transform: `translate(${cardX}px, ${cardY}px)`,
                boxShadow: dragProgress > 0 ? "0 10px 30px rgba(0,0,0,0.3)" : "none",
                zIndex: 10,
                position: "relative",
              }}
            >
              Design Review
            </div>
          )}
          {i === 1 && (
            <>
              <TaskCard label="API Integration" color="#4ecdc4" />
              <TaskCard label="User Testing" color="#ff6b6b" />
            </>
          )}
          {i === 2 && <TaskCard label="Homepage" color="#27ca40" />}
        </div>
      ))}
    </div>
  );
};

const TaskCard = ({ label, color }: { label: string; color: string }) => (
  <div
    style={{
      backgroundColor: color,
      padding: 12,
      borderRadius: 6,
      color: "white",
      fontSize: 14,
      marginBottom: 8,
    }}
  >
    {label}
  </div>
);

const CollaborationMock = ({ frame, fps }: { frame: number; fps: number }) => {
  const cursorBlink = Math.sin(frame * 0.3) > 0;
  const typingProgress = interpolate(frame, [0, fps * 2], [0, 1], { extrapolateRight: "clamp" });
  const message = "Great progress on the new feature! 🎉";
  const typedChars = Math.floor(typingProgress * message.length);

  return (
    <div>
      {/* Avatars */}
      <div style={{ display: "flex", gap: -8, marginBottom: 20 }}>
        {["#667eea", "#ff6b6b", "#4ecdc4", "#ffeaa7"].map((color, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: color,
              border: "3px solid #1e1e2e",
              marginLeft: i > 0 ? -12 : 0,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 12,
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
            alignSelf: "center",
          }}
        >
          4 team members online
        </div>
      </div>

      {/* Chat */}
      <div style={{ backgroundColor: "#2a2a3e", borderRadius: 8, padding: 16 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#ff6b6b" }} />
          <div>
            <div style={{ color: "white", fontSize: 14 }}>Sarah</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Updated the design specs</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#667eea" }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontSize: 14 }}>You</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              {message.slice(0, typedChars)}
              {cursorBlink && <span style={{ color: "#667eea" }}>|</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsMock = ({ frame, fps }: { frame: number; fps: number }) => {
  const chartProgress = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const bars = [65, 45, 80, 55, 90, 70, 85];

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Tasks", value: "247", change: "+12%" },
          { label: "Completed", value: "89%", change: "+5%" },
          { label: "On Time", value: "94%", change: "+3%" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              backgroundColor: "#2a2a3e",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{stat.label}</div>
            <div style={{ color: "white", fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
            <div style={{ color: "#27ca40", fontSize: 12 }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          backgroundColor: "#2a2a3e",
          borderRadius: 8,
          padding: 16,
          height: 180,
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        {bars.map((height, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: height * chartProgress * 1.5,
              background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ============ CAPTIONS ============

const CaptionsOverlay = ({
  script,
}: {
  script: Array<{ start: number; end: number; text: string }>;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;
  const currentCaption = script.find(
    (s) => currentTime >= s.start && currentTime < s.end
  );

  if (!currentCaption) return null;

  const captionProgress = interpolate(
    currentTime,
    [currentCaption.start, currentCaption.start + 0.2],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "12px 24px",
          borderRadius: 8,
          opacity: captionProgress,
          transform: `translateY(${interpolate(captionProgress, [0, 1], [10, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 24,
            color: "white",
            fontWeight: 500,
          }}
        >
          {currentCaption.text}
        </span>
      </div>
    </div>
  );
};

// ============ BACKGROUND ============

const BackgroundParticles = ({ frame }: { frame: number }) => {
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <>
      {particles.map((i) => {
        const x = ((i * 97) % 100);
        const y = ((i * 61 + frame * 0.5) % 120) - 10;
        const size = 2 + (i % 3);
        const opacity = 0.1 + (i % 5) * 0.05;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: `rgba(102, 126, 234, ${opacity})`,
            }}
          />
        );
      })}
    </>
  );
};
