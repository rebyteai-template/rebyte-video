import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

export const SpringDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#2d3436",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          fontFamily: "sans-serif",
          fontSize: 48,
          fontWeight: 700,
          color: "white",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Spring Animations
      </div>

      {/* Bouncing boxes */}
      <div
        style={{
          display: "flex",
          gap: 30,
          marginTop: 40,
        }}
      >
        {COLORS.map((color, i) => {
          const boxSpring = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 8, stiffness: 100 },
          });

          const scale = interpolate(boxSpring, [0, 1], [0, 1]);
          const rotation = interpolate(boxSpring, [0, 1], [-180, 0]);

          return (
            <div
              key={i}
              style={{
                width: 100,
                height: 100,
                backgroundColor: color,
                borderRadius: 16,
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                boxShadow: `0 10px 40px ${color}66`,
              }}
            />
          );
        })}
      </div>

      {/* Morphing circle */}
      <div style={{ marginTop: 80 }}>
        <MorphingShape frame={frame} fps={fps} />
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: 600,
          height: 8,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${interpolate(frame, [0, 120], [0, 100], {
              extrapolateRight: "clamp",
            })}%`,
            height: "100%",
            background: "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1)",
            borderRadius: 4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const MorphingShape = ({ frame, fps }: { frame: number; fps: number }) => {
  const progress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const size = interpolate(progress, [0, 1], [80, 150]);
  const borderRadius = interpolate(progress, [0, 1], [50, 20]);
  const rotation = interpolate(progress, [0, 1], [0, 45]);

  const pulseScale =
    1 +
    0.05 *
      Math.sin(
        interpolate(frame, [0, 60], [0, Math.PI * 2], {
          extrapolateRight: "extend",
        })
      );

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        borderRadius: `${borderRadius}%`,
        transform: `rotate(${rotation}deg) scale(${pulseScale})`,
        boxShadow: "0 20px 60px rgba(102, 126, 234, 0.5)",
      }}
    />
  );
};
