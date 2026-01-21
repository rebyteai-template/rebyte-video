import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FULL_TEXT = "Remotion makes video creation as easy as writing React code.";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;

const getTypedText = (frame: number, text: string, charFrames: number): string => {
  const typedChars = Math.min(text.length, Math.floor(frame / charFrames));
  return text.slice(0, typedChars);
};

const Cursor = ({ frame, blinkFrames }: { frame: number; blinkFrames: number }) => {
  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <span style={{ opacity, color: "#00d4ff" }}>|</span>;
};

export const TypewriterDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typedText = getTypedText(frame, FULL_TEXT, CHAR_FRAMES);

  // Terminal window animation
  const windowScale = interpolate(frame, [0, 15], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const windowOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: "90%",
          maxWidth: 1000,
          backgroundColor: "#16213e",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          transform: `scale(${windowScale})`,
          opacity: windowOpacity,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            backgroundColor: "#0f3460",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#27ca40",
            }}
          />
          <span
            style={{
              marginLeft: 12,
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            remotion-demo
          </span>
        </div>

        {/* Terminal content */}
        <div
          style={{
            padding: 30,
            minHeight: 200,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              color: "#e94560",
              marginBottom: 16,
            }}
          >
            {">"} <span style={{ color: "#00d4ff" }}>console</span>
            <span style={{ color: "white" }}>.</span>
            <span style={{ color: "#27ca40" }}>log</span>
            <span style={{ color: "white" }}>(</span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 32,
              color: "#ffffff",
              paddingLeft: 40,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "#f8d866" }}>"</span>
            <span style={{ color: "#f8d866" }}>{typedText}</span>
            <Cursor frame={frame} blinkFrames={CURSOR_BLINK_FRAMES} />
            <span style={{ color: "#f8d866" }}>"</span>
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              color: "white",
              marginTop: 16,
            }}
          >
            <span style={{ color: "white" }}>)</span>
            <span style={{ color: "white" }}>;</span>
          </div>
        </div>
      </div>

      {/* Floating code symbols */}
      <FloatingSymbol symbol="{ }" x={100} y={100} delay={20} frame={frame} fps={fps} />
      <FloatingSymbol symbol="< />" x={1100} y={150} delay={40} frame={frame} fps={fps} />
      <FloatingSymbol symbol="( )" x={150} y={550} delay={60} frame={frame} fps={fps} />
      <FloatingSymbol symbol="[ ]" x={1050} y={500} delay={30} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const FloatingSymbol = ({
  symbol,
  x,
  y,
  delay,
  frame,
}: {
  symbol: string;
  x: number;
  y: number;
  delay: number;
  frame: number;
  fps: number;
}) => {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const floatY = interpolate(
    (frame - delay) % 60,
    [0, 30, 60],
    [0, -10, 0]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: "monospace",
        fontSize: 40,
        color: "#00d4ff",
        opacity,
        transform: `translateY(${floatY}px)`,
      }}
    >
      {symbol}
    </div>
  );
};
